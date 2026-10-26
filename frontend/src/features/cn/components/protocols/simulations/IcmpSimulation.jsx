import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Laptop,
  Play,
  RotateCcw
} from 'lucide-react';

export function IcmpSimulation() {
  const [sourceIp, setSourceIp] = useState('192.168.1.100');
  const [targetIp, setTargetIp] = useState('8.8.8.8');
  const [packetCount, setPacketCount] = useState(4);
  const [currentPacketIdx, setCurrentPacketIdx] = useState(1);
  const [currentStep, setCurrentStep] = useState(1); // 1 = prepare/send Type 8, 2 = transit to dest, 3 = dest echo reply Type 0, 4 = transit back to src, 5 = stats summary
  const [isPlaying, setIsPlaying] = useState(false);
  const [pingResults, setPingResults] = useState([]);

  const sampleTargets = [
    { label: 'Google DNS', ip: '8.8.8.8', avgRtt: 14 },
    { label: 'Cloudflare', ip: '1.1.1.1', avgRtt: 9 },
    { label: 'Local Gateway', ip: '192.168.1.1', avgRtt: 2 },
    { label: 'Unreachable Host', ip: '198.51.100.99', avgRtt: 0, drop: true }
  ];

  const totalSteps = 4; // per packet

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            // Record ping response for current packet
            const isDropped = targetIp === '198.51.100.99' || (Math.random() < 0.05);
            const latency = isDropped ? null : Math.floor(10 + Math.random() * 25);

            setPingResults((prevLogs) => [
              ...prevLogs,
              {
                seq: currentPacketIdx,
                target: targetIp,
                latency,
                dropped: isDropped,
                ttl: 118
              }
            ]);

            if (currentPacketIdx < packetCount) {
              setCurrentPacketIdx((p) => p + 1);
              return 1; // start next packet
            } else {
              setIsPlaying(false);
              return 4; // done
            }
          }
          return prev + 1;
        });
      }, 1200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentStep, currentPacketIdx, packetCount, targetIp]);

  const handleStartPing = () => {
    setPingResults([]);
    setCurrentPacketIdx(1);
    setCurrentStep(1);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPingResults([]);
    setCurrentPacketIdx(1);
    setCurrentStep(1);
  };

  // Compute live statistics
  const packetsSent = pingResults.length;
  const packetsReceived = pingResults.filter((r) => !r.dropped).length;
  const packetsLost = packetsSent - packetsReceived;
  const lossRate = packetsSent > 0 ? ((packetsLost / packetsSent) * 100).toFixed(1) : 0;
  const validLatencies = pingResults.filter((r) => !r.dropped).map((r) => r.latency);
  const minRtt = validLatencies.length > 0 ? Math.min(...validLatencies) : 0;
  const maxRtt = validLatencies.length > 0 ? Math.max(...validLatencies) : 0;
  const avgRtt = validLatencies.length > 0 ? (validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length).toFixed(1) : 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive ICMP Echo (Ping) & Latency Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Send Type 8 Echo Requests and Type 0 Echo Replies to calculate network latency, RTT, and packet loss.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-xs font-mono font-bold">
          <Activity className="w-3.5 h-3.5" />
          <span>IP PROTOCOL 1 (ICMP)</span>
        </div>
      </div>

      {/* Ping Configuration Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 font-mono text-xs">
        <div className="md:col-span-3">
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Source Host IP</label>
          <input
            type="text"
            value={sourceIp}
            onChange={(e) => setSourceIp(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="md:col-span-4">
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Destination Target IP</label>
          <input
            type="text"
            value={targetIp}
            onChange={(e) => setTargetIp(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 dark:text-white outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Packet Count</label>
          <select
            value={packetCount}
            onChange={(e) => setPacketCount(Number(e.target.value))}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
          >
            <option value={4}>4 Packets</option>
            <option value={6}>6 Packets</option>
            <option value={8}>8 Packets</option>
          </select>
        </div>

        <div className="md:col-span-3 flex items-end">
          <button
            onClick={handleStartPing}
            disabled={isPlaying}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white text-xs font-mono font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isPlaying ? 'Ping Running...' : 'Execute Ping Test'}</span>
          </button>
        </div>
      </div>

      {/* Target Presets */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-[11px] text-slate-400 font-bold uppercase">Presets:</span>
        {sampleTargets.map((s) => (
          <button
            key={s.ip}
            onClick={() => {
              setTargetIp(s.ip);
              handleReset();
            }}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              targetIp === s.ip
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {s.label} ({s.ip})
          </button>
        ))}
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-mono text-xs font-extrabold shadow-sm">
            Packet {currentPacketIdx} of {packetCount}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {currentStep === 1
                ? 'Constructing ICMP Echo Request (Type 8, Code 0)'
                : currentStep === 2
                ? `Echo Request in Transit -> ${targetIp}`
                : currentStep === 3
                ? `Destination generates ICMP Echo Reply (Type 0, Code 0)`
                : `Echo Reply received at Source (${sourceIp})`}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              32 bytes data payload • Sequence = {currentPacketIdx} • Identifier = 0x1A2B
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer self-end sm:self-center"
          title="Reset Simulation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Visual ICMP Ping Transit Channel */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 min-h-[260px] flex items-center justify-between text-white overflow-hidden shadow-inner">
        {/* Source PC */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">Source Client</span>
            <span className="text-[10px] font-mono text-blue-300">{sourceIp}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Ping Initiator
          </span>
        </div>

        {/* Transmission Channel */}
        <div className="flex-1 mx-4 sm:mx-8 relative flex flex-col items-center justify-center">
          <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-blue-500 via-indigo-500 to-blue-500 animate-pulse opacity-40"></div>
          </div>

          {/* Active Ping Message Pill */}
          {isPlaying && (
            <div className="my-3 px-4 py-2 rounded-xl bg-slate-950 border border-blue-500/50 font-mono text-xs text-center shadow-lg animate-bounce">
              <span className="text-blue-400 font-extrabold block text-sm">
                {currentStep <= 2 ? 'ICMP Type 8 (Echo Request)' : 'ICMP Type 0 (Echo Reply)'}
              </span>
              <span className="text-[10px] text-slate-400">
                Seq={currentPacketIdx} • Size=32B • IP Proto=1
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-2">
            <span>Routers decrement TTL at each hop</span>
          </div>
        </div>

        {/* Destination Host */}
        <div className="relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">Destination Host</span>
            <span className="text-[10px] font-mono text-indigo-300">{targetIp}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Target Host
          </span>
        </div>
      </div>

      {/* Terminal Ping Output & Real-time Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Terminal Output */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-1.5 shadow-inner">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-500">
            <span>terminal@algovision:~$ ping {targetIp}</span>
            <span>ICMP DIAGNOSTICS</span>
          </div>

          <div className="min-h-[120px] py-1 space-y-1 text-[11px] leading-relaxed">
            <p className="text-slate-400">PING {targetIp} ({targetIp}): 32 data bytes</p>
            {pingResults.map((r) => (
              <p key={r.seq}>
                {r.dropped ? (
                  <span className="text-rose-400">Request timeout for icmp_seq {r.seq}</span>
                ) : (
                  <span className="text-emerald-400">
                    32 bytes from {r.target}: icmp_seq={r.seq} ttl={r.ttl} time={r.latency} ms
                  </span>
                )}
              </p>
            ))}
            {packetsSent === 0 && (
              <p className="text-slate-600">Click "Execute Ping Test" above to stream ICMP packets.</p>
            )}
          </div>
        </div>

        {/* Live Metrics Card */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <span className="font-bold text-slate-900 dark:text-white uppercase text-[11px]">
              Ping Statistics
            </span>
            <span className="text-[10px] font-bold text-blue-500">
              {packetsSent}/{packetCount} Sent
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Packets Received</span>
              <strong className="text-sm text-emerald-600 dark:text-emerald-400">{packetsReceived}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Packet Loss</span>
              <strong className={`text-sm ${packetsLost > 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                {lossRate}%
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Min / Max Latency</span>
              <strong className="text-xs text-slate-800 dark:text-slate-200">
                {minRtt}ms / {maxRtt}ms
              </strong>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block">Average Latency</span>
              <strong className="text-sm text-blue-600 dark:text-blue-400">{avgRtt} ms</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IcmpSimulation;
