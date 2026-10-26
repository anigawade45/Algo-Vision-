import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
  Layers,
  Globe,
  Lock,
  Search,
  Radio,
  Folder,
  Mail,
  Activity,
  CheckCircle2,
  BookOpen,
  Code2,
  Shield,
  HelpCircle
} from 'lucide-react';
import { PROTOCOLS_DATA } from '../data/protocolsData';
import { HttpSimulation } from '../components/protocols/simulations/HttpSimulation';
import { HttpsSimulation } from '../components/protocols/simulations/HttpsSimulation';
import { DnsSimulation } from '../components/protocols/simulations/DnsSimulation';
import { DhcpSimulation } from '../components/protocols/simulations/DhcpSimulation';
import { ArpSimulation } from '../components/protocols/simulations/ArpSimulation';
import { FtpSimulation } from '../components/protocols/simulations/FtpSimulation';
import { SmtpSimulation } from '../components/protocols/simulations/SmtpSimulation';
import { IcmpSimulation } from '../components/protocols/simulations/IcmpSimulation';
import { ProtocolJavaRunner } from '../components/protocols/ProtocolJavaRunner';

export default function NetworkProtocols({ theme, toggleTheme }) {
  const [selectedProtocolId, setSelectedProtocolId] = useState('http');

  const protocolsList = [
    PROTOCOLS_DATA.http,
    PROTOCOLS_DATA.https,
    PROTOCOLS_DATA.dns,
    PROTOCOLS_DATA.dhcp,
    PROTOCOLS_DATA.arp,
    PROTOCOLS_DATA.ftp,
    PROTOCOLS_DATA.smtp,
    PROTOCOLS_DATA.icmp
  ];

  const currentStepIdx = protocolsList.findIndex((p) => p.id === selectedProtocolId);

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setSelectedProtocolId(protocolsList[currentStepIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < protocolsList.length - 1) {
      setSelectedProtocolId(protocolsList[currentStepIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeProtocol = PROTOCOLS_DATA[selectedProtocolId] || PROTOCOLS_DATA.http;

  const getProtocolIcon = (id) => {
    switch (id) {
      case 'http':
        return Globe;
      case 'https':
        return Lock;
      case 'dns':
        return Search;
      case 'dhcp':
        return Radio;
      case 'arp':
        return Layers;
      case 'ftp':
        return Folder;
      case 'smtp':
        return Mail;
      case 'icmp':
        return Activity;
      default:
        return Globe;
    }
  };

  const renderSimulationComponent = () => {
    switch (activeProtocol.id) {
      case 'http':
        return <HttpSimulation />;
      case 'https':
        return <HttpsSimulation />;
      case 'dns':
        return <DnsSimulation />;
      case 'dhcp':
        return <DhcpSimulation />;
      case 'arp':
        return <ArpSimulation />;
      case 'ftp':
        return <FtpSimulation />;
      case 'smtp':
        return <SmtpSimulation />;
      case 'icmp':
        return <IcmpSimulation />;
      default:
        return <HttpSimulation />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link to="/cn" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AlgoVision CN
              </span>
            </Link>

            <span className="hidden md:inline text-slate-300 dark:text-slate-700">/</span>

            <nav className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/cn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Computer Networks
              </Link>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Network Protocols
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              to="/cn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back to </span><span>CN Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title & Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Protocol Visualization & Simulation Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Network Protocols
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Explore essential computer networking protocols across the Application, Network, and Data Link layers. Trace step-by-step packet exchanges, inspect headers, and examine simulated Java algorithmic logic for foundational protocols.
          </p>
        </div>

        {/* Horizontal 4x4 Protocol Selector Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Select Network Protocol (8 Core Tracks)</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Active: <strong className="text-emerald-600 dark:text-emerald-400">{activeProtocol.name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {protocolsList.map((p) => {
              const IconComponent = getProtocolIcon(p.id);
              const isActive = selectedProtocolId === p.id;

              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProtocolId(p.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-2.5 cursor-pointer ${isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-600 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                    }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isActive
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>

                    {p.hasJavaCode ? (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        JAVA CODE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        VISUAL ONLY
                      </span>
                    )}
                  </div>

                  <div>
                    <span
                      className={`text-sm font-extrabold block tracking-tight ${isActive ? 'text-emerald-950 dark:text-white' : 'text-slate-900 dark:text-slate-200'
                        }`}
                    >
                      {p.name}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {p.fullName}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Protocol Content Section */}
        <div className="space-y-8">
          {/* 1. Protocol Header & Overview Card */}
          <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                    {activeProtocol.layer}
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold">
                    {activeProtocol.transportProtocol}
                  </span>
                  {activeProtocol.hasJavaCode && (
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-bold flex items-center gap-1">
                      <Code2 className="w-3 h-3" />
                      <span>Python, C++, Java Code Included</span>
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {activeProtocol.name} — {activeProtocol.fullName}
                </h2>
              </div>
            </div>

            {/* What is it & Purpose Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span>What is {activeProtocol.name}?</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeProtocol.whatIsIt}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-teal-500" />
                  <span>Primary Purpose & Role</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeProtocol.purpose}
                </p>
              </div>
            </div>

            {/* How It Works Step Breakdown */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>How {activeProtocol.name} Works (Operational Workflow)</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans">
                {activeProtocol.howItWorks.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Terms / Messages Grid */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
                <span>Key Terminology & Protocol Messages</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeProtocol.keyTerms.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1"
                  >
                    <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                      {t.term}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                      {t.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Interactive Step-by-Step Simulation */}
          {renderSimulationComponent()}

          {/* 3. Java Simulation Code (ONLY for HTTP, DNS, DHCP, ARP, ICMP) */}
          {activeProtocol.hasJavaCode && (
            <ProtocolJavaRunner protocolData={activeProtocol} />
          )}

          {/* 4. Key Takeaways Card */}
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 text-white space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-base sm:text-lg font-bold">
                Key Takeaways: {activeProtocol.name}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {activeProtocol.keyTakeaways.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Navigation Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIdx === 0}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${currentStepIdx === 0
                  ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                  : 'border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer'
                }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>

            <span className="text-xs font-mono text-slate-400">
              Protocol {currentStepIdx + 1} of {protocolsList.length} ({activeProtocol.name.split(' ')[0]})
            </span>

            <button
              onClick={handleNextStep}
              disabled={currentStepIdx === protocolsList.length - 1}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${currentStepIdx === protocolsList.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 cursor-pointer'
                }`}
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}