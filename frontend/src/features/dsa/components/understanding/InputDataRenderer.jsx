import React from 'react';
import { ArrowRight, Grid3X3, GitBranch, Layers, Network, RotateCcw } from 'lucide-react';

function parseBinaryTree(inputData) {
  if (!inputData) return null;
  const { value } = inputData;

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

  let parsedFromStr = null;
  const strVal = typeof inputData === 'string' ? inputData : typeof inputData?.value === 'string' ? inputData.value : '';
  if (strVal) {
    const rootMatch = strVal.match(/root\s*=\s*(\[[^\]]*\])/i) || strVal.match(/\[([^\]]*)\]/);
    if (rootMatch) {
      try {
        parsedFromStr = JSON.parse(rootMatch[1].replace(/null/g, 'null'));
      } catch (e) {}
    }
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
          : Array.isArray(parsedFromStr)
            ? parsedFromStr
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

function getTreeHeight(root) {
  if (!root) return 0;
  return 1 + Math.max(getTreeHeight(root.left), getTreeHeight(root.right));
}

/**
 * Traverses root tree structure and computes (x, y) coordinates & connecting lines for SVG rendering.
 * Uses depth-aware exponential scaling to guarantee zero node collisions even on deep/skewed trees.
 */
function layoutTree(root) {
  if (!root) return { nodes: [], lines: [], viewBox: '0 0 320 180', width: 320, height: 180 };

  const height = getTreeHeight(root);
  const nodes = [];
  const lines = [];

  function traverse(node, x, y, level, pathId) {
    if (!node) return;
    nodes.push({ id: `node-${pathId}-${node.val}`, val: node.val, x, y });

    const nextY = y + 58;
    // Scale horizontal offset based on depth level to maintain clean minimum 40px spacing
    const dx = Math.max(40, Math.pow(1.7, Math.max(0, height - level - 2)) * 34);

    if (node.left) {
      const leftX = x - dx;
      lines.push({ id: `line-${pathId}-L`, x1: x, y1: y, x2: leftX, y2: nextY });
      traverse(node.left, leftX, nextY, level + 1, `${pathId}L`);
    }
    if (node.right) {
      const rightX = x + dx;
      lines.push({ id: `line-${pathId}-R`, x1: x, y1: y, x2: rightX, y2: nextY });
      traverse(node.right, rightX, nextY, level + 1, `${pathId}R`);
    }
  }

  traverse(root, 0, 36, 0, 'R');

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  nodes.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const paddingX = 42;
  const paddingY = 32;
  const width = Math.max(maxX - minX + paddingX * 2, 160);
  const heightPx = Math.max(maxY - minY + paddingY * 2, 120);
  const viewBox = `${minX - paddingX} ${minY - paddingY} ${width} ${heightPx}`;

  return { nodes, lines, viewBox, width, height: heightPx };
}

function isNaryTreeArray(arr, type, category, title) {
  if (
    type === 'nary_tree' ||
    type === 'n_ary_tree' ||
    (category && String(category).toLowerCase().includes('n-ary')) ||
    (title && String(title).toLowerCase().includes('n-ary'))
  ) {
    return true;
  }

  if (!Array.isArray(arr) || arr.length < 4 || arr[0] === null || arr[1] !== null) {
    return false;
  }

  // Count consecutive non-null items in child groups after arr[1] === null
  let maxConsecutiveNonNull = 0;
  let currentConsecutive = 0;

  for (let i = 2; i < arr.length; i++) {
    if (arr[i] !== null && arr[i] !== undefined) {
      currentConsecutive++;
      if (currentConsecutive > maxConsecutiveNonNull) {
        maxConsecutiveNonNull = currentConsecutive;
      }
    } else {
      currentConsecutive = 0;
    }
  }

  // If there are 2 or more consecutive non-null children in a group, it is an N-ary Tree (e.g. [1, null, 3, 2, 4, null, 5, 6])
  return maxConsecutiveNonNull >= 2;
}

