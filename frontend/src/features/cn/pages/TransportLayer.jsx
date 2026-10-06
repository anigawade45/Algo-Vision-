import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ArrowLeft,
  LayoutDashboard,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Scale,
  Code2,
  BookOpen,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';
import { TcpThreeWayHandshake } from '../components/transport/TcpThreeWayHandshake';
import { TcpUdpComparison } from '../components/transport/TcpUdpComparison';
import { TransportCodeViewer } from '../components/transport/TransportCodeViewer';

export default function TransportLayer({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('handshake'); // 'handshake', 'compare', 'code', 'theory'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/cn" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Wifi className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                AlgoVision CN
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link to="/cn" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                Computer Networks
              </Link>
              <span>/</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Transport Layer (TCP vs UDP)
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            <Link
              to="/cn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CN Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title & Badge */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Layer 4 End-to-End Transport Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Transport Layer: TCP vs UDP
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Master process-to-process delivery, the TCP 3-Way Handshake, sliding window flow control, byte sequencing, error recovery, and 0-RTT UDP datagrams through visual simulations and C++, Java, & Python socket implementations.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#1E2638] pb-1 overflow-x-auto font-mono text-xs">
          <button
            onClick={() => setActiveTab('handshake')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'handshake'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3-Way Handshake & Flow Control</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>TCP vs UDP Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'code'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Socket Code (C++, Java, Python)</span>
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
            <span>Theory & Notes</span>
          </button>
        </div>

        {/* Tab Content Areas */}
        {activeTab === 'handshake' && <TcpThreeWayHandshake />}
        {activeTab === 'compare' && <TcpUdpComparison />}
        {activeTab === 'code' && <TransportCodeViewer />}

        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Port Multiplexing & Process Addressing */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  <Layers className="w-4 h-4" />
                  <span>PROCESS-TO-PROCESS MULTIPLEXING</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Why IP Addresses Alone Aren't Enough
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  While IP addresses deliver packets host-to-host (machine-to-machine), the Transport Layer uses <strong>16-bit Port Numbers (0 to 65535)</strong> to multiplex and deliver data to specific applications running on that machine (e.g. Browser on port 49152, Web Server on port 443).
                </p>
                <div className="pt-2 flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Well-Known Ports: 0 - 1023
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    Ephemeral Ports: 49152 - 65535
                  </span>
                </div>
              </div>

              {/* Card 2: Flow Control vs Congestion Control */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                  <Activity className="w-4 h-4" />
                  <span>FLOW VS CONGESTION CONTROL</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Preventing Receiver Overrun vs Network Collapse
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <strong>Flow Control (rwnd):</strong> Protects the receiving buffer from overflowing using the dynamic Sliding Window field advertised in TCP headers. <br />
                  <strong>Congestion Control (cwnd):</strong> Protects intermediate routers and backbone links from congestion using algorithms like Slow Start, AIMD, and Fast Recovery.
                </p>
              </div>
            </div>

            {/* Core Summary Cards */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-mono uppercase">
                Transport Layer Key Takeaways for Students & Interviews
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/60 space-y-1">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300 font-mono block">3-Way Handshake</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Synchronizes sequence numbers (ISN_c, ISN_s) before data flow begins.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 space-y-1">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 font-mono block">UDP 0-RTT Speed</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Stateless, 8-byte header; ideal for DNS queries, gaming, and live streaming.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-900/60 space-y-1">
                  <span className="text-xs font-bold text-purple-700 dark:text-purple-300 font-mono block">Sliding Window</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Enables high throughput pipelining while respecting receiver buffer capacity.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-1">
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 font-mono block">Fast Retransmit</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    3 Duplicate ACKs trigger instant retransmission without waiting for RTO timer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
