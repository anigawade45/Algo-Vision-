import React from 'react';

export default function ProcessTable({ processes, activeStepProcessStates }) {
  // Check if a process is completed at the current step
  const getRowClass = (pId) => {
    if (!activeStepProcessStates) return '';
    const state = activeStepProcessStates[pId];
    if (state === 'COMPLETED') {
      return 'bg-emerald-500/5 text-emerald-950 dark:text-emerald-300 font-medium';
    } else if (state === 'RUNNING') {
      return 'bg-blue-500/5 text-blue-900 dark:text-blue-300 font-bold';
    } else if (state === 'READY') {
      return 'bg-slate-100/50 dark:bg-slate-800/10 text-slate-800 dark:text-slate-300';
    }
    return 'opacity-40 text-slate-400';
  };

  const formatVal = (val, pId) => {
    // If we have step states, only show calculated values if the process is completed or started
    if (activeStepProcessStates) {
      const state = activeStepProcessStates[pId];
      if (state !== 'COMPLETED' && val !== undefined) {
        // If it hasn't finished, don't show result metrics yet
        return '-';
      }
    }
    return val !== -1 ? val : '-';
  };

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-3">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs font-mono uppercase tracking-wider text-slate-400">
        Calculation Table
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs select-none">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1E2638] text-slate-500 font-semibold">
              <th className="py-3 px-3 font-mono">Process</th>
              <th className="py-3 px-3 font-mono">Arrival (AT)</th>
              <th className="py-3 px-3 font-mono">Burst (BT)</th>
              <th className="py-3 px-3 font-mono">Start (ST)</th>
              <th className="py-3 px-3 font-mono">Completion (CT)</th>
              <th className="py-3 px-3 font-mono">Turnaround (TAT)</th>
              <th className="py-3 px-3 font-mono">Waiting (WT)</th>
              <th className="py-3 px-3 font-mono">Response (RT)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1E2638]/50">
            {processes.map((proc) => {
              const rowClass = getRowClass(proc.id);
              const hasStarted = activeStepProcessStates ? activeStepProcessStates[proc.id] !== 'NOT_ARRIVED' : true;

              return (
                <tr key={proc.id} className={`transition-colors duration-200 ${rowClass}`}>
                  <td className="py-3 px-3 font-mono font-bold">{proc.id}</td>
                  <td className="py-3 px-3 font-mono">{proc.arrivalTime}</td>
                  <td className="py-3 px-3 font-mono">{proc.burstTime}</td>
                  <td className="py-3 px-3 font-mono">
                    {hasStarted ? formatVal(proc.startTime, proc.id) : '-'}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {formatVal(proc.completionTime, proc.id)}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    {formatVal(proc.turnaroundTime, proc.id)}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    {formatVal(proc.waitingTime, proc.id)}
                  </td>
                  <td className="py-3 px-3 font-mono font-semibold">
                    {formatVal(proc.responseTime, proc.id)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend helper */}
      <div className="flex flex-wrap gap-4 text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-[#1E2638]/50">
        <span><strong>TAT</strong> = CT - AT</span>
        <span><strong>WT</strong> = TAT - BT</span>
        <span><strong>RT</strong> = ST - AT</span>
        <span><strong>For FCFS</strong>: WT = RT</span>
      </div>
    </div>
  );
}
