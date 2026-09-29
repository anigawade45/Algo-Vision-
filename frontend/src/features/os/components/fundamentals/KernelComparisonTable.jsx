import React, { useState } from 'react';
import { Cpu, Check, AlertCircle, Shield, Zap, Layers } from 'lucide-react';

export default function KernelComparisonTable() {
  const [activeTab, setActiveTab] = useState('monolithic');

  const kernelTypes = {
    monolithic: {
      title: 'Monolithic Kernel Architecture',
      tagline: 'All OS services run in single Kernel Space (Ring 0)',
      advantages: [
        'Maximum performance: Direct function calls instead of IPC message passing',
        'Shared memory space between drivers and core kernel routines',
        'Proven high throughput for compute-heavy workloads'
      ],
      disadvantages: [
        'Single Point of Failure: A buggy device driver crash crashes the entire OS (Kernel Panic / BSOD)',
        'Massive code footprint makes auditing and debugging complex',
        'Difficult to patch without full kernel recompilation or live-patch modules'
      ],
      examples: ['Linux Kernel', 'MS-DOS', 'Traditional Unix'],
      diagram: [
        { name: 'User Applications (Ring 3)', type: 'user' },
        { name: 'SYSTEM CALL INTERFACE', type: 'boundary' },
        { name: 'Process Scheduler • Memory Manager • File Systems • IPC • Device Drivers (Ring 0)', type: 'kernel' },
        { name: 'PHYSICAL HARDWARE', type: 'hardware' }
      ]
    },
    microkernel: {
      title: 'Microkernel Architecture',
      tagline: 'Minimal kernel in Ring 0; OS services run as User Processes in Ring 3',
      advantages: [
        'High Fault Tolerance & Stability: If a driver crashes, only that user process restarts',
        'Enhanced Security: System services run with restricted User Mode privileges',
        'Extensible & modular: Easy to add new file systems or protocols without modifying kernel core'
      ],
      disadvantages: [
        'Performance Overhead: Requires IPC message passing & context switching between Ring 3 and Ring 0',
        'Slower execution speed compared to monolithic kernels'
      ],
      examples: ['Mach', 'QNX (Real-Time OS)', 'Minix 3', 'L4 Microkernel'],
      diagram: [
        { name: 'User Apps • File System Server • Network Server • Device Drivers (Ring 3)', type: 'user' },
        { name: 'IPC & SYSTEM CALL INTERFACE', type: 'boundary' },
        { name: 'Basic CPU Scheduling • Virtual Memory Allocation • IPC Core (Ring 0)', type: 'kernel' },
        { name: 'PHYSICAL HARDWARE', type: 'hardware' }
      ]
    },
    hybrid: {
      title: 'Hybrid Kernel Architecture',
      tagline: 'Combines Microkernel modularity with Monolithic performance',
      advantages: [
        'Balances performance and stability by running critical subsystems in Ring 0',
        'Supports dynamic loading of kernel-mode drivers and user-mode drivers',
        'Flexible API compatibility layers'
      ],
      disadvantages: [
        'Complex architectural codebase',
        'Can still suffer from driver-induced kernel panics if drivers run in Ring 0'
      ],
      examples: ['Windows NT (Windows 10/11)', 'XNU Kernel (macOS / iOS)'],
      diagram: [
        { name: 'User Applications & Subsystem Emulators (Ring 3)', type: 'user' },
        { name: 'SYSTEM CALL INTERFACE', type: 'boundary' },
        { name: 'Executive Services • Microkernel Core • High-speed Drivers (Ring 0)', type: 'kernel' },
        { name: 'PHYSICAL HARDWARE', type: 'hardware' }
      ]
    }
  };

  const activeKernel = kernelTypes[activeTab];

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Kernel Architecture Comparison
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs">
              Compare Monolithic Kernels, Microkernels, and Hybrid Kernels across security, performance, and fault isolation.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#070A12] p-1 rounded-xl border border-slate-200 dark:border-[#1E2638]">
            <button
              onClick={() => setActiveTab('monolithic')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'monolithic' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monolithic
            </button>
            <button
              onClick={() => setActiveTab('microkernel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'microkernel' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Microkernel
            </button>
            <button
              onClick={() => setActiveTab('hybrid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeTab === 'hybrid' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>

        {/* Selected Architecture Overview */}
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-base">
            {activeKernel.title}
          </h4>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
            {activeKernel.tagline}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual Architecture Layout */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
            Memory Space Layout Diagram
          </span>

          <div className="space-y-2">
            {activeKernel.diagram.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border font-mono text-xs font-bold text-center transition-all ${
                  item.type === 'user'
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400'
                    : item.type === 'boundary'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px]'
                    : item.type === 'kernel'
                    ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
                    : 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400'
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase w-full">Used In:</span>
            {activeKernel.examples.map((ex, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                {ex}
              </span>
            ))}
          </div>
        </div>

        {/* Advantages & Disadvantages */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          {/* Advantages */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Architectural Advantages
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {activeKernel.advantages.map((adv, i) => (
                <li key={i} className="flex items-start gap-2 bg-emerald-500/5 p-2.5 rounded-xl border border-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disadvantages */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Trade-offs & Drawbacks
            </span>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {activeKernel.disadvantages.map((dis, i) => (
                <li key={i} className="flex items-start gap-2 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
