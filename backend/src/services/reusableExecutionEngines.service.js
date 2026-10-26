/**
 * AlgoVision — Reusable Execution Engines (Stage 09 Pipeline Architecture)
 *
 * Implements generic algorithmic family execution engines that operate on
 * problem archetypes with genuine, instrumented runtime state transitions.
 *
 * Supported Algorithm Families (Table 3 Contract):
 * 1. Arrays and hash maps (array-hashmap) — Reads, writes, swaps, lookups, inserts (Two Sum, Contains Duplicate)
 * 2. Sliding window / two pointers (two-pointers, sliding-window) — Pointer movement, window changes, comparisons (Longest Substring, Container With Most Water)
 * 3. Stack and queue (stack, queue) — Push, pop, enqueue, dequeue, peek (Valid Parentheses, Daily Temperatures)
 * 4. Linked lists (linked-list) — Node creation, pointer updates, traversal (Reverse Linked List, Merge Two Lists)
 * 5. Binary trees / BSTs (binary-tree, bst) — Visit, recurse, return, compare, link traversal (Inorder Traversal, Maximum Depth, BST problems)
 * 6. Graphs (graph, grid-traversal) — Visit, discover, enqueue, relax edge (BFS, DFS, shortest-path problems)
 * 7. Heaps (heap, priority-queue) — Insert, extract, sift-up, sift-down (Top K Frequent, Kth Largest)
 * 8. Dynamic programming (dynamic-programming, dp) — State reads/writes, transitions, recurrence evaluation (Climbing Stairs, Coin Change)
 */

const inputNormalizer = require('./inputNormalization.service');
const {
  VISUALIZATION_EVENTS,
  EVENT_SCHEMA_VERSION,
  EXECUTION_TRACE_SCHEMA_VERSION,
  normalizeExecutionTrace,
  traceBinaryTreeInorderAlgorithm,
  traceMaximumDepthAlgorithm,
} = require('./problemVisualization.service');

