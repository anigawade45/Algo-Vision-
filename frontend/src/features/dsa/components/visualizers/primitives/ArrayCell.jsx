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
  showBar = false,
  barHeight = null,
  statusBadge = null,
}) {
  // If building tower visualization is requested
  if (showBar) {
    const isBlocked = isDuplicate || statusBadge === 'BLOCKED';
    const computedHeight = Math.max(48, Math.min(180, barHeight || 60));

    let buildingStyle =
      'bg-gradient-to-t from-slate-200 via-slate-100 to-white dark:from-[#0B101D] dark:via-[#162032] dark:to-[#1E293B] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-sm';

    if (isBlocked) {
      buildingStyle =
        'bg-gradient-to-t from-rose-950 via-rose-900 to-rose-600 border-rose-500 text-white shadow-xl shadow-rose-500/30 ring-2 ring-rose-400 animate-pulse';
    } else if (isActive) {
      buildingStyle =
        'bg-gradient-to-t from-blue-950 via-blue-900 to-blue-600 border-blue-400 text-white shadow-xl shadow-blue-500/40 ring-2 ring-blue-400 scale-[1.02]';
    } else if (isMatched) {
      buildingStyle =
        'bg-gradient-to-t from-emerald-950 via-emerald-900 to-emerald-600 border-emerald-400 text-white shadow-md shadow-emerald-500/20';
    } else if (isChanged) {
      buildingStyle =
        'bg-gradient-to-t from-amber-950 via-amber-900 to-amber-600 border-amber-400 text-white shadow-md shadow-amber-500/20';
    }

    const windowRows = Math.max(1, Math.min(5, Math.floor((computedHeight - 30) / 22)));

    return (
      <div
        aria-label={`Building ${index} of height ${value}`}
        className="flex flex-col items-center justify-end min-w-[56px] sm:min-w-[68px] gap-1 transition-all duration-300 select-none"
      >
        {/* Top Pointer Arrow & Floating Badges */}
        <div className="h-9 flex flex-col items-center justify-end">
          {statusBadge && (
            <span className="px-1.5 py-0.5 rounded-full font-mono text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md shadow-rose-500/30 border border-rose-400 animate-bounce">
              {statusBadge}
            </span>
          )}
          {pointerLabel && <PointerLabel label={pointerLabel} color={pointerColor} position="top" />}
        </div>

        {/* Building Tower Column */}
        <div
          style={{ height: `${computedHeight}px` }}
          className={`w-14 sm:w-16 rounded-t-xl border-2 flex flex-col justify-between overflow-hidden transition-all duration-300 relative ${buildingStyle}`}
        >
          {/* Rooftop Banner with Height Value */}
          <div className="w-full py-1 bg-black/40 border-b border-white/10 flex items-center justify-center gap-1">
            <span className="font-mono text-xs font-black tracking-tight drop-shadow-xs">
              {value === null || value === undefined ? '0' : String(value)}
            </span>
          </div>

          {/* Architectural Window Grids */}
          <div className="flex-1 w-full p-1.5 flex flex-col justify-evenly items-center opacity-70">
            {Array.from({ length: windowRows }).map((_, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-1.5 rounded-[1px] ${isActive ? 'bg-amber-300 shadow-xs shadow-amber-300' : isBlocked ? 'bg-rose-300' : 'bg-blue-300/40 dark:bg-amber-100/20'}`} />
                <div className={`w-2.5 h-1.5 rounded-[1px] ${isActive ? 'bg-amber-300 shadow-xs shadow-amber-300' : isBlocked ? 'bg-rose-300' : 'bg-blue-300/40 dark:bg-amber-100/20'}`} />
              </div>
            ))}
          </div>

          {/* Building Base Label */}
          <div className="w-full text-center py-0.5 bg-black/30 border-t border-white/5 text-[9px] font-mono opacity-70">
            H: {value}
          </div>
        </div>

        {/* Index Badge */}
        <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500 pt-0.5">
          [{index}]
        </span>

        {/* Bottom Pointer Arrow */}
        <div className="h-5 flex items-start justify-center">
          {bottomPointerLabel && (
            <PointerLabel label={bottomPointerLabel} color={bottomPointerColor} position="bottom" />
          )}
        </div>
      </div>
    );
  }

  // Standard flat cell rendering (fallback / default)
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
