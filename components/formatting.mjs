export const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export const percent = (value) => `${Math.round(value)} %`;

export function matchLabel(score) {
  if (score >= 88) return "Sehr hohe Passung";
  if (score >= 72) return "Gute Passung";
  if (score >= 45) return "Teilweise Passung";
  return "Geringe Passung";
}

export const statusLabels = Object.freeze({
  FULFILLED: "Erfüllt",
  PARTIALLY_FULFILLED: "Teilweise erfüllt",
  NOT_FULFILLED: "Nicht erfüllt",
  UNKNOWN: "Nicht bewertbar",
});

export const categoryLabels = Object.freeze({
  roleFit: "Rollen-Fit",
  skills: "Skills",
  experience: "Berufserfahrung",
  tools: "Tools",
  requirements: "Anforderungen",
  workModel: "Arbeitsmodell",
});
