import React from 'react';
import { Check, X, Sparkles, Zap, Eye, Code, Brain } from 'lucide-react';

export function DifferentiatorSection() {
  const comparisonMatrix = [
    {
      feature: 'Concept Learning',
      traditional: 'Static textbook & static slides',
      algoVision: 'AI-guided interactive breakdown',
      icon: Brain,
    },
    {
      feature: 'Algorithm Execution',
      traditional: 'Dry-running code on paper',
      algoVision: 'Real-time state & memory visualization',
      icon: Eye,
    },
    {
      feature: 'Code Synchronization',
      traditional: 'Reading fixed pseudocode line by line',
      algoVision: 'Synchronized live code & pointer highlights',
      icon: Code,
    },
    {
      feature: 'Problem Solving Feedback',
      traditional: 'Final test case pass/fail result only',
      algoVision: 'Step-by-step intuition & AI hints',
      icon: Zap,
    },
  ];

  return (
    <section id="differentiator" className="py-20 bg-white dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>THE ALGO VISION DIFFERENCE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            More than a course.{' '}
            <span className="text-blue-600 dark:text-[#3B82F6]">More than a coding platform.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            AlgoVision shifts Computer Science education from passive memorization to active, visual understanding.
          </p>
        </div>

        {/* DETAILED FEATURE COMPARISON MATRIX TABLE */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl overflow-hidden shadow-lg transition-colors">
          <div className="px-6 py-4 bg-slate-100 dark:bg-[#070A12] border-b border-slate-200 dark:border-[#1E2638] flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Feature-by-Feature Matrix
            </h4>
            <span className="text-xs text-slate-500 font-mono">AlgoVision vs Traditional</span>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {comparisonMatrix.map((row, idx) => {
              const Icon = row.icon;
              return (
                <div key={idx} className="p-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                  <div className="md:col-span-4 flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
                    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>{row.feature}</span>
                  </div>

                  <div className="md:col-span-4 text-slate-600 dark:text-slate-400 flex items-center gap-2 font-mono">
                    <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{row.traditional}</span>
                  </div>

                  <div className="md:col-span-4 text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-2 font-mono bg-blue-50 dark:bg-blue-500/10 p-2 rounded-lg border border-blue-200 dark:border-blue-500/30">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{row.algoVision}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Emphasized Quote Banner */}
        <div className="mt-10 text-center max-w-2xl mx-auto">
          <p className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-300 italic">
            "AlgoVision focuses on understanding the internal execution process — not just memorizing the final answer."
          </p>
        </div>

      </div>
    </section>
  );
}
