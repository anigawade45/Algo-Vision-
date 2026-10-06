import React from 'react';
import {
  Layers,
  Box,
  Cpu,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  Zap,
  HelpCircle,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ReplacementIntro() {
  return (
    <div className="space-y-8">
      {/* Hero Overview */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              <Layers className="w-3.5 h-3.5" /> Virtual Memory Management
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Understanding Page Replacement Algorithms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
              When virtual memory is larger than physical RAM, pages must be swapped into physical frames on demand. When all frames are full and a new page is referenced, the Operating System must select a <strong className="text-cyan-600 dark:text-cyan-400">victim page</strong> to evict using a <strong className="text-cyan-600 dark:text-cyan-400">Page Replacement Algorithm</strong>.
            </p>
          </div>
        </div>

        {/* Central Simulation Flow Visualizer */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-500" /> Operating System Page Replacement Pipeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
                Step 1
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Reference String</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                CPU requests logical page numbers in sequential access order.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                Step 2
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Check RAM Frames</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                MMU checks if target page is currently loaded in any physical frame.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                Hit or Fault?
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Page Hit / Fault</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Hit:</strong> Read immediately.<br />
                <strong>Fault:</strong> Interrupt OS to fetch.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                Step 4
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Select Victim Page</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                If frames are full, algorithm picks page to evict (FIFO, LRU, etc.).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2 text-center">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Step 5
              </span>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Evict & Update</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Victim page written out; new page loaded into target frame.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Algorithm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* FIFO Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              FIFO
            </span>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">First-In, First-Out</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Evicts the page that entered memory earliest. Simple queue implementation (queue array).
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Victim Rule:</span> Oldest arrival time.
            <br />
            <span className="text-rose-500 font-semibold">Note:</span> Subject to Belady's Anomaly!
          </div>
        </div>

        {/* LRU Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              LRU
            </span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Least Recently Used</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Evicts the page that has not been accessed for the longest duration of time.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Victim Rule:</span> Oldest last-accessed time.
            <br />
            <span className="text-emerald-500 font-semibold">Advantage:</span> Hits update recency timestamps.
          </div>
        </div>

        {/* Optimal Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Optimal
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Belady's Optimal (OPT)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Evicts the page whose next access is farthest in the future (or never used again).
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Victim Rule:</span> Farthest future reference.
            <br />
            <span className="text-cyan-500 font-semibold">Theoretical:</span> Requires future knowledge.
          </div>
        </div>

        {/* Second Chance Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Second Chance
            </span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Clock Algorithm</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            FIFO modification with a 1-bit reference flag per frame. Gives referenced pages a 2nd chance.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Victim Rule:</span> Bit=0 in circular hand.
            <br />
            <span className="text-blue-500 font-semibold">Hardware:</span> Uses standard hardware bit.
          </div>
        </div>
      </div>
    </div>
  );
}
