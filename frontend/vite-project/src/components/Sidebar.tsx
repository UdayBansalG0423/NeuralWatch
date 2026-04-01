import { 
  Home, 
  BarChart3, 
  GitBranch, 
  Key, 
  Settings, 
  Activity,
  Zap,
  ChevronRight,
  Brain
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: <Home className="w-5 h-5" />, path: "/" },
  { label: "Analytics", icon: <BarChart3 className="w-5 h-5" />, path: "/analytics" },
  { label: "Models", icon: <GitBranch className="w-5 h-5" />, path: "/models" },
  { label: "API Keys", icon: <Key className="w-5 h-5" />, path: "/api-keys" },
];

const systemItems: NavItem[] = [
  { label: "Alerts", icon: <Zap className="w-5 h-5" />, path: "/alerts" },
  { label: "Settings", icon: <Settings className="w-5 h-5" />, path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-surface-900 border-r border-surface-800 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-4 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-semibold text-white">NeuralWatch</span>
            <span className="text-xs text-surface-500 ml-1">v2.0</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            Main
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-primary-600/10 text-primary-400 border border-primary-600/20"
                        : "text-surface-400 hover:text-white hover:bg-surface-800 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-primary-400" : "text-surface-500 group-hover:text-white"}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-surface-500 uppercase tracking-wider">
            System
          </p>
          <ul className="space-y-1">
            {systemItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? "bg-primary-600/10 text-primary-400 border border-primary-600/20"
                        : "text-surface-400 hover:text-white hover:bg-surface-800 border border-transparent"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? "text-primary-400" : "text-surface-500 group-hover:text-white"}>
                        {item.icon}
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-surface-800">
        <div className="p-3 bg-surface-800/50 rounded-lg border border-surface-700/50">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-success-500" />
            <span className="text-xs font-medium text-success-500">System Healthy</span>
          </div>
          <p className="text-xs text-surface-500">
            All services operational. Last checked 2 min ago.
          </p>
        </div>
      </div>
    </aside>
  );
}