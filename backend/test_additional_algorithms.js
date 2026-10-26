/**
 * Test Suite: Additional Registered Algorithms (LeetCode 20, 206, 94)
 */

const assert = require('assert');
const {
  traceTwoSumAlgorithm,
  traceLongestSubstringAlgorithm,
  traceTopKFrequentBucketSort,
  traceValidParenthesesAlgorithm,
  traceReverseLinkedListAlgorithm,
  traceBinaryTreeInorderAlgorithm,
  traceMinimumDepthAlgorithm,
  traceMaximumDepthAlgorithm,
  extractLinkedListInput,
  extractTreeInput,
  extractNumsArray,
  validateVisualizationEvent,
  validateExecutionTrace,
  normalizeExecutionTrace,
  areResultsEquivalent,
  deepFreeze,
  getDryRunMappingForProblem,
  adaptDryRunToExecutionTrace,
  resolveTestCase,
  VISUALIZATION_EVENTS,
  getVisualizationTrace,
  inputNormalizer,
  SUPPORT_STATES,
  EXECUTION_AVAILABILITY,
  TRACE_VALIDITY,
  RESULT_VERIFICATION,
  validateTraceInvariants,
  determineSupportStateAndDimensions,
} = require('./src/services/problemVisualization.service');

const {
  executeInRestrictedSandbox,
  executeCandidateInSandboxWithTrace,
  buildTraceFromSandboxExecution,
  SandboxExecutionError,
} = require('./src/services/restrictedSandbox.service');

const {
  executeWithTrace,
  hasStrategy,
  getStrategy,
  registerStrategy,
  resolveCanonicalProblemId,
  sanitizeAndClampLimits,
  DEFAULT_LIMITS,
  SERVER_MAX_LIMITS,
  hasFamilyEngine,
  getFamilyEngine,
  listFamilyEngines,
} = require('./src/services/executionStrategyRegistry');

const {
  traceArrayHashMapFamily,
  traceTwoPointersFamily,
  traceStackQueueFamily,
  traceLinkedListFamily,
  traceBinaryTreeFamily,
  traceGraphFamily,
  traceHeapFamily,
  traceDynamicProgrammingFamily,
} = require('./src/services/reusableExecutionEngines.service');

const {
  DEFAULT_PLANS,
  validateVisualizationPlan,
} = require('./src/services/visualizationPlan.service');

console.log('================================================================');
console.log('ALGOVISION: ADDITIONAL LEETCODE ALGORITHMS TEST SUITE');
console.log('================================================================\n');

let pass = 0;
let fail = 0;

function it(desc, fn) {
  try {
    fn();
    pass++;
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    fail++;
    console.error(`  ✗ [FAIL] ${desc}`);
    console.error(err);
  }
}

async function itAsync(desc, fn) {
  try {
    await fn();
    pass++;
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    fail++;
    console.error(`  ✗ [FAIL] ${desc}`);
    console.error(err);
  }
}

// 1. Valid Parentheses (LeetCode 20)
console.log('--- 1. Valid Parentheses (LeetCode 20) ---');

it('Strategy registration exists for valid-parentheses and alias 20', () => {
  assert.strictEqual(hasStrategy('valid-parentheses'), true);
  assert.strictEqual(hasStrategy('20'), true);
  assert.strictEqual(getStrategy('20').metadata.algorithmFamily, 'stack');
});

it('Default visualization plan is valid for valid-parentheses', () => {
  const plan = DEFAULT_PLANS['valid-parentheses'];
  const res = validateVisualizationPlan(plan, 'valid-parentheses');
  assert.strictEqual(res.isValid, true);
});

it('Traces balanced brackets correctly ("()[]{}")', () => {
  const trace = traceValidParenthesesAlgorithm('()[]{}');
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.strictEqual(trace.result, true);
  assert.strictEqual(trace.finalState.isValid, true);
  assert.ok(trace.steps.length >= 6);
});

it('Traces nested balanced brackets correctly ("{[()]}")', () => {
  const trace = traceValidParenthesesAlgorithm('{[()]}');
  assert.strictEqual(trace.result, true);
  assert.strictEqual(trace.finalState.isValid, true);
});

it('Detects bracket mismatch and terminates early ("(]")', () => {
  const trace = traceValidParenthesesAlgorithm('(]');
  assert.strictEqual(trace.result, false);
  assert.strictEqual(trace.finalState.isValid, false);
  const lastStep = trace.steps[trace.steps.length - 1];
  assert.strictEqual(lastStep.state.isValid, false);
});

it('Detects extra opening bracket at end ("(()")', () => {
  const trace = traceValidParenthesesAlgorithm('(()');
  assert.strictEqual(trace.result, false);
  assert.strictEqual(trace.finalState.isValid, false);
});

it('Executes via executionStrategyRegistry with alias 20', () => {
  const res = executeWithTrace(
    { problemId: '20' },
    { testCase: { inputRaw: 's = "{[]}"' } }
  );
  assert.strictEqual(res.isSupported, true);
  assert.strictEqual(res.trace.result, true);
});

// 2. Reverse Linked List (LeetCode 206)
console.log('\n--- 2. Reverse Linked List (LeetCode 206) ---');

it('Strategy registration exists for reverse-linked-list and aliases 206, reverse-list', () => {
  assert.strictEqual(hasStrategy('reverse-linked-list'), true);
  assert.strictEqual(hasStrategy('reverse-list'), true);
  assert.strictEqual(hasStrategy('206'), true);
  assert.strictEqual(getStrategy('206').metadata.algorithmFamily, 'linked-list');
});

it('Default visualization plan is valid for reverse-linked-list', () => {
  const plan = DEFAULT_PLANS['reverse-linked-list'];
  const res = validateVisualizationPlan(plan, 'reverse-linked-list');
  assert.strictEqual(res.isValid, true);
});

it('Extracts linked list inputs from raw strings and structured objects', () => {
  assert.deepStrictEqual(extractLinkedListInput({ inputRaw: 'head = [1,2,3]' }), [1, 2, 3]);
  assert.deepStrictEqual(extractLinkedListInput({ inputStructured: { head: [4, 5] } }), [4, 5]);
});

