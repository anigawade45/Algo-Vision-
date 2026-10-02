import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as d3 from 'd3';
import {
  Target,
  Brain,
  Sparkles,
  Grid,
  Workflow,
  FileCode2,
  Code2,
  PlayCircle,
  Eye,
  Gauge,
  CheckCircle2,
  ChevronRight,
  Sparkle,
  ArrowRight,
  Layers,
  Cpu,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

// STAGE DEFINITIONS FOR ALGOVISION LEARNING ENGINE
const ENGINE_STAGES = [
  {
    id: 'problem',
    stepNumber: '01',
    title: 'YOUR PROBLEM',
    subtitle: 'Input Problem Seed',
    description: 'Paste your LeetCode URL or problem statement to initiate the visual breakdown.',
    icon: Target,
    category: 'INPUT',
    xRatio: 0.50,
    yRatio: 0.07,
    iconKey: 'problem',
    miniVisualType: 'origin',
    examples: ['LeetCode URL / Raw Text', 'Constraints & Constraints Spec']
  },
  {
    id: 'understand',
    stepNumber: '02',
    title: 'UNDERSTAND',
    subtitle: 'Clarify Bounds & Goal',
    description: 'Deconstruct inputs, output types, constraints, and edge case boundaries.',
    icon: Brain,
    category: 'REASONING',
    xRatio: 0.26,
    yRatio: 0.20,
    iconKey: 'understand',
    miniVisualType: 'bounds',
    examples: ['Constraint 2 ≤ N ≤ 10⁴', 'Negative numbers & Duplicates']
  },
  {
    id: 'analogy',
    stepNumber: '03',
    title: 'ANALOGY',
    subtitle: 'Physical Mental Model',
    description: 'Map abstract algorithms to real-world mental models (e.g. Coat-check tickets).',
    icon: Sparkles,
    category: 'REASONING',
    xRatio: 0.15,
    yRatio: 0.34,
    iconKey: 'analogy',
    miniVisualType: 'analogy',
    examples: ['Coat-check ticket lookup', 'Two runners on a circular track']
  },
  {
    id: 'pattern',
    stepNumber: '04',
    title: 'PATTERN',
    subtitle: 'Recognize Archetype',
    description: 'Identify the core algorithmic technique behind the problem solution.',
    icon: Grid,
    category: 'REASONING',
    xRatio: 0.74,
    yRatio: 0.20,
    iconKey: 'pattern',
    miniVisualType: 'pattern',
    examples: ['Two Pointers', 'Sliding Window', 'Hash Map', 'Binary Search']
  },
  {
    id: 'algorithm',
    stepNumber: '05',
    title: 'ALGORITHM',
    subtitle: 'Optimal Strategy',
    description: 'Formulate the high-level step-by-step strategy before writing syntax.',
    icon: Workflow,
    category: 'SOLUTION',
    xRatio: 0.50,
    yRatio: 0.34,
    iconKey: 'algorithm',
    miniVisualType: 'flow',
    examples: ['Single-pass Hash lookup', 'Halving search space']
  },
  {
    id: 'pseudocode',
    stepNumber: '06',
    title: 'PSEUDOCODE',
    subtitle: 'Language-Agnostic Logic',
    description: 'Express logic in clean language-agnostic structured control flows.',
    icon: FileCode2,
    category: 'SOLUTION',
    xRatio: 0.50,
    yRatio: 0.48,
    iconKey: 'pseudocode',
    miniVisualType: 'pseudocode',
    examples: ['for x in nums:', 'if (target - x) in map: return [map[val], i]']
  },
  {
    id: 'code',
    stepNumber: '07',
    title: 'CODE',
    subtitle: 'Production Implementations',
    description: 'Write production-ready code in C++, Java, Python, and JavaScript.',
    icon: Code2,
    category: 'SOLUTION',
    xRatio: 0.50,
    yRatio: 0.61,
    iconKey: 'code',
    miniVisualType: 'code',
    examples: ['C++ unordered_map', 'Python dict lookup', 'JS Map']
  },
  {
    id: 'dryrun',
    stepNumber: '08',
    title: 'DRY RUN',
    subtitle: 'Variable Stack Trace',
    description: 'Trace stack variables, array pointers, and memory state frame-by-frame.',
    icon: PlayCircle,
    category: 'EXECUTION',
    xRatio: 0.26,
    yRatio: 0.74,
    iconKey: 'dryrun',
    miniVisualType: 'trace',
    examples: ['Call stack inspection', 'Pointer index stepper']
  },
  {
    id: 'visualize',
    stepNumber: '09',
    title: 'VISUALIZATION',
    subtitle: 'State Animation',
    description: 'Watch memory arrays, trees, and pointer movements animate in real-time.',
    icon: Eye,
    category: 'EXECUTION',
    xRatio: 0.74,
    yRatio: 0.74,
    iconKey: 'visualize',
    miniVisualType: 'anim',
    examples: ['Array pointer movement', 'Tree node traversal animation']
  },
  {
    id: 'complexity',
    stepNumber: '10',
    title: 'COMPLEXITY',
    subtitle: 'Time & Space Bounds',
    description: 'Derive asymptotic Time O(N) and Space O(N) bounds mathematically.',
    icon: Gauge,
    category: 'REFLECT',
    xRatio: 0.50,
    yRatio: 0.85,
    iconKey: 'complexity',
    miniVisualType: 'math',
    examples: ['Time: O(N) linear', 'Space: O(N) auxiliary map']
  },
  {
    id: 'practice',
    stepNumber: '11',
    title: 'PRACTICE',
    subtitle: 'Pattern Mastery',
    description: 'Reinforce the pattern by solving 3 targeted follow-up problems.',
    icon: CheckCircle2,
    category: 'REFLECT',
    xRatio: 0.50,
    yRatio: 0.93,
    iconKey: 'practice',
    miniVisualType: 'practice',
    examples: ['3 Sum (Medium)', '4 Sum (Hard)', 'Subarray Sum Equals K']
  },
];

// SVG ICON VECTOR PATH DEFINITIONS FOR D3 NODES
const ICON_SVG_PATHS = {
  problem: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 14a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2z',
  understand: 'M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7zM9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z',
  analogy: 'M12 2L9.5 8.5 3 9.5 8 14l-1.5 6.5 5.5-3.5 5.5 3.5L16 14l5-4.5-6.5-1z',
  pattern: 'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  algorithm: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 6a6 6 0 0 0 6 6h3',
  pseudocode: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M10 12h4M10 16h4',
  code: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  dryrun: 'M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-2-14v8l6-4-6-4z',
  visualize: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 5a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-2a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
  complexity: 'M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
  practice: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
};

// CONNECTIONS BETWEEN ENGINE NODES
const CONNECTIONS = [
  { source: 'problem', target: 'understand' },
  { source: 'problem', target: 'pattern' },
  { source: 'understand', target: 'analogy' },
  { source: 'analogy', target: 'algorithm' },
  { source: 'pattern', target: 'algorithm' },
  { source: 'algorithm', target: 'pseudocode' },
  { source: 'pseudocode', target: 'code' },
  { source: 'code', target: 'dryrun' },
  { source: 'code', target: 'visualize' },
  { source: 'dryrun', target: 'complexity' },
  { source: 'visualize', target: 'complexity' },
  { source: 'complexity', target: 'practice' },
];

export const D3LearningPipelineFlow = memo(function D3LearningPipelineFlow() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [selectedStageId, setSelectedStageId] = useState('pattern');
  const [hoveredStageId, setHoveredStageId] = useState(null);
  const [isThemeDark, setIsThemeDark] = useState(false);
  const [activeVisualStep, setActiveVisualStep] = useState(0);
  const [isPlayingAnim, setIsPlayingAnim] = useState(true);

  const activeStageId = hoveredStageId || selectedStageId;
  const activeStage = ENGINE_STAGES.find((s) => s.id === activeStageId) || ENGINE_STAGES[3];

  // Observe theme changes on documentElement
  useEffect(() => {
    const checkTheme = () => {
      setIsThemeDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Timer for active animation preview
  useEffect(() => {
    let timer;
    if (isPlayingAnim) {
      timer = setInterval(() => {
        setActiveVisualStep((prev) => (prev + 1) % 4);
      }, 1800);
    }
    return () => clearInterval(timer);
  }, [isPlayingAnim]);

  // MAIN D3 ENGINE RENDERING FUNCTION
  const renderD3Engine = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const width = containerRef.current.clientWidth || 900;
    const isMobile = width < 640;
    const height = isMobile ? 880 : 680;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    // Create SVG defs for glows & gradients
    const defs = svg.append('defs');

    // Glow filter for selected node
    const filter = defs.append('filter')
      .attr('id', 'blue-glow')
      .attr('x', '-30%')
      .attr('y', '-30%')
      .attr('width', '160%')
      .attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'blur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Compute Node Coordinates
    const nodeCoords = {};
    ENGINE_STAGES.forEach((node) => {
      let x = width * node.xRatio;
      let y = height * node.yRatio;

      if (isMobile) {
        const index = ENGINE_STAGES.findIndex((s) => s.id === node.id);
        x = width * 0.5;
        if (node.id === 'analogy') x = width * 0.24;
        if (node.id === 'pattern') x = width * 0.76;
        if (node.id === 'dryrun') x = width * 0.28;
        if (node.id === 'visualize') x = width * 0.72;
        y = 42 + index * 76;
      }

      nodeCoords[node.id] = { x, y, ...node };
    });

    // 1. DRAW CONNECTIONS & ACTIVE GLOWING PARTICLES
    const linkGroup = svg.append('g').attr('class', 'engine-connections');

    CONNECTIONS.forEach((conn) => {
      const src = nodeCoords[conn.source];
      const tgt = nodeCoords[conn.target];
      if (!src || !tgt) return;

      const isConnectedToActive =
        conn.source === activeStageId || conn.target === activeStageId;

      const linkPath = d3.linkVertical()({
        source: [src.x, src.y],
        target: [tgt.x, tgt.y],
      });

      // Adaptive Theme Colors for Links
      const normalLinkColor = isDark ? '#1E293B' : '#CBD5E1';
      const activeLinkColor = isDark ? '#3B82F6' : '#2563EB';

      // Connection Path
      linkGroup
        .append('path')
        .attr('d', linkPath)
        .attr('fill', 'none')
        .attr('stroke', isConnectedToActive ? activeLinkColor : normalLinkColor)
        .attr('stroke-width', isConnectedToActive ? (isMobile ? 2.5 : 3) : 1.5)
        .attr('stroke-dasharray', isConnectedToActive ? 'none' : '4 4')
        .attr('opacity', isConnectedToActive ? 1 : (isDark ? 0.35 : 0.6))
        .style('transition', 'stroke 0.3s ease, opacity 0.3s ease');

      // Animated Glowing Particle along Connected Path
      if (isConnectedToActive) {
        const particle = linkGroup
          .append('circle')
          .attr('r', 4)
          .attr('fill', isDark ? '#60A5FA' : '#1D4ED8')
          .style('filter', 'drop-shadow(0 0 4px #3B82F6)');

        const pathNode = linkGroup
          .append('path')
          .attr('d', linkPath)
          .attr('fill', 'none')
          .node();

        if (pathNode && pathNode.getTotalLength) {
          const totalLen = pathNode.getTotalLength();
          particle
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attrTween('transform', () => (t) => {
              const point = pathNode.getPointAtLength(t * totalLen);
              return `translate(${point.x},${point.y})`;
            })
            .on('end', function repeat() {
              d3.select(this)
                .transition()
                .duration(2000)
                .ease(d3.easeLinear)
                .attrTween('transform', () => (t) => {
                  const point = pathNode.getPointAtLength(t * totalLen);
                  return `translate(${point.x},${point.y})`;
                })
                .on('end', repeat);
            });
        }
      }
    });

    // 2. DRAW SPATIAL SVG NODE CARDS / CAPSULES WITH ICONS
    const nodeGroup = svg.append('g').attr('class', 'engine-nodes');

    ENGINE_STAGES.forEach((node) => {
      const coord = nodeCoords[node.id];
      const isSelected = node.id === activeStageId;
      const isOrigin = node.id === 'problem';

      const g = nodeGroup
        .append('g')
        .attr('transform', `translate(${coord.x}, ${coord.y})`)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredStageId(node.id))
        .on('mouseleave', () => setHoveredStageId(null))
        .on('click', () => setSelectedStageId(node.id));

      // Node Card Width & Height
      const cardWidth = isOrigin ? (isMobile ? 160 : 184) : (isMobile ? 136 : 160);
      const cardHeight = isOrigin ? (isMobile ? 44 : 48) : (isMobile ? 40 : 44);

      // Color Theme Calculations
      let fillBg, strokeColor, titleColor, subColor, iconBg, iconColor;

      if (isOrigin) {
        fillBg = isDark ? '#1E3A8A' : '#EFF6FF';
        strokeColor = '#3B82F6';
        titleColor = isDark ? '#93C5FD' : '#1E40AF';
        subColor = isDark ? '#BFDBFE' : '#2563EB';
        iconBg = isDark ? '#2563EB' : '#3B82F6';
        iconColor = '#FFFFFF';
      } else if (isSelected) {
        fillBg = isDark ? '#0F172A' : '#F0F9FF';
        strokeColor = '#3B82F6';
        titleColor = isDark ? '#60A5FA' : '#1D4ED8';
        subColor = isDark ? '#94A3B8' : '#2563EB';
        iconBg = isDark ? '#1E40AF' : '#3B82F6';
        iconColor = '#FFFFFF';
      } else {
        fillBg = isDark ? '#0B101D' : '#FFFFFF';
        strokeColor = isDark ? '#1E2638' : '#E2E8F0';
        titleColor = isDark ? '#F1F5F9' : '#0F172A';
        subColor = isDark ? '#64748B' : '#64748B';
        iconBg = isDark ? '#1E293B' : '#F1F5F9';
        iconColor = isDark ? '#94A3B8' : '#475569';
      }

      // Outer Pulse Aura for Active Selected Node
      if (isSelected && !isOrigin) {
        g.append('rect')
          .attr('x', -cardWidth / 2 - 3)
          .attr('y', -cardHeight / 2 - 3)
          .attr('width', cardWidth + 6)
          .attr('height', cardHeight + 6)
          .attr('rx', 14)
          .attr('ry', 14)
          .attr('fill', 'none')
          .attr('stroke', '#3B82F6')
          .attr('stroke-width', 2)
          .attr('opacity', 0.6)
          .attr('filter', 'url(#blue-glow)');
      }

      // Main Capsule Card Body
      g.append('rect')
        .attr('x', -cardWidth / 2)
        .attr('y', -cardHeight / 2)
        .attr('width', cardWidth)
        .attr('height', cardHeight)
        .attr('rx', 12)
        .attr('ry', 12)
        .attr('fill', fillBg)
        .attr('stroke', strokeColor)
        .attr('stroke-width', isSelected ? 2 : 1.2)
        .style('filter', isSelected ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.2))' : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.05))')
        .style('transition', 'all 0.25s ease');

      // Left Icon Capsule Badge Background
      const iconX = -cardWidth / 2 + (isMobile ? 16 : 18);
      g.append('rect')
        .attr('x', iconX - 11)
        .attr('y', -11)
        .attr('width', 22)
        .attr('height', 22)
        .attr('rx', 6)
        .attr('fill', iconBg)
        .style('transition', 'fill 0.25s ease');

      // SVG Path Vector Icon inside Capsule
      const iconPath = ICON_SVG_PATHS[node.iconKey] || ICON_SVG_PATHS.problem;
      g.append('path')
        .attr('d', iconPath)
        .attr('transform', `translate(${iconX - 6}, -6) scale(0.5)`)
        .attr('fill', iconColor)
        .style('transition', 'fill 0.25s ease');

      // Node Step Index Badge (e.g. 01, 02)
      g.append('text')
        .text(node.stepNumber)
        .attr('x', cardWidth / 2 - (isMobile ? 12 : 14))
        .attr('y', -cardHeight / 2 + 12)
        .attr('text-anchor', 'end')
        .attr('fill', isSelected ? '#3B82F6' : (isDark ? '#475569' : '#94A3B8'))
        .attr('font-size', '8px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold');

      // Stage Title Text
      const textX = -cardWidth / 2 + (isMobile ? 32 : 36);
      g.append('text')
        .text(node.title)
        .attr('x', textX)
        .attr('y', isOrigin ? -3 : -4)
        .attr('fill', titleColor)
        .attr('font-size', isMobile ? '10px' : '11px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', '700')
        .style('transition', 'fill 0.25s ease');

      // Stage Subtitle Text
      g.append('text')
        .text(node.subtitle)
        .attr('x', textX)
        .attr('y', isOrigin ? 10 : 9)
        .attr('fill', subColor)
        .attr('font-size', isMobile ? '8px' : '9px')
        .attr('font-family', 'sans-serif')
        .style('transition', 'fill 0.25s ease');
    });

  }, [activeStageId, isThemeDark]);

  useEffect(() => {
    let animFrame;
    const handleResize = () => {
      animFrame = requestAnimationFrame(renderD3Engine);
    };

    renderD3Engine();

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      observer.disconnect();
    };
  }, [renderD3Engine]);

  const handleKeyDown = (e) => {
    const currentIndex = ENGINE_STAGES.findIndex((s) => s.id === activeStageId);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentIndex < ENGINE_STAGES.length - 1) {
        setSelectedStageId(ENGINE_STAGES[currentIndex + 1].id);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentIndex > 0) {
        setSelectedStageId(ENGINE_STAGES[currentIndex - 1].id);
      }
    } else if (e.key === 'Escape') {
      setSelectedStageId('problem');
    }
  };

  const IconComp = activeStage.icon;

  return (
    <section className="space-y-4 font-sans border-t border-slate-200 dark:border-[#1E2638] pt-8" onKeyDown={handleKeyDown}>
      
      {/* Streamlined Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-1">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 text-xs font-mono font-semibold border border-blue-200 dark:border-blue-900/60 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>ALGOVISION LEARNING ENGINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How AlgoVision Breaks Down a Problem
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-2xl font-normal">
            See how your problem is transformed from raw intuition into code & executable understanding. Hover or click any node to explore.
          </p>
        </div>


      </div>

      {/* Mobile-Friendly Stage Quick Navigator Strip */}
      <div className="flex sm:hidden overflow-x-auto gap-1.5 pb-1 max-w-full no-scrollbar">
        {ENGINE_STAGES.map((st) => {
          const isSel = st.id === activeStageId;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStageId(st.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isSel
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-[#0B101D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#1E2638]'
              }`}
            >
              <span className="opacity-75">{st.stepNumber}</span>
              <span>{st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main D3 Canvas Frame */}
      <div
        ref={containerRef}
        className="w-full bg-white dark:bg-[#070A12] border border-slate-200 dark:border-[#1E2638] rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-xs transition-all"
      >

        {/* D3 Engine SVG */}
        <div className="w-full relative">
          <svg ref={svgRef} className="w-full h-auto block min-h-[520px] sm:min-h-[580px]" />
        </div>



      </div>

    </section>
  );
});
