import React from 'react';

/**
 * EXECUTION SUMMARY & KEY OBSERVATIONS
 * Displays post-execution summary and key observations.
 */
export function ExecutionSummary({ summary, sectionNo = '08' }) {
  if (!summary) return null;

  const { title, takeaway, observations } = summary;

  return (
    <section aria-labelledby="execution-summary-heading" className="space-y-3 font-sans">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-500 dark:text-amber-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
        <span>EXECUTION SUMMARY</span>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-[#0B101D] border border-slate-800 text-white space-y-4 shadow-md">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <h2 id="execution-summary-heading" className="text-base sm:text-lg font-bold text-white">
            {title || 'Algorithm Execution Summary'}
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          {takeaway || 'The algorithm processed each element while maintaining the required state to produce the final output.'}
        </p>

        {observations && observations.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <span className="text-[11px] font-mono font-bold text-blue-400 uppercase tracking-wider block">
              KEY DERIVED OBSERVATIONS
            </span>
            <div className="space-y-3">
              {observations.map((obs, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 py-1 font-sans border-b border-slate-800/50 last:border-b-0"
                >
                  <span className="text-xs font-mono font-extrabold text-amber-400 shrink-0 pt-0.5">
                    0{idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                    {obs}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ExecutionSummary;
