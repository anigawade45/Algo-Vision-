import { adaptTestCaseToInitialState } from './src/features/dsa/adapters/testCaseInputAdapter.js';
import { replayExecutionTrace, seekExecutionTrace, nextTraceStep, prevTraceStep, resetTrace } from './src/features/dsa/trace/executionTraceReplay.js';
import { resolveVisualizationType, VISUALIZATION_TYPES } from './src/features/dsa/data/visualizationTypes.js';
import { normalizeExecutionTrace, validateExecutionTrace } from './src/features/dsa/trace/executionTraceValidator.js';

console.log('================================================================');
console.log('STAGE 09: FRONTEND INTEGRATION & DETERMINISM — TOP K FREQUENT');
console.log('================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    failed++;
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    passed++;
    console.log(`  ✅ PASS: ${message}`);
  }
}

// -------------------------------------------------------------
// 1. Archetype Resolution
// -------------------------------------------------------------
console.log('--- 1. Problem Archetype Resolution ---');
assert(
  resolveVisualizationType({ problemId: 'top-k-frequent' }) === VISUALIZATION_TYPES.BUCKET_SORT,
  'top-k-frequent resolves to BUCKET_SORT archetype'
);
assert(
  resolveVisualizationType({ problemId: 'top-k-frequent-elements' }) === VISUALIZATION_TYPES.BUCKET_SORT,
  'top-k-frequent-elements resolves to BUCKET_SORT archetype'
);
assert(
  resolveVisualizationType({ problemId: '347' }) === VISUALIZATION_TYPES.BUCKET_SORT,
  '347 resolves to BUCKET_SORT archetype'
);
assert(
  resolveVisualizationType({ problemId: 'custom', category: 'Bucket Sort' }) === VISUALIZATION_TYPES.BUCKET_SORT,
  'category containing "Bucket" resolves to BUCKET_SORT archetype'
);

// -------------------------------------------------------------
// 2. Pipeline A: Direct Step 0 State (No Trace Needed)
// -------------------------------------------------------------
console.log('\n--- 2. Pipeline A: Direct Step 0 Normalization ---');
const tc1 = {
  id: 1,
  inputRaw: 'nums = [1,1,1,2,2,3], k = 2',
  outputRaw: '[1, 2]',
  inputStructured: {
    type: 'array_with_k',
    value: { array: [1, 1, 1, 2, 2, 3], k: 2 },
  },
};

const init1 = adaptTestCaseToInitialState(tc1, {
  problemId: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  category: 'Heap / Bucket Sort',
});

assert(init1.success === true, 'Direct normalization succeeded');
assert(init1.initialState !== null, 'Initial state created');
assert(Array.isArray(init1.initialState.nums), 'nums is array');
assert(init1.initialState.nums.length === 6, 'nums has 6 items');
assert(init1.initialState.k === 2, 'k is 2');
assert(typeof init1.initialState.frequencyMap === 'object', 'frequencyMap object exists');
assert(Object.keys(init1.initialState.frequencyMap).length === 0, 'frequencyMap is empty {} at Step 0');
assert(Array.isArray(init1.initialState.buckets), 'buckets array exists');
assert(init1.initialState.buckets.length === 7, 'buckets length is nums.length + 1 = 7');
assert(Array.isArray(init1.initialState.topKResult), 'topKResult array exists');
assert(init1.initialState.topKResult.length === 0, 'topKResult is empty [] at Step 0');
assert(init1.initialState.result === null, 'result is null at Step 0');
assert(init1.initialState.primitives.minHeap === undefined, 'No minHeap primitive fabricated for Bucket Sort');

// -------------------------------------------------------------
// 3. Test-Case Switching (Step 0 Clean Reset)
// -------------------------------------------------------------
console.log('\n--- 3. Test-Case Switching (Clean Reset Invariance) ---');
const tc2 = {
  id: 2,
  inputRaw: 'nums = [1], k = 1',
  outputRaw: '[1]',
  inputStructured: {
    type: 'array_with_k',
    value: { array: [1], k: 1 },
  },
};

const init2 = adaptTestCaseToInitialState(tc2, {
  problemId: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  category: 'Heap / Bucket Sort',
});

assert(init2.success === true, 'Case 2 direct normalization succeeded');
assert(init2.initialState.nums.length === 1, 'Case 2 nums length is 1');
assert(init2.initialState.k === 1, 'Case 2 k is 1');
assert(init2.initialState.buckets.length === 2, 'Case 2 buckets length is 2 (1+1)');
assert(Object.keys(init2.initialState.frequencyMap).length === 0, 'Case 2 frequencyMap is empty');
assert(init2.initialState.topKResult.length === 0, 'Case 2 topKResult is empty');

// -------------------------------------------------------------
// 4. Trace Replay & Determinism
// -------------------------------------------------------------
console.log('\n--- 4. Pipeline B: Deterministic Trace Replay & Seeking ---');

