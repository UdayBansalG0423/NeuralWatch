import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const pageInfo: Record<string, { title: string; subtitle?: string }> = {
  "/": { title: "Dashboard", subtitle: "Monitor your AI observability metrics" },
  "/analytics": { title: "Analytics", subtitle: "Deep dive into your model performance" },
  "/models": { title: "Model Comparison", subtitle: "Compare performance across models" },
  "/api-keys": { title: "API Keys", subtitle: "Manage your integration credentials" },
  "/alerts": { title: "Alerts", subtitle: "Monitor system notifications and alerts" },
  "/settings": { title: "Settings", subtitle: "Configure your workspace preferences" },
};

export default function MainLayout() {
  const location = useLocation();
  const info = pageInfo[location.pathname] || { title: "NeuralWatch" };

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar title={info.title} subtitle={info.subtitle} isConnected={true} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}