import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  DollarSign, 
  Maximize2, 
  Wrench, 
  Zap, 
  HelpCircle,
  GitCompare
} from 'lucide-react';
import { NETWORK_TOPOLOGIES_DATA } from '../../data/fundamentalsData';

export function TopologyComparison({ onCompleteStep, isCompleted }) {
  const [topoAId, setTopoAId] = useState('star');
  const [topoBId, setTopoBId] = useState('mesh');

  const topoA = NETWORK_TOPOLOGIES_DATA[topoAId];
  const topoB = NETWORK_TOPOLOGIES_DATA[topoBId];

  const metrics = [
    { label: 'Reliability / Fault Tolerance', key: 'reliabilityScore', icon: ShieldCheck, color: 'emerald' },
    { label: 'Cost Effectiveness (Higher = Cheaper)', key: 'costScore', icon: DollarSign, color: 'amber' },
    { label: 'Scalability / Expansion Ease', key: 'scalabilityScore', icon: Maximize2, color: 'blue' },
    { label: 'Troubleshooting & Maintenance', key: 'troubleshootingScore', icon: Wrench, color: 'purple' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Side-by-Side Comparer Header */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-mono font-semibold mb-1">
              <Scale className="w-3 h-3 text-purple-500" />
              <span>DECISION MATRIX & TRADEOFF ANALYSIS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Topology Comparison & Architect Selection
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluate real-world engineering tradeoffs between cabling costs, fault tolerance, installation complexity, and maximum node throughput.
            </p>
          </div>
        </div>

        {/* Dual Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638]">
          {/* Topology A Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
              Topology Option A:
            </label>
            <select
              value={topoAId}
              onChange={(e) => setTopoAId(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              {Object.values(NETWORK_TOPOLOGIES_DATA).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Topology B Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block font-mono">
              Topology Option B:
            </label>
            <select
              value={topoBId}
              onChange={(e) => setTopoBId(e.target.value)}
              className="w-full text-xs font-bold p-2.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            >
              {Object.values(NETWORK_TOPOLOGIES_DATA).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Metric Comparison Bars */}
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-500" />
            <span>Side-by-Side Metric Scores (0–100 Benchmark)</span>
          </h3>

          <div className="space-y-4">
            {metrics.map((metric, idx) => {
              const valA = topoA[metric.key];
              const valB = topoB[metric.key];

              return (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/60 dark:border-[#1E2638] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <metric.icon className="w-3.5 h-3.5 text-purple-500" />
                      {metric.label}
                    </span>
                    <div className="flex items-center gap-4 text-xs font-mono font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400">{topoA.name.split(' ')[0]}: {valA}%</span>
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <span className="text-blue-600 dark:text-blue-400">{topoB.name.split(' ')[0]}: {valB}%</span>
                    </div>
                  </div>

                  {/* Dual Bar */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${valA}%` }}
                      />
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${valB}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Verdict Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <h4 className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase">
              When to Choose {topoA.name}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {topoA.bestSuitedFor}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/60 space-y-2">
            <h4 className="text-xs font-bold font-mono text-blue-800 dark:text-blue-300 uppercase">
              When to Choose {topoB.name}
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {topoB.bestSuitedFor}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Full 6-Topology Master Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Master Topologies Comparison Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Topology</th>
                <th className="py-3 px-3">Cable Requirement</th>
                <th className="py-3 px-3">Single Point Failure</th>
                <th className="py-3 px-3">Collisions</th>
                <th className="py-3 px-3">Primary Best Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {Object.values(NETWORK_TOPOLOGIES_DATA).map((top) => (
                <tr key={top.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {top.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">{top.cableFormula}</td>
                  <td className="py-3.5 px-3">
                    {top.id === 'mesh' ? (
                      <span className="text-emerald-600 font-bold">None (Supreme Redundancy)</span>
                    ) : top.id === 'star' ? (
                      <span className="text-amber-600 font-semibold">Central Switch only</span>
                    ) : top.id === 'bus' ? (
                      <span className="text-rose-600 font-semibold">Backbone Cable break</span>
                    ) : top.id === 'ring' ? (
                      <span className="text-rose-600 font-semibold">Any single node/cable</span>
                    ) : top.id === 'tree' ? (
                      <span className="text-amber-600 font-semibold">Core Root Switch</span>
                    ) : (
                      <span className="text-slate-600 dark:text-slate-300">Depends on segment</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    {top.id === 'star' ? (
                      <span className="text-emerald-600 font-semibold">None (Full Duplex)</span>
                    ) : top.id === 'mesh' ? (
                      <span className="text-emerald-600 font-semibold">None (Dedicated links)</span>
                    ) : top.id === 'ring' ? (
                      <span className="text-emerald-600 font-semibold">None (Token controlled)</span>
                    ) : (
                      <span className="text-rose-600 font-semibold">Possible under high load</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-600 dark:text-slate-400">
                    {top.bestSuitedFor.split('(')[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-purple-600 dark:text-purple-400' : 'text-purple-500'}`} />
          <div>
            <span className="text-xs font-bold text-purple-950 dark:text-purple-200 block">
              Step 5: Topology Tradeoffs Mastered
            </span>
            <span className="text-[11px] text-purple-700 dark:text-purple-400">
              Next: Network Hardware Devices Lab (Hub, Switch, Router, Bridge, Repeater, Gateway, Modem).
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102"
        >
          <span>Explore Network Devices</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
