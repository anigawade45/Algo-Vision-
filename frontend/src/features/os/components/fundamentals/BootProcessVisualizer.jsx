import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Power, Cpu, HardDrive, Disc, CheckCircle2, Play, Pause, RotateCcw, ChevronRight, Terminal } from 'lucide-react';

export default function BootProcessVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const bootStages = [
    {
      id: 'post',
      stageNumber: 1,
      title: 'Power-On Self-Test (POST)',
      subtitle: 'Hardware Health Check & Firmware Execution',
      icon: Power,
      badge: 'Hardware Reset',
      description: 'Power is supplied to motherboard. CPU initializes registers to reset vector (address 0xFFFF0) and executes motherboard firmware (BIOS/UEFI).',
      actions: [
        'CPU registers loaded with firmware reset vector',
        'POST checks RAM sticks, GPU, Keyboard, and Storage hardware health',
        'Emits POST beep code or status LED diagnostics'
      ],
      memoryAddress: '0xFFFF0 (ROM)',
      component: 'BIOS / UEFI ROM Chip'
    },
    {
      id: 'firmware',
      stageNumber: 2,
      title: 'BIOS / UEFI Initialization',
      subtitle: 'Boot Device Selection & Partition Lookup',
      icon: Cpu,
      badge: 'Boot Order',
      description: 'Firmware scans configured storage devices (NVMe SSD, SATA HDD, USB) according to priority order to locate the primary boot device.',
      actions: [
        'Reads CMOS / NVRAM storage settings',
        'Scans MBR sector or UEFI EFI System Partition (ESP)',
        'Loads initial bootloader sector into RAM'
      ],
      memoryAddress: '0x0000:0x7C00',
      component: 'NVRAM / Motherboard Firmware'
    },
    {
      id: 'mbr',
      stageNumber: 3,
      title: 'MBR / GPT Partition Loading',
      subtitle: 'Sector 0 & EFI Boot Sector Read',
      icon: Disc,
      badge: '512-Byte Sector',
      description: 'The first 512-byte sector of the boot drive (MBR) or EFI partition file (bootx64.efi) is loaded into physical RAM address 0x7C00.',
      actions: [
        'Validates boot signature (0x55AA magic bytes)',
        'Parses partition table entries',
        'Transfers CPU control to Stage-1 Bootloader'
      ],
      memoryAddress: 'RAM 0x7C00',
      component: 'Master Boot Record / ESP'
    },
    {
      id: 'bootloader',
      stageNumber: 4,
      title: 'Bootloader Execution (GRUB)',
      subtitle: 'Mode Switching & Kernel Loading',
      icon: HardDrive,
      badge: 'GRUB / WinLoad',
      description: 'GRUB (GRand Unified Bootloader) loads kernel image (vmlinuz) and initial RAM filesystem (initrd) into memory. Switches CPU from 16-bit Real Mode to 64-bit Long Mode.',
      actions: [
        'Displays OS selection menu if multi-boot configured',
        'Loads vmlinuz (compressed Linux kernel) into RAM',
        'Switches CPU CR0 register to enable Protected / Long Mode'
      ],
      memoryAddress: 'RAM Low / High Mem',
      component: 'GRUB2 / Windows Boot Manager'
    },
    {
      id: 'kernel',
      stageNumber: 5,
      title: 'Kernel Loading & Device Init',
      subtitle: 'Decompression & Subsystem Startup',
      icon: Cpu,
      badge: 'Kernel Mode (Ring 0)',
      description: 'Kernel decompresses into RAM, initializes memory paging structures, detects hardware devices, loads device drivers, and mounts root filesystem (/).',
      actions: [
        'Initializes CPU page tables & virtual memory manager',
        'Loads built-in kernel modules and hardware device drivers',
        'Mounts root filesystem (/) read-only for integrity check'
      ],
      memoryAddress: 'Kernel Space (Ring 0)',
      component: 'vmlinuz Kernel Binary'
    },
    {
      id: 'init',
      stageNumber: 6,
      title: 'Userspace Init / systemd (PID 1)',
      subtitle: 'First User Process & System Services',
      icon: Terminal,
      badge: 'PID 1 (Ring 3)',
      description: 'Kernel launches the first userspace process: systemd (or /sbin/init) with Process ID 1. Systemd spawns background daemons, network services, and GUI desktop manager.',
      actions: [
        'Executes systemd / init process as PID 1 in User Mode',
        'Starts networking, sshd, display managers (GDM/SDDM)',
        'Renders user login prompt / Graphical Desktop GUI'
      ],
      memoryAddress: 'User Space (Ring 3)',
      component: '/sbin/init or systemd'
    }
  ];

  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= bootStages.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, bootStages.length]);

  const activeStage = bootStages[currentStep];

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Step-by-Step OS Boot Process Visualizer
          </h3>
          <p className="text-slate-550 dark:text-slate-400 text-xs">
            Follow the boot sequence from hardware power-on POST to initial RAM disk, kernel loading, and systemd process startup.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                : 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Auto Boot' : 'Auto Play Boot'}</span>
          </button>

          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 cursor-pointer transition-all"
            title="Restart Boot Sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stepper Navigation Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {bootStages.map((stage, idx) => {
          const isActive = currentStep === idx;
          const isPassed = currentStep > idx;

          return (
            <button
              key={stage.id}
              onClick={() => { setCurrentStep(idx); setIsPlaying(false); }}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/30 font-bold'
                  : isPassed
                  ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-500 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/40">
                  STAGE {stage.stageNumber}
                </span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>

              <span className="text-xs font-bold font-mono line-clamp-1 block text-slate-900 dark:text-white">
                {stage.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-[#1E2638] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <activeStage.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                  Stage {activeStage.stageNumber} of 6
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                  {activeStage.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Addr: {activeStage.memoryAddress}
              </span>
              <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {activeStage.badge}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
            {activeStage.description}
          </p>

          {/* Step Actions List */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Sequential Micro-Operations Executed
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeStage.actions.map((act, i) => (
                <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>Action {i + 1}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                    {act}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
