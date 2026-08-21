import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { calculateMatch } from "../lib/matching/demo-matcher.mjs";
import { renderJobList } from "../components/job-list.mjs";
import { renderJobDetail } from "../components/job-detail.mjs";

const load = async (path) => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const [profile, jobs, criteria] = await Promise.all([
  load("../lib/demo-data/candidate-profile.json"),
  load("../lib/demo-data/jobs.json"),
  load("../lib/demo-data/criterion-assessments.json"),
]);
const results = Object.fromEntries(criteria.map((entry) => [entry.jobId, calculateMatch(entry)]));

test("all four fictional jobs are rendered with calculated scores", () => {
  const html = renderJobList(jobs, results, jobs[0].id);
  assert.equal((html.match(/data-job-id=/g) ?? []).length, 4);
  for (const job of jobs) {
    assert.match(html, new RegExp(job.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(html, new RegExp(`${Math.round(results[job.id].totalScore)} %`));
  }
});

test("job detail contains score, confidence and separate tabs", () => {
  const html = renderJobDetail(jobs[0], results[jobs[0].id], profile, "overview");
  assert.match(html, /92 %/);
  assert.match(html, /Datenqualität \/ Confidence 96 %/);
  assert.match(html, /Übersicht/);
  assert.match(html, /Anforderungen/);
  assert.match(html, /ATS & Interview/);
});

test("requirements show statuses, must-have markers and profile evidence", () => {
  const html = renderJobDetail(jobs[2], results[jobs[2].id], profile, "requirements");
  assert.match(html, /Erfüllt/);
  assert.match(html, /Teilweise erfüllt/);
  assert.match(html, /Nicht erfüllt/);
  assert.match(html, /Nicht bewertbar/);
  assert.match(html, /Muss-Anforderung/);
  assert.match(html, /Profilbeleg/);
});

test("unknown explanation and confidence wording exist in the page shell", async () => {
  const app = await readFile(new URL("../app/app.mjs", import.meta.url), "utf8");
  assert.match(app, /Intern wird dieser Zustand als/);
  assert.match(app, /Er bedeutet nicht „teilweise erfüllt“/);
  const detail = renderJobDetail(jobs[2], results[jobs[2].id], profile, "overview");
  assert.match(detail, /Verlässlichkeit der Datengrundlage, nicht fachliche Passung/);
});

test("portfolio contribution is transparent about AI-assisted development", async () => {
  const app = await readFile(new URL("../app/app.mjs", import.meta.url), "utf8");
  assert.match(app, /Konzeption, Anforderungsdefinition, Matching-Logik und iterative Produktentwicklung/);
  assert.match(app, /AI-assisted Development mit OpenAI Codex/);
  assert.doesNotMatch(app, /vollständig selbst programmiert/i);
});

test("only fictional data without external job URLs is rendered", () => {
  assert.ok(profile.isFictional);
  assert.ok(jobs.every((job) => job.isFictional && job.url === null && job.company.includes("fiktiv")));
  const combined = JSON.stringify({ profile, jobs }).toLowerCase();
  for (const forbidden of ["private profile", "private resume", "private-job-url", "personal-user-id"]) {
    assert.equal(combined.includes(forbidden), false);
  }
});
