import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  LayoutDashboard,
  Disc,
  Sliders,
  BookOpen,
  Sun,
  Moon,
  RefreshCw,
  Compass
} from 'lucide-react';

import { Code } from 'lucide-react';

import {
  DiskIntro,
  DiskSimulator,
  DiskComparison
} from '../components/disk-scheduling';
import { CodeLab } from '../components/code-lab';

export default function DiskScheduling({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');

  const navTabs = [
    { id: 'intro', label: '1. Overview & Concepts', icon: BookOpen },
    { id: 'simulator', label: '2. Interactive Disk Simulator', icon: Compass, badge: 'Interactive' },
    { id: 'comparison', label: '3. Multi-Algorithm Benchmark', icon: Sliders, badge: 'Benchmark' },
    { id: 'codelab', label: '4. Code Lab & Execution Terminal', icon: Code, badge: 'IDE' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AlgoVision OS
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/os" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                OS
              </Link>
              <span>/</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                Disk Scheduling Algorithms
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span className="hidden sm:inline">OS Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Student Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </Link>

            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer transition-colors"
                title="Toggle theme mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Secondary Storage & I/O
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Disk Scheduling Algorithms
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Step through read/write head movement across disk tracks. Compare FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK seek policies in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-[#1E2638] overflow-x-auto no-scrollbar">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max pb-2">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 font-bold shadow-md'
                      : 'bg-white dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2638]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white dark:bg-slate-900/40 dark:text-slate-950'
                          : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab Content */}
        <div className="space-y-8">
          {activeTab === 'intro' && <DiskIntro />}

          {activeTab === 'simulator' && <DiskSimulator />}

          {activeTab === 'comparison' && <DiskComparison />}

          {activeTab === 'codelab' && <CodeLab module="disk-scheduling" />}
        </div>
      </main>
    </div>
  );
}
