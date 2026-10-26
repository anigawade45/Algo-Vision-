import { ShieldCheck, ShieldAlert, Zap, ArrowRight } from 'lucide-react';

export default function BankerIntro() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
            Deadlock Avoidance
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            What is the Banker's Algorithm?
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed">
          Developed by Edsger Dijkstra, the <strong>Banker's Algorithm</strong> is a classic deadlock avoidance algorithm designed for operating systems. Named after banking systems that ensure a bank never allocates cash beyond its reserves to guarantee all customers can eventually be satisfied, the OS checks every process resource request to guarantee the system remains in a <strong>SAFE STATE</strong>.
        </p>
      </div>

      {/* Visual Request Decision Flowchart */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 space-y-4 border border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
            Safety Decision Workflow
          </span>
          <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
            Runtime Evaluation
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center font-mono text-xs py-2">
          <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 w-full md:w-auto">
            Process Request (Pi)
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden md:block" />
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-300 w-full md:w-auto">
            Safety Simulation Check
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 hidden md:block" />

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-300">
              <span className="font-bold block text-sm">SAFE STATE ✓</span>
              <span className="text-[10px] text-slate-400">Grant Request Immediately</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950 border border-amber-700 text-amber-300">
              <span className="font-bold block text-sm">UNSAFE STATE ✗</span>
              <span className="text-[10px] text-slate-400">Force Process to Wait</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safe vs Unsafe State Distinction */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Safe State Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Safe State
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A state is <strong>Safe</strong> if there exists at least one <strong className="text-emerald-600 dark:text-emerald-400">Safe Sequence</strong> of processes <code className="font-mono">&lt;P1, P3, P4, P0, P2&gt;</code> such that every process can obtain its maximum required resources, complete execution, and release allocated resources.
          </p>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs font-mono text-emerald-700 dark:text-emerald-300">
            ✓ Deadlock is IMPOSSIBLE in a Safe State.
          </div>
        </div>

        {/* Unsafe State Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-amber-200 dark:border-amber-900/40 p-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h4 className="font-bold text-base text-slate-900 dark:text-white">
              Unsafe State
            </h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            A state is <strong>Unsafe</strong> if no safe execution sequence can be found. The OS cannot guarantee that all processes will finish without stalling.
          </p>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs font-mono text-amber-700 dark:text-amber-300">
            ⚠️ Unsafe State ≠ Deadlock! (An unsafe state MAY lead to a deadlock if processes request maximum demands simultaneously).
          </div>
        </div>
      </div>

      {/* Formula Spotlight */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-500" />
          <span>Core Matrix Equation: Need Calculation</span>
        </h4>
        <div className="bg-slate-900 text-cyan-400 font-mono text-sm sm:text-base p-4 rounded-xl border border-slate-800 text-center font-extrabold tracking-wider">
          Need[i][j] = Maximum[i][j] - Allocation[i][j]
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
          The remaining resources a process might request during its execution is equal to its maximum declared requirement minus what it currently holds.
        </p>
      </div>
    </div>
  );
}
