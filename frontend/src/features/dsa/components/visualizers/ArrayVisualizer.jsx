import React from 'react';
import { CheckCircle2, Hash, ArrowRight } from 'lucide-react';
import { ArrayCell } from './primitives/ArrayCell';
import { VisualizationLegend } from './primitives/VisualizationLegend';
import { extractCanonicalSolutionPair } from '../../adapters/resultNormalizer';

export function ArrayVisualizer({ problem, step, state, highlights = {}, showInlineHashMap = true }) {
  // Extract array from state (handles plain array, primitive object, or problem input/inputData fallback)
  const resolveArray = () => {
    if (Array.isArray(state?.nums)) return state.nums;
    if (Array.isArray(state?.nums?.values)) return state.nums.values;
    if (Array.isArray(state?.nums?.value)) return state.nums.value;
    if (Array.isArray(state?.array)) return state.array;
    if (Array.isArray(state?.array?.values)) return state.array.values;
    if (Array.isArray(state?.array?.value)) return state.array.value;
    if (Array.isArray(problem?.input?.nums)) return problem.input.nums;
    if (Array.isArray(problem?.input?.array)) return problem.input.array;
    if (Array.isArray(problem?.input)) return problem.input;
    if (Array.isArray(problem?.inputData?.value?.array)) return problem.inputData.value.array;
    if (Array.isArray(problem?.inputData?.value?.nums)) return problem.inputData.value.nums;
    if (Array.isArray(problem?.inputData?.array)) return problem.inputData.array;
    if (Array.isArray(problem?.inputData?.nums)) return problem.inputData.nums;

    // String fallback (e.g. "nums = [100, 4, 200, 1, 3, 2]" or "[100, 4, ...]")
    const candidateStrings = [
      typeof problem?.input === 'string' ? problem.input : null,
      typeof problem?.inputData === 'string' ? problem.inputData : null,
      typeof problem?.inputData?.value === 'string' ? problem.inputData.value : null,
      typeof state?.nums === 'string' ? state.nums : null,
    ].filter(Boolean);

    for (const str of candidateStrings) {
      const match = str.match(/\[([\s\S]*?)\]/);
      if (match) {
        try {
          const parsed = JSON.parse(`[${match[1]}]`);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          const items = match[1]
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
            .map((s) => {
              const num = Number(s);
              return isNaN(num) ? s.replace(/^['"]|['"]$/g, '') : num;
            });
          if (items.length > 0) return items;
        }
      }
    }
    return [];
  };
  const nums = resolveArray();

  const resolveTarget = () => {
    if (state?.target?.value !== undefined) return state.target.value;
    if (state?.target !== undefined) return state.target;
    if (problem?.input?.target !== undefined) return problem.input.target;
    if (problem?.inputData?.value?.target !== undefined) return problem.inputData.value.target;
    if (problem?.inputData?.target !== undefined) return problem.inputData.target;

    const candidateStrings = [
      typeof problem?.input === 'string' ? problem.input : null,
      typeof problem?.inputData === 'string' ? problem.inputData : null,
    ].filter(Boolean);

    for (const str of candidateStrings) {
      const match = str.match(/target\s*=\s*(-?\d+)/i);
      if (match) return Number(match[1]);
    }
    return undefined;
  };
  const target = resolveTarget();

  const currentIndex = state?.currentIndex ?? highlights?.currentIndex ?? null;
  const currentNum = state?.currentNum ?? null;
  const complement = state?.complement ?? null;
  const hashMap = state?.numSet || state?.hashMap || state?.frequencyMap || {};

  // Canonicalize matched solution pair across step, state, highlights, and event sources
  const matchedPair = extractCanonicalSolutionPair({ step, state, highlights });
  const matchedSet = new Set(matchedPair || []);

  const arrayIndicesSet = new Set(highlights?.arrayIndices || []);
  const changedSet = new Set(step?.changed || []);

  const legendItems = [
    ...(currentIndex !== null
      ? [{ label: 'Inspected Element (i)', badgeClass: 'bg-blue-600' }]
      : [{ label: 'Array Element', badgeClass: 'bg-slate-500' }]),
    ...(matchedPair ? [
      { label: 'Complement in HashMap (match)', badgeClass: 'bg-emerald-500' },
      { label: `Solution Pair [${matchedPair.join(', ')}]`, badgeClass: 'bg-gradient-to-r from-blue-600 to-emerald-600' },
    ] : []),
    ...(Object.keys(hashMap).length > 0 && showInlineHashMap ? [{ label: 'HashMap Entry', badgeClass: 'bg-indigo-500' }] : []),
  ];

  const hasTopBar =
    target !== undefined ||
    (currentIndex !== null && currentNum !== null) ||
    matchedPair ||
    (state?.longestStreak !== undefined && state.longestStreak > 0);

  return (
    <div className="space-y-6">
      {/* Target & Complement Action Bar (only shown when relevant data exists) */}
      {hasTopBar && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638]">
          {target !== undefined && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
                Target
              </div>
              <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
                {target}
              </span>
            </div>
          )}

          {/* Current Iteration Calculations */}
          {currentIndex !== null && currentNum !== null && (
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-500">nums[{currentIndex}] = <strong className="text-blue-600 dark:text-blue-400">{currentNum}</strong></span>
              {complement !== null && target !== undefined && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span className="text-slate-500">
                    Complement: <strong className="text-indigo-600 dark:text-indigo-400">{target} - {currentNum} = {complement}</strong>
                  </span>
                </>
              )}
            </div>
          )}

          {/* Longest Consecutive Streak Banner */}
          {state?.longestStreak !== undefined && state.longestStreak > 0 && (
            <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 font-mono text-xs font-bold flex items-center gap-1.5">
              <span>Longest Streak: {state.longestStreak}</span>
            </div>
          )}

          {/* Matched Pair Banner */}
          {matchedPair && (
            <div className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 font-mono text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Matched Indices: [{matchedPair.join(', ')}]</span>
            </div>
          )}
        </div>
      )}

      {/* Main Array Cells Track */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#172033] space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-500">Array Elements</span>
          <span>Length: {nums.length}</span>
        </div>

        {/* Horizontal Array Strip */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-4">
          {nums.map((val, idx) => {
            const isActive = currentIndex === idx;
            const isMatched = matchedSet.has(idx);
            const isHighlighted = arrayIndicesSet.has(idx);
            const isChanged = changedSet.has('nums') || changedSet.has('array');

            // Active inspected pointer stays blue; matched complement from HashMap is emerald
            const pointerLabel = isActive ? 'i' : isMatched ? 'match' : null;
            const pointerColor = isActive ? 'blue' : isMatched ? 'emerald' : 'blue';

            return (
              <ArrayCell
                key={idx}
                value={val}
                index={idx}
                isActive={isActive}
                isMatched={isMatched}
                isHighlighted={isHighlighted}
                isChanged={isChanged}
                pointerLabel={pointerLabel}
                pointerColor={pointerColor}
              />
            );
          })}
        </div>
      </div>

      {/* Contextual HashMap State Preview (only rendered when standalone and not accompanied by dedicated HashMapVisualizer) */}
      {showInlineHashMap && Object.keys(hashMap).length > 0 && (
        <div className="p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-500" />
              HashMap Lookup State (Value → Index)
            </span>
            <span className="text-slate-400">{Object.keys(hashMap).length} Entries</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(hashMap).map(([numKey, idxVal]) => (
              <div
                key={numKey}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/40 text-xs font-mono flex items-center gap-2"
              >
                <span className="font-bold text-indigo-700 dark:text-indigo-300">Key: {numKey}</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Index: {idxVal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}
