import React from 'react';
import { ArrowRight, CheckCircle2, Circle, Bookmark, History, Target } from 'lucide-react';

const TIMELINE_GROUPS = [
  {
    period: 'Today',
    items: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        pattern: 'Hashing',
        stages: [
          { label: 'Understanding', done: true },
          { label: 'Pattern', done: true },
          { label: 'Algorithm', done: true },
          { label: 'Visualize', done: false },
        ]
      }
    ]
  },
  {
    period: 'Yesterday',
    items: [
      {
        id: 'koko-eating-bananas',
        title: 'Koko Eating Bananas',
        pattern: 'Binary Search on Answer',
        stages: [
          { label: 'Understanding', done: true },
          { label: 'Pattern', done: true },
          { label: 'Algorithm', done: true },
          { label: 'Visualize', done: true },
        ]
      }
    ]
  },
  {
    period: '3 days ago',
    items: [
      {
        id: 'container-water',
        title: 'Container With Most Water',
        pattern: 'Two Pointers',
        stages: [
          { label: 'Understanding', done: true },
          { label: 'Pattern', done: true },
          { label: 'Algorithm', done: false },
          { label: 'Visualize', done: false },
        ]
      }
    ]
  }
];

export function LearningTimelineSection({ onSelectProblem, onNavigateToSaved, onNavigateToHistory, onNavigateToPractice }) {
  return (
    <section className="space-y-8 font-sans border-t border-slate-200 dark:border-[#1E2638] pt-8">
      
      {/* 1. RECENT LEARNING TIMELINE */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Learning Timeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Problems you&apos;ve brought to AlgoVision and your active breakdown stage status.
          </p>
        </div>

        {/* Timeline Flow */}
        <div className="relative pl-4 sm:pl-6 space-y-6 border-l-2 border-slate-200 dark:border-[#1E2638] ml-2">
          {TIMELINE_GROUPS.map((group) => (
            <div key={group.period} className="relative space-y-3">
              
              {/* Timeline Period Dot & Label */}
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white dark:border-[#05070E] -left-5.75 sm:-left-7.75 absolute" aria-hidden="true" />
                <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {group.period}
                </span>
              </div>

              {/* Items under period */}
              <div className="space-y-2">
                {group.items.map((prob) => (
                  <div
                    key={prob.id}
                    onClick={() => onSelectProblem && onSelectProblem(prob)}
                    className="p-4 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {prob.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#05070E] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1C2638]">
                          {prob.pattern}
                        </span>
                      </div>

                      {/* Stage Completion Indicators */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                        {prob.stages.map((st) => (
                          <span
                            key={st.label}
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${
                              st.done
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-bold'
                                : 'bg-slate-50 dark:bg-[#05070E] text-slate-400 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            {st.done ? (
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" aria-hidden="true" />
                            ) : (
                              <Circle className="w-2.5 h-2.5 text-slate-400" aria-hidden="true" />
                            )}
                            <span>{st.label}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform shrink-0 self-end sm:self-center">
                      <span>Continue</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 2. YOUR LIBRARY (COMPACT HORIZONTAL COMMAND STRIP) */}
      <div className="space-y-3 pt-2">
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Your Library Nav
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onNavigateToSaved}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between font-mono text-xs text-slate-800 dark:text-slate-200 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="font-bold">Saved Problems</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onNavigateToHistory}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between font-mono text-xs text-slate-800 dark:text-slate-200 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="font-bold">Problem History</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onNavigateToPractice}
            className="p-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] hover:border-blue-500/50 transition-all cursor-pointer group flex items-center justify-between font-mono text-xs text-slate-800 dark:text-slate-200 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="font-bold">Pattern Practice</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

    </section>
  );
}
