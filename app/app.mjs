import { calculateMatch } from "../lib/matching/demo-matcher.mjs";
import { renderProfile } from "../components/profile-view.mjs";
import { renderJobList } from "../components/job-list.mjs";
import { renderJobDetail } from "../components/job-detail.mjs";

const dataPaths = {
  profile: "../lib/demo-data/candidate-profile.json",
  jobs: "../lib/demo-data/jobs.json",
  assessments: "../lib/demo-data/criterion-assessments.json",
};

async function loadJson(path) {
  const response = await fetch(new URL(path, import.meta.url));
  if (!response.ok) throw new Error(`Demo-Daten konnten nicht geladen werden: ${path}`);
  return response.json();
}

async function start() {
  const [profile, jobs, criterionSets] = await Promise.all([
    loadJson(dataPaths.profile),
    loadJson(dataPaths.jobs),
    loadJson(dataPaths.assessments),
  ]);
  const calculations = Object.fromEntries(
    criterionSets.map((criteria) => [criteria.jobId, calculateMatch(criteria)]),
  );
  let selectedJobId = jobs[0].id;
  let activeTab = "overview";

  const root = document.querySelector("#app");

  function render() {
    const selectedJob = jobs.find((job) => job.id === selectedJobId);
    root.innerHTML = `
      <header class="site-header">
        <a class="brand" href="#top" aria-label="Jobkompass Startseite">
          <span class="brand-mark">JK</span>
          <span><strong>Jobkompass</strong><small>Nachvollziehbare Matching-Demo</small></span>
        </a>
        <span class="demo-badge">Fiktive Portfolio-Demo</span>
      </header>

      <main id="top">
        <section class="hero" aria-labelledby="hero-title">
          <div>
            <p class="eyebrow">VON DER STELLENANZEIGE ZUR BEGRÜNDETEN ENTSCHEIDUNG</p>
            <h1 id="hero-title">Job-Matching, das seine Bewertung erklärt.</h1>
            <p class="hero-copy">Der Jobkompass vergleicht Kandidatenprofil und Stellenanforderungen, zeigt belastbare Belege und macht Kompetenzlücken sichtbar.</p>
          </div>
          <aside class="explain-card" aria-label="Erklärung der Kennzahlen">
            <p><strong>Matching Score</strong> zeigt die fachliche Passung.</p>
            <p><strong>Datenqualität / Confidence</strong> zeigt, wie vollständig und belastbar die Datengrundlage ist.</p>
          </aside>
        </section>

        <section class="project-contribution" aria-labelledby="contribution-title">
          <div><p class="eyebrow">PROJEKTBEITRAG</p><h2 id="contribution-title">Fachliche Konzeption trifft AI-assisted Development.</h2></div>
          <p>Konzeption, Anforderungsdefinition, Matching-Logik und iterative Produktentwicklung. Technische Umsetzung im Rahmen von AI-assisted Development mit OpenAI Codex.</p>
          <span>Relevant für Business Analysis · IT-Projektmanagement · Digitalisierung · Requirements Engineering · Product Ownership</span>
        </section>

        ${renderProfile(profile)}

        <section class="workspace" id="jobs" aria-labelledby="jobs-title">
          <div class="job-column">
            <div class="section-heading">
              <div><p class="eyebrow">VIER BEWUSST UNTERSCHIEDLICHE FÄLLE</p><h2 id="jobs-title">Demo-Matches</h2></div>
              <p>Scores werden live aus den Kriterien berechnet.</p>
            </div>
            ${renderJobList(jobs, calculations, selectedJobId)}
          </div>
          <div class="detail-column" aria-live="polite">
            ${renderJobDetail(selectedJob, calculations[selectedJobId], profile, activeTab)}
          </div>
        </section>

        <section class="unknown-note" aria-labelledby="unknown-title">
          <span>?</span><div><h2 id="unknown-title">Was bedeutet „nicht bewertbar“?</h2><p>Intern wird dieser Zustand als <strong>UNKNOWN</strong> geführt. Er bedeutet nicht „teilweise erfüllt“: Die Information reicht für eine belastbare Bewertung nicht aus. Dadurch sinkt insbesondere die Datenqualität / Confidence.</p></div>
        </section>
      </main>

      <footer>
        <p>Fiktive Portfolio-Demo: keine echten Personen, Arbeitgeber, Bewerbungen oder persönlichen Daten.</p>
        <p>Konzipiert und iterativ entwickelt im Rahmen von AI-assisted Development mit OpenAI Codex.</p>
      </footer>
    `;

    root.querySelectorAll("[data-job-id]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedJobId = button.dataset.jobId;
        activeTab = "overview";
        render();
        root.querySelector(".detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    root.querySelectorAll("[data-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.tab;
        render();
      });
    });
  }

  render();
}

start().catch((error) => {
  document.querySelector("#app").innerHTML = `<main class="error-state"><h1>Demo konnte nicht geladen werden</h1><p>${error.message}</p><p>Bitte die Demo über einen lokalen Webserver starten.</p></main>`;
});
