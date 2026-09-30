import React, { useState } from 'react';
import { Shield, ShieldAlert, RotateCcw, Skull, RefreshCw, Layers, CheckCircle2, ArrowRight, Zap, Info } from 'lucide-react';

export default function DeadlockHandling({
  processes,
  resources,
  edges,
  onTerminateProcess,
  onReleaseResource
}) {
  const [selectedProcess, setSelectedProcess] = useState('');
  const [selectedResource, setSelectedResource] = useState('');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
            Handling Strategies
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Deadlock Handling Techniques & Recovery
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Operating Systems use four primary strategies to manage deadlocks: Prevention, Avoidance (Banker's Algorithm), Detection, and Recovery.
        </p>
      </div>

      {/* 4 Handling Techniques Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Prevention */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              1. Deadlock Prevention
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminates deadlock possibility by designing system protocols that guarantee at least one of the 4 necessary conditions can <strong>NEVER</strong> hold.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
              Resource Ordering Protocol (Breaks Circular Wait):
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Assign integer index to each resource (R1 &lt; R2 &lt; R3). Require all processes to request resources in strictly ascending numerical order.
            </p>
          </div>
        </div>

        {/* Card 2: Avoidance */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Zap className="w-5 h-5 text-cyan-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              2. Deadlock Avoidance
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Dynamically checks resource requests at runtime. Only grants a request if the resulting state is guaranteed to be in a <strong>SAFE STATE</strong>.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 block">
              Banker's Algorithm:
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Simulates allocation before granting. If granting leaves enough available resources to fulfill at least one process to completion, it grants; otherwise process waits.
            </p>
          </div>
        </div>

        {/* Card 3: Detection */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              3. Deadlock Detection
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Allows the system to enter deadlock without restrictions, but periodically runs a detection algorithm (Wait-For Graph / RAG cycle detection) to spot deadlocks.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">
              Periodic Cycle Check:
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Triggered when CPU utilization drops below threshold or on a timer interval.
            </p>
          </div>
        </div>

        {/* Card 4: Recovery */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Skull className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              4. Deadlock Recovery
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Once a deadlock is detected, the OS breaks the circular wait loop using process termination or resource preemption.
          </p>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <span className="font-bold text-rose-600 dark:text-rose-400 block">
              Recovery Options:
            </span>
            <p className="text-slate-500 dark:text-slate-400">
              Abort all deadlocked processes, abort one by one until cycle breaks, or preempt resources and rollback to safe checkpoint.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Deadlock Recovery Action Panel */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-rose-200 dark:border-rose-900/40 p-6 space-y-4">
        <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Skull className="w-5 h-5 text-rose-500" />
          <span>Interactive Deadlock Recovery Simulator</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select a process or resource from the current graph to terminate or release, breaking the deadlock cycle live!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action A: Terminate Process */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-3">
            <span className="font-bold text-xs text-rose-600 dark:text-rose-400 block font-mono">
              [ Terminate Process ]
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedProcess}
                onChange={(e) => setSelectedProcess(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-900 text-white font-mono text-xs border border-slate-800"
              >
                <option value="">Select Process to Abort</option>
                {processes.map(p => (
                  <option key={p.id} value={p.id}>{p.id}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedProcess) return;
                  onTerminateProcess(selectedProcess);
                  setSelectedProcess('');
                }}
                className="px-3 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer"
              >
                Abort
              </button>
            </div>
          </div>

          {/* Action B: Preempt / Release Resource */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
            <span className="font-bold text-xs text-amber-600 dark:text-amber-400 block font-mono">
              [ Preempt Resource ]
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-900 text-white font-mono text-xs border border-slate-800"
              >
                <option value="">Select Resource to Free</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id}>{r.id}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!selectedResource) return;
                  onReleaseResource(selectedResource);
                  setSelectedResource('');
                }}
                className="px-3 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 cursor-pointer"
              >
                Release
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
