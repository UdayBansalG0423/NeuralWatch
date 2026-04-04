import { useEffect, useState } from "react";
import { Key, Plus, Copy, Check, AlertTriangle, LoaderCircle } from "lucide-react";
import { getApiKeys } from "../../services/api";

interface ApiKey {
  id: string;
  key: string;
  is_active: boolean;
  created_at: string;
}

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    getApiKeys()
      .then((res) => setApiKeys(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-surface-400">
          <LoaderCircle className="w-5 h-5 animate-spin" />
          <span>Loading API keys...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary-500/10 rounded-lg">
            <Key className="w-6 h-6 text-primary-400" />
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

      {error && (
        <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-danger-500">Failed to load API keys. Make sure backend is running.</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-surface-800/50 border border-surface-700 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-surface-300">Keep your API keys secure. Never share them in public repositories or client-side code.</p>
          <p className="text-xs text-surface-500 mt-1">Keys are only visible when displayed. Store them securely.</p>
        </div>
      </div>

      {apiKeys.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <Key className="w-12 h-12 text-surface-600 mb-3" />
          <p className="text-surface-400 mb-4">No API keys found</p>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Your First Key
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="card card-hover flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-700 rounded-lg flex items-center justify-center">
                  <Key className="w-6 h-6 text-surface-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">API Key</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${apiKey.is_active ? "bg-success-500/10 text-success-500" : "bg-surface-700 text-surface-400"}`}>
                      {apiKey.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <code className="text-xs text-surface-500 font-mono">{apiKey.key}</code>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-surface-500">Created</p>
                  <p className="text-sm text-surface-400">{apiKey.created_at}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  className="p-2 text-surface-500 hover:text-white hover:bg-surface-700 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copiedId === apiKey.id ? <Check className="w-4 h-4 text-success-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        <h3 className="text-sm font-medium text-surface-400 mb-4">Quick Start</h3>
        <div className="bg-surface-900 rounded-lg p-4 font-mono text-sm">
          <p className="text-surface-500 mb-2"># Configure SDK with your API key</p>
          <p className="text-white">from neuralwatch import configure, track</p>
          <p className="text-white">configure(api_key=\"sk_test_123\")</p>
          <br />
          <p className="text-surface-500 mb-2"># Log your LLM calls</p>
          <p className="text-white">track(</p>
          <p className="text-white ml-4">model_name=\"gpt-4\",</p>
          <p className="text-white ml-4">provider=\"openai\",</p>
          <p className="text-white ml-4">latency_ms=350,</p>
          <p className="text-white ml-4">total_tokens=200,</p>
          <p className="text-white ml-4">cost_usd=0.005</p>
          <p className="text-white">)</p>
        </div>
      </div>
    </div>
  );
}
