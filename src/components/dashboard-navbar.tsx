import { useState } from "react";
import { Link } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";

export function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const username = localStorage.getItem('username') || '';
  const userInitial = username ? username[0].toUpperCase() : '?';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#0a0a0a]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex shrink-0 items-center gap-3">
          <KinLogo size={36} />
          <span className="text-lg font-bold text-white">KinSnap</span>
        </Link>

        {/* Search bar */}
        <div className="relative hidden max-w-md flex-1 md:block">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6b7280"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search people, photos, circles..."
            className="h-10 w-full rounded-full border border-[#262626] bg-[#171717] pl-10 pr-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#e4bd46] focus:ring-1 focus:ring-[#e4bd46]/40"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Upload button */}
          <Link
            to="/dashboard"
            className="hidden items-center gap-2 rounded-md border border-[#262626] bg-[#171717] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#e4bd46] hover:text-[#e4bd46] sm:flex"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Upload
          </Link>

          {/* Notifications */}
          <button className="relative rounded-full p-2 text-white/60 transition-colors hover:text-[#e4bd46]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#e4bd46]" />
          </button>

          {/* User dropdown */}
          <Link to={username ? `/profile/${username}` : '/profile'} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4bd46] text-sm font-bold text-[#0a0a0a]">
              {userInitial}
            </div>
            <span className="hidden text-sm font-semibold text-white sm:inline">{username || 'Profile'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden sm:block">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
}
