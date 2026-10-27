import { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Sparkles,
  Activity,
  Calculator,
  Globe
} from 'lucide-react';
import { CORE_CONCEPTS } from '../../data/basicsModuleData';

export function ConceptOverviewSection({ onCompleteStep, isCompleted }) {
  const [selectedConcept, setSelectedConcept] = useState(CORE_CONCEPTS[0].id);
  const [activeNines, setActiveNines] = useState('99.99');

  const activeConceptData = CORE_CONCEPTS.find((c) => c.id === selectedConcept) || CORE_CONCEPTS[0];

  const ninesData = {
    '99.0': { label: 'Two Nines (99.0%)', yearlyDowntime: '3.65 days', monthlyDowntime: '7.31 hours', dailyDowntime: '14.4 mins', tier: 'Basic / Non-Critical', color: 'text-amber-500' },
    '99.9': { label: 'Three Nines (99.9%)', yearlyDowntime: '8.77 hours', monthlyDowntime: '43.8 mins', dailyDowntime: '1.44 mins', tier: 'Standard SaaS', color: 'text-blue-500' },
    '99.99': { label: 'Four Nines (99.99%)', yearlyDowntime: '52.6 minutes', monthlyDowntime: '4.38 mins', dailyDowntime: '8.64 secs', tier: 'High-Availability Gold Standard', color: 'text-purple-500' },
    '99.999': { label: 'Five Nines (99.999%)', yearlyDowntime: '5.26 minutes', monthlyDowntime: '26.3 secs', dailyDowntime: '864 ms', tier: 'Mission-Critical (Payments/Telecom)', color: 'text-emerald-500' }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Introduction Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              System Design Foundations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Core principles, design trade-offs, and vocabulary every software engineer must master.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          At its heart, <strong>System Design</strong> is about architecting software components, networks, and storage to meet business demands reliably and cost-effectively as traffic scales from 10 users to 100,000,000+ users. There is rarely a single "perfect" solution; every architectural decision involves conscious <strong>trade-offs</strong> between speed, resilience, complexity, and cost.
        </p>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {CORE_CONCEPTS.map((concept) => {
            const isSelected = selectedConcept === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => setSelectedConcept(concept.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3 ${isSelected
                    ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20 shadow-md'
                    : 'bg-slate-50/70 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-800 hover:shadow-sm'
                  }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${concept.badgeColor}`}>
                    {concept.tag}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {concept.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {concept.summary}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Active Concept Card */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 dark:from-[#111827] dark:via-[#111827] dark:to-purple-950/20 border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${activeConceptData.badgeColor}`}>
              {activeConceptData.tag} Concept
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeConceptData.title}
            </h3>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs font-mono font-semibold text-purple-700 dark:text-purple-300">
            {activeConceptData.formula}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Engineering Takeaways */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Core Architectural Insights</span>
            </h4>

            <div className="space-y-2.5">
              {activeConceptData.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Real-World Case Study Highlight */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Production Industry Example</span>
            </h4>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs font-mono uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Industry Case Analysis</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeConceptData.realWorldExample}
              </p>
            </div>

            {/* Quick architectural comparison preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="space-y-0.5">
                <span className="text-slate-400">Scale Strategy:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">Stateless App + Sharded Store</p>
              </div>
              <div className="space-y-0.5 text-right">
                <span className="text-slate-400">Bottleneck Zone:</span>
                <p className="font-bold text-purple-600 dark:text-purple-400">Database Disk I/O &amp; Network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive SLA Availability & "Nines" Calculator Widget */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Interactive High Availability &amp; SLA "Nines" Explorer
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compare acceptable downtime tolerances across different Service Level Agreements (SLAs).
            </p>
          </div>

          {/* Nines switcher buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 rounded-2xl">
            {Object.keys(ninesData).map((nineKey) => (
              <button
                key={nineKey}
                onClick={() => setActiveNines(nineKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${activeNines === nineKey
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                {nineKey}%
              </button>
            ))}
          </div>
        </div>

        {/* Nines Metrics Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Reliability Tier</span>
            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
              {ninesData[activeNines].tier}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Max Downtime / Year</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {ninesData[activeNines].yearlyDowntime}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Max Downtime / Month</span>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono">
              {ninesData[activeNines].monthlyDowntime}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400">Max Downtime / Day</span>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {ninesData[activeNines].dailyDowntime}
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-500 shrink-0" />
            <span>
              Achieving <strong>99.999% (5 Nines)</strong> requires multi-region active-active redundancy, automated failover in &lt; 500ms, and zero single points of failure.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
