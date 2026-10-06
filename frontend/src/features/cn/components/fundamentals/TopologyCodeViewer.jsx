import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Layers,
  Cpu,
  Zap,
  Sparkles,
  GitFork,
  BookOpen,
  Info,
  ShieldAlert,
  Clock,
  HardDrive,
  FileCode,
  ArrowRight
} from 'lucide-react';
import { TOPOLOGY_CODE_DATA } from '../../data/topologyCodeData';
import { NETWORK_TOPOLOGIES_DATA } from '../../data/fundamentalsData';

export function TopologyCodeViewer({ defaultTopology = 'bus', onSwitchToLab }) {
  const [selectedTopologyId, setSelectedTopologyId] = useState(defaultTopology);
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [sourceNode, setSourceNode] = useState('Node A');
  const [destNode, setDestNode] = useState('Node C');

  const codeData = TOPOLOGY_CODE_DATA[selectedTopologyId] || TOPOLOGY_CODE_DATA.bus;
  const topoMeta = NETWORK_TOPOLOGIES_DATA[selectedTopologyId] || NETWORK_TOPOLOGIES_DATA.bus;

  const currentCode =
    selectedLang === 'python'
      ? codeData.pythonCode
      : selectedLang === 'cpp'
      ? codeData.cppCode
      : codeData.javaCode;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionLogs([`[EXEC] Initializing ${codeData.title}...`]);

    setTimeout(() => {
      let logs = [];
      const timestamp = new Date().toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 });

      if (selectedTopologyId === 'bus') {
        logs = [
          `[${timestamp}] [BUS] Transmit request: ${sourceNode} -> ${destNode}`,
          `[${timestamp}] [CSMA/CD] Listening to coaxial backbone (Carrier Sense)...`,
          `[${timestamp}] [CSMA/CD] Channel IDLE (Voltage 0.0V). Transmitting Manchester-encoded frame.`,
          `[${timestamp}] [PROPAGATION] Frame traveling in both directions along shared linear cable.`,
          `[${timestamp}]   --> Node B (00:1A:2B:3C:4D:02): MAC mismatch -> Frame discarded.`,
          `[${timestamp}]   --> ${destNode} (00:1A:2B:3C:4D:03): DESTINATION MAC MATCHED! Frame accepted.`,
          `[${timestamp}]   --> Node D (00:1A:2B:3C:4D:04): MAC mismatch -> Frame discarded.`,
          `[${timestamp}] [TERMINATION] 50-ohm terminator absorbed residual wave at cable ends.`,
          `[${timestamp}] [STATUS] SUCCESS: Frame delivered with 0 collisions.`
        ];
      } else if (selectedTopologyId === 'star') {
        logs = [
          `[${timestamp}] [SWITCH] Ingress Port 1 received frame from ${sourceNode} (00:00:00:AA:AA:01)`,
          `[${timestamp}] [CAM LEARN] Source MAC dynamically registered: 00:00:00:AA:AA:01 -> Port 1`,
          `[${timestamp}] [CAM LOOKUP] Searching Destination MAC 00:00:00:CC:CC:03 in CAM table...`,
          `[${timestamp}] [CAM HIT] Found 00:00:00:CC:CC:03 mapped to Port 3.`,
          `[${timestamp}] [FORWARDING] Dedicated Full-Duplex Unicast transmitted ONLY on Port 3.`,
          `[${timestamp}] [ISOLATION] Ports 2, 4, 5 remained completely quiet (0 collision domain leak).`,
          `[${timestamp}] [STATUS] SUCCESS: Wire-speed Layer 2 hardware delivery in 1.2 microseconds.`
        ];
      } else if (selectedTopologyId === 'ring') {
        logs = [
          `[${timestamp}] [TOKEN RING] ${sourceNode} has pending frame for ${destNode}.`,
          `[${timestamp}] [TOKEN CAPTURE] Free Token arrived -> ${sourceNode} seized Token (Set State = BUSY).`,
          `[${timestamp}] [HOP 1] Frame passed to downstream neighbor (Repeat & Forward).`,
          `[${timestamp}] [HOP 2] Frame reached ${destNode}: Copied payload into buffer (Set A=1, C=1).`,
          `[${timestamp}] [LOOP RETURN] Frame completed full 360° circle back to ${sourceNode}.`,
          `[${timestamp}] [DELIVERY ACK] ${sourceNode} verified A=1 (Address Recognized) and C=1 (Frame Copied).`,
          `[${timestamp}] [TOKEN RELEASE] ${sourceNode} stripped data frame and released FREE TOKEN downstream.`,
          `[${timestamp}] [STATUS] SUCCESS: Deterministic token-passing roundtrip complete.`
        ];
      } else if (selectedTopologyId === 'mesh') {
        logs = [
          `[${timestamp}] [FULL MESH] ${sourceNode} initiating communication with ${destNode}.`,
          `[${timestamp}] [TOPOLOGY METRICS] Network possesses 5 nodes = 10 dedicated full-duplex lines.`,
          `[${timestamp}] [DIRECT CHANNEL] Active point-to-point line (${sourceNode} <--> ${destNode}) selected.`,
          `[${timestamp}] [TRANSMISSION] 0 intermediate relays required. Transmitted directly in O(1) time.`,
          `[${timestamp}] [PRIVACY] Channel isolated from all other nodes (No eavesdropping possible).`,
          `[${timestamp}] [STATUS] SUCCESS: Dedicated single-hop delivery in 0.4 microseconds.`
        ];
      } else if (selectedTopologyId === 'tree') {
        logs = [
          `[${timestamp}] [HIERARCHICAL TREE] Routing frame from ${sourceNode} (Accounting) to ${destNode} (Engineering).`,
          `[${timestamp}] [TRAVERSAL UP] Packet forwarded from Access Switch to Distribution Switch East.`,
          `[${timestamp}] [LCA LOOKUP] Target is in West Wing. Packet forwarded UP to Core Switch (LCA Root).`,
          `[${timestamp}] [TRAVERSAL DOWN] Core Switch routes DOWN to Distribution Switch West.`,
          `[${timestamp}] [ACCESS FORWARD] Distribution Switch West delivers DOWN to target leaf port.`,
          `[${timestamp}] [STATUS] SUCCESS: Delivered across hierarchical 3-tier enterprise tree in 3 hops.`
        ];
      } else {
        logs = [
          `[${timestamp}] [HYBRID GATEWAY] Dispatching inter-segment packet from ${sourceNode} to ${destNode}.`,
          `[${timestamp}] [SEGMENT CLASSIFICATION] ${sourceNode} in Star Department; ${destNode} in Ring Backbone.`,
          `[${timestamp}] [BRIDGE TRANSLATION] Gateway Bridge converted Ethernet 802.3 Frame -> Token Ring Frame.`,
          `[${timestamp}] [INTER-BUILDING FORWARD] Encapsulated packet traversed fiber backbone bridge.`,
          `[${timestamp}] [DE-ENCAPSULATION] Destination bridge delivered frame to target host buffer.`,
          `[${timestamp}] [STATUS] SUCCESS: Seamless heterogeneous multi-topology routing.`
        ];
      }

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 900);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header Card */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 font-mono text-xs font-bold uppercase">
                <FileCode className="w-3.5 h-3.5" />
                <span>CN TOPOLOGY ALGORITHM & CODE STACK</span>
              </span>
              <span className="text-xs font-mono text-slate-400">
                {codeData.standard}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {codeData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              {codeData.summary}
            </p>
          </div>

          {onSwitchToLab && (
            <button
              onClick={onSwitchToLab}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors self-start shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Test in Visual Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 6 Topology Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {Object.values(TOPOLOGY_CODE_DATA).map((top) => {
            const isSelected = top.id === selectedTopologyId;
            return (
              <button
                key={top.id}
                onClick={() => {
                  setSelectedTopologyId(top.id);
                  setExecutionLogs([]);
                }}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800'
                }`}
              >
                <span className="capitalize">{top.id} Topology</span>
                <span className={`text-[10px] font-normal opacity-80 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {top.id === 'bus' && 'CSMA/CD'}
                  {top.id === 'star' && 'Switch CAM'}
                  {top.id === 'ring' && 'Token Ring'}
                  {top.id === 'mesh' && 'Direct O(1)'}
                  {top.id === 'tree' && 'LCA Spanning'}
                  {top.id === 'hybrid' && 'Bridge Gateway'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Metrics & Theoretical Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            <Clock className="w-4 h-4" />
            <span>TIME COMPLEXITY & LATENCY</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {codeData.complexity.time}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Delivery overhead across medium
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            <HardDrive className="w-4 h-4" />
            <span>CABLE & INFRASTRUCTURE</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono truncate" title={codeData.cableFormula}>
            {codeData.cableFormula}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Physical channel deployment cost
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-1.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-4 h-4" />
            <span>COLLISION & FAULT METRIC</span>
          </div>
          <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
            {codeData.complexity.collisionProb}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Media contention & reliability
          </p>
        </div>
      </div>

      {/* Main Code & Interactive Execution Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Multi-Language Code Viewer */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden shadow-xl">
          {/* Code Toolbar */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
            {/* Language Switcher: Python, C++, Java */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setSelectedLang('python')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedLang === 'python'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Python 3
              </button>
              <button
                onClick={() => setSelectedLang('cpp')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedLang === 'cpp'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                C++
              </button>
              <button
                onClick={() => setSelectedLang('java')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  selectedLang === 'java'
                    ? 'bg-blue-600 text-white shadow-xs'
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

          {/* Key Engineering Features Bar */}
          <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Standard: {codeData.standard}</span>
            </div>
            <span className="text-slate-500">Lines: {currentCode.split('\n').length}</span>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Code Runner & Execution Console */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Interactive Execution Controls */}
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase">
                  Interactive Code Runner
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                LIVE OUTPUT
              </span>
            </div>

            {/* Test Node Selectors */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Source Host</label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white font-bold cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Node A">Node A (Port 1)</option>
                  <option value="Node B">Node B (Port 2)</option>
                  <option value="Node C">Node C (Port 3)</option>
                  <option value="Node D">Node D (Port 4)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Destination Host</label>
                <select
                  value={destNode}
                  onChange={(e) => setDestNode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white font-bold cursor-pointer outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Node C">Node C (Port 3)</option>
                  <option value="Node A">Node A (Port 1)</option>
                  <option value="Node B">Node B (Port 2)</option>
                  <option value="Node D">Node D (Port 4)</option>
                  <option value="Node E">Node E (Port 5)</option>
                </select>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isExecuting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-emerald-600/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Executing Protocol Code...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Topology Simulation Code</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Console */}
          <div className="flex-1 min-h-[260px] rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs flex flex-col space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>algovision-terminal@cn-kernel:~$</span>
              </span>
              <button
                onClick={() => setExecutionLogs([])}
                className="hover:text-slate-300 transition-colors"
                title="Clear console"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar text-[11px] leading-relaxed">
              {executionLogs.length === 0 ? (
                <div className="text-slate-600 py-8 text-center">
                  Click <strong>"Run Topology Simulation Code"</strong> above to see protocol dispatch, frame propagation, and MAC matching in action.
                </div>
              ) : (
                executionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`font-mono ${
                      log.includes('SUCCESS')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('COLLISION') || log.includes('ERROR')
                        ? 'text-red-400 font-bold'
                        : log.includes('LEARN') || log.includes('MATCH')
                        ? 'text-cyan-300'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Key Implementation Takeaways */}
          <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
            <h4 className="text-xs font-bold font-mono text-blue-900 dark:text-blue-200 uppercase flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-500" />
              <span>Key Protocol Concepts</span>
            </h4>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
              {codeData.keyFeatures.map((feat, idx) => (
                <li key={idx} className="leading-snug">
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopologyCodeViewer;
