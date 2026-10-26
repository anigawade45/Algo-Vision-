import React, { useState, useEffect } from 'react';
import { 
  Send, 
  RefreshCw, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Activity, 
  Server, 
  Laptop,
  CheckCircle2
} from 'lucide-react';

const SAMPLE_MESSAGES = [
  { id: 'http', label: 'HTTP GET /index.html', size: '1.4 KB', type: 'Web Traffic' },
  { id: 'dns', label: 'DNS Query: google.com', size: '64 Bytes', type: 'Name Resolution' },
  { id: 'stream', label: 'Video Frame (1080p)', size: '24.0 KB', type: 'Real-time UDP' },
  { id: 'iot', label: 'IoT Sensor: 24.5°C', size: '16 Bytes', type: 'Telemetry MQTT' },
];

export function IntroSection() {
  const [selectedMessage, setSelectedMessage] = useState(SAMPLE_MESSAGES[0]);
  const [bandwidth, setBandwidth] = useState('100'); // 10, 100, 1000 Mbps
  const [latencyMs, setLatencyMs] = useState(30); // 10ms - 200ms
  const [simulateLoss, setSimulateLoss] = useState(false);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [packetProgress, setPacketProgress] = useState(0); // 0 to 100%
  const [transmissionStatus, setTransmissionStatus] = useState('idle'); // idle, in-flight, delivered, dropped

  const handleSendPacket = () => {
    if (isTransmitting) return;
    setIsTransmitting(true);
    setPacketProgress(0);
    setTransmissionStatus('in-flight');

    const duration = Math.max(600, (latencyMs * 15) * (100 / parseInt(bandwidth)));
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setPacketProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsTransmitting(false);
        if (simulateLoss && Math.random() > 0.4) {
          setTransmissionStatus('dropped');
        } else {
          setTransmissionStatus('delivered');
        }
      }
    }, 20);
  };

  const handleReset = () => {
    setIsTransmitting(false);
    setPacketProgress(0);
    setTransmissionStatus('idle');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Definition Card */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Fundamental Concept
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              What is a Computer Network?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
              A <strong>Computer Network</strong> is a telecommunications system that connects two or more autonomous computing devices (nodes) using physical or wireless media to exchange data, share hardware peripherals, and run distributed software.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="block text-xs font-mono text-slate-400">Primary Goal</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">Resource & Information Sharing</span>
            </div>
          </div>
        </div>

        {/* 5 Core Pillars of Data Communication */}
        <div className="pt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>The 5 Pillars of Data Communication</span>
            <span className="text-[11px] font-mono text-slate-400 font-normal">(Sender → Protocol → Medium → Message → Receiver)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { num: '1', name: 'Sender (Source)', desc: 'The originating device generating the data payload.', icon: 'Laptop', color: 'emerald' },
              { num: '2', name: 'Receiver (Sink)', desc: 'The designated destination device that consumes the payload.', icon: 'Server', color: 'blue' },
              { num: '3', name: 'Message (Payload)', desc: 'The actual data being transferred (bits, frames, packets).', icon: 'FileText', color: 'amber' },
              { num: '4', name: 'Transmission Medium', desc: 'The physical wire (twisted-pair, fiber) or radio spectrum.', icon: 'Radio', color: 'purple' },
              { num: '5', name: 'Protocol (Rules)', desc: 'Set of agreed syntax, semantics, and synchronization rules.', icon: 'ShieldCheck', color: 'cyan' },
            ].map((pillar) => (
              <div
                key={pillar.num}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/70 dark:border-[#1E2638] space-y-2 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold flex items-center justify-center">
                    {pillar.num}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-slate-400">Pillar {pillar.num}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{pillar.name}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Network Transmission Simulator */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-semibold mb-1">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>INTERACTIVE DATA FLOW SANDBOX</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Live Data Transmission Simulation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure parameters, select a protocol payload, and trigger end-to-end packet propagation across the medium.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Reset Sandbox"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSendPacket}
              disabled={isTransmitting}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md transition-all ${
                isTransmitting
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isTransmitting ? 'Transmitting...' : 'Send Packet'}</span>
            </button>
          </div>
        </div>

        {/* Simulator Canvas */}
        <div className="relative p-6 sm:p-8 rounded-2xl bg-slate-950 border border-slate-800 text-white overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d15_1px,transparent_1px),linear-gradient(to_bottom,#1f293d15_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 my-4">
            {/* Sender Node */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                isTransmitting ? 'border-emerald-400 bg-emerald-950/60 shadow-lg shadow-emerald-500/30' : 'border-slate-700 bg-slate-900'
              }`}>
                <Laptop className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Host A (Sender)</span>
                <span className="block text-[10px] font-mono text-slate-500">192.168.1.10</span>
              </div>
            </div>

            {/* Transmission Wire / Channel */}
            <div className="flex-1 w-full max-w-lg relative py-6">
              {/* Wire line */}
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75"
                  style={{ width: `${packetProgress}%` }}
                />
              </div>

              {/* Moving Packet Marker */}
              {isTransmitting && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-75"
                  style={{ left: `${packetProgress}%` }}
                >
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold shadow-lg shadow-emerald-500/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                    <span>{selectedMessage.size}</span>
                  </div>
                </div>
              )}

              {/* Wire Specs Labels */}
              <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400">
                <span>Cat6 Copper Wire</span>
                <span className="text-emerald-400">{bandwidth} Mbps Link</span>
                <span>Latency: {latencyMs}ms</span>
              </div>
            </div>

            {/* Receiver Node */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                transmissionStatus === 'delivered' 
                  ? 'border-teal-400 bg-teal-950/60 shadow-lg shadow-teal-500/30' 
                  : transmissionStatus === 'dropped'
                  ? 'border-rose-500 bg-rose-950/60 shadow-lg shadow-rose-500/30'
                  : 'border-slate-700 bg-slate-900'
              }`}>
                <Server className={`w-8 h-8 ${
                  transmissionStatus === 'delivered' ? 'text-teal-400' : transmissionStatus === 'dropped' ? 'text-rose-400' : 'text-slate-400'
                }`} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-200">Host B (Receiver)</span>
                <span className="block text-[10px] font-mono text-slate-500">192.168.1.50</span>
              </div>
            </div>
          </div>

          {/* Status Feedback Banner */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-mono text-[11px]">Status:</span>
              {transmissionStatus === 'idle' && (
                <span className="text-slate-400 font-mono">Ready to transmit</span>
              )}
              {transmissionStatus === 'in-flight' && (
                <span className="text-amber-400 font-mono flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  Packet propagating ({Math.round(packetProgress)}%)...
                </span>
              )}
              {transmissionStatus === 'delivered' && (
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Frame Delivered & Checksum Verified (CRC-32 OK)!
                </span>
              )}
              {transmissionStatus === 'dropped' && (
                <span className="text-rose-400 font-mono font-bold flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Packet Lost in Transit (Simulated Channel Degradation)
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400">
              Payload: <strong className="text-slate-200">{selectedMessage.label}</strong>
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Message Selector */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#1E2638] space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              1. Select Protocol Message
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {SAMPLE_MESSAGES.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    selectedMessage.id === msg.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{msg.label}</span>
                  <span className={`text-[10px] ml-2 ${selectedMessage.id === msg.id ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {msg.size}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Link Bandwidth */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#1E2638] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                2. Link Bandwidth
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {bandwidth} Mbps
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['10', '100', '1000'].map((bw) => (
                <button
                  key={bw}
                  onClick={() => setBandwidth(bw)}
                  className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                    bandwidth === bw
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {bw === '1000' ? '1 Gbps' : `${bw} Mbps`}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Higher bandwidth allows more bits to be pumped onto the wire per second.
            </p>
          </div>

          {/* Latency & Loss Sliders */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111827] border border-slate-200/80 dark:border-[#1E2638] space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                3. Physical Propagation Delay
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {latencyMs} ms
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              value={latencyMs}
              onChange={(e) => setLatencyMs(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex items-center justify-between pt-1">
              <label className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateLoss}
                  onChange={(e) => setSimulateLoss(e.target.checked)}
                  className="rounded text-emerald-600 accent-emerald-600"
                />
                <span>Simulate Packet Loss</span>
              </label>
              {simulateLoss && <span className="text-[10px] font-mono text-rose-500 font-bold">Loss Active</span>}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Key Performance Metrics Explained */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Bandwidth vs Throughput</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Bandwidth</strong> is the theoretical maximum channel capacity (e.g. 1 Gbps), while <strong>Throughput</strong> is the actual rate of successful data delivery after protocol headers, collisions, and latency overhead.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Total Latency Breakdown</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">Latency = d_proc + d_queue + d_trans + d_prop</span>. It represents the total round-trip time required for a packet to traverse network hops from source to destination.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Packet Loss & Jitter</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Packet Loss</strong> occurs when buffer queues overflow or electromagnetic noise corrupts the CRC checksum. <strong>Jitter</strong> is the variance in packet arrival intervals.
          </p>
        </div>
      </div>
    </div>
  );
}
