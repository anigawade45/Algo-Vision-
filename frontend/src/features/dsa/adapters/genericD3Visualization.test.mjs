/**
 * AlgoVision — Stage 09 Generic D3 Visualization & Replay Integration Tests
 */

import assert from 'assert';
import { validateVisualizationPlan } from './visualizationPlanValidator.js';
import { replayExecutionTrace, seekExecutionTrace, resetTrace } from '../trace/executionTraceReplay.js';
import { adaptTestCaseToInitialState } from './testCaseInputAdapter.js';

export function runGenericD3VisualizationTests() {
  const results = [];

  function test(name, fn) {
    try {
      fn();
      results.push({ name, pass: true });
    } catch (err) {
      results.push({ name, pass: false, error: err.message });
    }
  }

  // --- 1. Client-Side Plan Validation ---

  test('Valid Two Sum plan passes client-side validation', () => {
    const plan = {
      schemaVersion: 1,
      problemId: 'two-sum',
      algorithmFamily: 'array-hashmap',
      layout: 'array-with-map',
      structures: [
        { id: 'nums', type: 'array', source: 'input.nums', label: 'Input Array' },
        { id: 'hashMap', type: 'hashmap', source: 'state.hashMap', label: 'Seen Map' },
      ],
      stateBindings: [
        { visualProperty: 'currentIndex', source: 'state.currentIndex' },
      ],
      explanation: 'Look for complement in hash map.',
    };

    const res = validateVisualizationPlan(plan, 'two-sum');
    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.errors.length, 0);
  });

  test('Malformed plan is rejected before rendering', () => {
    const badPlan = {
      schemaVersion: 1,
      problemId: 'two-sum',
      algorithmFamily: 'quantum-computing',
      layout: 'unsupported-3d',
      structures: [],
    };

    const res = validateVisualizationPlan(badPlan, 'two-sum');
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.length > 0);
  });

  test('Script injection pattern in plan is rejected', () => {
    const maliciousPlan = {
      schemaVersion: 1,
      problemId: 'two-sum',
      algorithmFamily: 'array-hashmap',
      layout: 'array-with-map',
      structures: [
        { id: 'nums', type: 'array', source: 'input.nums' },
      ],
      explanation: '<script>window.location="http://evil.com"</script>',
    };

    const res = validateVisualizationPlan(maliciousPlan, 'two-sum');
    assert.strictEqual(res.isValid, false);
    assert.ok(res.errors.some((e) => e.includes('forbidden executable')));
  });

  // --- 2. Step 0 Independence & Replay Invariants ---

  test('Step 0 renders clean initial state without requiring execution events', () => {
    const testCase = {
      id: 1,
      inputRaw: 'nums = [2, 7, 11, 15], target = 9',
      outputRaw: '[0, 1]',
    };

    const initialStateRes = adaptTestCaseToInitialState(testCase, { problemId: 'two-sum' });
    assert.ok(initialStateRes.initialState);
    assert.strictEqual(initialStateRes.error, null);

    const prims = initialStateRes.initialState.primitives;
    assert.ok(prims.nums);
    assert.deepStrictEqual(prims.nums.values, [2, 7, 11, 15]);
    assert.strictEqual(prims.nums.activeIndex, null);
    assert.deepStrictEqual(prims.nums.matchedIndices, []);
  });

  test('Seeking backward and forward is deterministic', () => {
    const mockTrace = {
      schemaVersion: 1,
      traceId: 'mock-trace-1',
      problemId: 'two-sum',
      initialState: {
        flatState: { currentIndex: null, hashMap: {} },
        primitives: {
          nums: { id: 'nums', type: 'array', values: [2, 7, 11, 15] },
          hashMap: { id: 'hashMap', type: 'hashmap', value: {} },
        },
      },
      steps: [
        {
          stepNumber: 1,
          operation: 'ARRAY_ACCESS',
          events: [
            { type: 'ARRAY_ACCESS', target: 'nums', index: 0, value: 2 },
            { type: 'HASHMAP_SET', target: 'hashMap', key: 2, value: 0 },
          ],
        },
        {
          stepNumber: 2,
          operation: 'ARRAY_ACCESS',
          events: [
            { type: 'ARRAY_ACCESS', target: 'nums', index: 1, value: 7 },
            { type: 'ARRAY_RESULT', target: 'nums', result: [0, 1] },
          ],
        },
      ],
      totalSteps: 2,
      result: [0, 1],
    };

    // Forward to Step 2
    const step2A = replayExecutionTrace(mockTrace, 2);
    // Backward to Step 1
    const step1 = replayExecutionTrace(mockTrace, 1);
    // Forward to Step 2 again
    const step2B = replayExecutionTrace(mockTrace, 2);
    // Reset to Step 0
    const step0 = resetTrace(mockTrace);

    assert.deepStrictEqual(step2A.sceneState, step2B.sceneState);
    assert.strictEqual(step0.currentStepNumber, 0);
    assert.strictEqual(step0.result, null);
    assert.strictEqual(step0.completed, false);
  });

  test('Empty data inputs render safely', () => {
    const emptyCase = {
      id: 1,
      inputRaw: 'nums = [], target = 0',
      outputRaw: '[]',
    };

    const res = adaptTestCaseToInitialState(emptyCase, { problemId: 'two-sum' });
    assert.ok(res.initialState);
    assert.deepStrictEqual(res.initialState.primitives.nums.values, []);
  });

  test('Negative numbers and repeated values are preserved in initial state', () => {
    const negCase = {
      id: 1,
      inputRaw: 'nums = [-1, -5, 3, 3, 0], target = 6',
      outputRaw: '[2, 3]',
    };

    const res = adaptTestCaseToInitialState(negCase, { problemId: 'two-sum' });
    assert.ok(res.initialState);
    assert.deepStrictEqual(res.initialState.primitives.nums.values, [-1, -5, 3, 3, 0]);
  });

  test('Switching test cases resets state completely without stale pointers', () => {
    const caseA = { id: 1, inputRaw: 'nums = [2, 7, 11, 15], target = 9' };
    const caseB = { id: 2, inputRaw: 'nums = [3, 2, 4], target = 6' };

    const stateA = adaptTestCaseToInitialState(caseA, { problemId: 'two-sum' });
    const stateB = adaptTestCaseToInitialState(caseB, { problemId: 'two-sum' });

    assert.notDeepStrictEqual(stateA.initialState.primitives.nums.values, stateB.initialState.primitives.nums.values);
    assert.deepStrictEqual(stateB.initialState.primitives.nums.values, [3, 2, 4]);
    assert.strictEqual(stateB.initialState.primitives.nums.activeIndex, null);
  });

  test('Missing traces never create fake playback steps', () => {
    const nullTraceReplay = replayExecutionTrace(null, 5);
    assert.strictEqual(nullTraceReplay.totalSteps, 0);
    assert.strictEqual(nullTraceReplay.currentStepNumber, 0);
    assert.strictEqual(nullTraceReplay.result, null);
  });

  return { results };
}

// Standalone runner
if (process.argv[1]?.endsWith('genericD3Visualization.test.mjs')) {
  console.log('--- Running Generic D3 Visualization Tests ---');
  const { results } = runGenericD3VisualizationTests();
  let passed = 0;
  for (const r of results) {
    if (r.pass) {
      passed++;
      console.log(`  ✓ [PASS] ${r.name}`);
    } else {
      console.log(`  ✗ [FAIL] ${r.name}: ${r.error}`);
    }
  }
  console.log(`Result: ${passed}/${results.length} passed\n`);
  if (passed !== results.length) process.exit(1);
}
