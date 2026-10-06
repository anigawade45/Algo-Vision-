import React, { useState, useEffect } from 'react';
import { FileText, ArrowRight, Check, Sparkles, RefreshCw } from 'lucide-react';
import { getProblemAlgorithm, generateProblemAlgorithm, regenerateProblemAlgorithm } from '@/api/dsa.api';
import { InteractiveFlowchart } from './InteractiveFlowchart';

export function AlgorithmStage({
  problem,
  problemData,
  selectedApproachId,
  onCompleteStage,
  onNextStage,
  onOpenSpec,
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [algorithmData, setAlgorithmData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  
  const activeProblem = problem || problemData;

  useEffect(() => {
    if (isCompleted && onCompleteStage) {
      onCompleteStage('algorithm');
    }
  }, [isCompleted, onCompleteStage]);

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
    if (!activeProblem?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const res = await getProblemAlgorithm(activeProblem.id, selectedApproachId);
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
    if (!activeProblem?.id) return;
    
    setIsGenerating(true);
    setError(null);
    try {
      const apiCall = isRegenerating ? regenerateProblemAlgorithm : generateProblemAlgorithm;
      const res = await apiCall(activeProblem.id, selectedApproachId);
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
    loadAlgorithm();
  }, [activeProblem?.id, selectedApproachId]);

  const { intro, steps = [], flowchart } = algorithmData || {};

  return (
    <div className="space-y-10 sm:space-y-12 font-sans w-full pb-12 animate-in fade-in duration-300">
      
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
            <button
              type="button"
              onClick={() => handleGenerate(true)}
              disabled={isLoading || isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#162032] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1E2638] text-xs font-mono font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isGenerating ? 'animate-spin' : ''}`} aria-hidden="true" />
              <span>{isGenerating ? 'Generating AI...' : 'Regenerate'}</span>
            </button>
            {onOpenSpec && (
              <button
                type="button"
                onClick={onOpenSpec}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs font-mono font-bold cursor-pointer border border-blue-200/80 dark:border-blue-900/60 transition-colors"
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
          Review the formal step-by-step algorithm and trace its execution logic via the interactive flowchart.
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Sparkles className="w-8 h-8 text-blue-500 animate-pulse" />
          <p className="text-sm font-mono text-slate-500">Analyzing problem and generating algorithm JSON...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-2xl text-red-600 dark:text-red-400 text-sm font-mono flex flex-col gap-4">
          <p>Error: {error}</p>
          <button 
            onClick={() => handleGenerate(true)} 
            className="self-start px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Force Try Again
          </button>
        </div>
      ) : algorithmData ? (
        <>
          {/* SECTION 01 — FORMAL ALGORITHM */}
          {steps.length > 0 && (
            <section className="space-y-4" aria-labelledby="steps-heading">
              <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
                <span>01</span>
                <span aria-hidden="true">•</span>
                <span id="steps-heading">FORMAL ALGORITHM PROCEDURE</span>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-5">
                <div className="space-y-0 relative">
                  <div className="absolute left-3 top-3 bottom-8 w-px bg-slate-200 dark:bg-slate-800" aria-hidden="true" />
                  
                  {steps.map((st, idx) => (
                    <div key={st.stepNo} className="flex gap-4 items-start relative pb-7 last:pb-0">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 flex items-center justify-center shrink-0 mt-0.5 relative z-10 border-2 border-white dark:border-[#0B101D]">
                        <span className="text-blue-700 dark:text-blue-400 text-[11px] font-bold font-mono">
                          {idx + 1}
                        </span>
                      </div>
                      <div className="space-y-1.5 pt-0.5">
                        <h4 className="font-bold text-[15px] text-slate-900 dark:text-white font-mono uppercase tracking-tight">
                          Step {idx + 1}: {st.title}
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
            onClick={() => setIsCompleted(!isCompleted)}
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
              onClick={onNextStage}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
