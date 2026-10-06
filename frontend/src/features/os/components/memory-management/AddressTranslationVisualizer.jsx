import React, { useState } from 'react';
import { Cpu, ArrowRight, ShieldAlert, CheckCircle2, ShieldCheck, AlertOctagon, RotateCcw, Layers, HardDrive } from 'lucide-react';

export function AddressTranslationVisualizer() {
  // MMU State
  const [logicalAddr, setLogicalAddr] = useState(120);
  const [baseAddr, setBaseAddr] = useState(5000);
  const [limit, setLimit] = useState(1000);
  const [bindingMode, setBindingMode] = useState('execution'); // compile, load, execution

  // Calculated Physical Address & Validation
  const isValid = logicalAddr >= 0 && logicalAddr < limit;
  const physicalAddr = isValid ? baseAddr + logicalAddr : null;

  const handleReset = () => {
    setLogicalAddr(120);
    setBaseAddr(5000);
    setLimit(1000);
  };

  return (
    <div className="space-y-8">
      {/* MMU Interactive Address Translation Simulator */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">MMU Address Translation Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Memory Management Unit (MMU) relocation register & limit boundary validation</p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Inputs</span>
          </button>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div>
            <label className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">
              Logical Address (CPU Offset)
            </label>
            <input
              type="number"
              value={logicalAddr}
              onChange={(e) => setLogicalAddr(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 block mb-1">
              Base Address (Relocation Register)
            </label>
            <input
              type="number"
              value={baseAddr}
              onChange={(e) => setBaseAddr(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 block mb-1">
              Limit Register (Process Size)
            </label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Translation Flow & Pipeline Diagram */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            {/* CPU Logical Address */}
            <div className="p-4 rounded-xl bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/40 text-center space-y-1 w-full md:w-1/4">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase block">1. CPU Request</span>
              <div className="text-base font-extrabold text-amber-900 dark:text-amber-300">Logical: {logicalAddr}</div>
              <span className="text-[10px] text-slate-500 block">Relative Offset</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Limit Check */}
            <div className={`p-4 rounded-xl border text-center space-y-1 w-full md:w-1/4 transition-all ${
              isValid
                ? 'bg-blue-100 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300'
                : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/50 text-rose-900 dark:text-rose-300 animate-pulse'
            }`}>
              <span className="text-[10px] font-bold uppercase block">2. Boundary Check</span>
              <div className="text-sm font-bold">{logicalAddr} &lt; {limit} ?</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isValid ? 'bg-emerald-200 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-200 dark:bg-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                {isValid ? 'YES (VALID)' : 'NO (VIOLATION)'}
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Base Adder */}
            <div className="p-4 rounded-xl bg-cyan-100 dark:bg-cyan-500/15 border border-cyan-300 dark:border-cyan-500/40 text-center space-y-1 w-full md:w-1/4">
              <span className="text-[10px] text-cyan-700 dark:text-cyan-400 font-bold uppercase block">3. Base Addition</span>
              <div className="text-sm font-extrabold text-cyan-900 dark:text-cyan-300">
                {isValid ? `${baseAddr} + ${logicalAddr}` : 'N/A'}
              </div>
              <span className="text-[10px] text-slate-500 block">Base Register = {baseAddr}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Physical RAM Location */}
            <div className={`p-4 rounded-xl border text-center space-y-1 w-full md:w-1/4 ${
              isValid
                ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-300 shadow-md'
                : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/50 text-rose-900 dark:text-rose-300'
            }`}>
              <span className="text-[10px] font-bold uppercase block">4. RAM Physical Address</span>
              <div className="text-base font-extrabold">
                {isValid ? physicalAddr : 'TRAP EXCEPTION'}
              </div>
              <span className="text-[10px] opacity-80 block">
                {isValid ? `RAM Location ${physicalAddr}` : 'Segmentation Fault'}
              </span>
            </div>
          </div>

          {/* Validation Result Banner */}
          {isValid ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>ADDRESS TRANSLATED:</strong> Physical Address = Base ({baseAddr}) + Logical ({logicalAddr}) = <strong>{physicalAddr}</strong>.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-500/30 font-bold">
                RANGE: [{baseAddr} – {baseAddr + limit - 1}]
              </span>
            </div>
          ) : (
            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs font-mono text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                <strong>TRAP / INVALID ADDRESS:</strong> Logical Address ({logicalAddr}) exceeds Limit Register ({limit}). CPU traps to OS with addressing error!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Address Binding Modes Section */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">3 Address Binding Stages</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">When and how program instructions are bound to physical memory locations</p>
        </div>

        {/* Binding Stage Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setBindingMode('compile')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              bindingMode === 'compile'
                ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block mb-1">1. Compile-Time Binding</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Absolute Code</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              If memory location is known at compile time, absolute physical addresses are generated directly. Recompilation is required if load address changes.
            </p>
          </button>

          <button
            onClick={() => setBindingMode('load')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              bindingMode === 'load'
                ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block mb-1">2. Load-Time Binding</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Relocatable Code</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Compiler generates relocatable code. Final physical binding is calculated by loader when program is inserted into RAM.
            </p>
          </button>

          <button
            onClick={() => setBindingMode('execution')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              bindingMode === 'execution'
                ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'
            }`}
          >
            <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block mb-1">3. Execution-Time Binding</span>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-200 mb-1">Dynamic Hardware MMU</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
              Binding is delayed until runtime execution. Allows process memory blocks to move dynamically during execution via MMU hardware registers.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressTranslationVisualizer;
