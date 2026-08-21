export const STATUS_FACTORS = Object.freeze({
  FULFILLED: 1,
  PARTIALLY_FULFILLED: 0.6,
  NOT_FULFILLED: 0,
  UNKNOWN: 0.5,
});

export const CATEGORY_WEIGHTS = Object.freeze({
  roleFit: 0.20,
  skills: 0.15,
  experience: 0.15,
  tools: 0.10,
  requirements: 0.30,
  workModel: 0.10,
});

const round = (value) => Math.round(value * 10) / 10;

function assertAssessment(assessment) {
  if (!(assessment.status in STATUS_FACTORS)) {
    throw new Error(`Unbekannter Status: ${assessment.status}`);
  }
  if (!assessment.reason?.trim()) {
    throw new Error(`Begründung fehlt: ${assessment.label}`);
  }
  if (
    ["FULFILLED", "PARTIALLY_FULFILLED"].includes(assessment.status)
    && assessment.evidenceIds.length === 0
    && assessment.label !== "Hybrides Arbeitsmodell"
    && assessment.label !== "Vor-Ort-Arbeit"
  ) {
    throw new Error(`Profilbeleg fehlt: ${assessment.label}`);
  }
}

function categoryScore(assessments) {
  if (!assessments.length) return { score: 50, confidence: 0 };
  assessments.forEach(assertAssessment);
  const score = assessments.reduce((sum, item) => sum + STATUS_FACTORS[item.status], 0) / assessments.length * 100;
  const confidence = assessments.reduce((sum, item) => {
    const unknownLimit = item.status === "UNKNOWN" ? Math.min(item.dataQuality, 0.35) : item.dataQuality;
    return sum + unknownLimit;
  }, 0) / assessments.length * 100;
  return { score: round(score), confidence: round(confidence) };
}

function mandatoryCap(allAssessments) {
  const mustHaves = allAssessments.filter((item) => item.mustHave);
  const failed = mustHaves.filter((item) => item.status === "NOT_FULFILLED").length;
  const unknown = mustHaves.filter((item) => item.status === "UNKNOWN").length;
  const partial = mustHaves.filter((item) => item.status === "PARTIALLY_FULFILLED").length;

  if (failed >= 3) return 35;
  if (failed === 2) return 68;
  if (failed === 1) return 75;
  if (unknown > 0) return 75;
  if (partial > 0) return 85;
  return 100;
}

export function calculateMatch(criterionSet) {
  const categoryResults = {};
  const allAssessments = [];

  for (const [category, weight] of Object.entries(CATEGORY_WEIGHTS)) {
    const assessments = criterionSet.categories[category] ?? [];
    const result = categoryScore(assessments);
    categoryResults[category] = { ...result, weight: weight * 100 };
    allAssessments.push(...assessments);
  }

  const weightedScore = Object.entries(CATEGORY_WEIGHTS).reduce(
    (sum, [category, weight]) => sum + categoryResults[category].score * weight,
    0,
  );
  const cap = mandatoryCap(allAssessments);
  const totalScore = round(Math.min(weightedScore, cap));
  const confidence = round(
    Object.entries(CATEGORY_WEIGHTS).reduce(
      (sum, [category, weight]) => sum + categoryResults[category].confidence * weight,
      0,
    ),
  );

  return {
    jobId: criterionSet.jobId,
    totalScore,
    confidence,
    mandatoryCap: cap,
    categoryResults,
    assessments: allAssessments,
    strengths: allAssessments.filter((item) => item.status === "FULFILLED"),
    gaps: allAssessments.filter((item) => item.status === "NOT_FULFILLED"),
    unknowns: allAssessments.filter((item) => item.status === "UNKNOWN"),
  };
}
