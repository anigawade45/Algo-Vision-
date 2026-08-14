import React from 'react';
import { Zap, GitCommit, Sparkles, Compass, Trophy } from 'lucide-react';

export function TrustStrip() {
  const items = [
    { icon: Zap, label: 'Interactive Learning' },
    { icon: GitCommit, label: 'Step-by-Step Execution' },
    { icon: Sparkles, label: 'AI Explanations' },
    { icon: Compass, label: 'Real-Time Visualization' },
    { icon: Trophy, label: 'Progress Tracking' },
  ];

  return (
    <section className="py-5 border-t border-slate-200/80 dark:border-[#1C2638] bg-slate-50 dark:bg-[#05070E] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center lg:text-left shrink-0">
            Built to make Computer Science easier to understand.
          </p>

          <div className="flex items-center justify-center lg:justify-end gap-3 sm:gap-5 lg:gap-6 overflow-x-auto w-full lg:w-auto scrollbar-none py-0.5">
            {items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group shrink-0"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
