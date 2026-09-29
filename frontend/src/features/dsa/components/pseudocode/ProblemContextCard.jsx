import React from 'react';
import { Target } from 'lucide-react';

/**
 * SECTION 02 — INPUT / PROBLEM CONTEXT
 * Provides immediate problem context so the learner doesn't have to leave Stage 06.
 */
function renderInputContent(context) {
  let text = '';

  if (Array.isArray(context.inputs) && context.inputs.length > 0) {
    text = context.inputs
      .map((item) =>
        typeof item === 'string' ? item : `${item.label || item.name || 'input'} = ${item.value}`
      )
      .join(', ');
  } else if (Array.isArray(context.inputVisual) && context.inputVisual.length > 0) {
    text = context.inputVisual.join(', ');
  } else if (typeof context.inputVisual === 'string' && context.inputVisual.trim()) {
    text = context.inputVisual.trim();
  }

  if (!text) return null;

  return (
    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 font-mono break-all">
      {text}
    </span>
  );
}

export function ProblemContextCard({ context, sectionNo = '02' }) {
  if (!context) return null;

  return (
    <section className="space-y-2.5 font-sans" aria-labelledby="problem-context-heading">
      {/* Numbered Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <span>PROBLEM CONTEXT</span>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 id="problem-context-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-500 shrink-0" aria-hidden="true" />
            <span>{context.title}</span>
          </h2>
          {context.kValue && (
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-extrabold">
              {context.kValue}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-6 sm:gap-10 font-mono">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block tracking-wider">
              INPUT FORMAT & DATA:
            </span>
            {context.inputFormat && (
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 font-mono">Format:</span>
                <span className="font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200/60 dark:border-blue-900/60 text-[11px] font-bold">
                  {context.inputFormat}
                </span>
              </div>
            )}
            <div className="pt-0.5">
              {renderInputContent(context)}
            </div>
          </div>

          <div className="space-y-1 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block tracking-wider">OBJECTIVE GOAL:</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
              {context.goal}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemContextCard;


