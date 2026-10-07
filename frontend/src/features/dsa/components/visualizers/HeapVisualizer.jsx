import React from 'react';
import { TreeNode } from './primitives/TreeNode';
import { DataStructureCell } from './primitives/DataStructureCell';
import { PointerLabel } from './primitives/PointerLabel';

/**
 * HeapVisualizer — Stage 09 Heap / Priority Queue Visualization Renderer
 * Used for Heap benchmark problems like Kth Largest Element in an Array (Min-Heap Strategy).
 * Visualizes hierarchical Min-Heap tree, underlying array buffer, input stream, and popped root history.
 */
export function HeapVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Heap data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, description } = step;
  const nums = Array.isArray(state.nums) ? state.nums : (problem?.input?.nums ?? []);
  const k = state.k ?? problem?.input?.k ?? 2;
  const currentIndex = state.currentIndex ?? highlights.index ?? null;
  const currentVal = state.currentVal ?? null;
  const minHeap = Array.isArray(state.minHeap) ? state.minHeap : (highlights.heap || []);
  const poppedVal = state.poppedVal ?? highlights.popped ?? null;
  const resultVal = state.result ?? null;
  const topVal = highlights.top ?? (minHeap.length > 0 ? minHeap[0] : null);

  // Derive 0-indexed heap tree node coordinates for up to 7 elements
  // Heap layout mapping by index:
  // Root = 0
  // Left = 1, Right = 2
  // Leaves = 3, 4, 5, 6
  const heapNodeCoords = [
    { x: 50, y: 15 }, // Index 0 (Root)
    { x: 28, y: 50 }, // Index 1
    { x: 72, y: 50 }, // Index 2
    { x: 16, y: 82 }, // Index 3
    { x: 40, y: 82 }, // Index 4
    { x: 60, y: 82 }, // Index 5
    { x: 84, y: 82 }, // Index 6
  ];

  // Helper to compute parent-child edges for current heap size
  const heapEdges = [];
  for (let i = 0; i < minHeap.length; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    if (leftIdx < minHeap.length) heapEdges.push({ from: i, to: leftIdx });
    if (rightIdx < minHeap.length) heapEdges.push({ from: i, to: rightIdx });
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* K & Capacity Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            K Value & Capacity
          </span>
          <div className="my-1 flex items-baseline gap-1.5 font-mono">
            <span className="text-xl font-bold text-amber-600 dark:text-amber-400">K = {k}</span>
            <span className="text-xs text-slate-400">(Max size {k})</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Heap Size: {minHeap.length} / {k}
          </span>
        </div>

        {/* Current Val Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Current Element
          </span>
          <div className="my-1 font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
            {currentVal !== null ? currentVal : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentIndex !== null ? `nums[${currentIndex}]` : 'Waiting...'}
          </span>
        </div>

        {/* Popped Root Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-rose-200 dark:border-rose-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">
            Popped Root Minimum
          </span>
          <div className="my-1 font-mono text-xl font-bold text-rose-600 dark:text-rose-400">
            {poppedVal !== null ? poppedVal : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {poppedVal !== null ? 'Exceeded K size → Popped' : 'None popped'}
          </span>
        </div>

        {/* Result Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Kth Largest Result
          </span>
          <div className="my-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {resultVal !== null ? resultVal : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {resultVal !== null ? `${k}nd Largest Found!` : 'In progress'}
          </span>
        </div>
      </div>

      {/* Input Array Tracker Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Input Array Stream
          </span>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            nums = [{nums.join(', ')}]
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          {nums.map((num, idx) => {
            const isCurrent = currentIndex === idx;
            return (
              <div key={idx} className="flex flex-col items-center gap-1 min-w-[36px]">
                <div className="h-5 flex items-end">
                  {isCurrent && <PointerLabel label="Current" color="blue" position="top" />}
                </div>

                <div
                  aria-label={`Input array number ${num} at index ${idx}`}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-all duration-200 select-none ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400 scale-105'
                      : idx < currentIndex
                      ? 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                      : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {num}
                </div>

                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                  [{idx}]
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Canvas: Min-Heap Tree + Array Buffer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Min-Heap Tree View (Span 2 cols) */}
        <div className="md:col-span-2 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">
                PRIORITY QUEUE
              </span>
              Min-Heap Tree Structure
            </span>

            <span className="text-xs font-mono text-slate-400">
              Root (Min): <strong className="text-amber-600 dark:text-amber-400">{topVal !== null ? topVal : '—'}</strong>
            </span>
          </div>

          <div className="relative w-full max-w-md h-[240px] sm:h-[260px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 transition-all duration-300 flex items-center justify-center">
            {minHeap.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-600 font-mono text-xs flex flex-col items-center gap-2">
                <span className="text-2xl opacity-40">🌋</span>
                <span>[ Min-Heap Empty ]</span>
              </div>
            ) : (
              <>
                {/* SVG Edges between parent and child heap nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-400/60 dark:stroke-amber-600/60 stroke-[2.5]">
                  {heapEdges.map(({ from, to }, idx) => {
                    const p1 = heapNodeCoords[from];
                    const p2 = heapNodeCoords[to];
                    if (!p1 || !p2) return null;
                    return (
                      <line
                        key={idx}
                        x1={`${p1.x}%`}
                        y1={`${p1.y + 8}%`}
                        x2={`${p2.x}%`}
                        y2={`${p2.y + 4}%`}
                      />
                    );
                  })}
                </svg>

                {/* Heap Tree Nodes */}
                {minHeap.map((val, idx) => {
                  const pos = heapNodeCoords[idx] || { x: 50, y: 50 };
                  const isRoot = idx === 0;
                  const isLastInserted = idx === minHeap.length - 1;

                  let pointerLabel = null;
                  let pointerColor = 'amber';

                  if (isRoot) {
                    pointerLabel = 'ROOT (MIN)';
                    pointerColor = 'amber';
                  } else if (isLastInserted && minHeap.length > 1) {
                    pointerLabel = 'Inserted';
                    pointerColor = 'emerald';
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -20%)',
                      }}
                    >
                      <TreeNode
                        value={val}
                        isRoot={isRoot}
                        badgeText={`[${idx}]`}
                        pointerLabel={pointerLabel}
                        pointerColor={pointerColor}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Underlying Array Buffer Side Panel (Span 1 col) */}
        <div className="md:col-span-1 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Heap Array Buffer
              </span>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                Size: {minHeap.length}
              </span>
            </div>

            <div className="min-h-[140px] bg-slate-50/60 dark:bg-[#070A12] border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 flex flex-col gap-2 items-center justify-center">
              {minHeap.length === 0 ? (
                <span className="text-xs font-mono text-slate-400 dark:text-slate-600">
                  [ Buffer Empty ]
                </span>
              ) : (
                minHeap.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-full py-1.5 px-3 rounded-lg border font-mono text-xs font-bold flex items-center justify-between transition-all duration-200 ${
                      idx === 0
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span>[{idx}]</span>
                    <span className="text-sm">{val}</span>
                    {idx === 0 && <span className="text-[9px] bg-white/20 px-1 rounded">MIN</span>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              Parent(i) = ⌊(i-1)/2⌋
            </span>
          </div>
        </div>
      </div>

      {/* Description Banner */}
      {description && (
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-xl p-3 text-center">
          <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
