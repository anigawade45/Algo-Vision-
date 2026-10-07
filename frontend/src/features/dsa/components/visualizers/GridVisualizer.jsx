import React from 'react';
import { GridCell } from './primitives/GridCell';

/**
 * GridVisualizer — Stage 09 Grid & DFS/BFS Traversal Renderer
 * Used for Grid benchmark problems like Number of Islands.
 * Visualizes 2D grid cells (Land 🏝️ vs Water 🌊), active DFS cell, visited/sunk land, and island counter telemetry.
 */
export function GridVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Grid data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, description } = step;
  const grid = Array.isArray(state.grid) ? state.grid : (problem?.input?.grid ?? []);
  const currentCell = state.currentCell ?? highlights.currentCell ?? null;
  const visitedCells = Array.isArray(state.visitedCells) ? state.visitedCells : (highlights.visited || []);
  const islandCount = state.islandCount ?? highlights.totalIslands ?? 0;
  const result = state.result ?? null;
  const activeIslandId = highlights.islandId ?? null;

  if (!Array.isArray(grid) || grid.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        No grid data available.
      </div>
    );
  }

  const rowCount = grid.length;
  const colCount = grid[0]?.length || 0;

  // Build lookup set for fast visited cell checking
  const visitedSet = new Set((visitedCells || []).map(([r, c]) => `${r},${c}`));

  const isCurrent = (r, c) => currentCell !== null && currentCell[0] === r && currentCell[1] === c;
  const isVisited = (r, c) => visitedSet.has(`${r},${c}`);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Islands Count Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-amber-200 dark:border-amber-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
            Islands Found
          </span>
          <div className="my-1 font-mono text-2xl font-bold text-amber-600 dark:text-amber-400">
            {islandCount}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {activeIslandId ? `Exploring Island #${activeIslandId}` : 'Scanning grid...'}
          </span>
        </div>

        {/* Active Cell Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            Current DFS Cell
          </span>
          <div className="my-1 font-mono text-xl font-bold text-blue-600 dark:text-blue-400">
            {currentCell ? `(${currentCell[0]}, ${currentCell[1]})` : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {currentCell ? `Row ${currentCell[0]}, Col ${currentCell[1]}` : 'Scanner idle'}
          </span>
        </div>

        {/* Visited Cells Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            Sunk Land Cells
          </span>
          <div className="my-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {visitedCells.length}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Connected land visited
          </span>
        </div>

        {/* Final Result Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-purple-200 dark:border-purple-900/40 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
            Total Islands Result
          </span>
          <div className="my-1 font-mono text-2xl font-bold text-purple-600 dark:text-purple-400">
            {result !== null ? result : '—'}
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {result !== null ? 'Scan Complete!' : 'In progress'}
          </span>
        </div>
      </div>

      {/* Main 2D Grid Canvas & Legend Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center gap-6">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            2D Grid Canvas ({rowCount} × {colCount})
          </span>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-md bg-cyan-500/20 border border-cyan-400"></span> Water (0)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500"></span> Land (1)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500"></span> Visited/Sunk
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-md bg-blue-600"></span> Current
            </span>
          </div>
        </div>

        {/* 2D Grid Rendering Container */}
        <div className="inline-block p-4 sm:p-6 rounded-2xl bg-[#070A12] border-2 border-slate-700 shadow-2xl overflow-x-auto max-w-full">
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
            {grid.map((rowArr, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 sm:gap-3">
                {/* Row Index */}
                <span className="w-5 sm:w-7 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                  R{rIdx}
                </span>

                {/* Cells in Row */}
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
