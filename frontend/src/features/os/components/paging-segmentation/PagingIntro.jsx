import React from 'react';
import { Cpu, ArrowRight, Layers, Database, ShieldCheck, Box, HardDrive, CheckCircle2, Sliders } from 'lucide-react';

export function PagingIntro() {
  return (
    <div className="space-y-8">
      {/* Introduction Banner Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
            Memory Abstraction & Relocation
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What are Paging and Segmentation?
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          Paging and Segmentation are non-contiguous memory management schemes that allow process memory to be stored non-contiguously in physical RAM. <strong>Paging</strong> divides memory into fixed-size blocks (Pages and Frames), eliminating external fragmentation. <strong>Segmentation</strong> divides memory into variable-sized logical blocks (Code, Data, Stack) reflecting the programmer's view of a process.
        </p>
      </div>

      {/* Core Architectural Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paging Flow Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-600 dark:text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Paging Pipeline</h4>
              <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-semibold">Fixed-Size Blocks (Pages $\rightarrow$ Frames)</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Logical address is split into <strong>Page Number ($p$)</strong> and <strong>Offset ($d$)</strong>. Page Table maps Page $p$ to Physical Frame $f$.
          </p>

          {/* Flow Diagram */}
          <div className="p-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 rounded font-bold">
                CPU Logical Addr
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 text-blue-800 dark:text-blue-300 rounded">
                Page $p$ + Offset $d$
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 text-cyan-800 dark:text-cyan-300 rounded font-bold">
                Page Table Lookup
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                Physical Addr = (Frame × Page Size) + Offset
              </span>
            </div>
          </div>
        </div>

        {/* Segmentation Flow Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-purple-200 dark:border-purple-900/40 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-600 dark:text-purple-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Segmentation Pipeline</h4>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-semibold">Variable-Sized Logical Modules</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Logical address is specified as &lt;Segment s, Offset d&gt;. Segment Table checks Offset &lt; Limit and adds Base + Offset.
          </p>

          {/* Flow Diagram */}
          <div className="p-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 rounded font-bold">
                CPU Logical &lt;s, d&gt;
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-800 dark:text-purple-300 rounded">
                Segment Table (Base, Limit)
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 rounded font-bold">
                Limit Check (Offset &lt; Limit)
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                Physical Addr = Base + Offset
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagingIntro;
