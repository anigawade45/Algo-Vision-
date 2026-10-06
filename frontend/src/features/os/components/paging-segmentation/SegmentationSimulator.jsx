import React, { useState } from 'react';
import { Box, Cpu, ArrowRight, CheckCircle2, ShieldAlert, AlertOctagon, RotateCcw, Edit3, Info, Layers } from 'lucide-react';

export function SegmentationSimulator() {
  // Input: Segment Number and Offset tuple <s, d>
  const [selectedSegId, setSelectedSegId] = useState(2); // Segment 2 (Stack)
  const [offset, setOffset] = useState(150);

  // Segment Table Data (Segment #, Name, Base, Limit)
  const [segmentTable, setSegmentTable] = useState([
    { segment: 0, name: 'Code', base: 1000, limit: 400, color: 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300' },
    { segment: 1, name: 'Data', base: 5000, limit: 600, color: 'bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-300' },
    { segment: 2, name: 'Stack', base: 8000, limit: 300, color: 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300' },
    { segment: 3, name: 'Heap', base: 10000, limit: 500, color: 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300' }
  ]);

  // Lookup target segment
  const activeSegment = segmentTable.find(s => s.segment === selectedSegId) || segmentTable[0];

  // Bounds Validation Check
  const isOffsetValid = offset >= 0 && offset < activeSegment.limit;
  const physicalAddress = isOffsetValid ? activeSegment.base + offset : null;

  const handleUpdateTable = (segId, field, val) => {
    const updated = segmentTable.map(s => {
      if (s.segment === segId) {
        return { ...s, [field]: Math.max(0, Number(val)) };
      }
      return s;
    });
    setSegmentTable(updated);
  };

  const handleReset = () => {
    setSelectedSegId(2);
    setOffset(150);
    setSegmentTable([
      { segment: 0, name: 'Code', base: 1000, limit: 400, color: 'bg-blue-500/20 border-blue-500 text-blue-800 dark:text-blue-300' },
      { segment: 1, name: 'Data', base: 5000, limit: 600, color: 'bg-cyan-500/20 border-cyan-500 text-cyan-800 dark:text-cyan-300' },
      { segment: 2, name: 'Stack', base: 8000, limit: 300, color: 'bg-purple-500/20 border-purple-500 text-purple-800 dark:text-purple-300' },
      { segment: 3, name: 'Heap', base: 10000, limit: 500, color: 'bg-amber-500/20 border-amber-500 text-amber-800 dark:text-amber-300' }
    ]);
  };

  const handleLoadValid = () => {
    setSelectedSegId(2);
    setOffset(150); // 150 < 300 (Valid)
  };

  const handleLoadFault = () => {
    setSelectedSegId(2);
    setOffset(350); // 350 >= 300 (Segmentation Fault!)
  };

  return (
    <div className="space-y-8">
      {/* Header Panel & Controls */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-[#1E2638] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Segmentation Address Translation Laboratory</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Logical address tuple &lt;Segment, Offset&gt; relocation &amp; limit boundary check</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <button
              onClick={handleLoadValid}
              className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg cursor-pointer"
            >
              Preset: Valid Address $\langle 2, 150 \rangle$
            </button>
            <button
              onClick={handleLoadFault}
              className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-lg cursor-pointer"
            >
              Preset: Seg Fault $\langle 2, 350 \rangle$
            </button>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Input Tuple Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-xl p-4">
          <div>
            <label className="text-xs font-mono font-bold text-purple-700 dark:text-purple-400 block mb-1">
              Select Segment ($s$)
            </label>
            <select
              value={selectedSegId}
              onChange={(e) => setSelectedSegId(Number(e.target.value))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {segmentTable.map(s => (
                <option key={s.segment} value={s.segment}>
                  Segment {s.segment}: {s.name} (Base: {s.base}, Limit: {s.limit})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 block mb-1">
              Offset ($d$)
            </label>
            <input
              type="number"
              value={offset}
              onChange={(e) => setOffset(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 block mb-1">
              Logical Address Tuple
            </label>
            <div className="p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono font-bold text-purple-700 dark:text-purple-400 flex items-center justify-between">
              <span>&lt;Segment {selectedSegId}, Offset {offset}&gt;</span>
            </div>
          </div>
        </div>

        {/* Translation Flow & Pipeline Diagram */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
            {/* Tuple */}
            <div className="p-4 rounded-xl bg-purple-100 dark:bg-purple-500/15 border border-purple-300 dark:border-purple-500/40 text-center space-y-1 w-full md:w-1/4">
              <span className="text-[10px] text-purple-700 dark:text-purple-400 font-bold uppercase block">1. Tuple $\langle s, d \rangle$</span>
              <div className="text-base font-extrabold text-purple-900 dark:text-purple-300">
                Segment {selectedSegId} ({activeSegment.name})
              </div>
              <span className="text-[10px] text-slate-500 block">Offset = {offset}</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Segment Table Lookup */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-center space-y-1 w-full md:w-1/4">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">2. Table Lookup</span>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Base: {activeSegment.base} | Limit: {activeSegment.limit}
              </div>
              <span className="text-[10px] text-slate-500 block">From Segment Table</span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Limit Check */}
            <div className={`p-4 rounded-xl border text-center space-y-1 w-full md:w-1/4 transition-all ${
              isOffsetValid
                ? 'bg-blue-100 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-900 dark:text-blue-300'
                : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/50 text-rose-900 dark:text-rose-300 animate-pulse'
            }`}>
              <span className="text-[10px] font-bold uppercase block">3. Limit Check</span>
              <div className="text-xs font-bold">{offset} &lt; {activeSegment.limit} ?</div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isOffsetValid ? 'bg-emerald-200 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-200 dark:bg-rose-500/30 text-rose-800 dark:text-rose-300'}`}>
                {isOffsetValid ? 'YES (VALID)' : 'NO (SEG FAULT)'}
              </span>
            </div>

            <ArrowRight className="w-5 h-5 text-slate-400 hidden md:block shrink-0" />

            {/* Physical Result */}
            <div className={`p-4 rounded-xl border text-center space-y-1 w-full md:w-1/4 ${
              isOffsetValid
                ? 'bg-emerald-100 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-900 dark:text-emerald-300 shadow-md'
                : 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500/50 text-rose-900 dark:text-rose-300'
            }`}>
              <span className="text-[10px] font-bold uppercase block">4. RAM Physical Address</span>
              <div className="text-base font-extrabold">
                {isOffsetValid ? physicalAddress : 'TRANSLATION STOPPED'}
              </div>
              <span className="text-[10px] opacity-80 block">
                {isOffsetValid ? `${activeSegment.base} + ${offset}` : 'Bounds Trap'}
              </span>
            </div>
          </div>

          {/* Validation Result Banner */}
          {isOffsetValid ? (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/40 rounded-xl text-xs font-mono text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  <strong>SUCCESSFUL TRANSLATION:</strong> Offset ({offset}) &lt; Limit ({activeSegment.limit}). Physical Address = Base ({activeSegment.base}) + Offset ({offset}) = <strong>{physicalAddress}</strong>.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 rounded-xl text-xs font-mono text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                <strong>SEGMENTATION FAULT / BOUNDS VIOLATION:</strong> Offset ({offset}) is $\ge$ Limit ({activeSegment.limit}). Access outside process memory space stopped! No physical address generated.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Segment Table & Physical RAM Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editable Segment Table */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Segment Table
            </span>
            <span className="text-[10px] font-mono text-slate-500">Edit Base & Limit</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-[#1E2638] rounded-xl">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-[#1E2638]">
                <tr>
                  <th className="p-3 font-bold">Seg #</th>
                  <th className="p-3 font-bold">Name</th>
                  <th className="p-3 font-bold">Base Address</th>
                  <th className="p-3 font-bold">Limit Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {segmentTable.map((seg) => {
                  const isSelected = selectedSegId === seg.segment;

                  return (
                    <tr
                      key={seg.segment}
                      onClick={() => setSelectedSegId(seg.segment)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-300 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <td className="p-3 font-bold">Seg {seg.segment}</td>
                      <td className="p-3 font-bold">{seg.name}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={seg.base}
                          onChange={(e) => handleUpdateTable(seg.segment, 'base', e.target.value)}
                          className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={seg.limit}
                          onChange={(e) => handleUpdateTable(seg.segment, 'limit', e.target.value)}
                          className="w-20 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded px-2 py-0.5 text-xs font-mono font-bold text-slate-900 dark:text-slate-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Physical Memory Representation */}
        <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-3">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Physical Memory Segment Layout
            </span>
            <span className="text-[10px] font-mono text-slate-500">Variable-sized Segments</span>
          </div>

          <div className="space-y-2 font-mono text-xs max-h-80 overflow-y-auto pr-1">
            {segmentTable.map((seg) => {
              const isSelected = selectedSegId === seg.segment;

              return (
                <div
                  key={seg.segment}
                  onClick={() => setSelectedSegId(seg.segment)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${seg.color} ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-md scale-[1.01]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-sm">Segment {seg.segment}: {seg.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/40 dark:bg-slate-900/40 font-bold">
                      Limit: {seg.limit} Bytes
                    </span>
                  </div>
                  <div className="text-[11px] opacity-80">
                    RAM Range: {seg.base} – {seg.base + seg.limit - 1}
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

export default SegmentationSimulator;
