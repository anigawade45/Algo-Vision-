import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Database,
  Network,
  Cpu,
  Boxes,
  Layers3,
  GitBranch,
  Sparkles
} from 'lucide-react';

const DOMAIN_DATA = [
  {
    id: 'DSA',
    label: 'Data Structures & Algorithms',
    short: 'DSA',
    icon: GitBranch,
    color: 'blue',
    description: 'Visualize algorithms, data structures and problem-solving patterns.',
    concepts: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    metric: '120+ Concepts',
    visual: 'algorithm'
  },
  {
    id: 'OS',
    label: 'Operating Systems',
    short: 'OS',
    icon: Cpu,
    color: 'violet',
    description: 'Understand processes, memory, scheduling and system behavior.',
    concepts: ['Processes', 'Threads', 'Memory', 'Scheduling'],
    metric: '40+ Concepts',
    visual: 'os'
  },
  {
    id: 'DBMS',
    label: 'Database Management',
    short: 'DBMS',
    icon: Database,
    color: 'emerald',
    description: 'Explore queries, indexing, transactions and database internals.',
    concepts: ['SQL', 'Indexing', 'Transactions', 'Normalization'],
    metric: '35+ Concepts',
    visual: 'database'
  },
  {
    id: 'NETWORKS',
    label: 'Computer Networks',
    short: 'Networks',
    icon: Network,
    color: 'cyan',
    description: 'See how data moves through protocols and network layers.',
    concepts: ['TCP/IP', 'HTTP', 'DNS', 'Routing'],
    metric: '30+ Concepts',
    visual: 'network'
  },
  {
    id: 'OOP',
    label: 'Object Oriented Programming',
    short: 'OOP',
    icon: Boxes,
    color: 'amber',
    description: 'Understand classes, objects and relationships visually.',
    concepts: ['Classes', 'Inheritance', 'Polymorphism', 'Abstraction'],
    metric: '25+ Concepts',
    visual: 'oop'
  },
  {
    id: 'SYSTEM',
    label: 'System Design',
    short: 'System Design',
    icon: Layers3,
    color: 'rose',
    description: 'Visualize scalable architectures and distributed systems.',
    concepts: ['Caching', 'Load Balancing', 'Queues', 'Scalability'],
    metric: '20+ Concepts',
    visual: 'system'
  }
];

