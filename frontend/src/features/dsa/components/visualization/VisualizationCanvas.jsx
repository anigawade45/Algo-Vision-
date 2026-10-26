import React, { useState } from 'react';
import { Eye, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { VisualizerResolver } from '../visualizers';

export function VisualizationCanvas({
  problem,
  plan,
  currentStep,
  stepIndex,
  totalSteps,
  state: passedState,
  highlights: passedHighlights,
}) {
  const [showInputDetails, setShowInputDetails] = useState(false);
  const [renderMode, setRenderMode] = useState('standard'); // 'standard' | 'd3'

  if (!problem) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-center space-y-3">
        <Eye className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-sm font-mono text-slate-500">No problem data selected.</p>
      </div>
    );
  }

  // Derive scene state with priority on authoritative passed state
  const state = passedState || currentStep?.state || problem?.initialState?.primitives || problem?.initialState || {};
  const highlights = passedHighlights || currentStep?.highlights || {};

  const effectiveProblem = {
    ...problem,
    renderMode: problem?.renderMode || renderMode,
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-4 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Canvas Bar with Renderer Selector (when Plan is present) */}
      {plan && (
        <div className="relative z-10 flex items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-[#162032] text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Plan: {plan.layout}
            </span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800/60 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setRenderMode('standard')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                renderMode === 'standard'
                  ? 'bg-white dark:bg-[#0B101D] text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setRenderMode('d3')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                renderMode === 'd3'
                  ? 'bg-white dark:bg-[#0B101D] text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              D3.js Canvas
            </button>
          </div>
        </div>
      )}

      {/* Hero Visualization Display Workspace */}
      <div
        className="relative z-10 py-2 flex flex-col items-center justify-center min-h-[220px]"
        aria-label={totalSteps && totalSteps > 1 ? `Step ${stepIndex + 1} of ${totalSteps}` : 'Visualization Canvas'}
      >
        <VisualizerResolver
          problem={effectiveProblem}
          plan={plan}
          step={currentStep}
          stepIndex={stepIndex}
          state={state}
          highlights={highlights}
        />
      </div>

      {/* Compact Input & Expected Output Accordion Drawer */}
      <div className="relative z-10 border-t border-slate-100 dark:border-[#162032] pt-3">
        <button
          type="button"
          onClick={() => setShowInputDetails((prev) => !prev)}
          className="flex items-center justify-between w-full text-left text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all cursor-pointer py-1"
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Problem Parameters & Expected Output</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <span>{showInputDetails ? 'Hide' : 'Show Parameters'}</span>
            {showInputDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {showInputDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 animate-in fade-in duration-200">
            {/* Input Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111726]/60 border border-slate-200 dark:border-[#1E2638] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                INPUT PARAMETERS
              </span>
              <pre className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#0B101D] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-32">
                {JSON.stringify(problem.input !== undefined ? problem.input : problem.inputData, null, 2)}
              </pre>
            </div>

            {/* Expected Output Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111726]/60 border border-slate-200 dark:border-[#1E2638] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                EXPECTED OUTPUT
              </span>
              <pre className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#0B101D] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-32">
                {JSON.stringify(problem.expectedOutput !== undefined ? problem.expectedOutput : problem.outputData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
