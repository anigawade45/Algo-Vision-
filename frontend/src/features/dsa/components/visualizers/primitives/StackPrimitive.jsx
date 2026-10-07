import React from 'react';
import { DataStructureCell } from './DataStructureCell';

/**
 * StackPrimitive — Reusable Primitive Component for Vertical LIFO Stack Visualization
 * Renders vertical stack memory, top element pointer, and stack base.
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function StackPrimitive({
  stack = [],
  topPointerLabel = 'TOP',
  topPointerColor = 'indigo',
  className = '',
}) {
  const stackItems = Array.isArray(stack) ? stack : [];

  return (
    <div aria-label="Stack Memory" className={`flex flex-col items-center ${className}`}>
      {/* TOP Indicator */}
      <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 rounded-full shadow-xs mb-2">
        <span>TOP OF STACK</span>
        <span>↓</span>
      </div>

      {/* Stack Items Column */}
      <div className="w-64 sm:w-72 min-h-[200px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 flex flex-col justify-end gap-2 items-center transition-all duration-300">
        {stackItems.length === 0 ? (
          <div className="my-auto py-8 text-center text-slate-400 dark:text-slate-600 font-mono text-xs flex flex-col items-center gap-2">
            <span className="text-2xl opacity-40">📭</span>
            <span>[ Empty Stack ]</span>
          </div>
        ) : (
          [...stackItems].reverse().map((item, revIdx) => {
            const actualIdx = stackItems.length - 1 - revIdx;
            const isTopItem = revIdx === 0;

            return (
              <div key={actualIdx} className="w-full transition-all duration-200">
                <DataStructureCell
                  value={item}
                  index={actualIdx}
                  isTop={isTopItem}
                  pointerLabel={isTopItem ? topPointerLabel : null}
                  pointerColor={topPointerColor}
                  position="top"
                  className="w-full"
                />
              </div>
            );
          })
        )}
      </div>

      {/* STACK BASE Indicator */}
      <div className="mt-3 flex items-center justify-center">
        <div className="w-64 sm:w-72 border-t-2 border-slate-300 dark:border-slate-700 text-center pt-1.5">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            ═══ STACK BASE ═══
          </span>
        </div>
      </div>
    </div>
  );
}
