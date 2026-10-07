import React from 'react';
import { PointerLabel } from './PointerLabel';

/**
 * GridCell — Primitive Component for 2D Grid & Graph Traversal Visualizations
 * Used for Grid-based benchmark problems like Number of Islands.
 */
export function GridCell({
  value,
  row,
  col,
  isCurrent = false,
  isVisited = false,
  islandId = null,
}) {
  const isWater = value === '0' || value === 0;
  const isLand = value === '1' || value === 1;

  let cellStyle =
    'bg-slate-100 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600';

  if (isCurrent) {
    cellStyle =
      'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400 font-bold scale-105 z-10';
  } else if (isVisited) {
    cellStyle =
      'bg-emerald-500/20 dark:bg-emerald-950/50 border-emerald-500/60 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-400/50 font-semibold';
  } else if (isLand) {
    cellStyle =
      'bg-amber-500/20 dark:bg-amber-950/50 border-amber-500/60 text-amber-800 dark:text-amber-200 font-bold ring-1 ring-amber-400/40';
  } else if (isWater) {
    cellStyle =
      'bg-cyan-500/10 dark:bg-cyan-950/30 border-cyan-200/50 dark:border-cyan-900/40 text-cyan-700/60 dark:text-cyan-400/50';
  }

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      {/* Top Pointer Arrow for Current Cell */}
      <div className="h-5 flex items-end justify-center min-h-[20px]">
        {isCurrent && <PointerLabel label="Current" color="blue" position="top" />}
      </div>

      {/* Main Cell Container */}
      <div
        aria-label={`Grid cell row ${row} column ${col}, ${
          isCurrent
            ? 'Current Cell'
            : isVisited
            ? `Visited Island ${islandId || ''}`
            : isLand
            ? 'Land'
            : 'Water'
        }`}
        className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono text-sm sm:text-base font-bold transition-all duration-200 select-none ${cellStyle}`}
      >
        <span className="text-base sm:text-lg">{isWater ? '🌊' : '🏝️'}</span>
      </div>

      {/* Cell Coordinates */}
      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
        ({row},{col})
      </span>
    </div>
  );
}
