import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
});

export const fetchLogs = async () => {
  const response = await api.get("/logs");
  return response.data.logs;
};

export const fetchAnalysis = async () => {
  const response = await api.get("/analyze");
  return response.data.alerts;
};

export const fetchSummary = async () => {
  const response = await api.get("/summary");
  return response.data.summary;
};

export default api;