// =============================================================
// 1. ARRAYS AND HASH MAPS ENGINE (array-hashmap)
// Capability: Reads, writes, swaps, lookups, inserts
// Examples: Two Sum, Contains Duplicate
// =============================================================
function traceArrayHashMapFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const nums = inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'array', 'values', 'numbers']);
  const target = params.target !== undefined && Number.isFinite(Number(params.target)) ? Number(params.target) : null;

  const N = Math.min(nums.length, limits.maxInputLength || 100);
  const problemId = options.problemId || input.problem?.problemId || 'generic-array-hashmap';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: nums.slice(0, N),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    hashMap: {
      id: 'hashMap',
      type: 'hashmap',
      label: 'Hash Map (Seen Values)',
      entries: {},
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: null,
    },
  };

  if (target !== null) {
    initialPrimitives.target = {
      id: 'target',
      type: 'variable',
      name: 'target',
      value: target,
    };
  }

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;
  const seenMap = {};
  let finalResult = target !== null ? null : false;

  // Step 0: Initial Scene State
  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initial State',
    operation: 'INITIALIZE',
    description: target !== null
      ? `Initialize Array of ${N} elements and empty HashMap. Target = ${target}.`
      : `Initialize Array of ${N} elements and empty HashMap for duplicate/frequency analysis.`,
    changed: ['nums', 'hashMap'],
    state: {
      nums: nums.slice(0, N),
      hashMap: {},
      result: null,
      currentIndex: null,
    },
    highlights: { activeIndex: null },
    events: [],
  });
  currentStepNumber++;

  for (let i = 0; i < N; i++) {
    const val = nums[i];

    if (target !== null) {
      const complement = target - val;
      const foundIndex = seenMap[complement];

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
          target: { primitiveId: 'nums' },
          data: { index: i, pointerId: 'i', value: val },
          description: `Inspect index ${i}: value = ${val}. Complement needed: ${complement}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HASHMAP_LOOKUP,
          target: { primitiveId: 'hashMap' },
          data: { key: complement, found: foundIndex !== undefined },
          description: foundIndex !== undefined
            ? `Complement ${complement} found in HashMap at index ${foundIndex}!`
            : `Complement ${complement} not found in HashMap.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      if (foundIndex !== undefined) {
        finalResult = [foundIndex, i];
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.RESULT_COLLECT,
          target: { primitiveId: 'result' },
          data: { value: finalResult },
          description: `Solution found: indices [${foundIndex}, ${i}].`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Match Found! [${foundIndex}, ${i}]`,
          operation: 'HASHMAP_MATCH',
          description: `Found complement ${complement} at index ${foundIndex}. Pair [${foundIndex}, ${i}] sums to target ${target}.`,
          changed: ['result', 'nums'],
          state: {
            nums: nums.slice(0, N),
            hashMap: { ...seenMap },
            result: finalResult,
            currentIndex: i,
          },
          highlights: { activeIndex: i, matchedIndices: [foundIndex, i] },
          events: stepEvents,
        });
        currentStepNumber++;
        break;
      } else {
        seenMap[val] = i;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HASHMAP_SET,
          target: { primitiveId: 'hashMap' },
          data: { key: val, value: i },
          description: `Store ${val} -> index ${i} in HashMap.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Store ${val} in Map`,
          operation: 'HASHMAP_SET',
          description: `Complement not found. Inserted ${val} with index ${i} into HashMap.`,
          changed: ['hashMap', 'nums'],
          state: {
            nums: nums.slice(0, N),
            hashMap: { ...seenMap },
            result: null,
            currentIndex: i,
          },
          highlights: { activeIndex: i },
          events: stepEvents,
        });
        currentStepNumber++;
      }
    } else {
      // Frequency / Duplicate check (Contains Duplicate)
      const alreadySeen = seenMap[val] !== undefined;

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
          target: { primitiveId: 'nums' },
          data: { index: i, pointerId: 'i', value: val },
          description: `Inspect index ${i}: value = ${val}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HASHMAP_LOOKUP,
          target: { primitiveId: 'hashMap' },
          data: { key: val, found: alreadySeen },
          description: alreadySeen
            ? `Element ${val} already exists in HashMap (Duplicate found)!`
            : `Element ${val} not seen before.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      if (alreadySeen) {
        finalResult = true;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.RESULT_COLLECT,
          target: { primitiveId: 'result' },
          data: { value: true },
          description: `Duplicate detected for value ${val}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Duplicate Found (${val})`,
          operation: 'DUPLICATE_FOUND',
          description: `Value ${val} appeared more than once. Contains duplicate = true.`,
          changed: ['result'],
          state: {
            nums: nums.slice(0, N),
            hashMap: { ...seenMap },
            result: true,
            currentIndex: i,
          },
          highlights: { activeIndex: i, matchedIndices: [seenMap[val], i] },
          events: stepEvents,
        });
        currentStepNumber++;
        break;
      } else {
        seenMap[val] = i;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HASHMAP_SET,
          target: { primitiveId: 'hashMap' },
          data: { key: val, value: i },
          description: `Record ${val} in HashMap.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Record ${val}`,
          operation: 'HASHMAP_SET',
          description: `Recorded ${val} in HashMap.`,
          changed: ['hashMap'],
          state: {
            nums: nums.slice(0, N),
            hashMap: { ...seenMap },
            result: false,
            currentIndex: i,
          },
          highlights: { activeIndex: i },
          events: stepEvents,
        });
        currentStepNumber++;
      }
    }
  }

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'array-hashmap',
    approachName: options.approachName || 'Array & Hash Map Family Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Array & Hash Map Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: {
      result: finalResult,
      hashMap: { ...seenMap },
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 2. SLIDING WINDOW & TWO POINTERS ENGINE (two-pointers, sliding-window)
// Capability: Pointer movement, window changes, comparisons
// Examples: Longest Substring, Container With Most Water
// =============================================================
function traceTwoPointersFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-two-pointers';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  // Distinguish Sliding Window (string/substring) vs Two Pointers (array height/converging)
  const isStringWindow = typeof params.s === 'string' || (typeof params.str === 'string') || options.approachId === 'slidingWindow';

  if (isStringWindow) {
    const s = inputNormalizer.extractString(params, ['s', 'str', 'string', 'text'], 'abcabcbb');
    const N = Math.min(s.length, limits.maxInputLength || 100);
    const chars = s.slice(0, N).split('');

    const initialPrimitives = {
      stream: {
        id: 'stream',
        type: 'array',
        label: 'Character Stream',
        values: chars,
        activeIndex: null,
      },
      window: {
        id: 'window',
        type: 'array',
        label: 'Sliding Window',
        values: [],
      },
      maxLength: {
        id: 'maxLength',
        type: 'variable',
        name: 'maxLength',
        value: 0,
      },
    };

    const steps = [];
    let eventCounter = 1;
    let currentStepNumber = 0;
    let left = 0;
    let maxLen = 0;
    const charIndexMap = {};

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: 'Step 0: Initialize Sliding Window',
      operation: 'INITIALIZE',
      description: `Initialize sliding window with string length ${N}.`,
      changed: ['stream', 'maxLength'],
      state: { left: 0, right: 0, maxLength: 0 },
      highlights: {},
      events: [],
    });
    currentStepNumber++;

    for (let right = 0; right < N; right++) {
      const char = chars[right];
      const prevIdx = charIndexMap[char];

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
          target: { primitiveId: 'stream' },
          data: { index: right, pointerId: 'right', value: char },
          description: `Expand window to index ${right} ('${char}').`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      if (prevIdx !== undefined && prevIdx >= left) {
        left = prevIdx + 1;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.POINTER_MOVE,
          target: { primitiveId: 'stream' },
          data: { index: left, pointerId: 'left' },
          description: `Duplicate '${char}' found at ${prevIdx}. Contract left pointer to ${left}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });
      }

      charIndexMap[char] = right;
      const currentLen = right - left + 1;
      const isNewMax = currentLen > maxLen;
      if (isNewMax) maxLen = currentLen;

      if (isNewMax) {
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_SET,
          target: { primitiveId: 'maxLength' },
          data: { value: maxLen },
          description: `New maximum window length: ${maxLen}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });
      }

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Window [${left}..${right}]`,
        operation: 'WINDOW_UPDATE',
        description: `Current window '${s.slice(left, right + 1)}' (length ${currentLen}). Max length = ${maxLen}.`,
        changed: isNewMax ? ['maxLength', 'stream'] : ['stream'],
        state: { left, right, maxLength: maxLen },
        highlights: { left, right },
        events: stepEvents,
      });
      currentStepNumber++;
    }

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      approachId: options.approachId || 'sliding-window',
      approachName: options.approachName || 'Sliding Window Engine',
      initialState: {
        schemaVersion: EVENT_SCHEMA_VERSION,
        problemId,
        title: input.problem?.title || 'Sliding Window Archetype',
        primitives: initialPrimitives,
      },
      steps,
      finalState: { result: maxLen, maxLength: maxLen },
      result: maxLen,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Converging Two Pointers (Container With Most Water style)
  let arr;
  try {
    arr = inputNormalizer.extractNumericArray(params, ['height', 'nums', 'arr', 'array', 'values']);
  } catch {
    arr = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  }

  const N = Math.min(arr.length, limits.maxInputLength || 100);
  const initialPrimitives = {
    elements: {
      id: 'elements',
      type: 'array',
      label: 'Elements',
      values: arr.slice(0, N),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    left: {
      id: 'left',
      type: 'pointer',
      label: 'left',
      activeIndex: 0,
    },
    right: {
      id: 'right',
      type: 'pointer',
      label: 'right',
      activeIndex: Math.max(0, N - 1),
    },
    maxMetric: {
      id: 'maxMetric',
      type: 'variable',
      name: 'maxMetric',
      value: 0,
    },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;
  let left = 0;
  let right = Math.max(0, N - 1);
  let best = 0;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initialize Two Pointers',
    operation: 'INITIALIZE',
    description: `Initialize left pointer at index 0 and right pointer at index ${right}.`,
    changed: ['left', 'right', 'maxMetric'],
    state: { left, right, maxMetric: best },
    highlights: { left, right },
    events: [],
  });
  currentStepNumber++;

  while (left < right) {
    const valL = arr[left];
    const valR = arr[right];
    const width = right - left;
    const currentMetric = typeof valL === 'number' && typeof valR === 'number'
      ? Math.min(valL, valR) * width
      : width;

    const isNewBest = currentMetric > best;
    if (isNewBest) best = currentMetric;

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_COMPARE,
        target: { primitiveId: 'elements' },
        data: { indices: [left, right], values: [valL, valR] },
        description: `Compare left (idx ${left}, val ${valL}) and right (idx ${right}, val ${valR}). Width: ${width}, Metric: ${currentMetric}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    if (isNewBest) {
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'maxMetric' },
        data: { value: best, previousValue: best - (currentMetric - best) },
        description: `New maximum metric achieved: ${best}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Inspect Interval [${left}..${right}]`,
      operation: 'POINTER_COMPARE',
      description: `Evaluated interval [${left}, ${right}]. Metric = ${currentMetric}. Current max = ${best}.`,
      changed: isNewBest ? ['maxMetric'] : [],
      state: { left, right, maxMetric: best },
      highlights: { left, right },
      events: stepEvents,
    });
    currentStepNumber++;

    if (typeof valL === 'number' && typeof valR === 'number') {
      if (valL <= valR) {
        left++;
      } else {
        right--;
      }
    } else {
      left++;
    }
  }

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'two-pointers',
    approachName: options.approachName || 'Two Pointers Convergence Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Two Pointers Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: {
      result: best,
      maxMetric: best,
    },
    result: best,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 3. STACK AND QUEUE ENGINE (stack, queue)
// Capability: Push, pop, enqueue, dequeue, peek
// Examples: Valid Parentheses, Daily Temperatures
// =============================================================
function traceStackQueueFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-stack-queue';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  // Mode 1: Monotonic Stack (Daily Temperatures style)
  const isNumericStack = Array.isArray(params.temperatures) || (Array.isArray(params.nums) && !params.s && !params.str);
  if (isNumericStack) {
    const temps = inputNormalizer.extractNumericArray(params, ['temperatures', 'nums', 'arr']);
    const N = Math.min(temps.length, limits.maxInputLength || 100);
    const ans = new Array(N).fill(0);
    const stack = []; // indices

    const initialPrimitives = {
      temperatures: {
        id: 'temperatures',
        type: 'array',
        label: 'Input Sequence',
        values: temps.slice(0, N),
      },
      stack: {
        id: 'stack',
        type: 'stack',
        label: 'Monotonic Stack (Indices)',
        items: [],
      },
      answer: {
        id: 'answer',
        type: 'array',
        label: 'Days Until Warmer',
        values: new Array(N).fill(0),
      },
    };

    const steps = [];
    let eventCounter = 1;
    let currentStepNumber = 0;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: 'Step 0: Initialize Monotonic Stack',
      operation: 'INITIALIZE',
      description: `Initialize monotonic stack with ${N} temperature readings.`,
      changed: ['stack', 'answer'],
      state: { stack: [], answer: [...ans] },
      highlights: {},
      events: [],
    });
    currentStepNumber++;

    for (let i = 0; i < N; i++) {
      const currentTemp = temps[i];

      while (stack.length > 0 && currentTemp > temps[stack[stack.length - 1]]) {
        const prevIdx = stack.pop();
        const span = i - prevIdx;
        ans[prevIdx] = span;

        const popEvents = [
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.STACK_POP,
            target: { primitiveId: 'stack' },
            data: { poppedValue: prevIdx, items: [...stack] },
            description: `Warmer temperature ${currentTemp} > ${temps[prevIdx]}. Pop index ${prevIdx}.`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
            target: { primitiveId: 'answer' },
            data: { index: prevIdx, value: span },
            description: `Recorded answer[${prevIdx}] = ${span} days.`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
        ];

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Warmer Day for Index ${prevIdx}`,
          operation: 'STACK_RESOLVE',
          description: `Day ${i} (temp ${currentTemp}) is warmer than day ${prevIdx} (temp ${temps[prevIdx]}). Distance = ${span}.`,
          changed: ['stack', 'answer'],
          state: { stack: [...stack], answer: [...ans] },
          highlights: { activeIndex: i, matchedIndices: [prevIdx] },
          events: popEvents,
        });
        currentStepNumber++;
      }

      stack.push(i);
      const pushEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_PUSH,
          target: { primitiveId: 'stack' },
          data: { value: i, items: [...stack] },
          description: `Push index ${i} (temp ${currentTemp}) onto monotonic stack.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Push Index ${i}`,
        operation: 'STACK_PUSH',
        description: `Pushed day ${i} onto stack. Stack: [${stack.join(', ')}].`,
        changed: ['stack'],
        state: { stack: [...stack], answer: [...ans] },
        highlights: { activeIndex: i },
        events: pushEvents,
      });
      currentStepNumber++;
    }

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      approachId: options.approachId || 'monotonic-stack',
      approachName: options.approachName || 'Monotonic Stack Engine',
      initialState: {
        schemaVersion: EVENT_SCHEMA_VERSION,
        problemId,
        title: input.problem?.title || 'Monotonic Stack Archetype',
        primitives: initialPrimitives,
      },
      steps,
      finalState: { result: ans, answer: ans },
      result: ans,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Mode 2: Bracket Matching (Valid Parentheses style)
  const s = inputNormalizer.extractString(params, ['s', 'str', 'string', 'expression'], '()[]{}');
  const elements = s.split('');
  const N = Math.min(elements.length, limits.maxInputLength || 100);

  const initialPrimitives = {
    inputStream: {
      id: 'inputStream',
      type: 'array',
      label: 'Input Sequence',
      values: elements.slice(0, N),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    stack: {
      id: 'stack',
      type: 'stack',
      label: 'Execution Stack',
      items: [],
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: null,
    },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;
  const stack = [];
  let isValid = true;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initialize Stack',
    operation: 'INITIALIZE',
    description: `Initialize empty stack with ${N} input items.`,
    changed: ['stack', 'result'],
    state: { stack: [], result: null, index: null },
    highlights: {},
    events: [],
  });
  currentStepNumber++;

  const bracketPairs = { ')': '(', ']': '[', '}': '{' };

  for (let i = 0; i < N; i++) {
    const item = elements[i];

    if (bracketPairs[item]) {
      const top = stack.length > 0 ? stack[stack.length - 1] : null;
      if (top === bracketPairs[item]) {
        stack.pop();
        const stepEvents = [
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.STACK_POP,
            target: { primitiveId: 'stack' },
            data: { poppedValue: top, items: [...stack] },
            description: `Matched closing "${item}" with top "${top}". Pop from stack.`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
        ];

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Match & Pop "${item}"`,
          operation: 'STACK_POP',
          description: `Closing bracket "${item}" matched top "${top}". Remaining stack: [${stack.join(', ')}].`,
          changed: ['stack'],
          state: { stack: [...stack], result: null, index: i },
          highlights: { activeIndex: i },
          events: stepEvents,
        });
        currentStepNumber++;
      } else {
        isValid = false;
        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Mismatch at "${item}"`,
          operation: 'MISMATCH',
          description: `Closing bracket "${item}" does not match top "${top || 'EMPTY'}".`,
          changed: ['result'],
          state: { stack: [...stack], result: false, index: i },
          highlights: { activeIndex: i },
          events: [],
        });
        currentStepNumber++;
        break;
      }
    } else {
      stack.push(item);
      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_PUSH,
          target: { primitiveId: 'stack' },
          data: { value: item, items: [...stack] },
          description: `Push "${item}" to stack.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Push "${item}"`,
        operation: 'STACK_PUSH',
        description: `Pushed "${item}" onto stack. Stack depth: ${stack.length}.`,
        changed: ['stack'],
        state: { stack: [...stack], result: null, index: i },
        highlights: { activeIndex: i },
        events: stepEvents,
      });
      currentStepNumber++;
    }
  }

  const finalResult = isValid && stack.length === 0;

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'stack',
    approachName: options.approachName || 'Generic Stack Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Stack Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: {
      result: finalResult,
      stack: [...stack],
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 4. LINKED LISTS ENGINE (linked-list)
// Capability: Node creation, pointer updates, traversal
// Examples: Reverse Linked List, Merge Two Lists
// =============================================================
function traceLinkedListFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-linked-list';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  // Check if Merge Two Lists mode
  const list1 = params.list1 || params.l1;
  const list2 = params.list2 || params.l2;

  if (Array.isArray(list1) && Array.isArray(list2)) {
    const l1 = list1.slice(0, limits.maxInputLength || 50);
    const l2 = list2.slice(0, limits.maxInputLength || 50);
    const merged = [];
    let p1 = 0;
    let p2 = 0;

    const initialPrimitives = {
      list1: { id: 'list1', type: 'linked-list', label: 'List 1', values: l1 },
      list2: { id: 'list2', type: 'linked-list', label: 'List 2', values: l2 },
      mergedList: { id: 'mergedList', type: 'linked-list', label: 'Merged List', values: [] },
    };

    const steps = [];
    let eventCounter = 1;
    let currentStepNumber = 0;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: 'Step 0: Initialize Merge Pointers',
      operation: 'INITIALIZE',
      description: `Initialize two linked lists with sizes ${l1.length} and ${l2.length}.`,
      changed: ['list1', 'list2', 'mergedList'],
      state: { p1: 0, p2: 0, merged: [] },
      highlights: {},
      events: [],
    });
    currentStepNumber++;

    while (p1 < l1.length || p2 < l2.length) {
      let chosenVal;
      let fromList;
      if (p1 < l1.length && p2 < l2.length) {
        if (l1[p1] <= l2[p2]) {
          chosenVal = l1[p1];
          fromList = 'list1';
          p1++;
        } else {
          chosenVal = l2[p2];
          fromList = 'list2';
          p2++;
        }
      } else if (p1 < l1.length) {
        chosenVal = l1[p1];
        fromList = 'list1';
        p1++;
      } else {
        chosenVal = l2[p2];
        fromList = 'list2';
        p2++;
      }

      merged.push(chosenVal);
      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.LINKED_LIST_LINK_UPDATE,
          target: { primitiveId: 'mergedList' },
          data: { nodeValue: chosenVal, index: merged.length - 1 },
          description: `Link node with value ${chosenVal} from ${fromList} to merged list.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Append ${chosenVal}`,
        operation: 'LINK_UPDATE',
        description: `Appended ${chosenVal} from ${fromList}. Merged list: [${merged.join(' -> ')}].`,
        changed: ['mergedList'],
        state: { p1, p2, merged: [...merged] },
        highlights: { activeIndex: merged.length - 1 },
        events: stepEvents,
      });
      currentStepNumber++;
    }

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      approachId: options.approachId || 'merge-two-lists',
      approachName: options.approachName || 'Merge Two Sorted Lists Engine',
      initialState: {
        schemaVersion: EVENT_SCHEMA_VERSION,
        problemId,
        title: input.problem?.title || 'Merge Two Lists Archetype',
        primitives: initialPrimitives,
      },
      steps,
      finalState: { result: merged, mergedList: merged },
      result: merged,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Single List: Reverse / Traversal mode (Reverse Linked List)
  let headNodes;
  try {
    headNodes = inputNormalizer.extractNumericArray(params, ['head', 'list', 'nodes', 'values']);
  } catch {
    headNodes = [1, 2, 3, 4, 5];
  }

  const N = Math.min(headNodes.length, limits.maxInputLength || 100);
  const initialPrimitives = {
    list: {
      id: 'list',
      type: 'linked-list',
      label: 'Linked List',
      values: headNodes.slice(0, N),
    },
    prev: { id: 'prev', type: 'pointer', label: 'prev', activeIndex: null },
    curr: { id: 'curr', type: 'pointer', label: 'curr', activeIndex: 0 },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;
  const reversed = [];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initialize Three Pointers',
    operation: 'INITIALIZE',
    description: `Initialize pointer prev = null, curr = node 0.`,
    changed: ['list', 'prev', 'curr'],
    state: { prev: null, curr: 0, reversed: [] },
    highlights: {},
    events: [],
  });
  currentStepNumber++;

  for (let i = 0; i < N; i++) {
    const val = headNodes[i];
    reversed.unshift(val);

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.LINKED_LIST_CURRENT,
        target: { primitiveId: 'list' },
        data: { index: i, value: val },
        description: `Visit node at index ${i} with value ${val}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.LINKED_LIST_LINK_UPDATE,
        target: { primitiveId: 'list' },
        data: { fromIndex: i, toIndex: i > 0 ? i - 1 : null },
        description: `Reverse pointer: node ${val} now points to predecessor.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Reverse Node ${val}`,
      operation: 'REVERSE_POINTER',
      description: `Reversed pointer for node ${val}. Current reversed chain: [${reversed.join(' -> ')}].`,
      changed: ['list', 'prev', 'curr'],
      state: { prev: i, curr: i + 1 < N ? i + 1 : null, reversed: [...reversed] },
      highlights: { activeIndex: i },
      events: stepEvents,
    });
    currentStepNumber++;
  }

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'linked-list',
    approachName: options.approachName || 'Linked List Traversal & Pointer Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Linked List Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: { result: reversed, reversedList: reversed },
    result: reversed,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 5. BINARY TREES / BSTS ENGINE (binary-tree, bst)
// Capability: Visit, recurse, return, compare, link traversal
// Examples: Inorder Traversal, Maximum Depth, BST problems
// =============================================================
function traceBinaryTreeFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-binary-tree';

  let treeNodes;
  try {
    treeNodes = Array.isArray(params.root)
      ? params.root
      : Array.isArray(params.tree)
        ? params.tree
        : inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'values']);
  } catch {
    treeNodes = [1, null, 2, 3];
  }

  const isDepthQuery = problemId.includes('depth') || options.approachId?.includes('depth');

  if (isDepthQuery) {
    return traceMaximumDepthAlgorithm(treeNodes, {
      problemId,
      approachId: options.approachId || 'treeDepth',
      approachName: options.approachName || 'Binary Tree Depth Engine',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Binary Tree Depth Archetype',
    });
  }

  return traceBinaryTreeInorderAlgorithm(treeNodes, {
    problemId,
    approachId: options.approachId || 'inorderDfs',
    approachName: options.approachName || 'Binary Trees & BSTs Family Engine',
    testCaseId: options.testCaseId || 1,
    title: input.problem?.title || 'Binary Tree Inorder Archetype',
  });
}

// =============================================================
// 6. GRAPHS & 2D GRIDS ENGINE (graph, grid-traversal)
// Capability: Visit, discover, enqueue, relax edge
// Examples: BFS, DFS, shortest-path problems, Number of Islands
// =============================================================
function traceGraphFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-graph';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  // Mode 1: 2D Grid Traversal (Islands / Maze / Matrix BFS)
  const rawGrid = params.grid || params.matrix;
  const isGrid = Array.isArray(rawGrid) && rawGrid.length > 0 && Array.isArray(rawGrid[0]);
  if (isGrid) {
    const grid = rawGrid.map((row) => (Array.isArray(row) ? [...row] : [row]));
    const R = Math.min(grid.length, 10);
    const C = Math.min(grid[0].length, 10);

    const initialPrimitives = {
      grid: {
        id: 'grid',
        type: 'grid',
        label: `2D Grid (${R}x${C})`,
        grid: grid.map((r) => r.slice(0, C)),
      },
      queue: {
        id: 'queue',
        type: 'queue',
        label: 'BFS Exploration Queue',
        items: [],
      },
      visitedCount: {
        id: 'visitedCount',
        type: 'variable',
        name: 'visitedCount',
        value: 0,
      },
    };

    const steps = [];
    let eventCounter = 1;
    let currentStepNumber = 0;
    const visited = Array.from({ length: R }, () => new Array(C).fill(false));
    const queue = [];
    let islandCount = 0;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: 'Step 0: Initialize Grid BFS',
      operation: 'INITIALIZE',
      description: `Initialize 2D grid ${R}x${C} and BFS exploration queue.`,
      changed: ['grid', 'queue'],
      state: { queue: [], visitedCount: 0 },
      highlights: {},
      events: [],
    });
    currentStepNumber++;

    for (let r = 0; r < R; r++) {
      for (let c = 0; c < C; c++) {
        const cellVal = grid[r][c];
        const isLand = cellVal === 1 || cellVal === '1';

        if (isLand && !visited[r][c]) {
          islandCount++;
          visited[r][c] = true;
          queue.push([r, c]);

          const stepEvents = [
            {
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.GRID_VISIT,
              target: { primitiveId: 'grid' },
              data: { row: r, col: c, value: cellVal },
              description: `Discovered new region root at (${r}, ${c}).`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            },
            {
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.QUEUE_ENQUEUE,
              target: { primitiveId: 'queue' },
              data: { value: `(${r},${c})` },
              description: `Enqueue cell (${r}, ${c}) for BFS exploration.`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            },
          ];

          steps.push({
            id: `step-${currentStepNumber}`,
            stepNumber: currentStepNumber,
            label: `Step ${currentStepNumber}: Region #${islandCount} at (${r}, ${c})`,
            operation: 'REGION_START',
            description: `Found unvisited land at (${r}, ${c}). Enqueued to BFS Queue. Region #${islandCount}.`,
            changed: ['grid', 'queue', 'visitedCount'],
            state: { queue: [...queue], visitedCount: islandCount },
            highlights: { activeCell: [r, c] },
            events: stepEvents,
          });
          currentStepNumber++;

          while (queue.length > 0) {
            const [cr, cc] = queue.shift();
            const dirs = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ];

            for (const [dr, dc] of dirs) {
              const nr = cr + dr;
              const nc = cc + dc;

              if (nr >= 0 && nr < R && nc >= 0 && nc < C && !visited[nr][nc]) {
                const nVal = grid[nr][nc];
                if (nVal === 1 || nVal === '1') {
                  visited[nr][nc] = true;
                  queue.push([nr, nc]);

                  const subEvents = [
                    {
                      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
                      step: currentStepNumber,
                      type: VISUALIZATION_EVENTS.GRID_VISIT,
                      target: { primitiveId: 'grid' },
                      data: { row: nr, col: nc, value: nVal },
                      description: `BFS neighbor visited: (${nr}, ${nc}).`,
                      schemaVersion: EVENT_SCHEMA_VERSION,
                    },
                  ];

                  steps.push({
                    id: `step-${currentStepNumber}`,
                    stepNumber: currentStepNumber,
                    label: `Step ${currentStepNumber}: Expand to (${nr}, ${nc})`,
                    operation: 'BFS_EXPAND',
                    description: `Visited connected neighbor (${nr}, ${nc}).`,
                    changed: ['grid', 'queue'],
                    state: { queue: [...queue], visitedCount: islandCount },
                    highlights: { activeCell: [nr, nc] },
                    events: subEvents,
                  });
                  currentStepNumber++;
                }
              }
            }
          }
        }
      }
    }

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      approachId: options.approachId || 'grid-bfs',
      approachName: options.approachName || '2D Grid BFS Exploration Engine',
      initialState: {
        schemaVersion: EVENT_SCHEMA_VERSION,
        problemId,
        title: input.problem?.title || 'Grid / Graph Archetype',
        primitives: initialPrimitives,
      },
      steps,
      finalState: { result: islandCount, regionsCount: islandCount },
      result: islandCount,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Mode 2: Graph Adjacency / Shortest-Path / BFS Traversal
  const numNodes = Number(params.n || params.numNodes) || 4;
  let rawEdges = params.edges || params.graph;
  if (!Array.isArray(rawEdges)) {
    rawEdges = [
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 3],
    ];
  }
  const startNode = params.start !== undefined && Number.isInteger(Number(params.start)) ? Number(params.start) : 0;

  // Build adjacency list
  const adj = Array.from({ length: numNodes }, () => []);
  for (const edge of rawEdges) {
    if (Array.isArray(edge) && edge.length >= 2) {
      const u = Number(edge[0]);
      const v = Number(edge[1]);
      if (u >= 0 && u < numNodes && v >= 0 && v < numNodes) {
        adj[u].push(v);
        adj[v].push(u); // unweighted undirected graph
      }
    }
  }

  const dist = new Array(numNodes).fill(Infinity);
  dist[startNode] = 0;

  const initialPrimitives = {
    distances: {
      id: 'distances',
      type: 'array',
      label: 'Shortest Distances from Source',
      values: dist.map((d) => (d === Infinity ? -1 : d)),
    },
    queue: {
      id: 'queue',
      type: 'queue',
      label: 'BFS Queue',
      items: [startNode],
    },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;
  const queue = [startNode];
  const visitedNodes = new Set([startNode]);

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initialize Graph BFS',
    operation: 'INITIALIZE',
    description: `Initialize BFS from source vertex ${startNode}. Distance to source = 0.`,
    changed: ['distances', 'queue'],
    state: { dist: dist.map((d) => (d === Infinity ? -1 : d)), queue: [...queue] },
    highlights: {},
    events: [],
  });
  currentStepNumber++;

  while (queue.length > 0) {
    const u = queue.shift();

    const dequeueEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.QUEUE_DEQUEUE,
        target: { primitiveId: 'queue' },
        data: { dequeuedValue: u, items: [...queue] },
        description: `Dequeue vertex ${u} for neighbor expansion.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Expand Vertex ${u}`,
      operation: 'GRAPH_EXPAND',
      description: `Dequeued vertex ${u} (current distance ${dist[u]}).`,
      changed: ['queue'],
      state: { currentVertex: u, dist: dist.map((d) => (d === Infinity ? -1 : d)), queue: [...queue] },
      highlights: { activeIndex: u },
      events: dequeueEvents,
    });
    currentStepNumber++;

    for (const v of adj[u]) {
      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
          target: { primitiveId: 'distances' },
          data: { index: v, value: dist[v] === Infinity ? -1 : dist[v] },
          description: `Discover edge (${u} -> ${v}). Inspect distance to ${v}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      // Relax edge
      if (dist[u] + 1 < dist[v]) {
        dist[v] = dist[u] + 1;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
          target: { primitiveId: 'distances' },
          data: { index: v, value: dist[v] },
          description: `Relax edge: dist[${v}] updated to ${dist[v]}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        if (!visitedNodes.has(v)) {
          visitedNodes.add(v);
          queue.push(v);
          stepEvents.push({
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.QUEUE_ENQUEUE,
            target: { primitiveId: 'queue' },
            data: { value: v, items: [...queue] },
            description: `Enqueue unvisited vertex ${v}.`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          });
        }
      }

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Edge (${u} -> ${v})`,
        operation: 'EDGE_RELAX',
        description: `Inspected edge (${u} -> ${v}). Shortest distance to ${v} = ${dist[v]}.`,
        changed: ['distances', 'queue'],
        state: { currentVertex: u, dist: dist.map((d) => (d === Infinity ? -1 : d)), queue: [...queue] },
        highlights: { activeIndex: v },
        events: stepEvents,
      });
      currentStepNumber++;
    }
  }

  const normalizedDist = dist.map((d) => (d === Infinity ? -1 : d));
  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'graph-bfs',
    approachName: options.approachName || 'Graph BFS Shortest-Path Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Graph Shortest-Path Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: { result: normalizedDist, distances: normalizedDist },
    result: normalizedDist,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 7. HEAPS / PRIORITY QUEUE ENGINE (heap, priority-queue)
// Capability: Insert, extract, sift-up, sift-down
// Examples: Top K Frequent, Kth Largest
// =============================================================
function traceHeapFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const nums = inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'array', 'elements']);
  const k = params.k !== undefined && Number.isInteger(Number(params.k)) && Number(params.k) > 0 ? Number(params.k) : 2;

  const N = Math.min(nums.length, limits.maxInputLength || 100);
  const problemId = options.problemId || input.problem?.problemId || 'generic-heap';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Numbers',
      values: nums.slice(0, N),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    minHeap: {
      id: 'minHeap',
      type: 'heap',
      label: `Min-Heap (Size <= ${k})`,
      values: [],
      heapType: 'min',
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: null,
    },
  };

  const heap = [];
  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Initialize Min-Heap',
    operation: 'INITIALIZE',
    description: `Initialize empty Min-Heap with capacity k = ${k}.`,
    changed: ['minHeap'],
    state: { heap: [], result: null, index: null },
    highlights: {},
    events: [],
  });
  currentStepNumber++;

  for (let i = 0; i < N; i++) {
    const val = nums[i];

    // Sift Up insertion
    heap.push(val);
    let currIdx = heap.length - 1;

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.HEAP_INSERT,
        target: { primitiveId: 'minHeap' },
        data: { value: val, resultingState: [...heap] },
        description: `Insert ${val} into Min-Heap at index ${currIdx}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    while (currIdx > 0) {
      const parentIdx = Math.floor((currIdx - 1) / 2);
      if (heap[currIdx] < heap[parentIdx]) {
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HEAP_SWAP,
          target: { primitiveId: 'minHeap' },
          data: {
            indices: [currIdx, parentIdx],
            values: [heap[currIdx], heap[parentIdx]],
            resultingState: [...heap],
          },
          description: `Sift-up: Swap child ${heap[currIdx]} with parent ${heap[parentIdx]}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });
        const temp = heap[currIdx];
        heap[currIdx] = heap[parentIdx];
        heap[parentIdx] = temp;
        currIdx = parentIdx;
      } else {
        break;
      }
    }

    // If heap size exceeds k, extract-min
    if (heap.length > k) {
      const minVal = heap[0];
      const last = heap.pop();
      if (heap.length > 0) {
        heap[0] = last;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HEAP_REMOVE,
          target: { primitiveId: 'minHeap' },
          data: { value: minVal, resultingState: [...heap] },
          description: `Heap size exceeded k (${k}). Extract min element ${minVal}.`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        // Sift down
        let pIdx = 0;
        while (true) {
          const leftIdx = 2 * pIdx + 1;
          const rightIdx = 2 * pIdx + 2;
          let smallest = pIdx;

          if (leftIdx < heap.length && heap[leftIdx] < heap[smallest]) smallest = leftIdx;
          if (rightIdx < heap.length && heap[rightIdx] < heap[smallest]) smallest = rightIdx;

          if (smallest !== pIdx) {
            stepEvents.push({
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.HEAP_SWAP,
              target: { primitiveId: 'minHeap' },
              data: {
                indices: [pIdx, smallest],
                values: [heap[pIdx], heap[smallest]],
                resultingState: [...heap],
              },
              description: `Sift-down: Swap parent ${heap[pIdx]} with child ${heap[smallest]}.`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
            const swapTemp = heap[pIdx];
            heap[pIdx] = heap[smallest];
            heap[smallest] = swapTemp;
            pIdx = smallest;
          } else {
            break;
          }
        }
      }
    }

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Insert ${val} into Heap`,
      operation: 'HEAP_INSERT',
      description: `Heap state after processing ${val}: [${heap.join(', ')}].`,
      changed: ['minHeap'],
      state: { heap: [...heap], result: heap[0] || null, index: i },
      highlights: { activeIndex: i },
      events: stepEvents,
    });
    currentStepNumber++;
  }

  const finalResult = heap[0] || null;

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'min-heap',
    approachName: options.approachName || 'Min-Heap Priority Queue Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Heap Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: {
      result: finalResult,
      heap: [...heap],
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
}

