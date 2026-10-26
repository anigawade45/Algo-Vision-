import { Cpu, ArrowRight } from 'lucide-react';

export function MemoryIntro() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
            Memory Subsystem
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What is Memory Management?
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          Memory management is the operating system function that coordinates and allocates main memory (RAM) to active processes. It tracks free and occupied memory, translates CPU-generated logical addresses to physical RAM locations, enforces access protection, and minimizes internal and external fragmentation.
        </p>
      </div>

      {/* Visual Flow: CPU -> MMU -> Physical RAM */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <h4 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-500" />
          <span>Address Translation Pipeline</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center text-center font-mono text-xs">
          {/* Step 1: Process CPU */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Process Code</div>
            <div className="text-slate-700 dark:text-slate-300">CPU Execution</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 2: Logical Address */}
          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 space-y-1">
            <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase">Logical Address</div>
            <div className="text-slate-600 dark:text-slate-300 font-bold">Offset (e.g., 120)</div>
          </div>

          <div className="hidden md:flex justify-center text-slate-400">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 3: MMU Translation */}
          <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 space-y-1">
            <div className="text-xs font-bold text-cyan-700 dark:text-cyan-400 uppercase">MMU Translation</div>
            <div className="text-slate-600 dark:text-slate-300 font-bold">Base + Logical</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-200 block">Logical Address</span>
              <span className="text-slate-500 text-[11px]">CPU-generated virtual location</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-200 block">Relocation Register</span>
              <span className="text-slate-500 text-[11px]">Base address in physical RAM</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-200 block">Physical Address</span>
              <span className="text-slate-500 text-[11px]">Actual hardware bus address</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoryIntro;
