import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Code2,
} from 'lucide-react';
import SelectedApproach from './SelectedApproach';
import PseudocodeViewer from './PseudocodeViewer';
import StepWalkthrough from './StepWalkthrough';
import DecisionPoints from './DecisionPoints';
import {
  getProblemPseudocode,
  generateProblemPseudocode,
  regenerateProblemPseudocode,
} from '@/api/dsa.api';

/**
 * STAGE 05 — PSEUDOCODE
 * Translates the selected algorithm approach from Stage 04 into clear, language-independent pseudocode logic.
 */
export function PseudocodeStage({
  problem,
  problemData,
  selectedApproachId,
  selectedApproachName,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const activeProblem = problem || problemData || null;
  const problemKey = activeProblem?.problemId || activeProblem?.id || activeProblem?._id;
  const activeApproachId = selectedApproachId || activeProblem?.defaultApproachId || 'hashTable';
  const activeApproachName = selectedApproachName || activeProblem?.defaultApproachName || activeApproachId;

  const [pseudocodeData, setPseudocodeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const activeRequestKeyRef = useRef(null);

  // Fetch or Generate Pseudocode for active problem and selected approach
  const fetchOrGeneratePseudocode = useCallback(async (forceRegenerate = false) => {
    if (!problemKey || !activeApproachId) {
      setLoading(false);
      return;
    }

    const currentReqKey = `${problemKey}_${activeApproachId}_${Date.now()}`;
    activeRequestKeyRef.current = currentReqKey;

    if (forceRegenerate) {
      setIsRegenerating(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (forceRegenerate) {
        const regenRes = await regenerateProblemPseudocode(problemKey, activeApproachId, activeApproachName);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        if (regenRes?.data?.pseudocode) {
          setPseudocodeData(regenRes.data.pseudocode);
        } else {
          throw new Error('Pseudocode regeneration returned empty data.');
        }
      } else {
        // 1. Try GET existing stored pseudocode
        const getRes = await getProblemPseudocode(problemKey, activeApproachId);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        const existingDoc = getRes?.data?.pseudocode;
        const isStale = getRes?.data?.stale === true;

        if (existingDoc && !isStale) {
          setPseudocodeData(existingDoc);
        } else {
          // 2. If null or stale, POST generate new pseudocode via Gemini AI
          const genRes = await generateProblemPseudocode(problemKey, activeApproachId, activeApproachName);
          if (activeRequestKeyRef.current !== currentReqKey) return;

          if (genRes?.data?.pseudocode) {
            setPseudocodeData(genRes.data.pseudocode);
          } else {
            throw new Error('Pseudocode data could not be generated.');
          }
        }
      }
    } catch (err) {
      if (activeRequestKeyRef.current !== currentReqKey) return;
      console.error('[PseudocodeStage] Error loading pseudocode from API:', err);
      const apiMsg = err.response?.data?.message || err.message || 'Unable to generate problem pseudocode right now.';
      setError(apiMsg);
    } finally {
      if (activeRequestKeyRef.current === currentReqKey) {
        setLoading(false);
        setIsRegenerating(false);
      }
    }
  }, [problemKey, activeApproachId, activeApproachName]);

  // Reset stage state whenever selected problem or approach changes
  useEffect(() => {
    setPseudocodeData(null);
    setIsCompleted(false);
    setError(null);

    if (problemKey && activeApproachId) {
      fetchOrGeneratePseudocode(false);
    } else {
      setLoading(false);
    }

    return () => {
      activeRequestKeyRef.current = null;
    };
  }, [problemKey, activeApproachId, fetchOrGeneratePseudocode]);

  const handleCheckpoint = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('pseudocode');
    }
  };

  if (!activeProblem) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Problem Selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a valid DSA problem to view its Stage 05 Pseudocode.</p>
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
  } = pseudocodeData || {};

  // Dynamically compute section numbers to ensure unbroken ordering
  let sectionCounter = 1;
  const selectedApproachNo = String(sectionCounter++).padStart(2, '0');
  const viewerNo = lines && lines.length > 0 ? String(sectionCounter++).padStart(2, '0') : null;
  const walkthroughNo = walkthrough && walkthrough.length > 0 ? String(sectionCounter++).padStart(2, '0') : null;
  const decisionsNo = decisions && decisions.length > 0 ? String(sectionCounter++).padStart(2, '0') : null;

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
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

            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80">
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Pseudocode Mastered
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

      {/* LOADING STATE */}
      {loading && (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              GEMINI AI GENERATION
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Translating algorithm to language-independent pseudocode...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AlgoVision is converting the selected approach ({activeApproachName || activeApproachId}) into clear, language-independent pseudocode steps.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && !pseudocodeData && (
        <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Unable to generate problem pseudocode right now
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrGeneratePseudocode(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Retry AI Pseudocode Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* PSEUDOCODE CONTENT */}
      {!loading && pseudocodeData && (
        <>
          {/* SECTION 01 — SELECTED APPROACH */}
          <SelectedApproach
            approachName={approachName || activeApproachName}
            approachContext={approachContext}
            sectionNo={selectedApproachNo}
          />

          {/* SECTION 02 — PSEUDOCODE VIEWER & INTERACTIVE STEP MODE */}
          {lines && lines.length > 0 && (
            <PseudocodeViewer lines={lines} sectionNo={viewerNo} />
          )}

          {/* SECTION 03 — STEP-BY-STEP WALKTHROUGH */}
          {walkthrough && walkthrough.length > 0 && (
            <StepWalkthrough walkthrough={walkthrough} sectionNo={walkthroughNo} />
          )}

          {/* SECTION 04 — IMPORTANT DECISION POINTS */}
          {decisions && decisions.length > 0 && (
            <DecisionPoints decisions={decisions} sectionNo={decisionsNo} />
          )}
        </>
      )}

      {/* Footer Action */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={isCompleted}
            onClick={handleCheckpoint}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Pseudocode Mastered ✓</span>
              </>
            ) : (
              <span>I Understand This Pseudocode</span>
            )}
          </button>

          {!loading && pseudocodeData && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={() => fetchOrGeneratePseudocode(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              title="Force regenerate AI pseudocode"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRegenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Regenerate AI Pseudocode</span>
            </button>
          )}
        </div>

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Next: Stage 07 Code →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default PseudocodeStage;
