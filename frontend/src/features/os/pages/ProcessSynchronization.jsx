import { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Package,
  Database,
  CheckCircle2,
  BookOpen,
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
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

export default function ProcessSynchronization({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('race-condition');

  const navTabs = [
    { id: 'intro', label: '1. Introduction', icon: BookOpen },
    { id: 'race-condition', label: '2. Race Condition Simulator', icon: ShieldAlert },
    { id: 'cs-requirements', label: '3. Critical Section & Criteria', icon: ShieldCheck },
    { id: 'mutex', label: '4. Mutex / Lock Visualizer', icon: Lock },
    { id: 'semaphore', label: '5. Semaphore Visualizer', icon: Layers },
    { id: 'producer-consumer', label: '6. Producer-Consumer', icon: Package },
    { id: 'readers-writers', label: '7. Readers-Writers', icon: Database },
    { id: 'summary', label: '8. Key Summary & Comparison', icon: CheckCircle2 },
    { id: 'codelab', label: '9. Code Lab & Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <OsNavbar
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'OS', path: '/os' },
          { label: 'Process Synchronization' }
        ]}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Concurrency Control Engine"
          badgeColor="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
          title="Process Synchronization"
          description="Coordinate concurrent processes accessing shared memory. Step through race conditions, Critical Section requirements, Mutex locks, Semaphores, Bounded Buffer Producer-Consumer, and Readers-Writers database access."
        />

        {/* Tab Selector Bar */}
        <OsTabs
          tabs={navTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

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
                        <th className="p-4 font-bold">Ownership & Signals</th>
                        <th className="p-4 font-bold">Best Used For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">Mutex Lock</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Binary (0 or 1)</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Strict ownership semantics. Only thread that acquired lock may release it.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Owned by locker thread.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Mutual exclusion for a single critical resource.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">Binary Semaphore</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">0 or 1</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Signaling mechanism. Any thread can signal or wait on the semaphore.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">No strict ownership requirement.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Task coordination & synchronization events.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Counting Semaphore</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Non-negative integer (N)</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Tracks number of available resource permits. Blocks when count reaches 0.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">No ownership; shared pool.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Resource pool management (e.g. buffer slots).</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaways Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Race Conditions Cause Bugs</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Unsynchronized concurrent execution produces non-deterministic data corruption when non-atomic read-modify-write sequences interleave.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    <span>Three Critical Criteria</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Any correct critical section solution must strictly guarantee Mutual Exclusion, Progress, and Bounded Waiting without starvation.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
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
