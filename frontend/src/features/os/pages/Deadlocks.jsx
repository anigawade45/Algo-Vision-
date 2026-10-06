import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Terminal,
  LayoutDashboard,
  Layers,
  Shield,
  ShieldAlert,
  Sun,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Play,
  RotateCcw,
  ArrowLeft,
  Code
} from 'lucide-react';

import {
  DeadlockIntro,
  DeadlockConditions,
  ResourceAllocationGraph,
  GraphControls,
  DeadlockDetector,
  DeadlockHandling
} from '../components/deadlock';
import { CodeLab } from '../components/code-lab';

export default function Deadlocks({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('graph-simulator');

  // Interactive Graph State
  const [processes, setProcesses] = useState([
    { id: 'P1' },
    { id: 'P2' }
  ]);

  const [resources, setResources] = useState([
    { id: 'R1' },
    { id: 'R2' }
  ]);

  const [edges, setEdges] = useState([
    { from: 'R1', to: 'P1', type: 'allocation' },
    { from: 'P1', to: 'R2', type: 'request' },
    { from: 'R2', to: 'P2', type: 'allocation' },
    { from: 'P2', to: 'R1', type: 'request' }
  ]);

  const [highlightedCycle, setHighlightedCycle] = useState(['P1', 'R2', 'P2', 'R1']);

  // Handlers to modify graph
  const handleAddProcess = () => {
    const nextNum = processes.length + 1;
    const newId = `P${nextNum}`;
    if (processes.some(p => p.id === newId)) return;
    setProcesses(prev => [...prev, { id: newId }]);
  };

  const handleAddResource = () => {
    const nextNum = resources.length + 1;
    const newId = `R${nextNum}`;
    if (resources.some(r => r.id === newId)) return;
    setResources(prev => [...prev, { id: newId }]);
  };

  const handleAddEdge = (newEdge) => {
    const exists = edges.some(e => e.from === newEdge.from && e.to === newEdge.to);
    if (exists) {
      alert('Edge relationship already exists in the graph!');
      return;
    }
    setEdges(prev => [...prev, newEdge]);
    setHighlightedCycle([]);
  };

  const handleRemoveEdge = (from, to) => {
    setEdges(prev => prev.filter(e => !(e.from === from && e.to === to)));
    setHighlightedCycle([]);
  };

  const handleRemoveNode = (nodeId) => {
    setProcesses(prev => prev.filter(p => p.id !== nodeId));
    setResources(prev => prev.filter(r => r.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    setHighlightedCycle([]);
  };

  const handleTerminateProcess = (pid) => {
    handleRemoveNode(pid);
  };

  const handleReleaseResource = (rid) => {
    setEdges(prev => prev.filter(e => !(e.from === rid && e.type === 'allocation')));
    setHighlightedCycle([]);
  };

  const handleLoadExample = (type) => {
    if (type === 'deadlock') {
      setProcesses([{ id: 'P1' }, { id: 'P2' }]);
      setResources([{ id: 'R1' }, { id: 'R2' }]);
      setEdges([
        { from: 'R1', to: 'P1', type: 'allocation' },
        { from: 'P1', to: 'R2', type: 'request' },
        { from: 'R2', to: 'P2', type: 'allocation' },
        { from: 'P2', to: 'R1', type: 'request' }
      ]);
      setHighlightedCycle(['P1', 'R2', 'P2', 'R1']);
    } else if (type === 'safe') {
      setProcesses([{ id: 'P1' }, { id: 'P2' }]);
      setResources([{ id: 'R1' }, { id: 'R2' }]);
      setEdges([
        { from: 'R1', to: 'P1', type: 'allocation' },
        { from: 'P2', to: 'R1', type: 'request' },
        { from: 'R2', to: 'P2', type: 'allocation' }
      ]);
      setHighlightedCycle([]);
    } else if (type === 'complex') {
      setProcesses([{ id: 'P1' }, { id: 'P2' }, { id: 'P3' }]);
      setResources([{ id: 'R1' }, { id: 'R2' }, { id: 'R3' }]);
      setEdges([
        { from: 'R1', to: 'P1', type: 'allocation' },
        { from: 'P1', to: 'R2', type: 'request' },
        { from: 'R2', to: 'P2', type: 'allocation' },
        { from: 'P2', to: 'R3', type: 'request' },
        { from: 'R3', to: 'P3', type: 'allocation' },
        { from: 'P3', to: 'R1', type: 'request' }
      ]);
      setHighlightedCycle(['P1', 'R2', 'P2', 'R3', 'P3', 'R1']);
    }
  };

  const handleClearGraph = () => {
    setProcesses([]);
    setResources([]);
    setEdges([]);
    setHighlightedCycle([]);
  };

  const tabs = [
    { id: 'intro', label: '1. What is Deadlock?', icon: ShieldAlert },
    { id: 'conditions', label: '2. Four Necessary Conditions', icon: Shield },
    { id: 'graph-simulator', label: '3. Resource Allocation Graph & Detector', icon: Activity },
    { id: 'handling', label: '4. Prevention, Avoidance & Recovery', icon: Layers },
    { id: 'codelab', label: '5. Code Lab & Execution Terminal', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <header className="border-b border-slate-200 dark:border-[#1E2638] bg-white dark:bg-[#0B101D] sticky top-0 z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/os" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-600/20">
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
              <Link to="/os" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                Operating Systems
              </Link>
              <span>/</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold truncate max-w-[150px] sm:max-w-none">
                Deadlocks & RAG
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {toggleTheme && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            )}

            <Link
              to="/os"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-slate-700 dark:text-slate-300 text-xs font-semibold hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to OS Home</span>
            </Link>

            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <div className="space-y-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800">
                  Interactive Simulator
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Operating System Deadlocks
                </h1>
              </div>
              <p className="text-slate-550 dark:text-slate-400 text-sm max-w-3xl leading-relaxed">
                Explore circular wait conditions, build custom Resource Allocation Graphs (RAG), run automated cycle detection, and simulate Deadlock Prevention, Avoidance (Banker's Algorithm), and Recovery techniques.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-200 dark:border-[#1E2638] overflow-x-auto no-scrollbar">
          <nav className="flex space-x-2 sm:space-x-4 min-w-max pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Sub-module Component Content */}
        <div className="pt-2">
          {activeTab === 'intro' && <DeadlockIntro />}
          {activeTab === 'conditions' && <DeadlockConditions />}

          {activeTab === 'graph-simulator' && (
            <div className="space-y-8">
              {/* RAG Graph Visualizer Canvas */}
              <ResourceAllocationGraph
                processes={processes}
                resources={resources}
                edges={edges}
                highlightedCycle={highlightedCycle}
                onNodeClick={handleRemoveNode}
                onRemoveEdge={handleRemoveEdge}
              />

              {/* Deadlock Detection Engine */}
              <DeadlockDetector
                processes={processes}
                resources={resources}
                edges={edges}
                onDetectCycle={setHighlightedCycle}
              />

              {/* Graph Builder Controls */}
              <GraphControls
                processes={processes}
                resources={resources}
                edges={edges}
                onAddProcess={handleAddProcess}
                onAddResource={handleAddResource}
                onAddEdge={handleAddEdge}
                onLoadExample={handleLoadExample}
                onClearGraph={handleClearGraph}
              />
            </div>
          )}

          {activeTab === 'handling' && (
            <DeadlockHandling
              processes={processes}
              resources={resources}
              edges={edges}
              onTerminateProcess={handleTerminateProcess}
              onReleaseResource={handleReleaseResource}
            />
          )}

          {activeTab === 'codelab' && <CodeLab module="deadlocks" />}
        </div>

        {/* Key Takeaways & Summary Section */}
        <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-500" />
            <span>Deadlocks Module Key Takeaways</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">1. Four Necessary Conditions</strong>
              <p className="leading-relaxed">
                Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait must ALL simultaneously hold for a deadlock to exist.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">2. Resource Allocation Graph (RAG)</strong>
              <p className="leading-relaxed">
                Directed graph with Process nodes (○) and Resource nodes (□). Requests are P → R, Allocations are R → P. A cycle indicates deadlock in single instance systems.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 space-y-1">
              <strong className="text-slate-900 dark:text-white block font-mono">3. Prevention vs Recovery</strong>
              <p className="leading-relaxed">
                Prevention breaks at least 1 condition beforehand. Recovery aborts processes or preempts resources after a deadlock is detected.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
