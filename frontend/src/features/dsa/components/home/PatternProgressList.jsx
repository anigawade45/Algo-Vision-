import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Award, CircleDot, BarChart3, PieChart, Info } from 'lucide-react';

export function PatternProgressList() {
  const [dvtMode, setDvtMode] = useState('bubble'); // 'bubble' | 'radial' | 'bar'
  const [activeHover, setActiveHover] = useState(null);

  const patternData = [
    { id: 'two-pointers', name: 'Two Pointers', solved: 14, total: 18, percent: 82, trigger: 'Sorted Array / Pair Target', size: 85, color: '#3B82F6' },
    { id: 'sliding-window', name: 'Sliding Window', solved: 11, total: 15, percent: 70, trigger: 'Contiguous Subarray / Window', size: 78, color: '#6366F1' },
    { id: 'binary-search', name: 'Binary Search', solved: 13, total: 16, percent: 78, trigger: 'Monotonic Search Space', size: 80, color: '#06B6D4' },
    { id: 'hash-map', name: 'HashMap', solved: 17, total: 20, percent: 85, trigger: 'O(1) Value Lookup', size: 90, color: '#3B82F6' },
    { id: 'monotonic-stack', name: 'Monotonic Stack', solved: 9, total: 12, percent: 75, trigger: 'Next Greater / Smaller Elem', size: 72, color: '#8B5CF6' },
    { id: 'dp', name: 'Dynamic Programming', solved: 18, total: 29, percent: 62, trigger: 'Overlapping Subproblems', size: 95, color: '#EC4899' },
    { id: 'tree-dfs', name: 'Tree DFS / BFS', solved: 22, total: 25, percent: 88, trigger: 'Hierarchical Traversal', size: 92, color: '#10B981' },
    { id: 'graph', name: 'Graph Traversal', solved: 13, total: 20, percent: 65, trigger: 'Shortest Path / Components', size: 84, color: '#F59E0B' },
    { id: 'fast-slow', name: 'Fast & Slow Pointers', solved: 9, total: 10, percent: 90, trigger: 'Cycle Detection', size: 68, color: '#10B981' },
    { id: 'heaps', name: 'Top K Elements', solved: 8, total: 10, percent: 80, trigger: 'Priority Queue / Min Heap', size: 70, color: '#F43F5E' },
    { id: 'bit-manip', name: 'Bit Manipulation', solved: 15, total: 22, percent: 68, trigger: 'XOR / Bitwise Operations', size: 82, color: '#6366F1' },
    { id: 'prefix-sum', name: 'Prefix Sum', solved: 16, total: 19, percent: 84, trigger: 'Range Sum Queries', size: 80, color: '#06B6D4' },
    { id: 'backtracking', name: 'Backtracking', solved: 7, total: 12, percent: 58, trigger: 'Combinations / Permutations', size: 74, color: '#EC4899' },
    { id: 'greedy', name: 'Greedy Choice', solved: 13, total: 18, percent: 72, trigger: 'Locally Optimal Choice', size: 78, color: '#F59E0B' },
    { id: 'trie', name: 'Trie / Prefix Tree', solved: 8, total: 10, percent: 80, trigger: 'Autocomplete / Prefix Search', size: 68, color: '#8B5CF6' },
  ];

  // Grid layout positions for packed bubble cloud rendering
  const bubblePositions = [
    { x: 30, y: 35 }, { x: 52, y: 25 }, { x: 75, y: 32 },
    { x: 18, y: 62 }, { x: 40, y: 55 }, { x: 62, y: 60 }, { x: 84, y: 65 },
    { x: 28, y: 85 }, { x: 50, y: 88 }, { x: 72, y: 86 },
    { x: 12, y: 38 }, { x: 88, y: 38 }, { x: 38, y: 22 }, { x: 62, y: 22 }, { x: 92, y: 72 }
  ];

  return (
    <section className="space-y-5 font-sans">
      
      {/* Header with DVT Mode Switcher & Overall Mastery */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Pattern Mastery & Comprehension (DVT)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive Data Visualization Technique showing problem understanding per pattern.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* DVT View Toggle Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#05070E] p-1 rounded-xl border border-slate-200 dark:border-[#1E2638]">
            <button
              onClick={() => setDvtMode('bubble')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                dvtMode === 'bubble'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CircleDot className="w-3.5 h-3.5" />
              <span>Bubble Cloud DVT</span>
            </button>

            <button
              onClick={() => setDvtMode('radial')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                dvtMode === 'radial'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Radial Rings</span>
            </button>

            <button
              onClick={() => setDvtMode('bar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                dvtMode === 'bar'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>List Bars</span>
            </button>
          </div>

          <div className="hidden lg:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold">
            <Award className="w-4 h-4 text-blue-500" />
            <span>MASTERY: 79%</span>
          </div>
        </div>
      </div>

      {/* DVT VIEW 1: Packed Bubble Cloud Visualization */}
      {dvtMode === 'bubble' && (
        <div className="relative bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-between">
          
          {/* Ambient Glow Effects */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Interactive Floating Tooltip Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-slate-100 dark:border-[#182030] pb-3 mb-2 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-slate-700 dark:text-slate-300 font-semibold uppercase">
                {activeHover ? activeHover.name : 'Hover over any pattern node to inspect comprehension ratio'}
              </span>
            </div>

            {activeHover ? (
              <div className="flex items-center gap-3">
                <span className="text-slate-500 font-medium">{activeHover.trigger}</span>
                <span className="bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded font-bold border border-blue-200 dark:border-blue-800">
                  {activeHover.solved} / {activeHover.total} Solved ({activeHover.percent}%)
                </span>
              </div>
            ) : (
              <span className="text-slate-400">Node size = Total Problems | Fill height = % Understood</span>
            )}
          </div>

          {/* SVG Packed Bubble Container */}
          <div className="relative w-full h-[380px] flex items-center justify-center">
            <svg viewBox="0 0 1000 440" className="w-full h-full overflow-visible">
              <defs>
                {/* Linear Gradients per pattern for liquid fill */}
                {patternData.map((item) => (
                  <linearGradient key={`grad-${item.id}`} id={`grad-${item.id}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#2563EB" stopOpacity="0.85" />
                    <stop offset={`${item.percent}%`} stopColor="#3B82F6" stopOpacity="0.75" />
                    <stop offset={`${item.percent}%`} stopColor="#1E293B" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0.2" />
                  </linearGradient>
                ))}
              </defs>

              {patternData.map((item, index) => {
                const pos = bubblePositions[index % bubblePositions.length];
                const cx = pos.x * 9.2 + 40;
                const cy = pos.y * 3.8 + 20;
                const r = item.size / 2.2;
                const isHovered = activeHover?.id === item.id;

                return (
                  <g
                    key={item.id}
                    onMouseEnter={() => setActiveHover(item)}
                    onMouseLeave={() => setActiveHover(null)}
                    className="cursor-pointer transition-transform duration-200"
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  >
                    {/* Circle Node Container */}
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={`url(#grad-${item.id})`}
                      stroke={isHovered ? '#60A5FA' : '#334155'}
                      strokeWidth={isHovered ? '3' : '1.5'}
                      className="transition-all duration-200"
                      whileHover={{ scale: 1.08 }}
                    />

                    {/* Node Text Label */}
                    <text
                      x={cx}
                      y={cy - 4}
                      textAnchor="middle"
                      fill={isHovered ? '#FFFFFF' : '#E2E8F0'}
                      fontSize={r > 38 ? '13' : '11'}
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none"
                    >
                      {item.name}
                    </text>

                    {/* Node Ratio Badge (e.g. 14 / 18) */}
                    <text
                      x={cx}
                      y={cy + 14}
                      textAnchor="middle"
                      fill={isHovered ? '#60A5FA' : '#94A3B8'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="600"
                      className="pointer-events-none select-none"
                    >
                      {item.solved} / {item.total}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Bottom Legend */}
          <div className="relative z-10 pt-3 border-t border-slate-100 dark:border-[#182030] flex flex-wrap items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-600 border border-blue-400"></span>
                <span>High Mastery (&gt;75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400"></span>
                <span>Moderate Mastery (60%-75%)</span>
              </div>
            </div>
            <span>Click any node to explore pattern workspace</span>
          </div>

        </div>
      )}

      {/* DVT VIEW 2: Radial Gauge Rings */}
      {dvtMode === 'radial' && (
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {patternData.slice(0, 10).map((item) => {
              const radius = 34;
              const stroke = 6;
              const normalizedRadius = radius - stroke * 0.5;
              const circumference = normalizedRadius * 2 * Math.PI;
              const strokeDashoffset = circumference - (item.percent / 100) * circumference;

              return (
                <div
                  key={item.id}
                  className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-50 dark:bg-[#05070E] border border-slate-200 dark:border-[#1E2638] text-center space-y-2 hover:border-blue-500/50 transition-colors"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
                      <circle
                        stroke="#1E293B"
                        fill="transparent"
                        strokeWidth={stroke}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                      />
                      <circle
                        stroke="#3B82F6"
                        fill="transparent"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="transition-all duration-700"
                      />
                    </svg>
                    <span className="absolute font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {item.percent}%
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                      {item.name}
                    </h4>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.solved}/{item.total} Solved
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DVT VIEW 3: Classic List Progress Bars */}
      {dvtMode === 'bar' && (
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-6 rounded-xl space-y-5 shadow-sm">
          {patternData.slice(0, 6).map((item) => (
            <div key={item.name} className="space-y-2 group">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-900 dark:text-white font-bold group-hover:text-blue-500 transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-[#070A12] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                    {item.trigger}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">
                    {item.solved}/{item.total} Solved
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {item.percent}%
                  </span>
                </div>
              </div>

              <div className="w-full h-3 bg-slate-100 dark:bg-[#05070E] rounded-full overflow-hidden border border-slate-200/80 dark:border-[#1E2638] p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

    </section>
  );
}
