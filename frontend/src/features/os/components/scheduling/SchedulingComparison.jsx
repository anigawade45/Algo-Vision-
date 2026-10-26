import { useState, useMemo } from 'react';
import { runSchedulingSimulation } from '../../utils/schedulingSimulations';
import GanttChart from './GanttChart';
import ProcessTable from './ProcessTable';
import { Award, ArrowRightLeft, Hourglass, Clock, Zap, Percent } from 'lucide-react';

export default function SchedulingComparison({ processes, timeQuantum }) {
  const [algoA, setAlgoA] = useState('FCFS');
  const [algoB, setAlgoB] = useState('RR');

  const algorithmsList = [
    { id: 'FCFS', name: 'First Come, First Served (FCFS)' },
    { id: 'SJF', name: 'Shortest Job First (SJF)' },
    { id: 'SRTF', name: 'Shortest Remaining Time First (SRTF)' },
    { id: 'Priority', name: 'Priority Scheduling' },
    { id: 'RR', name: 'Round Robin (RR)' },
    { id: 'MLQ', name: 'Multilevel Queue (MLQ)' }
  ];

  const resultA = useMemo(
    () => runSchedulingSimulation(algoA, processes, { quantum: timeQuantum }),
    [algoA, processes, timeQuantum]
  );
  const resultB = useMemo(
    () => runSchedulingSimulation(algoB, processes, { quantum: timeQuantum }),
    [algoB, processes, timeQuantum]
  );

  const metricsA = resultA.metrics;
  const metricsB = resultB.metrics;

  // Determine winner for metrics (lower is better for WT, TAT, RT; higher is better for CPU utilization)
  const getWinner = (valA, valB, lowerIsBetter = true) => {
    if (valA === valB) return 'TIE';
    if (lowerIsBetter) {
      return valA < valB ? 'A' : 'B';
    }
    return valA > valB ? 'A' : 'B';
  };

  const wtWinner = getWinner(metricsA.avgWaitingTime, metricsB.avgWaitingTime, true);
  const tatWinner = getWinner(metricsA.avgTurnaroundTime, metricsB.avgTurnaroundTime, true);
  const rtWinner = getWinner(metricsA.avgResponseTime, metricsB.avgResponseTime, true);
  const cpuWinner = getWinner(metricsA.cpuUtilization, metricsB.cpuUtilization, false);

  return (
    <div className="space-y-6">
      {/* Comparison Selector Card */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#1E2638] pb-3">
          <ArrowRightLeft className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Compare Scheduling Algorithms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Selector A */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <label className="text-xs font-bold text-blue-600 dark:text-[#3B82F6] font-mono block">
              ALGORITHM 1
            </label>
            <select
              value={algoA}
              onChange={(e) => setAlgoA(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#070A12] text-slate-800 dark:text-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {algorithmsList.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          {/* Selector B */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <label className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono block">
              ALGORITHM 2
            </label>
            <select
              value={algoB}
              onChange={(e) => setAlgoB(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#070A12] text-slate-800 dark:text-slate-200 text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {algorithmsList.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Avg Waiting Time */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Avg Waiting Time</span>
            <Hourglass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className={`p-2 rounded-lg border ${wtWinner === 'A' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoA}</div>
              <div>{metricsA.avgWaitingTime} ms</div>
            </div>
            <div className={`p-2 rounded-lg border ${wtWinner === 'B' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoB}</div>
              <div>{metricsB.avgWaitingTime} ms</div>
            </div>
          </div>
          {wtWinner !== 'TIE' && (
            <div className="text-[10px] text-center font-mono font-bold text-emerald-500 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span>{wtWinner === 'A' ? algoA : algoB} is faster</span>
            </div>
          )}
        </div>

        {/* Avg Turnaround Time */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Avg Turnaround</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className={`p-2 rounded-lg border ${tatWinner === 'A' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoA}</div>
              <div>{metricsA.avgTurnaroundTime} ms</div>
            </div>
            <div className={`p-2 rounded-lg border ${tatWinner === 'B' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoB}</div>
              <div>{metricsB.avgTurnaroundTime} ms</div>
            </div>
          </div>
          {tatWinner !== 'TIE' && (
            <div className="text-[10px] text-center font-mono font-bold text-emerald-500 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span>{tatWinner === 'A' ? algoA : algoB} is faster</span>
            </div>
          )}
        </div>

        {/* Avg Response Time */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Avg Response Time</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className={`p-2 rounded-lg border ${rtWinner === 'A' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoA}</div>
              <div>{metricsA.avgResponseTime} ms</div>
            </div>
            <div className={`p-2 rounded-lg border ${rtWinner === 'B' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoB}</div>
              <div>{metricsB.avgResponseTime} ms</div>
            </div>
          </div>
          {rtWinner !== 'TIE' && (
            <div className="text-[10px] text-center font-mono font-bold text-emerald-500 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span>{rtWinner === 'A' ? algoA : algoB} is faster</span>
            </div>
          )}
        </div>

        {/* CPU Utilization */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">CPU Utilization</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
            <div className={`p-2 rounded-lg border ${cpuWinner === 'A' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoA}</div>
              <div>{metricsA.cpuUtilization}%</div>
            </div>
            <div className={`p-2 rounded-lg border ${cpuWinner === 'B' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold' : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400'}`}>
              <div className="text-[9px] text-slate-400">{algoB}</div>
              <div>{metricsB.cpuUtilization}%</div>
            </div>
          </div>
          {cpuWinner !== 'TIE' && (
            <div className="text-[10px] text-center font-mono font-bold text-emerald-500 flex items-center justify-center gap-1">
              <Award className="w-3 h-3" />
              <span>{cpuWinner === 'A' ? algoA : algoB} higher</span>
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Gantt Charts */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-mono text-blue-500 uppercase tracking-wider">
            {algoA} Gantt Chart
          </h4>
          <GanttChart
            blocks={resultA.timeline.map(b => ({ ...b, isActive: false }))}
            totalTime={metricsA.totalTime}
          />
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold font-mono text-purple-500 uppercase tracking-wider">
            {algoB} Gantt Chart
          </h4>
          <GanttChart
            blocks={resultB.timeline.map(b => ({ ...b, isActive: false }))}
            totalTime={metricsB.totalTime}
          />
        </div>
      </div>

      {/* Side-by-Side Process Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-mono text-blue-500 uppercase tracking-wider">
            {algoA} Calculation Table
          </h4>
          <ProcessTable processes={resultA.processes} />
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold font-mono text-purple-500 uppercase tracking-wider">
            {algoB} Calculation Table
          </h4>
          <ProcessTable processes={resultB.processes} />
        </div>
      </div>
    </div>
  );
}
