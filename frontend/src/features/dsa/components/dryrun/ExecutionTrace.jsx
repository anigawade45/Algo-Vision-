import React from 'react';

/**
 * EXECUTION TRACE & CURRENT STEP
 * Renders the core step execution card:
 * Pseudocode reference -> 1. STATE BEFORE -> 2. CONDITION CHECK -> 3. ACTION TAKEN -> 4. STATE AFTER.
 */
export function ExecutionTrace({ step, totalSteps, sectionNo = '04' }) {
  if (!step) return null;

  const {
    stepNo,
    pseudocodeLine,
    pseudocodeText,
    operation,
    title,
    before,
    condition,
    action,
    after,
  } = step;

  const passes = condition?.passes ?? true;

  return (
    <section aria-labelledby="execution-trace-heading" className="space-y-2.5 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 font-mono text-[11px] sm:text-xs font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase">
        <span>{sectionNo}</span>
        <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
        <h2 id="execution-trace-heading" className="font-bold text-emerald-600 dark:text-emerald-400">
          STEP EXECUTION TRACE
        </h2>
      </div>

      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3.5 shadow-xs">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-extrabold">
              Step {stepNo < 10 ? `0${stepNo}` : stepNo}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {title || 'Execute Step'}
            </h3>
          </div>

          {operation && (
            <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              OP: {operation}
            </span>
          )}
        </div>

        {/* Pseudocode Line Mapping Banner */}
        {pseudocodeText && (
          <div className="p-3 rounded-xl bg-[#070A13] border border-slate-800 space-y-1 font-mono text-xs">
            <div className="text-blue-400 font-bold uppercase text-[10px] tracking-wider">
              <span>PSEUDOCODE LINE {pseudocodeLine < 10 ? `0${pseudocodeLine}` : pseudocodeLine}</span>
            </div>
            <p className="text-slate-200 font-medium pl-1">
              {pseudocodeText}
            </p>
          </div>
        )}

        {/* Execution Lifecycle Flow: 1. STATE BEFORE -> 2. CONDITION CHECK -> 3. ACTION TAKEN -> 4. STATE AFTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* 1. STATE BEFORE */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200 dark:border-slate-800/80 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              1. STATE BEFORE
            </span>
            <div className="space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
              {before && Object.keys(before).length > 0 ? (
                Object.entries(before).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center gap-1">
                    <span className="text-slate-400">{k}:</span>
                    <span className="font-extrabold text-slate-900 dark:text-white truncate">{v}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">Initial state</span>
              )}
            </div>
          </div>

          {/* 2. CONDITION CHECK */}
          <div className={`p-3.5 rounded-xl border space-y-2 ${
            passes
              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/40'
              : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                passes ? 'text-blue-600 dark:text-blue-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                2. CONDITION CHECK
              </span>
            </div>
            <div className="font-mono text-xs space-y-1.5">
              <p className="text-slate-900 dark:text-white font-bold">
                {condition?.text || 'Evaluation check'}
              </p>
              {condition?.evaluation && (
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-extrabold text-white ${
                    passes ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}>
                    {passes ? 'YES' : 'NO'}
                  </span>
                  <span className="text-slate-400 font-bold">➔</span>
                  <span className="font-mono font-extrabold text-slate-800 dark:text-slate-200 text-xs">
                    {condition.evaluation}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 3. ACTION TAKEN */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
              3. ACTION TAKEN
            </span>
            <p className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
              {action?.description || 'Execute operation step'}
            </p>
          </div>

          {/* 4. STATE AFTER */}
          <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              4. STATE AFTER
            </span>
            <div className="space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
              {after && Object.keys(after).length > 0 ? (
                Object.entries(after).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center gap-1">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300 truncate">{v}</span>
                  </div>
                ))
              ) : (
                <span className="text-slate-500 italic">State unchanged</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ExecutionTrace;
