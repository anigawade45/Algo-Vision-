import React from 'react';

/**
 * SECTION 08 — CONNECT BACK TO PROBLEM & FINAL TAKEAWAY
 * Closes the abstraction loop and leaves the learner with a crisp mental model.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternTakeaway({ takeaway, patternName, sectionNo = '08' }) {
  if (!takeaway) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-takeaway-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-600 dark:text-amber-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>CONNECTING BACK TO THE PROBLEM & FINAL TAKEAWAY</span>
      </div>

      <h2 id="pattern-takeaway-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Core Structural Mental Model
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        The numbers changed, but the underlying structure stayed the same.
      </p>

      {/* Concrete vs General Comparison */}
      <div className="space-y-6 py-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Specific Problem */}
          <div className="border-l-2 border-slate-300 dark:border-slate-700 pl-4 space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              SPECIFIC PROBLEM
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {takeaway.specificProblem}
            </p>
          </div>

          {/* General Pattern */}
          <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-4 space-y-1">
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              GENERAL PATTERN ({patternName || 'PATTERN'})
            </span>
            <p className="text-xs sm:text-sm font-bold text-blue-950 dark:text-blue-200">
              {takeaway.generalPattern}
            </p>
          </div>
        </div>

        {/* Core Mental Model Quote Callout */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
            CORE MENTAL MODEL
          </span>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200 italic pl-3 border-l-2 border-amber-400">
            "{takeaway.finalStatement}"
          </p>
        </div>
      </div>
    </section>
  );
}

export default PatternTakeaway;
