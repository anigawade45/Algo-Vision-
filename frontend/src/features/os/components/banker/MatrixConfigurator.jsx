import { AlertTriangle, CheckCircle2, Zap, RotateCcw } from 'lucide-react';

export default function MatrixConfigurator({
  processCount,
  resourceCount,
  allocation,
  maximum,
  available,
  need,
  validationError,
  onProcessCountChange,
  onResourceCountChange,
  onAllocationChange,
  onMaximumChange,
  onAvailableChange,
  onLoadExample,
  onReset
}) {
  const processLabels = Array.from({ length: processCount }, (_, i) => `P${i}`);
  const resourceLabels = Array.from({ length: resourceCount }, (_, j) => `R${j}`);

  return (
    <div className="space-y-8">
      {/* Header & Presets */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                Matrix Setup
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Banker's Algorithm Input Configuration
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Configure process and resource counts, enter Allocation and Maximum matrices, or load classic benchmark examples.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onLoadExample('classic')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Load Classic Safe Example (5P × 3R)</span>
            </button>

            <button
              onClick={() => onLoadExample('unsafe')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 cursor-pointer flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Unsafe Example (3P × 3R)</span>
            </button>

            <button
              onClick={onReset}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1E2638] text-xs font-bold hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Dimension Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Processes (P):</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onProcessCountChange(Math.max(1, processCount - 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer text-xs"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold w-8 text-center text-cyan-600 dark:text-cyan-400">
                {processCount}
              </span>
              <button
                onClick={() => onProcessCountChange(Math.min(10, processCount + 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer text-xs"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Resource Types (R):</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onResourceCountChange(Math.max(1, resourceCount - 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer text-xs"
              >
                -
              </button>
              <span className="font-mono text-sm font-bold w-8 text-center text-cyan-600 dark:text-cyan-400">
                {resourceCount}
              </span>
              <button
                onClick={() => onResourceCountChange(Math.min(6, resourceCount + 1))}
                className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationError && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-600 dark:text-amber-300 text-xs font-mono flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Available Vector Input Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Available Vector</span>
          </h4>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            Currently Free Unallocated Resources
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {resourceLabels.map((rLabel, j) => (
            <div key={j} className="flex flex-col items-center gap-1">
              <span className="text-[11px] font-mono text-slate-400 font-bold">{rLabel}</span>
              <input
                type="number"
                min="0"
                value={available[j] !== undefined ? available[j] : 0}
                onChange={(e) => onAvailableChange(j, parseInt(e.target.value) || 0)}
                className="w-16 p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-center font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Matrices Grid: Allocation, Maximum, Need */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Matrix 1: Allocation */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              1. Allocation Matrix
            </h4>
            <span className="text-[10px] font-mono text-blue-500 font-bold">Currently Held</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 text-left">Proc</th>
                  {resourceLabels.map(r => (
                    <th key={r} className="py-2 text-center">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processLabels.map((pLabel, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/40">
                    <td className="py-2 font-bold text-cyan-600 dark:text-cyan-400">{pLabel}</td>
                    {resourceLabels.map((_, j) => (
                      <td key={j} className="py-1 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          value={allocation[i]?.[j] !== undefined ? allocation[i][j] : 0}
                          onChange={(e) => onAllocationChange(i, j, parseInt(e.target.value) || 0)}
                          className="w-12 p-1.5 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white focus:border-cyan-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix 2: Maximum */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              2. Maximum Matrix
            </h4>
            <span className="text-[10px] font-mono text-purple-500 font-bold">Peak Demand</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 text-left">Proc</th>
                  {resourceLabels.map(r => (
                    <th key={r} className="py-2 text-center">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processLabels.map((pLabel, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/40">
                    <td className="py-2 font-bold text-purple-600 dark:text-purple-400">{pLabel}</td>
                    {resourceLabels.map((_, j) => (
                      <td key={j} className="py-1 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          value={maximum[i]?.[j] !== undefined ? maximum[i][j] : 0}
                          onChange={(e) => onMaximumChange(i, j, parseInt(e.target.value) || 0)}
                          className="w-12 p-1.5 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-center font-bold text-slate-900 dark:text-white focus:border-purple-500"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix 3: Automatically Calculated Need */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-500" />
              <span>3. Calculated Need Matrix</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">Max - Alloc</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <th className="py-2 text-left">Proc</th>
                  {resourceLabels.map(r => (
                    <th key={r} className="py-2 text-center">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {processLabels.map((pLabel, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-800/40">
                    <td className="py-2 font-bold text-cyan-600 dark:text-cyan-400">{pLabel}</td>
                    {resourceLabels.map((_, j) => {
                      const val = need[i]?.[j] !== undefined ? need[i][j] : 0;
                      return (
                        <td key={j} className="py-2 text-center font-bold text-cyan-600 dark:text-cyan-400">
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
