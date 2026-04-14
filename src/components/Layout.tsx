import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0a]">
      {/* The unified Navbar stays locked at the top */}
      <Navbar />
      
      {/* The Outlet swaps between Dashboard, Profile, Feed, etc. */}
      <main className="flex-1">
        <Outlet /> 
      </main>
    </div>
  );
}