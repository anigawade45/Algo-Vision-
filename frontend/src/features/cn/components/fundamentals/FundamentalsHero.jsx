import React from 'react';
import { 
  Network, 
  Layers, 
  Globe2, 
  Cpu, 
  Sparkles
} from 'lucide-react';

export const FUNDAMENTAL_STEPS = [
  { id: 'intro', label: '1. Introduction', short: 'Intro', icon: Network, desc: 'What is a Network & Communication Model' },
  { id: 'components', label: '2. Components', short: 'Components', icon: Layers, desc: 'Hosts, Media, Protocols & Addressing' },
  { id: 'types', label: '3. Network Types', short: 'PAN/LAN/WAN', icon: Globe2, desc: 'PAN, LAN, MAN, WAN Scale' },
  { id: 'devices', label: '4. Network Devices', short: 'Devices', icon: Cpu, desc: 'Hub, Switch, Router, Bridge, Repeater, Gateway, Modem' },
];

export function FundamentalsHero({ activeStep, onSelectStep }) {
  return (
    <div className="space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 1 • Foundational Computer Networks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Computer Network Fundamentals
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Master the foundational concepts of computer networks: core principles of data communication, physical & unguided transmission media, PAN/LAN/MAN/WAN scale, and essential hardware networking devices.
          </p>
        </div>
      </div>

      {/* Stepwise Navigation Track */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-2 shadow-sm w-full max-w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-thin min-w-0">
          {FUNDAMENTAL_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131B2E] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{step.short}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
