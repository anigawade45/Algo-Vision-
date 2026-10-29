import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  Check,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Brain,
  Info,
  HelpCircle,
} from 'lucide-react';
import { InputDataRenderer } from './InputDataRenderer';
import { GenericExampleExplorer } from './GenericExampleExplorer';
import {
  getProblemUnderstanding,
  generateProblemUnderstanding,
  regenerateProblemUnderstanding,
} from '@/api/dsa.api';

/**
 * STAGE 02 — UNDERSTAND
 * Dynamic AI-generated explanation for every DSA problem.
 * Visual layout is driven strictly by Problem.inputData and Problem.outputData (MongoDB authoritative).
 * Educational explanations are loaded/generated from ProblemUnderstanding (Gemini AI) with stale hash protection.
 */
export function UnderstandingStage({ problemData, isCompleted = false, onCompleteStage, onNextStage, onOpenSpec }) {
  const [understanding, setUnderstanding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [understood, setUnderstood] = useState(Boolean(isCompleted));
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync completion state when prop changes
  useEffect(() => {
    setUnderstood(Boolean(isCompleted));
  }, [isCompleted]);

  const activeRequestKeyRef = useRef(null);

  const problem = problemData || null;
  const problemKey = problem?.problemId || problem?.id || problem?._id;

  const categoryName = problem?.category || 'General';
  const difficultyLevel = problem?.difficulty || 'Medium';

  // Load existing or trigger new AI Understanding generation with request guard and stale handling
  const fetchOrGenerateUnderstanding = useCallback(async (forceRegenerate = false) => {
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
        const regenRes = await regenerateProblemUnderstanding(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return; // Request guard

        if (regenRes?.data?.understanding) {
          setUnderstanding(regenRes.data.understanding);
        } else {
          throw new Error('Understanding regeneration returned empty data.');
        }
      } else {
        // 1. Try GET existing stored understanding
        const getRes = await getProblemUnderstanding(problemKey);
        if (activeRequestKeyRef.current !== currentReqKey) return; // Request guard

        const existingUnderstanding = getRes?.data?.understanding;
        const isStale = getRes?.data?.stale === true;

        if (existingUnderstanding && !isStale) {
          setUnderstanding(existingUnderstanding);
        } else {
          // 2. If null or stale, POST generate new understanding via Gemini AI
          const genRes = await generateProblemUnderstanding(problemKey);
          if (activeRequestKeyRef.current !== currentReqKey) return; // Request guard

          if (genRes?.data?.understanding) {
            setUnderstanding(genRes.data.understanding);
          } else {
            throw new Error('Understanding data could not be generated.');
          }
        }
      }
    } catch (err) {
      if (activeRequestKeyRef.current !== currentReqKey) return;
      console.error('[UnderstandingStage] Error loading understanding from API:', err);
      const apiMsg = err.response?.data?.message || err.message || 'Unable to generate problem understanding right now.';
      setError(apiMsg);
    } finally {
      if (activeRequestKeyRef.current === currentReqKey) {
        setLoading(false);
        setIsRegenerating(false);
      }
    }
  }, [problemKey]);

  // Reset state immediately whenever problemKey changes to prevent cross-problem state leak
  useEffect(() => {
    setUnderstanding(null);
    setUnderstood(false);
    setError(null);

    if (problemKey) {
      fetchOrGenerateUnderstanding(false);
    } else {
      setLoading(false);
    }

    return () => {
      activeRequestKeyRef.current = null;
    };
  }, [problemKey, fetchOrGenerateUnderstanding]);

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('understand');
    }
  };

  if (!problem) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3">
        <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" aria-hidden="true" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">No Problem Selected</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Please select a valid DSA problem to view its Stage 02 Understanding.</p>
      </div>
    );
  }

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" aria-hidden="true" />
              02 · UNDERSTAND
            </span>
            {categoryName && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {categoryName}
              </span>
            )}

            {difficultyLevel && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold leading-none ${
                difficultyLevel === 'Easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 text-emerald-700 dark:text-emerald-400'
                  : difficultyLevel === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 text-amber-700 dark:text-amber-400'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 text-rose-700 dark:text-rose-400'
              }`}>
                {difficultyLevel}
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
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Stage Understood
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          Understand the Problem
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          Before thinking about a solution, make sure the problem itself is completely clear.
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
              Understanding this problem...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AlgoVision is analyzing the input structure, expected output, sample cases, and constraints to build a clear, learner-friendly explanation.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!loading && error && (
        <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
                Unable to generate problem understanding right now
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchOrGenerateUnderstanding(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-colors cursor-pointer min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Retry AI Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* RESTRUCTURED GUIDED SEQUENCE */}
      <div className="space-y-11 sm:space-y-12">
        {/* 01 · WHAT ARE WE TRYING TO FIND? */}
        <section className="space-y-3" aria-labelledby="finding-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
            <span>01</span>
            <span aria-hidden="true">•</span>
            <span>WHAT ARE WE TRYING TO FIND?</span>
          </div>
          <h2 id="finding-heading" className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-relaxed max-w-3xl">
            {understanding?.objectiveExplanation || (problem.objective && problem.objective !== problem.title ? problem.objective : null) || problem.description || 'Determine the objective and required output specified by the problem.'}
          </h2>
        </section>

        {/* 02 · WHAT DO WE KNOW? */}
        <section className="space-y-3.5" aria-labelledby="knowing-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
            <span>02</span>
            <span aria-hidden="true">•</span>
            <span>WHAT DO WE KNOW?</span>
          </div>
          <h2 id="knowing-heading" className="sr-only">Input Knowledge Base</h2>

          <InputDataRenderer inputData={problem.inputData} label="INPUT" />
        </section>

        {/* 03 · WHAT SHOULD WE RETURN? */}
        <section className="space-y-3.5" aria-labelledby="returning-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2">
            <span>03</span>
            <span aria-hidden="true">•</span>
            <span>WHAT SHOULD WE RETURN?</span>
          </div>

          <h2 id="returning-heading" className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-relaxed max-w-3xl">
            {understanding?.outputExplanation || problem.outputData?.description || problem.outputData?.expectedRepresentation || 'The required output format matching the problem specification.'}
          </h2>

          {understanding?.inputToOutputFlow && (
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed max-w-3xl">
              <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px] uppercase tracking-wider block mb-1">INPUT ➔ OUTPUT FLOW:</strong>
              {understanding.inputToOutputFlow}
            </div>
          )}
        </section>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />

      {/* MAIN INTERACTION: GENERIC EXAMPLE EXPLORER */}
      <GenericExampleExplorer
        testCases={problem.testCases}
        testCaseExplanations={understanding?.testCaseExplanations}
        problemType={problem.inputData?.type}
        category={categoryName}
      />

          {/* COMMON MISUNDERSTANDINGS */}
          {understanding?.commonMisunderstandings && understanding.commonMisunderstandings.length > 0 && (
            <section className="space-y-3" aria-labelledby="misunderstandings-heading">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <h2 id="misunderstandings-heading" className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">
                  Common Misunderstandings
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 space-y-2">
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
                  {understanding.commonMisunderstandings.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* EDGE CASE INSIGHTS */}
          {understanding?.edgeCaseInsights && understanding.edgeCaseInsights.length > 0 && (
            <section className="space-y-3" aria-labelledby="edgecases-heading">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                <h2 id="edgecases-heading" className="text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-white uppercase">
                  Edge Case Insights
                </h2>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/70 dark:border-indigo-900/40 space-y-2">
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
                  {understanding.edgeCaseInsights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold shrink-0">❖</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

      {/* Footer Actions */}
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
                <span>Understood ✓</span>
              </>
            ) : (
              <span>I Understand</span>
            )}
          </button>

          {!loading && understanding && (
            <button
              type="button"
              disabled={isRegenerating}
              onClick={() => fetchOrGenerateUnderstanding(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white dark:bg-[#162032] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50 min-h-[44px]"
              title="Force regenerate AI explanation"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRegenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">Regenerate AI</span>
            </button>
          )}
        </div>

        {onNextStage && (
          <button
            type="button"
            disabled={!understood}
            title={!understood ? "Click 'I Understand' above to complete this stage and unlock Stage 03: Analogy" : "Proceed to Stage 03: Analogy"}
            onClick={onNextStage}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              understood
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Next: Stage 03 Analogy →</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

export default UnderstandingStage;
