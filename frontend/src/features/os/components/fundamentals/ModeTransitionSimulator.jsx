import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, Play, RotateCcw, ArrowRight, CheckCircle2, Code2, Lock, Unlock } from 'lucide-react';

export default function ModeTransitionSimulator() {
  const [selectedSyscall, setSelectedSyscall] = useState('read');
  const [currentStage, setCurrentStage] = useState(0); // 0: Idle User Mode, 1: Trap Trigger, 2: Kernel Mode Handler, 3: Return to User
  const [isSimulating, setIsSimulating] = useState(false);

  const syscalls = {
    read: {
      name: 'read(fd, buffer, count)',
      category: 'File Management',
      purpose: 'Reads data from an open file descriptor into a user buffer.',
      kernelHandler: 'sys_read() in fs/read_write.c',
      steps: [
        { title: 'User Mode (Ring 3, Mode Bit = 1)', detail: 'User program calls libc wrapper function read(). CPU is in User Mode (Mode Bit = 1). Direct hardware access is forbidden.', modeBit: 1, ring: 3 },
        { title: 'Software Trap / Interrupt (syscall)', detail: 'User program executes CPU trap instruction (e.g. syscall / int 0x80). Hardware atomically sets Mode Bit = 0 and jumps to Kernel Interrupt Vector.', modeBit: 0, ring: 0 },
        { title: 'Kernel Execution (Ring 0, Mode Bit = 0)', detail: 'Kernel sys_read() handler executes in Ring 0 with full privilege. Kernel verifies user memory buffers, reads disk sectors via device driver.', modeBit: 0, ring: 0 },
        { title: 'Return From Trap (sysret / iret)', detail: 'Kernel completes request, stores return code in CPU register, and executes sysret/iret instruction. Mode Bit restored to 1 (User Mode).', modeBit: 1, ring: 3 }
      ]
    },
    fork: {
      name: 'fork()',
      category: 'Process Control',
      purpose: 'Creates a new child process duplicating the calling parent process.',
      kernelHandler: 'sys_fork() / do_clone() in kernel/fork.c',
      steps: [
        { title: 'User Mode (Ring 3, Mode Bit = 1)', detail: 'Parent process invokes fork(). Code is executing in User Space with Mode Bit = 1.', modeBit: 1, ring: 3 },
        { title: 'Trap to Kernel', detail: 'CPU issues software interrupt. Privilege elevates from Ring 3 to Ring 0. Mode Bit switches from 1 to 0.', modeBit: 0, ring: 0 },
        { title: 'Process Cloning in Kernel', detail: 'Kernel allocates new Process Control Block (PCB), duplicates page tables, assigns new PID, and prepares child ready queue.', modeBit: 0, ring: 0 },
        { title: 'Dual Return (PID to parent, 0 to child)', detail: 'Kernel restores registers and returns control to user space with Mode Bit = 1.', modeBit: 1, ring: 3 }
      ]
    },
    malloc: {
      name: 'sbrk(increment) / mmap()',
      category: 'Memory Management',
      purpose: 'Expands the process heap memory segment when user libc malloc needs more heap space.',
      kernelHandler: 'sys_brk() in mm/mmap.c',
      steps: [
        { title: 'User Mode (Ring 3, Mode Bit = 1)', detail: 'User code calls malloc(1024). Libc determines heap overflow and invokes sbrk() syscall wrapper.', modeBit: 1, ring: 3 },
        { title: 'Trap Exception to Kernel', detail: 'Software interrupt triggered. Hardware switches Mode Bit to 0 (Kernel Mode).', modeBit: 0, ring: 0 },
        { title: 'Virtual Memory Allocation in Kernel', detail: 'Kernel adjusts process memory descriptor page allocation bounds in Ring 0.', modeBit: 0, ring: 0 },
        { title: 'Return Pointer to User Space', detail: 'Execution returns to Ring 3 with updated heap boundary pointer and Mode Bit = 1.', modeBit: 1, ring: 3 }
      ]
    }
  };

  const activeSyscall = syscalls[selectedSyscall];

  const handleNextStep = () => {
    if (currentStage < 3) {
      setCurrentStage(prev => prev + 1);
    } else {
      setCurrentStage(0);
    }
  };

  const handleAutoRun = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStage(0);

    let stage = 0;
    const interval = setInterval(() => {
      stage++;
      if (stage <= 3) {
        setCurrentStage(stage);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1500);
  };

  const activeStep = activeSyscall.steps[currentStage];
  const isKernelMode = activeStep.modeBit === 0;

  return (
    <div className="space-y-6">
      {/* Selector & Action Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-[#1E2638] pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Dual-Mode Operation & System Call Transition Simulator
            </h3>
            <p className="text-slate-550 dark:text-slate-400 text-xs">
              Simulate how modern CPUs switch between User Mode (Mode Bit = 1, Ring 3) and Kernel Mode (Mode Bit = 0, Ring 0) during system calls.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoRun}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Auto Simulate</span>
            </button>

            <button
              onClick={() => { setCurrentStage(0); setIsSimulating(false); }}
              className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Syscall Selector Buttons */}
        <div className="flex flex-wrap gap-3">
          {Object.keys(syscalls).map((key) => {
            const sc = syscalls[key];
            const isSelected = selectedSyscall === key;
            return (
              <button
                key={key}
                onClick={() => { setSelectedSyscall(key); setCurrentStage(0); }}
                className={`px-3.5 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 ring-1 ring-cyan-500/40 shadow-sm'
                    : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:border-cyan-500/30'
                }`}
              >
                {sc.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual Mode Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Ring 3 vs Ring 0 Diagram */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              CPU Privilege State & Mode Bit Indicator
            </span>

            {/* Mode Bit Display */}
            <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-2 font-mono font-bold text-xs transition-colors duration-300 ${
              isKernelMode
                ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 shadow-sm shadow-red-500/20'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm shadow-emerald-500/20'
            }`}>
              {isKernelMode ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-emerald-500" />}
              <span>MODE BIT = {activeStep.modeBit} ({isKernelMode ? 'KERNEL MODE' : 'USER MODE'})</span>
            </div>
          </div>

          {/* Concentric / Stack Privilege Rings */}
          <div className="space-y-4">
            {/* User Space (Ring 3) Box */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              !isKernelMode
                ? 'bg-emerald-500/5 border-emerald-500/40 ring-2 ring-emerald-500/20 shadow-md'
                : 'bg-slate-50/50 dark:bg-[#070A12]/50 border-slate-200 dark:border-[#1E2638] opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    User Space (Ring 3 - User Mode)
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Restricted Privileges
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                User processes (Browsers, Editors, Games) execute here. Cannot directly execute privileged I/O or access kernel address space.
              </p>
            </div>

            {/* Transition Vector Arrow */}
            <div className="flex items-center justify-center gap-3 py-1">
              <div className={`h-0.5 flex-1 transition-colors duration-300 ${currentStage === 1 || currentStage === 3 ? 'bg-amber-500 animate-pulse' : 'bg-slate-200 dark:bg-[#1E2638]'}`} />
              <div className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold transition-all ${
                currentStage === 1 || currentStage === 3
                  ? 'bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30 animate-pulse'
                  : 'bg-slate-100 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-500'
              }`}>
                {currentStage === 1 ? 'SW TRAP (sysenter / int 0x80)' : currentStage === 3 ? 'SYSRET / IRET' : 'Hardware Boundary'}
              </div>
              <div className={`h-0.5 flex-1 transition-colors duration-300 ${currentStage === 1 || currentStage === 3 ? 'bg-amber-500 animate-pulse' : 'bg-slate-200 dark:bg-[#1E2638]'}`} />
            </div>

            {/* Kernel Space (Ring 0) Box */}
            <div className={`p-5 rounded-2xl border transition-all duration-300 ${
              isKernelMode
                ? 'bg-red-500/10 border-red-500/40 ring-2 ring-red-500/30 shadow-md'
                : 'bg-slate-50/50 dark:bg-[#070A12]/50 border-slate-200 dark:border-[#1E2638] opacity-60'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                    Kernel Space (Ring 0 - Kernel Mode)
                  </h4>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                  Full CPU Privilege
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                OS Kernel, Device Drivers, Page Table management, and Interrupt Handlers execute here with direct CPU hardware access.
              </p>
            </div>
          </div>
        </div>

        {/* Execution Stepper & Details */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              Step {currentStage + 1} of 4 &bull; {activeSyscall.name}
            </span>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              {activeStep.title}
            </h3>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3].map((stepIdx) => (
              <button
                key={stepIdx}
                onClick={() => { setCurrentStage(stepIdx); setIsSimulating(false); }}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStage === stepIdx
                    ? 'bg-cyan-500 shadow-sm shadow-cyan-500/50'
                    : currentStage > stepIdx
                    ? 'bg-emerald-500'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              <Code2 className="w-4 h-4 text-cyan-500" />
              <span>{activeSyscall.kernelHandler}</span>
            </div>
            <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
              {activeStep.detail}
            </p>
          </div>

          {/* Step Advance Control */}
          <button
            onClick={handleNextStep}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <span>{currentStage < 3 ? 'Advance Next Stage' : 'Restart System Call Loop'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
