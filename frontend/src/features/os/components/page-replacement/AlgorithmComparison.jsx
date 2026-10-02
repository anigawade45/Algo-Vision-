import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  BarChart2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  parseReferenceString,
  simulateFIFO,
  simulateLRU,
  simulateOptimal,
  simulateSecondChance
} from '../../utils/pageReplacementAlgorithms';

export default function AlgorithmComparison() {
  const [refInput, setRefInput] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2');
  const [frameCount, setFrameCount] = useState(3);
  const [validationError, setValidationError] = useState('');

  const parsed = parseReferenceString(refInput);
  const isValid = parsed.length > 0 && frameCount >= 1 && frameCount <= 10;

  let fifoSim = null;
  let lruSim = null;
  let optSim = null;
  let scSim = null;

  if (isValid) {
    fifoSim = simulateFIFO(parsed, frameCount);
    lruSim = simulateLRU(parsed, frameCount);
    optSim = simulateOptimal(parsed, frameCount);
    scSim = simulateSecondChance(parsed, frameCount);
  }

  const results = [
    { name: 'FIFO', sim: fifoSim, color: 'text-blue-500', bg: 'bg-blue-500' },
    { name: 'LRU', sim: lruSim, color: 'text-purple-500', bg: 'bg-purple-500' },
    { name: 'Optimal', sim: optSim, color: 'text-amber-500', bg: 'bg-amber-500' },
    { name: 'Second Chance', sim: scSim, color: 'text-emerald-500', bg: 'bg-emerald-500' }
  ];

  // Find max faults to scale visual progress bars
  const maxFaults = isValid
    ? Math.max(fifoSim.faults, lruSim.faults, optSim.faults, scSim.faults, 1)
    : 1;

  return (
    <div className="space-y-8">
      {/* Inputs Header */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-500" /> Multi-Algorithm Comparison Laboratory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run the exact same reference sequence through FIFO, LRU, Optimal, and Second Chance simultaneously.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Reference String
            </label>
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Frame Count
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={frameCount}
              onChange={(e) => setFrameCount(parseInt(e.target.value, 10) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {isValid && fifoSim && (
        <div className="space-y-8">
          {/* Comparative Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((res) => {
              const total = res.sim.total;
              const hits = res.sim.hits;
              const faults = res.sim.faults;
              const hitRatio = ((hits / total) * 100).toFixed(1);
              const faultRate = ((faults / total) * 100).toFixed(1);

              return (
                <div
                  key={res.name}
                  className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-mono font-bold ${res.color}`}>{res.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {total} Ref Steps
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Page Faults</span>
                      <span className="text-lg font-bold text-rose-600 dark:text-rose-400">{faults}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Page Hits</span>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{hits}</span>
                    </div>
                  </div>

                  {/* Fault Rate Visual Bar */}
                  <div className="space-y-1 text-xs font-mono">
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>Hit Ratio: {hitRatio}%</span>
                      <span>Fault Rate: {faultRate}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                      <div className="h-full bg-emerald-500" style={{ width: `${hitRatio}%` }} />
                      <div className="h-full bg-rose-500" style={{ width: `${faultRate}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Comparative Fault Bar Chart Visualization */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-cyan-500" /> Relative Page Fault Comparison
            </h4>

            <div className="space-y-4 pt-2 font-mono text-xs">
              {results.map((res) => {
                const faultPct = ((res.sim.faults / maxFaults) * 100).toFixed(1);
                return (
                  <div key={res.name} className="space-y-1.5">
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 font-bold">
                      <span>{res.name}</span>
                      <span>
                        {res.sim.faults} Faults ({res.sim.hits} Hits)
                      </span>
                    </div>
                    <div className="w-full h-5 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-0.5 overflow-hidden flex">
                      <div
                        className={`h-full rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-bold ${res.bg}`}
                        style={{ width: `${Math.max(faultPct, 12)}%` }}
                      >
                        {res.sim.faults}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side-by-Side Step Comparison Matrix Table */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-500" /> Side-by-Side Step Execution Comparison Matrix
            </h4>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 dark:bg-[#070A12] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase">
                  <tr>
                    <th className="px-3 py-3">Step #</th>
                    <th className="px-3 py-3">Page</th>
                    <th className="px-3 py-3">FIFO Frames</th>
                    <th className="px-3 py-3">LRU Frames</th>
                    <th className="px-3 py-3">Optimal Frames</th>
                    <th className="px-3 py-3">Second Chance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {parsed.map((pg, sIdx) => {
                    const fifoStep = fifoSim.steps[sIdx];
                    const lruStep = lruSim.steps[sIdx];
                    const optStep = optSim.steps[sIdx];
                    const scStep = scSim.steps[sIdx];

                    return (
                      <tr key={sIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="px-3 py-2.5 font-bold text-slate-400">#{sIdx + 1}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">#{pg}</td>

                        {/* FIFO Cell */}
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-600 dark:text-slate-300 font-bold">
                              [{fifoStep.frames.map((f) => (f !== null ? f : '-')).join(', ')}]
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                fifoStep.result === 'HIT'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {fifoStep.result}
                            </span>
                          </div>
                        </td>

                        {/* LRU Cell */}
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-600 dark:text-slate-300 font-bold">
                              [{lruStep.frames.map((f) => (f !== null ? f : '-')).join(', ')}]
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                lruStep.result === 'HIT'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {lruStep.result}
                            </span>
                          </div>
                        </td>

                        {/* Optimal Cell */}
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-600 dark:text-slate-300 font-bold">
                              [{optStep.frames.map((f) => (f !== null ? f : '-')).join(', ')}]
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                optStep.result === 'HIT'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {optStep.result}
                            </span>
                          </div>
                        </td>

                        {/* Second Chance Cell */}
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-600 dark:text-slate-300 font-bold">
                              [{scStep.frames.map((f) => (f !== null ? f : '-')).join(', ')}]
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                scStep.result === 'HIT'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                              }`}
                            >
                              {scStep.result}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
