import React from 'react';
import { MatrixCell } from './MatrixCell';

export function MatrixGrid({
  board = [],
  currentRow = null,
  currentCol = null,
  duplicateCell = null,
  conflictCells = [],
}) {
  if (!Array.isArray(board) || board.length === 0) {
    return (
      <div className="p-6 text-center text-slate-400 font-mono text-xs">
        No matrix board data available.
      </div>
    );
  }

  const conflictSet = new Set(
    (conflictCells || []).map(([r, c]) => `${r},${c}`)
  );

  const isDuplicate = (r, c) => {
    if (duplicateCell && duplicateCell[0] === r && duplicateCell[1] === c) return true;
    return conflictSet.has(`${r},${c}`);
  };

  const isSameRowColBox = (r, c) => {
    if (currentRow === null || currentCol === null) return false;
    if (r === currentRow || c === currentCol) return true;
    // Check 3x3 box
    const currentBoxRow = Math.floor(currentRow / 3);
    const currentBoxCol = Math.floor(currentCol / 3);
    const cellBoxRow = Math.floor(r / 3);
    const cellBoxCol = Math.floor(c / 3);
    return currentBoxRow === cellBoxRow && currentBoxCol === cellBoxCol;
  };

  return (
    <div className="inline-block p-3 sm:p-4 rounded-2xl bg-[#070A12] border-2 border-slate-700 shadow-xl overflow-x-auto">
      <div className="grid grid-cols-9 gap-1 sm:gap-1.5">
        {board.map((rowArr, rIdx) =>
          rowArr.map((cellVal, cIdx) => {
            const isCurrent = currentRow === rIdx && currentCol === cIdx;
            const isConf = isDuplicate(rIdx, cIdx);
            const isInBox = isSameRowColBox(rIdx, cIdx);

            return (
              <MatrixCell
                key={`${rIdx}-${cIdx}`}
                value={cellVal}
                row={rIdx}
                col={cIdx}
                isCurrent={isCurrent}
                isConflict={isConf}
                isDuplicate={isConf}
                isInSameRowColBox={isInBox && !isCurrent}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
