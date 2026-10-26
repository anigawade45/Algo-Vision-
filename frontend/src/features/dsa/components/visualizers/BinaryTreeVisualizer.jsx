import React from 'react';
import { TreeNode } from './primitives/TreeNode';
import { PointerLabel } from './primitives/PointerLabel';

/**
 * BinaryTreeVisualizer — Stage 09 Binary Tree Visualization Renderer
 * Visualizes hierarchical Binary Tree traversal (Inorder: Left -> Root -> Right),
 * highlighting current node, visited nodes, stack state, and traversal result output.
 */
/**
 * Builds treeMap from a level-order array if state does not supply one directly
 */
function buildTreeFromLevelOrder(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return { rootId: null, rootVal: null, treeMap: {} };
  }

  const rootVal = typeof arr[0] === 'number' ? arr[0] : Number(arr[0]) || 0;
  const treeMap = {};
  let nodeIdCounter = 1;
  const rootNode = { id: nodeIdCounter++, val: rootVal, left: null, right: null };
  treeMap[rootNode.id] = rootNode;

  const queue = [rootNode];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const parent = queue.shift();

    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null && leftVal !== undefined) {
        const parsedVal = typeof leftVal === 'number' ? leftVal : Number(leftVal) || 0;
        const leftNode = { id: nodeIdCounter++, val: parsedVal, left: null, right: null };
        parent.left = leftNode.id;
        treeMap[leftNode.id] = leftNode;
        queue.push(leftNode);
      }
    }

    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null && rightVal !== undefined) {
        const parsedVal = typeof rightVal === 'number' ? rightVal : Number(rightVal) || 0;
        const rightNode = { id: nodeIdCounter++, val: parsedVal, left: null, right: null };
        parent.right = rightNode.id;
        treeMap[rightNode.id] = rightNode;
        queue.push(rightNode);
      }
    }
  }

  return { rootId: rootNode.id, rootVal, treeMap };
}

/**
 * Computes deterministic non-overlapping (x, y) coordinates for binary trees
 * using depth for y and inorder rank for x.
 */
function computeTreeLayout(treeMap, rootId) {
  if (!rootId || !treeMap || !treeMap[rootId]) {
    return { nodeCoords: {}, edges: [], totalNodes: 0 };
  }

  const depths = {};
  let maxDepth = 0;
  function getDepths(currId, depth) {
    if (!currId || !treeMap[currId]) return;
    depths[currId] = depth;
    if (depth > maxDepth) maxDepth = depth;
    getDepths(treeMap[currId].left, depth + 1);
    getDepths(treeMap[currId].right, depth + 1);
  }
  getDepths(rootId, 0);

  const inorderOrder = [];
  function inorderRank(currId) {
    if (!currId || !treeMap[currId]) return;
    inorderRank(treeMap[currId].left);
    inorderOrder.push(currId);
    inorderRank(treeMap[currId].right);
  }
  inorderRank(rootId);

  const total = inorderOrder.length;
  const nodeCoords = {};
  const edges = [];

  inorderOrder.forEach((id, rank) => {
    const depth = depths[id] || 0;
    const x = total === 1 ? 50 : 15 + (rank / (total - 1)) * 70;
    const y = maxDepth === 0 ? 50 : 18 + (depth / maxDepth) * 62;
    nodeCoords[id] = {
      x,
      y,
      val: treeMap[id].val,
      depth,
      id,
    };
  });

  Object.values(treeMap).forEach((node) => {
    if (node.left && treeMap[node.left]) {
      edges.push({ from: node.id, to: node.left });
    }
    if (node.right && treeMap[node.right]) {
      edges.push({ from: node.id, to: node.right });
    }
  });

  return { nodeCoords, edges, totalNodes: total };
}

