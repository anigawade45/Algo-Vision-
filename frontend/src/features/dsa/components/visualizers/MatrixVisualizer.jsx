import React from 'react';
import { MatrixCell } from './primitives/MatrixCell';

/**
 * MatrixVisualizer — Stage 09 Generic Matrix Visualization Renderer
 * Reuses MatrixCell primitive for 2D matrix transformations like Rotate Image (Transpose + Reverse).
 */
export function MatrixVisualizer({ problem, step }) {
  if (!step || !step.state) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        Matrix data unavailable for this step.
      </div>
    );
  }

  const { state = {}, highlights = {}, description } = step;
  const matrix = Array.isArray(state.matrix) ? state.matrix : (problem?.input?.matrix ?? []);
  const phase = state.phase || 'initial';
  const currentOperation = state.currentOperation || null;
  const swappedCells = state.swappedCells || [];
  const highlightedCells = highlights.cells || [];

  if (!Array.isArray(matrix) || matrix.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        No matrix data available.
      </div>
    );
  }

  const rowCount = matrix.length;
  const colCount = matrix[0]?.length || 0;

  // Build lookup sets for fast cell matching
  const swappedSet = new Set((swappedCells || []).map(([r, c]) => `${r},${c}`));
  const highlightSet = new Set((highlightedCells || []).map(([r, c]) => `${r},${c}`));

  // Phase badge styles
  const phaseBadgeStyles = {
    initial: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    transpose: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    transposed: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    reverse: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    complete: 'bg-emerald-600 text-white shadow-emerald-500/20',
  }[phase] || 'bg-slate-100 text-slate-700';

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto py-2">
      {/* Top Transformation Telemetry & Phase Indicator */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Transformation Phase:
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border border-transparent transition-all duration-200 ${phaseBadgeStyles}`}
          >
            {phase}
          </span>
        </div>

        {currentOperation && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Operation:</span>
            <strong className="text-amber-600 dark:text-amber-400">{currentOperation}</strong>
          </div>
        )}
      </div>

      {/* Main 2D Matrix Grid Container */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
        <div className="w-full flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            2D Matrix ({rowCount} × {colCount})
          </span>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            {swappedCells.length > 0 && (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Swapping Cells [{swappedCells.map(([r, c]) => `${r},${c}`).join(' ↔ ')}]
              </span>
            )}
          </div>
        </div>

        {/* Matrix Rendering with Column & Row Labels */}
        <div className="inline-block p-4 sm:p-6 rounded-2xl bg-[#070A12] border-2 border-slate-700 shadow-2xl overflow-x-auto">
          {/* Column Header Indices */}
          <div className="flex gap-2 sm:gap-3 mb-2 ml-7 sm:ml-9">
            {Array.from({ length: colCount }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="w-10 sm:w-14 text-center font-mono text-xs font-bold text-slate-400 dark:text-slate-500"
              >
                Col {cIdx}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="flex flex-col gap-2 sm:gap-3">
            {matrix.map((rowArr, rIdx) => (
              <div key={rIdx} className="flex items-center gap-2 sm:gap-3">
                {/* Row Header Index */}
                <span className="w-5 sm:w-7 text-right font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                  R{rIdx}
                </span>

                {/* Cells in Row */}
                {rowArr.map((cellVal, cIdx) => {
                  const isSwapped = swappedSet.has(`${rIdx},${cIdx}`);
                  const isHighlighted = highlightSet.has(`${rIdx},${cIdx}`);

                  return (
                    <MatrixCell
                      key={`${rIdx}-${cIdx}`}
                      value={cellVal}
                      row={rIdx}
                      col={cIdx}
                      isSwapped={isSwapped}
                      isHighlighted={isHighlighted}
                      size={rowCount <= 4 ? 'large' : 'medium'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Swap Visual Link Info */}
        {swappedCells.length === 2 && (
          <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 rounded-full shadow-xs">
            <span>
              Cell [{swappedCells[0][0]},{swappedCells[0][1]}]
            </span>
            <span>⇄</span>
            <span>
              Cell [{swappedCells[1][0]},{swappedCells[1][1]}]
            </span>
          </div>
        )}
      </div>

      {/* Description Banner */}
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
