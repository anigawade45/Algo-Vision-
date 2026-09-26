import React from 'react';
import { CheckCircle2 } from 'lucide-react';

/**
 * CURRENT & FINAL RESULT
 * Displays intermediate result produced so far, or highlights FINAL RESULT upon completion.
 */
export function CurrentResult({ currentResult, isComplete, expectedOutput, sectionNo = '07' }) {
  return (
    <section aria-labelledby="current-result-heading" className="space-y-2.5 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-cyan-600 dark:text-cyan-400 uppercase">
        <div className="flex items-center gap-2">
          <span>{sectionNo}</span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <h2 id="current-result-heading" className="font-bold text-cyan-600 dark:text-cyan-400">
            {isComplete ? 'FINAL RESULT PRODUCED' : 'INTERMEDIATE RESULT'}
          </h2>
        </div>

        {isComplete && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" aria-hidden="true" /> Execution Complete
          </span>
        )}
      </div>

      {/* Result Card */}
      <div className={`p-4 rounded-xl border flex items-center justify-between font-mono ${
        isComplete
          ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
          : 'bg-[#070A13] border-slate-800'
      }`}>
        <span className="text-xs text-slate-400 font-semibold">
          {isComplete ? 'Final Result:' : 'Current Result:'}
        </span>
        <span className={`text-sm sm:text-base font-extrabold tracking-wider ${
          isComplete ? 'text-emerald-400' : 'text-blue-400'
        }`}>
          {currentResult || '[ ]'}
        </span>
      </div>

      {isComplete && expectedOutput && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-0.5 px-1">
          <span>Expected Target:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{expectedOutput}</span>
        </div>
      )}
    </section>
  );
}

export default CurrentResult;
