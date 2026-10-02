import React from 'react';
import {
  Disc,
  Layers,
  Zap,
  ArrowRight,
  Clock,
  RotateCw,
  Gauge,
  TrendingDown,
  RefreshCw,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function DiskIntro() {
  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              <Disc className="w-3.5 h-3.5" /> Secondary Storage & Disk I/O Subsystem
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Understanding Disk Scheduling Algorithms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
              Hard disk drives (HDD) access data by physically moving a read/write head assembly across concentric tracks. Disk Scheduling Algorithms minimize total <strong className="text-cyan-600 dark:text-cyan-400">Seek Time</strong> and head travel distance to optimize overall system I/O throughput.
            </p>
          </div>
        </div>

        {/* 3 Disk Access Time Components */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-500" /> Key Components of Disk Access Time
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-cyan-200/60 dark:border-cyan-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 font-mono">1. Seek Time</span>
                <Gauge className="w-4 h-4 text-cyan-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Time required to position the read/write head over the target track. <strong>Disk scheduling directly minimizes Seek Time!</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">2. Rotational Latency</span>
                <RotateCw className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Time required for the disk platter to rotate the desired sector under the read/write head (typically ~2-4ms at 7200 RPM).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">3. Transfer Time</span>
                <Zap className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Time required to read/write data blocks between disk surface and host system memory buffer.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Algorithms Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* FCFS Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              FCFS
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">First-Come, First-Served</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Services disk requests strictly in their original arrival sequence.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Pro:</span> Completely fair, zero starvation.
            <br />
            <span className="text-rose-500 font-semibold">Con:</span> High total head movement & wild seeking.
          </div>
        </div>

        {/* SSTF Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
              SSTF
            </span>
            <TrendingDown className="w-4 h-4 text-purple-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Shortest Seek Time First</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Selects the pending request with minimal seek distance from current head.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Pro:</span> Reduces average seek time significantly.
            <br />
            <span className="text-rose-500 font-semibold">Con:</span> Risk of starvation for distant tracks.
          </div>
        </div>

        {/* SCAN Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              SCAN
            </span>
            <Compass className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Elevator Algorithm</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Head moves to physical disk boundary, reverses, and services return path.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-amber-600 dark:text-amber-400 font-semibold">Pro:</span> Prevents starvation with uniform sweeps.
            <br />
            <span className="text-slate-500 font-semibold">Rule:</span> Touches boundary (e.g. 199 or 0).
          </div>
        </div>

        {/* C-SCAN Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              C-SCAN
            </span>
            <RefreshCw className="w-4 h-4 text-cyan-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Circular SCAN</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Services in one direction to boundary, then wraps around to opposite boundary.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Pro:</span> Uniform wait time across all tracks.
            <br />
            <span className="text-slate-500 font-semibold">Wraparound:</span> Counts jump distance (e.g. 199 ➔ 0).
          </div>
        </div>

        {/* LOOK Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              LOOK
            </span>
            <Layers className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Smart SCAN (LOOK)</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Reverses direction at the final request in path without traveling to boundary.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Optimization:</span> Eliminates empty boundary seek.
            <br />
            <span className="text-emerald-500 font-semibold">Behavior:</span> Reverses at last request.
          </div>
        </div>

        {/* C-LOOK Card */}
        <div className="rounded-xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3 hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
              C-LOOK
            </span>
            <RefreshCw className="w-4 h-4 text-indigo-500" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Circular LOOK</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Services in one direction, then jumps directly to the extreme request at opposite end.
          </p>
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#070A12] text-[11px] font-mono text-slate-600 dark:text-slate-400 space-y-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Optimization:</span> No boundary travel + uniform wait.
            <br />
            <span className="text-indigo-500 font-semibold">Popularity:</span> Widely used in modern OS kernels.
          </div>
        </div>
      </div>
    </div>
  );
}
