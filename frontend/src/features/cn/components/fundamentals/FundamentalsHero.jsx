import React from 'react';
import { 
  Network, 
  Layers, 
  Globe2, 
  Cpu, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

export const FUNDAMENTAL_STEPS = [
  { id: 'intro', label: '1. Introduction', short: 'Intro', icon: Network, desc: 'What is a Network & Communication Model' },
  { id: 'components', label: '2. Components', short: 'Components', icon: Layers, desc: 'Hosts, Media, Protocols & Addressing' },
  { id: 'types', label: '3. Network Types', short: 'PAN/LAN/WAN', icon: Globe2, desc: 'PAN, LAN, MAN, WAN Scale' },
  { id: 'devices', label: '4. Network Devices', short: 'Devices', icon: Cpu, desc: 'Hub, Switch, Router, Bridge, Repeater, Gateway, Modem' },
];

export function FundamentalsHero({ activeStep, onSelectStep, completedSteps = [] }) {
  const currentStepObj = FUNDAMENTAL_STEPS.find((s) => s.id === activeStep) || FUNDAMENTAL_STEPS[0];
  const progressPercentage = Math.round(((completedSteps.length) / FUNDAMENTAL_STEPS.length) * 100);

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

        {/* Progress Badge */}
        <div className="p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shrink-0 min-w-[200px] space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-bold text-slate-900 dark:text-white">{completedSteps.length} / {FUNDAMENTAL_STEPS.length} Steps</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(5, progressPercentage)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stepwise Navigation Track */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-2 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-1 px-1 scrollbar-thin">
          {FUNDAMENTAL_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isDone = completedSteps.includes(step.id);

            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/40'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#131B2E] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`p-1 rounded-md ${isActive ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-200/60 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {isDone && !isActive ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
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
