import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/* ── shared cell ── */
function ACell({ value, index, highlight, color = 'blue', dimmed, pointer, pointerLabel, sublabel }) {
  const colors = {
    blue:   'bg-blue-600 text-white border-blue-600',
    green:  'bg-emerald-500 text-white border-emerald-500',
    amber:  'bg-amber-500 text-white border-amber-500',
    red:    'bg-red-500 text-white border-red-500',
    purple: 'bg-purple-600 text-white border-purple-600',
  };
  const on  = colors[color] || colors.blue;
  const off = dimmed
    ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600'
    : 'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200';
  const base = 'flex flex-col items-center justify-center min-w-[44px] h-12 rounded-lg border-2 font-mono font-bold text-sm transition-all duration-300';
  return (
    <div className="flex flex-col items-center gap-1">
      {pointer && (
        <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900/60 whitespace-nowrap">
          {pointerLabel || '↑'}
        </span>
      )}
      <div className={`${base} ${highlight ? on : off} ${highlight ? 'scale-105 shadow-sm' : ''}`}>
        {value}
        {sublabel && <span className="text-[9px] font-normal opacity-70 leading-none">{sublabel}</span>}
      </div>
      {index !== undefined && <span className="text-[9px] text-slate-400 font-mono">[{index}]</span>}
    </div>
  );
}

