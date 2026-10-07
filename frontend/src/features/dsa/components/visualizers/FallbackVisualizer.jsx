import React from 'react';
import { Eye, Box, Activity, Cpu, Terminal } from 'lucide-react';
import { VISUALIZATION_TYPE_LABELS } from '../../data/visualizationTypes';

export function FallbackVisualizer({ problem, step, state }) {
  const vizTypeLabel = VISUALIZATION_TYPE_LABELS[problem?.visualizationType] || problem?.visualizationType || 'Data Structure';
  const operation = step?.operation || 'initial';

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 dark:bg-[#070A12] border border-slate-200 dark:border-[#172033] min-h-[240px] flex flex-col justify-between gap-6 shadow-inner">
      {/* Top Status */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            UPCOMING VISUALIZER FAMILY
          </span>
        </div>

        <div className="px-3 py-1 rounded-lg bg-white dark:bg-[#111726] border border-slate-200 dark:border-[#222D45] font-bold text-amber-600 dark:text-amber-400">
          Phase 4 Fallback Placeholder
        </div>
      </div>

      {/* Main Body Notice */}
      <div className="text-center space-y-3 my-auto py-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-xs">
          <Box className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {vizTypeLabel} Visualizer
          </h4>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto font-sans">
            Dedicated <strong>{vizTypeLabel}</strong> rendering engine is scheduled for upcoming renderer phases. Step execution controller and state inspector below are fully active.
          </p>
        </div>

        {/* Current Active Operation */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-[#162032] text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Active Op: {operation}</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] flex items-center justify-between text-xs font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-500" />
          <span>State & step controller live. Selected problem remains fully functional.</span>
        </div>
        <span>{Object.keys(state || {}).length} State Keys</span>
      </div>
    </div>
  );
}
