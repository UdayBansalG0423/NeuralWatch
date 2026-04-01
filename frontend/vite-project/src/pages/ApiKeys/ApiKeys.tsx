import { useState } from "react";
import { Key, Plus, Copy, Check, MoreVertical, Eye, EyeOff, Shield, AlertTriangle } from "lucide-react";

const apiKeys = [
  {
    id: "1",
    name: "Production Key",
    key: "nw_live_-------------------------------xK9z",
    created: "Jan 15, 2024",
    last_used: "2 min ago",
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "nw_test_-------------------------------mL7p",
    created: "Feb 20, 2024",
    last_used: "1 hour ago",
    status: "active",
  },
  {
    id: "3",
    name: "Staging Key",
    key: "nw_stage_------------------------------nJ4w",
    created: "Mar 10, 2024",
    last_used: "2 days ago",
    status: "inactive",
  },
];

export default function ApiKeys() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleShowKey = (id: string) => {
    setShowKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskKey = (key: string) => {
    const parts = key.split("_");
    if (parts.length >= 3) {
      return `${parts[0]}_${parts[1]}_••••••••••••••••••••${parts[2].slice(-4)}`;
    }
    return key.slice(0, 20) + "••••••••••";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <Shield className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">API Keys</h2>
            <p className="text-sm text-surface-500">Manage your API keys for accessing NeuralWatch</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Key
        </button>
      </div>

      <div className="p-4 bg-surface-800/50 border border-surface-700 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-surface-300">Keep your API keys secure. Never share them in public repositories or client-side code.</p>
          <p className="text-xs text-surface-500 mt-1">Keys are only visible once when created. Store them securely.</p>
        </div>
      </div>

      <div className="space-y-3">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="card card-hover flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6 text-surface-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{apiKey.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    apiKey.status === "active" 
                      ? "bg-success-500/10 text-success-500" 
                      : "bg-surface-700 text-surface-400"
                  }`}>
                    {apiKey.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs text-surface-500 font-mono">
                    {showKey[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <button
                    onClick={() => toggleShowKey(apiKey.id)}
                    className="p-1 text-surface-500 hover:text-white transition-colors"
                  >
                    {showKey[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-surface-500">Created</p>
                <p className="text-sm text-surface-400">{apiKey.created}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-500">Last Used</p>
                <p className="text-sm text-surface-400">{apiKey.last_used}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  className="p-2 text-surface-500 hover:text-white hover:bg-surface-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId === apiKey.id ? (
                    <Check className="w-4 h-4 text-success-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button className="p-2 text-surface-500 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-surface-400 mb-4">Quick Start</h3>
        <div className="bg-surface-900 rounded-lg p-4 font-mono text-sm">
          <p className="text-surface-500 mb-2"># Install the SDK</p>
          <p className="text-primary-400 mb-4">pip install neuralwatch</p>
          <p className="text-surface-500 mb-2"># Initialize the client</p>
          <p className="text-white">from neuralwatch import Client</p>
          <p className="text-white">client = Client("nw_live_••••••••••••••••••••xK9z")</p>
        </div>
      </div>
    </div>
  );
}