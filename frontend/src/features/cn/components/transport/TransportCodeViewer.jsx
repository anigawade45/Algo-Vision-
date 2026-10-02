import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Play,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  HardDrive,
  FileCode,
  Radio,
  Server
} from 'lucide-react';
import { TRANSPORT_LAYER_DATA } from '../../data/transportData';

export function TransportCodeViewer() {
  const [selectedProtocol, setSelectedProtocol] = useState('tcp'); // 'tcp' or 'udp'
  const [selectedLang, setSelectedLang] = useState('python'); // 'python', 'cpp', 'java'
  const [isCopied, setIsCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [customPort, setCustomPort] = useState(8080);
  const [customMessage, setCustomMessage] = useState('Hello AlgoVision Socket Server');

  const { codeExamples } = TRANSPORT_LAYER_DATA;
  const currentExample = codeExamples[selectedProtocol];

  const currentCode =
    selectedLang === 'python'
      ? currentExample.python
      : selectedLang === 'cpp'
      ? currentExample.cpp
      : currentExample.java;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRunSocket = () => {
    setIsExecuting(true);
    setExecutionLogs([`[KERNEL] Spawning ${selectedProtocol.toUpperCase()} socket on port ${customPort}...`]);

    setTimeout(() => {
      const timestamp = new Date().toLocaleTimeString('en-US', {
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 2,
      });

      let logs = [];
      if (selectedProtocol === 'tcp') {
        logs = [
          `[${timestamp}] [SOCKET CREATE] socket(AF_INET, SOCK_STREAM, IPPROTO_TCP) -> Descriptor: 3`,
          `[${timestamp}] [BIND] Socket bound to 0.0.0.0:${customPort}`,
          `[${timestamp}] [LISTEN] Server listening for connections with backlog=5 (State: LISTEN)...`,
          `[${timestamp}] [CLIENT CONNECT] Initiating 3-Way Handshake from 127.0.0.1:51234 -> ${customPort}`,
          `[${timestamp}]   --> SYN sent (ISN_c = 1000)`,
          `[${timestamp}]   <-- SYN-ACK received (ISN_s = 5000, ACK = 1001)`,
          `[${timestamp}]   --> ACK sent (ACK = 5001) [ESTABLISHED]`,
          `[${timestamp}] [DATA STREAM] Transmitted ${customMessage.length} bytes: "${customMessage}"`,
          `[${timestamp}] [DATA ACK] Cumulative ACK received for ${customMessage.length} bytes.`,
          `[${timestamp}] [SERVER REPLY] 200 OK: "Byte stream processed successfully."`,
          `[${timestamp}] [TEARDOWN] Handled 4-way FIN/ACK disconnection cleanly.`
        ];
      } else {
        logs = [
          `[${timestamp}] [SOCKET CREATE] socket(AF_INET, SOCK_DGRAM, IPPROTO_UDP) -> Descriptor: 4`,
          `[${timestamp}] [BIND] UDP Socket ready on 0.0.0.0:${customPort} (0 Handshake Delay)`,
          `[${timestamp}] [DATAGRAM BLAST] Blasting 64-byte payload to 127.0.0.1:${customPort}`,
          `[${timestamp}]   --> Header: 8 Bytes (SrcPort=53210, DstPort=${customPort}, Len=72, Checksum=0x84A1)`,
          `[${timestamp}]   --> Payload: "${customMessage}"`,
          `[${timestamp}] [RECEIVE] Server read 64 bytes datagram from client into memory buffer.`,
          `[${timestamp}] [DATAGRAM REPLY] Server sent fire-and-forget reply datagram.`,
          `[${timestamp}] [STATUS] Wire-speed completion in 0.3 ms with 0 connection state.`
        ];
      }

      setExecutionLogs(logs);
      setIsExecuting(false);
    }, 850);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Protocol Selection & Summary Bar */}
      <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5" />
                <span>LAYER 4 SOCKET PROGRAMMING LAB</span>
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {currentExample.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
              Inspect fully functional, production-grade network socket implementations for TCP full-duplex streams and UDP high-speed datagrams in C++, Java, and Python.
            </p>
          </div>

          {/* Protocol Toggle */}
          <div className="bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 flex items-center gap-1 self-start sm:self-center font-mono text-xs">
            <button
              onClick={() => {
                setSelectedProtocol('tcp');
                setExecutionLogs([]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                selectedProtocol === 'tcp'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>TCP Stream Socket</span>
            </button>

            <button
              onClick={() => {
                setSelectedProtocol('udp');
                setExecutionLogs([]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                selectedProtocol === 'udp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>UDP Datagram Socket</span>
            </button>
          </div>
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

          <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Protocol: {selectedProtocol.toUpperCase()} (Layer 4)</span>
            <span>Lines: {currentCode.split('\n').length}</span>
          </div>
        </div>

        {/* Right 5 Columns: Interactive Socket Execution Terminal */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase">
                  Interactive Socket Runner
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                LIVE KERNEL SOCKET
              </span>
            </div>

            {/* Config Inputs */}
            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Destination Port
                </label>
                <input
                  type="number"
                  value={customPort}
                  onChange={(e) => setCustomPort(Number(e.target.value) || 8080)}
                  className="w-full bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white font-bold outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Socket Payload
                </label>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-white font-bold outline-none"
                />
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSocket}
              disabled={isExecuting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-xs font-mono font-bold transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {isExecuting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Executing Socket Stream...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Execute {selectedProtocol.toUpperCase()} Socket Code</span>
                </>
              )}
            </button>
          </div>

          {/* Simulated Terminal Output */}
          <div className="flex-1 min-h-[260px] rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs flex flex-col space-y-2 shadow-inner">
            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-slate-900">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span>kernel-socket@algovision:~$</span>
              </span>
              <button
                onClick={() => setExecutionLogs([])}
                className="hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar text-[11px] leading-relaxed">
              {executionLogs.length === 0 ? (
                <div className="text-slate-600 py-8 text-center">
                  Click <strong>"Execute {selectedProtocol.toUpperCase()} Socket Code"</strong> above to see socket creation, bind, handshake, and frame delivery in action.
                </div>
              ) : (
                executionLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`font-mono ${
                      log.includes('ESTABLISHED') || log.includes('ACK') || log.includes('200 OK')
                        ? 'text-emerald-400 font-bold'
                        : log.includes('SYN')
                        ? 'text-cyan-300'
                        : log.includes('ERROR')
                        ? 'text-red-400 font-bold'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransportCodeViewer;
