import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Link, Code2, Layers, Cpu, CornerDownLeft, CheckCircle2 } from 'lucide-react';

export function DsaHeroSection({ onAnalyze }) {
  const [inputMode, setInputMode] = useState('text');
  const [problemText, setProblemText] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const sampleChips = [
    {
      title: 'Two Sum',
      pattern: 'HashMap Lookup',
      text: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    },
    {
      title: 'Container With Most Water',
      pattern: 'Two Pointers',
      text: 'Given n non-negative integers height[i] where each represents a point at coordinate (i, height[i]), find two lines that together with the x-axis form a container that holds the most water.',
    },
    {
      title: 'Trapping Rain Water',
      pattern: 'Monotonic Stack / Two Pointers',
      text: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    },
    {
      title: 'Sliding Window Maximum',
      pattern: 'Monotonic Deque',
      text: 'Given an array nums and a sliding window size k, find the maximum element in each sliding window moving from left to right.',
    },
  ];

  const handleSelectSample = (sample) => {
    setProblemText(sample.text);
    setInputMode('text');
  };

  const handleAnalyze = () => {
    const textToSubmit = inputMode === 'url' ? urlInput : problemText;
    if (onAnalyze) {
      onAnalyze({
        title: inputMode === 'url' ? 'Imported Problem' : (problemText.slice(0, 30) || 'Custom Problem') + '...',
        description: textToSubmit,
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <section className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-10 text-center space-y-6 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-all">
      
      {/* Subtle Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-40 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Copy */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>DSA PROBLEM SOLVER</span>
        </motion.div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Don't just solve it. <span className="text-blue-600 dark:text-[#3B82F6]">Understand it.</span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-normal max-w-xl mx-auto">
          Submit a problem and we'll break it down step-by-step into intuition, pattern detection, pseudocode, and interactive dry runs.
        </p>
      </div>

      {/* Main Interactive Input Box Container */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-4 text-left">
        
        {/* Input Mode Selector Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputMode('text')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                inputMode === 'text'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Paste Statement</span>
            </button>

            <button
              onClick={() => setInputMode('url')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                inputMode === 'url'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Import URL</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 font-semibold text-[10px]">Ctrl + Enter</kbd> to analyze
          </span>
        </div>

        {/* Textarea or URL Input */}
        <div className="bg-slate-50 dark:bg-[#05070E] p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-[#1E2638] shadow-inner">
          {inputMode === 'text' ? (
            <textarea
              rows={4}
              value={problemText}
              onKeyDown={handleKeyDown}
              onChange={(e) => setProblemText(e.target.value)}
              placeholder="Paste your problem statement, constraints, or example test cases here..."
              className="w-full p-3 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-none transition-all"
            />
          ) : (
            <div className="py-2 px-1">
              <input
                type="url"
                value={urlInput}
                onKeyDown={handleKeyDown}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://leetcode.com/problems/two-sum/ or HackerRank URL..."
                className="w-full p-3 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono transition-all"
              />
            </div>
          )}
        </div>

        {/* Quick Sample Starter Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
            Quick Try Classical Samples:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {sampleChips.map((sample) => (
              <button
                key={sample.title}
                onClick={() => handleSelectSample(sample)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#070A12] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-[#1E2638] hover:border-blue-300 dark:hover:border-blue-800 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-all"
              >
                <span>{sample.title}</span>
                <span className="text-[10px] font-mono text-slate-400">({sample.pattern})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-2 flex justify-center sm:justify-start">
          <button
            onClick={handleAnalyze}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all gap-2 group cursor-pointer"
          >
            <span>Analyze Problem</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Mini 4-Stage Pipeline Ticker Footer */}
      <div className="relative z-10 pt-4 border-t border-slate-100 dark:border-[#182030] max-w-3xl mx-auto flex flex-wrap items-center justify-around gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          <span>1. Pattern Detection</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
          <span>2. Real-World Analogy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
          <span>3. Pseudocode & Code</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>4. Step-by-Step Dry Run</span>
        </div>
      </div>

    </section>
  );
}
