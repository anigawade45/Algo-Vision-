import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  Cpu,
  Database,
  Network,
  Boxes,
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export function SolutionSection() {
  const [hoveredNode, setHoveredNode] = useState(null);

  const csNodes = [
    {
      id: 'dsa',
      title: 'Data Structures & Algorithms',
      short: 'DSA',
      icon: GitBranch,
      description: 'Foundational memory structures, logic trees & complexity analysis.',
      connections: ['os', 'dbms', 'oop'],
      badge: 'Core Logic',
    },
    {
      id: 'os',
      title: 'Operating Systems',
      short: 'OS',
      icon: Cpu,
      description: 'Concurrency, process management, memory paging & kernel behavior.',
      connections: ['dsa', 'networks', 'system'],
      badge: 'System Execution',
    },
    {
      id: 'dbms',
      title: 'Database Management',
      short: 'DBMS',
      icon: Database,
      description: 'B-Trees, indexing engines, transaction isolation & query optimization.',
      connections: ['dsa', 'system'],
      badge: 'Data Persistence',
    },
    {
      id: 'networks',
      title: 'Computer Networks',
      short: 'Networks',
      icon: Network,
      description: 'Protocol stacks, packet flow, socket states & distributed routing.',
      connections: ['os', 'system'],
      badge: 'Communication Layer',
    },
    {
      id: 'oop',
      title: 'Object Oriented Programming',
      short: 'OOP',
      icon: Boxes,
      description: 'Encapsulation, inheritance paradigms, abstraction & modular design.',
      connections: ['dsa', 'system'],
      badge: 'Software Architecture',
    },
    {
      id: 'system',
      title: 'System Design',
      short: 'System Design',
      icon: Layers,
      description: 'Scalable clusters, load distribution, caching topologies & microservices.',
      connections: ['os', 'dbms', 'networks', 'oop'],
      badge: 'Distributed Systems',
    }
  ];

  return (
    <section id="solution" className="py-24 sm:py-32 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 relative font-sans overflow-hidden border-t border-slate-200 dark:border-slate-800/60 transition-colors duration-200">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 text-xs font-mono font-medium uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span>CONNECTED KNOWLEDGE ARCHITECTURE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Computer Science is connected. <br />
            <span className="text-blue-600 dark:text-blue-500">See the connections.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
            AlgoVision helps you understand complex technical concepts by making relationships, systems, and behavior visible.
          </p>
        </motion.div>

        {/* CONNECTED KNOWLEDGE ARCHITECTURE GRAPH */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Conceptual Node Graph Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {csNodes.map((node) => {
              const Icon = node.icon;
              const isHovered = hoveredNode === node.id;
              const isConnectedToHovered = hoveredNode && node.connections.includes(hoveredNode);

              return (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ y: -4 }}
                  className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-md cursor-pointer ${
                    isHovered
                      ? 'bg-white dark:bg-[#0B101D] border-blue-500 dark:border-blue-500/80 shadow-lg dark:shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30'
                      : isConnectedToHovered
                      ? 'bg-white/80 dark:bg-[#0B101D]/80 border-blue-300 dark:border-blue-500/40 text-slate-900 dark:text-slate-200'
                      : 'bg-white dark:bg-[#0B101D]/40 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Subtle Node Accent Glow */}
                  {isHovered && (
                    <motion.div
                      layoutId="nodeGlow"
                      className="absolute inset-0 bg-gradient-to-br from-blue-500/5 dark:from-blue-500/10 via-transparent to-transparent pointer-events-none"
                    />
                  )}

                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-colors ${
                      isHovered
                        ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-500/20'
                        : 'bg-slate-100 dark:bg-[#070A12] border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      {node.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight flex items-center justify-between">
                    <span>{node.title}</span>
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mb-6">
                    {node.description}
                  </p>

                  {/* Relationship Link Pill Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-blue-500 animate-ping' : 'bg-slate-400 dark:bg-slate-700'}`} />
                      <span>{node.connections.length} System Interlinks</span>
                    </span>

                    <span className={`transition-colors ${isHovered ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-slate-500 dark:text-slate-600'}`}>
                      View Node &rarr;
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Central Architecture Summary Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white/90 dark:bg-[#070A12]/90 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600 dark:text-slate-400 text-center sm:text-left shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
              <span>
                Full-Stack Computer Science Knowledge Architecture &bull; All 6 Core Domains Synchronized
              </span>
            </div>

            <a
              href="#modules"
              className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors shrink-0"
            >
              <span>Explore Ecosystem</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

        </div>

      </div>
    </section>
  );
}


