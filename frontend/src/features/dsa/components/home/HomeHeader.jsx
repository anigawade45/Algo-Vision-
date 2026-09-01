import React from 'react';
import { Terminal, Sparkles, Cpu, History, Layers } from 'lucide-react';

export function HomeHeader({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'workspace', label: 'Problem Decomposition', icon: Cpu },
    { id: 'patterns', label: 'Pattern Explorer', icon: Layers },
    { id: 'recent', label: 'Recent Sessions', icon: History },
  ];

  return (
    <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white/80 dark:bg-[#0B101D]/80 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between py-3.5 gap-4">
        
        {/* Workspace Identity */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-mono font-bold text-sm">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-white text-sm">AlgoVision</span>
                <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  WORKSPACE v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Step-by-Step Problem Solver</p>
            </div>
          </div>

          <div className="sm:hidden flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Ready</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#05070E] p-1 rounded-xl border border-slate-200 dark:border-[#1E2638] w-full sm:w-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white dark:bg-[#0F172A] text-slate-900 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-700/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
