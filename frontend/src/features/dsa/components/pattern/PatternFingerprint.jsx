import React from 'react';

/**
 * SECTION 04 — PATTERN RECOGNITION & PATTERN FINGERPRINT
 * Reveals the structural pattern name and renders a visual fingerprint diagram.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternFingerprint({ pattern, fingerprint, sectionNo = '04' }) {
  if (!pattern || !fingerprint) return null;

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-fingerprint-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-purple-600 dark:text-purple-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>PATTERN RECOGNITION & FINGERPRINT</span>
      </div>

      <h2 id="pattern-fingerprint-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Structural Pattern Identified
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        The shape and fingerprint flow of this problem type.
      </p>

      {/* Main Pattern Name Open Reveal Header */}
      <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-1 space-y-1">
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 text-blue-600 dark:text-blue-300 text-[10px] font-mono font-semibold tracking-wider">
          Recognized Pattern
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {pattern.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {pattern.description}
        </p>
      </div>

      {/* Visual Fingerprint Timeline Surface */}
      <div className="space-y-4 py-2">
        <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500 tracking-wider block uppercase">
          {fingerprint.title || 'Pattern Fingerprint'}
        </span>

        {/* Step Flow Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {fingerprint.steps.map((step, idx) => (
            <div
              key={idx}
              className="space-y-1.5 relative border-l-2 sm:border-l-0 sm:border-t-2 border-blue-500/40 dark:border-blue-400/40 pl-3 sm:pl-0 sm:pt-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {step.stage}
                </span>
                <span className="text-[10px] font-mono font-extrabold text-slate-400 dark:text-slate-500">
                  0{idx + 1}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">
                {step.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PatternFingerprint;
