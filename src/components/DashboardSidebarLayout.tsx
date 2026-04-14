import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardSidebarLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      {/* 1. Global Navbar at the very top */}
      <Navbar />
      
      {/* 2. Main content area with Sidebar and dynamic page content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1">
        <DashboardSidebar />
        
        <main className="flex-1 p-6 border-l border-[#262626]">
          {/* Outlet injects UserProfile, SettingsPage, or DashboardPage here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}