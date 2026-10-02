import React, { useState } from 'react';
import {
  Sliders,
  BarChart2,
  Disc,
  Layers,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  parseRequestQueue,
  simulateFCFS,
  simulateSSTF,
  simulateSCAN,
  simulateCSCAN,
  simulateLOOK,
  simulateCLOOK
} from '../../utils/diskSchedulingAlgorithms';

export default function DiskComparison() {
  const [reqInput, setReqInput] = useState('98, 183, 37, 122, 14, 124, 65, 67');
  const [headInput, setHeadInput] = useState(53);
  const [diskMin, setDiskMin] = useState(0);
  const [diskMax, setDiskMax] = useState(199);
  const [direction, setDirection] = useState('up');

  const { requests, error } = parseRequestQueue(reqInput, diskMin, diskMax);
  const isValid = !error && requests.length > 0 && headInput >= diskMin && headInput <= diskMax;

  let fcfsSim = null;
  let sstfSim = null;
  let scanSim = null;
  let cscanSim = null;
  let lookSim = null;
  let clookSim = null;

  if (isValid) {
    fcfsSim = simulateFCFS(requests, headInput, diskMin, diskMax);
    sstfSim = simulateSSTF(requests, headInput, diskMin, diskMax, direction);
    scanSim = simulateSCAN(requests, headInput, diskMin, diskMax, direction);
    cscanSim = simulateCSCAN(requests, headInput, diskMin, diskMax, direction);
    lookSim = simulateLOOK(requests, headInput, diskMin, diskMax, direction);
    clookSim = simulateCLOOK(requests, headInput, diskMin, diskMax, direction);
  }

  const results = [
    { name: 'FCFS', sim: fcfsSim, color: 'text-blue-500', bg: 'bg-blue-500' },
    { name: 'SSTF', sim: sstfSim, color: 'text-purple-500', bg: 'bg-purple-500' },
    { name: 'SCAN', sim: scanSim, color: 'text-amber-500', bg: 'bg-amber-500' },
    { name: 'C-SCAN', sim: cscanSim, color: 'text-cyan-500', bg: 'bg-cyan-500' },
    { name: 'LOOK', sim: lookSim, color: 'text-emerald-500', bg: 'bg-emerald-500' },
    { name: 'C-LOOK', sim: clookSim, color: 'text-indigo-500', bg: 'bg-indigo-500' }
  ];

  const maxMovement = isValid
    ? Math.max(...results.map(r => r.sim?.totalMovement || 1))
    : 1;

  return (
    <div className="space-y-8">
      {/* Configuration Section */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-500" /> Multi-Algorithm Benchmark Laboratory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run all 6 disk scheduling policies simultaneously on identical request sequences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Request Queue
            </label>
            <input
              type="text"
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Initial Head
            </label>
            <input
              type="number"
              value={headInput}
              onChange={(e) => setHeadInput(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Track Range
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={diskMin}
                onChange={(e) => setDiskMin(parseInt(e.target.value, 10) || 0)}
                className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-xs text-center"
              />
              <span className="text-slate-400 font-mono text-xs">-</span>
              <input
                type="number"
                value={diskMax}
                onChange={(e) => setDiskMax(parseInt(e.target.value, 10) || 199)}
                className="w-1/2 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-white font-mono text-xs text-center"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
              Initial Direction
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setDirection('up')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                  direction === 'up'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" /> Upward
              </button>
              <button
                onClick={() => setDirection('down')}
                className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 ${
                  direction === 'down'
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <TrendingDown className="w-3.5 h-3.5" /> Downward
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {isValid && fcfsSim && (
        <div className="space-y-8">
          {/* Comparative Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((res) => {
              const total = res.sim.totalMovement;
              const avg = res.sim.averageMovement.toFixed(1);
              const seqStr = res.sim.servicedSequence.join(', ');

              return (
                <div
                  key={res.name}
                  className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-mono font-bold ${res.color}`}>{res.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {res.sim.servicedSequence.length} Reqs
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block uppercase">Total Seek</span>
                      <span className="text-xl font-extrabold text-cyan-600 dark:text-cyan-400">{total}</span>
                      <span className="text-[9px] text-slate-400 block">tracks</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-400 block uppercase">Avg Seek</span>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">{avg}</span>
                      <span className="text-[9px] text-slate-400 block">tracks/req</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">Serviced Sequence:</span>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 truncate bg-slate-50 dark:bg-[#070A12] p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                      {seqStr}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Head Movement Bar Chart Visualizer */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-cyan-500" /> Relative Total Seek Distance Comparison
            </h4>

            <div className="space-y-4 pt-2 font-mono text-xs">
              {results.map((res) => {
                const pct = ((res.sim.totalMovement / maxMovement) * 100).toFixed(1);
                return (
                  <div key={res.name} className="space-y-1.5">
                    <div className="flex justify-between text-slate-700 dark:text-slate-300 font-bold">
                      <span>{res.name}</span>
                      <span>
                        {res.sim.totalMovement} Tracks Seek Distance (Avg: {res.sim.averageMovement.toFixed(1)})
                      </span>
                    </div>
                    <div className="w-full h-5 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-0.5 overflow-hidden flex">
                      <div
                        className={`h-full rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-bold ${res.bg}`}
                        style={{ width: `${Math.max(pct, 10)}%` }}
                      >
                        {res.sim.totalMovement}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
