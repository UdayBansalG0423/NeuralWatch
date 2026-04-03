import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("nw_api_key") || import.meta.env.VITE_API_KEY;
  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  }
  return config;
});

export const getOverview = () => API.get("/log/overview");
export const getReliability = () => API.get("/log/reliability");
export const getLatencyTrend = () => API.get("/log/latency-trend");
export const getCostTrend = () => API.get("/log/cost-trend");
export const getQuickStats = () => API.get("/log/quick-stats");
export const getTopModels = () => API.get("/log/top-models");
export const getRecentActivity = () => API.get("/log/recent-activity");
