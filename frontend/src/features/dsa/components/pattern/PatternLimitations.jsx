import React from 'react';

/**
 * SECTION 06 — WHAT THE PATTERN DOES NOT TELL US
 * Prevents Pattern stage from leaking into Algorithm stage by establishing clean boundaries.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternLimitations({ limitations, sectionNo = '06' }) {
  if (!limitations) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-limitations-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-600 dark:text-amber-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>SCOPE BOUNDARY (PATTERN VS ALGORITHM)</span>
      </div>

      <h2 id="pattern-limitations-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        {limitations.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {limitations.subtitle}
      </p>

      {/* Comparison Grid: What Pattern Tells Us vs Does NOT Tell Us */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* What Pattern Tells Us */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3 shadow-xs transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              ✓
            </span>
            <h3 className="text-xs font-extrabold text-emerald-950 dark:text-emerald-300 uppercase tracking-wider font-mono">
              PATTERN TELLS US
            </h3>
          </div>
          <ul className="space-y-2">
            {limitations.tellsUs.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed"
              >
                <span className="text-emerald-500 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What Pattern Does NOT Tell Us */}
        <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/50 space-y-3 shadow-xs transition-colors">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
              ✕
            </span>
            <h3 className="text-xs font-extrabold text-rose-950 dark:text-rose-300 uppercase tracking-wider font-mono">
              PATTERN DOES NOT TELL US (YET)
            </h3>
          </div>
          <ul className="space-y-2">
            {limitations.doesNotTellUs.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-200 leading-relaxed"
              >
                <span className="text-rose-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default PatternLimitations;
