import React from 'react';
import { PointerLabel } from './primitives/PointerLabel';
import { DataStructureCell } from './primitives/DataStructureCell';

/**
 * QueueVisualizer — Stage 09 Queue Visualization Renderer
 * Used for Queue-based benchmark problems like Number of Recent Calls.
 * Visualizes horizontal FIFO queue operations (ENQUEUE / DEQUEUE), FRONT and REAR pointers,
 * expired elements, and timestamp sliding windows.
 */
export function QueueVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Queue data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, description } = step;
  const queue = Array.isArray(state.queue) ? state.queue : [];
  const pings = Array.isArray(state.pings) ? state.pings : (problem?.input?.pings ?? []);
  const currentPing = state.currentPing ?? null;
  const timeWindow = Array.isArray(state.timeWindow) ? state.timeWindow : null;
  const outputs = Array.isArray(state.outputs) ? state.outputs : [];
  const expiredValue = highlights.expired ?? null;
  const frontValue = highlights.front ?? (queue.length > 0 ? queue[0] : null);
  const rearValue = highlights.rear ?? (queue.length > 0 ? queue[queue.length - 1] : null);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry & Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Ping Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Incoming Ping Timestamp
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {currentPing !== null ? currentPing : '—'}
            </span>
            <span className="text-xs text-slate-400 font-mono">ms</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            {currentPing !== null ? `ping(${currentPing})` : 'Waiting for call...'}
          </span>
        </div>

        {/* 3000ms Sliding Window Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3000ms Time Window [t - 3000, t]
          </span>
          <div className="my-2 font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {timeWindow ? `[${timeWindow[0]}, ${timeWindow[1]}]` : '—'}
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Valid range for recent calls
          </span>
        </div>

        {/* Recent Call Counter Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Calls Count
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {outputs.length > 0 ? outputs[outputs.length - 1] : queue.length}
            </span>
            <span className="text-xs text-slate-400">calls</span>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Outputs: [{outputs.join(', ')}]
          </span>
        </div>
      </div>

      {/* Main Horizontal Queue Container */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        {/* Queue Header & FIFO Label */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
              FIFO
            </span>
            Queue Buffer Memory
          </span>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="text-blue-600 dark:text-blue-400">← Dequeue (FRONT)</span>
            <span>|</span>
            <span className="text-emerald-600 dark:text-emerald-400">Enqueue (REAR) ←</span>
          </div>
        </div>

        {/* Horizontal Queue Strip */}
        <div className="min-h-[140px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-blue-200 dark:border-blue-900/40 rounded-2xl p-6 flex items-center justify-center gap-4 overflow-x-auto transition-all duration-300">
          {queue.length === 0 ? (
            <div className="py-6 text-center text-slate-400 dark:text-slate-600 font-mono text-xs flex items-center gap-2">
              <span className="text-xl opacity-40">📥</span>
              <span>[ Empty Queue Buffer ]</span>
            </div>
          ) : (
            queue.map((item, idx) => {
              const isFrontItem = idx === 0;
              const isRearItem = idx === queue.length - 1;
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

        {/* Expired Warning Alert if present */}
        {expiredValue !== null && (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <span>⚠️</span>
            <span>
              Timestamp <strong>{expiredValue}</strong> is outside time window [{timeWindow?.[0]}, {timeWindow?.[1]}] and will be dequeued.
            </span>
          </div>
        )}
      </div>

      {/* Operation Status Description */}
      {description && (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl p-3 text-center">
          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
