import { useState } from 'react';
import { Layers, Box, CheckCircle2, Sliders } from 'lucide-react';

export function PagingVsSegmentation() {
  // Shared Laboratory Input State
  const [testAddress, setTestAddress] = useState(1234);
  const [pageSize, setPageSize] = useState(100);

  // Segmentation inputs
  const [segmentId, setSegmentId] = useState(1);
  const [segmentOffset, setSegmentOffset] = useState(234);

  // Paging Calculations
  const pageNum = Math.floor(testAddress / pageSize);
  const pageOffset = testAddress % pageSize;
  const pagingFrame = pageNum === 12 ? 7 : (pageNum % 8);
  const pagingPhysical = pagingFrame * pageSize + pageOffset;

  // Segmentation Calculations
  const segmentTable = [
    { seg: 0, name: 'Code', base: 1000, limit: 500 },
    { seg: 1, name: 'Data', base: 5000, limit: 600 },
    { seg: 2, name: 'Stack', base: 8000, limit: 300 }
  ];
  const activeSeg = segmentTable.find(s => s.seg === segmentId) || segmentTable[1];
  const isSegValid = segmentOffset < activeSeg.limit;
  const segPhysical = isSegValid ? activeSeg.base + segmentOffset : null;

  return (
    <div className="space-y-8">
      {/* Side-by-Side Dual Address Translation Laboratory */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dual Address Translation Laboratory</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Run an address through Paging and Segmentation side-by-side</p>
            </div>
          </div>
        </div>

        {/* Dual Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Paging Configuration */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-cyan-500/30 rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              Paging Input Settings
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Logical Address:</label>
                <input
                  type="number"
                  value={testAddress}
                  onChange={(e) => setTestAddress(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Page Size:</label>
                <input
                  type="number"
                  value={pageSize}
                  onChange={(e) => setPageSize(Math.max(10, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Right: Segmentation Configuration */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-purple-500/30 rounded-xl space-y-3">
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block">
              Segmentation Input Settings
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Segment #:</label>
                <select
                  value={segmentId}
                  onChange={(e) => setSegmentId(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100"
                >
                  <option value={0}>Seg 0: Code (Base: 1000, Limit: 500)</option>
                  <option value={1}>Seg 1: Data (Base: 5000, Limit: 600)</option>
                  <option value={2}>Seg 2: Stack (Base: 8000, Limit: 300)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-bold block mb-1">Offset ($d$):</label>
                <input
                  type="number"
                  value={segmentOffset}
                  onChange={(e) => setSegmentOffset(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2.5 py-1 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Side-by-Side Live Translation Visualizers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paging Result Card */}
          <div className="p-5 rounded-xl border bg-cyan-50 dark:bg-cyan-950/20 border-cyan-300 dark:border-cyan-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-cyan-200 dark:border-cyan-800/60 pb-2">
              <span className="font-bold text-sm text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Paging Translation</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-200 dark:bg-cyan-500/30 text-cyan-900 dark:text-cyan-300 font-bold">
                Fixed Page Size ({pageSize} B)
              </span>
            </div>

            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>Page Number ($p$) = {testAddress} / {pageSize} = <strong>{pageNum}</strong></div>
              <div>Offset ($d$) = {testAddress} % {pageSize} = <strong>{pageOffset}</strong></div>
              <div>Frame Lookup = Page {pageNum} $\rightarrow$ <strong>Frame {pagingFrame}</strong></div>
              <div className="pt-2 border-t border-cyan-200 dark:border-cyan-800/60 text-sm font-extrabold text-cyan-900 dark:text-cyan-300">
                Physical Address = ({pagingFrame} × {pageSize}) + {pageOffset} = {pagingPhysical}
              </div>
            </div>
          </div>

          {/* Segmentation Result Card */}
          <div className="p-5 rounded-xl border bg-purple-50 dark:bg-purple-950/20 border-purple-300 dark:border-purple-800 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-purple-200 dark:border-purple-800/60 pb-2">
              <span className="font-bold text-sm text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Box className="w-4 h-4" />
                <span>Segmentation Translation</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-500/30 text-purple-900 dark:text-purple-300 font-bold">
                Variable Segment ({activeSeg.name})
              </span>
            </div>

            <div className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <div>Segment Table = Seg {activeSeg.seg} (Base: {activeSeg.base}, Limit: {activeSeg.limit})</div>
              <div>Limit Check = Offset ({segmentOffset}) &lt; Limit ({activeSeg.limit}) ?</div>
              <div className={`font-bold ${isSegValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                Status = {isSegValid ? 'VALID' : 'SEGMENTATION FAULT'}
              </div>
              <div className="pt-2 border-t border-purple-200 dark:border-purple-800/60 text-sm font-extrabold text-purple-900 dark:text-purple-300">
                Physical Address = {isSegValid ? `${activeSeg.base} + ${segmentOffset} = ${segPhysical}` : 'TRAPPED'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Paging vs Segmentation Matrix</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Architectural breakdown of fixed vs logical memory management</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-[#1E2638] rounded-xl bg-slate-50/50 dark:bg-[#070A12]">
          <table className="w-full text-left font-mono text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1E2638]">
              <tr>
                <th className="p-4 font-bold">Feature</th>
                <th className="p-4 font-bold text-cyan-600 dark:text-cyan-400">Paging</th>
                <th className="p-4 font-bold text-purple-600 dark:text-purple-400">Segmentation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Memory Division</td>
                <td className="p-4">Fixed-size blocks (Pages)</td>
                <td className="p-4">Variable-sized modules (Code, Data, Stack)</td>
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Physical Memory Unit</td>
                <td className="p-4">Frame</td>
                <td className="p-4">Variable Physical Memory Segment</td>
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Logical Address Split</td>
                <td className="p-4 font-bold text-cyan-600 dark:text-cyan-400">Page Number + Offset ($p, d$)</td>
                <td className="p-4 font-bold text-purple-600 dark:text-purple-400">Segment Tuple $\langle s, d \rangle$</td>
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Translation Table</td>
                <td className="p-4">Page Table (Page $\rightarrow$ Frame)</td>
                <td className="p-4">Segment Table (Base, Limit)</td>
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Translation Formula</td>
                <td className="p-4 font-bold">Physical = (Frame $\times$ Page Size) + Offset</td>
                <td className="p-4 font-bold">Physical = Base + Offset (if Offset &lt; Limit)</td>
              </tr>
              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-900/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">Fragmentation Impact</td>
                <td className="p-4 text-emerald-600 dark:text-emerald-400">No External Frag (Internal Frag possible)</td>
                <td className="p-4 text-amber-600 dark:text-amber-400">No Internal Frag (External Frag possible)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PagingVsSegmentation;
