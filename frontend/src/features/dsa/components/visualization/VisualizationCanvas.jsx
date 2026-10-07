import React, { useState } from 'react';
import { Eye, Box, Code2, ChevronDown, ChevronUp } from 'lucide-react';
import { VISUALIZATION_TYPE_LABELS } from '../../data/visualizationTypes';
import { VisualizerResolver } from '../visualizers';

export function VisualizationCanvas({ problem, currentStep, stepIndex, totalSteps }) {
  const [showInputDetails, setShowInputDetails] = useState(false);

  if (!problem) {
    return (
      <div className="p-8 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-center space-y-3">
        <Eye className="w-8 h-8 text-slate-400 mx-auto" />
        <p className="text-sm font-mono text-slate-500">No problem data selected.</p>
      </div>
    );
  }

  const vizTypeLabel = VISUALIZATION_TYPE_LABELS[problem.visualizationType] || problem.visualizationType;
  const state = currentStep?.state || {};
  const highlights = currentStep?.highlights || {};

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs space-y-4 relative overflow-hidden">
      {/* Background Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40" />

      {/* Hero Visualization Display Workspace */}
      <div className="relative z-10 py-2 flex flex-col items-center justify-center min-h-[220px]">
        <VisualizerResolver
          problem={problem}
          step={currentStep}
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
                {JSON.stringify(problem.input, null, 2)}
              </pre>
            </div>

            {/* Expected Output Card */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111726]/60 border border-slate-200 dark:border-[#1E2638] space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                EXPECTED BENCHMARK OUTPUT
              </span>
              <pre className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#0B101D] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto max-h-32">
                {JSON.stringify(problem.expectedOutput, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
