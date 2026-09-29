import React from 'react';

/**
 * SECTION 03 — ABSTRACT THE PROBLEM
 * Moves the learner's thinking from concrete numbers to variable relationships.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternAbstraction({ abstraction, sectionNo = '03' }) {
  if (!abstraction) return null;

  const { concrete, abstractFormula, statement } = abstraction;

  return (
    <section className="space-y-4 font-sans" aria-labelledby="pattern-abstraction-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>ABSTRACT THE PROBLEM</span>
      </div>

      <h2 id="pattern-abstraction-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        {abstraction.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {abstraction.subtitle}
      </p>

      {/* Concrete to Abstract Transition */}
      <div className="space-y-6 pt-2 pb-1">
        {/* Step 1: Specific Instance */}
        {concrete && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-[13px] font-mono font-extrabold tracking-wider uppercase text-slate-800 dark:text-slate-200">
                SPECIFIC NUMBERS <span className="text-slate-500 dark:text-slate-400 font-bold">(CONCRETE INSTANCE)</span>
              </span>
            </div>
            <div className="font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold py-1 pl-4">
              <span>Array: [{Array.isArray(concrete.items) ? concrete.items.join(', ') : concrete.items}]</span>
              <span className="mx-2.5 text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
              <span>Target: {concrete.target}</span>
            </div>
          </div>
        )}

        {/* Step 2: Abstract Structural Formula */}
        {abstractFormula && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" aria-hidden="true" />
              <span className="text-xs sm:text-[13px] font-mono font-extrabold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                GENERAL RELATIONSHIP <span className="text-blue-500/80 dark:text-blue-400/80 font-bold">(STRUCTURAL PATTERN)</span>
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5 font-mono font-extrabold text-xs sm:text-sm py-1.5 pl-4">
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 shadow-xs">
                {abstractFormula.varA}
              </span>
              <span className="text-blue-500 font-bold">{abstractFormula.operator}</span>
              <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 shadow-xs">
                {abstractFormula.varB}
              </span>
              <span className="text-blue-500 font-bold">{abstractFormula.equals}</span>
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 shadow-xs">
                {abstractFormula.result}
              </span>
            </div>
          </div>
        )}

        {/* Abstraction Insight Statement */}
        {statement && (
          <div className="pl-3.5 border-l-2 border-amber-500 py-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans mt-2">
            <span className="font-bold text-amber-600 dark:text-amber-400 mr-1.5">💡 Insight:</span>
            <span>{statement}</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default PatternAbstraction;
