import React, { useState, useEffect } from 'react';
import {
  Globe,
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Search,
  Database,
  Layers,
  Sparkles,
  Check,
  Zap
} from 'lucide-react';

export function DnsSimulation() {
  const [domain, setDomain] = useState('www.example.com');
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [cacheEnabled, setCacheEnabled] = useState(false);

  const sampleDomains = [
    { name: 'www.example.com', ip: '93.184.216.34', tld: '.com', auth: 'ns1.iana.org' },
    { name: 'api.github.com', ip: '140.82.121.6', tld: '.com', auth: 'dns1.p08.nsone.net' },
    { name: 'algovision.dev', ip: '76.76.21.21', tld: '.dev', auth: 'ns1.vercel-dns.com' },
    { name: 'wikipedia.org', ip: '208.80.154.224', tld: '.org', auth: 'ns0.wikimedia.org' }
  ];

  const currentDomainData =
    sampleDomains.find((d) => d.name === domain) || {
      name: domain,
      ip: '172.67.182.11',
      tld: domain.includes('.') ? domain.substring(domain.lastIndexOf('.')) : '.com',
      auth: 'ns1.cloudflare.com'
    };

  const stepsInfo = [
    {
      step: 1,
      title: '1. Browser Queries Local DNS Resolver',
      desc: `User enters "${domain}". Browser initiates query to Recursive Resolver (8.8.8.8 / ISP).`,
      activeNode: 'browser',
      targetNode: 'resolver',
      label: 'Query Port 53'
    },
    {
      step: 2,
      title: '2. Resolver Queries Root DNS (.)',
      desc: `Resolver checks root nameservers (.) -> Root responds: "I don't hold ${domain}, ask the ${currentDomainData.tld} TLD Server."`,
      activeNode: 'root',
      targetNode: 'tld',
      label: `Referral to ${currentDomainData.tld}`
    },
    {
      step: 3,
      title: `3. Resolver Queries ${currentDomainData.tld} DNS (TLD)`,
      desc: `Resolver asks ${currentDomainData.tld} Registry -> TLD responds: "Query Authoritative Nameserver: ${currentDomainData.auth}."`,
      activeNode: 'tld',
      targetNode: 'auth',
      label: 'Referral to Authoritative'
    },
    {
      step: 4,
      title: '4. Resolver Queries Authoritative DNS',
      desc: `Resolver asks Authoritative Server (${currentDomainData.auth}) -> Returns final A Record: "${domain} = ${currentDomainData.ip}" (TTL: 300s).`,
      activeNode: 'auth',
      targetNode: 'ip-return',
      label: `A Record: ${currentDomainData.ip}`
    },
    {
      step: 5,
      title: '5. IP Address Returned & Cached',
      desc: `Resolver caches the A record in local RAM and delivers the resolved numerical IP (${currentDomainData.ip}) back to the browser.`,
      activeNode: 'ip-return',
      targetNode: 'browser',
      label: 'Resolved IP Delivered'
    },
    {
      step: 6,
      title: '6. Browser Connects to Target Website Server',
      desc: `Browser opens reliable TCP connection directly to ${currentDomainData.ip}:80/443 to stream HTML/JS/CSS assets.`,
      activeNode: 'webserver',
      targetNode: 'webserver',
      label: 'HTTP/HTTPS Handshake'
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
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1900);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(1);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header & Domain Input */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              DNS Visualization (Domain Name System Hierarchy)
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Trace the complete resolution chain: <strong>Browser ➔ DNS Resolver ➔ Root DNS ➔ .com DNS ➔ Authoritative DNS ➔ IP Address ➔ Website Server</strong>.
          </p>
        </div>
      </div>

      {/* Domain Input Bar & Presets */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setCurrentStep(1);
              }}
              placeholder="e.g. www.example.com"
              className="w-full bg-transparent font-bold outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {sampleDomains.map((s) => (
              <button
                key={s.name}
                onClick={() => {
                  setDomain(s.name);
                  setCurrentStep(1);
                  setIsPlaying(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  domain === s.name
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-4 flex items-center">
          <button
            onClick={() => {
              setCurrentStep(1);
              setIsPlaying(true);
            }}
            className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-mono font-bold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Simulate DNS Pipeline</span>
          </button>
        </div>
      </div>

      {/* Step Action Banner */}
      <div className="rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg bg-teal-600 text-white font-mono text-xs font-extrabold shadow-xs shrink-0">
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
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : 'Play DNS'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === totalSteps}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Node Sequential DNS Pipeline Canvas */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white space-y-6 shadow-inner">
        {/* Active Stage Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Resolution Hierarchy Pipeline:</span>
          <span className="font-bold text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-lg border border-teal-800">
            {currentStepData.label}
          </span>
        </div>

        {/* 6 Grid Nodes representing the complete hierarchy chain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Node 1: Browser */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 1 || currentStep === 6
              ? 'bg-teal-950/80 border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Laptop className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold">1. Browser</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{domain}</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Query Port 53
            </span>
          </div>

          {/* Node 2: DNS Resolver */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 1 || currentStep === 2 || currentStep === 5
              ? 'bg-teal-950/80 border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Server className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold">2. Resolver</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">8.8.8.8 (ISP)</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Recursive Engine
            </span>
          </div>

          {/* Node 3: Root DNS */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 2
              ? 'bg-teal-950/80 border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700 opacity-80'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">3. Root DNS (.)</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">13 Clusters</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Points to {currentDomainData.tld}
            </span>
          </div>

          {/* Node 4: .com DNS */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 3
              ? 'bg-teal-950/80 border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700 opacity-80'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold">4. {currentDomainData.tld} DNS</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">TLD Registry</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              Points to NS
            </span>
          </div>

          {/* Node 5: Authoritative DNS */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 4
              ? 'bg-teal-950/80 border-teal-500 shadow-lg shadow-teal-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">5. Authoritative</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">{currentDomainData.auth}</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              Holds A Record
            </span>
          </div>

          {/* Node 6: Website Server */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
            currentStep === 6
              ? 'bg-emerald-950/80 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105'
              : 'bg-slate-800/80 border-slate-700'
          }`}>
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">6. Web Server</span>
              </div>
              <p className="text-[10px] text-slate-300 font-mono truncate">{currentDomainData.ip}</p>
            </div>
            <span className="mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              HTTP/HTTPS Active
            </span>
          </div>
        </div>

        {/* Resolved IP Record Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">DNS Resolution Result:</span>
            <strong className="text-teal-400 font-extrabold">{domain}</strong>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            <strong className="text-emerald-400 font-extrabold">{currentDomainData.ip}</strong>
          </div>
          <span className="text-[10px] text-slate-500">
            Type: A Record (IPv4) • TTL: 300s • Class: IN (Internet)
          </span>
        </div>
      </div>
    </div>
  );
}

export default DnsSimulation;
