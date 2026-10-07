import React from 'react';
import { Layers, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import { ArrayCell } from './primitives/ArrayCell';
import { VisualizationLegend } from './primitives/VisualizationLegend';

export function SlidingWindowVisualizer({ problem, step, state, highlights = {} }) {
  // String input & pointers state
  const s = state?.s || problem?.input?.s || '';
  const chars = s.split('');

  const left = state?.left ?? highlights?.left ?? 0;
  const right = state?.right ?? highlights?.right ?? 0;
  const windowRange = highlights?.windowRange || [left, right];

  const activeCharIndex = highlights?.activeCharIndex ?? (state?.currentChar ? right : null);
  const duplicateCharIndex = highlights?.duplicateCharIndex ?? null;

  const windowString = state?.windowString || s.slice(left, right + 1);
  const currentLength = windowString.length;
  const maxLength = state?.maxLength ?? currentLength;

  const legendItems = [
    { label: 'Left Pointer (L)', badgeClass: 'bg-indigo-600' },
    { label: 'Right Pointer (R)', badgeClass: 'bg-blue-600' },
    { label: 'Active Window Substring', badgeClass: 'bg-blue-500/30' },
    ...(duplicateCharIndex !== null ? [{ label: 'Duplicate Character', badgeClass: 'bg-rose-500' }] : []),
  ];

  return (
    <div className="space-y-6">
      {/* Substring & Window Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638]">
        {/* Current Window Substring */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
            Window
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Current Window Substring
            </span>
            <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
              "{windowString}"
            </div>
          </div>
        </div>

        {/* Metrics Pill Indicators */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45]">
            <span className="text-slate-500">Current Length:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{currentLength}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-700 dark:text-emerald-300">Max Length:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{maxLength}</span>
          </div>
        </div>
      </div>

      {/* Main String Character Track with Window Highlight */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#172033] space-y-4 shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="font-bold uppercase tracking-wider text-slate-500">
            String Character Sequence
          </span>
          <span>
            Window Range: [{left}, {right}]
          </span>
        </div>

        {/* Horizontal Character Cells Track */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto py-6">
          {chars.map((charVal, idx) => {
            const isLeft = left === idx;
            const isRight = right === idx;
            const isInWindow = idx >= left && idx <= right;
            const isActive = activeCharIndex === idx;
            const isDuplicate = duplicateCharIndex === idx;

            // Compute pointer labels
            let topPointer = null;
            let topColor = 'blue';

            if (isLeft && isRight) {
              topPointer = 'L, R';
              topColor = 'indigo';
            } else if (isLeft) {
              topPointer = 'L';
              topColor = 'indigo';
            } else if (isRight) {
              topPointer = 'R';
              topColor = 'blue';
            }

            return (
              <ArrayCell
                key={idx}
                value={charVal}
                index={idx}
                isActive={isActive}
                isInWindow={isInWindow}
                isDuplicate={isDuplicate}
                pointerLabel={topPointer}
                pointerColor={topColor}
                bottomPointerLabel={isDuplicate ? 'duplicate' : null}
                bottomPointerColor="rose"
              />
            );
          })}
        </div>
      </div>

      {/* Duplicate Warning Banner if applicable */}
      {duplicateCharIndex !== null && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs font-mono text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>
            Duplicate character '{chars[duplicateCharIndex]}' detected at index {duplicateCharIndex}! Moving left pointer past previous occurrence.
          </span>
        </div>
      )}

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}
