import React from 'react';
import { Layers, ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Calculator, RefreshCw } from 'lucide-react';
import { PointerLabel } from './primitives/PointerLabel';

/**
 * ProductExceptSelfVisualizer — Stage 09 Interactive Visualizer for Product of Array Except Self (LeetCode 238)
 * Visualizes the 2-pass prefix & suffix product technique in linear O(N) time and O(1) auxiliary space:
 * - Pass 1: Left-to-right prefix products accumulating elements before index i
 * - Pass 2: Right-to-left suffix products multiplying elements after index i into the result array
 */
export function ProductExceptSelfVisualizer({ problem, step, state: passedState, highlights: passedHighlights }) {
  const state = passedState || step?.state || problem?.initialState?.primitives || problem?.initialState || {};
  const highlights = passedHighlights || step?.highlights || {};
  const description = step?.description;

  const rawNums = state.nums?.values || state.nums || problem?.input?.nums || problem?.inputData?.value || problem?.inputData?.array || [1, 2, 3, 4];
  const nums = Array.isArray(rawNums) ? rawNums : [];
  const n = nums.length;

  const currentIndex = state.currentIndex ?? highlights.currentIndex ?? null;
  const currentNum = state.currentNum ?? (currentIndex !== null && nums[currentIndex] !== undefined ? nums[currentIndex] : null);

  const phase = state.phase || highlights.phase || 'INITIALIZATION';
  const runningPrefix = state.runningPrefix ?? 1;
  const runningSuffix = state.runningSuffix ?? 1;
  const runningProduct = state.runningProduct ?? (phase === 'PASS_2_SUFFIX' ? runningSuffix : runningPrefix);

  const rawOutput = state.output || state.result || [];
  const output = Array.isArray(rawOutput) ? rawOutput : new Array(n).fill(1);

  const rawPrefix = state.prefix || [];
  const prefix = Array.isArray(rawPrefix) ? rawPrefix : new Array(n).fill(1);

  const rawSuffix = state.suffix || [];
  const suffix = Array.isArray(rawSuffix) ? rawSuffix : new Array(n).fill(1);

  const isCompleted = step?.operation === 'complete' || phase === 'COMPLETE';
  const isPass1 = phase === 'PASS_1_PREFIX';
  const isPass2 = phase === 'PASS_2_SUFFIX';

  const leftRange = highlights.leftRange || (isPass1 && currentIndex > 0 ? [0, currentIndex - 1] : null);
  const rightRange = highlights.rightRange || (isPass2 && currentIndex < n - 1 ? [currentIndex + 1, n - 1] : null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Array Size Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Array Size & Time
          </span>
          <div className="my-1 flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">N = {n}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">O(N) Time</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentIndex !== null ? `Element ${currentIndex + 1} of ${n}` : 'Ready to start'}
          </span>
        </div>

        {/* Current Phase Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            Algorithm Phase
          </span>
          <div className="my-1 font-mono text-sm font-bold truncate">
            {isPass1 ? (
              <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <ArrowRight className="w-3.5 h-3.5 inline animate-pulse" />
                Pass 1: Prefix
              </span>
            ) : isPass2 ? (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5 inline animate-pulse" />
                Pass 2: Suffix
              </span>
            ) : isCompleted ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-500" />
                Completed
              </span>
            ) : (
              <span className="text-slate-400">Initialization</span>
            )}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isPass1 ? 'Left to right scan' : isPass2 ? 'Right to left scan' : isCompleted ? 'All products ready' : 'Starting array'}
          </span>
        </div>

        {/* Running Prefix Product Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            Running Prefix (Left)
          </span>
          <div className="my-1 font-mono text-xl font-bold text-cyan-600 dark:text-cyan-400">
            {runningPrefix}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isPass1 ? `Product of elements < index ${currentIndex}` : 'Left products computed'}
          </span>
        </div>

        {/* Running Suffix Product Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Running Suffix (Right)
          </span>
          <div className="my-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
            {isPass2 || isCompleted ? runningSuffix : '1 (starts Pass 2)'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {isPass2 ? `Product of elements > index ${currentIndex}` : isCompleted ? 'All suffixes applied' : 'Pending Pass 2'}
          </span>
        </div>
      </div>

      {/* Formula & Live Calculation Banner */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Fundamental Identity (No Division Allowed)
              </div>
              <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                answer[i] = (product of nums[0..i-1]) × (product of nums[i+1..N-1])
              </div>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            {state.calculation || 'Initializing calculation state...'}
          </div>
        </div>
      </div>

      {/* Array Lanes Visualizer Container */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-6">
        
        {/* Lane 1: Input Array (nums) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Input Array (<span className="font-mono text-blue-500">nums</span>)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Indices: 0 to {n - 1}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
            {nums.map((val, idx) => {
              const isCurrent = idx === currentIndex;
              const isLeftOfCurrent = leftRange && idx >= leftRange[0] && idx <= leftRange[1];
              const isRightOfCurrent = rightRange && idx >= rightRange[0] && idx <= rightRange[1];

              let borderClass = 'border-slate-200 dark:border-slate-800';
              let bgClass = 'bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200';
              let ringClass = '';

              if (isCurrent) {
                borderClass = 'border-blue-500 dark:border-blue-400';
                bgClass = 'bg-blue-500 text-white shadow-md shadow-blue-500/20';
                ringClass = 'ring-2 ring-blue-400/50 scale-105';
              } else if (isLeftOfCurrent) {
                borderClass = 'border-cyan-400 dark:border-cyan-700';
                bgClass = 'bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300';
              } else if (isRightOfCurrent) {
                borderClass = 'border-amber-400 dark:border-amber-700';
                bgClass = 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300';
              }

              return (
                <div key={`nums-${idx}`} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center font-mono font-bold text-base transition-all duration-300 ${borderClass} ${bgClass} ${ringClass}`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    [{idx}]
                  </span>
                  {isCurrent && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                      i
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Lane 2: Prefix Products (Left) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" />
              Prefix Products (<span className="font-mono">Left Neighbors</span>)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Pass 1: Accumulate left elements
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3 bg-cyan-50/30 dark:bg-cyan-950/20 rounded-xl border border-cyan-200/60 dark:border-cyan-900/40">
            {prefix.map((val, idx) => {
              const isCurrent = idx === currentIndex && isPass1;
              const isProcessed = isPass1 ? idx <= currentIndex : true;

              return (
                <div key={`prefix-${idx}`} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-10 rounded-lg border font-mono font-semibold text-sm flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-cyan-500 text-white border-cyan-400 ring-2 ring-cyan-300 shadow-sm'
                        : isProcessed
                        ? 'bg-cyan-100/60 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-200 border-cyan-300/80 dark:border-cyan-800/80'
                        : 'bg-slate-100 dark:bg-slate-900/50 text-slate-400 border-dashed border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    p[{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lane 3: Suffix Products (Right) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              Suffix Products (<span className="font-mono">Right Neighbors</span>)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Pass 2: Accumulate right elements
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3 bg-amber-50/30 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
            {suffix.map((val, idx) => {
              const isCurrent = idx === currentIndex && isPass2;
              const isProcessed = isPass2 ? idx >= currentIndex : isCompleted;

              return (
                <div key={`suffix-${idx}`} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-10 rounded-lg border font-mono font-semibold text-sm flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-amber-500 text-white border-amber-400 ring-2 ring-amber-300 shadow-sm'
                        : isProcessed
                        ? 'bg-amber-100/60 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-300/80 dark:border-amber-800/80'
                        : 'bg-slate-100 dark:bg-slate-900/50 text-slate-400 border-dashed border-slate-300 dark:border-slate-800'
                    }`}
                  >
                    {isProcessed ? val : '1'}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    s[{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lane 4: Output Array (Product Except Self) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold tracking-wide uppercase text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Output Array (<span className="font-mono">answer[i] = prefix[i] × suffix[i]</span>)
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {isCompleted ? '✓ 100% Calculated' : isPass2 ? 'Finalizing with suffix' : 'Holding prefix values'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 p-3 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/60 dark:border-emerald-900/40">
            {output.map((val, idx) => {
              const isCurrent = idx === currentIndex;
              const isFinalized = isPass2 ? idx >= currentIndex : isCompleted;

              return (
                <div key={`output-${idx}`} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-12 h-12 rounded-xl border font-mono font-bold text-base flex items-center justify-center transition-all duration-300 ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-300/80 shadow-md scale-105'
                        : isFinalized
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {val}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    ans[{idx}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Step Explanation Callout */}
      {description && (
        <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl flex items-start gap-3">
          <div className="mt-0.5 p-1 bg-blue-100 dark:bg-blue-900/60 rounded-md text-blue-600 dark:text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-0.5">
              Step Explanation
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
