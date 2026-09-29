import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AppWindow, Terminal, Cpu, HardDrive, Play, CheckCircle2, ArrowDown, Info } from 'lucide-react';

export default function OsArchitectureViewer() {
  const [activeLayerId, setActiveLayerId] = useState('kernel');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0); // 0 to 4

  const layers = [
    {
      id: 'user',
      name: '1. User Layer',
      subtitle: 'End Users & Humans',
      icon: User,
      mode: 'User Mode',
      color: 'from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-600 dark:text-cyan-400',
      activeBorder: 'border-cyan-500 ring-2 ring-cyan-500/30',
      description: 'End users who interact with the system via Graphical User Interfaces (GUI), Command Line Interfaces (CLI), or voice commands.',
      responsibilities: [
        'Issues commands and launches applications',
        'Receives visual output, audio, and application state feedback',
        'Operates entirely in isolated User Space'
      ],
      examples: ['System Administrator', 'Software Engineer', 'Standard Desktop User']
    },
    {
      id: 'apps',
      name: '2. User Applications',
      subtitle: 'Software & Programs',
      icon: AppWindow,
      mode: 'User Mode (Ring 3)',
      color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/40 text-indigo-600 dark:text-indigo-400',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/30',
      description: 'User-space programs, utilities, and applications executed by the user or OS startup scripts.',
      responsibilities: [
        'Executes application business logic in restricted User Space',
        'Cannot directly access physical hardware registers or memory',
        'Requests system services via System Calls (API calls)'
      ],
      examples: ['Web Browsers (Chrome)', 'Code Editors (VS Code)', 'Database Servers', 'Media Players']
    },
    {
      id: 'syscalls',
      name: '3. System Call Interface (API)',
      subtitle: 'User Space ↔ Kernel Space Gateway',
      icon: Terminal,
      mode: 'Transition Boundary (Trap / Interrupt)',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/30',
      description: 'The standard programmatic interface through which user programs request services from the Operating System Kernel.',
      responsibilities: [
        'Provides a safe bridge between User Mode (Ring 3) and Kernel Mode (Ring 0)',
        'Triggers software interrupts / traps (e.g. syscall / int 0x80 instructions)',
        'Switches privilege Mode Bit from 1 (User) to 0 (Kernel)'
      ],
      examples: ['POSIX API (open, read, fork, exec)', 'Win32 API (CreateProcess, ReadFile)']
    },
    {
      id: 'kernel',
      name: '4. Operating System Kernel',
      subtitle: 'Core OS Engine',
      icon: Cpu,
      mode: 'Kernel Mode (Ring 0)',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/30',
      description: 'The core component of an OS that manages system resources and hardware devices with complete hardware privilege.',
      responsibilities: [
        'Process & Thread Scheduling (CPU allocation)',
        'Memory Virtualization & Page Management (RAM allocation)',
        'File Systems & Device Driver communication',
        'Interrupt handling and hardware security enforcement'
      ],
      examples: ['Linux Kernel', 'Windows NT Kernel', 'XNU Kernel (macOS/iOS)']
    },
    {
      id: 'hardware',
      name: '5. Hardware Layer',
      subtitle: 'Physical Machines & Devices',
      icon: HardDrive,
      mode: 'Physical Layer',
      color: 'from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-600 dark:text-purple-400',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/30',
      description: 'The physical electronic components executing raw binary instructions and persisting data.',
      responsibilities: [
        'CPU: Executes instructions and performs arithmetic/logic calculations',
        'RAM: Volatile primary storage for active process memory',
        'Storage: SSD / HDD persistent storage',
        'I/O Devices: Keyboard, Mouse, Network Interface Cards (NIC), GPU'
      ],
      examples: ['Intel Core / AMD Ryzen CPU', 'DDR5 Memory Sticks', 'NVMe SSD', 'Ethernet NIC']
    }
  ];

  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(0);
    setActiveLayerId('user');

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current < layers.length) {
        setSimStep(current);
        setActiveLayerId(layers[current].id);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setSimStep(0);
        }, 1000);
      }
    }, 1200);
  };

  const selectedLayer = layers.find(l => l.id === activeLayerId) || layers[3];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            OS Architecture Stack
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs">
            Click any architectural layer to inspect its responsibilities, execution mode, and real-world examples.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isSimulating}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md ${
            isSimulating
              ? 'bg-amber-500 text-white opacity-80 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/20'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{isSimulating ? `Flowing Request: Step ${simStep + 1}/5` : 'Simulate System Request Flow'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Layer Stack Diagram */}
        <div className="lg:col-span-6 space-y-3">
          {layers.map((layer, idx) => {
            const IconComponent = layer.icon;
            const isSelected = activeLayerId === layer.id;
            const isSimActive = isSimulating && simStep === idx;

            return (
              <React.Fragment key={layer.id}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => !isSimulating && setActiveLayerId(layer.id)}
                  className={`p-4 rounded-2xl border bg-gradient-to-r ${layer.color} cursor-pointer transition-all relative overflow-hidden ${
                    isSelected ? layer.activeBorder : 'hover:border-slate-300 dark:hover:border-[#1E2638]'
                  }`}
                >
                  <div className="flex items-center justify-between z-10 relative">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white dark:bg-[#070A12] shadow-xs ${layer.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm font-mono">
                          {layer.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-mono">
                          {layer.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/40 border border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 block">
                        {layer.mode}
                      </span>
                    </div>
                  </div>

                  {/* Pulse wave when simulation hits this step */}
                  {isSimActive && (
                    <motion.div
                      layoutId="pulse"
                      className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                  )}
                </motion.div>

                {/* Connecting Arrow */}
                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-1 text-slate-300 dark:text-slate-700">
                    <ArrowDown className={`w-4 h-4 ${isSimulating && simStep === idx ? 'text-cyan-500 animate-bounce' : ''}`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Detailed Inspection Panel */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1E2638] pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    <selectedLayer.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {selectedLayer.name}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedLayer.subtitle}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] text-cyan-600 dark:text-cyan-400">
                  {selectedLayer.mode}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Description & Purpose
                </span>
                <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                  {selectedLayer.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Key Responsibilities
                </span>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {selectedLayer.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-50 dark:bg-[#070A12] p-2.5 rounded-xl border border-slate-100 dark:border-[#1E2638]">
                      <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Real-World Components / Examples
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedLayer.examples.map((ex, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-semibold"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
