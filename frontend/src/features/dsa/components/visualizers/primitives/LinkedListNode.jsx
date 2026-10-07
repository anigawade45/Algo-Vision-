import React from 'react';
import { PointerLabel } from './PointerLabel';

/**
 * LinkedListNode — Primitive Component for Linked List Node rendering
 * Renders node value, ID, and active pointer badges (PREV, CURR, NEXT, HEAD).
 */
export function LinkedListNode({
  id,
  val,
  isPrev = false,
  isCurr = false,
  isNext = false,
  isHead = false,
}) {
  let nodeStyle =
    'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs';

  if (isCurr) {
    nodeStyle =
      'bg-blue-600 text-white border-blue-700 shadow-lg shadow-blue-500/30 ring-2 ring-blue-400 font-bold scale-105';
  } else if (isPrev) {
    nodeStyle =
      'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400 font-bold';
  } else if (isNext) {
    nodeStyle =
      'bg-emerald-600 text-white border-emerald-700 shadow-md shadow-emerald-500/20 ring-2 ring-emerald-400 font-bold';
  }

  // Stacked pointer labels if node has multiple pointers
  const pointerLabels = [];
  if (isHead) pointerLabels.push({ label: 'HEAD', color: 'purple' });
  if (isPrev) pointerLabels.push({ label: 'PREV', color: 'indigo' });
  if (isCurr) pointerLabels.push({ label: 'CURR', color: 'blue' });
  if (isNext) pointerLabels.push({ label: 'NEXT', color: 'emerald' });

  return (
    <div className="flex flex-col items-center gap-1 shrink-0">
      {/* Top Pointers */}
      <div className="h-10 flex flex-col items-center justify-end gap-0.5">
        {pointerLabels.map((p, idx) => (
          <PointerLabel key={idx} label={p.label} color={p.color} position="top" />
        ))}
      </div>

      {/* Node Body */}
      <div
        aria-label={`Linked list node with value ${val} ID ${id}`}
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex flex-col items-center justify-center font-mono transition-all duration-200 select-none ${nodeStyle}`}
      >
        <span className="text-base sm:text-lg font-bold">{val}</span>
      </div>

      {/* Node ID Badge */}
      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
        node({id})
      </span>
    </div>
  );
}
