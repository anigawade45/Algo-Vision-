import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Code2, Sparkles, FileText, Layers, Lightbulb, Compass, GitCommit, CheckCircle2 } from 'lucide-react';

export function ProblemDecomposerHero({ onSelectSample }) {
  const [problemInput, setProblemInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const sampleProblems = [
    {
      id: 'two-sum',
      title: 'Two Sum',
      category: 'Arrays & Hashing',
      difficulty: 'Easy',
      pattern: 'Hash Map Lookup / Two Pointers',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      input: 'nums = [2,7,11,15], target = 9',
    },
    {
      id: 'container-water',
      title: 'Container With Most Water',
      category: 'Two Pointers',
      difficulty: 'Medium',
      pattern: 'Opposite Ends Two Pointers',
      description: 'Find two lines that together with the x-axis form a container that holds the most water.',
      input: 'height = [1,8,6,2,5,4,8,3,7]',
    },
    {
      id: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      category: 'Monotonic Stack / Two Pointers',
      difficulty: 'Hard',
      pattern: 'Prefix Max & Suffic Max',
      description: 'Given n non-negative integers representing an elevation map, compute how much water it can trap after raining.',
      input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
    },
    {
      id: 'sliding-window-max',
      title: 'Sliding Window Maximum',
      category: 'Sliding Window',
      difficulty: 'Hard',
      pattern: 'Monotonic Deque',
      description: 'Find the max element in each sliding window of size k moving from left to right.',
      input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
    },
  ];

  const stepsPipeline = [
    { num: '01', title: 'Problem', desc: 'Inputs & Constraints', icon: FileText, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
    { num: '02', title: 'Understanding', desc: 'Edge Cases & Goal', icon: Lightbulb, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { num: '03', title: 'Analogy', desc: 'Real-world Intuition', icon: Compass, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    { num: '04', title: 'Pattern', desc: 'Identify Core Technique', icon: Layers, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' },
    { num: '05', title: 'Algorithm & Code', desc: 'Step logic & Clean Code', icon: Code2, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-800' },
    { num: '06', title: 'Dry Run', desc: 'Interactive Visualizer', icon: GitCommit, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  ];

  const handleStartDecomposition = (problem) => {
    if (onSelectSample) {
      onSelectSample(problem);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Workspace Banner */}
      <div className="relative bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-2xl overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STRUCTURED DSA DISSECTION PIPELINE</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Deconstruct Any Problem <br className="hidden sm:inline" />
              <span className="text-blue-600 dark:text-[#3B82F6]">Step-by-Step into Executable Intuition</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2.5 leading-relaxed max-w-2xl">
              Break down complex LeetCode or custom DSA problems from raw statement to intuition, pattern detection, pseudocode, code, and interactive visual dry runs.
            </p>
          </div>

          {/* Quick Problem Input / Action Card */}
          <div className="bg-slate-50 dark:bg-[#05070E] p-4 rounded-xl border border-slate-200 dark:border-[#1E2638] space-y-3">
            <label className="block text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
              PASTE PROBLEM STATEMENT / URL / TITLE
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                placeholder="e.g. Given an array of integers nums and target, find two indices..."
                className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
              />
              <button
                onClick={() => handleStartDecomposition({ title: problemInput || 'Custom Problem', description: problemInput })}
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all gap-2 shrink-0"
              >
                <span>Start Breakdown</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 6-Step Pipeline Visualiser */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-semibold text-slate-900 dark:text-white tracking-wider uppercase">
            The 6-Step Problem Dissection Workflow
          </h2>
          <span className="text-xs text-slate-500 font-mono">Systematic & Mental-Model Driven</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stepsPipeline.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-4 rounded-xl space-y-3 relative hover:border-blue-500/50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400">{step.num}</span>
                  <div className={`p-2 rounded-lg border ${step.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Problem Starters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Curated Problem Workspace Starters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a classical problem to launch directly into the step-by-step breakdown workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleProblems.map((problem) => (
            <motion.div
              key={problem.id}
              whileHover={{ y: -2 }}
              onClick={() => handleStartDecomposition(problem)}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 rounded-xl space-y-3 cursor-pointer hover:border-blue-500/50 transition-all shadow-sm group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : problem.difficulty === 'Medium'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {problem.category}
                  </span>
                </div>
                <div className="text-xs font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                  {problem.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {problem.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-[#182030] flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>Pattern: <strong className="text-slate-700 dark:text-slate-300">{problem.pattern}</strong></span>
                <span className="bg-slate-100 dark:bg-[#070A12] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                  {problem.input}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}
