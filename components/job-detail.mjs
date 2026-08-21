import { categoryLabels, escapeHtml, matchLabel, percent, statusLabels } from "./formatting.mjs";

function evidenceText(item, profile) {
  if (!item.evidenceIds.length) return "Kein Profilbeleg vorhanden";
  return item.evidenceIds.map((id) => profile.experience.find((entry) => entry.id === id)?.evidence).filter(Boolean).join(" ");
}

function overview(result) {
  return `
    <div class="score-grid">${Object.entries(result.categoryResults).map(([key, value]) => `
      <div class="metric"><span>${categoryLabels[key]}</span><strong>${percent(value.score)}</strong><i><b style="width:${value.score}%"></b></i><small>Gewichtung ${value.weight} %</small></div>
    `).join("")}</div>
    <div class="two-column-copy">
      <section><h4>Stärken</h4><ul>${result.strengths.slice(0, 5).map((item) => `<li>${escapeHtml(item.label)}</li>`).join("")}</ul></section>
      <section><h4>Lücken</h4><ul>${result.gaps.length ? result.gaps.slice(0, 5).map((item) => `<li>${escapeHtml(item.label)}</li>`).join("") : "<li>Keine wesentlichen Lücken im Demo-Fall</li>"}</ul></section>
    </div>
  `;
}

function requirements(result, profile) {
  const items = result.assessments.filter((item) => item.mustHave || ["FULFILLED", "PARTIALLY_FULFILLED", "NOT_FULFILLED", "UNKNOWN"].includes(item.status));
  return `<div class="requirement-list">${items.map((item) => `
    <article class="requirement-item status-${item.status.toLowerCase()}">
      <div><span class="status-chip">${statusLabels[item.status]}</span>${item.mustHave ? '<span class="must-chip">Muss-Anforderung</span>' : ""}</div>
      <h4>${escapeHtml(item.label)}</h4>
      <p>${escapeHtml(item.reason)}</p>
      <details><summary>Profilbeleg</summary><p>${escapeHtml(evidenceText(item, profile))}</p></details>
    </article>
  `).join("")}</div>`;
}

function atsAndInterview(job, profile, result) {
  const searchable = [...profile.atsKeywords, ...profile.skills.map((item) => item.name), ...profile.tools].join(" ").toLowerCase();
  const matched = job.atsKeywords.filter((keyword) => searchable.includes(keyword.toLowerCase()));
  const missing = job.atsKeywords.filter((keyword) => !matched.includes(keyword));
  const interview = result.assessments
    .filter((item) => item.status !== "FULFILLED")
    .slice(0, 4)
    .map((item) => item.status === "UNKNOWN"
      ? `Im Gespräch klären: ${item.label}. Keine unbelegte Erfahrung behaupten.`
      : `${item.label}: ${item.reason}`);
  return `
    <div class="ats-grid">
      <section><h4>Vorhandene ATS-Keywords</h4><div class="pill-row">${matched.map((item) => `<span class="pill positive">${escapeHtml(item)}</span>`).join("") || "<p>Keine eindeutigen Treffer</p>"}</div></section>
      <section><h4>Fehlende ATS-Keywords</h4><div class="pill-row">${missing.map((item) => `<span class="pill negative">${escapeHtml(item)}</span>`).join("") || "<p>Keine fehlenden Keywords</p>"}</div></section>
    </div>
    <section class="interview"><h4>Interviewvorbereitung</h4><ol>${interview.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol></section>
  `;
}

export function renderJobDetail(job, result, profile, activeTab = "overview") {
  const tabs = [
    ["overview", "Übersicht"],
    ["requirements", "Anforderungen"],
    ["ats", "ATS & Interview"],
  ];
  const content = activeTab === "requirements" ? requirements(result, profile) : activeTab === "ats" ? atsAndInterview(job, profile, result) : overview(result);
  return `
    <article class="detail-panel">
      <header class="detail-head">
        <div><p class="eyebrow">AUSGEWÄHLTE ANALYSE</p><h2>${escapeHtml(job.title)}</h2><p>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</p></div>
        <div class="hero-score"><strong>${percent(result.totalScore)}</strong><span>${matchLabel(result.totalScore)}</span></div>
      </header>
      <div class="confidence-explainer"><span><strong>Datenqualität / Confidence ${percent(result.confidence)}</strong> · Verlässlichkeit der Datengrundlage, nicht fachliche Passung</span>${result.mandatoryCap < 100 ? `<small>Maximal erreichbarer Match durch fehlende Muss-Anforderungen: ${result.mandatoryCap} %</small>` : ""}</div>
      <nav class="tabs" aria-label="Analysedetails">${tabs.map(([id, label]) => `<button data-tab="${id}" class="${activeTab === id ? "active" : ""}" aria-selected="${activeTab === id}">${label}</button>`).join("")}</nav>
      <div class="tab-content">${content}</div>
    </article>
  `;
}