// =============================================================
// 8. DYNAMIC PROGRAMMING ENGINE (dynamic-programming, dp)
// Capability: State reads/writes, transitions, recurrence evaluation
// Examples: Climbing Stairs, Coin Change
// =============================================================
function traceDynamicProgrammingFamily(input, options = {}, limits = {}) {
  const params = inputNormalizer.normalizeTestCaseInput(input.testCase, input.problem);
  const problemId = options.problemId || input.problem?.problemId || 'generic-dp';
  const traceId = `trace-${problemId}-tc${options.testCaseId || 1}-${Date.now()}`;

  // Mode 1: Coin Change (Minimum Coins Recurrence)
  const isCoinChange = Array.isArray(params.coins) && params.amount !== undefined;
  if (isCoinChange) {
    const coins = params.coins;
    const amount = Math.min(Number(params.amount) || 0, 30);
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;

    const initialPrimitives = {
      dpTable: {
        id: 'dpTable',
        type: 'array',
        label: 'DP Minimum Coins Table',
        values: [...dp].map((v) => (v === Infinity ? '∞' : v)),
      },
      coins: {
        id: 'coins',
        type: 'array',
        label: 'Denominations',
        values: coins,
      },
    };

    const steps = [];
    let eventCounter = 1;
    let currentStepNumber = 0;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: 'Step 0: Base Case dp[0] = 0',
      operation: 'INITIALIZE',
      description: `Initialize dp array of size ${amount + 1} with base case dp[0] = 0.`,
      changed: ['dpTable'],
      state: { dp: [...dp], currentAmount: 0 },
      highlights: { matchedIndices: [0] },
      events: [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
          target: { primitiveId: 'dpTable' },
          data: { index: 0, value: 0 },
          description: 'Set base case dp[0] = 0',
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ],
    });
    currentStepNumber++;

    for (let a = 1; a <= amount; a++) {
      for (const coin of coins) {
        if (a - coin >= 0) {
          const stepEvents = [
            {
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
              target: { primitiveId: 'dpTable' },
              data: { index: a - coin, value: dp[a - coin] === Infinity ? -1 : dp[a - coin] },
              description: `Read previous subproblem state dp[${a - coin}].`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            },
          ];

          if (dp[a - coin] !== Infinity && dp[a - coin] + 1 < dp[a]) {
            dp[a] = dp[a - coin] + 1;
            stepEvents.push({
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
              target: { primitiveId: 'dpTable' },
              data: { index: a, value: dp[a] },
              description: `Transition: dp[${a}] = min(dp[${a}], dp[${a - coin}] + 1) = ${dp[a]}.`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
          }

          steps.push({
            id: `step-${currentStepNumber}`,
            stepNumber: currentStepNumber,
            label: `Step ${currentStepNumber}: Amount ${a} using Coin ${coin}`,
            operation: 'RECURRENCE_EVALUATE',
            description: `Evaluated amount ${a} with coin ${coin}. Current optimal dp[${a}] = ${dp[a] === Infinity ? '∞' : dp[a]}.`,
            changed: ['dpTable'],
            state: { dp: [...dp], currentAmount: a },
            highlights: { activeIndex: a, matchedIndices: [a - coin] },
            events: stepEvents,
          });
          currentStepNumber++;
        }
      }
    }

    const finalAnswer = dp[amount] === Infinity ? -1 : dp[amount];
    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      approachId: options.approachId || 'coin-change-dp',
      approachName: options.approachName || 'Coin Change Dynamic Programming Engine',
      initialState: {
        schemaVersion: EVENT_SCHEMA_VERSION,
        problemId,
        title: input.problem?.title || 'Coin Change DP Archetype',
        primitives: initialPrimitives,
      },
      steps,
      finalState: { result: finalAnswer, dpTable: dp },
      result: finalAnswer,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Mode 2: 1D Recurrence (Climbing Stairs style: dp[i] = dp[i-1] + dp[i-2])
  let n = 5;
  if (params.n !== undefined && Number.isInteger(Number(params.n)) && Number(params.n) > 0) {
    n = Math.min(Number(params.n), 25);
  } else if (Array.isArray(params.nums) && params.nums.length > 0) {
    n = Math.min(params.nums.length, 25);
  }

  const dp = new Array(n + 1).fill(0);
  const initialPrimitives = {
    dpTable: {
      id: 'dpTable',
      type: 'array',
      label: 'DP State Table',
      values: new Array(n + 1).fill(0),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: 0,
    },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 0;

  // Base Cases
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 0: Base Cases',
    operation: 'BASE_CASES',
    description: `Initialize base cases: dp[0] = 1, dp[1] = 1.`,
    changed: ['dpTable'],
    state: { dp: [...dp], result: dp[1] || dp[0] },
    highlights: { matchedIndices: [0, 1] },
    events: [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
        target: { primitiveId: 'dpTable' },
        data: { index: 0, value: 1 },
        description: 'Set base case dp[0] = 1',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
        target: { primitiveId: 'dpTable' },
        data: { index: 1, value: 1 },
        description: 'Set base case dp[1] = 1',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ],
  });
  currentStepNumber++;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
        target: { primitiveId: 'dpTable' },
        data: { index: i, pointerId: 'i' },
        description: `Evaluating state dp[${i}] = dp[${i - 1}] + dp[${i - 2}] (${dp[i - 1]} + ${dp[i - 2]}).`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
        target: { primitiveId: 'dpTable' },
        data: { index: i, value: dp[i] },
        description: `Recorded dp[${i}] = ${dp[i]}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Compute dp[${i}] = ${dp[i]}`,
      operation: 'RECURRENCE_EVALUATE',
      description: `Transition: dp[${i}] = dp[${i - 1}] (${dp[i - 1]}) + dp[${i - 2}] (${dp[i - 2]}) = ${dp[i]}.`,
      changed: ['dpTable'],
      state: { dp: [...dp], result: dp[i] },
      highlights: { activeIndex: i, matchedIndices: [i - 1, i - 2] },
      events: stepEvents,
    });
    currentStepNumber++;
  }

  const finalResult = dp[n];

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    approachId: options.approachId || 'dynamic-programming',
    approachName: options.approachName || 'Dynamic Programming Recurrence Engine',
    initialState: {
      schemaVersion: EVENT_SCHEMA_VERSION,
      problemId,
      title: input.problem?.title || 'Dynamic Programming Archetype',
      primitives: initialPrimitives,
    },
    steps,
    finalState: {
      result: finalResult,
      dp: [...dp],
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
}

module.exports = {
  traceArrayHashMapFamily,
  traceTwoPointersFamily,
  traceStackQueueFamily,
  traceLinkedListFamily,
  traceBinaryTreeFamily,
  traceGraphFamily,
  traceHeapFamily,
  traceDynamicProgrammingFamily,
  traceGridFamily: traceGraphFamily, // Alias for backward compatibility
};
