import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, 
  ArrowLeft, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  GitFork, 
  Scale, 
  Sparkles, 
  CheckCircle2,
  Layers
} from 'lucide-react';
import { TopologyVisualizer } from '../components/fundamentals/TopologyVisualizer';
import { TopologyComparison } from '../components/fundamentals/TopologyComparison';

export default function NetworkTopologies({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('lab'); // 'lab' or 'compare'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/cn" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AlgoVision CN
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/cn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Computer Networks
              </Link>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Topologies & Simulation
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              to="/cn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CN Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>INTERACTIVE TOPOLOGY SIMULATOR</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Network Topologies & Traffic Simulation
              </h1>

              <p className="text-emerald-100 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
                Simulate packet transmissions across Bus, Star, Ring, Mesh, Tree, and Hybrid network layouts. Test link cuts and node failures in real time, and analyze architecture tradeoffs side-by-side.
              </p>
            </div>

            {/* Quick Navigation Toggle */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex items-center gap-1.5 self-start lg:self-center">
              <button
                onClick={() => setActiveTab('lab')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'lab'
                    ? 'bg-white text-emerald-800 shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Topologies Lab & Simulator</span>
              </button>

              <button
                onClick={() => setActiveTab('compare')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'compare'
                    ? 'bg-white text-emerald-800 shadow-md font-extrabold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare & Tradeoffs Matrix</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'lab' ? (
          <TopologyVisualizer
            onCompleteStep={() => setActiveTab('compare')}
            isCompleted={false}
          />
        ) : (
          <TopologyComparison
            onCompleteStep={() => setActiveTab('lab')}
            isCompleted={false}
          />
        )}
      </main>
    </div>
  );
}
