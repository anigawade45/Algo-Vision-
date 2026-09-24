import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Check, ArrowUpRight } from 'lucide-react';
import RippleGrid from '@/components/RippleGrid';

export function HeroSection({ onNavigateToDsa, theme }) {
  const isLight = theme === 'light';

  const handleStartLearning = () => {
    if (onNavigateToDsa) {
      onNavigateToDsa();
    } else {
      window.location.hash = '#dsa';
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white font-sans transition-colors duration-200">

      {/* -------------------------------------------------------
          BACKGROUND RIPPLE GRID (WEBGL)
      ------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-50 z-0" aria-hidden="true">
        <RippleGrid
          enableRainbow={false}
          gridColor={isLight ? '#2563eb' : '#3b82f6'}
          rippleIntensity={0.04}
          gridSize={10.0}
          gridThickness={12.0}
          fadeDistance={1.4}
          vignetteStrength={1.8}
          glowIntensity={0.12}
          opacity={0.7}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={0.8}
          lightMode={isLight}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 sm:pt-32 sm:pb-24">

        {/* TOP LABEL */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-7"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-[#1E2638] bg-white/80 dark:bg-[#0B101D]/80 backdrop-blur px-4 py-2 text-[11px] font-semibold tracking-[0.16em] uppercase text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
            <span>Interactive Computer Science Learning</span>
          </div>
        </motion.div>

        {/* HERO COPY */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-slate-900 dark:text-white">
            Understand Computer Science.
            <br />
            <span className="text-blue-600 dark:text-blue-500">
              See it come alive.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl mx-auto text-base sm:text-lg leading-8 text-slate-600 dark:text-slate-400">
            AlgoVision turns complex Computer Science concepts into
            interactive visual experiences — from algorithms and databases
            to operating systems, networks and system design.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartLearning}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>

            <motion.a
              whileHover={{ y: -2 }}
              href="#domains-overview"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-800 dark:text-slate-200 font-semibold text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
            >
              <span>Explore All Domains</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </motion.a>
          </div>
        </motion.div>

        {/* VALUE PROPOSITION CHECKMARKS */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-slate-500 dark:text-slate-400 font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </span>
            <span>Step-by-step visualization</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </span>
            <span>Interactive learning</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 flex items-center justify-center">
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </span>
            <span>Learn by seeing</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}