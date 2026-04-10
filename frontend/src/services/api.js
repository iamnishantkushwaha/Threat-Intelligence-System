import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
});

function toSentenceCase(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value).replace(/_/g, " ").trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function normalizeAiPrediction(payload = {}) {
  const indicators = Array.isArray(payload.indicators) ? payload.indicators : [];
  const recommendations = Array.isArray(payload.recommendations)
    ? payload.recommendations
    : [];

  const prediction =
    payload.prediction ??
    (indicators[0] ? toSentenceCase(indicators[0]) : "Normal activity");
  const insightParts = [];

  if (indicators.length) {
    insightParts.push(`Signals detected: ${indicators.join(", ")}.`);
  }

  if (recommendations.length) {
    insightParts.push(`Recommended action: ${recommendations[0]}`);
  }

  return {
    risk_score: payload.risk_score ?? 0,
    threat_level: payload.threat_level ?? payload.predicted_level ?? "Unknown",
    prediction,
    message:
      payload.message ??
      (insightParts.join(" ") || "No additional AI insight is available right now."),
  };
}

export const fetchLogs = async () => {
  const response = await api.get("/logs");
  return response.data.logs;
};

export const fetchAnalysis = async () => {
  const response = await api.get("/analyze");
  return {
    alerts: response.data.alerts ?? [],
    summary: response.data.summary ?? null,
    aiPrediction: normalizeAiPrediction(
      response.data.ai_prediction ?? response.data.prediction,
    ),
  };
};

export const fetchSummary = async () => {
  const response = await api.get("/summary");
  return response.data;
};

export default api;
