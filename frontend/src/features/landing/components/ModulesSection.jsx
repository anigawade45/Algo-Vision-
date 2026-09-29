import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Wifi, Server, Binary, ArrowRight, Play, CheckCircle2, Layers, ShieldCheck, Zap } from 'lucide-react';

export function ModulesSection() {
  const [activeTab, setActiveTab] = useState('dsa');

  const modules = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      icon: Binary,
      description: 'Master arrays, trees, graphs, and dynamic programming through line-by-line interactive step execution.',
      topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & Graphs', 'Dynamic Programming', 'Sorting & Searching'],
      progress: 65,
      btnText: 'Explore DSA Modules',
      badgeColor: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30',
      renderPreview: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-slate-500 dark:text-slate-400">Visualization Demo: Binary Search</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" /> Target Found: 42
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 py-6">
            {[10, 23, 35, 42, 56, 78, 90].map((val, i) => (
              <motion.div
                key={i}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={`w-11 h-13 rounded-xl border flex flex-col items-center justify-center font-mono font-bold text-sm transition-colors duration-300 ${
                  i === 3
                    ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-110'
                    : i >= 0 && i <= 3
                    ? 'bg-slate-100 dark:bg-[#0E172A] text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                    : 'bg-slate-50 dark:bg-[#070A12] text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40'
                }`}
              >
                <span>{val}</span>
                <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-1">[{i}]</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 text-xs font-mono flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Step 3 of 4: <strong className="text-blue-600 dark:text-blue-400">MID = arr[3]</strong> (Target matched!)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">O(log N)</span>
          </div>
        </div>
      )
    },
    {
      id: 'os',
      title: 'Operating Systems',
      icon: Cpu,
      description: 'Understand process scheduling, memory allocation, deadlocks, and multi-threading with visual Gantt charts.',
      topics: ['CPU Scheduling (RR, SJF)', 'Process Synchronization', 'Deadlocks & Bankings', 'Virtual Memory & Paging', 'File Systems'],
      progress: 42,
      btnText: 'Explore OS Modules',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30',
      renderPreview: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-slate-500 dark:text-slate-400">Simulation: Round Robin Scheduling (Quantum = 2ms)</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Active Process: P2</span>
          </div>

          <div className="space-y-2 py-2">
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Gantt Chart Timeline</div>
            <div className="grid grid-cols-6 gap-1 font-mono text-xs font-bold text-center">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-600 dark:text-blue-400 rounded p-2">P1 (0-2)</div>
              <div className="bg-cyan-500 text-white rounded p-2 shadow-md animate-pulse">P2 (2-4)</div>
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-600 dark:text-purple-400 rounded p-2">P3 (4-6)</div>
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-600 dark:text-blue-400 rounded p-2">P1 (6-8)</div>
              <div className="bg-slate-200 dark:bg-slate-800 text-slate-400 rounded p-2 opacity-50">P2 (8-10)</div>
              <div className="bg-slate-200 dark:bg-slate-800 text-slate-400 rounded p-2 opacity-50">P3 (10-12)</div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 text-xs font-mono flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Context Switch: Preempting P1 &rarr; Dispatching P2</span>
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-[10px] font-bold">Ready Queue: [P3, P1]</span>
          </div>
        </div>
      )
    },
    {
      id: 'networks',
      title: 'Computer Networks',
      icon: Wifi,
      description: 'Trace TCP/IP packet transmission, DNS lookups, HTTP requests, and network routing in real time.',
      topics: ['OSI 7 Layer Model', 'TCP/IP 3-Way Handshake', 'DNS Resolution', 'IP Routing Protocols', 'HTTP/HTTPS Flow', 'Subnetting'],
      progress: 35,
      btnText: 'Explore Network Modules',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
      renderPreview: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-slate-500 dark:text-slate-400">Flow: TCP 3-Way Handshake</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Connection Established
            </span>
          </div>

          <div className="flex items-center justify-between py-4 px-6 relative">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                Client
              </div>
              <div className="text-[10px] font-mono text-slate-500">192.168.1.10</div>
            </div>

            {/* Packet Travel Lines */}
            <div className="flex-1 mx-6 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="flex-1 h-[1.5px] bg-emerald-500/40 relative">
                  <span className="absolute -top-1 left-1/3 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </span>
                <span>SYN (Seq=100) &rarr;</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 dark:text-blue-400 flex-row-reverse">
                <span className="flex-1 h-[1.5px] bg-blue-500/40 relative">
                  <span className="absolute -top-1 right-1/3 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                </span>
                <span>&leftarrow; SYN-ACK (Ack=101)</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="flex-1 h-[1.5px] bg-emerald-500/40" />
                <span>ACK (Seq=101) &rarr;</span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-mono font-bold text-xs">
                Server
              </div>
              <div className="text-[10px] font-mono text-slate-500">93.184.216.34</div>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 text-xs font-mono flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>State: <strong className="text-emerald-600 dark:text-emerald-400">ESTABLISHED</strong> (RTT = 18ms)</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Port 443</span>
          </div>
        </div>
      )
    },
    {
      id: 'sysdesign',
      title: 'System Design',
      icon: Server,
      description: 'Learn high-level architecture: Load Balancers, Redis Caching, DB Replication, and Microservices.',
      topics: ['Load Balancers & Nginx', 'Distributed Caching (Redis)', 'Database Sharding & Replication', 'Message Queues (Kafka)', 'CDN & Rate Limiting'],
      progress: 28,
      btnText: 'Explore System Design',
      badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
      renderPreview: () => (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-slate-500 dark:text-slate-400">Architecture: High-Availability Cluster</span>
            <span className="text-purple-600 dark:text-purple-400 font-semibold">Cache Hit Ratio: 94.2%</span>
          </div>

          <div className="grid grid-cols-3 gap-3 py-2 text-center font-mono text-xs">
            <div className="bg-slate-100 dark:bg-[#070A12] border border-purple-500/30 p-3 rounded-xl space-y-1">
              <span className="text-purple-600 dark:text-purple-400 font-bold block text-xs">Load Balancer</span>
              <span className="text-[10px] text-slate-500">Nginx Round-Robin</span>
            </div>
            <div className="bg-purple-500 text-white p-3 rounded-xl space-y-1 shadow-md animate-pulse">
              <span className="font-bold block text-xs">Redis Cache</span>
              <span className="text-[10px] opacity-80">In-Memory (0.8ms)</span>
            </div>
            <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-300 dark:border-slate-700 p-3 rounded-xl space-y-1">
              <span className="text-slate-700 dark:text-slate-300 font-bold block text-xs">Primary DB</span>
              <span className="text-[10px] text-slate-500">PostgreSQL (Replica)</span>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 text-xs font-mono flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Query Result: Served directly from Redis Cache</span>
            <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">10k req/sec</span>
          </div>
        </div>
      )
    }
  ];

  const currentModule = modules.find((m) => m.id === activeTab) || modules[0];
  const IconComponent = currentModule.icon;

  return (
    <section id="modules" className="py-20 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200/80 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Layers className="w-3.5 h-3.5" />
            <span>INTERACTIVE CURRICULUM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Explore core CS domains <span className="text-blue-600 dark:text-[#3B82F6]">visually.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Click any computer science module tab below to launch its interactive simulation workspace.
          </p>
        </motion.div>

        {/* SPLIT-SCREEN HUB */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
          
          {/* LEFT PANEL: Module Tabs */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
            {modules.map((mod) => {
              const TabIcon = mod.icon;
              const isActive = activeTab === mod.id;
              return (
                <button
                  key={mod.id}
                  onClick={() => setActiveTab(mod.id)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-4 relative overflow-hidden ${
                    isActive
                      ? 'bg-white dark:bg-[#0B101D] border-blue-500/60 shadow-lg dark:shadow-[0_4px_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20'
                      : 'bg-white/60 dark:bg-[#0B101D]/50 border-slate-200/80 dark:border-[#1E2638] hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabGlow"
                      className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/10 pointer-events-none"
                    />
                  )}

                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                      : 'bg-slate-100 dark:bg-[#070A12] border-slate-200 dark:border-[#1C2638] text-slate-600 dark:text-slate-400'
                  }`}>
                    <TabIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-1 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className={`text-base font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {mod.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#070A12] text-slate-500">
                        {mod.topics.length} topics
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT PANEL: Live Interactive Simulation Playground Canvas with Framer Motion AnimatePresence */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden transition-colors">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#1E2638] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-none">
                        {currentModule.title}
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                        Interactive Playground Preview
                      </span>
                    </div>
                  </div>

                  <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full border ${currentModule.badgeColor}`}>
                    {currentModule.progress}% Progress
                  </span>
                </div>

                {/* Live Interactive Visualization Preview Widget */}
                <div className="py-2">
                  {currentModule.renderPreview()}
                </div>

                {/* Topics Checkmark Pills */}
                <div className="space-y-2 border-t border-slate-200 dark:border-[#1E2638] pt-4">
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
                    Curriculum Breakdown:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentModule.topics.map((t, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] text-slate-700 dark:text-slate-300 text-xs font-medium"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                        <span>{t}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full"
                  >
                    <Link
                      to={currentModule.id === 'os' ? "/os/cpu-scheduling" : "#"}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm inline-flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all text-center"
                    >
                      <span>{currentModule.btnText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

        </div>

      </div>
    </section>
  );
}
