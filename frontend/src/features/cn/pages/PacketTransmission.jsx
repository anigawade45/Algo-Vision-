import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Layers,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code,
  LayoutDashboard,
  Play,
  Boxes,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import PacketFlowSimulator from '../components/packets/PacketFlowSimulator';
import PacketPduHierarchy from '../components/packets/PacketPduHierarchy';
import PacketCodeViewer from '../components/packets/PacketCodeViewer';

const PACKET_TABS = [
  { id: 'simulator', label: '1. Packet Flow Simulator' },
  { id: 'pdu', label: '2. PDU Structure & Hierarchy' },
  { id: 'code', label: '3. Packet Crafting Code' },
  { id: 'theory', label: '4. Transmission Concepts & Theory' }
];

export default function PacketTransmission({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator', 'pdu', 'code', 'theory'

  const currentStepIdx = PACKET_TABS.findIndex((t) => t.id === activeTab);

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveTab(PACKET_TABS[currentStepIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < PACKET_TABS.length - 1) {
      setActiveTab(PACKET_TABS[currentStepIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
                Packet &amp; Data Transmission
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

      {/* Main Page Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title & Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Data Transmission &amp; Header Encapsulation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Packet &amp; Data Transmission Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Trace how application messages are encapsulated into Segments (L4), Packets (L3), Frames (L2), and Bits (L1), routed across multi-hop networks with TTL decrements and MAC address rewriting.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E2638] pb-1 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>1. Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('pdu')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'pdu'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>2. PDU Structure (Data ➔ Bits)</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>3. Code Lab (C++, Java, Python)</span>
          </button>

          <button
            onClick={() => setActiveTab('theory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'theory'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>4. Theory &amp; Headers Guide</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'simulator' && <PacketFlowSimulator />}

        {activeTab === 'pdu' && <PacketPduHierarchy />}

        {activeTab === 'code' && <PacketCodeViewer />}

        {activeTab === 'theory' && (
          <div className="space-y-6">
            {/* Encapsulation vs De-encapsulation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                    <Layers className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    1. Encapsulation (Sender Side)
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  As data travels down the OSI stack from Application (L7) to Physical (L1), each layer adds its own protocol control header:
                </p>

                <ul className="space-y-2 font-mono text-xs text-slate-700 dark:text-slate-300">
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>L7 Application: <strong>Data</strong></span>
                    <span className="text-indigo-500 font-bold">User Payload</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>L4 Transport: <strong>Segment</strong></span>
                    <span className="text-blue-500 font-bold">+ Ports, Seq, Ack</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>L3 Network: <strong>Packet</strong></span>
                    <span className="text-emerald-500 font-bold">+ Source/Dest IP, TTL</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>L2 Data Link: <strong>Frame</strong></span>
                    <span className="text-purple-500 font-bold">+ Source/Dest MAC, FCS</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <span>L1 Physical: <strong>Bits</strong></span>
                    <span className="text-emerald-500 font-bold">Binary Pulses</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    2. De-encapsulation (Receiver Side)
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Upon receiving raw electrical or optical signals, the target host strips and validates headers in reverse order:
                </p>

                <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside font-mono">
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong>NIC Check:</strong> L2 checks FCS CRC-32 for transmission errors and matches Destination MAC.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong>IP Verification:</strong> L3 verifies Destination IP matches host IP, verifies checksum, and checks protocol (TCP=6).
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong>Port Demultiplexing:</strong> L4 inspects Destination Port to direct the segment to the correct socket process.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <strong>Payload Delivery:</strong> L7 application process receives clean user data.
                  </li>
                </ol>
              </div>
            </div>

            {/* Crucial Concept: What changes at each router vs What stays the same? */}
            <div className="rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-8 space-y-5 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono text-xs font-bold">
                  EXAM ESSENTIAL
                </span>
                <h3 className="text-lg font-bold text-white">
                  Hop-by-Hop Header Behavior: Invariant vs Modified Fields
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/80 space-y-2">
                  <strong className="text-emerald-400 text-sm font-bold block">
                    ✓ Preserved End-to-End (Invariant)
                  </strong>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• <strong>Source IP Address:</strong> Remains the original sender host IP.</li>
                    <li>• <strong>Destination IP Address:</strong> Remains the final target server IP.</li>
                    <li>• <strong>Transport Ports:</strong> Source &amp; Destination TCP/UDP ports are untouched.</li>
                    <li>• <strong>Application Payload:</strong> The data content is never modified by routers.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 space-y-2">
                  <strong className="text-rose-400 text-sm font-bold block">
                    ✗ Rewritten / Modified at Every Router Hop
                  </strong>
                  <ul className="space-y-1.5 text-slate-300 text-[11px]">
                    <li>• <strong>Source MAC Address:</strong> Rewritten to router egress interface MAC.</li>
                    <li>• <strong>Destination MAC Address:</strong> Rewritten to next hop device MAC.</li>
                    <li>• <strong>Time-To-Live (TTL):</strong> Decremented by 1 at every L3 router hop.</li>
                    <li>• <strong>IP Header Checksum:</strong> Recalculated due to TTL decrement.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIdx === 0}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-800 text-slate-400'
                : 'border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {currentStepIdx + 1} of {PACKET_TABS.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIdx === PACKET_TABS.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentStepIdx === PACKET_TABS.length - 1
                ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 cursor-pointer'
            }`}
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </main>
    </div>
  );
}
