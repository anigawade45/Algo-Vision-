import React from 'react';
import { Sliders, Zap } from 'lucide-react';

export default function InputPanel({
  module = 'page-replacement',
  inputValues = {},
  onChangeInput = () => {},
  currentVisualizerInput = null,
  onUseVisualizerInput = () => {}
}) {
  return (
    <div className="rounded-xl bg-[#0b101d] border border-slate-800 p-4 space-y-4 text-xs font-mono text-slate-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-slate-200 uppercase">Program Input Parameters</span>
        </div>

        {currentVisualizerInput && (
          <button
            onClick={onUseVisualizerInput}
            className="px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Import current input settings from the active visualizer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Use Current Visualizer Input</span>
          </button>
        )}
      </div>

      {module === 'page-replacement' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Page Reference String:</label>
            <input
              type="text"
              value={inputValues.refString || ''}
              onChange={(e) => onChangeInput({ ...inputValues, refString: e.target.value })}
              placeholder="e.g. 7 0 1 2 0 3 0 4 2 3 0 3 2"
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Number of Frames:</label>
            <input
              type="number"
              min="1"
              max="10"
              value={inputValues.frameCount || 3}
              onChange={(e) => onChangeInput({ ...inputValues, frameCount: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {module === 'disk-scheduling' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Disk Request Queue:</label>
            <input
              type="text"
              value={inputValues.requests || ''}
              onChange={(e) => onChangeInput({ ...inputValues, requests: e.target.value })}
              placeholder="e.g. 98, 183, 37, 122, 14, 124, 65, 67"
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Initial Head:</label>
            <input
              type="number"
              value={inputValues.initialHead || 53}
              onChange={(e) => onChangeInput({ ...inputValues, initialHead: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Initial Direction:</label>
            <select
              value={inputValues.direction || 'up'}
              onChange={(e) => onChangeInput({ ...inputValues, direction: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="up">Upward (➔)</option>
              <option value="down">Downward (←)</option>
            </select>
          </div>
        </div>
      )}

      {module === 'cpu-scheduling' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Processes (ID:Arrival:Burst):</label>
            <input
              type="text"
              value={inputValues.processes || ''}
              onChange={(e) => onChangeInput({ ...inputValues, processes: e.target.value })}
              placeholder="e.g. P1:0:5, P2:1:3, P3:2:8, P4:3:6"
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Time Quantum (RR):</label>
            <input
              type="number"
              value={inputValues.timeQuantum || 2}
              onChange={(e) => onChangeInput({ ...inputValues, timeQuantum: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {module === 'memory-management' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Memory Blocks (KB):</label>
            <input
              type="text"
              value={inputValues.memoryBlocks || ''}
              onChange={(e) => onChangeInput({ ...inputValues, memoryBlocks: e.target.value })}
              placeholder="e.g. 100 500 200 300 600"
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Process Sizes (KB):</label>
            <input
              type="text"
              value={inputValues.processSizes || ''}
              onChange={(e) => onChangeInput({ ...inputValues, processSizes: e.target.value })}
              placeholder="e.g. 212 417 112 426"
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {module === 'paging-segmentation' && (
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Logical Address:</label>
            <input
              type="number"
              value={inputValues.logicalAddress || 1052}
              onChange={(e) => onChangeInput({ ...inputValues, logicalAddress: parseInt(e.target.value, 10) || 0 })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="sm:col-span-6 space-y-1">
            <label className="text-[11px] text-slate-400 font-semibold block">Page Size (Bytes):</label>
            <input
              type="number"
              value={inputValues.pageSize || 256}
              onChange={(e) => onChangeInput({ ...inputValues, pageSize: parseInt(e.target.value, 10) || 256 })}
              className="w-full px-3 py-1.5 rounded-lg bg-[#141b2d] border border-slate-700 text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      )}

      {['process-management', 'deadlocks', 'bankers-algorithm', 'process-synchronization'].includes(module) && (
        <div className="text-slate-400 text-[11px] italic">
          Default input configuration active for {module}. Customize starter code or click <strong className="text-cyan-400 font-normal">Run ▶</strong> to execute.
        </div>
      )}
    </div>
  );
}
