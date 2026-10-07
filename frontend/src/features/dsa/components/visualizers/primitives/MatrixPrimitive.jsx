import React from 'react';
import { MatrixCell } from './MatrixCell';

/**
 * MatrixPrimitive — Reusable 2D Matrix Primitive Component
 * Presentational renderer for 2D matrix / grid states.
 * Supports row/column coordinates, cell values, current cell highlight,
 * swapped cells, changed cells, and conflict cells.
 */
export function MatrixPrimitive({
  matrix = [],
  currentRow = null,
  currentCol = null,
  activeCell = null, // [row, col]
  highlightedCells = [], // Array of [row, col]
  swappedCells = [], // Array of [row, col]
  conflictCells = [], // Array of [row, col]
  changedCells = [], // Array of [row, col]
  is3x3Subgrid = false,
  size = 'medium',
  className = '',
}) {
  if (!Array.isArray(matrix) || matrix.length === 0 || !Array.isArray(matrix[0])) {
    return (
      <div className={`p-4 text-center text-slate-400 font-mono text-xs ${className}`}>
        [ Empty matrix ]
      </div>
    );
  }

  const activeR = activeCell ? activeCell[0] : currentRow;
  const activeC = activeCell ? activeCell[1] : currentCol;

  const highlightSet = new Set((highlightedCells || []).map(([r, c]) => `${r},${c}`));
  const swapSet = new Set((swappedCells || []).map(([r, c]) => `${r},${c}`));
  const conflictSet = new Set((conflictCells || []).map(([r, c]) => `${r},${c}`));
  const changedSet = new Set((changedCells || []).map(([r, c]) => `${r},${c}`));

  const numCols = matrix[0].length;

  return (
    <div
      aria-label="Matrix visualization"
      className={`inline-block p-3 sm:p-4 rounded-2xl bg-[#070A12] border border-slate-700 shadow-xl overflow-x-auto ${className}`}
    >
      <div
        className="grid gap-1 sm:gap-1.5"
        style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}
      >
        {matrix.map((rowArr, rIdx) =>
          rowArr.map((cellVal, cIdx) => {
            const key = `${rIdx},${cIdx}`;
            const isCurrent = activeR === rIdx && activeC === cIdx;
            const isConflict = conflictSet.has(key);
            const isSwapped = swapSet.has(key);
            const isHighlighted = highlightSet.has(key) || changedSet.has(key);

            return (
              <MatrixCell
                key={key}
                value={cellVal}
                row={rIdx}
                col={cIdx}
                isCurrent={isCurrent}
                isConflict={isConflict}
                isDuplicate={isConflict}
                isSwapped={isSwapped}
                isHighlighted={isHighlighted}
                is3x3Subgrid={is3x3Subgrid}
                totalCols={numCols}
                size={size}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
