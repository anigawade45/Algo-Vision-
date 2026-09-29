import React, { useState } from 'react';
import { 
  Globe2, 
  Building2, 
  Smartphone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Gauge, 
  DollarSign, 
  Zap,
  Sparkles
} from 'lucide-react';
import { NETWORK_TYPES_DATA } from '../../data/fundamentalsData';

export function NetworkTypesSection({ onCompleteStep, isCompleted }) {
  const [activeType, setActiveType] = useState(NETWORK_TYPES_DATA[1]); // Default to LAN

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Scale Visualizer */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-semibold mb-1">
              <Globe2 className="w-3 h-3 text-emerald-500" />
              <span>GEOGRAPHICAL CLASSIFICATION</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Types of Networks: PAN, LAN, MAN, WAN
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Networks are categorized by their geographical span, transmission data rates, ownership models, and underlying infrastructure technologies.
            </p>
          </div>
        </div>

        {/* 4 Interactive Type Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {NETWORK_TYPES_DATA.map((type) => {
            const Icon = 
              type.id === 'pan' ? Smartphone :
              type.id === 'lan' ? Building2 :
              type.id === 'man' ? MapPin : Globe2;

            const isSelected = activeType.id === type.id;

            return (
              <button
                key={type.id}
                onClick={() => setActiveType(type)}
                className={`p-5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-linear-to-br ' + type.color + ' text-white shadow-lg ring-2 ring-white/30 scale-102'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-[#1E2638] text-slate-900 dark:text-white hover:border-emerald-400 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                    {type.code}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold">{type.name}</h3>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'}`}>
                    {type.coverage}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/20 dark:border-slate-800 text-[11px] font-mono flex items-center justify-between">
                  <span className={isSelected ? 'text-white/80' : 'text-slate-400'}>Speed:</span>
                  <span className="font-bold">{type.speed.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Network Type Deep-Dive Canvas */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
              {activeType.code} Architecture Breakdown
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {activeType.name} ({activeType.code})
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
              {activeType.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-right">
              <span className="block text-[10px] font-mono uppercase text-slate-400">Coverage Radius</span>
              <span className="text-xs font-bold font-mono">{activeType.coverage}</span>
            </div>
          </div>
        </div>

        {/* Feature Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Gauge className="w-4 h-4 text-emerald-500" />
              <span>Data Rates</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono block">
              {activeType.speed}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span>Cost & Deployment</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono block">
              {activeType.cost}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Bit Error Rate</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono block">
              {activeType.errorRate}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-1">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-purple-500" />
              <span>Ownership Model</span>
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white block truncate">
              {activeType.ownership}
            </span>
          </div>
        </div>

        {/* Technologies & Real World Applications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-500 dark:text-slate-400">
              Core Protocols & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeType.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800 text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-500 dark:text-slate-400">
              Real-World Everyday Examples
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {activeType.useCases}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Metric Comparison Table */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>PAN vs LAN vs MAN vs WAN Side-by-Side Matrix</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4 text-sky-600 dark:text-sky-400">PAN (Personal)</th>
                <th className="py-3 px-4 text-emerald-600 dark:text-emerald-400">LAN (Local)</th>
                <th className="py-3 px-4 text-amber-600 dark:text-amber-400">MAN (Metropolitan)</th>
                <th className="py-3 px-4 text-purple-600 dark:text-purple-400">WAN (Wide Area)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Geographical Span</td>
                <td className="py-3.5 px-4 font-mono">&lt; 10 meters</td>
                <td className="py-3.5 px-4 font-mono">100m – 1 km</td>
                <td className="py-3.5 px-4 font-mono">5 km – 50 km</td>
                <td className="py-3.5 px-4 font-mono">&gt; 100 km (Global)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Data Transfer Speed</td>
                <td className="py-3.5 px-4 font-mono">1 – 24 Mbps</td>
                <td className="py-3.5 px-4 font-mono">100 Mbps – 10 Gbps</td>
                <td className="py-3.5 px-4 font-mono">100 Mbps – 1 Gbps</td>
                <td className="py-3.5 px-4 font-mono">Varies (10M - 100G)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Transmission Media</td>
                <td className="py-3.5 px-4">Bluetooth, Zigbee, Infrared</td>
                <td className="py-3.5 px-4">Cat6a Ethernet, Wi-Fi 6</td>
                <td className="py-3.5 px-4">Optical WDM, Coaxial, WiMAX</td>
                <td className="py-3.5 px-4">Submarine Fiber, Satellite, MPLS</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Propagation Delay</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold font-mono">Negligible (&lt;1ms)</td>
                <td className="py-3.5 px-4 text-emerald-600 font-semibold font-mono">Very Low (1–5ms)</td>
                <td className="py-3.5 px-4 text-amber-600 font-semibold font-mono">Moderate (10–30ms)</td>
                <td className="py-3.5 px-4 text-rose-600 font-semibold font-mono">High (50–300ms+)</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">Network Ownership</td>
                <td className="py-3.5 px-4">Private individual</td>
                <td className="py-3.5 px-4">Private Enterprise / Home</td>
                <td className="py-3.5 px-4">Public / City / ISP</td>
                <td className="py-3.5 px-4">Distributed Telecoms / Global</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'}`} />
          <div>
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
              Step 3: Network Types Mastered
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Next: Interactive Topologies Lab (Bus, Star, Ring, Mesh, Tree, Hybrid).
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102"
        >
          <span>Proceed to Topologies Lab</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
