import { useState } from 'react';
import { HardDrive, Cpu, FileCode, Layers, ArrowUp, ArrowDown, CheckCircle2, Copy } from 'lucide-react';

export default function ProgramVsProcessCard() {
  const [selectedSegment, setSelectedSegment] = useState('stack');
  const [spawnCount, setSpawnCount] = useState(3);

  const memorySegments = [
    {
      id: 'stack',
      name: 'Stack Segment',
      direction: 'Grows Downward ↓',
      color: 'from-amber-500/20 to-amber-600/30 border-amber-500/40 text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      description: 'Contains function call frames, local variables, return addresses, and parameter values. Allocated and freed automatically during function entry and exit.',
      details: [
        'Managed automatically by CPU Stack Pointer (SP)',
        'LIFO (Last In First Out) function invocation frame stack',
        'Stack Overflow occurs if recursive calls exceed memory limit',
        'Variables scope is limited to block/function execution'
      ],
      example: 'void calculate(int x) { int result = x * 2; } // local result stored in Stack'
    },
    {
      id: 'heap',
      name: 'Heap Segment',
      direction: 'Grows Upward ↑',
      color: 'from-cyan-500/20 to-cyan-600/30 border-cyan-500/40 text-cyan-600 dark:text-cyan-400',
      badgeBg: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
      description: 'Dynamically allocated memory requested at runtime (e.g. malloc/free in C/C++, new in Java/JS). Shared across functions.',
      details: [
        'Requires explicit allocation and deallocation (or Garbage Collector)',
        'Unfreed memory leads to memory leaks',
        'Slower access compared to stack due to pointer dereferencing',
        'Flexible size determined dynamically while process runs'
      ],
      example: 'int* arr = (int*) malloc(100 * sizeof(int)); // Memory allocated on Heap'
    },
    {
      id: 'data',
      name: 'Data Segment (Initialized & BSS)',
      direction: 'Fixed Size',
      color: 'from-emerald-500/20 to-emerald-600/30 border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      description: 'Contains global and static variables. Split into Initialized Data (pre-set values) and BSS (Block Started by Symbol, zero-initialized).',
      details: [
        'Initialized Data: global int total = 100;',
        'Uninitialized Data (BSS): global int buffer[1024]; (initialized to 0 by OS on load)',
        'Persists for the entire lifespan of the process',
        'Accessible by all functions within the process address space'
      ],
      example: 'static int global_counter = 0; // Stored in Data Segment'
    },
    {
      id: 'text',
      name: 'Text Segment (Code)',
      direction: 'Fixed Size (Read Only)',
      color: 'from-purple-500/20 to-purple-600/30 border-purple-500/40 text-purple-600 dark:text-purple-400',
      badgeBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800',
      description: 'Contains compiled CPU machine instructions (executable code). Marked Read-Only to prevent self-modifying code bugs and security exploits.',
      details: [
        'Read-Only memory permission prevents accidental code overwrites',
        'Sharable across multiple running process instances of the same program',
        'Program Counter (PC) register points to current instruction in Text segment',
        'Loaded directly from compiled binary ELF / EXE file on disk'
      ],
      example: 'MOV EAX, [EBX] ; Machine code executed by CPU'
    }
  ];

  const activeSegmentData = memorySegments.find(s => s.id === selectedSegment);

  return (
    <div className="space-y-8">
      {/* Overview Cards: Program vs Process */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Program Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Program</h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Passive Entity on Secondary Storage</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Static File
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A executable file (e.g. <code className="font-mono text-cyan-600 dark:text-cyan-400">chrome.exe</code> or <code className="font-mono text-cyan-600 dark:text-cyan-400">/usr/bin/python</code>) containing machine code and resources stored on a hard disk or SSD. It does nothing until loaded into RAM.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
              <span className="font-medium text-slate-500">Storage Location:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">Disk / SSD Storage</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
              <span className="font-medium text-slate-500">Lifespan:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">Permanent until uninstalled</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-slate-500">Resource Usage:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">Only Disk Space</span>
            </div>
          </div>
        </div>

        {/* Process Card */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-cyan-200 dark:border-cyan-900/50 p-6 shadow-sm hover:border-cyan-300 dark:hover:border-cyan-700 transition-all space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 flex items-center justify-center text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Process</h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-medium">Active Instance in Main Memory (RAM)</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 animate-pulse">
              Active Execution
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            A program loaded into RAM, allocated CPU execution cycles, memory segments (Stack, Heap, Data, Text), and tracked by the Kernel using a <strong className="text-slate-900 dark:text-slate-200">Process Control Block (PCB)</strong>.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
              <span className="font-medium text-slate-500">Storage Location:</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">RAM + CPU Registers</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/40">
              <span className="font-medium text-slate-500">Lifespan:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">Transient (Spawn → Terminate)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="font-medium text-slate-500">Resource Usage:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">CPU, RAM, PCB, I/O Handles</span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Instance Demonstration */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Copy className="w-4 h-4 text-cyan-500" />
              <span>One Program → Multiple Concurrent Processes</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Launching the same executable file multiple times creates independent processes in RAM, each with its own unique PID, memory space, and PCB.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSpawnCount(prev => Math.max(1, prev - 1))}
              className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              - Remove
            </button>
            <span className="font-mono text-xs font-bold px-2 text-cyan-600 dark:text-cyan-400">
              {spawnCount} Processes
            </span>
            <button
              onClick={() => setSpawnCount(prev => Math.min(5, prev + 1))}
              className="px-3 py-1 rounded-lg border border-cyan-200 dark:border-cyan-800 bg-cyan-50 dark:bg-cyan-950/40 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 cursor-pointer"
            >
              + Spawn Instance
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: spawnCount }).map((_, idx) => {
            const pid = 1024 + idx * 17;
            const memoryUsage = 42 + idx * 8;
            return (
              <div
                key={idx}
                className="rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] p-4 space-y-2 hover:border-cyan-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-cyan-500" />
                    Process #{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-semibold">
                    PID: {pid}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Program File:</span>
                    <span className="text-slate-700 dark:text-slate-300">browser.exe</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allocated RAM:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{memoryUsage} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PCB Address:</span>
                    <span className="text-slate-700 dark:text-slate-300">0x{ (0x7fff00 + idx * 0x400).toString(16) }</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Process Memory Layout Diagram */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" />
            <span>Process Memory Layout in Main Memory (RAM)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            When a process is loaded into memory, the OS divides its virtual address space into 4 major distinct memory segments. Click a segment to inspect its attributes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Memory Stack (Left Col 5) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>High Address (0xFFFFFFFF)</span>
              <span>Kernel Space Boundary</span>
            </div>

            <div className="space-y-2 bg-slate-900/90 p-3 rounded-2xl border border-slate-800 shadow-inner">
              {memorySegments.map((segment) => {
                const isSelected = selectedSegment === segment.id;
                return (
                  <button
                    key={segment.id}
                    onClick={() => setSelectedSegment(segment.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? `bg-linear-to-r ${segment.color} shadow-lg scale-[1.02] ring-2 ring-cyan-500/40`
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{segment.name}</span>
                        {segment.id === 'stack' && <ArrowDown className="w-3.5 h-3.5 text-amber-400 animate-bounce" />}
                        {segment.id === 'heap' && <ArrowUp className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">{segment.direction}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
              <span>Low Address (0x00000000)</span>
              <span>Code Segment Start</span>
            </div>
          </div>

          {/* Segment Inspector Details (Right Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            {activeSegmentData && (
              <div className="rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                  <div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${activeSegmentData.badgeBg}`}>
                      {activeSegmentData.direction}
                    </span>
                    <h4 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {activeSegmentData.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">Access Permission</span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                      {activeSegmentData.id === 'text' ? 'Read-Only (R-X)' : 'Read-Write (R-W)'}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeSegmentData.description}
                </p>

                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Key Characteristics & OS Rules:
                  </span>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {activeSegmentData.details.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                    Code Snippet / Example:
                  </span>
                  <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-xl border border-slate-800 overflow-x-auto">
                    <code>{activeSegmentData.example}</code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
