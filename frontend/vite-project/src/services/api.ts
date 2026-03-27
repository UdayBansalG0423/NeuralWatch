import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getOverview = () => API.get("/analytics/overview");
export const getReliability = () => API.get("/analytics/reliability");
export const getLatencyTrend = () => API.get("/analytics/latency-trend");
export const getCostTrend = () => API.get("/analytics/cost-trend");
