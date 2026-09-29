import React from 'react';

/**
 * EXECUTION INPUT
 * Displays the actual problem input parameters and target output in a clean structured card.
 */
export function ExecutionInput({ inputData, approachName, sectionNo = '01' }) {
  if (!inputData) return null;

  const { items, expectedOutput } = inputData;

  return (
    <section aria-labelledby="execution-input-heading" className="space-y-2.5 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase">
        <div className="flex items-center gap-2">
          <span>{sectionNo}</span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <h2 id="execution-input-heading" className="font-bold text-blue-600 dark:text-blue-400">
            PROBLEM EXECUTION INPUT
          </h2>
        </div>

        {approachName && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/80 border border-blue-200/60 dark:border-blue-900/60 text-blue-600 dark:text-blue-300 font-mono text-[11px] font-bold">
            Approach: {approachName}
          </span>
        )}
      </div>

      {/* Structured Input Data Table with visible borders - Hugs content width */}
      <div className="overflow-x-auto inline-block max-w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B101D] shadow-2xs">
        <table className="w-auto text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#070A13] text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {items && items.map((item, idx) => (
                <th key={idx} className="py-2.5 px-4 font-bold border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  {item.label}
                </th>
              ))}
              {expectedOutput && (
                <th className="py-2.5 px-4 font-bold text-emerald-600 dark:text-emerald-400 border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  Expected Output
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            <tr className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {items && items.map((item, idx) => (
                <td key={idx} className="py-2.5 px-4 border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  {item.value}
                </td>
              ))}
              {expectedOutput && (
                <td className="py-2.5 px-4 text-emerald-600 dark:text-emerald-400 font-mono font-extrabold border-r border-slate-200/80 dark:border-slate-800/80 last:border-r-0 whitespace-nowrap">
                  {expectedOutput}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ExecutionInput;
