import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';
import { MOCK_PROBLEMS } from '../../data/mockProblems';
import { getAnalogyForProblem } from '../../data/analogy/mockAnalogies';
import { AnalogyScenario } from './AnalogyScenario';
import { AnalogyInteraction } from './AnalogyInteraction';
import { AnalogyMapping } from './AnalogyMapping';
import { AnalogyStepVisualizer } from './AnalogyStepVisualizer';

/**
 * STAGE 03 — ANALOGY
 * Connects the DSA problem to a familiar real-world idea.
 * Data-driven architecture supporting any problem schema.
 */
export function AnalogyStage({ problemData, onCompleteStage, onNextStage, onOpenSpec }) {
  const problem = problemData && problemData.title ? problemData : MOCK_PROBLEMS[0];
  const analogyData = getAnalogyForProblem(problem.id);
  const [isDiscovered, setIsDiscovered] = useState(false);

  useEffect(() => {
    setIsDiscovered(false);
    if (onCompleteStage) onCompleteStage('analogy');
  }, [problem?.id, onCompleteStage]);

  const isFallback = !problemData || !problemData.title;

  return (
    <div className="space-y-6 font-sans w-full pb-12">
      {/* HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              03  ·  ANALOGY
            </span>
            {isFallback && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-mono">
                Demo Mode: {problem.title}
              </span>
            )}
            {problem.category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {problem.category}
              </span>
            )}
          </div>

        {onOpenSpec && (
          <button type="button" onClick={onOpenSpec}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-mono font-bold cursor-pointer border border-blue-200/80 dark:border-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Spec</span>
          </button>
        )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {analogyData?.intro?.title || 'Connect to a Familiar Analogy'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          {analogyData?.intro?.subtitle || 'A familiar situation that mirrors this algorithm without the code.'}
        </p>
      </header>

      {/* STAGE BODY */}
      <div className="space-y-6">
        {/* REAL-WORLD SCENARIO - STORYTELLING */}
        <AnalogyScenario scenario={analogyData?.scenario} />
      </div>

      {/* NAVIGATION FOOTER */}
      {onNextStage && (
        <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-end">
          <button type="button" onClick={onNextStage}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
            <span>Continue to Stage 04: Pattern</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AnalogyStage;
