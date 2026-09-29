import React, { useState, useEffect } from 'react';
import { FileText, Check, ArrowRight } from 'lucide-react';
import { getPatternByProblemId } from '../../data/pattern';
import PatternStructure from './PatternStructure';
import PatternSignals from './PatternSignals';
import PatternFingerprint from './PatternFingerprint';
import PatternSolutionFamilies from './PatternSolutionFamilies';

/**
 * STAGE 04 — PATTERN
 * Teaches structural pattern recognition and identifies relevant DSA solution families
 * before handing off to Stage 05 (Algorithm).
 */
export function PatternStage({
  problem,
  problemData,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const activeProblem = problem || problemData;
  const patternData = getPatternByProblemId(activeProblem?.id);

  const [understood, setUnderstood] = useState(false);

  // Reset stage checkpoint state whenever selected problem changes
  useEffect(() => {
    setUnderstood(false);
  }, [activeProblem?.id]);

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('pattern');
    }
  };

  if (!patternData) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
        <p className="text-sm">Pattern data unavailable for this problem.</p>
      </div>
    );
  }

  const {
    intro,
    structure,
    signals,
    abstraction,
    pattern,
    fingerprint,
    solutionFamilies,
  } = patternData;

  // Dynamically compute section numbers to ensure unbroken numerical ordering
  let sectionCounter = 1;
  const structureNo = structure ? String(sectionCounter++).padStart(2, '0') : null;
  const signalsNo = signals ? String(sectionCounter++).padStart(2, '0') : null;
  const fingerprintNo = (pattern && fingerprint) ? String(sectionCounter++).padStart(2, '0') : null;
  const solutionFamiliesNo = solutionFamilies ? String(sectionCounter++).padStart(2, '0') : null;

  return (
    <div className="space-y-10 sm:space-y-12 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              {intro?.eyebrow || '04  ·  PATTERN'}
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
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Pattern Recognized
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {intro?.title || 'Recognize the Structure Behind the Problem'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          {intro?.subtitle || 'Before choosing an algorithm, identify the shape of the problem.'}
        </p>
      </header>

      {/* SECTION 01 — LOOK AT THE STRUCTURE & ABSTRACTION */}
      {structure && (
        <PatternStructure structure={structure} abstraction={abstraction} sectionNo={structureNo} />
      )}

      {/* SECTION 02 — WHAT STANDS OUT? (SIGNALS) */}
      {signals && (
        <PatternSignals signals={signals} sectionNo={signalsNo} />
      )}

      {/* SECTION 03 — PATTERN RECOGNITION & FINGERPRINT */}
      {pattern && fingerprint && (
        <PatternFingerprint
          pattern={pattern}
          fingerprint={fingerprint}
          sectionNo={fingerprintNo}
        />
      )}

      {/* SECTION 04 — CONNECT THE PATTERN TO SOLUTION FAMILIES */}
      {solutionFamilies && (
        <PatternSolutionFamilies
          patternName={pattern?.name}
          solutionFamilies={solutionFamilies}
          sectionNo={solutionFamiliesNo}
        />
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
                <span>Pattern Recognized ✓</span>
              </>
            ) : (
              <span>I Recognize the Pattern</span>
            )}
          </button>

          {onNextStage && (
            <button
              type="button"
              onClick={onNextStage}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span>Continue to Algorithm</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default PatternStage;
