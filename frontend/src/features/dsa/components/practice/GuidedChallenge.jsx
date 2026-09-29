import React from 'react';
import { Compass, CheckCircle2, XCircle } from 'lucide-react';

/**
 * GUIDED CHALLENGE
 * Provides progressive conceptual prompts for a related problem variation with guided assistance.
 */
export function GuidedChallenge({ guidedChallenge, userAnswers, onSelectPromptAnswer, sectionNo = '04' }) {
  if (!guidedChallenge) return null;
  const { title, description, inputVisual, expectedOutput, prompts } = guidedChallenge;

  return (
    <section aria-labelledby="guided-challenge-heading" className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-purple-600 dark:text-purple-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="guided-challenge-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          GUIDED CHALLENGE
        </h2>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-5">
        {/* Challenge Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              GUIDED CONCEPTUAL APPLICATION
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>

          {/* Visual Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {inputVisual && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Input Spec</span>
                <span className="text-slate-900 dark:text-white font-bold">{inputVisual}</span>
              </div>
            )}
            {expectedOutput && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 text-xs font-mono">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Expected Output</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{expectedOutput}</span>
              </div>
            )}
          </div>
        </div>

        {/* Guided Prompts */}
        <div className="space-y-4 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
          {prompts.map((p, pIdx) => {
            const selectedIdx = userAnswers[pIdx];
            const isAnswered = selectedIdx !== undefined;
            const isCorrect = selectedIdx === p.correctAnswer;

            return (
              <div key={pIdx} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 font-mono text-[11px] font-bold">
                    Prompt {p.stepNo || `0${pIdx + 1}`}
                  </span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {p.question}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2 pl-2 sm:pl-4">
                  {p.options.map((opt, optIdx) => {
                    const isSelected = selectedIdx === optIdx;
                    let style = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800';

                    if (isAnswered) {
                      if (optIdx === p.correctAnswer) {
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
                        key={optIdx}
                        aria-pressed={isSelected}
                        onClick={() => onSelectPromptAnswer(pIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border transition-all duration-150 motion-reduce:transition-none text-xs font-sans flex items-center justify-between gap-3 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${style}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && optIdx === p.correctAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                        )}
                        {isAnswered && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    aria-live="polite"
                    className={`p-3 rounded-xl border text-xs font-sans ${
                      isCorrect
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                        : 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300'
                    }`}
                  >
                    <p className="leading-relaxed">{p.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default GuidedChallenge;
