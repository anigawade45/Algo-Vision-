import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Cpu, Shield, Clock, Zap, CheckCircle2, ChevronRight, Activity, ArrowDown, ArrowUp } from 'lucide-react';

export default function ContextSwitchVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [switchCount, setSwitchCount] = useState(1);

  const steps = [
    {
      stepNumber: 1,
      title: 'Step 1: Process P1 Executing in User Mode',
      mode: 'USER_MODE',
      activeCpuProcess: 'P1',
      action: 'Process P1 is currently executing its instructions on the CPU core using its registers and stack.',
      cpuRegisters: { PC: '0x004012A0', SP: '0x7FFF0040', EAX: '0x00000042', EBX: '0x00000100' },
      pcb1: { state: 'RUNNING', PC: '0x00400000 (Stale)', SP: '0x7FFF0000 (Stale)', EAX: '0x00000000' },
      pcb2: { state: 'READY', PC: '0x008035F0 (Saved)', SP: '0x7FFF00B0 (Saved)', EAX: '0x00000099' },
      highlight: 'cpu'
    },
    {
      stepNumber: 2,
      title: 'Step 2: Interrupt Triggered (Timer Quantum Expired or System Call)',
      mode: 'KERNEL_MODE_TRANSITION',
      activeCpuProcess: 'P1 (Pausing)',
      action: 'Hardware timer interrupts CPU execution. CPU switches hardware privilege level from User Mode (Ring 3) to Kernel Mode (Ring 0).',
      cpuRegisters: { PC: '0x004012A4', SP: '0x7FFF0040', EAX: '0x00000042', EBX: '0x00000100' },
      pcb1: { state: 'RUNNING', PC: '0x00400000 (Stale)', SP: '0x7FFF0000 (Stale)', EAX: '0x00000000' },
      pcb2: { state: 'READY', PC: '0x008035F0 (Saved)', SP: '0x7FFF00B0 (Saved)', EAX: '0x00000099' },
      highlight: 'mode'
    },
    {
      stepNumber: 3,
      title: 'Step 3: Save Process P1 Registers & CPU State into PCB 1',
      mode: 'KERNEL_MODE',
      activeCpuProcess: 'Kernel Interrupt Handler',
      action: 'Kernel saves current CPU registers (PC: 0x004012A4, SP, EAX, EBX) into Process P1\'s PCB block in RAM memory.',
      cpuRegisters: { PC: '0x004012A4', SP: '0x7FFF0040', EAX: '0x00000042', EBX: '0x00000100' },
      pcb1: { state: 'READY', PC: '0x004012A4 (UPDATED)', SP: '0x7FFF0040 (UPDATED)', EAX: '0x00000042' },
      pcb2: { state: 'READY', PC: '0x008035F0 (Saved)', SP: '0x7FFF00B0 (Saved)', EAX: '0x00000099' },
      highlight: 'pcb1'
    },
    {
      stepNumber: 4,
      title: 'Step 4: Short-Term Scheduler Selects Process P2',
      mode: 'KERNEL_MODE',
      activeCpuProcess: 'CPU Scheduler Algorithm',
      action: 'OS CPU Scheduler examines Ready Queue, updates P1 state to READY, and selects process P2 for execution.',
      cpuRegisters: { PC: '0xFF001020 (Kernel)', SP: '0xFFFF8800', EAX: '0x00000000', EBX: '0x00000000' },
      pcb1: { state: 'READY', PC: '0x004012A4 (Saved)', SP: '0x7FFF0040 (Saved)', EAX: '0x00000042' },
      pcb2: { state: 'DISPATCHING', PC: '0x008035F0 (Saved)', SP: '0x7FFF00B0 (Saved)', EAX: '0x00000099' },
      highlight: 'scheduler'
    },
    {
      stepNumber: 5,
      title: 'Step 5: Load Process P2 CPU Registers & Memory Pointers from PCB 2',
      mode: 'KERNEL_MODE',
      activeCpuProcess: 'Kernel Context Loader',
      action: 'Kernel copies saved register values from P2\'s PCB into CPU hardware registers (PC: 0x008035F0, SP, EAX, EBX).',
      cpuRegisters: { PC: '0x008035F0', SP: '0x7FFF00B0', EAX: '0x00000099', EBX: '0x00000200' },
      pcb1: { state: 'READY', PC: '0x004012A4 (Saved)', SP: '0x7FFF0040 (Saved)', EAX: '0x00000042' },
      pcb2: { state: 'RUNNING', PC: '0x008035F0 (Loaded)', SP: '0x7FFF00B0 (Loaded)', EAX: '0x00000099' },
      highlight: 'pcb2'
    },
    {
      stepNumber: 6,
      title: 'Step 6: Return to User Mode & Resume Process P2 Execution',
      mode: 'USER_MODE',
      activeCpuProcess: 'P2',
      action: 'CPU switches privilege mode back to User Mode (Ring 3). Program Counter jumps to 0x008035F0 and P2 continues execution seamlessly.',
      cpuRegisters: { PC: '0x008035F0', SP: '0x7FFF00B0', EAX: '0x00000099', EBX: '0x00000200' },
      pcb1: { state: 'READY', PC: '0x004012A4 (Saved)', SP: '0x7FFF0040 (Saved)', EAX: '0x00000042' },
      pcb2: { state: 'RUNNING', PC: '0x008035F0 (Active)', SP: '0x7FFF00B0 (Active)', EAX: '0x00000099' },
      highlight: 'complete'
    }
  ];

  const currentStepData = steps[currentStep];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setSwitchCount(sc => sc + 1);
            return 0;
          }
          return prev + 1;
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              Animated Context Switching
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Process Context Switch Visualizer (P1 ↔ P2)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Watch the CPU save Process P1's state into PCB 1 in RAM and load Process P2's state from PCB 2 during a context switch.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            ← Prev
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Animate Switch'}</span>
          </button>

          <button
            onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold disabled:opacity-50 cursor-pointer"
          >
            Next →
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            title="Reset Animation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Step Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {steps.map((st, idx) => {
          const isActive = currentStep === idx;
          const isPassed = currentStep > idx;
          return (
            <button
              key={idx}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1 ${
                isActive
                  ? 'bg-cyan-600 border-cyan-600 text-white shadow-md scale-102 ring-2 ring-cyan-500/40'
                  : isPassed
                  ? 'bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900/50 text-slate-700 dark:text-slate-300'
                  : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-[#1E2638] text-slate-500'
              }`}
            >
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider">
                Step {st.stepNumber}
              </div>
              <div className="text-xs font-extrabold truncate">
                {st.title.split(':')[1]}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Context Switch Animation Theater */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6">
        {/* Step Banner & CPU Mode Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
              {currentStepData.title}
            </span>
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium mt-1 leading-relaxed">
              {currentStepData.action}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono text-slate-400">Privilege Mode:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-extrabold border ${
              currentStepData.mode === 'USER_MODE'
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 animate-pulse'
            }`}>
              {currentStepData.mode === 'USER_MODE' ? '🛡️ USER MODE (Ring 3)' : '⚡ KERNEL MODE (Ring 0)'}
            </span>
          </div>
        </div>

        {/* 3 Component Layout: PCB 1 (RAM) <--- CPU REGISTERS ---> PCB 2 (RAM) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* PCB 1 (Left Col 3) */}
          <div className={`lg:col-span-3 rounded-2xl p-5 border-2 transition-all space-y-3 ${
            currentStepData.highlight === 'pcb1'
              ? 'bg-amber-500/10 border-amber-500 ring-4 ring-amber-500/30 shadow-lg scale-102'
              : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638]'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Process 1 PCB</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentStepData.pcb1.state === 'RUNNING'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {currentStepData.pcb1.state}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Saved PC:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentStepData.pcb1.PC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saved SP:</span>
                <span className="text-slate-700 dark:text-slate-300">{currentStepData.pcb1.SP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saved EAX:</span>
                <span className="text-slate-700 dark:text-slate-300">{currentStepData.pcb1.EAX}</span>
              </div>
            </div>

            {currentStepData.highlight === 'pcb1' && (
              <div className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center gap-1 pt-1">
                <ArrowUp className="w-3.5 h-3.5 animate-bounce" />
                <span>SAVING P1 CPU REGISTERS</span>
              </div>
            )}
          </div>

          {/* Central CPU Core Registers (Center Col 6) */}
          <div className={`lg:col-span-6 rounded-2xl p-6 border-2 transition-all space-y-4 shadow-xl ${
            currentStepData.highlight === 'cpu'
              ? 'bg-emerald-500/10 border-emerald-500 ring-4 ring-emerald-500/30'
              : 'bg-slate-900 border-slate-800 text-white'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h4 className="font-extrabold text-base text-white">
                  CPU Execution Core 0
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                Active: {currentStepData.activeCpuProcess}
              </span>
            </div>

            {/* Hardware Registers Display */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Program Counter (PC)</span>
                <span className="text-cyan-400 font-bold text-sm">{currentStepData.cpuRegisters.PC}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Stack Pointer (SP)</span>
                <span className="text-amber-400 font-bold text-sm">{currentStepData.cpuRegisters.SP}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Accumulator (EAX)</span>
                <span className="text-emerald-400 font-bold text-sm">{currentStepData.cpuRegisters.EAX}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] block">Base Register (EBX)</span>
                <span className="text-purple-400 font-bold text-sm">{currentStepData.cpuRegisters.EBX}</span>
              </div>
            </div>
          </div>

          {/* PCB 2 (Right Col 3) */}
          <div className={`lg:col-span-3 rounded-2xl p-5 border-2 transition-all space-y-3 ${
            currentStepData.highlight === 'pcb2'
              ? 'bg-cyan-500/10 border-cyan-500 ring-4 ring-cyan-500/30 shadow-lg scale-102'
              : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638]'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">Process 2 PCB</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                currentStepData.pcb2.state === 'RUNNING'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300'
              }`}>
                {currentStepData.pcb2.state}
              </span>
            </div>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Saved PC:</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentStepData.pcb2.PC}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saved SP:</span>
                <span className="text-slate-700 dark:text-slate-300">{currentStepData.pcb2.SP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Saved EAX:</span>
                <span className="text-slate-700 dark:text-slate-300">{currentStepData.pcb2.EAX}</span>
              </div>
            </div>

            {currentStepData.highlight === 'pcb2' && (
              <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center gap-1 pt-1">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                <span>LOADING P2 REGISTERS TO CPU</span>
              </div>
            )}
          </div>
        </div>

        {/* Overhead & Performance Cost Info */}
        <div className="rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] p-4 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Context Switching Overhead & Hardware Costs:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-600 dark:text-slate-400 text-[11px]">
            <div>
              <strong className="text-slate-900 dark:text-white">1. Direct Overhead (~1-5 μs):</strong> CPU cycles spent executing kernel handler code, saving registers, and updating PCB data structures rather than running user code.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">2. Indirect Cost (Cache Trashing):</strong> CPU L1/L2 caches and TLB (Translation Lookaside Buffer) entries are invalidated, causing temporary cache misses for process P2.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">3. System Trade-off:</strong> Smaller time quantum improves system responsiveness but increases total context switch overhead.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
