import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Props = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
};

export default function Card({ title, value, icon, trend, className }: Props) {
  return (
    <div className={cn(
      "relative group overflow-hidden bg-[#0a0f1c] border border-[#1f2937] rounded-2xl p-6 transition-all duration-300 hover:border-green-500/30 hover:shadow-[0_8px_30px_rgba(34,197,94,0.1)]",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-400 font-medium text-sm">{title}</p>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[#111827] border border-[#1f2937] flex items-center justify-center text-gray-400 group-hover:text-green-400 group-hover:bg-[#111827] transition-colors">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">{value}</h2>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-medium mb-1",
            trend.isPositive ? "text-green-400" : "text-red-400"
          )}>
            {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
