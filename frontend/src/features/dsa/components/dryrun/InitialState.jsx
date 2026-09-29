import React from 'react';

/**
 * INITIAL STATE
 * Shows the starting memory variables before step 1 execution.
 */
export function InitialState({ initialState, sectionNo = '02' }) {
  if (!initialState || !initialState.variables) return null;

  return (
    <section aria-labelledby="initial-state-heading" className="space-y-2.5 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase">
        <div className="flex items-center gap-2">
          <span>{sectionNo}</span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <h2 id="initial-state-heading" className="font-bold text-indigo-600 dark:text-indigo-400">
            INITIAL STATE (BEFORE EXECUTION)
          </h2>
        </div>

        {initialState.subtitle && (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono font-bold">
            {initialState.subtitle}
          </span>
        )}
      </div>

      {/* Initial State Memory Variables Table with visible borders - Hugs content width */}
      <div className="overflow-x-auto inline-block max-w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101D] shadow-2xs">
        <table className="w-auto text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#070A13] text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {initialState.variables.map((v, idx) => (
                <th key={idx} className="py-2.5 px-4 font-bold border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  {v.label || v.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">
              {initialState.variables.map((v, idx) => (
                <td key={idx} className="py-2.5 px-4 border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  {v.value}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default InitialState;
