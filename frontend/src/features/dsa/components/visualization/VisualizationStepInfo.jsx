import React from 'react';
import { Cpu, HelpCircle, Zap } from 'lucide-react';

/**
 * VisualizationStepInfo — Stage 09 Execution Info Section
 * Displays Current Operation and Explanation ("Why Did This Happen?") side-by-side in a compact two-column layout.
 */
export function VisualizationStepInfo({ currentStep, stepNumber, totalSteps }) {
  if (!currentStep) return null;

  const { operation, description, changed } = currentStep;

  // Format operation identifier (e.g. "calculate_complement" -> "Calculate Complement")
  const formatOperationName = (opStr) => {
    if (!opStr) return 'Execution Step';
    return opStr
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Current Operation & Mutated State Keys */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111726]/60 border border-slate-200/80 dark:border-[#1E2638] gap-2">
          <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-[#1D273D] pb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                CURRENT OPERATION
              </span>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-[#1D273D] text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
              Step {stepNumber} / {totalSteps}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white my-0.5">
            {formatOperationName(operation)}
          </h4>

          {/* Changed State Properties List */}
          {Array.isArray(changed) && changed.length > 0 ? (
            <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono pt-1">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                <Zap className="w-3 h-3" />
                Mutated:
              </span>
              {changed.map((propKey) => (
                <span
                  key={propKey}
                  className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 text-[10px] font-mono font-semibold"
                >
                  {propKey}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[11px] font-mono text-slate-400 italic">No state mutation</span>
          )}
        </div>

        {/* Right Column: Why Did This Happen? / Description Explanation */}
        <div className="flex flex-col justify-between p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 gap-2">
          <div className="flex items-center gap-2 border-b border-blue-100 dark:border-blue-900/40 pb-2">
            <div className="w-6 h-6 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              WHY DID THIS HAPPEN?
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans my-auto">
            {description || 'Performing algorithm step snapshot update.'}
          </p>
        </div>
      </div>
    </div>
  );
}
