import { useState } from "react";
import { 
  Brain, 
  Clock, 
  DollarSign, 
  Activity, 
  CheckCircle2, 
  AlertTriangle,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react";

const models = [
  {
    id: "1",
    name: "GPT-4",
    provider: "OpenAI",
    status: "active",
    latency: 234,
    cost_per_1k: 0.03,
    success_rate: 99.2,
    avg_tokens: 1250,
    last_used: "2 min ago",
    requests: "45,234",
    trend: "up",
  },
  {
    id: "2",
    name: "Claude-3 Opus",
    provider: "Anthropic",
    status: "active",
    latency: 189,
    cost_per_1k: 0.015,
    success_rate: 99.5,
    avg_tokens: 980,
    last_used: "5 min ago",
    requests: "32,891",
    trend: "up",
  },
  {
    id: "3",
    name: "Gemini Pro",
    provider: "Google",
    status: "degraded",
    latency: 312,
    cost_per_1k: 0.005,
    success_rate: 97.8,
    avg_tokens: 2100,
    last_used: "1 hour ago",
    requests: "18,452",
    trend: "down",
  },
  {
    id: "4",
    name: "Llama-3 70B",
    provider: "Meta",
    status: "active",
    latency: 456,
    cost_per_1k: 0.0008,
    success_rate: 98.9,
    avg_tokens: 890,
    last_used: "3 hours ago",
    requests: "12,103",
    trend: "stable",
  },
  {
    id: "5",
    name: "Mistral Large",
    provider: "Mistral",
    status: "inactive",
    latency: 278,
    cost_per_1k: 0.002,
    success_rate: 99.1,
    avg_tokens: 1050,
    last_used: "1 day ago",
    requests: "5,432",
    trend: "stable",
  },
];

const statusConfig = {
  active: { label: "Active", color: "text-success-500", bg: "bg-success-500/10", icon: CheckCircle2 },
  degraded: { label: "Degraded", color: "text-warning-500", bg: "bg-warning-500/10", icon: AlertTriangle },
  inactive: { label: "Inactive", color: "text-surface-500", bg: "bg-surface-700", icon: AlertTriangle },
};

export default function Models() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("requests");

  const filteredModels = models
    .filter(model => 
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "requests") return Number(b.requests.replace(/,/g, '')) - Number(a.requests.replace(/,/g, ''));
      if (sortBy === "latency") return a.latency - b.latency;
      if (sortBy === "cost") return a.cost_per_1k - b.cost_per_1k;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 pl-10 pr-4 bg-surface-800 border border-surface-700 rounded-lg text-sm text-white placeholder-surface-500 focus:outline-none focus:border-primary-500"
            />
            <Brain className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-surface-800 border border-surface-700 rounded-lg text-sm text-surface-300 focus:outline-none focus:border-primary-500"
          >
            <option value="requests">Sort by Requests</option>
            <option value="latency">Sort by Latency</option>
            <option value="cost">Sort by Cost</option>
          </select>
        </div>

        <button className="btn-primary flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Add Model
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700 bg-surface-800/50">
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Model</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Latency</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Cost/1K</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Success</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Requests</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Trend</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Last Used</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {filteredModels.map((model) => {
              const status = statusConfig[model.status as keyof typeof statusConfig];
              const StatusIcon = status.icon;
              
              return (
                <tr key={model.id} className="hover:bg-surface-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-surface-700 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{model.name}</p>
                        <p className="text-xs text-surface-500">{model.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-surface-500" />
                      <span className="text-sm text-surface-300">{model.latency}ms</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-surface-500" />
                      <span className="text-sm text-surface-300">${model.cost_per_1k.toFixed(4)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success-500 rounded-full" 
                          style={{ width: `${model.success_rate}%` }}
                        />
                      </div>
                      <span className="text-sm text-surface-300">{model.success_rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-surface-300">{model.requests}</span>
                  </td>
                  <td className="px-6 py-4">
                    {model.trend === "up" && <TrendingUp className="w-4 h-4 text-success-500" />}
                    {model.trend === "down" && <TrendingDown className="w-4 h-4 text-danger-500" />}
                    {model.trend === "stable" && <span className="text-xs text-surface-500">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-surface-500">{model.last_used}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-surface-500 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-surface-500">Best Latency</span>
          </div>
          <p className="text-xl font-semibold text-white">Claude-3</p>
          <p className="text-xs text-success-500 mt-1">189ms avg</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-success-400" />
            <span className="text-xs text-surface-500">Most Cost Effective</span>
          </div>
          <p className="text-xl font-semibold text-white">Llama-3</p>
          <p className="text-xs text-surface-500 mt-1">$0.0008/1K tokens</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success-400" />
            <span className="text-xs text-surface-500">Highest Success</span>
          </div>
          <p className="text-xl font-semibold text-white">Claude-3</p>
          <p className="text-xs text-success-500 mt-1">99.5% success rate</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-primary-400" />
            <span className="text-xs text-surface-500">Most Used</span>
          </div>
          <p className="text-xl font-semibold text-white">GPT-4</p>
          <p className="text-xs text-surface-500 mt-1">45K+ requests</p>
        </div>
      </div>
    </div>
  );
}