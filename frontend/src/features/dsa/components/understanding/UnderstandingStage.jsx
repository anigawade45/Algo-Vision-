import React, { useState, useEffect } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
} from 'lucide-react';
import { MOCK_PROBLEMS } from '../../data/mockProblems';
import { InputDataRenderer } from './InputDataRenderer';
import { GenericExampleExplorer } from './GenericExampleExplorer';

/**
 * STAGE 02 — UNDERSTAND
 * Ensures complete problem clarity (input, output, target constraints, example analysis)
 * before moving to Stage 03 (Analogy).
 */
export function UnderstandingStage({ problemData, onCompleteStage, onNextStage, onOpenSpec }) {
  const problem = problemData && problemData.title
    ? problemData
    : MOCK_PROBLEMS[0]; // Default to Two Sum mock object

  const [understood, setUnderstood] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [expandedObservations, setExpandedObservations] = useState({});

  // Reset stage state whenever selected problem changes
  useEffect(() => {
    setUnderstood(false);
    setShowReference(false);
    setExpandedObservations({});
  }, [problem?.id]);

  const toggleObservation = (key) => {
    setExpandedObservations((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckpoint = () => {
    const nextState = !understood;
    setUnderstood(nextState);
    if (nextState && onCompleteStage) {
      onCompleteStage('understand');
    }
  };

  const isFallback = !problemData || !problemData.title;
  const constraintsList = Array.isArray(problem.constraints)
    ? problem.constraints
    : typeof problem.constraints === 'string'
    ? problem.constraints.split('\n').filter(Boolean)
    : [];

  const observations = problem.observations || [
    {
      stepNo: '01',
      title: 'INPUT REPRESENTS PROBLEM SPECIFICATION',
      detail: 'Analyze the given input data structure and its properties.',
    },
    {
      stepNo: '02',
      title: 'TARGET OR CONDITION DEFINES RELATIONSHIP',
      detail: 'Understand what condition must be satisfied to produce a valid result.',
    },
    {
      stepNo: '03',
      title: 'OUTPUT MATCHES EXPECTED DATA TYPE',
      detail: 'Ensure the output format strictly aligns with the problem requirement.',
    },
  ];

  return (
    <div className="space-y-7 font-sans w-full pb-12">
      {/* TOP SECTION / INTRODUCTION */}
      <header className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 tracking-[0.08em] uppercase leading-none">
              02  ·  UNDERSTAND
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

      {/* RESTRUCTURED GUIDED SEQUENCE */}
      <div className="space-y-11 sm:space-y-12">
        {/* 01 · WHAT ARE WE TRYING TO FIND? */}
        <section className="space-y-3" aria-labelledby="finding-heading">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
            <span>01</span>
            <span aria-hidden="true">•</span>
            <span>WHAT ARE WE TRYING TO FIND?</span>
          </div>
          <h2 id="finding-heading" className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-snug max-w-3xl">
            {problem.objective}
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

          <h2 id="returning-heading" className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-snug max-w-3xl">
            {problem.outputData?.description || 'The expected result matching problem requirements.'}
          </h2>


        </section>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />

      {/* MAIN INTERACTION: GENERIC EXAMPLE EXPLORER */}
      <GenericExampleExplorer testCases={problem.testCases} />





      {/* Footer Action */}
      <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
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

        {onNextStage && (
          <button
            type="button"
            onClick={onNextStage}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
