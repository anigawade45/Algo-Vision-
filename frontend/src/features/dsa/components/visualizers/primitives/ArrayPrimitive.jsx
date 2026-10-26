import React from 'react';
import { ArrayCell } from './ArrayCell';

/**
 * ArrayPrimitive — Reusable Primitive Component for Array Visualization
 * Renders values, indices, active/matched/changed index states, and pointer labels.
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function ArrayPrimitive({
  values = [],
  activeIndex = null,
  matchedIndices = [],
  changedIndices = [],
  duplicateIndices = [],
  windowRange = null,
  pointerLabels = {}, // { [index]: { label: 'i', color: 'blue', position: 'top' } }
  bottomPointerLabels = {},
  showBarHeights = false,
  maxBarValue = null,
  statusBadges = {},
  className = '',
}) {
  if (!Array.isArray(values) || values.length === 0) {
    return (
      <div className={`p-4 text-center text-slate-400 font-mono text-xs ${className}`}>
        [ No array elements ]
      </div>
    );
  }

  const matchedSet = new Set(matchedIndices);
  const changedSet = new Set(changedIndices);
  const duplicateSet = new Set(duplicateIndices);

  const isInWindow = (idx) => {
    if (!Array.isArray(windowRange) || windowRange.length < 2) return false;
    return idx >= windowRange[0] && idx <= windowRange[1];
  };

  const maxVal = showBarHeights
    ? maxBarValue || Math.max(...values.map((v) => (typeof v === 'number' ? v : Number(v) || 0)), 1)
    : 1;

  const containerClasses = showBarHeights
    ? `flex items-end justify-center gap-2 sm:gap-3 overflow-x-auto pt-6 pb-3 px-2 border-b-2 border-slate-300 dark:border-slate-800/80 ${className}`
    : `flex items-center justify-center gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-4 px-2 ${className}`;

  return (
    <div aria-label="Array elements" className={containerClasses}>
      {values.map((val, idx) => {
        const isActive = activeIndex === idx;
        const isMatched = matchedSet.has(idx);
        const isChanged = changedSet.has(idx);
        const isDuplicate = duplicateSet.has(idx);
        const inWindow = isInWindow(idx);

        const topPointer = pointerLabels[idx];
        const bottomPointer = bottomPointerLabels[idx];

        const barHeight = showBarHeights
          ? Math.max(48, Math.round(((Number(val) || 0) / maxVal) * 150))
          : null;

        const cellStatusBadge = statusBadges[idx] || (isDuplicate ? 'BLOCKED' : null);

        return (
          <ArrayCell
            key={idx}
            value={val}
            index={idx}
            isActive={isActive}
            isMatched={isMatched}
            isChanged={isChanged}
            isDuplicate={isDuplicate}
            isInWindow={inWindow}
            pointerLabel={topPointer?.label || (isActive ? topPointer?.label || 'active' : null)}
            pointerColor={topPointer?.color || 'blue'}
            bottomPointerLabel={bottomPointer?.label}
            bottomPointerColor={bottomPointer?.color || 'emerald'}
            showBar={showBarHeights}
            barHeight={barHeight}
            statusBadge={cellStatusBadge}
          />
        );
      })}
    </div>
  );
}
