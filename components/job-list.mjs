import { escapeHtml, matchLabel, percent } from "./formatting.mjs";

export function renderJobList(jobs, calculations, selectedJobId) {
  return `<div class="job-list">${jobs.map((job) => {
    const result = calculations[job.id];
    const selected = job.id === selectedJobId;
    return `
      <button class="job-card ${selected ? "selected" : ""}" data-job-id="${escapeHtml(job.id)}" aria-pressed="${selected}">
        <span class="job-card-top"><span class="match-label">${matchLabel(result.totalScore)}</span><span class="score ${result.totalScore < 45 ? "low" : ""}">${percent(result.totalScore)}</span></span>
        <strong>${escapeHtml(job.title)}</strong>
        <span>${escapeHtml(job.company)}</span>
        <span class="confidence"><i style="--confidence:${result.confidence}%"></i>Datenqualität / Confidence ${percent(result.confidence)}</span>
        <small>Analyse öffnen <span aria-hidden="true">→</span></small>
      </button>
    `;
  }).join("")}</div>`;
}
