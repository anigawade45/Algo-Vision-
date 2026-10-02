import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, Layers, LayoutDashboard, ArrowRight, Play, Lock, CheckCircle2, Globe, Shield, Terminal } from 'lucide-react';

export default function CnHome({ theme, toggleTheme }) {
  const cnTopics = [
    {
      id: 'fundamentals',
      title: 'Computer Network Fundamentals',
      description: 'Master core networking principles: data communication model, transmission media, PAN/LAN/MAN/WAN scale, and essential hardware networking devices.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/fundamentals',
      badge: 'Foundational Track',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'topologies',
      title: 'Network Topologies & Simulation',
      description: 'Simulate packet transmissions across Bus, Star, Ring, Mesh, Tree, and Hybrid layouts with link cuts, node fault testing, and comparative tradeoffs matrix.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/topologies',
      badge: 'Interactive Simulator',
      badgeColor: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    },
    {
      id: 'osi-layers',
      title: 'OSI 7-Layer Model & Encapsulation',
      description: 'Step through protocol data unit (PDU) encapsulation from Application down to Physical layer with header inspection.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/osi-layers',
      badge: 'Interactive Encapsulation',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
    {
      id: 'ip-subnetting',
      title: 'IPv4 Subnetting & CIDR Calculator',
      description: 'Calculate subnet masks, usable host ranges, broadcast addresses, 32-bit binary ANDing, and VLSM allocation.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/ip-subnetting',
      badge: 'Live Calculator',
      badgeColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    },
    {
      id: 'routing-protocols',
      title: 'Routing Algorithms (Dijkstra & Distance Vector)',
      description: 'Simulate Link-State (OSPF) shortest path trees, dynamic link failure rerouting, routing table convergence, and runnable C++, Java, & Python routing code.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/routing-protocols',
      badge: 'Interactive Graph & Code',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'packet-transmission',
      title: 'Packet & Data Transmission',
      description: 'Trace progressive encapsulation (Data ➔ Segment ➔ Packet ➔ Frame ➔ Bits), hop-by-hop routing, TTL decrements, MAC rewriting, and clickable live packet header inspection.',
      //sauthor: 'Core Team',
      //status: 'Live & Ready',
      isLive: true,
      path: '/cn/packets',
      badge: 'Interactive Simulator & Code',
      badgeColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    },
    {
      id: 'transport-layer',
      title: 'Transport Layer (TCP vs UDP & Sockets)',
      description: 'Master TCP 3-Way Handshake, byte stream sequencing, sliding window flow control, and 0-RTT UDP datagrams with live simulations and C++, Java, & Python socket code.',
      //author: 'Core Team',
      //status: 'Live & Ready',
      isLive: true,
      path: '/cn/transport',
      badge: 'Live Handshake & Sockets',
      badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    },
    {
      id: 'network-protocols',
      title: 'Network Protocols (HTTP, DNS, DHCP, ARP, ICMP...)',
      description: 'Master 8 core protocols with interactive step-by-step packet simulations, TLS handshake encryption demo, and runnable Java algorithmic simulation code.',
      //author: 'Core Team',
      //sstatus: 'Live & Ready',
      isLive: true,
      path: '/cn/protocols',
      badge: 'Interactive Lab & Java Code',
      badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
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
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                Computer Networks
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-500" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Module Header Banner */}
        <div className="rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-mono font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE COMPUTER SCIENCE DISCIPLINE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Computer Networks Home
            </h1>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Explore OSI and TCP/IP protocol architectures, packet flows, routing algorithms, socket communication, and transport protocols through interactive dry-run simulations.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-emerald-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                8 Active Simulators
              </span>
              <span>•</span>
              <span>8 Interactive Tracks</span>
            </div>
          </div>
        </div>

        {/* CN Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Computer Networks Topics</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              Select Module
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cnTopics.map((topic) => (
              <div
                key={topic.id}
                className={`rounded-3xl bg-white dark:bg-[#111827] border p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all duration-200 ${topic.isLive
                  ? 'border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg'
                  : 'border-slate-200/80 dark:border-slate-800/80 opacity-80'
                  }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${topic.badgeColor}`}>
                      {topic.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {topic.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    <strong className={topic.isLive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>{topic.status}</strong>
                  </span>

                  {topic.isLive ? (
                    <Link
                      to={topic.path}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 hover:scale-102 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Launch Simulator</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-semibold cursor-not-allowed"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>In Development</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
