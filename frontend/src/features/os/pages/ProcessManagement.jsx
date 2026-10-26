import { useState } from 'react';
import {
  Layers,
  HardDrive,
  GitBranch,
  Clock,
  Activity,
  CheckCircle2,
  Binary,
  Code
} from 'lucide-react';

import {
  ProgramVsProcessCard,
  PcbInspector,
  ProcessStateDiagram,
  ProcessCreationTree,
  ContextSwitchVisualizer,
  ProcessQueuesManager
} from '../components/process';
import { CodeLab } from '../components/code-lab';
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

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
      <OsNavbar
        badge="Process Management"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Core Track Module"
          badgeColor="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
          title="OS Process Management"
          description="Understand programs vs active processes, examine PCB registers and memory limits, simulate interactive 5-state process transitions (New → Ready → Running → Waiting → Terminated), trace fork()/exec() process creation trees, and animate context switching overhead."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

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
