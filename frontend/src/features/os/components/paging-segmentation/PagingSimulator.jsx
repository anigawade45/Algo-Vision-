import React, { useState, useEffect, useRef } from 'react';
import { Cpu, ArrowRight, Play, Pause, SkipForward, SkipBack, RotateCcw, CheckCircle2, ShieldCheck, Layers, Edit3, Info, Check, X } from 'lucide-react';

export function PagingSimulator() {
  // Inputs
  const [logicalAddress, setLogicalAddress] = useState(1234);
  const [pageSize, setPageSize] = useState(100);

  // Page Table Mappings State (Page # -> Frame #, valid)
  const [pageTable, setPageTable] = useState([
    { page: 0, frame: 3, valid: true },
    { page: 1, frame: 7, valid: true },
    { page: 2, frame: 1, valid: true },
    { page: 3, frame: 5, valid: true },
    { page: 4, frame: 2, valid: true },
    { page: 12, frame: 7, valid: true }
  ]);

  // Selected Page/Frame for visual highlighting
  const [selectedPage, setSelectedPage] = useState(12);

  // Step-by-Step Translation Controller State
  const [currentStep, setCurrentStep] = useState(0); // 0 to 6
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1500);
  const timerRef = useRef(null);

  // Computed values
  const pageNum = Math.floor(logicalAddress / pageSize);
  const offset = logicalAddress % pageSize;
  const pageEntry = pageTable.find(p => p.page === pageNum);
  const frameNum = pageEntry && pageEntry.valid ? pageEntry.frame : null;
  const isAddressValid = pageEntry && pageEntry.valid;
  const physicalAddress = isAddressValid ? frameNum * pageSize + offset : null;

  // Total frames in physical memory
  const totalFrames = 8;

  // Step details description
  const steps = [
    { title: 'Step 1: Read Logical Address', desc: `CPU generates Logical Address = ${logicalAddress}.` },
    { title: 'Step 2: Extract Page Number', desc: `Page Number = Math.floor(${logicalAddress} / ${pageSize}) = ${pageNum}.` },
    { title: 'Step 3: Extract Offset', desc: `Offset = ${logicalAddress} % ${pageSize} = ${offset}.` },
    { title: 'Step 4: Access Page Table', desc: `Lookup Page Table entry for Page ${pageNum}.` },
    { title: 'Step 5: Find Frame Number', desc: isAddressValid ? `Page ${pageNum} maps to Frame ${frameNum} (Valid = true).` : `Page ${pageNum} is NOT mapped in Page Table (Invalid Page Fault).` },
    { title: 'Step 6: Combine Frame + Offset', desc: isAddressValid ? `Physical Base = Frame ${frameNum} × Page Size (${pageSize}) = ${frameNum * pageSize}.` : 'Translation blocked.' },
    { title: 'Step 7: Generate Physical Address', desc: isAddressValid ? `Physical Address = ${frameNum * pageSize} + ${offset} = ${physicalAddress}.` : 'Invalid Address Fault.' }
  ];

  // Editable Page Table entry handler
  const handleUpdateMapping = (pageIndex, newFrame) => {
    const updated = [...pageTable];
    updated[pageIndex].frame = Math.max(0, Math.min(totalFrames - 1, Number(newFrame)));
    setPageTable(updated);
  };

  const handleToggleValid = (pageIndex) => {
    const updated = [...pageTable];
    updated[pageIndex].valid = !updated[pageIndex].valid;
    setPageTable(updated);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setCurrentStep(0);
    setLogicalAddress(1234);
    setPageSize(100);
    setSelectedPage(12);
  };

  const handleLoadExample = (exNum) => {
    handleReset();
    if (exNum === 1) {
      setLogicalAddress(1234);
      setPageSize(100);
      setSelectedPage(12);
    } else if (exNum === 2) {
      setLogicalAddress(2500);
      setPageSize(500);
      setSelectedPage(5);
      // Ensure Page 5 maps to Frame 4
      if (!pageTable.some(p => p.page === 5)) {
        setPageTable(prev => [...prev, { page: 5, frame: 4, valid: true }]);
      }
    } else if (exNum === 3) {
      // Non-contiguous mapping example
      setLogicalAddress(242);
      setPageSize(100);
      setSelectedPage(2);
    }
  };

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsRunning(false);
            return prev;
          }
        });
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed]);

  return (
    <div className="space-y-8">
      {/* Header & Simulator Inputs */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Paging Address Translation Laboratory</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Step-by-step translation from Logical Address ($p, d$) to Physical RAM Frame</p>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <button
              onClick={() => handleLoadExample(1)}
              className="px-2.5 py-1 bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-lg cursor-pointer"
            >
              Preset: Ex 1 (1234/100)
            </button>
            <button
              onClick={() => handleLoadExample(2)}
              className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg cursor-pointer"
            >
              Preset: Ex 2 (2500/500)
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div>
            <label className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">
              Logical Address
            </label>
            <input
              type="number"
              value={logicalAddress}
              onChange={(e) => setLogicalAddress(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-cyan-700 dark:text-cyan-400 block mb-1">
              Page Size (Bytes)
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value={64}>64 Bytes</option>
              <option value={100}>100 Bytes</option>
              <option value={128}>128 Bytes</option>
              <option value={256}>256 Bytes</option>
              <option value={500}>500 Bytes</option>
              <option value={512}>512 Bytes</option>
              <option value={1024}>1024 Bytes</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Calculated Split ($p, d$)
            </label>
            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono text-slate-900 dark:text-slate-100 font-bold flex items-center justify-between">
              <span>Page $p = {pageNum}$</span>
              <span>Offset $d = {offset}$</span>
            </div>
          </div>
        </div>

        {/* Educational Playback Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsRunning(!isRunning)}
              disabled={currentStep >= steps.length - 1}
              className={`px-4 py-2 rounded-lg font-medium text-xs flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Auto Run Steps'}</span>
            </button>

            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0 || isRunning}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStep >= steps.length - 1 || isRunning}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <span>Next</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-600 dark:text-slate-400">
            <span>Progress:</span>
            <div className="flex items-center gap-1">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    i === currentStep
                      ? 'bg-cyan-600 text-white animate-pulse'
                      : i < currentStep
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Current Active Step Box */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 rounded-xl space-y-1 font-mono text-xs">
          <div className="font-bold text-cyan-600 dark:text-cyan-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{steps[currentStep].title}</span>
          </div>
          <div className="text-slate-700 dark:text-slate-300 pl-6 leading-relaxed">
            {steps[currentStep].desc}
          </div>
        </div>
      </div>

      {/* Main 3-Column Interactive Visual Arena (Logical Memory -> Page Table -> Physical Memory) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Logical Address Space */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Logical Address Space
            </span>
            <span className="text-[10px] font-mono text-slate-500">Page Size = {pageSize} B</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto pr-1">
            {[0, 1, 2, 3, 4, 12].map((p) => {
              const isTarget = pageNum === p;
              const isSelected = selectedPage === p;

              return (
                <div
                  key={p}
                  onClick={() => setSelectedPage(p)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isTarget
                      ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-400 text-amber-900 dark:text-amber-300 font-bold shadow-md ring-2 ring-amber-500/40 scale-[1.01]'
                      : isSelected
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-400 text-blue-900 dark:text-blue-300'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Page {p}</span>
                    <span className="text-[10px] opacity-75">
                      Offset range: 0 – {pageSize - 1}
                    </span>
                  </div>
                  {isTarget && (
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 block mt-1">
                      CPU Targeted Page (Addr: {logicalAddress})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Interactive Page Table */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Page Table
            </span>
            <span className="text-[10px] font-mono text-slate-500">Page $\rightarrow$ Frame Map</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-[#1E2638] rounded-xl">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1E2638]">
                <tr>
                  <th className="p-2.5 font-bold">Page #</th>
                  <th className="p-2.5 font-bold">Frame #</th>
                  <th className="p-2.5 font-bold text-center">Valid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {pageTable.map((entry, idx) => {
                  const isTarget = pageNum === entry.page;
                  const isSelected = selectedPage === entry.page;

                  return (
                    <tr
                      key={entry.page}
                      onClick={() => setSelectedPage(entry.page)}
                      className={`transition-colors cursor-pointer ${
                        isTarget
                          ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold'
                          : isSelected
                          ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-900 dark:text-blue-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      <td className="p-2.5 font-bold">Page {entry.page}</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          value={entry.frame}
                          onChange={(e) => handleUpdateMapping(idx, e.target.value)}
                          className="w-14 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleValid(idx);
                          }}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                            entry.valid ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {entry.valid ? '✓ Valid' : '✗ Invalid'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Column 3: Physical Memory RAM (Frames) */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Physical RAM (Frames)
            </span>
            <span className="text-[10px] font-mono text-slate-500">8 Frames</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto pr-1">
            {Array.from({ length: totalFrames }).map((_, f) => {
              const mappedEntry = pageTable.find(p => p.frame === f && p.valid);
              const isTargetFrame = isAddressValid && frameNum === f;

              return (
                <div
                  key={f}
                  className={`p-3 rounded-xl border transition-all ${
                    isTargetFrame
                      ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-300 font-bold shadow-md scale-[1.01] ring-2 ring-emerald-500/40'
                      : mappedEntry
                      ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-300 dark:border-cyan-800 text-slate-800 dark:text-slate-200'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 border-dashed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Frame {f}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${
                      isTargetFrame
                        ? 'bg-emerald-500 text-white font-extrabold'
                        : mappedEntry
                        ? 'bg-cyan-200 dark:bg-cyan-500/30 text-cyan-900 dark:text-cyan-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {mappedEntry ? `Page ${mappedEntry.page}` : 'FREE FRAME'}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">
                    Physical Addr: {f * pageSize} – {(f + 1) * pageSize - 1}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PagingSimulator;
