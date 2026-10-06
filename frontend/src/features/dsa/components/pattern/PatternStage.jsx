import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Boxes,
} from 'lucide-react';
import { getPatternByProblemId } from '../../data/pattern';
import PatternStructure from './PatternStructure';
import PatternSignals from './PatternSignals';
import PatternSolutionFamilies from './PatternSolutionFamilies';
import {
  getProblemPattern,
  generateProblemPattern,
  regenerateProblemPattern,
} from '@/api/dsa.api';

/**
 * STAGE 04 — PATTERN
 * Teaches structural pattern recognition and identifies relevant DSA solution families
 * before handing off to Stage 05 (Algorithm).
 */
export function PatternStage({
  problem,
  problemData,
  selectedApproachId,
  onSelectApproach,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const activeProblem = problem || problemData || null;
  const problemKey = activeProblem?.problemId || activeProblem?.id || activeProblem?._id;

  const [patternData, setPatternData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [understood, setUnderstood] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const activeRequestKeyRef = useRef(null);

  // Load existing or trigger new AI Pattern generation with request guard and stale handling
  const fetchOrGeneratePattern = useCallback(async (forceRegenerate = false) => {
    if (!problemKey) {
      setLoading(false);
      return;
    }

    const currentReqKey = `${problemKey}_${Date.now()}`;
    activeRequestKeyRef.current = currentReqKey;

    if (forceRegenerate) {
      setIsRegenerating(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      if (forceRegenerate) {
        const regenRes = await regenerateProblemPattern(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        if (regenRes?.data?.pattern) {
          setPatternData(regenRes.data.pattern);
        } else {
          throw new Error('Pattern regeneration returned empty data.');
        }
      } else {
        // 1. Try GET existing stored pattern
        const getRes = await getProblemPattern(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        const existingPattern = getRes?.data?.pattern;
        const isStale = getRes?.data?.stale === true;

        if (existingPattern && !isStale) {
          setPatternData(existingPattern);
        } else {
          // 2. If null or stale, POST generate new pattern via Gemini AI
          const genRes = await generateProblemPattern(problemKey);
          if (activeRequestKeyRef.current !== currentReqKey) return;

          if (genRes?.data?.pattern) {
            setPatternData(genRes.data.pattern);
          } else {
            throw new Error('Pattern data could not be generated.');
          }
        }
      }
    } catch (err) {
      if (activeRequestKeyRef.current !== currentReqKey) return;
      console.error('[PatternStage] Error loading pattern from API:', err);
      const apiMsg = err.response?.data?.message || err.message || 'Unable to generate problem pattern right now.';

      // Fallback to local mock pattern dataset if available
      const localMock = getPatternByProblemId(problemKey);
      if (localMock) {
        setPatternData(localMock);
        console.log('[PatternStage] Loaded local mock pattern fallback.');
      } else {
        setError(apiMsg);
      }
    } finally {
      if (activeRequestKeyRef.current === currentReqKey) {
        setLoading(false);
        setIsRegenerating(false);
      }
    }
  }, [problemKey]);

  // Reset stage checkpoint state whenever selected problem changes
  useEffect(() => {
    setPatternData(null);
    setUnderstood(false);
    setError(null);

    if (problemKey) {
      fetchOrGeneratePattern(false);
    } else {
      setLoading(false);
    }

    return () => {
      activeRequestKeyRef.current = null;
    };
  }, [problemKey, fetchOrGeneratePattern]);

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('pattern');
    }
  };

  if (!activeProblem) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Problem Selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a valid DSA problem to view its Stage 04 Pattern.</p>
      </div>
    );
  }

  const {
    intro,
    structure,
    signals,
    abstraction,
    pattern,
    solutionFamilies,
  } = patternData || {};

  // Dynamically compute section numbers to ensure unbroken numerical ordering
  let sectionCounter = 1;
  const structureNo = structure ? String(sectionCounter++).padStart(2, '0') : null;
  const signalsNo = signals ? String(sectionCounter++).padStart(2, '0') : null;
  const solutionFamiliesNo = solutionFamilies ? String(sectionCounter++).padStart(2, '0') : null;

  return (
    <div className="space-y-10 sm:space-y-12 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5" aria-hidden="true" />
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
              Analyzing structural patterns...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AlgoVision is dissecting the problem inputs, constraints, structural signals, and abstractions to reveal the underlying DSA pattern.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && !patternData && (
        <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Unable to generate problem pattern right now
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrGeneratePattern(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Retry AI Pattern Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* PATTERN STAGE CONTENT */}
      {!loading && patternData && (
        <>
          {/* SECTION 01 — LOOK AT THE STRUCTURE & ABSTRACTION */}
          {structure && (
            <PatternStructure structure={structure} abstraction={abstraction || structure.abstraction} sectionNo={structureNo} />
          )}

          {/* SECTION 02 — WHAT STANDS OUT? (SIGNALS) */}
          {signals && (
            <PatternSignals signals={signals} sectionNo={signalsNo} />
          )}

          {/* SECTION 03 — CONNECT THE PATTERN TO SOLUTION FAMILIES */}
          {solutionFamilies && (
            <PatternSolutionFamilies
              patternName={pattern?.name}
              solutionFamilies={solutionFamilies}
              sectionNo={solutionFamiliesNo}
              selectedApproachId={selectedApproachId}
              onSelectApproach={onSelectApproach}
            />
          )}
        </>
      )}

      {/* Footer Action */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={understood}
            onClick={handleCheckpoint}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all duration-150 cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              understood
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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

          {!loading && patternData && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={() => fetchOrGeneratePattern(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              title="Force regenerate AI pattern analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRegenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Regenerate AI Pattern</span>
            </button>
          )}
        </div>

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Next: Stage 05 Algorithm →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default PatternStage;
