import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ArrowLeft, Sparkles, Check } from 'lucide-react';

export function HeroSection() {
  const array = [3, 8, 12, 17, 24, 31, 45, 58];
  const target = 31;

  const steps = [
    {
      stepNum: 1,
      low: 0,
      high: 7,
      mid: 3,
      message: 'Compare target 31 with middle element 17',
      codeLine: 2,
      status: 'searching'
    },
    {
      stepNum: 2,
      low: 4,
      high: 7,
      mid: 5,
      message: 'Target 31 > 17, so update low = mid + 1 (4). New mid = 5.',
      codeLine: 4,
      status: 'searching'
    },
    {
      stepNum: 3,
      low: 4,
      high: 7,
      mid: 5,
      message: 'Compare target 31 with middle element 31 (Match Found!)',
      codeLine: 3,
      status: 'found'
    },
    {
      stepNum: 4,
      low: 4,
      high: 7,
      mid: 5,
      message: 'Search completed successfully. Return index 5.',
      codeLine: 3,
      status: 'found'
    }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const codeSnippets = [
    { line: 1, text: "while (low <= high) {" },
    { line: 2, text: "  int mid = low + (high - low) / 2;" },
    { line: 3, text: "  if (arr[mid] == target) return mid;" },
    { line: 4, text: "  if (arr[mid] < target) low = mid + 1;" },
    { line: 5, text: "  else high = mid - 1;" },
    { line: 6, text: "}" }
  ];

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 bg-slate-50 dark:bg-[#05070E] transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: Hero Copy with Framer Motion Stagger */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col items-start text-left space-y-6"
          >
            {/* Subtle Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED COMPUTER SCIENCE LEARNING</span>
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Don't just read <br />
              algorithms. <br />
              <span className="text-blue-600 dark:text-[#3B82F6]">See them work.</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-[540px]">
              AlgoVision transforms complex Computer Science concepts into interactive visual experiences. Learn algorithms, understand system behavior, execute code step-by-step, and build real problem-solving intuition.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#modules"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] sm:text-[15px] shadow-lg shadow-blue-500/20 transition-all gap-2"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#modules"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white dark:bg-[#0B101D] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-[#1E2638] text-slate-800 dark:text-slate-200 font-semibold text-[14px] sm:text-[15px] transition-colors shadow-sm"
              >
                <span>Explore Visualizations</span>
              </motion.a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-2 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[10px] font-bold">
                  <Check className="w-3 h-3" />
                </div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[10px] font-bold">
                  <Check className="w-3 h-3" />
                </div>
                <span>Built for CS Students</span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Realistic Product UI Mockup with Framer Motion Layout Physics */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 font-sans"
          >
            <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 sm:p-7 shadow-xl dark:shadow-2xl text-slate-900 dark:text-slate-100 transition-colors">
              
              {/* Product Header Bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-[#1E2638] mb-6">
                <div className="flex items-center gap-3">
                  <button onClick={handleReset} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors" title="Back">
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Binary Search Visualizer
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 px-3 py-1 rounded-full font-mono text-xs font-semibold">
                    Target = {target}
                  </span>
                  <button
                    onClick={handleReset}
                    className="border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#070A12] hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 shadow-sm transition-colors font-sans"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Main Visualization Array with Framer Motion Animation */}
              <div className="space-y-6">

                <div className="pt-2 pb-4 px-1 flex items-center justify-between gap-1.5 sm:gap-3 overflow-x-auto min-h-[120px]">
                  {array.map((val, idx) => {
                    const isLow = idx === currentStep.low;
                    const isHigh = idx === currentStep.high;
                    const isMid = idx === currentStep.mid;

                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 min-w-[38px] relative">
                        {/* Array Box with Framer Motion Spring Layout */}
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 350, damping: 25 }}
                          className={`w-full aspect-square max-w-[50px] rounded-xl border flex items-center justify-center font-mono text-sm sm:text-base font-semibold transition-colors duration-200 ${
                            isMid
                              ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30 font-bold scale-110'
                              : 'bg-white dark:bg-[#070A12] border-slate-200 dark:border-[#1C2638] text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {val}
                        </motion.div>

                        <span className="text-[11px] font-mono text-slate-400 mt-2">
                          [{idx}]
                        </span>

                        {/* Pointer Indicator Badges */}
                        <div className="h-4 mt-1 font-mono text-[10px] font-bold uppercase tracking-wider flex gap-1">
                          {isLow && <span className="text-emerald-600 dark:text-emerald-400">LOW</span>}
                          {isMid && <span className="text-blue-600 dark:text-blue-400">MID</span>}
                          {isHigh && <span className="text-amber-600 dark:text-amber-400">HIGH</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Step Description & Player Controls */}
                <div className="bg-slate-100 dark:bg-[#070A12] p-4 rounded-xl border border-slate-200 dark:border-[#1C2638] flex flex-wrap items-center justify-between gap-3 font-sans">
                  <div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white block">
                      Step {currentStep.stepNum} of {steps.length}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block font-sans">
                      {currentStep.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      disabled={currentStepIdx === 0}
                      className="p-2 rounded-lg border border-slate-200 dark:border-[#1C2638] bg-white dark:bg-[#0E172A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors font-sans"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={currentStepIdx === steps.length - 1}
                      className="p-2 rounded-lg border border-slate-200 dark:border-[#1C2638] bg-white dark:bg-[#0E172A] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lower Split Panels: Current State & Java Code */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  
                  {/* LEFT: Current State */}
                  <div className="sm:col-span-5 border border-slate-200 dark:border-[#1C2638] bg-slate-100/60 dark:bg-[#070A12] p-4 rounded-xl flex flex-col justify-between font-sans">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                      Current State
                    </span>
                    <div className="space-y-2.5 font-mono text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span>low =</span>
                        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full text-xs">
                          {currentStep.low}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>mid =</span>
                        <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded-full text-xs">
                          {currentStep.mid}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>high =</span>
                        <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full text-xs">
                          {currentStep.high}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: Code Editor Sync with Framer Motion Line Highlight */}
                  <div className="sm:col-span-7 border border-slate-200 dark:border-[#1C2638] bg-slate-100/60 dark:bg-[#070A12] p-4 rounded-xl font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800 font-sans">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                        Java Code
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/50 px-2 py-0.5 rounded-full font-mono">
                        Sync: ON
                      </span>
                    </div>

                    <div className="space-y-1 relative">
                      {codeSnippets.map((item) => {
                        const isCurrentLine = item.line === currentStep.codeLine;
                        return (
                          <motion.div
                            key={item.line}
                            animate={{
                              backgroundColor: isCurrentLine ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            }}
                            className={`px-2 py-1 rounded transition-colors duration-150 flex items-center justify-between relative ${
                              isCurrentLine
                                ? 'text-blue-900 dark:text-blue-200 font-semibold border-l-2 border-blue-600'
                                : 'text-slate-600 dark:text-slate-400 opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 text-[10px] select-none">{item.line}</span>
                              <span className="truncate">{item.text}</span>
                            </div>
                            {isCurrentLine && (
                              <motion.span
                                layoutId="linePulse"
                                className="w-1.5 h-1.5 rounded-full bg-blue-600"
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
