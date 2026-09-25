import React from 'react';
import { Play, Clock, Sparkles, Binary, CheckCircle, ArrowRight } from 'lucide-react';
import { continueLearningData } from '../data/mockDashboardData';

export function ContinueLearningCard({ onContinue }) {
  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden font-sans group">
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left: Topic info & state */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-500/30">
              <Binary className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {continueLearningData.module}
            </span>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              In Progress
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {continueLearningData.estimatedTimeLeft}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {continueLearningData.topic}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
              <span className="font-medium text-slate-800 dark:text-slate-300">
                Last Activity:
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono">
                {continueLearningData.lastActivity}
              </span>
            </p>
          </div>

          {/* Progress Bar & Steps indicator */}
          <div className="space-y-2 pt-1 max-w-xl">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600 dark:text-slate-400">
                Step <strong className="text-slate-900 dark:text-white">{continueLearningData.completedSteps}</strong> of {continueLearningData.totalSteps} (N-Queens Search Tree)
              </span>
              <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                {continueLearningData.progress}%
              </span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-700/50">
              <div
                className="h-full bg-linear-to-r from-blue-600 via-indigo-600 to-indigo-500 rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${continueLearningData.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Interactive visual preview chip + Big Continue Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0E172A] border border-slate-200/70 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">solveNQueens(row=3)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">&rarr; 2 Valid</span>
          </div>

          <button
            onClick={() => onContinue && onContinue('dsa', 'Recursion & Backtracking')}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Continue Learning</span>
            <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
