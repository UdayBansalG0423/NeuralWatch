import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const latencyData = [
  { date: "Mon", value: 245 },
  { date: "Tue", value: 289 },
  { date: "Wed", value: 312 },
  { date: "Thu", value: 278 },
  { date: "Fri", value: 234 },
  { date: "Sat", value: 198 },
  { date: "Sun", value: 189 },
];

const costData = [
  { date: "Mon", value: 145 },
  { date: "Tue", value: 189 },
  { date: "Wed", value: 212 },
  { date: "Thu", value: 178 },
  { date: "Fri", value: 134 },
  { date: "Sat", value: 98 },
  { date: "Sun", value: 89 },
];

const requestsData = [
  { date: "Mon", requests: 12450 },
  { date: "Tue", requests: 15234 },
  { date: "Wed", requests: 18923 },
  { date: "Thu", requests: 16543 },
  { date: "Fri", requests: 19876 },
  { date: "Sat", requests: 12432 },
  { date: "Sun", requests: 9876 },
];

const modelDistribution = [
  { name: "GPT-4", value: 45, color: "#10b981" },
  { name: "Claude-3", value: 30, color: "#3b82f6" },
  { name: "Gemini Pro", value: 15, color: "#f59e0b" },
  { name: "Llama-3", value: 10, color: "#8b5cf6" },
];

const tokenUsage = [
  { name: "Input", value: 65 },
  { name: "Output", value: 35 },
];

function MetricCard({ title, value, subtitle, change }: { title: string; value: string; subtitle?: string; change?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-surface-400 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-white">{value}</p>
      {subtitle && <p className="text-xs text-surface-500 mt-1">{subtitle}</p>}
      {change && <p className="text-xs text-success-500 mt-2">{change}</p>}
    </div>
  );
}

function LatencyChart() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-400">Average Latency (ms)</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={latencyData}>
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fill="url(#latencyGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CostChart() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-400">Daily Cost ($)</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={costData}>
          <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function RequestsChart() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-400">Total Requests</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={requestsData}>
          <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <YAxis stroke="#475569" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#334155' }} tickLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ModelPieChart() {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-4">Model Distribution</h3>
      <div className="flex items-center">
        <div className="w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modelDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {modelDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2 ml-4">
          {modelDistribution.map((model) => (
            <div key={model.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                <span className="text-sm text-surface-300">{model.name}</span>
              </div>
              <span className="text-sm font-medium text-white">{model.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TokenPieChart() {
  return (
    <div className="card">
      <h3 className="text-sm font-medium text-surface-400 mb-4">Token Usage</h3>
      <div className="flex items-center">
        <div className="w-40 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tokenUsage}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={55}
                paddingAngle={2}
                dataKey="value"
              >
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
            <span className="text-sm font-medium text-white">65%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success-500" />
              <span className="text-sm text-surface-300">Output</span>
            </div>
            <span className="text-sm font-medium text-white">35%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "latency", label: "Latency" },
    { id: "cost", label: "Cost" },
    { id: "tokens", label: "Tokens" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-surface-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-primary-400 border-primary-500"
                : "text-surface-400 border-transparent hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Requests" value="105.3K" subtitle="vs last period" change="+15.2%" />
        <MetricCard title="Avg Latency" value="234ms" subtitle="vs last period" change="-8.3%" />
        <MetricCard title="Total Cost" value="$1,245" subtitle="vs last period" change="+5.1%" />
        <MetricCard title="Success Rate" value="99.2%" subtitle="vs last period" change="+0.4%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LatencyChart />
        <CostChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestsChart />
        <ModelPieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TokenPieChart />
        <div className="card">
          <h3 className="text-sm font-medium text-surface-400 mb-4">Performance Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P50 Latency</span>
              <span className="text-sm font-medium text-white">189ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P95 Latency</span>
              <span className="text-sm font-medium text-white">456ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">P99 Latency</span>
              <span className="text-sm font-medium text-white">892ms</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 rounded-lg">
              <span className="text-sm text-surface-300">Total Tokens</span>
              <span className="text-sm font-medium text-white">2.4M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}