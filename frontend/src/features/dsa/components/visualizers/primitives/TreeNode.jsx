import React from 'react';
import { PointerLabel } from './PointerLabel';

/**
 * TreeNode — Reusable Primitive Component for Tree & Heap Node Rendering
 * Used by both BinaryTreeVisualizer and HeapVisualizer.
 */
export function TreeNode({
  value,
  nodeId = null,
  isRoot = false,
  isCurrent = false,
  isVisited = false,
  isInStack = false,
  isPopped = false,
  isSwapped = false,
  pointerLabel = null,
  pointerColor = 'blue',
  badgeText = null,
  size = 'medium',
  className = '',
}) {
  let nodeStyle =
    'bg-white dark:bg-[#0B101D] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-md';

  if (isPopped) {
    nodeStyle =
      'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/30 ring-2 ring-rose-400 font-bold animate-pulse';
  } else if (isSwapped) {
    nodeStyle =
      'bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 font-bold scale-105';
  } else if (isCurrent) {
    nodeStyle =
      'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400 font-bold scale-110';
  } else if (isVisited) {
    nodeStyle =
      'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400 font-bold';
  } else if (isInStack) {
    nodeStyle =
      'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400 font-bold';
  } else if (isRoot) {
    nodeStyle =
      'bg-purple-50 dark:bg-purple-950/50 border-purple-500 text-purple-900 dark:text-purple-200 ring-2 ring-purple-400/60 font-bold';
  }

  const sizeClasses = {
    small: 'w-9 h-9 sm:w-11 sm:h-11 text-xs sm:text-sm',
    medium: 'w-11 h-11 sm:w-13 sm:h-13 text-sm sm:text-base',
    large: 'w-14 h-14 sm:w-16 sm:h-16 text-base sm:text-lg',
  }[size] || 'w-11 h-11 sm:w-13 sm:h-13 text-sm sm:text-base';

  return (
    <div className={`flex flex-col items-center gap-1 shrink-0 ${className}`}>
      {/* Top Pointer Arrow */}
      <div className="h-6 flex items-end justify-center min-h-[24px]">
        {pointerLabel && <PointerLabel label={pointerLabel} color={pointerColor} position="top" />}
      </div>

      {/* Main Node Body */}
      <div
        aria-label={`Tree node value ${value}`}
        className={`${sizeClasses} rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold transition-all duration-300 select-none ${nodeStyle}`}
      >
        <span>{value === null || value === undefined ? '∅' : String(value)}</span>
      </div>

      {/* Node Index or Badge */}
      {badgeText && (
        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">
          {badgeText}
        </span>
      )}
    </div>
  );
}
