import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  GitBranch,
  Cpu,
  Database,
  Network,
  Boxes,
  Layers,
  Eye,
  Brain,
  Link,
  Sliders,
  Bot,
  CheckCircle2
} from 'lucide-react';

const CS_DOMAINS = [
  {
    id: 'dsa',
    short: 'DSA',
    name: 'Data Structures & Algorithms',
    icon: GitBranch,
    concepts: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming']
  },
  {
    id: 'os',
    short: 'OS',
    name: 'Operating Systems',
    icon: Cpu,
    concepts: ['Processes', 'Memory', 'Scheduling', 'File Systems']
  },
  {
    id: 'dbms',
    short: 'DBMS',
    name: 'Database Management',
    icon: Database,
    concepts: ['Queries', 'Transactions', 'Indexing', 'Normalization']
  },
  {
    id: 'networks',
    short: 'NETWORKS',
    name: 'Computer Networks',
    icon: Network,
    concepts: ['TCP/IP', 'HTTP', 'DNS', 'Routing']
  },
  {
    id: 'oop',
    short: 'OOP',
    name: 'Object-Oriented Programming',
    icon: Boxes,
    concepts: ['Classes', 'Objects', 'Inheritance', 'Polymorphism']
  },
  {
    id: 'system',
    short: 'SYSTEM DESIGN',
    name: 'System Design',
    icon: Layers,
    concepts: ['Caching', 'Load Balancing', 'Queues', 'Scalability']
  }
];

const CAPABILITIES = [
  {
    id: 'viz',
    title: 'Concept Visualization',
    description: 'See complex concepts represented visually instead of relying only on static explanations.',
    icon: Eye
  },
  {
    id: 'behavior',
    title: 'System Behavior',
    description: 'Observe how processes, memory, databases, networks and components behave over time.',
    icon: Brain
  },
  {
    id: 'connections',
    title: 'Concept Connections',
    description: 'Understand how ideas across different CS domains connect to one another.',
    icon: Link
  },
  {
    id: 'interactive',
    title: 'Interactive Exploration',
    description: 'Change inputs, explore states, and investigate concepts instead of only reading about them.',
    icon: Sliders
  },
  {
    id: 'ai',
    title: 'AI Explanation',
    description: 'Ask questions and receive contextual explanations while exploring a concept.',
    icon: Bot
  }
];

const CompactStripPills = memo(function CompactStripPills() {
  const items = [
    { label: 'Visualize', desc: 'Abstract Concepts' },
    { label: 'Understand', desc: 'System Behavior' },
    { label: 'Connect', desc: 'Cross-Domain Knowledge' },
    { label: 'Explore', desc: 'Interactive States' }
  ];

  return (
    <div className="pt-10 border-t border-slate-200 dark:border-slate-800/80">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {items.map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E2638] bg-white/80 dark:bg-[#0B101D]/60 backdrop-blur text-center space-y-0.5 transition-all hover:border-blue-300 dark:hover:border-blue-800"
          >
            <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {item.label}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export function DifferentiatorSection() {
  const [activeDomainId, setActiveDomainId] = useState('os');

  const activeDomain = CS_DOMAINS.find((d) => d.id === activeDomainId) || CS_DOMAINS[0];

  return (
    <section
      id="differentiator"
      className="py-20 bg-white dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200 dark:border-[#1C2638] transition-colors duration-200"
      aria-label="Why AlgoVision"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ASYMMETRIC TOP COMPOSITION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* LEFT COLUMN: Why AlgoVision Narrative */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span>WHY ALGOVISION</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Computer Science, <br className="hidden sm:block" />
              <span className="text-blue-600 dark:text-[#3B82F6]">made visible.</span>
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-normal">
              AlgoVision turns abstract technical concepts into interactive visual experiences so you can understand how systems, components, and ideas work together.
            </p>

            {/* 5 Core Capabilities List */}
            <div className="space-y-4 pt-2">
              {CAPABILITIES.map((cap) => {
                const CapIcon = cap.icon;
                return (
                  <div key={cap.id} className="flex items-start gap-3.5 group">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-colors">
                      <CapIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
                        {cap.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                        {cap.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive CS Knowledge Map Visualization */}
          <div className="lg:col-span-7 bg-slate-50/80 dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors">
            
            {/* Header / Subtitle */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                  Interactive Knowledge Matrix
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  From abstract concepts to visible systems
                </h3>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/40 text-[10px] font-mono text-blue-600 dark:text-blue-400">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" aria-hidden="true" />
                <span>Hover or Select Domain</span>
              </div>
            </div>

            {/* 6 Equal CS Domain Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {CS_DOMAINS.map((domain) => {
                const DomainIcon = domain.icon;
                const isSelected = activeDomainId === domain.id;

                return (
                  <button
                    key={domain.id}
                    onClick={() => setActiveDomainId(domain.id)}
                    onMouseEnter={() => setActiveDomainId(domain.id)}
                    onFocus={() => setActiveDomainId(domain.id)}
                    className={`
                      p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                      ${isSelected
                        ? 'bg-white dark:bg-[#111827] border-blue-500 dark:border-blue-500 shadow-md ring-1 ring-blue-500/30'
                        : 'bg-white/60 dark:bg-[#070A12]/60 border-slate-200 dark:border-[#1C2638] hover:border-blue-300 dark:hover:border-blue-800 text-slate-600 dark:text-slate-400'
                      }
                    `}
                    aria-label={`Inspect ${domain.name}`}
                  >
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                        : 'bg-slate-100 dark:bg-[#0B101D] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      <DomainIcon className="w-4 h-4" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className={`text-xs font-bold font-mono tracking-wide ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                        [{domain.short}]
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {domain.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ACTIVE DOMAIN CONCEPT HIGHLIGHT PANEL */}
            <div className="bg-white dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-5 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDomain.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2.5">
                      <activeDomain.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                        {activeDomain.name} System Concepts
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-900/40">
                      4 Core Nodes Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {activeDomain.concepts.map((concept) => (
                      <motion.div
                        key={concept}
                        whileHover={{ scale: 1.02 }}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-[#0D1422] border border-slate-200/80 dark:border-[#1E2638] flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                            {concept}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                          Visualized
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                      <span>{activeDomain.short} architecture synchronized across ecosystem</span>
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>

        {/* BOTTOM COMPACT CAPABILITY STRIP */}
        <CompactStripPills />

      </div>
    </section>
  );
}
