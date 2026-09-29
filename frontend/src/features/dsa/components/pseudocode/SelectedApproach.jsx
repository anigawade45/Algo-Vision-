import React from 'react';
import { Workflow } from 'lucide-react';

/**
 * SECTION 01 — SELECTED APPROACH
 * Displays the approach selected in Stage 05 without reopening algorithm comparison.
 */
export function SelectedApproach({ approachName, approachContext, sectionNo = '01' }) {
  return (
    <section className="space-y-2.5 font-sans" aria-labelledby="selected-approach-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>SELECTED APPROACH</span>
      </div>

      <div className="space-y-1.5 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <Workflow className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              ALGORITHM SELECTION FROM STAGE 05
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold">
            Selected Strategy
          </span>
        </div>

        <h2 id="selected-approach-heading" className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
          {approachName || 'Selected Algorithm Approach'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {approachContext || 'This is the approach selected in Stage 05.'}
        </p>
      </div>
    </section>
  );
}


export default SelectedApproach;

