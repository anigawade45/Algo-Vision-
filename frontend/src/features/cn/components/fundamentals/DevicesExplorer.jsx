import React, { useState } from 'react';
import { 
  Cpu, 
  Radio, 
  Network, 
  GitCommit, 
  Activity, 
  Shuffle, 
  Zap, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { NETWORK_DEVICES_DATA } from '../../data/fundamentalsData';

export function DevicesExplorer({ onCompleteStep, isCompleted }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState('switch');

  const device = NETWORK_DEVICES_DATA.find((d) => d.id === selectedDeviceId) || NETWORK_DEVICES_DATA[1];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Device Selection Rack */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-mono font-semibold mb-1">
              <Cpu className="w-3 h-3 text-blue-500" />
              <span>HARDWARE & OSI LAYER ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Network Hardware Devices
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Click any networking device to inspect its OSI operating layer, internal forwarding mechanism, collision/broadcast domains, and key advantages.
            </p>
          </div>
        </div>

        {/* 7 Device Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {NETWORK_DEVICES_DATA.map((d) => {
            const Icon = 
              d.id === 'hub' ? Radio :
              d.id === 'switch' ? Cpu :
              d.id === 'router' ? Network :
              d.id === 'bridge' ? GitCommit :
              d.id === 'repeater' ? Activity :
              d.id === 'gateway' ? Shuffle : Zap;

            const isSelected = selectedDeviceId === d.id;

            return (
              <button
                key={d.id}
                onClick={() => setSelectedDeviceId(d.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-500/20 scale-102'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-white/20 text-white' : 'bg-white dark:bg-[#0B101D] text-blue-500'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="truncate w-full">
                  <span className="block font-bold text-xs truncate">{d.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono block ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    L{d.layerNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Active Device Detailed Specifications Card */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                {device.osiLayer}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-mono text-slate-400">
                {device.status}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {device.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {device.description}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-center">
              <span className="block text-[10px] font-mono uppercase text-slate-400">Operating Tier</span>
              <span className="text-sm font-bold font-mono">OSI Layer {device.layerNumber}</span>
            </div>
          </div>
        </div>

        {/* Operating Mechanism & Architecture Traits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Operating Logic */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Forwarding & Operating Mechanism</span>
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
              {device.howItWorks}
            </p>
          </div>

          {/* Network Specs Grid */}
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] flex items-center justify-between">
              <span className="text-slate-400">Intelligence Level:</span>
              <strong className="text-slate-800 dark:text-slate-200">{device.intelligence}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] flex items-center justify-between">
              <span className="text-slate-400">Addressing Mechanism:</span>
              <strong className="text-blue-600 dark:text-blue-400">{device.addressingUsed}</strong>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] flex items-center justify-between">
              <span className="text-slate-400">Collision Domain:</span>
              <span className="text-slate-800 dark:text-slate-200 text-right max-w-xs">{device.collisionDomain}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] flex items-center justify-between">
              <span className="text-slate-400">Broadcast Domain:</span>
              <span className="text-slate-800 dark:text-slate-200 text-right max-w-xs">{device.broadcastDomain}</span>
            </div>
          </div>
        </div>

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 space-y-2">
            <span className="text-xs font-bold font-mono text-emerald-800 dark:text-emerald-300 uppercase flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Advantages</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {device.pros.map((p, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/50 space-y-2">
            <span className="text-xs font-bold font-mono text-rose-800 dark:text-rose-300 uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Tradeoffs & Limitations</span>
            </span>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {device.cons.map((c, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Master Hardware Devices Comparison Matrix */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Master Network Devices Comparison Table</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <th className="py-3 px-3">Device</th>
                <th className="py-3 px-3">OSI Layer</th>
                <th className="py-3 px-3">Forwarding Address</th>
                <th className="py-3 px-3">Collision Domains</th>
                <th className="py-3 px-3">Broadcast Domains</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {NETWORK_DEVICES_DATA.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    {d.name.split(' (')[0]}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                    {d.osiLayer.split(' (')[0]}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px]">{d.addressingUsed.split(' (')[0]}</td>
                  <td className="py-3.5 px-3 text-[11px]">{d.collisionDomain.split(' (')[0]}</td>
                  <td className="py-3.5 px-3 text-[11px]">{d.broadcastDomain.split(' (')[0]}</td>
                </tr>
              ))}
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
              Step 4: Network Devices Completed
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              You have completed all 4 steps of Computer Network Fundamentals!
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102"
        >
          <span>Complete Module</span>
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
