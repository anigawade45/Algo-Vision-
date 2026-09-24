import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import * as d3 from 'd3';

const HERO_DSA_SYSTEM_NODES = [
  {
    id: 'array',
    label: 'ARRAY STRUCTURE',
    type: 'array',
    cardWidth: 176,
    cardHeight: 46,
    xRatio: 0.26,
    yRatio: 0.26,
    val: '[ 4 ][ 7 ][ 2 ][ 9 ]',
    subVal: '↑ ptr',
    description: 'Contiguous indexed memory blocks'
  },
  {
    id: 'pointer',
    label: 'POINTER',
    type: 'pointer',
    cardWidth: 136,
    cardHeight: 44,
    xRatio: 0.68,
    yRatio: 0.18,
    val: '↑ i  (ptr = 2)',
    subVal: 'INDEX STEPPER',
    description: 'Two-pointer array iteration'
  },
  {
    id: 'graph',
    label: 'GRAPH NETWORK',
    type: 'graph',
    cardWidth: 152,
    cardHeight: 44,
    xRatio: 0.26,
    yRatio: 0.66,
    val: '● ── ● ── ●',
    subVal: 'ADJACENCY MAP',
    description: 'Vertices & weighted edges'
  },
  {
    id: 'tree',
    label: 'BINARY TREE',
    type: 'tree',
    cardWidth: 144,
    cardHeight: 44,
    xRatio: 0.74,
    yRatio: 0.44,
    val: '● / \\ ●',
    subVal: 'HIERARCHICAL',
    description: 'Root, left & right child branching'
  },
  {
    id: 'code',
    label: 'CODE SYNTAX',
    type: 'code',
    cardWidth: 180,
    cardHeight: 46,
    xRatio: 0.48,
    yRatio: 0.86,
    val: 'for(x of nums) { ... }',
    subVal: 'HASH MAP LOOKUP',
    description: 'Executable multi-language syntax'
  },
  {
    id: 'complexity',
    label: 'COMPLEXITY',
    type: 'math',
    cardWidth: 136,
    cardHeight: 44,
    xRatio: 0.82,
    yRatio: 0.76,
    val: 'O(log N)',
    subVal: 'TIME & SPACE',
    description: 'Asymptotic performance bounds'
  },
];

const HERO_SYSTEM_CONNECTIONS = [
  { source: 'array', target: 'pointer' },
  { source: 'array', target: 'graph' },
  { source: 'pointer', target: 'tree' },
  { source: 'tree', target: 'code' },
  { source: 'graph', target: 'code' },
  { source: 'tree', target: 'complexity' },
  { source: 'code', target: 'complexity' },
];

