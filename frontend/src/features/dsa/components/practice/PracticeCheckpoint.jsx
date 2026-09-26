import React from 'react';
import { CheckCircle2, Check, AlertTriangle, Clock, XCircle } from 'lucide-react';

/**
 * PRACTICE CHECKPOINT
 * Final Stage Checkpoint card layout & verification styling.
 * Requires all key practice activities to be attempted before verifying completion.
 */
export function PracticeCheckpoint({
  completed,
  onCheckpoint,
  takeaway,
  canVerify = true,
  completedCount = 0,
  totalCount = 5,
  showIncompleteWarning = false,
  evaluationResults,
  sectionNo = '09',
  stageNo = '11',
}) {
  return (
    <section aria-labelledby="practice-checkpoint-heading" className="space-y-4 font-sans pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>STAGE CHECKPOINT</span>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
              {stageNo} · PRACTICE COMPLETE
            </span>
            <h2 id="practice-checkpoint-heading" className="text-xl font-bold text-slate-900 dark:text-white">
              {completed ? '✓ PRACTICE VERIFIED' : 'CHECK YOUR PRACTICE APPLICATION'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
              {takeaway || 'You moved from guided understanding to independent application.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-pressed={completed}
              onClick={onCheckpoint}
              className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold shadow-xs transition-all duration-150 motion-reduce:transition-none cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                completed
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : canVerify
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {completed ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Practice Verified ✓</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {canVerify ? 'Complete Practice Stage' : `Attempt Remaining (${completedCount}/${totalCount})`}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warning Banner when Learner tries to verify without completing activities */}
        {showIncompleteWarning && !completed && (
          <div
            aria-live="polite"
            className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-xs font-sans space-y-1.5"
          >
            <div className="flex items-center gap-2 font-mono font-bold text-amber-700 dark:text-amber-400 uppercase text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" aria-hidden="true" />
              <span>UNATTEMPTED PRACTICE ACTIVITIES REMAIN</span>
            </div>
            <p className="leading-relaxed">
              Stage {stageNo} measures transfer of learning. Please attempt all practice challenges above (Recall, Pattern Check, Guided Prompts, Independent Decisions, and Constraint Variation) before marking the stage complete. Currently attempted: <strong>{completedCount} of {totalCount}</strong>.
            </p>
          </div>
        )}

        {/* Dynamic Capability Checklist Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs font-mono">
          {evaluationResults ? (
            Object.entries(evaluationResults).map(([key, item]) => {
              const status = item.status;
              let IconComponent = Clock;
              let iconColor = 'text-slate-400';
              let badgeText = item.label;

              if (status === 'correct') {
                IconComponent = CheckCircle2;
                iconColor = 'text-emerald-500';
              } else if (status === 'incorrect') {
                IconComponent = XCircle;
                iconColor = 'text-rose-500';
              }

              return (
                <div
                  key={key}
                  className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-1.5 text-slate-700 dark:text-slate-300"
                >
                  <span className="truncate text-[11px]">{badgeText}</span>
                  <IconComponent className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} aria-hidden="true" />
                </div>
              );
            })
          ) : (
            <>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Pattern Recognized</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Approach Selected</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Reasoning Explained</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Solve Attempted</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Variation Tested</span>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default PracticeCheckpoint;
