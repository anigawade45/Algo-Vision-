import React from 'react';

export function DryRunCheckpoint({ understood, onCheckpoint, onNextStage }) {
  return (
    <section className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          aria-pressed={understood}
          onClick={onCheckpoint}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold shadow-xs transition-all duration-150 motion-reduce:transition-none cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${understood
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
