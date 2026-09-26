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
          <h2 id="finding-heading" className="text-xl sm:text-[22px] md:text-2xl font-bold text-slate-900 dark:text-white leading-snug max-w-3xl">
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

          <h2 id="returning-heading" className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug max-w-3xl">
            {problem.outputData?.description || 'The expected result matching problem requirements.'}
          </h2>

          <div className="pt-1 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
              GIVEN INPUT
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
              TARGET CONDITION
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold uppercase">
              {problem.outputData?.expectedRepresentation || 'MATCHING OUTPUT RESULT'}
            </span>
          </div>
        </section>
      </div>

      <div className="h-px bg-slate-200/80 dark:bg-slate-800/80 my-4" />

      {/* MAIN INTERACTION: GENERIC EXAMPLE EXPLORER */}
      <GenericExampleExplorer testCases={problem.testCases} />

      {/* PROBLEM-LEVEL OBSERVATIONS */}
      <section className="space-y-3" aria-labelledby="observations-heading">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
            PROBLEM INSIGHTS
          </span>
          <h2 id="observations-heading" className="text-lg font-bold text-slate-900 dark:text-white">
            Problem-Level Observations
          </h2>
        </div>

        <div className="p-2 sm:p-3 rounded-2xl bg-slate-50/60 dark:bg-[#0E1424]/60 border border-slate-200/70 dark:border-[#1E2638] space-y-1">
          {observations.map((obs, idx) => {
            const obsKey = `obs_${idx}`;
            const isExpanded = expandedObservations[obsKey];
            const contentId = `obs-detail-${idx}`;

            return (
              <div key={idx} className="rounded-xl overflow-hidden transition-colors">
                <button
                  type="button"
                  aria-expanded={Boolean(isExpanded)}
                  aria-controls={contentId}
                  onClick={() => toggleObservation(obsKey)}
                  className="w-full p-3 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-200/50 dark:hover:bg-[#162032] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <div className="flex items-center gap-2.5 pr-2">
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      Observation {obs.stepNo || `0${idx + 1}`}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                    <span className="font-bold tracking-tight uppercase line-clamp-1 sm:line-clamp-none">{obs.title}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono text-blue-600 dark:text-blue-400 shrink-0">
                    <span>{isExpanded ? 'Hide' : 'Reveal'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div
                    id={contentId}
                    className="p-3.5 pt-1.5 ml-3 border-l-2 border-blue-500 text-xs text-slate-600 dark:text-slate-300 font-sans leading-relaxed transition-all duration-150 motion-reduce:transition-none"
                  >
                    {obs.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SUPPORTING REFERENCE: PROBLEM STATEMENT & CONSTRAINTS */}
      <section aria-labelledby="reference-heading">
        <div className="rounded-2xl bg-slate-50/60 dark:bg-[#0E1424]/60 border border-slate-200/70 dark:border-[#1E2638] overflow-hidden">
          <button
            type="button"
            aria-expanded={showReference}
            aria-controls="problem-reference-panel"
            onClick={() => setShowReference(!showReference)}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-slate-200/50 dark:hover:bg-[#162032] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
              <span id="reference-heading">Problem Statement & Constraints (Reference)</span>
            </div>
            {showReference ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />}
          </button>

          {showReference && (
            <div id="problem-reference-panel" className="p-4 pt-2 border-t border-slate-200/60 dark:border-[#1E2638] space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <span className="font-mono font-bold text-slate-400 uppercase text-[10px]">Description</span>
                <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-slate-300 dark:border-slate-700">
                  {problem.description}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-mono font-bold text-slate-400 uppercase text-[10px]">Constraints</span>
                {constraintsList.length > 0 ? (
                  <ul className="font-mono text-slate-800 dark:text-slate-200 space-y-1 list-disc list-inside pl-1">
                    {constraintsList.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="font-mono text-slate-400">
                    No constraints specified.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* COMPLETION CHECKPOINT */}
      <section
        aria-labelledby="understand-checkpoint-heading"
        className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 space-y-5"
      >
        <div className="space-y-1" aria-live="polite">
          <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
            STAGE CHECKPOINT
          </span>
          <h2 id="understand-checkpoint-heading" className="text-xl font-bold text-slate-900 dark:text-white">
            {understood ? '✓ UNDERSTOOD' : 'CHECK YOUR UNDERSTANDING'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {understood
              ? 'You are ready to connect this problem to a familiar real-world idea.'
              : 'Before moving on, make sure you can explain:'}
          </p>
        </div>

        {!understood && (
          <div className="space-y-2 text-xs font-mono text-slate-700 dark:text-slate-300 pl-3 border-l-2 border-blue-500/40 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>What the problem gives you</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>What it asks you to find</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>What the output represents</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
                <span>Why the examples satisfy the requirement</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
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
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <span>Continue to Analogy</span>
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

export default UnderstandingStage;
