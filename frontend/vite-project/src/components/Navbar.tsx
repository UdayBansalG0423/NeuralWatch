import { Search, Bell, Wifi, WifiOff, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  title: string;
  subtitle?: string;
  isConnected?: boolean;
}

const timeRanges = [
  { label: "Last 15 minutes", value: "15m" },
  { label: "Last 1 hour", value: "1h" },
  { label: "Last 6 hours", value: "6h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
];

export default function Navbar({ title, subtitle, isConnected = true }: NavbarProps) {
  const [selectedTime, setSelectedTime] = useState("24h");
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentTimeRange = timeRanges.find(t => t.value === selectedTime);

  return (
    <header className="h-16 bg-surface-800 border-b border-surface-700 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          {subtitle && <p className="text-sm text-surface-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-9 pl-10 pr-4 bg-surface-900 border border-surface-700 rounded-lg text-sm text-white placeholder-surface-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowTimeDropdown(!showTimeDropdown)}
            className="flex items-center gap-2 h-9 px-3 bg-surface-900 border border-surface-700 rounded-lg text-sm text-surface-300 hover:border-surface-600 transition-colors"
          >
            <span>{currentTimeRange?.label}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showTimeDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-surface-800 border border-surface-700 rounded-lg shadow-lg py-1 z-50">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    setSelectedTime(range.value);
                    setShowTimeDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    selectedTime === range.value
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-surface-300 hover:bg-surface-700"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          isConnected
            ? "bg-success-500/10 text-success-500"
            : "bg-danger-500/10 text-danger-500"
        }`}>
          {isConnected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="font-medium">{isConnected ? "Live" : "Offline"}</span>
        </div>

        <button className="relative p-2 text-surface-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 hover:bg-surface-700 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
              A
            </div>
            <ChevronDown className="w-4 h-4 text-surface-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-1 w-56 bg-surface-800 border border-surface-700 rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-surface-700">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-surface-500">admin@neuralwatch.io</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-300 hover:bg-surface-700 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-300 hover:bg-surface-700 transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              <div className="border-t border-surface-700 py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-500 hover:bg-surface-700 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}