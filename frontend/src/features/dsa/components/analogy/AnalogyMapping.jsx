import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';

/**
 * Section 06 & 08 — DSA CONNECTION & FINAL TAKEAWAY
 * Bridges the real-world shopping analogy directly into the formal DSA structure.
 */
export function AnalogyMapping({ dsaConnection, takeaway }) {
  if (!dsaConnection && !takeaway) return null;

  const {
    arrayLabel = 'ARRAY',
    arrayValues = [2, 7, 11, 15],
    targetLabel = 'TARGET',
    targetValue = 9,
    question = 'Find two values whose sum is 9.',
    formulaRealWorld = '₹2 + ₹7 = ₹9',
    formulaDSA = '2 + 7 = 9',
    matchingIndices = [0, 1],
  } = dsaConnection || {};

  return (
    <div className="space-y-7 font-sans w-full">

      {/* SECTION 06 — DSA CONNECTION */}
      <section className="space-y-4" aria-labelledby="dsa-connection-heading">
        <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
          <span>03</span>
          <span aria-hidden="true">•</span>
          <span id="dsa-connection-heading">DSA CONNECTION</span>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-5">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {dsaConnection?.title || 'Connecting Real World to DSA'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Notice how the exact same structural requirement applies to the array data.
            </p>
          </div>

          {/* Dual Visual Card: Array & Target */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* Array Box */}
            <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/60 dark:border-[#162032] space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                {arrayLabel}
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {arrayValues.map((val, idx) => {
                  const isMatched = matchingIndices.includes(idx);
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center justify-center min-w-[48px] h-12 rounded-lg border font-mono font-bold text-sm transition-colors ${
                        isMatched
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white dark:bg-[#0B101D] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>{val}</span>
                      <span className={`text-[9px] font-normal leading-none pb-0.5 ${isMatched ? 'text-white/80' : 'text-slate-400'}`}>
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Box */}
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-1 flex flex-col justify-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600/80 dark:text-blue-400/80">
                {targetLabel}
              </span>
              <span className="text-2xl font-extrabold font-mono text-blue-700 dark:text-blue-300">
                {targetValue}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-sans">
                {question}
              </span>
            </div>
          </div>

          {/* Formula Comparison Strip */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/60 dark:border-[#162032] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-400 uppercase text-[10px]">REAL WORLD:</span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 font-bold">
                {formulaRealWorld}
              </span>
            </div>

            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0 hidden sm:block" aria-hidden="true" />

            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="font-bold text-blue-500 uppercase text-[10px]">DSA EQUIVALENT:</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-900 font-bold">
                {formulaDSA}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 08 — FINAL CONNECTION / TAKEAWAY */}
      <section className="space-y-4" aria-labelledby="final-takeaway-heading">
        <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
          <span>04</span>
          <span aria-hidden="true">•</span>
          <span id="final-takeaway-heading">THE TAKEAWAY</span>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 shadow-xs space-y-4 text-slate-900 dark:text-white">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base sm:text-lg font-bold leading-snug">
                {takeaway?.headline || 'The story changed, but the relationship stayed the same.'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {takeaway?.finalNote || 'Analogy connects an abstract numerical condition to a familiar real-world decision.'}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0B101D]/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">REAL WORLD SUMMARY</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {takeaway?.realWorldSummary || 'Two item prices + Target = Required total'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0B101D]/80 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">DSA SUMMARY</span>
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">
                {takeaway?.dsaSummary || 'Two array values + Target = Required sum'}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AnalogyMapping;
