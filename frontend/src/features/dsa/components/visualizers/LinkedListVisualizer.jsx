import React from 'react';
import { LinkedListNode } from './primitives/LinkedListNode';

/**
 * LinkedListVisualizer — Stage 09 Linked List Visualization Renderer
 * Used for pointer-manipulation problems like Reverse Linked List.
 * Visualizes nodes, pointer variables (PREV, CURR, NEXT, HEAD), and directional pointer edges.
 */
export function LinkedListVisualizer({ problem, step, state: passedState, highlights: passedHighlights }) {
  const state = passedState || step?.state || problem?.initialState?.primitives || problem?.initialState || {};
  const highlights = passedHighlights || step?.highlights || {};
  const description = step?.description;

  let rawNodes = Array.isArray(state.nodes)
    ? state.nodes
    : Array.isArray(state.list?.nodes)
    ? state.list.nodes
    : null;

  // Only fallback if rawNodes is strictly missing (null or undefined), NEVER when it is legitimately empty []
  if (rawNodes === null || rawNodes === undefined) {
    const fallbackVals =
      problem?.input?.head ||
      problem?.inputData?.head ||
      problem?.inputData?.nodes ||
      [1, 2, 3, 4, 5];
    if (Array.isArray(fallbackVals) && fallbackVals.length > 0) {
      rawNodes = fallbackVals.map((val, idx) => ({
        id: idx + 1,
        val: typeof val === 'object' && val !== null ? val.val ?? val.value : val,
        nextId: idx < fallbackVals.length - 1 ? idx + 2 : null,
      }));
    } else {
      rawNodes = [];
    }
  }

  const nodes = rawNodes || [];
  const prevId = state.prev ?? highlights.prev ?? null;
  const currId = state.curr ?? highlights.curr ?? (nodes.length > 0 && prevId === null ? nodes[0].id : null);
  const nextId = state.next ?? highlights.next ?? (nodes.length > 1 && prevId === null ? nodes[1].id : null);

  // Determine current Head node ID (when reversal is complete or prev is new head)
  const headId = state.result && state.result.length > 0
    ? state.result[0]
    : nodes.length > 0
    ? state.curr === null && state.prev !== null
      ? state.prev
      : nodes[0]?.id
    : null;

  const firstNode = nodes[0];
  const lastNode = nodes[nodes.length - 1];

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-2">
      {/* Top Pointer Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* PREV Pointer Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-3 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
            PREV POINTER
          </span>
          <span className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {prevId !== null ? `node(${prevId})` : 'null'}
          </span>
        </div>

        {/* CURR Pointer Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-blue-200 dark:border-blue-900/40 rounded-2xl p-3 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
            CURR POINTER
          </span>
          <span className="text-base font-mono font-bold text-blue-600 dark:text-blue-400 mt-1">
            {currId !== null ? `node(${currId})` : 'null'}
          </span>
        </div>

        {/* NEXT Pointer Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
            NEXT POINTER
          </span>
          <span className="text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {nextId !== null ? `node(${nextId})` : 'null'}
          </span>
        </div>

        {/* HEAD Pointer Card */}
        <div className="bg-white dark:bg-[#0B101D] border border-purple-200 dark:border-purple-900/40 rounded-2xl p-3 shadow-sm flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
            HEAD POINTER
          </span>
          <span className="text-base font-mono font-bold text-purple-600 dark:text-purple-400 mt-1">
            {headId !== null ? `node(${headId})` : 'null'}
          </span>
        </div>
      </div>

      {/* Main Linked List Node Container */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Singly Linked List Memory Visualizer
          </span>

          <span className="text-xs font-mono text-slate-400">
            Nodes: {nodes.length}
          </span>
        </div>

        {/* Horizontal Linked List Nodes & Directional Pointer Arrows */}
        <div className="min-h-[170px] bg-slate-50/60 dark:bg-[#070A12] border-2 border-dashed border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-6 sm:p-8 flex items-center justify-start sm:justify-center overflow-x-auto gap-2 transition-all duration-300">
          {nodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 font-mono">
                [ Empty Linked List: HEAD → null ]
              </span>
              <span className="text-xs text-slate-400 mt-1">
                The linked list contains 0 nodes. Head is null.
              </span>
            </div>
          ) : (
            <>
              {/* Left Boundary: If first node points to null (after reversal) */}
              {firstNode?.nextId === null && (
                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono text-xs font-bold">
                    null
                  </div>
                  <span className="text-rose-500 font-mono text-xl font-bold">←</span>
                </div>
              )}

              {/* Render Nodes and Inter-node Directed Edges */}
              {nodes.map((node, idx) => {
                const isPrev = prevId === node.id;
                const isCurr = currId === node.id;
                const isNext = nextId === node.id;
                const isHead = headId === node.id;

                const nextNode = nodes[idx + 1];

                // Determine edge direction between node and nextNode
                let edgeType = null; // 'forward' | 'reversed' | 'broken'
                if (nextNode) {
                  if (node.nextId === nextNode.id) {
                    edgeType = 'forward';
                  } else if (nextNode.nextId === node.id) {
                    edgeType = 'reversed';
                  } else {
                    edgeType = 'broken';
                  }
                }

                return (
                  <React.Fragment key={node.id}>
                    {/* Node Component */}
                    <LinkedListNode
                      id={node.id}
                      val={node.val}
                      isPrev={isPrev}
                      isCurr={isCurr}
                      isNext={isNext}
                      isHead={isHead}
                    />

                    {/* Inter-Node Arrow Edge */}
                    {edgeType === 'forward' && (
                      <div className="flex flex-col items-center px-1 text-slate-400 font-bold shrink-0">
                        <span className="text-xl sm:text-2xl font-mono leading-none">→</span>
                      </div>
                    )}

                    {edgeType === 'reversed' && (
                      <div className="flex flex-col items-center px-1 text-rose-500 dark:text-rose-400 font-bold shrink-0 animate-pulse">
                        <span className="text-xl sm:text-2xl font-mono leading-none">←</span>
                        <span className="text-[9px] uppercase font-mono tracking-tighter">reversed</span>
                      </div>
                    )}

                    {edgeType === 'broken' && (
                      <div className="flex flex-col items-center px-1 text-amber-500 font-bold shrink-0 opacity-60">
                        <span className="text-sm font-mono tracking-widest">···</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}

              {/* Right Boundary: If last node points to null (before reversal) */}
              {lastNode?.nextId === null && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-slate-400 font-mono text-xl font-bold">→</span>
                  <div className="px-2.5 py-1 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono text-xs font-bold">
                    null
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Operation Description Banner */}
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
