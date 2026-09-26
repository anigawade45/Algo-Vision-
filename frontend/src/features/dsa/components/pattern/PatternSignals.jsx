import React, { useState } from 'react';

/**
 * SECTION 02 — WHAT STANDS OUT?
 * Interactive observation experience revealing key structural signals.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternSignals({ signals, sectionNo = '02' }) {
  if (!signals || !signals.observations) return null;

  const [selectedSignals, setSelectedSignals] = useState(
    new Set(signals.observations.map((s) => s.id))
  );

  const toggleSignal = (id) => {
    const next = new Set(selectedSignals);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedSignals(next);
  };

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-signals-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>WHAT STANDS OUT? (STRUCTURAL SIGNALS)</span>
      </div>

      <h2 id="pattern-signals-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        {signals.title}
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {signals.subtitle}
      </p>

      {/* Interactive Signal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {signals.observations.map((obs) => {
          const isSelected = selectedSignals.has(obs.id);
          return (
            <button
              key={obs.id}
              type="button"
              onClick={() => toggleSignal(obs.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-150 motion-reduce:transition-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${
                isSelected
                  ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800/80 shadow-xs'
                  : 'bg-white dark:bg-[#0B101D] border-slate-200/80 dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              aria-pressed={isSelected}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  {obs.title}
                </span>
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  ✓
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                "{obs.label}"
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                {obs.detail}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default PatternSignals;
