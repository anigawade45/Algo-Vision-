import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Laptop, 
  Server, 
  Cpu, 
  Zap, 
  Info, 
  Layers, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { NETWORK_TOPOLOGIES_DATA } from '../../data/fundamentalsData';

export function TopologyVisualizer({ onCompleteStep, isCompleted }) {
  const [selectedTopologyId, setSelectedTopologyId] = useState('star');
  const [sourceNodeId, setSourceNodeId] = useState('N1');
  const [targetNodeId, setTargetNodeId] = useState('N3');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [brokenLinks, setBrokenLinks] = useState([]); // Array of link identifiers e.g. 'HUB-N3' or 'backbone'
  const [failedNodes, setFailedNodes] = useState([]); // Array of node IDs e.g. ['HUB'] or ['N2']
  const [activePacketPos, setActivePacketPos] = useState(null); // { x, y, label, color }
  const [eventLogs, setEventLogs] = useState([]);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState(null);

  const topology = NETWORK_TOPOLOGIES_DATA[selectedTopologyId];

  // Reset simulation and broken links when topology changes
  useEffect(() => {
    setIsSimulating(false);
    setSimulationStep(0);
    setBrokenLinks([]);
    setFailedNodes([]);
    setActivePacketPos(null);
    setSelectedNodeInfo(null);
    setEventLogs([
      { time: '00:00.00', text: `Loaded ${topology.name}. Ready for packet simulation.`, type: 'info' }
    ]);

    // Reset default source/target
    if (selectedTopologyId === 'tree') {
      setSourceNodeId('N1');
      setTargetNodeId('N4');
    } else if (selectedTopologyId === 'hybrid') {
      setSourceNodeId('N1');
      setTargetNodeId('N4');
    } else {
      setSourceNodeId('N1');
      setTargetNodeId('N3');
    }
  }, [selectedTopologyId]);

  const addLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 });
    setEventLogs((prev) => [{ time, text, type }, ...prev.slice(0, 19)]);
  };

  // Toggle broken link state
  const toggleBreakLink = (linkId) => {
    if (brokenLinks.includes(linkId)) {
      setBrokenLinks((prev) => prev.filter((id) => id !== linkId));
      addLog(`Link "${linkId}" restored. Cable operational.`, 'success');
    } else {
      setBrokenLinks((prev) => [...prev, linkId]);
      addLog(`Link "${linkId}" SEVERED! Cable failure simulated.`, 'error');
    }
  };

  // Toggle node failure state
  const toggleFailNode = (nodeId) => {
    if (failedNodes.includes(nodeId)) {
      setFailedNodes((prev) => prev.filter((id) => id !== nodeId));
      addLog(`Node "${nodeId}" rebooted and online.`, 'success');
    } else {
      setFailedNodes((prev) => [...prev, nodeId]);
      addLog(`Node "${nodeId}" powered down / FAULT simulated.`, 'error');
    }
  };

  // Trigger Packet Simulation
  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(0);
    addLog(`Initiating packet transmission from ${sourceNodeId} to ${targetNodeId}...`, 'info');

    // Run custom step simulation based on topology
    runTopologyAnimation(selectedTopologyId, sourceNodeId, targetNodeId);
  };

  const runTopologyAnimation = (topId, src, tgt) => {
    if (failedNodes.includes(src)) {
      addLog(`Transmission Aborted: Source node ${src} is offline!`, 'error');
      setIsSimulating(false);
      return;
    }

    if (topId === 'bus') {
      runBusSimulation(src, tgt);
    } else if (topId === 'star') {
      runStarSimulation(src, tgt);
    } else if (topId === 'ring') {
      runRingSimulation(src, tgt);
    } else if (topId === 'mesh') {
      runMeshSimulation(src, tgt);
    } else if (topId === 'tree') {
      runTreeSimulation(src, tgt);
    } else if (topId === 'hybrid') {
      runHybridSimulation(src, tgt);
    }
  };

  // 1. Bus Simulation (Broadcast along backbone to all nodes)
  const runBusSimulation = (src, tgt) => {
    const srcNode = topology.nodes.find((n) => n.id === src);
    const tgtNode = topology.nodes.find((n) => n.id === tgt);

    addLog(`${src} puts frame onto linear bus: Dest MAC = ${tgtNode.label}`, 'info');

    // Step 1: Drop line to backbone
    setActivePacketPos({ x: srcNode.x, y: 170, label: 'Frame', color: 'emerald' });

    setTimeout(() => {
      if (brokenLinks.includes('backbone')) {
        addLog('CRITICAL FAULT: Backbone cable is severed! Signal dissipated at break point.', 'error');
        setActivePacketPos(null);
        setIsSimulating(false);
        return;
      }

      addLog(`Signal broadcasts across shared backbone line in both directions.`, 'info');
      setActivePacketPos({ x: tgtNode.x, y: 170, label: 'Broadcast', color: 'amber' });

      setTimeout(() => {
        if (brokenLinks.includes(`drop-${tgt}`) || failedNodes.includes(tgt)) {
          addLog(`Target node ${tgt} is unreachable or cable disconnected!`, 'error');
        } else {
          setActivePacketPos({ x: tgtNode.x, y: tgtNode.y, label: 'Delivered', color: 'emerald' });
          addLog(`Target node ${tgt} matched destination MAC and processed frame! Other nodes ignored broadcast.`, 'success');
        }

        setTimeout(() => {
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
      }, 1000);
    }, 800);
  };

  // 2. Star Simulation (Unicast through Central Switch)
  const runStarSimulation = (src, tgt) => {
    const srcNode = topology.nodes.find((n) => n.id === src);
    const tgtNode = topology.nodes.find((n) => n.id === tgt);
    const hub = topology.centerNode;

    addLog(`${src} sends frame to Central Switch via dedicated point-to-point link.`, 'info');
    setActivePacketPos({ x: srcNode.x, y: srcNode.y, label: 'Frame', color: 'emerald' });

    setTimeout(() => {
      if (brokenLinks.includes(`link-${src}`)) {
        addLog(`Cable fault on ${src} link! Packet dropped before reaching switch.`, 'error');
        setIsSimulating(false);
        setActivePacketPos(null);
        return;
      }

      // Reached Switch
      setActivePacketPos({ x: hub.x, y: hub.y, label: 'Switch CAM', color: 'blue' });

      if (failedNodes.includes('HUB')) {
        addLog(`CRITICAL FAILURE: Central Switch is offline! Entire Star network is down.`, 'error');
        setIsSimulating(false);
        setActivePacketPos(null);
        return;
      }

      addLog(`Central Switch looked up CAM table: Found ${tgt} on Port ${tgt}. Unicasting directly.`, 'info');

      setTimeout(() => {
        if (brokenLinks.includes(`link-${tgt}`) || failedNodes.includes(tgt)) {
          addLog(`Destination node ${tgt} link is severed or node is offline!`, 'error');
        } else {
          setActivePacketPos({ x: tgtNode.x, y: tgtNode.y, label: 'Delivered', color: 'emerald' });
          addLog(`Packet successfully delivered to ${tgt} with zero collisions!`, 'success');
        }

        setTimeout(() => {
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
      }, 900);
    }, 800);
  };

  // 3. Ring Simulation (Token passing along circular path)
  const runRingSimulation = (src, tgt) => {
    const nodeOrder = ['N1', 'N2', 'N3', 'N4', 'N5'];
    let currIdx = nodeOrder.indexOf(src);
    const tgtIdx = nodeOrder.indexOf(tgt);

    addLog(`${src} captures token and appends payload for ${tgt}. Starting token cycle.`, 'info');

    const stepRing = (idx) => {
      const currentNodeId = nodeOrder[idx];
      const currentNode = topology.nodes.find((n) => n.id === currentNodeId);
      setActivePacketPos({ x: currentNode.x, y: currentNode.y, label: `Token (${currentNodeId})`, color: 'amber' });

      const nextIdx = (idx + 1) % nodeOrder.length;
      const linkName = `ring-${currentNodeId}-${nodeOrder[nextIdx]}`;

      if (brokenLinks.includes(linkName) || failedNodes.includes(currentNodeId)) {
        addLog(`RING COLLAPSE: Break detected at ${currentNodeId}. Token rotation stopped!`, 'error');
        setIsSimulating(false);
        setActivePacketPos(null);
        return;
      }

      if (currentNodeId === tgt) {
        addLog(`Target node ${tgt} received token, copied frame payload, and set ACK flag!`, 'success');
        setTimeout(() => {
          addLog(`Token returning to ${src} to complete rotation and release token.`, 'info');
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
        return;
      }

      addLog(`Node ${currentNodeId} acts as repeater, regenerating signal to next node.`, 'info');

      setTimeout(() => {
        stepRing(nextIdx);
      }, 700);
    };

    stepRing(currIdx);
  };

  // 4. Mesh Simulation (Direct link with dynamic rerouting on link failure)
  const runMeshSimulation = (src, tgt) => {
    const srcNode = topology.nodes.find((n) => n.id === src);
    const tgtNode = topology.nodes.find((n) => n.id === tgt);
    const directLink = `mesh-${src}-${tgt}`;
    const directLinkRev = `mesh-${tgt}-${src}`;

    const isDirectBroken = brokenLinks.includes(directLink) || brokenLinks.includes(directLinkRev);

    if (!isDirectBroken) {
      addLog(`Full Mesh: Utilizing dedicated direct point-to-point link between ${src} and ${tgt}.`, 'info');
      setActivePacketPos({ x: (srcNode.x + tgtNode.x) / 2, y: (srcNode.y + tgtNode.y) / 2, label: 'Direct Link', color: 'emerald' });

      setTimeout(() => {
        if (failedNodes.includes(tgt)) {
          addLog(`Target node ${tgt} is offline.`, 'error');
        } else {
          setActivePacketPos({ x: tgtNode.x, y: tgtNode.y, label: 'Delivered', color: 'emerald' });
          addLog(`Packet delivered instantaneously with dedicated non-blocking bandwidth!`, 'success');
        }
        setTimeout(() => {
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
      }, 900);
    } else {
      // Dynamic reroute via intermediate node (e.g. Node B / N2)
      const intermediateId = topology.nodes.find((n) => n.id !== src && n.id !== tgt && !failedNodes.includes(n.id))?.id || 'N2';
      const intermediateNode = topology.nodes.find((n) => n.id === intermediateId);

      addLog(`Primary link broken! Mesh fault-tolerance triggered: Auto-rerouting through ${intermediateId}.`, 'amber');
      setActivePacketPos({ x: intermediateNode.x, y: intermediateNode.y, label: `Reroute via ${intermediateId}`, color: 'amber' });

      setTimeout(() => {
        setActivePacketPos({ x: tgtNode.x, y: tgtNode.y, label: 'Delivered', color: 'emerald' });
        addLog(`Packet successfully rerouted to ${tgt}! Zero network downtime.`, 'success');
        setTimeout(() => {
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
      }, 1000);
    }
  };

  // 5. Tree Simulation (Hierarchical root/distribution traversal)
  const runTreeSimulation = (src, tgt) => {
    const srcNode = topology.nodes.find((n) => n.id === src);
    const tgtNode = topology.nodes.find((n) => n.id === tgt);

    addLog(`Tree: ${src} sending frame upstream to Distribution Switch.`, 'info');
    setActivePacketPos({ x: 260, y: 155, label: 'Dist SW 1', color: 'blue' });

    setTimeout(() => {
      if (failedNodes.includes('ROOT')) {
        addLog(`TREE COLLAPSE: Core Root Switch is offline! Inter-branch traffic halted.`, 'error');
        setIsSimulating(false);
        setActivePacketPos(null);
        return;
      }

      addLog(`Frame forwarded to Core Root Switch -> Routed to Dist Switch 2.`, 'info');
      setActivePacketPos({ x: 400, y: 55, label: 'Core Root', color: 'purple' });

      setTimeout(() => {
        setActivePacketPos({ x: 540, y: 155, label: 'Dist SW 2', color: 'blue' });

        setTimeout(() => {
          setActivePacketPos({ x: tgtNode.x, y: tgtNode.y, label: 'Delivered', color: 'emerald' });
          addLog(`Frame delivered down hierarchy to ${tgt}!`, 'success');
          setTimeout(() => {
            setIsSimulating(false);
            setActivePacketPos(null);
          }, 1200);
        }, 700);
      }, 700);
    }, 700);
  };

  // 6. Hybrid Simulation (Star-Ring Gateway)
  const runHybridSimulation = (src, tgt) => {
    addLog(`Hybrid: Sending inter-department packet from Dept A (Star) to Dept B (Ring).`, 'info');
    setActivePacketPos({ x: 220, y: 160, label: 'Dept A Hub', color: 'blue' });

    setTimeout(() => {
      addLog(`Packet traverses Central Enterprise Backbone Switch.`, 'info');
      setActivePacketPos({ x: 400, y: 60, label: 'Core Backbone', color: 'purple' });

      setTimeout(() => {
        addLog(`Packet enters Dept B Token Ring and reaches target node ${tgt}.`, 'info');
        setActivePacketPos({ x: 660, y: 270, label: 'Delivered', color: 'emerald' });
        setTimeout(() => {
          setIsSimulating(false);
          setActivePacketPos(null);
        }, 1200);
      }, 800);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Topology Selector Tabs */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-semibold mb-1">
              <Layers className="w-3 h-3 text-emerald-500" />
              <span>INTERACTIVE TOPOLOGY ENGINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Network Topologies Simulator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Explore geometric node layouts, physical cabling rules, live data broadcasts, token passing, and fault-tolerance rerouting.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBrokenLinks([]);
                setFailedNodes([]);
                addLog('Reset all faults. All nodes and cables operational.', 'success');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#1E2638] bg-slate-50 dark:bg-[#070A12] text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Faults</span>
            </button>
          </div>
        </div>

        {/* 6 Topologies Pill Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.values(NETWORK_TOPOLOGIES_DATA).map((top) => {
            const isSelected = selectedTopologyId === top.id;
            return (
              <button
                key={top.id}
                onClick={() => setSelectedTopologyId(top.id)}
                className={`py-3 px-3 rounded-2xl border text-center font-semibold text-xs transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 dark:bg-[#111827] border-slate-200/80 dark:border-[#1E2638] text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                }`}
              >
                <span className="block font-bold">{top.name.split(' ')[0]}</span>
                <span className={`text-[10px] font-mono block mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {top.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive SVG Canvas + Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{topology.name}</span>
                <span className="text-[11px] font-mono font-normal text-slate-400">({topology.tagline})</span>
              </h3>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live Node
              </span>
              <span className="flex items-center gap-1 text-rose-500">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Fault
              </span>
            </div>
          </div>

          {/* SVG Diagram Container */}
          <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
            {/* Subtle background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d12_1px,transparent_1px),linear-gradient(to_bottom,#1f293d12_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <svg viewBox="0 0 800 360" className="w-full h-full select-none">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* === BUS TOPOLOGY === */}
              {selectedTopologyId === 'bus' && (
                <g>
                  {/* Backbone Cable */}
                  <line
                    x1={topology.backbone.x1}
                    y1={topology.backbone.y1}
                    x2={topology.backbone.x2}
                    y2={topology.backbone.y2}
                    stroke={brokenLinks.includes('backbone') ? '#ef4444' : '#10b981'}
                    strokeWidth="6"
                    strokeDasharray={brokenLinks.includes('backbone') ? '8 6' : 'none'}
                    className="cursor-pointer"
                    onClick={() => toggleBreakLink('backbone')}
                  />

                  {/* Terminators */}
                  {topology.terminators.map((term, idx) => (
                    <g key={idx} transform={`translate(${term.x}, ${term.y})`}>
                      <rect x="-8" y="-14" width="16" height="28" rx="3" fill="#f59e0b" />
                      <text x="0" y="-18" fill="#f59e0b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                        50Ω Term
                      </text>
                    </g>
                  ))}

                  {/* Drop Lines */}
                  {topology.dropLines.map((drop, idx) => {
                    const isBroken = brokenLinks.includes(`drop-${drop.from}`);
                    return (
                      <g key={idx}>
                        <line
                          x1={drop.x1}
                          y1={drop.y1}
                          x2={drop.x2}
                          y2={drop.y2}
                          stroke={isBroken ? '#ef4444' : '#38bdf8'}
                          strokeWidth="2.5"
                          strokeDasharray={isBroken ? '4 4' : 'none'}
                          className="cursor-pointer"
                          onClick={() => toggleBreakLink(`drop-${drop.from}`)}
                        />
                        {/* Tap BNC connector */}
                        <circle cx={drop.x2} cy={drop.y2} r="5" fill="#f59e0b" />
                      </g>
                    );
                  })}
                </g>
              )}

              {/* === STAR TOPOLOGY === */}
              {selectedTopologyId === 'star' && (
                <g>
                  {/* Links from Central Switch to Nodes */}
                  {topology.links.map((link, idx) => {
                    const targetNode = topology.nodes.find((n) => n.id === link.to);
                    const isBroken = brokenLinks.includes(`link-${link.to}`);
                    return (
                      <line
                        key={idx}
                        x1={topology.centerNode.x}
                        y1={topology.centerNode.y}
                        x2={targetNode.x}
                        y2={targetNode.y}
                        stroke={isBroken ? '#ef4444' : '#10b981'}
                        strokeWidth="3"
                        strokeDasharray={isBroken ? '6 4' : 'none'}
                        className="cursor-pointer hover:stroke-amber-400 transition-colors"
                        onClick={() => toggleBreakLink(`link-${link.to}`)}
                      />
                    );
                  })}

                  {/* Central Switch Node */}
                  <g
                    transform={`translate(${topology.centerNode.x}, ${topology.centerNode.y})`}
                    className="cursor-pointer"
                    onClick={() => {
                      toggleFailNode('HUB');
                      setSelectedNodeInfo(topology.centerNode);
                    }}
                  >
                    <rect
                      x="-38"
                      y="-26"
                      width="76"
                      height="52"
                      rx="10"
                      fill={failedNodes.includes('HUB') ? '#7f1d1d' : '#1e293b'}
                      stroke={failedNodes.includes('HUB') ? '#ef4444' : '#38bdf8'}
                      strokeWidth="2"
                    />
                    <text x="0" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      Central Switch
                    </text>
                    <text x="0" y="16" fill="#38bdf8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                      Layer 2 CAM
                    </text>
                  </g>
                </g>
              )}

              {/* === RING TOPOLOGY === */}
              {selectedTopologyId === 'ring' && (
                <g>
                  {/* Circular Links */}
                  {topology.links.map((link, idx) => {
                    const fromNode = topology.nodes.find((n) => n.id === link.from);
                    const toNode = topology.nodes.find((n) => n.id === link.to);
                    const linkName = `ring-${link.from}-${link.to}`;
                    const isBroken = brokenLinks.includes(linkName);

                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isBroken ? '#ef4444' : '#10b981'}
                        strokeWidth="3"
                        strokeDasharray={isBroken ? '6 4' : 'none'}
                        className="cursor-pointer hover:stroke-amber-400 transition-colors"
                        onClick={() => toggleBreakLink(linkName)}
                      />
                    );
                  })}
                </g>
              )}

              {/* === MESH TOPOLOGY === */}
              {selectedTopologyId === 'mesh' && (
                <g>
                  {/* Interconnected Full Mesh Links */}
                  {topology.links.map((link, idx) => {
                    const fromNode = topology.nodes.find((n) => n.id === link.from);
                    const toNode = topology.nodes.find((n) => n.id === link.to);
                    const linkName = `mesh-${link.from}-${link.to}`;
                    const isBroken = brokenLinks.includes(linkName);

                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isBroken ? '#ef4444' : '#38bdf860'}
                        strokeWidth={isBroken ? '2.5' : '1.8'}
                        strokeDasharray={isBroken ? '4 4' : 'none'}
                        className="cursor-pointer hover:stroke-amber-400 transition-colors"
                        onClick={() => toggleBreakLink(linkName)}
                      />
                    );
                  })}
                </g>
              )}

              {/* === TREE TOPOLOGY === */}
              {selectedTopologyId === 'tree' && (
                <g>
                  {topology.links.map((link, idx) => {
                    const fromNode = topology.nodes.find((n) => n.id === link.from);
                    const toNode = topology.nodes.find((n) => n.id === link.to);
                    const linkName = `tree-${link.from}-${link.to}`;
                    const isBroken = brokenLinks.includes(linkName);

                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isBroken ? '#ef4444' : '#10b981'}
                        strokeWidth="2.5"
                        strokeDasharray={isBroken ? '6 4' : 'none'}
                        className="cursor-pointer hover:stroke-amber-400 transition-colors"
                        onClick={() => toggleBreakLink(linkName)}
                      />
                    );
                  })}
                </g>
              )}

              {/* === HYBRID TOPOLOGY === */}
              {selectedTopologyId === 'hybrid' && (
                <g>
                  {topology.links.map((link, idx) => {
                    const fromNode = topology.nodes.find((n) => n.id === link.from);
                    const toNode = topology.nodes.find((n) => n.id === link.to);
                    const linkName = `hybrid-${link.from}-${link.to}`;
                    const isBroken = brokenLinks.includes(linkName);

                    return (
                      <line
                        key={idx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={isBroken ? '#ef4444' : '#a855f7'}
                        strokeWidth="2.5"
                        strokeDasharray={isBroken ? '6 4' : 'none'}
                        className="cursor-pointer hover:stroke-amber-400 transition-colors"
                        onClick={() => toggleBreakLink(linkName)}
                      />
                    );
                  })}
                </g>
              )}

              {/* Render Host / Switch Nodes */}
              {topology.nodes.map((node) => {
                const isSource = sourceNodeId === node.id;
                const isTarget = targetNodeId === node.id;
                const isFailed = failedNodes.includes(node.id);
                const isSwitch = node.type === 'switch';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      toggleFailNode(node.id);
                      setSelectedNodeInfo(node);
                    }}
                  >
                    {/* Pulsing ring for source/target */}
                    {(isSource || isTarget) && (
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill="none"
                        stroke={isSource ? '#10b981' : '#38bdf8'}
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-spin"
                        style={{ animationDuration: '8s' }}
                      />
                    )}

                    {/* Node Circle / Box */}
                    {isSwitch ? (
                      <rect
                        x="-26"
                        y="-16"
                        width="52"
                        height="32"
                        rx="6"
                        fill={isFailed ? '#7f1d1d' : '#1e293b'}
                        stroke={isFailed ? '#ef4444' : '#a855f7'}
                        strokeWidth="2"
                      />
                    ) : (
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill={isFailed ? '#7f1d1d' : isSource ? '#065f46' : isTarget ? '#075985' : '#0f172a'}
                        stroke={isFailed ? '#ef4444' : isSource ? '#10b981' : isTarget ? '#38bdf8' : '#334155'}
                        strokeWidth="2"
                      />
                    )}

                    {/* Label */}
                    <text
                      x="0"
                      y={isSwitch ? 4 : 4}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {node.label.split(' ')[0]} {node.label.split(' ')[1] || ''}
                    </text>

                    {/* IP Subtext below */}
                    {node.ip && (
                      <text
                        x="0"
                        y="28"
                        fill="#94a3b8"
                        fontSize="8"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {node.ip}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Animated Moving Packet */}
              {activePacketPos && (
                <g transform={`translate(${activePacketPos.x}, ${activePacketPos.y})`} filter="url(#glow)">
                  <circle cx="0" cy="0" r="10" fill="#10b981" />
                  <circle cx="0" cy="0" r="14" fill="none" stroke="#34d399" strokeWidth="2" className="animate-ping" />
                  <text x="0" y="-14" fill="#34d399" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {activePacketPos.label}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Instructions & Tips */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200/60 dark:border-[#1E2638] text-[11.5px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span><strong>Interactive Tip:</strong> Click any cable link to simulate a wire cut. Click any host to power down/fail.</span>
            </span>
            {brokenLinks.length > 0 && (
              <span className="text-rose-500 font-bold font-mono text-[10.5px]">
                {brokenLinks.length} Broken Link(s)
              </span>
            )}
          </div>
        </div>

        {/* Right: Simulation Controls & Event Log */}
        <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
          {/* Controls Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono text-slate-400">
              Packet Route Controls
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Source Node
                </label>
                <select
                  value={sourceNodeId}
                  onChange={(e) => setSourceNodeId(e.target.value)}
                  className="w-full text-xs font-mono p-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  {topology.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  Target Node
                </label>
                <select
                  value={targetNodeId}
                  onChange={(e) => setTargetNodeId(e.target.value)}
                  className="w-full text-xs font-mono p-2 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  {topology.nodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.label} ({n.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                isSimulating
                  ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 hover:scale-101'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{isSimulating ? 'Simulating Traffic...' : 'Run Packet Transmission'}</span>
            </button>
          </div>

          {/* Live Event Log */}
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 text-white space-y-3 flex-1 min-h-[220px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                Live Topology Log
              </span>
              <span className="text-[10px] font-mono text-slate-500">Real-time Stream</span>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto text-[11px] font-mono pr-1 scrollbar-thin">
              {eventLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border leading-tight ${
                    log.type === 'error'
                      ? 'bg-rose-950/40 border-rose-800/80 text-rose-300'
                      : log.type === 'success'
                      ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                      : log.type === 'amber'
                      ? 'bg-amber-950/40 border-amber-800/80 text-amber-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="text-slate-500 mr-2 text-[10px]">{log.time}</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Advantages & Disadvantages Breakdown Card */}
      <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
              Topology Profile & Mathematical Metrics
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {topology.name} Pros, Cons & Architecture Tradeoffs
            </h3>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400">Cables: </span>
              <strong className="text-slate-800 dark:text-slate-200">{topology.cableFormula}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Advantages */}
          <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/50 space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Key Advantages</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {topology.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disadvantages */}
          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-800/50 space-y-3">
            <h4 className="text-xs font-bold uppercase font-mono text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Key Disadvantages & Bottlenecks</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {topology.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Step Completion Action */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-center gap-3">
          <CheckCircle2 className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-500'}`} />
          <div>
            <span className="text-xs font-bold text-emerald-950 dark:text-emerald-200 block">
              Step 4: Interactive Topologies Lab Explored
            </span>
            <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
              Next: Side-by-side Topologies Comparative Matrix.
            </span>
          </div>
        </div>

        <button
          onClick={onCompleteStep}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-102"
        >
          <span>Compare Topologies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
