import React from 'react';
import { DataStructureCell } from './DataStructureCell';

/**
 * QueuePrimitive — Reusable Primitive Component for Horizontal FIFO Queue Visualization
 * Renders horizontal queue buffer, FRONT and REAR pointers, and expired status tags.
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function QueuePrimitive({
  queue = [],
  frontValue = null,
  rearValue = null,
  expiredValue = null,
  className = '',
}) {
  const queueItems = Array.isArray(queue) ? queue : [];

  return (
    <div aria-label="Queue Buffer" className={`flex flex-col gap-3 ${className}`}>
      {/* FIFO Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
            FIFO
          </span>
          Queue Buffer
        </span>
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-blue-600 dark:text-blue-400">← Dequeue (FRONT)</span>
          <span>|</span>
          <span className="text-emerald-600 dark:text-emerald-400">Enqueue (REAR) ←</span>
        </div>
      </div>

      {/* Queue Strip */}
      <div className="min-h-[130px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 flex items-center justify-center gap-3 overflow-x-auto transition-all duration-300">
        {queueItems.length === 0 ? (
          <div className="py-6 text-center text-slate-400 dark:text-slate-600 font-mono text-xs flex items-center gap-2">
            <span className="text-xl opacity-40">📥</span>
            <span>[ Empty Queue Buffer ]</span>
          </div>
        ) : (
          queueItems.map((item, idx) => {
            const isFrontItem = idx === 0;
            const isRearItem = idx === queueItems.length - 1;
            const isExpired = expiredValue !== null && item === expiredValue && isFrontItem;

            let pointerLabel = null;
            let pointerColor = 'blue';

            if (isFrontItem && isRearItem) {
              pointerLabel = 'FRONT & REAR';
              pointerColor = 'indigo';
            } else if (isFrontItem) {
              pointerLabel = 'FRONT';
              pointerColor = 'blue';
            } else if (isRearItem) {
              pointerLabel = 'REAR';
              pointerColor = 'emerald';
            }

            if (isExpired) {
              pointerLabel = 'EXPIRED';
              pointerColor = 'rose';
            }

            return (
              <div key={idx} className="flex flex-col items-center shrink-0">
                <DataStructureCell
                  value={item}
                  index={idx}
                  isFront={isFrontItem}
                  isRear={isRearItem}
                  isExpired={isExpired}
                  pointerLabel={pointerLabel}
                  pointerColor={pointerColor}
                  position="top"
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
