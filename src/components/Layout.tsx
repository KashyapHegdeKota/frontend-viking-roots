import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export function Layout() {
  return (
    // Changed bg-[#0a0a0a] to bg-background
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      
      <main className="flex-1">
        <Outlet /> 
      </main>
    </div>
  );
}