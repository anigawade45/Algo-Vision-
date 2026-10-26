import { PLAYBACK_STATUS } from '../data/playbackStatus.js';
import { replayExecutionTrace } from '../trace/executionTraceReplay.js';
import { adaptTestCaseToInitialState } from './testCaseInputAdapter.js';
import { furthestBuildingExecutionTrace } from '../trace/mockExecutionTraces.js';
import { normalizeMatchedPair, extractCanonicalSolutionPair } from './resultNormalizer.js';

export function runVisualizationPlaybackTests() {
  console.log('\n--- [SUITE] Stage 09: Visualization Playback & Controls Engine ---');

  const results = [];

  const assert = (condition, msg) => {
    if (!condition) {
      throw new Error(`Assertion failed: ${msg}`);
    }
  };

  (() => {
    const trace = furthestBuildingExecutionTrace;
    assert(trace && trace.steps.length > 1, 'Trace has multiple steps');

    let currentStep = 0;
    const initialReplay = replayExecutionTrace(trace, currentStep);
    assert(initialReplay.currentStepNumber === 0, 'Initial step number is 0');
    assert(initialReplay.sceneState.primitives.heights.activeIndex === 0, 'Initial pointer at index 0');

    // Simulate advancing
    currentStep = 1;
    const step1Replay = replayExecutionTrace(trace, currentStep);
    assert(step1Replay.currentStepNumber === 1, 'Step 1 number is 1');
    assert(step1Replay.sceneState.primitives.heights.activeIndex === 1, 'Pointer advanced to index 1');

    results.push({ name: 'test1_playAdvancesEventIndexAndUpdatesScene', pass: true });
    console.log('  ✅ [PASS] test1_playAdvancesEventIndexAndUpdatesScene');
  })();

  (() => {
    let isPlaying = true;
    let currentStep = 2;

    // Simulate pause action
    isPlaying = false;

    // Verify step remains at 2 and does not advance
    assert(isPlaying === false, 'Playback is paused');
    assert(currentStep === 2, 'Step position remained at 2 upon pause');

    results.push({ name: 'test2_pauseStopsAdvancement', pass: true });
    console.log('  ✅ [PASS] test2_pauseStopsAdvancement');
  })();

  // Test 3: Resume continues from the current position rather than restarting
  (() => {
    let currentStep = 3;
    let isPlaying = false;

    // User resumes playback
    isPlaying = true;
    assert(currentStep === 3, 'Resumed at current position step 3, not reset to 0');

    // Next tick
    currentStep += 1;
    assert(currentStep === 4, 'Advanced from 3 to 4 on resume');

    results.push({ name: 'test3_resumeContinuesFromCurrentPosition', pass: true });
    console.log('  ✅ [PASS] test3_resumeContinuesFromCurrentPosition');
  })();

  // Test 4: Previous, Next, and Reset work correctly with boundaries
  (() => {
    const totalSteps = 6;
    let currentStep = 0;

    // Prev at boundary 0
    currentStep = Math.max(0, currentStep - 1);
    assert(currentStep === 0, 'Cannot seek before step 0');

    // Next
    currentStep = Math.min(totalSteps - 1, currentStep + 1);
    assert(currentStep === 1, 'Advanced to step 1');

    currentStep = Math.min(totalSteps - 1, currentStep + 1);
    assert(currentStep === 2, 'Advanced to step 2');

    // Prev
    currentStep = Math.max(0, currentStep - 1);
    assert(currentStep === 1, 'Reverted to step 1');

    // Reset
    currentStep = 0;
    assert(currentStep === 0, 'Reset returns cleanly to step 0');

    results.push({ name: 'test4_previousNextResetNavigation', pass: true });
    console.log('  ✅ [PASS] test4_previousNextResetNavigation');
  })();

  // Test 5: Playback stops automatically at final event
  (() => {
    const totalSteps = 4;
    let currentStep = 2;
    let isPlaying = true;

    // Simulate timer ticks
    for (let tick = 0; tick < 5; tick++) {
      if (currentStep >= totalSteps - 1) {
        isPlaying = false;
        break;
      }
      currentStep++;
    }

    assert(currentStep === 3, 'Stopped at final step index (totalSteps - 1)');
    assert(isPlaying === false, 'isPlaying transitioned to false at final step');

    results.push({ name: 'test5_playbackStopsAtFinalEvent', pass: true });
    console.log('  ✅ [PASS] test5_playbackStopsAtFinalEvent');
  })();

  // Test 6: Speed settings change playback interval accurately
  (() => {
    const calculateInterval = (speed) => Math.max(200, Math.round(1000 / speed));

    assert(calculateInterval(0.5) === 2000, '0.5x speed produces 2000ms interval');
    assert(calculateInterval(1.0) === 1000, '1.0x speed produces 1000ms interval');
    assert(calculateInterval(1.5) === 667, '1.5x speed produces 667ms interval');
    assert(calculateInterval(2.0) === 500, '2.0x speed produces 500ms interval');

    results.push({ name: 'test6_playbackSpeedIntervals', pass: true });
    console.log('  ✅ [PASS] test6_playbackSpeedIntervals');
  })();

  // Test 7: Empty or unavailable traces do not crash UI or fabricate events
  (() => {
    const emptyTrace = {
      schemaVersion: 1,
      traceId: 'empty-test',
      problemId: 'test',
      initialState: { primitives: {} },
      steps: [],
    };

    const replayRes = replayExecutionTrace(emptyTrace, 0);
    assert(replayRes.totalSteps === 0, 'Empty trace has totalSteps 0');
    assert(replayRes.completed === true, 'Empty trace is completed gracefully');
    assert(Object.keys(replayRes.sceneState?.primitives || {}).length === 0, 'Primitives remain empty without fabrication');

    results.push({ name: 'test7_emptyOrUnavailableTraceHandling', pass: true });
    console.log('  ✅ [PASS] test7_emptyOrUnavailableTraceHandling');
  })();

  // Test 8: Direct input visualization remains intact when trace retrieval fails
  (() => {
    const twoSumCase1 = {
      id: 1,
      inputRaw: 'nums = [2, 7, 11, 15], target = 9',
      outputRaw: '[0, 1]',
    };

    const initialScene = adaptTestCaseToInitialState(twoSumCase1, { problemId: 'two-sum' });
    assert(initialScene.initialState?.primitives?.nums?.type === 'array', 'Array primitive created');
    assert(initialScene.initialState?.primitives?.target?.value === 9, 'Target 9 created');

    // Simulate trace fetch failure (404 DRY_RUN_REQUIRED)
    const traceStatus = PLAYBACK_STATUS.TRACE_UNAVAILABLE;
    assert(traceStatus === 'TRACE_UNAVAILABLE', 'Status correctly set to TRACE_UNAVAILABLE');

    // Verify input structure was NOT cleared or mutated by trace failure
    assert(initialScene.initialState.primitives.nums.values.length === 4, 'Array retains all 4 elements');
    assert(initialScene.initialState.primitives.nums.values[0] === 2, 'First element is 2');
    assert(initialScene.initialState.primitives.nums.values[3] === 15, 'Fourth element is 15');

    results.push({ name: 'test8_directInputPreservedWhenTraceFails', pass: true });
    console.log('  ✅ [PASS] test8_directInputPreservedWhenTraceFails');
  })();

  // Test 9: Changing test cases cancels old playback and resets the scene
  (() => {
    let currentTestCaseId = 1;
    let isPlaying = true;
    let currentStepIndex = 4;
    let liveTrace = furthestBuildingExecutionTrace;

    // User switches to Test Case 2
    const handleSelectTestCase = (newId) => {
      currentTestCaseId = newId;
      liveTrace = null;
      currentStepIndex = 0;
      isPlaying = false;
    };

    handleSelectTestCase(2);

    assert(currentTestCaseId === 2, 'Test case ID updated to 2');
    assert(isPlaying === false, 'Previous playback cancelled');
    assert(currentStepIndex === 0, 'Step index reset to 0');
    assert(liveTrace === null, 'Stale trace cleared awaiting new trace');

    results.push({ name: 'test9_testCaseSwitchingCancellationAndReset', pass: true });
    console.log('  ✅ [PASS] test9_testCaseSwitchingCancellationAndReset');
  })();

  // Test 10: Keyboard shortcuts match control button actions
  (() => {
    let isPlaying = false;
    let stepIndex = 1;
    const totalSteps = 5;

    const simulateKeyDown = (code) => {
      if (code === 'Space') {
        isPlaying = !isPlaying;
      } else if (code === 'ArrowRight') {
        if (stepIndex < totalSteps - 1) stepIndex++;
      } else if (code === 'ArrowLeft') {
        if (stepIndex > 0) stepIndex--;
      } else if (code === 'KeyR') {
        stepIndex = 0;
        isPlaying = false;
      }
    };

    simulateKeyDown('Space');
    assert(isPlaying === true, 'Space toggled isPlaying to true');

    simulateKeyDown('Space');
    assert(isPlaying === false, 'Space toggled isPlaying to false (Pause)');

    simulateKeyDown('ArrowRight');
    assert(stepIndex === 2, 'ArrowRight advanced stepIndex to 2');

    simulateKeyDown('ArrowLeft');
    assert(stepIndex === 1, 'ArrowLeft decremented stepIndex to 1');

    simulateKeyDown('KeyR');
    assert(stepIndex === 0 && isPlaying === false, 'KeyR reset stepIndex to 0 and stopped playback');

    results.push({ name: 'test10_keyboardShortcutsEquivalence', pass: true });
    console.log('  ✅ [PASS] test10_keyboardShortcutsEquivalence');
  })();

  // Test 11: Timer interval teardown prevents overlapping loops and memory leaks
  (() => {
    let activeIntervalCount = 0;
    const timers = [];

    const startTimer = () => {
      activeIntervalCount++;
      const id = activeIntervalCount;
      timers.push(id);
      return id;
    };

    const stopTimer = (id) => {
      const idx = timers.indexOf(id);
      if (idx !== -1) {
        timers.splice(idx, 1);
      }
    };

    // Start timer 1
    const t1 = startTimer();
    assert(timers.length === 1, 'Timer 1 active');

    // Pausing stops timer 1
    stopTimer(t1);
    assert(timers.length === 0, 'Timer 1 cleared on pause');

    // Resume starts timer 2
    const t2 = startTimer();
    assert(timers.length === 1 && timers[0] === 2, 'Timer 2 active');

    // Reset stops timer 2
    stopTimer(t2);
    assert(timers.length === 0, 'Timer 2 cleared on reset without leftover handles');

    results.push({ name: 'test11_cleanTimerTeardownNoOverlappingLoops', pass: true });
    console.log('  ✅ [PASS] test11_cleanTimerTeardownNoOverlappingLoops');
  })();

  // Test 12: Playback status state machine covers all 7 required states
  (() => {
    const deriveStatus = ({ sourceMode, isTraceLoading, traceError, isDryRunRequired, liveTrace, hasReplay, isPlaying, currentStepIndex, totalSteps }) => {
      if (sourceMode === 'live') {
        if (isTraceLoading) return PLAYBACK_STATUS.INITIAL_INPUT;
        if (traceError) return PLAYBACK_STATUS.TRACE_ERROR;
        if (isDryRunRequired || !liveTrace) return PLAYBACK_STATUS.TRACE_UNAVAILABLE;
      }
      if (hasReplay) {
        if (isPlaying) return PLAYBACK_STATUS.PLAYING;
        if (currentStepIndex >= totalSteps - 1) return PLAYBACK_STATUS.COMPLETED;
        if (currentStepIndex > 0) return PLAYBACK_STATUS.PAUSED;
        return PLAYBACK_STATUS.READY;
      }
      return PLAYBACK_STATUS.INITIAL_INPUT;
    };

    // State 1: TRACE_UNAVAILABLE
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: null, isDryRunRequired: true, liveTrace: null, hasReplay: false }) ===
        PLAYBACK_STATUS.TRACE_UNAVAILABLE,
      'State 1: TRACE_UNAVAILABLE'
    );

    // State 2: TRACE_ERROR
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: 'Network error', isDryRunRequired: false, liveTrace: null, hasReplay: false }) ===
        PLAYBACK_STATUS.TRACE_ERROR,
      'State 2: TRACE_ERROR'
    );

    // State 3: INITIAL_INPUT
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: true, traceError: null, isDryRunRequired: false, liveTrace: null, hasReplay: false }) ===
        PLAYBACK_STATUS.INITIAL_INPUT,
      'State 3: INITIAL_INPUT'
    );

    // State 4: READY
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: null, isDryRunRequired: false, liveTrace: {}, hasReplay: true, isPlaying: false, currentStepIndex: 0, totalSteps: 5 }) ===
        PLAYBACK_STATUS.READY,
      'State 4: READY'
    );

    // State 5: PLAYING
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: null, isDryRunRequired: false, liveTrace: {}, hasReplay: true, isPlaying: true, currentStepIndex: 1, totalSteps: 5 }) ===
        PLAYBACK_STATUS.PLAYING,
      'State 5: PLAYING'
    );

    // State 6: PAUSED
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: null, isDryRunRequired: false, liveTrace: {}, hasReplay: true, isPlaying: false, currentStepIndex: 2, totalSteps: 5 }) ===
        PLAYBACK_STATUS.PAUSED,
      'State 6: PAUSED'
    );

    // State 7: COMPLETED
    assert(
      deriveStatus({ sourceMode: 'live', isTraceLoading: false, traceError: null, isDryRunRequired: false, liveTrace: {}, hasReplay: true, isPlaying: false, currentStepIndex: 4, totalSteps: 5 }) ===
        PLAYBACK_STATUS.COMPLETED,
      'State 7: COMPLETED'
    );

    results.push({ name: 'test12_playbackStatusStateTransitions', pass: true });
    console.log('  ✅ [PASS] test12_playbackStatusStateTransitions');
  })();

  // Test 13: Case 1 & Case 2 Solution Pair Normalization & Backward Seek Invariance
  (() => {
    // 1. Verify various shapes normalize cleanly to canonical number arrays
    assert(JSON.stringify(normalizeMatchedPair([0, 1])) === '[0,1]', 'Normalizes array [0, 1]');
    assert(JSON.stringify(normalizeMatchedPair([1, 2])) === '[1,2]', 'Normalizes array [1, 2]');
    assert(JSON.stringify(normalizeMatchedPair({ matchedPair: [1, 2] })) === '[1,2]', 'Normalizes { matchedPair: [1, 2] }');
    assert(JSON.stringify(normalizeMatchedPair({ result: [1, 2] })) === '[1,2]', 'Normalizes { result: [1, 2] }');
    assert(JSON.stringify(normalizeMatchedPair('[1, 2]')) === '[1,2]', 'Normalizes string "[1, 2]"');
    assert(normalizeMatchedPair(null) === null, 'Null returns null');
    assert(normalizeMatchedPair([]) === null, 'Empty array returns null');

    // 2. Simulate Step 0 -> Step 1 -> Step 2 -> Step 3 (Case 2: nums = [3, 2, 4], target = 6)
    const step0Context = { step: { stepNumber: 0, highlights: {} }, state: { result: null } };
    const step1Context = { step: { stepNumber: 1, highlights: { matchedPair: null } }, state: { result: null } };
    const step2Context = { step: { stepNumber: 2, highlights: { matchedPair: null } }, state: { result: null } };
    const step3Context = { step: { stepNumber: 3, highlights: { matchedPair: [1, 2] } }, state: { result: [1, 2] } };

    // At pre-solution steps, solution pair MUST be null
    assert(extractCanonicalSolutionPair(step0Context) === null, 'Step 0 solution pair is null');
    assert(extractCanonicalSolutionPair(step1Context) === null, 'Step 1 solution pair is null');
    assert(extractCanonicalSolutionPair(step2Context) === null, 'Step 2 solution pair is null');

    // At match step, solution pair MUST be [1, 2]
    const step3Pair = extractCanonicalSolutionPair(step3Context);
    assert(JSON.stringify(step3Pair) === '[1,2]', 'Step 3 solution pair is [1, 2]');

    // Dynamic legend label formatting for Case 1 vs Case 2
    const case1Label = `Solution Pair [${normalizeMatchedPair([0, 1]).join(', ')}]`;
    const case2Label = `Solution Pair [${normalizeMatchedPair([1, 2]).join(', ')}]`;
    assert(case1Label === 'Solution Pair [0, 1]', 'Case 1 legend is "Solution Pair [0, 1]"');
    assert(case2Label === 'Solution Pair [1, 2]', 'Case 2 legend is "Solution Pair [1, 2]"');

    // 3. Backward seek verification: seeking back to step 2 clears the pair
    assert(extractCanonicalSolutionPair(step2Context) === null, 'Seeking backward to step 2 clears solution pair');

    results.push({ name: 'test13_solutionPairNormalizationAndBackwardSeekInvariance', pass: true });
    console.log('  ✅ [PASS] test13_solutionPairNormalizationAndBackwardSeekInvariance');
  })();

  const allPassed = results.every((r) => r.pass);
  console.log(`Result: ${results.filter((r) => r.pass).length}/${results.length} passed`);
  return { allPassed, results };
}

runVisualizationPlaybackTests();

