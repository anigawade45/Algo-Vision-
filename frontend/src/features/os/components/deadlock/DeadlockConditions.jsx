import React, { useState } from 'react';
import { Lock, Hand, ShieldAlert, Repeat, CheckCircle2, AlertTriangle, Layers, ArrowDown, Info } from 'lucide-react';

export default function DeadlockConditions() {
  const [selectedCondition, setSelectedCondition] = useState('mutual_exclusion');

  const conditions = [
    {
      id: 'mutual_exclusion',
      title: '1. Mutual Exclusion',
      icon: Lock,
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
      badge: 'Non-Shareable',
      summary: 'At least one resource must be held in a non-shareable mode. Only one process can use the resource at a time.',
      explanation: 'If another process requests that non-shareable resource, the requesting process must be delayed until the resource is released by the owner process.',
      example: 'A hardware printer or write lock on a database row can only be used by 1 process at a time.',
      preventionStrategy: 'Make resources shareable where possible (e.g. Read-Only files can be read concurrently by multiple processes without locking).'
    },
    {
      id: 'hold_and_wait',
      title: '2. Hold and Wait',
      icon: Hand,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
      badge: 'Resource Retention',
      summary: 'A process must be holding at least one resource while waiting to acquire additional resources held by other processes.',
      explanation: 'Rather than releasing its currently owned resources before asking for more, the process retains its allocated resources while waiting.',
      example: 'Process P1 holds Printer R1 and requests Scanner R2. Meanwhile it keeps R1 locked.',
      preventionStrategy: 'Require processes to request and be allocated all necessary resources before execution starts, or release current resources before requesting new ones.'
    },
    {
      id: 'no_preemption',
      title: '3. No Preemption',
      icon: ShieldAlert,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400',
      badge: 'Voluntary Release',
      summary: 'Resources cannot be forcibly taken from a process. They can only be released voluntarily by the process after completing its task.',
      explanation: 'The OS kernel does not forcefully interrupt or preempt an allocated resource from a process until that process explicitly calls release().',
      example: 'CPU registers can be preempted via context switching, but a tape drive or file lock cannot be preempted without corrupting data.',
      preventionStrategy: 'If a process holding resources requests another resource that cannot be immediately allocated, all currently held resources are preempted and freed.'
    },
    {
      id: 'circular_wait',
      title: '4. Circular Wait',
      icon: Repeat,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      badge: 'Closed Dependency Cycle',
      summary: 'A set of processes {P0, P1, ..., Pn} exists such that P0 waits for a resource held by P1, P1 waits for P2, and Pn waits for P0.',
      explanation: 'This closed loop of dependencies means no process in the cycle can ever receive its requested resource, creating a permanent freeze.',
      example: 'P1 → R2 → P2 → R1 → P1 forming a directed closed graph cycle.',
      preventionStrategy: 'Impose a total global ordering of all resource types (e.g. R1 < R2 < R3). Require all processes to request resources in strictly increasing order.'
    }
  ];

  const activeData = conditions.find(c => c.id === selectedCondition);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
            Coffman Conditions
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            The 4 Necessary Conditions for Deadlock
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          For a deadlock to occur, <strong>ALL FOUR</strong> conditions must simultaneously hold in the system. If you break even <strong>ONE</strong> of these conditions, a deadlock becomes impossible!
        </p>
      </div>

      {/* Visual Concept Flow: Deadlock -> Requires ALL 4 */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Deadlock Occurrence Rule
          </span>
          <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
            Simultaneous Requirement
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono font-bold text-xs">
            DEADLOCK OCCURS
          </div>
          <span className="text-slate-400 font-mono text-xs">← REQUIRES ALL 4 →</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl">
            {conditions.map((c) => (
              <div key={c.id} className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{c.title.split('.')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Interactive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {conditions.map((cond) => {
          const Icon = cond.icon;
          const isSelected = selectedCondition === cond.id;
          return (
            <button
              key={cond.id}
              onClick={() => setSelectedCondition(cond.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                isSelected
                  ? `bg-white dark:bg-[#0B101D] ${cond.color} shadow-lg scale-102 ring-2 ring-rose-500/40`
                  : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {cond.badge}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {cond.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {cond.summary}
                </p>
              </div>

              <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Inspect Details</span>
                <Info className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Condition Deep-Dive Inspector */}
      {activeData && (
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-500" />
              <span>Deep-Dive: {activeData.title}</span>
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300">
              Condition {activeData.title.split('.')[0]}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono font-bold">
                Detailed Mechanics:
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeData.explanation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono font-bold">
                Real-World OS Example:
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeData.example}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <strong className="text-emerald-700 dark:text-emerald-300 block font-mono font-bold">
                Prevention Remedy:
              </strong>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeData.preventionStrategy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