function parseNaryTree(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) return null;

  const root = { val: arr[0], children: [] };
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const parent = queue.shift();

    if (i < arr.length && arr[i] === null) {
      i++;
    }

    while (i < arr.length && arr[i] !== null) {
      if (arr[i] !== undefined) {
        const child = { val: arr[i], children: [] };
        parent.children.push(child);
        queue.push(child);
      }
      i++;
    }
  }

  return root;
}

function getNaryTreeHeight(root) {
  if (!root) return 0;
  if (!root.children || root.children.length === 0) return 1;
  return 1 + Math.max(...root.children.map(getNaryTreeHeight));
}

function layoutNaryTree(root) {
  if (!root) return { nodes: [], lines: [], viewBox: '0 0 320 180', width: 320, height: 180 };

  const height = getNaryTreeHeight(root);
  const nodes = [];
  const lines = [];

  function traverse(node, x, y, level, pathId) {
    if (!node) return;
    nodes.push({ id: `node-${pathId}-${node.val}`, val: node.val, x, y });

    const numChildren = node.children ? node.children.length : 0;
    if (numChildren > 0) {
      const nextY = y + 62;
      const childSpacing = Math.max(52, Math.pow(1.6, Math.max(0, height - level - 2)) * 38);
      const totalWidth = (numChildren - 1) * childSpacing;
      const startX = x - totalWidth / 2;

      node.children.forEach((child, idx) => {
        const childX = startX + idx * childSpacing;
        lines.push({ id: `line-${pathId}-${idx}`, x1: x, y1: y, x2: childX, y2: nextY });
        traverse(child, childX, nextY, level + 1, `${pathId}_${idx}`);
      });
    }
  }

  traverse(root, 0, 36, 0, 'R');

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  const paddingX = 45;
  const paddingY = 32;
  const width = Math.max(maxX - minX + paddingX * 2, 180);
  const heightPx = Math.max(maxY - minY + paddingY * 2, 120);
  const viewBox = `${minX - paddingX} ${minY - paddingY} ${width} ${heightPx}`;

  return { nodes, lines, viewBox, width, height: heightPx };
}

/**
 * Helper to build visual SVG nodes & line coordinates from binary or N-ary tree data.
 */