export function BinaryTreeVisualizer({ problem, step, state: passedState, highlights: passedHighlights }) {
  const state = passedState || step?.state || problem?.initialState?.primitives || problem?.initialState || {};
  const highlights = passedHighlights || step?.highlights || {};
  const description = step?.description;

  // Extract tree structure from state or problem input
  let treeData = state.tree || problem?.initialState?.primitives?.tree || null;
  let treeMap = treeData?.treeMap || null;
  let rootId = treeData?.rootId || null;
  let rootVal = treeData?.root ?? state.root ?? null;

  if (!treeMap) {
    const rawRoot = problem?.input?.root ?? problem?.inputData?.root ?? [1, null, 2, 3];
    const built = buildTreeFromLevelOrder(rawRoot);
    treeMap = built.treeMap;
    rootId = built.rootId;
    rootVal = built.rootVal;
  }

  const { nodeCoords, edges, totalNodes } = React.useMemo(() => {
    return computeTreeLayout(treeMap, rootId);
  }, [treeMap, rootId]);

  const currentNodeVal = state.currentNode ?? state.curr ?? highlights.currentNode ?? null;
  const stack = Array.isArray(state.stack)
    ? state.stack
    : Array.isArray(state.stack?.items)
    ? state.stack.items
    : (highlights.stackNodes || []);
  const visited = Array.isArray(state.visited)
    ? state.visited
    : Array.isArray(state.result)
    ? state.result
    : Array.isArray(state.tree?.visitedNodes)
    ? state.tree.visitedNodes
    : (highlights.visitedNodes || []);
  const result = Array.isArray(state.result) ? state.result : [];
  const traversalOutput = result.length > 0 ? result : visited;

  const probId = (problem?.id || problem?.problemId || '').toLowerCase();
  const probTitle = (problem?.title || '').toLowerCase();

  const isMaxDepth =
    state.maxDepth !== undefined ||
    probId.includes('maximum-depth') ||
    probId.includes('max-depth') ||
    probTitle.includes('maximum depth') ||
    probTitle.includes('max depth') ||
    probId === '104';

  const isMinDepth =
    !isMaxDepth && (
      state.minDepth !== undefined ||
      probId.includes('minimum-depth') ||
      probId.includes('min-depth') ||
      probTitle.includes('minimum depth') ||
      probTitle.includes('min depth') ||
      probId === '111'
    );

  const displayDepth =
    isMaxDepth
      ? (state.maxDepth !== null && state.maxDepth !== undefined
          ? state.maxDepth
          : typeof state.result === 'number'
          ? state.result
          : typeof step?.state?.result === 'number'
          ? step.state.result
          : null)
      : (state.minDepth !== null && state.minDepth !== undefined
          ? state.minDepth
          : typeof state.result === 'number'
          ? state.result
          : typeof step?.state?.result === 'number'
          ? step.state.result
          : null);

  const displayPath =
    stack.length > 0
      ? stack
      : Array.isArray(state.longestPath) && state.longestPath.length > 0
      ? state.longestPath
      : Array.isArray(state.shortestPath) && state.shortestPath.length > 0
      ? state.shortestPath
      : Array.isArray(step?.state?.longestPath)
      ? step.state.longestPath
      : Array.isArray(step?.state?.shortestPath)
      ? step.state.shortestPath
      : [];

  const visitedSet = new Set(traversalOutput);
  const stackSet = new Set(stack);

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Banner & Strategy Legend */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">
            {isMaxDepth ? 'MAX DEPTH DFS' : isMinDepth ? 'MIN DEPTH DFS' : 'INORDER DFS'}
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {isMaxDepth ? (
              <>Search Target: <strong className="text-indigo-600 dark:text-indigo-400">Deepest Path / Subtree Height (Max Depth)</strong></>
            ) : isMinDepth ? (
              <>Search Target: <strong className="text-indigo-600 dark:text-indigo-400">Nearest Leaf Node (Min Depth)</strong></>
            ) : (
              <>Traversal Order: <strong className="text-indigo-600 dark:text-indigo-400">Left → Root → Right</strong></>
            )}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span> Current Node
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600"></span> Visited
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span> In Stack
          </span>
        </div>
      </div>

      {/* Main Canvas: Tree & Call Stack Split View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tree Container (Span 3 cols) */}
        <div className="md:col-span-3 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Binary Tree View
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              {isMaxDepth && (
                <span>Max Depth: <strong className="text-emerald-500 font-bold">{displayDepth !== null ? displayDepth : '—'}</strong></span>
              )}
              {isMinDepth && (
                <span>Min Depth: <strong className="text-emerald-500 font-bold">{displayDepth !== null ? displayDepth : '—'}</strong></span>
              )}
              <span>Nodes: <strong className="text-slate-700 dark:text-slate-200">{totalNodes}</strong></span>
              <span>Root: <strong className="text-indigo-600 dark:text-indigo-400">{rootVal !== null ? rootVal : 'null'}</strong></span>
            </div>
          </div>

          {/* Tree Graphics Area with SVG Line Connectors */}
          <div className="relative w-full max-w-lg h-[280px] sm:h-[320px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-4 transition-all duration-300">
            {totalNodes === 0 ? (
              <div className="h-full flex items-center justify-center font-mono text-xs text-slate-400 dark:text-slate-500">
                [ Empty Tree: root = null ]
              </div>
            ) : (
              <>
                {/* SVG Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700 stroke-[2.5] stroke-linecap-round">
                  {edges.map(({ from, to }, idx) => {
                    const p1 = nodeCoords[from];
                    const p2 = nodeCoords[to];
                    if (!p1 || !p2) return null;

                    const isTraversedEdge = visitedSet.has(p1.val) && visitedSet.has(p2.val);

                    return (
                      <line
                        key={idx}
                        x1={`${p1.x}%`}
                        y1={`${p1.y + 6}%`}
                        x2={`${p2.x}%`}
                        y2={`${p2.y + 4}%`}
                        className={
                          isTraversedEdge
                            ? 'stroke-emerald-500 stroke-[3.5] transition-all duration-300'
                            : 'transition-all duration-300'
                        }
                      />
                    );
                  })}
                </svg>

                {/* Dynamic Tree Node Components */}
                {Object.entries(nodeCoords).map(([nodeIdStr, pos]) => {
                  const val = pos.val;
                  const isCurrent = currentNodeVal === val;
                  const isVisited = visitedSet.has(val);
                  const isInStack = stackSet.has(val);
                  const isRoot = Number(nodeIdStr) === rootId;

                  let pointerLabel = null;
                  let pointerColor = 'blue';

                  if (isCurrent) {
                    pointerLabel = 'Current';
                    pointerColor = 'blue';
                  } else if (isInStack) {
                    pointerLabel = 'Stack';
                    pointerColor = 'indigo';
                  } else if (isVisited) {
                    pointerLabel = 'Visited';
                    pointerColor = 'emerald';
                  }

                  return (
                    <div
                      key={nodeIdStr}
                      style={{
                        position: 'absolute',
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -20%)',
                      }}
                    >
                      <TreeNode
                        value={val}
                        isRoot={isRoot}
                        isCurrent={isCurrent}
                        isVisited={isVisited}
                        isInStack={isInStack}
                        pointerLabel={pointerLabel}
                        pointerColor={pointerColor}
                      />
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Call Stack Side Panel (Span 1 col) */}
        <div className="md:col-span-1 bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                DFS Call Stack
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                [{stack.length}]
              </span>
            </div>

            <div className="flex flex-col-reverse gap-2 min-h-[140px] bg-slate-50/60 dark:bg-[#070A12] border border-indigo-100 dark:border-indigo-900/30 rounded-xl p-3 items-center justify-start">
              {stack.length === 0 ? (
                <span className="my-auto text-[11px] font-mono text-slate-400 dark:text-slate-600 text-center">
                  [ Stack Empty ]
                </span>
              ) : (
                stack.map((item, sIdx) => {
                  const isTop = sIdx === stack.length - 1;
                  return (
                    <div
                      key={sIdx}
                      className={`w-full py-1.5 px-3 rounded-lg border font-mono text-xs font-bold text-center flex items-center justify-between transition-all duration-200 ${
                        isTop
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                          : 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/50 text-indigo-900 dark:text-indigo-300'
                      }`}
                    >
                      <span>node({item})</span>
                      {isTop && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">TOP</span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-center">
            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
              LIFO Traversal Stack
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Traversal Result Accumulator / Depth Display */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {isMaxDepth
              ? 'Maximum Depth of Binary Tree'
              : isMinDepth
              ? 'Minimum Depth to Nearest Leaf Node'
              : 'Inorder Traversal Output Result'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {isMaxDepth || isMinDepth ? (
              <span>Inspected: {visited.length} / {totalNodes} nodes</span>
            ) : (
              <span>Visited: {traversalOutput.length} / {totalNodes} nodes</span>
            )}
          </span>
        </div>

        {(isMaxDepth || isMinDepth) ? (
          <div className="flex flex-wrap items-center gap-4 py-1">
            <div className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-sm font-bold flex items-center gap-2 shadow-xs">
              <span>{isMaxDepth ? 'Maximum Depth:' : 'Minimum Depth:'}</span>
              <span className="text-lg font-black text-emerald-500">
                {displayDepth !== null ? displayDepth : '—'}
              </span>
            </div>
            {state.currentDepth > 0 && (
              <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 font-mono text-xs flex items-center gap-2">
                <span>Current Path Depth:</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{state.currentDepth}</span>
              </div>
            )}
            {displayPath.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 overflow-x-auto py-1">
                <span>{stack.length > 0 ? 'Active Path:' : isMaxDepth ? 'Deepest Path:' : 'Shortest Path:'}</span>
                {displayPath.map((v, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {v}
                    </span>
                    {idx < displayPath.length - 1 && <span>→</span>}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {traversalOutput.length === 0 ? (
              <span className="text-xs font-mono text-slate-400 dark:text-slate-600 py-1">
                [ Traversal Output Empty: Waiting for first node visit... ]
              </span>
            ) : (
              traversalOutput.map((val, idx) => (
                <React.Fragment key={idx}>
                  <div className="px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-mono text-sm font-bold shadow-sm shadow-emerald-500/20 ring-2 ring-emerald-400 scale-105 transition-all duration-200 shrink-0">
                    {val}
                  </div>
                  {idx < traversalOutput.length - 1 && (
                    <span className="text-slate-400 font-mono font-bold">→</span>
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        )}
      </div>

      {/* Description Banner */}
      {description && (
        <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 rounded-xl p-3 text-center">
          <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
