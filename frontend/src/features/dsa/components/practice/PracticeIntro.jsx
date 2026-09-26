import React from 'react';
import { Target, Grid, Workflow } from 'lucide-react';

/**
 * PRACTICE INTRO
 * Displays learned concept context banner.
 */
export function PracticeIntro({ intro, sectionNo = '01' }) {
  if (!intro) return null;
  const { context } = intro;
  if (!context) return null;

  return (
    <section aria-labelledby="practice-intro-heading" className="space-y-3.5 font-sans">
      {/* Section Header */}
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>{sectionNo}</span>
        <span aria-hidden="true">•</span>
        <h2 id="practice-intro-heading" className="inline text-[11px] sm:text-xs font-mono font-bold">
          LEARNED CONCEPT CONTEXT
        </h2>
      </div>

      {/* Problem Context Banner Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4">
        <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
          You've completed the guided walkthrough for this problem. Now apply the same core concept independently across related problems and variations.
        </p>

        {/* Open 3-Column Metadata Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              PROBLEM
            </span>
            <div className="text-sm sm:text-base font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Target className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
              <span>{context.problemTitle}</span>
            </div>
          </div>

          <div className="space-y-1 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              PATTERN
            </span>
            <div className="text-sm sm:text-base font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Grid className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>{context.patternName}</span>
            </div>
          </div>

          <div className="space-y-1 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              APPROACH
            </span>
            <div className="text-sm sm:text-base font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <Workflow className="w-4 h-4 text-purple-500 shrink-0" aria-hidden="true" />
              <span>{context.approachName}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PracticeIntro;
