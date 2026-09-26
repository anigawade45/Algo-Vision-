import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  RotateCcw,
  HelpCircle,
  Clock,
} from 'lucide-react';

/**
 * PRACTICE REVIEW & MISTAKE DIAGNOSIS & HINTS
 * Displays structured evaluation breakdown across 3 capability states (correct, incorrect, not_attempted),
 * mistake taxonomy, progressive hint ladder, and conceptual reflection / retry feedback.
 */
export function PracticeReview({
  evaluationResults,
  mistakes,
  hints,
  onRetry,
  sectionNo = '07',
}) {
  const [revealedHintCount, setRevealedHintCount] = useState(0);
  const [showWhyExplanation, setShowWhyExplanation] = useState(false);

  const handleRevealNextHint = () => {
    if (hints && revealedHintCount < hints.length) {
      setRevealedHintCount((prev) => prev + 1);
    }
  };

  const hasMistakes = mistakes && mistakes.length > 0;
  const isAllCorrect =
    evaluationResults &&
    Object.values(evaluationResults).every((e) => e.status === 'correct');

  return (
    <section aria-labelledby="practice-review-heading" className="space-y-6 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-rose-600 dark:text-rose-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="practice-review-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          REVIEW, MISTAKE DIAGNOSIS & HINTS
        </h2>
      </div>

      {/* 1. Capability Evaluation Card (3-State Granular Evaluation) */}
      {evaluationResults && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-sans font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              PRACTICE CAPABILITY REVIEW
            </h3>
            <span className="text-xs font-mono text-slate-400">Diagnostic Summary</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {Object.entries(evaluationResults).map(([key, item]) => {
              const status = item.status; // 'correct' | 'incorrect' | 'not_attempted'

              let cardStyle =
                'bg-slate-50 dark:bg-[#070A13] border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400';
              let statusLabel = 'Not Attempted';
              let StatusIcon = Clock;
              let iconColor = 'text-slate-400';

              if (status === 'correct') {
                cardStyle =
                  'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300';
                statusLabel = 'Passed';
                StatusIcon = CheckCircle2;
                iconColor = 'text-emerald-500';
              } else if (status === 'incorrect') {
                cardStyle =
                  'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-300';
                statusLabel = 'Needs Retry';
                StatusIcon = XCircle;
                iconColor = 'text-rose-500';
              }

              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-2 font-sans ${cardStyle}`}
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      {item.label}
                    </span>
                    {item.source && (
                      <span className="text-[9px] font-mono text-slate-400 block truncate mt-0.5">
                        {item.source}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs font-bold pt-1">
                    <span>{statusLabel}</span>
                    <StatusIcon className={`w-4 h-4 shrink-0 ${iconColor}`} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Retry & Reflection Action Banner */}
          {!isAllCorrect && (
            <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold">
                <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                <span>Practice activities require completed or correct attempts.</span>
              </div>

              <div className="flex items-center gap-2">
                {hasMistakes && (
                  <button
                    type="button"
                    aria-expanded={showWhyExplanation}
                    onClick={() => setShowWhyExplanation((prev) => !prev)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-mono font-bold cursor-pointer transition-all duration-150 motion-reduce:transition-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[38px]"
                  >
                    <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Why?</span>
                  </button>
                )}

                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold cursor-pointer transition-all duration-150 motion-reduce:transition-none flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[38px]"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Reset Attempts</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Conceptual "Why?" Explanation */}
          {showWhyExplanation && hasMistakes && (
            <div
              aria-live="polite"
              className="mt-3 p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-300 leading-relaxed font-sans space-y-2"
            >
              <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-amber-600 dark:text-amber-400 block">
                CONCEPTUAL REFLECTION
              </span>
              <ul className="list-disc pl-4 space-y-1">
                {mistakes.map((m, idx) => (
                  <li key={idx}>
                    <strong className="font-mono text-[11px]">{m.type}:</strong> {m.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. Structured Mistake Taxonomy Diagnosis */}
      {hasMistakes && (
        <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              MISTAKE TAXONOMY DIAGNOSIS
            </span>
          </div>
          <div className="space-y-2">
            {mistakes.map((m, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white dark:bg-[#0B101D] border border-rose-200 dark:border-rose-900/40 space-y-1"
              >
                <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold">
                  {m.type}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 pt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Progressive Hint Ladder */}
      {hints && hints.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-4 h-4" aria-hidden="true" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                PROGRESSIVE HINT LADDER ({revealedHintCount}/{hints.length})
              </span>
            </div>

            {revealedHintCount < hints.length && (
              <button
                type="button"
                onClick={handleRevealNextHint}
                className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-mono font-bold hover:bg-amber-100 transition-all duration-150 motion-reduce:transition-none cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 min-h-[38px]"
              >
                <span>Reveal Hint {revealedHintCount + 1}</span>
                <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Render Revealed Hints */}
          {revealedHintCount > 0 ? (
            <div className="space-y-2.5" aria-live="polite">
              {hints.slice(0, revealedHintCount).map((hintText, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-sans"
                >
                  <span className="font-mono font-bold text-[10px] text-amber-600 dark:text-amber-400 uppercase block mb-1">
                    HINT {idx + 1}
                  </span>
                  {hintText}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Need a nudge? Click "Reveal Hint" to get progressive guidance without giving away the solution.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

export default PracticeReview;
