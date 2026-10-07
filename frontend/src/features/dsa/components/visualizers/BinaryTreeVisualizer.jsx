import React from 'react';
import { TreeNode } from './primitives/TreeNode';
import { PointerLabel } from './primitives/PointerLabel';

/**
 * BinaryTreeVisualizer — Stage 09 Binary Tree Visualization Renderer
 * Visualizes hierarchical Binary Tree traversal (Inorder: Left -> Root -> Right),
 * highlighting current node, visited nodes, stack state, and traversal result output.
 */
export function BinaryTreeVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Binary Tree data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, description } = step;
  const rootObj = problem?.input?.root || null;
  const currentNodeVal = state.currentNode ?? highlights.currentNode ?? null;
  const stack = Array.isArray(state.stack) ? state.stack : (highlights.stackNodes || []);
  const visited = Array.isArray(state.visited) ? state.visited : (highlights.visitedNodes || []);
  const result = Array.isArray(state.result) ? state.result : [];

  const visitedSet = new Set(visited);
  const stackSet = new Set(stack);

  if (!rootObj) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        [ Tree is empty: root = null ]
      </div>
    );
  }

  // Hardcoded node layout coordinates for standard 3-level binary tree for 100% crisp SVG rendering
  // Tree Structure: 4 (root), 2 (left), 6 (right), 1 (left-left), 3 (left-right), 5 (right-left), 7 (right-right)
  const nodeCoords = {
    4: { x: 50, y: 15, level: 0 },
    2: { x: 26, y: 45, level: 1 },
    6: { x: 74, y: 45, level: 1 },
    1: { x: 14, y: 80, level: 2 },
    3: { x: 38, y: 80, level: 2 },
    5: { x: 62, y: 80, level: 2 },
    7: { x: 86, y: 80, level: 2 },
  };

  const edges = [
    { from: 4, to: 2 },
    { from: 4, to: 6 },
    { from: 2, to: 1 },
    { from: 2, to: 3 },
    { from: 6, to: 5 },
    { from: 6, to: 7 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Banner & Strategy Legend */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">
            INORDER DFS
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Traversal Order: <strong className="text-indigo-600 dark:text-indigo-400">Left → Root → Right</strong>
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> Current Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span> In Stack
          </span>
        </div>
      </div>

      {/* Main Canvas: Tree & Call Stack Split View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tree Container (Span 3 cols) */}
        <div className="md:col-span-3 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Binary Tree View
            </span>
            <span className="text-xs font-mono text-slate-400">
              Root: <strong>4</strong>
            </span>
          </div>

          {/* Tree Graphics Area with SVG Line Connectors */}
          <div className="relative w-full max-w-lg h-[280px] sm:h-[320px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 transition-all duration-300">
            {/* SVG Connecting Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 stroke-[2.5] stroke-linecap-round">
              {edges.map(({ from, to }, idx) => {
                const p1 = nodeCoords[from];
                const p2 = nodeCoords[to];
                if (!p1 || !p2) return null;

                const isTraversedEdge = visitedSet.has(from) && visitedSet.has(to);

                return (
                  <line
                    key={idx}
                    x1={`${p1.x}%`}
                    y1={`${p1.y + 6}%`}
                    x2={`${p2.x}%`}
                    y2={`${p2.y + 4}%`}
                    className={
                      isTraversedEdge
                        ? 'stroke-emerald-500 stroke-[3.5] transition-all duration-300'
                        : 'transition-all duration-300'
                    }
                  />
                );
              })}
            </svg>

            {/* Tree Node Components */}
            {Object.entries(nodeCoords).map(([valStr, pos]) => {
              const val = Number(valStr);
              const isCurrent = currentNodeVal === val;
              const isVisited = visitedSet.has(val);
              const isInStack = stackSet.has(val);
              const isRoot = val === 4;

              let pointerLabel = null;
              let pointerColor = 'blue';

              if (isCurrent) {
                pointerLabel = 'Current';
                pointerColor = 'blue';
              } else if (isInStack) {
                pointerLabel = 'Stack';
                pointerColor = 'indigo';
              } else if (isVisited) {
                pointerLabel = 'Visited';
                pointerColor = 'emerald';
              }

              return (
                <div
                  key={val}
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
                    isCurrent={isCurrent}
                    isVisited={isVisited}
                    isInStack={isInStack}
                    pointerLabel={pointerLabel}
                    pointerColor={pointerColor}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Call Stack Side Panel (Span 1 col) */}
        <div className="md:col-span-1 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                DFS Call Stack
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                [{stack.length}]
              </span>
            </div>

            <div className="flex flex-col-reverse gap-2 min-h-[140px] bg-slate-50/60 dark:bg-[#070A12] border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-3 items-center justify-start">
              {stack.length === 0 ? (
                <span className="my-auto text-[11px] font-mono text-slate-400 dark:text-slate-600 text-center">
                  [ Stack Empty ]
                </span>
              ) : (
                stack.map((item, sIdx) => {
                  const isTop = sIdx === stack.length - 1;
                  return (
                    <div
                      key={sIdx}
                      className={`w-full py-1.5 px-3 rounded-lg border font-mono text-xs font-bold text-center flex items-center justify-between transition-all duration-200 ${
                        isTop
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-300'
                      }`}
                    >
                      <span>node({item})</span>
                      {isTop && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">TOP</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              LIFO Traversal Stack
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Traversal Result Accumulator */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Inorder Traversal Output Result
          </span>
          <span className="text-xs font-mono text-slate-400">
            Visited: {visited.length} / 7 nodes
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-2">
          {visited.length === 0 ? (
            <span className="text-xs font-mono text-slate-400 dark:text-slate-600 py-1">
              [ Traversal Output Empty: Waiting for first node visit... ]
            </span>
          ) : (
            visited.map((val, idx) => (
              <React.Fragment key={idx}>
                <div className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-mono text-sm font-bold shadow-sm shadow-emerald-500/20 ring-2 ring-emerald-400 scale-105 transition-all duration-200 shrink-0">
                  {val}
                </div>
                {idx < visited.length - 1 && (
                  <span className="text-slate-400 font-mono font-bold">→</span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Description Banner */}
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
