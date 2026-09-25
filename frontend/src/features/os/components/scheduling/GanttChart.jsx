import React from 'react';
import { motion } from 'framer-motion';

export default function GanttChart({ blocks, totalTime }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider text-slate-400">
          Gantt Chart
        </h3>
        <div className="h-16 rounded-xl border border-dashed border-slate-200 dark:border-[#1E2638] flex items-center justify-center text-xs font-mono text-slate-400 dark:text-slate-500">
          Gantt Chart is empty
        </div>
      </div>
    );
  }

  // Find colors for process blocks. Let's make a set of nice curated colors
  const getProcessColor = (id, isIdle, isActive) => {
    if (isIdle) {
      return isActive
        ? 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-400/50'
        : 'bg-slate-100 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-[#1E2638]/50';
    }

    // Curated color map for processes P1, P2, P3, P4...
    const colors = {
      P1: {
        bg: isActive ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.35)]' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/35',
      },
      P2: {
        bg: isActive ? 'bg-cyan-500 text-white border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.35)]' : 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/35',
      },
      P3: {
        bg: isActive ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.35)]' : 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/35',
      },
      P4: {
        bg: isActive ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.35)]' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/35',
      },
      P5: {
        bg: isActive ? 'bg-amber-500 text-white border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/35',
      }
    };

    // Default color fallback
    const idKey = id in colors ? id : 'P1';
    return colors[idKey].bg;
  };

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider text-slate-400">
        Gantt Chart (Time Proportional)
      </h3>

      <div className="relative pt-2 pb-6">
        {/* Chart Bar */}
        <div className="flex w-full h-12 rounded-xl border border-slate-200 dark:border-[#1C2638] bg-slate-50 dark:bg-[#070A12] overflow-hidden select-none">
          {blocks.map((block, idx) => {
            const duration = block.end - block.start;
            const pctWidth = totalTime > 0 ? (duration / totalTime) * 100 : 0;
            const bgClass = getProcessColor(block.processId, block.isIdle, block.isActive);

            return (
              <motion.div
                key={`${block.processId}-${idx}`}
                layout
                style={{ width: `${pctWidth}%` }}
                className={`h-full border-r border-slate-200 dark:border-[#1C2638] last:border-r-0 flex items-center justify-center font-mono font-bold text-xs transition-colors duration-200 ${bgClass}`}
              >
                <span>{block.processId}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Time Indicators underneath */}
        <div className="absolute w-full flex text-[10px] font-mono font-bold text-slate-400 dark:text-slate-600 mt-1 pointer-events-none">
          {/* Start 0 label */}
          <div className="absolute left-0 -translate-x-1/2">0</div>
          
          {blocks.map((block, idx) => {
            const pctEndPosition = totalTime > 0 ? (block.end / totalTime) * 100 : 0;
            return (
              <div
                key={`label-${idx}`}
                style={{ left: `${pctEndPosition}%` }}
                className="absolute -translate-x-1/2"
              >
                {block.end}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
