import React from 'react';
import { Sliders, CheckCircle2, XCircle } from 'lucide-react';

/**
 * CONSTRAINT VARIATION CHALLENGE
 * Tests adaptation when a constraint changes (e.g. subsegment bounds, diagonal connections, sorting requirements).
 */
export function VariationChallenge({ variationChallenge, selectedOption, onSelectOption, sectionNo = '06' }) {
  if (!variationChallenge) return null;
  const { changedConstraint, question, options, explanation } = variationChallenge;

  const isAnswered = selectedOption !== undefined && selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === variationChallenge.correctAnswer;

  return (
    <section aria-labelledby="variation-challenge-heading" className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-600 dark:text-amber-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="variation-challenge-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          CONSTRAINT VARIATION CHALLENGE
        </h2>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4">
        {/* Constraint Banner */}
        <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <Sliders className="w-4 h-4" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              CHANGED CONSTRAINT
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-amber-950 dark:text-amber-200 leading-relaxed font-sans">
            {changedConstraint}
          </p>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
          {question}
        </h3>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2.5">
          {options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let style = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800';

            if (isAnswered) {
              if (idx === variationChallenge.correctAnswer) {
                style = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
              } else if (isSelected && !isCorrect) {
                style = 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
              }
            } else if (isSelected) {
              style = 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-semibold';
            }

            return (
              <button
                type="button"
                key={idx}
                aria-pressed={isSelected}
                onClick={() => onSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 motion-reduce:transition-none text-xs sm:text-sm font-sans flex items-center justify-between gap-3 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${style}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === variationChallenge.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div
            aria-live="polite"
            className={`p-3.5 rounded-xl border text-xs font-sans space-y-1 ${
              isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'
            }`}
          >
            <div className="font-mono font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>ADAPTATION SUCCESS</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" aria-hidden="true" />
                  <span>ADAPTATION MISMATCH</span>
                </>
              )}
            </div>
            <p className="leading-relaxed">{explanation}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VariationChallenge;
