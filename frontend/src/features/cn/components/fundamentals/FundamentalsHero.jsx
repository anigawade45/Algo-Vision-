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
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>MODULE 1 • FOUNDATIONAL COMPUTER NETWORKS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Computer Network Fundamentals
            </h1>

            <p className="text-emerald-100 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
              Master the foundational concepts of computer networks: core principles of data communication, physical & unguided transmission media, PAN/LAN/MAN/WAN scale, and essential hardware networking devices.
            </p>
          </div>

          {/* Quick Progress Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-100">
              <span>Stepwise Mastery</span>
              <span className="font-bold text-white">{completedSteps.length} / {FUNDAMENTAL_STEPS.length} Completed</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-black/20 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-linear-to-r from-emerald-300 to-teal-200 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(5, progressPercentage)}%` }}
              />
            </div>

            <div className="text-[11px] text-emerald-200/90 flex items-center justify-between">
              <span>Active: {currentStepObj.short}</span>
              <span className="font-semibold text-emerald-100">{progressPercentage}%</span>
            </div>
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
