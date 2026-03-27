import { Home, Activity, Settings, BarChart2, Layers } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#070b14] border-r border-[#1f2937] flex flex-col fixed left-0 top-0">
      <div className="h-20 flex items-center px-6 border-b border-[#1f2937]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            N
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            NeuralWatch
          </span>
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        
        <SidebarItem icon={<Home size={20} />} label="Dashboard" active />
        <SidebarItem icon={<Activity size={20} />} label="Performance" />
        <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" />
        <SidebarItem icon={<Layers size={20} />} label="Integrations" />
      </div>

      <div className="p-4 border-t border-[#1f2937]">
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
        <div className="mt-4 flex items-center gap-3 px-2 py-2 rounded-xl bg-[#111827] border border-gray-800">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium">U</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white text-left">Admin User</span>
            <span className="text-xs text-gray-500 text-left">Pro Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-gradient-to-r from-green-500/10 to-transparent text-green-400 border-l-2 border-green-500" 
          : "text-gray-400 hover:text-white hover:bg-[#111827] border-l-2 border-transparent"
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}
