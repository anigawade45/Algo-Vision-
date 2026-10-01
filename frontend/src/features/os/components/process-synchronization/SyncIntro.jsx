import React from 'react';
import { ShieldCheck, ShieldAlert, Zap, ArrowRight, Activity, Users, Lock, CheckCircle2 } from 'lucide-react';

export function SyncIntro() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Concurrency Control
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What is Process Synchronization?
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          Process synchronization coordinates concurrent processes executing on shared data so that data consistency is maintained and processes access shared resources safely without race conditions.
        </p>
      </div>

      {/* Visual Flow: Unsynchronized vs Synchronized Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unsynchronized Access Flow */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-rose-200 dark:border-rose-900/40 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Unsynchronized Flow</h4>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-mono font-semibold">Risk: Race Condition & Data Corruption</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            P1 and P2 access shared data simultaneously. Interleaving read/write operations overwrite updates, resulting in unpredictable and incorrect data.
          </p>

          {/* Flow Visual */}
          <div className="p-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 rounded">Process P1</span>
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <span>Simultaneous Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 rounded">Shared Memory</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 rounded">Process P2</span>
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <span>Simultaneous Access</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 rounded">Shared Memory</span>
            </div>
          </div>
        </div>

        {/* Synchronized Access Flow */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Synchronized Flow</h4>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Protected: Controlled Mutual Exclusion</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Synchronization primitives (Mutex/Semaphores) enforce mutual exclusion. Only permitted processes enter the critical section one at a time.
          </p>

          {/* Flow Visual */}
          <div className="p-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 rounded">Process P1</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <span>Acquires Lock</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded font-bold">Critical Section</span>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 rounded">Process P2</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <span>Waits in Queue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded">BLOCKED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyncIntro;