// Build minimal valid bucket sort trace
const bucketTrace = {
  schemaVersion: 1,
  traceId: 'exec-top-k-frequent-tc1',
  problemId: 'top-k-frequent',
  title: 'Top K Frequent Elements',
  initialState: init1.initialState,
  steps: [
    {
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Count frequency of nums[0] = 1',
      operation: 'count_frequency',
      description: 'First occurrence of 1',
      changed: ['currentIndex', 'currentNum', 'frequencyMap'],
      state: {
        nums: [1, 1, 1, 2, 2, 3],
        k: 2,
        currentIndex: 0,
        currentNum: 1,
        frequencyMap: { 1: 1 },
        buckets: Array.from({ length: 7 }, () => []),
        topKResult: [],
        result: null,
      },
      events: [
        {
          id: 'evt-01',
          step: 1,
          type: 'ARRAY_POINTER_MOVE',
          target: { primitiveId: 'nums' },
          data: { index: 0, pointerId: 'i' },
        },
        {
          id: 'evt-02',
          step: 1,
          type: 'HASHMAP_SET',
          target: { primitiveId: 'frequencyMap' },
          data: { key: 1, value: 1 },
        },
      ],
    },
    {
      id: 'step-2',
      stepNumber: 2,
      label: 'Step 2: Place 1 into Bucket [Freq 3]',
      operation: 'bucket_insert',
      description: 'Place 1 into bucket 3',
      changed: ['currentNum', 'currentFrequency', 'buckets'],
      state: {
        nums: [1, 1, 1, 2, 2, 3],
        k: 2,
        currentIndex: null,
        currentNum: 1,
        currentFrequency: 3,
        frequencyMap: { 1: 3, 2: 2, 3: 1 },
        buckets: [[], [], [], [1], [], [], []],
        topKResult: [],
        result: null,
      },
      events: [
        {
          id: 'evt-03',
          step: 2,
          type: 'BUCKET_INSERT',
          target: { primitiveId: 'buckets' },
          data: { frequency: 3, value: 1 },
        },
      ],
    },
    {
      id: 'step-3',
      stepNumber: 3,
      label: 'Step 3: Collect 1 into Top-K Result',
      operation: 'collect_result',
      description: 'Collected 1',
      changed: ['topKResult', 'currentNum'],
      state: {
        nums: [1, 1, 1, 2, 2, 3],
        k: 2,
        currentIndex: null,
        currentNum: 1,
        currentFrequency: 3,
        frequencyMap: { 1: 3, 2: 2, 3: 1 },
        buckets: [[], [3], [2], [1], [], [], []],
        topKResult: [1],
        result: null,
      },
      events: [
        {
          id: 'evt-04',
          step: 3,
          type: 'RESULT_COLLECT',
          target: { primitiveId: 'topKResult' },
          data: { value: 1, frequency: 3 },
        },
      ],
    },
    {
      id: 'step-4',
      stepNumber: 4,
      label: 'Step 4: Algorithm Complete',
      operation: 'complete',
      description: 'Found [1, 2]',
      changed: ['result', 'topKResult'],
      state: {
        nums: [1, 1, 1, 2, 2, 3],
        k: 2,
        currentIndex: null,
        currentNum: null,
        currentFrequency: null,
        frequencyMap: { 1: 3, 2: 2, 3: 1 },
        buckets: [[], [3], [2], [1], [], [], []],
        topKResult: [1, 2],
        result: [1, 2],
      },
      events: [
        {
          id: 'evt-05',
          step: 4,
          type: 'RETURN',
          target: { primitiveId: 'topKResult' },
          data: { value: [1, 2], result: [1, 2] },
        },
      ],
    },
  ],
  result: [1, 2],
};

const normTrace = normalizeExecutionTrace(bucketTrace);
assert(validateExecutionTrace(normTrace).isValid === true, 'Trace validates cleanly');

// Step 0 Verification
const r0 = replayExecutionTrace(normTrace, 0);
assert(r0.currentStepNumber === 0, 'Step 0 currentStepNumber is 0');
assert(r0.sceneState.topKResult.length === 0, 'Step 0 topKResult is empty');
assert(r0.sceneState.result === null, 'Step 0 result is null');
assert(Object.keys(r0.sceneState.frequencyMap).length === 0, 'Step 0 frequencyMap is empty');

// Step 1 Verification
const r1 = replayExecutionTrace(normTrace, 1);
assert(r1.currentStepNumber === 1, 'Step 1 currentStepNumber is 1');
assert(r1.sceneState.frequencyMap['1'] === 1, 'Step 1 frequencyMap has 1 -> 1');

// Step 2 Verification
const r2 = replayExecutionTrace(normTrace, 2);
assert(r2.currentStepNumber === 2, 'Step 2 currentStepNumber is 2');
assert(r2.sceneState.currentFrequency === 3, 'Step 2 currentFrequency is 3');
assert(r2.sceneState.buckets[3].includes(1), 'Step 2 bucket 3 contains 1');

// Step 3 Verification
const r3 = replayExecutionTrace(normTrace, 3);
assert(r3.currentStepNumber === 3, 'Step 3 currentStepNumber is 3');
assert(r3.sceneState.topKResult.includes(1), 'Step 3 topKResult contains 1');

// Step 4 Terminal Verification
const r4 = replayExecutionTrace(normTrace, 4);
assert(r4.currentStepNumber === 4, 'Step 4 currentStepNumber is 4');
assert(r4.isTerminal === true, 'Step 4 is terminal');
assert(r4.completed === true, 'Step 4 completed is true');
assert(JSON.stringify(r4.result) === JSON.stringify([1, 2]), 'Step 4 result is [1, 2]');

// Deterministic Seeking Invariance (Forward, Backward, Reset)
console.log('\n--- 5. Playback Controls & Deterministic Seeking Invariance ---');
const seekForward = seekExecutionTrace(normTrace, 3);
const stepBack = prevTraceStep(normTrace, 3);
const stepForward = nextTraceStep(normTrace, 2);
assert(JSON.stringify(seekForward.sceneState) === JSON.stringify(stepForward.sceneState), 'Seeking to 3 equals stepping to 3');
assert(stepBack.currentStepNumber === 2, 'Step back from 3 reaches 2');

const reset = resetTrace(normTrace);
assert(reset.currentStepNumber === 0, 'Reset returns to Step 0');
assert(reset.sceneState.topKResult.length === 0, 'Reset clears topKResult');

console.log('\n================================================================');
console.log(`ALL ${passed} FRONTEND INTEGRATION TESTS PASSED CLEANLY! (${failed} failed)`);
console.log('================================================================\n');
