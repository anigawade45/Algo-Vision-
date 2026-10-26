import { useState } from 'react';
import { ShieldAlert, Box } from 'lucide-react';

export function FragmentationVisualizer() {
  // Internal Fragmentation State
  const [partitionSize, setPartitionSize] = useState(200);
  const [processSizeInternal, setProcessSizeInternal] = useState(150);

  // External Fragmentation & Compaction State
  const [isCompacted, setIsCompacted] = useState(false);
  const externalRequestSize = 250;

  // Internal fragmentation calculation
  const internalWasted = Math.max(0, partitionSize - processSizeInternal);
  const fitsInternal = processSizeInternal <= partitionSize;

  // External fragmentation layout
  const uncompactedHoles = [
    { type: 'FREE', size: 100, label: 'Free Hole 1' },
    { type: 'ALLOCATED', size: 150, label: 'P1 (150 KB)' },
    { type: 'FREE', size: 80, label: 'Free Hole 2' },
    { type: 'ALLOCATED', size: 200, label: 'P2 (200 KB)' },
    { type: 'FREE', size: 120, label: 'Free Hole 3' }
  ];

  const compactedHoles = [
    { type: 'ALLOCATED', size: 150, label: 'P1 (150 KB)' },
    { type: 'ALLOCATED', size: 200, label: 'P2 (200 KB)' },
    { type: 'FREE', size: 300, label: 'Contiguous Free Memory (300 KB)' }
  ];

  const currentLayout = isCompacted ? compactedHoles : uncompactedHoles;

  const totalFreeMemory = 300; // 100 + 80 + 120
  const largestFreeBlock = isCompacted ? 300 : 120;
  const externalFits = externalRequestSize <= largestFreeBlock;

  return (
    <div className="space-y-8">
      {/* Internal vs External Fragmentation Visual Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Internal Fragmentation Section */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-[#1E2638] pb-4">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Internal Fragmentation</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Unused memory trapped INSIDE an allocated partition</p>
            </div>
          </div>

          {/* Interactive Inputs */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-[#070A12] p-3 rounded-xl border border-slate-200 dark:border-[#1E2638] text-xs font-mono">
            <div>
              <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Fixed Partition Size:</label>
              <input
                type="number"
                value={partitionSize}
                onChange={(e) => setPartitionSize(Math.max(10, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Process Size:</label>
              <input
                type="number"
                value={processSizeInternal}
                onChange={(e) => setProcessSizeInternal(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Visual Partition Box */}
          {fitsInternal ? (
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 text-center">
              <span className="text-xs font-mono text-slate-500 font-bold block">Assigned Partition ({partitionSize} KB)</span>

              <div className="border-2 border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden font-mono text-xs shadow-sm">
                {/* Process occupied region */}
                <div
                  style={{ height: `${Math.max(40, (processSizeInternal / partitionSize) * 120)}px` }}
                  className="bg-blue-500/20 border-b border-blue-500/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center"
                >
                  Process P1 ({processSizeInternal} KB)
                </div>

                {/* Internal Wasted Padding */}
                {internalWasted > 0 && (
                  <div
                    style={{ height: `${Math.max(30, (internalWasted / partitionSize) * 120)}px` }}
                    className="bg-amber-500/20 text-amber-800 dark:text-amber-400 font-bold flex items-center justify-center border-dashed border-amber-500/40"
                  >
                    UNUSED INTERNAL FRAGMENTATION: {internalWasted} KB
                  </div>
                )}
              </div>

              <div className="p-2.5 bg-amber-100 dark:bg-amber-500/15 border border-amber-300 dark:border-amber-500/30 rounded-lg text-xs font-mono text-amber-900 dark:text-amber-300">
                Internal Fragmentation = {partitionSize} - {processSizeInternal} = <strong>{internalWasted} KB</strong>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs font-mono text-rose-900 dark:text-rose-300">
              Process size ({processSizeInternal} KB) exceeds partition size ({partitionSize} KB). Cannot fit!
            </div>
          )}
        </div>

        {/* External Fragmentation & Compaction Section */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">External Fragmentation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total free space exists, but scattered in non-contiguous holes</p>
              </div>
            </div>

            <button
              onClick={() => setIsCompacted(!isCompacted)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-sm ${
                isCompacted
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isCompacted ? 'Undo Compaction' : 'Compact Memory'}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-[#070A12] p-3 rounded-xl border border-slate-200 dark:border-[#1E2638] text-center font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Free</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">{totalFreeMemory} KB</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Largest Hole</span>
              <strong className="text-amber-600 dark:text-amber-400 text-sm">{largestFreeBlock} KB</strong>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Layout State</span>
              <strong className={isCompacted ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                {isCompacted ? 'COMPACTED' : 'FRAGMENTED'}
              </strong>
            </div>
          </div>

          {/* Dynamic Layout Representation */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">Memory Hole Distribution:</span>
            <div className="space-y-1.5 font-mono text-xs">
              {currentLayout.map((block, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border flex items-center justify-between ${
                    block.type === 'FREE'
                      ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/40 text-amber-800 dark:text-amber-300 font-bold border-dashed'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{block.label}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {block.size} KB
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* External Request Test */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span>Test Process Request (250 KB):</span>
              <span className={`font-bold px-2 py-0.5 rounded ${externalFits ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
                {externalFits ? 'ALLOCATION SUCCESSFUL' : 'EXTERNAL FRAGMENTATION FAILURE'}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              {externalFits
                ? 'Compaction merged free space into one 300 KB contiguous block, allowing the 250 KB process to fit!'
                : 'Total free memory is 300 KB, but largest contiguous block is only 120 KB. Process cannot fit!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FragmentationVisualizer;
