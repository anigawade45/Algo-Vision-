import { processVisualizationEvent } from '../events/visualizationEventProcessor.js';
import { validateExecutionTrace, normalizeExecutionTrace } from './executionTraceValidator.js';

// WeakMap cache for trace checkpoints: automatically invalidates when trace reference changes
const CHECKPOINT_CACHE = new WeakMap();

/**
 * Binary search to find the nearest preceding checkpoint with stepNumber <= targetStep.
 * Operates in O(log M) time where M is number of checkpoints.
 */
function findNearestPrecedingCheckpoint(checkpoints, targetStep) {
  let low = 0;
  let high = checkpoints.length - 1;
  let best = checkpoints[0];

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (checkpoints[mid].stepNumber <= targetStep) {
      best = checkpoints[mid];
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return best;
}

/**
 * Binary search to locate the first step index whose stepNumber > checkpointStepNumber.
 * Operates in O(log N) time where N is total steps.
 */
function findFirstStepIndexAfter(steps, checkpointStepNumber) {
  let low = 0;
  let high = steps.length - 1;
  let firstIdx = steps.length;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (steps[mid].stepNumber > checkpointStepNumber) {
      firstIdx = mid;
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return firstIdx;
}

/**
 * Binary search to locate a step by its stepNumber in O(log N) time.
 */
function findStepByNumber(steps, targetStepNumber) {
  let low = 0;
  let high = steps.length - 1;

  while (low <= high) {
    const mid = (low + high) >> 1;
    if (steps[mid].stepNumber === targetStepNumber) {
      return steps[mid];
    }
    if (steps[mid].stepNumber < targetStepNumber) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return steps[0] || null;
}

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

  // Initial Checkpoint (before step 0, genuine pre-execution input state)
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
 * Seeking complexity is bounded by O(log(N/K) + K) using binary search and step range iteration.
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

  // Safeguard 1: Step 0 is always the clean initial state before any events are applied
  if (targetStepNumber <= 0 || targetStepNumber < minStep) {
    const initialPrims = JSON.parse(JSON.stringify(normTrace.initialState?.primitives || normTrace.initialState || {}));
    const flatPrims = {
      currentIndex: null,
      currentNum: null,
      complement: null,
      result: null,
      hashMap: {},
      left: null,
      right: null,
      windowString: '',
      windowChars: {},
      maxLength: 0,
      bestWindow: '',
      bestRange: null,
      bestWindowRange: null,
      windowRange: null,
      frequencyMap: {},
      buckets: initialPrims.buckets?.value || Array.from({ length: (initialPrims.nums?.values?.length || 0) + 1 }, () => []),
      topKResult: [],
      currentFrequency: null,
      k: initialPrims.k?.value ?? null,
      ...(normTrace.initialState?.flatState || {}),
    };
    if (initialPrims.nums?.values) flatPrims.nums = initialPrims.nums.values;
    if (initialPrims.chars?.values) flatPrims.chars = initialPrims.chars.values;
    if (initialPrims.s?.value !== undefined) flatPrims.s = initialPrims.s.value;
    if (initialPrims.target?.value !== undefined) flatPrims.target = initialPrims.target.value;
    if (initialPrims.hashMap?.value !== undefined) flatPrims.hashMap = initialPrims.hashMap.value;
    if (initialPrims.windowChars?.value !== undefined) flatPrims.windowChars = initialPrims.windowChars.value;
    if (initialPrims.k?.value !== undefined) flatPrims.k = initialPrims.k.value;
    if (initialPrims.frequencyMap?.value !== undefined) flatPrims.frequencyMap = initialPrims.frequencyMap.value;
    if (initialPrims.buckets?.value !== undefined) flatPrims.buckets = initialPrims.buckets.value;
    if (initialPrims.topKResult?.value !== undefined) flatPrims.topKResult = initialPrims.topKResult.value;
    if (initialPrims.currentFrequency?.value !== undefined) flatPrims.currentFrequency = initialPrims.currentFrequency.value;

    const pureInitialState = {
      ...normTrace.initialState,
      ...flatPrims,
      primitives: initialPrims,
    };

    return {
      sceneState: pureInitialState,
      currentStep: {
        stepNumber: 0,
        operation: 'INITIAL_INPUT',
        description: 'Initial state before algorithm execution. No comparisons or state mutations have occurred yet.',
        changed: [],
        state: pureInitialState,
        highlights: {},
        events: [],
      },
      currentStepNumber: 0,
      totalSteps: steps.length,
      isTerminal: false,
      result: null,
      completed: false,
    };
  }

  // Handle out-of-range seeks gracefully
  const clampedStep = Math.max(minStep, Math.min(targetStepNumber, maxStep));

  // Retrieve or compute checkpoints safely with WeakMap cache invalidation
  let checkpoints = CHECKPOINT_CACHE.get(normTrace)?.checkpoints;
  if (!checkpoints) {
    checkpoints = normTrace._checkpoints || createExecutionTraceCheckpoints(normTrace);
    if (typeof normTrace === 'object' && normTrace !== null) {
      CHECKPOINT_CACHE.set(normTrace, {
        checkpoints,
        traceId: normTrace.traceId,
        schemaVersion: normTrace.schemaVersion,
        stepCount: steps.length,
      });
    }
  }

  // 1. Locate nearest preceding checkpoint in O(log M) time via binary search
  const nearestCheckpoint = findNearestPrecedingCheckpoint(checkpoints, clampedStep);

  // 2. Clone frozen checkpoint state to ensure immutable isolation
  let currentState = JSON.parse(JSON.stringify(nearestCheckpoint.sceneState));

  // 3. Locate start step in O(log N) and replay at most (K-1) steps up to clampedStep
  const startIdx = findFirstStepIndexAfter(steps, nearestCheckpoint.stepNumber);

  for (let i = startIdx; i < steps.length; i++) {
    const stepObj = steps[i];
    if (stepObj.stepNumber > clampedStep) break;
    const events = stepObj.events || [];
    for (const evt of events) {
      currentState = processVisualizationEvent(currentState, evt);
    }
  }

  // 4. Locate authoritative current step in O(log N) time
  const currentStepObj = findStepByNumber(steps, clampedStep) || steps[0];
  const isTerminal = clampedStep >= maxStep;

  // Harmonize currentState with authoritative step state
  if (currentStepObj?.state) {
    Object.assign(currentState, currentStepObj.state);
    if (currentStepObj.state.bestRange !== undefined && currentState.bestWindowRange === undefined) {
      currentState.bestWindowRange = currentStepObj.state.bestRange;
    }
  }

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
  return replayExecutionTrace(norm, Math.max(0, currentStepNumber - 1));
}

/**
 * Resets trace execution to initial state at Step 0.
 */
export function resetTrace(trace) {
  const norm = trace.totalSteps !== undefined ? trace : normalizeExecutionTrace(trace);
  return replayExecutionTrace(norm, 0);
}
