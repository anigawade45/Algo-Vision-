import React from 'react';
import { Compass, Disc, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DiskTrackVisualizer({
  diskMin = 0,
  diskMax = 199,
  initialHead = 53,
  currentEvent = null,
  allEvents = [],
  currentStepIndex = 0
}) {
  const currentHead = currentEvent ? currentEvent.currentHead : initialHead;
  const direction = currentEvent ? currentEvent.direction : 'up';
  const servicedReqs = currentEvent ? currentEvent.servicedRequests : [];
  const pendingReqs = currentEvent ? currentEvent.pendingRequests : [];

  // Group pending/serviced by track to handle duplicates gracefully
  const trackMap = {};
  servicedReqs.forEach(r => {
    if (!trackMap[r.track]) trackMap[r.track] = { servicedCount: 0, pendingCount: 0 };
    trackMap[r.track].servicedCount += 1;
  });
  pendingReqs.forEach(r => {
    if (!trackMap[r.track]) trackMap[r.track] = { servicedCount: 0, pendingCount: 0 };
    trackMap[r.track].pendingCount += 1;
  });

  const range = Math.max(diskMax - diskMin, 1);
  const getPct = (track) => Math.min(Math.max(((track - diskMin) / range) * 100, 0), 100);

  // Filter events up to currentStepIndex for history trajectory line
  const historyEvents = allEvents.slice(0, currentStepIndex + 1);

  return (
    <div className="space-y-6">
      {/* Track Scale Visualizer */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Disc className="w-4 h-4 text-cyan-500" /> Disk Track Scale Visualizer [Track {diskMin} ➔ {diskMax}]
          </h4>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" /> Head: <strong className="text-slate-900 dark:text-white">{currentHead}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Serviced
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Pending
            </span>
          </div>
        </div>

        {/* Proportional Track Bar Container */}
        <div className="relative py-10 px-4">
          {/* Main Track Line */}
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
            {/* Min Boundary Marker */}
            <div className="absolute left-0 -top-6 text-[10px] font-mono text-slate-400 font-bold">
              Boundary {diskMin}
            </div>
            {/* Max Boundary Marker */}
            <div className="absolute right-0 -top-6 text-[10px] font-mono text-slate-400 font-bold">
              Boundary {diskMax}
            </div>

            {/* Initial Head Marker */}
            <div
              className="absolute -top-1 w-1 h-5 bg-purple-500/60 z-10"
              style={{ left: `${getPct(initialHead)}%` }}
              title={`Initial Head = ${initialHead}`}
            >
              <span className="absolute -top-5 -left-4 text-[9px] font-mono font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                Init {initialHead}
              </span>
            </div>

            {/* Request Markers on Track */}
            {Object.keys(trackMap).map(trackStr => {
              const trackNum = parseInt(trackStr, 10);
              const data = trackMap[trackStr];
              const pct = getPct(trackNum);
              const isServicedAll = data.pendingCount === 0;

              return (
                <div
                  key={trackStr}
                  className="absolute -top-3 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-20"
                  style={{ left: `${pct}%` }}
                >
                  <div
                    className={`w-6 h-6 rounded-full font-mono text-[10px] font-bold flex items-center justify-center border transition-transform group-hover:scale-125 ${
                      isServicedAll
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm'
                        : 'bg-amber-500 text-white border-amber-600 shadow-sm'
                    }`}
                  >
                    {data.servicedCount + data.pendingCount > 1
                      ? `${trackNum}(${data.servicedCount + data.pendingCount})`
                      : trackNum}
                  </div>
                </div>
              );
            })}

            {/* Active Head Pointer */}
            <div
              className="absolute -top-4 -translate-x-1/2 z-30 transition-all duration-300 flex flex-col items-center"
              style={{ left: `${getPct(currentHead)}%` }}
            >
              <div className="px-2 py-1 rounded-lg bg-cyan-600 text-white font-mono font-bold text-xs shadow-lg flex items-center gap-1 animate-bounce">
                <Compass className="w-3.5 h-3.5" />
                <span>Head: {currentHead}</span>
                <span className="text-[10px] uppercase font-mono">({direction})</span>
              </div>
              <div className="w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-cyan-600 -mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Track Trajectory Plot Graph (SVG Plot) */}
      <div className="rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-[#1E2638] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-cyan-500" /> Head Movement Trajectory Plot Graph
          </h4>
          <span className="text-[11px] font-mono text-slate-400">
            X-Axis: Track Position ({diskMin} ➔ {diskMax}) | Y-Axis: Execution Steps
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070A12] border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="min-w-[600px] h-64 relative font-mono text-xs">
            <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
              {/* Background grid lines */}
              <line x1="40" y1="20" x2="580" y2="20" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="120" x2="580" y2="120" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1="40" y1="220" x2="580" y2="220" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />

              {/* Step trajectory polyline */}
              {allEvents.length > 0 && (() => {
                const totalSteps = allEvents.length;
                const points = [];
                // Initial point
                const x0 = 40 + ((initialHead - diskMin) / range) * 540;
                const y0 = 20;
                points.push(`${x0},${y0}`);

                allEvents.forEach((ev, idx) => {
                  if (idx > currentStepIndex) return;
                  const x = 40 + ((ev.currentHead - diskMin) / range) * 540;
                  const y = 20 + ((idx + 1) / totalSteps) * 200;
                  points.push(`${x},${y}`);
                });

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      points={points.join(' ')}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Render circles at each step node */}
                    {points.map((ptStr, pIdx) => {
                      const [px, py] = ptStr.split(',');
                      const isLast = pIdx === points.length - 1;
                      return (
                        <circle
                          key={pIdx}
                          cx={px}
                          cy={py}
                          r={isLast ? '6' : '4'}
                          fill={isLast ? '#06b6d4' : '#10b981'}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
