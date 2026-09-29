import React from 'react';
import { PlayCircle, ArrowRight, Bookmark, History, Target, Clock } from 'lucide-react';

const ACTIVE_LEARNING_SESSION = {
  id: 'two-sum',
  title: 'Two Sum',
  pattern: 'Hashing · Recently analyzed',
  stagesCompleted: ['Understanding ✓', 'Pattern ✓', 'Algorithm →'],
};

const RECENT_PROBLEMS = [
  { title: 'Two Sum', category: 'Hashing' },
  { title: 'Koko Eating Bananas', category: 'Binary Search' },
  { title: 'Container With Most Water', category: 'Two Pointers' },
];

export function ContinueLearningStrip({ onContinueSession, onNavigateToSaved, onNavigateToHistory, onNavigateToPractice }) {
  return (
    <section className="space-y-8 font-sans border-t border-slate-200 dark:border-[#1E2638] pt-8 max-w-4xl mx-auto">
      
      {/* 1. CONTINUE LEARNING ACTIVE SESSION */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Continue Learning
        </span>

        <button
          type="button"
          onClick={onContinueSession}
          className="w-full text-left p-5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {ACTIVE_LEARNING_SESSION.title}
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {ACTIVE_LEARNING_SESSION.pattern}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] font-mono">
              {ACTIVE_LEARNING_SESSION.stagesCompleted.map((st) => (
                <span key={st} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 font-semibold">
                  {st}
                </span>
              ))}
            </div>
          </div>

          <span
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold group-hover:bg-blue-700 transition-colors shadow-xs shrink-0 self-end sm:self-center"
          >
            <span>Continue →</span>
          </span>
        </button>
      </div>

      {/* 2. RECENT PROBLEMS LIST */}
      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Recent Problems
        </span>

        <div className="flex overflow-x-auto sm:flex-wrap items-center gap-2 pb-1 sm:pb-0 max-w-full no-scrollbar">
          {RECENT_PROBLEMS.map((rp) => (
            <button
              key={rp.title}
              type="button"
              onClick={onContinueSession}
              className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-400 text-xs font-mono text-slate-700 dark:text-slate-300 transition-colors cursor-pointer min-h-10"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold">{rp.title}</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">({rp.category})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. DESTINATION NAVIGATION LINKS (Compact Rows on Mobile) */}
      <div className="border-t border-slate-200/80 dark:border-[#1E2638] pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <button
            type="button"
            onClick={onNavigateToSaved}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 p-3 sm:p-0 rounded-lg sm:rounded-none bg-white sm:bg-transparent dark:bg-[#0B101D] sm:dark:bg-transparent border sm:border-0 border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group min-h-11"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span className="font-semibold">Saved Problems</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onNavigateToHistory}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 p-3 sm:p-0 rounded-lg sm:rounded-none bg-white sm:bg-transparent dark:bg-[#0B101D] sm:dark:bg-transparent border sm:border-0 border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group min-h-11"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span className="font-semibold">Problem History</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onNavigateToPractice}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 p-3 sm:p-0 rounded-lg sm:rounded-none bg-white sm:bg-transparent dark:bg-[#0B101D] sm:dark:bg-transparent border sm:border-0 border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer group min-h-11"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span className="font-semibold">Pattern Practice</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </section>
  );
}

