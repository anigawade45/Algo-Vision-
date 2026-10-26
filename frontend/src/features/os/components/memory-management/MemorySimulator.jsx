import { useState } from 'react';
import { HardDrive, Plus, Trash2, Minimize2, RotateCcw, CheckCircle2, AlertOctagon, Cpu } from 'lucide-react';

export function MemorySimulator() {
  // Configuration State
  const totalMemory = 1024;
  const osReserved = 128;
  const [strategy, setStrategy] = useState('first_fit'); // first_fit, best_fit, worst_fit

  // New Process Creation Form
  const [newProcId, setNewProcId] = useState('P1');
  const [newProcSize, setNewProcSize] = useState(200);

  // Memory Blocks State
  // A block is either { type: 'OS', start, size, label } or { type: 'ALLOCATED', start, size, processId, color } or { type: 'FREE', start, size }
  const [memoryBlocks, setMemoryBlocks] = useState([
    { id: 'b-os', type: 'OS', start: 0, size: 128, label: 'OS Kernel Reserved' },
    { id: 'b-free-1', type: 'FREE', start: 128, size: 896 }
  ]);

  // Selected Block for Detail Inspector
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Process counter for ID generation
  const [procCounter, setProcCounter] = useState(2);
  const [allocationLogs, setAllocationLogs] = useState(['Memory Simulator initialized with 1024 KB RAM.']);
  const [alertMessage, setAlertMessage] = useState(null);

  // Helper to merge adjacent free blocks
  const mergeFreeBlocks = (blocks) => {
    const merged = [];
    let prev = null;

    for (const block of blocks) {
      if (prev && prev.type === 'FREE' && block.type === 'FREE') {
        // Merge into prev
        prev.size += block.size;
      } else {
        const copy = { ...block };
        merged.push(copy);
        prev = copy;
      }
    }

    // Recalculate start addresses to guarantee consistency
    let currentAddr = 0;
    return merged.map(b => {
      const updated = { ...b, start: currentAddr };
      currentAddr += b.size;
      return updated;
    });
  };

  // Reset Memory
  const handleReset = () => {
    const initialBlocks = [
      { id: 'b-os', type: 'OS', start: 0, size: osReserved, label: 'OS Kernel Reserved' },
      { id: 'b-free-1', type: 'FREE', start: osReserved, size: totalMemory - osReserved }
    ];
    setMemoryBlocks(initialBlocks);
    setNewProcId('P1');
    setProcCounter(2);
    setSelectedBlockId(null);
    setAlertMessage(null);
    setAllocationLogs(['Memory reset. RAM initialized to default state.']);
  };

  // Allocate Process using current strategy
  const handleAllocateProcess = (idToUse = newProcId, sizeToUse = newProcSize) => {
    setAlertMessage(null);

    if (sizeToUse <= 0) {
      setAlertMessage({ type: 'error', text: 'Process size must be greater than 0 KB.' });
      return false;
    }

    // Check if process ID already exists in memory
    if (memoryBlocks.some(b => b.type === 'ALLOCATED' && b.processId === idToUse)) {
      setAlertMessage({ type: 'error', text: `Process ID ${idToUse} is already allocated in memory!` });
      return false;
    }

    // Find free blocks that fit request
    const freeCandidates = memoryBlocks.filter(b => b.type === 'FREE' && b.size >= sizeToUse);

    if (freeCandidates.length === 0) {
      // Calculate total free memory vs largest free block to explain External Fragmentation failure
      const totalFree = memoryBlocks.filter(b => b.type === 'FREE').reduce((sum, b) => sum + b.size, 0);
      const largestFree = memoryBlocks.filter(b => b.type === 'FREE').reduce((max, b) => Math.max(max, b.size), 0);

      setAlertMessage({
        type: 'error',
        text: `ALLOCATION FAILED for ${idToUse} (${sizeToUse} KB)! No single contiguous free block is large enough. Total Free = ${totalFree} KB, Largest Free Block = ${largestFree} KB (External Fragmentation).`
      });

      setAllocationLogs(prev => [`[ALLOCATION FAILED] ${idToUse} (${sizeToUse} KB) requested -> No suitable contiguous free block.`, ...prev]);
      return false;
    }

    // Choose target block according to selected strategy
    let targetBlock = null;
    if (strategy === 'first_fit') {
      targetBlock = freeCandidates[0];
    } else if (strategy === 'best_fit') {
      targetBlock = [...freeCandidates].sort((a, b) => a.size - b.size)[0];
    } else if (strategy === 'worst_fit') {
      targetBlock = [...freeCandidates].sort((a, b) => b.size - a.size)[0];
    }

    // Assign color badge for process
    const colors = [
      'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300',
      'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300',
      'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300',
      'bg-emerald-500/20 border-emerald-500 text-emerald-800 dark:text-emerald-300',
      'bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-300',
      'bg-rose-500/20 border-rose-500 text-rose-800 dark:text-rose-300'
    ];
    const procColor = colors[procCounter % colors.length];

    // Split target block into allocated process block + remaining free block
    const newBlocks = [];
    for (const b of memoryBlocks) {
      if (b.id === targetBlock.id) {
        // Allocated block
        newBlocks.push({
          id: `b-proc-${idToUse}-${Date.now()}`,
          type: 'ALLOCATED',
          start: b.start,
          size: sizeToUse,
          processId: idToUse,
          color: procColor
        });

        // Remaining split free block if size > sizeToUse
        if (b.size > sizeToUse) {
          newBlocks.push({
            id: `b-free-${Date.now()}`,
            type: 'FREE',
            start: b.start + sizeToUse,
            size: b.size - sizeToUse
          });
        }
      } else {
        newBlocks.push(b);
      }
    }

    const cleaned = mergeFreeBlocks(newBlocks);
    setMemoryBlocks(cleaned);

    // Increment process ID suggestion
    setNewProcId(`P${procCounter + 1}`);
    setProcCounter(prev => prev + 1);

    setAlertMessage({
      type: 'success',
      text: `Process ${idToUse} (${sizeToUse} KB) successfully allocated into Block at address [${targetBlock.start} – ${targetBlock.start + sizeToUse - 1} KB] using ${strategy.replace('_', ' ').toUpperCase()}.`
    });

    setAllocationLogs(prev => [`[ALLOCATED] ${idToUse} (${sizeToUse} KB) at address ${targetBlock.start} KB using ${strategy.replace('_', ' ').toUpperCase()}.`, ...prev]);
    return true;
  };

  // Deallocate Process
  const handleDeallocate = (procId) => {
    setAlertMessage(null);
    let freedSize = 0;

    const newBlocks = memoryBlocks.map(b => {
      if (b.type === 'ALLOCATED' && b.processId === procId) {
        freedSize = b.size;
        return {
          id: `b-free-${Date.now()}`,
          type: 'FREE',
          start: b.start,
          size: b.size
        };
      }
      return b;
    });

    const merged = mergeFreeBlocks(newBlocks);
    setMemoryBlocks(merged);
    if (selectedBlockId) setSelectedBlockId(null);

    setAlertMessage({
      type: 'info',
      text: `Process ${procId} (${freedSize} KB) deallocated. Adjacent free memory blocks automatically merged.`
    });

    setAllocationLogs(prev => [`[DEALLOCATED] Process ${procId} freed ${freedSize} KB. Memory merged.`, ...prev]);
  };

  // Memory Compaction
  const handleCompactMemory = () => {
    setAlertMessage(null);

    // Separate allocated processes vs free memory
    const allocated = memoryBlocks.filter(b => b.type === 'OS' || b.type === 'ALLOCATED');
    const totalFreeSize = memoryBlocks.filter(b => b.type === 'FREE').reduce((sum, b) => sum + b.size, 0);

    if (totalFreeSize === 0) {
      setAlertMessage({ type: 'info', text: 'Memory is fully occupied. Compaction not required.' });
      return;
    }

    // Re-stack allocated processes continuously right after OS
    let currentAddr = 0;
    const compacted = [];

    for (const b of allocated) {
      compacted.push({
        ...b,
        start: currentAddr
      });
      currentAddr += b.size;
    }

    // Single consolidated free block at top
    compacted.push({
      id: `b-free-compacted-${Date.now()}`,
      type: 'FREE',
      start: currentAddr,
      size: totalFreeSize
    });

    setMemoryBlocks(compacted);

    setAlertMessage({
      type: 'success',
      text: `COMPACTION COMPLETED: All allocated processes shifted to lower memory addresses. Free holes merged into one contiguous ${totalFreeSize} KB block.`
    });

    setAllocationLogs(prev => [`[COMPACTION] Shifted processes. Merged ${totalFreeSize} KB into single contiguous free block.`, ...prev]);
  };

  // Predefined Learning Scenario Loaders
  const handleLoadPreset = (presetKey) => {
    handleReset();

    if (presetKey === 'external_frag') {
      // Create external fragmentation pattern: OS(128) | P1(150) | Free(100) | P2(200) | Free(80) | P3(100) | Free(120)
      const blocks = [
        { id: 'b-os', type: 'OS', start: 0, size: 128, label: 'OS Kernel Reserved' },
        { id: 'b-p1', type: 'ALLOCATED', start: 128, size: 150, processId: 'P1', color: 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300' },
        { id: 'b-f1', type: 'FREE', start: 278, size: 100 },
        { id: 'b-p2', type: 'ALLOCATED', start: 378, size: 200, processId: 'P2', color: 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300' },
        { id: 'b-f2', type: 'FREE', start: 578, size: 80 },
        { id: 'b-p3', type: 'ALLOCATED', start: 658, size: 100, processId: 'P3', color: 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300' },
        { id: 'b-f3', type: 'FREE', start: 758, size: 266 }
      ];
      setMemoryBlocks(blocks);
      setNewProcId('P4');
      setNewProcSize(250);
      setAlertMessage({ type: 'info', text: 'External Fragmentation Preset Loaded! Try allocating P4 (250 KB) or click "Compact Memory".' });
      setAllocationLogs(prev => ['Loaded External Fragmentation scenario preset.', ...prev]);
    } else if (presetKey === 'first_fit_demo') {
      // First fit demo
      const blocks = [
        { id: 'b-os', type: 'OS', start: 0, size: 128, label: 'OS Kernel Reserved' },
        { id: 'b-f1', type: 'FREE', start: 128, size: 100 },
        { id: 'b-p1', type: 'ALLOCATED', start: 228, size: 100, processId: 'P1', color: 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300' },
        { id: 'b-f2', type: 'FREE', start: 328, size: 500 },
        { id: 'b-p2', type: 'ALLOCATED', start: 828, size: 50, processId: 'P2', color: 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300' },
        { id: 'b-f3', type: 'FREE', start: 878, size: 146 }
      ];
      setMemoryBlocks(blocks);
      setNewProcId('P3');
      setNewProcSize(212);
      setStrategy('first_fit');
      setAlertMessage({ type: 'info', text: 'First Fit Scenario Loaded! Click "Allocate Process" to assign P3 (212 KB) into the 500 KB free block.' });
    }
  };

  // Dashboard Statistics
  const allocatedMemorySize = memoryBlocks.filter(b => b.type === 'ALLOCATED').reduce((sum, b) => sum + b.size, 0);
  const freeMemorySize = memoryBlocks.filter(b => b.type === 'FREE').reduce((sum, b) => sum + b.size, 0);
  const freeBlocksCount = memoryBlocks.filter(b => b.type === 'FREE').length;
  const largestFreeBlockSize = memoryBlocks.filter(b => b.type === 'FREE').reduce((max, b) => Math.max(max, b.size), 0);
  const externalFragMetric = Math.max(0, freeMemorySize - largestFreeBlockSize);

  const selectedBlock = memoryBlocks.find(b => b.id === selectedBlockId);

  return (
    <div className="space-y-8">
      {/* Header & Configuration Bar */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Interactive Memory Allocation Simulator</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allocate processes into contiguous RAM, track free blocks, and trigger memory compaction</p>
            </div>
          </div>

          {/* Strategy Selector */}
          <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-950 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-mono text-slate-600 dark:text-slate-400 font-semibold">Allocation Strategy:</span>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 font-mono text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="first_fit">First Fit</option>
              <option value="best_fit">Best Fit</option>
              <option value="worst_fit">Worst Fit</option>
            </select>
          </div>
        </div>

        {/* Process Creation Form & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <span className="text-xs font-mono text-slate-500 px-1 font-bold">Process ID:</span>
              <input
                type="text"
                value={newProcId}
                onChange={(e) => setNewProcId(e.target.value)}
                className="w-16 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700">
              <span className="text-xs font-mono text-slate-500 px-1 font-bold">Size:</span>
              <input
                type="number"
                value={newProcSize}
                onChange={(e) => setNewProcSize(Number(e.target.value))}
                className="w-20 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
              />
              <span className="text-xs font-mono text-slate-500 pr-1">KB</span>
            </div>

            <button
              onClick={() => handleAllocateProcess()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate Process</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCompactMemory}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Compact Memory</span>
            </button>

            <button
              onClick={handleReset}
              className="px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
          <span className="text-slate-500 font-bold text-[11px] shrink-0">Quick Presets:</span>
          <button
            onClick={() => handleLoadPreset('external_frag')}
            className="px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 rounded-lg cursor-pointer whitespace-nowrap"
          >
            Load External Fragmentation Example
          </button>
          <button
            onClick={() => handleLoadPreset('first_fit_demo')}
            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/40 rounded-lg cursor-pointer whitespace-nowrap"
          >
            Load First Fit Scenario
          </button>
        </div>
      </div>

      {/* Alert Result Banner */}
      {alertMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-mono flex items-center justify-between shadow-sm animate-fade-in ${
          alertMessage.type === 'error'
            ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-300 dark:border-rose-500/40 text-rose-900 dark:text-rose-300'
            : alertMessage.type === 'success'
            ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-300 dark:border-emerald-500/40 text-emerald-900 dark:text-emerald-300'
            : 'bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300'
        }`}>
          <div className="flex items-center gap-2">
            {alertMessage.type === 'error' ? <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
            <span>{alertMessage.text}</span>
          </div>
        </div>
      )}

      {/* Dashboard Live Stats Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 font-mono text-xs">
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">Total RAM</span>
          <strong className="text-slate-900 dark:text-white text-sm">{totalMemory} KB</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">OS Reserved</span>
          <strong className="text-slate-700 dark:text-slate-300 text-sm">{osReserved} KB</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">Allocated</span>
          <strong className="text-indigo-600 dark:text-indigo-400 text-sm">{allocatedMemorySize} KB</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">Free RAM</span>
          <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{freeMemorySize} KB</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">Largest Hole</span>
          <strong className="text-amber-600 dark:text-amber-400 text-sm">{largestFreeBlockSize} KB</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm">
          <span className="text-[10px] text-slate-500 uppercase block">Free Holes</span>
          <strong className="text-cyan-600 dark:text-cyan-400 text-sm">{freeBlocksCount}</strong>
        </div>

        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-3 rounded-xl text-center shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[10px] text-slate-500 uppercase block">Ext. Frag Metric</span>
          <strong className={externalFragMetric > 0 ? 'text-rose-600 dark:text-rose-400 text-sm' : 'text-emerald-600 dark:text-emerald-400 text-sm'}>
            {externalFragMetric} KB
          </strong>
        </div>
      </div>

      {/* Main Memory Map & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Proportional Vertical Memory Map */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Physical Memory Map Layout (0 to {totalMemory} KB)
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Click a block to inspect details
            </span>
          </div>

          <div className="space-y-2 border border-slate-300 dark:border-slate-800 rounded-xl p-3 bg-slate-50 dark:bg-slate-950 font-mono text-xs shadow-inner">
            {memoryBlocks.map((block) => {
              const isSelected = selectedBlockId === block.id;

              if (block.type === 'OS') {
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`p-3 rounded-xl border border-slate-400 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <span>{block.label}</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-300 dark:bg-slate-700 font-bold">
                        {block.start} – {block.start + block.size - 1} KB ({block.size} KB)
                      </span>
                    </div>
                  </div>
                );
              }

              if (block.type === 'ALLOCATED') {
                return (
                  <div
                    key={block.id}
                    onClick={() => setSelectedBlockId(block.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${block.color} ${
                      isSelected ? 'ring-2 ring-indigo-500 shadow-md scale-[1.01]' : ''
                    }`}
                  >
                    <div>
                      <span className="font-extrabold text-sm block">Process {block.processId}</span>
                      <span className="text-[10px] opacity-75">Allocated Block</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/40 dark:bg-slate-900/40 font-bold">
                        {block.start} – {block.start + block.size - 1} KB ({block.size} KB)
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeallocate(block.processId);
                        }}
                        className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Free</span>
                      </button>
                    </div>
                  </div>
                );
              }

              // FREE HOLE
              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border border-dashed border-amber-400 dark:border-amber-500/50 bg-amber-50 dark:bg-amber-500/10 text-amber-900 dark:text-amber-300 cursor-pointer transition-all flex items-center justify-between ${
                    isSelected ? 'ring-2 ring-amber-500 shadow-md' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span className="font-bold">FREE MEMORY HOLE</span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-500/30 font-bold">
                    {block.start} – {block.start + block.size - 1} KB ({block.size} KB)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Block Inspector & Log */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          {/* Block Inspector */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              Block Inspector
            </h4>

            {selectedBlock ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 font-mono text-xs">
                <div>Type: <strong className="uppercase text-indigo-600 dark:text-indigo-400">{selectedBlock.type}</strong></div>
                {selectedBlock.processId && <div>Process ID: <strong>{selectedBlock.processId}</strong></div>}
                <div>Start Address: <strong>{selectedBlock.start} KB</strong></div>
                <div>End Address: <strong>{selectedBlock.start + selectedBlock.size - 1} KB</strong></div>
                <div>Block Size: <strong>{selectedBlock.size} KB</strong></div>

                {selectedBlock.type === 'ALLOCATED' && (
                  <button
                    onClick={() => handleDeallocate(selectedBlock.processId)}
                    className="w-full mt-2 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold cursor-pointer transition-colors"
                  >
                    Deallocate {selectedBlock.processId}
                  </button>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs font-mono text-slate-500 italic">
                Click any block in the memory map to inspect its address boundaries.
              </div>
            )}
          </div>

          {/* Execution Log */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex-1 flex flex-col justify-between">
            <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-300 mb-2">Simulator Event Log</div>
            <div className="space-y-1.5 font-mono text-xs max-h-48 overflow-y-auto">
              {allocationLogs.map((lg, i) => (
                <div key={i} className={`p-1.5 rounded text-[11px] leading-relaxed ${
                  lg.includes('ALLOCATED') ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20' :
                  lg.includes('FAILED') ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-900 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20' :
                  lg.includes('COMPACTION') ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20' :
                  'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}>
                  {lg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemorySimulator;