const ConceptNode = memo(function ConceptNode({ position, title, subtitle }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -3 }}
      className={`absolute ${position} w-32 sm:w-40`}
    >
      <div className="relative rounded-xl border border-slate-200 dark:border-[#263044] bg-white/90 dark:bg-[#0D1422]/95 backdrop-blur px-3.5 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" aria-hidden="true" />
          <div className="min-w-0">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
              {title}
            </div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">
              {subtitle}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export function CoreDomainsSection({ onNavigateToDsa }) {
  const [activeDomain, setActiveDomain] = useState('DSA');

  const active = DOMAIN_DATA.find((domain) => domain.id === activeDomain) || DOMAIN_DATA[0];

  const handleStartLearning = () => {
    if (onNavigateToDsa) {
      onNavigateToDsa();
    } else {
      window.location.hash = '#dsa';
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % DOMAIN_DATA.length;
      setActiveDomain(DOMAIN_DATA[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + DOMAIN_DATA.length) % DOMAIN_DATA.length;
      setActiveDomain(DOMAIN_DATA[prevIndex].id);
    }
  };

  return (
    <section id="domains-overview" className="py-16 sm:py-24 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white font-sans transition-colors duration-200 border-t border-slate-200/80 dark:border-slate-800/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>INTERACTIVE KNOWLEDGE SPACE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Explore Core CS Domains
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Click any domain below to preview its interactive conceptual map &amp; visual learning engine.
          </p>
        </div>

        {/* DOMAIN TABS */}
        <div
          role="tablist"
          aria-label="Computer Science Domains"
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {DOMAIN_DATA.map((domain, idx) => {
            const Icon = domain.icon;
            const isActive = activeDomain === domain.id;

            return (
              <button
                key={domain.id}
                role="tab"
                id={`tab-${domain.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${domain.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveDomain(domain.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={`
                  group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                  border text-xs sm:text-sm font-semibold transition-all cursor-pointer
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                    : 'bg-white dark:bg-[#0B101D] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-[#1E2638] hover:border-blue-300 dark:hover:border-blue-800'
                  }
                `}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{domain.short}</span>
              </button>
            );
          })}
        </div>

        {/* INTERACTIVE CS COMMAND CENTER WIDGET */}
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="rounded-3xl border border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#090D17] shadow-xl dark:shadow-2xl overflow-hidden"
        >

          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-200 dark:border-[#1E2638]">
            <div className="flex items-center gap-2" aria-hidden="true">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              algovision / learning-space
            </div>

            <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500">
              Interactive
            </div>
          </div>

          <div className="grid lg:grid-cols-12 min-h-[440px]">

            {/* LEFT: DOMAIN INFORMATION */}
            <div className="lg:col-span-4 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#1E2638] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center">
                    <active.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                      Exploring
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {active.short}
                    </div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                      {active.label}
                    </h3>

                    <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {active.description}
                    </p>

                    <div className="mt-7">
                      <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-400 mb-3">
                        Concepts
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {active.concepts.map((concept) => (
                          <span
                            key={concept}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#111827] border border-slate-200 dark:border-[#1E2638] text-xs text-slate-600 dark:text-slate-300 font-medium"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200 dark:border-[#1E2638] flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    {active.metric}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Interactive learning content
                  </div>
                </div>

                <button
                  onClick={handleStartLearning}
                  className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={`Start learning ${active.label}`}
                >
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* RIGHT: VISUAL KNOWLEDGE SYSTEM */}
            <div className="lg:col-span-8 relative p-6 sm:p-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative h-full min-h-[360px]"
                >
                  {/* CENTRAL DOMAIN NODE */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{
                        boxShadow: [
                          '0 0 0 rgba(59,130,246,0)',
                          '0 0 35px rgba(59,130,246,0.15)',
                          '0 0 0 rgba(59,130,246,0)'
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity
                      }}
                      className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-blue-400/30 dark:border-blue-500/30 bg-white dark:bg-[#0D1422] flex flex-col items-center justify-center shadow-xl"
                    >
                      <active.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500 mb-2" aria-hidden="true" />
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {active.short}
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 mt-1">
                        Visualize
                      </span>
                    </motion.div>
                  </div>

                  {/* CONNECTING LINES */}
                  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <div className="absolute left-[28%] top-[27%] w-[24%] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-blue-400/10 rotate-[25deg]" />
                    <div className="absolute left-[55%] top-[27%] w-[24%] h-px bg-gradient-to-r from-blue-400/10 via-blue-400/40 to-transparent rotate-[-25deg]" />
                    <div className="absolute left-[27%] top-[67%] w-[25%] h-px bg-gradient-to-r from-transparent via-blue-400/40 to-blue-400/10 rotate-[-25deg]" />
                    <div className="absolute left-[55%] top-[67%] w-[25%] h-px bg-gradient-to-r from-blue-400/10 via-blue-400/40 to-transparent rotate-[25deg]" />
                  </div>

                  {/* CONCEPT NODES */}
                  <ConceptNode
                    position="left-2 top-10 sm:left-8"
                    title={active.concepts[0]}
                    subtitle="Explore"
                  />
                  <ConceptNode
                    position="right-2 top-10 sm:right-8"
                    title={active.concepts[1]}
                    subtitle="Understand"
                  />
                  <ConceptNode
                    position="left-2 bottom-10 sm:left-8"
                    title={active.concepts[2]}
                    subtitle="Visualize"
                  />
                  <ConceptNode
                    position="right-2 bottom-10 sm:right-8"
                    title={active.concepts[3]}
                    subtitle="Master"
                  />

                  {/* STATUS PANEL */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-white/90 dark:bg-[#0B101D]/90 backdrop-blur text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                    <span>Visualization engine ready</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

