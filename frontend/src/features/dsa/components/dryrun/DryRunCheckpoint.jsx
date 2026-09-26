import React from 'react';

/**
 * STAGE CHECKPOINT
 * Handoff checkpoint to confirm understanding of step execution before moving to the next stage.
 */
export function DryRunCheckpoint({ understood, onCheckpoint, onNextStage, sectionNo = '09', stageNo = '08' }) {
  return (
    <section aria-labelledby="dry-run-checkpoint-heading" className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-5 font-sans">
      <div className="space-y-1">
        <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
          {sectionNo} • STAGE CHECKPOINT
        </span>
        <h2 id="dry-run-checkpoint-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          {understood ? `${stageNo} · DRY RUN UNDERSTOOD ✓` : 'CHECK YOUR EXECUTION UNDERSTANDING'}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {understood
            ? 'You have followed the algorithm on actual data step by step and observed all state mutations.'
            : 'Before moving to Visualization, make sure you can explain:'}
        </p>
      </div>

      {!understood && (
        <div className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Initial memory state before step 1</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>What changed at each execution step</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Which conditions triggered operations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Which data structures mutated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>How intermediate results emerged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Where final output came from</span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={understood}
          onClick={onCheckpoint}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold shadow-xs transition-all duration-150 motion-reduce:transition-none cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
            understood
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <span>{understood ? 'Dry Run Understood ✓' : 'I Understand the Dry Run'}</span>
        </button>

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all duration-150 motion-reduce:transition-none cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Continue to Visualization ➔</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default DryRunCheckpoint;
