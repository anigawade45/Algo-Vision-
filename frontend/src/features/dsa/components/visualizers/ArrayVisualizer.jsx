import React from 'react';
import { Layers, CheckCircle2, Hash, Search, ArrowRight } from 'lucide-react';
import { ArrayCell } from './primitives/ArrayCell';
import { VisualizationLegend } from './primitives/VisualizationLegend';

export function ArrayVisualizer({ problem, step, state, highlights = {} }) {
  // Extract array from state or problem input fallback
  const nums = state?.nums || state?.array || problem?.input?.nums || problem?.input?.array || [];
  const target = state?.target ?? problem?.input?.target;

  const currentIndex = state?.currentIndex ?? highlights?.currentIndex ?? null;
  const currentNum = state?.currentNum ?? null;
  const complement = state?.complement ?? null;
  const hashMap = state?.hashMap || {};
  const matchedPair = highlights?.matchedPair || (Array.isArray(state?.result) ? state.result : null);
  const matchedSet = new Set(matchedPair || []);

  const arrayIndicesSet = new Set(highlights?.arrayIndices || []);
  const changedSet = new Set(step?.changed || []);

  const legendItems = [
    { label: 'Inspected Element', badgeClass: 'bg-blue-600' },
    ...(matchedPair ? [{ label: 'Matched Target Pair', badgeClass: 'bg-emerald-500' }] : []),
    ...(Object.keys(hashMap).length > 0 ? [{ label: 'HashMap Entry', badgeClass: 'bg-indigo-500' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Target & Complement Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
            Target
          </div>
          <span className="font-mono text-xl font-bold text-slate-900 dark:text-white">
            {target !== undefined ? target : 'N/A'}
          </span>
        </div>

        {/* Current Iteration Calculations */}
        {currentIndex !== null && (
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-500">nums[{currentIndex}] = <strong className="text-blue-600 dark:text-blue-400">{currentNum}</strong></span>
            {complement !== null && (
              <>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500">
                  Complement: <strong className="text-indigo-600 dark:text-indigo-400">{target} - {currentNum} = {complement}</strong>
                </span>
              </>
            )}
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

            return (
              <ArrayCell
                key={idx}
                value={val}
                index={idx}
                isActive={isActive}
                isMatched={isMatched}
                isHighlighted={isHighlighted}
                isChanged={isChanged}
                pointerLabel={isActive ? 'i' : isMatched ? 'match' : null}
                pointerColor={isMatched ? 'emerald' : 'blue'}
              />
            );
          })}
        </div>
      </div>

      {/* Contextual HashMap State Preview (if map entries exist in step state) */}
      {Object.keys(hashMap).length > 0 && (
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
