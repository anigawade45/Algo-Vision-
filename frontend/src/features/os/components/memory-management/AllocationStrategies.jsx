import React, { useState } from 'react';
import { Layers, Search, CheckCircle2, XCircle, ArrowRight, Play, RotateCcw, Info } from 'lucide-react';

export function AllocationStrategies() {
  const [requestSize, setRequestSize] = useState(212);
  const [activeStrategy, setActiveStrategy] = useState('first_fit'); // first_fit, best_fit, worst_fit

  // Initial Free Memory Blocks Preset
  const freeBlocks = [
    { id: 'B1', start: 100, size: 100 },
    { id: 'B2', start: 200, size: 500 },
    { id: 'B3', start: 700, size: 200 },
    { id: 'B4', start: 900, size: 300 },
    { id: 'B5', start: 1200, size: 600 }
  ];

  // Calculate results for First Fit, Best Fit, and Worst Fit
  const suitableBlocks = freeBlocks.filter(b => b.size >= requestSize);

  // First Fit: first block in list where size >= requestSize
  const firstFitBlock = freeBlocks.find(b => b.size >= requestSize) || null;

  // Best Fit: smallest block where size >= requestSize
  const bestFitBlock = suitableBlocks.length > 0
    ? [...suitableBlocks].sort((a, b) => a.size - b.size)[0]
    : null;

  // Worst Fit: largest block where size >= requestSize
  const worstFitBlock = suitableBlocks.length > 0
    ? [...suitableBlocks].sort((a, b) => b.size - a.size)[0]
    : null;

  const getSelectedBlock = () => {
    if (activeStrategy === 'first_fit') return firstFitBlock;
    if (activeStrategy === 'best_fit') return bestFitBlock;
    return worstFitBlock;
  };

  const selectedBlock = getSelectedBlock();

  return (
    <div className="space-y-8">
      {/* Header Panel & Request Input */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contiguous Allocation Strategies</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Compare First Fit, Best Fit, and Worst Fit dynamic partition selection algorithms</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">Request Process Size:</span>
            <input
              type="number"
              value={requestSize}
              onChange={(e) => setRequestSize(Math.max(1, Number(e.target.value)))}
              className="w-24 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-xs font-mono text-slate-500">KB</span>
          </div>
        </div>

        {/* Strategy Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveStrategy('first_fit')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeStrategy === 'first_fit'
                ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 dark:border-blue-500/50 shadow-sm ring-1 ring-blue-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">1. First Fit</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 font-mono">
                {firstFitBlock ? `Target: ${firstFitBlock.id} (${firstFitBlock.size} KB)` : 'No Fit'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Fastest Allocation</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Allocates into the <strong>first available free block</strong> that is large enough. Scans memory sequentially from beginning.
            </p>
          </button>

          <button
            onClick={() => setActiveStrategy('best_fit')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeStrategy === 'best_fit'
                ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-400 dark:border-emerald-500/50 shadow-sm ring-1 ring-emerald-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">2. Best Fit</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono">
                {bestFitBlock ? `Target: ${bestFitBlock.id} (${bestFitBlock.size} KB)` : 'No Fit'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Minimizes Leftover Wasted Hole</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Allocates into the <strong>smallest suitable free block</strong> that fits request size. Must search entire list unless sorted.
            </p>
          </button>

          <button
            onClick={() => setActiveStrategy('worst_fit')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activeStrategy === 'worst_fit'
                ? 'bg-purple-50 dark:bg-purple-500/15 border-purple-400 dark:border-purple-500/50 shadow-sm ring-1 ring-purple-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase">3. Worst Fit</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono">
                {worstFitBlock ? `Target: ${worstFitBlock.id} (${worstFitBlock.size} KB)` : 'No Fit'}
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Leaves Largest Remaining Hole</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Allocates into the <strong>largest available free block</strong>. Leaves larger leftover fragments that might fit future processes.
            </p>
          </button>
        </div>

        {/* Free Blocks Interactive Map */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Free Memory Blocks Layout (Request: {requestSize} KB)
            </span>
            <span className="text-xs font-mono text-slate-500">
              Active Strategy: <strong className="uppercase text-indigo-600 dark:text-indigo-400">{activeStrategy.replace('_', ' ')}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {freeBlocks.map((block) => {
              const isSelected = selectedBlock?.id === block.id;
              const fits = block.size >= requestSize;

              return (
                <div
                  key={block.id}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-md scale-105 ring-2 ring-emerald-500/40'
                      : fits
                      ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      : 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-900/40 text-slate-400 dark:text-slate-500 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono block opacity-75">{block.id} [{block.start} KB]</span>
                  <div className="text-lg font-mono font-extrabold my-1">{block.size} KB</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold block ${
                    isSelected
                      ? 'bg-emerald-500 text-white font-extrabold'
                      : fits
                      ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
                      : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                  }`}>
                    {isSelected ? 'SELECTED FIT' : fits ? 'SUITABLE' : 'TOO SMALL'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Allocation Explanation Banner */}
          {selectedBlock ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>{activeStrategy.replace('_', ' ').toUpperCase()} RESULT:</strong> Selected Block <strong>{selectedBlock.id}</strong> ({selectedBlock.size} KB). Leftover fragment = <strong>{selectedBlock.size - requestSize} KB</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 dark:bg-rose-500/15 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs font-mono text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                <strong>ALLOCATION FAILED:</strong> No free block is large enough to satisfy the requested process size of {requestSize} KB.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AllocationStrategies;
