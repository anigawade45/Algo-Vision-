import React, { useMemo } from 'react';
import { getPrimitiveComponent } from './primitives/index.js';
import { replayVisualizationEvents } from '../../events/visualizationEventReplay.js';
import { replayExecutionTrace } from '../../trace/executionTraceReplay.js';
import { furthestBuildingInitialState, furthestBuildingEvents } from '../../events/mockVisualizationEvents.js';

export function EventDrivenScene({ problem, step }) {
  const currentStepNumber = useMemo(() => {
    if (step?.stepIndex !== undefined) return step.stepIndex;
    if (step?.stepNumber !== undefined) return Math.max(0, step.stepNumber - 1);
    return 0;
  }, [step?.stepIndex, step?.stepNumber]);

  const trace = problem?.executionTrace || step?.executionTrace || null;
  const initialState = step?.initialState || problem?.initialState || furthestBuildingInitialState;
  const events = step?.events || problem?.events || furthestBuildingEvents;

  // Replay trace or events up to currentStepNumber (Memoized for peak render speed)
  const sceneState = useMemo(() => {
    if (trace) {
      const replayRes = replayExecutionTrace(trace, currentStepNumber);
      return replayRes.sceneState || {};
    }
    return replayVisualizationEvents(initialState, events, currentStepNumber);
  }, [trace, initialState, events, currentStepNumber]);

  const primitives = sceneState.primitives || {};
  const primitiveEntries = useMemo(() => Object.entries(primitives), [primitives]);

  if (primitiveEntries.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-sm">
        [ No visualization primitives configured in scene state ]
      </div>
    );
  }

  // Categorize primitives for clean layout composition (Memoized)
  const resourcePrimitives = useMemo(
    () => primitiveEntries.filter(([_, p]) => p.type === 'resource' || p.type === 'variable'),
    [primitiveEntries]
  );
  const structuralPrimitives = useMemo(
    () => primitiveEntries.filter(([_, p]) => p.type !== 'resource' && p.type !== 'variable'),
    [primitiveEntries]
  );

  const description = step?.description || step?.data?.description;

  return (
    <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto py-2">
      {/* Top Banner & Strategy Badge */}
      <div className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-xs">
            EVENT-DRIVEN SCENE
          </span>
          {trace?.source && (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-semibold text-[11px] border border-purple-500/20">
              {trace.source === 'dry-run' ? 'Dry Run Trace' : 'Mock Trace'}
            </span>
          )}
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Composite Primitives: <strong className="text-blue-600 dark:text-blue-400">{primitiveEntries.length} Active</strong>
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
          Step #{currentStepNumber} Replayed
        </div>
      </div>

      {/* Top Resource & Variable Telemetry Grid */}
      {resourcePrimitives.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {resourcePrimitives.map(([id, prim]) => {
            const PrimitiveComp = getPrimitiveComponent(prim.type);
            if (!PrimitiveComp) return null;
            return (
              <div key={id} className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
                <PrimitiveComp {...prim} />
              </div>
            );
          })}
        </div>
      )}

      {/* Main Structural Primitives Grid */}
      <div className="flex flex-col gap-4">
        {structuralPrimitives.map(([id, prim]) => {
          const PrimitiveComp = getPrimitiveComponent(prim.type);
          if (!PrimitiveComp) return null;

          return (
            <div
              key={id}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-sm flex flex-col items-center gap-3 overflow-x-auto"
            >
              <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  {prim.label || `${prim.type.toUpperCase()} Primitive (${id})`}
                </span>
                <span className="text-[10px] font-mono text-slate-400">id: {id}</span>
              </div>

              <div className="w-full flex justify-center py-1">
                <PrimitiveComp {...prim} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Description Banner */}
      {description && (
        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-xl p-3.5 text-center">
          <span className="text-xs font-semibold text-blue-900 dark:text-blue-200">
            {description}
          </span>
        </div>
      )}
    </div>
  );
}
