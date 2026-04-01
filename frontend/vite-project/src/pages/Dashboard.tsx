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
  ArrowUpRight
} from "lucide-react";
import { getOverview, getReliability, getLatencyTrend, getCostTrend } from "../services/api";
import type { OverviewData, ReliabilityData, TrendPoint } from "../types";
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

  const getHealthStatus = (score: number) => {
    if (score >= 0.95) return { label: "Healthy", color: "text-success-500" };
    if (score >= 0.8) return { label: "Degraded", color: "text-warning-500" };
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
            cx="50" cy="50" r="45" 
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
      <p className="text-xs text-center text-surface-500">
        Based on latency, error rate, and cost efficiency
      </p>
    </div>
  );
}

function QuickStats() {
  const stats = [
    { label: "Active Models", value: "4", icon: <Zap className="w-4 h-4" /> },
    { label: "Avg Response Time", value: "234ms", icon: <Clock className="w-4 h-4" /> },
    { label: "Tokens/min", value: "12.5k", icon: <Activity className="w-4 h-4" /> },
    { label: "Uptime", value: "99.9%", icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, index) => (
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

function RecentActivity() {
  const activities = [
    { type: "success", message: "GPT-4 completed request", time: "2 min ago" },
    { type: "warning", message: "Claude latency above threshold", time: "5 min ago" },
    { type: "error", message: "API key rotated for safety", time: "1 hour ago" },
    { type: "success", message: "New model deployed: Gemini Pro", time: "2 hours ago" },
  ];

  const typeConfig = {
    success: { icon: CheckCircle2, color: "text-success-500", bg: "bg-success-500/10" },
    warning: { icon: AlertTriangle, color: "text-warning-500", bg: "bg-warning-500/10" },
    error: { icon: XCircle, color: "text-danger-500", bg: "bg-danger-500/10" },
  };

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const config = typeConfig[activity.type as keyof typeof typeConfig];
          const Icon = config.icon;
          return (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg"
            >
              <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-white">{activity.message}</p>
                <p className="text-xs text-surface-500">{activity.time}</p>
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      getOverview().then((res) => setOverview(res.data)).catch(() => setError(true)),
      getReliability().then((res) => setReliability(res.data)).catch(() => setError(true)),
      getLatencyTrend().then((res) => setLatencyData(res.data)).catch(() => {}),
      getCostTrend().then((res) => setCostData(res.data)).catch(() => {}),
    ])
      .finally(() => setLoading(false));
  }, []);

  const overviewData = overview ?? defaultOverview;
  const reliabilityData = reliability ?? defaultReliability;

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
        <div className="flex items-center gap-3 p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          <span className="text-sm text-danger-500">Unable to connect to backend. Showing demo data.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Requests"
          value={overviewData.total_requests.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon={<MessageSquare className="w-5 h-5" />}
          delay={100}
        />
        <MetricCard
          title="Success Rate"
          value={`${overviewData.success_rate}%`}
          change="+0.8%"
          changeType="positive"
          icon={<CheckCircle2 className="w-5 h-5" />}
          delay={200}
        />
        <MetricCard
          title="Avg Latency"
          value={`${overviewData.avg_latency}ms`}
          change="-4.2%"
          changeType="positive"
          icon={<Clock className="w-5 h-5" />}
          delay={300}
        />
        <MetricCard
          title="Total Cost"
          value={`$${overviewData.total_cost}`}
          change="+2.4%"
          changeType="negative"
          icon={<DollarSign className="w-5 h-5" />}
          delay={400}
        />
      </div>

      <QuickStats />

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
        <RecentActivity />
        
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-surface-400">Top Models</h3>
            <button className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {[
              { name: "GPT-4", requests: "45,234", latency: "234ms", status: "healthy" },
              { name: "Claude-3", requests: "32,891", latency: "189ms", status: "healthy" },
              { name: "Gemini Pro", requests: "18,452", latency: "312ms", status: "degraded" },
              { name: "Llama-3", requests: "12,103", latency: "456ms", status: "healthy" },
            ].map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    model.status === "healthy" ? "bg-success-500" : "bg-warning-500"
                  }`} />
                  <span className="text-sm font-medium text-white">{model.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-surface-300">{model.requests} req</p>
                  <p className="text-xs text-surface-500">{model.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}