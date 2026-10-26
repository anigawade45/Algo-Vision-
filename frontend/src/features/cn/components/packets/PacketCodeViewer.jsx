import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw
} from 'lucide-react';
import { PACKET_TRANSMISSION_DATA } from '../../data/packetTransmissionData';

export function PacketCodeViewer() {
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [sourceNode, setSourceNode] = useState('Host A (192.168.1.10)');
  const [destNode, setDestNode] = useState('Web Server (172.16.0.80)');
  const [customPayload, setCustomPayload] = useState('GET /index.html HTTP/1.1');

  const codeSnippets = {
    python: {
      name: 'Python 3',
      filename: 'packet_transmission.py',
      code: PACKET_TRANSMISSION_DATA.pythonCode
    },
    cpp: {
      name: 'C++',
      filename: 'packet_transmission.cpp',
      code: PACKET_TRANSMISSION_DATA.cppCode
    },
    java: {
      name: 'Java',
      filename: 'PacketTransmissionDemo.java',
      code: PACKET_TRANSMISSION_DATA.javaCode
    }
  };

  const currentSnippet = codeSnippets[selectedLang] || codeSnippets.python;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setIsExecuting(true);
    setExecutionLogs([`[KERNEL] Initializing multi-layer packet framing from ${sourceNode}...`]);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 2,
      });

      const logs = [
        `[${timestamp}] [L7 APPLICATION] Payload prepared: "${customPayload}"`,
        `[${timestamp}] [L4 TRANSPORT] TCP Segment constructed -> SrcPort: 52412, DstPort: 80, Seq: 1001, Flags: [ACK, PSH]`,
        `[${timestamp}] [L3 NETWORK] IPv4 Packet formed -> SrcIP: 192.168.1.10, DstIP: 172.16.0.80, TTL: 64, Proto: TCP(6)`,
        `[${timestamp}] [L2 DATA LINK] Ethernet Frame encapsulated -> SrcMAC: 00:1A:2B:3C:4D:01, DstMAC: 00:50:56:FE:ED:01 (Gateway R1)`,
        `[${timestamp}] [L1 PHYSICAL] Bitstream modulated onto local LAN switch port.`,
        `[${timestamp}] -------------------------------------------------------------`,
        `[${timestamp}] [ROUTER HOP 1: Gateway R1] Frame de-encapsulated. Destination IP lookup: 172.16.0.80`,
        `[${timestamp}]   --> TTL decremented: 64 -> 63`,
        `[${timestamp}]   --> MAC rewritten: Old (00:1A:2B:3C:4D:01) -> New Egress (00:50:56:FE:ED:02 -> R2 Ingress 00:50:56:FE:ED:03)`,
        `[${timestamp}] [ROUTER HOP 2: Core Router R2] Routed over WAN backbone.`,
        `[${timestamp}]   --> TTL decremented: 63 -> 62`,
        `[${timestamp}]   --> MAC rewritten: 00:50:56:FE:ED:04 -> Target Web Server (AA:BB:CC:DD:EE:80)`,
        `[${timestamp}] -------------------------------------------------------------`,
        `[${timestamp}] [RECEIVER: Web Server] CRC-32 FCS verified. Stripped L2, L3, L4 headers.`,
        `[${timestamp}] [SUCCESS] Delivered payload "${customPayload}" to Web Server process on Port 80 in 1.4ms!`
      ];

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 750);
  };

  return (
    <div className="space-y-6 font-sans">
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
              <code>{currentSnippet.code}</code>
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
                  Hop-by-Hop Transmission Simulator
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">
                Live Console
              </span>
            </div>

            {/* Interactive Inputs */}
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Source Node
                </label>
                <select
                  value={sourceNode}
                  onChange={(e) => setSourceNode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="Host A (192.168.1.10)">Host A (192.168.1.10 - Workstation)</option>
                  <option value="Host B (192.168.1.20)">Host B (192.168.1.20 - Laptop)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Destination Node
                </label>
                <select
                  value={destNode}
                  onChange={(e) => setDestNode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                >
                  <option value="Web Server (172.16.0.80)">Web Server (172.16.0.80 - Port 80)</option>
                  <option value="Database Server (172.16.0.90)">Database Server (172.16.0.90 - Port 5432)</option>
                  <option value="Public DNS (8.8.8.8)">Public DNS Server (8.8.8.8 - Port 53)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                  Payload Message
                </label>
                <input
                  type="text"
                  value={customPayload}
                  onChange={(e) => setCustomPayload(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white outline-none"
                  placeholder="e.g. GET /index.html HTTP/1.1"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleRunSimulation}
                  disabled={isExecuting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isExecuting ? 'Transmitting...' : 'Run Simulation'}</span>
                </button>

                <button
                  onClick={() => setExecutionLogs([])}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                  title="Clear Console"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Real-Time Terminal Execution Output */}
            <div className="rounded-xl bg-[#05070E] border border-slate-800 p-4 font-mono text-xs space-y-2 min-h-[190px] max-h-[260px] overflow-y-auto">
              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-900 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Terminal Trace</span>
                </div>
                <span>STATUS: {isExecuting ? 'ACTIVE' : 'IDLE'}</span>
              </div>

              {executionLogs.length === 0 ? (
                <div className="py-6 text-center text-slate-600 text-[11px]">
                  Click <strong className="text-slate-400">"Run Simulation"</strong> to execute hop-by-hop packet transit & header decoding.
                </div>
              ) : (
                <div className="space-y-1 text-[11px] leading-relaxed">
                  {executionLogs.map((log, index) => (
                    <div
                      key={index}
                      className={`${
                        log.includes('SUCCESS')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('ROUTER HOP')
                          ? 'text-amber-300 font-semibold'
                          : log.includes('L2') || log.includes('L3') || log.includes('L4') || log.includes('L7')
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

export default PacketCodeViewer;
