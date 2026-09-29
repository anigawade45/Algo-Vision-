import React from 'react';
import { Eye, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-100 dark:bg-[#05070E] border-t border-slate-200/80 dark:border-[#1C2638] pt-16 pb-12 text-slate-600 dark:text-slate-400 font-sans transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Left Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 w-fit" aria-label="AlgoVision Homepage">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-sm">
                <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
                  <Eye className="w-4 h-4 text-blue-400" aria-hidden="true" />
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-sans">
                Algo<span className="text-blue-600 dark:text-[#3B82F6]">Vision</span>
              </span>
            </a>

            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
              "Visualize. Understand. Master."
            </p>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              AlgoVision transforms complex Computer Science concepts into interactive visual experiences for students worldwide.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="GitHub Repository"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="LinkedIn Profile"
                aria-label="LinkedIn Profile"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="mailto:contact@algovision.edu"
                className="p-2 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                title="Email Contact"
                aria-label="Email Contact"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links Column 1: PRODUCT */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-bold uppercase tracking-wider block">
              PRODUCT
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#modules" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Modules</a></li>
              <li><a href="#ai" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">AI Tutor</a></li>
              <li><a href="#differentiator" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Difference</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">FAQ</a></li>
            </ul>
          </div>

          {/* Links Column 2: LEARN */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-bold uppercase tracking-wider block">
              LEARN
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#domains-overview" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">DSA</a></li>
              <li><a href="#domains-overview" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Operating Systems</a></li>
              <li><a href="#domains-overview" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Networks</a></li>
              <li><a href="#domains-overview" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">System Design</a></li>
            </ul>
          </div>

          {/* Links Column 3: PROJECT */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-bold uppercase tracking-wider block">
              PROJECT
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">B.Tech Final Project</a></li>
              <li><a href="mailto:contact@algovision.edu" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Contact Us</a></li>
            </ul>
          </div>

          {/* Links Column 4: RESOURCES */}
          <div className="space-y-3">
            <span className="text-xs font-mono text-slate-900 dark:text-white font-bold uppercase tracking-wider block">
              RESOURCES
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Documentation</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">FAQ</a></li>
              <li><a href="#faq" className="hover:text-blue-600 dark:hover:text-white transition-colors rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Help Center</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            © 2026 AlgoVision. Built as a B.Tech Final-Year Project.
          </div>

          <div className="flex items-center gap-1.5">
            <span>Made for Computer Science learners.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

