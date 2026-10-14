import React from 'react';
import { TreeNode } from './TreeNode';

/**
 * HeapPrimitive — Reusable Min/Max Heap Visualization Primitive
 * Renders hierarchical tree representation and optional array buffer representation.
 * Presentational, deterministic, and algorithm-agnostic.
 * Does NOT perform heapify, sift up, sift down, insertion, or deletion.
 */
export function HeapPrimitive({
  values = [],
  rootIndex = 0,
  insertedIndex = null,
  poppedVal = null,
  comparedIndices = [],
  swappedIndices = [],
  heapType = 'min', // 'min' | 'max'
  showArrayBuffer = true,
  className = '',
}) {
  if (!Array.isArray(values) || values.length === 0) {
    return (
      <div
        aria-label="Empty heap state"
        className={`p-6 text-center text-slate-400 font-mono text-xs ${className}`}
      >
        [ Empty heap ]
      </div>
    );
  }

  // Pre-calculated node coordinates for up to 7 elements
  const heapNodeCoords = [
    { x: 50, y: 15 }, // Root (0)
    { x: 28, y: 50 }, // Left (1)
    { x: 72, y: 50 }, // Right (2)
    { x: 16, y: 82 }, // Left-Left (3)
    { x: 40, y: 82 }, // Left-Right (4)
    { x: 60, y: 82 }, // Right-Left (5)
    { x: 84, y: 82 }, // Right-Right (6)
  ];

  // Derive edges for current heap size
  const heapEdges = [];
  for (let i = 0; i < values.length; i++) {
    const leftIdx = 2 * i + 1;
    const rightIdx = 2 * i + 2;
    if (leftIdx < values.length) heapEdges.push({ from: i, to: leftIdx });
    if (rightIdx < values.length) heapEdges.push({ from: i, to: rightIdx });
  }

  const comparedSet = new Set(comparedIndices);
  const swappedSet = new Set(swappedIndices);

  return (
    <div
      aria-label="Heap visualization"
      className={`flex flex-col gap-4 w-full ${className}`}
    >
      {/* Tree + Array Buffer Dual Container */}
      <div className={`grid grid-cols-1 ${showArrayBuffer ? 'md:grid-cols-3' : 'grid-cols-1'} gap-4`}>
        {/* Tree Representation Container */}
        <div
          className={`${showArrayBuffer ? 'md:col-span-2' : ''
            } bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col items-center`}
        >
          <div className="w-full flex items-center justify-between mb-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">
                {heapType.toUpperCase()} HEAP
              </span>
              Tree View
            </span>
            <span className="text-xs font-mono text-slate-400">
              Root: <strong className="text-amber-600 dark:text-amber-400">{values[0] ?? '—'}</strong>
            </span>
          </div>

          <div className="relative w-full max-w-md h-[220px] sm:h-[250px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 transition-all duration-300 flex items-center justify-center">
            {/* SVG Connector Lines */}
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

            {/* Tree Nodes */}
            {values.map((val, idx) => {
              const pos = heapNodeCoords[idx] || { x: 50, y: 50 };
              const isRoot = idx === rootIndex;
              const isInserted = idx === insertedIndex;
              const isSwapped = swappedSet.has(idx);
              const isCompared = comparedSet.has(idx);

              let pointerLabel = null;
              let pointerColor = 'amber';

              if (isRoot) {
                pointerLabel = `ROOT (${heapType.toUpperCase()})`;
                pointerColor = 'amber';
              } else if (isInserted) {
                pointerLabel = 'Inserted';
                pointerColor = 'emerald';
              } else if (isSwapped) {
                pointerLabel = 'Swapped';
                pointerColor = 'rose';
              } else if (isCompared) {
                pointerLabel = 'Compare';
                pointerColor = 'blue';
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
                    isSwapped={isSwapped}
                    badgeText={`[${idx}]`}
                    pointerLabel={pointerLabel}
                    pointerColor={pointerColor}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Array Buffer Panel */}
        {showArrayBuffer && (
          <div className="md:col-span-1 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  {heapType.toUpperCase()}-HEAP INTERNAL ARRAY
                </span>
                <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                  Size: {values.length}
                </span>
              </div>

              <div className="min-h-[140px] bg-slate-50/60 dark:bg-[#070A12] border border-amber-100 dark:border-amber-900/30 rounded-xl p-3 flex flex-col gap-2 items-center justify-center">
                {values.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-full py-1.5 px-3 rounded-lg border font-mono text-xs font-bold flex items-center justify-between transition-all duration-200 ${idx === 0
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                  >
                    <span>[{idx}]</span>
                    <span className="text-sm">{val}</span>
                    {idx === 0 && (
                      <span className="text-[9px] bg-white/20 px-1 rounded uppercase">
                        {heapType}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                parent(i) = ⌊(i-1)/2⌋
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
