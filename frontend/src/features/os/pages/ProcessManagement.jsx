import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Layers,
  Shield,
  HardDrive,
  GitBranch,
  Clock,
  Activity,
  Sun,
  Moon,
  CheckCircle2,
  FileCode,
  Binary,
  ArrowRight
} from 'lucide-react';

import { Code } from 'lucide-react';

import {
  ProgramVsProcessCard,
  PcbInspector,
  ProcessStateDiagram,
  ProcessCreationTree,
  ContextSwitchVisualizer,
  ProcessQueuesManager
} from '../components/process';
import { CodeLab } from '../components/code-lab';

export default function ProcessManagement({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('state-diagram');

  const tabs = [
    { id: 'prog-proc', label: '1. Program vs Process & Memory', icon: HardDrive },
    { id: 'pcb', label: '2. Process Control Block (PCB)', icon: Binary },
    { id: 'state-diagram', label: '3. Process State Diagram', icon: Activity },
    { id: 'creation-tree', label: '4. Process Creation & Fork Tree', icon: GitBranch },
    { id: 'context-switch', label: '5. Context Switching Visualizer', icon: Clock },
    { id: 'queues', label: '6. Process Queues (Ready/Job/Device)', icon: Layers },
    { id: 'codelab', label: '7. Code Lab & Execution Terminal', icon: Code },
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
              Process Management
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

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Core Track Module
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  OS Process Management
                </h1>
              </div>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Understand programs vs active processes, examine PCB registers and memory limits, simulate interactive 5-state process transitions (New → Ready → Running → Waiting → Terminated), trace <code className="font-mono text-cyan-600 dark:text-cyan-400">fork()</code>/<code className="font-mono text-cyan-600 dark:text-cyan-400">exec()</code> process creation trees, and animate context switching overhead.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-[#1E2638] overflow-x-auto no-scrollbar">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Sub-module Component Content */}
        <div className="pt-2">
          {activeTab === 'prog-proc' && <ProgramVsProcessCard />}
          {activeTab === 'pcb' && <PcbInspector />}
          {activeTab === 'state-diagram' && <ProcessStateDiagram />}
          {activeTab === 'creation-tree' && <ProcessCreationTree />}
          {activeTab === 'context-switch' && <ContextSwitchVisualizer />}
          {activeTab === 'queues' && <ProcessQueuesManager />}
          {activeTab === 'codelab' && <CodeLab module="process-management" />}
        </div>

        {/* Key Takeaways & Summary Section */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500" />
            <span>Process Management Summary & Key Concepts</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">1. PCB Data Structure</strong>
              <p className="leading-relaxed">
                Kernel data structure storing PID, PC, Registers, Memory Limits, and Open File Descriptors for every process.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">2. Process State Machine</strong>
              <p className="leading-relaxed">
                Processes transition through NEW → READY → RUNNING → WAITING → TERMINATED state transitions driven by hardware interrupts and system calls.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">3. Context Switching Overhead</strong>
              <p className="leading-relaxed">
                Saving P1 registers to PCB1 and restoring P2 registers from PCB2 incurs direct CPU cycle overhead and indirect CPU cache misses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
