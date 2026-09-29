import React from 'react';

/**
 * SECTION 03 — THINK IN STEPS
 * Prepares the learner by introducing the high-level logical step sequence.
 */
export function ThinkInSteps({ stepOverview, sectionNo = '03' }) {
  if (!stepOverview || !stepOverview.length) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="think-in-steps-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>THINK IN STEPS</span>
      </div>

      <h2 id="think-in-steps-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Logical Sequence Breakdown
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Before viewing full pseudocode, outline the high-level operational sequence.
      </p>

      {/* Grid of Logical Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stepOverview.map((step, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-2 shadow-xs transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-extrabold flex items-center justify-center shrink-0">
                {step.stepNo || `0${idx + 1}`}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {step.title}
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ThinkInSteps;
