import { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Layers,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Minimize2,
  Box,
  Code
} from 'lucide-react';

import {
  MemoryIntro,
  AddressTranslationVisualizer,
  AllocationStrategies,
  FragmentationVisualizer,
  MemorySimulator
} from '../components/memory-management';
import { CodeLab } from '../components/code-lab';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

export default function MemoryManagement({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');

  const navTabs = [
    { id: 'intro', label: '1. Overview', icon: BookOpen },
    { id: 'translation', label: '2. Address Translation & MMU', icon: Cpu },
    { id: 'simulator', label: '3. Memory Simulator', icon: HardDrive },
    { id: 'strategies', label: '4. Allocation Strategies', icon: Layers },
    { id: 'fragmentation', label: '5. Fragmentation & Compaction', icon: Box },
    { id: 'summary', label: '6. Key Takeaways', icon: CheckCircle2 },
    { id: 'codelab', label: '7. Code Lab & Terminal', icon: Code }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Header */}
      <OsNavbar
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'OS', path: '/os' },
          { label: 'Memory Management' }
        ]}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Memory Management Track"
          title="Memory Management & Allocation"
          description="Explore logical to physical address translation, MMU relocation registers, First/Best/Worst Fit allocation algorithms, internal & external fragmentation metrics, and memory compaction."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={navTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Active Tab Content */}
        <div className="space-y-8">
          {activeTab === 'intro' && <MemoryIntro />}
          {activeTab === 'translation' && <AddressTranslationVisualizer />}
          {activeTab === 'simulator' && <MemorySimulator />}
          {activeTab === 'strategies' && <AllocationStrategies />}
          {activeTab === 'fragmentation' && <FragmentationVisualizer />}

          {activeTab === 'summary' && (
            <div className="space-y-8">
              {/* Summary Matrix */}
              <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Memory Management Concepts Matrix</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Core architectural components and allocation strategies summary</p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-[#1E2638] rounded-xl bg-slate-50/50 dark:bg-[#070A12]">
                  <table className="w-full text-left font-mono text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-100 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1E2638]">
                      <tr>
                        <th className="p-4 font-bold">Concept</th>
                        <th className="p-4 font-bold">Formula / Rule</th>
                        <th className="p-4 font-bold">Key Characteristics</th>
                        <th className="p-4 font-bold">Primary Advantage / Trade-off</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-amber-600 dark:text-amber-400">Address Translation</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Physical = Base + Logical</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Requires Logical &lt; Limit check. Performed dynamically by hardware MMU.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Provides memory isolation and process protection.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-blue-600 dark:text-blue-400">First Fit</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">First Hole &ge; Size</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Scans memory from top and chooses first hole that is large enough.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Fastest search performance.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400">Best Fit</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Min Hole &ge; Size</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Searches all holes to pick smallest suitable hole.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Minimizes leftover hole size per allocation.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-purple-600 dark:text-purple-400">Worst Fit</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Max Hole &ge; Size</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Allocates into the largest available free block.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Leaves larger remaining free fragments.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-rose-600 dark:text-rose-400">Internal Fragmentation</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Partition Size - Process Size</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Wasted memory trapped INSIDE assigned fixed partition.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Common in fixed partitioning.</td>
                      </tr>
                      <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                        <td className="p-4 font-bold text-rose-600 dark:text-rose-400">External Fragmentation</td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">Total Free - Largest Hole</td>
                        <td className="p-4 text-slate-700 dark:text-slate-300">Free memory exists but is split into non-contiguous holes.</td>
                        <td className="p-4 text-slate-500 dark:text-slate-400">Resolved via Memory Compaction.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Key Takeaways Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                    <Cpu className="w-5 h-5" />
                    <span>Dynamic Relocation via MMU</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Execution-time binding allows processes to be loaded anywhere in RAM and moved dynamically using base (relocation) and limit registers.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                    <ShieldAlert className="w-5 h-5" />
                    <span>Contiguous Constraint & Ext. Frag</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Contiguous allocation requires a process to occupy one single continuous block of RAM. Scatter holes cause external fragmentation.
                  </p>
                </div>

                <div className="p-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <Minimize2 className="w-5 h-5" />
                    <span>Compaction Consolidates Holes</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Compaction shifts allocated processes toward lower memory addresses, merging scattered free memory holes into one large contiguous block.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'codelab' && <CodeLab module="memory-management" />}
        </div>
      </main>
    </div>
  );
}
