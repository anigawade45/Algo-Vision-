import React from 'react';
import { ArrowRight, BookOpen, Clock, Layers, PlayCircle } from 'lucide-react';

export function ContinueLearning({ onContinue }) {
  const learningSessions = [
    {
      id: 'binary-search',
      title: 'Binary Search',
      pattern: 'Logarithmic Division',
      currentStep: 6,
      totalSteps: 9,
      progressPercent: 66,
      estTimeLeft: '4 mins left',
      completedSteps: ['Problem Statement', 'Inputs & Bounds', 'Analogy', 'Pattern Detection', 'Pseudocode'],
      nextStep: 'Step 6: Interactive Dry Run',
    },
    {
      id: 'sliding-window',
      title: 'Sliding Window',
      pattern: 'Contiguous Subarray',
      currentStep: 3,
      totalSteps: 9,
      progressPercent: 33,
      estTimeLeft: '8 mins left',
      completedSteps: ['Problem Statement', 'Inputs & Bounds'],
      nextStep: 'Step 3: Real-World Analogy',
    },
  ];

  return (
    <section className="space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Continue Learning</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pick up right where you left off in active problem dissection sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learningSessions.map((item) => (
          <div
            key={item.id}
            onClick={() => onContinue && onContinue(item)}
            className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 rounded-xl space-y-4 shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-slate-500">
                    Pattern: <strong className="text-slate-700 dark:text-slate-300">{item.pattern}</strong>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 block">
                    Step {item.currentStep} of {item.totalSteps}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{item.estTimeLeft}</span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>Progress</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{item.progressPercent}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-[#05070E] rounded-full overflow-hidden border border-slate-200/80 dark:border-[#1E2638]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Next Step Badge */}
              <div className="bg-slate-50 dark:bg-[#05070E] p-2.5 rounded-lg border border-slate-200/80 dark:border-[#1E2638] text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Next: <strong className="text-slate-800 dark:text-slate-200">{item.nextStep}</strong></span>
                <PlayCircle className="w-3.5 h-3.5 text-blue-500" />
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 flex justify-end">
              <button
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs gap-1.5 transition-all shadow-sm group-hover:shadow-md group-hover:shadow-blue-500/20"
              >
                <span>Continue Workspace</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
