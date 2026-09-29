import React from 'react';
import { ArrowRight, Grid3X3, GitBranch, Layers, Network } from 'lucide-react';

/**
 * Safely parses tree from either node list objects or LeetCode level-order array (e.g. [1, null, 2, 3]).
 */
function parseBinaryTree(inputData) {
  if (!inputData) return null;
  const { value } = inputData;

  // Option A: Explicit node list [{ id: 1, val: 1, left: null, right: 2 }, ...]
  const nodeList = Array.isArray(inputData?.treeNodes)
    ? inputData.treeNodes
    : Array.isArray(value?.treeNodes)
    ? value.treeNodes
    : Array.isArray(inputData?.nodes) && typeof inputData.nodes[0] === 'object'
    ? inputData.nodes
    : Array.isArray(value?.nodes) && typeof value?.nodes[0] === 'object'
    ? value.nodes
    : null;

  if (nodeList && nodeList.length > 0) {
    const nodeMap = {};
    nodeList.forEach((n) => {
      nodeMap[n.id ?? n.val] = { val: n.val, left: null, right: null };
    });
    let root = null;
    nodeList.forEach((n) => {
      const curr = nodeMap[n.id ?? n.val];
      if (!root) root = curr;
      if (n.left !== null && n.left !== undefined) {
        curr.left = typeof n.left === 'object' ? n.left : nodeMap[n.left] || { val: n.left };
      }
      if (n.right !== null && n.right !== undefined) {
        curr.right = typeof n.right === 'object' ? n.right : nodeMap[n.right] || { val: n.right };
      }
    });
    return root;
  }

  // Option B: LeetCode Level-Order Array Serialization (e.g. [1, null, 2, 3])
  const arr = Array.isArray(value?.arrayForm)
    ? value.arrayForm
    : Array.isArray(inputData?.arrayForm)
    ? inputData.arrayForm
    : Array.isArray(value)
    ? value
    : Array.isArray(inputData?.nodes) && typeof inputData.nodes[0] !== 'object'
    ? inputData.nodes
    : [1, null, 2, 3];

  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return null;
  }

  const root = { val: arr[0], left: null, right: null };
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const curr = queue.shift();

    // Left child
    if (i < arr.length) {
      if (arr[i] !== null && arr[i] !== undefined) {
        curr.left = { val: arr[i], left: null, right: null };
        queue.push(curr.left);
      }
      i++;
    }

    // Right child
    if (i < arr.length) {
      if (arr[i] !== null && arr[i] !== undefined) {
        curr.right = { val: arr[i], left: null, right: null };
        queue.push(curr.right);
      }
      i++;
    }
  }

  return root;
}

/**
 * Traverses root tree structure and computes (x, y) coordinates & connecting lines for SVG rendering.
 */
function layoutTree(root) {
  if (!root) return { nodes: [], lines: [] };

  const nodes = [];
  const lines = [];

  function traverse(node, x, y, dx) {
    if (!node) return;
    nodes.push({ id: `node-${node.val}-${x}-${y}`, val: node.val, x, y });

    const nextY = y + 52;
    const nextDx = Math.max(dx * 0.55, 28);

    if (node.left) {
      const leftX = x - dx;
      lines.push({ id: `line-${node.val}-${node.left.val}`, x1: x, y1: y, x2: leftX, y2: nextY });
      traverse(node.left, leftX, nextY, nextDx);
    }
    if (node.right) {
      const rightX = x + dx;
      lines.push({ id: `line-${node.val}-${node.right.val}`, x1: x, y1: y, x2: rightX, y2: nextY });
      traverse(node.right, rightX, nextY, nextDx);
    }
  }

  traverse(root, 160, 36, 65);
  return { nodes, lines };
}

/**
 * Helper to build visual SVG nodes & line coordinates from level-order binary tree data.
 */
