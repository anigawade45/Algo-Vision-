import { useState } from 'react';
import { Cpu, Shield, Layers, Clock, FileText, Sliders, Hash, Binary } from 'lucide-react';

export default function PcbInspector() {
  const [selectedPid, setSelectedPid] = useState(101);

  // Mock Processes with dynamic PCB attributes
  const [processes, setProcesses] = useState({
    101: {
      pid: 101,
      ppid: 1,
      name: 'chrome_render.exe',
      user: 'parvej (UID: 1000)',
      state: 'RUNNING',
      priority: 8,
      cpuTime: '124 ms',
      timeQuantum: '20 ms',
      programCounter: '0x004018A4',
      stackPointer: '0x7FFF0040',
      registers: {
        eax: '0x00000001',
        ebx: '0x00402010',
        ecx: '0x00000000',
        edx: '0x7FFF0000',
      },
      pageTableBase: '0x1F4A0000',
      codeSegment: '0x00400000 - 0x00450000',
      dataSegment: '0x00450000 - 0x00480000',
      heapSegment: '0x00480000 - 0x00600000',
      stackSegment: '0x7FF00000 - 0x7FFF0000',
      fileDescriptors: [
        { fd: 0, target: 'stdin (Keyboard)' },
        { fd: 1, target: 'stdout (Screen)' },
        { fd: 2, target: 'stderr (Log)' },
        { fd: 3, target: 'socket: 192.168.1.15:443' }
      ],
      ioDevices: ['GPU_0', 'NIC_Ethernet'],
      startTime: '18:32:01.412',
      executionTicks: 1420
    },
    204: {
      pid: 204,
      ppid: 101,
      name: 'vlc_decoder.exe',
      user: 'parvej (UID: 1000)',
      state: 'WAITING',
      priority: 6,
      cpuTime: '450 ms',
      timeQuantum: '20 ms',
      programCounter: '0x00802C10',
      stackPointer: '0x7FFF0090',
      registers: {
        eax: '0x000000FF',
        ebx: '0x00803000',
        ecx: '0x00000004',
        edx: '0x00000010',
      },
      pageTableBase: '0x2B800000',
      codeSegment: '0x00800000 - 0x008A0000',
      dataSegment: '0x008A0000 - 0x008C0000',
      heapSegment: '0x008C0000 - 0x00AF0000',
      stackSegment: '0x7FF00000 - 0x7FFF0000',
      fileDescriptors: [
        { fd: 0, target: 'stdin (Keyboard)' },
        { fd: 1, target: 'stdout (Screen)' },
        { fd: 2, target: 'stderr (Log)' },
        { fd: 3, target: '/media/video_stream.mp4' },
        { fd: 4, target: 'ALSA_Audio_Output' }
      ],
      ioDevices: ['Audio_Controller', 'Disk_SATA'],
      startTime: '18:34:10.890',
      executionTicks: 3890
    },
    312: {
      pid: 312,
      ppid: 1,
      name: 'postgres_worker',
      user: 'postgres (UID: 1001)',
      state: 'READY',
      priority: 9,
      cpuTime: '890 ms',
      timeQuantum: '20 ms',
      programCounter: '0x00551020',
      stackPointer: '0x7FFF0010',
      registers: {
        eax: '0x00000000',
        ebx: '0x00551100',
        ecx: '0x00000002',
        edx: '0x00000008',
      },
      pageTableBase: '0x3D950000',
      codeSegment: '0x00550000 - 0x005A0000',
      dataSegment: '0x005A0000 - 0x005E0000',
      heapSegment: '0x005E0000 - 0x00FF0000',
      stackSegment: '0x7FF00000 - 0x7FFF0000',
      fileDescriptors: [
        { fd: 0, target: 'stdin (Keyboard)' },
        { fd: 1, target: 'stdout (Screen)' },
        { fd: 2, target: 'stderr (Log)' },
        { fd: 3, target: '/var/lib/postgresql/data' }
      ],
      ioDevices: ['SSD_NVMe_0'],
      startTime: '18:20:00.000',
      executionTicks: 9540
    }
  });

  const activePcb = processes[selectedPid];

  // Helper to change state
  const handleStateChange = (newState) => {
    setProcesses(prev => ({
      ...prev,
      [selectedPid]: {
        ...prev[selectedPid],
        state: newState,
        executionTicks: prev[selectedPid].executionTicks + 10
      }
    }));
  };

  const stateBadges = {
    RUNNING: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    READY: 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    WAITING: 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    NEW: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    TERMINATED: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800',
  };

  return (
    <div className="space-y-8">
      {/* Introduction Banner */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                Kernel Data Structure
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Process Control Block (PCB) Inspector
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
              The PCB is an OS data structure stored in kernel memory space for every active process. When a context switch occurs, the OS saves CPU registers and pointers into the PCB, and restores them later.
            </p>
          </div>

          {/* Process Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select Process:</span>
            <div className="flex gap-2">
              {Object.values(processes).map((proc) => (
                <button
                  key={proc.pid}
                  onClick={() => setSelectedPid(proc.pid)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                    selectedPid === proc.pid
                      ? 'bg-cyan-600 border-cyan-600 text-white shadow-md'
                      : 'bg-slate-50 dark:bg-[#070A12] border-slate-200 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-cyan-500'
                  }`}
                >
                  PID {proc.pid}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PCB Structure Grid */}
      {activePcb && (
        <div className="space-y-6">
          {/* Top Bar: Process Meta & Live State Control */}
          <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/40 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-mono">
                    {activePcb.name}
                  </h4>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${stateBadges[activePcb.state]}`}>
                    {activePcb.state}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
                  <span>PID: <strong className="text-slate-800 dark:text-slate-200">{activePcb.pid}</strong></span>
                  <span>PPID: <strong className="text-slate-800 dark:text-slate-200">{activePcb.ppid}</strong></span>
                  <span>User: <strong className="text-slate-800 dark:text-slate-200">{activePcb.user}</strong></span>
                </div>
              </div>
            </div>

            {/* Live State Modifier */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#070A12] p-2 rounded-xl border border-slate-200 dark:border-[#1E2638]">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-cyan-500" />
                Simulate State Change:
              </span>
              {['READY', 'RUNNING', 'WAITING', 'TERMINATED'].map((st) => (
                <button
                  key={st}
                  onClick={() => handleStateChange(st)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activePcb.state === st
                      ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* PCB Main Sub-Blocks Grid (6 Blocks) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Block 1: Process Identification */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Hash className="w-4 h-4 text-cyan-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  1. Process Identification
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Process ID (PID):</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">{activePcb.pid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Parent PID (PPID):</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.ppid}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Executable Name:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.name}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Owner User:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.user}</span>
                </div>
              </div>
            </div>

            {/* Block 2: CPU Registers & Program Counter */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Binary className="w-4 h-4 text-purple-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  2. Program Counter & CPU Registers
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Program Counter (PC):</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{activePcb.programCounter}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Stack Pointer (SP):</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{activePcb.stackPointer}</span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 text-[11px] block mb-1">General Registers:</span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-900 text-slate-300 p-2 rounded-lg">
                    <div>EAX: <span className="text-cyan-400">{activePcb.registers.eax}</span></div>
                    <div>EBX: <span className="text-cyan-400">{activePcb.registers.ebx}</span></div>
                    <div>ECX: <span className="text-cyan-400">{activePcb.registers.ecx}</span></div>
                    <div>EDX: <span className="text-cyan-400">{activePcb.registers.edx}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block 3: CPU Scheduling Metadata */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Clock className="w-4 h-4 text-emerald-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  3. CPU Scheduling Info
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Priority Level:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Level {activePcb.priority}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Accumulated CPU Time:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.cpuTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Time Slice Quantum:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.timeQuantum}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Current Queue:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.state} Queue</span>
                </div>
              </div>
            </div>

            {/* Block 4: Memory Management Limits */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Layers className="w-4 h-4 text-amber-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  4. Memory Limits & Page Table
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Page Table Base Reg:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{activePcb.pageTableBase}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Code Range:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activePcb.codeSegment}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Data Range:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activePcb.dataSegment}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Heap Range:</span>
                  <span className="text-slate-700 dark:text-slate-300">{activePcb.heapSegment}</span>
                </div>
              </div>
            </div>

            {/* Block 5: File Descriptors & I/O Status */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <FileText className="w-4 h-4 text-blue-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  5. File Descriptor Table & I/O
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="space-y-1 bg-slate-50 dark:bg-[#070A12] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  {activePcb.fileDescriptors.map((fdObj) => (
                    <div key={fdObj.fd} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/40 last:border-none">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">fd[{fdObj.fd}]:</span>
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{fdObj.target}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-500">Allocated Devices:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.ioDevices.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Block 6: Accounting & Audit Stats */}
            <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                <Shield className="w-4 h-4 text-rose-500" />
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  6. Accounting & Audit Info
                </h5>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Process Start Time:</span>
                  <span className="text-slate-800 dark:text-slate-200">{activePcb.startTime}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Execution Clock Ticks:</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">{activePcb.executionTicks}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
                  <span className="text-slate-500">Kernel Stack Address:</span>
                  <span className="text-slate-800 dark:text-slate-200">0xFFFF88001F20</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Security Context:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">SELinux_Unconfined</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
