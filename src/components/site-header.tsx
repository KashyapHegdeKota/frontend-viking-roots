import { Link } from 'react-router-dom';
import { ThemeToggle } from './theme-toggle';
import { KinLogo } from './kin-logo';

export function SiteHeader() {
  const username = localStorage.getItem('username') || '';
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--surface-border)] bg-[var(--surface-bg)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to={username ? "/dashboard" : "/"} className="flex items-center gap-2">
          <KinLogo size={30} />
          <span className="text-lg font-bold text-[var(--surface-fg)]">Viking Roots</span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-5">
          <Link to="/feed" className="text-sm font-semibold text-[var(--surface-fg)]/85 hover:text-[#c88a65]">
            Feed
          </Link>
          <Link to="/groups" className="text-sm font-semibold text-[var(--surface-fg)]/85 hover:text-[#c88a65]">
            Groups
          </Link>
          <Link to={username ? `/profile/${username}` : '/profile'} className="text-sm font-semibold text-[var(--surface-fg)]/85 hover:text-[#c88a65]">
            Profile
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
