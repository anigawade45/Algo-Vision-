import React, { useState, useEffect } from 'react';
import {
  Laptop,
  Server,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function ArpSimulation() {
  const [targetIp, setTargetIp] = useState('192.168.1.5');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [arpCache, setArpCache] = useState({});

  const lanNodes = [
    { name: 'PC1 (Sender)', ip: '192.168.1.2', mac: 'DE:AD:BE:EF:00:01', isSender: true },
    { name: 'PC2 (Target)', ip: '192.168.1.5', mac: 'AA:BB:CC:DD:EE:05', isTarget: true },
    { name: 'PC3 (Other)', ip: '192.168.1.9', mac: '11:22:33:44:55:09', isOther: true },
    { name: 'Gateway Router', ip: '192.168.1.1', mac: '00:50:56:FE:ED:01', isGateway: true }
  ];

  const targetNode = lanNodes.find((n) => n.ip === targetIp) || lanNodes[1];
  const isCached = Boolean(arpCache[targetIp]);

  // Robust steps definition
  const stepsInfo = [
    {
      step: 1,
      title: '1. Initiate Frame Preparation & Check ARP Cache',
      desc: isCached
        ? `PC1 checks ARP Cache: FOUND entry "${targetIp} ➔ ${arpCache[targetIp]}". Direct cache hit!`
        : `PC1 wants to transmit to ${targetIp}. Checks local ARP cache table: MISS (No MAC found).`,
      phase: isCached ? 'Cache Hit' : 'Cache Check (Miss)'
    },
    {
      step: 2,
      title: '2. Broadcast ARP Request (FF:FF:FF:FF:FF:FF)',
      desc: isCached
        ? `Frame formatted with cached destination MAC (${arpCache[targetIp]}). No LAN broadcast needed.`
        : `PC1 broadcasts frame to FF:FF:FF:FF:FF:FF: "Who has IP ${targetIp}? Tell 192.168.1.2 (${lanNodes[0].mac})".`,
      phase: isCached ? 'Direct Unicast Frame' : 'LAN Broadcast'
    },
    {
      step: 3,
      title: '3. LAN Nodes Inspect Target IP',
      desc: isCached
        ? `Destination host (${targetNode.name}) accepts unicast frame directly.`
        : `All nodes receive the broadcast. Non-matching devices discard the packet; only ${targetNode.name} (${targetIp}) claims ownership.`,
      phase: isCached ? 'Frame Accepted' : 'Hardware Filtering'
    },
    {
      step: 4,
      title: '4. Destination Sends Unicast ARP Reply',
      desc: isCached
        ? `Communication established with 0 broadcast overhead.`
        : `${targetNode.name} unicasts ARP Reply to PC1: "${targetIp} is at MAC ${targetNode.mac}".`,
      phase: isCached ? 'Completed' : 'Unicast ARP Reply'
    },
    {
      step: 5,
      title: '5. PC1 Updates ARP Cache Table & Transmits',
      desc: isCached
        ? `ARP Cache remains warm with active lease.`
        : `PC1 stores "${targetIp} ➔ ${targetNode.mac}" (Dynamic) in RAM cache table and transmits queued IP data frame.`,
      phase: isCached ? 'Active Cache' : 'Cache Table Updated'
    }
  ];

  const totalSteps = stepsInfo.length;
  const safeStepIndex = Math.min(Math.max(0, currentStep - 1), totalSteps - 1);
  const currentStepData = stepsInfo[safeStepIndex] || stepsInfo[0];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            // Populate ARP cache upon completing step 5
            setArpCache((old) => ({ ...old, [targetIp]: targetNode.mac }));
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, targetIp, targetNode.mac]);

  const handleClearCache = () => {
    setArpCache({});
    setCurrentStep(1);
    setIsPlaying(false);
  };

  const handleSelectTarget = (ip) => {
    setTargetIp(ip);
    setCurrentStep(1);
    setIsPlaying(false);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              ARP Visualization (Address Resolution Protocol)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualize how IP addresses are mapped to physical MAC addresses via Broadcast Requests and Unicast Replies.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-xl border font-bold ${
            isCached
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800'
          }`}>
            {isCached ? 'CACHE STATUS: HIT' : 'CACHE STATUS: MISS'}
          </span>

          <button
            onClick={handleClearCache}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Clear Cache
          </button>
        </div>
      </div>

      {/* Target IP Selector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-8 flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Target Device on LAN:</span>
          {lanNodes.filter((n) => n.ip !== '192.168.1.2').map((n) => (
            <button
              key={n.ip}
              onClick={() => handleSelectTarget(n.ip)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                targetIp === n.ip
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {n.name} ({n.ip})
            </button>
          ))}
        </div>

        <div className="md:col-span-4 flex items-center">
          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-mono font-bold shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate ARP Resolution</span>
          </button>
        </div>
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-purple-600 text-white font-mono text-xs font-extrabold shadow-sm shrink-0">
            Step {safeStepIndex + 1} / {totalSteps}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {currentStepData.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {currentStepData.desc}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStep > 1) setCurrentStep(currentStep - 1);
            }}
            disabled={currentStep === 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play ARP'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
            }}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(1);
            }}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* LAN Network Topology Canvas */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white space-y-6 shadow-inner">
        {/* Active Packet Pill Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Current Packet on Medium:</span>
          <span className={`font-bold px-2.5 py-1 rounded-lg ${
            currentStep === 2
              ? 'bg-purple-950 text-purple-300 border border-purple-800 animate-pulse'
              : currentStep === 4
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 animate-pulse'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {currentStep === 2
              ? `[ARP REQUEST BROADCAST] "Who has ${targetIp}?" -> FF:FF:FF:FF:FF:FF`
              : currentStep === 4
              ? `[ARP REPLY UNICAST] "${targetIp} is at ${targetNode.mac}" -> PC1`
              : currentStep === 5
              ? `[IP DATA FRAME] Encapsulated with Dest MAC: ${targetNode.mac}`
              : `[INTERNAL CHECK] Searching ${targetIp} in ARP Cache`}
          </span>
        </div>

        {/* 4 Connected LAN Hosts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PC1 (Sender) */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            currentStep === 1 || currentStep === 2 || currentStep === 5
              ? 'bg-purple-950/80 border-purple-500 shadow-lg shadow-purple-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold">PC1 (Sender)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">IP: 192.168.1.2</p>
            <p className="text-[10px] text-slate-400 font-mono">MAC: DE:AD:BE:EF:00:01</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
              {currentStep === 5 ? 'Frame Transmitted' : 'Initiator'}
            </span>
          </div>

          {/* PC2 (Target Node) */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            (currentStep === 3 || currentStep === 4) && targetIp === '192.168.1.5'
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold">PC2 (Target)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">IP: 192.168.1.5</p>
            <p className="text-[10px] text-slate-400 font-mono">MAC: AA:BB:CC:DD:EE:05</p>
            <span className={`mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              targetIp === '192.168.1.5' && currentStep >= 3
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}>
              {targetIp === '192.168.1.5' && currentStep >= 3 ? 'MATCH ➔ ARP Reply' : 'LAN Node'}
            </span>
          </div>

          {/* PC3 (Non-matching node) */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            (currentStep === 3 || currentStep === 4) && targetIp === '192.168.1.9'
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700 opacity-70'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-bold">PC3 (Node)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">IP: 192.168.1.9</p>
            <p className="text-[10px] text-slate-400 font-mono">MAC: 11:22:33:44:55:09</p>
            <span className="mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
              {currentStep === 3 && targetIp !== '192.168.1.9' ? 'DROPPED (IP Mismatch)' : 'LAN Node'}
            </span>
          </div>

          {/* Gateway Router */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            (currentStep === 3 || currentStep === 4) && targetIp === '192.168.1.1'
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <span className="text-xs font-bold">Gateway Router</span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono">IP: 192.168.1.1</p>
            <p className="text-[10px] text-slate-400 font-mono">MAC: 00:50:56:FE:ED:01</p>
            <span className={`mt-2 inline-block text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
              targetIp === '192.168.1.1' && currentStep >= 3
                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}>
              Default Gateway
            </span>
          </div>
        </div>

        {/* Live Dynamic ARP Table Inspector */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800 text-slate-400 text-[11px]">
            <span>PC1 ARP Table (RAM Cache)</span>
            <span className="text-purple-400 font-bold">{Object.keys(arpCache).length} Active Dynamic Entries</span>
          </div>

          {Object.keys(arpCache).length === 0 ? (
            <p className="text-slate-500 text-center py-2 text-xs">
              Cache currently empty. Run the simulation to resolve and cache IP ➔ MAC mappings.
            </p>
          ) : (
            <div className="space-y-1.5 pt-1">
              {Object.entries(arpCache).map(([ip, mac]) => (
                <div
                  key={ip}
                  className="flex items-center justify-between text-emerald-400 bg-slate-900/80 px-3 py-2 rounded-lg border border-emerald-900/40"
                >
                  <span className="font-bold">{ip}</span>
                  <span className="text-slate-500">═══════▶</span>
                  <span className="font-bold tracking-wider">{mac}</span>
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Dynamic Lease (20m)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArpSimulation;
