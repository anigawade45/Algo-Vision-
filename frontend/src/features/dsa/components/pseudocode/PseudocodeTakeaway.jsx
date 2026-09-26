import React from 'react';
import { ArrowRight, Code2 } from 'lucide-react';

/**
 * SECTION 07 — FINAL CONNECTION TO CODE & TAKEAWAY
 * Concludes Stage 06 by connecting language-independent logic to Stage 07 (Code).
 */
export function PseudocodeTakeaway({ takeaway, sectionNo = '07' }) {
  if (!takeaway) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pseudocode-takeaway-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-rose-600 dark:text-rose-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>FINAL CONNECTION TO CODE</span>
      </div>

      <h2 id="pseudocode-takeaway-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Ready for Implementation
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {takeaway.statement || 'Your algorithm is now expressed as language-independent steps.'}
      </p>

      {/* Progression Flow & Open Takeaway */}
      <div className="space-y-6 pt-2">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 font-mono text-xs sm:text-sm font-extrabold text-center">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            05 ALGORITHM
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300">
            06 PSEUDOCODE
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
          <span className="px-3.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>07 CODE</span>
          </span>
        </div>

        <div className="border-l-2 border-amber-500 dark:border-amber-400 pl-4 py-1 space-y-1">
          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
            CORE TAKEAWAY
          </span>
          <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-200 italic max-w-3xl">
            "{takeaway.subtitle || 'The algorithm defines the approach. Pseudocode turns that approach into precise, language-independent steps. The next stage translates those steps into code.'}"
          </p>
        </div>
      </div>
    </section>
  );
}

export default PseudocodeTakeaway;
