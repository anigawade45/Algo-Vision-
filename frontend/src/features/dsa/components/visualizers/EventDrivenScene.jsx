import React, { useMemo } from 'react';
import { getPrimitiveComponent } from './primitives/index.js';
import { replayVisualizationEvents } from '../../events/visualizationEventReplay.js';
import { replayExecutionTrace } from '../../trace/executionTraceReplay.js';
import { furthestBuildingInitialState, furthestBuildingEvents } from '../../events/mockVisualizationEvents.js';

export function EventDrivenScene({ problem, step, stepIndex, state: passedState, highlights: passedHighlights }) {
  const trace = problem?.executionTrace || step?.executionTrace || null;
  const hasCustomInitialState = Boolean(step?.initialState || problem?.initialState);
  const initialState = step?.initialState || problem?.initialState || furthestBuildingInitialState;
  const events = step?.events || problem?.events || (hasCustomInitialState ? [] : furthestBuildingEvents);

  const currentStepNumber = useMemo(() => {
    if (stepIndex !== undefined && typeof stepIndex === 'number') {
      return stepIndex;
    }
    if (step?.stepIndex !== undefined && typeof step.stepIndex === 'number') {
      return step.stepIndex;
    }
    if (step?.stepNumber !== undefined && typeof step.stepNumber === 'number') {
      return step.stepNumber;
    }
    return 0;
  }, [stepIndex, step?.stepIndex, step?.stepNumber]);

  // Use authoritative passedState or replay trace/events up to currentStepNumber
  const sceneState = useMemo(() => {
    if (passedState && typeof passedState === 'object' && Object.keys(passedState).length > 0) {
      return passedState;
    }
    if (trace) {
      const replayRes = replayExecutionTrace(trace, currentStepNumber);
      return replayRes.sceneState || {};
    }
    return replayVisualizationEvents(initialState, events, currentStepNumber);
  }, [passedState, trace, initialState, events, currentStepNumber]);

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
          {trace?.source ? (
            <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono font-semibold text-[11px] border border-purple-500/20">
              {trace.source === 'dry-run' ? 'Dry Run Trace' : 'Mock Trace'}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-semibold text-[11px] border border-emerald-500/20">
              Initial Input State
            </span>
          )}
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Composite Primitives: <strong className="text-blue-600 dark:text-blue-400">{primitiveEntries.length} Active</strong>
          </span>
        </div>

        <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
          {trace ? `Step #${currentStepNumber} Replayed` : 'Initial State • Execution Inactive'}
        </div>
      </div>

      {/* Separate Clearly Labeled Parameter Area (e.g. target, k, resources) */}
      {resourcePrimitives.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
            Parameters:
          </span>
          {resourcePrimitives.map(([id, prim]) => {
            const PrimitiveComp = getPrimitiveComponent(prim.type);
            if (!PrimitiveComp) return null;
            return (
              <div key={id} className="flex items-center">
                <PrimitiveComp {...prim} />
              </div>
            );
          })}
        </div>
      )}

      {/* Main Structural Primitives Canvas */}
      <div className="flex flex-col gap-5">
        {structuralPrimitives.map(([id, prim]) => {
          const PrimitiveComp = getPrimitiveComponent(prim.type);
          if (!PrimitiveComp) return null;

          return (
            <div
              key={id}
              className="bg-white dark:bg-[#0B101D] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col items-center gap-4 overflow-x-auto min-h-[200px] justify-center"
            >
              <div className="w-full flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-500/50"></span>
                  {prim.label || `${prim.type.toUpperCase()} Elements`}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
                  {prim.type}
                </span>
              </div>

              <div className="w-full flex justify-center py-2 overflow-x-auto">
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
