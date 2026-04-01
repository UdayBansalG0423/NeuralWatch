import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { TrendPoint } from "../types";

interface ChartProps {
  data: TrendPoint[];
  title?: string;
  delay?: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: TrendPoint }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-surface-800 border border-surface-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-white">{payload[0].value}</p>
        <p className="text-xs text-surface-500">{payload[0].payload.date}</p>
      </div>
    );
  }
  return null;
}

export default function Chart({ data, title, delay = 0 }: ChartProps) {
  return (
    <div 
      className="card opacity-0 animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-400">{title}</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
          <span className="text-xs text-surface-500">Live</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <YAxis 
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: '#334155' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#3b82f6" 
            strokeWidth={2}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}