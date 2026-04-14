import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KinLogo } from "@/components/kin-logo";
import { LoginModal } from "@/components/login-modal";
import { SignUpModal } from "@/components/sign-up-modal";

export function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [loginOpen, setLoginOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);

  // Check auth state
  const username = localStorage.getItem('username');
  const userInitial = username ? username[0].toUpperCase() : '?';

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#262626] bg-[#0a0a0a]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3" aria-label="Main navigation">
        
        {/* 1. Dynamic Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <KinLogo size={36} />
          <span className="text-lg font-bold text-white">Viking Roots</span>
        </Link>

        {/* 2. Center Search Bar (ONLY VISIBLE IF LOGGED IN) */}
        {username && (
          <div className="relative hidden max-w-md flex-1 md:block">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search people, photos, circles..."
              className="h-10 w-full rounded-full border border-[#262626] bg-[#171717] pl-10 pr-4 text-sm text-white placeholder-[#6b7280] outline-none transition-colors focus:border-[#c88a65] focus:ring-1 focus:ring-[#c88a65]/40"
            />
          </div>
        )}

        {/* 3. Right Side Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          {username ? (
            // ==========================================
            // LOGGED IN STATE
            // ==========================================
            <>
              {/* Feed Button */}
               <Link to={username ? "/dashboard" : "/"} className="hidden items-center gap-2 rounded-md border border-[#262626] bg-[#171717] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#c88a65] hover:text-[#c88a65] sm:flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                Feed
              </Link>

              {/* Upload Button */}
              <Link to="/dashboard/upload" className="hidden items-center gap-2 rounded-md border border-[#262626] bg-[#171717] px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-[#c88a65] hover:text-[#c88a65] sm:flex">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Upload
              </Link>

              {/* Notifications */}
              <button className="relative hidden sm:block rounded-full p-2 text-white/60 transition-colors hover:text-[#c88a65]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#c88a65]" />
              </button>

              {/* User Avatar Profile Link */}
              <div className="flex items-center gap-4 pl-2 sm:pl-4 sm:border-l sm:border-[#262626]">
                <Link to={`/profile`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c88a65] text-sm font-bold text-[#0a0a0a]">
                    {userInitial}
                  </div>
                  <span className="hidden text-sm font-semibold text-white md:inline">{username}</span>
                </Link>
                
                {/* Log Out Button */}
                <button onClick={handleLogout} className="text-xs font-bold text-white/40 hover:text-white transition-colors uppercase tracking-wider">
                  Log Out
                </button>
              </div>
            </>
          ) : (
            // ==========================================
            // LOGGED OUT STATE
            // ==========================================
            <>
              <Link to="/projects" className="text-base font-semibold text-white transition-colors hover:text-[#c88a65]">
                Explore A Project
              </Link>
              <button onClick={() => setLoginOpen(true)} className="text-base font-semibold text-white transition-colors hover:text-[#c88a65]">
                Log In
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Render Modals ONLY if the user is logged out */}
      {!username && (
        <>
          <LoginModal
            open={loginOpen}
            onClose={() => setLoginOpen(false)}
            onSignUpClick={() => {
              setLoginOpen(false);
              setSignUpOpen(true);
            }}
          />
          <SignUpModal
            open={signUpOpen}
            onClose={() => setSignUpOpen(false)}
          />
        </>
      )}
    </header>
  );
}