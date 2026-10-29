import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import { getProblemAlgorithm, generateProblemAlgorithm, regenerateProblemAlgorithm } from '@/api/dsa.api';
import { InteractiveFlowchart } from './InteractiveFlowchart';

export function AlgorithmStage({
  problem,
  problemData,
  selectedApproachId,
  isCompleted: isCompletedProp = false,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const [isCompleted, setIsCompleted] = useState(Boolean(isCompletedProp));

  useEffect(() => {
    setIsCompleted(Boolean(isCompletedProp));
  }, [isCompletedProp]);

  const [algorithmData, setAlgorithmData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const activeProblem = problem || problemData;
  const problemKey = activeProblem?.problemId || activeProblem?.id || activeProblem?._id;

  const handleCheckpoint = () => {
    const nextState = !isCompleted;
    setIsCompleted(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('algorithm');
    }
  };

  const parseAndSetData = (rawText) => {
    try {
      if (typeof rawText === 'object') {
        setAlgorithmData(rawText);
        return;
      }
      
      let cleaned = String(rawText).trim();
      
      // Extract everything between the first { and the last }
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      } else {
        throw new Error('No JSON object found in response');
      }

      const data = JSON.parse(cleaned);
      setAlgorithmData(data);
    } catch (e) {
      console.error("Failed to parse AI output as JSON:", rawText, e);
      throw new Error(`AI generated invalid JSON: ${e.message}.`);
    }
  };

  const loadAlgorithm = async () => {
    if (!problemKey) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProblemAlgorithm(problemKey, selectedApproachId);
      if (res?.success && res.data?.algorithm?.rawText) {
        parseAndSetData(res.data.algorithm.rawText);
        setIsLoading(false);
        return;
      }
      await handleGenerate();
    } catch (err) {
      console.log('Failed to fetch algorithm, attempting generation...', err);
      if (err.response?.status === 404) {
        await handleGenerate();
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load algorithm');
        setIsLoading(false);
      }
    }
  };

  const handleGenerate = async (isRegenerating = false) => {
    if (!problemKey) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const apiCall = isRegenerating ? regenerateProblemAlgorithm : generateProblemAlgorithm;
      const res = await apiCall(problemKey, selectedApproachId);
      if (res?.success && res.data?.algorithm?.rawText) {
        parseAndSetData(res.data.algorithm.rawText);
      } else {
        throw new Error('Invalid response from AI generator');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate algorithm');
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setAlgorithmData(null);
    if (problemKey) {
      loadAlgorithm();
    }
  }, [problemKey, selectedApproachId]);

  const { intro, steps = [], flowchart } = algorithmData || {};

  return (
    <div className="space-y-10 sm:space-y-12 font-sans w-full pb-12 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              STAGE 05 · ALGORITHM
            </span>
            {activeProblem?.category && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {activeProblem.category}
              </span>
            )}
            {activeProblem?.difficulty && (
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md font-mono text-[11px] font-semibold leading-none ${
                activeProblem.difficulty === 'Easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 text-emerald-700 dark:text-emerald-400'
                  : activeProblem.difficulty === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/60 border border-amber-200/60 text-amber-700 dark:text-amber-400'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 text-rose-700 dark:text-rose-400'
              }`}>
                {activeProblem.difficulty}
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

            {intro && !isLoading && (
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-mono font-semibold transition-colors cursor-pointer disabled:opacity-50"
                title="Force regenerate algorithm steps via Gemini"
              >
                <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
                <span className="hidden sm:inline">Regenerate AI</span>
              </button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {intro?.title || 'Algorithm Strategy & Execution Flow'}
        </h1>

        <p className="text-[14px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2 sm:mt-2.5">
          {intro?.description || 'Learn how the optimal algorithm steps execute sequentially to solve the problem.'}
        </p>
      </header>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
              GEMINI AI GENERATION
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Structuring Algorithm Steps...
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Synthesizing algorithmic breakdown, decision branches, and visual flowchart representation.
            </p>
          </div>
        </div>
      )}

      {/* ERROR STATE */}
      {!isLoading && error && (
        <div className="p-6 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 space-y-3">
          <h3 className="text-sm font-bold text-rose-900 dark:text-rose-200">
            Failed to build algorithm flow
          </h3>
          <p className="text-xs text-rose-700 dark:text-rose-300">
            {error}
          </p>
          <button
            type="button"
            onClick={() => handleGenerate(false)}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-mono text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Retry Generation
          </button>
        </div>
      )}

      {/* ALGORITHM CONTENT */}
      {!isLoading && !error && algorithmData ? (
        <>
          {/* SECTION 01 — STEP BY STEP BREAKDOWN */}
          {steps.length > 0 && (
            <section className="space-y-4" aria-labelledby="steps-heading">
              <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
                <span>01</span>
                <span aria-hidden="true">•</span>
                <span id="steps-heading">STEP-BY-STEP ALGORITHM EXECUTION</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs">
                <div className="space-y-4">
                  {steps.map((st, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-[#05070E] border border-slate-100 dark:border-[#162032]">
                      <div className="shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs flex items-center justify-center">
                        {st.stepNo || idx + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {st.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
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
              <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-2">
                <span>02</span>
                <span aria-hidden="true">•</span>
                <span id="flowchart-heading">EXECUTION FLOWCHART</span>
              </div>

              <InteractiveFlowchart flowchartData={flowchart} />
            </section>
          )}
        </>
      ) : (
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-sans">
          <p className="text-sm">Algorithm data unavailable for this problem.</p>
        </div>
      )}

      {/* Footer Action */}
      {!isLoading && !error && algorithmData && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
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
                <span>Algorithm Mastered ✓</span>
              </>
            ) : (
              <span>I Understand This Algorithm</span>
            )}
          </button>

          {onNextStage && (
            <button
              type="button"
              disabled={!isCompleted}
              title={!isCompleted ? "Click 'I Understand This Algorithm' above to unlock Stage 06: Pseudocode" : "Proceed to Stage 06: Pseudocode"}
              onClick={onNextStage}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                isCompleted
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-xs'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
              }`}
            >
              <span>Next: Stage 06 Pseudocode →</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AlgorithmStage;
