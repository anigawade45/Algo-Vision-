import {
  adaptTestCaseToInitialState,
  normalizeTestCaseInput,
  parseRawInputString,
  buildBinaryTreeLayout,
} from './testCaseInputAdapter.js';
import { replayVisualizationEvents } from '../events/visualizationEventReplay.js';
import { replayExecutionTrace } from '../trace/executionTraceReplay.js';
import { adaptDryRunToExecutionTrace } from './dryRunTraceAdapter.js';
import { furthestBuildingDryRun } from '../data/dryRun/furthestBuildingDryRun.js';

/**
 * AlgoVision — Stage 09 Direct Test-Case Visualization Test Suite
 *
 * Verifies:
 * 1. Direct initial rendering without any Dry Run record.
 * 2. Correct extraction of selected test-case input.
 * 3. Preservation of original input values and types.
 * 4. Test-case switching (state replacement & zero bleed).
 * 5. Resetting stale scene and playback state.
 * 6. Unsupported or malformed input handling.
 * 7. Missing problem and missing test case.
 * 8. Data structures: 2D Grid / Matrix.
 * 9. Data structures: Linked List.
 * 10. Data structures: Binary Tree.
 * 11. Data structures: Heap and Resources (Furthest Building).
 * 12. Data structures: String and Stack (Valid Parentheses).
 * 13. Raw string input assignment parsing.
 * 14. Execution trace decoupling and replay separation.
 * 15. Regression safety for existing visualization primitives.
 */
