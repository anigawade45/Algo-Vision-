import React from 'react';
import { Wifi } from 'lucide-react';

export function NetworkGraphCanvas({
  nodes,
  edges,
  sourceId,
  destId,
  onSelectSource,
  onSelectDest,
  onToggleLinkFail,
  currentStep,
  finalPath,
}) {
  const visitedSet = new Set(currentStep?.visited || []);
  const activeEdgeId = currentStep?.activeEdgeId;
  const highlightPath = currentStep?.highlightPath || [];

  return (
    <div className="rounded-3xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] p-6 sm:p-8 shadow-sm font-sans space-y-4 relative overflow-hidden">
      {/* Topology Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span>Interactive Autonomous System (AS) Topology</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
          <span>Click links to toggle failure • Click nodes to set Source / Dest</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full h-[360px] sm:h-[400px] relative bg-slate-50/70 dark:bg-[#070A12] border border-slate-200/70 dark:border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        <svg className="w-full h-full" viewBox="0 0 760 360" preserveAspectRatio="xMidYMid meet">
          {/* Edges / Network Links */}
          {edges.map((edge) => {
            const u = nodes.find((n) => n.id === edge.source);
            const v = nodes.find((n) => n.id === edge.target);
            if (!u || !v) return null;

            const isHighlighted = highlightPath.includes(edge.id);
            const isActive = activeEdgeId === edge.id;
            const isFailed = edge.isDown;

            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            return (
              <g key={edge.id} className="cursor-pointer" onClick={() => onToggleLinkFail(edge.id)}>
                {/* Background thicker hover hit area */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth="18"
                />

                {/* Visible Link Line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={
                    isFailed
                      ? '#ef4444'
                      : isHighlighted
                      ? '#10b981'
                      : isActive
                      ? '#3b82f6'
                      : '#94a3b8'
                  }
                  strokeWidth={isHighlighted || isActive ? 4 : isFailed ? 2.5 : 2}
                  strokeDasharray={isFailed ? '6,6' : 'none'}
                  className="transition-all duration-300"
                />

                {/* Animated Packet Flow if path is highlighted */}
                {isHighlighted && !isFailed && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#34d399"
                    strokeWidth="4"
                    strokeDasharray="8,8"
                    className="animate-pulse"
                  />
                )}

                {/* Link Cost Badge */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-18"
                    y="-12"
                    width="36"
                    height="24"
                    rx="8"
                    fill={isFailed ? '#ef4444' : isHighlighted ? '#10b981' : '#1e293b'}
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {isFailed ? 'DOWN' : edge.cost}
                  </text>
                </g>
              </g>
            );
          })}

          {/* Router Nodes */}
          {nodes.map((node) => {
            const isSource = node.id === sourceId;
            const isDest = node.id === destId;
            const isVisited = visitedSet.has(node.id);
            const isCurrent = currentStep?.currentNode === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  if (node.id !== sourceId) onSelectDest(node.id);
                }}
              >
                {/* Node Ambient Glow */}
                <circle
                  r={isSource || isDest ? 30 : 26}
                  fill={
                    isSource
                      ? 'rgba(16, 185, 129, 0.2)'
                      : isDest
                      ? 'rgba(59, 130, 246, 0.2)'
                      : isCurrent
                      ? 'rgba(245, 158, 11, 0.25)'
                      : 'transparent'
                  }
                  className="animate-pulse"
                />

                {/* Node Outer Circle */}
                <circle
                  r="22"
                  fill={
                    isSource
                      ? '#10b981'
                      : isDest
                      ? '#3b82f6'
                      : isCurrent
                      ? '#f59e0b'
                      : isVisited
                      ? '#047857'
                      : '#334155'
                  }
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="transition-all duration-300 drop-shadow-md group-hover:scale-110"
                />

                {/* Router Label */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="13"
                  fontFamily="sans-serif"
                  fontWeight="extrabold"
                >
                  {node.id}
                </text>

                {/* Subtext: IP & Dist */}
                <text
                  x="0"
                  y="36"
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10.5"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.ip}
                </text>

                {/* Source / Destination Badges */}
                {isSource && (
                  <g transform="translate(0, -28)">
                    <rect x="-24" y="-8" width="48" height="16" rx="6" fill="#10b981" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      SOURCE
                    </text>
                  </g>
                )}
                {isDest && (
                  <g transform="translate(0, -28)">
                    <rect x="-22" y="-8" width="44" height="16" rx="6" fill="#3b82f6" />
                    <text x="0" y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">
                      DEST
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
