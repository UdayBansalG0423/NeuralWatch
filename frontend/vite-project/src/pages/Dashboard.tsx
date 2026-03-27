import { useEffect, useState } from "react";
import { getOverview, getReliability } from "../services/api";
import Card from "../components/Card";
import Chart from "../components/Chart";

type Overview = {
  total_requests: number;
  success_rate: string | number;
  avg_latency: string | number;
  total_cost: string | number;
};

type Reliability = {
  reliability_score: string | number;
};

const fallbackOverview: Overview = {
  total_requests: 1280,
  success_rate: "97.8%",
  avg_latency: "312ms",
  total_cost: "$18.42",
};

const fallbackReliability: Reliability = {
  reliability_score: "0.92",
};

const latencyData = [
  { name: "1", value: 200 },
  { name: "2", value: 300 },
  { name: "3", value: 250 },
  { name: "4", value: 400 },
];

const costData = [
  { name: "1", value: 0.01 },
  { name: "2", value: 0.02 },
  { name: "3", value: 0.015 },
  { name: "4", value: 0.03 },
];

export default function Dashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [reliability, setReliability] = useState<Reliability | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewRes, reliabilityRes] = await Promise.all([
          getOverview(),
          getReliability(),
        ]);

        setOverview(overviewRes.data);
        setReliability(reliabilityRes.data);
      } catch {
        setApiError("API unavailable. Showing demo dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const overviewData = overview ?? fallbackOverview;
  const reliabilityData = reliability ?? fallbackReliability;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">NeuralWatch</h1>

      {loading && <p className="text-gray-400 mb-4">Loading dashboard...</p>}

      {apiError && (
        <p className="mb-4 rounded-lg border border-yellow-700 bg-yellow-950/40 px-4 py-2 text-sm text-yellow-300">
          {apiError}
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Requests" value={overviewData.total_requests} />
        <Card title="Success Rate" value={overviewData.success_rate} />
        <Card title="Avg Latency" value={overviewData.avg_latency} />
        <Card title="Total Cost" value={overviewData.total_cost} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Chart data={latencyData} title="Latency Trend" />
        <Chart data={costData} title="Cost Trend" />
      </div>

      <div className="mt-6">
        <h2 className="text-lg">Reliability Score</h2>
        <p className="text-3xl font-bold text-green-400">
          {reliabilityData.reliability_score}
        </p>
      </div>
      </div>
    </div>
  );
}
