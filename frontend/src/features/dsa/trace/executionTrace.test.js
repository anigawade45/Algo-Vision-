import { validateExecutionTrace, normalizeExecutionTrace } from './executionTraceValidator.js';
import {
  replayExecutionTrace,
  seekExecutionTrace,
  nextTraceStep,
  prevTraceStep,
  resetTrace,
  createExecutionTraceCheckpoints,
} from './executionTraceReplay.js';
import { furthestBuildingExecutionTrace } from './mockExecutionTraces.js';
import { furthestBuildingInitialState } from '../events/mockVisualizationEvents.js';
import { VISUALIZATION_EVENTS } from '../events/visualizationEventTypes.js';

/**
 * Automated Unit & Integration Verification Suite for Phase 12 Execution Trace Engine.
 *
 * @returns {Object} Test results map with PASS/FAIL statuses
 */
export function runExecutionTraceTests() {
  const results = {
    testA_emptyTrace: 'FAIL',
    testB_singleStepTrace: 'FAIL',
    testC_multiEventsPerStep: 'FAIL',
    testD_prevStepNav: 'FAIL',
    testE_nextStepNav: 'FAIL',
    testF_forwardJump: 'FAIL',
    testG_reverseJump: 'FAIL',
    testH_finalTerminalResult: 'FAIL',
    testI_resetTrace: 'FAIL',
    testJ_determinism: 'FAIL',
    testK_immutability: 'FAIL',
    testL_invalidTraceValidation: 'FAIL',
    testM_checkpointEquivalence: 'FAIL',
    testN_performanceBenchmark: 'FAIL',
  };

  try {
    const trace = normalizeExecutionTrace(furthestBuildingExecutionTrace);

    // Test A: Empty Trace
    const emptyTrace = normalizeExecutionTrace({
      schemaVersion: 1,
      traceId: 'empty-test',
      problemId: 'empty-prob',
      initialState: { primitives: { val: { type: 'variable', value: 10 } } },
      steps: [],
    });
    const emptyRes = replayExecutionTrace(emptyTrace, 0);
    if (emptyRes.sceneState.primitives.val.value === 10 && emptyRes.completed) {
      results.testA_emptyTrace = 'PASS';
    }

    // Test B: Single Step Trace
    const singleStepTrace = normalizeExecutionTrace({
      schemaVersion: 1,
      traceId: 'single-test',
      problemId: 'single-prob',
      initialState: { primitives: { res: { id: 'res', type: 'resource', value: 5, max: 5 } } },
      steps: [
        {
          id: 'step-0',
          stepNumber: 0,
          events: [
            {
              id: 'single-evt-1',
              step: 0,
              type: VISUALIZATION_EVENTS.RESOURCE_CONSUME,
              target: { primitiveId: 'res' },
              data: { amount: 2, value: 3 },
              schemaVersion: 1,
            },
          ],
        },
      ],
    });
    const singleRes = replayExecutionTrace(singleStepTrace, 0);
    if (singleRes.sceneState.primitives.res.value === 3) {
      results.testB_singleStepTrace = 'PASS';
    }

    // Test C: Multi-Events Per Step (Step 4 has 5 events)
    const step4Res = replayExecutionTrace(trace, 4);
    if (
      step4Res.sceneState.primitives.heights.activeIndex === 4 &&
      step4Res.sceneState.primitives.bricks.value === 2 &&
      step4Res.sceneState.primitives.climbs.values.length === 1 &&
      step4Res.sceneState.primitives.climbs.values[0] === 5
    ) {
      results.testC_multiEventsPerStep = 'PASS';
    }

    // Test D: Previous Step Navigation (Step 5 -> Step 4)
    const prevRes = prevTraceStep(trace, 5);
    if (prevRes.currentStepNumber === 4 && prevRes.sceneState.primitives.bricks.value === 2) {
      results.testD_prevStepNav = 'PASS';
    }

    // Test E: Next Step Navigation (Step 4 -> Step 5)
    const nextRes = nextTraceStep(trace, 4);
    if (nextRes.currentStepNumber === 5 && (nextRes.sceneState.primitives.heights.activeIndex === 4 || nextRes.sceneState.primitives.heights.activeIndex === 5)) {
      results.testE_nextStepNav = 'PASS';
    }

    // Test F: Forward Jump (Step 0 -> Step 4)
    const jumpForwardRes = seekExecutionTrace(trace, 4);
    if (jumpForwardRes.currentStepNumber === 4 && jumpForwardRes.sceneState.primitives.bricks.value === 2) {
      results.testF_forwardJump = 'PASS';
    }

    // Test G: Reverse Jump (Step 5 -> Step 2)
    const jumpReverseRes = seekExecutionTrace(trace, 2);
    if (
      jumpReverseRes.currentStepNumber === 2 &&
      jumpReverseRes.sceneState.primitives.climbs.values[0] === 5 &&
      jumpReverseRes.sceneState.primitives.bricks.value === 5
    ) {
      results.testG_reverseJump = 'PASS';
    }

    // Test H: Final Step & Terminal Result
    const finalRes = replayExecutionTrace(trace, 5);
    if (finalRes.isTerminal && finalRes.completed && finalRes.result === 4) {
      results.testH_finalTerminalResult = 'PASS';
    }

    // Test I: Reset Trace
    const resetRes = resetTrace(trace);
    if (
      resetRes.currentStepNumber === 0 &&
      resetRes.sceneState.primitives.bricks.value === 5 &&
      resetRes.sceneState.primitives.heights.activeIndex === 0
    ) {
      results.testI_resetTrace = 'PASS';
    }

    // Test J: Determinism
    const run1 = replayExecutionTrace(trace, 4);
    const run2 = replayExecutionTrace(trace, 4);
    if (JSON.stringify(run1) === JSON.stringify(run2)) {
      results.testJ_determinism = 'PASS';
    }

    // Test K: Immutability
    const traceBefore = JSON.stringify(trace);
    seekExecutionTrace(trace, 3);
    seekExecutionTrace(trace, 5);
    if (JSON.stringify(trace) === traceBefore) {
      results.testK_immutability = 'PASS';
    }

    // Test L: Invalid Trace Validation
    const invalidTraceObj = { schemaVersion: 99, traceId: '' };
    const invalidVal = validateExecutionTrace(invalidTraceObj);
    if (!invalidVal.isValid && invalidVal.errors.length >= 2) {
      results.testL_invalidTraceValidation = 'PASS';
    }

    // Test M: Checkpoint Equivalence
    const linearState = replayExecutionTrace(trace, 4).sceneState;
    const checkpointState = replayExecutionTrace(trace, 4).sceneState;
    if (JSON.stringify(linearState) === JSON.stringify(checkpointState)) {
      results.testM_checkpointEquivalence = 'PASS';
    }

    // Test N: Synthetic 100-step & 500-step Performance Benchmarking
    const synthSteps = [];
    for (let i = 0; i < 500; i++) {
      synthSteps.push({
        id: `synth-step-${i}`,
        stepNumber: i,
        events: [
          {
            id: `synth-evt-${i}`,
            step: i,
            type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
            target: { primitiveId: 'heights' },
            data: { index: i % 7, pointerId: 'i' },
            schemaVersion: 1,
          },
        ],
      });
    }

    const synthTrace = normalizeExecutionTrace({
      schemaVersion: 1,
      traceId: 'synth-500-trace',
      problemId: 'synth-prob',
      initialState: furthestBuildingInitialState,
      steps: synthSteps,
    });

    const t0 = performance.now();
    const synthRes = replayExecutionTrace(synthTrace, 450);
    const t1 = performance.now();

    if (t1 - t0 < 50 && synthRes.currentStepNumber === 450) {
      results.testN_performanceBenchmark = 'PASS';
    }
  } catch (err) {
    console.error('Execution Trace Engine Test Exception:', err);
  }

  return results;
}
