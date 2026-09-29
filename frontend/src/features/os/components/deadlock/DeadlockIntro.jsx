import React, { useState, useEffect } from 'react';
import { Cpu, HardDrive, Play, Pause, RotateCcw, ArrowRight, AlertTriangle, CheckCircle2, Lock, HelpCircle } from 'lucide-react';

export default function DeadlockIntro() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenarioSteps = [
    {
      step: 1,
      title: 'Phase 1: Initial Resource Allocation',
      description: 'Process P1 requests and receives Resource R1. Process P2 requests and receives Resource R2.',
      p1Holds: 'R1',
      p1Waits: 'None',
      p2Holds: 'R2',
      p2Waits: 'None',
      status: 'SAFE',
      statusColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'
    },
    {
      step: 2,
      title: 'Phase 2: Process P1 Requests Resource R2',
      description: 'Process P1 needs Resource R2 to finish execution. But R2 is currently held exclusively by P2. P1 enters Blocked/Waiting state.',
      p1Holds: 'R1',
      p1Waits: 'R2',
      p2Holds: 'R2',
      p2Waits: 'None',
      status: 'P1 BLOCKED',
      statusColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
    },
    {
      step: 3,
      title: 'Phase 3: Process P2 Requests Resource R1',
      description: 'Process P2 needs Resource R1 to finish execution. But R1 is currently held exclusively by P1. P2 also enters Blocked/Waiting state.',
      p1Holds: 'R1',
      p1Waits: 'R2',
      p2Holds: 'R2',
      p2Waits: 'R1',
      status: 'P2 BLOCKED',
      statusColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
    },
    {
      step: 4,
      title: 'Phase 4: Deadlock Circular Dependency Formed',
      description: 'P1 is waiting for P2 to release R2, while P2 is waiting for P1 to release R1. Neither process can proceed. SYSTEM IS IN DEADLOCK!',
      p1Holds: 'R1',
      p1Waits: 'R2 (Held by P2)',
      p2Holds: 'R2',
      p2Waits: 'R1 (Held by P1)',
      status: 'DEADLOCK DETECTED',
      statusColor: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 animate-pulse'
    }
  ];

  const currentScenario = scenarioSteps[step];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setStep(prev => (prev + 1) % scenarioSteps.length);
      }, 2500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, scenarioSteps.length]);

  return (
    <div className="space-y-8">
      {/* Overview Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                Core OS Problem
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What is a Deadlock?
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              A <strong>Deadlock</strong> is a situation in an operating system where a set of processes are permanently blocked because each process holds a resource needed by another process in the set, and none can proceed.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
                isPlaying
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Demo' : 'Animate Deadlock'}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                setStep(0);
              }}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Reset Scenario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Step Progress Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {scenarioSteps.map((st, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsPlaying(false);
              setStep(idx);
            }}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
              step === idx
                ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-500/40'
                : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Step {st.step}
            </div>
            <div className="text-xs font-extrabold truncate">
              {st.title.split(':')[1]}
            </div>
          </button>
        ))}
      </div>

      {/* Interactive Animated Scenario Canvas */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-mono">
              {currentScenario.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentScenario.description}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border shrink-0 ${currentScenario.statusColor}`}>
            {currentScenario.status}
          </span>
        </div>

        {/* Visual Diagram: Process P1, Resource R1, Process P2, Resource R2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-4">
          {/* Process P1 Block */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            step >= 1 ? 'bg-cyan-500/10 border-cyan-500' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md">
                  P1
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Process P1</h5>
                  <span className="text-[11px] font-mono text-slate-400">PID: 101</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                step === 3 || step === 4 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {step === 3 || step === 4 ? 'BLOCKED' : 'RUNNING'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-500">Allocated (Holds):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentScenario.p1Holds}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Requesting (Waits):</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{currentScenario.p1Waits}</span>
              </div>
            </div>
          </div>

          {/* Process P2 Block */}
          <div className={`p-6 rounded-2xl border-2 transition-all space-y-4 ${
            step >= 1 ? 'bg-purple-500/10 border-purple-500' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-md">
                  P2
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-900 dark:text-white">Process P2</h5>
                  <span className="text-[11px] font-mono text-slate-400">PID: 102</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                step === 2 || step === 3 || step === 4 ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
              }`}>
                {step >= 2 ? 'BLOCKED' : 'RUNNING'}
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                <span className="text-slate-500">Allocated (Holds):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{currentScenario.p2Holds}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Requesting (Waits):</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{currentScenario.p2Waits}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Dependency Relationship Summary */}
        <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2">
          <span className="text-slate-400 block text-[11px]">Resource Dependency Chain:</span>
          <div className="flex items-center justify-center gap-2 flex-wrap text-sm font-bold py-2">
            <span className="text-cyan-400">Process P1</span>
            <span className="text-slate-400">holds →</span>
            <span className="text-emerald-400">Resource R1</span>
            <span className="text-slate-400">← requested by</span>
            <span className="text-purple-400">Process P2</span>
            <span className="text-slate-400">holds →</span>
            <span className="text-amber-400">Resource R2</span>
            <span className="text-slate-400">← requested by</span>
            <span className="text-cyan-400">P1</span>
          </div>

          {step === 3 && (
            <div className="text-center text-rose-400 font-bold pt-1 border-t border-slate-800 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>CIRCULAR DEPENDENCY CREATED: P1 → R2 → P2 → R1 → P1</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
