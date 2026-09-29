import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * STATE PANEL & STATE CHANGE HIGHLIGHTS
 * Renders the live variables grid and highlights changes derived from current step data.
 */
export function StatePanel({ variables, changes, sectionNo = '06' }) {
  if (!variables || !variables.length) return null;

  const changeMap = (changes || []).reduce((acc, c) => {
    acc[c.var] = c;
    return acc;
  }, {});

  return (
    <section aria-labelledby="state-panel-heading" className="space-y-2.5 font-sans">
      {/* Numbered Section Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-amber-600 dark:text-amber-400 uppercase">
        <div className="flex items-center gap-2">
          <span>{sectionNo}</span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
          <h2 id="state-panel-heading" className="font-bold text-amber-600 dark:text-amber-400">
            CURRENT STATE VARIABLES
          </h2>
        </div>

        {changes && changes.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 font-mono text-[10px] font-bold">
            State Mutated
          </span>
        )}
      </div>

      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {variables.map((v, idx) => {
            const mutation = changeMap[v.name];
            const isMutated = Boolean(mutation);

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all duration-200 motion-reduce:transition-none ${
                  isMutated
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/80 shadow-xs'
                    : 'bg-slate-50 dark:bg-[#070A13] border-slate-200/80 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 truncate">{v.label || v.name}</span>
                  {isMutated && (
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                      MODIFIED
                    </span>
                  )}
                </div>

                {isMutated ? (
                  <div className="space-y-1 pt-1 border-t border-amber-200/60 dark:border-amber-900/50 text-[10px] font-mono">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-bold text-slate-400 uppercase text-[9px]">BEFORE:</span>
                      <span className="font-medium truncate max-w-[70%]">{mutation.from}</span>
                    </div>
                    <div className="flex items-center justify-center text-amber-500 py-0.5">
                      <ArrowRight className="w-3 h-3 text-amber-500 rotate-90 shrink-0" aria-hidden="true" />
                    </div>
                    <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-extrabold">
                      <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-[9px]">AFTER:</span>
                      <span className="truncate max-w-[70%]">{mutation.to}</span>
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {v.value}
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

export default StatePanel;
