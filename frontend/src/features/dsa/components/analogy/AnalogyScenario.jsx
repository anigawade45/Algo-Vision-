import React from 'react';
import { ShoppingBag, Target, HelpCircle } from 'lucide-react';

/**
 * Section 02 — REAL-WORLD SCENARIO
 * Presents the familiar real-world context without algorithmic noise.
 */
export function AnalogyScenario({ scenario }) {
  if (!scenario) return null;

  const { title, context, question, target } = scenario;

  return (
    <section className="space-y-4" aria-labelledby="analogy-scenario-heading">
      {/* Section Sub-header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>01</span>
        <span aria-hidden="true">•</span>
        <span>REAL-WORLD SCENARIO</span>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4">
        {/* Title & Context */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-[#162032] pb-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <h2 id="analogy-scenario-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {title || 'Imagine you are shopping.'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {context}
            </p>
          </div>

          {/* Prominent Target Budget Badge */}
          {target && (
            <div className="shrink-0 flex items-center gap-3 p-3 sm:px-4 sm:py-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-700 dark:text-blue-300">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80 leading-none">
                  {target.label || 'TARGET'}
                </span>
                <span className="text-lg sm:text-xl font-extrabold font-mono text-blue-700 dark:text-blue-300 leading-tight">
                  {target.display || target.value}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Central Question */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/60 dark:border-[#162032] text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
          <HelpCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{question || 'Can you find two items that add up to the required target?'}</span>
        </div>
      </div>
    </section>
  );
}

export default AnalogyScenario;
