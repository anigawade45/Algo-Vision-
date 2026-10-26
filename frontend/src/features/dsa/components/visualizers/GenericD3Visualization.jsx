import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { Layers, Sparkles, AlertCircle, Info, Database, Eye } from 'lucide-react';
import { validateVisualizationPlan } from '../../adapters/visualizationPlanValidator';

/**
 * Resolves value from path (e.g. "input.nums", "state.hashMap", "state.currentIndex")
 */
function resolvePathValue(sourcePath, inputData, sceneState) {
  if (!sourcePath || typeof sourcePath !== 'string') return undefined;

  const parts = sourcePath.split('.');
  const rootKey = parts[0];
  let current = rootKey === 'input' ? inputData : sceneState;

  for (let i = 1; i < parts.length; i++) {
    if (current === null || current === undefined) return undefined;
    current = current[parts[i]];
  }

  return current;
}

/**
 * AlgoVision — Stage 09 Generic AI-Assisted D3 Visualization Canvas
 *
 * Implements a pure, deterministic D3.js rendering pipeline that visualizes algorithm
 * data structures according to a validated visualization plan and authoritative replay sceneState.
 */
export function GenericD3Visualization({
  plan,
  sceneState = {},
  problem,
  highlights = {},
  stepIndex = 0,
  playbackStatus,
}) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // 1. Validate Plan on Frontend Boundary
  const validation = useMemo(() => {
    if (!plan) return { isValid: false, errors: ['No visualization plan provided.'] };
    const expectedId = problem?.problemId || problem?.id || null;
    return validateVisualizationPlan(plan, expectedId);
  }, [plan, problem]);

  // 2. Extract bound values from plan stateBindings and structures
  const resolvedData = useMemo(() => {
    if (!validation.isValid || !plan) return null;

    // Helper to extract array from string representations (e.g. "nums = [100, 4, 200, 1, 3, 2]")
    const parseArrayFromString = (str) => {
      if (typeof str !== 'string') return null;
      const match = str.match(/\[([\s\S]*?)\]/);
      if (match) {
        try {
          const parsed = JSON.parse(`[${match[1]}]`);
          if (Array.isArray(parsed)) return parsed;
        } catch {
          const items = match[1]
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '')
            .map((s) => {
              const num = Number(s);
              return isNaN(num) ? s.replace(/^['"]|['"]$/g, '') : num;
            });
          if (items.length > 0) return items;
        }
      }
      return null;
    };

    const rawInputStr =
      typeof problem?.input === 'string'
        ? problem.input
        : typeof problem?.inputData === 'string'
        ? problem.inputData
        : typeof problem?.inputData?.value === 'string'
        ? problem.inputData.value
        : null;

    const parsedNumsFromString = rawInputStr ? parseArrayFromString(rawInputStr) : null;

    const inputData = {
      nums:
        problem?.input?.nums ||
        problem?.input?.array ||
        problem?.inputData?.nums ||
        problem?.inputData?.value?.nums ||
        parsedNumsFromString ||
        [],
      s: problem?.input?.s || problem?.inputData?.value || '',
      target: problem?.input?.target ?? problem?.inputData?.target,
      k: problem?.input?.k ?? problem?.inputData?.k ?? problem?.inputData?.value?.k,
      ...(typeof problem?.input === 'object' ? problem.input : {}),
    };

    const structuresData = {};
    for (const st of plan.structures || []) {
      const val = resolvePathValue(st.source, inputData, sceneState);
      structuresData[st.id] = {
        meta: st,
        value: val !== undefined ? val : (st.type === 'array' ? [] : st.type === 'hashmap' ? {} : null),
      };
    }

    const boundVariables = {};
    for (const binding of plan.stateBindings || []) {
      const val = resolvePathValue(binding.source, inputData, sceneState);
      boundVariables[binding.visualProperty] = val;
    }

    return {
      structures: structuresData,
      variables: boundVariables,
    };
  }, [validation.isValid, plan, problem, sceneState]);

  // 3. D3 Declarative Rendering Effect
  useEffect(() => {
    if (!validation.isValid || !resolvedData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 840;
    let currentY = 20;

    // Interrupt any active transitions before updating
    svg.selectAll('*').interrupt();

    // Clear root group for deterministic rebuild of the scene
    let rootG = svg.select('g.d3-scene-root');
    if (rootG.empty()) {
      rootG = svg.append('g').attr('class', 'd3-scene-root');
    } else {
      rootG.selectAll('*').remove();
    }

    // -----------------------------------------------------------------
    // RENDERER REGISTRY: Render each visual structure defined in the plan
    // -----------------------------------------------------------------
    const structuresEntries = Object.entries(resolvedData.structures);

    structuresEntries.forEach(([structId, { meta, value }]) => {
      const sectionG = rootG.append('g')
        .attr('class', `structure-section structure-${meta.type}`)
        .attr('transform', `translate(20, ${currentY})`);

      // Section Header (Label + Type Badge)
      const headerG = sectionG.append('g').attr('class', 'structure-header');
      headerG.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', '#94A3B8')
        .attr('font-size', '11px')
        .attr('font-family', 'monospace')
        .attr('font-weight', '700')
        .attr('letter-spacing', '0.05em')
        .text((meta.label || structId).toUpperCase());

      headerG.append('rect')
        .attr('x', (meta.label || structId).length * 8 + 12)
        .attr('y', -11)
        .attr('width', meta.type.length * 8 + 14)
        .attr('height', 16)
        .attr('rx', 4)
        .attr('fill', '#3B82F620')
        .attr('stroke', '#3B82F640');

      headerG.append('text')
        .attr('x', (meta.label || structId).length * 8 + 19)
        .attr('y', 1)
        .attr('fill', '#60A5FA')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', '600')
        .text(meta.type);

      currentY += 24;

      // --- ARRAY RENDERER ---
      if (meta.type === 'array') {
        const rawArray = Array.isArray(value) ? value : [];
        const cellWidth = 56;
        const cellHeight = 52;
        const cellGap = 10;
        const totalArrayWidth = rawArray.length * (cellWidth + cellGap);
        const startX = Math.max(0, (width - 40 - totalArrayWidth) / 2);

        const arrayG = sectionG.append('g')
          .attr('class', 'array-primitive')
          .attr('transform', `translate(${startX}, 20)`);

        if (rawArray.length === 0) {
          arrayG.append('text')
            .attr('x', 0)
            .attr('y', 28)
            .attr('fill', '#64748B')
            .attr('font-family', 'monospace')
            .attr('font-size', '12px')
            .attr('font-style', 'italic')
            .text('[ Empty Array ]');
          currentY += 60;
          return;
        }

        const activeIdx = resolvedData.variables.currentIndex ?? highlights?.currentIndex ?? sceneState?.currentIndex ?? null;
        const matchedIndices = Array.isArray(resolvedData.variables.matchedPair)
          ? resolvedData.variables.matchedPair
          : (Array.isArray(sceneState?.result) ? sceneState.result : []);

        const cells = arrayG.selectAll('g.array-cell')
          .data(rawArray.map((val, idx) => ({ id: `cell-${idx}`, val, idx })), (d) => d.id);

        const cellsEnter = cells.enter().append('g')
          .attr('class', 'array-cell')
          .attr('transform', (d, i) => `translate(${i * (cellWidth + cellGap)}, 0)`);

        // Accessible Title
        cellsEnter.append('title')
          .text((d) => `Index ${d.idx}: Value ${d.val}${d.idx === activeIdx ? ' (Currently Inspected)' : ''}`);

        // Cell Box
        cellsEnter.append('rect')
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('rx', 10)
          .attr('fill', (d) => {
            if (matchedIndices.includes(d.idx)) return '#10B98125';
            if (d.idx === activeIdx) return '#3B82F625';
            return '#1E293B40';
          })
          .attr('stroke', (d) => {
            if (matchedIndices.includes(d.idx)) return '#10B981';
            if (d.idx === activeIdx) return '#3B82F6';
            return '#334155';
          })
          .attr('stroke-width', (d) => (d.idx === activeIdx || matchedIndices.includes(d.idx) ? 2 : 1));

        // Cell Value Text
        cellsEnter.append('text')
          .attr('class', 'cell-value')
          .attr('x', cellWidth / 2)
          .attr('y', cellHeight / 2 + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', (d) => {
            if (matchedIndices.includes(d.idx)) return '#34D399';
            if (d.idx === activeIdx) return '#60A5FA';
            return '#F8FAFC';
          })
          .attr('font-family', 'monospace')
          .attr('font-size', '16px')
          .attr('font-weight', '700')
          .text((d) => d.val);

        // Index Label Text (Top)
        cellsEnter.append('text')
          .attr('class', 'cell-index')
          .attr('x', cellWidth / 2)
          .attr('y', -6)
          .attr('text-anchor', 'middle')
          .attr('fill', (d) => (d.idx === activeIdx ? '#60A5FA' : '#64748B'))
          .attr('font-family', 'monospace')
          .attr('font-size', '10px')
          .attr('font-weight', (d) => (d.idx === activeIdx ? '700' : '500'))
          .text((d) => `[${d.idx}]`);

        // Active Pointer Arrow & Indicator (Bottom)
        cellsEnter.filter((d) => d.idx === activeIdx)
          .append('g')
          .attr('class', 'pointer-arrow')
          .attr('transform', `translate(${cellWidth / 2}, ${cellHeight + 6})`)
          .call((g) => {
            g.append('text')
              .attr('text-anchor', 'middle')
              .attr('y', 12)
              .attr('fill', '#3B82F6')
              .attr('font-family', 'monospace')
              .attr('font-size', '12px')
              .attr('font-weight', '700')
              .text('↑ ptr');
          });

        currentY += cellHeight + 46;
      }

      // --- HASH MAP RENDERER ---
      else if (meta.type === 'hashmap') {
        const rawMap = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
        const entries = Object.entries(rawMap);
        const mapG = sectionG.append('g')
          .attr('class', 'hashmap-primitive')
          .attr('transform', 'translate(0, 18)');

        if (entries.length === 0) {
          mapG.append('text')
            .attr('x', 0)
            .attr('y', 24)
            .attr('fill', '#64748B')
            .attr('font-family', 'monospace')
            .attr('font-size', '12px')
            .attr('font-style', 'italic')
            .text('{ Empty Map — No entries recorded yet }');
          currentY += 50;
          return;
        }

        const entryWidth = 140;
        const entryHeight = 36;
        const entryGap = 10;
        const cols = 5;

        const entryGroups = mapG.selectAll('g.hashmap-entry')
          .data(entries.map(([k, v]) => ({ id: `map-${k}`, k, v })), (d) => d.id);

        const entryEnter = entryGroups.enter().append('g')
          .attr('class', 'hashmap-entry')
          .attr('transform', (d, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            return `translate(${col * (entryWidth + entryGap)}, ${row * (entryHeight + entryGap)})`;
          });

        entryEnter.append('rect')
          .attr('width', entryWidth)
          .attr('height', entryHeight)
          .attr('rx', 8)
          .attr('fill', '#1E293B35')
          .attr('stroke', '#334155')
          .attr('stroke-width', 1);

        entryEnter.append('text')
          .attr('x', 12)
          .attr('y', 22)
          .attr('fill', '#93C5FD')
          .attr('font-family', 'monospace')
          .attr('font-size', '12px')
          .attr('font-weight', '700')
          .text((d) => d.k);

        entryEnter.append('text')
          .attr('x', entryWidth - 12)
          .attr('y', 22)
          .attr('text-anchor', 'end')
          .attr('fill', '#A7F3D0')
          .attr('font-family', 'monospace')
          .attr('font-size', '12px')
          .attr('font-weight', '700')
          .text((d) => `→ ${d.v}`);

        const rowCount = Math.ceil(entries.length / cols);
        currentY += rowCount * (entryHeight + entryGap) + 30;
      }

      // --- SLIDING WINDOW RENDERER ---
      else if (meta.type === 'string' || meta.type === 'sliding-window') {
        const rawStr = String(value || problem?.input?.s || problem?.inputData?.value || '');
        const chars = Array.from(rawStr);
        const cellWidth = 44;
        const cellHeight = 44;
        const cellGap = 8;
        const totalStrWidth = chars.length * (cellWidth + cellGap);
        const startX = Math.max(0, (width - 40 - totalStrWidth) / 2);

        const strG = sectionG.append('g')
          .attr('class', 'sliding-window-primitive')
          .attr('transform', `translate(${startX}, 20)`);

        if (chars.length === 0) {
          strG.append('text')
            .attr('x', 0)
            .attr('y', 24)
            .attr('fill', '#64748B')
            .attr('font-family', 'monospace')
            .attr('font-size', '12px')
            .attr('font-style', 'italic')
            .text('"" (Empty String)');
          currentY += 50;
          return;
        }

        const leftPtr = resolvedData.variables.left ?? sceneState?.left ?? null;
        const rightPtr = resolvedData.variables.right ?? sceneState?.right ?? null;
        const isInWindow = (idx) => leftPtr !== null && rightPtr !== null && idx >= leftPtr && idx <= rightPtr;

        const charCells = strG.selectAll('g.char-cell')
          .data(chars.map((char, idx) => ({ id: `char-${idx}`, char, idx })), (d) => d.id);

        const charEnter = charCells.enter().append('g')
          .attr('class', 'char-cell')
          .attr('transform', (d, i) => `translate(${i * (cellWidth + cellGap)}, 0)`);

        charEnter.append('rect')
          .attr('width', cellWidth)
          .attr('height', cellHeight)
          .attr('rx', 8)
          .attr('fill', (d) => (isInWindow(d.idx) ? '#3B82F625' : '#1E293B30'))
          .attr('stroke', (d) => {
            if (d.idx === leftPtr || d.idx === rightPtr) return '#3B82F6';
            if (isInWindow(d.idx)) return '#60A5FA80';
            return '#334155';
          })
          .attr('stroke-width', (d) => (d.idx === leftPtr || d.idx === rightPtr ? 2 : 1));

        charEnter.append('text')
          .attr('x', cellWidth / 2)
          .attr('y', cellHeight / 2 + 5)
          .attr('text-anchor', 'middle')
          .attr('fill', (d) => (isInWindow(d.idx) ? '#93C5FD' : '#94A3B8'))
          .attr('font-family', 'monospace')
          .attr('font-size', '16px')
          .attr('font-weight', '700')
          .text((d) => d.char);

        // Pointer Labels (L and R)
        charEnter.filter((d) => d.idx === leftPtr)
          .append('text')
          .attr('x', cellWidth / 2)
          .attr('y', cellHeight + 16)
          .attr('text-anchor', 'middle')
          .attr('fill', '#818CF8')
          .attr('font-family', 'monospace')
          .attr('font-size', '11px')
          .attr('font-weight', '700')
          .text('L');

        charEnter.filter((d) => d.idx === rightPtr)
          .append('text')
          .attr('x', cellWidth / 2)
          .attr('y', d => (d.idx === leftPtr ? cellHeight + 28 : cellHeight + 16))
          .attr('text-anchor', 'middle')
          .attr('fill', '#38BDF8')
          .attr('font-family', 'monospace')
          .attr('font-size', '11px')
          .attr('font-weight', '700')
          .text('R');

        currentY += cellHeight + 46;
      }

      // --- GENERIC VARIABLE / FALLBACK RENDERER ---
      else {
        const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value ?? 'null');
        const genericG = sectionG.append('g').attr('transform', 'translate(0, 18)');
        genericG.append('rect')
          .attr('width', Math.min(width - 40, valStr.length * 8 + 30))
          .attr('height', 34)
          .attr('rx', 8)
          .attr('fill', '#1E293B30')
          .attr('stroke', '#334155');

        genericG.append('text')
          .attr('x', 12)
          .attr('y', 21)
          .attr('fill', '#F1F5F9')
          .attr('font-family', 'monospace')
          .attr('font-size', '12px')
          .text(valStr);

        currentY += 50;
      }

      currentY += 16;
    });

    // Update dynamic SVG viewBox height
    svg.attr('viewBox', `0 0 ${width} ${Math.max(220, currentY + 20)}`);

    // Clean up transitions on unmount
    return () => {
      svg.selectAll('*').interrupt();
    };
  }, [validation.isValid, resolvedData, stepIndex, highlights, problem, sceneState]);

  // If plan is invalid, display controlled diagnostic
  if (!validation.isValid) {
    return (
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 max-w-xl mx-auto font-mono text-xs">
        <div className="flex items-center justify-center gap-2 text-amber-500 font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Visualization Plan Validation Limitation</span>
        </div>
        <p className="text-slate-400">
          The requested algorithm visualization plan did not pass schema validation:
        </p>
        <ul className="text-rose-400 list-disc list-inside text-left bg-slate-900/60 p-3 rounded-xl border border-rose-950">
          {validation.errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center space-y-4">
      {/* Plan Header Legend Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-100/60 dark:bg-[#111726]/60 border border-slate-200 dark:border-[#1E2638] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Layout: <span className="text-blue-500">{plan.layout}</span>
          </span>
          <span className="text-slate-400 dark:text-slate-500">•</span>
          <span className="text-slate-600 dark:text-slate-400">
            Family: <strong className="text-purple-400">{plan.algorithmFamily}</strong>
          </span>
        </div>

        {plan.explanation && (
          <div className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md truncate" title={plan.explanation}>
            {plan.explanation}
          </div>
        )}
      </div>

      {/* Hero D3 SVG Canvas */}
      <div className="w-full max-w-4xl overflow-x-auto rounded-2xl bg-slate-50/50 dark:bg-[#070B14]/80 border border-slate-200 dark:border-[#1E2638] p-4 flex items-center justify-center shadow-inner">
        <svg
          ref={svgRef}
          className="w-full h-auto min-h-[220px] transition-all duration-200"
          role="img"
          aria-label={`D3 Algorithm Visualization for ${problem?.title || 'problem'}`}
        />
      </div>
    </div>
  );
}
