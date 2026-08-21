import { escapeHtml } from "./formatting.mjs";

const pills = (values, className = "pill") => values.map((value) => `<span class="${className}">${escapeHtml(typeof value === "string" ? value : value.name)}</span>`).join("");

export function renderProfile(profile) {
  return `
    <section class="profile-panel" aria-labelledby="profile-title">
      <div class="profile-identity">
        <span class="avatar" aria-hidden="true">AB</span>
        <div><p class="eyebrow">FIKTIVES HAUPTPROFIL</p><h2 id="profile-title">${escapeHtml(profile.name)}</h2><p>${escapeHtml(profile.headline)}</p></div>
      </div>
      <div class="profile-grid">
        <div><h3>Zielrollen</h3><div class="pill-row">${pills(profile.targetRoles)}</div></div>
        <div><h3>Wichtigste Skills</h3><div class="pill-row">${pills(profile.skills.slice(0, 6))}</div></div>
        <div><h3>Tools</h3><p>${profile.tools.map(escapeHtml).join(" · ")}</p></div>
        <div><h3>Berufserfahrung</h3><p>${escapeHtml(profile.experience[0].period)} Projektkoordination plus Prozess- und Hochschulprojekte</p></div>
      </div>
      <details class="boundaries">
        <summary>Kompetenzgrenzen transparent anzeigen</summary>
        <ul>${profile.knownGaps.map((gap) => `<li>${escapeHtml(gap)}</li>`).join("")}</ul>
      </details>
    </section>
  `;
}
