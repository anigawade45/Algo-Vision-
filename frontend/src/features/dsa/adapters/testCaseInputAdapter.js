import { EVENT_SCHEMA_VERSION } from '../events/visualizationEventTypes.js';
import { getDryRunMappingForProblem } from './dryRunVisualizationMappings.js';

/**
 * AlgoVision — Stage 09 Generic Test-Case Input Adapter
 *
 * Deterministically transforms authoritative problem test-case inputs into
 * the initial scene state consumed by Stage 09 generic visualization primitives.
 * Completely independent of Stage 08 Dry Run execution data.
 */

// Metadata keys that belong to test case record wrapping and must NEVER be rendered as algorithm primitives
const METADATA_KEYS = new Set([
  'id',
  'inputraw',
  'outputraw',
  'inputstructured',
  'outputstructured',
  'reasoning',
  'interaction',
  'type',
  'label',
  'value',
  'array',
  'nums',
  'grid',
  'matrix',
  'nodes',
  'ranges',
  'intervals',
  '_id',
  'createdat',
  'updatedat',
  'metadata',
  'title',
  'problemid',
  'description',
  'constraints',
  'observations',
  'tags',
  'ispublished',
  'createdby',
]);

/**
 * Balanced bracket and quote-aware parser for raw input strings such as:
 * "nums = [2, 7, 11, 15], target = 9"
 * "s = \"([{}])\""
 * "head = [1, 2, 3, 4, 5]"
 * "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"0\",\"0\"]]"
 *
 * @param {string} rawStr
 * @returns {Object|null} Key-value map of parsed variables or null if unparseable
 */
export function parseRawInputString(rawStr) {
  if (!rawStr || typeof rawStr !== 'string' || rawStr.trim() === '') return null;

  const trimmed = rawStr.trim();

  // 1. Direct JSON (object or array)
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // Fall through to variable assignment scanning
    }
  }

  // 2. Tokenize by top-level commas taking into account nested brackets [], {} and quotes
  const tokens = [];
  let current = '';
  let bracketDepth = 0;
  let inQuote = null;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];

    if (inQuote) {
      current += ch;
      if (ch === inQuote && trimmed[i - 1] !== '\\') {
        inQuote = null;
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch;
      current += ch;
    } else if (ch === '[' || ch === '{') {
      bracketDepth++;
      current += ch;
    } else if (ch === ']' || ch === '}') {
      bracketDepth--;
      current += ch;
    } else if (ch === ',' && bracketDepth === 0) {
      if (current.trim()) tokens.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim()) tokens.push(current.trim());

  const result = {};
  let assignmentCount = 0;

  for (const token of tokens) {
    const eqIdx = token.indexOf('=');
    if (eqIdx !== -1) {
      const key = token.slice(0, eqIdx).trim();
      const valStr = token.slice(eqIdx + 1).trim();

      try {
        result[key] = JSON.parse(valStr);
      } catch {
        if (
          (valStr.startsWith('"') && valStr.endsWith('"')) ||
          (valStr.startsWith("'") && valStr.endsWith("'"))
        ) {
          result[key] = valStr.slice(1, -1);
        } else if (!isNaN(Number(valStr))) {
          result[key] = Number(valStr);
        } else if (valStr === 'true') {
          result[key] = true;
        } else if (valStr === 'false') {
          result[key] = false;
        } else {
          result[key] = valStr;
        }
      }
      assignmentCount++;
    }
  }

  return assignmentCount > 0 ? result : null;
}

/**
 * Extracts and normalizes the core test-case input payload from diverse representations.
 *
 * @param {*} testCase - Test case record or input payload
 * @returns {{ data: Object|Array|string|number, rawString: string, typeHint: string|null }}
 */
