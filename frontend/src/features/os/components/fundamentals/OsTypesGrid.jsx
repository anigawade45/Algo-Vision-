import React from 'react';
import { Layers, Clock, Share2, Zap, Cpu, CheckCircle2 } from 'lucide-react';

export default function OsTypesGrid() {
  const osTypes = [
    {
      id: 'batch',
      title: 'Batch Operating System',
      badge: 'Non-Interactive',
      icon: Layers,
      description: 'Groups similar jobs into batches and executes them sequentially without direct user interaction.',
      keyFeature: 'High CPU utilization for heavy offline compute tasks; no interactive feedback loop.',
      advantages: ['Efficient for long-running batch jobs', 'Reduces idle CPU setup time between jobs'],
      examples: ['IBM OS/360', 'PAYROLL Processing Systems']
    },
    {
      id: 'timesharing',
      title: 'Time-Sharing / Multitasking OS',
      badge: 'Interactive',
      icon: Clock,
      description: 'Multiplexes CPU time among multiple user tasks via rapid time-quantum slices (Round Robin scheduling).',
      keyFeature: 'Provides fast, interactive response time giving each user the illusion of dedicated CPU ownership.',
      advantages: ['Equal opportunity CPU allocation', 'Prevents process starvation and enhances responsiveness'],
      examples: ['Linux', 'Windows 10/11', 'macOS']
    },
    {
      id: 'distributed',
      title: 'Distributed Operating System',
      badge: 'Networked',
      icon: Share2,
      description: 'Coordinates autonomous computational nodes connected via a network so they act as a single unified system.',
      keyFeature: 'Transparent resource sharing, high availability, fault tolerance, and load balancing across nodes.',
      advantages: ['High scalability & reliability', 'If one node fails, remaining nodes continue processing'],
      examples: ['Amoeba', 'LOCUS', 'Apache Hadoop Clusters']
    },
    {
      id: 'realtime',
      title: 'Real-Time Operating System (RTOS)',
      badge: 'Deterministic',
      icon: Zap,
      description: 'Provides strictly bounded, deterministic response time guarantees for time-critical applications.',
      keyFeature: 'Hard RTOS (zero deadline tolerance) vs Soft RTOS (acceptable minor deadline variance).',
      advantages: ['Zero latency spikes for critical events', 'Predictable interrupt latency'],
      examples: ['FreeRTOS', 'VxWorks (NASA Rovers)', 'QNX (Automotive / Avionics)']
    },
    {
      id: 'multiprogramming',
      title: 'Multiprogramming OS',
      badge: 'Memory Multiplexed',
      icon: Cpu,
      description: 'Keeps multiple ready processes in main RAM simultaneously. When one process waits for I/O, CPU switches to another.',
      keyFeature: 'Eliminates CPU idle waiting time during slow disk/network I/O operations.',
      advantages: ['Maximizes CPU throughput', 'Efficient RAM utilization'],
      examples: ['Modern Server OS', 'Enterprise Mainframes']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-base">
          Types of Operating Systems
        </h3>
        <p className="text-slate-550 dark:text-slate-400 text-xs">
          Explore architectural classifications from Batch processing to Time-sharing, Distributed, and Real-Time systems.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {osTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300">
                    {type.badge}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-base font-mono">
                  {type.title}
                </h4>

                <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed font-sans">
                  {type.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-100 dark:border-[#1E2638] space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                    Core Mechanism
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-sans">
                    {type.keyFeature}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#1E2638] space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Examples
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {type.examples.map((ex, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[11px] font-mono font-semibold">
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
