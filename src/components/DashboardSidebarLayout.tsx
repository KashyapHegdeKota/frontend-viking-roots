import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardSidebarLayout() {
  return (
    // 1. Swap bg-[#0a0a0a] for bg-background
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      {/* Global Navbar */}
      <Navbar />
      
      {/* 2. Main content area container */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar />
        
        {/* 3. Swap border-[#262626] for border-border */}
        <main className="flex-1 p-6 border-l border-border transition-colors duration-300">
          {/* Outlet injects UserProfile, SettingsPage, or DashboardPage here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}