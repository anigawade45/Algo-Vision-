import React from 'react';
import { FileText, ArrowRight, BookOpen } from 'lucide-react';
import { getAlgorithmForProblem } from '../../data/algorithm/mockAlgorithms';
import { InteractiveFlowchart } from './InteractiveFlowchart';

/**
 * STAGE 05 — ALGORITHM
 * Displays formal step-by-step algorithm and an interactive flowchart.
 */
export function AlgorithmStage({
  problem,
  problemData,
  onNextStage,
  onOpenSpec,
}) {
  const activeProblem = problem || problemData;
  const algorithmData = getAlgorithmForProblem(activeProblem?.id, activeProblem?.title);

  if (!algorithmData) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
        <p className="text-sm">Algorithm data unavailable for this problem.</p>
      </div>
    );
  }

  const { intro, steps = [], flowchart } = algorithmData;

  return (
    <div className="space-y-10 sm:space-y-12 font-sans w-full pb-12">
      
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              {intro?.eyebrow || '05  ·  ALGORITHM'}
            </span>
            {activeProblem?.category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {activeProblem.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onOpenSpec && (
              <button
                type="button"
                onClick={onOpenSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-mono font-bold cursor-pointer border border-blue-200/80 dark:border-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>Problem Spec</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          Formal Algorithm & Flowchart
        </h1>
        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          Review the formal step-by-step algorithm and trace its execution logic via the flowchart.
        </p>
      </header>

      {/* SECTION 01 — FORMAL ALGORITHM */}
      {steps.length > 0 && (
        <section className="space-y-4" aria-labelledby="steps-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
            <span>01</span>
            <span aria-hidden="true">•</span>
            <span id="steps-heading">FORMAL ALGORITHM PROCEDURE</span>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-5">
            <div className="space-y-4">
              {steps.map((st, idx) => (
                <div key={st.stepNo} className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-700 dark:text-blue-400 text-[11px] font-bold font-mono">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[15px] text-slate-900 dark:text-white">
                      {st.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                      {st.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 02 — INTERACTIVE FLOWCHART */}
      {flowchart && (
        <section className="space-y-4" aria-labelledby="flowchart-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
            <span>02</span>
            <span aria-hidden="true">•</span>
            <span id="flowchart-heading">EXECUTION FLOWCHART</span>
          </div>

          <InteractiveFlowchart flowchartData={flowchart} />
        </section>
      )}

      {/* STAGE NAVIGATION */}
      {onNextStage && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex justify-end">
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            <span>Continue to Pseudocode</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}

    </div>
  );
}

export default AlgorithmStage;