/* ── SLIDING WINDOW ── */
function SlidingWindowR({ step }) {
  const { array, ws, we, sum, best, entering, leaving } = step;
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 flex-wrap overflow-x-auto pb-1">
        {array.map((v, i) => {
          const inW = i >= ws && i <= we;
          return (
            <ACell key={i} value={v} index={i}
              highlight={inW}
              color={i === (entering ?? -1) ? 'green' : i === (leaving ?? -1) ? 'amber' : 'blue'}
              dimmed={!inW}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs font-mono">
        <span className="text-blue-700 dark:text-blue-300"><span className="text-slate-400">Window: </span><strong>[{array.slice(ws, we+1).join(', ')}]</strong></span>
        {sum !== undefined && <span><span className="text-slate-400">Sum: </span><strong>{sum}</strong></span>}
        {best !== undefined && <span className="text-emerald-700 dark:text-emerald-300"><span className="text-slate-400">Max: </span><strong>{best}</strong></span>}
      </div>
    </div>
  );
}

/* ── TWO POINTERS ── */
function TwoPointersR({ step }) {
  const { array, left, right, target } = step;
  const sum = array[left] + array[right];
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 flex-wrap overflow-x-auto pb-1">
        {array.map((v, i) => (
          <ACell key={i} value={v} index={i}
            highlight={i === left || i === right}
            color={i === left ? 'blue' : 'amber'}
            dimmed={i !== left && i !== right}
            pointer={i === left || i === right}
            pointerLabel={i === left ? 'L' : 'R'}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs font-mono">
        <span className="text-blue-700 dark:text-blue-300">L={array[left]}</span>
        <span className="text-amber-700 dark:text-amber-300">R={array[right]}</span>
        <span><strong>{array[left]} + {array[right]} = {sum}</strong></span>
        {target !== undefined && (
          <span className={`px-2 py-0.5 rounded font-bold border ${sum===target?'bg-emerald-50 dark:bg-emerald-950 border-emerald-400 text-emerald-700 dark:text-emerald-300':sum>target?'bg-amber-50 dark:bg-amber-950 border-amber-400 text-amber-700 dark:text-amber-300':'bg-blue-50 dark:bg-blue-950 border-blue-400 text-blue-700 dark:text-blue-300'}`}>
            {sum===target?'✓ Found!':sum>target?'Too big → move R left':'Too small → move L right'}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── STACK ── */
function StackR({ step }) {
  const { stack, op, operand } = step;
  return (
    <div className="flex items-end gap-6">
      <div className="flex flex-col-reverse gap-1 min-w-[80px]">
        {stack.length === 0 && (
          <div className="h-10 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 font-mono">EMPTY</div>
        )}
        {stack.map((item, i) => {
          const top = i === stack.length - 1;
          return (
            <div key={i} className={`relative h-11 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 px-4 ${top?'bg-blue-600 text-white border-blue-600 shadow-md':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
              {item}
              {top && <span className="absolute -right-12 text-[10px] font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">← TOP</span>}
            </div>
          );
        })}
        <div className="h-1 bg-slate-300 dark:bg-slate-700 rounded-full mt-1" />
        <span className="text-[10px] font-mono text-slate-400 text-center">STACK</span>
      </div>
      {op && (
        <span className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs uppercase ${op==='push'?'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800':'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'}`}>
          {op.toUpperCase()}{operand!=null?`(${operand})`:''}
        </span>
      )}
    </div>
  );
}

/* ── QUEUE (BFS) ── */
function QueueR({ step }) {
  const { queue, op, operand } = step;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {queue.length === 0 && (
          <div className="h-12 w-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs text-slate-400 font-mono">EMPTY QUEUE</div>
        )}
        {queue.map((item, i) => {
          const isFront = i === 0, isRear = i === queue.length - 1;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <span className={`text-[10px] font-bold font-mono ${isFront?'text-blue-600 dark:text-blue-400':isRear?'text-amber-600 dark:text-amber-400':'text-transparent'}`}>
                {isFront?'FRONT':isRear?'REAR':'.'}
              </span>
              <div className={`w-14 h-12 rounded-lg border-2 flex items-center justify-center font-mono font-bold text-sm ${isFront?'bg-blue-600 text-white border-blue-600':isRear?'bg-amber-500 text-white border-amber-500':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                {item}
              </div>
            </div>
          );
        })}
      </div>
      {op && (
        <span className={`inline-block px-3 py-1.5 rounded-lg font-mono font-bold text-xs ${op==='enqueue'?'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800':'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'}`}>
          {op==='enqueue'?`→ ${operand} joins`:`← ${operand} leaves`}
        </span>
      )}
    </div>
  );
}

/* ── LINKED LIST ── */
function LinkedListR({ step }) {
  const { nodes, highlight = [] } = step;
  return (
    <div className="flex items-center flex-wrap gap-0 overflow-x-auto pb-1">
      {nodes.map((n, i) => (
        <div key={n.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${highlight.includes(n.id)?'bg-blue-600 text-white border-blue-600 shadow-md scale-105':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
              {n.val}
            </div>
            {n.label && <span className="text-[9px] font-mono text-slate-400 mt-0.5">{n.label}</span>}
          </div>
          {i < nodes.length - 1 && <span className="mx-1 text-slate-400 font-mono text-lg">→</span>}
        </div>
      ))}
      <span className="ml-2 text-[10px] font-mono text-slate-400">null</span>
    </div>
  );
}

/* ── TREE ── */
function TreeR({ step }) {
  const { rows, highlight = [], traversal = [] } = step;
  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center gap-2">
        {rows.map((row, ri) => (
          <div key={ri} className="flex gap-4 items-center">
            {row.map((n, ci) =>
              n === null ? (
                <div key={ci} className="w-10 h-10 opacity-0" />
              ) : (
                <div key={ci} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${highlight.includes(n.id)?'bg-blue-600 text-white border-blue-600 shadow-md scale-110':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                  {n.val}
                </div>
              )
            )}
          </div>
        ))}
      </div>
      {traversal.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-slate-400">Visited:</span>
          {traversal.map((v, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-300 font-bold">{v}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── GRAPH BFS ── */
function GraphR({ step }) {
  const { nodes, visited = [], current, bfsQ = [] } = step;
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {nodes.map((n) => (
          <div key={n.id} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${current===n.id?'bg-blue-600 text-white border-blue-600 shadow-md scale-110 ring-2 ring-blue-400/40':visited.includes(n.id)?'bg-emerald-500 text-white border-emerald-500':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
              {n.label}
            </div>
            <span className="text-[9px] font-mono text-slate-400">{visited.includes(n.id)?'✓':current===n.id?'→':''}</span>
          </div>
        ))}
      </div>
      {bfsQ.length > 0 && (
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Queue:</span>
          {bfsQ.map((item, i) => (
            <span key={i} className={`px-2 py-0.5 rounded font-bold border ${i===0?'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}>{item}</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── BINARY SEARCH ── */
function BinarySearchR({ step }) {
  const { array, low, mid, high, target } = step;
  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2 flex-wrap overflow-x-auto pb-1">
        {array.map((v, i) => {
          const out = i < low || i > high;
          const isMid = i === mid, isLow = i === low, isHigh = i === high;
          return (
            <ACell key={i} value={v} index={i}
              highlight={isMid || (!out && (isLow || isHigh))}
              color={isMid ? 'amber' : 'blue'}
              dimmed={out}
              pointer={isMid || isLow || isHigh}
              pointerLabel={isMid ? 'MID' : isLow ? 'LOW' : 'HIGH'}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs font-mono">
        <span>LOW={low}</span>
        <span className="text-amber-700 dark:text-amber-300 font-bold">MID={mid}→{array[mid]}</span>
        <span>HIGH={high}</span>
        {target !== undefined && <span className="text-blue-700 dark:text-blue-300">TARGET={target}</span>}
      </div>
    </div>
  );
}

/* ── DP TABLE ── */
function DPTableR({ step }) {
  const { table, highlight = [], rowLabels, colLabels } = step;
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-xs font-mono">
        {colLabels && (
          <thead>
            <tr>
              {rowLabels && <th className="w-8" />}
              {colLabels.map((l, i) => <th key={i} className="px-3 py-1 text-slate-400 font-normal text-center border border-slate-200 dark:border-slate-700">{l}</th>)}
            </tr>
          </thead>
        )}
        <tbody>
          {table.map((row, ri) => (
            <tr key={ri}>
              {rowLabels && <td className="px-2 py-1 text-slate-400 font-normal border border-slate-200 dark:border-slate-700 text-center">{rowLabels[ri]}</td>}
              {row.map((cell, ci) => {
                const hl = highlight.some(([r, c]) => r === ri && c === ci);
                return (
                  <td key={ci} className={`px-3 py-1.5 border text-center font-bold transition-all duration-300 ${hl?'bg-blue-600 text-white border-blue-600':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'}`}>
                    {cell ?? ''}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── GRID ── */
function GridR({ step }) {
  const { grid, highlight = [], visited = [] } = step;
  return (
    <div className="inline-flex flex-col gap-0.5 overflow-x-auto">
      {grid.map((row, ri) => (
        <div key={ri} className="flex gap-0.5">
          {row.map((cell, ci) => {
            const hl = highlight.some(([r, c]) => r === ri && c === ci);
            const vis = visited.some(([r, c]) => r === ri && c === ci);
            const land = cell === '1' || cell === 1;
            return (
              <div key={ci} className={`w-10 h-10 rounded-md border flex items-center justify-center font-mono font-bold text-xs transition-all duration-300 ${hl?'bg-blue-600 text-white border-blue-600 shadow-sm scale-105':vis?'bg-emerald-500 text-white border-emerald-500':land?'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800':'bg-slate-100 dark:bg-slate-800/40 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                {cell}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ── INTERVALS ── */
function IntervalR({ step }) {
  const { intervals, merged = [], current } = step;
  const scale = 20;
  return (
    <div className="space-y-2">
      {intervals.map((iv, i) => {
        const isCur = i === current || i === current - 1;
        const isMerged = merged.some(m => m.includes && m.includes(i));
        const w = Math.max(((iv[1]-iv[0])/scale)*100, 6);
        const l = (iv[0]/scale)*100;
        return (
          <div key={i} className="relative h-8 bg-slate-100 dark:bg-slate-800/40 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className={`absolute top-0 bottom-0 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 ${isMerged?'bg-emerald-500 text-white':isCur?'bg-blue-600 text-white shadow-sm':'bg-blue-300 dark:bg-blue-700 text-white'}`}
              style={{left:`${l}%`,width:`${w}%`}}>
              [{iv[0]},{iv[1]}]
            </div>
          </div>
        );
      })}
      {merged.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono pt-1">
          <span className="text-slate-400">Merged:</span>
          {merged.map((m, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold">[{m[0]},{m[1]}]</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── SUBSET / BACKTRACKING ── */
function SubsetR({ step }) {
  const { items, included = [], excluded = [], current, subsets = [] } = step;
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap items-end">
        {items.map((item, i) => {
          const inc = included.includes(i), exc = excluded.includes(i), cur = i === current;
          return (
            <div key={i} className="flex flex-col items-center gap-1">
              {cur && <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono">→?</span>}
              <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-sm transition-all duration-300 ${inc?'bg-emerald-500 text-white border-emerald-500 shadow-md':exc?'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400 line-through':cur?'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-700 dark:text-blue-300 ring-2 ring-blue-400/40':'bg-white dark:bg-[#0B101D] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}>
                {item}
              </div>
              <span className="text-[10px] font-mono text-slate-400">{inc?'✓ in':exc?'✗ skip':''}</span>
            </div>
          );
        })}
      </div>
      {subsets.length > 0 && (
        <div className="flex flex-wrap gap-1.5 text-xs font-mono">
          <span className="text-slate-400">Found:</span>
          {subsets.map((s, i) => (
            <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold">[{s.join(',')}]</span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── GENERIC ARRAY ── */
function GenericArrayR({ step }) {
  const { array, highlight = [], labels } = step;
  return (
    <div className="flex items-end gap-2 flex-wrap overflow-x-auto pb-1">
      {array.map((v, i) => (
        <ACell key={i} value={v} index={i} highlight={highlight.includes(i)} sublabel={labels?.[i]} />
      ))}
    </div>
  );
}

/* ── DISPATCH ── */
function StepRender({ step }) {
  if (!step) return null;
  switch (step.type) {
    case 'sliding_window': return <SlidingWindowR step={step} />;
    case 'two_pointers':   return <TwoPointersR step={step} />;
    case 'stack':          return <StackR step={step} />;
    case 'queue':          return <QueueR step={step} />;
    case 'linked_list':    return <LinkedListR step={step} />;
    case 'tree':           return <TreeR step={step} />;
    case 'graph':          return <GraphR step={step} />;
    case 'binary_search':  return <BinarySearchR step={step} />;
    case 'dp_table':       return <DPTableR step={step} />;
    case 'grid':           return <GridR step={step} />;
    case 'interval':       return <IntervalR step={step} />;
    case 'subset':         return <SubsetR step={step} />;
    default:               return <GenericArrayR step={step} />;
  }
}

/* ── MAIN EXPORT ── */
export function AnalogyStepVisualizer({ stepVisualizer }) {
  const [idx, setIdx]       = useState(0);
  const [auto, setAuto]     = useState(false);

  const steps   = stepVisualizer?.steps   || [];
  const mapping = stepVisualizer?.mapping || [];

  useEffect(() => { setIdx(0); setAuto(false); }, [stepVisualizer]);

  useEffect(() => {
    if (!auto || !steps.length) return;
    if (idx >= steps.length - 1) { setAuto(false); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 1600);
    return () => clearTimeout(t);
  }, [auto, idx, steps.length]);

  if (!stepVisualizer || !steps.length) return null;

  const cur      = steps[idx];
  const isFirst  = idx === 0;
  const isLast   = idx === steps.length - 1;
  const progress = steps.length > 1 ? (idx / (steps.length - 1)) * 100 : 100;

  return (
    <section className="space-y-3" aria-label="Interactive Analogy Simulation">
      <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.08em] text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2">
        <span>02</span><span aria-hidden="true">•</span><span>INTERACTIVE SIMULATION</span>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-sm space-y-5">
        {/* Title */}
        <div className="border-b border-slate-100 dark:border-[#162032] pb-4 space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{stepVisualizer.title}</h3>
          {stepVisualizer.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{stepVisualizer.description}</p>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>STEP {idx + 1} / {steps.length}</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{cur?.label || ''}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full transition-all duration-300" style={{width:`${progress}%`}} />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {steps.map((_, i) => (
              <button key={i} type="button"
                onClick={() => { setAuto(false); setIdx(i); }}
                className={`w-6 h-6 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${i===idx?'bg-blue-600 text-white scale-110 shadow-sm':i<idx?'bg-emerald-500 text-white':'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
                aria-label={`Step ${i+1}`} aria-current={i===idx?'step':undefined}
              >{i+1}</button>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="min-h-[120px]"><StepRender step={cur} /></div>

        {/* Explanation */}
        {cur?.explanation && (
          <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-sans leading-relaxed">
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-[10px] uppercase tracking-wider block mb-1">Observation:</span>
            {cur.explanation}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <button type="button" onClick={() => { setAuto(false); setIdx(0); }} disabled={isFirst}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => { setAuto(false); setIdx(i => clamp(i-1, 0, steps.length-1)); }} disabled={isFirst}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-mono font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Prev
            </button>
          </div>

          <button type="button" onClick={() => setAuto(p => !p)} disabled={isLast}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed ${auto?'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200':'bg-blue-600 hover:bg-blue-700 text-white'}`}>
            {auto ? <><Pause className="w-4 h-4" aria-hidden="true" /><span>Pause</span></> : <><Play className="w-4 h-4" aria-hidden="true" /><span>Auto Play</span></>}
          </button>

          <button type="button" onClick={() => { setAuto(false); setIdx(i => clamp(i+1, 0, steps.length-1)); }} disabled={isLast}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-mono font-bold cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

      </div>
    </section>
  );
}

export default AnalogyStepVisualizer;
