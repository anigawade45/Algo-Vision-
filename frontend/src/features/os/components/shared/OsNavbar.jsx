import { Link } from 'react-router-dom';
import { Cpu, LayoutDashboard, Binary, Sun, Moon } from 'lucide-react';

/**
 * Shared Top Navigation Bar for Operating Systems module pages.
 */
export default function OsNavbar({
  title = 'Operating Systems',
  badge = null,
  breadcrumbs = null,
  theme,
  toggleTheme,
  showDsaLink = false
}) {
  return (
    <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Left Branding and Breadcrumbs */}
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/os" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              <Cpu className="w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors hidden sm:inline">
              AlgoVision OS
            </span>
          </Link>

          <span className="text-slate-300 dark:text-slate-700">/</span>

          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400 truncate">
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1.5 truncate">
                  {crumb.path ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors truncate"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold truncate">
                      {crumb.label}
                    </span>
                  )}
                  {idx < breadcrumbs.length - 1 && <span>/</span>}
                </span>
              ))}
            </nav>
          ) : (
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800 truncate">
              {badge || title}
            </span>
          )}
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            to="/os"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors min-h-[38px]"
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span className="hidden sm:inline">OS Home</span>
          </Link>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors min-h-[38px]"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Student Dashboard</span>
            <span className="sm:hidden">Dashboard</span>
          </Link>

          {showDsaLink && (
            <Link
              to="/dsa"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors min-h-[38px]"
            >
              <Binary className="w-3.5 h-3.5 text-indigo-500" />
              <span>DSA Platform</span>
            </Link>
          )}

          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer transition-colors"
              title="Toggle theme mode"
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
