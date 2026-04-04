import { useEffect, useState } from "react";
import { Brain, Clock, Plus, AlertTriangle, LoaderCircle } from "lucide-react";
import { getModels } from "../../services/api";

interface Model {
  name: string;
  provider: string;
  requests: number;
  avg_latency: number;
  success_rate: number;
  last_used: string;
  status: "active" | "offline" | "degraded";
}

const statusConfig = {
  active: { label: "Active", color: "text-success-500", bg: "bg-success-500/10" },
  degraded: { label: "Degraded", color: "text-warning-500", bg: "bg-warning-500/10" },
  offline: { label: "Offline", color: "text-surface-500", bg: "bg-surface-700" },
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("requests");

  useEffect(() => {
    getModels()
      .then((res) => setModels(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredModels = models
    .filter((model) =>
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "requests") return b.requests - a.requests;
      if (sortBy === "latency") return a.avg_latency - b.avg_latency;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-surface-400">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span>Loading models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          <span className="text-sm text-danger-500">Failed to load models. Make sure backend is running.</span>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
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
          </select>
        </div>

        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Model
        </button>
      </div>

      {filteredModels.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Brain className="w-12 h-12 text-surface-600 mb-3" />
          <p className="text-surface-400">No models found. Start using the SDK to log LLM calls.</p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/50">
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Model</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Latency</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Success Rate</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Requests</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-surface-400 uppercase tracking-wider">Last Used</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700">
              {filteredModels.map((model) => {
                const status = statusConfig[model.status];

                return (
                  <tr key={`${model.name}-${model.provider}`} className="hover:bg-surface-800/30 transition-colors">
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-surface-500" />
                        <span className="text-sm text-surface-300">{model.avg_latency.toFixed(0)}ms</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                          <div className="h-full bg-success-500 rounded-full" style={{ width: `${model.success_rate}%` }} />
                        </div>
                        <span className="text-sm text-surface-300">{model.success_rate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-300">{model.requests.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-surface-500">{new Date(model.last_used).toLocaleString()}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