export const D3HeroDsaVisual = memo(function D3HeroDsaVisual() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isThemeDark, setIsThemeDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsThemeDark(document.documentElement.classList.contains('dark'));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  const renderD3HeroVisual = useCallback(() => {
    if (!containerRef.current || !svgRef.current) return;

    const isDark = document.documentElement.classList.contains('dark');
    const width = containerRef.current.clientWidth || 480;
    const isMobile = width < 640;
    const height = containerRef.current.clientHeight || (isMobile ? 320 : 380);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodeCoords = {};
    HERO_DSA_SYSTEM_NODES.forEach((node) => {
      let x = width * node.xRatio;
      let y = height * node.yRatio;

      if (isMobile) {
        if (node.id === 'array') { x = width * 0.30; y = height * 0.18; }
        if (node.id === 'pointer') { x = width * 0.74; y = height * 0.18; }
        if (node.id === 'graph') { x = width * 0.28; y = height * 0.52; }
        if (node.id === 'tree') { x = width * 0.74; y = height * 0.52; }
        if (node.id === 'code') { x = width * 0.44; y = height * 0.84; }
        if (node.id === 'complexity') { x = width * 0.82; y = height * 0.84; }
      }

      nodeCoords[node.id] = {
        x,
        y,
        ...node
      };
    });

    // Theme Adaptive Styling Palette
    const linkDefaultColor = isDark ? '#1E2638' : '#CBD5E1';
    const linkActiveColor = isDark ? '#3B82F6' : '#2563EB';

    // 1. DRAW CONNECTIONS
    const linkGroup = svg.append('g').attr('class', 'hero-system-links');

    HERO_SYSTEM_CONNECTIONS.forEach((conn) => {
      const src = nodeCoords[conn.source];
      const tgt = nodeCoords[conn.target];
      if (!src || !tgt) return;

      const isHighlight =
        hoveredNodeId === conn.source || hoveredNodeId === conn.target;

      const linkPath = d3.linkHorizontal()({
        source: [src.x, src.y],
        target: [tgt.x, tgt.y],
      });

      // Path line
      linkGroup
        .append('path')
        .attr('d', linkPath)
        .attr('fill', 'none')
        .attr('stroke', isHighlight ? linkActiveColor : linkDefaultColor)
        .attr('stroke-width', isHighlight ? 2.5 : 1.2)
        .attr('stroke-dasharray', isHighlight ? 'none' : '4 4')
        .attr('opacity', isHighlight ? 1 : 0.45)
        .style('transition', 'stroke 0.25s ease, stroke-width 0.25s ease, opacity 0.25s ease');

      // Traveling pulse along active path
      if (isHighlight) {
        const pulseCircle = linkGroup
          .append('circle')
          .attr('r', 3.5)
          .attr('fill', isDark ? '#60A5FA' : '#1D4ED8')
          .style('filter', 'drop-shadow(0 0 3px #3B82F6)');

        const pathNode = linkGroup.append('path').attr('d', linkPath).attr('fill', 'none').node();
        if (pathNode && pathNode.getTotalLength) {
          const totalLen = pathNode.getTotalLength();
          pulseCircle
            .transition()
            .duration(1800)
            .ease(d3.easeLinear)
            .attrTween('transform', () => (t) => {
              const pt = pathNode.getPointAtLength(t * totalLen);
              return `translate(${pt.x},${pt.y})`;
            })
            .on('end', function repeat() {
              d3.select(this)
                .transition()
                .duration(1800)
                .ease(d3.easeLinear)
                .attrTween('transform', () => (t) => {
                  const pt = pathNode.getPointAtLength(t * totalLen);
                  return `translate(${pt.x},${pt.y})`;
                })
                .on('end', repeat);
            });
        }
      }
    });

    // 2. DRAW OPEN SPATIAL DSA CONCEPT NODES WITH TOUCH TARGETS
    const nodeGroup = svg.append('g').attr('class', 'hero-system-nodes');

    HERO_DSA_SYSTEM_NODES.forEach((node) => {
      const coord = nodeCoords[node.id];
      const isHovered = hoveredNodeId === node.id;

      const cardW = isMobile ? Math.min(node.cardWidth, 140) : node.cardWidth;
      const cardH = node.cardHeight;

      const g = nodeGroup
        .append('g')
        .attr('transform', `translate(${coord.x}, ${coord.y})`)
        .attr('tabindex', '0')
        .attr('role', 'button')
        .attr('aria-label', `DSA System Node: ${node.label}`)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredNodeId(node.id))
        .on('mouseleave', () => setHoveredNodeId(null))
        .on('click', () => setHoveredNodeId(hoveredNodeId === node.id ? null : node.id))
        .on('focus', () => setHoveredNodeId(node.id))
        .on('blur', () => setHoveredNodeId(null));

      // Invisible 44px x 44px Minimum Touch Target Overlay for Mobile
      g.append('rect')
        .attr('x', -Math.max(cardW, 44) / 2)
        .attr('y', -Math.max(cardH, 44) / 2)
        .attr('width', Math.max(cardW, 44))
        .attr('height', Math.max(cardH, 44))
        .attr('fill', 'transparent');

      // Node Capsule Box Colors
      const bgFill = isHovered
        ? (isDark ? '#0F172A' : '#EFF6FF')
        : (isDark ? '#0B101D' : '#FFFFFF');
      const borderColor = isHovered
        ? '#3B82F6'
        : (isDark ? '#1E2638' : '#E2E8F0');
      const mainTextColor = isHovered
        ? (isDark ? '#60A5FA' : '#1D4ED8')
        : (isDark ? '#F1F5F9' : '#0F172A');
      const detailTextColor = isHovered
        ? (isDark ? '#93C5FD' : '#2563EB')
        : (isDark ? '#64748B' : '#64748B');

      // Outer aura ring on hover/tap
      if (isHovered) {
        g.append('rect')
          .attr('x', -cardW / 2 - 3)
          .attr('y', -cardH / 2 - 3)
          .attr('width', cardW + 6)
          .attr('height', cardH + 6)
          .attr('rx', 12)
          .attr('fill', 'none')
          .attr('stroke', '#3B82F6')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6);
      }

      // Main Capsule Card Rectangle
      g.append('rect')
        .attr('x', -cardW / 2)
        .attr('y', -cardH / 2)
        .attr('width', cardW)
        .attr('height', cardH)
        .attr('rx', 10)
        .attr('fill', bgFill)
        .attr('stroke', borderColor)
        .attr('stroke-width', isHovered ? 1.8 : 1.2)
        .style('filter', isHovered ? 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.18))' : 'drop-shadow(0 1px 3px rgba(0, 0, 0, 0.05))')
        .style('transition', 'all 0.2s ease');

      // Value / Concept Visual Graphic
      g.append('text')
        .text(node.val)
        .attr('text-anchor', 'middle')
        .attr('dy', -4)
        .attr('fill', mainTextColor)
        .attr('font-size', isMobile ? '9px' : '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold');

      // Sub-label Tag
      g.append('text')
        .text(node.label)
        .attr('text-anchor', 'middle')
        .attr('dy', 11)
        .attr('fill', detailTextColor)
        .attr('font-size', isMobile ? '7.5px' : '8px')
        .attr('font-family', 'sans-serif')
        .attr('font-weight', '600');
    });

  }, [hoveredNodeId, isThemeDark]);

  useEffect(() => {
    let animFrame;
    const handleResize = () => {
      animFrame = requestAnimationFrame(renderD3HeroVisual);
    };

    renderD3HeroVisual();

    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      observer.disconnect();
    };
  }, [renderD3HeroVisual]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[260px] sm:min-h-[320px] max-h-[340px] relative">
      <svg ref={svgRef} className="w-full h-full block" />
    </div>
  );
});




