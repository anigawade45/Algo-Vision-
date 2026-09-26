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
  const arr = Array.isArray(value?.root)
    ? value.root
    : Array.isArray(inputData?.root)
      ? inputData.root
      : Array.isArray(value?.arrayForm)
        ? value.arrayForm
        : Array.isArray(inputData?.arrayForm)
          ? inputData.arrayForm
          : Array.isArray(value)
            ? value
            : Array.isArray(inputData?.nodes) && typeof inputData.nodes[0] !== 'object'
              ? inputData.nodes
              : [];

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
  if (!root) return { nodes: [], lines: [], viewBox: '0 0 320 180', width: 320, height: 180 };

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

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const paddingX = 35;
  const paddingY = 30;
  const width = Math.max(maxX - minX + paddingX * 2, 140);
  const height = Math.max(maxY - minY + paddingY * 2, 100);
  const viewBox = `${minX - paddingX} ${minY - paddingY} ${width} ${height}`;

  return { nodes, lines, viewBox, width, height };
}

/**
 * Helper to build visual SVG nodes & line coordinates from level-order binary tree data.
 */
function renderBinaryTreeSVG(inputData) {
  const root = parseBinaryTree(inputData);
  if (!root) return null;

  const { nodes, lines, viewBox, width } = layoutTree(root);

  return (
    <div className="flex items-start max-w-full overflow-x-auto py-1">
      <svg
        viewBox={viewBox}
        style={{ width: `${Math.min(Math.max(width, 180), 420)}px`, height: 'auto' }}
        className="text-slate-700 dark:text-slate-200"
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
function renderGraphSVG(graphObj, isDirected = false) {
  const adjacency = graphObj?.adjacency || {};
  const nodes = Object.keys(adjacency);
  if (nodes.length === 0) return null;

  // Pre-calculated node coordinates for up to 5 nodes
  const defaultPosMap = {
    '0': { x: 50, y: 50 },
    '1': { x: 150, y: 30 },
    '2': { x: 150, y: 110 },
    '3': { x: 250, y: 110 },
    '4': { x: 250, y: 30 },
  };

  const posMap = {};
  nodes.forEach((n, idx) => {
    posMap[n] = defaultPosMap[n] || {
      x: 50 + (idx % 3) * 90,
      y: 40 + Math.floor(idx / 3) * 70,
    };
  });

  const edges = [];
  const added = new Set();

  Object.entries(adjacency).forEach(([u, neighbors]) => {
    neighbors.forEach((v) => {
      const vStr = String(v);
      const edgeKey = isDirected ? `${u}->${vStr}` : [u, vStr].sort().join('-');
      if (!added.has(edgeKey)) {
        added.add(edgeKey);
        if (posMap[u] && posMap[vStr]) {
          edges.push({ u, v: vStr, x1: posMap[u].x, y1: posMap[u].y, x2: posMap[vStr].x, y2: posMap[vStr].y });
        }
      }
    });
  });

  const hasStartDest = graphObj?.start !== undefined && graphObj?.destination !== undefined;

  return (
    <div className="flex items-start max-w-full overflow-x-auto py-1">
      <svg
        viewBox="20 10 280 130"
        style={{ width: '310px', height: 'auto' }}
        className="text-slate-700 dark:text-slate-200"
        aria-label="Graph structure visual diagram"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="22"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
          </marker>
        </defs>

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
            markerEnd={isDirected ? "url(#arrowhead)" : undefined}
            className="text-slate-300 dark:text-slate-700"
          />
        ))}

        {/* Graph Nodes */}
        {Object.entries(posMap).map(([nodeId, pos]) => {
          const isStart = hasStartDest && String(graphObj?.start) === nodeId;
          const isDest = hasStartDest && String(graphObj?.destination) === nodeId;

          return (
            <g key={nodeId}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="18"
                className={`stroke-2 drop-shadow-xs ${
                  isStart
                    ? 'fill-indigo-50 dark:fill-indigo-950 stroke-indigo-500'
                    : isDest
                      ? 'fill-emerald-50 dark:fill-emerald-950 stroke-emerald-500'
                      : 'fill-white dark:fill-[#0F172A] stroke-blue-500 dark:stroke-blue-400'
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
 * Custom JSON formatter that formats 1D primitive arrays on single lines
 * and 2D matrices with one compact row per line.
 */
function formatCompactJSON(obj) {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);

  const stringifyHelper = (val, level = 0) => {
    const pad = '  '.repeat(level);
    if (val === null || val === undefined || typeof val !== 'object') {
      return JSON.stringify(val);
    }
    if (Array.isArray(val)) {
      if (val.length === 0) return '[]';
      const is1DPrimitive = val.every((x) => x === null || typeof x !== 'object');
      if (is1DPrimitive) {
        return '[' + val.map((x) => JSON.stringify(x)).join(', ') + ']';
      }
      const is2DPrimitive = val.every((row) => Array.isArray(row) && row.every((x) => x === null || typeof x !== 'object'));
      if (is2DPrimitive) {
        const rows = val.map((row) => pad + '  [' + row.map((x) => JSON.stringify(x)).join(', ') + ']');
        return '[\n' + rows.join(',\n') + '\n' + pad + ']';
      }
      const items = val.map((item) => pad + '  ' + stringifyHelper(item, level + 1));
      return '[\n' + items.join(',\n') + '\n' + pad + ']';
    }
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    const entries = keys.map((key) => pad + '  ' + JSON.stringify(key) + ': ' + stringifyHelper(val[key], level + 1));
    return '{\n' + entries.join(',\n') + '\n' + pad + '}';
  };

  return stringifyHelper(obj, 0);
}

/**
 * Generic Input Data Renderer for Understanding Stage.
 * Renders structured input data cleanly for any of the 20 DSA problem types.
 * Wrapped in React.memo for high performance and reduced re-renders.
 */
export const InputDataRenderer = React.memo(function InputDataRenderer({ inputData, label = 'INPUT DATA' }) {
  if (!inputData) return null;

  const { type, value, label: customLabel } = inputData;
  const displayLabel = customLabel || label;

  // Safe data extractors for any data structure configuration
  const arrayVal = Array.isArray(value?.array)
    ? value.array
    : Array.isArray(inputData?.array)
      ? inputData.array
      : Array.isArray(value?.nums)
        ? value.nums
        : Array.isArray(inputData?.nums)
          ? inputData.nums
          : Array.isArray(value?.arr)
            ? value.arr
            : Array.isArray(inputData?.arr)
              ? inputData.arr
              : Array.isArray(value?.elements)
                ? value.elements
                : Array.isArray(inputData?.elements)
                  ? inputData.elements
                  : Array.isArray(value)
                    ? value
                    : [];

  const targetVal = value?.target ?? inputData.target;
  const strVal = typeof value === 'string' ? value : typeof inputData.value === 'string' ? inputData.value : '';
  const nodesList = Array.isArray(value?.nodes)
    ? value.nodes
    : Array.isArray(inputData?.nodes)
      ? inputData.nodes
      : Array.isArray(value?.head)
        ? value.head
        : Array.isArray(inputData?.head)
          ? inputData.head
          : Array.isArray(value)
            ? value
            : [];
  const treeArray = Array.isArray(value?.arrayForm)
    ? value.arrayForm
    : Array.isArray(inputData?.arrayForm)
      ? inputData.arrayForm
      : Array.isArray(value?.root)
        ? value.root
        : Array.isArray(inputData?.root)
          ? inputData.root
          : Array.isArray(value)
            ? value
            : [];

  const gridMatrix = Array.isArray(value?.grid)
    ? value.grid
    : Array.isArray(inputData?.grid)
      ? inputData.grid
      : Array.isArray(value?.board)
        ? value.board
        : Array.isArray(inputData?.board)
          ? inputData.board
          : Array.isArray(value) && Array.isArray(value[0])
            ? value
            : [];

  const targetWord = inputData.word || value?.word || inputData.targetWord || value?.targetWord;
  const isMatrixType = type === 'matrix' || type === 'grid_and_word' || type === 'grid' || (gridMatrix.length > 0 && Array.isArray(gridMatrix[0]));
  const isCharGrid = gridMatrix.length > 0 && Array.isArray(gridMatrix[0]) && typeof gridMatrix[0][0] === 'string' && gridMatrix[0][0].length === 1 && !['0', '1'].includes(gridMatrix[0][0]);

  const kVal = value?.k ?? inputData.kVal ?? inputData.k;
  const rangesList = Array.isArray(value) ? value : Array.isArray(inputData.ranges) ? inputData.ranges : value?.ranges || [];

  // Graph Extraction Logic
  let graphObj = value?.adjacency ? value : inputData.adjacency ? inputData : { adjacency: {} };
  if (!graphObj.adjacency || Object.keys(graphObj.adjacency).length === 0) {
    if (value?.prerequisites || inputData?.prerequisites) {
      const prereqs = value?.prerequisites || inputData?.prerequisites || [];
      const numCourses = value?.numCourses || inputData?.numCourses || 2;
      const adj = {};
      for (let i = 0; i < numCourses; i++) adj[i] = [];
      prereqs.forEach(([c, p]) => {
        if (!adj[p]) adj[p] = [];
        adj[p].push(c);
      });
      graphObj = { adjacency: adj, numCourses, mode: 'prerequisites' };
    } else if (value?.edges || inputData?.edges) {
      const edges = value?.edges || inputData?.edges || [];
      const n = value?.n || inputData?.n || 5;
      const adj = {};
      for (let i = 0; i < n; i++) adj[i] = [];
      edges.forEach(([u, v]) => {
        if (!adj[u]) adj[u] = [];
        if (!adj[v]) adj[v] = [];
        adj[u].push(v);
        adj[v].push(u);
      });
      graphObj = { adjacency: adj, n, mode: 'components' };
    }
  }
  const isDirected = inputData.isDirected || value?.isDirected || inputData.mode === 'prerequisites' || type === 'graph_prerequisites';

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
          INPUT:
        </span>
        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
          {isMatrixType
            ? isCharGrid
              ? `2D CHARACTER GRID · ${gridMatrix.length} × ${gridMatrix[0]?.length || 0}`
              : `2D GRID · ${gridMatrix.length} × ${gridMatrix[0]?.length || 0}`
            : type === 'array_with_target'
              ? 'ARRAY (nums) & TARGET'
              : type === 'single_value'
                ? 'TARGET STEPS (n)'
                : type === 'array'
                  ? 'ARRAY (nums)'
                  : type === 'binary_tree' || type === 'tree'
                    ? 'BINARY TREE'
                    : type === 'graph' || type === 'graph_prerequisites' || type === 'graph_edges'
                      ? 'GRAPH STRUCTURE'
                      : type === 'intervals'
                        ? 'INTERVAL RANGES'
                        : displayLabel}
        </span>
      </div>

      <div className="py-2 text-xs font-mono space-y-3">
        {/* TYPE 0: Single Value / Scalar Input (e.g. Climbing Stairs) */}
        {type === 'single_value' && (
          <div className="flex flex-wrap items-center gap-6 py-1 font-mono">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
                TARGET STEPS (n)
              </span>
              <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-base font-extrabold shadow-xs inline-block">
                n = {value?.n ?? inputData.n ?? String(value)}
              </div>
            </div>

            {(value?.allowedSteps || inputData.allowedSteps) && (
              <div className="space-y-1.5 border-l border-slate-200 dark:border-slate-800 pl-6">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
                  ALLOWED STEP STRIDES
                </span>
                <div className="flex items-center gap-2">
                  {(value?.allowedSteps || inputData.allowedSteps).map((step, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200 text-xs shadow-xs">
                      +{step} step{step > 1 ? 's' : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TYPE 1: Standard Array */}
        {type === 'array' && (
          <div className="space-y-1.5 font-mono">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
              ARRAY (nums)
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {arrayVal.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                  <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-9 text-center">
                    [{val}]
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TYPE 2: Array + Target */}
        {type === 'array_with_target' && (
          <div className="flex flex-wrap items-stretch gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-9 text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 uppercase font-bold block">
                TARGET SUM
              </span>
              <div className="mt-auto">
                <div className="px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-sm font-bold shadow-xs inline-block">
                  target = {targetVal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 3: String */}
        {type === 'string' && (
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-1 font-mono">
            {strVal.split('').map((char, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400 font-mono font-extrabold text-sm shadow-xs min-w-9 text-center">
                  {char === ' ' ? '␣' : char}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TYPE 4: Linked List */}
        {type === 'linked_list' && (
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-2" aria-label="Singly linked list nodes">
            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider">
              HEAD
            </span>
            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />

            {nodesList.map((val, idx) => (
              <React.Fragment key={idx}>
                {/* 2-Compartment Split Node Box ([ Val | next ]) */}
                <div className="inline-flex items-stretch rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1322] shadow-xs overflow-hidden divide-x divide-slate-200 dark:divide-slate-800">
                  <div className="px-3 py-1.5 font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400 min-w-9 text-center flex items-center justify-center">
                    {val}
                  </div>
                  <div className="px-2 py-1.5 bg-slate-50 dark:bg-[#070A13] flex items-center justify-center text-slate-400 dark:text-slate-500 font-mono text-[10px] font-bold uppercase tracking-tight">
                    next
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" aria-hidden="true" />
              </React.Fragment>
            ))}

            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Null
            </span>
          </div>
        )}

        {/* TYPE 5: Binary Tree / Tree */}
        {(type === 'binary_tree' || type === 'tree') && (
          <div className="space-y-3 font-mono">
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold">
                  ARRAY FORM (LEVEL-ORDER):
                </span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                  [{treeArray.map((v) => (v === null ? 'null' : v)).join(', ')}]
                </span>
              </div>

              {(kVal !== undefined || value?.k !== undefined) && (
                <div className="px-3.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-xs font-bold shadow-xs">
                  TARGET RANK: k = {kVal ?? value?.k}
                </div>
              )}
            </div>

            {/* Visual SVG Diagram - Open Canvas */}
            <div className="py-1">
              {renderBinaryTreeSVG(inputData)}
            </div>
          </div>
        )}

        {/* TYPE 6: 2D Matrix / Grid & Word */}
        {isMatrixType && (
          <div className="space-y-3">
            {isCharGrid ? (
              <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase">
                  DIMENSIONS: <strong className="text-slate-700 dark:text-slate-300">{gridMatrix.length} × {gridMatrix[0]?.length || 0} GRID</strong>
                </span>
                {targetWord && (
                  <div className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
                    TARGET WORD: "{targetWord}"
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono">
                <span className="text-slate-400 dark:text-slate-500 font-bold uppercase">
                  DIMENSIONS: <strong className="text-slate-700 dark:text-slate-300">{gridMatrix.length} × {gridMatrix[0]?.length || 0}</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">•</span>
                <div className="flex items-center gap-3">
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
            )}

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
                          isCharGrid
                            ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 shadow-xs'
                            : cell === '1'
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

            {isCharGrid && targetWord && (
              <div className="flex items-center gap-2 pt-1 font-mono">
                <span className="text-[10px] text-slate-400 font-bold uppercase">TARGET PATH SEARCH:</span>
                <div className="flex items-center gap-1">
                  {targetWord.split('').map((char, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TYPE 7: Array with K */}
        {type === 'array_with_k' && (
          <div className="flex flex-wrap items-stretch gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-9 text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 uppercase font-bold block">
                K RANK VALUE
              </span>
              <div className="mt-auto">
                <div className="px-3.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 font-mono text-sm font-bold shadow-xs inline-block">
                  k = {kVal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 8: Array with Window */}
        {type === 'array_with_window' && (
          <div className="flex flex-wrap items-stretch gap-6 sm:gap-8">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block">
                ARRAY (nums)
              </span>
              <div className="flex flex-wrap items-center gap-2 font-mono">
                {arrayVal.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                    <span className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-bold text-sm shadow-xs min-w-9 text-center">
                      [{val}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 sm:pl-6 sm:border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 uppercase font-bold block flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-blue-500" aria-hidden="true" />
                WINDOW SIZE
              </span>
              <div className="mt-auto">
                <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-sm font-bold shadow-xs inline-block">
                  k = {kVal}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TYPE 9: Intervals */}
        {type === 'intervals' && (
          <div className="flex flex-wrap items-center gap-2.5 font-mono py-1">
            {rangesList.map((range, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal mb-1">idx: {idx}</span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-[#0F172A] border border-indigo-200 dark:border-indigo-900/60 text-indigo-600 dark:text-indigo-400 font-mono font-extrabold text-xs shadow-xs">
                  [{range[0]}, {range[1]}]
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TYPE 10: Graph / Graph Prerequisites / Graph Edges */}
        {(type === 'graph' || type === 'graph_prerequisites' || type === 'graph_edges' || (graphObj.adjacency && Object.keys(graphObj.adjacency).length > 0)) && (
          <div className="space-y-3 font-mono">
            {graphObj.start !== undefined && graphObj.destination !== undefined ? (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold">
                  PATH SEARCH:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Start: {graphObj.start} ➔ Destination: {graphObj.destination}
                </span>
              </div>
            ) : inputData.mode === 'prerequisites' || type === 'graph_prerequisites' ? (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold">
                  DIRECTED DEPENDENCIES:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Courses: {graphObj.numCourses || Object.keys(graphObj.adjacency || {}).length}
                </span>
              </div>
            ) : inputData.mode === 'components' || type === 'graph_edges' ? (
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold">
                  UNDIRECTED GRAPH:
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  Total Nodes (n): {graphObj.n || Object.keys(graphObj.adjacency || {}).length}
                </span>
              </div>
            ) : null}

            {/* Visual SVG Graph - Open Canvas */}
            <div className="py-1">
              {renderGraphSVG(graphObj, isDirected)}
            </div>

            {/* Open Adjacency Map List */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">
                ADJACENCY MAP:
              </span>
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                {Object.entries(graphObj.adjacency || {}).map(([node, neighbors]) => (
                  <div key={node} className="space-y-0.5 border-l-2 border-slate-200 dark:border-slate-800 pl-2.5 py-0.5">
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-xs block">
                      Node {node}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block font-semibold">
                      ➔ [{neighbors.join(', ')}]
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT FALLBACK: Compact Formatted Primitive, Matrix or Object */}
        {!['single_value', 'array', 'array_with_target', 'string', 'linked_list', 'binary_tree', 'tree', 'matrix', 'grid_and_word', 'grid', 'array_with_k', 'array_with_window', 'intervals', 'graph', 'graph_prerequisites', 'graph_edges'].includes(type) && !isMatrixType && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs whitespace-pre-wrap">
            {formatCompactJSON(value)}
          </div>
        )}
      </div>
    </div>
  );
});
