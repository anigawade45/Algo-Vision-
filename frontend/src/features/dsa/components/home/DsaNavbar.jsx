import React, { useState } from 'react';
import { Bell, User, ChevronRight, Terminal, Sun, Moon, PlusCircle, Menu, X } from 'lucide-react';

export function DsaNavbar({ theme, toggleTheme, onNavigateToLanding, onNavigateToHome, onNavigateToSubmit }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        
        {/* Left: Brand & Breadcrumbs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 cursor-pointer group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="AlgoVision Home"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
              <Terminal className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AlgoVision
            </span>
          </button>

          <div className="hidden sm:block h-4 w-[1px] bg-slate-300 dark:bg-slate-700 mx-1" aria-hidden="true" />

          {/* Desktop Breadcrumbs */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 font-mono" aria-label="Breadcrumb navigation">
            <button
              type="button"
              onClick={onNavigateToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              AlgoVision
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <button
              type="button"
              onClick={onNavigateToHome || onNavigateToLanding}
              className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors cursor-pointer rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              DSA
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold" aria-current="page">
              Home
            </span>
          </nav>
        </div>

        {/* Right Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {onNavigateToSubmit && (
            <button
              type="button"
              onClick={onNavigateToSubmit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-h-[40px]"
            >
              <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>New Problem</span>
            </button>
          )}

          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Toggle theme mode"
              aria-label="Toggle light and dark theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              )}
            </button>
          )}

          <button
            type="button"
            className="p-2.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors relative cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500" aria-hidden="true" />
          </button>

          <div
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-slate-200 dark:ring-slate-800 cursor-pointer"
            role="img"
            aria-label="User avatar"
          >
            <User className="w-4 h-4" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile Right Controls: Theme Toggle & Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          {toggleTheme && (
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
              aria-label="Toggle light and dark theme mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-slate-100 dark:bg-[#161F33] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#1E2638] min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-blue-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] px-4 py-4 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          
          {onNavigateToSubmit && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateToSubmit();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 cursor-pointer min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>New Problem</span>
            </button>
          )}

          {/* Mobile Breadcrumb Path */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100 dark:border-slate-800/80 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Location:</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => { setMobileMenuOpen(false); onNavigateToLanding(); }} className="text-blue-500 font-bold hover:underline">
                AlgoVision
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 dark:text-white font-bold">DSA Home</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300 py-2 cursor-pointer min-h-[44px]"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-blue-500" />
              <span>Notifications</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
              <span>Profile</span>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
