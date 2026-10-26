import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  LayoutDashboard,
  Layers,
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Lock,
  Unlock,
  Package,
  Database,
  CheckCircle2,
  BookOpen,
  Sun,
  Moon,
  Code
} from 'lucide-react';

import {
  SyncIntro,
  RaceConditionSimulator,
  CriticalSectionRequirements,
  MutexSimulator,
  SemaphoreSimulator,
  ProducerConsumerSimulator,
  ReadersWritersSimulator
} from '../components/process-synchronization';
import { CodeLab } from '../components/code-lab';

export default function ProcessSynchronization({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('race-condition');

  const navTabs = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'race-condition', label: '2. Race Condition Simulator', icon: ShieldAlert, badge: 'Interactive' },
    { id: 'cs-requirements', label: '3. Critical Section & Criteria', icon: ShieldCheck },
    { id: 'mutex', label: '4. Mutex / Lock Visualizer', icon: Lock },
    { id: 'semaphore', label: '5. Semaphore Visualizer', icon: Layers },
    { id: 'producer-consumer', label: '6. Producer-Consumer', icon: Package },
    { id: 'readers-writers', label: '7. Readers-Writers', icon: Database },
    { id: 'summary', label: '8. Key Summary & Comparison', icon: CheckCircle2 },
    { id: 'codelab', label: '9. Code Lab & Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/os" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-600/20">
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
              <Link to="/os" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                Operating Systems
              </Link>
              <span>/</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold truncate max-w-[150px] sm:max-w-none">
                Process Synchronization
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to OS Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition-colors"
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
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Concurrency Control Engine
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Process Synchronization
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Coordinate concurrent processes accessing shared memory. Step through race conditions, Critical Section requirements, Mutex locks, Semaphores, Bounded Buffer Producer-Consumer, and Readers-Writers database access.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selector Bar */}
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
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2638]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Tab View */}
        <div className="space-y-8">
          {activeTab === 'intro' && <SyncIntro />}

          {activeTab === 'race-condition' && <RaceConditionSimulator />}

          {activeTab === 'cs-requirements' && <CriticalSectionRequirements />}

          {activeTab === 'mutex' && <MutexSimulator />}

          {activeTab === 'semaphore' && <SemaphoreSimulator />}

          {activeTab === 'producer-consumer' && <ProducerConsumerSimulator />}

          {activeTab === 'readers-writers' && <ReadersWritersSimulator />}

          {activeTab === 'summary' && (
            <div className="space-y-8">
              {/* Comparison Summary Matrix */}
              <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Synchronization Primitive Comparison</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Side-by-side comparison of Mutex, Binary Semaphore, and Counting Semaphore</p>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-slate-200 dark:border-[#1E2638] rounded-xl bg-slate-50/50 dark:bg-[#070A12]">
                  <table className="w-full text-left font-mono text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1E2638]">
                      <tr>
                        <th className="p-4 font-bold">Primitive / Concept</th>
                        <th className="p-4 font-bold">Capacity / State</th>
                        <th className="p-4 font-bold">Key Characteristics</th>
                        <th className="p-4 font-bold">Typical Use Case</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-amber-600 dark:text-amber-400">Mutex (Lock)</td>
                        <td className="p-4 text-emerald-600 dark:text-emerald-400">0 or 1 (Binary)</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Has strict ownership. Only the thread that acquired the lock can release it.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Protecting a single shared counter or critical region.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">Binary Semaphore</td>
                        <td className="p-4 text-emerald-600 dark:text-emerald-400">0 or 1</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">No ownership. Any thread can trigger signal(S) to wake waiting thread.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Thread signaling and turn-taking coordination.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-purple-600 dark:text-purple-400">Counting Semaphore</td>
                        <td className="p-4 text-purple-600 dark:text-purple-400">0 to N Permits</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Allows up to N threads to enter CS simultaneously. Tracks resource permits.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Managing bounded resources like connection pools or slots.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Producer-Consumer</td>
                        <td className="p-4 text-amber-600 dark:text-amber-400">Bounded Buffer (Size K)</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Uses empty, full, and mutex semaphores to sync production & consumption.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Task queues, pipe streaming, audio buffers.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">Readers-Writers</td>
                        <td className="p-4 text-indigo-600 dark:text-indigo-400">Shared DB / File</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Allows multiple readers simultaneously, but exclusive single writer.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Database caching, shared document editing.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaways Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Race Conditions Cause Silent Bug Hazards</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Without synchronization, non-atomic operations (read-modify-write) yield erratic non-deterministic results depending on exact CPU scheduling interleavings.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Always Satisfy 3 Core Criteria</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    A valid synchronization protocol must satisfy Mutual Exclusion (safety), Progress (liveness), and Bounded Waiting (starvation prevention).
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                    <Layers className="w-5 h-5" />
                    <span>Choose the Right Primitive</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Use Mutex for exclusive resource locks, Semaphores for permit tracking & signal events, and RW locks for read-heavy workloads.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'codelab' && <CodeLab module="process-synchronization" />}
        </div>
      </main>
    </div>
  );
}