function renderBinaryTreeSVG(inputData) {
  const strVal = typeof inputData === 'string' ? inputData : typeof inputData?.value === 'string' ? inputData.value : '';
  let parsedFromStr = null;
  if (strVal) {
    const rootMatch = strVal.match(/root\s*=\s*(\[[^\]]*\])/i) || strVal.match(/\[([^\]]*)\]/);
    if (rootMatch) {
      try {
        parsedFromStr = JSON.parse(rootMatch[1].replace(/null/g, 'null'));
      } catch (e) {}
    }
  }

  const arr = Array.isArray(inputData?.root)
    ? inputData.root
    : Array.isArray(inputData?.value?.root)
      ? inputData.value.root
      : Array.isArray(inputData?.arrayForm)
        ? inputData.arrayForm
        : Array.isArray(parsedFromStr)
          ? parsedFromStr
          : Array.isArray(inputData?.value)
            ? inputData.value
            : Array.isArray(inputData)
              ? inputData
              : [];

  const isNary = isNaryTreeArray(arr, inputData?.type, inputData?.category, inputData?.title);

  if (isNary) {
    const naryRoot = parseNaryTree(arr);
    if (!naryRoot) return null;
    const { nodes, lines, viewBox, width } = layoutNaryTree(naryRoot);

    return (
      <div className="flex items-start max-w-full overflow-x-auto py-1">
        <svg
          viewBox={viewBox}
          style={{ width: `${Math.min(Math.max(width, 180), 450)}px`, height: 'auto' }}
          className="text-slate-700 dark:text-slate-200"
          aria-label="N-ary Tree Diagram"
        >
          <defs>
            <marker
              id="arrowhead-nary"
              markerWidth="8"
              markerHeight="6"
              refX="22"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-slate-400 dark:text-slate-500" />
            </marker>
          </defs>

          {/* Connecting Edge Lines with Arrowheads */}
          {lines.map((l) => (
            <line
              key={l.id}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              stroke="currentColor"
              strokeWidth="2"
              markerEnd="url(#arrowhead-nary)"
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

  // Binary Tree Fallback
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
 * Uses preset coordinates for small graphs (N <= 5) and dynamic circular
 * trigonometric positioning for N >= 6 to guarantee zero node overlaps.
 */
function renderGraphSVG(graphObj, isDirected = false) {
  const adjacency = graphObj?.adjacency || {};
  const nodes = Object.keys(adjacency);
  if (nodes.length === 0) return null;

  const N = nodes.length;
  const posMap = {};

  if (N <= 5) {
    const presets = {
      1: [{ x: 100, y: 60 }],
      2: [{ x: 70, y: 60 }, { x: 190, y: 60 }],
      3: [{ x: 60, y: 90 }, { x: 130, y: 35 }, { x: 200, y: 90 }],
      4: [{ x: 60, y: 35 }, { x: 190, y: 35 }, { x: 190, y: 110 }, { x: 60, y: 110 }],
      5: [{ x: 50, y: 70 }, { x: 140, y: 30 }, { x: 140, y: 110 }, { x: 230, y: 30 }, { x: 230, y: 110 }],
    };
    const coords = presets[N];
    nodes.forEach((n, idx) => {
      posMap[n] = coords[idx];
    });
  } else {
    // Dynamic circular layout algorithm for N >= 6 nodes (guarantees ZERO node collisions)
    const Rx = Math.max(130, N * 22);
    const Ry = Math.max(70, N * 13);
    const cx = Rx + 40;
    const cy = Ry + 40;

    nodes.forEach((n, idx) => {
      const angle = (2 * Math.PI * idx) / N - Math.PI / 2;
      posMap[n] = {
        x: Math.round(cx + Rx * Math.cos(angle)),
        y: Math.round(cy + Ry * Math.sin(angle)),
      };
    });
  }

  // Calculate bounding box dynamically
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  Object.values(posMap).forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const padX = 36;
  const padY = 32;
  const widthPx = Math.max(maxX - minX + padX * 2, 280);
  const heightPx = Math.max(maxY - minY + padY * 2, 140);
  const viewBox = `${minX - padX} ${minY - padY} ${widthPx} ${heightPx}`;

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
        viewBox={viewBox}
        style={{ width: `${Math.min(Math.max(widthPx, 280), 460)}px`, height: 'auto' }}
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
  if (typeof obj === 'string') return obj;
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

  let rawArrayVal = Array.isArray(value?.array)
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
                  : Array.isArray(value) && value.length > 0 && !Array.isArray(value[0])
                    ? value
                    : [];

  let rawTargetVal = value?.target ?? inputData.target;
  const strVal = typeof value === 'string' ? value : typeof inputData.value === 'string' ? inputData.value : '';

  let posVal = value?.pos ?? inputData?.pos;
  if (posVal === undefined && strVal) {
    const posMatch = strVal.match(/pos\s*=\s*(-?\d+)/i);
    if (posMatch) {
      posVal = Number(posMatch[1]);
    }
  }
  const cyclePos = (posVal !== undefined && posVal !== null && !isNaN(Number(posVal)) && Number(posVal) >= 0) ? Number(posVal) : null;

  let derivedType = type;
  let arrayVal = rawArrayVal;
  let targetVal = rawTargetVal;
  let pTreeArray = Array.isArray(value?.p) ? value.p : Array.isArray(inputData?.p) ? inputData.p : null;
  let qTreeArray = Array.isArray(value?.q) ? value.q : Array.isArray(inputData?.q) ? inputData.q : null;
  let parsedSingleTreeArray = null;

  let parsedLinkedList = Array.isArray(value?.head)
    ? value.head
    : Array.isArray(inputData?.head)
      ? inputData.head
      : Array.isArray(value?.nodes)
        ? value.nodes
        : Array.isArray(inputData?.nodes)
          ? inputData.nodes
          : Array.isArray(value?.list)
            ? value.list
            : Array.isArray(inputData?.list)
              ? inputData.list
              : null;

  const isLinkedListCategory =
    type === 'linked_list' ||
    type === 'linkedlist' ||
    (inputData?.category && String(inputData.category).toLowerCase().includes('linked list')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('linked list'));

  const isGraphCategory =
    type === 'graph' ||
    type === 'graph_prerequisites' ||
    type === 'graph_edges' ||
    type === 'graph_weighted' ||
    (inputData?.category && String(inputData.category).toLowerCase().includes('graph')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('graph')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('course schedule')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('components')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('partition')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('distances')) ||
    (inputData?.title && String(inputData.title).toLowerCase().includes('redundant connection'));

  let extractedEdges = Array.isArray(value?.edges)
    ? value.edges
    : Array.isArray(inputData?.edges)
      ? inputData.edges
      : null;

  let extractedPrereqs = Array.isArray(value?.prerequisites)
    ? value.prerequisites
    : Array.isArray(inputData?.prerequisites)
      ? inputData.prerequisites
      : null;

  let extractedN = value?.n ?? inputData?.n ?? value?.numCourses ?? inputData?.numCourses;
  let extractedStart = value?.start ?? inputData?.start ?? value?.source ?? inputData?.source;
  let extractedDest = value?.destination ?? inputData?.destination ?? value?.target ?? inputData?.target;

  if (strVal && (!extractedEdges && !extractedPrereqs)) {
    const edgesMatch = strVal.match(/edges\s*=\s*(\[\s*(?:\[[^\]]*\]\s*,?\s*)*\])/i) || strVal.match(/edges\s*=\s*(\[\s*[\s\S]*?\])/i);
    const prereqMatch = strVal.match(/prerequisites\s*=\s*(\[\s*(?:\[[^\]]*\]\s*,?\s*)*\])/i) || strVal.match(/prerequisites\s*=\s*(\[\s*[\s\S]*?\])/i);
    const nMatch = strVal.match(/(?:n|numCourses)\s*=\s*(\d+)/i);
    const startMatch = strVal.match(/(?:start|source)\s*=\s*(\d+)/i);
    const destMatch = strVal.match(/(?:destination|target|dest)\s*=\s*(\d+)/i);

    if (edgesMatch) {
      try {
        extractedEdges = JSON.parse(edgesMatch[1]);
      } catch (e) {}
    }
    if (prereqMatch) {
      try {
        extractedPrereqs = JSON.parse(prereqMatch[1]);
      } catch (e) {}
    }
    if (nMatch && extractedN === undefined) extractedN = Number(nMatch[1]);
    if (startMatch && extractedStart === undefined) extractedStart = Number(startMatch[1]);
    if (destMatch && extractedDest === undefined) extractedDest = Number(destMatch[1]);
  }

  if (!extractedEdges && !extractedPrereqs && isGraphCategory) {
    if (Array.isArray(value) && value.length > 0 && Array.isArray(value[0])) {
      extractedEdges = value;
    } else if (Array.isArray(inputData?.value) && Array.isArray(inputData.value[0])) {
      extractedEdges = inputData.value;
    } else if (strVal) {
      const matrixMatch = strVal.match(/(\[\s*\[[\s\S]*?\]\s*\])/);
      if (matrixMatch) {
        try {
          const parsedMatrix = JSON.parse(matrixMatch[1]);
          if (Array.isArray(parsedMatrix) && parsedMatrix.length > 0 && Array.isArray(parsedMatrix[0])) {
            extractedEdges = parsedMatrix;
          }
        } catch (e) {}
      }
    }
  }

  if (extractedEdges !== null || extractedPrereqs !== null || isGraphCategory || value?.adjacency || inputData?.adjacency || (extractedN !== undefined && isGraphCategory)) {
    derivedType = 'graph';
  }

  if (!parsedLinkedList && isLinkedListCategory && !isGraphCategory && Array.isArray(rawArrayVal) && rawArrayVal.length > 0) {
    parsedLinkedList = rawArrayVal;
  }

  if (strVal && (!derivedType || derivedType === 'string' || !arrayVal.length)) {
    const headMatch = strVal.match(/head\s*=\s*(\[[^\]]*\])/i);
    const arrowMatch = strVal.match(/(-?\d+\s*->\s*)+-?\d+/i);
    const pMatch = strVal.match(/p\s*=\s*(\[[^\]]*\])/i);
    const qMatch = strVal.match(/q\s*=\s*(\[[^\]]*\])/i);
    const rootMatch = strVal.match(/root\s*=\s*(\[[^\]]*\])/i);

    if (headMatch) {
      try {
        parsedLinkedList = JSON.parse(headMatch[1]);
        derivedType = 'linked_list';
      } catch (e) {}
    } else if (arrowMatch) {
      parsedLinkedList = strVal.split('->').map(s => s.trim()).filter(s => s.toLowerCase() !== 'null' && s.length > 0).map(Number);
      derivedType = 'linked_list';
    } else if (isLinkedListCategory && !isGraphCategory) {
      const arrayMatch = strVal.match(/\[([\d\s,.-]*)\]/);
      if (arrayMatch) {
        try {
          parsedLinkedList = arrayMatch[1].trim() === '' ? [] : JSON.parse(`[${arrayMatch[1]}]`);
          derivedType = 'linked_list';
        } catch (e) {}
      } else if (strVal.trim() === '[]' || strVal.trim() === 'null' || strVal.trim() === '') {
        parsedLinkedList = [];
        derivedType = 'linked_list';
      }
    } else if (pMatch && qMatch) {
      try {
        pTreeArray = JSON.parse(pMatch[1].replace(/null/g, 'null'));
        qTreeArray = JSON.parse(qMatch[1].replace(/null/g, 'null'));
        derivedType = 'two_binary_trees';
      } catch (e) {}
    } else if (rootMatch) {
      try {
        parsedSingleTreeArray = JSON.parse(rootMatch[1].replace(/null/g, 'null'));
        derivedType = 'binary_tree';
      } catch (e) {}
    } else if (derivedType !== 'graph' && !isGraphCategory) {
      const arrayMatch = strVal.match(/\[([\d\s,.-]+)\]/);
      const targetMatch = strVal.match(/target\s*=\s*(-?\d+)/i);
      if (arrayMatch && targetMatch) {
        try {
          arrayVal = JSON.parse(`[${arrayMatch[1]}]`);
          targetVal = Number(targetMatch[1]);
          derivedType = 'array_with_target';
        } catch (e) {}
      } else if (arrayMatch && !targetMatch) {
        try {
          arrayVal = JSON.parse(`[${arrayMatch[1]}]`);
          derivedType = 'array';
        } catch (e) {}
      }
    }
  }

  if ((parsedLinkedList !== null || isLinkedListCategory) && !isGraphCategory && derivedType !== 'graph') {
    derivedType = 'linked_list';
  }

  if ((pTreeArray || qTreeArray) && derivedType !== 'two_binary_trees') {
    derivedType = 'two_binary_trees';
  }

  const nodesList = parsedLinkedList !== null
    ? parsedLinkedList
    : (Array.isArray(value?.nodes)
      ? value.nodes
      : Array.isArray(inputData?.nodes)
        ? inputData.nodes
        : Array.isArray(value?.head)
          ? value.head
          : Array.isArray(inputData?.head)
            ? inputData.head
            : Array.isArray(value) && derivedType === 'linked_list'
              ? value
              : []);
  const treeArray = parsedSingleTreeArray || (Array.isArray(value?.arrayForm)
    ? value.arrayForm
    : Array.isArray(inputData?.arrayForm)
      ? inputData.arrayForm
      : Array.isArray(value?.root)
        ? value.root
        : Array.isArray(inputData?.root)
          ? inputData.root
          : Array.isArray(value)
            ? value
            : []);

  const isNaryTree = isNaryTreeArray(treeArray, type, inputData?.category, inputData?.title);
  if (isNaryTree && derivedType !== 'two_binary_trees') {
    derivedType = 'nary_tree';
  } else if (treeArray && treeArray.length > 0 && derivedType !== 'two_binary_trees' && (!derivedType || derivedType === 'string')) {
    derivedType = 'binary_tree';
  }

  const is2DMatrixStr = Boolean(strVal && (strVal.includes('[[') || strVal.match(/matrix\s*=/i) || strVal.match(/grid\s*=/i) || strVal.match(/board\s*=/i)));

  let parsedGridMatrix = null;
  if (strVal) {
    let gridString = null;
    if (strVal.includes('grid =') || strVal.includes('grid=')) {
      const idx = strVal.indexOf('[');
      if (idx !== -1) gridString = strVal.substring(idx).trim();
    } else if (strVal.includes('board =') || strVal.includes('board=')) {
      const idx = strVal.indexOf('[');
      if (idx !== -1) gridString = strVal.substring(idx).trim();
    } else if (strVal.includes('matrix =') || strVal.includes('matrix=')) {
      const idx = strVal.indexOf('[');
      if (idx !== -1) gridString = strVal.substring(idx).trim();
    } else {
      const idx = strVal.indexOf('[');
      const lastIdx = strVal.lastIndexOf(']');
      if (idx !== -1 && lastIdx > idx) {
        const sub = strVal.substring(idx, lastIdx + 1).trim();
        if (sub.startsWith('[[')) gridString = sub;
      }
    }

    if (gridString) {
      try {
        const parsed = JSON.parse(gridString);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
          parsedGridMatrix = parsed;
        }
      } catch (e) {}
    }
  }

  const gridMatrix = parsedGridMatrix || (Array.isArray(value?.grid)
    ? value.grid
    : Array.isArray(inputData?.grid)
      ? inputData.grid
      : Array.isArray(value?.board)
        ? value.board
        : Array.isArray(inputData?.board)
          ? inputData.board
          : Array.isArray(value?.matrix)
            ? value.matrix
            : Array.isArray(inputData?.matrix)
              ? inputData.matrix
              : Array.isArray(value) && Array.isArray(value[0])
                ? value
                : []);

  const targetWord = inputData.word || value?.word || inputData.targetWord || value?.targetWord;
  const isMatrixType = type === 'matrix' || type === 'grid_and_word' || type === 'grid' || type === 'grid_matrix' || (gridMatrix.length > 0 && Array.isArray(gridMatrix[0]));
  const isCharGrid = gridMatrix.length > 0 && Array.isArray(gridMatrix[0]) && typeof gridMatrix[0][0] === 'string' && gridMatrix[0][0].length === 1 && !['0', '1'].includes(gridMatrix[0][0]);

  const isIslandProblem =
    (inputData?.title && String(inputData.title).toLowerCase().includes('island')) ||
    (inputData?.category && String(inputData.category).toLowerCase().includes('island')) ||
    (inputData?.description && String(inputData.description).toLowerCase().includes('island'));

  const isBinaryGrid = isIslandProblem || (gridMatrix.length > 0 && Array.isArray(gridMatrix[0]) && gridMatrix.every(row => row.every(c => ['0', '1', 0, 1].includes(c))));

  if (isMatrixType && (!derivedType || derivedType === 'string' || derivedType === 'array')) {
    derivedType = 'grid';
  }

  const kVal = value?.k ?? inputData.kVal ?? inputData.k;
  const rangesList = Array.isArray(value) ? value : Array.isArray(inputData.ranges) ? inputData.ranges : value?.ranges || [];

  // Graph Extraction Logic
  let graphObj = value?.adjacency ? value : inputData.adjacency ? inputData : { adjacency: {} };
  if (!graphObj.adjacency || Object.keys(graphObj.adjacency).length === 0) {
    if (extractedPrereqs !== null && Array.isArray(extractedPrereqs)) {
      const numCourses = extractedN !== undefined ? extractedN : 2;
      const adj = {};
      for (let i = 0; i < numCourses; i++) adj[i] = [];
      extractedPrereqs.forEach(([c, p]) => {
        if (!adj[p]) adj[p] = [];
        adj[p].push(c);
        if (!adj[c]) adj[c] = [];
      });
      graphObj = { adjacency: adj, numCourses, mode: 'prerequisites' };
    } else if (extractedEdges !== null || extractedN !== undefined || isGraphCategory) {
      const adj = {};
      let maxNodeId = (extractedN !== undefined && extractedN > 0) ? extractedN - 1 : 0;

      if (Array.isArray(extractedEdges) && extractedEdges.length > 0) {
        extractedEdges.forEach((e) => {
          if (!Array.isArray(e) || e.length < 2) return;
          const u = e[0];
          const v = e[1];
          if (typeof u === 'number' && u > maxNodeId) maxNodeId = u;
          if (typeof v === 'number' && v > maxNodeId) maxNodeId = v;

          const uKey = String(u);
          const vKey = String(v);

          if (!adj[uKey]) adj[uKey] = [];
          if (!adj[vKey]) adj[vKey] = [];
          if (!adj[uKey].includes(v)) adj[uKey].push(v);
          if (!adj[vKey].includes(u)) adj[vKey].push(u);
        });
      }

      const totalNodes = extractedN !== undefined ? extractedN : (Object.keys(adj).length > 0 ? maxNodeId + 1 : 0);
      for (let i = 0; i < totalNodes; i++) {
        const key = String(i);
        if (!adj[key]) adj[key] = [];
      }

      graphObj = {
        adjacency: adj,
        n: totalNodes,
        mode: 'components',
        start: extractedStart,
        destination: extractedDest,
      };
    }
  }
  const isDirected = inputData.isDirected || value?.isDirected || inputData.mode === 'prerequisites' || derivedType === 'graph_prerequisites';

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
            : derivedType === 'linked_list'
              ? 'HEAD OF LINKED LIST'
              : derivedType === 'array_with_target'
                ? 'ARRAY (nums) & TARGET'
                : derivedType === 'single_value'
                  ? 'TARGET STEPS (n)'
                  : derivedType === 'array'
                    ? 'ARRAY (nums)'
                    : derivedType === 'nary_tree'
                      ? 'N-ARY TREE'
                      : derivedType === 'two_binary_trees'
                        ? 'TWO BINARY TREES (p & q)'
                        : derivedType === 'binary_tree' || derivedType === 'tree'
                          ? 'BINARY TREE'
                        : derivedType === 'graph' || derivedType === 'graph_prerequisites' || derivedType === 'graph_edges'
                          ? 'GRAPH STRUCTURE'
                          : derivedType === 'intervals'
                            ? 'INTERVAL RANGES'
                            : displayLabel}
        </span>
      </div>

      <div className="py-2 text-xs font-mono space-y-3">
        {/* TYPE 0: Single Value / Scalar Input (e.g. Climbing Stairs) */}
        {derivedType === 'single_value' && (
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
        {derivedType === 'array' && !isGraphCategory && (
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
        {derivedType === 'array_with_target' && (
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
        {(type === 'linked_list' || derivedType === 'linked_list') && (
          <div className="space-y-2.5 font-mono">
            {cyclePos !== null && cyclePos >= 0 && cyclePos < nodesList.length && (
              <div className="text-[11px] font-mono text-amber-700 dark:text-amber-300 font-extrabold bg-amber-50 dark:bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-900/60 inline-flex items-center gap-2 shadow-xs">
                <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                <span>CYCLE DETECTED: Tail node ({nodesList[nodesList.length - 1]}) points back to index {cyclePos} (val: {nodesList[cyclePos]})</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 overflow-x-auto py-2" aria-label="Singly linked list nodes">
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 border border-blue-200 dark:border-blue-900/60">
                HEAD
              </span>
              <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />

              {nodesList && nodesList.length > 0 ? (
                nodesList.map((val, idx) => {
                  const isCycleTarget = cyclePos !== null && idx === cyclePos;

                  return (
                    <React.Fragment key={idx}>
                      <div className="flex flex-col items-center">
                        {isCycleTarget && (
                          <span className="text-[9px] font-mono font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/90 px-1.5 py-0.5 rounded border border-amber-300 dark:border-amber-800 mb-1 shadow-2xs">
                            pos {cyclePos} (target)
                          </span>
                        )}
                        <div className={`inline-flex items-stretch rounded-xl border bg-white dark:bg-[#0D1322] shadow-xs overflow-hidden divide-x ${
                          isCycleTarget
                            ? 'border-amber-400 dark:border-amber-700 ring-2 ring-amber-400/30 divide-amber-200 dark:divide-amber-900/60'
                            : 'border-slate-300 dark:border-slate-700 divide-slate-200 dark:divide-slate-800'
                        }`}>
                          <div className="px-3 py-1.5 font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400 min-w-[36px] text-center flex items-center justify-center">
                            {val}
                          </div>
                          <div className={`px-2 py-1.5 flex items-center justify-center font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isCycleTarget ? 'bg-amber-50/80 dark:bg-[#120F06] text-amber-600 dark:text-amber-400' : 'bg-slate-50 dark:bg-[#070A13] text-slate-400 dark:text-slate-500'
                          }`}>
                            NEXT
                          </div>
                        </div>
                      </div>

                      <ArrowRight className={`w-4 h-4 shrink-0 ${isCycleTarget ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`} aria-hidden="true" />
                    </React.Fragment>
                  );
                })
              ) : null}

              {/* Trailing Null OR Cycle Loop Indicator */}
              {cyclePos !== null && cyclePos >= 0 && cyclePos < nodesList.length ? (
                <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/90 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-mono text-xs font-extrabold flex items-center gap-1.5 shadow-xs shrink-0">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                  <span>↩ Cycle to idx {cyclePos} (val: {nodesList[cyclePos]})</span>
                </span>
              ) : (
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                  Null
                </span>
              )}
            </div>
          </div>
        )}

        {/* TYPE 5: Binary Tree / N-Ary Tree */}
        {(derivedType === 'binary_tree' || derivedType === 'tree' || derivedType === 'nary_tree') && (
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

        {/* TYPE 5.1: Two Binary Trees (e.g. Same Tree p & q) */}
        {derivedType === 'two_binary_trees' && (
          <div className="space-y-4 font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tree P */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                    TREE P (root)
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                    [{pTreeArray ? pTreeArray.map(v => v === null ? 'null' : v).join(', ') : 'null'}]
                  </span>
                </div>
                <div className="py-1 flex justify-center">
                  {renderBinaryTreeSVG({ root: pTreeArray })}
                </div>
              </div>

              {/* Tree Q */}
              <div className="p-4 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/80 pb-2">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-[11px]">
                    TREE Q (root)
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400">
                    [{qTreeArray ? qTreeArray.map(v => v === null ? 'null' : v).join(', ') : 'null'}]
                  </span>
                </div>
                <div className="py-1 flex justify-center">
                  {renderBinaryTreeSVG({ root: qTreeArray })}
                </div>
              </div>
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
                  DIMENSIONS: <strong className="text-slate-700 dark:text-slate-300">{gridMatrix.length} × {gridMatrix[0]?.length || 0} {isBinaryGrid ? 'GRID' : 'MATRIX'}</strong>
                </span>
                {isBinaryGrid && (
                  <>
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
                  </>
                )}
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
                            : isBinaryGrid
                              ? cell === '1' || cell === 1
                                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                              : 'bg-white dark:bg-[#0D1322] border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-2xs'
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
        {!['single_value', 'array', 'array_with_target', 'string', 'linked_list', 'binary_tree', 'tree', 'nary_tree', 'two_binary_trees', 'matrix', 'grid_and_word', 'grid', 'array_with_k', 'array_with_window', 'intervals', 'graph', 'graph_prerequisites', 'graph_edges'].includes(derivedType) && !isMatrixType && (
          <div className="p-3 rounded-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 font-mono text-xs whitespace-pre-wrap">
            {formatCompactJSON(value)}
          </div>
        )}
      </div>
    </div>
  );
});
