import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, Clock, Search, Filter } from 'lucide-react';

export function RecentProblemsTable({ onSelectProblem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const problems = [
    {
      id: 'two-sum',
      title: 'Two Sum',
      pattern: 'HashMap Lookup',
      difficulty: 'Easy',
      complexity: 'Time: O(N) | Space: O(N)',
      status: 'Completed',
    },
    {
      id: 'binary-search',
      title: 'Binary Search',
      pattern: 'Binary Search',
      difficulty: 'Easy',
      complexity: 'Time: O(log N) | Space: O(1)',
      status: 'In Progress',
    },
    {
      id: 'next-greater-elem',
      title: 'Next Greater Elem.',
      pattern: 'Monotonic Stack',
      difficulty: 'Medium',
      complexity: 'Time: O(N) | Space: O(N)',
      status: 'Completed',
    },
    {
      id: 'container-water',
      title: 'Container With Most Water',
      pattern: 'Two Pointers',
      difficulty: 'Medium',
      complexity: 'Time: O(N) | Space: O(1)',
      status: 'Completed',
    },
    {
      id: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      pattern: 'Monotonic Stack / Two Pointers',
      difficulty: 'Hard',
      complexity: 'Time: O(N) | Space: O(1)',
      status: 'In Progress',
    },
  ];

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.pattern.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <section className="space-y-4 font-sans">
      
      {/* Section Header with Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Recent Problems</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review and resume your recent problem breakdowns.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#05070E] p-1 rounded-lg border border-slate-200 dark:border-[#1E2638]">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors ${
                  selectedDifficulty === diff
                    ? 'bg-white dark:bg-[#0B101D] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Component */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#1E2638] bg-slate-50/50 dark:bg-[#05070E]/50 text-slate-500 dark:text-slate-400 text-xs font-mono font-semibold uppercase">
                <th className="py-3 px-4">Problem Title</th>
                <th className="py-3 px-4">Pattern Technique</th>
                <th className="py-3 px-4">Difficulty</th>
                <th className="py-3 px-4">Complexity</th>
                <th className="py-3 px-4 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#182030] text-sm">
              {filteredProblems.map((prob) => (
                <tr
                  key={prob.id}
                  onClick={() => onSelectProblem && onSelectProblem(prob)}
                  className="hover:bg-slate-50 dark:hover:bg-[#0E1526] transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {prob.title}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 text-xs">
                    {prob.pattern}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      prob.difficulty === 'Easy'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : prob.difficulty === 'Medium'
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                    {prob.complexity}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {prob.status === 'Completed' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                        <span>Continue</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
