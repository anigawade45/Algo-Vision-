import React from 'react';
import { GridCell } from './GridCell';

/**
 * GridPrimitive — Reusable Primitive Component for 2D Grid & Graph Traversal Visualizations
 * Renders 2D grid cells (Land vs Water, Visited/Sunk, Current Cell) dynamically.
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function GridPrimitive({
  grid = [],
  currentCell = null,
  visitedCells = [],
  activeIslandId = null,
  className = '',
}) {
  const gridArr = Array.isArray(grid) ? grid : [];

  if (gridArr.length === 0) {
    return (
      <div className={`p-4 text-center text-slate-400 font-mono text-xs ${className}`}>
        [ No grid data available ]
      </div>
    );
  }

  const rowCount = gridArr.length;
  const colCount = gridArr[0]?.length || 0;

  const visitedSet = new Set((visitedCells || []).map(([r, c]) => `${r},${c}`));
  const isCurrent = (r, c) => currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  const isVisited = (r, c) => visitedSet.has(`${r},${c}`);

  return (
    <div aria-label="2D Grid Canvas" className={`inline-block p-4 sm:p-5 rounded-2xl bg-[#070A12] border-2 border-slate-700 shadow-2xl overflow-x-auto max-w-full ${className}`}>
      {/* Column Indices */}
      <div className="flex gap-2 sm:gap-3 mb-2 ml-7 sm:ml-9">
        {Array.from({ length: colCount }).map((_, cIdx) => (
          <div
            key={cIdx}
            className="w-11 sm:w-14 text-center font-mono text-xs font-bold text-slate-400 dark:text-slate-500"
          >
            Col {cIdx}
          </div>
        ))}
      </div>

      {/* Grid Rows */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {gridArr.map((rowArr, rIdx) => (
          <div key={rIdx} className="flex items-center gap-2 sm:gap-3">
            {/* Row Index */}
            <span className="w-5 sm:w-7 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
              R{rIdx}
            </span>

            {/* Cells */}
            {rowArr.map((cellVal, cIdx) => (
              <GridCell
                key={`${rIdx}-${cIdx}`}
                value={cellVal}
                row={rIdx}
                col={cIdx}
                isCurrent={isCurrent(rIdx, cIdx)}
                isVisited={isVisited(rIdx, cIdx)}
                islandId={activeIslandId}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
