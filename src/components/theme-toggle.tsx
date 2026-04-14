import { useTheme } from '@/context/theme-context';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full border border-[#3a3a3a] px-3 py-1.5 text-xs font-semibold text-[var(--surface-fg)] transition-colors hover:border-[#c88a65] hover:text-[#c88a65]"
      aria-label="Toggle color theme"
      title="Toggle color theme"
    >
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
