import React from 'react';
import { HelpCircle } from 'lucide-react';

/**
 * SECTION 05 — STEP-BY-STEP WALKTHROUGH
 * Explains every logical step with explicit action and rationale ("WHY?").
 */
export function StepWalkthrough({ walkthrough, sectionNo = '05' }) {
  if (!walkthrough || !walkthrough.length) return null;

  return (
    <section className="space-y-3 font-sans" aria-labelledby="step-walkthrough-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-cyan-600 dark:text-cyan-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>STEP-BY-STEP WALKTHROUGH</span>
      </div>

      <h2 id="step-walkthrough-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Why Each Step Exists
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Understand the purpose behind every instruction in the algorithm.
      </p>

      {/* Streamlined Step List */}
      <div className="space-y-3.5 pt-1">
        {walkthrough.map((item, idx) => (
          <div
            key={idx}
            className="pl-3.5 border-l-2 border-blue-500/80 dark:border-blue-500/80 space-y-1.5 pt-0.5 pb-1"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-600 dark:text-blue-400">
                {item.stepNo || `0${idx + 1}`}
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                {item.action}
              </h3>
            </div>

            <p className="text-xs sm:text-sm leading-relaxed font-sans pl-6">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 mr-2">
                Why:
              </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {item.why}
              </span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StepWalkthrough;

