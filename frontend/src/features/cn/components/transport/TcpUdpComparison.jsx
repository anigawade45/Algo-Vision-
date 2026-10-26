import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Play,
  Clock,
  Activity
} from 'lucide-react';
import { TRANSPORT_LAYER_DATA } from '../../data/transportData';

export function TcpUdpComparison() {
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix', 'header', 'race'
  const [selectedProtocol, setSelectedProtocol] = useState('tcp'); // 'tcp' or 'udp'
  
  // Live Packet Race Simulator State
  const [isRacing, setIsRacing] = useState(false);
  const [raceProgress, setRaceProgress] = useState({ tcp: 0, udp: 0, tcpPackets: 0, udpPackets: 0, tcpRetransmits: 0 });
  const [raceLog, setRaceLog] = useState([]);

  const { tcp, udp, comparisonMatrix } = TRANSPORT_LAYER_DATA;

  const startRaceSimulation = () => {
    setIsRacing(true);
    setRaceProgress({ tcp: 0, udp: 0, tcpPackets: 0, udpPackets: 0, tcpRetransmits: 0 });
    setRaceLog(['[START] Packet Race Initiated: 1000 KB Data Transfer...']);

    let tcpProg = 0;
    let udpProg = 0;
    let tcpPkt = 0;
    let udpPkt = 0;
    let tcpRetx = 0;

    const interval = setInterval(() => {
      // UDP blasts fast with 0 handshake delay
      if (udpProg < 100) {
        udpProg += 12;
        udpPkt += 15;
      }
      
      // TCP starts with 3-way handshake delay, then uses slow-start window growth
      if (udpProg > 20 && tcpProg < 100) {
        tcpProg += 7;
        tcpPkt += 8;
        if (tcpProg > 40 && tcpProg < 60 && tcpRetx === 0) {
          tcpRetx = 1; // Simulated dropped segment recovered via fast retransmit
        }
      }

      setRaceProgress({
        tcp: Math.min(tcpProg, 100),
        udp: Math.min(udpProg, 100),
        tcpPackets: tcpPkt,
        udpPackets: udpPkt,
        tcpRetransmits: tcpRetx,
      });

      if (udpProg >= 100 && tcpProg >= 100) {
        clearInterval(interval);
        setIsRacing(false);
        setRaceLog((prev) => [
          ...prev,
          '⚡ [UDP FINISH] UDP finished in 320ms (Fastest speed, 0 handshake, best-effort datagrams).',
          '🛡️ [TCP FINISH] TCP finished in 650ms (100% Guaranteed integrity, in-order delivery confirmed via ACKs).'
        ]);
      }
    }, 200);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638]">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'matrix'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            1. Decision Matrix & Feature Tradeoffs
          </button>

          <button
            onClick={() => setActiveTab('header')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'header'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Packet Header Inspector (20B vs 8B)
          </button>

          <button
            onClick={() => setActiveTab('race')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTab === 'race'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            3. Live Packet Throughput Race
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          RFC 793 (TCP) vs RFC 768 (UDP)
        </span>
      </div>

      {/* TAB 1: DECISION MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TCP Summary Card */}
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-blue-200 dark:border-blue-900/60 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    TCP (Transmission Control Protocol)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  RELIABLE STREAM
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Guarantees 100% in-order, error-checked delivery of a continuous stream of octets. Manages network congestion dynamically and adapts to packet drops.
              </p>
              <div className="space-y-2 font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Top Use Cases:</span>
                <div className="flex flex-wrap gap-1.5">
                  {tcp.useCases.map((u, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* UDP Summary Card */}
            <div className="rounded-3xl bg-white dark:bg-[#111827] border border-emerald-200 dark:border-emerald-900/60 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    UDP (User Datagram Protocol)
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  0-RTT DATAGRAM
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Lightweight, stateless fire-and-forget protocol with minimal 8-byte header overhead. Designed for ultra-low latency real-time feeds where speed beats precision.
              </p>
              <div className="space-y-2 font-mono text-xs">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Top Use Cases:</span>
                <div className="flex flex-wrap gap-1.5">
                  {udp.useCases.map((u, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                      {u}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Detailed Matrix Table */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white font-mono uppercase">
                Technical Feature Comparison
              </h3>
              <span className="text-xs font-mono text-slate-400">10 Core Dimensions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#070A12] border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <th className="py-3 px-6">Architectural Feature</th>
                    <th className="py-3 px-6 text-blue-600 dark:text-blue-400 font-bold">TCP (Transmission Control)</th>
                    <th className="py-3 px-6 text-emerald-600 dark:text-emerald-400 font-bold">UDP (User Datagram)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {comparisonMatrix.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#161F33] transition-colors">
                      <td className="py-3.5 px-6 font-bold text-slate-900 dark:text-white font-mono text-xs">
                        {row.feature}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-blue-700 dark:text-blue-300">
                        {row.tcp}
                      </td>
                      <td className="py-3.5 px-6 font-mono text-xs text-emerald-700 dark:text-emerald-300">
                        {row.udp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PACKET HEADER INSPECTOR */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              onClick={() => setSelectedProtocol('tcp')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedProtocol === 'tcp'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Inspect 20-60 Byte TCP Header
            </button>
            <button
              onClick={() => setSelectedProtocol('udp')}
              className={`px-4 py-2 rounded-xl font-bold transition-all ${
                selectedProtocol === 'udp'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-[#111827] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              Inspect 8-Byte UDP Header
            </button>
          </div>

          {/* Visual Header Diagram */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono">
                  {selectedProtocol === 'tcp' ? 'RFC 793 TCP Segment Header Layout' : 'RFC 768 UDP Datagram Header Layout'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProtocol === 'tcp'
                    ? '32-bit row boundary representation (5 rows standard = 20 bytes min).'
                    : 'Fixed 4-field structure (Exactly 64 bits = 8 bytes total).'}
                </p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {selectedProtocol === 'tcp' ? 'Header Size: 20-60 Bytes' : 'Header Size: 8 Bytes Fixed'}
              </span>
            </div>

            {/* Field Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(selectedProtocol === 'tcp' ? tcp.headerFields : udp.headerFields).map((field, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white font-mono">
                      {field.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                      {field.bits}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {field.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE PACKET RACE SIMULATOR */}
      {activeTab === 'race' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono uppercase flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span>Live Packet Throughput Race (1000 KB Transfer)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Compare TCP (with 3-way handshake + cumulative ACKs + loss recovery) vs UDP (0-RTT instant datagram blasting).
                </p>
              </div>

              <button
                onClick={startRaceSimulation}
                disabled={isRacing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white font-bold font-mono text-xs transition-colors shadow-md shadow-purple-600/20 cursor-pointer disabled:cursor-not-allowed"
              >
                {isRacing ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRacing ? 'Racing in progress...' : 'Start Packet Race'}</span>
              </button>
            </div>

            {/* Race Bars */}
            <div className="space-y-6">
              {/* UDP Race Lane */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>UDP (0-RTT Datagram Blasting)</span>
                  </span>
                  <span className="text-slate-400">
                    {raceProgress.udp}% Complete ({raceProgress.udpPackets} Datagrams)
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${raceProgress.udp}%` }}
                  />
                </div>
              </div>

              {/* TCP Race Lane */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>TCP (3-Way Handshake + In-Order ACKs)</span>
                  </span>
                  <span className="text-slate-400">
                    {raceProgress.tcp}% Complete ({raceProgress.tcpPackets} Segments, {raceProgress.tcpRetransmits} Retransmit)
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-200"
                    style={{ width: `${raceProgress.tcp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Race Execution Console */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 shadow-inner">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                Race Engine Telemetry:
              </span>
              {raceLog.map((log, i) => (
                <div
                  key={i}
                  className={`text-[11px] leading-relaxed ${
                    log.includes('UDP') ? 'text-emerald-400' : log.includes('TCP') ? 'text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TcpUdpComparison;
