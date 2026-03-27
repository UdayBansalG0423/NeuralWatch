import { useEffect, useState } from "react";
import { getOverview, getReliability } from "../services/api";
import Card from "../components/Card";
import Chart from "../components/Chart";
import { Activity, Server, Zap, DollarSign, ShieldCheck } from "lucide-react";

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
        // Only show error visually in UI header later, not blocking UI
        setApiError("Disconnected from Live Backend. Showing Demo Data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const overviewData = overview ?? fallbackOverview;
  const reliabilityData = reliability ?? fallbackReliability;

  return (
    <div className="p-8 pb-20 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            System Overview
          </h1>
          <p className="text-gray-400 mt-1">Monitor real-time performance and metrics for NeuralWatch.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {apiError ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              Demo Mode Active
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live API Connected
            </div>
          )}
          <div className="px-4 py-2 rounded-lg bg-[#111827] border border-gray-800 text-sm hover:border-gray-700 cursor-pointer transition">
            Last 30 Days
          </div>
        </div>
      </div>

      {loading && <p className="text-gray-400 mb-6">Fetching latest metrics...</p>}

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-2">
        <Card 
          title="Total Requests" 
          value={overviewData.total_requests.toLocaleString()} 
          icon={<Server size={20} />} 
          trend={{ value: "+12.5%", isPositive: true }} 
        />
        <Card 
          title="Success Rate" 
          value={overviewData.success_rate} 
          icon={<Activity size={20} />} 
          trend={{ value: "+0.8%", isPositive: true }}
        />
        <Card 
          title="Avg Latency" 
          value={overviewData.avg_latency} 
          icon={<Zap size={20} />} 
          trend={{ value: "-4.2%", isPositive: true }} // Less latency is good
        />
        <Card 
          title="Total Cost" 
          value={overviewData.total_cost} 
          icon={<DollarSign size={20} />} 
          trend={{ value: "+2.4%", isPositive: false }}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Charts Section */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Chart data={latencyData} title="Latency Trend (ms)" />
            <Chart data={costData} title="Cost Trend ($)" />
          </div>
        </div>

        {/* Reliability Score Panel */}
        <div className="col-span-1">
          <div className="h-full bg-[#0a0f1c] border border-[#1f2937] rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center">
            {/* Background effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 blur-[50px]" />
            
            <h2 className="text-lg font-medium text-gray-400 mb-8 self-start">Overall Reliability</h2>
            
            <div className="relative flex items-center justify-center w-48 h-48 mb-6">
              {/* Decorative rings */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1f2937" strokeWidth="6" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="6" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * Number(reliabilityData.reliability_score))} 
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-bold text-white tracking-tighter">
                  {Number(reliabilityData.reliability_score) * 100}<span className="text-2xl text-gray-500">%</span>
                </span>
                <span className="text-sm text-green-400 font-medium flex items-center gap-1 mt-1">
                  <ShieldCheck size={14} /> Very Healthy
                </span>
              </div>
            </div>
            
            <p className="text-sm text-center text-gray-400 px-4">
              System health and availability across all monitored endpoints is well above SLA targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
