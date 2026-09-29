import React from 'react';
import { Terminal, Sparkles, PlayCircle, ChevronDown } from 'lucide-react';
import { D3HeroDsaVisual } from './D3HeroDsaVisual';

export function DsaModuleHero({ onScrollToInput, onScrollToEngine }) {
  return (
    <section className="relative font-sans min-h-auto lg:min-h-[calc(100vh-5.5rem)] flex flex-col justify-between w-full max-w-7xl mx-auto pt-2 sm:pt-4 pb-4 space-y-6 lg:space-y-0">
      
      {/* Ambient Spatial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-56 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Main Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10 w-full my-auto py-2">
        
        {/* LEFT COLUMN (lg:col-span-7): Product Landing Hero Copy & CTAs */}
        <div className="lg:col-span-7 w-full space-y-4 sm:space-y-5">
          
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold shadow-2xs">
            <Terminal className="w-3.5 h-3.5" aria-hidden="true" />
            <span>ALGOVISION / DSA</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.18] sm:leading-[1.12]">
            Understand DSA.{' '}
            <span className="block sm:inline text-blue-600 dark:text-blue-400">Don&apos;t just solve it.</span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
            Bring a problem you&apos;re working on and explore the reasoning, patterns, algorithms, execution, and visualization behind it.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onScrollToInput}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Bring a Problem →</span>
            </button>

            <button
              type="button"
              onClick={onScrollToEngine}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-blue-500 font-semibold text-sm transition-colors cursor-pointer min-h-[44px] w-full sm:w-auto"
            >
              <PlayCircle className="w-4 h-4 text-blue-500" aria-hidden="true" />
              <span>Explore Learning Engine</span>
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (lg:col-span-5): D3 Open Spatial DSA Map */}
        <div className="lg:col-span-5 w-full relative">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pb-1 px-1 border-b border-slate-200/50 dark:border-slate-800/50 mb-1">
            <span className="uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">DSA System Map</span>
            <span className="text-blue-500 font-semibold">Tap / Focus Nodes</span>
          </div>

          <D3HeroDsaVisual />
        </div>

      </div>

      {/* Viewport Bottom Transition Indicator */}
      <button
        type="button"
        onClick={onScrollToEngine}
        aria-label="Scroll to Learning Engine"
        className="flex flex-col items-center justify-center cursor-pointer pt-2 group relative z-10 shrink-0 self-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full"
      >
        <div className="w-[1px] h-6 bg-gradient-to-b from-blue-500/40 via-slate-300 dark:via-slate-800 to-transparent group-hover:h-8 transition-all" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 dark:text-slate-500 group-hover:text-blue-500 bg-slate-50 dark:bg-[#05070E] px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800 my-0.5 flex items-center gap-1 transition-colors">
          <span>LEARNING ENGINE</span>
          <ChevronDown className="w-3 h-3 text-blue-500 group-hover:translate-y-0.5 transition-transform" />
        </span>
      </button>

    </section>
  );
}





