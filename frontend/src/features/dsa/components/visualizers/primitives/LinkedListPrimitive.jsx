import React from 'react';
import { LinkedListNode } from './LinkedListNode';

/**
 * LinkedListPrimitive — Reusable Linked List Primitive Component
 * Presentational renderer for Singly / Doubly Linked List states.
 * Renders node elements, directional pointer arrows, and pointer badges (HEAD, PREV, CURR, NEXT, TAIL).
 */
export function LinkedListPrimitive({
  nodes = [],
  currId = null,
  prevId = null,
  nextId = null,
  headId = null,
  tailId = null,
  highlightedIds = [],
  reversedEdges = [],
  className = '',
}) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return (
      <div
        aria-label="Linked list NULL state"
        className={`flex items-center justify-center gap-3 py-6 font-mono text-sm ${className}`}
      >
        <span className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
          HEAD
        </span>
        <span className="text-slate-500">→</span>
        <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-bold">
          NULL
        </span>
      </div>
    );
  }

  const highlightSet = new Set(highlightedIds);
  const reversedSet = new Set(reversedEdges.map((e) => (typeof e === 'string' ? e : `${e[0]}-${e[1]}`)));

  return (
    <div
      aria-label="Linked list elements"
      className={`flex items-center justify-start sm:justify-center gap-2 overflow-x-auto py-4 px-2 ${className}`}
    >
      {/* HEAD label indicator if first node is head */}
      <div className="flex flex-col items-center gap-1 shrink-0 mr-1">
        <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300">
          HEAD
        </span>
        <span className="text-purple-400 font-bold">↓</span>
      </div>

      {nodes.map((node, index) => {
        const id = node.id !== undefined ? node.id : index;
        const isCurr = currId === id;
        const isPrev = prevId === id;
        const isNext = nextId === id;
        const isHead = headId === id || (headId === null && index === 0);
        const isTail = tailId === id || (tailId === null && index === nodes.length - 1);

        const isReversed = reversedSet.has(`${id}-${nodes[index + 1]?.id}`);

        return (
          <React.Fragment key={id}>
            <LinkedListNode
              id={id}
              val={node.val !== undefined ? node.val : node.value}
              isPrev={isPrev}
              isCurr={isCurr}
              isNext={isNext}
              isHead={isHead && index !== 0}
              isHighlighted={highlightSet.has(id)}
            />

            {/* Connection Arrow */}
            {index < nodes.length - 1 ? (
              <div className="flex flex-col items-center px-1 shrink-0 pt-6">
                <span
                  className={`text-lg font-bold transition-all duration-300 ${
                    isReversed
                      ? 'text-rose-400 rotate-180 scale-125'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isReversed ? '←' : '→'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-1 shrink-0 pt-6">
                <span className="text-slate-400 dark:text-slate-500 font-bold text-lg">→</span>
                <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-800 border border-slate-700 text-slate-400">
                  NULL
                </span>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
