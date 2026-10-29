import React from 'react';
import { FileText, Sliders, ArrowRight, Lightbulb, AlertCircle, RefreshCw } from 'lucide-react';

const FALLBACK_TWO_SUM = {
  title: 'Two Sum',
  description:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
  constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Only one valid answer exists.'],
  testCases: [
    { id: 1, inputRaw: 'nums = [2, 7, 11, 15], target = 9', outputRaw: '[0, 1]' },
    { id: 2, inputRaw: 'nums = [3, 2, 4], target = 6', outputRaw: '[1, 2]' },
  ],
  approach: 'Hash Map single-pass complement lookup.',
};

/**
 * Safely format test case inputs or outputs across string, raw, or structured object formats.
 */
const formatTestValue = (raw, value, structured, fallback) => {
  if (raw != null && raw !== '') return raw;
  if (value != null && value !== '') return value;

  if (structured != null) {
    return typeof structured === 'object'
      ? JSON.stringify(structured)
      : String(structured);
  }

  return fallback;
};

export function ProblemStage({
  problemData,
  isLoading = false,
  errorMessage = null,
  onNextStage,
  onOpenSpec,
  onRetry,
  isDemo = false,
}) {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-7 font-sans w-full pb-12 animate-pulse" aria-busy="true" aria-label="Loading problem specification">
        {/* Header Skeleton */}
        <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
          <div className="h-8 w-72 bg-slate-200 dark:bg-slate-800 rounded-lg mt-2" />
          <div className="h-4 w-96 max-w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        {/* Problem Statement Skeleton */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3">
          <div className="h-5 w-44 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="space-y-2 p-4 rounded-xl bg-slate-50 dark:bg-[#05070E]">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-4/5 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Test Cases Skeleton */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4">
          <div className="h-5 w-52 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="grid grid-cols-1 gap-3">
            <div className="h-24 bg-slate-50 dark:bg-[#05070E] rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Resolve Canonical Problem Data (Explicit Demo Mode Only fallback)
  const isFallback = isDemo && (!problemData || !problemData.title);
  const problem = isFallback ? FALLBACK_TWO_SUM : problemData;

  // 3. Problem Missing / Error State (Never silently fall back to Two Sum)
  if (!problem || !problem.title) {
    return (
      <div className="p-8 sm:p-10 rounded-2xl bg-white dark:bg-[#0B101D] border border-rose-200 dark:border-rose-950/60 space-y-5 text-center max-w-xl mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Problem Specification Unavailable
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {errorMessage || 'The requested canonical problem specification could not be loaded.'}
          </p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Safe test cases resolution
  const testCases = problem.testCases && problem.testCases.length > 0
    ? problem.testCases
    : [
      {
        id: 1,
        inputRaw: problem.input || '',
        outputRaw: problem.output || '',
      },
    ];

  // 5. Clean whitespace-trimmed constraints list
  const constraintsList = Array.isArray(problem.constraints)
    ? problem.constraints
    : typeof problem.constraints === 'string'
      ? problem.constraints.split('\n').map((item) => item.trim()).filter(Boolean)
      : [];

  return (
    <div className="space-y-7 font-sans w-full pb-12">

      {/* TOP SECTION / INTRODUCTION */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80 pb-6 sm:pb-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-blue-500 dark:text-blue-400/90 tracking-[0.08em] uppercase leading-none">
              01  ·  YOUR PROBLEM
            </span>
            {problem.category && (
              <span className="inline-flex items-center px-2.5 py-[3px] rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-300 font-mono text-[11px] font-semibold leading-none">
                {problem.category}
              </span>
            )}
          </div>

          {onOpenSpec && (
            <button
              type="button"
              onClick={onOpenSpec}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold cursor-pointer border border-blue-200 dark:border-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Problem Spec</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-[38px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mt-4 sm:mt-4.5">
          {problem.title || 'Submitted Problem'}
        </h1>

        <p className="text-[15px] sm:text-base text-slate-600 dark:text-slate-400 font-normal leading-relaxed max-w-2xl mt-2.5 sm:mt-3">
          This is the original problem specification and test input seed for <strong className="text-slate-900 dark:text-white">{problem.title}</strong>.
        </p>
      </div>

      {/* Problem Statement */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#162032] pb-2">
          <FileText className="w-4 h-4 text-blue-500" aria-hidden="true" />
          <h3 className="text-sm font-bold tracking-tight">Full Problem Statement</h3>
        </div>

        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 dark:bg-[#05070E] p-4 rounded-xl border border-slate-200/60 dark:border-[#162032]">
          {problem.description || 'No detailed statement provided.'}
        </div>
      </div>

      {/* Test Cases List */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#162032] pb-2">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Sliders className="w-4 h-4 text-blue-500" aria-hidden="true" />
            <h3 className="text-sm font-bold tracking-tight">Input & Output Sample Cases</h3>
          </div>
          <span className="text-xs font-mono font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            {testCases.length} Case{testCases.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {testCases.map((tc, idx) => {
            const inputVal = formatTestValue(
              tc.inputRaw,
              tc.input,
              tc.inputStructured,
              'No input provided'
            );
            const outputVal = formatTestValue(
              tc.outputRaw,
              tc.output,
              tc.outputStructured,
              'No output provided'
            );

            return (
              <div key={tc.id || idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200/60 dark:border-[#162032] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <span>Sample Case #{idx + 1}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638]">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">INPUT:</span>
                    <span className="text-slate-900 dark:text-white font-semibold">{inputVal}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#0B101D] border border-emerald-300 dark:border-emerald-900/60">
                    <span className="text-emerald-500 block text-[10px] uppercase font-bold mb-0.5">EXPECTED OUTPUT:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{outputVal}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Constraints & Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-[#162032] pb-2">
            Constraints
          </h3>
          <div className="bg-slate-50 dark:bg-[#05070E] p-3.5 rounded-xl border border-slate-200/60 dark:border-[#162032] text-xs font-mono text-slate-800 dark:text-slate-200 space-y-1">
            {constraintsList.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {constraintsList.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            ) : (
              <div className="text-slate-400">No explicit constraints provided.</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-500 border-b border-slate-100 dark:border-[#162032] pb-2">
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Initial Idea / Strategy</h3>
          </div>
          <div className="bg-slate-50 dark:bg-[#05070E] p-3.5 rounded-xl border border-slate-200/60 dark:border-[#162032] text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
            {problem.approach || 'No initial approach provided. AlgoVision will analyze the optimal solution strategy in Stage 04: Pattern.'}
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
          Ready to break down what this problem asks?
        </span>
        <button
          type="button"
          onClick={onNextStage}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-mono font-bold transition-all cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span>Next: Stage 02 Understand →</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

    </div>
  );
}
