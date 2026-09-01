import React, { useState } from 'react';
import { Layers, ArrowRight, Zap, Target, Search, Clock, Cpu } from 'lucide-react';

export function PatternExplorerGrid({ onSelectPattern }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const patterns = [
    {
      id: 'two-pointers',
      name: 'Two Pointers',
      category: 'Arrays & Strings',
      trigger: 'Sorted array / Pairs matching target / Palindromes / In-place swap',
      complexity: 'Time: O(N) | Space: O(1)',
      examples: ['Two Sum II', '3Sum', 'Container With Most Water', 'Trapping Rain Water'],
      icon: Target,
      color: 'blue',
    },
    {
      id: 'sliding-window',
      name: 'Sliding Window',
      category: 'Arrays & Strings',
      trigger: 'Contiguous subarray or substring satisfying a constraint (min/max size)',
      complexity: 'Time: O(N) | Space: O(1) or O(K)',
      examples: ['Longest Substring Without Repeating Characters', 'Minimum Size Subarray Sum', 'Sliding Window Maximum'],
      icon: Zap,
      color: 'amber',
    },
    {
      id: 'monotonic-stack',
      name: 'Monotonic Stack / Deque',
      category: 'Stacks & Queues',
      trigger: 'Next Greater / Next Smaller element query for every position',
      complexity: 'Time: O(N) | Space: O(N)',
      examples: ['Daily Temperatures', 'Next Greater Element', 'Largest Rectangle in Histogram'],
      icon: Cpu,
      color: 'purple',
    },
    {
      id: 'fast-slow-pointers',
      name: 'Fast & Slow Pointers',
      category: 'Linked List',
      trigger: 'Cycle detection, finding middle element, or finding entry of cycle',
      complexity: 'Time: O(N) | Space: O(1)',
      examples: ['Linked List Cycle', 'Find the Duplicate Number', 'Palindrome Linked List'],
      icon: Clock,
      color: 'emerald',
    },
    {
      id: 'binary-search-range',
      name: 'Binary Search on Answer Space',
      category: 'Searching',
      trigger: 'Monotonic search space where function f(x) is true/false sorted',
      complexity: 'Time: O(N log M) | Space: O(1)',
      examples: ['Koko Eating Bananas', 'Capacity To Ship Packages', 'Split Array Largest Sum'],
      icon: Search,
      color: 'cyan',
    },
    {
      id: 'top-k-elements',
      name: 'Top K Elements (Heap)',
      category: 'Heaps & Sorting',
      trigger: 'Finding K largest, K smallest, or K most frequent elements',
      complexity: 'Time: O(N log K) | Space: O(K)',
      examples: ['Kth Largest Element in an Array', 'Top K Frequent Elements', 'Find Median from Data Stream'],
      icon: Layers,
      color: 'rose',
    },
  ];

  const categories = ['all', 'Arrays & Strings', 'Stacks & Queues', 'Linked List', 'Searching', 'Heaps & Sorting'];

  const filteredPatterns = selectedCategory === 'all'
    ? patterns
    : patterns.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Problem-Solving Pattern Index</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master patterns instead of memorizing individual solutions. Recognize triggers and apply proven templates.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'bg-slate-100 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-[#1E2638]'
              }`}
            >
              {cat === 'all' ? 'All Patterns' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatterns.map((pattern) => {
          const Icon = pattern.icon;
          return (
            <div
              key={pattern.id}
              onClick={() => onSelectPattern && onSelectPattern(pattern)}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 rounded-xl space-y-4 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
                    {pattern.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {pattern.name}
                  </h3>
                  <div className="mt-2 bg-slate-50 dark:bg-[#05070E] p-2.5 rounded-lg border border-slate-200/80 dark:border-[#1E2638]">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 block uppercase">
                      Recognition Signal / Trigger:
                    </span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-snug">
                      {pattern.trigger}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Complexity:</span> {pattern.complexity}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#182030] flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {pattern.examples.length} Classical Problems
                </span>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Deconstruct</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
