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
  Layers,
  Code2
} from 'lucide-react';
import { TopologyVisualizer } from '../components/fundamentals/TopologyVisualizer';
import { TopologyComparison } from '../components/fundamentals/TopologyComparison';
import { TopologyCodeViewer } from '../components/fundamentals/TopologyCodeViewer';

export default function NetworkTopologies({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('lab'); // 'lab', 'code', or 'compare'
  const [activeTopologyForCode, setActiveTopologyForCode] = useState('bus');

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
        {/* Title & Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Topology Simulator & Code Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Network Topologies & Traffic Simulation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate packet transmissions across Bus, Star, Ring, Mesh, Tree, and Hybrid network layouts. Inspect low-level protocol code (CSMA/CD, Switch CAM, Token Passing, LCA routing), test link cuts, and analyze architectural tradeoffs.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E2638] pb-1 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('lab')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lab'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>Topologies Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Protocol Code & Algorithms</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Tradeoffs Matrix</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'lab' && (
          <TopologyVisualizer
            onCompleteStep={() => setActiveTab('code')}
            onOpenCode={(topoId) => {
              if (topoId) setActiveTopologyForCode(topoId);
              setActiveTab('code');
            }}
            isCompleted={false}
          />
        )}

        {activeTab === 'code' && (
          <TopologyCodeViewer
            defaultTopology={activeTopologyForCode}
            onSwitchToLab={() => setActiveTab('lab')}
          />
        )}

        {activeTab === 'compare' && (
          <TopologyComparison
            onCompleteStep={() => setActiveTab('code')}
            isCompleted={false}
          />
        )}
      </main>
    </div>
  );
}
