import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { calculateMatch, CATEGORY_WEIGHTS } from "../lib/matching/demo-matcher.mjs";

const assessments = JSON.parse(
  await readFile(new URL("../lib/demo-data/criterion-assessments.json", import.meta.url), "utf8"),
);

const byJob = Object.fromEntries(assessments.map((entry) => [entry.jobId, calculateMatch(entry)]));

test("category weights add up to 100 percent", () => {
  const total = Object.values(CATEGORY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  assert.ok(Math.abs(total - 1) < Number.EPSILON);
});

test("the four demo scores stay in their intended ranges", () => {
  assert.ok(byJob["demo-job-1"].totalScore >= 90 && byJob["demo-job-1"].totalScore <= 94);
  assert.ok(byJob["demo-job-2"].totalScore >= 75 && byJob["demo-job-2"].totalScore <= 81);
  assert.ok(byJob["demo-job-3"].totalScore >= 58 && byJob["demo-job-3"].totalScore <= 64);
  assert.ok(byJob["demo-job-4"].totalScore >= 21 && byJob["demo-job-4"].totalScore <= 27);
});

test("scores are clearly ranked and mismatches are not made positive", () => {
  const scores = ["demo-job-1", "demo-job-2", "demo-job-3", "demo-job-4"].map((id) => byJob[id].totalScore);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  assert.ok(byJob["demo-job-4"].totalScore < 30);
});

test("unknown information is neutral for fit but lowers confidence", () => {
  const result = byJob["demo-job-3"];
  assert.ok(result.unknowns.length > 0);
  assert.ok(result.confidence < byJob["demo-job-1"].confidence);
});

test("failed must-have requirements cap otherwise possible scores", () => {
  assert.equal(byJob["demo-job-3"].mandatoryCap, 68);
  assert.equal(byJob["demo-job-4"].mandatoryCap, 35);
  assert.equal(byJob["demo-job-1"].mandatoryCap, 100);
});

test("fulfilled and partially fulfilled claims require evidence", () => {
  const broken = structuredClone(assessments[0]);
  broken.categories.skills[0].evidenceIds = [];
  assert.throws(() => calculateMatch(broken), /Profilbeleg fehlt/);
});

test("every assessment has an explanation", () => {
  for (const result of Object.values(byJob)) {
    assert.ok(result.assessments.every((item) => item.reason.trim().length > 0));
  }
});

test("print deterministic demo results", (context) => {
  for (const id of ["demo-job-1", "demo-job-2", "demo-job-3", "demo-job-4"]) {
    context.diagnostic(`${id}: ${byJob[id].totalScore}% match, ${byJob[id].confidence}% confidence, cap ${byJob[id].mandatoryCap}`);
  }
});
