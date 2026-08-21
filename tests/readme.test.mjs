import assert from "node:assert/strict";
import test from "node:test";
import { readFile, stat } from "node:fs/promises";

const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");

test("README answers the central recruiter questions", () => {
  for (const heading of [
    "Problemstellung",
    "Lösung",
    "Kernfunktionen",
    "Matching-Logik",
    "Matching Score vs. Datenqualität / Confidence",
    "Mein Projektbeitrag",
    "AI-assisted Development",
    "Technologien",
    "Datenschutz",
    "Lokal starten",
    "Tests",
  ]) {
    assert.match(readme, new RegExp(`## ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
});

test("README is transparent about fictional data and Codex", () => {
  assert.match(readme, /vollständig fiktiv/i);
  assert.match(readme, /OpenAI Codex/);
  assert.match(readme, /nicht, dass der gesamte Code manuell von mir\s+programmiert wurde/i);
});

test("README contains four active and existing screenshots", async () => {
  const images = [...readme.matchAll(/!\[[^\]]+\]\((public\/screenshots\/[^)]+\.png)\)/g)].map((match) => match[1]);
  assert.equal(images.length, 4);
  for (const image of images) {
    const info = await stat(new URL(`../${image}`, import.meta.url));
    assert.ok(info.size > 0);
  }
});
