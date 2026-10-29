import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export function DryRunCheckpoint({ understood, onCheckpoint, onNextStage }) {
  const isCompleted = understood;
  
  return (
    <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        aria-pressed={isCompleted}
        onClick={onCheckpoint}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
          isCompleted
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            : 'bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {isCompleted ? (
          <>
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Dry Run Mastered ✓</span>
          </>
        ) : (
          <span>I Understand This Dry Run</span>
        )}
      </button>

      {onNextStage && (
        <button
          type="button"
          disabled={!isCompleted}
          title={!isCompleted ? "Click 'I Understand This Dry Run' above to unlock Stage 09: Visualize" : "Proceed to Stage 09: Visualize"}
          onClick={onNextStage}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            isCompleted
              ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Next: Stage 09 Visualize →</span>
          <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export default DryRunCheckpoint;
