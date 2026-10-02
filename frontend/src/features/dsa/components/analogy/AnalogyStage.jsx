import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { getAnalogyForProblem } from '../../data/analogy/mockAnalogies';
import { AnalogyScenario } from './AnalogyScenario';
import {
  getProblemAnalogy,
  generateProblemAnalogy,
  regenerateProblemAnalogy,
} from '@/api/dsa.api';

/**
 * STAGE 03 — ANALOGY
 * Connects the DSA problem to a familiar real-world story idea using Gemini AI.
 * Story structure: intro ({ title, subtitle }) & scenario ({ title, story }).
 */
export function AnalogyStage({ problemData, onCompleteStage, onNextStage, onOpenSpec }) {
  const [analogyData, setAnalogyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const activeRequestKeyRef = useRef(null);

  const problem = problemData || null;
  const problemKey = problem?.problemId || problem?.id || problem?._id;

  const categoryName = problem?.category || 'General';

  // Load existing or trigger new AI Analogy generation with request guard and stale handling
  const fetchOrGenerateAnalogy = useCallback(async (forceRegenerate = false) => {
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
        const regenRes = await regenerateProblemAnalogy(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        if (regenRes?.data?.analogy) {
          setAnalogyData(regenRes.data.analogy);
        } else {
          throw new Error('Analogy regeneration returned empty data.');
        }
      } else {
        // 1. Try GET existing stored analogy
        const getRes = await getProblemAnalogy(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return;

        const existingAnalogy = getRes?.data?.analogy;
        const isStale = getRes?.data?.stale === true;

        if (existingAnalogy && !isStale) {
          setAnalogyData(existingAnalogy);
        } else {
          // 2. If null or stale, POST generate new analogy via Gemini AI
          const genRes = await generateProblemAnalogy(problemKey);
          if (activeRequestKeyRef.current !== currentReqKey) return;

          if (genRes?.data?.analogy) {
            setAnalogyData(genRes.data.analogy);
          } else {
            throw new Error('Analogy story could not be generated.');
          }
        }
      }
    } catch (err) {
      if (activeRequestKeyRef.current !== currentReqKey) return;
      console.error('[AnalogyStage] Error loading analogy from API:', err);
      const apiMsg = err.response?.data?.message || err.message || 'Unable to generate problem analogy right now.';
      
      // Fallback to local mock analogy if available
      const localMock = getAnalogyForProblem(problemKey);
      if (localMock) {
        setAnalogyData(localMock);
        console.log('[AnalogyStage] Loaded local mock analogy fallback.');
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

  // Reset state immediately whenever problemKey changes to prevent cross-problem state leak
  useEffect(() => {
    setAnalogyData(null);
    setIsCompleted(false);
    setError(null);

    if (problemKey) {
      fetchOrGenerateAnalogy(false);
    } else {
      setLoading(false);
    }

    return () => {
      activeRequestKeyRef.current = null;
    };
  }, [problemKey, fetchOrGenerateAnalogy]);

  const handleCheckpoint = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('analogy');
    }
  };

  if (!problem) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Problem Selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a valid DSA problem to view its Stage 03 Analogy.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans w-full pb-12">
      {/* HEADER */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              03  ·  ANALOGY
            </span>
            {categoryName && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {categoryName}
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
                <span>Spec</span>
              </button>
            )}

            {isCompleted && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200/80 dark:border-emerald-800/80">
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Analogy Mastered
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {analogyData?.intro?.title || 'Connect to a Familiar Analogy'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          {analogyData?.intro?.subtitle || 'A familiar situation that mirrors this algorithm without the code.'}
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
              Crafting real-world story analogy...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AlgoVision is analyzing this problem to create a relatable, real-world metaphor explaining the core logic without technical jargon.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && !analogyData && (
        <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Unable to generate real-world story right now
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrGenerateAnalogy(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Retry AI Story Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE BODY */}
      {!loading && analogyData && (
        <div className="space-y-6">
          {/* REAL-WORLD SCENARIO - STORYTELLING */}
          <AnalogyScenario scenario={analogyData?.scenario} />
        </div>
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
                <span>Analogy Mastered ✓</span>
              </>
            ) : (
              <span>I Understand This Analogy</span>
            )}
          </button>

          {!loading && analogyData && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={() => fetchOrGenerateAnalogy(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              title="Force regenerate AI story analogy"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRegenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Regenerate AI Story</span>
            </button>
          )}
        </div>

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>Next: Stage 04 Pattern →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default AnalogyStage;
