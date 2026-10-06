import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Server,
  Router as RouterIcon,
  Layers,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Send,
  Eye,
  Info,
  Shield,
  Clock,
  Sparkles,
  Check,
  Radio,
  HardDrive
} from 'lucide-react';
import { PACKET_TRANSMISSION_DATA } from '../../data/packetTransmissionData';

export function PacketFlowSimulator() {
  const [selectedSourceId, setSelectedSourceId] = useState('host-a');
  const [selectedDestId, setSelectedDestId] = useState('web-server');
  const [messagePayload, setMessagePayload] = useState('GET /index.html HTTP/1.1');
  const [currentHopIndex, setCurrentHopIndex] = useState(0); // 0 to 5
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHeaderView, setSelectedHeaderView] = useState('ip'); // 'ip', 'mac', 'tcp', 'payload'
  const [isInspectorModalOpen, setIsInspectorModalOpen] = useState(false);

  const sources = PACKET_TRANSMISSION_DATA.networkNodes.sources;
  const destinations = PACKET_TRANSMISSION_DATA.networkNodes.destinations;

  const currentSource = sources.find((s) => s.id === selectedSourceId) || sources[0];
  const currentDest = destinations.find((d) => d.id === selectedDestId) || destinations[0];

  // 6 Simulation Hops
  const hops = [
    {
      hop: 1,
      title: 'Hop 1: Sender Host Encapsulation (L7 ➔ L1)',
      location: `${currentSource.name} (Source LAN)`,
      srcMac: currentSource.mac,
      dstMac: '00:50:56:FE:ED:01 (Gateway R1)',
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 64,
      pdu: 'Frame (Ethernet II) ➔ Bits',
      pduStage: 'Encapsulating: Data ➔ Segment ➔ Packet ➔ Frame ➔ Bits',
      desc: `Host encapsulates application payload with TCP (${currentSource.port} ➔ ${currentDest.port}), IP (${currentSource.ip} ➔ ${currentDest.ip}, TTL 64), and Ethernet MAC (${currentSource.mac} ➔ Gateway R1).`
    },
    {
      hop: 2,
      title: 'Hop 2: Local LAN Switch Forwarding (Layer 2)',
      location: 'LAN Switch 1 (Local Subnet)',
      srcMac: currentSource.mac,
      dstMac: '00:50:56:FE:ED:01 (Gateway R1)',
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 64,
      pdu: 'Frame (Ethernet II)',
      pduStage: 'Layer 2 Hardware Switching (0 header changes)',
      desc: 'Switch 1 performs Layer 2 CAM table lookup for Destination MAC. Forwards frame directly to Gateway Router R1 port without modifying IP or MAC headers.'
    },
    {
      hop: 3,
      title: 'Hop 3: Gateway Router R1 ➔ WAN Routing (Layer 3)',
      location: 'Gateway Router R1 (Routing Decision)',
      srcMac: '00:50:56:FE:ED:02 (R1 Egress)',
      dstMac: '00:50:56:FE:ED:03 (R2 Ingress)',
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 63,
      pdu: 'Packet ➔ New Frame',
      pduStage: 'L3 Routing: TTL decremented to 63, MAC rewritten',
      desc: `Router R1 strips L2 Frame, inspects Destination IP (${currentDest.ip}), decrements TTL from 64 ➔ 63, re-encapsulates with new WAN link MACs, and forwards to Core Router R2.`
    },
    {
      hop: 4,
      title: 'Hop 4: Core Router R2 ➔ Data Center Gateway',
      location: 'Core Router R2 (ISP Backbone)',
      srcMac: '00:50:56:FE:ED:04 (R2 Egress)',
      dstMac: currentDest.mac,
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 62,
      pdu: 'Packet ➔ Final Frame',
      pduStage: 'L3 Routing: TTL decremented to 62, MAC rewritten',
      desc: `Core Router R2 inspects route table, decrements TTL to 62, rewrites Frame Destination MAC to target server (${currentDest.mac}), and dispatches to local switch.`
    },
    {
      hop: 5,
      title: 'Hop 5: Data Center Switch 2 Delivery',
      location: 'Data Center Switch 2',
      srcMac: '00:50:56:FE:ED:04',
      dstMac: currentDest.mac,
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 62,
      pdu: 'Frame (Ethernet II)',
      pduStage: 'L2 Forwarding directly to destination server NIC port',
      desc: `Switch 2 switches frame to the dedicated server port for MAC ${currentDest.mac}.`
    },
    {
      hop: 6,
      title: 'Hop 6: Destination Server Decapsulation (L1 ➔ L7)',
      location: `${currentDest.name} (Destination)`,
      srcMac: '00:50:56:FE:ED:04',
      dstMac: currentDest.mac,
      srcIp: currentSource.ip,
      dstIp: currentDest.ip,
      ttl: 62,
      pdu: 'Bits ➔ Frame ➔ Packet ➔ Segment ➔ Data',
      pduStage: 'Decapsulating: Application receives payload!',
      desc: `Server NIC receives bits, verifies FCS CRC-32, strips Ethernet header, strips IP header, strips TCP header on Port ${currentDest.port}, and passes payload "${messagePayload}" to web service!`
    }
  ];

  const currentHop = hops[currentHopIndex] || hops[0];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentHopIndex((prev) => {
          if (prev >= hops.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, hops.length]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentHopIndex < hops.length - 1) setCurrentHopIndex(currentHopIndex + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentHopIndex > 0) setCurrentHopIndex(currentHopIndex - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentHopIndex(0);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Top Configuration Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive Multi-Hop Packet Transmission Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure source, destination, and payload to trace packet flow, TTL decrements, and MAC address rewriting.
          </p>
        </div>

        <button
          onClick={() => setIsInspectorModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-mono font-bold hover:bg-indigo-100 transition-colors cursor-pointer self-start lg:self-center"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-500" />
          <span>Inspect Active Packet Headers</span>
        </button>
      </div>

      {/* Selectors for Source, Destination, Payload */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 font-mono text-xs">
        <div className="md:col-span-3 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">1. Source Device</label>
          <select
            value={selectedSourceId}
            onChange={(e) => {
              setSelectedSourceId(e.target.value);
              setCurrentHopIndex(0);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
          >
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.ip})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">2. Destination Device</label>
          <select
            value={selectedDestId}
            onChange={(e) => {
              setSelectedDestId(e.target.value);
              setCurrentHopIndex(0);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.ip})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-4 space-y-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 block">3. Application Message / Payload</label>
          <input
            type="text"
            value={messagePayload}
            onChange={(e) => {
              setMessagePayload(e.target.value);
              setCurrentHopIndex(0);
            }}
            placeholder="e.g. GET /index.html"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="md:col-span-2 flex items-end">
          <button
            onClick={() => {
              setCurrentHopIndex(0);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-mono font-bold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Transmit</span>
          </button>
        </div>
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-mono text-xs font-extrabold shadow-xs shrink-0">
            Hop {currentHopIndex + 1} / {hops.length}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {currentHop.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {currentHop.desc}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentHopIndex === 0}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Hop"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play Flow'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentHopIndex === hops.length - 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Next Hop"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Reset Transmission"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Multi-Hop Network Topology Canvas */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white space-y-6 shadow-inner">
        {/* Clickable Moving Packet Pill Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Current PDU in Transit:</span>
            <button
              onClick={() => setIsInspectorModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md animate-pulse cursor-pointer"
              title="Click to inspect headers"
            >
              <Eye className="w-3 h-3" />
              <span>{currentHop.pdu} • [Click Packet to Inspect]</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span>
              End-to-End IP: <strong className="text-cyan-400">{currentSource.ip} ➔ {currentDest.ip}</strong>
            </span>
            <span>•</span>
            <span>
              TTL: <strong className="text-amber-400">{currentHop.ttl}</strong>
            </span>
          </div>
        </div>

        {/* 6 Network Nodes Topology Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Node 1: Source Host */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 0
              ? 'bg-cyan-950/80 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold truncate">{currentSource.name}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">{currentSource.ip}</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">{currentSource.mac}</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700 font-bold">
              Port: {currentSource.port}
            </span>
          </div>

          {/* Node 2: Local Switch 1 */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 1
              ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">LAN Switch 1</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">Layer 2 Bridge</p>
              <p className="text-[9px] text-slate-400 font-mono">CAM Switching</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
              L2 Forwarding
            </span>
          </div>

          {/* Node 3: Gateway Router R1 */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 2
              ? 'bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <RouterIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Gateway R1</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">192.168.1.1</p>
              <p className="text-[9px] text-slate-400 font-mono">TTL: 64 ➔ 63</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              L3 Routing Hop
            </span>
          </div>

          {/* Node 4: Core Router R2 */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 3
              ? 'bg-amber-950/80 border-amber-500 shadow-lg shadow-amber-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <RouterIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Core Router R2</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">10.0.0.2 (ISP)</p>
              <p className="text-[9px] text-slate-400 font-mono">TTL: 63 ➔ 62</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
              WAN Relay
            </span>
          </div>

          {/* Node 5: Data Center Switch 2 */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 4
              ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">DC Switch 2</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">Layer 2 Switch</p>
              <p className="text-[9px] text-slate-400 font-mono">Final Subnet</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
              L2 Ingress
            </span>
          </div>

          {/* Node 6: Destination Server */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentHopIndex === 5
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Server className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold truncate">{currentDest.name}</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono">{currentDest.ip}</p>
              <p className="text-[9px] text-slate-400 font-mono truncate">{currentDest.mac}</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Port: {currentDest.port}
            </span>
          </div>
        </div>

        {/* Live Hop Header Inspection Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Source IP (End-to-End)</span>
            <strong className="text-cyan-400 text-xs block">{currentSource.ip}</strong>
            <span className="text-[10px] text-slate-500">Port: {currentSource.port}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination IP (End-to-End)</span>
            <strong className="text-emerald-400 text-xs block">{currentDest.ip}</strong>
            <span className="text-[10px] text-slate-500">Port: {currentDest.port}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Link MAC Framing</span>
            <div className="text-[11px] text-purple-300 truncate">
              {currentHop.srcMac}
            </div>
            <div className="text-[11px] text-purple-400 font-bold truncate">
              ➔ {currentHop.dstMac}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">PDU Status & TTL</span>
            <strong className="text-amber-400 text-xs block">TTL: {currentHop.ttl} hops remaining</strong>
            <span className="text-[10px] text-slate-300 truncate block">{currentHop.pdu}</span>
          </div>
        </div>
      </div>

      {/* Interactive Header Inspector Modal / Drawer */}
      {isInspectorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 text-slate-100 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    Packet Header Inspector (Hop {currentHopIndex + 1})
                  </h3>
                  <span className="text-xs font-mono text-indigo-400">
                    Location: {currentHop.location}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsInspectorModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {/* Header Inspector Fields */}
            <div className="space-y-4 font-mono text-xs">
              {/* Layer 2: Ethernet Header */}
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/80 space-y-2">
                <div className="flex items-center justify-between text-purple-400 font-bold border-b border-purple-900/60 pb-1.5">
                  <span>Layer 2: Ethernet II Frame Header (14 Bytes)</span>
                  <span className="text-[10px] bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                    Local Hop Only (Rewritten)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Source MAC:</span>
                    <strong className="text-white text-xs">{currentHop.srcMac}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Destination MAC:</span>
                    <strong className="text-white text-xs">{currentHop.dstMac}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">EtherType:</span>
                    <strong className="text-purple-300 text-xs">0x0800 (IPv4)</strong>
                  </div>
                </div>
              </div>

              {/* Layer 3: IPv4 Header */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/80 space-y-2">
                <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-cyan-900/60 pb-1.5">
                  <span>Layer 3: IPv4 Packet Header (20 Bytes)</span>
                  <span className="text-[10px] bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    End-to-End Routing
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Source IP:</span>
                    <strong className="text-white text-xs">{currentSource.ip}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Destination IP:</span>
                    <strong className="text-white text-xs">{currentDest.ip}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Time-To-Live (TTL):</span>
                    <strong className="text-amber-400 text-xs">{currentHop.ttl} (Decrements per hop)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Protocol:</span>
                    <strong className="text-cyan-300 text-xs">6 (TCP)</strong>
                  </div>
                </div>
              </div>

              {/* Layer 4: TCP Segment Header */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/80 space-y-2">
                <div className="flex items-center justify-between text-blue-400 font-bold border-b border-blue-900/60 pb-1.5">
                  <span>Layer 4: TCP Segment Header (20 Bytes)</span>
                  <span className="text-[10px] bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    Port Multiplexing
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Source Port:</span>
                    <strong className="text-white text-xs">{currentSource.port} (Client Ephemeral)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Destination Port:</span>
                    <strong className="text-white text-xs">{currentDest.port} (Service Port)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Seq Number:</span>
                    <strong className="text-blue-300 text-xs">1001</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Flags:</span>
                    <strong className="text-emerald-400 text-xs">ACK, PSH</strong>
                  </div>
                </div>
              </div>

              {/* Layer 7: Application Payload */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/80 space-y-2">
                <div className="flex items-center justify-between text-indigo-400 font-bold border-b border-indigo-900/60 pb-1.5">
                  <span>Layer 7: Application Payload</span>
                  <span className="text-[10px] bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    Raw User Content
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-indigo-900/60 text-emerald-300 font-mono text-xs">
                  {messagePayload}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsInspectorModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Back to Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PacketFlowSimulator;
