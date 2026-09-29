import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { AlertTriangle, FileCode2, BrainCircuit, Unlink, Gauge, BookOpen } from 'lucide-react';

export function ProblemSection() {
  const containerRef = useRef(null);
  const bannerRef = useRef(null);
  const dot1Ref = useRef(null);
  const dot2Ref = useRef(null);
  const dot3Ref = useRef(null);
  const dot4Ref = useRef(null);

  const [pathStrings, setPathStrings] = useState([]);

  useEffect(() => {
    const updatePaths = () => {
      if (!containerRef.current || !bannerRef.current) return;
      const cRect = containerRef.current.getBoundingClientRect();
      const bRect = bannerRef.current.getBoundingClientRect();

      const dots = [dot1Ref, dot2Ref, dot3Ref, dot4Ref];
      const points = dots.map((ref) => {
        if (!ref.current) return null;
        const r = ref.current.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - cRect.left,
          y: r.top + r.height / 2 - cRect.top,
        };
      });

      if (points.some((p) => p === null)) return;

      const bLeft = bRect.left - cRect.left;
      const bRight = bRect.right - cRect.left;
      const bTop = bRect.top - cRect.top;
      const bCenterY = bRect.top + bRect.height / 2 - cRect.top;

      // Targets on the AlgoVision Banner (Left, Top Left, Top Right, Right)
      const targets = [
        { x: bLeft, y: bCenterY },
        { x: bLeft + 60, y: bTop },
        { x: bRight - 60, y: bTop },
        { x: bRight, y: bCenterY },
      ];

      // Use D3.js Path Generator (d3.path()) to compute smooth cubic bezier curves
      const generatedPaths = points.map((source, idx) => {
        const target = targets[idx];
        const p = d3.path();
        p.moveTo(source.x, source.y);

        if (idx === 0) {
          p.bezierCurveTo(
            source.x,
            (source.y + bCenterY) / 2 + 20,
            bLeft - 40,
            bCenterY,
            target.x,
            target.y
          );
        } else if (idx === 1) {
          p.bezierCurveTo(
            source.x,
            source.y + 25,
            bLeft + 60,
            bTop - 15,
            target.x,
            target.y
          );
        } else if (idx === 2) {
          p.bezierCurveTo(
            source.x,
            source.y + 25,
            bRight - 60,
            bTop - 15,
            target.x,
            target.y
          );
        } else {
          p.bezierCurveTo(
            source.x,
            (source.y + bCenterY) / 2 + 20,
            bRight + 40,
            bCenterY,
            target.x,
            target.y
          );
        }

        return p.toString();
      });

      setPathStrings(generatedPaths);
    };

    updatePaths();
    window.addEventListener('resize', updatePaths);
    const timer = setTimeout(updatePaths, 150);
    return () => {
      window.removeEventListener('resize', updatePaths);
      clearTimeout(timer);
    };
  }, []);

  const problems = [
    {
      cardNum: '01',
      title: 'Static Learning',
      titleColor: 'border-blue-500/40',
      description: "Reading pseudocode or theory doesn't explain what happens at every execution step.",
      badgeColor: 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      numColor: 'text-blue-600 dark:text-[#3B82F6]',
      dotRef: dot1Ref,
      icon: FileCode2,
      renderVisual: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-4 h-[105px] flex items-center justify-between px-5 relative overflow-hidden group/viz">
          <div className="space-y-2 w-1/2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-700/80 rounded w-full animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-700/60 rounded w-3/4 animate-pulse duration-700" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <div className="h-1.5 bg-slate-300 dark:bg-slate-700/40 rounded w-5/6 animate-pulse duration-1000" />
            </div>
          </div>

          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover/viz:rotate-6 transition-transform">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>
      )
    },
    {
      cardNum: '02',
      title: 'Abstract Concepts',
      titleColor: 'border-purple-500/40',
      description: 'Data structures, operating systems, and networks can be difficult to visualize mentally.',
      badgeColor: 'border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
      numColor: 'text-purple-600 dark:text-purple-400',
      dotRef: dot2Ref,
      icon: BrainCircuit,
      renderVisual: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-4 h-[105px] flex items-center justify-center relative overflow-hidden">
          <svg className="w-full h-full text-purple-500 dark:text-purple-400/80" viewBox="0 0 160 60">
            <line x1="30" y1="20" x2="70" y2="10" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />
            <line x1="30" y1="20" x2="60" y2="45" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />
            <line x1="70" y1="10" x2="110" y2="25" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />
            <line x1="60" y1="45" x2="110" y2="25" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />
            <line x1="110" y1="25" x2="140" y2="40" stroke="currentColor" strokeWidth="1.5" className="animate-pulse" opacity="0.5" />
            
            <circle cx="30" cy="20" r="5" fill="#C084FC" className="animate-ping opacity-75" />
            <circle cx="70" cy="10" r="6" fill="#A855F7" />
            <circle cx="60" cy="45" r="7" fill="#8B5CF6" />
            <circle cx="110" cy="25" r="9" fill="#9333EA" className="animate-pulse" />
            <circle cx="140" cy="40" r="5" fill="#C084FC" />
          </svg>
        </div>
      )
    },
    {
      cardNum: '03',
      title: 'Disconnected Resources',
      titleColor: 'border-cyan-500/40',
      description: 'Students jump between static videos, articles, code platforms, and fragmented notes.',
      badgeColor: 'border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      numColor: 'text-cyan-600 dark:text-cyan-400',
      dotRef: dot3Ref,
      icon: Unlink,
      renderVisual: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 h-[105px] flex items-center justify-around relative overflow-hidden text-cyan-600 dark:text-cyan-400">
          <div className="p-2 rounded-lg bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-cyan-500/30 text-xs flex items-center justify-center animate-bounce duration-1000">
            ▶
          </div>
          <div className="p-2 rounded-lg bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-cyan-500/30 text-xs font-mono font-bold animate-bounce duration-700">
            &lt;/&gt;
          </div>
          <div className="p-2 rounded-lg bg-white dark:bg-[#0E172A] border border-slate-200 dark:border-cyan-500/30 text-xs flex items-center justify-center animate-bounce duration-500">
            📄
          </div>
        </div>
      )
    },
    {
      cardNum: '04',
      title: 'Limited Feedback',
      titleColor: 'border-blue-500/40',
      description: "Knowing the answer doesn't always mean understanding the execution process.",
      badgeColor: 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      numColor: 'text-blue-600 dark:text-[#3B82F6]',
      dotRef: dot4Ref,
      icon: Gauge,
      renderVisual: () => (
        <div className="bg-slate-100 dark:bg-[#070A12] border border-slate-200 dark:border-[#1C2638] rounded-xl p-3 h-[105px] flex items-center justify-between relative overflow-hidden px-4">
          <div className="space-y-1.5 w-2/3">
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700/70 rounded w-full animate-pulse" />
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700/50 rounded w-4/5 animate-pulse" />
            <div className="h-1.5 bg-slate-300 dark:bg-slate-700/30 rounded w-1/2 animate-pulse" />
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse">
            ?
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-[#05070E] text-slate-900 dark:text-white relative font-sans overflow-hidden border-t border-slate-200/80 dark:border-[#1C2638] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-[#0E172A] border border-blue-200 dark:border-[#1E2E4A] text-blue-600 dark:text-[#3B82F6] text-[11px] font-semibold uppercase tracking-wider font-mono">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>THE CS LEARNING GAP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Computer Science is hard to understand <br className="hidden sm:block" />
            when you can only <span className="text-blue-600 dark:text-[#3B82F6]">read it.</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base max-w-lg mx-auto leading-relaxed">
            Students often memorize algorithms without truly understanding what happens internally.
          </p>
        </motion.div>

        {/* CONTAINER FOR DYNAMIC D3 CONNECTORS & CARDS */}
        <div ref={containerRef} className="relative pb-16">
          
          {/* 4 Problem Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {problems.map((prob, idx) => {
              const CardIcon = prob.icon;
              return (
                <motion.div
                  key={prob.cardNum}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  className="bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-sm dark:shadow-md hover:shadow-xl dark:hover:shadow-[0_10px_30px_rgba(59,130,246,0.15)] group relative overflow-hidden transition-colors"
                >
                  {/* ANIMATED DOTTED SVG BORDER OVERLAY */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl z-0">
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="15"
                      ry="15"
                      fill="none"
                      className="stroke-blue-500/40 dark:stroke-blue-400/40 group-hover:stroke-blue-500 dark:group-hover:stroke-blue-400 animate-wire-dash transition-colors"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                    />
                  </svg>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full border ${prob.badgeColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <CardIcon className="w-5 h-5" />
                      </div>
                      <span className={`${prob.numColor} font-mono font-bold text-base group-hover:scale-110 transition-transform`}>{prob.cardNum}</span>
                    </div>

                    <h3 className={`text-xl font-bold text-slate-900 dark:text-white mb-2 pb-1 inline-block border-b-2 ${prob.titleColor} group-hover:border-blue-500 transition-colors`}>
                      {prob.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-2">
                      {prob.description}
                    </p>
                  </div>

                  <div className="relative z-10">
                    {prob.renderVisual()}
                  </div>

                  {/* Glowing Node Dot at bottom center of each card */}
                  <div
                    ref={prob.dotRef}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-600 dark:bg-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.8)] hidden md:block z-20"
                  />
                </motion.div>
              );
            })}
          </div>

          {/* D3.JS GENERATED DOTTED WIRES WITH CONTINUOUS SMOOTH 60FPS DASH FLOW */}
          {pathStrings.length === 4 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block z-0"
              fill="none"
            >
              {pathStrings.map((pathD, idx) => (
                <g key={idx}>
                  {/* Base Dotted Curve Line */}
                  <path
                    d={pathD}
                    className="stroke-slate-300 dark:stroke-blue-500/30"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    fill="none"
                  />

                  {/* Continuous Animated Data Flow Pulse along D3 Dotted Wire */}
                  <path
                    d={pathD}
                    className="stroke-blue-600 dark:stroke-blue-400 animate-wire-dash"
                    strokeWidth="2"
                    strokeDasharray="6 12"
                    fill="none"
                  />
                </g>
              ))}
            </svg>
          )}

          {/* Central Banner Box */}
          <div className="flex justify-center mt-12 md:mt-16">
            <motion.div
              ref={bannerRef}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="relative inline-flex items-center gap-3.5 px-7 py-3.5 rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-[#1E2C4A] text-slate-800 dark:text-slate-100 font-medium text-base sm:text-lg shadow-md dark:shadow-[0_0_30px_rgba(59,130,246,0.25)] z-10 transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-[1px] shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
                <div className="w-full h-full bg-[#080B14] rounded-[11px] flex items-center justify-center">
                  <FileCode2 className="w-5 h-5 text-blue-400" />
                </div>
              </div>

              <div>
                <span className="font-bold text-blue-600 dark:text-[#3B82F6] text-lg mr-1.5">AlgoVision</span>
                <span>connects the missing pieces.</span>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
}
