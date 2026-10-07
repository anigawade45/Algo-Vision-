import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { MOCK_VISUALIZATIONS } from '../../data/mockVisualizations';
import { VISUALIZATION_TYPE_LABELS } from '../../data/visualizationTypes';

export function VisualizationProblemSelector({ selectedProblemId, onSelectProblem }) {
  const currentProblem = MOCK_VISUALIZATIONS.find((p) => p.problemId === selectedProblemId) || MOCK_VISUALIZATIONS[0];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            SELECT BENCHMARK PROBLEM
          </span>
          <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
            {currentProblem.title} ({currentProblem.approachName})
          </div>
        </div>
      </div>

      <div className="relative w-full sm:w-auto min-w-[280px]">
        <label htmlFor="mock-problem-select" className="sr-only">
          Select Mock Visualization Problem
        </label>
        <select
          id="mock-problem-select"
          value={selectedProblemId}
          onChange={(e) => onSelectProblem(e.target.value)}
          className="w-full appearance-none px-3.5 py-2 pr-9 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] text-slate-900 dark:text-slate-100 font-mono text-xs font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400 dark:hover:border-blue-600 transition-all"
        >
          {MOCK_VISUALIZATIONS.map((prob) => {
            const vizLabel = VISUALIZATION_TYPE_LABELS[prob.visualizationType] || prob.visualizationType;
            return (
              <option key={prob.problemId} value={prob.problemId}>
                {prob.title} ({prob.approachName} • {vizLabel})
              </option>
            );
          })}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}
