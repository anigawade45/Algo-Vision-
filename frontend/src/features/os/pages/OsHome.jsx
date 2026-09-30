import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Terminal, LayoutDashboard, ArrowRight, Play, Layers, CheckCircle2 } from 'lucide-react';

export default function OsHome() {
  const osTopics = [
    {
      id: 'os-fundamentals',
      title: 'OS Fundamentals & Architecture',
      description: 'Explore OS goals, 5-layer system architecture, dual-mode execution (User vs Kernel), system calls, and boot process.',
      path: '/os/fundamentals',
      badge: 'Core Track',
      badgeColor: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    },
    {
      id: 'process-management',
      title: 'Process Management & PCB',
      description: 'Program vs Process, Process Control Block (PCB) inspector, interactive 5-state transition diagram, fork/exec trees, context switching, and OS queues.',
      path: '/os/process-management',
      badge: 'Interactive Visualizer',
      badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    },
    {
      id: 'cpu-scheduling',
      title: 'CPU Scheduling Algorithms',
      description: 'Simulate FCFS, SJF, SRTF, Priority, and Round Robin process scheduling step-by-step with interactive Gantt charts.',
      path: '/os/cpu-scheduling',
      badge: 'Interactive Simulator',
      badgeColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    },
    {
      id: 'deadlocks',
      title: 'Deadlocks & Resource Allocation Graph',
      description: 'Analyze Resource Allocation Graphs (RAG), detect circular wait cycles, Coffman conditions, and simulate recovery.',
      path: '/os/deadlocks',
      badge: 'Interactive RAG Engine',
      badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    },
    {
      id: 'bankers-algorithm',
      title: 'Banker\'s Avoidance Algorithm',
      description: 'Matrix configurator, Need matrix calculator, Dijkstra\'s safety algorithm simulator, safe sequence generator, and resource request test bench.',
      path: '/os/bankers-algorithm',
      badge: 'Safety Simulator',
      badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                AlgoVision OS
              </span>
            </Link>

            <span className="text-slate-300 dark:text-slate-700">/</span>

            <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
              <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                Operating Systems
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
        <div className="rounded-3xl bg-linear-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs font-mono font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE COMPUTER SCIENCE DISCIPLINE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Operating Systems Home
            </h1>

            <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
              Explore OS fundamentals, process management, CPU scheduling algorithms, deadlock graphs, and Banker's avoidance algorithm through interactive dry-run simulations.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-mono text-cyan-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-cyan-300" />
                5 Interactive OS Modules
              </span>
            </div>
          </div>
        </div>

        {/* OS Modules List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Operating System Topics</span>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
              Select Module
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {osTopics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-3xl bg-white dark:bg-[#111827] border border-cyan-200 dark:border-cyan-800/80 hover:border-cyan-400 dark:hover:border-cyan-600 p-6 shadow-sm hover:shadow-lg flex flex-col justify-between space-y-5 transition-all duration-200"
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

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end">
                  <Link
                    to={topic.path}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 hover:scale-102 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
