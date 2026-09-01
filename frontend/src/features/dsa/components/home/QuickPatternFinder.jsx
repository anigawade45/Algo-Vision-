import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Sliders, HelpCircle } from 'lucide-react';

export function QuickPatternFinder({ onLaunchPattern }) {
  const [dataStructure, setDataStructure] = useState('array');
  const [isSorted, setIsSorted] = useState('yes');
  const [inputSize, setInputSize] = useState('10^5');
  const [goal, setGoal] = useState('pair');

  const getRecommendation = () => {
    if (dataStructure === 'array' && isSorted === 'yes' && goal === 'pair') {
      return {
        pattern: 'Two Pointers (Opposite Ends)',
        reason: 'Array is sorted and goal is finding a pair matching target. O(N) time and O(1) space.',
        suggestedProblem: 'Two Sum II - Input Array Is Sorted',
      };
    }
    if (dataStructure === 'array' && goal === 'subarray') {
      return {
        pattern: 'Sliding Window (Dynamic or Fixed)',
        reason: 'Goal involves contiguous subarray with min/max length or sum constraints.',
        suggestedProblem: 'Minimum Size Subarray Sum',
      };
    }
    if (goal === 'next_greater') {
      return {
        pattern: 'Monotonic Stack',
        reason: 'Finding the nearest larger/smaller element for each index in O(N) time.',
        suggestedProblem: 'Daily Temperatures',
      };
    }
    if (isSorted === 'yes' && inputSize === '10^9') {
      return {
        pattern: 'Binary Search',
        reason: 'Large input size N = 10^9 requires O(log N) logarithmic search.',
        suggestedProblem: 'Binary Search',
      };
    }
    return {
      pattern: 'Hash Map Lookup',
      reason: 'Use extra space O(N) for O(1) instantaneous key-value lookup.',
      suggestedProblem: 'Two Sum',
    };
  };

  const rec = getRecommendation();

  return (
    <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 rounded-2xl space-y-6 shadow-sm font-sans">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Interactive Pattern Trigger Matrix</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Input problem constraints to identify the optimal algorithmic pattern automatically.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-[#05070E] p-4 rounded-xl border border-slate-200 dark:border-[#1E2638]">
        
        {/* Param 1 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Data Structure
          </label>
          <select
            value={dataStructure}
            onChange={(e) => setDataStructure(e.target.value)}
            className="w-full bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white text-xs font-mono p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="array">Array / Vector</option>
            <option value="string">String</option>
            <option value="linked_list">Linked List</option>
            <option value="graph">Graph / Tree</option>
          </select>
        </div>

        {/* Param 2 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Is Data Sorted?
          </label>
          <select
            value={isSorted}
            onChange={(e) => setIsSorted(e.target.value)}
            className="w-full bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white text-xs font-mono p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="yes">Yes (Sorted)</option>
            <option value="no">No (Unsorted)</option>
          </select>
        </div>

        {/* Param 3 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Input Size (N)
          </label>
          <select
            value={inputSize}
            onChange={(e) => setInputSize(e.target.value)}
            className="w-full bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white text-xs font-mono p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="10^2">N ≤ 100 (O(N²))</option>
            <option value="10^5">N ≤ 10⁵ (O(N) / O(N log N))</option>
            <option value="10^9">N ≤ 10⁹ (O(log N))</option>
          </select>
        </div>

        {/* Param 4 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Primary Goal
          </label>
          <select
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-900 dark:text-white text-xs font-mono p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="pair">Find Pair with Target</option>
            <option value="subarray">Contiguous Subarray / Substring</option>
            <option value="next_greater">Next Greater Element</option>
            <option value="shortest_path">Shortest Path / Traversal</option>
          </select>
        </div>

      </div>

      {/* Recommendation Card */}
      <div className="bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
              Recommended Pattern:
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              {rec.pattern}
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 font-sans">
            {rec.reason}
          </p>
        </div>

        <button
          onClick={() => onLaunchPattern && onLaunchPattern(rec)}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all gap-1.5 shadow-sm shrink-0"
        >
          <span>Open Starter Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
