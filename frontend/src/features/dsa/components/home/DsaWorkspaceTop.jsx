import React, { useState } from 'react';
import {
  Sparkles,
  Code2,
  Link,
  Brain,
  Grid,
  Workflow,
  Eye,
  PlayCircle,
  Gauge,
  ArrowRight
} from 'lucide-react';

const SAMPLE_PROBLEMS = [
  {
    title: 'Two Sum',
    statement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  },
  {
    title: 'Container With Most Water',
    statement: 'Given n non-negative integers height[i], find two lines that form a container holding the most water.',
  },
  {
    title: 'Koko Eating Bananas',
    statement: 'Return the minimum integer speed k to eat all bananas within h hours.',
  },
  {
    title: 'Trapping Rain Water',
    statement: 'Given n non-negative integers representing an elevation map, compute how much water it can trap.',
  },
];

const TOOLKIT_RAIL = [
  { id: 'understand', name: 'Understand', desc: 'Build intuition around input bounds and goals', icon: Brain },
  { id: 'analogy', name: 'Analogy', desc: 'Connect concept to a physical mental model', icon: Sparkles },
  { id: 'pattern', name: 'Pattern', desc: 'Recognize the underlying problem archetype', icon: Grid },
  { id: 'algorithm', name: 'Algorithm', desc: 'Build the optimal solving strategy', icon: Workflow },
  { id: 'visualize', name: 'Visualize', desc: 'See algorithm & memory mutate dynamically', icon: Eye },
  { id: 'dryrun', name: 'Dry Run', desc: 'Follow execution step-by-step with state trace', icon: PlayCircle },
  { id: 'code', name: 'Code', desc: 'Turn strategy into production code (C++, Py, JS)', icon: Code2 },
  { id: 'complexity', name: 'Complexity', desc: 'Derive time O(N) & space O(1) bounds mathematically', icon: Gauge },
];

export function DsaWorkspaceTop({ onAnalyze }) {
  const [inputMode, setInputMode] = useState('text'); // 'text' | 'url'
  const [problemText, setProblemText] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredToolId, setHoveredToolId] = useState('pattern');
  const [errorMsg, setErrorMsg] = useState('');

  const activeTool = TOOLKIT_RAIL.find((t) => t.id === hoveredToolId) || TOOLKIT_RAIL[2];

  const handleAnalyzeSubmit = (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const targetInput = inputMode === 'url' ? urlInput.trim() : problemText.trim();
    if (!targetInput) {
      setErrorMsg(inputMode === 'url' ? 'Please enter a valid problem URL.' : 'Please paste a problem statement.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onAnalyze) {
        onAnalyze({
          title: inputMode === 'url' ? 'Imported Problem' : (targetInput.slice(0, 30) + '...'),
          description: targetInput,
          mode: inputMode,
        });
      }
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      handleAnalyzeSubmit();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans relative">
      
      {/* LEFT (60% / lg:col-span-7): BRING A PROBLEM COMMAND SURFACE */}
      <div className="lg:col-span-7 space-y-4">
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Working on a DSA problem?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Paste the problem you&apos;re solving and let AlgoVision break down the reasoning, pattern, algorithm, and execution.
          </p>
        </div>

        {/* Command Workspace Surface */}
        <div className={`
          bg-white dark:bg-[#0B101D] border rounded-2xl p-5 shadow-sm transition-all relative overflow-hidden
          ${isFocused
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
            : 'border-slate-200 dark:border-[#1E2638]'
          }
        `}>
          <form onSubmit={handleAnalyzeSubmit} className="space-y-3.5">
            
            {/* Input Mode Toggles */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    inputMode === 'text'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Problem Text</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    inputMode === 'url'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  <Link className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Problem URL</span>
                </button>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-slate-400">
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#05070E] border border-slate-200 dark:border-slate-800">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#05070E] border border-slate-200 dark:border-slate-800">Enter</kbd>
              </span>
            </div>

            {/* Input Element */}
            <div>
              <label htmlFor="problem-input" className="sr-only">
                {inputMode === 'url' ? 'Paste LeetCode Problem URL' : 'Paste Problem Statement'}
              </label>

              {inputMode === 'url' ? (
                <div className="relative">
                  <Link className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input
                    id="problem-input"
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Paste LeetCode problem URL (e.g., https://leetcode.com/problems/two-sum)..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200 dark:border-[#1C2638] text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                <textarea
                  id="problem-input"
                  rows={4}
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste a problem statement or text here..."
                  className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200 dark:border-[#1C2638] text-xs font-mono text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors resize-y min-h-27.5"
                />
              )}
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-rose-600 dark:text-rose-400" role="alert">
                {errorMsg}
              </p>
            )}

            {/* Bottom Bar Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <span className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  Samples:
                </span>
                {SAMPLE_PROBLEMS.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => {
                      setInputMode('text');
                      setProblemText(s.statement);
                    }}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-[#05070E] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-[#1C2638] hover:border-blue-300 text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap transition-colors cursor-pointer"
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/20 cursor-pointer shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Analyze Problem →</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>

      {/* RIGHT (40% / lg:col-span-5): COMPACT TOOL RAIL */}
      <div className="lg:col-span-5 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Your DSA Toolkit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Developer tool rail providing multi-stage algorithmic dissection capabilities.
          </p>
        </div>

        {/* Vertical Tool Rail Container */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-3.5 shadow-sm space-y-1">
          {TOOLKIT_RAIL.map((tool) => {
            const ToolIcon = tool.icon;
            const isHovered = tool.id === hoveredToolId;

            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredToolId(tool.id)}
                className={`
                  p-2 rounded-xl transition-all cursor-pointer flex items-center justify-between font-mono text-xs
                  ${isHovered
                    ? 'bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 font-bold'
                    : 'bg-transparent border border-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#05070E]'
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <ToolIcon className={`w-3.5 h-3.5 ${isHovered ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{tool.name}</span>
                </div>

                <span className="text-[10px] text-slate-400 font-normal truncate max-w-40 text-right">
                  {tool.desc}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
