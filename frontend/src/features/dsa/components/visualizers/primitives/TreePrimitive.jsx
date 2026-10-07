import React from 'react';
import { TreeNode } from './TreeNode';

/**
 * TreePrimitive — Reusable Binary / General Tree Primitive Component
 * Presentational renderer for tree data structures.
 * Supports SVG edge connectors, root highlight, current node highlight,
 * visited nodes, and stack/queued node indicators.
 * Deterministic, side-effect free, and algorithm-agnostic.
 */
export function TreePrimitive({
  nodes = null, // { [val]: { x: percentage, y: percentage } } or default standard 3-level tree
  edges = [],
  currentNode = null,
  visitedNodes = [],
  stackNodes = [],
  rootValue = null,
  height = 'h-[280px] sm:h-[320px]',
  className = '',
}) {
  // Standard 3-level tree layout fallback if nodes coordinate map is not provided
  const defaultNodeCoords = {
    4: { x: 50, y: 15 },
    2: { x: 26, y: 45 },
    6: { x: 74, y: 45 },
    1: { x: 14, y: 80 },
    3: { x: 38, y: 80 },
    5: { x: 62, y: 80 },
    7: { x: 86, y: 80 },
  };

  const defaultEdges = [
    { from: 4, to: 2 },
    { from: 4, to: 6 },
    { from: 2, to: 1 },
    { from: 2, to: 3 },
    { from: 6, to: 5 },
    { from: 6, to: 7 },
  ];

  const coordsMap = nodes || defaultNodeCoords;
  const edgeList = edges.length > 0 ? edges : defaultEdges;

  const nodeKeys = Object.keys(coordsMap);

  if (nodeKeys.length === 0) {
    return (
      <div
        aria-label="Empty tree state"
        className={`p-6 text-center text-slate-400 font-mono text-xs ${className}`}
      >
        [ Empty tree ]
      </div>
    );
  }

  const visitedSet = new Set(visitedNodes);
  const stackSet = new Set(stackNodes);

  return (
    <div
      aria-label="Tree visual structure"
      className={`relative w-full max-w-lg ${height} bg-slate-50/60 dark:bg-[#070A12] border border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 transition-all duration-300 ${className}`}
    >
      {/* SVG Edge Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 stroke-[2.5] stroke-linecap-round">
        {edgeList.map(({ from, to }, idx) => {
          const p1 = coordsMap[from];
          const p2 = coordsMap[to];
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

      {/* Tree Nodes */}
      {Object.entries(coordsMap).map(([valStr, pos]) => {
        const val = isNaN(Number(valStr)) ? valStr : Number(valStr);
        const isCurrent = currentNode === val;
        const isVisited = visitedSet.has(val);
        const isInStack = stackSet.has(val);
        const isRoot = rootValue !== null ? rootValue === val : val === 4;

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
            key={valStr}
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
  );
}
