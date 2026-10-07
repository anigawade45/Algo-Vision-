import React from 'react';
import { Grid, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { MatrixGrid } from './primitives/MatrixGrid';
import { HashSetVisualizer } from './HashSetVisualizer';
import { VisualizationLegend } from './primitives/VisualizationLegend';

export function MatrixHashSetVisualizer({ problem, step, state, highlights = {} }) {
  const board = state?.board || problem?.input?.board || [];
  const currentRow = state?.currentRow ?? null;
  const currentCol = state?.currentCol ?? null;
  const currentValue = state?.currentValue ?? null;
  const rowKey = state?.rowKey ?? null;
  const colKey = state?.colKey ?? null;
  const boxKey = state?.boxKey ?? null;
  const seen = state?.seen || [];
  const isValid = state?.isValid ?? true;
  const result = state?.result ?? null;

  const duplicateCell = highlights?.duplicateCell || null;
  const conflictCells = highlights?.conflictCells || (highlights?.cells ? highlights.cells : []);

  const legendItems = [
    { label: 'Active Cell Being Evaluated', badgeClass: 'bg-blue-600' },
    { label: 'Related Row / Col / 3x3 Box', badgeClass: 'bg-blue-400/40' },
    { label: 'Duplicate / Conflict Cell', badgeClass: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Section: Responsive Grid Layout with Matrix Board & HashSet Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 9x9 Sudoku Board */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#172033] flex flex-col items-center justify-center space-y-4 shadow-inner">
          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-blue-500" />
              9×9 Sudoku Matrix Grid
            </span>
            <span>
              Cell: [{currentRow ?? '•'}, {currentCol ?? '•'}]
            </span>
          </div>

          <MatrixGrid
            board={board}
            currentRow={currentRow}
            currentCol={currentCol}
            duplicateCell={duplicateCell}
            conflictCells={conflictCells}
          />
        </div>

        {/* Right Column: Dedicated HashSet Membership Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <HashSetVisualizer
            seen={seen}
            currentRow={currentRow}
            currentCol={currentCol}
            currentValue={currentValue}
            rowKey={rowKey}
            colKey={colKey}
            boxKey={boxKey}
            isValid={isValid}
            result={result}
            title="Sudoku HashSet Validation Inspector"
          />
        </div>
      </div>

      {/* Legend */}
      <VisualizationLegend items={legendItems} />
    </div>
  );
}
