import React from 'react';
import { HelpCircle, CheckCircle2, XCircle } from 'lucide-react';

/**
 * RECALL MENTAL MODEL
 * Checks whether the learner retained the core mental model (2-3 questions max).
 */
export function RecallSection({ questions, userAnswers, onSelectAnswer, sectionNo = '02' }) {
  if (!questions || !questions.length) return null;

  return (
    <section aria-labelledby="recall-section-heading" className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="recall-section-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          RECALL MENTAL MODEL
        </h2>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => {
          const selectedIdx = userAnswers[q.id];
          const isAnswered = selectedIdx !== undefined;
          const isCorrect = selectedIdx === q.correctAnswer;

          return (
            <div
              key={q.id || idx}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                  Q{idx + 1}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {q.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pl-0 sm:pl-9">
                {q.options.map((option, optIdx) => {
                  const isSelected = selectedIdx === optIdx;
                  let optionStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070A13] text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800';

                  if (isAnswered) {
                    if (optIdx === q.correctAnswer) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-rose-400 bg-rose-50/60 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-semibold';
                  }

                  return (
                    <button
                      type="button"
                      key={optIdx}
                      aria-pressed={isSelected}
                      onClick={() => onSelectAnswer(q.id, optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 motion-reduce:transition-none text-xs sm:text-sm font-sans flex items-center justify-between gap-3 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswered && optIdx === q.correctAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Educational Feedback */}
              {isAnswered && (
                <div
                  aria-live="polite"
                  className={`mt-3 p-3.5 rounded-xl border text-xs font-sans space-y-1 ${
                    isCorrect
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                      : 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300'
                  }`}
                >
                  <div className="font-mono font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>CORRECT RECALL</span>
                      </>
                    ) : (
                      <>
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        <span>RECALL TIP</span>
                      </>
                    )}
                  </div>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecallSection;
