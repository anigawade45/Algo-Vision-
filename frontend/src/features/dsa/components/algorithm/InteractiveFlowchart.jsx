import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Check,
  ArrowDown,
  ArrowRight,
  GitBranch,
  Code,
  Terminal,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export function InteractiveFlowchart({ flowchartData }) {
  if (!flowchartData || !flowchartData.nodes) return null;

  const { title = 'Execution Flowchart', nodes = [], executionPath = [] } = flowchartData;

  // Build sequential steps from executionPath or nodes
  const stepSequence = executionPath.length > 0
    ? executionPath
    : nodes.map((n) => n.id);

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play timer
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < stepSequence.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1800);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, stepSequence.length]);

  const activeNodeId = stepSequence[currentStepIdx] || nodes[0]?.id;
  const activeNode = nodes.find((n) => n.id === activeNodeId) || nodes[0];

  const handleNext = () => {
    if (currentStepIdx < stepSequence.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleNodeClick = (nodeId) => {
    const seqIdx = stepSequence.indexOf(nodeId);
    if (seqIdx !== -1) {
      setCurrentStepIdx(seqIdx);
    }
  };

  return (
    <section className={`transition-all duration-300 font-sans ${isFullscreen ? 'fixed inset-0 z-50 p-4 sm:p-8 bg-slate-50/95 dark:bg-[#05070E]/95 backdrop-blur-md overflow-y-auto' : 'space-y-4'}`} aria-label="Interactive Algorithm Flowchart">
      <div className={`rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200/80 dark:border-[#1E2638] shadow-xs flex flex-col ${isFullscreen ? 'min-h-full max-w-7xl mx-auto p-6 sm:p-8 space-y-8' : 'p-5 sm:p-6 space-y-6'}`}>
        
        {/* Header & Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-[#162032] pb-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              INTERACTIVE FLOWCHART
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{title}</span>
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                (Step {currentStepIdx + 1} of {stepSequence.length})
              </span>
            </h3>
          </div>

          {/* Interactive Playback Toolbar */}
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Reset Flowchart Step"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStepIdx === 0}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentStepIdx === stepSequence.length - 1}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" aria-hidden="true"></div>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Visual Flowchart Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Flowchart Diagram (Left 2 cols) */}
          <div className="lg:col-span-2 p-4 rounded-xl bg-slate-50 dark:bg-[#070A13] border border-slate-200/80 dark:border-[#162032] space-y-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              FLOWCHART GRAPH (Click node to inspect step)
            </span>

            <div className="flex flex-col items-center py-2">
              {nodes.map((node, idx) => {
                const isActive = node.id === activeNodeId;
                const isDecision = node.type === 'decision';
                const isStartEnd = node.type === 'start' || node.type === 'end';

                return (
                  <React.Fragment key={node.id}>
                    {/* Flowchart Diagrammatic Node */}
                    <button
                      type="button"
                      onClick={() => handleNodeClick(node.id)}
                      style={{
                        clipPath: isDecision ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
                      }}
                      className={`flex flex-col items-center justify-center transition-all duration-300 cursor-pointer text-center focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 relative ${
                        isStartEnd ? 'w-48 min-h-[3.5rem] rounded-full px-6 p-3' : isDecision ? 'w-[14rem] min-h-[7rem] rounded-none px-8 py-5' : 'w-48 min-h-[4rem] rounded-md shadow-sm p-3'
                      } ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-110 z-10 font-bold'
                          : isStartEnd
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 border-2 border-emerald-500 hover:scale-105'
                          : isDecision
                          ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-950 dark:text-amber-100 border-0 hover:scale-105'
                          : 'bg-white dark:bg-[#0B101D] text-slate-800 dark:text-slate-200 border-2 border-blue-400 dark:border-blue-600 hover:border-blue-500 hover:scale-105'
                      }`}
                    >
                      {/* Fake border for true Diamond since clip-path clips normal borders */}
                      {isDecision && !isActive && (
                         <div className="absolute inset-0 bg-amber-500 z-[-2]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                            <div className="absolute inset-[2px] bg-amber-50 dark:bg-[#1A1508] z-[-1]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
                         </div>
                      )}

                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wider mb-0.5 ${
                        isActive ? 'text-white/80' : isDecision ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'
                      }`}>
                        {node.label || node.type}
                      </span>
                      
                      <span className={`font-bold font-sans leading-tight ${isDecision ? 'text-xs' : 'text-[13px]'}`}>
                        {node.title}
                      </span>

                      {/* Formal Side Arrow for NO branch */}
                      {isDecision && (
                        <div className="absolute top-1/2 -right-12 flex items-center transform -translate-y-1/2 z-0">
                          <div className="h-0.5 w-10 bg-slate-400 dark:bg-slate-500 relative">
                            <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold font-mono bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-400 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-800 shadow-xs">NO</span>
                          </div>
                          <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 transform -rotate-45 -ml-1"></div>
                        </div>
                      )}
                    </button>

                    {/* Flowchart Arrow connector */}
                    {idx < nodes.length - 1 && (
                      <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 relative h-8 w-8 z-0">
                        {/* Downward Arrow Label for YES branch */}
                        {isDecision && (
                          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-[9px] font-bold font-mono bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 z-10 shadow-xs">
                            YES
                          </span>
                        )}
                        <div className="w-0.5 h-full bg-slate-300 dark:bg-slate-700"></div>
                        <ArrowDown className="w-3.5 h-3.5 absolute -bottom-1 text-slate-400 dark:text-slate-500" aria-hidden="true" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Active Step Details & Live Variables Inspector (Right 1 col) */}
          <div className="space-y-4">
            
            {/* Step Detail Card */}
            <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase">
                <span>ACTIVE STEP INSPECTOR</span>
                <span>STEP #{currentStepIdx + 1}</span>
              </div>

              <h4 className="font-bold text-sm text-blue-950 dark:text-blue-100 font-mono">
                {activeNode.title}
              </h4>

              <p className="text-xs text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {activeNode.description}
              </p>


            </div>

            {/* Live State Variables Inspector */}
            {activeNode.state && (
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono space-y-2 border border-slate-800 shadow-xs">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>LIVE DATA STATE</span>
                  </div>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>

                <div className="space-y-1 text-xs pt-1">
                  {Object.entries(activeNode.state).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-1 border-b border-slate-800/80 last:border-0">
                      <span className="text-slate-400">{key}:</span>
                      <span className="font-bold text-emerald-300">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}

export default InteractiveFlowchart;
