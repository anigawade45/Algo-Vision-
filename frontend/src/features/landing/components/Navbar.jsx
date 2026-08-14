import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X } from 'lucide-react';

export function Navbar({ theme, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Modules', href: '#modules' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Visualizations', href: '#flagship-visualizer' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 h-16 sm:h-18 flex items-center ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-sm border-b border-slate-200/80 dark:border-slate-800/80 shadow-2xs'
          : 'bg-transparent border-b border-slate-200/50 dark:border-slate-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          
          {/* LEFT: Logo + Subtle B.Tech Tag (Inter font throughout) */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xs flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="7" height="7" rx="1.5" />
                <rect x="15" y="3" width="7" height="7" rx="1.5" />
                <rect x="8.5" y="14" width="7" height="7" rx="1.5" />
                <path d="M5.5 10v2a2 2 0 0 0 2 2h4.5" />
                <path d="M18.5 10v2a2 2 0 0 1-2 2h-4.5" />
              </svg>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-lg sm:text-[19px] font-semibold tracking-tight text-slate-900 dark:text-white font-sans">
                AlgoVision
              </span>
            </div>
          </a>

          {/* CENTER: Clean Text Navigation (Inter 14px 500) */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors font-sans"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* RIGHT: Actions (Inter 14-15px 600) */}
          <div className="hidden md:flex items-center gap-4 font-sans">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <a
              href="#dashboard"
              className="text-[14px] font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2 py-1 transition-colors"
            >
              Log In
            </a>

            <a
              href="#flagship-visualizer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] shadow-xs transition-colors"
            >
              <span>Start Learning</span>
            </a>
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white dark:bg-[#0B0F19] border-b border-slate-200 dark:border-slate-800 px-6 py-5 space-y-4 shadow-lg font-sans">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[15px] font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 py-1.5"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium"
            >
              Log In
            </a>
            <a
              href="#flagship-visualizer"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm"
            >
              <span>Start Learning Free</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
