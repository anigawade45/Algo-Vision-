import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Workflow, Terminal, Laptop, Crown, ArrowRight } from 'lucide-react';

export function SolutionSection() {
  const steps = [
    {
      num: '01',
      title: 'Learn',
      description: 'Understand with AI explanations.',
      icon: Lightbulb,
      iconBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400',
      numColor: 'text-amber-600 dark:text-amber-400',
      renderMockup: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-2.5 h-[90px] flex flex-col justify-between overflow-hidden text-left font-sans text-xs">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-medium w-fit">
            <span className="font-bold font-mono">AI</span> What is a stack?
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-snug line-clamp-2">
            A linear data structure following LIFO principle...
          </p>
        </div>
      )
    },
    {
      num: '02',
      title: 'Visualize',
      description: 'See structures change in real time.',
      icon: Workflow,
      iconBg: 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400',
      numColor: 'text-cyan-600 dark:text-cyan-400',
      renderMockup: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-2.5 h-[90px] flex items-center justify-center gap-2 overflow-hidden text-xs">
          <div className="flex flex-col gap-1 w-12 text-center font-mono text-[10px] font-bold">
            <div className="py-0.5 bg-blue-600 text-white rounded border border-blue-400/50 shadow-sm animate-bounce">30</div>
            <div className="py-0.5 bg-slate-200 dark:bg-[#111827] text-slate-800 dark:text-slate-200 rounded border border-slate-300 dark:border-slate-700">20</div>
            <div className="py-0.5 bg-slate-200 dark:bg-[#111827] text-slate-800 dark:text-slate-200 rounded border border-slate-300 dark:border-slate-700">10</div>
          </div>
          <div className="text-[9px] font-mono font-semibold text-blue-600 dark:text-blue-400">
            TOP &rarr;
          </div>
        </div>
      )
    },
    {
      num: '03',
      title: 'Execute',
      description: 'Follow operations step-by-step.',
      icon: Terminal,
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
      numColor: 'text-emerald-600 dark:text-emerald-400',
      renderMockup: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-2.5 h-[90px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-center gap-1 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow-sm animate-pulse">3</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>
          <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4A] rounded p-1.5 flex items-center justify-between text-[10px] font-mono text-slate-700 dark:text-slate-300">
            <span>Pushing 40</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>
      )
    },
    {
      num: '04',
      title: 'Practice',
      description: 'Write code & test intuition.',
      icon: Laptop,
      iconBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400',
      numColor: 'text-blue-600 dark:text-blue-400',
      renderMockup: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-2 h-[90px] flex flex-col justify-between overflow-hidden font-mono text-[9px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-0.5 text-slate-500">
            <span>Java &or;</span>
          </div>
          <div className="space-y-0.5 text-blue-600 dark:text-blue-300/90 leading-tight">
            <div>Stack&lt;Integer&gt; s = new Stack&lt;&gt;();</div>
            <div className="bg-blue-500/10 px-1 rounded animate-pulse">s.push(40);</div>
          </div>
        </div>
      )
    },
    {
      num: '05',
      title: 'Master',
      description: 'Strengthen weak technical areas.',
      icon: Crown,
      iconBg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400',
      numColor: 'text-purple-600 dark:text-purple-400',
      renderMockup: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-2.5 h-[90px] flex flex-col justify-between overflow-hidden text-xs">
          <div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Overall</span>
              <span className="text-purple-600 dark:text-purple-400 font-mono">68%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 w-[68%] animate-pulse" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-[#1E2E4A] rounded p-1.5 flex items-center justify-between text-[10px] text-slate-700 dark:text-slate-300">
            <span>Streak</span>
            <span className="font-mono font-bold text-amber-500 flex items-center gap-1">&fire; 12d</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200/80 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-10 space-y-2.5"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ALGO VISION APPROACH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Learn the concept.{' '}
            <span className="text-blue-600 dark:text-[#3B82F6]">Watch it execute.</span>{' '}
            Understand why.
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Our interactive approach turns abstract ideas into clear, visual understanding.
          </p>
        </motion.div>

        {/* 5-Step Process Timeline Cards with Framer Motion Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_25px_rgba(59,130,246,0.12)] transition-colors group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-9 h-9 rounded-xl border ${step.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-sm font-mono font-bold ${step.numColor}`}>{step.num}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-snug mb-3">{step.description}</p>
                </div>

                {step.renderMockup()}

                {/* Animated Connecting Arrow for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/3 -translate-y-1/2 z-20 text-blue-500 dark:text-blue-400 pointer-events-none">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
