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

      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-6">
        {/* Real-World Analogy Title */}
        <div>
          <h3 className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-3">
            Real-World Analogy
          </h3>
          <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
            <h2 id="analogy-scenario-heading" className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug tracking-tight">
              {title || 'The Algorithmic Journey'}
            </h2>
          </div>
        </div>
        
        {/* Simple Storytelling Text */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#162032]">
          <h3 className="text-[11px] font-mono font-bold tracking-wider text-slate-400 uppercase mb-4 mt-4">
            Simple Storytelling
          </h3>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
            {scenario.story?.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalogyScenario;
