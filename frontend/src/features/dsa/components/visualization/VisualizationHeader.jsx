import React from 'react';
import { Eye, FileText, Box, Layers } from 'lucide-react';
import { VISUALIZATION_TYPE_LABELS } from '../../data/visualizationTypes';

export function VisualizationHeader({ problem, onOpenSpec }) {
  if (!problem) return null;

  const vizTypeLabel = VISUALIZATION_TYPE_LABELS[problem.visualizationType] || problem.visualizationType;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Left Title & Meta Badges */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <Eye className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Stage 09 • Visualize
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
              {problem.category}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
                  : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            {problem.title}
          </h2>
        </div>
      </div>

      {/* Right Badges & Spec Action */}
      <div className="flex items-center gap-2.5">
        <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold flex items-center gap-1.5">
          <Box className="w-3.5 h-3.5 text-blue-500" />
          <span>{vizTypeLabel}</span>
        </div>

        {onOpenSpec && (
          <button
            type="button"
            onClick={onOpenSpec}
            className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-mono font-bold cursor-pointer border border-blue-200 dark:border-blue-900/50 transition-all flex items-center gap-1.5 focus:outline-none"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Spec</span>
          </button>
        )}
      </div>
    </div>
  );
}
