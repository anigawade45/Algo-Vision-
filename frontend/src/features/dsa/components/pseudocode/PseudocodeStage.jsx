import React, { useState, useEffect } from 'react';
import { FileText, Check, ArrowRight } from 'lucide-react';
import { getPseudocodeByProblemAndApproach } from '../../data/pseudocode';
import SelectedApproach from './SelectedApproach';
import PseudocodeViewer from './PseudocodeViewer';
import StepWalkthrough from './StepWalkthrough';
import DecisionPoints from './DecisionPoints';

/**
 * STAGE 06 — PSEUDOCODE
 * Translates the selected algorithm approach from Stage 05 into clear, language-independent pseudocode logic.
 */
export function PseudocodeStage({
  problem,
  problemData,
  selectedApproachId,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const activeProblem = problem || problemData;
  const activeApproachId = selectedApproachId || activeProblem?.defaultApproachId;

  const pseudocodeData = getPseudocodeByProblemAndApproach(
    activeProblem?.id,
    activeApproachId
  );

  const [understood, setUnderstood] = useState(false);

  // Reset stage checkpoint state whenever selected problem or approach changes
  useEffect(() => {
    setUnderstood(false);
  }, [activeProblem?.id, activeApproachId]);

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('pseudocode');
    }
  };

  if (!pseudocodeData) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
        <p className="text-sm">Pseudocode data unavailable for this problem and approach.</p>
      </div>
    );
  }

  const {
    intro,
    approachName,
    approachContext,
    lines,
    walkthrough,
    decisions,
  } = pseudocodeData;

  // Dynamically compute section numbers to ensure unbroken ordering
  let sectionCounter = 1;
  const selectedApproachNo = String(sectionCounter++).padStart(2, '0');
  const viewerNo = lines ? String(sectionCounter++).padStart(2, '0') : null;
  const walkthroughNo = walkthrough ? String(sectionCounter++).padStart(2, '0') : null;
  const decisionsNo = decisions ? String(sectionCounter++).padStart(2, '0') : null;

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              {intro?.eyebrow || '06  ·  PSEUDOCODE'}
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

            {understood && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80">
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Pseudocode Understood
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {intro?.title || 'Turn the Chosen Algorithm into Clear, Step-by-Step Logic'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          {intro?.subtitle || 'Before writing code, describe exactly what the algorithm needs to do.'}
        </p>
      </header>

      {/* SECTION 01 — SELECTED APPROACH */}
      <SelectedApproach
        approachName={approachName}
        approachContext={approachContext}
        sectionNo={selectedApproachNo}
      />

      {/* SECTION 02 — PSEUDOCODE VIEWER & INTERACTIVE STEP MODE */}
      {lines && (
        <PseudocodeViewer lines={lines} sectionNo={viewerNo} />
      )}

      {/* SECTION 03 — STEP-BY-STEP WALKTHROUGH */}
      {walkthrough && (
        <StepWalkthrough walkthrough={walkthrough} sectionNo={walkthroughNo} />
      )}

      {/* SECTION 04 — IMPORTANT DECISION POINTS */}
      {decisions && (
        <DecisionPoints decisions={decisions} sectionNo={decisionsNo} />
      )}

      {/* COMPLETION ACTIONS */}
      <section
        className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            aria-pressed={understood}
            onClick={handleCheckpoint}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold shadow-xs transition-all duration-150 cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              understood
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {understood ? (
              <>
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pseudocode Understood ✓</span>
              </>
            ) : (
              <span>I Understand the Pseudocode</span>
            )}
          </button>

          {onNextStage && (
            <button
              type="button"
              onClick={onNextStage}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span>Continue to Code</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default PseudocodeStage;
