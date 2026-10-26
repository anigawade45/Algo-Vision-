import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Layers,
  ArrowRight,
  Play,
  CheckCircle2,
  Sun,
  Moon,
  LayoutDashboard,
} from 'lucide-react';

const CN_TOPICS = [
  {
    id: 'fundamentals',
    title: 'Computer Network Fundamentals',
    description:
      'Master core networking principles: data communication models, transmission media, PAN/LAN/MAN/WAN scales, and essential networking devices.',
    path: '/cn/fundamentals',
    badge: 'Foundational Track',
    badgeColor:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'topologies',
    title: 'Network Topologies & Simulation',
    description:
      'Simulate packet transmissions across Bus, Star, Ring, Mesh, Tree, and Hybrid layouts with link cuts, node-fault testing, and comparative tradeoffs.',
    path: '/cn/topologies',
    badge: 'Interactive Simulator',
    badgeColor:
      'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
  },
  {
    id: 'osi-layers',
    title: 'OSI 7-Layer Model & Encapsulation',
    description:
      'Step through protocol data unit (PDU) encapsulation from the Application layer down to the Physical layer with header inspection.',
    path: '/cn/osi-layers',
    badge: 'Interactive Encapsulation',
    badgeColor:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
  {
    id: 'ip-subnetting',
    title: 'IPv4 Subnetting & CIDR Calculator',
    description:
      'Calculate subnet masks, usable host ranges, broadcast addresses, 32-bit binary ANDing, and VLSM allocation.',
    path: '/cn/ip-subnetting',
    badge: 'Live Calculator',
    badgeColor:
      'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'routing-protocols',
    title: 'Routing Algorithms (Dijkstra & Distance Vector)',
    description:
      'Simulate shortest-path trees, link-failure rerouting, routing-table convergence, and routing algorithms.',
    path: '/cn/routing-protocols',
    badge: 'Interactive Graph & Code',
    badgeColor:
      'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  },
  {
    id: 'packet-transmission',
    title: 'Packet & Data Transmission',
    description:
      'Trace encapsulation from Data to Bits, hop-by-hop routing, TTL decrements, MAC rewriting, and packet-header inspection.',
    path: '/cn/packets',
    badge: 'Interactive Simulator & Code',
    badgeColor:
      'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
  },
  {
    id: 'transport-layer',
    title: 'Transport Layer (TCP vs UDP & Sockets)',
    description:
      'Explore the TCP three-way handshake, sequencing, sliding-window flow control, UDP datagrams, and socket concepts.',
    path: '/cn/transport',
    badge: 'Live Handshake & Sockets',
    badgeColor:
      'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  },
  {
    id: 'network-protocols',
    title: 'Network Protocols (HTTP, DNS, DHCP, ARP, ICMP...)',
    description:
      'Explore eight core protocols through interactive packet simulations and protocol-specific code examples.',
    path: '/cn/protocols',
    badge: 'Interactive Lab & Code',
    badgeColor:
      'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  },
];

export default function CnHome({ theme, toggleTheme }) {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-200 selection:bg-emerald-500 selection:text-white dark:bg-[#05070E] dark:text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white transition-colors dark:border-[#1E2638] dark:bg-[#0B101D]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link to="/cn" className="group flex shrink-0 items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-sm font-bold text-white shadow-md">
                <Wifi className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base font-bold tracking-tight transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                AlgoVision CN
              </span>
            </Link>
            <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 font-mono text-xs text-slate-500 dark:text-slate-400 md:flex">
              <span aria-hidden="true">/</span>
              <Link to="/dashboard" className="transition-colors hover:text-slate-900 dark:hover:text-slate-200">Dashboard</Link>
              <span aria-hidden="true">/</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Computer Networks</span>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {typeof toggleTheme === 'function' && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 transition-colors hover:text-slate-900 dark:border-[#1E2638] dark:bg-[#070A12] dark:text-slate-400 dark:hover:text-white"
              >
                {theme === 'dark'
                  ? <Sun className="h-4 w-4 text-amber-400" aria-hidden="true" />
                  : <Moon className="h-4 w-4" aria-hidden="true" />}
              </button>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:border-[#1E2638] dark:bg-[#070A12] dark:text-slate-300 dark:hover:text-white whitespace-nowrap"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
              <span className="hidden sm:inline">Back to </span><span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-8 text-white shadow-xl sm:p-10">
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 font-mono text-xs font-semibold">
              <Layers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>CORE COMPUTER SCIENCE DISCIPLINE</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Computer Networks Home</h1>
            <p className="text-sm leading-relaxed text-emerald-100 sm:text-base">
              Explore OSI and TCP/IP architectures, packet flows, routing algorithms, socket communication, and transport protocols through interactive simulations.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 font-mono text-xs text-emerald-100">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-200" aria-hidden="true" />
                {CN_TOPICS.length} learning modules
              </span>
              <span aria-hidden="true">•</span>
              <span>{CN_TOPICS.length} topic tracks</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
            <span>Computer Networks Topics</span>
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-xs text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              Select Module
            </span>
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {CN_TOPICS.map((topic) => (
              <article
                key={topic.id}
                className="flex flex-col justify-between space-y-5 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-emerald-400 hover:shadow-lg dark:border-emerald-800/80 dark:bg-[#111827] dark:hover:border-emerald-600"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${topic.badgeColor}`}>
                      {topic.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{topic.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-sm">{topic.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800/80">
                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">Available</span>
                  <Link
                    to={topic.path}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:bg-emerald-700"
                    aria-label={`Open ${topic.title}`}
                  >
                    <Play className="h-3.5 w-3.5 fill-white" aria-hidden="true" />
                    <span>Launch Module</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
