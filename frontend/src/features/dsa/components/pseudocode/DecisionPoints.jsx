import React from 'react';
import { GitBranch } from 'lucide-react';

/**
 * SECTION 06 — IMPORTANT DECISION POINTS
 * Teaches control-flow branching decisions in the algorithm.
 */
export function DecisionPoints({ decisions, sectionNo = '06' }) {
  if (!decisions || !decisions.length) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="decision-points-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-600 dark:text-amber-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>IMPORTANT DECISION POINTS</span>
      </div>

      <h2 id="decision-points-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Control Flow & Conditional Branches
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        Understand how conditional checks steer execution pathways.
      </p>

      {/* Streamlined Decision List */}
      <div className="space-y-3.5 pt-1">
        {decisions.map((dec, idx) => (
          <div
            key={idx}
            className="pl-3.5 border-l-2 border-amber-400 dark:border-amber-500/80 space-y-1.5"
          >
            <div className="flex items-center gap-2 font-mono">
              <GitBranch className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                CHECK #{idx + 1}:
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                "{dec.condition}"
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono text-xs pl-5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase text-[10px]">
                  YES ➔
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  {dec.yes}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 font-extrabold uppercase text-[10px]">
                  NO ➔
                </span>
                <span className="text-slate-600 dark:text-slate-400 font-semibold">
                  {dec.no}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DecisionPoints;
