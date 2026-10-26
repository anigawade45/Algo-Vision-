export default function ResourceAllocationGraph({
  processes,
  resources,
  edges,
  highlightedCycle = [],
  onNodeClick,
  onRemoveEdge
}) {
  const nodePositions = {};
  const centerY = 240;

  // 2-Column Bipartite Layout: Processes on Left (x=160), Resources on Right (x=480)
  const pCount = processes.length;
  const pSpacing = pCount > 1 ? Math.min(140, 320 / (pCount - 1)) : 0;
  const pStartY = pCount > 1 ? centerY - ((pCount - 1) * pSpacing) / 2 : centerY;

  processes.forEach((proc, idx) => {
    nodePositions[proc.id] = {
      x: 160,
      y: pCount > 1 ? pStartY + idx * pSpacing : centerY,
      type: 'process'
    };
  });

  const rCount = resources.length;
  const rSpacing = rCount > 1 ? Math.min(140, 320 / (rCount - 1)) : 0;
  const rStartY = rCount > 1 ? centerY - ((rCount - 1) * rSpacing) / 2 : centerY;

  resources.forEach((res, idx) => {
    nodePositions[res.id] = {
      x: 480,
      y: rCount > 1 ? rStartY + idx * rSpacing : centerY,
      type: 'resource'
    };
  });

  const isNodeInCycle = (nodeId) => highlightedCycle.includes(nodeId);

  const isEdgeInCycle = (from, to) => {
    if (highlightedCycle.length < 2) return false;
    for (let i = 0; i < highlightedCycle.length; i++) {
      const current = highlightedCycle[i];
      const next = highlightedCycle[(i + 1) % highlightedCycle.length];
      if (current === from && next === to) return true;
    }
    return false;
  };

  const totalNodes = processes.length + resources.length;

  return (
    <div className="w-full overflow-hidden space-y-4">
      {/* Legend Header */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono bg-slate-50 dark:bg-[#070A12] p-3 rounded-xl border border-slate-200 dark:border-[#1E2638]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 inline-block" />
            ○ Process Node (Left Column)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
            <span className="w-3.5 h-3.5 rounded bg-amber-500 inline-block" />
            □ Resource Node (Right Column)
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-4 h-0.5 bg-amber-500 inline-block border-t border-dashed border-amber-500" />
            → Request (P → R)
          </span>
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <span className="w-4 h-0.5 bg-emerald-500 inline-block" />
            → Allocation (R → P)
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden min-h-[460px] flex items-center justify-center p-4">
        {totalNodes === 0 ? (
          <div className="text-slate-500 font-mono text-xs text-center space-y-2">
            <p>Resource Allocation Graph is empty.</p>
            <p className="text-[11px] opacity-70">Use controls below to add processes, resources, and edges.</p>
          </div>
        ) : (
          <svg viewBox="0 0 640 480" className="w-full h-auto max-h-[480px]">
            <defs>
              {/* Arrow Markers */}
              <marker
                id="arrow-request"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
              </marker>

              <marker
                id="arrow-allocation"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>

              <marker
                id="arrow-cycle"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
              </marker>
            </defs>

            {/* Render Edges */}
            {edges.map((edge, idx) => {
              const start = nodePositions[edge.from];
              const end = nodePositions[edge.to];
              if (!start || !end) return null;

              const inCycle = isEdgeInCycle(edge.from, edge.to);
              const isRequest = edge.type === 'request';

              // Calculate edge start and end at node boundaries
              const dx = end.x - start.x;
              const dy = end.y - start.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const unitX = dx / dist;
              const unitY = dy / dist;

              const nodeRadius = 26;
              const sx = start.x + unitX * nodeRadius;
              const sy = start.y + unitY * nodeRadius;
              const ex = end.x - unitX * nodeRadius;
              const ey = end.y - unitY * nodeRadius;

              // Perpendicular vector for quadratic curve offset
              const nx = -unitY;
              const ny = unitX;
              const curveAmount = 25;
              const cx = (sx + ex) / 2 + nx * curveAmount;
              const cy = (sy + ey) / 2 + ny * curveAmount;

              return (
                <g key={idx} className="transition-all duration-300">
                  <path
                    d={`M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`}
                    fill="none"
                    stroke={
                      inCycle ? '#f43f5e' : isRequest ? '#f59e0b' : '#10b981'
                    }
                    strokeWidth={inCycle ? '3.5' : '2'}
                    strokeDasharray={isRequest && !inCycle ? '5,5' : 'none'}
                    markerEnd={`url(#${inCycle ? 'arrow-cycle' : isRequest ? 'arrow-request' : 'arrow-allocation'})`}
                    className={inCycle ? 'animate-pulse' : ''}
                  />

                  {/* Edge Delete Label */}
                  <text
                    x={cx}
                    y={cy - 6}
                    fill={inCycle ? '#f43f5e' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="cursor-pointer hover:fill-rose-400"
                    onClick={() => onRemoveEdge && onRemoveEdge(edge.from, edge.to)}
                  >
                    {isRequest ? 'req' : 'alloc'} ✕
                  </text>
                </g>
              );
            })}

            {/* Render Process Nodes (Circles) */}
            {processes.map((proc) => {
              const pos = nodePositions[proc.id];
              if (!pos) return null;
              const inCycle = isNodeInCycle(proc.id);

              return (
                <g
                  key={proc.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-all"
                  onClick={() => onNodeClick && onNodeClick(proc.id)}
                >
                  <circle
                    r="24"
                    fill={inCycle ? '#881337' : '#0891b2'}
                    stroke={inCycle ? '#f43f5e' : '#22d3ee'}
                    strokeWidth={inCycle ? '4' : '2'}
                    className={inCycle ? 'animate-pulse' : ''}
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {proc.id}
                  </text>
                </g>
              );
            })}

            {/* Render Resource Nodes (Rectangles) */}
            {resources.map((res) => {
              const pos = nodePositions[res.id];
              if (!pos) return null;
              const inCycle = isNodeInCycle(res.id);

              return (
                <g
                  key={res.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-all"
                  onClick={() => onNodeClick && onNodeClick(res.id)}
                >
                  <rect
                    x="-24"
                    y="-20"
                    width="48"
                    height="40"
                    rx="8"
                    fill={inCycle ? '#881337' : '#b45309'}
                    stroke={inCycle ? '#f43f5e' : '#fbbf24'}
                    strokeWidth={inCycle ? '4' : '2'}
                    className={inCycle ? 'animate-pulse' : ''}
                  />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {res.id}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
      </div>
    </div>
  );
}
