import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OsArchitectureViewer from '../components/fundamentals/OsArchitectureViewer';
import ModeTransitionSimulator from '../components/fundamentals/ModeTransitionSimulator';
import BootProcessVisualizer from '../components/fundamentals/BootProcessVisualizer';
import KernelComparisonTable from '../components/fundamentals/KernelComparisonTable';
import SystemCallExplorer from '../components/fundamentals/SystemCallExplorer';
import OsTypesGrid from '../components/fundamentals/OsTypesGrid';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Binary,
  Sun,
  Moon,
  Layers,
  Shield,
  Power,
  FileCode,
  Grid
} from 'lucide-react';

export default function OsFundamentals({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('architecture');

  const tabs = [
    { id: 'architecture', label: '1. OS Architecture (5-Layer Stack)', icon: Layers },
    { id: 'dualmode', label: '2. Dual Mode & System Calls', icon: Shield },
    { id: 'boot', label: '3. Bootloader & Boot Process', icon: Power },
    { id: 'kernel', label: '4. Kernel Architecture', icon: Cpu },
    { id: 'syscalls', label: '5. System Call Explorer', icon: FileCode },
    { id: 'ostypes', label: '6. Types of OS', icon: Grid }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AlgoVision
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/40 px-2.5 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-800">
              OS Fundamentals
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors min-h-[38px]"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span>OS Home</span>
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
                className="p-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
                title="Toggle theme mode"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Operating System Fundamentals
              </h1>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Master the core foundations of operating systems: OS goals & functions, 5-layer system architecture, dual-mode execution (User Mode vs Kernel Mode), system call transitions, kernel design trade-offs, and step-by-step bootloader mechanics.
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold shrink-0">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE CONCEPT TRACK</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-[#1E2638]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500'
                    : 'bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="space-y-6">
          {activeTab === 'architecture' && <OsArchitectureViewer />}
          {activeTab === 'dualmode' && <ModeTransitionSimulator />}
          {activeTab === 'boot' && <BootProcessVisualizer />}
          {activeTab === 'kernel' && <KernelComparisonTable />}
          {activeTab === 'syscalls' && <SystemCallExplorer />}
          {activeTab === 'ostypes' && <OsTypesGrid />}
        </div>
      </main>
    </div>
  );
}