it('Reverses a standard list [1, 2, 3, 4, 5]', () => {
  const trace = traceReverseLinkedListAlgorithm([1, 2, 3, 4, 5]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.deepStrictEqual(trace.result, [5, 4, 3, 2, 1]);
  assert.strictEqual(trace.finalState.head, 5);
  // Each node has 3 phases (next, reverse link, advance pointers) + final return
  assert.strictEqual(trace.steps.length, 5 * 3 + 1);
});

it('Handles empty list [] cleanly', () => {
  const trace = traceReverseLinkedListAlgorithm([]);
  assert.deepStrictEqual(trace.result, []);
  assert.strictEqual(trace.steps.length, 1);
});

it('Executes via executionStrategyRegistry with alias 206', () => {
  const res = executeWithTrace(
    { problemId: '206' },
    { testCase: { inputRaw: 'head = [10, 20, 30]' } }
  );
  assert.strictEqual(res.isSupported, true);
  assert.deepStrictEqual(res.trace.result, [30, 20, 10]);
});

// 3. Binary Tree Inorder Traversal (LeetCode 94)
console.log('\n--- 3. Binary Tree Inorder Traversal (LeetCode 94) ---');

it('Strategy registration exists for binary-tree-inorder-traversal and aliases 94, inorder-traversal', () => {
  assert.strictEqual(hasStrategy('binary-tree-inorder-traversal'), true);
  assert.strictEqual(hasStrategy('inorder-traversal'), true);
  assert.strictEqual(hasStrategy('94'), true);
  assert.strictEqual(getStrategy('94').metadata.algorithmFamily, 'binary-tree');
});

it('Default visualization plan is valid for binary-tree-inorder-traversal', () => {
  const plan = DEFAULT_PLANS['binary-tree-inorder-traversal'];
  const res = validateVisualizationPlan(plan, 'binary-tree-inorder-traversal');
  assert.strictEqual(res.isValid, true);
});

it('Extracts binary tree root from structured and raw inputs', () => {
  assert.deepStrictEqual(extractTreeInput({ inputRaw: 'root = [4, 2, 6]' }), [4, 2, 6]);
  assert.deepStrictEqual(extractTreeInput({ inputStructured: { root: [1, 2] } }), [1, 2]);
});

it('Performs DFS inorder traversal correctly (Left -> Root -> Right)', () => {
  // Standard 3-level tree rooted at 4 with [1,2,3,4,5,6,7]
  const trace = traceBinaryTreeInorderAlgorithm([4, 2, 6, 1, 3, 5, 7]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.deepStrictEqual(trace.result, [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(trace.steps.length > 0);
  assert.strictEqual(trace.finalState.result.length, 7);
});

it('Performs DFS inorder traversal correctly on LeetCode Case 1 ([1, null, 2, 3])', () => {
  const trace = traceBinaryTreeInorderAlgorithm([1, null, 2, 3]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.deepStrictEqual(trace.result, [1, 3, 2]);
  assert.strictEqual(trace.initialState.root, 1);
  assert.strictEqual(trace.initialState.tree.nodes.length, 3);
});

it('Handles single-node tree [1] (LeetCode Case 3)', () => {
  const trace = traceBinaryTreeInorderAlgorithm([1]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.deepStrictEqual(trace.result, [1]);
  assert.strictEqual(trace.initialState.root, 1);
  assert.strictEqual(trace.initialState.tree.nodes.length, 1);
});

it('Handles empty tree [] (LeetCode Case 4)', () => {
  const trace = traceBinaryTreeInorderAlgorithm([]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.deepStrictEqual(trace.result, []);
  assert.strictEqual(trace.initialState.root, null);
  assert.strictEqual(trace.steps.length, 1);
});

it('Executes via executionStrategyRegistry with alias 94 for [1, null, 2, 3]', () => {
  const res = executeWithTrace(
    { problemId: '94' },
    { testCase: { inputRaw: 'root = [1, null, 2, 3]' } }
  );
  assert.strictEqual(res.isSupported, true);
  assert.deepStrictEqual(res.trace.result, [1, 3, 2]);
});

// 4. Minimum Depth of Binary Tree (LeetCode 111)
console.log('\n--- 4. Minimum Depth of Binary Tree (LeetCode 111) ---');

it('Strategy registration exists for minimum-depth-of-binary-tree and aliases min-depth, 111', () => {
  assert.strictEqual(hasStrategy('minimum-depth-of-binary-tree'), true);
  assert.strictEqual(hasStrategy('min-depth'), true);
  assert.strictEqual(hasStrategy('111'), true);
  assert.strictEqual(getStrategy('111').metadata.algorithmFamily, 'binary-tree');
});

it('Default visualization plan is valid for minimum-depth-of-binary-tree', () => {
  const plan = DEFAULT_PLANS['minimum-depth-of-binary-tree'];
  const res = validateVisualizationPlan(plan, 'minimum-depth-of-binary-tree');
  assert.strictEqual(res.isValid, true);
});

it('Computes minDepth on LeetCode Case 1 ([3, 9, 20, null, null, 15, 7]) -> 2', () => {
  const trace = traceMinimumDepthAlgorithm([3, 9, 20, null, null, 15, 7]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.strictEqual(trace.result, 2);
  assert.strictEqual(trace.finalState.minDepth, 2);
});

it('Computes minDepth on LeetCode Case 2 ([2, null, 3, null, 4, null, 5, null, 6]) -> 5', () => {
  const trace = traceMinimumDepthAlgorithm([2, null, 3, null, 4, null, 5, null, 6]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.strictEqual(trace.result, 5);
  assert.strictEqual(trace.finalState.minDepth, 5);
});

it('Handles empty tree [] (minDepth = 0)', () => {
  const trace = traceMinimumDepthAlgorithm([]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.strictEqual(trace.result, 0);
  assert.strictEqual(trace.finalState.minDepth, 0);
});

it('Handles single-node tree [1] (minDepth = 1)', () => {
  const trace = traceMinimumDepthAlgorithm([1]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.strictEqual(trace.result, 1);
  assert.strictEqual(trace.finalState.minDepth, 1);
});

it('Executes via executionStrategyRegistry for minimum-depth-of-binary-tree Case 2', () => {
  const res = executeWithTrace(
    { problemId: 'minimum-depth-of-binary-tree' },
    { testCase: { inputRaw: 'root = [2, null, 3, null, 4, null, 5, null, 6]' } }
  );
  assert.strictEqual(res.isSupported, true);
  assert.strictEqual(res.trace.result, 5);
});

// 5. Maximum Depth of Binary Tree (LeetCode 104)
console.log('\n--- 5. Maximum Depth of Binary Tree (LeetCode 104) ---');

it('Strategy registration exists for maximum-depth-of-binary-tree and aliases max-depth, 104', () => {
  assert.strictEqual(hasStrategy('maximum-depth-of-binary-tree'), true);
  assert.strictEqual(hasStrategy('max-depth'), true);
  assert.strictEqual(hasStrategy('104'), true);
  assert.strictEqual(getStrategy('104').metadata.algorithmFamily, 'binary-tree');
});

it('Default visualization plan is valid for maximum-depth-of-binary-tree', () => {
  const plan = DEFAULT_PLANS['maximum-depth-of-binary-tree'];
  const res = validateVisualizationPlan(plan, 'maximum-depth-of-binary-tree');
  assert.strictEqual(res.isValid, true);
});

it('Computes maxDepth on LeetCode Case 1 ([3, 9, 20, null, null, 15, 7]) -> 3', () => {
  const trace = traceMaximumDepthAlgorithm([3, 9, 20, null, null, 15, 7]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.strictEqual(trace.result, 3);
  assert.strictEqual(trace.finalState.maxDepth, 3);
  assert.deepStrictEqual(trace.finalState.longestPath, [3, 20, 15]);
});

it('Computes maxDepth on LeetCode Case 2 ([1, null, 2]) -> 2', () => {
  const trace = traceMaximumDepthAlgorithm([1, null, 2]);
  const val = validateExecutionTrace(trace);
  assert.strictEqual(val.isValid, true);
  assert.strictEqual(trace.result, 2);
  assert.strictEqual(trace.finalState.maxDepth, 2);
  assert.deepStrictEqual(trace.finalState.longestPath, [1, 2]);
});

it('Handles empty tree [] (maxDepth = 0)', () => {
  const trace = traceMaximumDepthAlgorithm([]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.strictEqual(trace.result, 0);
  assert.strictEqual(trace.finalState.maxDepth, 0);
});

it('Handles single-node tree [1] (maxDepth = 1)', () => {
  const trace = traceMaximumDepthAlgorithm([1]);
  assert.strictEqual(validateExecutionTrace(trace).isValid, true);
  assert.strictEqual(trace.result, 1);
  assert.strictEqual(trace.finalState.maxDepth, 1);
  assert.deepStrictEqual(trace.finalState.longestPath, [1]);
});

it('Executes via executionStrategyRegistry for maximum-depth-of-binary-tree Case 1 and Case 2', () => {
  const res1 = executeWithTrace(
    { problemId: 'maximum-depth-of-binary-tree' },
    { testCase: { inputRaw: 'root = [3, 9, 20, null, null, 15, 7]' } }
  );
  assert.strictEqual(res1.isSupported, true);
  assert.strictEqual(res1.trace.result, 3);

  const res2 = executeWithTrace(
    { problemId: '104' },
    { testCase: { inputRaw: 'root = [1, null, 2]' } }
  );
  assert.strictEqual(res2.isSupported, true);
  assert.strictEqual(res2.trace.result, 2);
});

async function runAsyncTests() {
  console.log('\n--- 6. End-to-End getVisualizationTrace Authoritative Tests ---');

  await itAsync('getVisualizationTrace returns 16 steps for Reverse Linked List Case 1 ([1, 2, 3, 4, 5])', async () => {
    const res = await getVisualizationTrace('reverse-linked-list', null, null, 1);
    assert.strictEqual(res.isSupported, true);
    assert.deepStrictEqual(res.trace.result, [5, 4, 3, 2, 1]);
    assert.strictEqual(res.trace.steps.length, 16);
    assert.strictEqual(res.trace.initialState.nodes.length, 5);
  });

  await itAsync('getVisualizationTrace returns 7 steps for Reverse Linked List Case 2 ([1, 2])', async () => {
    const res = await getVisualizationTrace('reverse-linked-list', null, null, 2);
    assert.strictEqual(res.isSupported, true);
    assert.deepStrictEqual(res.trace.result, [2, 1]);
    assert.strictEqual(res.trace.steps.length, 7);
    assert.strictEqual(res.trace.initialState.nodes.length, 2);
  });

  await itAsync('getVisualizationTrace returns 1 step for Reverse Linked List Case 3 ([])', async () => {
    const res = await getVisualizationTrace('reverse-linked-list', null, null, 3);
    assert.strictEqual(res.isSupported, true);
    assert.deepStrictEqual(res.trace.result, []);
    assert.strictEqual(res.trace.steps.length, 1);
    assert.strictEqual(res.trace.initialState.nodes.length, 0);
  });

  await itAsync('getVisualizationTrace returns valid trace for Valid Parentheses all 4 cases', async () => {
    const r1 = await getVisualizationTrace('valid-parentheses', null, null, 1);
    assert.strictEqual(r1.trace.result, true);
    const r2 = await getVisualizationTrace('valid-parentheses', null, null, 2);
    assert.strictEqual(r2.trace.result, true);
    const r3 = await getVisualizationTrace('valid-parentheses', null, null, 3);
    assert.strictEqual(r3.trace.result, false);
    const r4 = await getVisualizationTrace('valid-parentheses', null, null, 4);
    assert.strictEqual(r4.trace.result, false);
  });

  await itAsync('getVisualizationTrace returns valid trace for Binary Tree Inorder Traversal cases', async () => {
    const r1 = await getVisualizationTrace('binary-tree-inorder-traversal', null, null, 1);
    assert.deepStrictEqual(r1.trace.result, [1, 3, 2]);
    const r4 = await getVisualizationTrace('binary-tree-inorder-traversal', null, null, 4);
    assert.deepStrictEqual(r4.trace.result, []);
  });

  await itAsync('getVisualizationTrace returns valid trace for Minimum Depth cases', async () => {
    const r1 = await getVisualizationTrace('minimum-depth-of-binary-tree', null, null, 1);
    assert.strictEqual(r1.trace.result, 2);
    const r2 = await getVisualizationTrace('minimum-depth-of-binary-tree', null, null, 2);
    assert.strictEqual(r2.trace.result, 5);
  });

  await itAsync('getVisualizationTrace returns valid trace for Maximum Depth cases', async () => {
    const r1 = await getVisualizationTrace('maximum-depth-of-binary-tree', null, null, 1);
    assert.strictEqual(r1.trace.result, 3);
    const r2 = await getVisualizationTrace('maximum-depth-of-binary-tree', null, null, 2);
    assert.strictEqual(r2.trace.result, 2);
  });

  console.log('\n--- 7. P1 Findings Regressions & Correctness Tests ---');

  it('P1.1 Two Sum: target "0" is parsed as 0 and not converted to 9', () => {
    const trace = traceTwoSumAlgorithm([-1, 1], "0");
    assert.strictEqual(trace.initialState.primitives.target.value, 0);
    assert.deepStrictEqual(trace.result, [0, 1]);
  });

  it('P1.1 Two Sum: invalid non-numeric element rejects with AppError 400', () => {
    assert.throws(
      () => traceTwoSumAlgorithm([1, "foo", 3], 4),
      (err) => err.statusCode === 400 && err.message.includes('Invalid array element')
    );
  });

  it('P1.1 Two Sum: invalid target rejects with AppError 400', () => {
    assert.throws(
      () => traceTwoSumAlgorithm([1, 2, 3], "invalid_target"),
      (err) => err.statusCode === 400 && err.message.includes('Invalid target')
    );
  });

  it('P1.2 Longest Substring: string exceeding 100 chars rejects with AppError 400 instead of silent truncation', () => {
    const longString = 'a'.repeat(105);
    assert.throws(
      () => traceLongestSubstringAlgorithm(longString),
      (err) => err.statusCode === 400 && err.message.includes('exceeds maximum visualization limit')
    );
  });

  it('P1.2 Top K Frequent: array exceeding 100 elements rejects with AppError 400 instead of silent truncation', () => {
    const longArray = Array.from({ length: 105 }, (_, i) => i);
    assert.throws(
      () => traceTopKFrequentBucketSort(longArray, 2),
      (err) => err.statusCode === 400 && err.message.includes('exceeds maximum visualization limit')
    );
  });

  await itAsync('P1.4 Dynamic Dispatch: getVisualizationTrace delegates to ExecutionStrategyRegistry for all problems', async () => {
    const r1 = await getVisualizationTrace('two-sum', null, null, 1);
    assert.strictEqual(r1.isSupported, true);
    assert.strictEqual(r1.source, 'execution');

    const r2 = await getVisualizationTrace('longest-substring-without-repeating-characters', null, null, 1);
    assert.strictEqual(r2.isSupported, true);
    assert.strictEqual(r2.source, 'execution');

    const r3 = await getVisualizationTrace('top-k-frequent-elements', null, null, 1);
    assert.strictEqual(r3.isSupported, true);
    assert.strictEqual(r3.source, 'execution');

    const r4 = await getVisualizationTrace('longest-consecutive-sequence', null, null, 1);
    assert.strictEqual(r4.isSupported, true);
    assert.strictEqual(r4.source, 'execution');
  });

  console.log('\n--- 8. High & Medium Priority Backend Findings & Security Tests ---');

  it('resolveTestCase: returns matching test case for valid ID', () => {
    const dummyProblem = {
      problemId: 'test-prob',
      testCases: [
        { id: 1, inputRaw: '1' },
        { id: 2, inputRaw: '2' },
      ],
    };
    const res = resolveTestCase(dummyProblem, 2);
    assert.strictEqual(res.testCaseId, 2);
    assert.strictEqual(res.selectedTestCase.inputRaw, '2');
  });

  it('resolveTestCase: defaults to first test case when ID is omitted', () => {
    const dummyProblem = {
      problemId: 'test-prob',
      testCases: [
        { id: 10, inputRaw: 'case-10' },
        { id: 20, inputRaw: 'case-20' },
      ],
    };
    const res = resolveTestCase(dummyProblem, undefined);
    assert.strictEqual(res.testCaseId, 10);
    assert.strictEqual(res.selectedTestCase.inputRaw, 'case-10');
  });

  it('resolveTestCase: throws AppError 400 for non-positive or non-numeric IDs', () => {
    const dummyProblem = {
      problemId: 'test-prob',
      testCases: [{ id: 1, inputRaw: '1' }],
    };
    assert.throws(
      () => resolveTestCase(dummyProblem, 'invalid_id'),
      (err) => err.statusCode === 400 && err.message.includes('ID must be a positive integer')
    );
    assert.throws(
      () => resolveTestCase(dummyProblem, -5),
      (err) => err.statusCode === 400 && err.message.includes('ID must be a positive integer')
    );
  });

  it('resolveTestCase: throws AppError 404 for unknown test case IDs (no silent fallback)', () => {
    const dummyProblem = {
      problemId: 'test-prob',
      title: 'Test Problem',
      testCases: [
        { id: 1, inputRaw: '1' },
        { id: 2, inputRaw: '2' },
      ],
    };
    assert.throws(
      () => resolveTestCase(dummyProblem, 999),
      (err) => err.statusCode === 404 && err.message.includes('Test case with ID 999 not found')
    );
  });

  it('Event registry: GRID_UPDATE and GRID_CURRENT_CELL have distinct identifiers', () => {
    assert.strictEqual(VISUALIZATION_EVENTS.GRID_UPDATE, 'GRID_UPDATE');
    assert.strictEqual(VISUALIZATION_EVENTS.GRID_CURRENT_CELL, 'GRID_CURRENT_CELL');
    assert.notStrictEqual(VISUALIZATION_EVENTS.GRID_UPDATE, VISUALIZATION_EVENTS.GRID_CURRENT_CELL);
  });

  it('normalizeExecutionTrace & deepFreeze: all nested structures, steps, and events are strictly immutable', () => {
    const trace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    assert.strictEqual(Object.isFrozen(trace), true);
    assert.strictEqual(Object.isFrozen(trace.metadata), true);
    assert.strictEqual(Object.isFrozen(trace.initialState), true);
    assert.strictEqual(Object.isFrozen(trace.initialState.primitives), true);
    assert.strictEqual(Object.isFrozen(trace.steps), true);
    assert.strictEqual(Object.isFrozen(trace.steps[0]), true);
    assert.strictEqual(Object.isFrozen(trace.steps[0].events), true);
    assert.strictEqual(Object.isFrozen(trace.steps[0].events[0]), true);
    assert.strictEqual(Object.isFrozen(trace.steps[0].events[0].data), true);
    assert.strictEqual(Object.isFrozen(trace.steps[0].events[0].target), true);
    assert.strictEqual(Object.isFrozen(trace.finalState), true);
  });

  it('areResultsEquivalent: handles object key ordering and deep structural equivalence', () => {
    assert.strictEqual(areResultsEquivalent({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
    assert.strictEqual(areResultsEquivalent({ x: [1, 2], y: { z: 3 } }, { y: { z: 3 }, x: [1, 2] }), true);
    assert.strictEqual(areResultsEquivalent(NaN, NaN), true);
    assert.strictEqual(areResultsEquivalent([1, 2], [1, 3]), false);
    assert.strictEqual(areResultsEquivalent({ a: 1 }, { a: 2 }), false);
  });

  it('validateExecutionTrace: passes schema-aware result equality without false contradictory flags', () => {
    const validTrace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    // Mutate copy with swapped key order in result vs finalState
    const copy = JSON.parse(JSON.stringify(validTrace));
    copy.result = { first: 0, second: 1 };
    copy.finalState = { result: { second: 1, first: 0 } };

    const validation = validateExecutionTrace(copy);
    const hasContradiction = validation.errors.some((e) => e.includes('Contradictory result'));
    assert.strictEqual(hasContradiction, false);
  });

  it('Dynamic fallback mapping: does NOT invent [1, 2, 3, 4, 5] for index-like variables without array input', () => {
    const dryRunNoArray = {
      testCaseInput: 42,
      initialState: {
        variables: [{ name: 'i', value: 0 }],
      },
    };
    const mapping = getDryRunMappingForProblem('generic-calc', dryRunNoArray);
    assert.strictEqual(mapping.primitives.arr, undefined);
    assert.strictEqual(mapping.primitives.i.type, 'variable');
    assert.strictEqual(mapping.variableMap.i.type, 'variable');
    assert.strictEqual(mapping.primitives.input.type, 'variable');
  });

  it('Input extractors: reject missing or malformed inputs instead of fabricating fallback data', () => {
    assert.throws(
      () => extractNumsArray({}, {}),
      (err) => err.statusCode === 400 && err.message.includes('No valid numeric array')
    );
    assert.throws(
      () => extractLinkedListInput({ inputRaw: 'not_a_list' }, {}),
      (err) => err.statusCode === 400 && err.message.includes('No valid linked list')
    );
    assert.throws(
      () => extractTreeInput({ inputRaw: 'not_a_tree' }, {}),
      (err) => err.statusCode === 400 && err.message.includes('No valid binary tree')
    );
    assert.throws(
      () => traceReverseLinkedListAlgorithm('invalid_string'),
      (err) => err.statusCode === 400 && err.message.includes('must be an array')
    );
  });

  await itAsync('Data Isolation: User A private trace is isolated from User B and anonymous requests', async () => {
    const mongoose = require('mongoose');
    if (!mongoose.connection || mongoose.connection.readyState !== 1) {
      return; // Skip if Mongo disconnected in local unit test
    }
    const Problem = require('./src/models/Problem');
    const ProblemDryRun = require('./src/models/ProblemDryRun');

    const testProbId = 'iso-test-problem';
    await Problem.deleteOne({ problemId: testProbId });
    await ProblemDryRun.deleteMany({});

    const problem = await Problem.create({
      problemId: testProbId,
      title: 'Isolation Test Problem',
      category: 'Array',
      difficulty: 'Easy',
      isPublished: true,
      testCases: [{ id: 1, inputRaw: '1' }],
    });

    const userA = new mongoose.Types.ObjectId();
    const userB = new mongoose.Types.ObjectId();

    // User A creates a private trace
    await ProblemDryRun.create({
      problemId: problem._id,
      userId: userA,
      isPublic: false,
      approachId: 'custom-approach',
      approachName: 'Custom Approach',
      testCaseId: 1,
      testCaseInput: 1,
      steps: [{ stepNo: 0, pseudocodeLine: 1, pseudocodeText: 'start', action: { description: 'init' }, explanation: 'init' }],
      sourceProblemHash: 'hash',
      generationStatus: 'generated',
    });

    // 1. User A can retrieve their own private trace
    const resA = await getVisualizationTrace(testProbId, userA, 'custom-approach', 1);
    assert.strictEqual(resA.approachId, 'custom-approach');

    // 2. User B CANNOT retrieve User A's private trace
    await assert.rejects(
      async () => await getVisualizationTrace(testProbId, userB, 'custom-approach', 1),
      (err) => err.statusCode === 404 && err.code === 'DRY_RUN_REQUIRED'
    );

    // 3. Anonymous request CANNOT retrieve User A's private trace
    await assert.rejects(
      async () => await getVisualizationTrace(testProbId, null, 'custom-approach', 1),
      (err) => err.statusCode === 404 && err.code === 'DRY_RUN_REQUIRED'
    );

    // 4. If trace is marked isPublic: true, both User B and anonymous CAN access it
    await ProblemDryRun.updateOne({ problemId: problem._id, userId: userA }, { isPublic: true });
    const resB = await getVisualizationTrace(testProbId, userB, 'custom-approach', 1);
    assert.strictEqual(resB.approachId, 'custom-approach');

    const resAnon = await getVisualizationTrace(testProbId, null, 'custom-approach', 1);
    assert.strictEqual(resAnon.approachId, 'custom-approach');

    // Clean up
    await Problem.deleteOne({ _id: problem._id });
    await ProblemDryRun.deleteMany({ problemId: problem._id });
  });

  console.log('\n--- 9. Universal Input Normalizer Tests ---');

  it('inputNormalizer: parses multiple assignments from raw parameter strings', () => {
    const raw = 'nums = [2, 7, 11, 15], target = 9';
    const parsed = inputNormalizer.parseRawInputString(raw);
    assert.deepStrictEqual(parsed.nums, [2, 7, 11, 15]);
    assert.strictEqual(parsed.target, 9);
  });

  it('inputNormalizer: parses binary tree level-order arrays containing nulls', () => {
    const raw = 'root = [3, 9, 20, null, null, 15, 7]';
    const parsed = inputNormalizer.parseRawInputString(raw);
    assert.deepStrictEqual(parsed.root, [3, 9, 20, null, null, 15, 7]);
  });

  it('inputNormalizer: parses linked list raw strings with spaces', () => {
    const raw = 'head = [ 1, 2, 3, 4, 5 ]';
    const parsed = inputNormalizer.parseRawInputString(raw);
    assert.deepStrictEqual(parsed.head, [1, 2, 3, 4, 5]);
  });

  it('inputNormalizer: parses string literals and escaped brackets', () => {
    const raw = 's = "()[]{}"';
    const parsed = inputNormalizer.parseRawInputString(raw);
    assert.strictEqual(parsed.s, '()[]{}');
  });

  it('inputNormalizer: extracts typed numeric arrays and rejects non-numeric elements', () => {
    const valid = inputNormalizer.extractNumericArray({ nums: ['10', 20, 30] });
    assert.deepStrictEqual(valid, [10, 20, 30]);

    assert.throws(
      () => inputNormalizer.extractNumericArray({ nums: [1, 'bad', 3] }),
      (err) => err.statusCode === 400 && err.message.includes('Invalid non-numeric element')
    );
  });

  it('inputNormalizer: extracts strings and enforces fallback defaultValue', () => {
    const s = inputNormalizer.extractString({ s: 'test' });
    assert.strictEqual(s, 'test');

    const defaultStr = inputNormalizer.extractString({}, ['s'], 'fallback');
    assert.strictEqual(defaultStr, 'fallback');

    assert.throws(
      () => inputNormalizer.extractString({}),
      (err) => err.statusCode === 400
    );
  });

  it('inputNormalizer: extracts numbers strictly and rejects missing or non-numbers', () => {
    const k = inputNormalizer.extractNumber({ k: '5' });
    assert.strictEqual(k, 5);

    assert.throws(
      () => inputNormalizer.extractNumber({ k: 'abc' }),
      (err) => err.statusCode === 400
    );
  });

  console.log('\n--- 9. Comprehensive Backend Audit Hardening & Regression Suite ---');

  it('P0 Two Sum: rejects missing array when demo mode is not requested', () => {
    assert.throws(
      () => traceTwoSumAlgorithm(null, 9),
      (err) => err.statusCode === 400 && err.message.includes('Input array "nums" is required')
    );
  });

  it('P0 Two Sum: rejects missing target when demo mode is not requested', () => {
    assert.throws(
      () => traceTwoSumAlgorithm([1, 2], undefined),
      (err) => err.statusCode === 400 && err.message.includes('Target value is required')
    );
  });

  it('P0 Two Sum: applies demo defaults only when demo mode is explicitly enabled', () => {
    const demoTrace = traceTwoSumAlgorithm(null, null, { isDemo: true });
    assert.deepStrictEqual(demoTrace.initialState.primitives.nums.values, [2, 7, 11, 15]);
    assert.strictEqual(demoTrace.initialState.primitives.target.value, 9);
    assert.deepStrictEqual(demoTrace.result, [0, 1]);
  });

  it('P0 Two Sum: rejects Infinity and -Infinity elements in nums array', () => {
    assert.throws(
      () => traceTwoSumAlgorithm([1, Infinity, 3], 4),
      (err) => err.statusCode === 400 && err.message.includes('Invalid array element')
    );
    assert.throws(
      () => traceTwoSumAlgorithm([1, -Infinity, 3], 4),
      (err) => err.statusCode === 400 && err.message.includes('Invalid array element')
    );
  });

  it('P0 Two Sum: rejects Infinity as target', () => {
    assert.throws(
      () => traceTwoSumAlgorithm([1, 2, 3], Infinity),
      (err) => err.statusCode === 400 && err.message.includes('Invalid target')
    );
  });

  it('P1 Top K: rejects missing array when demo mode is not requested', () => {
    assert.throws(
      () => traceTopKFrequentBucketSort(null, 2),
      (err) => err.statusCode === 400 && err.message.includes('Input array "nums" is required')
    );
  });

  it('P1 Top K: rejects missing k when demo mode is not requested', () => {
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], null),
      (err) => err.statusCode === 400 && err.message.includes('k value is required')
    );
  });

  it('P1 Top K: rejects invalid k values (1.5, 0, -1, "abc") with AppError 400', () => {
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], 1.5),
      (err) => err.statusCode === 400 && err.message.includes('k must be a positive integer')
    );
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], 0),
      (err) => err.statusCode === 400 && err.message.includes('k must be a positive integer')
    );
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], -1),
      (err) => err.statusCode === 400 && err.message.includes('k must be a positive integer')
    );
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], 'abc'),
      (err) => err.statusCode === 400 && err.message.includes('k must be a positive integer')
    );
  });

  it('P1 Top K: rejects k exceeding the number of unique elements', () => {
    assert.throws(
      () => traceTopKFrequentBucketSort([1, 1, 2], 5),
      (err) => err.statusCode === 400 && err.message.includes('cannot exceed the number of unique elements')
    );
  });

  it('P1 Top K: applies demo defaults when demo mode is explicitly enabled', () => {
    const demoTrace = traceTopKFrequentBucketSort(null, null, { isDemo: true });
    assert.strictEqual(demoTrace.initialState.primitives.k.value, 2);
    assert.deepStrictEqual(demoTrace.result, [1, 2]);
  });

  it('P1 Event Validator: rejects pointer events with index -1, 1.5, or Infinity', () => {
    const negIdx = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE, data: { index: -1 } });
    assert.strictEqual(negIdx.isValid, false);
    assert.ok(negIdx.errors.some((e) => e.includes('valid non-negative integer "index"')));

    const floatIdx = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE, data: { index: 1.5 } });
    assert.strictEqual(floatIdx.isValid, false);

    const infIdx = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE, data: { index: Infinity } });
    assert.strictEqual(infIdx.isValid, false);

    const validIdx = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE, data: { index: 0 } });
    assert.strictEqual(validIdx.isValid, true);
  });

  it('P1 Event Validator: rejects non-finite resource values', () => {
    const infVal = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.RESOURCE_UPDATE, data: { value: Infinity } });
    assert.strictEqual(infVal.isValid, false);
    assert.ok(infVal.errors.some((e) => e.includes('finite numeric "value"')));

    const validVal = validateVisualizationEvent({ id: 'e1', step: 0, type: VISUALIZATION_EVENTS.RESOURCE_UPDATE, data: { value: 10 } });
    assert.strictEqual(validVal.isValid, true);
  });

  it('P1 Event Validator: rejects invalid order values (negative or non-finite)', () => {
    const negOrder = validateVisualizationEvent({ id: 'e1', step: 0, order: -1, type: VISUALIZATION_EVENTS.VARIABLE_SET, data: { value: 1 } });
    assert.strictEqual(negOrder.isValid, false);
    assert.ok(negOrder.errors.some((e) => e.includes('non-negative finite number')));

    const validOrder = validateVisualizationEvent({ id: 'e1', step: 0, order: 2, type: VISUALIZATION_EVENTS.VARIABLE_SET, data: { value: 1 } });
    assert.strictEqual(validOrder.isValid, true);
  });

  it('P1 Trace Validator: rejects duplicate event IDs across all steps', () => {
    const duplicateIdTrace = {
      schemaVersion: '1.0.0',
      traceId: 'trace-dup-test',
      problemId: 'test-prob',
      initialState: {
        primitives: {
          arr: { id: 'arr', type: 'array', values: [1, 2] },
        },
      },
      steps: [
        {
          id: 'step-0',
          stepNumber: 0,
          events: [
            { id: 'evt-shared-id', step: 0, type: VISUALIZATION_EVENTS.VARIABLE_SET, data: { value: 1 } },
          ],
        },
        {
          id: 'step-1',
          stepNumber: 1,
          events: [
            { id: 'evt-shared-id', step: 1, type: VISUALIZATION_EVENTS.VARIABLE_SET, data: { value: 2 } },
          ],
        },
      ],
    };

    const val = validateExecutionTrace(duplicateIdTrace);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.errors.some((e) => e.includes('Duplicate event ID "evt-shared-id" detected')));
  });

  it('P1 Trace Validator: validates initial primitives comprehensively and rejects malformed definitions', () => {
    const malformedPrimTrace = {
      schemaVersion: '1.0.0',
      traceId: 'trace-prim-test',
      problemId: 'test-prob',
      initialState: {
        primitives: {
          badType: { id: 'badType', type: 'unsupported-primitive-type' },
        },
      },
      steps: [],
    };

    const val = validateExecutionTrace(malformedPrimTrace);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.errors.some((e) => e.includes('invalid or missing "type"')));
  });

  it('P1 Trace Validator: rejects non-contiguous step numbers', () => {
    const nonContiguousTrace = {
      schemaVersion: '1.0.0',
      traceId: 'trace-step-gap-test',
      problemId: 'test-prob',
      initialState: {
        primitives: {
          arr: { id: 'arr', type: 'array', values: [1, 2] },
        },
      },
      steps: [
        { id: 'step-0', stepNumber: 0, events: [] },
        { id: 'step-2', stepNumber: 2, events: [] },
      ],
    };

    const val = validateExecutionTrace(nonContiguousTrace);
    assert.strictEqual(val.isValid, false);
    assert.ok(val.errors.some((e) => e.includes('Non-contiguous step sequence detected')));
  });

  it('P1 Trace Validator: rejects out-of-bounds pointer index with strictReferences enabled', () => {
    const oobPointerTrace = {
      schemaVersion: '1.0.0',
      traceId: 'trace-oob-test',
      problemId: 'test-prob',
      initialState: {
        primitives: {
          nums: { id: 'nums', type: 'array', values: [10, 20, 30] },
        },
      },
      steps: [
        {
          id: 'step-0',
          stepNumber: 0,
          events: [
            {
              id: 'evt-01',
              step: 0,
              type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
              target: { primitiveId: 'nums' },
              data: { index: 5, pointerId: 'i' },
            },
          ],
        },
      ],
    };

    const val = validateExecutionTrace(oobPointerTrace, { strictReferences: true });
    assert.strictEqual(val.isValid, false);
    assert.ok(val.errors.some((e) => e.includes('out of bounds for array "nums" (length: 3)')));
  });

  it('P0 Dry Run Adapter: emits truthful HEAP_STATE without fabricating climb inserts or removes', () => {
    const dryRunHeapNoChange = {
      problemId: 'furthest-building-1642',
      initialState: {
        variables: [{ name: 'minHeap', value: [2, 5, 8] }],
      },
      steps: [
        {
          stepNo: 0,
          explanation: 'Check climb requirement',
          after: {
            variables: [{ name: 'minHeap', value: [2, 5, 8] }],
          },
          changes: ['minHeap'],
        },
      ],
    };

    const trace = adaptDryRunToExecutionTrace(dryRunHeapNoChange, { problemId: 'furthest-building-1642' }, 'default', 'Heap');
    assert.ok(trace);
    assert.strictEqual(trace.steps.length, 1);
    const heapEvents = trace.steps[0].events.filter((e) => e.type === VISUALIZATION_EVENTS.HEAP_STATE);
    assert.ok(heapEvents.length >= 1, 'Should emit truthful HEAP_STATE event');
    const fabricatedEvents = trace.steps[0].events.filter(
      (e) => e.type === VISUALIZATION_EVENTS.HEAP_INSERT || e.type === VISUALIZATION_EVENTS.HEAP_REMOVE
    );
    assert.strictEqual(fabricatedEvents.length, 0, 'Must NOT synthesize HEAP_INSERT/HEAP_REMOVE when length is unchanged');
  });

  it('P0 Strategy Contract: executeWithTrace returns VERIFIED for trusted registered strategies with valid oracle output', () => {
    const exec = executeWithTrace(
      { problemId: 'two-sum' },
      {
        testCase: {
          inputRaw: 'nums = [2, 7, 11, 15], target = 9',
          outputRaw: '[0, 1]',
        },
      }
    );
    assert.strictEqual(exec.isSupported, true);
    assert.strictEqual(exec.status, 'SUCCESS');
    assert.strictEqual(exec.verificationStatus, 'VERIFIED');
    assert.strictEqual(exec.resultVerified, true);
    assert.deepStrictEqual(exec.trace.result, [0, 1]);
  });

  it('P0 Strategy Contract: executeWithTrace returns TRUSTED_UNCHECKED when no oracle expectedOutput is provided', () => {
    const execWithoutOracle = executeWithTrace(
      { problemId: 'two-sum' },
      {
        testCase: {
          inputRaw: 'nums = [2, 7, 11, 15], target = 9',
          // no outputRaw or expectedOutput provided
        },
      }
    );
    assert.strictEqual(execWithoutOracle.isSupported, true);
    assert.strictEqual(execWithoutOracle.status, 'SUCCESS');
    assert.strictEqual(execWithoutOracle.verificationStatus, 'TRUSTED_UNCHECKED');
    assert.strictEqual(execWithoutOracle.resultVerified, false);
  });

  it('P2 Strategy Contract: executeWithTrace returns UNSUPPORTED for unknown unregistered problems', () => {
    const unsupp = executeWithTrace({ problemId: 'unsupported-mystery-problem-999' });
    assert.strictEqual(unsupp.isSupported, false);
    assert.strictEqual(unsupp.status, 'UNSUPPORTED');
    assert.strictEqual(unsupp.verificationStatus, 'UNSUPPORTED');
    assert.strictEqual(unsupp.trace, null);
  });

  await itAsync('P0 getVisualizationTrace: sets verificationStatus: "VERIFIED" and resultVerified: true for registered strategies', async () => {
    const res = await getVisualizationTrace('two-sum', null, null, 1);
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.verificationStatus, 'VERIFIED');
    assert.strictEqual(res.resultVerified, true);
  });

  it('Strategy Router: routes unlisted problem to generic Family Engine based on algorithmFamily', () => {
    // Unlisted problem ID, but has algorithmFamily: 'binary-tree'
    const unlistedTreeProblem = {
      problemId: 'custom-unlisted-tree-problem-888',
      title: 'Custom Unlisted Tree Problem',
      algorithmFamily: 'binary-tree',
    };

    const execResult = executeWithTrace(
      unlistedTreeProblem,
      {
        testCase: {
          inputRaw: 'root = [1, null, 2, 3]',
          outputRaw: '[1, 3, 2]',
        },
      }
    );

    assert.strictEqual(execResult.isSupported, true);
    assert.strictEqual(execResult.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(execResult.verificationStatus, 'VERIFIED');
    assert.strictEqual(execResult.resultVerified, true);
    assert.deepStrictEqual(execResult.trace.result, [1, 3, 2]);
  });

  it('Strategy Router: routes unlisted linked list problem to generic Family Engine', () => {
    const unlistedListProblem = {
      problemId: 'custom-unlisted-list-problem-777',
      title: 'Custom Unlisted List Problem',
      algorithmFamily: 'linked-list',
    };

    const execResult = executeWithTrace(
      unlistedListProblem,
      {
        testCase: {
          inputRaw: 'head = [1, 2, 3]',
          outputRaw: '[3, 2, 1]',
        },
      }
    );

    assert.strictEqual(execResult.isSupported, true);
    assert.strictEqual(execResult.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(execResult.verificationStatus, 'VERIFIED');
    assert.strictEqual(execResult.resultVerified, true);
    assert.deepStrictEqual(execResult.trace.result, [3, 2, 1]);
  });

  it('Strategy Router: distinguishes SPECIFIC_STRATEGY from FAMILY_ENGINE', () => {
    const specific = executeWithTrace({ problemId: 'two-sum' }, { testCase: { inputRaw: 'nums = [2, 7], target = 9' } });
    assert.strictEqual(specific.resolutionTier, 'SPECIFIC_STRATEGY');

    const family = executeWithTrace(
      { problemId: 'random-unlisted-bracket-validator', algorithmFamily: 'stack' },
      { testCase: { inputRaw: 's = "()"' } }
    );
    assert.strictEqual(family.resolutionTier, 'FAMILY_ENGINE');
  });

  // -------------------------------------------------------------
  // REUSABLE EXECUTION ENGINES TEST SUITE (8 FAMILIES)
  // -------------------------------------------------------------
  console.log('\n--- Reusable Execution Engines (8 Families) ---');

  it('Family Engines: all 8 canonical families registered in registry', () => {
    const families = listFamilyEngines();
    assert.ok(families.length >= 8);
    assert.strictEqual(hasFamilyEngine('array-hashmap'), true);
    assert.strictEqual(hasFamilyEngine('two-pointers'), true);
    assert.strictEqual(hasFamilyEngine('stack'), true);
    assert.strictEqual(hasFamilyEngine('linked-list'), true);
    assert.strictEqual(hasFamilyEngine('binary-tree'), true);
    assert.strictEqual(hasFamilyEngine('graph'), true);
    assert.strictEqual(hasFamilyEngine('heap'), true);
    assert.strictEqual(hasFamilyEngine('dynamic-programming'), true);
  });

  // 1. Arrays and Hash Maps
  it('Family 1 (Arrays & Hash Maps): Two Sum complement lookup trace', () => {
    const trace = traceArrayHashMapFamily(
      { testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9' } },
      { problemId: 'custom-two-sum-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [0, 1]);
    const lookupEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.HASHMAP_LOOKUP);
    assert.ok(lookupEvt);
  });

  it('Family 1 (Arrays & Hash Maps): Contains Duplicate frequency detection trace', () => {
    const trace = traceArrayHashMapFamily(
      { testCase: { inputRaw: 'nums = [1, 2, 3, 1]' } },
      { problemId: 'custom-duplicate-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, true);
  });

  // 2. Sliding Window / Two Pointers
  it('Family 2 (Two Pointers): Container With Most Water converging pointers trace', () => {
    const trace = traceTwoPointersFamily(
      { testCase: { inputRaw: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]' } },
      { problemId: 'custom-water-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 49);
    const compareEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.ARRAY_COMPARE);
    assert.ok(compareEvt);
  });

  it('Family 2 (Sliding Window): Longest Substring window expansion trace', () => {
    const trace = traceTwoPointersFamily(
      { testCase: { inputRaw: 's = "abcabcbb"' } },
      { approachId: 'slidingWindow', problemId: 'custom-substr-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 3);
  });

  // 3. Stack and Queue
  it('Family 3 (Stack & Queue): Valid Parentheses bracket matching trace', () => {
    const trace = traceStackQueueFamily(
      { testCase: { inputRaw: 's = "()[]{}"' } },
      { problemId: 'custom-brackets-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, true);
  });

  it('Family 3 (Stack & Queue): Daily Temperatures monotonic stack trace', () => {
    const trace = traceStackQueueFamily(
      { testCase: { inputRaw: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]' } },
      { problemId: 'custom-daily-temps-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [1, 1, 4, 2, 1, 1, 0, 0]);
    const pushEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.STACK_PUSH);
    const popEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.STACK_POP);
    assert.ok(pushEvt && popEvt);
  });

  // 4. Linked Lists
  it('Family 4 (Linked Lists): Reverse Linked List three-pointer reversal trace', () => {
    const trace = traceLinkedListFamily(
      { testCase: { inputRaw: 'head = [1, 2, 3, 4, 5]' } },
      { problemId: 'custom-reverse-list-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [5, 4, 3, 2, 1]);
    const linkEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.LINKED_LIST_LINK_UPDATE);
    assert.ok(linkEvt);
  });

  it('Family 4 (Linked Lists): Merge Two Sorted Lists trace', () => {
    const trace = traceLinkedListFamily(
      { testCase: { inputRaw: 'list1 = [1, 2, 4], list2 = [1, 3, 4]' } },
      { problemId: 'custom-merge-lists-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [1, 1, 2, 3, 4, 4]);
  });

  // 5. Binary Trees / BSTs
  it('Family 5 (Binary Trees & BSTs): Inorder Traversal call-stack trace', () => {
    const trace = traceBinaryTreeFamily(
      { testCase: { inputRaw: 'root = [1, null, 2, 3]' } },
      { problemId: 'custom-inorder-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [1, 3, 2]);
    const visitEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.TREE_VISIT);
    assert.ok(visitEvt);
  });

  it('Family 5 (Binary Trees & BSTs): Maximum Depth recursion trace', () => {
    const trace = traceBinaryTreeFamily(
      { testCase: { inputRaw: 'root = [3, 9, 20, null, null, 15, 7]' } },
      { problemId: 'maximum-depth-of-binary-tree' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 3);
  });

  // 6. Graphs & 2D Grids
  it('Family 6 (Graphs & Grids): 2D Grid BFS Connected Components trace', () => {
    const trace = traceGraphFamily(
      { testCase: { inputRaw: 'grid = [[1, 1, 0], [1, 1, 0], [0, 0, 1]]' } },
      { problemId: 'custom-islands-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 2);
    const gridEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.GRID_VISIT);
    const queueEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.QUEUE_ENQUEUE);
    assert.ok(gridEvt && queueEvt);
  });

  it('Family 6 (Graphs & Grids): Graph BFS Shortest Path distance relaxation trace', () => {
    const trace = traceGraphFamily(
      { testCase: { inputRaw: 'n = 4, edges = [[0, 1], [0, 2], [1, 2], [2, 3]]' } },
      { problemId: 'custom-shortest-path-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.deepStrictEqual(trace.result, [0, 1, 1, 2]);
  });

  // 7. Heaps / Priority Queues
  it('Family 7 (Heaps): Kth Largest Element Min-Heap sift-up / extract-min trace', () => {
    const trace = traceHeapFamily(
      { testCase: { inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2' } },
      { problemId: 'custom-kth-largest-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 5);
    const insertEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.HEAP_INSERT);
    const swapEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.HEAP_SWAP);
    const removeEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.HEAP_REMOVE);
    assert.ok(insertEvt && swapEvt && removeEvt);
  });

  // 8. Dynamic Programming
  it('Family 8 (Dynamic Programming): Climbing Stairs 1D recurrence trace', () => {
    const trace = traceDynamicProgrammingFamily(
      { testCase: { inputRaw: 'n = 5' } },
      { problemId: 'custom-climbing-stairs-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 8);
    const updateEvt = trace.steps.flatMap(s => s.events).find(e => e.type === VISUALIZATION_EVENTS.ARRAY_UPDATE);
    assert.ok(updateEvt);
  });

  it('Family 8 (Dynamic Programming): Coin Change state transitions & recurrence trace', () => {
    const trace = traceDynamicProgrammingFamily(
      { testCase: { inputRaw: 'coins = [1, 2, 5], amount = 11' } },
      { problemId: 'custom-coin-change-archetype' }
    );
    const val = validateExecutionTrace(trace);
    assert.strictEqual(val.isValid, true);
    assert.strictEqual(trace.result, 3);
  });

  // Execution Router End-to-End Across Families
  it('Execution Router: routes unlisted dynamic programming problem and certifies VERIFIED with oracle', () => {
    const unlistedDP = {
      problemId: 'leetcode-coin-change-999',
      title: 'Unlisted Coin Change',
      algorithmFamily: 'dynamic-programming',
    };
    const res = executeWithTrace(
      unlistedDP,
      { testCase: { inputRaw: 'coins = [1, 2, 5], amount = 11', outputRaw: '3' } }
    );
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(res.verificationStatus, 'VERIFIED');
    assert.strictEqual(res.resultVerified, true);
    assert.strictEqual(res.trace.result, 3);
  });

  it('Execution Router: routes unlisted heap problem and certifies VERIFIED with oracle', () => {
    const unlistedHeap = {
      problemId: 'leetcode-kth-largest-888',
      title: 'Unlisted Kth Largest',
      algorithmFamily: 'heap',
    };
    const res = executeWithTrace(
      unlistedHeap,
      { testCase: { inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2', outputRaw: '5' } }
    );
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(res.verificationStatus, 'VERIFIED');
    assert.strictEqual(res.resultVerified, true);
    assert.strictEqual(res.trace.result, 5);
  });

  it('Execution Router: marks TRUSTED_UNCHECKED when no oracle testCase expected output is provided', () => {
    const unlistedHeap = {
      problemId: 'leetcode-heap-without-oracle',
      title: 'Heap Without Oracle',
      algorithmFamily: 'heap',
    };
    const res = executeWithTrace(
      unlistedHeap,
      { testCase: { inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2' } }
    );
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(res.verificationStatus, 'TRUSTED_UNCHECKED');
    assert.strictEqual(res.resultVerified, false);
    assert.strictEqual(res.trace.result, 5);
  });

  console.log('\n--- 7. Stage 09 Step 4: Multi-Dimensional Support States & Invariant Checks ---');

  // A. Multi-Dimensional Support States Classification
  it('Support States: classifies LAYOUT_READY with playback locked and trace null when execution unsupported', () => {
    const context = {
      problem: { problemId: 'unsupported-np-hard-graph' },
      plan: { layout: 'grid-traversal', structures: [{ id: 'grid', type: 'grid' }] },
    };
    const res = determineSupportStateAndDimensions(null, context);
    assert.strictEqual(res.supportState, SUPPORT_STATES.LAYOUT_READY);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.trace, null);
    assert.strictEqual(res.dimensions.executionAvailability, EXECUTION_AVAILABILITY.LAYOUT_ONLY);
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.NONE);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.UNCHECKED);
    assert.strictEqual(res.dimensions.invariantVerification, 'SKIPPED');
  });

  it('Support States: classifies UNSUPPORTED when execution unsupported and no layout plan exists', () => {
    const res = determineSupportStateAndDimensions(null, {});
    assert.strictEqual(res.supportState, SUPPORT_STATES.UNSUPPORTED);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.trace, null);
    assert.strictEqual(res.dimensions.executionAvailability, EXECUTION_AVAILABILITY.UNSUPPORTED);
  });

  it('Support States: classifies TRACE_GENERATED when raw trace exists but correctness unestablished', () => {
    const candidateTrace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    const res = determineSupportStateAndDimensions(
      { isSupported: true, trace: candidateTrace },
      { unverified: true }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.TRACE_GENERATED);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.notStrictEqual(res.trace, null);
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.NONE);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.UNCHECKED);
    assert.strictEqual(res.dimensions.invariantVerification, 'SKIPPED');
  });

  it('Support States: classifies TRACE_VALIDATED when structure & invariants pass without oracle output', () => {
    const trace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    const res = determineSupportStateAndDimensions(
      { isSupported: true, trace, resolutionTier: 'SPECIFIC_STRATEGY' },
      { testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9' } }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.TRACE_VALIDATED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.VALID);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.TRUSTED_UNCHECKED);
    assert.strictEqual(res.dimensions.invariantVerification, 'PASSED');
  });

  it('Support States: classifies RESULT_VERIFIED when trace matches authoritative expected output', () => {
    const trace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    const res = determineSupportStateAndDimensions(
      { isSupported: true, trace, resolutionTier: 'SPECIFIC_STRATEGY' },
      { testCase: { outputStructured: [0, 1] } }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.RESULT_VERIFIED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.RESULT_VERIFIED);
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.VALID);
    assert.strictEqual(res.dimensions.invariantVerification, 'PASSED');
  });

  it('Support States: classifies VERIFICATION_FAILED when result does not match oracle expected output', () => {
    const trace = traceTwoSumAlgorithm([2, 7, 11, 15], 9);
    const res = determineSupportStateAndDimensions(
      { isSupported: true, trace, resolutionTier: 'SPECIFIC_STRATEGY' },
      { testCase: { outputStructured: [99, 100] } } // Mismatch!
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.VERIFICATION_FAILED);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.VERIFICATION_FAILED);
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.VALID);
    assert.strictEqual(res.dimensions.invariantVerification, 'PASSED');
  });

  // B. Intermediate Consistency & Algorithmic Invariant Verification
  it('Intermediate Invariants: catches illegal STACK_POP on an empty stack', () => {
    const invalidStackTrace = {
      steps: [
        {
          stepNumber: 0,
          events: [
            { id: 'evt-01', step: 0, type: VISUALIZATION_EVENTS.STACK_POP, target: { primitiveId: 'stack' } },
          ],
        },
      ],
    };
    const check = validateTraceInvariants(invalidStackTrace, { algorithmFamily: 'stack' });
    assert.strictEqual(check.isValid, false);
    assert.strictEqual(check.errors.some((e) => e.includes('Illegal STACK_POP on an empty stack')), true);
  });

  it('Intermediate Invariants: catches converging two-pointers left crossing right (left > right)', () => {
    const invalidTwoPointersTrace = {
      metadata: { algorithmFamily: 'two-pointers' },
      steps: [
        { stepNumber: 0, state: { left: 0, right: 5 } },
        { stepNumber: 1, state: { left: 4, right: 2 } }, // Crossover violation!
      ],
    };
    const check = validateTraceInvariants(invalidTwoPointersTrace, { algorithmFamily: 'two-pointers' });
    assert.strictEqual(check.isValid, false);
    assert.strictEqual(check.errors.some((e) => e.includes('Converging pointer invariant violated: left (4) > right (2)')), true);
  });

  it('Intermediate Invariants: catches min-heap property violation (child < parent)', () => {
    const invalidHeapTrace = {
      metadata: { algorithmFamily: 'heap' },
      steps: [
        {
          stepNumber: 0,
          state: {
            heap: [10, 5], // index 1 (5) < parent index 0 (10) for min-heap!
          },
        },
      ],
    };
    const check = validateTraceInvariants(invalidHeapTrace, { algorithmFamily: 'heap' });
    assert.strictEqual(check.isValid, false);
    assert.strictEqual(check.errors.some((e) => e.includes('Min-heap property violated at index 1')), true);
  });

  it('Intermediate Invariants: catches non-contiguous step numbers', () => {
    const brokenStepTrace = {
      steps: [
        { stepNumber: 0, events: [] },
        { stepNumber: 2, events: [] }, // Missing step 1!
      ],
    };
    const check = validateTraceInvariants(brokenStepTrace);
    assert.strictEqual(check.isValid, false);
    assert.strictEqual(check.errors.some((e) => e.includes('non-contiguous stepNumber 2. Expected 1')), true);
  });

  // C. Restricted Sandboxed Execution Environment
  await itAsync('Restricted Sandbox: executes candidate algorithm within narrow contract and collects events', async () => {
    const candidateCode = `
      tracer.recordEvent('ARRAY_ACCESS', 'nums', { index: 0, value: input.nums[0] }, 'Access first element');
      tracer.recordEvent('ARRAY_ACCESS', 'nums', { index: 1, value: input.nums[1] }, 'Access second element');
      __result = input.nums[0] + input.nums[1];
    `;
    const res = await executeInRestrictedSandbox(candidateCode, { nums: [10, 20] });
    assert.strictEqual(res.result, 30);
    assert.strictEqual(res.events.length, 2);
    assert.strictEqual(res.events[0].type, 'ARRAY_ACCESS');
    assert.strictEqual(res.events[0].data.value, 10);
    assert.strictEqual(res.events[1].data.value, 20);
  });

  await itAsync('Restricted Sandbox: prevents access to process.env and application secrets', async () => {
    const maliciousCode = `
      try {
        __result = typeof process !== 'undefined' ? process.env : 'CLEAN';
      } catch (e) {
        __result = 'BLOCKED';
      }
    `;
    const res = await executeInRestrictedSandbox(maliciousCode, {});
    assert.strictEqual(res.result, 'CLEAN'); // process is undefined inside sandbox
  });

  await itAsync('Restricted Sandbox: terminates infinite loops via hard wall-clock timeout', async () => {
    const infiniteLoopCode = `
      while (true) {}
    `;
    let caughtErr = null;
    try {
      await executeInRestrictedSandbox(infiniteLoopCode, {}, { timeoutMs: 300 });
    } catch (err) {
      caughtErr = err;
    }
    assert.notStrictEqual(caughtErr, null);
    assert.strictEqual(caughtErr.name, 'SandboxExecutionError');
    assert.strictEqual(caughtErr.message.includes('timeout'), true);
  });

  await itAsync('Restricted Sandbox Pipeline: verifies candidate implementation and returns RESULT_VERIFIED', async () => {
    const candidateTwoSum = `
      const map = {};
      for (let i = 0; i < input.nums.length; i++) {
        const complement = input.target - input.nums[i];
        tracer.recordEvent('HASHMAP_LOOKUP', 'map', { key: complement }, 'Check complement');
        if (map[complement] !== undefined) {
          __result = [map[complement], i];
          break;
        }
        map[input.nums[i]] = i;
        tracer.recordEvent('HASHMAP_SET', 'map', { key: input.nums[i], value: i }, 'Insert seen');
      }
    `;
    const res = await executeCandidateInSandboxWithTrace(
      candidateTwoSum,
      { nums: [2, 7, 11, 15], target: 9 },
      {
        problem: { problemId: 'candidate-two-sum', title: 'Candidate Two Sum' },
        testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9', outputStructured: [0, 1] },
        approachId: 'candidateMap',
        approachName: 'Candidate Hash Table',
      }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.RESULT_VERIFIED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
    assert.strictEqual(res.dimensions.executionAvailability, 'SANDBOX_EXECUTED');
    assert.strictEqual(res.dimensions.traceValidity, TRACE_VALIDITY.VALID);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.RESULT_VERIFIED);
    assert.strictEqual(res.dimensions.invariantVerification, 'PASSED');
    assert.deepStrictEqual(res.trace.result, [0, 1]);
  });

  console.log('\n--- 8. Stage 09 Step 5: Registry Findings & Security Hardening ---');

  // Finding 1: Missing expected output can produce VERIFIED
  it('Registry Hardening (Finding 1): missing expected output defaults to TRUSTED_UNCHECKED (never VERIFIED)', () => {
    const res = executeWithTrace(
      { problemId: 'two-sum' },
      { testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9' } }
    );
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.resultVerified, false);
    assert.strictEqual(res.verificationStatus, 'TRUSTED_UNCHECKED');
    assert.strictEqual(res.supportState, SUPPORT_STATES.TRACE_VALIDATED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.TRUSTED_UNCHECKED);
  });

  // Finding 2: A failed output comparison can still return SUCCESS
  it('Registry Hardening (Finding 2): mismatched oracle result returns status: VERIFICATION_FAILED (never SUCCESS)', () => {
    const res = executeWithTrace(
      { problemId: 'two-sum' },
      { testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9', outputStructured: [999, 999] } }
    );
    assert.strictEqual(res.status, 'VERIFICATION_FAILED');
    assert.strictEqual(res.supportState, SUPPORT_STATES.VERIFICATION_FAILED);
    assert.strictEqual(res.verificationStatus, 'UNVERIFIED_RESULT_MISMATCH');
    assert.strictEqual(res.resultVerified, false);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.VERIFICATION_FAILED);
  });

  // Finding 3: timeoutMs is configured but not enforced here
  it('Registry Hardening (Finding 3): hard wall-clock timeout rejects execution exceeding timeoutMs', () => {
    registerStrategy('test-slow-probe-algo', {
      problemId: 'test-slow-probe-algo',
      algorithmFamily: 'test',
      executeFn: () => {
        const stop = Date.now() + 35;
        while (Date.now() < stop) {}
        return traceTwoSumAlgorithm([2, 7], 9);
      },
    });
    const res = executeWithTrace(
      { problemId: 'test-slow-probe-algo' },
      {},
      { limits: { timeoutMs: 15 }, isTrustedInternal: true }
    );
    assert.strictEqual(res.isSupported, false);
    assert.strictEqual(res.status, 'TIMEOUT');
    assert.strictEqual(res.verificationStatus, 'TIMEOUT');
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.trace, null);
  });

  // Finding 4: Truncation can leave a partial trace
  it('Registry Hardening (Finding 4): truncation sets isTruncated & isIncomplete, stores untruncatedResult, and locks playback', () => {
    const res = executeWithTrace(
      { problemId: 'two-sum' },
      {
        testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9', outputStructured: [0, 1] },
        limits: { maxSteps: 1 },
      }
    );
    assert.strictEqual(res.status, 'PARTIAL_TRACE');
    assert.strictEqual(res.isTruncated, true);
    assert.strictEqual(res.isIncomplete, true);
    assert.strictEqual(res.verificationStatus, 'TRUNCATED_PARTIAL_TRACE');
    assert.strictEqual(res.resultVerified, false);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.supportState, SUPPORT_STATES.TRACE_GENERATED);
    assert.strictEqual(res.trace.steps.length, 1);
    assert.deepStrictEqual(res.trace.metadata.untruncatedResult, [0, 1]);
  });

  // Finding 5: Safety limits can be overridden without validation here
  it('Registry Hardening (Finding 5): client limit overrides are sanitized, types validated, and clamped to server maxima', () => {
    const clamped = sanitizeAndClampLimits({
      maxSteps: 9999999,
      maxEvents: -100,
      maxInputLength: 'malicious',
      timeoutMs: 1000000,
    });
    assert.strictEqual(clamped.maxSteps, SERVER_MAX_LIMITS.maxSteps);
    assert.strictEqual(clamped.maxEvents, DEFAULT_LIMITS.maxEvents);
    assert.strictEqual(clamped.maxInputLength, DEFAULT_LIMITS.maxInputLength);
    assert.strictEqual(clamped.timeoutMs, SERVER_MAX_LIMITS.timeoutMs);

    // Trusted internal override allows higher ceiling
    const trusted = sanitizeAndClampLimits({ maxSteps: 8000 }, true);
    assert.strictEqual(trusted.maxSteps, 8000);

    // executeWithTrace protects itself against client-supplied infinite limits
    const guarded = executeWithTrace(
      { problemId: 'two-sum' },
      { testCase: { inputRaw: 'nums = [2, 7], target = 9' } },
      { limits: { maxSteps: 999999 } }
    );
    assert.strictEqual(guarded.status, 'SUCCESS');
  });

  // Finding 6: Strategy lookup relies on canonicalization being consistent
  it('Registry Hardening (Finding 6): dedicated canonical resolver handles numeric IDs, slugs, aliases, and titles', () => {
    assert.strictEqual(resolveCanonicalProblemId('1'), 'two-sum');
    assert.strictEqual(resolveCanonicalProblemId(20), 'valid-parentheses');
    assert.strictEqual(resolveCanonicalProblemId('lc-206'), 'reverse-linked-list');
    assert.strictEqual(resolveCanonicalProblemId('leetcode_94'), 'binary-tree-inorder-traversal');
    assert.strictEqual(resolveCanonicalProblemId('twosum'), 'two-sum');
    assert.strictEqual(resolveCanonicalProblemId('reverse-list'), 'reverse-linked-list');
    assert.strictEqual(resolveCanonicalProblemId('max-depth'), 'maximum-depth-of-binary-tree');
    assert.strictEqual(resolveCanonicalProblemId({ title: '1. Two Sum' }), 'two-sum');
    assert.strictEqual(resolveCanonicalProblemId({ title: 'Valid Parentheses' }), 'valid-parentheses');
    assert.strictEqual(resolveCanonicalProblemId({ problemId: 'leetcode-1' }), 'two-sum');

    // Execution by title or alias succeeds reliably
    const byTitle = executeWithTrace(
      { title: '1. Two Sum' },
      { testCase: { inputRaw: 'nums = [2, 7], target = 9', outputStructured: [0, 1] } }
    );
    assert.strictEqual(byTitle.isSupported, true);
    assert.strictEqual(byTitle.problemId, 'two-sum');
    assert.strictEqual(byTitle.status, 'SUCCESS');
    assert.strictEqual(byTitle.resultVerified, true);
  });

  // Distinction: Intermediate Invariant Correctness vs Final Result Equality
  it('Registry Hardening (Distinction): intermediate invariant failure rejects execution even if final answer matches expected output', () => {
    registerStrategy('test-invariant-violation-algo', {
      problemId: 'test-invariant-violation-algo',
      metadata: { algorithmFamily: 'stack' },
      executeFn: () => {
        return {
          schemaVersion: 1,
          traceId: 'trace-broken-stack',
          problemId: 'test-invariant-violation-algo',
          approachId: 'stackApproach',
          initialState: {
            primitives: {
              stack: { id: 'stack', type: 'stack', items: [] },
            },
          },
          steps: [
            {
              id: 'step-0',
              stepNumber: 0,
              description: 'Illegal pop on empty stack',
              events: [
                { id: 'evt-01', step: 0, type: VISUALIZATION_EVENTS.STACK_POP, target: { primitiveId: 'stack' }, data: { value: ')' } },
              ],
            },
          ],
          result: true,
        };
      },
    });

    const res = executeWithTrace(
      { problemId: 'test-invariant-violation-algo' },
      { testCase: { outputStructured: true } }
    );
    assert.strictEqual(res.status, 'VERIFICATION_FAILED');
    assert.strictEqual(res.supportState, SUPPORT_STATES.VERIFICATION_FAILED);
    assert.strictEqual(res.verificationStatus, 'VERIFICATION_FAILED');
    assert.strictEqual(res.resultVerified, false);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.dimensions.invariantVerification, 'FAILED');
  });

  console.log('\n--- 9. Stage 09 Step 6: Hybrid 3-Path Execution Architecture ---');

  // Path A: Existing Trusted Strategy
  it('Hybrid Architecture (Path A): routes known landmark problem directly to SPECIFIC_STRATEGY', () => {
    const res = executeWithTrace(
      { problemId: 'two-sum', title: 'Two Sum' },
      { testCase: { inputRaw: 'nums = [2, 7, 11, 15], target = 9', outputStructured: [0, 1] } }
    );
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.resolutionTier, 'SPECIFIC_STRATEGY');
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.verificationStatus, 'VERIFIED');
    assert.strictEqual(res.resultVerified, true);
    assert.strictEqual(res.supportState, SUPPORT_STATES.RESULT_VERIFIED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
  });

  // Path B: Reusable Family Engine
  it('Hybrid Architecture (Path B): routes unlisted family problem to FAMILY_ENGINE and emits genuine events', () => {
    const unlistedStackProblem = {
      problemId: 'leetcode-999-unlisted-brackets',
      title: 'Unlisted Custom Parentheses Validator',
      algorithmFamily: 'stack',
    };
    const res = executeWithTrace(
      unlistedStackProblem,
      { testCase: { inputRaw: 's = "()[]{}"', outputStructured: true } }
    );
    assert.strictEqual(res.isSupported, true);
    assert.strictEqual(res.resolutionTier, 'FAMILY_ENGINE');
    assert.strictEqual(res.status, 'SUCCESS');
    assert.strictEqual(res.verificationStatus, 'VERIFIED');
    assert.strictEqual(res.resultVerified, true);
    assert.strictEqual(res.supportState, SUPPORT_STATES.RESULT_VERIFIED);
    assert.strictEqual(res.isPlaybackUnlocked, true);

    // Emits genuine stack events without writing a custom per-problem tracer
    const stackEvents = res.trace.steps.flatMap(s => s.events).filter(e =>
      e.type === VISUALIZATION_EVENTS.STACK_PUSH || e.type === VISUALIZATION_EVENTS.STACK_POP
    );
    assert.ok(stackEvents.length >= 2);
  });

  // Path C: AI-Assisted Candidate Execution in Restricted Sandbox
  await itAsync('Hybrid Architecture (Path C): executes candidate implementation in restricted sandbox with genuine event logging', async () => {
    const candidateLongTailCode = `
      tracer.recordEvent('ARRAY_POINTER_MOVE', 'nums', { index: 0 }, 'Inspect first element');
      tracer.recordEvent('ARRAY_ACCESS', 'nums', { index: 0, value: input.nums[0] }, 'Read element');
      __result = input.nums[0] * 2;
    `;
    const res = await executeCandidateInSandboxWithTrace(
      candidateLongTailCode,
      { nums: [21] },
      {
        problem: { problemId: 'uncovered-math-doubler', title: 'Uncovered Doubler' },
        testCase: { inputRaw: 'nums = [21]', outputStructured: 42 },
        approachId: 'directMath',
        approachName: 'Direct Doubling',
      }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.RESULT_VERIFIED);
    assert.strictEqual(res.isPlaybackUnlocked, true);
    assert.strictEqual(res.dimensions.executionAvailability, 'SANDBOX_EXECUTED');
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.RESULT_VERIFIED);
    assert.strictEqual(res.trace.result, 42);
  });

  // Path C Failure Guard: declines playback if AI candidate fails oracle verification
  await itAsync('Hybrid Architecture (Path C Guard): locks playback when candidate execution output mismatches oracle', async () => {
    const buggyCandidateCode = `
      tracer.recordEvent('ARRAY_ACCESS', 'nums', { index: 0, value: input.nums[0] }, 'Read element');
      __result = 999;
    `;
    const res = await executeCandidateInSandboxWithTrace(
      buggyCandidateCode,
      { nums: [21] },
      {
        problem: { problemId: 'uncovered-buggy-doubler', title: 'Buggy Doubler' },
        testCase: { inputRaw: 'nums = [21]', outputStructured: 42 },
        approachId: 'buggyMath',
        approachName: 'Buggy Doubling',
      }
    );
    assert.strictEqual(res.supportState, SUPPORT_STATES.VERIFICATION_FAILED);
    assert.strictEqual(res.isPlaybackUnlocked, false);
    assert.strictEqual(res.dimensions.resultVerification, RESULT_VERIFICATION.VERIFICATION_FAILED);
  });

  // Architectural Guard: Shared Event Schema & Replay Engine Compatibility across all paths
  it('Shared Schema Guard: all 3 paths emit standard VISUALIZATION_EVENTS and valid initialState.primitives', () => {
    const pathATrace = executeWithTrace({ problemId: 'two-sum' }, { testCase: { inputRaw: 'nums = [2, 7], target = 9' } }).trace;
    const pathBTrace = executeWithTrace({ problemId: 'custom-stack', algorithmFamily: 'stack' }, { testCase: { inputRaw: 's = "()"' } }).trace;

    const valA = validateExecutionTrace(pathATrace);
    const valB = validateExecutionTrace(pathBTrace);

    assert.strictEqual(valA.isValid, true);
    assert.strictEqual(valB.isValid, true);

    // Both traces adhere to the same schema version and declared primitive structure
    assert.strictEqual(pathATrace.schemaVersion, pathBTrace.schemaVersion);
    assert.ok(pathATrace.initialState.primitives);
    assert.ok(pathBTrace.initialState.primitives);
  });

  console.log('\n================================================================');
  console.log(`RESULTS: ${pass} PASSED, ${fail} FAILED`);
  console.log('================================================================\n');

  if (fail > 0) {
    process.exit(1);
  }
}

runAsyncTests().catch((e) => {
  console.error('Test runner error:', e);
  process.exit(1);
});
