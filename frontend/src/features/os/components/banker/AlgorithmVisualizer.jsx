import { useState, useEffect, useMemo, Fragment } from 'react';
import { Play, Pause, ChevronRight, RotateCcw, ShieldCheck, ShieldAlert, Activity, Zap, Check, X } from 'lucide-react';

export default function AlgorithmVisualizer({
  processCount,
  resourceCount,
  allocation,
  need,
  available
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const speed = 2000;

  // Compute full step-by-step trajectory whenever matrices change
  const trajectory = useMemo(() => {
    const pCount = processCount;
    const rCount = resourceCount;

    const work = [...available];
    const finish = Array(pCount).fill(false);
    const safeSeq = [];
    const steps = [];

    // Step 0: Initial State
    steps.push({
      stepNumber: 0,
      title: 'Step 0: Initialize Work = Available',
      work: [...work],
      finish: [...finish],
      safeSeq: [...safeSeq],
      evaluatedProcess: null,
      canExecute: null,
      comparison: null,
      log: `Initialized Work vector = [${work.join(', ')}]. Finish array set to false for all processes.`
    });

    let stepCount = 1;
    let foundCandidate = true;

    while (foundCandidate) {
      foundCandidate = false;

      for (let i = 0; i < pCount; i++) {
        if (!finish[i]) {
          const procNeed = need[i] || Array(rCount).fill(0);
          const procAlloc = allocation[i] || Array(rCount).fill(0);

          // Check if Need[i][j] <= Work[j] for ALL j
          let canRun = true;
          const elementComparisons = [];

          for (let j = 0; j < rCount; j++) {
            const needVal = procNeed[j] || 0;
            const workVal = work[j] || 0;
            const pass = needVal <= workVal;
            if (!pass) canRun = false;
            elementComparisons.push({
              rLabel: `R${j}`,
              needVal,
              workVal,
              pass
            });
          }

          if (canRun) {
            // Process i can execute! Update Work = Work + Allocation[i]
            const oldWork = [...work];
            for (let j = 0; j < rCount; j++) {
              work[j] += procAlloc[j] || 0;
            }
            finish[i] = true;
            safeSeq.push(`P${i}`);
            foundCandidate = true;

            steps.push({
              stepNumber: stepCount++,
              title: `Step ${stepCount - 1}: Process P${i} Executed & Released Allocation`,
              work: [...work],
              oldWork: [...oldWork],
              releasedAlloc: [...procAlloc],
              finish: [...finish],
              safeSeq: [...safeSeq],
              evaluatedProcess: i,
              canExecute: true,
              comparison: elementComparisons,
              log: `P${i} satisfied Need [${procNeed.join(', ')}] <= Work [${oldWork.join(', ')}]. P${i} completed and released Allocation [${procAlloc.join(', ')}]. New Work = [${work.join(', ')}].`
            });
          } else {
            // Log evaluation failure for P_i
            steps.push({
              stepNumber: stepCount++,
              title: `Step ${stepCount - 1}: Evaluated Process P${i} (Insufficient Work)`,
              work: [...work],
              finish: [...finish],
              safeSeq: [...safeSeq],
              evaluatedProcess: i,
              canExecute: false,
              comparison: elementComparisons,
              log: `P${i} evaluated: Need [${procNeed.join(', ')}] exceeds Work [${work.join(', ')}]. Process P${i} must wait.`
            });
          }
        }
      }
    }

    // Final State Result
    const allFinished = finish.every(f => f === true);
    steps.push({
      stepNumber: stepCount,
      title: allFinished ? 'Final Result: SAFE STATE' : 'Final Result: UNSAFE STATE',
      work: [...work],
      finish: [...finish],
      safeSeq: [...safeSeq],
      evaluatedProcess: null,
      canExecute: null,
      isFinal: true,
      isSafe: allFinished,
      log: allFinished
        ? `SAFE STATE! Found Safe Sequence: <${safeSeq.join(', ')}>. All processes completed safely.`
        : `UNSAFE STATE! No remaining process satisfies Need <= Work. System cannot guarantee safe completion.`
    });

    return steps;
  }, [processCount, resourceCount, allocation, need, available]);

  // Auto Run loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= trajectory.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, trajectory.length]);

  // Safe clamped index
  const safeStepIndex = Math.min(currentStepIndex, Math.max(0, trajectory.length - 1));
  const currentStepData = trajectory[safeStepIndex] || {};
  const isFinalStep = safeStepIndex === trajectory.length - 1;

  return (
    <div className="space-y-8">
      {/* Header & Simulator Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
              Safety Check Engine
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Banker's Algorithm Step-by-Step Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Step through process evaluations to observe Work vector updates, process completions, and safe sequence generation.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            ← Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isFinalStep}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50 ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Auto Run'}</span>
          </button>

          <button
            onClick={() => setCurrentStepIndex(prev => Math.min(trajectory.length - 1, prev + 1))}
            disabled={isFinalStep}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dynamic Safe Sequence Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-3 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Safe Sequence Progress
          </span>
          <span className="text-xs font-mono text-slate-400">
            Completed: {currentStepData.safeSeq?.length || 0} / {processCount}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2 font-mono text-sm">
          {currentStepData.safeSeq && currentStepData.safeSeq.length > 0 ? (
            currentStepData.safeSeq.map((procLabel, idx) => (
              <Fragment key={idx}>
                {idx > 0 && <span className="text-slate-500 font-bold">→</span>}
                <span className="px-3 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-extrabold shadow-sm animate-pulse">
                  {procLabel}
                </span>
              </Fragment>
            ))
          ) : (
            <span className="text-slate-500 italic text-xs">
              No processes completed yet. Safe sequence will appear here as processes execute.
            </span>
          )}
        </div>
      </div>

      {/* Main Simulation Viewport: Work Vector & Comparison Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Work Vector & Comparison Inspector (Col 7) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Work Vector Dynamic Box */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-500" />
                <span>Live Work Vector [Available Resources]</span>
              </h4>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                Work = Work + Allocation[i]
              </span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pt-1 font-mono">
              {Array.from({ length: resourceCount }).map((_, j) => {
                const workVal = currentStepData.work?.[j] !== undefined ? currentStepData.work[j] : 0;
                return (
                  <div key={j} className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 text-center min-w-[70px] space-y-0.5">
                    <span className="text-[10px] text-slate-400 block font-bold">R{j}</span>
                    <span className="text-cyan-400 text-lg font-extrabold">{workVal}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Process Element-by-Element Comparison Inspector */}
          {currentStepData.evaluatedProcess !== null && currentStepData.comparison && (
            <div className={`rounded-2xl p-5 border-2 transition-all space-y-4 ${
              currentStepData.canExecute
                ? 'bg-emerald-500/10 border-emerald-500 text-slate-900 dark:text-white'
                : 'bg-amber-500/10 border-amber-500 text-slate-900 dark:text-white'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-extrabold text-base text-cyan-600 dark:text-cyan-400">
                    Evaluating P{currentStepData.evaluatedProcess}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${
                    currentStepData.canExecute
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  }`}>
                    {currentStepData.canExecute ? 'CAN EXECUTE ✓' : 'MUST WAIT ✗'}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  Condition: Need[P{currentStepData.evaluatedProcess}] ≤ Work
                </span>
              </div>

              {/* Element by Element breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                {currentStepData.comparison.map((comp, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between ${
                      comp.pass
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-800 dark:text-rose-200'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-[11px] block">{comp.rLabel}</span>
                      <span>Need: {comp.needVal} ≤ Work: {comp.workVal}</span>
                    </div>
                    {comp.pass ? (
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-rose-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Process Table View (Col 5) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Process Evaluation Table
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Live Status
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 text-left">Proc</th>
                  <th className="py-2 text-center">Need</th>
                  <th className="py-2 text-center">Alloc</th>
                  <th className="py-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: processCount }).map((_, i) => {
                  const isFinished = currentStepData.finish?.[i] === true;
                  const isBeingEvaluated = currentStepData.evaluatedProcess === i;

                  let statusText = 'WAITING';
                  let statusBg = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

                  if (isFinished) {
                    statusText = 'COMPLETED ✓';
                    statusBg = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
                  } else if (isBeingEvaluated) {
                    if (currentStepData.canExecute) {
                      statusText = 'EXECUTING';
                      statusBg = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 animate-pulse';
                    } else {
                      statusText = 'BLOCKED ✗';
                      statusBg = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
                    }
                  }

                  return (
                    <tr
                      key={i}
                      className={`border-b border-slate-100 dark:border-slate-800/40 transition-colors ${
                        isBeingEvaluated ? 'bg-cyan-500/10' : ''
                      }`}
                    >
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">P{i}</td>
                      <td className="py-2.5 text-center text-cyan-600 dark:text-cyan-400">
                        [{need[i]?.join(',')}]
                      </td>
                      <td className="py-2.5 text-center text-slate-600 dark:text-slate-400">
                        [{allocation[i]?.join(',')}]
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBg}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Execution Log & Final Result Banner */}
      <div className="space-y-4">
        {isFinalStep && (
          <div className={`p-5 rounded-2xl border-2 transition-all space-y-2 ${
            currentStepData.isSafe
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500 text-rose-300'
          }`}>
            <div className="flex items-center gap-2 font-mono font-extrabold text-base">
              {currentStepData.isSafe ? (
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-500 animate-bounce" />
              )}
              <span className={currentStepData.isSafe ? 'text-emerald-500' : 'text-rose-500'}>
                {currentStepData.isSafe ? 'SAFE STATE DETECTED' : 'UNSAFE STATE DETECTED'}
              </span>
            </div>
            <p className="text-xs font-mono text-slate-800 dark:text-slate-200">
              {currentStepData.log}
            </p>
          </div>
        )}

        {/* Live Execution Log */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-500" />
            <span>Algorithm Execution Log</span>
          </h4>
          <div className="bg-slate-900 text-slate-300 font-mono text-xs p-4 rounded-xl border border-slate-800 max-h-[160px] overflow-y-auto space-y-1.5">
            {trajectory.slice(0, currentStepIndex + 1).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 shrink-0">[{step.title.split(':')[0]}]</span>
                <span className={step.isFinal ? (step.isSafe ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold') : 'text-cyan-400'}>
                  {step.log}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
