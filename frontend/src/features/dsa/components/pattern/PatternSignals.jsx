import React from 'react';

/**
 * SECTION 02 — WHAT STANDS OUT?
 * Observation experience revealing key structural signals.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternSignals({ signals, sectionNo = '02' }) {
  if (!signals || !signals.observations) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-signals-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>WHAT STANDS OUT? (STRUCTURAL SIGNALS)</span>
      </div>

      <h2 id="pattern-signals-heading" className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
        {signals.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {signals.subtitle}
      </p>

      {/* Signal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {signals.observations.map((obs) => {
          return (
            <div
              key={obs.id}
              className="w-full text-left p-4 rounded-xl border bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/80 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  {obs.title}
                </span>
                <span className="text-xl leading-none" aria-hidden="true">
                  💡
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                "{obs.label}"
              </h3>

            </div>
          );
        })}
      </div>
    </section>
  );
}

export default PatternSignals;
