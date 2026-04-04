import { useEffect, useState, type ReactNode } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, LoaderCircle } from "lucide-react";
import { getAnalytics, getCostTrend, getLatencyTrend } from "../../services/api";

type TrendPoint = {
  date: string;
  value: number;
};

type PiePoint = {
  name: string;
  value: number;
};

type AnalyticsResponse = {
  overview: {
    total_requests: number;
    success_rate: number;
    avg_latency: number;
    total_cost: number;
  };
  quick_stats: {
    active_models: number;
    avg_response_time: number;
    tokens_per_min: number;
    uptime: number;
  };
  request_trend: TrendPoint[];
  model_distribution: PiePoint[];
  token_usage: PiePoint[];
  performance_summary: {
    p50_latency: number;
    p95_latency: number;
    p99_latency: number;
    total_tokens: number;
    avg_latency: number;
  };
};

type AnalyticsPoint = {
  date: string;
  value: number;
};

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

function MetricCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div className="card">
      <p className="text-sm text-surface-400 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-surface-500 mt-1">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center h-64 border border-dashed border-surface-700 rounded-lg">
      <p className="text-sm text-surface-500">{label}</p>
    </div>
  );
}

function formatMetric(value: number | string, suffix = "") {
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return `${value}${suffix}`;
    }
    return `${value.toFixed(1)}${suffix}`;
  }
  return `${value}${suffix}`;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [latencyTrend, setLatencyTrend] = useState<AnalyticsPoint[]>([]);
  const [costTrend, setCostTrend] = useState<AnalyticsPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      getAnalytics().then((res) => setData(res.data)),
      getLatencyTrend().then((res) => setLatencyTrend(res.data)),
      getCostTrend().then((res) => setCostTrend(res.data)),
    ])
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-surface-400">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span>Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <AlertTriangle className="w-8 h-8 text-danger-500" />
          <span className="text-danger-500">Failed to load analytics. Make sure backend is running.</span>
        </div>
      </div>
    );
  }

  const requestTrend = data.request_trend;
  const modelDistribution = data.model_distribution;
  const tokenUsage = data.token_usage;
  const overview = data.overview;
  const quickStats = data.quick_stats;
  const summary = data.performance_summary;

  const totalTokens = tokenUsage.reduce((sum, item) => sum + item.value, 0);
  const inputShare = totalTokens > 0 ? Math.round((tokenUsage[0]?.value ?? 0) / totalTokens * 100) : 0;
  const outputShare = 100 - inputShare;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Requests" value={overview.total_requests.toLocaleString()} subtitle={`${(overview.success_rate * 100).toFixed(1)}% success rate`} />
        <MetricCard title="Avg Latency" value={`${formatMetric(overview.avg_latency, "ms")}`} subtitle="All requests" />
        <MetricCard title="Total Cost" value={`$${formatMetric(overview.total_cost)}`} subtitle="Accumulated spend" />
        <MetricCard title="Uptime" value={`${quickStats.uptime.toFixed(1)}%`} subtitle={`${quickStats.active_models} active models`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Request Volume">
          {requestTrend.length === 0 ? (
            <EmptyState label="No request data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={requestTrend}>
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} labelStyle={{ color: "#94a3b8" }} />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Latency Trend (ms)">
          {latencyTrend.length === 0 ? (
            <EmptyState label="No latency data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={latencyTrend}>
                <defs>
                  <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} labelStyle={{ color: "#94a3b8" }} />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#latencyGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Model Distribution">
          {modelDistribution.length === 0 ? (
            <EmptyState label="No model metrics yet" />
          ) : (
            <div className="flex items-center">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={modelDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                      {modelDistribution.map((entry, index) => {
                        const palette = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ef4444"];
                        return <Cell key={`${entry.name}-${index}`} fill={palette[index % palette.length]} />;
                      })}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 ml-4">
                {modelDistribution.map((model, index) => {
                  const palette = ["#3b82f6", "#10b981", "#f59e0b", "#a855f7", "#ef4444"];
                  return (
                    <div key={model.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                        <span className="text-sm text-surface-300">{model.name}</span>
                      </div>
                      <span className="text-sm font-medium text-white">{model.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </ChartCard>

        <ChartCard title="Token Usage">
          {tokenUsage.length === 0 ? (
            <EmptyState label="No token usage data available" />
          ) : (
            <div className="flex items-center">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={tokenUsage} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={2} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2 ml-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-sm text-surface-300">Input</span>
                  </div>
                  <span className="text-sm font-medium text-white">{inputShare}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success-500" />
                    <span className="text-sm text-surface-300">Output</span>
                  </div>
                  <span className="text-sm font-medium text-white">{outputShare}%</span>
                </div>
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Cost Trend ($)">
          {costTrend.length === 0 ? (
            <EmptyState label="No cost data available yet" />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={costTrend}>
                <XAxis dataKey="date" stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <YAxis stroke="#475569" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={{ stroke: "#334155" }} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "8px" }} labelStyle={{ color: "#94a3b8" }} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <div className="card">
          <h3 className="text-sm font-medium text-surface-400 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P50 Latency</span>
              <span className="text-sm font-medium text-white">{summary.p50_latency.toFixed(0)}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P95 Latency</span>
              <span className="text-sm font-medium text-white">{summary.p95_latency.toFixed(0)}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P99 Latency</span>
              <span className="text-sm font-medium text-white">{summary.p99_latency.toFixed(0)}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Total Tokens</span>
              <span className="text-sm font-medium text-white">{summary.total_tokens.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-sm font-medium text-surface-400 mb-4">Live Snapshot</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Requests</span>
              <span className="text-sm font-medium text-white">{overview.total_requests.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Avg Response Time</span>
              <span className="text-sm font-medium text-white">{quickStats.avg_response_time.toFixed(0)}ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Tokens/min</span>
              <span className="text-sm font-medium text-white">{quickStats.tokens_per_min.toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Active Models</span>
              <span className="text-sm font-medium text-white">{quickStats.active_models}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
