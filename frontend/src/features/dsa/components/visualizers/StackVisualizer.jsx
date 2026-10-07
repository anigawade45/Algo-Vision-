import React from 'react';
import { PointerLabel } from './primitives/PointerLabel';
import { DataStructureCell } from './primitives/DataStructureCell';

/**
 * StackVisualizer — Stage 09 Stack Visualization Renderer
 * Used for Stack-based benchmark problems like Valid Parentheses.
 * Visualizes vertical stack operations (PUSH / POP), TOP pointer, and current input character.
 */
export function StackVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Stack data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, operation, description } = step;
  const inputStr = state.s || (problem?.input?.s ?? '');
  const stack = Array.isArray(state.stack) ? state.stack : [];
  const currentIndex = state.currentIndex ?? highlights.index ?? null;
  const currentChar = state.currentChar ?? null;
  const topElement = highlights.top ?? (stack.length > 0 ? stack[stack.length - 1] : null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-2">
      {/* Input String Tracker Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Input String Stream
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            s = "{inputStr}"
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {inputStr.split('').map((char, idx) => {
            const isCurrent = currentIndex === idx;
            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[36px]">
                {/* Pointer label for active char */}
                <div className="h-5 flex items-end">
                  {isCurrent && <PointerLabel label="Current" color="indigo" position="top" />}
                </div>

                <div
                  aria-label={`Character ${char} at index ${idx}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-200 select-none ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-400 scale-105'
                      : idx < currentIndex
                      ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                      : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {char}
                </div>

                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  {idx}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Vertical Stack Container */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px]">
              LIFO
            </span>
            Stack Memory Visualizer
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Size: <strong className="text-indigo-600 dark:text-indigo-400">{stack.length}</strong>
          </span>
        </div>

        {/* TOP Indicator */}
        <div className="flex flex-col items-center mb-2">
          <div className="flex items-center gap-1 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 px-3 py-1 rounded-full shadow-xs">
            <span>TOP OF STACK</span>
            <span>↓</span>
          </div>
        </div>

        {/* Vertical Stack Columns */}
        <div className="w-64 sm:w-72 min-h-[220px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 flex flex-col justify-end gap-2 items-center transition-all duration-300">
          {stack.length === 0 ? (
            <div className="my-auto py-8 text-center text-slate-400 dark:text-slate-600 font-mono text-xs flex flex-col items-center gap-2">
              <span className="text-2xl opacity-40">📭</span>
              <span>[ Empty Stack ]</span>
              <span className="text-[10px] text-slate-400">Ready for PUSH operation</span>
            </div>
          ) : (
            // Render stack from top to bottom (index length-1 down to 0)
            [...stack].reverse().map((item, revIdx) => {
              const actualIdx = stack.length - 1 - revIdx;
              const isTopItem = revIdx === 0;

              return (
                <div key={actualIdx} className="w-full transition-all duration-200 transform scale-100">
                  <DataStructureCell
                    value={item}
                    index={actualIdx}
                    isTop={isTopItem}
                    pointerLabel={isTopItem ? 'TOP' : null}
                    pointerColor="indigo"
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

      {/* Operation Status Feedback */}
      {description && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl p-3 text-center">
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
