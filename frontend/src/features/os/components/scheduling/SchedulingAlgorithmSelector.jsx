import React from 'react';
import { Cpu } from 'lucide-react';

export default function SchedulingAlgorithmSelector({ selected, onChange }) {
  const algorithms = [
    { id: 'FCFS', name: 'First Come, First Served (FCFS)', description: 'Processes are dispatched according to their arrival time.', enabled: true },
    { id: 'SJF', name: 'Shortest Job First (SJF)', description: 'Selects the process with the shortest burst time.', enabled: true },
    { id: 'SRTF', name: 'Shortest Remaining Time First (SRTF)', description: 'Preemptive version of SJF based on remaining time.', enabled: true },
    { id: 'Priority', name: 'Priority Scheduling', description: 'Executes processes based on priority levels.', enabled: true },
    { id: 'RR', name: 'Round Robin (RR)', description: 'Cycles processes using a fixed time quantum.', enabled: true },
    { id: 'MLQ', name: 'Multilevel Queue (MLQ)', description: 'Multi-level queues with Round Robin and FCFS.', enabled: true }
  ];

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-3">
        <Cpu className="w-5 h-5 text-blue-500" />
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Select Algorithm</h3>
      </div>
      <div className="space-y-2">
        {algorithms.map((algo) => {
          const isSelected = selected === algo.id;
          return (
            <button
              key={algo.id}
              disabled={!algo.enabled}
              onClick={() => algo.enabled && onChange(algo.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start justify-between relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500 text-blue-700 dark:text-blue-400 font-bold shadow-md shadow-blue-500/10 ring-1 ring-blue-500/50'
                  : 'bg-slate-50/50 dark:bg-[#080B13]/30 border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-blue-500/30'
              }`}
            >
              <div className="space-y-0.5 pr-4">
                <span className="text-xs font-bold block">{algo.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                  {algo.description}
                </span>
              </div>
              {isSelected && (
                <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[9px] font-bold tracking-wider shrink-0 uppercase">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
