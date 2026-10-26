import React from 'react';
import { PointerLabel } from './PointerLabel';

export function DataStructureCell({
  value,
  index = null,
  isTop = false,
  isFront = false,
  isRear = false,
  isExpired = false,
  isActive = false,
  isMatched = false,
  pointerLabel = null,
  pointerColor = 'blue',
  position = 'top',
  className = '',
}) {
  let containerStyle =
    'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs';

  if (isExpired) {
    containerStyle =
      'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400 ring-2 ring-rose-500/50 opacity-70 stroke-dash';
  } else if (isMatched) {
    containerStyle =
      'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400 font-bold';
  } else if (isTop) {
    containerStyle =
      'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400 font-bold';
  } else if (isFront || isRear) {
    containerStyle =
      'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/20 ring-2 ring-blue-400 font-bold';
  } else if (isActive) {
    containerStyle =
      'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20 ring-2 ring-sky-400';
  }

  return (
    <div
      aria-label={`Cell value ${value}`}
      className={`flex flex-col items-center justify-between transition-all duration-200 ${className}`}
    >
      {/* Top Pointer */}
      {position === 'top' && (
        <div className="h-6 flex items-end justify-center min-h-[24px]">
          {pointerLabel && <PointerLabel label={pointerLabel} color={pointerColor} position="top" />}
        </div>
      )}

      {/* Main Cell Container */}
      <div
        className={`px-4 py-2.5 min-w-[56px] min-h-[44px] rounded-xl border-2 flex items-center justify-center font-mono text-base sm:text-lg font-bold transition-all duration-200 select-text ${containerStyle}`}
      >
        {isExpired && <span className="mr-1 text-xs text-rose-500 dark:text-rose-400">×</span>}
        <span className="leading-none">{value === null || value === undefined ? '∅' : String(value)}</span>
      </div>

      {/* Optional Index or Sub-label */}
      {index !== null && index !== undefined && (
        <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 mt-1">
          [{index}]
        </span>
      )}

      {/* Bottom Pointer */}
      {position === 'bottom' && (
        <div className="h-6 flex items-start justify-center min-h-[24px]">
          {pointerLabel && (
            <PointerLabel label={pointerLabel} color={pointerColor} position="bottom" />
          )}
        </div>
      )}
    </div>
  );
}
