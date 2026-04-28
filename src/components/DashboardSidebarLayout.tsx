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
        
        <main className="w-full min-w-0 flex-1 border-[#262626] px-3 py-4 pb-24 sm:px-5 lg:border-l lg:p-6">
          {/* Outlet injects UserProfile, SettingsPage, or DashboardPage here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
