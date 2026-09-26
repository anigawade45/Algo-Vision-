import React from 'react';
import { ExternalLink, Sparkles, BookOpen } from 'lucide-react';

/**
 * CONTINUE PRACTICING
 * Displays exactly 2 curated external problem recommendation cards on real coding platforms
 * (LeetCode, HackerRank, GeeksforGeeks, etc.), with educational reasoning and external link semantics.
 */
export function RecommendedProblems({ recommendations, sectionNo = '08' }) {
  if (!recommendations || !recommendations.length) return null;

  return (
    <section aria-labelledby="recommended-problems-heading" className="space-y-4 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-teal-600 dark:text-teal-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="recommended-problems-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          CONTINUE PRACTICING ON REAL PLATFORMS
        </h2>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
        AlgoVision taught the core concept and verified your understanding. Now reinforce your reasoning on these 2 recommended external coding problems:
      </p>

      {/* 2 External Recommendation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.slice(0, 2).map((rec) => {
          const platformName = rec.platform?.name || 'Coding Platform';
          const difficultyColor =
            rec.difficulty === 'Easy'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : rec.difficulty === 'Hard'
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';

          return (
            <div
              key={rec.id || rec.title}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs flex flex-col justify-between space-y-4 transition-all duration-150 motion-reduce:transition-none hover:border-blue-300 dark:hover:border-blue-800"
            >
              <div className="space-y-3">
                {/* Header badges */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    <BookOpen className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                    <span>{platformName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${difficultyColor}`}>
                      {rec.difficulty}
                    </span>
                    {rec.relationshipLabel && (
                      <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-mono text-[10px] font-bold">
                        {rec.relationshipLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Problem Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>

                {/* Educational Reasoning */}
                {rec.reason && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" aria-hidden="true" /> WHY THIS PROBLEM?
                    </span>
                    <p>{rec.reason}</p>
                  </div>
                )}
              </div>

              {/* External Solve Link Button */}
              {rec.url && (
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-mono text-xs font-bold transition-all duration-150 motion-reduce:transition-none flex items-center justify-center gap-2 cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span>Solve on {platformName}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default RecommendedProblems;
