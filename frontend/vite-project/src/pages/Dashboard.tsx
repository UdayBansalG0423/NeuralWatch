import { useEffect, useState } from "react";
import {
  MessageSquare,
  Clock,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import {
  getOverview,
  getReliability,
  getLatencyTrend,
  getCostTrend,
  getQuickStats,
  getTopModels,
  getRecentActivity,
} from "../services/api";
import type {
  ActivityItem,
  OverviewData,
  QuickStatsData,
  ReliabilityData,
  TopModel,
  TrendPoint,
} from "../types";
import Chart from "../components/Chart";

const defaultOverview: OverviewData = {
  total_requests: 0,
  success_rate: 0,
  avg_latency: 0,
  total_cost: 0,
};

const defaultReliability: ReliabilityData = {
  reliability_score: 0,
};

const defaultQuickStats: QuickStatsData = {
  active_models: 0,
  avg_response_time: 0,
  tokens_per_min: 0,
  uptime: 0,
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  delay?: number;
}

function MetricCard({ title, value, change, changeType = "neutral", icon, delay = 0 }: MetricCardProps) {
  const changeColors = {
    positive: "text-success-500",
    negative: "text-danger-500",
    neutral: "text-surface-400",
  };

  const changeIcons = {
    positive: <TrendingUp className="w-3 h-3" />,
    negative: <TrendingDown className="w-3 h-3" />,
    neutral: null,
  };

  return (
    <div
      className="card card-hover opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-surface-400">{title}</span>
        <div className="w-10 h-10 bg-surface-700 rounded-lg flex items-center justify-center text-surface-400">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-1 text-sm ${changeColors[changeType]}`}>
              {changeIcons[changeType]}
              <span>{change}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReliabilityGauge({ score }: { score: number }) {
  const percentage = Number(score) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const getHealthStatus = (currentScore: number) => {
    if (currentScore >= 0.95) return { label: "Healthy", color: "text-success-500" };
    if (currentScore >= 0.8) return { label: "Degraded", color: "text-warning-500" };
    return { label: "Critical", color: "text-danger-500" };
  };

  const status = getHealthStatus(Number(score));

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-6">System Health</h3>
      <div className="relative w-40 h-40 mx-auto mb-4">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#healthGradient)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{percentage.toFixed(1)}%</span>
          <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
        </div>
      </div>
      <p className="text-xs text-center text-surface-500">Based on latency, error rate, and cost efficiency</p>
    </div>
  );
}

function QuickStats({ stats }: { stats: QuickStatsData }) {
  const cards = [
    { label: "Active Models", value: `${stats.active_models}`, icon: <Zap className="w-4 h-4" /> },
    { label: "Avg Response Time", value: `${stats.avg_response_time.toFixed(0)}ms`, icon: <Clock className="w-4 h-4" /> },
    { label: "Tokens/min", value: `${stats.tokens_per_min.toFixed(1)}`, icon: <Activity className="w-4 h-4" /> },
    { label: "Uptime", value: `${stats.uptime.toFixed(1)}%`, icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((stat, index) => (
        <div
          key={stat.label}
          className="bg-surface-800/50 rounded-lg p-4 border border-surface-700/50 opacity-0 animate-slide-up"
          style={{ animationDelay: `${600 + index * 100}ms`, animationFillMode: "forwards" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-primary-400">{stat.icon}</span>
            <span className="text-xs text-surface-500">{stat.label}</span>
          </div>
          <p className="text-lg font-semibold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

function formatRelativeTime(isoTime: string | null) {
  if (!isoTime) return "unknown";
  const ms = Date.now() - new Date(isoTime).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour ago`;
  const days = Math.floor(hours / 24);
  return `${days} day ago`;
}

function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  const typeConfig = {
    success: { icon: CheckCircle2, color: "text-success-500", bg: "bg-success-500/10" },
    warning: { icon: AlertTriangle, color: "text-warning-500", bg: "bg-warning-500/10" },
    error: { icon: XCircle, color: "text-danger-500", bg: "bg-danger-500/10" },
  };

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.length === 0 && <p className="text-sm text-surface-500">No recent activity yet.</p>}
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type];
          const Icon = config.icon;
          return (
            <div key={`${activity.message}-${index}`} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
              <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-surface-500">{formatRelativeTime(activity.time)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [reliability, setReliability] = useState<ReliabilityData | null>(null);
  const [latencyData, setLatencyData] = useState<TrendPoint[]>([]);
  const [costData, setCostData] = useState<TrendPoint[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStatsData>(defaultQuickStats);
  const [topModels, setTopModels] = useState<TopModel[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Unable to connect to backend API");
  const [apiKey, setApiKey] = useState(() => 
    localStorage.getItem("nw_api_key") || import.meta.env.VITE_API_KEY || ""
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

  const loadDashboardData = () => {
    setLoading(true);
    setError(false);
    setErrorMessage("Unable to connect to backend API");

    return Promise.all([
      getOverview().then((res) => setOverview(res.data)).catch((error) => {
        setError(true);
        setErrorMessage(error?.response?.status === 401 || error?.response?.status === 422
          ? "Invalid or missing API key"
          : "Unable to connect to backend API");
      }),
      getReliability().then((res) => setReliability(res.data)).catch((error) => {
        setError(true);
        setErrorMessage(error?.response?.status === 401 || error?.response?.status === 422
          ? "Invalid or missing API key"
          : "Unable to connect to backend API");
      }),
      getLatencyTrend().then((res) => setLatencyData(res.data)).catch(() => {}),
      getCostTrend().then((res) => setCostData(res.data)).catch(() => {}),
      getQuickStats().then((res) => setQuickStats(res.data)).catch(() => {}),
      getTopModels().then((res) => setTopModels(res.data)).catch(() => {}),
      getRecentActivity().then((res) => setActivities(res.data)).catch(() => {}),
    ]).finally(() => setLoading(false));
  };

  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      return;
    }

    localStorage.setItem("nw_api_key", apiKey.trim());
    setShowApiKeyInput(false);
  };

  const handleResetKey = () => {
    localStorage.removeItem("nw_api_key");
    setApiKey("");
    setShowApiKeyInput(true);
    setError(false);
    setErrorMessage("Unable to connect to backend API");
  };

  useEffect(() => {
    if (!showApiKeyInput) {
      void loadDashboardData();
    }
  }, [showApiKeyInput]);

  const overviewData = overview ?? defaultOverview;
  const reliabilityData = reliability ?? defaultReliability;

  if (showApiKeyInput) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-full max-w-md p-6 bg-surface-700 rounded-lg border border-surface-600">
          <h2 className="text-xl font-bold text-white mb-4">Setup API Key</h2>
          <p className="text-sm text-surface-300 mb-4">
            Enter your NeuralWatch API key to start monitoring your AI observability metrics.
          </p>
          <input
            type="password"
            placeholder="sk_test_123"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSetApiKey()}
            className="w-full px-4 py-2 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 mb-4"
          />
          <button
            onClick={handleSetApiKey}
            className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            Connect Dashboard
          </button>
          <p className="text-xs text-surface-400 mt-4 text-center">
            Don't have an API key? Create one in the API Keys section.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-surface-400">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between gap-3 p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-danger-500" />
            <div>
              <span className="text-sm text-danger-500 font-medium">{errorMessage}</span>
              <p className="text-xs text-danger-400 mt-1">
                {errorMessage === "Invalid or missing API key"
                  ? "Set the same key in the browser and in the SDK, then refresh."
                  : "Make sure the backend is running on port 8000 and the API URL is correct."}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetKey}
            className="text-xs px-3 py-1 bg-danger-500/20 hover:bg-danger-500/30 text-danger-400 rounded transition-colors"
          >
            Reset Key
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Requests"
          value={overviewData.total_requests.toLocaleString()}
          icon={<MessageSquare className="w-5 h-5" />}
          delay={100}
        />
        <MetricCard
          title="Success Rate"
          value={`${(Number(overviewData.success_rate) * 100).toFixed(1)}%`}
          icon={<CheckCircle2 className="w-5 h-5" />}
          delay={200}
        />
        <MetricCard
          title="Avg Latency"
          value={`${Number(overviewData.avg_latency).toFixed(0)}ms`}
          icon={<Clock className="w-5 h-5" />}
          delay={300}
        />
        <MetricCard
          title="Total Cost"
          value={`$${Number(overviewData.total_cost).toFixed(4)}`}
          icon={<DollarSign className="w-5 h-5" />}
          delay={400}
        />
      </div>

      <QuickStats stats={quickStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Chart data={latencyData} title="Latency Trend" delay={700} />
          <Chart data={costData} title="Cost Trend" delay={800} />
        </div>
        <div>
          <ReliabilityGauge score={Number(reliabilityData.reliability_score)} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity activities={activities} />

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-surface-400">Top Models</h3>
            <span className="text-sm text-primary-400 flex items-center gap-1">
              Live <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div className="space-y-3">
            {topModels.length === 0 && <p className="text-sm text-surface-500">No model metrics yet.</p>}
            {topModels.map((model) => (
              <div key={`${model.name}-${model.provider}`} className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${model.success_rate >= 95 ? "bg-success-500" : "bg-warning-500"}`} />
                  <span className="text-sm font-medium text-white">{model.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-surface-300">{model.requests.toLocaleString()} req</p>
                  <p className="text-xs text-surface-500">{model.avg_latency.toFixed(0)}ms</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}