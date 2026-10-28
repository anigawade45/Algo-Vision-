import React from 'react';
import { Play, Binary, ArrowRight } from 'lucide-react';

export function ContinueLearningCard({ continueData, onContinue }) {
  if (!continueData) {
    return null;
  }

  const {
    title,
    slug,
    category,
    difficulty,
    currentStage = 1,
    totalStages = 11,
    progress = 0,
    isCompleted,
  } = continueData;

  const difficultyColors = {
    Easy: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-700/40',
    Medium: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-700/40',
    Hard: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-700/40',
  };

  const badgeClass = difficultyColors[difficulty] || difficultyColors.Easy;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden font-sans group">
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
        {/* Left: Problem info */}
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-500/30">
              <Binary className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {isCompleted ? 'Problem Completed' : 'Continue Where You Left Off'}
            </span>
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70">
                {category}
              </span>
            )}
            {difficulty && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeClass}`}>
                {difficulty}
              </span>
            )}
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Stage {currentStage} of {totalStages} • {progress}% Completed
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-md pt-1">
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, progress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <button
            onClick={() => onContinue && onContinue(slug)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isCompleted ? 'Review Problem' : 'Resume Problem'}</span>
            <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