export function normalizeTestCaseInput(testCase) {
  if (testCase === null || testCase === undefined) {
    return { data: null, rawString: '', typeHint: null };
  }

  // 1. If it's an empty object
  if (typeof testCase === 'object' && !Array.isArray(testCase) && Object.keys(testCase).length === 0) {
    return { data: null, rawString: '', typeHint: null };
  }

  const rawString = testCase.inputRaw || (typeof testCase === 'string' ? testCase : '');

  // 2. If it's a test case object containing inputStructured
  if (typeof testCase === 'object' && testCase !== null) {
    if (testCase.inputStructured !== undefined) {
      if (
        testCase.inputStructured === null ||
        (typeof testCase.inputStructured === 'object' &&
          !Array.isArray(testCase.inputStructured) &&
          Object.keys(testCase.inputStructured).length === 0)
      ) {
        return {
          data: null,
          rawString,
          typeHint: null,
        };
      }

      const typeHint = testCase.inputStructured.type || null;
      return {
        data: testCase.inputStructured,
        rawString,
        typeHint,
      };
    }

    // 3. If it's a problem-level inputData object: { type, value, ... }
    if (testCase.type && (testCase.value !== undefined || testCase.grid || testCase.nodes || testCase.array)) {
      return {
        data: testCase,
        rawString,
        typeHint: testCase.type,
      };
    }

    // 4. If it has a 'value' wrapper
    if (testCase.value !== undefined && testCase.value !== null) {
      return {
        data: testCase.value,
        rawString,
        typeHint: testCase.type || null,
      };
    }

    // 5. If it's a test-case container that only has metadata (e.g. { id, inputRaw, outputRaw }),
    // signal that rawString should be parsed instead of treating the wrapper as the data payload!
    const nonMetaKeys = Object.keys(testCase).filter((k) => !METADATA_KEYS.has(k.toLowerCase()));
    if (nonMetaKeys.length === 0 && rawString) {
      return {
        data: null,
        rawString,
        typeHint: null,
      };
    }
  }

  // 6. Raw primitive value (e.g. string or array)
  return {
    data: testCase,
    rawString,
    typeHint: null,
  };
}

/**
 * Builds standard 2D layout coordinates and edges for a Binary Tree level-order array.
 * e.g. [1, null, 2, 3] or [4, 2, 6, 1, 3, 5, 7]
 *
 * @param {Array} arr - Level-order node values
 * @returns {{ nodesMap: Object, edgeList: Array, rootValue: * }}
 */
export function buildBinaryTreeLayout(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return { nodesMap: {}, edgeList: [], rootValue: null };
  }

  const nodesMap = {};
  const edgeList = [];
  const rootValue = arr[0];

  // Standard predefined coordinates for up to 3 levels (7 nodes max in standard view)
  const levelCoords = [
    // Level 0 (root: index 0)
    [{ x: 50, y: 15 }],
    // Level 1 (indices 1, 2)
    [
      { x: 26, y: 45 },
      { x: 74, y: 45 },
    ],
    // Level 2 (indices 3, 4, 5, 6)
    [
      { x: 14, y: 80 },
      { x: 38, y: 80 },
      { x: 62, y: 80 },
      { x: 86, y: 80 },
    ],
  ];

  let currentLevel = 0;
  let levelStartIndex = 0;
  let levelCapacity = 1;

  for (let i = 0; i < Math.min(arr.length, 7); i++) {
    // Check if moving to next level
    if (i >= levelStartIndex + levelCapacity) {
      currentLevel++;
      levelStartIndex += levelCapacity;
      levelCapacity *= 2;
    }

    const val = arr[i];
    if (val !== null && val !== undefined) {
      const posInLevel = i - levelStartIndex;
      const coords = levelCoords[currentLevel]?.[posInLevel] || { x: 50, y: 50 };
      nodesMap[String(val)] = { x: coords.x, y: coords.y, val };

      // Add edge from parent if not root
      if (i > 0) {
        const parentIdx = Math.floor((i - 1) / 2);
        const parentVal = arr[parentIdx];
        if (parentVal !== null && parentVal !== undefined) {
          edgeList.push({ from: parentVal, to: val });
        }
      }
    }
  }

  return { nodesMap, edgeList, rootValue };
}

/**
 * Transforms an authoritative test-case input into Stage 09 initial visualization state.
 *
 * @param {*} testCase - Selected test case or raw input
 * @param {Object} [problemContext={}] - Problem context: { id, problemId, title, category, difficulty, testCases }
 * @returns {{ success: boolean, initialState: Object|null, error: Object|null }}
 */