function renderBinaryTreeSVG(inputData) {
  const root = parseBinaryTree(inputData);
  if (!root) return null;

  const { nodes, lines } = layoutTree(root);

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 320 180"
        className="w-full max-w-[340px] h-auto text-slate-700 dark:text-slate-200"
        aria-label="Binary Tree Diagram"
      >
        {/* Connecting Edge Lines */}
        {lines.map((l) => (
          <line
            key={l.id}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-300 dark:text-slate-700"
          />
        ))}

        {/* Tree Nodes */}
        {nodes.map((n) => (
          <g key={n.id} className="cursor-default">
            <circle
              cx={n.x}
              cy={n.y}
              r="18"
              className="fill-white dark:fill-[#0F172A] stroke-blue-500 dark:stroke-blue-400 stroke-2 drop-shadow-xs"
            />
            <text
              x={n.x}
              y={n.y + 4}
              textAnchor="middle"
              className="fill-slate-900 dark:fill-white font-mono text-xs font-bold"
            >
              {n.val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Helper to build visual SVG graph layout.
 */
function renderGraphSVG(graphObj) {
  const adjacency = graphObj?.adjacency || {};
  const nodes = Object.keys(adjacency);
  if (nodes.length === 0) return null;

  // Pre-calculated node coordinates for 4-node graph
  const posMap = {
    '0': { x: 70,  y: 40 },
    '1': { x: 230, y: 40 },
    '2': { x: 70,  y: 120 },
    '3': { x: 230, y: 120 },
  };

  const edges = [];
  const added = new Set();

  Object.entries(adjacency).forEach(([u, neighbors]) => {
    neighbors.forEach((v) => {
      const edgeKey = [u, v].sort().join('-');
      if (!added.has(edgeKey)) {
        added.add(edgeKey);
        if (posMap[u] && posMap[v]) {
          edges.push({ u, v, x1: posMap[u].x, y1: posMap[u].y, x2: posMap[v].x, y2: posMap[v].y });
        }
      }
    });
  });

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 300 160"
        className="w-full max-w-[320px] h-auto"
        aria-label="Graph structure visual diagram"
      >
        {/* Graph Edges */}
        {edges.map((e, idx) => (
          <line
            key={idx}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-300 dark:text-slate-700"
          />
        ))}

        {/* Graph Nodes */}
        {Object.entries(posMap).map(([nodeId, pos]) => {
          const isStart = String(graphObj?.start) === nodeId;
          const isDest = String(graphObj?.destination) === nodeId;

          return (
            <g key={nodeId}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                className={`stroke-2 drop-shadow-xs ${
                  isStart
                    ? 'fill-indigo-50 dark:fill-indigo-950 stroke-indigo-500'
                    : isDest
                    ? 'fill-emerald-50 dark:fill-emerald-950 stroke-emerald-500'
                    : 'fill-white dark:fill-[#0F172A] stroke-slate-400 dark:stroke-slate-600'
                }`}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className={`font-mono text-xs font-bold ${
                  isStart
                    ? 'fill-indigo-600 dark:fill-indigo-300'
                    : isDest
                    ? 'fill-emerald-600 dark:fill-emerald-300'
                    : 'fill-slate-900 dark:fill-white'
                }`}
              >
                {nodeId}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Generic Input Data Renderer for Understanding Stage.
 * Renders structured input data cleanly for any of the 10 DSA problem types.
 * Wrapped in React.memo for high performance and reduced re-renders.
 */
export const InputDataRenderer = React.memo(function InputDataRenderer({ inputData, label = 'INPUT DATA' }) {
  if (!inputData) return null;

  const { type, value, label: customLabel } = inputData;
  const displayLabel = customLabel || label;

  // Safe data extractors for any data structure configuration
  const arrayVal = Array.isArray(value?.array)
    ? value.array
    : Array.isArray(inputData.array)
    ? inputData.array
    : Array.isArray(value)
    ? value
    : [];

  const targetVal = value?.target ?? inputData.target;
  const strVal = typeof value === 'string' ? value : typeof inputData.value === 'string' ? inputData.value : '';
  const nodesList = Array.isArray(value) ? value : Array.isArray(inputData.nodes) ? inputData.nodes : value?.nodes || [];
  const treeArray = Array.isArray(value?.arrayForm)
    ? value.arrayForm
    : Array.isArray(inputData.arrayForm)
    ? inputData.arrayForm
    : Array.isArray(value)
    ? value
    : [1, null, 2, 3];

  const gridMatrix = Array.isArray(value) ? value : Array.isArray(inputData.grid) ? inputData.grid : value?.grid || [];
  const kVal = value?.k ?? inputData.k;
  const rangesList = Array.isArray(value) ? value : Array.isArray(inputData.ranges) ? inputData.ranges : value?.ranges || [];
  const graphObj = value?.adjacency ? value : inputData.adjacency ? inputData : { adjacency: {} };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-900/40">
          INPUT
        </span>
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          {type === 'matrix' ? `2D GRID · ${gridMatrix.length} × ${gridMatrix[0]?.length || 0}` : type === 'array_with_target' ? 'ARRAY (nums) & TARGET' : type === 'binary_tree' ? 'BINARY TREE DIAGRAM' : type === 'graph' ? 'GRAPH STRUCTURE' : displayLabel}
        </span>
      </div>

      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/70 dark:border-[#1E2638] text-xs font-mono">
        
        {/* TYPE 1: Array + Target */}
        {type === 'array_with_target' && (
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-[36px] text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                TARGET SUM
              </span>
              <div className="px-4 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-base font-bold shadow-xs">
                target = {targetVal}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 2: String */}
        {type === 'string' && (
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              STRING CHARACTERS
            </span>
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1">
              {strVal.split('').map((char, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-base font-bold shadow-xs flex flex-col items-center min-w-[36px]"
                >
                  <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                    {char === ' ' ? '␣' : char}
                  </span>
                  <span className="text-[9px] text-slate-400 font-normal mt-0.5">idx: {idx}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE 3: Linked List */}
        {type === 'linked_list' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                SINGLY LINKED LIST STRUCTURE
              </span>
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                HEAD ➔ NODES
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-2" aria-label="Singly linked list nodes">
              <span className="px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
                HEAD
              </span>
              <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />

              {nodesList.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-bold border border-blue-200 dark:border-blue-800">
                      {val}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">next</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                </React.Fragment>
              ))}

              <span className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-bold text-xs">
                null
              </span>
            </div>
          </div>
        )}

        {/* TYPE 4: Binary Tree */}
        {type === 'binary_tree' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                BINARY TREE DIAGRAM
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Level-order: <strong className="text-slate-700 dark:text-slate-300">[{treeArray.map(v => v === null ? 'null' : v).join(', ')}]</strong>
              </span>
            </div>

            {/* Visual SVG Diagram */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex justify-center">
              {renderBinaryTreeSVG(inputData)}
            </div>

            {/* Accessible Screen Reader Summary */}
            <div className="sr-only">
              Binary Tree with level-order values: {treeArray.map(v => v === null ? 'null' : v).join(', ')}
            </div>
          </div>
        )}

        {/* TYPE 5: 2D Matrix */}
        {type === 'matrix' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block flex items-center gap-1.5">
                <Grid3X3 className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                2D GRID MATRIX ({gridMatrix.length} Rows × {gridMatrix[0]?.length || 0} Cols)
              </span>

              <div className="flex items-center gap-3 text-[10px] font-mono">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">1 = Land</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-400" />
                  <span className="text-slate-400">0 = Water</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto py-1">
              <div className="inline-block p-3 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-1.5">
                {/* Column Headers */}
                <div className="flex items-center gap-1.5 ml-8">
                  {gridMatrix[0]?.map((_, cIdx) => (
                    <span key={cIdx} className="w-9 text-center text-[9px] font-mono text-slate-400">
                      c{cIdx}
                    </span>
                  ))}
                </div>

                {/* Grid Rows */}
                {gridMatrix.map((row, rIdx) => (
                  <div key={rIdx} className="flex items-center gap-1.5">
                    <span className="w-6 text-right text-[9px] font-mono text-slate-400 mr-1">
                      r{rIdx}
                    </span>
                    {row.map((cell, cIdx) => (
                      <div
                        key={cIdx}
                        aria-label={`Row ${rIdx}, Column ${cIdx}: value ${cell}`}
                        className={`w-9 h-9 rounded-lg border font-mono text-xs font-bold flex items-center justify-center transition-colors duration-150 ${
                          cell === '1'
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 6: Array with K */}
        {type === 'array_with_k' && (
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-[36px] text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                K RANK VALUE
              </span>
              <div className="px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-base font-bold shadow-xs">
                k = {kVal}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 7: Array with Window */}
        {type === 'array_with_window' && (
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-[36px] text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                WINDOW SIZE
              </span>
              <div className="px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-base font-bold shadow-xs">
                k = {kVal}
              </div>
            </div>
          </div>
        )}

        {/* TYPE 8: Intervals */}
        {type === 'intervals' && (
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
              INTERVAL RANGES
            </span>

            <div className="flex flex-wrap items-center gap-2.5">
              {rangesList.map((range, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0F172A] border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-sm font-bold shadow-xs flex items-center gap-2"
                >
                  <span className="text-xs text-slate-400 font-normal">Range #{idx + 1}:</span>
                  <span>[{range[0]}, {range[1]}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE 9: Graph */}
        {type === 'graph' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                GRAPH STRUCTURE & ADJACENCY MAP
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                Start: {graphObj.start} ➔ Destination: {graphObj.destination}
              </span>
            </div>

            {/* Visual SVG Graph */}
            <div className="p-3 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex justify-center">
              {renderGraphSVG(graphObj)}
            </div>

            {/* Accessible Adjacency Text Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(graphObj.adjacency || {}).map(([node, neighbors]) => (
                <div
                  key={node}
                  className="p-2.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400">Node {node}</span>
                  <span className="text-slate-400">Connected ➔ [{neighbors.join(', ')}]</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE 10 / DEFAULT FALLBACK: Generic Primitive or Array */}
        {!['array_with_target', 'string', 'linked_list', 'binary_tree', 'matrix', 'array_with_k', 'array_with_window', 'intervals', 'graph'].includes(type) && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs whitespace-pre-wrap">
            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
          </div>
        )}
      </div>
    </div>
  );
});
