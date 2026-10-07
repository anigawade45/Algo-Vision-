import React from 'react';

/**
 * MatrixCell — Reusable 2D Matrix Cell Primitive
 * Used across both Matrix + HashSet (Sudoku) and Generic Matrix (Rotate Image) visualizers.
 */
export function MatrixCell({
  value,
  row,
  col,
  isCurrent = false,
  isConflict = false,
  isDuplicate = false,
  isSwapped = false,
  isHighlighted = false,
  isInSameRowColBox = false,
  is3x3Subgrid = false,
  totalCols = 9,
  size = 'medium', // 'small' | 'medium' | 'large'
}) {
  const isDot = value === '.' || value === null || value === undefined;

  let cellStyle =
    'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100';

  if (isConflict || isDuplicate) {
    cellStyle =
      'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 ring-2 ring-rose-400 font-bold animate-pulse';
  } else if (isSwapped) {
    cellStyle =
      'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/25 ring-2 ring-emerald-400 font-bold scale-105';
  } else if (isCurrent) {
    cellStyle =
      'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-500/20 ring-2 ring-blue-400 font-bold scale-105';
  } else if (isHighlighted) {
    cellStyle =
      'bg-sky-500/20 dark:bg-sky-950/60 border-sky-400 dark:border-sky-500 text-sky-900 dark:text-sky-200 ring-1 ring-sky-400 font-semibold';
  } else if (isInSameRowColBox) {
    cellStyle =
      'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200';
  }

  // Determine 3x3 block borders for Sudoku if requested
  const borderRight =
    is3x3Subgrid && (col + 1) % 3 === 0 && col !== totalCols - 1
      ? 'border-r-2 border-r-slate-400 dark:border-r-slate-600'
      : '';
  const borderBottom =
    is3x3Subgrid && (row + 1) % 3 === 0 && row !== totalCols - 1
      ? 'border-b-2 border-b-slate-400 dark:border-b-slate-600'
      : '';

  // Responsive sizing classes based on matrix density
  const sizeClasses = {
    small: 'w-7 h-7 sm:w-9 sm:h-9 text-xs sm:text-sm',
    medium: 'w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base',
    large: 'w-14 h-14 sm:w-16 sm:h-16 text-base sm:text-lg',
  }[size] || 'w-10 h-10 sm:w-12 sm:h-12 text-sm sm:text-base';

  return (
    <div
      aria-label={`Matrix cell row ${row} column ${col} containing ${isDot ? 'empty' : value}`}
      className={`${sizeClasses} border rounded-xl flex items-center justify-center font-mono font-bold transition-all duration-200 select-none ${cellStyle} ${borderRight} ${borderBottom}`}
    >
      {isDot ? <span className="text-slate-300 dark:text-slate-600 font-sans">•</span> : String(value)}
    </div>
  );
}
