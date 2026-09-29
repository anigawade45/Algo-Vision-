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
      {/* COMPACT HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>03 · ANALOGY</span>
          </span>
          {problem.category && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
              {problem.category}
            </span>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">
            {analogyData?.intro?.subtitle || 'A familiar situation that mirrors this algorithm.'}
          </p>
        </div>
        {onOpenSpec && (
          <button type="button" onClick={onOpenSpec}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-mono font-bold cursor-pointer border border-blue-200/80 dark:border-blue-900/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
            <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>Spec</span>
          </button>
        )}
      </header>

      {/* STAGE BODY */}
      <div className="space-y-6">
        {/* REAL-WORLD SCENARIO */}
        <AnalogyScenario scenario={analogyData?.scenario} />

        {/* 02 — INTERACTIVE STEP VISUALIZER */}
        {analogyData?.stepVisualizer && (
          <AnalogyStepVisualizer stepVisualizer={analogyData.stepVisualizer} />
        )}

        {/* 03 — INTERACTIVE CARD DISCOVERY */}
        <AnalogyInteraction
          scenario={analogyData?.scenario}
          interaction={analogyData?.interaction}
          onDiscoveryStateChange={(discovered) => setIsDiscovered(discovered)}
        />

        {/* 04 — DSA CONNECTION & TAKEAWAY */}
        <AnalogyMapping
          dsaConnection={analogyData?.dsaConnection}
          takeaway={analogyData?.takeaway}
          isDiscovered={isDiscovered}
        />
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
