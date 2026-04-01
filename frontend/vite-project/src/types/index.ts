export interface OverviewData {
  total_requests: number;
  success_rate: string | number;
  avg_latency: string | number;
  total_cost: string | number;
}

export interface ReliabilityData {
  reliability_score: string | number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface MetricData {
  value: number;
  name?: string;
  date?: string;
}

export interface ModelMetrics {
  id: string;
  name: string;
  provider: string;
  latency: number;
  cost_per_1k: number;
  success_rate: number;
  avg_tokens: number;
  last_used: string;
  status: 'active' | 'inactive' | 'error';
}

export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  model?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  last_used: string;
  status: 'active' | 'inactive';
}

export interface TimeRange {
  label: string;
  value: string;
}