import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-terminal-bg text-terminal-text selection:bg-terminal-accent/20">
      <Sidebar />
      <main className="flex-1 ml-[260px] overflow-x-hidden relative z-10">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-terminal-accent/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-40 right-1/4 w-[500px] h-[500px] bg-terminal-magenta/3 rounded-full blur-[120px] pointer-events-none" />
        
        {children}
      </main>
    </div>
  );
}