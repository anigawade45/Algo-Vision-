import React from 'react';

/**
 * STEP EXPLANATION ("WHY DID THIS HAPPEN?")
 * Concise educational reasoning explaining the current execution step.
 */
export function StepExplanation({ explanation, stepNo, sectionNo = '05' }) {
  if (!explanation) return null;

  return (
    <section aria-labelledby="step-explanation-heading" className="space-y-2 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase">
        <span>{sectionNo}</span>
        <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
        <h2 id="step-explanation-heading" className="font-bold text-blue-600 dark:text-blue-400">
          WHY DID THIS STEP HAPPEN?
        </h2>
      </div>

      <div className="border-l-2 border-blue-500 dark:border-blue-400 pl-3.5 py-1">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
          {explanation}
        </p>
      </div>
    </section>
  );
}

export default StepExplanation;
