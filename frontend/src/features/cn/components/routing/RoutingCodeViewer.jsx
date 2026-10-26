import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Network,
  FileCode,
  GitFork
} from 'lucide-react';
import { ROUTING_CODE_DATA } from '../../data/routingCodeData';

export function RoutingCodeViewer({ initialSource = 'A', initialDest = 'F' }) {
  const [selectedAlgo, setSelectedAlgo] = useState('dijkstra'); // 'dijkstra' or 'distanceVector'
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [sourceRouter, setSourceRouter] = useState(initialSource);
  const [destRouter, setDestRouter] = useState(initialDest);

  const currentAlgoData = ROUTING_CODE_DATA[selectedAlgo] || ROUTING_CODE_DATA.dijkstra;

  const currentCode =
    selectedLang === 'python'
      ? currentAlgoData.pythonCode
      : selectedLang === 'cpp'
      ? currentAlgoData.cppCode
      : currentAlgoData.javaCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionLogs([`[KERNEL] Initializing ${currentAlgoData.title} from Router ${sourceRouter}...`]);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 2,
      });

      let logs = [];

      if (selectedAlgo === 'dijkstra') {
        logs = [
          `[${timestamp}] [OSPF INIT] Distances initialized: dist[${sourceRouter}]=0, all other routers=INF`,
          `[${timestamp}] [MIN-HEAP] Settled Router ${sourceRouter} with optimal cost 0`,
          `[${timestamp}]   --> Relaxed link (${sourceRouter} -> C): Tentative Cost = 2`,
          `[${timestamp}]   --> Relaxed link (${sourceRouter} -> B): Tentative Cost = 4`,
          `[${timestamp}] [MIN-HEAP] Settled Router C with optimal cost 2`,
          `[${timestamp}]   --> Relaxed link (C -> B): Path via C gives Cost 3 (Better than 4!)`,
          `[${timestamp}]   --> Relaxed link (C -> E): Tentative Cost = 10`,
          `[${timestamp}]   --> Relaxed link (C -> D): Tentative Cost = 10`,
          `[${timestamp}] [MIN-HEAP] Settled Router B with optimal cost 3 (Next Hop: C)`,
          `[${timestamp}]   --> Relaxed link (B -> D): Cost = 3 + 5 = 8 (Better than 10!)`,
          `[${timestamp}] [MIN-HEAP] Settled Router D with optimal cost 8`,
          `[${timestamp}]   --> Relaxed link (D -> E): Cost = 8 + 2 = 10`,
          `[${timestamp}]   --> Relaxed link (D -> F): Cost = 8 + 6 = 14`,
          `[${timestamp}] [MIN-HEAP] Settled Router E with optimal cost 10`,
          `[${timestamp}]   --> Relaxed link (E -> F): Cost = 10 + 3 = 13 (Better than 14!)`,
          `[${timestamp}] [MIN-HEAP] Settled Router F with optimal cost 13`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [SHORTEST PATH CONVERGED] ${sourceRouter} -> C -> B -> D -> E -> ${destRouter}`,
          `[${timestamp}] [SUCCESS] Optimal Path found! Minimum Metric Cost = ${destRouter === 'F' ? '13' : '8'} in 0.8ms`
        ];
      } else {
        logs = [
          `[${timestamp}] [RIP INIT] Distance vector initialized for Router ${sourceRouter}: [A:0, B:INF, C:INF, D:INF, E:INF, F:INF]`,
          `[${timestamp}] [ITERATION 1] Exchanging distance vectors with 1-hop neighbors...`,
          `[${timestamp}]   --> Received vector from Neighbor C: c(A,C)=2`,
          `[${timestamp}]   --> Received vector from Neighbor B: c(A,B)=4`,
          `[${timestamp}] [ITERATION 2] Bellman-Ford Equation: D_A(y) = min_v { c(A,v) + D_v(y) }`,
          `[${timestamp}]   --> Updated route to D via B: Cost = 4 + 5 = 9`,
          `[${timestamp}]   --> Updated route to B via C: Cost = 2 + 1 = 3 (Path optimized!)`,
          `[${timestamp}] [ITERATION 3] Multi-hop propagation reaching boundary routers...`,
          `[${timestamp}]   --> Updated route to E via D: Cost = 8 + 2 = 10`,
          `[${timestamp}]   --> Updated route to F via E: Cost = 10 + 3 = 13`,
          `[${timestamp}] [ITERATION 4] 0 vector updates detected across all interfaces.`,
          `[${timestamp}] -------------------------------------------------------------`,
          `[${timestamp}] [CONVERGENCE] Routing table fully converged in 3 distributed iterations.`
        ];
      }

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 700);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Algorithm Selector Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>LAYER 3 ROUTING PROTOCOLS CODE LAB</span>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {currentAlgoData.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {currentAlgoData.explanation}
            </p>
          </div>

          {/* Algorithm Switcher */}
          <div className="bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl flex items-center gap-1 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => setSelectedAlgo('dijkstra')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAlgo === 'dijkstra'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Dijkstra (OSPF)</span>
            </button>

            <button
              onClick={() => setSelectedAlgo('distanceVector')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                selectedAlgo === 'distanceVector'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Distance-Vector (RIP)</span>
            </button>
          </div>
        </div>

        {/* Complexity & Specs Tags */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span className="text-slate-500 dark:text-slate-400">
            Time Complexity: <strong className="text-emerald-600 dark:text-emerald-400">{currentAlgoData.complexity.time}</strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Space: <strong className="text-indigo-600 dark:text-indigo-400">{currentAlgoData.complexity.space}</strong>
          </span>
          <span>•</span>
          <span className="text-slate-500 dark:text-slate-400">
            Standard Protocol: <strong className="text-cyan-600 dark:text-cyan-400">{currentAlgoData.protocol}</strong>
          </span>
        </div>
      </div>

      {/* Main Code & Interactive Execution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Multi-Language Code Viewer */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-xl">
          {/* Code Toolbar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Language Switcher: Python 3, C++, Java */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setSelectedLang('python')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'python'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setSelectedLang('cpp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'cpp'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                C++
              </button>
              <button
                onClick={() => setSelectedLang('java')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedLang === 'java'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Java
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-colors cursor-pointer"
              title="Copy code to clipboard"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-4 sm:p-5 overflow-x-auto font-mono text-xs sm:text-[13px] leading-relaxed max-h-[520px] overflow-y-auto custom-scrollbar">
            <pre className="text-slate-200 whitespace-pre">
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Simulation & Console Runner */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Topology Path Execution Console
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                6-Router Mesh
              </span>
            </div>

            {/* Interactive Inputs */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Source Router
                </label>
                <select
                  value={sourceRouter}
                  onChange={(e) => setSourceRouter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((r) => (
                    <option key={r} value={r}>
                      Router {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Destination Router
                </label>
                <select
                  value={destRouter}
                  onChange={(e) => setDestRouter(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((r) => (
                    <option key={r} value={r}>
                      Router {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isExecuting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>{isExecuting ? 'Computing Shortest Path...' : `Run ${selectedAlgo === 'dijkstra' ? 'Dijkstra' : 'Bellman-Ford'}`}</span>
              </button>

              <button
                onClick={() => setExecutionLogs([])}
                className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Clear Console"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Real-Time Terminal Execution Output */}
            <div className="rounded-xl bg-[#05070E] border border-slate-800 p-4 font-mono text-xs space-y-2 min-h-[200px] max-h-[270px] overflow-y-auto">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Router Engine Trace</span>
                </div>
                <span>STATUS: {isExecuting ? 'COMPUTING' : 'READY'}</span>
              </div>

              {executionLogs.length === 0 ? (
                <div className="py-6 text-center text-slate-600 text-[11px]">
                  Click <strong className="text-slate-400">"Run Algorithm"</strong> to trace Dijkstra / Distance-Vector convergence on Router {sourceRouter}.
                </div>
              ) : (
                <div className="space-y-1 text-[11px] leading-relaxed">
                  {executionLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`${
                        log.includes('SUCCESS') || log.includes('CONVERGED')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('MIN-HEAP') || log.includes('ITERATION')
                          ? 'text-amber-300 font-semibold'
                          : log.includes('Relaxed') || log.includes('Updated')
                          ? 'text-cyan-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoutingCodeViewer;
