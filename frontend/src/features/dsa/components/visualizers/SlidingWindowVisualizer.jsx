import React from 'react';
import { Layers, AlertTriangle, CheckCircle2, Sparkles, Hash, ArrowRight } from 'lucide-react';
import { ArrayCell } from './primitives/ArrayCell';
import { VisualizationLegend } from './primitives/VisualizationLegend';

export function SlidingWindowVisualizer({ problem, step, state, highlights = {} }) {
  // String input & pointers state
  const s = state?.s || problem?.input?.s || problem?.inputData?.value || '';
  const chars = Array.from(s);

  const isPreExecution = step?.stepNumber === 0 || (state?.left === null && state?.right === null && step?.operation === 'INITIAL_INPUT');
  const isCompleted = step?.operation === 'complete' || Boolean(state?.result !== null && state?.result !== undefined && !isPreExecution);

  // 1. Current Window Pointers & Range (MUST reflect current algorithm position, NEVER best window)
  const left = isPreExecution ? null : (state?.left ?? step?.state?.left ?? highlights?.left ?? null);
  const right = isPreExecution ? null : (state?.right ?? step?.state?.right ?? highlights?.right ?? null);
  const currentRange = isPreExecution
    ? null
    : (highlights?.windowRange || state?.windowRange || (left !== null && right !== null ? [left, right] : null));

  // Current window substring & length
  const currentWindow = isPreExecution
    ? ''
    : (state?.windowString !== undefined && state?.windowString !== ''
        ? state.windowString
        : (step?.state?.windowString !== undefined && step?.state?.windowString !== ''
            ? step.state.windowString
            : (left !== null && right !== null && left <= right ? s.slice(left, right + 1) : '')));
  const currentLength = isPreExecution ? 0 : currentWindow.length;

  // Active window characters map/set
  const windowChars = state?.windowChars || step?.state?.windowChars || {};

  // 2. Best Window (Optimal Substring found so far) — STRICTLY SEPARATE FROM CURRENT WINDOW
  const bestRange = isPreExecution
    ? null
    : (highlights?.bestWindowRange || state?.bestWindowRange || state?.bestRange || step?.state?.bestRange || null);
  const bestWindow = isPreExecution
    ? ''
    : (state?.bestWindow || step?.state?.bestWindow || (bestRange ? s.slice(bestRange[0], bestRange[1] + 1) : currentWindow));
  const maxLength = isPreExecution
    ? 0
    : (state?.maxLength ?? step?.state?.maxLength ?? (bestWindow ? bestWindow.length : currentLength));

  const activeCharIndex = isPreExecution ? null : (highlights?.activeCharIndex ?? (state?.currentChar !== undefined ? right : null));
  const duplicateCharIndex = isPreExecution ? null : (highlights?.duplicateCharIndex ?? null);

  const legendItems = [
    { label: 'Left Pointer (L)', badgeClass: 'bg-indigo-600' },
    { label: 'Right Pointer (R)', badgeClass: 'bg-blue-600' },
    { label: 'Current Window Substring', badgeClass: 'bg-blue-500/30' },
    ...(duplicateCharIndex !== null ? [{ label: 'Duplicate Character', badgeClass: 'bg-rose-500' }] : []),
    ...(isCompleted ? [{ label: `Optimal Substring: "${bestWindow}" (Length ${maxLength})`, badgeClass: 'bg-emerald-600' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Substring & Window Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638]">
        {/* Current Window Substring Display */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold">
            <span>Win</span>
            <span>[{currentLength}]</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Current Window Substring
              </span>
              {currentRange && (
                <span className="text-[10px] font-mono text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded border border-blue-200/50">
                  [{currentRange[0]}, {currentRange[1]}]
                </span>
              )}
            </div>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
              {isPreExecution ? (
                <span className="text-slate-400 font-normal italic text-xs">Awaiting execution (Step 0)</span>
              ) : currentWindow ? (
                `"${currentWindow}"`
              ) : (
                <span className="text-slate-400 italic text-xs">[ empty ]</span>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Pill Indicators */}
        <div className="flex items-center gap-3 font-mono text-xs flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45]">
            <span className="text-slate-500">Current Length:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{currentLength}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300">Max Length:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{maxLength}</span>
          </div>

          {bestWindow && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50">
              <span className="text-indigo-700 dark:text-indigo-300">Optimal:</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">"{bestWindow}"</span>
              {bestRange && (
                <span className="text-[10px] text-indigo-400">[{bestRange[0]}, {bestRange[1]}]</span>
              )}
            </div>
          )}
        </div>

        {/* Final Result Banner */}
        {isCompleted && (
          <div className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 font-mono text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Optimal Substring: "{bestWindow}" (Length {maxLength}{bestRange ? `, Range [${bestRange[0]}, ${bestRange[1]}]` : ''})</span>
          </div>
        )}
      </div>

      {/* Main String Character Track with Window Highlight */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#172033] space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-500">
            String Character Sequence
          </span>
          <span className="flex items-center gap-2">
            <span>
              {isPreExecution
                ? 'Current Window: None (Step 0)'
                : currentRange
                ? `Current Window: [${currentRange[0]}, ${currentRange[1]}]`
                : 'Current Window: None'}
            </span>
            {bestRange && !isPreExecution && (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                • Optimal Range: [{bestRange[0]}, {bestRange[1]}]
              </span>
            )}
          </span>
        </div>

        {/* Horizontal Character Cells Track */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-6">
          {chars.map((charVal, idx) => {
            const isLeft = left === idx;
            const isRight = right === idx;
            const isInCurrentWindow = !isPreExecution && left !== null && right !== null && idx >= left && idx <= right;
            const isInBestWindow = isCompleted && bestRange && idx >= bestRange[0] && idx <= bestRange[1];
            const isActive = activeCharIndex === idx;
            const isDuplicate = duplicateCharIndex === idx;

            // Compute pointer labels for Current Window (L and R)
            let topPointer = null;
            let topColor = 'blue';

            if (!isPreExecution) {
              if (isLeft && isRight) {
                topPointer = 'L, R';
                topColor = 'purple';
              } else if (isLeft) {
                topPointer = 'L';
                topColor = 'indigo';
              } else if (isRight) {
                topPointer = 'R';
                topColor = 'blue';
              }
            }

            // Bottom label: duplicate warning during execution, or optimal substring on completion
            let bottomLabel = null;
            let bottomColor = 'emerald';
            if (isDuplicate) {
              bottomLabel = 'duplicate';
              bottomColor = 'rose';
            } else if (isCompleted && isInBestWindow) {
              bottomLabel = 'optimal';
              bottomColor = 'emerald';
            }

            return (
              <ArrayCell
                key={idx}
                value={charVal === ' ' ? '␣' : charVal}
                index={idx}
                isActive={isActive}
                isInWindow={isInCurrentWindow}
                isMatched={isInBestWindow && isCompleted}
                isDuplicate={isDuplicate}
                pointerLabel={topPointer}
                pointerColor={topColor}
                bottomPointerLabel={bottomLabel}
                bottomPointerColor={bottomColor}
              />
            );
          })}
        </div>
      </div>

      {/* Duplicate Warning Banner if duplicate active */}
      {duplicateCharIndex !== null && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-mono text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            Duplicate character '{chars[duplicateCharIndex]}' detected at index {duplicateCharIndex}! Shrinking window from left (L) until duplicate is evicted.
          </span>
        </div>
      )}

      {/* Active Window Set / Map Inspector */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-indigo-500" />
            Active Window Characters Set ({Object.keys(windowChars).length} Unique)
          </span>
          <span className="text-slate-400">
            {isPreExecution ? 'Empty Set' : `${Object.keys(windowChars).length} in window`}
          </span>
        </div>

        {Object.keys(windowChars).length === 0 ? (
          <div className="text-xs font-mono text-slate-400 italic py-1">
            Window set is currently empty { '{ }' }
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.entries(windowChars).map(([charKey, idxVal]) => (
              <div
                key={charKey}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/40 text-xs font-mono flex items-center gap-1.5"
              >
                <span className="font-bold text-indigo-700 dark:text-indigo-300">
                  '{charKey === ' ' ? '␣' : charKey}'
                </span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
                <span className="text-slate-500 dark:text-slate-400 font-semibold">idx {idxVal}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}
