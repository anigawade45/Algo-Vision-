import { useState, Fragment } from 'react';
import { AlertTriangle, ShieldCheck, Play, ChevronRight, Activity } from 'lucide-react';

export default function DeadlockDetector({
  processes,
  resources,
  edges,
  onDetectCycle
}) {
  const [detectionResult, setDetectionResult] = useState(null);

  const handleRunDetection = () => {
    if (processes.length === 0 && resources.length === 0) {
      setDetectionResult({
        hasDeadlock: false,
        message: 'Graph is empty. Please add processes and resources first.',
        cycle: []
      });
      onDetectCycle([]);
      return;
    }

    // Build Adjacency List for Directed Graph
    const adj = {};
    const allNodeIds = [...processes.map(p => p.id), ...resources.map(r => r.id)];
    allNodeIds.forEach(id => (adj[id] = []));

    edges.forEach(e => {
      if (adj[e.from]) {
        adj[e.from].push(e.to);
      }
    });

    // DFS Cycle Detection for Directed Graph
    const visited = {};
    const recStack = {};
    let foundCyclePath = [];

    const dfs = (node, path) => {
      visited[node] = true;
      recStack[node] = true;
      path.push(node);

      const neighbors = adj[node] || [];
      for (const neighbor of neighbors) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, [...path])) return true;
        } else if (recStack[neighbor]) {
          // Found cycle starting at neighbor
          const cycleStartIdx = path.indexOf(neighbor);
          if (cycleStartIdx !== -1) {
            foundCyclePath = path.slice(cycleStartIdx);
            return true;
          }
        }
      }

      recStack[node] = false;
      return false;
    };

    let hasCycle = false;
    for (const node of allNodeIds) {
      if (!visited[node]) {
        if (dfs(node, [])) {
          hasCycle = true;
          break;
        }
      }
    }

    if (hasCycle && foundCyclePath.length > 0) {
      setDetectionResult({
        hasDeadlock: true,
        message: `DEADLOCK DETECTED! Closed cycle found involving ${foundCyclePath.join(' → ')} → ${foundCyclePath[0]}`,
        cycle: foundCyclePath
      });
      onDetectCycle(foundCyclePath);
    } else {
      setDetectionResult({
        hasDeadlock: false,
        message: 'SAFE STATE - No circular wait cycles detected in Resource Allocation Graph.',
        cycle: []
      });
      onDetectCycle([]);
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-500" />
            <span>Deadlock Cycle Detection Engine</span>
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Analyzes directed request and allocation edges in the graph to find circular wait dependencies.
          </p>
        </div>

        <button
          onClick={handleRunDetection}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-mono font-bold text-xs hover:bg-cyan-700 shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>[ Detect Deadlock ]</span>
        </button>
      </div>

      {/* Detection Result Banner */}
      {detectionResult && (
        <div className={`p-4 rounded-xl border-2 transition-all space-y-2 ${
          detectionResult.hasDeadlock
            ? 'bg-rose-500/10 border-rose-500 text-rose-300'
            : 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2 font-mono font-extrabold text-sm">
            {detectionResult.hasDeadlock ? (
              <AlertTriangle className="w-5 h-5 text-rose-500 animate-bounce" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            )}
            <span className={detectionResult.hasDeadlock ? 'text-rose-500' : 'text-emerald-500'}>
              {detectionResult.hasDeadlock ? 'DEADLOCK DETECTED' : 'SYSTEM IS SAFE'}
            </span>
          </div>

          <p className="text-xs text-slate-800 dark:text-slate-200 font-mono">
            {detectionResult.message}
          </p>

          {detectionResult.hasDeadlock && (
            <div className="pt-2 border-t border-rose-500/30 text-xs font-mono text-slate-700 dark:text-slate-300">
              <span className="font-bold text-rose-400 block mb-1">Identified Circular Dependency Chain:</span>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-cyan-400 flex items-center gap-2 flex-wrap font-bold">
                {detectionResult.cycle.map((node, i) => (
                  <Fragment key={i}>
                    <span>{node}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </Fragment>
                ))}
                <span>{detectionResult.cycle[0]}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
