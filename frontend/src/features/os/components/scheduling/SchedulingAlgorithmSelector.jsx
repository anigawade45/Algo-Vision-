import React from 'react';
import { Cpu } from 'lucide-react';

export default function SchedulingAlgorithmSelector({ selected, onChange }) {
  const algorithms = [
    { id: 'FCFS', name: 'First Come, First Served (FCFS)', description: 'Processes are dispatched according to their arrival time.', enabled: true },
    { id: 'SJF', name: 'Shortest Job First (SJF)', description: 'Selects the process with the shortest burst time.', enabled: false },
    { id: 'SRTF', name: 'Shortest Remaining Time First (SRTF)', description: 'Preemptive version of SJF.', enabled: false },
    { id: 'Priority', name: 'Priority Scheduling', description: 'Executes processes based on priority levels.', enabled: false },
    { id: 'RR', name: 'Round Robin (RR)', description: 'Cycles processes using a fixed time quantum.', enabled: false }
  ];

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-3">
        <Cpu className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Select Algorithm</h3>
      </div>
      <div className="space-y-2">
        {algorithms.map((algo) => (
          <button
            key={algo.id}
            disabled={!algo.enabled}
            onClick={() => algo.enabled && onChange(algo.id)}
            className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between relative overflow-hidden ${
              algo.enabled
                ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/40 text-blue-700 dark:text-blue-400 font-medium cursor-pointer shadow-sm shadow-blue-500/5'
                : 'bg-slate-50/50 dark:bg-[#080B13]/30 border-slate-100 dark:border-[#1E2638]/50 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <div className="space-y-0.5 pr-4">
              <span className="text-xs font-bold block">{algo.name}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                {algo.description}
              </span>
            </div>
            {!algo.enabled && (
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2638] text-slate-500 dark:text-slate-400 text-[9px] font-bold tracking-wider shrink-0 uppercase">
                Soon
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
