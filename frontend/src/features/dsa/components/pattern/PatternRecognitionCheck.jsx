import React, { useState } from 'react';

/**
 * SECTION 07 — RECOGNITION CHECK
 * Lightweight learning checkpoint testing structural pattern recognition.
 * Aligned with Stage 01 & Stage 02 UI standards.
 */
export function PatternRecognitionCheck({ recognitionCheck, sectionNo = '07' }) {
  if (!recognitionCheck) return null;

  const [selectedOptionId, setSelectedOptionId] = useState(null);

  const selectedOption = recognitionCheck.options.find(
    (opt) => opt.id === selectedOptionId
  );

  return (
    <section className="space-y-3.5 font-sans" aria-labelledby="pattern-recognition-check-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>RECOGNITION CHECKPOINT</span>
      </div>

      <h2 id="pattern-recognition-check-heading" className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white leading-snug">
        Test Your Pattern Recognition
      </h2>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        {recognitionCheck.question}
      </p>

      {/* Checkpoint Container */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-4 shadow-xs transition-colors">
        {/* Options List */}
        <div className="space-y-2.5">
          {recognitionCheck.options.map((opt, idx) => {
            const isSelected = selectedOptionId === opt.id;
            const letter = String.fromCharCode(65 + idx); // A, B, C...

            let styleClasses =
              'border-slate-200/80 dark:border-[#1C2638] bg-slate-50 dark:bg-[#05070E] hover:bg-slate-100 dark:hover:bg-[#121929] text-slate-900 dark:text-white';

            if (isSelected) {
              if (opt.isCorrect) {
                styleClasses =
                  'border-emerald-500 dark:border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 shadow-xs';
              } else {
                styleClasses =
                  'border-amber-500 dark:border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 shadow-xs';
              }
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 motion-reduce:transition-none flex items-start gap-3.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${styleClasses}`}
                aria-pressed={isSelected}
              >
                <span
                  className={`w-6 h-6 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? opt.isCorrect
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {letter}
                </span>
                <span className="text-xs sm:text-sm font-semibold leading-relaxed flex-1">
                  {opt.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback Display */}
        {selectedOption && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-sans transition-all motion-reduce:transition-none ${
              selectedOption.isCorrect
                ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50/80 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-2.5">
              <span className="text-base shrink-0" aria-hidden="true">
                {selectedOption.isCorrect ? '✅' : '💡'}
              </span>
              <div>
                <span className="font-extrabold block mb-0.5">
                  {selectedOption.isCorrect ? 'Correct!' : 'Keep Thinking'}
                </span>
                <span>{selectedOption.feedback}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default PatternRecognitionCheck;
