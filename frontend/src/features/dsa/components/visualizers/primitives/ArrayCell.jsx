import React from 'react';
import { PointerLabel } from './PointerLabel';

export function ArrayCell({
  value,
  index,
  isActive = false,
  isMatched = false,
  isChanged = false,
  isDuplicate = false,
  isInWindow = false,
  pointerLabel = null,
  pointerColor = 'blue',
  bottomPointerLabel = null,
  bottomPointerColor = 'emerald',
}) {
  // Determine cell border, background, and text styling
  let containerStyle =
    'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';

  if (isMatched) {
    containerStyle =
      'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400';
  } else if (isDuplicate) {
    containerStyle =
      'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 ring-2 ring-rose-400 animate-pulse';
  } else if (isActive) {
    containerStyle =
      'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/20 ring-2 ring-blue-400';
  } else if (isInWindow) {
    containerStyle =
      'bg-blue-50 dark:bg-blue-950/60 border-blue-400 dark:border-blue-600 text-blue-900 dark:text-blue-100 ring-1 ring-blue-400/40';
  } else if (isChanged) {
    containerStyle =
      'bg-amber-50 dark:bg-amber-950/50 border-amber-400 dark:border-amber-600 text-amber-900 dark:text-amber-100 ring-1 ring-amber-400/50';
  }

  return (
    <div
      aria-label={`Element ${value} at index ${index}`}
      className="flex flex-col items-center justify-between min-w-[52px] sm:min-w-[64px] gap-1 transition-all duration-200"
    >
      {/* Top Pointer Arrow */}
      <div className="h-6 flex items-end justify-center">
        {pointerLabel && <PointerLabel label={pointerLabel} color={pointerColor} position="top" />}
      </div>

      {/* Main Cell Body */}
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center font-mono text-base sm:text-lg font-bold transition-all duration-200 select-none ${containerStyle}`}
      >
        {value === null || value === undefined ? '∅' : String(value)}
      </div>

      {/* Index Badge Label */}
      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
        [{index}]
      </span>

      {/* Bottom Pointer Arrow */}
      <div className="h-6 flex items-start justify-center">
        {bottomPointerLabel && (
          <PointerLabel label={bottomPointerLabel} color={bottomPointerColor} position="bottom" />
        )}
      </div>
    </div>
  );
}
