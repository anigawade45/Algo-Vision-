import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  Sparkles,
  Sun,
  Moon,
  Network,
  Code2,
  BookOpen
} from 'lucide-react';
import {
  DEFAULT_NODES,
  DEFAULT_EDGES,
  runDijkstraSimulation,
} from '../utils/routingAlgorithms';
import { NetworkGraphCanvas } from '../components/routing/NetworkGraphCanvas';
import { RoutingControls } from '../components/routing/RoutingControls';
import { RoutingTableViewer } from '../components/routing/RoutingTableViewer';
import { DijkstraStepLog } from '../components/routing/DijkstraStepLog';
import { RoutingExplanation } from '../components/routing/RoutingExplanation';
import { RoutingCodeViewer } from '../components/routing/RoutingCodeViewer';

const ROUTING_TABS = [
  { id: 'simulator', label: '1. Dijkstra Routing Simulator' },
  { id: 'code', label: '2. Multi-Language Code Lab' },
  { id: 'theory', label: '3. Routing Protocols & OSPF Theory' }
];

export default function RoutingProtocols({ theme, toggleTheme }) {
  const [activeTab, setActiveTab] = useState('simulator');
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);
  const [sourceId, setSourceId] = useState('A');
  const [destId, setDestId] = useState('F');

  const [simulationResult, setSimulationResult] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStepIdx = ROUTING_TABS.findIndex((t) => t.id === activeTab);

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setActiveTab(ROUTING_TABS[currentStepIdx - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep = () => {
    if (currentStepIdx < ROUTING_TABS.length - 1) {
      setActiveTab(ROUTING_TABS[currentStepIdx + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Recalculate simulation on source/dest/edges change
  useEffect(() => {
    const res = runDijkstraSimulation(nodes, edges, sourceId, destId);
    setSimulationResult(res);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [nodes, edges, sourceId, destId]);

  // Interval hook for simulation playback
  useEffect(() => {
    let timer = null;
    if (isPlaying && simulationResult && simulationResult.steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= simulationResult.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, simulationResult]);

  const currentStep = simulationResult?.steps?.[currentStepIndex] || null;

  const handleTogglePlay = () => {
    if (!simulationResult || simulationResult.steps.length === 0) return;
    if (currentStepIndex >= simulationResult.steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    if (simulationResult && currentStepIndex < simulationResult.steps.length - 1) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setIsPlaying(false);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleToggleLinkFail = (edgeId) => {
    setEdges((prev) =>
      prev.map((e) => (e.id === edgeId ? { ...e, isDown: !e.isDown } : e))
    );
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
                Routing Protocols
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

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Dijkstra Link-State &amp; OSPF Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Routing Algorithms &amp; Shortest Path Convergence
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Simulate link-state routing, shortest path tree relaxation, routing table convergence, and dynamic link failure rerouting.
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
            <Network className="w-3.5 h-3.5" />
            <span>1. Dijkstra Routing Simulator</span>
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
            <span>2. Multi-Language Code Lab</span>
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
            <span>3. Routing Protocols &amp; OSPF Theory</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        {activeTab === 'simulator' && (
          <div className="space-y-8">
            {/* 1. Network Topology SVG Canvas */}
            <NetworkGraphCanvas
              nodes={nodes}
              edges={edges}
              sourceId={sourceId}
              destId={destId}
              onSelectSource={setSourceId}
              onSelectDest={setDestId}
              onToggleLinkFail={handleToggleLinkFail}
              currentStep={currentStep}
              finalPath={simulationResult?.finalPath}
            />

            {/* 2. Routing Controls & Step Stepper */}
            <RoutingControls
              nodes={nodes}
              sourceId={sourceId}
              destId={destId}
              onSelectSource={setSourceId}
              onSelectDest={setDestId}
              currentStepIndex={currentStepIndex}
              totalSteps={simulationResult?.totalSteps || 1}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              currentStep={currentStep}
            />

            {/* 3. Tentative Distance Log */}
            <DijkstraStepLog nodes={nodes} currentStep={currentStep} />

            {/* 4. Generated Routing Table */}
            <RoutingTableViewer
              sourceId={sourceId}
              destId={destId}
              routingTable={simulationResult?.routingTable || []}
              finalPath={simulationResult?.finalPath}
              totalCost={simulationResult?.totalCost}
            />
          </div>
        )}

        {activeTab === 'code' && (
          <RoutingCodeViewer initialSource={sourceId} initialDest={destId} />
        )}

        {activeTab === 'theory' && <RoutingExplanation />}

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
            Step {currentStepIdx + 1} of {ROUTING_TABS.length}
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStepIdx === ROUTING_TABS.length - 1}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              currentStepIdx === ROUTING_TABS.length - 1
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
