import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000",
});

const DEV_API_KEY = import.meta.env.VITE_API_KEY || "";

API.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("nw_api_key") || import.meta.env.VITE_API_KEY;
  if (apiKey) {
    config.headers["X-API-KEY"] = apiKey;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 422) && localStorage.getItem("nw_api_key")) {
      localStorage.removeItem("nw_api_key");
      if (DEV_API_KEY) {
        error.config.headers["X-API-KEY"] = DEV_API_KEY;
        return API.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export const getOverview = () => API.get("/log/overview");
export const getReliability = () => API.get("/log/reliability");
export const getLatencyTrend = () => API.get("/log/latency-trend");
export const getCostTrend = () => API.get("/log/cost-trend");
export const getQuickStats = () => API.get("/log/quick-stats");
export const getTopModels = () => API.get("/log/top-models");
export const getRecentActivity = () => API.get("/log/recent-activity");
export const getModels = () => API.get("/log/models");
export const getApiKeys = () => API.get("/log/api-keys");
export const getAlerts = () => API.get("/log/alerts");
export const getSettings = () => API.get("/log/settings");
export const getAnalytics = () => API.get("/log/analytics");
