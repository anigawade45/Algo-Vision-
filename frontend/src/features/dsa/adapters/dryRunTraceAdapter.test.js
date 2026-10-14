import { adaptDryRunToExecutionTrace } from './dryRunTraceAdapter.js';
import { getDryRunMappingForProblem } from './dryRunVisualizationMappings.js';
import { validateExecutionTrace } from '../trace/executionTraceValidator.js';
import { replayExecutionTrace } from '../trace/executionTraceReplay.js';
import { furthestBuildingDryRun } from '../data/dryRun/furthestBuildingDryRun.js';
import { TRACE_SOURCES } from '../trace/executionTraceTypes.js';

/**
 * Automated Verification Suite for Phase 13 Dry Run -> Execution Trace Adapter.
 *
 * @returns {Object} Test results map with PASS/FAIL statuses
 */
export function runDryRunAdapterTests() {
  const results = {
    test1_validDryRunConversion: 'FAIL',
    test2_emptyDryRunHandling: 'FAIL',
    test3_multiStepMultiEvents: 'FAIL',
    test4_pseudocodePreservation: 'FAIL',
    test5_conditionPreservation: 'FAIL',
    test6_actionExplanationPreservation: 'FAIL',
    test7_memoryStateToEventTranslation: 'FAIL',
    test8_resultPreservation: 'FAIL',
    test9_unsupportedFieldDiagnostics: 'FAIL',
    test10_immutabilityAndDeterminism: 'FAIL',
    test11_1642FurthestBuildingConversion: 'FAIL',
    test12_phase12ValidationCompliance: 'FAIL',
    test13_replayStateEquivalence: 'FAIL',
  };

  try {
    // Test 1 & Test 11 & Test 12: 1642 Furthest Building Dry Run Conversion
    const adaptRes = adaptDryRunToExecutionTrace(furthestBuildingDryRun);
    const trace = adaptRes.trace;

    if (
      adaptRes.isValid &&
      trace &&
      trace.source === TRACE_SOURCES.DRY_RUN &&
      trace.problemId === 'furthest-building-1642' &&
      trace.schemaVersion === 1
    ) {
      results.test1_validDryRunConversion = 'PASS';
      results.test11_1642FurthestBuildingConversion = 'PASS';
    }

    const valRes = validateExecutionTrace(trace);
    if (valRes.isValid && valRes.errors.length === 0) {
      results.test12_phase12ValidationCompliance = 'PASS';
    }

    // Test 2: Empty Dry Run
    const emptyRes = adaptDryRunToExecutionTrace({ steps: [] });
    if (!emptyRes.isValid && emptyRes.trace === null && emptyRes.diagnostics.length > 0) {
      results.test2_emptyDryRunHandling = 'PASS';
    }

    // Test 3: Multi-Step & Multi-Events Per Step
    if (trace.steps.length === 6 && trace.steps[4].events.length >= 3) {
      results.test3_multiStepMultiEvents = 'PASS';
    }

    // Test 4: Pseudocode Line Preservation
    if (
      trace.steps[1].metadata.pseudocodeLine === 3 &&
      trace.steps[4].metadata.pseudocodeLine === 5
    ) {
      results.test4_pseudocodePreservation = 'PASS';
    }

    // Test 5: Condition Preservation
    if (
      trace.steps[1].metadata.condition.includes('-2 <= 0') &&
      trace.steps[5].metadata.condition.includes('Cannot proceed')
    ) {
      results.test5_conditionPreservation = 'PASS';
    }

    // Test 6: Action & Explanation Preservation
    if (
      trace.steps[2].explanation.includes('Move to building 2') &&
      trace.steps[4].metadata.action.includes('extract smallest climb')
    ) {
      results.test6_actionExplanationPreservation = 'PASS';
    }

    // Test 7: Memory State to Event Translation
    const step4Events = trace.steps[4].events;
    const hasPointerMove = step4Events.some((e) => e.type === 'ARRAY_POINTER_MOVE' && e.data.index === 4);
    const hasResourceConsume = step4Events.some((e) => e.type === 'RESOURCE_CONSUME' && e.data.value === 2);
    const hasHeapEvent = step4Events.some((e) => e.type.includes('HEAP'));

    if (hasPointerMove && hasResourceConsume && hasHeapEvent) {
      results.test7_memoryStateToEventTranslation = 'PASS';
    }

    // Test 8: Result Preservation
    if (trace.result === 4 && trace.finalState.result === 4) {
      results.test8_resultPreservation = 'PASS';
    }

    // Test 9: Unsupported Field Diagnostics
    const unmappedDryRun = {
      problemId: 'test-unmapped',
      steps: [
        {
          stepNo: 0,
          after: { mysteryVariable: 999, currentIndex: 1 },
        },
      ],
    };
    const unmappedRes = adaptDryRunToExecutionTrace(unmappedDryRun);
    if (unmappedRes.diagnostics.some((d) => d.field === 'mysteryVariable')) {
      results.test9_unsupportedFieldDiagnostics = 'PASS';
    }

    // Test 10: Immutability & Determinism
    const dryRunCopy = JSON.parse(JSON.stringify(furthestBuildingDryRun));
    const adaptA = adaptDryRunToExecutionTrace(furthestBuildingDryRun);
    const adaptB = adaptDryRunToExecutionTrace(furthestBuildingDryRun);

    const isDeterministic = JSON.stringify(adaptA.trace) === JSON.stringify(adaptB.trace);
    const isUnmutated = JSON.stringify(furthestBuildingDryRun) === JSON.stringify(dryRunCopy);

    if (isDeterministic && isUnmutated) {
      results.test10_immutabilityAndDeterminism = 'PASS';
    }

    // Test 13: Replay State Equivalence
    const replayStateStep4 = replayExecutionTrace(trace, 4);
    if (
      replayStateStep4.sceneState.primitives.heights.activeIndex === 4 &&
      replayStateStep4.sceneState.primitives.bricks.value === 2 &&
      replayStateStep4.sceneState.primitives.climbs.values.length === 1 &&
      replayStateStep4.sceneState.primitives.climbs.values[0] === 5 &&
      trace.result === 4
    ) {
      results.test13_replayStateEquivalence = 'PASS';
    }
  } catch (err) {
    console.error('Dry Run Adapter Test Error:', err);
  }

  return results;
}
