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
  delay?: number;
};

export default function Card({ title, value, icon, trend, className, delay = 0 }: Props) {
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-terminal-surface border border-terminal-border rounded-xl p-5 transition-all duration-400 hover:border-terminal-accent/40 hover:shadow-[0_0_40px_rgba(0,255,159,0.08)] opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="absolute top-0 right-0 w-24 h-24 bg-terminal-accent/5 rounded-full blur-[40px] group-hover:bg-terminal-accent/10 transition-all duration-500" />
      
      <div className="absolute -bottom-8 -right-8 w-16 h-16 border border-terminal-border/30 rounded-full" />
      <div className="absolute -bottom-4 -right-4 w-12 h-12 border border-terminal-border/20 rounded-full" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <p className="text-terminal-muted font-mono text-xs uppercase tracking-wider">{title}</p>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-terminal-bg border border-terminal-border flex items-center justify-center text-terminal-muted group-hover:text-terminal-accent group-hover:border-terminal-accent/30 transition-all duration-300">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-3 relative z-10">
        <h2 className="text-3xl font-bold tracking-tight text-white font-mono group-hover:text-terminal-accent transition-colors duration-300">
          {value}
        </h2>
        
        {trend && (
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-mono font-medium px-2 py-0.5 rounded",
            trend.isPositive 
              ? "text-terminal-accent bg-terminal-accent/10" 
              : "text-terminal-magenta bg-terminal-magenta/10"
          )}>
            {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      
      <div className="mt-3 h-px bg-gradient-to-r from-terminal-border via-terminal-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}