export function runDirectTestCaseAdapterTests() {
  const results = {
    test1_directRenderingWithoutDryRun: 'FAIL',
    test2_preservationOfValuesAndTypes: 'FAIL',
    test3_testCaseSwitchingCleanliness: 'FAIL',
    test4_malformedInputHandling: 'FAIL',
    test5_missingTestCaseHandling: 'FAIL',
    test6_gridAndMatrixSupport: 'FAIL',
    test7_linkedListSupport: 'FAIL',
    test8_binaryTreeSupport: 'FAIL',
    test9_heapAndResourcesSupport: 'FAIL',
    test10_stringAndStackSupport: 'FAIL',
    test11_rawInputStringParsing: 'FAIL',
    test12_executionTraceDecoupling: 'FAIL',
    test13_primitiveSchemaCompatibility: 'FAIL',
    test14_rawStringFallbackWithoutGenericCards: 'FAIL',
    test15_twoSumCase1AndCase2ExactCellIntegrity: 'FAIL',
    test16_slidingWindowStringSupport: 'FAIL',
  };

  try {
    // -------------------------------------------------------------
    // Test 1: Direct Initial Rendering Without Dry Run
    // -------------------------------------------------------------
    const twoSumCase1 = {
      id: 1,
      inputRaw: 'nums = [2, 7, 11, 15], target = 9',
      outputRaw: '[0, 1]',
      inputStructured: {
        type: 'array_with_target',
        array: [2, 7, 11, 15],
        target: 9,
      },
    };

    const res1 = adaptTestCaseToInitialState(twoSumCase1, {
      problemId: 'two-sum',
      title: 'Two Sum',
      category: 'Array',
    });

    if (
      res1.success &&
      res1.initialState &&
      res1.initialState.primitives.nums &&
      Array.isArray(res1.initialState.primitives.nums.values) &&
      res1.initialState.primitives.nums.values.length === 4 &&
      res1.initialState.primitives.target &&
      res1.initialState.primitives.target.value === 9
    ) {
      results.test1_directRenderingWithoutDryRun = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 2: Preservation of Original Values and Types
    // -------------------------------------------------------------
    const nums = res1.initialState.primitives.nums.values;
    const target = res1.initialState.primitives.target.value;

    if (
      nums[0] === 2 &&
      typeof nums[0] === 'number' &&
      nums[1] === 7 &&
      nums[2] === 11 &&
      nums[3] === 15 &&
      target === 9 &&
      typeof target === 'number'
    ) {
      results.test2_preservationOfValuesAndTypes = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 3: Test-Case Switching (Clean State Replacement)
    // -------------------------------------------------------------
    const twoSumCase2 = {
      id: 2,
      inputRaw: 'nums = [3, 2, 4], target = 6',
      outputRaw: '[1, 2]',
      inputStructured: {
        type: 'array_with_target',
        array: [3, 2, 4],
        target: 6,
      },
    };

    const resCase2 = adaptTestCaseToInitialState(twoSumCase2, {
      problemId: 'two-sum',
      title: 'Two Sum',
      category: 'Array',
    });

    const numsCase2 = resCase2.initialState.primitives.nums.values;
    const targetCase2 = resCase2.initialState.primitives.target.value;

    if (
      resCase2.success &&
      numsCase2.length === 3 &&
      numsCase2[0] === 3 &&
      numsCase2[1] === 2 &&
      numsCase2[2] === 4 &&
      targetCase2 === 6 &&
      resCase2.initialState.testCaseId === 2
    ) {
      results.test3_testCaseSwitchingCleanliness = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 4: Malformed Input Handling
    // -------------------------------------------------------------
    const malformed1 = adaptTestCaseToInitialState({}, { problemId: 'test' });
    const malformed2 = adaptTestCaseToInitialState({ inputStructured: null, inputRaw: '' }, { problemId: 'test' });

    if (
      !malformed1.success &&
      malformed1.error &&
      malformed1.error.code === 'MISSING_TEST_CASE' &&
      !malformed2.success &&
      malformed2.error
    ) {
      results.test4_malformedInputHandling = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 5: Missing Test Case Handling
    // -------------------------------------------------------------
    const missingRes = adaptTestCaseToInitialState(null, { problemId: 'test' });
    if (!missingRes.success && missingRes.error && missingRes.initialState === null) {
      results.test5_missingTestCaseHandling = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 6: 2D Grid / Matrix Support
    // -------------------------------------------------------------
    const gridInput = {
      id: 1,
      inputStructured: {
        type: 'grid_matrix',
        grid: [
          ['1', '1', '0'],
          ['0', '1', '0'],
        ],
      },
    };
    const gridRes = adaptTestCaseToInitialState(gridInput, {
      problemId: 'number-of-islands',
      category: 'Graph',
    });

    if (
      gridRes.success &&
      gridRes.initialState.primitives.grid &&
      gridRes.initialState.primitives.grid.type === 'grid' &&
      Array.isArray(gridRes.initialState.primitives.grid.grid) &&
      gridRes.initialState.primitives.grid.grid.length === 2 &&
      gridRes.initialState.primitives.grid.grid[0][0] === '1'
    ) {
      results.test6_gridAndMatrixSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 7: Linked List Support
    // -------------------------------------------------------------
    const llInput = {
      id: 1,
      inputStructured: {
        type: 'linked_list',
        nodes: [1, 2, 3, 4, 5],
      },
    };
    const llRes = adaptTestCaseToInitialState(llInput, {
      problemId: 'reverse-linked-list',
      category: 'Linked List',
    });

    if (
      llRes.success &&
      llRes.initialState.primitives.head &&
      llRes.initialState.primitives.head.type === 'linkedList' &&
      Array.isArray(llRes.initialState.primitives.head.nodes) &&
      llRes.initialState.primitives.head.nodes.length === 5 &&
      llRes.initialState.primitives.head.headId === 0 &&
      llRes.initialState.primitives.head.tailId === 4
    ) {
      results.test7_linkedListSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 8: Binary Tree Support
    // -------------------------------------------------------------
    const treeInput = {
      id: 1,
      inputStructured: {
        type: 'binary_tree',
        nodes: [1, null, 2, 3],
      },
    };
    const treeRes = adaptTestCaseToInitialState(treeInput, {
      problemId: 'binary-tree-inorder-traversal',
      category: 'Tree',
    });

    if (
      treeRes.success &&
      treeRes.initialState.primitives.root &&
      treeRes.initialState.primitives.root.type === 'tree' &&
      treeRes.initialState.primitives.root.rootValue === 1 &&
      treeRes.initialState.primitives.root.nodes['1'] !== undefined
    ) {
      results.test8_binaryTreeSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 9: Heap and Resources Support (Furthest Building)
    // -------------------------------------------------------------
    const fbInput = {
      id: 1,
      inputStructured: {
        heights: [4, 2, 7, 6, 9, 14, 12],
        bricks: 5,
        ladders: 1,
      },
    };
    const fbRes = adaptTestCaseToInitialState(fbInput, {
      problemId: 'furthest-building-1642',
      title: '1642. Furthest Building You Can Reach',
      category: 'Heap',
    });

    if (
      fbRes.success &&
      fbRes.initialState.primitives.heights &&
      fbRes.initialState.primitives.heights.showBarHeights &&
      fbRes.initialState.primitives.bricks &&
      fbRes.initialState.primitives.bricks.value === 5 &&
      fbRes.initialState.primitives.ladders &&
      fbRes.initialState.primitives.ladders.value === 1 &&
      fbRes.initialState.primitives.climbs &&
      fbRes.initialState.primitives.climbs.type === 'heap'
    ) {
      results.test9_heapAndResourcesSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 10: String and Stack Support (Valid Parentheses)
    // -------------------------------------------------------------
    const vpInput = {
      id: 1,
      inputStructured: {
        type: 'string',
        value: '([{}])',
      },
    };
    const vpRes = adaptTestCaseToInitialState(vpInput, {
      problemId: 'valid-parentheses',
      category: 'String',
    });

    if (
      vpRes.success &&
      vpRes.initialState.primitives.chars &&
      vpRes.initialState.primitives.chars.values.length === 6 &&
      vpRes.initialState.primitives.s &&
      vpRes.initialState.primitives.s.value === '([{}])' &&
      vpRes.initialState.primitives.stack &&
      vpRes.initialState.primitives.stack.type === 'stack'
    ) {
      results.test10_stringAndStackSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 11: Raw Input String Parsing
    // -------------------------------------------------------------
    const parsedRaw = parseRawInputString('nums = [3, 2, 4], target = 6');
    if (
      parsedRaw &&
      Array.isArray(parsedRaw.nums) &&
      parsedRaw.nums.length === 3 &&
      parsedRaw.target === 6
    ) {
      results.test11_rawInputStringParsing = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 12: Execution Trace Decoupling and Replay Separation
    // -------------------------------------------------------------
    // Case A: Initial direct state with empty events -> Replay engine returns exact initial state unchanged
    const replayedInitialState = replayVisualizationEvents(res1.initialState, [], 0);
    const initialValuesUnchanged =
      replayedInitialState.primitives.nums.values.length === 4 &&
      replayedInitialState.primitives.target.value === 9;

    // Case B: Trace replay works when valid trace exists
    const adaptRes = adaptDryRunToExecutionTrace(furthestBuildingDryRun);
    const trace = adaptRes.trace;
    const replayedTraceStep1 = replayExecutionTrace(trace, 1);

    if (
      initialValuesUnchanged &&
      replayedTraceStep1 &&
      replayedTraceStep1.sceneState &&
      replayedTraceStep1.sceneState.primitives
    ) {
      results.test12_executionTraceDecoupling = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 13: Primitive Schema Compatibility
    // -------------------------------------------------------------
    const pNums = res1.initialState.primitives.nums;
    const pTarget = res1.initialState.primitives.target;

    if (
      pNums.type === 'array' &&
      Array.isArray(pNums.values) &&
      pTarget.type === 'variable' &&
      pTarget.name === 'target' &&
      pTarget.value === 9
    ) {
      results.test13_primitiveSchemaCompatibility = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 14: Raw String Fallback Without Generic Metadata Cards
    // -------------------------------------------------------------
    // Passes test case record having only raw string and metadata
    const rawOnlyCase = {
      id: 1,
      inputRaw: 'nums = [2, 7, 11, 15], target = 9',
      outputRaw: '[0, 1]',
      reasoning: ['2 + 7 = 9'],
    };

    const rawRes = adaptTestCaseToInitialState(rawOnlyCase, {
      problemId: 'two-sum',
      title: 'Two Sum',
      category: 'Array',
    });

    const prims = rawRes.initialState?.primitives || {};
    if (
      rawRes.success &&
      prims.nums &&
      prims.nums.type === 'array' &&
      prims.nums.values.length === 4 &&
      prims.target &&
      prims.target.value === 9 &&
      // STRICT ASSERTION: Metadata keys MUST NOT exist as primitives!
      prims.id === undefined &&
      prims.inputRaw === undefined &&
      prims.outputRaw === undefined &&
      prims.reasoning === undefined
    ) {
      results.test14_rawStringFallbackWithoutGenericCards = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 15: Two Sum Case #1 and Case #2 Exact Cell Integrity
    // -------------------------------------------------------------
    const case1Cells = res1.initialState.primitives.nums.values;
    const case1Target = res1.initialState.primitives.target.value;

    const case2Cells = resCase2.initialState.primitives.nums.values;
    const case2Target = resCase2.initialState.primitives.target.value;

    const case1Valid =
      case1Cells.length === 4 &&
      case1Cells[0] === 2 &&
      case1Cells[1] === 7 &&
      case1Cells[2] === 11 &&
      case1Cells[3] === 15 &&
      case1Target === 9;

    const case2Valid =
      case2Cells.length === 3 &&
      case2Cells[0] === 3 &&
      case2Cells[1] === 2 &&
      case2Cells[2] === 4 &&
      case2Target === 6;

    if (case1Valid && case2Valid) {
      results.test15_twoSumCase1AndCase2ExactCellIntegrity = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 16: Sliding Window String Input Support (LeetCode 3)
    // -------------------------------------------------------------
    const lswrcInput = {
      id: 1,
      inputRaw: 's = "abcabcbb"',
      outputRaw: '3',
    };
    const lswrcRes = adaptTestCaseToInitialState(lswrcInput, {
      problemId: 'longest-substring-without-repeating-characters',
      title: 'Longest Substring Without Repeating Characters',
      category: 'Sliding Window',
    });

    if (
      lswrcRes.success &&
      lswrcRes.initialState &&
      lswrcRes.initialState.primitives.chars &&
      lswrcRes.initialState.primitives.chars.values.length === 8 &&
      lswrcRes.initialState.primitives.chars.values[0] === 'a' &&
      lswrcRes.initialState.primitives.s &&
      lswrcRes.initialState.primitives.s.value === 'abcabcbb' &&
      lswrcRes.initialState.primitives.left &&
      lswrcRes.initialState.primitives.left.value === null &&
      lswrcRes.initialState.primitives.right &&
      lswrcRes.initialState.primitives.right.value === null &&
      lswrcRes.initialState.primitives.maxLength &&
      lswrcRes.initialState.primitives.maxLength.value === 0 &&
      lswrcRes.initialState.flatState.left === null &&
      lswrcRes.initialState.flatState.right === null &&
      lswrcRes.initialState.flatState.maxLength === 0
    ) {
      results.test16_slidingWindowStringSupport = 'PASS';
    }

    // -------------------------------------------------------------
    // Test 17: Bucket Sort Initial State Support (LeetCode 347)
    // -------------------------------------------------------------
    const topKInput = {
      id: 1,
      inputRaw: 'nums = [1,1,1,2,2,3], k = 2',
      outputRaw: '[1, 2]',
    };
    const topKRes = adaptTestCaseToInitialState(topKInput, {
      problemId: 'top-k-frequent',
      title: 'Top K Frequent Elements',
      category: 'Heap / Bucket Sort',
    });

    if (
      topKRes.success &&
      topKRes.initialState &&
      topKRes.initialState.primitives.nums &&
      topKRes.initialState.primitives.nums.values.length === 6 &&
      topKRes.initialState.primitives.k &&
      topKRes.initialState.primitives.k.value === 2 &&
      topKRes.initialState.primitives.frequencyMap &&
      Object.keys(topKRes.initialState.primitives.frequencyMap.value).length === 0 &&
      topKRes.initialState.primitives.buckets &&
      topKRes.initialState.primitives.buckets.value.length === 7 &&
      topKRes.initialState.primitives.topKResult &&
      topKRes.initialState.primitives.topKResult.value.length === 0 &&
      !topKRes.initialState.primitives.minHeap &&
      topKRes.initialState.flatState.k === 2 &&
      topKRes.initialState.flatState.result === null
    ) {
      results.test17_bucketSortTopKInitialState = 'PASS';
    }
  } catch (err) {
    console.error('Direct Test-Case Adapter Test Suite Failure:', err);
  }

  return results;
}
