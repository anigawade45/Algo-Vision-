import React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

function formatPseudocodeLines(step) {
  if (Array.isArray(step.pseudocodeLines) && step.pseudocodeLines.length > 0) {
    const lines = Array.from(new Set(step.pseudocodeLines)).sort((a, b) => a - b);
    if (lines.length === 1) {
      const num = lines[0];
      return `LINE ${num < 10 ? `0${num}` : num}`;
    }

    const ranges = [];
    let start = lines[0];
    let end = lines[0];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] === end + 1) {
        end = lines[i];
      } else {
        ranges.push(start === end ? `${start < 10 ? `0${start}` : start}` : `${start < 10 ? `0${start}` : start}–${end < 10 ? `0${end}` : end}`);
        start = lines[i];
        end = lines[i];
      }
    }
    ranges.push(start === end ? `${start < 10 ? `0${start}` : start}` : `${start < 10 ? `0${start}` : start}–${end < 10 ? `0${end}` : end}`);

    return `LINES ${ranges.join(', ')}`;
  }
  if (step.pseudocodeLine !== undefined && step.pseudocodeLine !== null) {
    const num = step.pseudocodeLine;
    return `LINE ${num < 10 ? `0${num}` : num}`;
  }
  return 'LINE —';
}

/**
 * EXECUTION TABLE VIEW
 * Displays step execution history in a dynamic, clear CS trace matrix table.
 * Users can inspect all steps at once or jump directly to any step by clicking/navigating rows.
 */
export function ExecutionTableView({
  steps,
  currentStep,
  onSelectStep,
  sectionNo = '04',
  isFullscreen = false,
  onToggleFullscreen,
}) {
  if (!steps || !steps.length) return null;

  return (
    <section aria-labelledby="execution-table-heading" className="space-y-3 font-sans w-full">
      {/* Numbered Section Header & State Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase">
          <span>{sectionNo}</span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <h2 id="execution-table-heading" className="font-bold text-emerald-600 dark:text-emerald-400">
            DYNAMIC EXECUTION TRACE TABLE
          </h2>
        </div>

        {/* Small, Non-Card State Legend & Fullscreen Button */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-400 shrink-0" aria-hidden="true" />
            <span>State change = value changed this step</span>
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">•</span>
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 text-[11px]">
            Click row / Press Enter to jump to step
          </span>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300/80 dark:border-slate-700 text-xs font-mono font-semibold cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title={isFullscreen ? 'Exit Full Screen (Esc)' : 'Full Screen Table View'}
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Table Container with Internal Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101D] shadow-2xs">
        <table className="w-full min-w-[768px] text-left font-sans text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#070A13] text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th scope="col" className="py-2.5 px-3.5 border-r border-slate-200/80 dark:border-slate-800/80 w-[95px] whitespace-nowrap">Step</th>
              <th scope="col" className="py-2.5 px-3.5 border-r border-slate-200/80 dark:border-slate-800/80 min-w-[170px]">Pseudocode Line</th>
              <th scope="col" className="py-2.5 px-3.5 border-r border-slate-200/80 dark:border-slate-800/80 min-w-[180px]">Condition Check</th>
              <th scope="col" className="py-2.5 px-3.5 border-r border-slate-200/80 dark:border-slate-800/80 min-w-[210px]">Action Taken</th>
              <th scope="col" className="py-2.5 px-3.5 border-r border-slate-200/80 dark:border-slate-800/80 min-w-[200px]">Memory State</th>
              <th scope="col" className="py-2.5 px-3.5 last:border-r-0 min-w-[120px] text-right">CURRENT RESULT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/70">
            {steps.map((st, idx) => {
              const isActive = idx === currentStep;

              // Extract mutation map for highlighted variables
              const changeVars = (st.changes || []).map((c) => (typeof c === 'string' ? c : c.var));
              const isResultChanged = changeVars.includes('result') || changeVars.includes('merged') || (st.changes || []).some((c) => (c.var || c) === 'result');

              return (
                <tr
                  key={idx}
                  tabIndex={0}
                  role="button"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => onSelectStep && onSelectStep(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectStep && onSelectStep(idx);
                    }
                  }}
                  className={`cursor-pointer transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-blue-50/90 dark:bg-blue-950/40 font-medium border-l-4 border-l-blue-500'
                      : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/40 text-slate-700 dark:text-slate-300 border-l-4 border-l-transparent'
                  }`}
                >
                  {/* Step No */}
                  <td className="py-3 px-3.5 border-r border-slate-200/60 dark:border-slate-800/60 align-top whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Step {st.stepNo < 10 ? `0${st.stepNo}` : st.stepNo}
                    </span>
                  </td>

                  {/* Pseudocode Line */}
                  <td className="py-3 px-3.5 border-r border-slate-200/60 dark:border-slate-800/60 align-top">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 block tracking-wide uppercase">
                        {formatPseudocodeLines(st)}
                      </span>
                      <span className="text-xs font-mono text-slate-800 dark:text-slate-200 leading-normal block whitespace-pre-wrap">
                        {st.pseudocodeText}
                      </span>
                    </div>
                  </td>

                  {/* Condition Check */}
                  <td className="py-3 px-3.5 border-r border-slate-200/60 dark:border-slate-800/60 align-top">
                    <div className="space-y-1">
                      {st.condition ? (
                        <>
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold font-mono uppercase ${
                              st.condition.passes !== false
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                            }`}
                          >
                            {st.condition.passes !== false ? 'YES' : 'NO'}
                          </span>
                          <span className="text-xs font-sans text-slate-700 dark:text-slate-300 leading-normal block">
                            {st.condition.text}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-mono text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </div>
                  </td>

                  {/* Action Taken */}
                  <td className="py-3 px-3.5 border-r border-slate-200/60 dark:border-slate-800/60 align-top">
                    <span className="text-xs font-sans text-slate-800 dark:text-slate-200 leading-normal block">
                      {st.action?.description || st.title || '—'}
                    </span>
                  </td>

                  {/* Memory State - Restrained Monospace without Card Soup */}
                  <td className="py-3 px-3.5 border-r border-slate-200/60 dark:border-slate-800/60 align-top">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-mono leading-normal">
                      {st.variables && st.variables.length > 0 ? (
                        st.variables.map((v, vIdx) => {
                          const isMutated = changeVars.includes(v.name) || v.changed === true;

                          return isMutated ? (
                            <span
                              key={vIdx}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/80 text-amber-900 dark:text-amber-200 font-bold"
                              title={`Changed in step ${st.stepNo}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" aria-hidden="true" />
                              <span>{v.name} = {v.value}</span>
                              <span className="sr-only">(changed)</span>
                            </span>
                          ) : (
                            <span key={vIdx} className="text-slate-700 dark:text-slate-300">
                              <span className="text-slate-400 dark:text-slate-500">{v.name} = </span>
                              <span>{v.value}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">—</span>
                      )}
                    </div>
                  </td>

                  {/* CURRENT RESULT */}
                  <td className="py-3 px-3.5 last:border-r-0 align-top text-right whitespace-nowrap">
                    {st.currentResult ? (
                      <span
                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                          isResultChanged
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-800/70'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {st.currentResult}
                      </span>
                    ) : (
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-600">[ ]</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ExecutionTableView;
