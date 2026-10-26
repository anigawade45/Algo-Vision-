import { useState } from 'react';
import { Plus, Trash2, ShieldCheck, AlertTriangle, Layers, ArrowRight } from 'lucide-react';

export default function GraphControls({
  processes,
  resources,
  onAddProcess,
  onAddResource,
  onAddEdge,
  onLoadExample,
  onClearGraph
}) {
  const [sourceNode, setSourceNode] = useState('');
  const [targetNode, setTargetNode] = useState('');

  // Options lists
  const allNodes = [
    ...processes.map(p => ({ id: p.id, type: 'process' })),
    ...resources.map(r => ({ id: r.id, type: 'resource' }))
  ];

  const handleCreateEdge = (e) => {
    e.preventDefault();
    if (!sourceNode || !targetNode) {
      alert('Please select both a source node and a target node!');
      return;
    }
    if (sourceNode === targetNode) {
      alert('Source and target node cannot be the same!');
      return;
    }

    // Determine type: Process -> Resource is request, Resource -> Process is allocation
    const sourceObj = allNodes.find(n => n.id === sourceNode);
    const targetObj = allNodes.find(n => n.id === targetNode);

    if (sourceObj?.type === targetObj?.type) {
      alert('Edges must connect a Process to a Resource or a Resource to a Process!');
      return;
    }

    let actualType = 'request';
    if (sourceObj?.type === 'resource' && targetObj?.type === 'process') {
      actualType = 'allocation';
    } else if (sourceObj?.type === 'process' && targetObj?.type === 'resource') {
      actualType = 'request';
    }

    onAddEdge({
      from: sourceNode,
      to: targetNode,
      type: actualType
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Pre-built Example Templates */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-3">
        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
          Quick Preset Scenarios:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onLoadExample('deadlock')}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Load Deadlock Example (P1 ↔ P2)</span>
          </button>

          <button
            onClick={() => onLoadExample('safe')}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 cursor-pointer flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Load Safe Example (No Deadlock)</span>
          </button>

          <button
            onClick={() => onLoadExample('complex')}
            className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 cursor-pointer flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Load 3-Process Cycle Example</span>
          </button>

          <button
            onClick={onClearGraph}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#1E2638] text-xs font-bold hover:text-rose-500 cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Graph</span>
          </button>
        </div>
      </div>

      {/* Graph Building Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Node Spawners */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-500" />
            <span>1. Add Graph Nodes</span>
          </h4>

          <div className="flex items-center gap-3">
            <button
              onClick={onAddProcess}
              className="flex-1 py-2.5 px-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-300 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Process (P{processes.length + 1})</span>
            </button>

            <button
              onClick={onAddResource}
              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Resource (R{resources.length + 1})</span>
            </button>
          </div>
        </div>

        {/* Edge Creator */}
        <form onSubmit={handleCreateEdge} className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-5 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-emerald-500" />
            <span>2. Connect Edge Relationship</span>
          </h4>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Source Node:</label>
              <select
                value={sourceNode}
                onChange={(e) => setSourceNode(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Select From</option>
                {allNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.id} ({n.type})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Node:</label>
              <select
                value={targetNode}
                onChange={(e) => setTargetNode(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              >
                <option value="">Select To</option>
                {allNodes.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.id} ({n.type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            + Connect Directed Edge
          </button>
        </form>
      </div>
    </div>
  );
}