export function adaptTestCaseToInitialState(testCase, problemContext = {}) {
  const problemId = problemContext.problemId || problemContext.id || 'generic-problem';
  const title = problemContext.title || 'Algorithm Visualization';
  const category = problemContext.category || '';
  const testCaseId = testCase?.id !== undefined ? testCase.id : (problemContext.testCaseId || 1);

  // 1. Normalize input
  const { data: rawPayload, rawString, typeHint } = normalizeTestCaseInput(testCase);

  // 2. Parse rawString if payload is missing or unparsed string
  let normalizedData = rawPayload;
  if (!normalizedData && rawString) {
    const parsed = parseRawInputString(rawString);
    if (parsed) {
      normalizedData = parsed;
    }
  } else if (typeof normalizedData === 'string' && !typeHint) {
    const parsed = parseRawInputString(normalizedData);
    if (parsed && typeof parsed === 'object') {
      normalizedData = parsed;
    }
  }

  // 3. Reject missing or completely empty inputs
  if (
    normalizedData === null ||
    normalizedData === undefined ||
    (typeof normalizedData === 'object' && !Array.isArray(normalizedData) && Object.keys(normalizedData).length === 0)
  ) {
    return {
      success: false,
      initialState: null,
      error: {
        code: 'MISSING_TEST_CASE',
        message: `Test case input data is missing or empty for test case #${testCaseId}.`,
      },
    };
  }

  // 4. Resolve problem primitive mapping template if available
  const existingMapping = getDryRunMappingForProblem(problemId, null);

  const primitives = {};
  const detectedTypes = [];

  // Helper to safely register a primitive
  const registerPrimitive = (id, prim) => {
    primitives[id] = prim;
    if (!detectedTypes.includes(prim.type)) {
      detectedTypes.push(prim.type);
    }
  };

  // Helper to register scalar variable
  const registerVariable = (name, value) => {
    registerPrimitive(name, {
      id: name,
      type: 'variable',
      name,
      value,
    });
  };

  // -------------------------------------------------------------
  // STRUCTURE IDENTIFICATION & CONVERSION (GENERIC, NOT HARDCODED)
  // -------------------------------------------------------------

  const explicitType = (typeHint || normalizedData?.type || '').toLowerCase();

  // 1. Linked List
  if (
    explicitType.includes('linked_list') ||
    explicitType.includes('linkedlist') ||
    normalizedData.head !== undefined ||
    (normalizedData.nodes && (category.toLowerCase().includes('linked') || problemId.includes('linked-list')))
  ) {
    const rawNodes =
      normalizedData.nodes ||
      normalizedData.head ||
      normalizedData.array ||
      (Array.isArray(normalizedData.value) ? normalizedData.value : []);
    const nodesList = Array.isArray(rawNodes) ? rawNodes : [];

    registerPrimitive('head', {
      id: 'head',
      type: 'linkedList',
      label: 'Linked List (head)',
      nodes: [...nodesList],
      headId: nodesList.length > 0 ? 0 : null,
      tailId: nodesList.length > 0 ? nodesList.length - 1 : null,
      currId: nodesList.length > 0 ? 0 : null,
    });
  }

  // 2. Binary Tree / Tree
  else if (
    explicitType.includes('tree') ||
    (normalizedData.nodes && (category.toLowerCase().includes('tree') || problemId.includes('tree'))) ||
    normalizedData.arrayForm ||
    normalizedData.root !== undefined
  ) {
    const treeArr = Array.isArray(normalizedData.nodes)
      ? normalizedData.nodes
      : Array.isArray(normalizedData.arrayForm)
      ? normalizedData.arrayForm
      : Array.isArray(normalizedData.value?.arrayForm)
      ? normalizedData.value.arrayForm
      : Array.isArray(normalizedData.root)
      ? normalizedData.root
      : [];

    const { nodesMap, edgeList, rootValue } = buildBinaryTreeLayout(treeArr);

    registerPrimitive('root', {
      id: 'root',
      type: 'tree',
      label: 'Binary Tree (root)',
      nodes: nodesMap,
      edges: edgeList,
      rootValue,
      currentNode: rootValue,
    });

    if (normalizedData.k !== undefined) {
      registerVariable('k', normalizedData.k);
    }
  }

  // 3. 2D Grid / Matrix
  else if (
    explicitType.includes('grid') ||
    explicitType.includes('matrix') ||
    Array.isArray(normalizedData.grid) ||
    (Array.isArray(normalizedData.matrix) && Array.isArray(normalizedData.matrix[0]))
  ) {
    const rawGrid = normalizedData.grid || normalizedData.matrix || normalizedData.value || [];
    const isGridOfStrings = Array.isArray(rawGrid) && rawGrid.length > 0 && typeof rawGrid[0]?.[0] === 'string';

    registerPrimitive('grid', {
      id: 'grid',
      type: isGridOfStrings ? 'grid' : 'matrix',
      label: isGridOfStrings ? '2D Grid Map' : '2D Matrix',
      ...(isGridOfStrings ? { grid: rawGrid } : { matrix: rawGrid }),
      currentRow: 0,
      currentCol: 0,
      activeCell: [0, 0],
    });
  }

  // 4. String sequence
  else if (
    explicitType === 'string' ||
    typeof normalizedData === 'string' ||
    (typeof normalizedData.value === 'string' && !Array.isArray(normalizedData.value)) ||
    typeof normalizedData.s === 'string'
  ) {
    const strVal =
      typeof normalizedData === 'string'
        ? normalizedData
        : typeof normalizedData.value === 'string'
        ? normalizedData.value
        : normalizedData.s || '';

    registerPrimitive('chars', {
      id: 'chars',
      type: 'array',
      label: 'Character Sequence (s)',
      values: Array.from(strVal),
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
      windowRange: null,
    });

    registerVariable('s', strVal);

    // Provide sliding-window primitives when problem is substring / sliding window
    const isSlidingWindow =
      category.toLowerCase().includes('sliding') ||
      problemId.includes('substring') ||
      problemId.includes('sliding-window') ||
      problemId === '3';

    if (isSlidingWindow) {
      registerVariable('left', null);
      registerVariable('right', null);
      registerVariable('windowString', '');
      registerVariable('windowChars', {});
      registerVariable('maxLength', 0);
      registerVariable('bestWindow', '');
      registerVariable('bestRange', null);
    } else if (
      category.toLowerCase().includes('stack') ||
      category.toLowerCase().includes('string') ||
      problemId.includes('parentheses')
    ) {
      // Provide auxiliary stack if category or problem tag suggests stack (e.g. Valid Parentheses)
      registerPrimitive('stack', {
        id: 'stack',
        type: 'stack',
        label: 'Character Stack',
        items: [],
      });
    }
  }

  // 5. Array with Target (e.g. Two Sum)
  else if (
    explicitType === 'array_with_target' ||
    (normalizedData.array && normalizedData.target !== undefined) ||
    (normalizedData.nums && normalizedData.target !== undefined)
  ) {
    const arr = normalizedData.array || normalizedData.nums || normalizedData.value?.array || [];
    const target = normalizedData.target !== undefined ? normalizedData.target : normalizedData.value?.target;

    registerPrimitive('nums', {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...arr],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    });

    if (target !== undefined) {
      registerVariable('target', target);
    }

    // Register initially empty HashMap for Two Sum and complement lookup
    registerPrimitive('hashMap', {
      id: 'hashMap',
      type: 'variable',
      name: 'hashMap',
      value: {},
      label: 'HashMap (Seen Value → Index)',
    });

    registerPrimitive('num', {
      id: 'num',
      type: 'variable',
      name: 'num',
      value: null,
      typeLabel: 'number',
    });

    registerPrimitive('complement', {
      id: 'complement',
      type: 'variable',
      name: 'complement',
      value: null,
      typeLabel: 'number',
    });
  }

  // 6. Array with K (e.g. Kth Largest Element, Sliding Window)
  else if (
    explicitType.includes('array_with_k') ||
    explicitType.includes('array_with_window') ||
    (normalizedData.array && normalizedData.k !== undefined) ||
    (normalizedData.nums && normalizedData.k !== undefined)
  ) {
    const arr = normalizedData.array || normalizedData.nums || normalizedData.value?.array || [];
    const kVal = normalizedData.k !== undefined ? normalizedData.k : normalizedData.value?.k;

    registerPrimitive('nums', {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...arr],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    });

    if (kVal !== undefined) {
      registerVariable('k', kVal);
    }

    // If problem uses bucket sort (e.g. Top K Frequent Elements)
    const isBucketSort =
      problemId.includes('top-k') ||
      problemId.includes('bucket') ||
      category.toLowerCase().includes('bucket');

    if (isBucketSort) {
      registerPrimitive('frequencyMap', {
        id: 'frequencyMap',
        type: 'variable',
        name: 'frequencyMap',
        value: {},
        label: 'Frequency Map (Number → Frequency)',
      });

      registerPrimitive('buckets', {
        id: 'buckets',
        type: 'variable',
        name: 'buckets',
        value: Array.from({ length: arr.length + 1 }, () => []),
        label: 'Frequency Buckets (1..N)',
        activeFrequency: null,
      });

      registerPrimitive('topKResult', {
        id: 'topKResult',
        type: 'variable',
        name: 'topKResult',
        value: [],
        label: `Top ${kVal ?? 'K'} Elements`,
      });

      registerPrimitive('currentFrequency', {
        id: 'currentFrequency',
        type: 'variable',
        name: 'currentFrequency',
        value: null,
        typeLabel: 'number',
      });

      registerPrimitive('currentNum', {
        id: 'currentNum',
        type: 'variable',
        name: 'currentNum',
        value: null,
        typeLabel: 'number',
      });
    } else if (category.toLowerCase().includes('heap') || problemId.includes('kth-largest')) {
      registerPrimitive('minHeap', {
        id: 'minHeap',
        type: 'heap',
        label: 'Min-Heap (Capacity K)',
        heapType: 'min',
        values: [],
        showArrayBuffer: true,
      });
    }
  }

  // 7. Intervals (e.g. Merge Intervals)
  else if (
    explicitType.includes('interval') ||
    Array.isArray(normalizedData.ranges) ||
    Array.isArray(normalizedData.intervals)
  ) {
    const intervalsArr = normalizedData.ranges || normalizedData.intervals || normalizedData.value || [];
    const formatted = intervalsArr.map((it) => (Array.isArray(it) ? `[${it.join(', ')}]` : String(it)));

    registerPrimitive('intervals', {
      id: 'intervals',
      type: 'array',
      label: 'Intervals',
      values: formatted,
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    });
  }

  // 8. Raw Array Input (e.g. [2, 7, 11, 15] or { array: [...] } or { nums: [...] })
  else if (
    Array.isArray(normalizedData) ||
    Array.isArray(normalizedData.value) ||
    Array.isArray(normalizedData.array) ||
    Array.isArray(normalizedData.nums) ||
    Array.isArray(normalizedData.heights)
  ) {
    const rawArr = Array.isArray(normalizedData)
      ? normalizedData
      : Array.isArray(normalizedData.value)
      ? normalizedData.value
      : Array.isArray(normalizedData.array)
      ? normalizedData.array
      : Array.isArray(normalizedData.nums)
      ? normalizedData.nums
      : normalizedData.heights || [];

    // Check if 2D array (matrix)
    if (rawArr.length > 0 && Array.isArray(rawArr[0])) {
      registerPrimitive('matrix', {
        id: 'matrix',
        type: 'matrix',
        label: 'Matrix',
        matrix: rawArr,
        currentRow: 0,
        currentCol: 0,
        activeCell: [0, 0],
      });
    } else {
      const isHeights = normalizedData.heights !== undefined || problemId.includes('building');
      const primId = isHeights ? 'heights' : 'nums';

      registerPrimitive(primId, {
        id: primId,
        type: 'array',
        label: isHeights ? 'Building Heights' : 'Input Array (nums)',
        values: [...rawArr],
        showBarHeights: isHeights,
        maxBarValue: isHeights && rawArr.length > 0 ? Math.max(...rawArr.map((v) => Number(v) || 0)) : undefined,
        activeIndex: null,
        matchedIndices: [],
        changedIndices: [],
        pointerLabels: {},
      });
    }
  }

  // -------------------------------------------------------------
  // B. SCALAR AND RESOURCE PARAMETER EXTRACTION
  // -------------------------------------------------------------
  // Extract true algorithm parameters while strictly ignoring test-case metadata
  if (typeof normalizedData === 'object' && normalizedData !== null && !Array.isArray(normalizedData)) {
    const targetObj =
      normalizedData.value && typeof normalizedData.value === 'object' && !Array.isArray(normalizedData.value)
        ? { ...normalizedData, ...normalizedData.value }
        : normalizedData;

    Object.entries(targetObj).forEach(([key, val]) => {
      const lowerKey = key.toLowerCase();

      // Strictly skip test-case metadata fields (id, inputRaw, outputRaw, reasoning, etc.)
      if (METADATA_KEYS.has(lowerKey)) {
        return;
      }

      // Bricks / Ladders or custom resources
      if (lowerKey === 'bricks') {
        registerPrimitive('bricks', {
          id: 'bricks',
          type: 'resource',
          label: 'Bricks Remaining',
          value: typeof val === 'number' ? val : 5,
          max: typeof val === 'number' ? val : 5,
          icon: '🧱',
        });
      } else if (lowerKey === 'ladders') {
        registerPrimitive('ladders', {
          id: 'ladders',
          type: 'resource',
          label: 'Ladders Available',
          value: typeof val === 'number' ? val : 1,
          max: typeof val === 'number' ? val : 1,
          icon: '🪜',
        });
      } else if (typeof val === 'number' || typeof val === 'boolean' || typeof val === 'string') {
        if (!primitives[key]) {
          registerVariable(key, val);
        }
      }
    });
  }

  // -------------------------------------------------------------
  // C. SUPPLEMENT FROM PROBLEM TEMPLATE (IF PRISTINE)
  // -------------------------------------------------------------
  if (existingMapping?.primitives) {
    Object.keys(existingMapping.primitives).forEach((primKey) => {
      if (!primitives[primKey]) {
        const template = existingMapping.primitives[primKey];
        if (template.type === 'heap') {
          registerPrimitive(primKey, {
            id: primKey,
            type: 'heap',
            label: template.label || primKey,
            heapType: template.heapType || 'min',
            values: [],
            showArrayBuffer: true,
          });
        }
      }
    });
  }

  // -------------------------------------------------------------
  // D. VALIDATION & FINAL ASSEMBLY
  // -------------------------------------------------------------
  if (Object.keys(primitives).length === 0) {
    return {
      success: false,
      initialState: null,
      error: {
        code: 'UNSUPPORTED_DATA_STRUCTURE',
        message: `Unable to recognize a supported DSA visualization primitive for test case #${testCaseId}.`,
        details: normalizedData,
      },
    };
  }

  const flatState = {
    currentIndex: primitives.nums?.activeIndex !== undefined ? primitives.nums.activeIndex : null,
    currentNum: null,
    complement: null,
    result: null,
  };
  if (primitives.nums?.values) flatState.nums = [...primitives.nums.values];
  if (primitives.target?.value !== undefined) flatState.target = primitives.target.value;
  if (primitives.hashMap?.value !== undefined) flatState.hashMap = primitives.hashMap.value;
  if (primitives.k?.value !== undefined) flatState.k = primitives.k.value;
  if (primitives.chars?.values) flatState.chars = [...primitives.chars.values];
  if (primitives.s?.value !== undefined) flatState.s = primitives.s.value;
  if (primitives.left !== undefined) flatState.left = primitives.left.value;
  if (primitives.right !== undefined) flatState.right = primitives.right.value;
  if (primitives.windowString !== undefined) flatState.windowString = primitives.windowString.value;
  if (primitives.windowChars !== undefined) flatState.windowChars = primitives.windowChars.value;
  if (primitives.maxLength !== undefined) flatState.maxLength = primitives.maxLength.value;
  if (primitives.bestWindow !== undefined) flatState.bestWindow = primitives.bestWindow.value;
  if (primitives.bestRange !== undefined) {
    flatState.bestRange = primitives.bestRange.value;
    flatState.bestWindowRange = primitives.bestRange.value;
  }
  if (primitives.matrix?.matrix) flatState.matrix = primitives.matrix.matrix;
  if (primitives.grid?.grid) flatState.grid = primitives.grid.grid;
  if (primitives.frequencyMap?.value !== undefined) flatState.frequencyMap = primitives.frequencyMap.value;
  if (primitives.buckets?.value !== undefined) flatState.buckets = primitives.buckets.value;
  if (primitives.topKResult?.value !== undefined) flatState.topKResult = primitives.topKResult.value;
  if (primitives.currentFrequency?.value !== undefined) flatState.currentFrequency = primitives.currentFrequency.value;
  if (primitives.currentNum?.value !== undefined) flatState.currentNum = primitives.currentNum.value;

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title,
    testCaseId,
    primitives,
    flatState,
    ...flatState,
    metadata: {
      testCaseId,
      inputRaw: rawString || testCase.inputRaw || '',
      outputRaw: testCase.outputRaw || '',
      detectedTypes,
      source: 'test-case-direct',
    },
  };

  return {
    success: true,
    initialState,
    error: null,
  };
}
