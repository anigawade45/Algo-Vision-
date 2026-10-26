import React, { useState, useEffect } from 'react';
import {
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Radio
} from 'lucide-react';

export function DhcpSimulation() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clientMac, setClientMac] = useState('00:1A:2B:3C:4D:5E');
  const [assignedIp, setAssignedIp] = useState('192.168.1.10');

  const totalSteps = 4;

  const doraSteps = [
    {
      step: 1,
      phase: 'D - DISCOVER',
      type: 'Broadcast (255.255.255.255:67)',
      direction: 'Client → LAN Broadcast',
      desc: `New device without an IP broadcasts DHCPDISCOVER (0.0.0.0:68 -> 255.255.255.255:67) seeking available DHCP servers on the subnet.`,
      clientState: '0.0.0.0 (Unassigned)',
      serverState: 'Listening on UDP 67'
    },
    {
      step: 2,
      phase: 'O - OFFER',
      type: 'Broadcast / Unicast',
      direction: 'DHCP Server → Client',
      desc: `DHCP Server reserves ${assignedIp} from its pool and sends DHCPOFFER proposing IP ${assignedIp}, Subnet Mask 255.255.255.0, Default Gateway 192.168.1.1, and Lease 86400s.`,
      clientState: '0.0.0.0 (Offer Received)',
      serverState: `Reserved ${assignedIp}`
    },
    {
      step: 3,
      phase: 'R - REQUEST',
      type: 'Broadcast (255.255.255.255:67)',
      direction: 'Client → LAN Broadcast',
      desc: `Client broadcasts DHCPREQUEST publicly announcing: "I accept ${assignedIp} from Server 192.168.1.1!" (Informs other servers to release their offers).`,
      clientState: `Requesting ${assignedIp}`,
      serverState: 'Validating Request'
    },
    {
      step: 4,
      phase: 'A - ACKNOWLEDGE',
      type: 'Unicast / Broadcast',
      direction: 'DHCP Server → Client',
      desc: `DHCP Server records MAC ${clientMac} -> ${assignedIp} in active lease table and sends DHCPACK. Client binds ${assignedIp} to network interface.`,
      clientState: `${assignedIp} (Bound & Active)`,
      serverState: 'Lease Committed (24h)'
    }
  ];

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Interactive DHCP 4-Step DORA Handshake Simulator
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Trace how a new host obtains an IP address dynamically via Discover, Offer, Request, and Acknowledge.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800 text-xs font-mono font-bold">
          <Radio className="w-3.5 h-3.5" />
          <span>UDP Port 67/68 Broadcast</span>
        </div>
      </div>

      {/* Step Prominent Action Banner */}
      <div className="rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-cyan-600 text-white font-mono text-xs font-extrabold shadow-sm">
            Step {currentStep} / {totalSteps}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              {doraSteps[currentStep - 1].phase} ({doraSteps[currentStep - 1].direction})
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              {doraSteps[currentStep - 1].desc}
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
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
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play DORA'}</span>
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

      {/* Visual Animated DORA Canvas */}
      <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 min-h-[260px] flex items-center justify-between text-white overflow-hidden shadow-inner">
        {/* Client Side */}
        <div className={`relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
          currentStep === 1 || currentStep === 3 || currentStep === 4
            ? 'bg-cyan-950/80 border-cyan-500 shadow-lg shadow-cyan-500/20 scale-105'
            : 'bg-slate-800/80 border-slate-700'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center text-white shadow-md">
            <Laptop className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">Client Node</span>
            <span className="text-[10px] font-mono text-cyan-300">MAC: {clientMac}</span>
          </div>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
            currentStep === 4
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
              : 'bg-slate-900 text-amber-300 border-amber-800'
          }`}>
            IP: {doraSteps[currentStep - 1].clientState}
          </span>
        </div>

        {/* Transmission Channel */}
        <div className="flex-1 mx-4 sm:mx-8 relative flex flex-col items-center justify-center">
          <div className="w-full h-1 bg-slate-800 rounded-full relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500 via-indigo-500 to-cyan-500 animate-pulse opacity-40"></div>
          </div>

          {/* Dynamic Packet Indicator */}
          <div className="my-3 px-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/50 font-mono text-xs text-center shadow-lg animate-bounce">
            <span className="text-cyan-400 font-extrabold block text-sm">
              {doraSteps[currentStep - 1].phase}
            </span>
            <span className="text-[10px] text-slate-400">
              {doraSteps[currentStep - 1].type}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Broadcast Domain: LAN Subnet 192.168.1.0/24</span>
          </div>
        </div>

        {/* DHCP Server Side */}
        <div className={`relative z-10 flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
          currentStep === 2 || currentStep === 4
            ? 'bg-indigo-950/80 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105'
            : 'bg-slate-800/80 border-slate-700'
        }`}>
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Server className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="text-xs font-bold block">DHCP Server</span>
            <span className="text-[10px] font-mono text-indigo-300">192.168.1.1:67</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
            Pool: 192.168.1.10 - .50
          </span>
        </div>
      </div>

      {/* Network Configuration Lease Box */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned IPv4</span>
          <strong className="text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
            {currentStep === 4 ? assignedIp : 'Pending Handshake...'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Subnet Mask</span>
          <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {currentStep >= 2 ? '255.255.255.0 (/24)' : '---'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Default Gateway</span>
          <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {currentStep >= 2 ? '192.168.1.1' : '---'}
          </strong>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Lease Duration</span>
          <strong className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
            {currentStep === 4 ? '86400s (24 Hours)' : '---'}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default DhcpSimulation;
