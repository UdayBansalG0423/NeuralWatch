import { useEffect, useState } from "react";
import { Zap, AlertTriangle, Info, Bell, LoaderCircle, CheckCircle2 } from "lucide-react";
import { getAlerts } from "../../services/api";

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  title: string;
  message: string;
  status: "active" | "resolved";
}

const typeConfig = {
  error: { icon: AlertTriangle, color: "text-danger-500", bg: "bg-danger-500/10", border: "border-danger-500/20" },
  warning: { icon: Zap, color: "text-warning-500", bg: "bg-warning-500/10", border: "border-warning-500/20" },
  info: { icon: Info, color: "text-primary-400", bg: "bg-primary-500/10", border: "border-primary-500/20" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getAlerts()
      .then((res) => setAlerts(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    if (filter === "active") return alert.status === "active";
    if (filter === "resolved") return alert.status === "resolved";
    if (filter === "error") return alert.type === "error";
    if (filter === "warning") return alert.type === "warning";
    if (filter === "info") return alert.type === "info";
    return true;
  });

  const activeCount = alerts.filter(a => a.status === "active").length;
  const errorCount = alerts.filter(a => a.type === "error" && a.status === "active").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-surface-400">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span>Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-danger-500" />
          <span className="text-sm text-danger-500">Failed to load alerts. Make sure backend is running.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{alerts.length}</p>
            <p className="text-xs text-surface-500">Total Alerts</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-warning-500/10 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-warning-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{activeCount}</p>
            <p className="text-xs text-surface-500">Active</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-danger-500/10 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-danger-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{errorCount}</p>
            <p className="text-xs text-surface-500">Errors</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 bg-success-500/10 rounded-lg flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-success-500" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-white">{alerts.filter(a => a.status === "resolved").length}</p>
            <p className="text-xs text-surface-500">Resolved</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all" ? "bg-primary-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "active" ? "bg-primary-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("resolved")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "resolved" ? "bg-primary-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          Resolved
        </button>
        <div className="w-px h-6 bg-surface-700 mx-2" />
        <button
          onClick={() => setFilter("error")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "error" ? "bg-danger-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          <AlertTriangle className="w-3 h-3" /> Errors
        </button>
        <button
          onClick={() => setFilter("warning")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "warning" ? "bg-warning-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          <Zap className="w-3 h-3" /> Warnings
        </button>
        <button
          onClick={() => setFilter("info")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
            filter === "info" ? "bg-primary-600 text-white" : "bg-surface-800 text-surface-400 hover:text-white"
          }`}
        >
          <Info className="w-3 h-3" /> Info
        </button>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const config = typeConfig[alert.type as keyof typeof typeConfig];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={`card card-hover border-l-4 ${config.border} ${alert.status === "resolved" ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">{alert.title}</h3>
                      <p className="text-sm text-surface-400 mt-1">{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        alert.status === "active" ? "bg-warning-500/10 text-warning-500" : "bg-success-500/10 text-success-500"
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="card text-center py-12">
          <CheckCircle2 className="w-12 h-12 text-success-500 mx-auto mb-4" />
          <p className="text-surface-400">No alerts to display</p>
        </div>
      )}
    </div>
  );
}