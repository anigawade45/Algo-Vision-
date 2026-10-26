import { useState } from 'react';
import {
  Layers,
  ShieldAlert,
  CheckCircle2,
  Activity,
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
import { OsNavbar, OsTabs, OsPageHeader } from '../components/shared';

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
    { id: 'intro', label: '1. What is a Deadlock?', icon: ShieldAlert },
    { id: 'conditions', label: '2. Four Coffman Conditions', icon: Layers },
    { id: 'graph-simulator', label: '3. Interactive RAG Simulator', icon: Activity },
    { id: 'handling', label: '4. Deadlock Handling Strategies', icon: CheckCircle2 },
    { id: 'codelab', label: '5. Deadlock Code Lab', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 selection:bg-cyan-500 selection:text-white">
      {/* Top Application Navbar */}
      <OsNavbar
        badge="OS Deadlocks"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Header Banner */}
        <OsPageHeader
          badge="Interactive Simulator"
          badgeColor="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800"
          title="Operating System Deadlocks"
          description="Explore circular wait conditions, build custom Resource Allocation Graphs (RAG), run automated cycle detection, and simulate Deadlock Prevention, Avoidance (Banker's Algorithm), and Recovery techniques."
        />

        {/* Navigation Tabs Bar */}
        <OsTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

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
