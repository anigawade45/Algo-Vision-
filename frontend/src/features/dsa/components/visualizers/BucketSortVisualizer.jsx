import React from 'react';
import { Layers, Hash, Sparkles, CheckCircle2, ArrowRight, ArrowDown, Trophy, ListOrdered } from 'lucide-react';
import { ArrayCell } from './primitives/ArrayCell';
import { VisualizationLegend } from './primitives/VisualizationLegend';

/**
 * BucketSortVisualizer — Stage 09 Dedicated Bucket Sort Visualizer for Top K Frequent Elements
 *
 * Algorithm Strategy: Frequency Map + Bucket Sort (O(N) Time, O(N) Space)
 * Renders:
 * 1. Telemetry Bar (Target K, Collected elements, Current Frequency, Active phase)
 * 2. Original Input Array with active inspection pointer
 * 3. Frequency Map (Value → Frequency) with live insertion highlights
 * 4. Frequency Buckets Grid (1..N buckets with contained numbers and traversal highlighting)
 * 5. Top-K Collected Result Tray & Completion Banner
 */
export function BucketSortVisualizer({ problem, step, state = {}, highlights = {} }) {
  const isPreExecution =
    step?.stepNumber === 0 ||
    step?.operation === 'INITIAL_INPUT' ||
    (state?.currentIndex === null &&
      state?.currentFrequency === null &&
      (!state?.topKResult || state.topKResult.length === 0) &&
      (!state?.frequencyMap || Object.keys(state.frequencyMap).length === 0));

  const isCompleted =
    step?.operation === 'complete' ||
    Boolean(state?.result && Array.isArray(state.result) && state.result.length > 0 && !isPreExecution);

  // 1. Core Inputs
  const rawNums = state?.nums || problem?.input?.array || problem?.input?.nums || problem?.inputData?.value?.array || [];
  const nums = Array.isArray(rawNums) ? rawNums : [];
  const k = state?.k ?? problem?.input?.k ?? problem?.inputData?.value?.k ?? 2;

  // 2. Frequency Map
  const frequencyMap = isPreExecution ? {} : (state?.frequencyMap || step?.state?.frequencyMap || {});
  const freqEntries = Object.entries(frequencyMap);

  // 3. Frequency Buckets (1..N)
  const buckets = isPreExecution ? [] : (state?.buckets || step?.state?.buckets || []);

  // 4. Pointers & Active Items
  const currentIndex = isPreExecution ? null : (state?.currentIndex ?? highlights?.currentIndex ?? null);
  const currentNum = isPreExecution ? null : (state?.currentNum ?? highlights?.activeKey ?? highlights?.activeNum ?? null);
  const currentFrequency = isPreExecution
    ? null
    : (state?.currentFrequency ?? state?.activeFrequency ?? highlights?.currentBucket ?? null);

  // 5. Result Array (Top K)
  const topKResult = isPreExecution
    ? []
    : (Array.isArray(state?.topKResult) && state.topKResult.length > 0
        ? state.topKResult
        : (Array.isArray(state?.result) ? state.result : []));

  // Determine current active phase for telemetry
  let phaseName = 'Awaiting Execution';
  let phaseColor = 'text-slate-400';
  if (!isPreExecution && !isCompleted) {
    if (step?.operation === 'count_frequency') {
      phaseName = 'Phase 1: Frequency Mapping';
      phaseColor = 'text-blue-500';
    } else if (step?.operation === 'bucket_insert') {
      phaseName = 'Phase 2: Bucket Placement';
      phaseColor = 'text-amber-500';
    } else if (step?.operation === 'traverse_bucket' || step?.operation === 'collect_result') {
      phaseName = 'Phase 3: Descending Scan & Selection';
      phaseColor = 'text-indigo-500';
    }
  } else if (isCompleted) {
    phaseName = 'Phase 4: Execution Completed';
    phaseColor = 'text-emerald-500';
  }

  // Non-empty buckets count for display
  const nonEmptyBucketsCount = buckets.filter((b, idx) => idx > 0 && Array.isArray(b) && b.length > 0).length;

  const legendItems = [
    { label: 'Array Element (i)', badgeClass: 'bg-blue-600' },
    { label: 'Active Frequency Bucket', badgeClass: 'bg-indigo-600 ring-2 ring-indigo-400' },
    { label: 'Frequency Map Entry', badgeClass: 'bg-amber-500' },
    { label: 'Top-K Result Item', badgeClass: 'bg-emerald-600' },
  ];

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto">
      {/* Strategy Banner & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs">
        {/* Strategy Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                Top K Frequent Elements
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/50">
                Strategy: Bucket Sort O(N)
              </span>
            </div>
            <div className={`font-mono text-xs font-semibold ${phaseColor}`}>
              {phaseName}
            </div>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-2.5 font-mono text-xs flex-wrap">
          {/* Target K */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45]">
            <span className="text-slate-500">Target K:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{k}</span>
          </div>

          {/* Collected Progress */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50">
            <Trophy className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300">Collected:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {topKResult.length} / {k}
            </span>
          </div>

          {/* Current Frequency */}
          {currentFrequency !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-indigo-700 dark:text-indigo-300">Scan Freq:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentFrequency}</span>
            </div>
          )}
        </div>
      </div>

      {/* Section 1: Input Array */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Input Array nums (Length: {nums.length})</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {currentIndex !== null ? `Scanning index [${currentIndex}]` : 'Awaiting traversal'}
          </span>
        </div>

        {nums.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-slate-400 italic">
            Array is empty [ ]
          </div>
        ) : (
          <div className="overflow-x-auto pb-2">
            <div className="flex items-end gap-2 min-w-max pt-6">
              {nums.map((val, idx) => {
                const isActive = currentIndex === idx;
                const isSelected = topKResult.includes(val);

                return (
                  <div key={idx} className="flex flex-col items-center">
                    {/* Pointer Indicator */}
                    <div className="h-5 flex items-center justify-center">
                      {isActive && (
                        <span className="text-[10px] font-mono font-bold text-blue-500 animate-bounce">
                          i↓
                        </span>
                      )}
                    </div>

                    {/* Array Cell */}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold border transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-600 dark:text-blue-300 ring-2 ring-blue-400/50 scale-105'
                          : isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45] text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {val}
                    </div>

                    {/* Index Label */}
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {idx}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Two-Column Data Structures View (Frequency Map & Buckets) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Frequency Map (Value → Frequency) */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Hash className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Frequency Map (Value → Count)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162032] text-slate-500 text-[11px] font-semibold">
              {freqEntries.length} Unique
            </span>
          </div>

          {freqEntries.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-400 italic bg-slate-50 dark:bg-[#070A12] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Frequency map is currently empty { '{ }' }
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {freqEntries.map(([numKey, countVal]) => {
                const isActive = String(currentNum) === String(numKey);
                const isSelected = topKResult.includes(Number(numKey));

                return (
                  <div
                    key={numKey}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 ring-2 ring-amber-400/50 text-amber-900 dark:text-amber-200 scale-[1.01]'
                        : isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 text-emerald-800 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45] text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Num</span>
                      <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
                        {numKey}
                      </span>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400">Freq</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800">
                        {countVal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (7 cols): Frequency Buckets (1..N) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <ListOrdered className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Frequency Buckets [1..N] (Traverse Descending)
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#162032] text-slate-500 text-[11px] font-semibold">
              {nonEmptyBucketsCount} populated
            </span>
          </div>

          {buckets.length <= 1 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-400 italic bg-slate-50 dark:bg-[#070A12] rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              Buckets not yet populated (Awaiting Phase 2)
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {/* Render buckets in descending frequency order (N down to 1) */}
              {Array.from({ length: buckets.length - 1 }, (_, i) => buckets.length - 1 - i).map((freq) => {
                const bucketElements = buckets[freq] || [];
                const isScanning = currentFrequency === freq;
                const hasElements = bucketElements.length > 0;

                return (
                  <div
                    key={freq}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-all duration-200 ${
                      isScanning
                        ? 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 ring-2 ring-indigo-400/50 text-indigo-950 dark:text-indigo-100 scale-[1.01]'
                        : hasElements
                        ? 'bg-slate-50 dark:bg-[#111726] border-slate-200 dark:border-[#222D45]'
                        : 'bg-transparent border-slate-100 dark:border-[#162032] opacity-50'
                    }`}
                  >
                    {/* Bucket Frequency Header */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1C2436] font-bold text-slate-700 dark:text-slate-300">
                        Bucket [{freq}]
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (Freq = {freq})
                      </span>
                      {isScanning && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-600 text-white font-bold animate-pulse">
                          Active Scan ↓
                        </span>
                      )}
                    </div>

                    {/* Bucket Contents */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {bucketElements.length === 0 ? (
                        <span className="text-slate-400 italic text-[11px]">[ empty ]</span>
                      ) : (
                        bucketElements.map((elem, eIdx) => {
                          const isCollected = topKResult.includes(elem);
                          return (
                            <span
                              key={eIdx}
                              className={`px-2.5 py-0.5 rounded-lg font-bold border transition-all ${
                                isCollected
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 text-emerald-800 dark:text-emerald-200 ring-1 ring-emerald-400'
                                  : 'bg-white dark:bg-[#0B101D] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
                              }`}
                            >
                              {elem}
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Top-K Collected Result Bar */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 ${
          isCompleted
            ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
            : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638]'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Top K Frequent Elements Result ({topKResult.length} / {k})
            </span>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Selection Complete</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {topKResult.length === 0 ? (
            <span className="text-slate-400 italic text-xs font-mono">
              No elements collected yet (Awaiting Phase 3 descending scan)
            </span>
          ) : (
            topKResult.map((elem, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 font-mono font-bold text-sm shadow-xs animate-in fade-in"
              >
                <span className="text-[10px] text-emerald-600/70 dark:text-emerald-400/70">
                  #{idx + 1}
                </span>
                <span>{elem}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}
