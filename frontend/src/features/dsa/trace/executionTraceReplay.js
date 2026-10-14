import { processVisualizationEvent } from '../events/visualizationEventProcessor.js';
import { validateExecutionTrace, normalizeExecutionTrace } from './executionTraceValidator.js';

/**
 * Pre-computes sparse frozen checkpoints every `interval` steps for optimized trace seeking.
 *
 * @param {Object} trace - Normalized execution trace
 * @param {number} interval - Checkpoint interval (default: 10)
 * @returns {Array<{ stepNumber: number, sceneState: Object }>} Array of frozen checkpoints
 */
export function createExecutionTraceCheckpoints(trace, interval = 10) {
  if (!trace || !Array.isArray(trace.steps) || trace.steps.length === 0) {
    return [{ stepNumber: -1, sceneState: Object.freeze(JSON.parse(JSON.stringify(trace?.initialState || {}))) }];
  }

  const checkpoints = [];
  let currentState = JSON.parse(JSON.stringify(trace.initialState));

  // Initial Checkpoint (before step 0)
  checkpoints.push({
    stepNumber: -1,
    sceneState: Object.freeze(JSON.parse(JSON.stringify(currentState))),
  });

  trace.steps.forEach((stepObj) => {
    const events = stepObj.events || [];
    for (const evt of events) {
      currentState = processVisualizationEvent(currentState, evt);
    }

    if (stepObj.stepNumber > 0 && stepObj.stepNumber % interval === 0) {
      checkpoints.push({
        stepNumber: stepObj.stepNumber,
        sceneState: Object.freeze(JSON.parse(JSON.stringify(currentState))),
      });
    }
  });

  return Object.freeze(checkpoints);
}

/**
 * Pure, Deterministic Execution Trace Replay Engine (Phase 12).
 * Reconstructs exact scene state at `targetStepNumber` using sparse checkpoints and event processing.
 *
 * @param {Object} trace - Execution trace object
 * @param {number} targetStepNumber - Target step number
 * @returns {Object} Structured replay result containing sceneState, currentStep, and execution status
 */
export function replayExecutionTrace(trace, targetStepNumber = 0) {
  if (!trace) {
    return {
      sceneState: {},
      currentStepNumber: 0,
      totalSteps: 0,
      isTerminal: true,
      result: null,
      completed: true,
    };
  }

  const normTrace = trace.totalSteps !== undefined ? trace : normalizeExecutionTrace(trace);
  const steps = normTrace.steps || [];

  if (steps.length === 0) {
    return {
      sceneState: normTrace.initialState || {},
      currentStepNumber: 0,
      totalSteps: 0,
      isTerminal: true,
      result: normTrace.result,
      completed: true,
    };
  }

  const minStep = normTrace.minStep;
  const maxStep = normTrace.maxStep;

  // Handle out-of-range seeks gracefully
  const clampedStep = Math.max(minStep, Math.min(targetStepNumber, maxStep));

  // Utilize pre-computed checkpoints or compute nearest checkpoint
  const checkpoints = normTrace._checkpoints || createExecutionTraceCheckpoints(normTrace);
  const nearestCheckpoint = checkpoints
    .filter((cp) => cp.stepNumber <= clampedStep)
    .sort((a, b) => b.stepNumber - a.stepNumber)[0] || checkpoints[0];

  let currentState = JSON.parse(JSON.stringify(nearestCheckpoint.sceneState));

  // Replay steps from nearest checkpoint up to clampedStep
  const stepsToProcess = steps.filter(
    (st) => st.stepNumber > nearestCheckpoint.stepNumber && st.stepNumber <= clampedStep
  );

  for (const stepObj of stepsToProcess) {
    const events = stepObj.events || [];
    for (const evt of events) {
      currentState = processVisualizationEvent(currentState, evt);
    }
  }

  const currentStepObj = steps.find((st) => st.stepNumber === clampedStep) || steps[0];
  const isTerminal = clampedStep >= maxStep;

  return {
    sceneState: currentState,
    currentStep: currentStepObj,
    currentStepNumber: clampedStep,
    totalSteps: steps.length,
    isTerminal,
    result: isTerminal ? normTrace.result : null,
    completed: isTerminal,
  };
}

/**
 * Seeks to an arbitrary step number in an execution trace.
 */
export const seekExecutionTrace = replayExecutionTrace;

/**
 * Advances trace execution to the next step.
 */
export function nextTraceStep(trace, currentStepNumber) {
  const norm = trace.totalSteps !== undefined ? trace : normalizeExecutionTrace(trace);
  return replayExecutionTrace(norm, currentStepNumber + 1);
}

/**
 * Reverts trace execution to the previous step.
 */
export function prevTraceStep(trace, currentStepNumber) {
  const norm = trace.totalSteps !== undefined ? trace : normalizeExecutionTrace(trace);
  return replayExecutionTrace(norm, currentStepNumber - 1);
}

/**
 * Resets trace execution to initial state at Step 0.
 */
export function resetTrace(trace) {
  const norm = trace.totalSteps !== undefined ? trace : normalizeExecutionTrace(trace);
  return replayExecutionTrace(norm, norm.minStep);
}
