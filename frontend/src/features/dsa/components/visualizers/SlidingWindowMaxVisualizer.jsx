import React from 'react';
import { Layers, ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { PointerLabel } from './primitives/PointerLabel';

/**
 * SlidingWindowMaxVisualizer — Stage 09 Interactive Visualizer for Sliding Window Maximum (LeetCode 239)
 * Visualizes the sliding window boundaries [L, R] over the input array,
 * the monotonic decreasing deque (double-ended queue) of indices,
 * and the recorded maximum elements.
 */
export function SlidingWindowMaxVisualizer({ problem, step, state: passedState, highlights: passedHighlights }) {
  const state = passedState || step?.state || problem?.initialState?.primitives || problem?.initialState || {};
  const highlights = passedHighlights || step?.highlights || {};
  const description = step?.description;

  const rawNums = state.nums?.values || state.nums || problem?.input?.nums || problem?.input?.array || problem?.inputData?.array || [1, 3, -1, -3, 5, 3, 6, 7];
  const nums = Array.isArray(rawNums) ? rawNums : [];
  const k = state.k?.value ?? state.k ?? problem?.input?.k ?? problem?.inputData?.k ?? 3;

  const currentIndex = state.currentIndex ?? highlights.currentIndex ?? null;
  const currentVal = state.currentVal ?? (currentIndex !== null && nums[currentIndex] !== undefined ? nums[currentIndex] : null);

  const left = state.left ?? (currentIndex !== null ? Math.max(0, currentIndex - k + 1) : null);
  const right = state.right ?? currentIndex ?? null;
  const windowRange = state.windowRange || (left !== null && right !== null ? [left, right] : null);

  // Deque can be an array of objects { index, val } or array of indices
  const rawDeque = state.deque || highlights.deque || [];
  const deque = Array.isArray(rawDeque)
    ? rawDeque.map((item) => {
        if (typeof item === 'object' && item !== null && item.index !== undefined) {
          return { index: item.index, val: item.val ?? nums[item.index] };
        }
        const idx = Number(item);
        return { index: idx, val: nums[idx] };
      })
    : [];

  const rawResult = state.result || [];
  const result = Array.isArray(rawResult) ? rawResult : [];

  const isCompleted = step?.operation === 'complete' || Boolean(state?.isComplete);
  const currentMax = state.windowMax ?? (deque.length > 0 ? deque[0].val : null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Window Size Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Window Size (K)
          </span>
          <div className="my-1 flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">K = {k}</span>
            <span className="text-xs text-slate-400">elements</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentIndex !== null ? `Step ${currentIndex + 1} of ${nums.length}` : 'Waiting to start'}
          </span>
        </div>

        {/* Current Window Range Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            Active Window Range
          </span>
          <div className="my-1 font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
            {windowRange && currentIndex !== null ? `[${windowRange[0]}, ${windowRange[1]}]` : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentIndex !== null && currentIndex < k - 1
              ? `Warming up (${currentIndex + 1}/${k})`
              : currentIndex !== null
              ? 'Full window reached'
              : 'Waiting...'}
          </span>
        </div>

        {/* Current Window Maximum Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Window Maximum
          </span>
          <div className="my-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {currentMax !== null && currentIndex >= k - 1 ? currentMax : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentIndex >= k - 1 && deque.length > 0
              ? `From deque front: nums[${deque[0].index}]`
              : 'Warming up'}
          </span>
        </div>

        {/* Deque Size Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-purple-200 dark:border-purple-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
            Monotonic Deque
          </span>
          <div className="my-1 font-mono text-xl font-bold text-purple-600 dark:text-purple-400">
            {deque.length} <span className="text-xs font-normal text-slate-400">items</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Decreasing elements
          </span>
        </div>
      </div>

      {/* Input Array Stream with Sliding Window Frame */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Input Array & Sliding Window Frame
          </span>
          <span className="text-xs font-mono text-slate-400">
            nums = [{nums.join(', ')}]
          </span>
        </div>

        {/* Array Cells */}
        <div className="relative flex items-center justify-center gap-2 overflow-x-auto py-3">
          {nums.map((num, idx) => {
            const isCurrent = currentIndex === idx;
            const inWindow = windowRange && idx >= windowRange[0] && idx <= windowRange[1];
            const isWindowLeft = windowRange && idx === windowRange[0];
            const isWindowRight = windowRange && idx === windowRange[1];
            const isMaxElement = inWindow && currentMax !== null && num === currentMax;

            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[40px] relative">
                {/* Top Pointer Badge */}
                <div className="h-5 flex items-end">
                  {isCurrent ? (
                    <PointerLabel label="Current" color="blue" position="top" />
                  ) : isWindowLeft && currentIndex >= k - 1 ? (
                    <span className="text-[10px] font-mono font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-1 rounded border border-indigo-200/50">
                      L
                    </span>
                  ) : null}
                </div>

                {/* Cell */}
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-200 select-none relative ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400 scale-105'
                      : isMaxElement && inWindow && currentIndex >= k - 1
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-700'
                      : inWindow
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200'
                      : idx < (windowRange ? windowRange[0] : 0)
                      ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600'
                      : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {num}
                </div>

                {/* Index Subscript */}
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monotonic Deque & Result Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monotonic Deque View */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                Monotonic Decreasing Deque
              </span>
              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                Front = Max
              </span>
            </div>

            {/* Deque Container */}
            <div className="min-h-[120px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-purple-200 dark:border-purple-900/40 rounded-xl p-3 flex flex-col justify-center">
              {deque.length === 0 ? (
                <div className="text-center text-slate-400 dark:text-slate-600 font-mono text-xs">
                  [ Deque Empty ]
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {deque.map((item, idx) => {
                    const isFront = idx === 0;
                    const isBack = idx === deque.length - 1;

                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">
                          {isFront ? (
                            <span className="text-emerald-500">Front (Max)</span>
                          ) : isBack ? (
                            <span className="text-blue-500">Back</span>
                          ) : (
                            `Pos ${idx}`
                          )}
                        </span>

                        <div
                          className={`px-3 py-2 rounded-xl border-2 font-mono flex items-center gap-2 shadow-xs transition-all ${
                            isFront
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold scale-105'
                              : 'bg-white dark:bg-[#0B101D] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <span className="text-xs text-slate-400 dark:text-slate-500">idx[{item.index}]:</span>
                          <span className="text-base font-bold">{item.val}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-400">
              Stores indices of candidates in strictly decreasing order of values
            </span>
          </div>
        </div>

        {/* Result Output Array */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Result Array (Recorded Maxima)
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {result.length} recorded
              </span>
            </div>

            {/* Result list */}
            <div className="min-h-[120px] bg-slate-50/60 dark:bg-[#070A12] border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 flex items-center justify-center">
              {result.length === 0 ? (
                <div className="text-center text-slate-400 dark:text-slate-600 font-mono text-xs">
                  [ Warming up: recording starts at index {k - 1} ]
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {result.map((val, idx) => {
                    const isLatest = idx === result.length - 1;
                    return (
                      <div key={idx} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-mono text-slate-400">
                          w{idx + 1}
                        </span>
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all ${
                            isLatest
                              ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm scale-105'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                          }`}
                        >
                          {val}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-400">
              Expected Output Length: {Math.max(0, nums.length - k + 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Description Banner */}
      {description && (
        <div className="bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl p-3 text-center">
          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
