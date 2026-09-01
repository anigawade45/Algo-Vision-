import React from 'react';
import { Bell, User, ChevronRight, Terminal, Sun, Moon } from 'lucide-react';

export function DsaNavbar({ theme, toggleTheme, onNavigateToLanding }) {
  return (
    <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left: Brand & Breadcrumb (3. Navbar: Dashboard / DSA) */}
        <div className="flex items-center gap-3">
          <div
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AlgoVision
            </span>
          </div>

          <div className="h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1"></div>

          {/* DSA-specific Breadcrumb: Dashboard / DSA */}
          <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            <span
              onClick={onNavigateToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer"
            >
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold">DSA</span>
          </nav>
        </div>

        {/* Right: Actions (Theme Toggle, Notifications 🔔, Profile Avatar) */}
        <div className="flex items-center gap-3">
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          <button className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500"></span>
          </button>

          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-200 dark:ring-slate-800 cursor-pointer">
            <User className="w-4 h-4" />
          </div>
        </div>

      </div>
    </header>
  );
}
