const mongoose = require('mongoose');
const Problem = require('../models/Problem');
const ProblemDryRun = require('../models/ProblemDryRun');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const geminiService = require('./gemini.service');
const inputNormalizer = require('./inputNormalization.service');

class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// -------------------------------------------------------------
// CONSTANTS & EVENT TYPES (Phase 11 & 12 Schema Standards)
// -------------------------------------------------------------
const EXECUTION_TRACE_SCHEMA_VERSION = 1;
const EVENT_SCHEMA_VERSION = 1;

// Canonical Multi-Dimensional Support States (Stage 09 Contract)
const SUPPORT_STATES = Object.freeze({
  LAYOUT_READY: 'LAYOUT_READY',
  TRACE_GENERATED: 'TRACE_GENERATED',
  TRACE_VALIDATED: 'TRACE_VALIDATED',
  RESULT_VERIFIED: 'RESULT_VERIFIED',
  UNSUPPORTED: 'UNSUPPORTED',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
});

const EXECUTION_AVAILABILITY = Object.freeze({
  SPECIFIC_STRATEGY: 'SPECIFIC_STRATEGY',
  FAMILY_ENGINE: 'FAMILY_ENGINE',
  SANDBOX_EXECUTED: 'SANDBOX_EXECUTED',
  LAYOUT_ONLY: 'LAYOUT_ONLY',
  UNSUPPORTED: 'UNSUPPORTED',
});

const TRACE_VALIDITY = Object.freeze({
  VALID: 'VALID',
  INVALID: 'INVALID',
  NONE: 'NONE',
});

const RESULT_VERIFICATION = Object.freeze({
  RESULT_VERIFIED: 'RESULT_VERIFIED',
  VERIFICATION_FAILED: 'VERIFICATION_FAILED',
  TRUSTED_UNCHECKED: 'TRUSTED_UNCHECKED',
  UNCHECKED: 'UNCHECKED',
});

const TRACE_SOURCES = {
  MOCK: 'mock',
  DRY_RUN: 'dry-run',
  EXECUTION: 'execution',
  IMPORTED: 'imported',
  AI: 'ai',
};

const MAX_TRACE_STEPS = 5000;
const MAX_STEP_EVENTS = 500;
const MAX_TOTAL_EVENTS = 50000;

const VISUALIZATION_EVENTS = {
  // Array Events
  ARRAY_ACCESS: 'ARRAY_ACCESS',
  ARRAY_COMPARE: 'ARRAY_COMPARE',
  ARRAY_UPDATE: 'ARRAY_UPDATE',
  ARRAY_HIGHLIGHT: 'ARRAY_HIGHLIGHT',
  ARRAY_POINTER_MOVE: 'ARRAY_POINTER_MOVE',
  ARRAY_RANGE_UPDATE: 'ARRAY_RANGE_UPDATE',
  ARRAY_RESULT: 'ARRAY_RESULT',

  // Pointer Events
  POINTER_MOVE: 'POINTER_MOVE',
  POINTER_CREATE: 'POINTER_CREATE',
  POINTER_REMOVE: 'POINTER_REMOVE',

  // HashMap Events
  HASHMAP_SET: 'HASHMAP_SET',
  HASHMAP_LOOKUP: 'HASHMAP_LOOKUP',
  HASHMAP_DELETE: 'HASHMAP_DELETE',
  HASHMAP_CLEAR: 'HASHMAP_CLEAR',

  // Heap Events
  HEAP_INSERT: 'HEAP_INSERT',
  HEAP_REMOVE: 'HEAP_REMOVE',
  HEAP_UPDATE: 'HEAP_UPDATE',
  HEAP_COMPARE: 'HEAP_COMPARE',
  HEAP_SWAP: 'HEAP_SWAP',
  HEAP_HIGHLIGHT: 'HEAP_HIGHLIGHT',
  HEAP_STATE: 'HEAP_STATE',

  // Stack Events
  STACK_PUSH: 'STACK_PUSH',
  STACK_POP: 'STACK_POP',
  STACK_HIGHLIGHT: 'STACK_HIGHLIGHT',
  STACK_STATE: 'STACK_STATE',

  // Queue Events
  QUEUE_ENQUEUE: 'QUEUE_ENQUEUE',
  QUEUE_DEQUEUE: 'QUEUE_DEQUEUE',
  QUEUE_HIGHLIGHT: 'QUEUE_HIGHLIGHT',
  QUEUE_STATE: 'QUEUE_STATE',

  // Grid Events
  GRID_VISIT: 'GRID_VISIT',
  GRID_UPDATE: 'GRID_UPDATE',
  GRID_HIGHLIGHT: 'GRID_HIGHLIGHT',
  GRID_PATH: 'GRID_PATH',
  GRID_CURRENT_CELL: 'GRID_CURRENT_CELL',

  // Matrix Events
  MATRIX_UPDATE: 'MATRIX_UPDATE',
  MATRIX_SWAP: 'MATRIX_SWAP',
  MATRIX_HIGHLIGHT: 'MATRIX_HIGHLIGHT',
  MATRIX_ACCESS: 'MATRIX_ACCESS',

  // Linked List Events
  LINKED_LIST_CURRENT: 'LINKED_LIST_CURRENT',
  LINKED_LIST_POINTER_MOVE: 'LINKED_LIST_POINTER_MOVE',
  LINKED_LIST_LINK_UPDATE: 'LINKED_LIST_LINK_UPDATE',
  LINKED_LIST_NODE_HIGHLIGHT: 'LINKED_LIST_NODE_HIGHLIGHT',
  LINKED_LIST_NODE_INSERT: 'LINKED_LIST_NODE_INSERT',
  LINKED_LIST_NODE_REMOVE: 'LINKED_LIST_NODE_REMOVE',

  // Tree Events
  TREE_CURRENT: 'TREE_CURRENT',
  TREE_VISIT: 'TREE_VISIT',
  TREE_HIGHLIGHT: 'TREE_HIGHLIGHT',
  TREE_POINTER_MOVE: 'TREE_POINTER_MOVE',
  TREE_STATE: 'TREE_STATE',

  // Resource Events
  RESOURCE_UPDATE: 'RESOURCE_UPDATE',
  RESOURCE_CONSUME: 'RESOURCE_CONSUME',
  RESOURCE_GAIN: 'RESOURCE_GAIN',
  RESOURCE_RESET: 'RESOURCE_RESET',
  RESOURCE_HIGHLIGHT: 'RESOURCE_HIGHLIGHT',

  // Variable Events
  VARIABLE_SET: 'VARIABLE_SET',
  VARIABLE_UPDATE: 'VARIABLE_UPDATE',
  VARIABLE_HIGHLIGHT: 'VARIABLE_HIGHLIGHT',

  // Highlight Events
  HIGHLIGHT_ADD: 'HIGHLIGHT_ADD',
  HIGHLIGHT_REMOVE: 'HIGHLIGHT_REMOVE',
  HIGHLIGHT_SET: 'HIGHLIGHT_SET',

  // Bucket Sort Events
  BUCKET_INSERT: 'BUCKET_INSERT',
  BUCKET_TRAVERSE: 'BUCKET_TRAVERSE',
  RESULT_COLLECT: 'RESULT_COLLECT',

  // Control Events
  STEP_START: 'STEP_START',
  STEP_END: 'STEP_END',
  OPERATION_START: 'OPERATION_START',
  OPERATION_END: 'OPERATION_END',
  RETURN: 'RETURN',
  ERROR: 'ERROR',
};

// -------------------------------------------------------------
// DECLARATIVE MAPPINGS (Benchmark Problems & Fallback Resolver)
// -------------------------------------------------------------
const BENCHMARK_MAPPINGS = {
  // Demonstration Benchmark
  'furthest-building-1642': {
    problemId: 'furthest-building-1642',
    title: '1642. Furthest Building You Can Reach',
    primitives: {
      heights: {
        id: 'heights',
        type: 'array',
        label: 'Building Heights',
        sourceVar: 'heights',
        defaultValues: [4, 2, 7, 6, 9, 14, 12],
        showBarHeights: true,
        maxBarValue: 14,
      },
      currentBuilding: {
        id: 'heights',
        type: 'pointer',
        label: 'building (i)',
        sourceVar: 'currentIndex',
        color: 'blue',
      },
      climbs: {
        id: 'climbs',
        type: 'heap',
        label: 'Ladder Climbs (Min-Heap)',
        sourceVar: 'minHeap',
        heapType: 'min',
        showArrayBuffer: true,
      },
      bricks: {
        id: 'bricks',
        type: 'resource',
        label: 'Bricks Remaining',
        sourceVar: 'bricks',
        max: 5,
        icon: '🧱',
      },
      ladders: {
        id: 'ladders',
        type: 'resource',
        label: 'Ladders Available',
        sourceVar: 'ladders',
        max: 1,
        icon: '🪜',
      },
      currentClimb: {
        id: 'currentClimb',
        type: 'variable',
        name: 'currentClimb',
        sourceVar: 'currentClimb',
        typeLabel: 'number',
      },
    },
    variableMap: {
      currentIndex: { targetId: 'heights', type: 'pointer', pointerId: 'building (i)', color: 'blue' },
      currentClimb: { targetId: 'currentClimb', type: 'variable' },
      minHeap: { targetId: 'climbs', type: 'heap' },
      heap: { targetId: 'climbs', type: 'heap' },
      bricks: { targetId: 'bricks', type: 'resource' },
      ladders: { targetId: 'ladders', type: 'resource' },
    },
  },

  // Benchmark 1: Two Sum
  'two-sum': {
    problemId: 'two-sum',
    title: 'Two Sum',
    primitives: {
      nums: {
        id: 'nums',
        type: 'array',
        label: 'Input Array (nums)',
        sourceVar: 'nums',
        defaultValues: [2, 7, 11, 15],
      },
      pointerI: {
        id: 'nums',
        type: 'pointer',
        label: 'i',
        sourceVar: 'i',
        color: 'blue',
      },
      num: {
        id: 'num',
        type: 'variable',
        name: 'num',
        sourceVar: 'num',
        typeLabel: 'number',
      },
      complement: {
        id: 'complement',
        type: 'variable',
        name: 'complement',
        sourceVar: 'complement',
        typeLabel: 'number',
      },
    },
    variableMap: {
      i: { targetId: 'nums', type: 'pointer', pointerId: 'i', color: 'blue' },
      num: { targetId: 'num', type: 'variable' },
      complement: { targetId: 'complement', type: 'variable' },
    },
  },

  // Benchmark 2: Longest Substring Without Repeating Characters
  'longest-substring-without-repeating-characters': {
    problemId: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    primitives: {
      s: {
        id: 's',
        type: 'array',
        label: 'Input String Array (s)',
        sourceVar: 's',
        defaultValues: ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'],
      },
      leftPointer: {
        id: 's',
        type: 'pointer',
        label: 'left (L)',
        sourceVar: 'left',
        color: 'green',
      },
      rightPointer: {
        id: 's',
        type: 'pointer',
        label: 'right (R)',
        sourceVar: 'right',
        color: 'purple',
      },
      maxLength: {
        id: 'maxLength',
        type: 'variable',
        name: 'maxLength',
        sourceVar: 'maxLength',
        typeLabel: 'number',
      },
    },
    variableMap: {
      left: { targetId: 's', type: 'pointer', pointerId: 'L', color: 'green' },
      right: { targetId: 's', type: 'pointer', pointerId: 'R', color: 'purple' },
      maxLength: { targetId: 'maxLength', type: 'variable' },
      maxLen: { targetId: 'maxLength', type: 'variable' },
    },
  },

  // Benchmark 3: Valid Sudoku
  'valid-sudoku': {
    problemId: 'valid-sudoku',
    title: 'Valid Sudoku',
    primitives: {
      board: {
        id: 'board',
        type: 'matrix',
        label: 'Sudoku Board (9x9)',
        sourceVar: 'board',
      },
      row: {
        id: 'row',
        type: 'variable',
        name: 'row',
        sourceVar: 'r',
        typeLabel: 'number',
      },
      col: {
        id: 'col',
        type: 'variable',
        name: 'col',
        sourceVar: 'c',
        typeLabel: 'number',
      },
    },
    variableMap: {
      board: { targetId: 'board', type: 'matrix' },
      r: { targetId: 'row', type: 'variable' },
      c: { targetId: 'col', type: 'variable' },
      row: { targetId: 'row', type: 'variable' },
      col: { targetId: 'col', type: 'variable' },
    },
  },

  // Benchmark 4: Valid Parentheses
  'valid-parentheses': {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    primitives: {
      stack: {
        id: 'stack',
        type: 'stack',
        label: 'Character Stack',
        sourceVar: 'stack',
        items: [],
      },
      char: {
        id: 'char',
        type: 'variable',
        name: 'char',
        sourceVar: 'c',
      },
    },
    variableMap: {
      stack: { targetId: 'stack', type: 'stack' },
      char: { targetId: 'char', type: 'variable' },
      c: { targetId: 'char', type: 'variable' },
    },
  },

  // Benchmark 5: Number of Recent Calls
  'number-of-recent-calls': {
    problemId: 'number-of-recent-calls',
    title: 'Number of Recent Calls',
    primitives: {
      requests: {
        id: 'requests',
        type: 'queue',
        label: 'Recent Requests Queue',
        sourceVar: 'requests',
        items: [],
      },
      t: {
        id: 't',
        type: 'variable',
        name: 't',
        sourceVar: 't',
        typeLabel: 'number',
      },
      count: {
        id: 'count',
        type: 'variable',
        name: 'count',
        sourceVar: 'count',
        typeLabel: 'number',
      },
    },
    variableMap: {
      requests: { targetId: 'requests', type: 'queue' },
      queue: { targetId: 'requests', type: 'queue' },
      t: { targetId: 't', type: 'variable' },
      count: { targetId: 'count', type: 'variable' },
    },
  },

  // Benchmark 6: Rotate Image
  'rotate-image': {
    problemId: 'rotate-image',
    title: 'Rotate Image',
    primitives: {
      matrix: {
        id: 'matrix',
        type: 'matrix',
        label: 'Matrix (N x N)',
        sourceVar: 'matrix',
      },
      row: {
        id: 'row',
        type: 'variable',
        name: 'row',
        sourceVar: 'i',
      },
      col: {
        id: 'col',
        type: 'variable',
        name: 'col',
        sourceVar: 'j',
      },
    },
    variableMap: {
      matrix: { targetId: 'matrix', type: 'matrix' },
      i: { targetId: 'row', type: 'variable' },
      j: { targetId: 'col', type: 'variable' },
    },
  },

  // Benchmark 7: Reverse Linked List
  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    title: 'Reverse Linked List',
    primitives: {
      list: {
        id: 'list',
        type: 'linked-list',
        label: 'Singly Linked List',
        sourceVar: 'head',
      },
      prev: {
        id: 'prev',
        type: 'variable',
        name: 'prev',
        sourceVar: 'prev',
      },
      curr: {
        id: 'curr',
        type: 'variable',
        name: 'curr',
        sourceVar: 'curr',
      },
    },
    variableMap: {
      list: { targetId: 'list', type: 'linked-list' },
      head: { targetId: 'list', type: 'linked-list' },
      prev: { targetId: 'prev', type: 'variable' },
      curr: { targetId: 'curr', type: 'variable' },
    },
  },

  // Benchmark 8: Binary Tree Inorder Traversal
  'binary-tree-inorder-traversal': {
    problemId: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    primitives: {
      tree: {
        id: 'tree',
        type: 'tree',
        label: 'Binary Tree',
        sourceVar: 'root',
      },
      stack: {
        id: 'stack',
        type: 'stack',
        label: 'Traversal Stack',
        sourceVar: 'stack',
        items: [],
      },
      curr: {
        id: 'curr',
        type: 'variable',
        name: 'curr',
        sourceVar: 'curr',
      },
    },
    variableMap: {
      tree: { targetId: 'tree', type: 'tree' },
      root: { targetId: 'tree', type: 'tree' },
      stack: { targetId: 'stack', type: 'stack' },
      curr: { targetId: 'curr', type: 'variable' },
    },
  },

  // Benchmark 9: Number of Islands
  'number-of-islands': {
    problemId: 'number-of-islands',
    title: 'Number of Islands',
    primitives: {
      grid: {
        id: 'grid',
        type: 'grid',
        label: 'Grid (M x N)',
        sourceVar: 'grid',
      },
      islands: {
        id: 'islands',
        type: 'variable',
        name: 'islands',
        sourceVar: 'count',
        typeLabel: 'number',
      },
    },
    variableMap: {
      grid: { targetId: 'grid', type: 'grid' },
      count: { targetId: 'islands', type: 'variable' },
      islands: { targetId: 'islands', type: 'variable' },
    },
  },

  // Benchmark 10: Kth Largest Element in an Array
  'kth-largest-element': {
    problemId: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    primitives: {
      nums: {
        id: 'nums',
        type: 'array',
        label: 'Input Array (nums)',
        sourceVar: 'nums',
        defaultValues: [3, 2, 1, 5, 6, 4],
      },
      minHeap: {
        id: 'minHeap',
        type: 'heap',
        label: 'Min-Heap (Capacity K)',
        sourceVar: 'minHeap',
        heapType: 'min',
        showArrayBuffer: true,
      },
      val: {
        id: 'val',
        type: 'variable',
        name: 'val',
        sourceVar: 'val',
      },
    },
    variableMap: {
      minHeap: { targetId: 'minHeap', type: 'heap' },
      val: { targetId: 'val', type: 'variable' },
    },
  },
};

/**
 * Resolves declarative or dynamic primitive mapping for any problem
 */
const getDryRunMappingForProblem = (problemId, dryRun = null) => {
  if (problemId && BENCHMARK_MAPPINGS[problemId]) {
    return BENCHMARK_MAPPINGS[problemId];
  }

  const aliasMap = {
    'furthest-building': 'furthest-building-1642',
    '1642': 'furthest-building-1642',
    'kth-largest-element-in-an-array': 'kth-largest-element',
    'longest-substring-no-repeat': 'longest-substring-without-repeating-characters',
    'recent-calls': 'number-of-recent-calls',
    'tree-inorder': 'binary-tree-inorder-traversal',
    'islands': 'number-of-islands',
    'sudoku': 'valid-sudoku',
  };

  const matchedAlias = aliasMap[problemId];
  if (matchedAlias && BENCHMARK_MAPPINGS[matchedAlias]) {
    return BENCHMARK_MAPPINGS[matchedAlias];
  }

  // Dynamic Fallback Mapping
  const primitives = {};
  const variableMap = {};

  if (dryRun) {
    const rawVars = dryRun.initialState?.variables || [];
    let hasArray = false;
    let arrayTargetId = 'arr';

    rawVars.forEach((v) => {
      const name = v.name || v.key;
      if (!name) return;

      const lowerName = name.toLowerCase();

      if (lowerName.includes('heap') || lowerName.includes('minheap') || lowerName.includes('maxheap')) {
        primitives[name] = {
          id: name,
          type: 'heap',
          label: v.label || `${name} Heap`,
          sourceVar: name,
          values: [],
          heapType: lowerName.includes('max') ? 'max' : 'min',
        };
        variableMap[name] = { targetId: name, type: 'heap' };
      } else if (lowerName.includes('stack')) {
        primitives[name] = {
          id: name,
          type: 'stack',
          label: v.label || `${name} Stack`,
          sourceVar: name,
          items: [],
        };
        variableMap[name] = { targetId: name, type: 'stack' };
      } else if (lowerName.includes('queue') || lowerName.includes('deque')) {
        primitives[name] = {
          id: name,
          type: 'queue',
          label: v.label || `${name} Queue`,
          sourceVar: name,
          items: [],
        };
        variableMap[name] = { targetId: name, type: 'queue' };
      } else if (
        ['i', 'j', 'idx', 'index', 'currentindex', 'ptr', 'left', 'right', 'mid'].includes(lowerName)
      ) {
        // Only bind array pointer if the test case actually contains an input array
        let actualArray = null;
        if (dryRun?.testCaseInput) {
          if (Array.isArray(dryRun.testCaseInput)) {
            actualArray = dryRun.testCaseInput;
          } else if (typeof dryRun.testCaseInput === 'object') {
            actualArray =
              dryRun.testCaseInput.nums ||
              dryRun.testCaseInput.array ||
              dryRun.testCaseInput.arr ||
              dryRun.testCaseInput.items ||
              null;
          }
        }
        if (!actualArray && dryRun?.input?.items && Array.isArray(dryRun.input.items) && dryRun.input.items.length > 0) {
          actualArray = dryRun.input.items.map((it) => (it.value !== undefined ? it.value : it));
        }

        if (Array.isArray(actualArray) && actualArray.length > 0) {
          if (!hasArray) {
            primitives[arrayTargetId] = {
              id: arrayTargetId,
              type: 'array',
              label: 'Input Data',
              values: [...actualArray],
            };
            hasArray = true;
          }
          variableMap[name] = {
            targetId: arrayTargetId,
            type: 'pointer',
            pointerId: name,
            color: lowerName === 'left' ? 'green' : lowerName === 'right' ? 'purple' : 'blue',
          };
        } else {
          // Never fabricate input data (e.g. [1, 2, 3, 4, 5])! Map to scalar variable primitive
          primitives[name] = {
            id: name,
            type: 'variable',
            name,
            sourceVar: name,
            value: v.value || 0,
          };
          variableMap[name] = { targetId: name, type: 'variable' };
        }
      } else if (['bricks', 'ladders', 'tokens', 'capacity', 'k'].includes(lowerName)) {
        primitives[name] = {
          id: name,
          type: 'resource',
          label: v.label || name,
          sourceVar: name,
          value: Number(v.value) || 0,
          max: Number(v.value) || 10,
        };
        variableMap[name] = { targetId: name, type: 'resource' };
      } else {
        primitives[name] = {
          id: name,
          type: 'variable',
          name,
          sourceVar: name,
          value: v.value || 0,
        };
        variableMap[name] = { targetId: name, type: 'variable' };
      }
    });

    // Ensure actual test case input is represented in primitives without fabrication
    if (!primitives['input'] && !hasArray && (dryRun.testCaseInput !== undefined || dryRun.input?.inputVisual)) {
      primitives['input'] = {
        id: 'input',
        type: 'variable',
        name: 'testCaseInput',
        label: 'Input Data',
        value:
          dryRun.input?.inputVisual ||
          (typeof dryRun.testCaseInput === 'object'
            ? JSON.stringify(dryRun.testCaseInput)
            : String(dryRun.testCaseInput || '')),
      };
    }
  }

  return {
    problemId: problemId || 'generic',
    title: dryRun?.input?.title || problemId || 'Generic Execution',
    primitives,
    variableMap,
  };
};

// -------------------------------------------------------------
// PARSING & EXTRACTION UTILITIES
// -------------------------------------------------------------
const parseDryRunValue = (rawVal) => {
  if (rawVal === undefined || rawVal === null) return rawVal;
  if (typeof rawVal === 'number' || typeof rawVal === 'boolean' || Array.isArray(rawVal)) {
    return rawVal;
  }
  if (typeof rawVal === 'string') {
    const trimmed = rawVal.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;
    if (trimmed === 'null') return null;
    if (!isNaN(trimmed) && trimmed !== '') return Number(trimmed);
    if (
      (trimmed.startsWith('[') && trimmed.endsWith(']')) ||
      (trimmed.startsWith('{') && trimmed.endsWith('}'))
    ) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    return trimmed;
  }
  return rawVal;
};

const extractStateMap = (stateObj) => {
  const map = {};
  if (!stateObj) return map;

  if (Array.isArray(stateObj.variables)) {
    stateObj.variables.forEach((v) => {
      const key = v.name || v.key;
      if (key) map[key] = v.value;
    });
    return map;
  }

  Object.keys(stateObj).forEach((k) => {
    if (
      k !== 'stepNo' &&
      k !== 'pseudocodeLine' &&
      k !== 'pseudocodeText' &&
      k !== 'operation' &&
      k !== 'condition' &&
      k !== 'action' &&
      k !== 'explanation' &&
      k !== 'changes' &&
      k !== 'title' &&
      k !== 'variables' &&
      k !== 'before' &&
      k !== 'after'
    ) {
      map[k] = stateObj[k];
    }
  });

  return map;
};

// -------------------------------------------------------------
// EVENT VALIDATION (Phase 11 Schema Compliance)
// -------------------------------------------------------------
/**
 * Validates a single Visualization Event against the Phase 11 schema.
 *
 * @param {Object} event - Event object to validate
 * @param {number|null} [stepIndex=null] - Index of step for diagnostics
 * @param {number|null} [eventIndex=null] - Index of event for diagnostics
 * @returns {{ isValid: boolean, errors: string[] }}
 */
const validateVisualizationEvent = (event, stepIndex = null, eventIndex = null) => {
  const errors = [];
  const prefix = stepIndex !== null ? `Step [${stepIndex}] Event [${eventIndex !== null ? eventIndex : '?'}]` : 'Event';

  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return {
      isValid: false,
      errors: [`${prefix}: Event must be a valid non-null object.`],
    };
  }

  // 1. Mandatory ID
  if (!event.id || typeof event.id !== 'string' || event.id.trim() === '') {
    errors.push(`${prefix}: Event must contain a non-empty string "id".`);
  }

  // 2. Mandatory Step
  if (typeof event.step !== 'number' || event.step < 0 || !Number.isInteger(event.step)) {
    errors.push(`${prefix}: Event must contain a valid non-negative integer "step".`);
  }

  // 3. Mandatory Event Type
  if (!event.type || typeof event.type !== 'string') {
    errors.push(`${prefix}: Event must contain a string "type".`);
  } else {
    const validTypes = Object.values(VISUALIZATION_EVENTS);
    if (!validTypes.includes(event.type)) {
      errors.push(`${prefix}: Unknown event type "${event.type}". Must be a recognized VISUALIZATION_EVENTS token.`);
    }
  }

  // 4. Mandatory Data Payload
  if (!event.data || typeof event.data !== 'object' || Array.isArray(event.data)) {
    errors.push(`${prefix}: Event must contain a non-null "data" object.`);
  } else {
    // Specific Payload Semantics Verification
    if (event.type === VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE || event.type === VISUALIZATION_EVENTS.POINTER_MOVE) {
      if (
        typeof event.data.index !== 'number' ||
        !Number.isInteger(event.data.index) ||
        !Number.isFinite(event.data.index) ||
        event.data.index < 0
      ) {
        errors.push(`${prefix}: Pointer event data must contain a valid non-negative integer "index".`);
      }
    }
    if (
      event.type === VISUALIZATION_EVENTS.RESOURCE_UPDATE ||
      event.type === VISUALIZATION_EVENTS.RESOURCE_CONSUME ||
      event.type === VISUALIZATION_EVENTS.RESOURCE_GAIN
    ) {
      if (typeof event.data.value !== 'number' || !Number.isFinite(event.data.value)) {
        errors.push(`${prefix}: Resource event data must contain a finite numeric "value".`);
      }
      if (event.data.amount !== undefined && (typeof event.data.amount !== 'number' || !Number.isFinite(event.data.amount) || event.data.amount < 0)) {
        errors.push(`${prefix}: Resource event data "amount" must be a non-negative finite number.`);
      }
      if (event.data.changeDelta !== undefined && (typeof event.data.changeDelta !== 'number' || !Number.isFinite(event.data.changeDelta))) {
        errors.push(`${prefix}: Resource event data "changeDelta" must be a finite number.`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.VARIABLE_SET || event.type === VISUALIZATION_EVENTS.VARIABLE_UPDATE) {
      if (event.data.value === undefined) {
        errors.push(`${prefix}: Variable event data must contain a "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.HEAP_INSERT || event.type === VISUALIZATION_EVENTS.HEAP_REMOVE) {
      if (event.data.value === undefined) {
        errors.push(`${prefix}: Heap event data must contain a "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.STACK_PUSH) {
      if (event.data.value === undefined) {
        errors.push(`${prefix}: Stack push event data must contain a "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.STACK_POP) {
      if (event.data.poppedValue === undefined && event.data.value === undefined) {
        errors.push(`${prefix}: Stack pop event data must contain a "poppedValue" or "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.QUEUE_ENQUEUE) {
      if (event.data.value === undefined) {
        errors.push(`${prefix}: Queue enqueue event data must contain a "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.QUEUE_DEQUEUE) {
      if (event.data.dequeuedValue === undefined && event.data.value === undefined) {
        errors.push(`${prefix}: Queue dequeue event data must contain a "dequeuedValue" or "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.HASHMAP_SET) {
      if (event.data.key === undefined || event.data.value === undefined) {
        errors.push(`${prefix}: HashMap set event data must contain "key" and "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.HASHMAP_LOOKUP) {
      if (event.data.key === undefined) {
        errors.push(`${prefix}: HashMap lookup event data must contain "key".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.ARRAY_COMPARE) {
      if (
        !Array.isArray(event.data.indices) ||
        event.data.indices.some((idx) => typeof idx !== 'number' || !Number.isInteger(idx) || !Number.isFinite(idx) || idx < 0)
      ) {
        errors.push(`${prefix}: Array compare event data must contain an array of non-negative integer indices.`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.BUCKET_INSERT) {
      if (
        event.data.frequency === undefined ||
        event.data.value === undefined ||
        typeof event.data.frequency !== 'number' ||
        !Number.isInteger(event.data.frequency) ||
        !Number.isFinite(event.data.frequency) ||
        event.data.frequency < 0
      ) {
        errors.push(`${prefix}: Bucket insert event data must contain a non-negative integer "frequency" and a "value".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.BUCKET_TRAVERSE) {
      if (
        event.data.frequency === undefined ||
        typeof event.data.frequency !== 'number' ||
        !Number.isInteger(event.data.frequency) ||
        !Number.isFinite(event.data.frequency) ||
        event.data.frequency < 0
      ) {
        errors.push(`${prefix}: Bucket traverse event data must contain a non-negative integer "frequency".`);
      }
    }
    if (event.type === VISUALIZATION_EVENTS.RESULT_COLLECT) {
      if (event.data.value === undefined) {
        errors.push(`${prefix}: Result collect event data must contain "value".`);
      }
    }

    // Generic check for numeric values to ensure finite numbers
    if (event.data.value !== undefined && typeof event.data.value === 'number' && !Number.isFinite(event.data.value)) {
      errors.push(`${prefix}: Numeric "value" in event data must be a finite number.`);
    }
  }

  // 5. Optional Target Validation
  if (event.target !== undefined) {
    if (typeof event.target !== 'object' || event.target === null || Array.isArray(event.target)) {
      errors.push(`${prefix}: Optional field "target" must be an object containing "primitiveId" when specified.`);
    } else if (event.target.primitiveId !== undefined) {
      if (typeof event.target.primitiveId !== 'string' || event.target.primitiveId.trim() === '') {
        errors.push(`${prefix}: target.primitiveId must be a non-empty string when specified.`);
      }
    }
  }

  // 6. Optional Highlights Validation
  if (event.highlights !== undefined && !Array.isArray(event.highlights)) {
    errors.push(`${prefix}: Optional field "highlights" must be an array when specified.`);
  }

  // 7. Optional Order Validation
  if (event.order !== undefined) {
    if (typeof event.order !== 'number' || !Number.isFinite(event.order) || event.order < 0) {
      errors.push(`${prefix}: Optional field "order" must be a non-negative finite number.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// -------------------------------------------------------------
// TRACE VALIDATION & NORMALIZATION (Phase 12 Contract)
// -------------------------------------------------------------

/**
 * Schema-aware deep equality checker for structured results.
 * Handles key-order differences in objects, arrays, and primitive conversions.
 */
const areResultsEquivalent = (a, b) => {
  if (a === b) return true;

  // Handle numbers including NaN and minor precision differences
  if (typeof a === 'number' && typeof b === 'number') {
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    return Math.abs(a - b) < 1e-9;
  }

  // Handle null or undefined
  if (a === null || a === undefined || b === null || b === undefined) {
    return a === b;
  }

  // Handle string serialization (e.g. JSON string outputRaw '[0, 1]' vs array [0, 1], or '3' vs 3)
  if (typeof a === 'string' && typeof b !== 'string') {
    try {
      const parsedA = JSON.parse(a);
      return areResultsEquivalent(parsedA, b);
    } catch {
      if (typeof b === 'number' && !isNaN(Number(a))) {
        return areResultsEquivalent(Number(a), b);
      }
    }
  }
  if (typeof b === 'string' && typeof a !== 'string') {
    try {
      const parsedB = JSON.parse(b);
      return areResultsEquivalent(a, parsedB);
    } catch {
      if (typeof a === 'number' && !isNaN(Number(b))) {
        return areResultsEquivalent(a, Number(b));
      }
    }
  }

  // If types differ, return false
  if (typeof a !== typeof b) {
    return false;
  }

  // Handle Arrays
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!areResultsEquivalent(a[i], b[i])) return false;
    }
    return true;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  // Handle Objects
  if (typeof a === 'object') {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
      if (!areResultsEquivalent(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
};

/**
 * Deliberate recursive deep-freeze strategy for execution traces.
 * Ensures every nested step, event, data, target, and metadata object is strictly immutable.
 */
const deepFreeze = (obj, seen = new WeakSet()) => {
  if (obj === null || typeof obj !== 'object' || seen.has(obj)) {
    return obj;
  }
  seen.add(obj);
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const val = obj[prop];
    if (val !== null && (typeof val === 'object' || typeof val === 'function') && !Object.isFrozen(val)) {
      deepFreeze(val, seen);
    }
  });
  return obj;
};

const validateExecutionTrace = (trace, options = {}) => {
  const errors = [];
  const diagnostics = [];

  if (!trace || typeof trace !== 'object' || Array.isArray(trace)) {
    return {
      isValid: false,
      errors: ['Execution trace must be a valid non-null object.'],
      diagnostics: [
        { category: 'structural', path: 'trace', message: 'Execution trace must be a valid non-null object.' },
      ],
    };
  }

  // 1. Mandatory Schema Version
  if (trace.schemaVersion !== EXECUTION_TRACE_SCHEMA_VERSION) {
    const msg = `Invalid or unsupported trace schemaVersion: ${trace.schemaVersion}. Expected ${EXECUTION_TRACE_SCHEMA_VERSION}.`;
    errors.push(msg);
    diagnostics.push({ category: 'schema', path: 'schemaVersion', expected: EXECUTION_TRACE_SCHEMA_VERSION, actual: trace.schemaVersion, message: msg });
  }

  // 2. Mandatory Trace ID
  if (!trace.traceId || typeof trace.traceId !== 'string' || trace.traceId.trim() === '') {
    const msg = 'Trace must contain a non-empty string "traceId".';
    errors.push(msg);
    diagnostics.push({ category: 'structural', path: 'traceId', message: msg });
  }

  // 3. Mandatory Problem ID
  if (!trace.problemId || typeof trace.problemId !== 'string' || trace.problemId.trim() === '') {
    const msg = 'Trace must contain a non-empty string "problemId".';
    errors.push(msg);
    diagnostics.push({ category: 'structural', path: 'problemId', message: msg });
  }

  // 4. Mandatory Initial State with Comprehensive Primitive Validation
  if (!trace.initialState || typeof trace.initialState !== 'object' || !trace.initialState.primitives || typeof trace.initialState.primitives !== 'object' || Array.isArray(trace.initialState.primitives)) {
    const msg = 'Trace must contain a valid "initialState" object with "primitives".';
    errors.push(msg);
    diagnostics.push({ category: 'structural', path: 'initialState.primitives', message: msg });
  } else {
    const ALLOWED_PRIMITIVE_TYPES = [
      'array', 'pointer', 'variable', 'resource', 'heap', 'stack', 'queue',
      'hashmap', 'matrix', 'grid', 'tree', 'linked-list', 'bucket', 'graph'
    ];
    const primKeys = Object.keys(trace.initialState.primitives);
    if (primKeys.length === 0) {
      const msg = 'initialState.primitives must contain at least one declared primitive.';
      errors.push(msg);
      diagnostics.push({ category: 'primitives', path: 'initialState.primitives', message: msg });
    }
    primKeys.forEach((key) => {
      const prim = trace.initialState.primitives[key];
      if (!prim || typeof prim !== 'object' || Array.isArray(prim)) {
        const msg = `Primitive "${key}" in initialState.primitives must be a valid non-null object.`;
        errors.push(msg);
        diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}`, message: msg });
        return;
      }
      if (!prim.id || typeof prim.id !== 'string' || prim.id.trim() === '') {
        const msg = `Primitive "${key}" must contain a non-empty string "id".`;
        errors.push(msg);
        diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.id`, message: msg });
      }
      if (!prim.type || typeof prim.type !== 'string' || !ALLOWED_PRIMITIVE_TYPES.includes(prim.type)) {
        const msg = `Primitive "${key}" has invalid or missing "type" ("${prim?.type}"). Allowed: ${ALLOWED_PRIMITIVE_TYPES.join(', ')}.`;
        errors.push(msg);
        diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.type`, message: msg });
      }
      if (prim.type === 'array' && prim.values !== undefined && !Array.isArray(prim.values)) {
        const msg = `Array primitive "${key}" must have an array for "values".`;
        errors.push(msg);
        diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.values`, message: msg });
      }
      if (prim.type === 'pointer' && prim.activeIndex !== undefined && prim.activeIndex !== null) {
        if (typeof prim.activeIndex !== 'number' || !Number.isInteger(prim.activeIndex) || prim.activeIndex < 0) {
          const msg = `Pointer primitive "${key}" activeIndex must be a non-negative integer.`;
          errors.push(msg);
          diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.activeIndex`, message: msg });
        }
      }
      if (prim.type === 'heap') {
        if (prim.values !== undefined && !Array.isArray(prim.values)) {
          const msg = `Heap primitive "${key}" must have an array for "values".`;
          errors.push(msg);
          diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.values`, message: msg });
        }
        if (prim.heapType !== undefined && prim.heapType !== 'min' && prim.heapType !== 'max') {
          const msg = `Heap primitive "${key}" heapType must be "min" or "max".`;
          errors.push(msg);
          diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.heapType`, message: msg });
        }
      }
      if ((prim.type === 'stack' || prim.type === 'queue') && prim.items !== undefined && !Array.isArray(prim.items)) {
        const msg = `${prim.type} primitive "${key}" must have an array for "items".`;
        errors.push(msg);
        diagnostics.push({ category: 'primitives', path: `initialState.primitives.${key}.items`, message: msg });
      }
    });
  }

  // 5. Steps Array & Event Structure
  if (!Array.isArray(trace.steps)) {
    const msg = 'Trace must contain a "steps" array.';
    errors.push(msg);
    diagnostics.push({ category: 'structural', path: 'steps', message: msg });
  } else {
    // Safety Limit: Step Count
    if (trace.steps.length > MAX_TRACE_STEPS) {
      const msg = `Trace step count (${trace.steps.length}) exceeds maximum allowed limit (${MAX_TRACE_STEPS}).`;
      errors.push(msg);
      diagnostics.push({ category: 'limit', path: 'steps', count: trace.steps.length, max: MAX_TRACE_STEPS, message: msg });
    }

    const seenStepNumbers = new Set();
    const seenEventIds = new Set();
    let totalEvents = 0;

    trace.steps.forEach((stepObj, sIdx) => {
      const stepPrefix = `Step [${sIdx}]`;

      if (!stepObj || typeof stepObj !== 'object' || Array.isArray(stepObj)) {
        const msg = `${stepPrefix}: Step entry must be an object.`;
        errors.push(msg);
        diagnostics.push({ category: 'step', path: `steps[${sIdx}]`, message: msg });
        return;
      }

      if (typeof stepObj.stepNumber !== 'number' || stepObj.stepNumber < 0 || !Number.isInteger(stepObj.stepNumber)) {
        const msg = `${stepPrefix}: Step must contain a non-negative integer "stepNumber".`;
        errors.push(msg);
        diagnostics.push({ category: 'step', path: `steps[${sIdx}].stepNumber`, message: msg });
      } else {
        if (seenStepNumbers.has(stepObj.stepNumber)) {
          const msg = `${stepPrefix}: Duplicate stepNumber ${stepObj.stepNumber} detected.`;
          errors.push(msg);
          diagnostics.push({ category: 'step', path: `steps[${sIdx}].stepNumber`, stepNumber: stepObj.stepNumber, message: msg });
        } else {
          seenStepNumbers.add(stepObj.stepNumber);
        }
      }

      if (!stepObj.id || typeof stepObj.id !== 'string' || stepObj.id.trim() === '') {
        const msg = `${stepPrefix}: Step must contain a non-empty string "id".`;
        errors.push(msg);
        diagnostics.push({ category: 'step', path: `steps[${sIdx}].id`, message: msg });
      }

      if (!Array.isArray(stepObj.events)) {
        const msg = `${stepPrefix}: Step must contain an "events" array.`;
        errors.push(msg);
        diagnostics.push({ category: 'step', path: `steps[${sIdx}].events`, message: msg });
      } else {
        // Safety Limit: Step Events Count
        if (stepObj.events.length > MAX_STEP_EVENTS) {
          const msg = `${stepPrefix}: Step event count (${stepObj.events.length}) exceeds maximum limit (${MAX_STEP_EVENTS}).`;
          errors.push(msg);
          diagnostics.push({ category: 'limit', path: `steps[${sIdx}].events`, count: stepObj.events.length, max: MAX_STEP_EVENTS, message: msg });
        }

        totalEvents += stepObj.events.length;

        stepObj.events.forEach((evt, eIdx) => {
          // Check for Duplicate Event IDs across the entire trace
          if (evt?.id) {
            if (seenEventIds.has(evt.id)) {
              const dupMsg = `${stepPrefix} Event [${eIdx}]: Duplicate event ID "${evt.id}" detected.`;
              errors.push(dupMsg);
              diagnostics.push({
                category: 'event',
                path: `steps[${sIdx}].events[${eIdx}].id`,
                eventIndex: eIdx,
                stepNumber: stepObj.stepNumber,
                eventId: evt.id,
                message: dupMsg,
              });
            } else {
              seenEventIds.add(evt.id);
            }
          }

          const evtRes = validateVisualizationEvent(evt, sIdx, eIdx);
          if (!evtRes.isValid) {
            errors.push(...evtRes.errors);
            evtRes.errors.forEach((errStr) => {
              diagnostics.push({
                category: 'event',
                path: `steps[${sIdx}].events[${eIdx}]`,
                eventIndex: eIdx,
                stepNumber: stepObj.stepNumber,
                eventId: evt?.id,
                message: errStr,
              });
            });
          }

          // Optional Strict Reference Validation
          if (options.strictReferences && evt?.target?.primitiveId && trace.initialState?.primitives) {
            const targetPrim = trace.initialState.primitives[evt.target.primitiveId];
            if (!targetPrim) {
              const refMsg = `${stepPrefix} Event [${eIdx}] (${evt.id}): Referenced primitiveId "${evt.target.primitiveId}" is not declared in initialState.primitives.`;
              errors.push(refMsg);
              diagnostics.push({
                category: 'reference',
                path: `steps[${sIdx}].events[${eIdx}].target.primitiveId`,
                primitiveId: evt.target.primitiveId,
                message: refMsg,
              });
            } else if (
              (evt.type === VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE || evt.type === VISUALIZATION_EVENTS.POINTER_MOVE) &&
              targetPrim.type === 'array' &&
              Array.isArray(targetPrim.values)
            ) {
              if (typeof evt.data?.index === 'number' && evt.data.index >= targetPrim.values.length) {
                const oobMsg = `${stepPrefix} Event [${eIdx}] (${evt.id}): Pointer index ${evt.data.index} is out of bounds for array "${evt.target.primitiveId}" (length: ${targetPrim.values.length}).`;
                errors.push(oobMsg);
                diagnostics.push({
                  category: 'bounds',
                  path: `steps[${sIdx}].events[${eIdx}].data.index`,
                  index: evt.data.index,
                  arrayLength: targetPrim.values.length,
                  message: oobMsg,
                });
              }
            }
          }
        });
      }
    });

    // Contiguous Step Numbering Verification
    if (seenStepNumbers.size > 0) {
      const sortedStepNums = Array.from(seenStepNumbers).sort((a, b) => a - b);
      for (let i = 1; i < sortedStepNums.length; i++) {
        if (sortedStepNums[i] !== sortedStepNums[i - 1] + 1) {
          const gapMsg = `Non-contiguous step sequence detected: gap between step ${sortedStepNums[i - 1]} and step ${sortedStepNums[i]}.`;
          errors.push(gapMsg);
          diagnostics.push({ category: 'step', path: 'steps', message: gapMsg });
          break;
        }
      }
    }

    if (totalEvents > MAX_TOTAL_EVENTS) {
      const msg = `Trace total event count (${totalEvents}) exceeds maximum safety limit (${MAX_TOTAL_EVENTS}).`;
      errors.push(msg);
      diagnostics.push({ category: 'limit', path: 'events', count: totalEvents, max: MAX_TOTAL_EVENTS, message: msg });
    }
  }

  // 6. Cross-check Result Consistency using Schema-Aware Equality
  if (trace.result !== undefined && trace.finalState?.result !== undefined) {
    if (!areResultsEquivalent(trace.result, trace.finalState.result)) {
      const msg = 'Contradictory result detected between trace.result and trace.finalState.result.';
      errors.push(msg);
      diagnostics.push({ category: 'consistency', path: 'result', traceResult: trace.result, finalStateResult: trace.finalState.result, message: msg });
    }
  }

  return { isValid: errors.length === 0, errors, diagnostics };
};

const normalizeExecutionTrace = (rawTrace, options = {}) => {
  const validation = validateExecutionTrace(rawTrace, options);
  if (!validation.isValid) {
    throw new AppError(`Trace validation failed:\n- ${validation.errors.join('\n- ')}`, 422, validation.diagnostics || validation.errors);
  }

  const normalizedSteps = [...rawTrace.steps]
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((stepObj) => ({
      ...stepObj,
      events: [...(stepObj.events || [])].sort((a, b) => (a.order || 0) - (b.order || 0)),
    }));

  const traceObj = {
    schemaVersion: rawTrace.schemaVersion || EXECUTION_TRACE_SCHEMA_VERSION,
    traceId: rawTrace.traceId,
    problemId: rawTrace.problemId,
    title: rawTrace.title || 'Execution Trace',
    source: rawTrace.source || TRACE_SOURCES.DRY_RUN,
    metadata: {
      language: 'pseudocode',
      algorithm: rawTrace.metadata?.algorithm || 'Dry Run Algorithm',
      approachId: rawTrace.metadata?.approachId || 'default',
      sourceStage: 'Stage 08 Dry Run',
      ...(rawTrace.metadata || {}),
    },
    initialState: JSON.parse(JSON.stringify(rawTrace.initialState)),
    steps: normalizedSteps,
    finalState: rawTrace.finalState ? JSON.parse(JSON.stringify(rawTrace.finalState)) : null,
    result: rawTrace.result !== undefined ? rawTrace.result : null,
    totalSteps: normalizedSteps.length,
    minStep: normalizedSteps.length > 0 ? normalizedSteps[0].stepNumber : 0,
    maxStep: normalizedSteps.length > 0 ? normalizedSteps[normalizedSteps.length - 1].stepNumber : 0,
  };

  return deepFreeze(traceObj);
};

/**
 * Authoritative Intermediate Consistency & Algorithmic Invariant Validator.
 * Verifies that every intermediate step, state change, and event adheres
 * to physical and algorithmic invariants (Intermediate Correctness Verification).
 *
 * @param {Object} trace - The execution trace to verify
 * @param {Object} options - Optional context: { algorithmFamily, expectedOutput }
 * @returns {{ isValid: boolean, errors: string[], invariantsChecked: string[] }}
 */
const validateTraceInvariants = (trace, options = {}) => {
  const errors = [];
  const invariantsChecked = [];

  if (!trace || !Array.isArray(trace.steps) || trace.steps.length === 0) {
    return {
      isValid: false,
      errors: ['Trace contains no execution steps to verify invariants.'],
      invariantsChecked: ['STEP_EXISTENCE'],
    };
  }

  // 1. Monotonic Step Progression & Contiguity
  invariantsChecked.push('MONOTONIC_STEP_PROGRESSION');
  const startStep = typeof trace.steps[0]?.stepNumber === 'number' ? trace.steps[0].stepNumber : 0;
  for (let i = 0; i < trace.steps.length; i++) {
    const step = trace.steps[i];
    const expectedStep = startStep + i;
    if (step.stepNumber !== expectedStep) {
      errors.push(`Step index [${i}] has non-contiguous stepNumber ${step.stepNumber}. Expected ${expectedStep}.`);
      break;
    }
    if (Array.isArray(step.events)) {
      for (let eIdx = 0; eIdx < step.events.length; eIdx++) {
        const evt = step.events[eIdx];
        if (evt && evt.step !== undefined && evt.step !== step.stepNumber) {
          errors.push(`Step [${i}] Event [${eIdx}] (${evt.id}): Event step number (${evt.step}) does not match parent stepNumber (${step.stepNumber}).`);
        }
      }
    }
  }

  // 2. Primitive Reference Integrity
  invariantsChecked.push('PRIMITIVE_REFERENCE_INTEGRITY');
  const declaredPrimitives = new Set();
  if (trace.initialState?.primitives) {
    Object.keys(trace.initialState.primitives).forEach((k) => declaredPrimitives.add(k));
  }
  if (Array.isArray(trace.initialState?.variables)) {
    trace.initialState.variables.forEach((v) => {
      const name = v.name || v.key;
      if (name) declaredPrimitives.add(name);
    });
  }
  if (trace.initialState?.flatState && typeof trace.initialState.flatState === 'object') {
    Object.keys(trace.initialState.flatState).forEach((k) => declaredPrimitives.add(k));
  }
  if (trace.initialState && typeof trace.initialState === 'object') {
    Object.keys(trace.initialState).forEach((k) => declaredPrimitives.add(k));
  }

  for (let i = 0; i < trace.steps.length; i++) {
    const step = trace.steps[i];
    if (Array.isArray(step.changed)) {
      for (const primId of step.changed) {
        const inDeclared = declaredPrimitives.has(primId);
        const inState = step.state && Object.prototype.hasOwnProperty.call(step.state, primId);
        const inHighlights = step.highlights && Object.prototype.hasOwnProperty.call(step.highlights, primId);
        if (!inDeclared && !inState && !inHighlights) {
          errors.push(`Step [${i}]: Changed primitive "${primId}" was neither declared in initialState nor found in step state or highlights.`);
        }
      }
    }
  }

  // 3. Stack & Queue Depth Conservation
  invariantsChecked.push('STACK_QUEUE_DEPTH_CONSERVATION');
  let simulatedStackDepth = 0;
  let simulatedQueueDepth = 0;

  for (let i = 0; i < trace.steps.length; i++) {
    const step = trace.steps[i];
    if (Array.isArray(step.events)) {
      for (const evt of step.events) {
        if (evt.type === VISUALIZATION_EVENTS.STACK_PUSH) {
          simulatedStackDepth++;
        } else if (evt.type === VISUALIZATION_EVENTS.STACK_POP) {
          if (simulatedStackDepth <= 0) {
            errors.push(`Step [${i}] Event (${evt.id}): Illegal STACK_POP on an empty stack.`);
          } else {
            simulatedStackDepth--;
          }
        } else if (evt.type === VISUALIZATION_EVENTS.QUEUE_ENQUEUE) {
          simulatedQueueDepth++;
        } else if (evt.type === VISUALIZATION_EVENTS.QUEUE_DEQUEUE) {
          if (simulatedQueueDepth <= 0) {
            errors.push(`Step [${i}] Event (${evt.id}): Illegal QUEUE_DEQUEUE on an empty queue.`);
          } else {
            simulatedQueueDepth--;
          }
        }
      }
    }
  }

  // 4. Two-Pointers Converging Bounds
  const family = options.algorithmFamily || trace.metadata?.algorithmFamily;
  if (family === 'two-pointers') {
    invariantsChecked.push('TWO_POINTERS_CONVERGENCE');
    let lastLeft = -1;
    let lastRight = Infinity;

    for (let i = 0; i < trace.steps.length; i++) {
      const step = trace.steps[i];
      const curLeft = step.state?.left ?? step.highlights?.left;
      const curRight = step.state?.right ?? step.highlights?.right;

      if (typeof curLeft === 'number' && typeof curRight === 'number') {
        if (curLeft > curRight) {
          errors.push(`Step [${i}]: Converging pointer invariant violated: left (${curLeft}) > right (${curRight}).`);
        }
        if (curLeft < lastLeft) {
          errors.push(`Step [${i}]: Converging pointer left (${curLeft}) moved backwards from ${lastLeft}.`);
        }
        if (curRight > lastRight) {
          errors.push(`Step [${i}]: Converging pointer right (${curRight}) moved backwards from ${lastRight}.`);
        }
        lastLeft = curLeft;
        lastRight = curRight;
      }
    }
  }

  // 5. Heap Structural Properties
  if (family === 'heap' || trace.initialState?.primitives?.minHeap || trace.initialState?.primitives?.maxHeap) {
    invariantsChecked.push('HEAP_ORDER_PROPERTY');
    const isMinHeap = !trace.initialState?.primitives?.maxHeap;

    for (let i = 0; i < trace.steps.length; i++) {
      const step = trace.steps[i];
      const heapArr = step.state?.heap || step.state?.minHeap || step.state?.values;
      if (Array.isArray(heapArr)) {
        for (let idx = 1; idx < heapArr.length; idx++) {
          const parentIdx = Math.floor((idx - 1) / 2);
          const childVal = heapArr[idx];
          const parentVal = heapArr[parentIdx];
          if (typeof childVal === 'number' && typeof parentVal === 'number') {
            if (isMinHeap && childVal < parentVal) {
              errors.push(`Step [${i}]: Min-heap property violated at index ${idx}: child ${childVal} < parent ${parentVal}.`);
              break;
            } else if (!isMinHeap && childVal > parentVal) {
              errors.push(`Step [${i}]: Max-heap property violated at index ${idx}: child ${childVal} > parent ${parentVal}.`);
              break;
            }
          }
        }
      }
    }
  }

  // 6. Dynamic Programming Table Invariants (Finiteness & Causality)
  if (family === 'dynamic-programming' || family === 'dp' || trace.initialState?.primitives?.dpTable) {
    invariantsChecked.push('DP_CAUSALITY_AND_FINITENESS');
    for (let i = 0; i < trace.steps.length; i++) {
      const step = trace.steps[i];
      const dpArr = step.state?.dp || step.state?.dpTable || step.state?.table;
      if (Array.isArray(dpArr)) {
        for (let idx = 0; idx < dpArr.length; idx++) {
          const val = dpArr[idx];
          if (typeof val === 'number' && Number.isNaN(val)) {
            errors.push(`Step [${i}]: DP state at index ${idx} is NaN.`);
            break;
          }
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    invariantsChecked,
  };
};

/**
 * Classifies an execution/plan result into AlgoVision's canonical Multi-Dimensional Support States.
 *
 * Support States:
 * - LAYOUT_READY: Display the initial input and suitable data-structure layout (playback locked)
 * - TRACE_GENERATED: A trace exists, but correctness has not been established
 * - TRACE_VALIDATED: Trace structure and internal consistency passed validation
 * - RESULT_VERIFIED: Result matches an authoritative expected output or trusted oracle
 * - UNSUPPORTED: No safe execution path is available
 * - VERIFICATION_FAILED: An independent check failed
 *
 * @param {Object} executionResult - Result from strategy router or sandbox execution
 * @param {Object} context - { testCase, problem, plan, algorithmFamily }
 * @returns {Object} Full multi-dimensional classification payload
 */
const determineSupportStateAndDimensions = (executionResult, context = {}) => {
  const { testCase, plan, algorithmFamily } = context;

  const expectedOutput = testCase?.outputStructured !== undefined
    ? testCase.outputStructured
    : testCase?.outputRaw !== undefined
      ? testCase.outputRaw
      : testCase?.expectedOutput;

  const hasExpectedOutput = expectedOutput !== undefined && expectedOutput !== null && expectedOutput !== '';

  // 1. Case: Execution Unsupported or Missing
  if (!executionResult || !executionResult.isSupported || !executionResult.trace) {
    if (plan || executionResult?.plan) {
      return {
        supportState: SUPPORT_STATES.LAYOUT_READY,
        isPlaybackUnlocked: false,
        isSupported: false,
        verificationStatus: SUPPORT_STATES.LAYOUT_READY,
        resultVerified: false,
        dimensions: {
          executionAvailability: EXECUTION_AVAILABILITY.LAYOUT_ONLY,
          traceValidity: TRACE_VALIDITY.NONE,
          resultVerification: RESULT_VERIFICATION.UNCHECKED,
          invariantVerification: 'SKIPPED',
        },
        message: 'Visual layout plan is ready. Algorithm execution is unsupported; AlgoVision never fabricates execution events.',
        plan: plan || executionResult?.plan || null,
        trace: null,
      };
    }

    return {
      supportState: SUPPORT_STATES.UNSUPPORTED,
      isPlaybackUnlocked: false,
      isSupported: false,
      verificationStatus: SUPPORT_STATES.UNSUPPORTED,
      resultVerified: false,
      dimensions: {
        executionAvailability: EXECUTION_AVAILABILITY.UNSUPPORTED,
        traceValidity: TRACE_VALIDITY.NONE,
        resultVerification: RESULT_VERIFICATION.UNCHECKED,
        invariantVerification: 'SKIPPED',
      },
      message: executionResult?.message || 'No safe execution path is available for this problem.',
      plan: null,
      trace: null,
    };
  }

  const trace = executionResult.trace;

  // 1.5 Case: Raw Trace Generated but Correctness Not Established (TRACE_GENERATED)
  if (
    executionResult.status === SUPPORT_STATES.TRACE_GENERATED ||
    executionResult.supportState === SUPPORT_STATES.TRACE_GENERATED ||
    context.unverified === true
  ) {
    return {
      supportState: SUPPORT_STATES.TRACE_GENERATED,
      isPlaybackUnlocked: false,
      isSupported: true,
      verificationStatus: SUPPORT_STATES.TRACE_GENERATED,
      resultVerified: false,
      dimensions: {
        executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SANDBOX_EXECUTED,
        traceValidity: TRACE_VALIDITY.NONE,
        resultVerification: RESULT_VERIFICATION.UNCHECKED,
        invariantVerification: 'SKIPPED',
      },
      message: 'A trace exists, but correctness has not been established.',
      trace,
      plan: plan || null,
      verificationDetails: {
        schemaValid: null,
        invariantsPassed: null,
        resultMatches: null,
      },
    };
  }

  // 2. Validate Trace Structure & Event Schema
  const traceValidation = validateExecutionTrace(trace);
  if (!traceValidation.isValid) {
    return {
      supportState: SUPPORT_STATES.VERIFICATION_FAILED,
      isPlaybackUnlocked: false,
      isSupported: false,
      verificationStatus: SUPPORT_STATES.VERIFICATION_FAILED,
      resultVerified: false,
      dimensions: {
        executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SPECIFIC_STRATEGY,
        traceValidity: TRACE_VALIDITY.INVALID,
        resultVerification: RESULT_VERIFICATION.VERIFICATION_FAILED,
        invariantVerification: 'FAILED',
      },
      message: `Trace schema validation failed: ${traceValidation.errors?.join('; ')}`,
      trace: null,
      plan: plan || null,
      verificationDetails: {
        schemaValid: false,
        invariantsPassed: false,
        resultMatches: false,
      },
    };
  }

  // 3. Validate Intermediate State & Algorithmic Invariants
  const invariantValidation = validateTraceInvariants(trace, {
    algorithmFamily: algorithmFamily || executionResult.algorithmFamily || trace.metadata?.algorithmFamily,
    expectedOutput,
  });

  if (!invariantValidation.isValid) {
    return {
      supportState: SUPPORT_STATES.VERIFICATION_FAILED,
      isPlaybackUnlocked: false,
      isSupported: false,
      verificationStatus: SUPPORT_STATES.VERIFICATION_FAILED,
      resultVerified: false,
      dimensions: {
        executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SPECIFIC_STRATEGY,
        traceValidity: TRACE_VALIDITY.INVALID,
        resultVerification: RESULT_VERIFICATION.VERIFICATION_FAILED,
        invariantVerification: 'FAILED',
      },
      message: `Trace intermediate invariant check failed: ${invariantValidation.errors?.join('; ')}`,
      trace,
      plan: plan || null,
      verificationDetails: {
        schemaValid: true,
        invariantsPassed: false,
        failedInvariants: invariantValidation.errors,
        resultMatches: false,
      },
    };
  }

  // 4. Validate Against Authoritative Oracle Expected Output
  if (hasExpectedOutput) {
    const isEquivalent = areResultsEquivalent(trace.result, expectedOutput);
    if (!isEquivalent) {
      return {
        supportState: SUPPORT_STATES.VERIFICATION_FAILED,
        isPlaybackUnlocked: false,
        isSupported: true,
        verificationStatus: 'UNVERIFIED_RESULT_MISMATCH',
        resultVerified: false,
        dimensions: {
          executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SPECIFIC_STRATEGY,
          traceValidity: TRACE_VALIDITY.VALID,
          resultVerification: RESULT_VERIFICATION.VERIFICATION_FAILED,
          invariantVerification: 'PASSED',
        },
        message: 'Independent verification failed: trace final result does not match authoritative expected output.',
        trace,
        plan: plan || null,
        verificationDetails: {
          schemaValid: true,
          invariantsPassed: true,
          resultMatches: false,
          expectedOutput,
          actualResult: trace.result,
        },
      };
    }

    return {
      supportState: SUPPORT_STATES.RESULT_VERIFIED,
      isPlaybackUnlocked: true,
      isSupported: true,
      verificationStatus: 'VERIFIED',
      resultVerified: true,
      dimensions: {
        executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SPECIFIC_STRATEGY,
        traceValidity: TRACE_VALIDITY.VALID,
        resultVerification: RESULT_VERIFICATION.RESULT_VERIFIED,
        invariantVerification: 'PASSED',
      },
      message: 'Trace verified: structure, intermediate invariants, and result match authoritative oracle.',
      trace,
      plan: plan || null,
      verificationDetails: {
        schemaValid: true,
        invariantsPassed: true,
        resultMatches: true,
        expectedOutput,
        actualResult: trace.result,
      },
    };
  }

  // Trace Validated (Without Oracle)
  return {
    supportState: SUPPORT_STATES.TRACE_VALIDATED,
    isPlaybackUnlocked: true,
    isSupported: true,
    verificationStatus: 'TRUSTED_UNCHECKED',
    resultVerified: false,
    dimensions: {
      executionAvailability: executionResult.resolutionTier || EXECUTION_AVAILABILITY.SPECIFIC_STRATEGY,
      traceValidity: TRACE_VALIDITY.VALID,
      resultVerification: RESULT_VERIFICATION.TRUSTED_UNCHECKED,
      invariantVerification: 'PASSED',
    },
    message: 'Trace validated: structure and internal consistency passed. No oracle output was provided to verify.',
    trace,
    plan: plan || null,
    verificationDetails: {
      schemaValid: true,
      invariantsPassed: true,
      resultMatches: null,
    },
  };
};

// -------------------------------------------------------------
// PURE ADAPTER: DryRun -> ExecutionTrace
// -------------------------------------------------------------
const adaptDryRunToExecutionTrace = (dryRun, problem, approachId, approachName) => {
  if (!dryRun || typeof dryRun !== 'object' || !Array.isArray(dryRun.steps) || dryRun.steps.length === 0) {
    throw new AppError('Dry Run contains no execution steps.', 422, [
      { code: 'INVALID_SOURCE_DATA', message: 'Dry Run contains no execution steps.' },
    ]);
  }

  const problemId = problem?.problemId || dryRun.problemId || 'generic-problem';
  const mapping = getDryRunMappingForProblem(problemId, dryRun);
  const traceId = `dry-run-${problemId}-${approachId || 'default'}`;

  // 1. Initial Primitives
  const initialPrimitives = {};
  if (mapping.primitives) {
    Object.keys(mapping.primitives).forEach((primKey) => {
      const primConfig = mapping.primitives[primKey];
      initialPrimitives[primKey] = {
        id: primConfig.id || primKey,
        type: primConfig.type,
        label: primConfig.label || primKey,
        ...(primConfig.values ? { values: [...primConfig.values] } : {}),
        ...(primConfig.defaultValues ? { values: [...primConfig.defaultValues] } : {}),
        ...(primConfig.showBarHeights !== undefined ? { showBarHeights: primConfig.showBarHeights } : {}),
        ...(primConfig.maxBarValue !== undefined ? { maxBarValue: primConfig.maxBarValue } : {}),
        ...(primConfig.type === 'pointer'
          ? { activeIndex: 0, pointerLabels: { 0: { label: primConfig.label, color: primConfig.color || 'blue' } } }
          : {}),
        ...(primConfig.type === 'heap'
          ? { values: [], heapType: primConfig.heapType || 'min', showArrayBuffer: true }
          : {}),
        ...(primConfig.type === 'resource'
          ? { value: primConfig.max || 5, max: primConfig.max || 5, icon: primConfig.icon || '🧱' }
          : {}),
        ...(primConfig.type === 'variable'
          ? { name: primConfig.name || primKey, value: 0, typeLabel: primConfig.typeLabel || 'number' }
          : {}),
        ...(primConfig.type === 'stack' ? { items: [] } : {}),
        ...(primConfig.type === 'queue' ? { items: [] } : {}),
        ...(primConfig.type === 'matrix' ? { data: primConfig.data || [] } : {}),
        ...(primConfig.type === 'grid' ? { grid: primConfig.grid || [] } : {}),
        ...(primConfig.type === 'tree' ? { root: null } : {}),
        ...(primConfig.type === 'linked-list' ? { nodes: [] } : {}),
      };
    });
  }

  // Populate from dryRun.initialState if present
  if (dryRun.initialState && Array.isArray(dryRun.initialState.variables)) {
    dryRun.initialState.variables.forEach((v) => {
      const varName = v.name;
      const varMapping = mapping.variableMap ? mapping.variableMap[varName] : null;
      if (varMapping && initialPrimitives[varMapping.targetId]) {
        const targetPrim = initialPrimitives[varMapping.targetId];
        const val = parseDryRunValue(v.value);

        if (varMapping.type === 'pointer') {
          targetPrim.activeIndex = typeof val === 'number' ? val : 0;
        } else if (varMapping.type === 'resource') {
          targetPrim.value = typeof val === 'number' ? val : targetPrim.value;
        } else if (varMapping.type === 'variable') {
          targetPrim.value = val;
        } else if (varMapping.type === 'heap') {
          targetPrim.values = Array.isArray(val) ? val : [];
        } else if (varMapping.type === 'stack' || varMapping.type === 'queue') {
          targetPrim.items = Array.isArray(val) ? val : [];
        }
      }
    });
  }

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: problem?.title || dryRun.input?.title || problemId,
    primitives: initialPrimitives,
  };

  // 2. Steps and Events
  const steps = [];
  let eventCounter = 1;
  let previousStateMap = extractStateMap(dryRun.steps[0]?.before || dryRun.initialState);

  dryRun.steps.forEach((dryStep, index) => {
    const stepNumber = dryStep.stepNo !== undefined ? dryStep.stepNo : index;
    const stepEvents = [];

    const pseudocodeLine =
      dryStep.pseudocodeLine !== undefined
        ? dryStep.pseudocodeLine
        : Array.isArray(dryStep.pseudocodeLines)
          ? dryStep.pseudocodeLines[0]
          : null;

    const condition =
      dryStep.condition?.text || (typeof dryStep.condition === 'string' ? dryStep.condition : null);
    const action =
      dryStep.action?.description || (typeof dryStep.action === 'string' ? dryStep.action : null);

    const currentStateMap = extractStateMap(dryStep.after || dryStep);

    if (mapping.variableMap) {
      Object.keys(mapping.variableMap).forEach((varName) => {
        const varConfig = mapping.variableMap[varName];
        const prevVal = parseDryRunValue(previousStateMap[varName]);
        const currVal = parseDryRunValue(currentStateMap[varName]);

        const isExplicitChange = Array.isArray(dryStep.changes) && dryStep.changes.includes(varName);
        const hasChanged =
          JSON.stringify(prevVal) !== JSON.stringify(currVal) || stepNumber === 0 || isExplicitChange;

        if (hasChanged && currVal !== undefined) {
          if (varConfig.type === 'pointer') {
            const indexVal = typeof currVal === 'number' ? currVal : parseInt(currVal, 10);
            if (!isNaN(indexVal)) {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
                target: { primitiveId: varConfig.targetId },
                data: {
                  index: indexVal,
                  pointerId: varConfig.pointerId || 'i',
                  color: varConfig.color || 'blue',
                },
                description: dryStep.explanation || `Move pointer to index ${indexVal}`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            }
          } else if (varConfig.type === 'variable') {
            stepEvents.push({
              id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
              step: stepNumber,
              type: VISUALIZATION_EVENTS.VARIABLE_SET,
              target: { primitiveId: varConfig.targetId },
              data: {
                value: currVal,
                previousValue: prevVal !== undefined ? prevVal : 0,
              },
              description: dryStep.explanation || `Update variable ${varName} to ${currVal}`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
          } else if (varConfig.type === 'resource') {
            const numCurr = Number(currVal);
            const numPrev = Number(prevVal);
            if (!isNaN(numCurr)) {
              const delta = !isNaN(numPrev) ? numCurr - numPrev : 0;
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: delta < 0 ? VISUALIZATION_EVENTS.RESOURCE_CONSUME : VISUALIZATION_EVENTS.RESOURCE_UPDATE,
                target: { primitiveId: varConfig.targetId },
                data: {
                  value: numCurr,
                  previousValue: !isNaN(numPrev) ? numPrev : numCurr,
                  amount: Math.abs(delta),
                  changeDelta: delta,
                },
                description: dryStep.explanation || `Update resource ${varName} to ${numCurr}`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            }
          } else if (varConfig.type === 'heap') {
            const arrCurr = Array.isArray(currVal) ? currVal : [];
            const arrPrev = Array.isArray(prevVal) ? prevVal : [];
            const isHeapChanged =
              dryStep.changes?.includes(varName) ||
              dryStep.operation === 'USE_BRICKS' ||
              dryStep.operation === 'LADDER_CLIMB';

            if (arrCurr.length > arrPrev.length) {
              const insertedVal = arrCurr[arrCurr.length - 1];
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.HEAP_INSERT,
                target: { primitiveId: varConfig.targetId },
                data: { value: insertedVal, resultingState: [...arrCurr] },
                description: dryStep.explanation || `Insert ${insertedVal} into heap`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else if (arrCurr.length < arrPrev.length) {
              const removedVal = arrPrev.find((x) => !arrCurr.includes(x)) || arrPrev[0];
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.HEAP_REMOVE,
                target: { primitiveId: varConfig.targetId },
                data: { value: removedVal, resultingState: [...arrCurr] },
                description: dryStep.explanation || `Remove ${removedVal} from heap`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.HEAP_STATE,
                target: { primitiveId: varConfig.targetId },
                data: { resultingState: [...arrCurr] },
                description: dryStep.explanation || `Update heap state`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            }
          } else if (varConfig.type === 'stack') {
            const arrCurr = Array.isArray(currVal) ? currVal : [];
            const arrPrev = Array.isArray(prevVal) ? prevVal : [];

            if (arrCurr.length > arrPrev.length) {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.STACK_PUSH,
                target: { primitiveId: varConfig.targetId },
                data: { value: arrCurr[arrCurr.length - 1], items: [...arrCurr] },
                description: dryStep.explanation || `Push to stack`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else if (arrCurr.length < arrPrev.length) {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.STACK_POP,
                target: { primitiveId: varConfig.targetId },
                data: { poppedValue: arrPrev[arrPrev.length - 1], items: [...arrCurr] },
                description: dryStep.explanation || `Pop from stack`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.STACK_STATE,
                target: { primitiveId: varConfig.targetId },
                data: { items: [...arrCurr] },
                description: dryStep.explanation || `Update stack state`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            }
          } else if (varConfig.type === 'queue') {
            const arrCurr = Array.isArray(currVal) ? currVal : [];
            const arrPrev = Array.isArray(prevVal) ? prevVal : [];

            if (arrCurr.length > arrPrev.length) {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.QUEUE_ENQUEUE,
                target: { primitiveId: varConfig.targetId },
                data: { value: arrCurr[arrCurr.length - 1], items: [...arrCurr] },
                description: dryStep.explanation || `Enqueue into queue`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else if (arrCurr.length < arrPrev.length) {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.QUEUE_DEQUEUE,
                target: { primitiveId: varConfig.targetId },
                data: { dequeuedValue: arrPrev[0] !== undefined ? arrPrev[0] : null, items: [...arrCurr] },
                description: dryStep.explanation || `Dequeue from queue`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            } else {
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.QUEUE_STATE,
                target: { primitiveId: varConfig.targetId },
                data: { items: [...arrCurr] },
                description: dryStep.explanation || `Update queue state`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
            }
          } else if (varConfig.type === 'matrix' || varConfig.type === 'grid') {
            stepEvents.push({
              id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
              step: stepNumber,
              type: varConfig.type === 'grid' ? VISUALIZATION_EVENTS.GRID_UPDATE : VISUALIZATION_EVENTS.MATRIX_UPDATE,
              target: { primitiveId: varConfig.targetId },
              data: { value: currVal },
              description: dryStep.explanation || `Update ${varConfig.type}`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
          } else if (varConfig.type === 'linked-list') {
            stepEvents.push({
              id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
              step: stepNumber,
              type: VISUALIZATION_EVENTS.LINKED_LIST_CURRENT,
              target: { primitiveId: varConfig.targetId },
              data: { value: currVal },
              description: dryStep.explanation || `Update linked list`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
          } else if (varConfig.type === 'tree') {
            stepEvents.push({
              id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
              step: stepNumber,
              type: VISUALIZATION_EVENTS.TREE_VISIT,
              target: { primitiveId: varConfig.targetId },
              data: { value: currVal },
              description: dryStep.explanation || `Visit tree node`,
              schemaVersion: EVENT_SCHEMA_VERSION,
            });
          }
        }
      });
    }

    // Terminal step return event
    if (index === dryRun.steps.length - 1 || dryStep.operation === 'STOP_RESULT') {
      const resultValue =
        dryRun.result !== undefined
          ? dryRun.result
          : dryStep.currentResult !== undefined && dryStep.currentResult !== ''
            ? dryStep.currentResult
            : dryRun.input?.expectedOutput;

      stepEvents.push({
        id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: Object.keys(initialPrimitives)[0] || 'res' },
        data: { value: resultValue },
        description: `Execution complete. Result = ${resultValue}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    const stepDescription = dryStep.explanation || action || dryStep.title || '';
    const stepChanged = Array.isArray(dryStep.changes) ? dryStep.changes : [];

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      label: dryStep.title || dryStep.label || `Step ${stepNumber}`,
      operation: dryStep.operation || 'STEP',
      explanation: stepDescription,
      description: stepDescription,
      changed: stepChanged,
      state: { ...currentStateMap },
      highlights: {
        currentIndex: currentStateMap.i !== undefined && !isNaN(Number(currentStateMap.i)) ? Number(currentStateMap.i) : null,
        arrayIndices: currentStateMap.i !== undefined && !isNaN(Number(currentStateMap.i)) ? [Number(currentStateMap.i)] : [],
      },
      metadata: {
        pseudocodeLine,
        pseudocodeLines: dryStep.pseudocodeLines,
        condition,
        action,
      },
      events: stepEvents,
    });

    previousStateMap = { ...currentStateMap };
  });

  const finalResultValue =
    dryRun.finalResult !== undefined && dryRun.finalResult !== null
      ? dryRun.finalResult
      : dryRun.result !== undefined
        ? dryRun.result
        : dryRun.input?.expectedOutput;

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: problem?.title || dryRun.input?.title || problemId,
    source: TRACE_SOURCES.DRY_RUN,
    metadata: {
      language: 'pseudocode',
      algorithm: approachName || dryRun.approachName || 'Dry Run Algorithm',
      approachId: approachId || dryRun.approachId || 'default',
      sourceStage: 'Stage 08 Dry Run',
    },
    initialState,
    steps,
    finalState: {
      result: finalResultValue,
    },
    result: finalResultValue,
  };

  return normalizeExecutionTrace(rawTrace);
};

// -------------------------------------------------------------
// MASTER TRACE BUILDER & DISPATCHER (Phase 4 Primary Deliverable)
// -------------------------------------------------------------
/**
 * Master Execution Trace Builder:
 * 1. Determines whether sourceData is already an ExecutionTrace (pass-through).
 * 2. Checks schema version compatibility (rejects incompatible versions).
 * 3. Transforms source Dry Run data to ExecutionTrace using the pure adapter.
 * 4. Runs full structural, semantic, and payload validation.
 * 5. Returns a normalized, validated, immutable ExecutionTrace.
 *
 * @param {Object} sourceData - Source execution data (ExecutionTrace or Dry Run)
 * @param {Object} [options={}] - Options { problem, approachId, approachName, strictReferences }
 * @returns {Object} Validated ExecutionTrace
 */
const buildExecutionTrace = (sourceData, options = {}) => {
  if (!sourceData || typeof sourceData !== 'object' || Array.isArray(sourceData)) {
    throw new AppError('Source execution data must be a valid non-null object.', 422, [
      { code: 'INVALID_SOURCE_DATA', message: 'Source execution data must be a valid non-null object.' },
    ]);
  }

  // 1. Pass-through for already-compatible ExecutionTrace
  if (
    sourceData.schemaVersion === EXECUTION_TRACE_SCHEMA_VERSION &&
    Array.isArray(sourceData.steps) &&
    sourceData.initialState &&
    sourceData.traceId
  ) {
    return normalizeExecutionTrace(sourceData, options);
  }

  // 2. Reject incompatible schema versions
  if (sourceData.schemaVersion !== undefined && sourceData.schemaVersion !== EXECUTION_TRACE_SCHEMA_VERSION) {
    throw new AppError(
      `Unsupported trace schemaVersion: ${sourceData.schemaVersion}. Expected ${EXECUTION_TRACE_SCHEMA_VERSION}.`,
      422,
      [{ code: 'UNSUPPORTED_SCHEMA_VERSION', schemaVersion: sourceData.schemaVersion }]
    );
  }

  // 3. Transformation from Dry Run
  const { problem, approachId, approachName } = options;
  return adaptDryRunToExecutionTrace(sourceData, problem, approachId, approachName);
};

// -------------------------------------------------------------
// SERVICE METHODS (DATA-ACCESS & AUTHORIZATION)
// -------------------------------------------------------------

/**
 * Resolves problem by slug or ObjectId and verifies access permissions
 */
const resolveProblemAndCheckAccess = async (problemIdOrSlug, userOrId) => {
  if (!problemIdOrSlug || typeof problemIdOrSlug !== 'string' || problemIdOrSlug.trim() === '') {
    throw new AppError('Problem identifier is required', 400);
  }

  const normalizedSlug = String(problemIdOrSlug).trim().toLowerCase();
  const isMongooseConnected = mongoose.connection && mongoose.connection.readyState === 1;

  let problem = null;
  if (isMongooseConnected) {
    problem = await Problem.findOne({ problemId: normalizedSlug });
    if (!problem && /^[0-9a-fA-F]{24}$/.test(normalizedSlug)) {
      problem = await Problem.findById(normalizedSlug);
    }
  }

  if (!problem) {
    if (
      normalizedSlug === 'top-k-frequent' ||
      normalizedSlug === 'top-k-frequent-elements' ||
      normalizedSlug === '347'
    ) {
      problem = {
        _id: 'builtin-top-k-frequent',
        problemId: 'top-k-frequent',
        title: 'Top K Frequent Elements',
        category: 'Heap / Bucket Sort',
        isPublished: true,
        defaultApproachId: 'bucketSort',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [1,1,1,2,2,3], k = 2',
            outputRaw: '[1, 2]',
            inputStructured: { type: 'array_with_k', value: { array: [1, 1, 1, 2, 2, 3], k: 2 } },
          },
          {
            id: 2,
            inputRaw: 'nums = [1], k = 1',
            outputRaw: '[1]',
            inputStructured: { type: 'array_with_k', value: { array: [1], k: 1 } },
          },
          {
            id: 3,
            inputRaw: 'nums = [4,4,4,6,6,7], k = 1',
            outputRaw: '[4]',
            inputStructured: { type: 'array_with_k', value: { array: [4, 4, 4, 6, 6, 7], k: 1 } },
          },
          {
            id: 4,
            inputRaw: 'nums = [-1,-1,2,2,2,3], k = 2',
            outputRaw: '[2, -1]',
            inputStructured: { type: 'array_with_k', value: { array: [-1, -1, 2, 2, 2, 3], k: 2 } },
          },
          {
            id: 5,
            inputRaw: 'nums = [5,5,5], k = 1',
            outputRaw: '[5]',
            inputStructured: { type: 'array_with_k', value: { array: [5, 5, 5], k: 1 } },
          },
          {
            id: 6,
            inputRaw: 'nums = [1,2], k = 1',
            outputRaw: '[1]',
            inputStructured: { type: 'array_with_k', value: { array: [1, 2], k: 1 } },
          },
        ],
      };
    } else if (
      normalizedSlug === 'longest-substring-without-repeating-characters' ||
      normalizedSlug === 'longest-substring-no-repeat' ||
      normalizedSlug === '3' ||
      normalizedSlug === 'longest-substring'
    ) {
      problem = {
        _id: 'builtin-longest-substring',
        problemId: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        category: 'Sliding Window',
        isPublished: true,
        defaultApproachId: 'slidingWindow',
        testCases: [
          {
            id: 1,
            inputRaw: 's = "abcabcbb"',
            outputRaw: '3',
            inputStructured: { s: 'abcabcbb' },
          },
          {
            id: 2,
            inputRaw: 's = "bbbbb"',
            outputRaw: '1',
            inputStructured: { s: 'bbbbb' },
          },
          {
            id: 3,
            inputRaw: 's = "pwwkew"',
            outputRaw: '3',
            inputStructured: { s: 'pwwkew' },
          },
        ],
      };
    } else if (normalizedSlug === 'two-sum' || normalizedSlug === '1') {
      problem = {
        _id: 'builtin-two-sum',
        problemId: 'two-sum',
        title: 'Two Sum',
        category: 'Array / Hash Table',
        isPublished: true,
        defaultApproachId: 'hashMap',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [2, 7, 11, 15], target = 9',
            outputRaw: '[0, 1]',
            inputStructured: { nums: [2, 7, 11, 15], target: 9 },
          },
          {
            id: 2,
            inputRaw: 'nums = [3, 2, 4], target = 6',
            outputRaw: '[1, 2]',
            inputStructured: { nums: [3, 2, 4], target: 6 },
          },
          {
            id: 3,
            inputRaw: 'nums = [3, 3], target = 6',
            outputRaw: '[0, 1]',
            inputStructured: { nums: [3, 3], target: 6 },
          },
        ],
      };
    } else if (
      normalizedSlug === 'longest-consecutive-sequence' ||
      normalizedSlug === 'longest-consecutive' ||
      normalizedSlug === '128'
    ) {
      problem = {
        _id: 'builtin-longest-consecutive-sequence',
        problemId: 'longest-consecutive-sequence',
        title: 'Longest Consecutive Sequence',
        category: 'Hash Set',
        isPublished: true,
        defaultApproachId: 'hashSet',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [100, 4, 200, 1, 3, 2]',
            outputRaw: '4',
            inputStructured: { nums: [100, 4, 200, 1, 3, 2] },
          },
          {
            id: 2,
            inputRaw: 'nums = [0,3,7,2,5,8,4,6,0,1]',
            outputRaw: '9',
            inputStructured: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] },
          },
        ],
      };
    } else if (
      normalizedSlug === 'reverse-linked-list' ||
      normalizedSlug === 'reverse-list' ||
      normalizedSlug === '206'
    ) {
      problem = {
        _id: 'builtin-reverse-linked-list',
        problemId: 'reverse-linked-list',
        title: 'Reverse Linked List',
        category: 'Linked List',
        isPublished: true,
        defaultApproachId: 'iterativePointers',
        testCases: [
          {
            id: 1,
            inputRaw: 'head = [1,2,3,4,5]',
            outputRaw: '[5,4,3,2,1]',
            inputStructured: { type: 'linked_list', nodes: [1, 2, 3, 4, 5] },
            outputStructured: { type: 'linked_list', nodes: [5, 4, 3, 2, 1] },
          },
          {
            id: 2,
            inputRaw: 'head = [1,2]',
            outputRaw: '[2,1]',
            inputStructured: { type: 'linked_list', nodes: [1, 2] },
            outputStructured: { type: 'linked_list', nodes: [2, 1] },
          },
          {
            id: 3,
            inputRaw: '[]',
            outputRaw: '[]',
            inputStructured: { type: 'linked_list', nodes: [] },
            outputStructured: { type: 'linked_list', nodes: [] },
          },
        ],
      };
    } else if (
      normalizedSlug === 'valid-parentheses' ||
      normalizedSlug === '20'
    ) {
      problem = {
        _id: 'builtin-valid-parentheses',
        problemId: 'valid-parentheses',
        title: 'Valid Parentheses',
        category: 'Stack',
        isPublished: true,
        defaultApproachId: 'stack',
        testCases: [
          {
            id: 1,
            inputRaw: 's = "()"',
            outputRaw: 'true',
            inputStructured: { s: '()' },
          },
          {
            id: 2,
            inputRaw: 's = "()[]{}"',
            outputRaw: 'true',
            inputStructured: { s: '()[]{}' },
          },
          {
            id: 3,
            inputRaw: 's = "(]"',
            outputRaw: 'false',
            inputStructured: { s: '(]' },
          },
          {
            id: 4,
            inputRaw: 's = "([)]"',
            outputRaw: 'false',
            inputStructured: { s: '([)]' },
          },
        ],
      };
    } else if (
      normalizedSlug === 'binary-tree-inorder-traversal' ||
      normalizedSlug === 'binary-tree-inorder' ||
      normalizedSlug === 'inorder-traversal' ||
      normalizedSlug === '94'
    ) {
      problem = {
        _id: 'builtin-binary-tree-inorder',
        problemId: 'binary-tree-inorder',
        title: 'Binary Tree Inorder Traversal',
        category: 'Trees',
        isPublished: true,
        defaultApproachId: 'inorderDfs',
        testCases: [
          {
            id: 1,
            inputRaw: 'root = [1, null, 2, 3]',
            outputRaw: '[1, 3, 2]',
            inputStructured: { root: [1, null, 2, 3] },
            outputStructured: [1, 3, 2],
          },
          {
            id: 2,
            inputRaw: 'root = [1, 2, 3]',
            outputRaw: '[2, 1, 3]',
            inputStructured: { root: [1, 2, 3] },
            outputStructured: [2, 1, 3],
          },
        ],
      };
    } else if (
      normalizedSlug === 'kth-largest-element' ||
      normalizedSlug === 'kth-largest' ||
      normalizedSlug === 'kth-largest-element-in-an-array' ||
      normalizedSlug === '215'
    ) {
      problem = {
        _id: 'builtin-kth-largest-element',
        problemId: 'kth-largest-element',
        title: 'Kth Largest Element in an Array',
        category: 'Heap',
        isPublished: true,
        defaultApproachId: 'minHeap',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
            outputRaw: '5',
            inputStructured: { nums: [3, 2, 1, 5, 6, 4], k: 2 },
            outputStructured: 5,
          },
          {
            id: 2,
            inputRaw: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
            outputRaw: '4',
            inputStructured: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 },
            outputStructured: 4,
          },
        ],
      };
    } else if (
      normalizedSlug === 'sliding-window-maximum' ||
      normalizedSlug === 'sliding-window-max' ||
      normalizedSlug === '239'
    ) {
      problem = {
        _id: 'builtin-sliding-window-maximum',
        problemId: 'sliding-window-maximum',
        title: 'Sliding Window Maximum',
        category: 'Array',
        isPublished: true,
        defaultApproachId: 'monotonicDeque',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
            outputRaw: '[3, 3, 5, 5, 6, 7]',
            inputStructured: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
            outputStructured: [3, 3, 5, 5, 6, 7],
          },
          {
            id: 2,
            inputRaw: 'nums = [9, 11, 8, 5, 7, 10], k = 3',
            outputRaw: '[11, 11, 8, 10]',
            inputStructured: { nums: [9, 11, 8, 5, 7, 10], k: 3 },
            outputStructured: [11, 11, 8, 10],
          },
        ],
      };
    } else if (
      normalizedSlug === 'product-of-array-except-self' ||
      normalizedSlug === 'product-except-self' ||
      normalizedSlug === '238'
    ) {
      problem = {
        _id: 'builtin-product-except-self',
        problemId: 'product-except-self',
        title: 'Product of Array Except Self',
        category: 'Array / Prefix Sum',
        isPublished: true,
        defaultApproachId: 'prefixSuffix',
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [1, 2, 3, 4]',
            outputRaw: '[24, 12, 8, 6]',
            inputStructured: { nums: [1, 2, 3, 4] },
            outputStructured: [24, 12, 8, 6],
            interaction: {
              type: 'prefix_suffix',
              array: [1, 2, 3, 4],
              expectedResult: [24, 12, 8, 6],
            },
          },
          {
            id: 2,
            inputRaw: 'nums = [-1, 1, 0, -3, 3]',
            outputRaw: '[0, 0, 9, 0, 0]',
            inputStructured: { nums: [-1, 1, 0, -3, 3] },
            outputStructured: [0, 0, 9, 0, 0],
            interaction: {
              type: 'prefix_suffix',
              array: [-1, 1, 0, -3, 3],
              expectedResult: [0, 0, 9, 0, 0],
            },
          },
        ],
      };
    } else if (
      normalizedSlug === 'minimum-depth-of-binary-tree' ||
      normalizedSlug === 'min-depth' ||
      normalizedSlug === '111'
    ) {
      problem = {
        _id: 'builtin-minimum-depth-of-binary-tree',
        problemId: 'minimum-depth-of-binary-tree',
        title: 'Minimum Depth of Binary Tree',
        category: 'Tree',
        isPublished: true,
        defaultApproachId: 'minDepthDfs',
        testCases: [
          {
            id: 1,
            inputRaw: 'root = [3,9,20,null,null,15,7]',
            outputRaw: '2',
            inputStructured: { root: [3, 9, 20, null, null, 15, 7] },
          },
          {
            id: 2,
            inputRaw: 'root = [2,null,3,null,4,null,5,null,6]',
            outputRaw: '5',
            inputStructured: { root: [2, null, 3, null, 4, null, 5, null, 6] },
          },
        ],
      };
    } else if (
      normalizedSlug === 'word-search' ||
      normalizedSlug === '79'
    ) {
      problem = {
        _id: 'builtin-word-search',
        problemId: 'word-search',
        title: 'Word Search',
        category: 'Backtracking',
        isPublished: true,
        defaultApproachId: 'backtrackingDfs',
        testCases: [
          {
            id: 1,
            inputRaw: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
            outputRaw: 'true',
            inputStructured: {
              grid: [
                ['A', 'B', 'C', 'E'],
                ['S', 'F', 'C', 'S'],
                ['A', 'D', 'E', 'E'],
              ],
              word: 'ABCCED',
            },
            outputStructured: true,
          },
          {
            id: 2,
            inputRaw: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
            outputRaw: 'true',
            inputStructured: {
              grid: [
                ['A', 'B', 'C', 'E'],
                ['S', 'F', 'C', 'S'],
                ['A', 'D', 'E', 'E'],
              ],
              word: 'SEE',
            },
            outputStructured: true,
          },
        ],
      };
    } else if (
      normalizedSlug === 'maximum-depth-of-binary-tree' ||
      normalizedSlug === 'max-depth' ||
      normalizedSlug === '104'
    ) {
      problem = {
        _id: 'builtin-maximum-depth-of-binary-tree',
        problemId: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        category: 'Tree',
        isPublished: true,
        defaultApproachId: 'maxDepthDfs',
        testCases: [
          {
            id: 1,
            inputRaw: 'root = [3,9,20,null,null,15,7]',
            outputRaw: '3',
            inputStructured: { root: [3, 9, 20, null, null, 15, 7] },
          },
          {
            id: 2,
            inputRaw: 'root = [1,null,2]',
            outputRaw: '2',
            inputStructured: { root: [1, null, 2] },
          },
        ],
      };
    } else {
      throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
    }
  }

  const userId = userOrId?._id ? String(userOrId._id) : (userOrId ? String(userOrId) : null);
  const isAdmin = userOrId?.role === 'admin';
  const isOwner = Boolean(userId && problem.createdBy && String(problem.createdBy) === userId);

  if (!problem.isPublished && !isOwner && !isAdmin) {
    throw new AppError('You do not have permission to access visualization for this private problem', 403);
  }

  const normProblemSlug = (problem.problemId || problemIdOrSlug || '').toString().toLowerCase().trim();
  if (
    normProblemSlug === 'top-k-frequent' ||
    normProblemSlug === 'top-k-frequent-elements' ||
    normProblemSlug === '347'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'nums = [1,1,1,2,2,3], k = 2',
          outputRaw: '[1, 2]',
          inputStructured: { type: 'array_with_k', value: { array: [1, 1, 1, 2, 2, 3], k: 2 } },
        },
        {
          id: 2,
          inputRaw: 'nums = [1], k = 1',
          outputRaw: '[1]',
          inputStructured: { type: 'array_with_k', value: { array: [1], k: 1 } },
        },
        {
          id: 3,
          inputRaw: 'nums = [4,4,4,6,6,7], k = 1',
          outputRaw: '[4]',
          inputStructured: { type: 'array_with_k', value: { array: [4, 4, 4, 6, 6, 7], k: 1 } },
        },
        {
          id: 4,
          inputRaw: 'nums = [-1,-1,2,2,2,3], k = 2',
          outputRaw: '[2, -1]',
          inputStructured: { type: 'array_with_k', value: { array: [-1, -1, 2, 2, 2, 3], k: 2 } },
        },
        {
          id: 5,
          inputRaw: 'nums = [5,5,5], k = 1',
          outputRaw: '[5]',
          inputStructured: { type: 'array_with_k', value: { array: [5, 5, 5], k: 1 } },
        },
        {
          id: 6,
          inputRaw: 'nums = [1,2], k = 1',
          outputRaw: '[1]',
          inputStructured: { type: 'array_with_k', value: { array: [1, 2], k: 1 } },
        },
      ];
    }
  }

  if (
    normProblemSlug === 'reverse-linked-list' ||
    normProblemSlug === 'reverse-list' ||
    normProblemSlug === '206'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'head = [1,2,3,4,5]',
          outputRaw: '[5,4,3,2,1]',
          inputStructured: { type: 'linked_list', nodes: [1, 2, 3, 4, 5] },
          outputStructured: { type: 'linked_list', nodes: [5, 4, 3, 2, 1] },
        },
        {
          id: 2,
          inputRaw: 'head = [1,2]',
          outputRaw: '[2,1]',
          inputStructured: { type: 'linked_list', nodes: [1, 2] },
          outputStructured: { type: 'linked_list', nodes: [2, 1] },
        },
        {
          id: 3,
          inputRaw: '[]',
          outputRaw: '[]',
          inputStructured: { type: 'linked_list', nodes: [] },
          outputStructured: { type: 'linked_list', nodes: [] },
        },
      ];
    }
  }

  if (
    normProblemSlug === 'binary-tree-inorder-traversal' ||
    normProblemSlug === 'binary-tree-inorder' ||
    normProblemSlug === 'inorder-traversal' ||
    normProblemSlug === '94'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'root = [1, null, 2, 3]',
          outputRaw: '[1, 3, 2]',
          inputStructured: { root: [1, null, 2, 3] },
          outputStructured: [1, 3, 2],
        },
        {
          id: 2,
          inputRaw: 'root = [1, 2, 3]',
          outputRaw: '[2, 1, 3]',
          inputStructured: { root: [1, 2, 3] },
          outputStructured: [2, 1, 3],
        },
      ];
    }
  }

  if (
    normProblemSlug === 'kth-largest-element' ||
    normProblemSlug === 'kth-largest' ||
    normProblemSlug === 'kth-largest-element-in-an-array' ||
    normProblemSlug === '215'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
          outputRaw: '5',
          inputStructured: { nums: [3, 2, 1, 5, 6, 4], k: 2 },
          outputStructured: 5,
        },
        {
          id: 2,
          inputRaw: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
          outputRaw: '4',
          inputStructured: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 },
          outputStructured: 4,
        },
      ];
    }
  }

  if (
    normProblemSlug === 'sliding-window-maximum' ||
    normProblemSlug === 'sliding-window-max' ||
    normProblemSlug === '239'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
          outputRaw: '[3, 3, 5, 5, 6, 7]',
          inputStructured: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
          outputStructured: [3, 3, 5, 5, 6, 7],
        },
        {
          id: 2,
          inputRaw: 'nums = [9, 11, 8, 5, 7, 10], k = 3',
          outputRaw: '[11, 11, 8, 10]',
          inputStructured: { nums: [9, 11, 8, 5, 7, 10], k: 3 },
          outputStructured: [11, 11, 8, 10],
        },
      ];
    }
  }

  if (
    normProblemSlug === 'minimum-depth-of-binary-tree' ||
    normProblemSlug === 'min-depth' ||
    normProblemSlug === '111'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'root = [3,9,20,null,null,15,7]',
          outputRaw: '2',
          inputStructured: { root: [3, 9, 20, null, null, 15, 7] },
        },
        {
          id: 2,
          inputRaw: 'root = [2,null,3,null,4,null,5,null,6]',
          outputRaw: '5',
          inputStructured: { root: [2, null, 3, null, 4, null, 5, null, 6] },
        },
      ];
    }
  }

  if (
    normProblemSlug === 'maximum-depth-of-binary-tree' ||
    normProblemSlug === 'max-depth' ||
    normProblemSlug === '104'
  ) {
    if (!Array.isArray(problem.testCases) || problem.testCases.length <= 1) {
      problem.testCases = [
        {
          id: 1,
          inputRaw: 'root = [3,9,20,null,null,15,7]',
          outputRaw: '3',
          inputStructured: { root: [3, 9, 20, null, null, 15, 7] },
        },
        {
          id: 2,
          inputRaw: 'root = [1,null,2]',
          outputRaw: '2',
          inputStructured: { root: [1, null, 2] },
        },
      ];
    }
  }

  return problem;
};

/**
 * Validates and normalizes algorithm approach against problem patterns
 */
const validateApproach = async (problem, approachIdQuery, userId) => {
  const isMongooseConnected = mongoose.connection && mongoose.connection.readyState === 1;
  const patternDoc = isMongooseConnected && problem?._id && mongoose.Types.ObjectId.isValid(problem._id)
    ? await ProblemPattern.findOne({ problemId: problem._id })
    : null;

  let rawApproachId = (approachIdQuery && typeof approachIdQuery === 'string' && approachIdQuery.trim()) || '';
  if (rawApproachId === 'null' || rawApproachId === 'undefined') {
    rawApproachId = '';
  }

  let normalizedApproachId = rawApproachId;
  let resolvedApproachName = '';

  if (isMongooseConnected && userId && problem?._id && mongoose.Types.ObjectId.isValid(problem._id)) {
    if (!normalizedApproachId) {
      const existingPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId }).sort({ updatedAt: -1 });
      if (existingPseudo?.approachId) {
        normalizedApproachId = existingPseudo.approachId;
        resolvedApproachName = existingPseudo.approachName || '';
      }
    } else {
      const exactPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId, approachId: normalizedApproachId });
      if (!exactPseudo) {
        const anyPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId }).sort({ updatedAt: -1 });
        if (anyPseudo?.approachId) {
          normalizedApproachId = anyPseudo.approachId;
          resolvedApproachName = anyPseudo.approachName || '';
        }
      }
    }
  }

  if (!normalizedApproachId && patternDoc?.solutionFamilies?.families?.length > 0) {
    normalizedApproachId = patternDoc.solutionFamilies.families[0].id;
  }

  if (!normalizedApproachId && problem.defaultApproachId) {
    normalizedApproachId = problem.defaultApproachId;
  }

  if (!normalizedApproachId) {
    normalizedApproachId = 'default';
  }

  let approachName = resolvedApproachName || normalizedApproachId;

  if (patternDoc?.solutionFamilies?.families?.length > 0) {
    const matchedFamily = patternDoc.solutionFamilies.families.find(
      (f) => String(f.id).toLowerCase() === normalizedApproachId.toLowerCase()
    );

    if (matchedFamily) {
      approachName = matchedFamily.name || approachName;
    }
  }

  return {
    approachId: normalizedApproachId,
    approachName,
  };
};

/**
 * Resolves test case by numeric ID
 */
const resolveTestCase = (problem, testCaseIdQuery) => {
  const testCases = problem.testCases || [];
  if (!testCases.length) {
    return { testCaseId: 1, selectedTestCase: null };
  }

  // If testCaseIdQuery was explicitly provided, validate it strictly rather than silently falling back
  if (testCaseIdQuery !== undefined && testCaseIdQuery !== null && String(testCaseIdQuery).trim() !== '') {
    const parsedId = Number(testCaseIdQuery);
    if (isNaN(parsedId) || parsedId <= 0 || !Number.isInteger(parsedId)) {
      throw new AppError(`Invalid test-case ID "${testCaseIdQuery}". ID must be a positive integer.`, 400);
    }

    const matched = testCases.find((tc, idx) => (tc.id !== undefined ? tc.id : idx + 1) === parsedId);
    if (!matched) {
      const availableIds = testCases.map((tc, idx) => (tc.id !== undefined ? tc.id : idx + 1));
      throw new AppError(
        `Test case with ID ${parsedId} not found for problem "${problem.title || problem.problemId}". Available IDs: ${availableIds.join(', ')}.`,
        404
      );
    }

    return {
      testCaseId: matched.id !== undefined ? matched.id : parsedId,
      selectedTestCase: matched,
    };
  }

  // Default to first test case when query is omitted
  const firstCase = testCases[0];
  const actualId = firstCase.id !== undefined ? firstCase.id : 1;

  return { testCaseId: actualId, selectedTestCase: firstCase };
};

/**
 * Authoritative AI Generation Method for Stage 09 Visualization
 * Directly generates execution trace steps using Gemini AI, saves to ProblemDryRun,
 * and derives the normalized ExecutionTrace so Stage 09 is completely independent of Stage 08.
 */
const generateVisualizationTrace = async (problemIdOrSlug, userOrId, approachIdQuery, testCaseIdQuery) => {
  // 1. Resolve Problem and enforce access checks
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userOrId);
  const userId = userOrId?._id ? userOrId._id : userOrId;

  // 2. Resolve Approach and TestCase
  const { approachId, approachName } = await validateApproach(problem, approachIdQuery, userId);
  const { testCaseId, selectedTestCase } = resolveTestCase(problem, testCaseIdQuery);

  // 3. Priority Execution Check: Path A (Specific Strategy) -> Path B (Reusable Family Engine)
  const strategyRegistry = require('./executionStrategyRegistry');
  const routerMatch = strategyRegistry.resolveStrategyRouter(problem, {
    approachId,
    approachName,
    algorithmFamily: problem.algorithmFamily || problem.category,
  });

  if (routerMatch) {
    const execResult = strategyRegistry.executeWithTrace(
      problem,
      {
        testCase: selectedTestCase,
        problem,
      },
      {
        approachId,
        approachName,
        testCaseId,
        algorithmFamily: problem.algorithmFamily || problem.category,
      }
    );

    if (execResult.isSupported && execResult.trace) {
      return {
        trace: execResult.trace,
        approachId: execResult.approachId || approachId,
        approachName: execResult.approachName || approachName,
        testCaseId,
        isFromDryRun: false,
        source: 'execution',
        resolutionTier: execResult.resolutionTier || routerMatch.tier,
        isSupported: true,
        verificationStatus: execResult.verificationStatus || 'TRUSTED_UNCHECKED',
        resultVerified: Boolean(execResult.resultVerified),
        supportState: execResult.supportState,
        isPlaybackUnlocked: execResult.isPlaybackUnlocked,
      };
    }
  }

  // 4. Optional Pseudocode lookup for AI Prompt Context
  let pseudocodeDoc = null;
  if (userId) {
    pseudocodeDoc = await ProblemPseudocode.findOne({
      problemId: problem._id,
      userId,
      approachId,
    }).lean();
  }
  if (!pseudocodeDoc) {
    pseudocodeDoc = await ProblemPseudocode.findOne({
      problemId: problem._id,
      approachId,
    }).lean();
  }

  const codeText = `// Implementation for ${approachName} on ${problem.title}`;

  // 5. Generate Dry Run content via Gemini AI
  const { rawText, model, promptVersion } = await geminiService.generateStage08DryRunContent(
    problem,
    approachId,
    approachName,
    pseudocodeDoc,
    codeText,
    selectedTestCase
  );

  // Safety Bound: Enforce maximum response payload size limit
  const MAX_AI_PAYLOAD_BYTES = 131072; // 128 KB
  if (rawText && rawText.length > MAX_AI_PAYLOAD_BYTES) {
    throw new AppError(`AI generated response exceeded safety size limit of ${MAX_AI_PAYLOAD_BYTES} bytes.`, 502);
  }

  let parsedContent;
  try {
    const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    parsedContent = JSON.parse(cleaned);
  } catch (err) {
    console.error(`[Visualization AI] JSON parsing error for problem "${problem.problemId || problemIdOrSlug}": ${err.message}. Payload length: ${rawText?.length || 0}.`);
    throw new AppError('AI generated invalid JSON for execution trace. Please try again.', 502);
  }

  // Deep Structural Verification of AI-generated steps
  if (!parsedContent || !Array.isArray(parsedContent.steps) || parsedContent.steps.length === 0) {
    throw new AppError('AI returned an empty or invalid execution trace. Please retry generation.', 502);
  }

  for (let idx = 0; idx < parsedContent.steps.length; idx++) {
    const s = parsedContent.steps[idx];
    if (!s || typeof s !== 'object') {
      throw new AppError(`AI generated malformed step at index ${idx}. Must be a valid step object.`, 502);
    }
    if (!s.description && !s.label && !s.action) {
      throw new AppError(`AI step at index ${idx} lacks an operation description or label.`, 502);
    }
    if (!s.stepNumber && !s.step) {
      s.stepNumber = idx + 1;
    }
  }

  // 6. Assemble Dry Run payload
  const isSharedPublic = Boolean(
    problem.isPublished && (problem.createdBy && String(problem.createdBy) === String(userId))
  );

  const dryRunPayload = {
    problemId: problem._id,
    userId: userId || problem.createdBy || null,
    isPublic: isSharedPublic,
    approachId,
    approachName,
    testCaseId,
    testCaseInput: selectedTestCase?.inputStructured || selectedTestCase?.inputRaw || problem.inputData,
    expectedOutput: selectedTestCase?.outputStructured || selectedTestCase?.outputRaw || problem.outputData,
    input: parsedContent.input || {
      title: problem.title,
      inputVisual: selectedTestCase?.inputRaw || '',
      items: [],
      expectedOutput: selectedTestCase?.outputRaw || '',
    },
    initialState: parsedContent.initialState || { subtitle: '', variables: [] },
    steps: parsedContent.steps,
    finalResult: parsedContent.finalResult || '',
    executionSummary: parsedContent.executionSummary || 'Execution trace generated via Gemini AI.',
    generationStatus: 'generated',
    model,
    promptVersion,
    rawText,
    sourceProblemHash: problem._id.toString(),
  };

  // 7. Transform to ExecutionTrace and validate schema BEFORE saving to MongoDB
  const trace = buildExecutionTrace(dryRunPayload, {
    problem,
    approachId,
    approachName,
  });

  const traceValidation = validateExecutionTrace(trace);
  if (!traceValidation.isValid) {
    throw new AppError(
      `AI-generated trace failed execution schema validation: ${traceValidation.errors?.join('; ')}`,
      502
    );
  }

  // Pre-normalize trace to ensure absolute schema compliance and deep immutability
  const normalizedTrace = normalizeExecutionTrace(trace);

  // Independent Result Verification against authoritative test case expected output
  const expectedOutput = selectedTestCase?.outputStructured !== undefined
    ? selectedTestCase.outputStructured
    : selectedTestCase?.outputRaw !== undefined
      ? selectedTestCase.outputRaw
      : problem?.outputData;

  let verificationStatus = 'AI_ASSISTED_UNVERIFIED';
  let resultVerified = false;

  if (expectedOutput !== undefined && expectedOutput !== null && expectedOutput !== '') {
    const finalResultToCompare = normalizedTrace.result !== undefined ? normalizedTrace.result : parsedContent.finalResult;
    if (areResultsEquivalent(finalResultToCompare, expectedOutput)) {
      verificationStatus = 'VERIFIED';
      resultVerified = true;
    } else {
      verificationStatus = 'AI_ASSISTED_UNVERIFIED';
      resultVerified = false;
      console.warn(`[Visualization AI] AI trace final result does not match expected output for problem "${problem.problemId || problemIdOrSlug}". Expected: ${JSON.stringify(expectedOutput)}, Actual: ${JSON.stringify(finalResultToCompare)}.`);
    }
  }

  // 8. Persist verified trace to ProblemDryRun with Mongoose validators enabled ONLY if persistent user exists
  // Never fabricate synthetic ObjectIds for anonymous users!
  if (mongoose.connection && mongoose.connection.readyState === 1 && problem._id && dryRunPayload.userId) {
    await ProblemDryRun.findOneAndUpdate(
      {
        problemId: problem._id,
        approachId,
        testCaseId,
        userId: dryRunPayload.userId,
      },
      dryRunPayload,
      { new: true, upsert: true, runValidators: true }
    ).lean();
  }

  return {
    trace: normalizedTrace,
    approachId,
    approachName,
    testCaseId,
    isFromDryRun: false,
    generatedByAi: true,
    isSupported: true,
    verificationStatus,
    resultVerified,
  };
};

/**
 * Extracts nums and target from testCase or problem inputs using universal normalizer
 */
const extractNumsAndTarget = (tc, prob) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  const nums = inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'array']);
  const target = inputNormalizer.extractNumber(params, ['target'], 'target');
  return { nums, target };
};

const traceTwoSumAlgorithm = (rawNums, rawTarget, options = {}) => {
  const isDemo = options.isDemo || options.demo || false;

  let target;
  if (typeof rawTarget === 'number' && Number.isFinite(rawTarget)) {
    target = rawTarget;
  } else if (rawTarget !== undefined && rawTarget !== null && rawTarget !== '') {
    const parsedTarget = Number(rawTarget);
    if (Number.isFinite(parsedTarget)) {
      target = parsedTarget;
    } else {
      throw new AppError(`Invalid target value "${rawTarget}" in Two Sum. Target must be a valid number.`, 400);
    }
  } else if (isDemo) {
    target = 9;
  } else {
    throw new AppError('Target value is required and must be a finite number for Two Sum.', 400);
  }

  let nums;
  if (Array.isArray(rawNums)) {
    const MAX_ARRAY_LENGTH = 100;
    if (rawNums.length > MAX_ARRAY_LENGTH) {
      throw new AppError(
        `Input array length (${rawNums.length}) exceeds maximum visualization limit of ${MAX_ARRAY_LENGTH} elements.`,
        400
      );
    }
    nums = rawNums.map((v, idx) => {
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
      throw new AppError(`Invalid array element at index ${idx} ("${v}") in Two Sum. Elements must be valid numbers.`, 400);
    });
  } else if (isDemo) {
    nums = [2, 7, 11, 15];
  } else {
    throw new AppError('Input array "nums" is required for Two Sum.', 400);
  }

  const problemId = options.problemId || 'two-sum';
  const approachId = options.approachId || 'hashMap';
  const approachName = options.approachName || 'Hash Table / Complement Lookup';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  // Initial Scene State (Pre-execution)
  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...nums],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    target: {
      id: 'target',
      type: 'variable',
      name: 'target',
      value: target,
      typeLabel: 'number',
    },
    hashMap: {
      id: 'hashMap',
      type: 'variable',
      name: 'hashMap',
      value: {},
      label: 'HashMap (Seen Value → Index)',
    },
    num: {
      id: 'num',
      type: 'variable',
      name: 'num',
      value: null,
      typeLabel: 'number',
    },
    complement: {
      id: 'complement',
      type: 'variable',
      name: 'complement',
      value: null,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Two Sum',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      target,
      currentIndex: null,
      currentNum: null,
      complement: null,
      hashMap: {},
      result: null,
    },
    nums: [...nums],
    target,
    currentIndex: null,
    currentNum: null,
    complement: null,
    hashMap: {},
    result: null,
  };

  const steps = [];
  let eventCounter = 1;
  const seenMap = {};
  let finalResult = null;

  for (let i = 0; i < nums.length; i++) {
    const currentNum = nums[i];
    const complement = target - currentNum;
    const hasMatch = Object.prototype.hasOwnProperty.call(seenMap, complement);
    const stepNumber = i + 1;
    const stepEvents = [];

    // 1. Pointer move & Array element access
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
      target: { primitiveId: 'nums' },
      data: { index: i, pointerId: 'i', color: 'blue' },
      description: `Move index pointer i to ${i}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'nums' },
      data: { index: i, value: currentNum },
      description: `Inspect element nums[${i}] = ${currentNum}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 2. Set currentNum & calculate complement
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'num' },
      data: { value: currentNum },
      description: `currentNum = ${currentNum}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'complement' },
      data: { value: complement },
      description: `Calculate complement: ${target} - ${currentNum} = ${complement}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 3. Lookup in HashMap
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.HASHMAP_LOOKUP,
      target: { primitiveId: 'hashMap' },
      data: {
        key: complement,
        found: hasMatch,
        foundIndex: hasMatch ? seenMap[complement] : null,
      },
      description: hasMatch
        ? `Found complement ${complement} in HashMap at index ${seenMap[complement]}!`
        : `Complement ${complement} not found in HashMap.`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    if (hasMatch) {
      const matchIdx = seenMap[complement];
      finalResult = [matchIdx, i];

      // 4a. Compare / Match Found
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_COMPARE,
        target: { primitiveId: 'nums' },
        data: {
          indices: [matchIdx, i],
          values: [complement, currentNum],
          matched: true,
          target,
        },
        description: `nums[${matchIdx}] (${complement}) + nums[${i}] (${currentNum}) = ${target}. Match confirmed!`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      // 4b. Return result
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'nums' },
        data: { value: [matchIdx, i], result: [matchIdx, i] },
        description: `Return solution indices [${matchIdx}, ${i}]`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      const currentHashMapSnapshot = { ...seenMap };

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        label: `Step ${stepNumber}: Match Found [${matchIdx}, ${i}]`,
        operation: 'match_found',
        description: `Found complement ${complement} at index ${matchIdx}! nums[${matchIdx}] (${complement}) + nums[${i}] (${currentNum}) = target (${target}). Solution discovered.`,
        changed: ['currentIndex', 'currentNum', 'complement', 'result', 'matchedPair'],
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          currentNum,
          complement,
          hashMap: currentHashMapSnapshot,
          result: [matchIdx, i],
        },
        highlights: {
          currentIndex: i,
          matchedPair: [matchIdx, i],
          arrayIndices: [matchIdx, i],
          hashMapKeys: Object.keys(currentHashMapSnapshot).map(Number),
        },
        events: stepEvents,
      });

      break; // Algorithm terminates upon finding the pair
    } else {
      // 4c. Not found: store currentNum into HashMap
      seenMap[currentNum] = i;

      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.HASHMAP_SET,
        target: { primitiveId: 'hashMap' },
        data: { key: currentNum, value: i },
        description: `Store ${currentNum} → index ${i} in HashMap`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      const currentHashMapSnapshot = { ...seenMap };

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        label: `Step ${stepNumber}: Inspect nums[${i}] = ${currentNum}`,
        operation: 'inspect_and_insert',
        description: `Visit nums[${i}] = ${currentNum}. Complement ${target} - ${currentNum} = ${complement} not yet in HashMap. Store key ${currentNum} ➔ ${i} in HashMap.`,
        changed: ['currentIndex', 'currentNum', 'complement', 'hashMap'],
        state: {
          nums: [...nums],
          target,
          currentIndex: i,
          currentNum,
          complement,
          hashMap: currentHashMapSnapshot,
          result: null,
        },
        highlights: {
          currentIndex: i,
          matchedPair: null,
          arrayIndices: [i],
          hashMapKeys: Object.keys(currentHashMapSnapshot).map(Number),
        },
        events: stepEvents,
      });
    }
  }

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Two Sum',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: finalResult,
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Extracts string input from testCase or problem inputs using universal normalizer
 */
const extractStringInput = (tc, prob, defaultValue = null) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  return inputNormalizer.extractString(params, ['s', 'str', 'string', 'word', 'text'], defaultValue);
};

/**
 * Genuine Algorithmic Execution Tracer for Longest Substring Without Repeating Characters (LeetCode 3)
 * Pure, deterministic sliding window execution tracer.
 * Invariant: Current window [left, right] contains no repeated characters.
 *
 * Operates 100% independently of Stage 08 Dry Run and Gemini AI.
 */
const traceLongestSubstringAlgorithm = (rawS, options = {}) => {
  const inputStr = typeof rawS === 'string'
    ? rawS
    : (rawS && typeof rawS === 'object' ? (rawS.s || rawS.value || '') : '');

  // Enforce safety bound: Reject oversized strings to protect memory & trace length (capped at 100)
  const MAX_STRING_LENGTH = 100;
  if (inputStr.length > MAX_STRING_LENGTH) {
    throw new AppError(
      `Input string length (${inputStr.length}) exceeds maximum visualization limit of ${MAX_STRING_LENGTH} characters.`,
      400
    );
  }
  const s = inputStr;
  const chars = Array.from(s); // Clean Unicode & character representation

  const problemId = options.problemId || 'longest-substring-without-repeating-characters';
  const approachId = options.approachId || 'slidingWindow';
  const approachName = options.approachName || 'Sliding Window (Hash Set / Visited Indices)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  // Initial Scene State (Pre-execution, Step 0)
  const initialPrimitives = {
    chars: {
      id: 'chars',
      type: 'array',
      label: 'Character Sequence (s)',
      values: [...chars],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
      windowRange: null,
    },
    s: {
      id: 's',
      type: 'variable',
      name: 's',
      value: s,
      typeLabel: 'string',
    },
    left: {
      id: 'left',
      type: 'variable',
      name: 'left',
      value: null,
      typeLabel: 'number',
    },
    right: {
      id: 'right',
      type: 'variable',
      name: 'right',
      value: null,
      typeLabel: 'number',
    },
    windowString: {
      id: 'windowString',
      type: 'variable',
      name: 'windowString',
      value: '',
      typeLabel: 'string',
    },
    windowChars: {
      id: 'windowChars',
      type: 'variable',
      name: 'windowChars',
      value: {},
      label: 'Active Window Set/Map',
    },
    maxLength: {
      id: 'maxLength',
      type: 'variable',
      name: 'maxLength',
      value: 0,
      typeLabel: 'number',
    },
    bestWindow: {
      id: 'bestWindow',
      type: 'variable',
      name: 'bestWindow',
      value: '',
      typeLabel: 'string',
    },
    bestRange: {
      id: 'bestRange',
      type: 'variable',
      name: 'bestRange',
      value: null,
      typeLabel: 'array',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Longest Substring Without Repeating Characters',
    primitives: initialPrimitives,
    flatState: {
      s,
      chars: [...chars],
      left: null,
      right: null,
      windowString: '',
      windowChars: {},
      maxLength: 0,
      bestWindow: '',
      bestRange: null,
      bestWindowRange: null,
      windowRange: null,
      result: null,
    },
    s,
    chars: [...chars],
    left: null,
    right: null,
    windowString: '',
    windowChars: {},
    maxLength: 0,
    bestWindow: '',
    bestRange: null,
    bestWindowRange: null,
    result: null,
  };

  const steps = [];
  let eventCounter = 1;

  // Handle empty string edge case
  if (chars.length === 0) {
    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'chars' },
        data: { value: 0, result: 0, bestWindow: '', bestRange: null, left: null, right: null, windowString: '' },
        description: 'Input string is empty. Return maximum substring length 0.',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty String (Length 0)',
      operation: 'complete',
      description: 'The input string is empty (""). Maximum unique substring length is 0.',
      changed: ['result', 'maxLength'],
      state: {
        s: '',
        chars: [],
        left: null,
        right: null,
        windowString: '',
        windowChars: {},
        maxLength: 0,
        bestWindow: '',
        bestRange: null,
        bestWindowRange: null,
        result: 0,
      },
      highlights: {
        windowRange: null,
        bestWindowRange: null,
        left: null,
        right: null,
        activeCharIndex: null,
        duplicateCharIndex: null,
      },
      events: stepEvents,
    });

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Longest Substring Without Repeating Characters',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { result: 0, bestWindow: '', bestRange: null },
      result: 0,
    };
    return normalizeExecutionTrace(rawTrace);
  }

  // Sliding Window Algorithm Loop
  let left = 0;
  const windowMap = {}; // char -> index in active window
  let maxLength = 0;
  let bestWindow = '';
  let bestRange = [0, 0];
  let stepNumber = 1;

  for (let right = 0; right < chars.length; right++) {
    const currentChar = chars[right];

    // Check if currentChar is already in the window
    if (windowMap[currentChar] !== undefined) {
      const dupIdx = windowMap[currentChar];

      // While duplicate character is in the window, shrink window from left
      while (windowMap[currentChar] !== undefined) {
        const evictedChar = chars[left];
        delete windowMap[evictedChar];

        const stepEvents = [];

        // 1. Highlight duplicate
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.HIGHLIGHT_SET,
          target: { primitiveId: 'chars' },
          data: { index: dupIdx, status: 'BLOCKED' },
          description: `Duplicate '${currentChar}' detected at index ${dupIdx}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        // 2. Delete evicted character from active window map
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.HASHMAP_DELETE,
          target: { primitiveId: 'windowChars' },
          data: { key: evictedChar },
          description: `Evict '${evictedChar}' at index ${left} from window set`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        // 3. Move left pointer past evicted character
        const newLeft = left + 1;
        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
          target: { primitiveId: 'chars' },
          data: { index: newLeft, pointerId: 'L', color: 'indigo' },
          description: `Advance Left pointer (L) from ${left} to ${newLeft}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
          target: { primitiveId: 'left' },
          data: { value: newLeft },
          description: `Update Left pointer variable to ${newLeft}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        // 4. Update window range (reflecting active characters between newLeft and right - 1, as currentChar at right has not yet entered)
        const windowEnd = right - 1;
        const currentWindowSlice = newLeft <= windowEnd ? s.slice(newLeft, windowEnd + 1) : '';
        const currentWindowRange = newLeft <= windowEnd ? [newLeft, windowEnd] : null;

        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.ARRAY_RANGE_UPDATE,
          target: { primitiveId: 'chars' },
          data: { range: currentWindowRange },
          description: currentWindowRange
            ? `Window range updated to [${currentWindowRange[0]}, ${currentWindowRange[1]}]`
            : `Window is currently empty`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        stepEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: stepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
          target: { primitiveId: 'windowString' },
          data: { value: currentWindowSlice },
          description: `Current window substring updated to "${currentWindowSlice}"`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        });

        const currentWindowMapSnapshot = { ...windowMap };

        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          label: `Step ${stepNumber}: Shrink Window — Evict '${evictedChar}' at index ${left}`,
          operation: 'shrink_window',
          description: `Duplicate '${currentChar}' detected. Evicted '${evictedChar}' at index ${left} to resolve duplicate. Left pointer advances to ${newLeft}.${currentWindowRange ? ` Active window: "${currentWindowSlice}" [${currentWindowRange[0]}, ${currentWindowRange[1]}].` : ' Active window is empty.'}`,
          changed: ['left', 'windowChars', 'windowString', 'windowRange'],
          state: {
            s,
            chars: [...chars],
            left: newLeft,
            right,
            currentChar,
            windowString: currentWindowSlice,
            windowRange: currentWindowRange,
            windowChars: currentWindowMapSnapshot,
            maxLength,
            bestWindow,
            bestRange: [...bestRange],
            bestWindowRange: [...bestRange],
            result: null,
          },
          highlights: {
            left: newLeft,
            right,
            windowRange: currentWindowRange,
            bestWindowRange: [...bestRange],
            activeCharIndex: right,
            duplicateCharIndex: dupIdx,
          },
          events: stepEvents,
        });

        stepNumber++;
        left = newLeft;
      }
    }

    // Now window has no duplicates: add currentChar to window and expand
    windowMap[currentChar] = right;
    const currentWindowSlice = s.slice(left, right + 1);
    const currentLength = right - left + 1;

    let isNewMax = false;
    if (currentLength > maxLength) {
      maxLength = currentLength;
      bestWindow = currentWindowSlice;
      bestRange = [left, right];
      isNewMax = true;
    }

    const stepEvents = [];

    // 1. Move Right pointer
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
      target: { primitiveId: 'chars' },
      data: { index: right, pointerId: 'R', color: 'blue' },
      description: `Move Right pointer (R) to ${right}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
      target: { primitiveId: 'right' },
      data: { value: right },
      description: `Update Right pointer variable to ${right}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 2. Inspect character
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'chars' },
      data: { index: right, value: currentChar },
      description: `Inspect character s[${right}] = '${currentChar}'`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 3. Add to window set
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.HASHMAP_SET,
      target: { primitiveId: 'windowChars' },
      data: { key: currentChar, value: right },
      description: `Add '${currentChar}' → index ${right} to window set`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 4. Update window range
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_RANGE_UPDATE,
      target: { primitiveId: 'chars' },
      data: { range: [left, right] },
      description: `Window range updated to [${left}, ${right}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
      target: { primitiveId: 'windowString' },
      data: { value: currentWindowSlice },
      description: `Current window substring updated to "${currentWindowSlice}"`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 5. Update maxLength & bestWindow if new max
    if (isNewMax) {
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
        target: { primitiveId: 'maxLength' },
        data: { value: maxLength },
        description: `New maximum length discovered: ${maxLength} ("${bestWindow}")`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
        target: { primitiveId: 'bestWindow' },
        data: { value: bestWindow },
        description: `Optimal substring updated to "${bestWindow}"`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: stepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
        target: { primitiveId: 'bestRange' },
        data: { value: [...bestRange] },
        description: `Optimal substring range updated to [${bestRange[0]}, ${bestRange[1]}]`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    const currentWindowMapSnapshot = { ...windowMap };

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      label: `Step ${stepNumber}: Expand Window to '${currentChar}' (Length ${currentLength})`,
      operation: 'expand_window',
      description: `Add '${currentChar}' at index ${right} to window. Active substring "${currentWindowSlice}" (len ${currentLength}). Current max: ${maxLength}${isNewMax ? ' (New Best!)' : ''}.`,
      changed: isNewMax
        ? ['right', 'windowChars', 'windowString', 'windowRange', 'maxLength', 'bestWindow', 'bestRange']
        : ['right', 'windowChars', 'windowString', 'windowRange'],
      state: {
        s,
        chars: [...chars],
        left,
        right,
        currentChar,
        windowString: currentWindowSlice,
        windowRange: [left, right],
        windowChars: currentWindowMapSnapshot,
        maxLength,
        bestWindow,
        bestRange: [...bestRange],
        bestWindowRange: [...bestRange],
        result: null,
      },
      highlights: {
        left,
        right,
        windowRange: [left, right],
        bestWindowRange: [...bestRange],
        activeCharIndex: right,
        duplicateCharIndex: null,
      },
      events: stepEvents,
    });

    stepNumber++;
  }

  // Final Step: Traversal Complete & Return
  const finalWindowSlice = left <= (chars.length - 1) ? s.slice(left, chars.length) : '';
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: stepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'chars' },
      data: {
        value: maxLength,
        result: maxLength,
        bestWindow,
        bestRange: [...bestRange],
        left,
        right: chars.length - 1,
        windowString: finalWindowSlice,
        windowRange: [left, chars.length - 1],
      },
      description: `Sliding window traversal complete. Return maximum substring length ${maxLength}. Optimal substring is "${bestWindow}".`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    label: `Step ${stepNumber}: Traversal Complete — Max Length ${maxLength}`,
    operation: 'complete',
    description: `Examined all characters. The longest substring without repeating characters is "${bestWindow}" with maximum length ${maxLength}. Final active window is "${finalWindowSlice}" [${left}, ${chars.length - 1}].`,
    changed: ['result'],
    state: {
      s,
      chars: [...chars],
      left,
      right: chars.length - 1,
      currentChar: null,
      windowString: finalWindowSlice,
      windowRange: [left, chars.length - 1],
      windowChars: { ...windowMap },
      maxLength,
      bestWindow,
      bestRange: [...bestRange],
      bestWindowRange: [...bestRange],
      result: maxLength,
    },
    highlights: {
      left,
      right: chars.length - 1,
      windowRange: [left, chars.length - 1],
      bestWindowRange: [...bestRange],
      activeCharIndex: null,
      duplicateCharIndex: null,
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Longest Substring Without Repeating Characters',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: maxLength,
      bestWindow,
    },
    result: maxLength,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Extracts nums array and k from testCase or problem inputs using universal normalizer
 */
const extractNumsAndK = (tc, prob) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  const nums = inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'array']);
  const k = inputNormalizer.extractNumber(params, ['k'], 'k');
  return { nums, k };
};

/**
 * Genuine Algorithmic Execution Tracer for Top K Frequent Elements (LeetCode 347)
 * Implements deterministic Bucket Sort O(N) strategy:
 * 1. Count element frequencies using frequencyMap.
 * 2. Group elements into buckets indexed by frequency (1..N).
 * 3. Traverse buckets from highest frequency (N) down to lowest (1).
 * 4. Collect elements until k elements have been accumulated.
 * 5. Return the top k frequent elements.
 *
 * Operates 100% independently of Stage 08 Dry Run and Gemini AI.
 */
const traceTopKFrequentBucketSort = (rawNums, rawK, options = {}) => {
  const isDemo = options.isDemo || options.demo || false;
  const MAX_ARRAY_LENGTH = 100;

  let nums;
  if (Array.isArray(rawNums)) {
    if (rawNums.length > MAX_ARRAY_LENGTH) {
      throw new AppError(
        `Input array length (${rawNums.length}) exceeds maximum visualization limit of ${MAX_ARRAY_LENGTH} elements.`,
        400
      );
    }
    nums = rawNums.map((v, idx) => {
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
      throw new AppError(`Invalid array element at index ${idx} ("${v}") in Top K Frequent Elements. Must be a valid number.`, 400);
    });
  } else if (isDemo) {
    nums = [1, 1, 1, 2, 2, 3];
  } else {
    throw new AppError('Input array "nums" is required for Top K Frequent Elements.', 400);
  }

  const N = nums.length;
  const problemId = options.problemId || 'top-k-frequent';
  const approachId = options.approachId || 'bucketSort';
  const approachName = options.approachName || 'Bucket Sort (Frequency Ranking)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  // Unique elements
  const uniqueElements = [...new Set(nums)];
  let k;
  if (rawK !== undefined && rawK !== null && rawK !== '') {
    const rawKNum = Number(rawK);
    if (!Number.isInteger(rawKNum) || !Number.isFinite(rawKNum) || rawKNum < 1) {
      throw new AppError(`Invalid k value "${rawK}" in Top K Frequent Elements. k must be a positive integer.`, 400);
    }
    if (uniqueElements.length > 0 && rawKNum > uniqueElements.length) {
      throw new AppError(`k value (${rawKNum}) cannot exceed the number of unique elements (${uniqueElements.length}).`, 400);
    }
    k = rawKNum;
  } else if (isDemo) {
    k = 2;
  } else {
    throw new AppError('k value is required and must be a positive integer in Top K Frequent Elements.', 400);
  }

  // Initial Scene State (Step 0)
  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...nums],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    k: {
      id: 'k',
      type: 'variable',
      name: 'k',
      value: k,
      typeLabel: 'number',
    },
    frequencyMap: {
      id: 'frequencyMap',
      type: 'variable',
      name: 'frequencyMap',
      value: {},
      label: 'Frequency Map (Number → Frequency)',
    },
    buckets: {
      id: 'buckets',
      type: 'variable',
      name: 'buckets',
      value: Array.from({ length: N + 1 }, () => []),
      label: 'Frequency Buckets (1..N)',
      activeFrequency: null,
    },
    topKResult: {
      id: 'topKResult',
      type: 'variable',
      name: 'topKResult',
      value: [],
      label: `Top ${k} Frequent Elements`,
    },
    currentNum: {
      id: 'currentNum',
      type: 'variable',
      name: 'currentNum',
      value: null,
      typeLabel: 'number',
    },
    currentFrequency: {
      id: 'currentFrequency',
      type: 'variable',
      name: 'currentFrequency',
      value: null,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Top K Frequent Elements',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentNum: null,
      currentFrequency: null,
      frequencyMap: {},
      buckets: Array.from({ length: N + 1 }, () => []),
      topKResult: [],
      result: null,
    },
    nums: [...nums],
    k,
    currentIndex: null,
    currentNum: null,
    currentFrequency: null,
    frequencyMap: {},
    buckets: Array.from({ length: N + 1 }, () => []),
    topKResult: [],
    result: null,
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Edge Case: Empty input or k <= 0
  if (N === 0 || k <= 0) {
    const finalEmpty = [];
    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'topKResult' },
        data: { value: finalEmpty, result: finalEmpty },
        description: N === 0 ? 'Input array is empty. Return empty result.' : 'k <= 0 is invalid. Return empty result.',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty or Invalid Input',
      operation: 'complete',
      description: N === 0 ? 'nums is empty; no frequent elements to return.' : 'Invalid k; returned empty list.',
      changed: ['result', 'topKResult'],
      state: {
        nums: [],
        k,
        currentIndex: null,
        currentNum: null,
        currentFrequency: null,
        frequencyMap: {},
        buckets: [[]],
        topKResult: [],
        result: finalEmpty,
      },
      highlights: {
        topK: finalEmpty,
      },
      events: stepEvents,
    });

    const rawTrace = {
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Top K Frequent Elements',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: {
        result: finalEmpty,
      },
      result: finalEmpty,
    };

    return normalizeExecutionTrace(rawTrace);
  }

  // --- PHASE 1: Count Element Frequencies ---
  const freqMap = {};
  for (let i = 0; i < N; i++) {
    const num = nums[i];
    const prevCount = freqMap[num] || 0;
    const newCount = prevCount + 1;
    freqMap[num] = newCount;

    const stepEvents = [];

    // Pointer move to element
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
      target: { primitiveId: 'nums' },
      data: { index: i, pointerId: 'i', color: 'blue' },
      description: `Move index pointer i to ${i}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // Array element access
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'nums' },
      data: { index: i, value: num },
      description: `Inspect element nums[${i}] = ${num}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // Variable set currentNum
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'currentNum' },
      data: { value: num },
      description: `currentNum = ${num}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // HashMap lookup
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.HASHMAP_LOOKUP,
      target: { primitiveId: 'frequencyMap' },
      data: { key: num, found: prevCount > 0, currentCount: prevCount },
      description: prevCount > 0
        ? `Found ${num} in Frequency Map (current count: ${prevCount}).`
        : `${num} not yet in Frequency Map (first occurrence).`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // HashMap update
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.HASHMAP_SET,
      target: { primitiveId: 'frequencyMap' },
      data: { key: num, value: newCount },
      description: `Update frequency of ${num} → ${newCount} in Frequency Map`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Count Frequency of nums[${i}] = ${num}`,
      operation: 'count_frequency',
      description: `Inspect nums[${i}] = ${num}. Updated Frequency Map: { ${num}: ${newCount} }.`,
      changed: ['currentIndex', 'currentNum', 'frequencyMap'],
      state: {
        nums: [...nums],
        k,
        currentIndex: i,
        currentNum: num,
        currentFrequency: null,
        frequencyMap: { ...freqMap },
        buckets: Array.from({ length: N + 1 }, () => []),
        topKResult: [],
        result: null,
      },
      highlights: {
        currentIndex: i,
        arrayIndices: [i],
        activeKey: num,
      },
      events: stepEvents,
    });

    currentStepNumber++;
  }

  // --- PHASE 2: Group Elements into Frequency Buckets ---
  const buckets = Array.from({ length: N + 1 }, () => []);
  for (const uniqueNum of uniqueElements) {
    const freq = freqMap[uniqueNum];
    buckets[freq].push(uniqueNum);

    const stepEvents = [];

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'currentNum' },
      data: { value: uniqueNum },
      description: `currentNum = ${uniqueNum}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'currentFrequency' },
      data: { value: freq },
      description: `currentFrequency = ${freq}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.BUCKET_INSERT,
      target: { primitiveId: 'buckets' },
      data: { frequency: freq, value: uniqueNum, bucket: [...buckets[freq]] },
      description: `Place element ${uniqueNum} into bucket[${freq}] (count = ${freq})`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Insert ${uniqueNum} into Bucket [Freq ${freq}]`,
      operation: 'bucket_insert',
      description: `Element ${uniqueNum} appeared ${freq} time(s). Place into Bucket [Freq ${freq}].`,
      changed: ['currentNum', 'currentFrequency', 'buckets'],
      state: {
        nums: [...nums],
        k,
        currentIndex: null,
        currentNum: uniqueNum,
        currentFrequency: freq,
        frequencyMap: { ...freqMap },
        buckets: buckets.map((b) => [...b]),
        topKResult: [],
        result: null,
      },
      highlights: {
        currentBucket: freq,
        activeKey: uniqueNum,
        bucketIndices: [freq],
      },
      events: stepEvents,
    });

    currentStepNumber++;
  }

  // --- PHASE 3: Traverse Buckets Descending & Collect Top K ---
  const topKResult = [];
  for (let f = N; f >= 1; f--) {
    if (topKResult.length >= k) break;
    if (buckets[f].length === 0) continue;

    const bucketTraverseEvents = [];
    bucketTraverseEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_SET,
      target: { primitiveId: 'currentFrequency' },
      data: { value: f },
      description: `currentFrequency = ${f}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    bucketTraverseEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.BUCKET_TRAVERSE,
      target: { primitiveId: 'buckets' },
      data: { frequency: f, bucket: [...buckets[f]], count: buckets[f].length },
      description: `Inspect Bucket [Freq ${f}] containing: [${buckets[f].join(', ')}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Inspect Bucket [Freq ${f}]`,
      operation: 'traverse_bucket',
      description: `Descending frequency scan reached frequency ${f}. Bucket contains [${buckets[f].join(', ')}].`,
      changed: ['currentFrequency'],
      state: {
        nums: [...nums],
        k,
        currentIndex: null,
        currentNum: null,
        currentFrequency: f,
        frequencyMap: { ...freqMap },
        buckets: buckets.map((b) => [...b]),
        topKResult: [...topKResult],
        result: null,
      },
      highlights: {
        currentBucket: f,
        bucketIndices: [f],
      },
      events: bucketTraverseEvents,
    });

    currentStepNumber++;

    for (const elem of buckets[f]) {
      if (topKResult.length >= k) break;
      topKResult.push(elem);

      const collectEvents = [];
      collectEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'currentNum' },
        data: { value: elem },
        description: `currentNum = ${elem}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      collectEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.RESULT_COLLECT,
        target: { primitiveId: 'topKResult' },
        data: {
          value: elem,
          frequency: f,
          topKResult: [...topKResult],
          k,
          remaining: k - topKResult.length,
        },
        description: `Collect ${elem} into Top-K result (${topKResult.length}/${k} elements collected)`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Collect ${elem} (Freq ${f}) into Top-K Result`,
        operation: 'collect_result',
        description: `Collected ${elem} with frequency ${f}. Total collected: ${topKResult.length} of ${k}.`,
        changed: ['topKResult', 'currentNum'],
        state: {
          nums: [...nums],
          k,
          currentIndex: null,
          currentNum: elem,
          currentFrequency: f,
          frequencyMap: { ...freqMap },
          buckets: buckets.map((b) => [...b]),
          topKResult: [...topKResult],
          result: null,
        },
        highlights: {
          currentBucket: f,
          topK: [...topKResult],
          activeNum: elem,
        },
        events: collectEvents,
      });

      currentStepNumber++;
    }
  }

  // --- PHASE 4: Completion ---
  const finalResult = [...topKResult];
  const completionEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'topKResult' },
      data: { value: finalResult, result: finalResult },
      description: `Return top ${k} frequent elements: [${finalResult.join(', ')}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Algorithm Complete — Result [${finalResult.join(', ')}]`,
    operation: 'complete',
    description: `Bucket Sort finished. Top ${k} frequent elements discovered: [${finalResult.join(', ')}].`,
    changed: ['result', 'topKResult'],
    state: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentNum: null,
      currentFrequency: null,
      frequencyMap: { ...freqMap },
      buckets: buckets.map((b) => [...b]),
      topKResult: finalResult,
      result: finalResult,
    },
    highlights: {
      topK: finalResult,
    },
    events: completionEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Top K Frequent Elements',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: finalResult,
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Extracts raw nums array from testCase or problem input
 */
/**
 * Extracts raw nums array from testCase or problem input using universal normalizer
 */
const extractNumsArray = (tc, prob) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  return inputNormalizer.extractNumericArray(params, ['nums', 'arr', 'array']);
};

/**
 * Extracts linked list head array from testCase or problem input using universal normalizer
 */
const extractLinkedListInput = (tc, prob) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  return inputNormalizer.extractLinkedList(params, ['head', 'list', 'nodes', 'array']);
};

/**
 * Extracts binary tree root array from testCase or problem input using universal normalizer
 */
const extractTreeInput = (tc, prob) => {
  const params = inputNormalizer.normalizeTestCaseInput(tc, prob);
  return inputNormalizer.extractBinaryTree(params, ['root', 'tree', 'array']);
};

/**
 * Genuine Algorithmic Execution Tracer for Longest Consecutive Sequence (LeetCode 128)
 * Optimal Hash Set algorithm in O(n) time.
 */
const traceLongestConsecutiveAlgorithm = (rawNums, options = {}) => {
  const MAX_ARRAY_LENGTH = 100;
  if (Array.isArray(rawNums) && rawNums.length > MAX_ARRAY_LENGTH) {
    throw new AppError(
      `Input array length (${rawNums.length}) exceeds maximum visualization limit of ${MAX_ARRAY_LENGTH} elements.`,
      400
    );
  }

  const nums = Array.isArray(rawNums)
    ? rawNums.map((v, idx) => {
      if (typeof v === 'number' && !isNaN(v)) return v;
      if (typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))) return Number(v);
      throw new AppError(`Invalid array element at index ${idx} ("${v}") in Longest Consecutive Sequence. Must be a valid number.`, 400);
    })
    : [100, 4, 200, 1, 3, 2];

  const problemId = options.problemId || 'longest-consecutive-sequence';
  const approachId = options.approachId || 'hashSet';
  const approachName = options.approachName || 'Hash Set Sequence Detector';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...nums],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    numSet: {
      id: 'numSet',
      type: 'variable',
      name: 'numSet',
      value: {},
      label: 'Hash Set (Seen Numbers)',
    },
    hashMap: {
      id: 'hashMap',
      type: 'variable',
      name: 'hashMap',
      value: {},
      label: 'Hash Set (Seen Numbers)',
    },
    longestStreak: {
      id: 'longestStreak',
      type: 'variable',
      name: 'longestStreak',
      value: 0,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Longest Consecutive Sequence',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      numSet: {},
      hashMap: {},
      longestStreak: 0,
      currentIndex: null,
      currentNum: null,
      currentStreak: 0,
    },
    problemInput: { nums },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  if (nums.length === 0) {
    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty Array Check',
      operation: 'CHECK_EMPTY',
      explanation: 'Input array is empty, returning longest consecutive sequence length of 0.',
      changed: ['result', 'longestStreak'],
      state: { nums: [], numSet: {}, hashMap: {}, longestStreak: 0, result: 0 },
      highlights: {},
      events: [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: 1,
          type: VISUALIZATION_EVENTS.RETURN,
          target: { primitiveId: 'longestStreak' },
          data: { value: 0 },
          description: 'Empty input array returns 0',
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ],
    });

    return normalizeExecutionTrace({
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Longest Consecutive Sequence',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { result: 0, longestStreak: 0 },
      result: 0,
    });
  }

  // Phase 1: Populate Hash Set
  const setMap = {};
  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    setMap[val] = true;

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
        target: { primitiveId: 'nums' },
        data: { index: i, value: val },
        description: `Read nums[${i}] = ${val}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.HASHMAP_SET,
        target: { primitiveId: 'numSet' },
        data: { key: String(val), value: true },
        description: `Insert ${val} into Set`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.HASHMAP_SET,
        target: { primitiveId: 'hashMap' },
        data: { key: String(val), value: true },
        description: `Insert ${val} into Set`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Insert ${val} into Set`,
      operation: 'set_insert',
      explanation: `Inserted ${val} into Set for O(1) sequence lookups.`,
      changed: ['numSet', 'hashMap', 'currentIndex', 'currentNum'],
      state: {
        nums: [...nums],
        numSet: { ...setMap },
        hashMap: { ...setMap },
        currentIndex: i,
        currentNum: val,
        longestStreak: 0,
        result: 0,
      },
      highlights: {
        currentIndex: i,
        arrayIndices: [i],
      },
      events: stepEvents,
    });
    currentStepNumber++;
  }

  // Phase 2: Find sequence starts and count streaks
  let longestStreak = 0;
  const uniqueNums = Object.keys(setMap).map(Number);

  for (const num of uniqueNums) {
    if (!setMap[num - 1]) {
      let currentNum = num;
      let currentStreak = 1;
      const currentSequence = [currentNum];

      while (setMap[currentNum + 1]) {
        currentNum += 1;
        currentStreak += 1;
        currentSequence.push(currentNum);
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_SET,
          target: { primitiveId: 'longestStreak' },
          data: { value: longestStreak },
          description: `Longest streak updated to ${longestStreak}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Sequence from ${num} (Length ${currentStreak})`,
        operation: 'sequence_expand',
        explanation: `${num} is a sequence start (${num - 1} not in set). Sequence: [${currentSequence.join(', ')}]. Streak length: ${currentStreak}.`,
        changed: ['longestStreak', 'currentStreak', 'currentNum', 'sequence', 'result'],
        state: {
          nums: [...nums],
          numSet: { ...setMap },
          hashMap: { ...setMap },
          currentIndex: null,
          currentNum: num,
          currentStreak,
          longestStreak,
          sequence: currentSequence,
          result: longestStreak,
        },
        highlights: {
          currentIndex: null,
          arrayIndices: [],
        },
        events: stepEvents,
      });
      currentStepNumber++;
    }
  }

  // Phase 3: Final Return
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'longestStreak' },
      data: { value: longestStreak, result: longestStreak },
      description: `Execution complete. Result = ${longestStreak}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Result — Longest Streak is ${longestStreak}`,
    operation: 'complete',
    explanation: `Execution complete. The longest consecutive sequence length is ${longestStreak}.`,
    changed: ['result', 'longestStreak'],
    state: {
      nums: [...nums],
      numSet: { ...setMap },
      hashMap: { ...setMap },
      currentIndex: null,
      currentNum: null,
      longestStreak,
      result: longestStreak,
    },
    highlights: {
      currentIndex: null,
      arrayIndices: [],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Longest Consecutive Sequence',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: longestStreak,
      longestStreak,
    },
    result: longestStreak,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Valid Parentheses (LeetCode 20)
 * Uses a Stack (LIFO) to match brackets in O(n) time and O(n) space.
 */
const traceValidParenthesesAlgorithm = (rawS, options = {}) => {
  const inputStr = typeof rawS === 'string'
    ? rawS
    : (rawS && typeof rawS === 'object' ? (rawS.s || rawS.value || '') : '');
  const s = inputStr || '()[]{}';

  const problemId = options.problemId || 'valid-parentheses';
  const approachId = options.approachId || 'stack';
  const approachName = options.approachName || 'Stack Bracket Matching';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const initialPrimitives = {
    s: {
      id: 's',
      type: 'variable',
      name: 's',
      value: s,
      typeLabel: 'string',
    },
    stack: {
      id: 'stack',
      type: 'stack',
      label: 'Character Stack',
      items: [],
    },
    char: {
      id: 'char',
      type: 'variable',
      name: 'char',
      value: null,
      typeLabel: 'string',
    },
    isValid: {
      id: 'isValid',
      type: 'variable',
      name: 'isValid',
      value: null,
      typeLabel: 'boolean',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Valid Parentheses',
    primitives: initialPrimitives,
    flatState: {
      s,
      stack: [],
      currentIndex: null,
      currentChar: null,
      isValid: null,
      result: null,
    },
    s,
    stack: [],
    currentIndex: null,
    currentChar: null,
    isValid: null,
    result: null,
    problemInput: { s },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;
  const stack = [];
  const matching = { ')': '(', '}': '{', ']': '[' };
  let isInvalidEarly = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (c === '(' || c === '{' || c === '[') {
      stack.push(c);

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_SET,
          target: { primitiveId: 'char' },
          data: { value: c },
          description: `Read opening bracket '${c}' at index ${i}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_PUSH,
          target: { primitiveId: 'stack' },
          data: { value: c, items: [...stack] },
          description: `Push '${c}' onto the stack`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Push '${c}' (Index ${i})`,
        operation: 'STACK_PUSH',
        description: `Encountered opening bracket '${c}'. Push onto stack. Stack size: ${stack.length}.`,
        changed: ['stack', 'currentIndex', 'currentChar'],
        state: {
          s,
          stack: [...stack],
          currentIndex: i,
          currentChar: c,
          isValid: null,
          result: null,
        },
        highlights: {
          index: i,
          top: c,
        },
        events: stepEvents,
      });
      currentStepNumber++;
    } else if (c === ')' || c === '}' || c === ']') {
      const expectedOpening = matching[c];
      const topOfStack = stack.length > 0 ? stack[stack.length - 1] : null;

      if (stack.length === 0 || topOfStack !== expectedOpening) {
        isInvalidEarly = true;

        const stepEvents = [
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.VARIABLE_SET,
            target: { primitiveId: 'char' },
            data: { value: c },
            description: `Read closing bracket '${c}' at index ${i}`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.VARIABLE_SET,
            target: { primitiveId: 'isValid' },
            data: { value: false },
            description: `Mismatch: expected '${expectedOpening}', found '${topOfStack || 'empty'}'`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.RETURN,
            target: { primitiveId: 'isValid' },
            data: { value: false, result: false },
            description: 'Parentheses string is invalid. Returning false.',
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
        ];

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Mismatch at Index ${i} ('${c}')`,
          operation: 'MISMATCH',
          description: stack.length === 0
            ? `Closing bracket '${c}' encountered but stack is empty! String is invalid.`
            : `Closing bracket '${c}' does not match top element '${topOfStack}' (expected '${expectedOpening}'). String is invalid.`,
          changed: ['isValid', 'result', 'currentIndex', 'currentChar'],
          state: {
            s,
            stack: [...stack],
            currentIndex: i,
            currentChar: c,
            isValid: false,
            result: false,
          },
          highlights: {
            index: i,
            top: topOfStack,
          },
          events: stepEvents,
        });
        currentStepNumber++;
        break;
      } else {
        const popped = stack.pop();

        const stepEvents = [
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.VARIABLE_SET,
            target: { primitiveId: 'char' },
            data: { value: c },
            description: `Read closing bracket '${c}' at index ${i}`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
          {
            id: `evt-${String(eventCounter++).padStart(2, '0')}`,
            step: currentStepNumber,
            type: VISUALIZATION_EVENTS.STACK_POP,
            target: { primitiveId: 'stack' },
            data: { value: popped, items: [...stack] },
            description: `Pop matching '${popped}' from stack`,
            schemaVersion: EVENT_SCHEMA_VERSION,
          },
        ];

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          label: `Step ${currentStepNumber}: Match Found! Pop '${popped}'`,
          operation: 'STACK_POP',
          description: `Closing bracket '${c}' matches top '${popped}'. Popped from stack. Remaining size: ${stack.length}.`,
          changed: ['stack', 'currentIndex', 'currentChar'],
          state: {
            s,
            stack: [...stack],
            currentIndex: i,
            currentChar: c,
            isValid: null,
            result: null,
          },
          highlights: {
            index: i,
            top: stack.length > 0 ? stack[stack.length - 1] : null,
          },
          events: stepEvents,
        });
        currentStepNumber++;
      }
    }
  }

  if (!isInvalidEarly) {
    const isBalanced = stack.length === 0;

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'isValid' },
        data: { value: isBalanced },
        description: `Validation completed: string is ${isBalanced ? 'valid' : 'invalid (unmatched elements in stack)'}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'isValid' },
        data: { value: isBalanced, result: isBalanced },
        description: `Return ${isBalanced}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Completed — Valid = ${isBalanced}`,
      operation: 'complete',
      description: isBalanced
        ? 'All opening brackets matched and stack is empty. The input string is valid!'
        : `Execution finished but stack still contains ${stack.length} unmatched bracket(s). Result: invalid.`,
      changed: ['isValid', 'result'],
      state: {
        s,
        stack: [...stack],
        currentIndex: null,
        currentChar: null,
        isValid: isBalanced,
        result: isBalanced,
      },
      highlights: {
        top: stack.length > 0 ? stack[stack.length - 1] : null,
      },
      events: stepEvents,
    });
  }

  const finalResult = steps[steps.length - 1].state.result;

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Valid Parentheses',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: finalResult,
      isValid: finalResult,
    },
    result: finalResult,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Reverse Linked List (LeetCode 206)
 * Iterative Three-Pointer reversal in O(n) time and O(1) extra space.
 */
const traceReverseLinkedListAlgorithm = (rawHead, options = {}) => {
  if (!Array.isArray(rawHead) && rawHead !== null && rawHead !== undefined) {
    throw new AppError('Invalid input: rawHead must be an array of node values.', 400);
  }

  const values = Array.isArray(rawHead)
    ? rawHead.map((v) => (typeof v === 'number' ? v : Number(v) || 0))
    : [];

  const problemId = options.problemId || 'reverse-linked-list';
  const approachId = options.approachId || 'iterativePointers';
  const approachName = options.approachName || 'Three-Pointer Iterative Reversal';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const initialNodes = values.map((val, idx) => ({
    id: idx + 1,
    val,
    nextId: idx < values.length - 1 ? idx + 2 : null,
  }));

  const initialPrimitives = {
    list: {
      id: 'list',
      type: 'linked-list',
      label: 'Singly Linked List',
      nodes: initialNodes.map((n) => ({ ...n })),
      prevId: null,
      currId: initialNodes.length > 0 ? initialNodes[0].id : null,
      nextId: initialNodes.length > 1 ? initialNodes[1].id : null,
    },
    prev: {
      id: 'prev',
      type: 'variable',
      name: 'prev',
      value: null,
      typeLabel: 'number',
    },
    curr: {
      id: 'curr',
      type: 'variable',
      name: 'curr',
      value: initialNodes.length > 0 ? initialNodes[0].id : null,
      typeLabel: 'number',
    },
    next: {
      id: 'next',
      type: 'variable',
      name: 'next',
      value: initialNodes.length > 1 ? initialNodes[1].id : null,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Reverse Linked List',
    primitives: initialPrimitives,
    flatState: {
      nodes: initialNodes.map((n) => ({ ...n })),
      prev: null,
      curr: initialNodes.length > 0 ? initialNodes[0].id : null,
      next: initialNodes.length > 1 ? initialNodes[1].id : null,
      result: null,
    },
    nodes: initialNodes.map((n) => ({ ...n })),
    prev: null,
    curr: initialNodes.length > 0 ? initialNodes[0].id : null,
    next: initialNodes.length > 1 ? initialNodes[1].id : null,
    result: null,
    problemInput: { head: values },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  if (values.length === 0) {
    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty List',
      operation: 'complete',
      description: 'The linked list is empty (head = null). Return null.',
      changed: ['result'],
      state: {
        nodes: [],
        prev: null,
        curr: null,
        next: null,
        result: [],
      },
      highlights: {},
      events: [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: 1,
          type: VISUALIZATION_EVENTS.RETURN,
          target: { primitiveId: 'list' },
          data: { value: [], result: [] },
          description: 'Empty list returns null',
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ],
    });

    return normalizeExecutionTrace({
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Reverse Linked List',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { result: [] },
      result: [],
    });
  }

  const currentNodes = initialNodes.map((n) => ({ ...n }));
  let prev = null;
  let curr = currentNodes[0].id;

  while (curr !== null) {
    const currNode = currentNodes.find((n) => n.id === curr);
    const next = currNode ? currNode.nextId : null;

    // Step 1: Save next node: next = curr.next
    const step1Events = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'next' },
        data: { value: next },
        description: `Set next = node(${next !== null ? next : 'null'})`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.LINKED_LIST_POINTER_MOVE,
        target: { primitiveId: 'list' },
        data: { prevId: prev, currId: curr, nextId: next },
        description: `Pointers: prev=${prev}, curr=${curr}, next=${next}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Inspect Node ${currNode.val} (next = ${next !== null ? `Node ${next}` : 'null'})`,
      operation: 'POINTER_NEXT',
      description: `Save pointer to next node: next = curr.next (${next !== null ? `Node ${next}` : 'null'}).`,
      changed: ['next', 'curr', 'prev'],
      state: {
        nodes: currentNodes.map((n) => ({ ...n })),
        prev,
        curr,
        next,
        result: null,
      },
      highlights: {
        prev,
        curr,
        next,
      },
      events: step1Events,
    });
    currentStepNumber++;

    // Step 2: Reverse link: curr.next = prev
    if (currNode) {
      currNode.nextId = prev;
    }

    const step2Events = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.LINKED_LIST_LINK_UPDATE,
        target: { primitiveId: 'list' },
        data: { nodeId: curr, newNextId: prev },
        description: `Reverse link: Node(${curr}) -> ${prev !== null ? `Node(${prev})` : 'null'}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Reverse Link of Node ${currNode.val} (curr.next = prev)`,
      operation: 'REVERSE_LINK',
      description: `Reversed direction of Node ${currNode.val}: it now points to ${prev !== null ? `Node ${prev}` : 'null'}.`,
      changed: ['nodes'],
      state: {
        nodes: currentNodes.map((n) => ({ ...n })),
        prev,
        curr,
        next,
        result: null,
      },
      highlights: {
        prev,
        curr,
        next,
      },
      events: step2Events,
    });
    currentStepNumber++;

    // Step 3: Advance pointers: prev = curr; curr = next;
    prev = curr;
    curr = next;

    const step3Events = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'prev' },
        data: { value: prev },
        description: `Advance prev to node(${prev})`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'curr' },
        data: { value: curr },
        description: `Advance curr to node(${curr !== null ? curr : 'null'})`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.LINKED_LIST_POINTER_MOVE,
        target: { primitiveId: 'list' },
        data: { prevId: prev, currId: curr, nextId: null },
        description: `Advanced pointers: prev=${prev}, curr=${curr}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Advance Pointers (prev = ${prev}, curr = ${curr !== null ? curr : 'null'})`,
      operation: 'ADVANCE_POINTERS',
      description: `Shifted pointers forward: prev moved to Node ${prev}, curr moved to ${curr !== null ? `Node ${curr}` : 'null'}.`,
      changed: ['prev', 'curr'],
      state: {
        nodes: currentNodes.map((n) => ({ ...n })),
        prev,
        curr,
        next: null,
        result: null,
      },
      highlights: {
        prev,
        curr,
        next: null,
      },
      events: step3Events,
    });
    currentStepNumber++;
  }

  const reversedValues = [...values].reverse();
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'list' },
      data: { value: reversedValues, result: reversedValues, head: prev },
      description: `Reversal complete. New head is Node(${prev}).`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Reversal Complete (New Head = Node ${prev})`,
    operation: 'complete',
    description: `All node pointers have been reversed. The new list order is [${reversedValues.join(' -> ')}].`,
    changed: ['result', 'head'],
    state: {
      nodes: currentNodes.map((n) => ({ ...n })),
      prev,
      curr: null,
      next: null,
      head: prev,
      result: reversedValues,
    },
    highlights: {
      prev,
      curr: null,
      next: null,
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Reverse Linked List',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: reversedValues,
      head: prev,
    },
    result: reversedValues,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Builds a binary tree hierarchy and adjacency map from a LeetCode level-order array
 */
function buildTreeFromLevelOrder(arr) {
  if (!Array.isArray(arr) || arr.length === 0 || arr[0] === null || arr[0] === undefined) {
    return { rootId: null, rootVal: null, treeMap: {}, nodes: [], edges: [] };
  }

  const rootVal = typeof arr[0] === 'number' ? arr[0] : Number(arr[0]) || 0;
  const treeMap = {};
  const nodes = [];
  const edges = [];

  let nodeIdCounter = 1;
  const rootNode = { id: nodeIdCounter++, val: rootVal, left: null, right: null };
  treeMap[rootNode.id] = rootNode;
  nodes.push(rootNode.val);

  const queue = [rootNode];
  let i = 1;

  while (queue.length > 0 && i < arr.length) {
    const parent = queue.shift();

    // Left child
    if (i < arr.length) {
      const leftVal = arr[i++];
      if (leftVal !== null && leftVal !== undefined) {
        const parsedVal = typeof leftVal === 'number' ? leftVal : Number(leftVal) || 0;
        const leftNode = { id: nodeIdCounter++, val: parsedVal, left: null, right: null };
        parent.left = leftNode.id;
        treeMap[leftNode.id] = leftNode;
        nodes.push(leftNode.val);
        edges.push({ from: parent.id, to: leftNode.id, fromVal: parent.val, toVal: leftNode.val });
        queue.push(leftNode);
      }
    }

    // Right child
    if (i < arr.length) {
      const rightVal = arr[i++];
      if (rightVal !== null && rightVal !== undefined) {
        const parsedVal = typeof rightVal === 'number' ? rightVal : Number(rightVal) || 0;
        const rightNode = { id: nodeIdCounter++, val: parsedVal, left: null, right: null };
        parent.right = rightNode.id;
        treeMap[rightNode.id] = rightNode;
        nodes.push(rightNode.val);
        edges.push({ from: parent.id, to: rightNode.id, fromVal: parent.val, toVal: rightNode.val });
        queue.push(rightNode);
      }
    }
  }

  return { rootId: rootNode.id, rootVal, treeMap, nodes, edges };
}

/**
 * Genuine Algorithmic Execution Tracer for Binary Tree Inorder Traversal (LeetCode 94)
 * DFS Inorder (Left -> Root -> Right) using an explicit traversal Call Stack.
 * Dynamically builds trees from any LeetCode level-order array input.
 */
const traceBinaryTreeInorderAlgorithm = (rawRoot, options = {}) => {
  const problemId = options.problemId || 'binary-tree-inorder-traversal';
  const approachId = options.approachId || 'inorderDfs';
  const approachName = options.approachName || 'Inorder Traversal (Call Stack)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const inputArr = Array.isArray(rawRoot) ? rawRoot : [1, null, 2, 3];
  const { rootId, rootVal, treeMap, nodes, edges } = buildTreeFromLevelOrder(inputArr);

  const initialPrimitives = {
    tree: {
      id: 'tree',
      type: 'tree',
      label: 'Binary Tree',
      root: rootVal,
      rootId,
      treeMap,
      nodes,
      edges,
      currentNode: null,
      visitedNodes: [],
    },
    stack: {
      id: 'stack',
      type: 'stack',
      label: 'Call Stack',
      items: [],
    },
    curr: {
      id: 'curr',
      type: 'variable',
      name: 'curr',
      value: rootVal,
      typeLabel: 'number',
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: [],
      typeLabel: 'array',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Binary Tree Inorder Traversal',
    primitives: initialPrimitives,
    flatState: {
      root: rootVal,
      currentNode: null,
      stack: [],
      visited: [],
      result: [],
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    root: rootVal,
    currentNode: null,
    stack: [],
    visited: [],
    result: [],
    tree: { root: rootVal, rootId, treeMap, nodes, edges },
    problemInput: { root: inputArr },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Edge case: Empty binary tree (root = null)
  if (rootId === null) {
    const finalEmpty = [];
    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'result' },
        data: { value: finalEmpty, result: finalEmpty },
        description: 'Tree is empty (root = null). Inorder traversal returns [].',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty Tree (root = null)',
      operation: 'complete',
      description: 'The binary tree is empty (root = null). Final inorder traversal output: [].',
      changed: ['result'],
      state: {
        root: null,
        currentNode: null,
        curr: null,
        stack: [],
        visited: [],
        result: [],
        tree: { root: null, rootId: null, treeMap: {}, nodes: [], edges: [] },
      },
      highlights: {
        currentNode: null,
        stackNodes: [],
        visitedNodes: [],
      },
      events: stepEvents,
    });

    return normalizeExecutionTrace({
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Binary Tree Inorder Traversal',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { result: [] },
      result: [],
    });
  }

  const stack = []; // will store node ids
  const visited = []; // will store node values
  const result = [];
  let curr = rootId;

  while (curr !== null || stack.length > 0) {
    // 1. Traverse left subtree
    while (curr !== null) {
      stack.push(curr);
      const currNode = treeMap[curr];
      const nodeVal = currNode.val;
      const stackValues = stack.map((id) => treeMap[id].val);

      const stepEvents = [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.TREE_CURRENT,
          target: { primitiveId: 'tree' },
          data: { nodeId: curr, nodeVal },
          description: `Current pointer at Node ${nodeVal}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_PUSH,
          target: { primitiveId: 'stack' },
          data: { value: nodeVal, items: [...stackValues] },
          description: `Push Node ${nodeVal} onto DFS call stack`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.VARIABLE_SET,
          target: { primitiveId: 'curr' },
          data: { value: nodeVal },
          description: `Set curr = Node ${nodeVal}`,
          schemaVersion: EVENT_SCHEMA_VERSION,
        },
      ];

      steps.push({
        id: `step-${currentStepNumber}`,
        stepNumber: currentStepNumber,
        label: `Step ${currentStepNumber}: Push Node ${nodeVal} (Traversing Left)`,
        operation: 'STACK_PUSH',
        description: `Push Node ${nodeVal} onto call stack and navigate to left child. Stack: [${stackValues.join(', ')}].`,
        changed: ['stack', 'currentNode', 'curr'],
        state: {
          root: rootVal,
          currentNode: nodeVal,
          curr: nodeVal,
          stack: [...stackValues],
          visited: [...visited],
          result: [...result],
          tree: { root: rootVal, rootId, treeMap, nodes, edges },
        },
        highlights: {
          currentNode: nodeVal,
          currentNodeId: curr,
          stackNodes: [...stackValues],
          visitedNodes: [...visited],
        },
        events: stepEvents,
      });
      currentStepNumber++;

      curr = currNode.left;
    }

    // 2. Pop and visit node
    curr = stack.pop();
    const currNode = treeMap[curr];
    const nodeVal = currNode.val;
    visited.push(nodeVal);
    result.push(nodeVal);
    const stackValues = stack.map((id) => treeMap[id].val);

    const stepEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.STACK_POP,
        target: { primitiveId: 'stack' },
        data: { value: nodeVal, items: [...stackValues] },
        description: `Pop Node ${nodeVal} from DFS call stack`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.TREE_VISIT,
        target: { primitiveId: 'tree' },
        data: { nodeId: curr, nodeVal },
        description: `Visit Node ${nodeVal} (Inorder Result +[${nodeVal}])`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'result' },
        data: { value: [...result] },
        description: `Inorder traversed: [${result.join(', ')}]`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Visit Node ${nodeVal} (Append to Output)`,
      operation: 'TREE_VISIT',
      description: `Popped Node ${nodeVal} from stack and visited it. Inorder output: [${result.join(', ')}]. Now moving to right child.`,
      changed: ['stack', 'visited', 'result', 'currentNode'],
      state: {
        root: rootVal,
        currentNode: nodeVal,
        curr: nodeVal,
        stack: [...stackValues],
        visited: [...visited],
        result: [...result],
        tree: { root: rootVal, rootId, treeMap, nodes, edges },
      },
      highlights: {
        currentNode: nodeVal,
        currentNodeId: curr,
        stackNodes: [...stackValues],
        visitedNodes: [...visited],
      },
      events: stepEvents,
    });
    currentStepNumber++;

    curr = currNode.right;
  }

  // Final Step: Traversal Complete
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'result' },
      data: { value: [...result], result: [...result] },
      description: `Inorder traversal complete. Final output: [${result.join(', ')}].`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Inorder Traversal Complete — [${result.join(', ')}]`,
    operation: 'complete',
    description: `All nodes in the binary tree have been traversed in Left -> Root -> Right order. Final result: [${result.join(', ')}].`,
    changed: ['result', 'currentNode'],
    state: {
      root: rootVal,
      currentNode: null,
      curr: null,
      stack: [],
      visited: [...visited],
      result: [...result],
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    highlights: {
      currentNode: null,
      stackNodes: [],
      visitedNodes: [...visited],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Binary Tree Inorder Traversal',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: [...result],
    },
    result: [...result],
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Kth Largest Element in an Array (LeetCode 215)
 * Min-Heap of size K in O(n log k) time and O(k) extra space.
 */
const traceKthLargestAlgorithm = (rawNums, rawK, options = {}) => {
  const problemId = options.problemId || 'kth-largest-element';
  const approachId = options.approachId || 'minHeap';
  const approachName = options.approachName || 'Min-Heap of Size K';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const nums = Array.isArray(rawNums)
    ? rawNums.map((v) => (typeof v === 'number' ? v : Number(v) || 0))
    : [3, 2, 1, 5, 6, 4];
  const k = typeof rawK === 'number' && rawK > 0 ? rawK : Number(rawK) || 2;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...nums],
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
    k: {
      id: 'k',
      type: 'variable',
      name: 'k',
      value: k,
      typeLabel: 'number',
    },
    currentVal: {
      id: 'currentVal',
      type: 'variable',
      name: 'currentVal',
      value: null,
      typeLabel: 'number',
    },
    poppedVal: {
      id: 'poppedVal',
      type: 'variable',
      name: 'poppedVal',
      value: null,
      typeLabel: 'number',
    },
    result: {
      id: 'result',
      type: 'variable',
      name: 'result',
      value: null,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Kth Largest Element in an Array',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      minHeap: [],
      poppedVal: null,
      result: null,
    },
    nums: [...nums],
    k,
    currentIndex: null,
    currentVal: null,
    minHeap: [],
    poppedVal: null,
    result: null,
  };

  const heap = [];
  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Step 1: Initialize
  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 1: Initialize Min-Heap',
    operation: 'INITIALIZE',
    description: `Initialize empty Min-Heap of capacity k = ${k}. We maintain the ${k} largest elements seen so far; the root will hold the ${k}th largest element.`,
    changed: ['minHeap'],
    state: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      minHeap: [],
      poppedVal: null,
      result: null,
    },
    highlights: { index: null, heap: [] },
    events: [],
  });
  currentStepNumber++;

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];

    // Push into min-heap and sift up
    heap.push(val);
    let currIdx = heap.length - 1;

    const insertEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
        target: { primitiveId: 'nums' },
        data: { index: i, value: val },
        description: `Inspect nums[${i}] = ${val}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.HEAP_INSERT,
        target: { primitiveId: 'minHeap' },
        data: { value: val, resultingState: [...heap] },
        description: `Insert ${val} into Min-Heap`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    while (currIdx > 0) {
      const parentIdx = Math.floor((currIdx - 1) / 2);
      if (heap[currIdx] < heap[parentIdx]) {
        insertEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HEAP_SWAP,
          target: { primitiveId: 'minHeap' },
          data: {
            indices: [currIdx, parentIdx],
            values: [heap[currIdx], heap[parentIdx]],
            resultingState: [...heap],
          },
          description: `Sift-up: Swap child ${heap[currIdx]} with parent ${heap[parentIdx]}`,
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

    let popped = null;
    const isExceeded = heap.length > k;

    if (isExceeded) {
      popped = heap[0];
      const last = heap.pop();
      if (heap.length > 0) {
        heap[0] = last;
        insertEvents.push({
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.HEAP_REMOVE,
          target: { primitiveId: 'minHeap' },
          data: { value: popped, resultingState: [...heap] },
          description: `Heap size exceeded k (${k}). Extract min root element ${popped}.`,
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
            insertEvents.push({
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.HEAP_SWAP,
              target: { primitiveId: 'minHeap' },
              data: {
                indices: [pIdx, smallest],
                values: [heap[pIdx], heap[smallest]],
                resultingState: [...heap],
              },
              description: `Sift-down: Swap parent ${heap[pIdx]} with child ${heap[smallest]}`,
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

    const stepDesc = isExceeded
      ? `Inspect nums[${i}] = ${val}. Insert ${val} into Min-Heap. Size exceeded k (${k}); evicted smallest element ${popped}. Top is now ${heap[0]}.`
      : `Inspect nums[${i}] = ${val}. Insert ${val} into Min-Heap. Heap size is ${heap.length} <= ${k}. Top is ${heap[0]}.`;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Process nums[${i}] = ${val}`,
      operation: isExceeded ? 'HEAP_EVICT' : 'HEAP_INSERT',
      description: stepDesc,
      changed: ['currentIndex', 'currentVal', 'minHeap', 'poppedVal'],
      state: {
        nums: [...nums],
        k,
        currentIndex: i,
        currentVal: val,
        minHeap: [...heap],
        poppedVal: popped,
        result: heap.length >= k ? heap[0] : null,
      },
      highlights: {
        index: i,
        heap: [...heap],
        top: heap.length > 0 ? heap[0] : null,
        popped,
      },
      events: insertEvents,
    });
    currentStepNumber++;
  }

  const finalKth = heap[0] !== undefined ? heap[0] : null;

  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'result' },
      data: { value: finalKth, result: finalKth },
      description: `Min-Heap contains the ${k} largest elements. Root of Min-Heap (${finalKth}) is the ${k}th largest element.`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Complete — ${k}th Largest is ${finalKth}`,
    operation: 'complete',
    description: `All ${nums.length} elements processed. The Min-Heap of size ${k} contains [${heap.join(', ')}]. The root element (${finalKth}) is the ${k}th largest element in the array.`,
    changed: ['result'],
    state: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      minHeap: [...heap],
      poppedVal: null,
      result: finalKth,
    },
    highlights: {
      index: null,
      heap: [...heap],
      top: finalKth,
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Kth Largest Element in an Array',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: finalKth,
    },
    result: finalKth,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Sliding Window Maximum (LeetCode 239)
 * Monotonic Decreasing Deque maintaining window maximum in O(N) time.
 */
const traceSlidingWindowMaximumAlgorithm = (rawNums, rawK, options = {}) => {
  const problemId = options.problemId || 'sliding-window-maximum';
  const approachId = options.approachId || 'monotonicDeque';
  const approachName = options.approachName || 'Monotonic Deque (Sliding Window)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const nums = Array.isArray(rawNums)
    ? rawNums.map((v) => (typeof v === 'number' ? v : Number(v) || 0))
    : [1, 3, -1, -3, 5, 3, 6, 7];
  const k = typeof rawK === 'number' && rawK > 0 ? rawK : Number(rawK) || 3;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      values: [...nums],
      activeIndex: null,
      matchedIndices: [],
      changedIndices: [],
      pointerLabels: {},
    },
    deque: {
      id: 'deque',
      type: 'queue',
      label: 'Monotonic Decreasing Deque',
      values: [],
    },
    k: {
      id: 'k',
      type: 'variable',
      name: 'k',
      value: k,
      typeLabel: 'number',
    },
    windowRange: {
      id: 'windowRange',
      type: 'variable',
      name: 'windowRange',
      value: null,
      typeLabel: 'range',
    },
    result: {
      id: 'result',
      type: 'array',
      label: 'Sliding Window Maximums',
      values: [],
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Sliding Window Maximum',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      left: null,
      right: null,
      windowRange: null,
      deque: [],
      dequeValues: [],
      result: [],
    },
    nums: [...nums],
    k,
    currentIndex: null,
    currentVal: null,
    left: null,
    right: null,
    windowRange: null,
    deque: [],
    dequeValues: [],
    result: [],
  };

  const deque = []; // stores indices
  const result = [];
  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Step 1: Initialize
  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 1: Initialize Monotonic Deque',
    operation: 'INITIALIZE',
    description: `Initialize empty Monotonic Deque for sliding window of size k = ${k}. Deque will store indices in strictly decreasing order of their values so the front always holds the window maximum.`,
    changed: ['deque', 'result'],
    state: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      left: null,
      right: null,
      windowRange: null,
      deque: [],
      dequeValues: [],
      result: [],
    },
    highlights: { index: null, deque: [], windowRange: null },
    events: [],
  });
  currentStepNumber++;

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    const left = Math.max(0, i - k + 1);
    const right = i;
    const windowRange = [left, right];
    const stepEvents = [];

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'nums' },
      data: { index: i, value: val },
      description: `Inspect nums[${i}] = ${val}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    let expiredIndex = null;
    let expiredVal = null;

    // 1. Remove elements outside current window from front
    if (deque.length > 0 && deque[0] < i - k + 1) {
      expiredIndex = deque.shift();
      expiredVal = nums[expiredIndex];
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.QUEUE_DEQUEUE,
        target: { primitiveId: 'deque' },
        data: { value: expiredVal, index: expiredIndex },
        description: `Index ${expiredIndex} is outside window [${left}, ${right}]. Pop from front.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    // 2. Remove smaller elements from back to maintain monotonic decreasing order
    const eliminated = [];
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= val) {
      const poppedIdx = deque.pop();
      eliminated.push({ index: poppedIdx, val: nums[poppedIdx] });
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.QUEUE_DEQUEUE,
        target: { primitiveId: 'deque' },
        data: { value: nums[poppedIdx], index: poppedIdx },
        description: `nums[${poppedIdx}] = ${nums[poppedIdx]} <= current ${val}. Eliminate from back.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    // 3. Push current index to back of deque
    deque.push(i);
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.QUEUE_ENQUEUE,
      target: { primitiveId: 'deque' },
      data: { value: val, index: i },
      description: `Push index ${i} (value ${val}) to back of deque`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    // 4. Record window maximum once window has reached size k
    const isWindowFull = i >= k - 1;
    let currentWindowMax = null;

    if (isWindowFull) {
      currentWindowMax = nums[deque[0]];
      result.push(currentWindowMax);
      stepEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.RESULT_COLLECT,
        target: { primitiveId: 'result' },
        data: { value: currentWindowMax, result: [...result] },
        description: `Window [${left}, ${right}] full. Front index ${deque[0]} gives max = ${currentWindowMax}. Append to result.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    let description = `Process nums[${i}] = ${val}. Window: [${left}, ${right}].`;
    if (expiredIndex !== null) {
      description += ` Evicted index ${expiredIndex} (out of window).`;
    }
    if (eliminated.length > 0) {
      description += ` Evicted ${eliminated.length} smaller element(s) from back.`;
    }
    if (isWindowFull) {
      description += ` Window max is ${currentWindowMax} (front of deque).`;
    } else {
      description += ` Window warming up (${i + 1}/${k} elements).`;
    }

    const dequeObjects = deque.map((idx) => ({ index: idx, val: nums[idx] }));
    const dequeValues = deque.map((idx) => nums[idx]);

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Window at index ${i} (nums[${i}] = ${val})`,
      operation: isWindowFull ? 'RECORD_MAX' : 'WARMUP_SLIDE',
      description,
      changed: ['currentIndex', 'currentVal', 'windowRange', 'deque', 'result'],
      state: {
        nums: [...nums],
        k,
        currentIndex: i,
        currentVal: val,
        left,
        right,
        windowRange,
        deque: dequeObjects,
        dequeIndices: [...deque],
        dequeValues,
        windowMax: currentWindowMax,
        result: [...result],
        poppedFront: expiredVal,
        poppedBack: eliminated.length > 0 ? eliminated[eliminated.length - 1].val : null,
      },
      highlights: {
        currentIndex: i,
        windowRange,
        dequeFront: deque.length > 0 ? deque[0] : null,
        dequeBack: deque.length > 0 ? deque[deque.length - 1] : null,
        maxVal: currentWindowMax,
      },
      events: stepEvents,
    });
    currentStepNumber++;
  }

  // Final Step: Complete
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'result' },
      data: { value: [...result], result: [...result] },
      description: `Sliding window complete. All maximums: [${result.join(', ')}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Complete — Maxima: [${result.join(', ')}]`,
    operation: 'complete',
    description: `All sliding windows of size k = ${k} evaluated. Resulting maxima array: [${result.join(', ')}].`,
    changed: ['result'],
    state: {
      nums: [...nums],
      k,
      currentIndex: null,
      currentVal: null,
      left: nums.length - k,
      right: nums.length - 1,
      windowRange: [Math.max(0, nums.length - k), nums.length - 1],
      deque: deque.map((idx) => ({ index: idx, val: nums[idx] })),
      dequeIndices: [...deque],
      dequeValues: deque.map((idx) => nums[idx]),
      windowMax: result[result.length - 1],
      result: [...result],
      poppedFront: null,
      poppedBack: null,
    },
    highlights: {
      currentIndex: null,
      windowRange: [Math.max(0, nums.length - k), nums.length - 1],
      result: [...result],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Sliding Window Maximum',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: [...result],
    },
    result: [...result],
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Product of Array Except Self (LeetCode 238)
 * Linear O(N) time with Two-Pass Prefix & Suffix Products (O(1) auxiliary space beyond result).
 */
const traceProductExceptSelfAlgorithm = (rawNums, options = {}) => {
  const problemId = options.problemId || 'product-except-self';
  const approachId = options.approachId || 'prefixSuffix';
  const approachName = options.approachName || 'Two-Pass Prefix and Suffix Products';
  const traceId = `trace-${problemId}-${options.testCaseId || 1}-${Date.now()}`;

  const nums = Array.isArray(rawNums) ? rawNums.map(Number) : [1, 2, 3, 4];
  const n = nums.length;

  const initialPrimitives = {
    nums: {
      id: 'nums',
      type: 'array',
      label: 'Input Array (nums)',
      sourceVar: 'nums',
      defaultValues: [...nums],
      showIndices: true,
    },
    output: {
      id: 'output',
      type: 'array',
      label: 'Answer Array (output)',
      sourceVar: 'output',
      defaultValues: new Array(n).fill(1),
      showIndices: true,
    },
    prefix: {
      id: 'prefix',
      type: 'array',
      label: 'Prefix Products (Left)',
      sourceVar: 'prefix',
      defaultValues: new Array(n).fill(1),
      showIndices: true,
    },
    suffix: {
      id: 'suffix',
      type: 'array',
      label: 'Suffix Products (Right)',
      sourceVar: 'suffix',
      defaultValues: new Array(n).fill(1),
      showIndices: true,
    },
    phase: {
      id: 'phase',
      type: 'variable',
      label: 'Current Phase',
      sourceVar: 'phase',
      value: 'Initialization',
      typeLabel: 'string',
    },
    runningProduct: {
      id: 'runningProduct',
      type: 'variable',
      label: 'Running Product',
      sourceVar: 'runningProduct',
      value: 1,
      typeLabel: 'number',
    },
    result: {
      id: 'result',
      type: 'array',
      label: 'Final Product Array',
      sourceVar: 'result',
      defaultValues: [],
      showIndices: true,
    },
  };

  const output = new Array(n).fill(1);
  const prefix = new Array(n).fill(1);
  const suffix = new Array(n).fill(1);

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Product of Array Except Self',
    primitives: initialPrimitives,
    flatState: {
      nums: [...nums],
      output: [...output],
      prefix: [...prefix],
      suffix: [...suffix],
      phase: 'INITIALIZATION',
      currentIndex: null,
      currentNum: null,
      runningPrefix: 1,
      runningSuffix: 1,
      runningProduct: 1,
      calculation: 'Initialize output array of size N filled with 1s',
      result: [],
    },
    nums: [...nums],
    output: [...output],
    prefix: [...prefix],
    suffix: [...suffix],
    phase: 'INITIALIZATION',
    currentIndex: null,
    currentNum: null,
    runningPrefix: 1,
    runningSuffix: 1,
    runningProduct: 1,
    calculation: 'Initialize output array of size N filled with 1s',
    result: [],
    problemInput: { nums: [...nums] },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Step 1: Initialize
  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: 'Step 1: Initialize Output Array & State',
    operation: 'INITIALIZE',
    description: `Initialize answer array of size ${n} with 1s. We use a 2-pass approach: Pass 1 computes prefix products (elements to left of each i); Pass 2 computes suffix products (elements to right of each i) and multiplies into output.`,
    changed: ['output', 'phase', 'runningProduct'],
    state: {
      nums: [...nums],
      output: [...output],
      prefix: [...prefix],
      suffix: [...suffix],
      phase: 'INITIALIZATION',
      currentIndex: null,
      currentNum: null,
      runningPrefix: 1,
      runningSuffix: 1,
      runningProduct: 1,
      calculation: 'Output array initialized: [' + output.join(', ') + ']',
      result: [],
    },
    highlights: { currentIndex: null, phase: 'INITIALIZATION' },
    events: [],
  });
  currentStepNumber++;

  // -------------------------------------------------------------
  // PASS 1: Left-to-Right Prefix Products (i = 0 to n - 1)
  // -------------------------------------------------------------
  let runningPrefix = 1;
  for (let i = 0; i < n; i++) {
    const val = nums[i];
    prefix[i] = runningPrefix;
    output[i] = runningPrefix;

    const stepEvents = [];

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'nums' },
      data: { index: i, value: val },
      description: `Access nums[${i}] = ${val}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
      target: { primitiveId: 'output' },
      data: { index: i, value: runningPrefix, previousValue: 1 },
      description: `Store prefix product ${runningPrefix} in output[${i}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    const nextPrefix = (runningPrefix * val) === 0 ? 0 : (runningPrefix * val);
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
      target: { primitiveId: 'runningProduct' },
      data: { value: nextPrefix, previousValue: runningPrefix },
      description: `Update running prefix product: ${runningPrefix} * ${val} = ${nextPrefix}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    const leftElementsDesc = i === 0 ? 'No elements to the left' : `Elements to left: [${nums.slice(0, i).join(', ')}]`;
    const calcDesc = `i = ${i} (${val}): ${leftElementsDesc} → Left product = ${runningPrefix}. output[${i}] = ${runningPrefix}. Next prefix = ${runningPrefix} × ${val} = ${nextPrefix}.`;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Pass 1 (Left Product) at i = ${i}`,
      operation: 'PREFIX_UPDATE',
      description: calcDesc,
      changed: ['output', 'prefix', 'runningProduct'],
      state: {
        nums: [...nums],
        output: [...output],
        prefix: [...prefix],
        suffix: [...suffix],
        phase: 'PASS_1_PREFIX',
        currentIndex: i,
        currentNum: val,
        runningPrefix,
        runningSuffix: 1,
        runningProduct: runningPrefix,
        calculation: `output[${i}] = ${runningPrefix} (left product)`,
        result: [...output],
      },
      highlights: {
        currentIndex: i,
        leftRange: i > 0 ? [0, i - 1] : null,
        activeVal: val,
        phase: 'PASS_1_PREFIX',
      },
      events: stepEvents,
    });

    runningPrefix = nextPrefix;
    currentStepNumber++;
  }

  // -------------------------------------------------------------
  // PASS 2: Right-to-Left Suffix Products (i = n - 1 down to 0)
  // -------------------------------------------------------------
  let runningSuffix = 1;
  for (let i = n - 1; i >= 0; i--) {
    const val = nums[i];
    const prevOutput = output[i];
    suffix[i] = runningSuffix;
    const finalVal = (prevOutput * runningSuffix) === 0 ? 0 : prevOutput * runningSuffix;
    output[i] = finalVal;

    const stepEvents = [];

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_ACCESS,
      target: { primitiveId: 'nums' },
      data: { index: i, value: val },
      description: `Access nums[${i}] = ${val}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.ARRAY_UPDATE,
      target: { primitiveId: 'output' },
      data: { index: i, value: finalVal, previousValue: prevOutput },
      description: `Multiply left product (${prevOutput}) by right product (${runningSuffix}): output[${i}] = ${finalVal}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RESULT_COLLECT,
      target: { primitiveId: 'result' },
      data: { index: i, value: finalVal },
      description: `Confirmed final product for index ${i}: ${finalVal}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    const nextSuffix = (runningSuffix * val) === 0 ? 0 : runningSuffix * val;
    stepEvents.push({
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.VARIABLE_UPDATE,
      target: { primitiveId: 'runningProduct' },
      data: { value: nextSuffix, previousValue: runningSuffix },
      description: `Update running suffix product: ${runningSuffix} * ${val} = ${nextSuffix}`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    });

    const rightElementsDesc = i === n - 1 ? 'No elements to the right' : `Elements to right: [${nums.slice(i + 1).join(', ')}]`;
    const calcDesc = `i = ${i} (${val}): ${rightElementsDesc} → Right product = ${runningSuffix}. Combined: output[${i}] = ${prevOutput} (left) × ${runningSuffix} (right) = ${finalVal}. Next suffix = ${runningSuffix} × ${val} = ${nextSuffix}.`;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Pass 2 (Right Product) at i = ${i}`,
      operation: 'SUFFIX_MULTIPLY',
      description: calcDesc,
      changed: ['output', 'suffix', 'runningProduct', 'result'],
      state: {
        nums: [...nums],
        output: [...output],
        prefix: [...prefix],
        suffix: [...suffix],
        phase: 'PASS_2_SUFFIX',
        currentIndex: i,
        currentNum: val,
        runningPrefix: prefix[i],
        runningSuffix,
        runningProduct: runningSuffix,
        calculation: `output[${i}] = ${prevOutput} × ${runningSuffix} = ${finalVal}`,
        result: [...output],
      },
      highlights: {
        currentIndex: i,
        rightRange: i < n - 1 ? [i + 1, n - 1] : null,
        activeVal: val,
        phase: 'PASS_2_SUFFIX',
      },
      events: stepEvents,
    });

    runningSuffix = nextSuffix;
    currentStepNumber++;
  }

  // Final Step: Complete
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'result' },
      data: { value: [...output], result: [...output] },
      description: `Execution complete. All products except self: [${output.join(', ')}]`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Complete — Answer: [${output.join(', ')}]`,
    operation: 'complete',
    description: `Product of Array Except Self computed in O(N) time with O(1) extra space (excluding output array). Final answer: [${output.join(', ')}].`,
    changed: ['result', 'phase'],
    state: {
      nums: [...nums],
      output: [...output],
      prefix: [...prefix],
      suffix: [...suffix],
      phase: 'COMPLETE',
      currentIndex: null,
      currentNum: null,
      runningPrefix,
      runningSuffix,
      runningProduct: null,
      calculation: `Done: [${output.join(', ')}]`,
      result: [...output],
    },
    highlights: {
      currentIndex: null,
      phase: 'COMPLETE',
      result: [...output],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Product of Array Except Self',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      result: [...output],
    },
    result: [...output],
  };

  return normalizeExecutionTrace(rawTrace);
};


/**
 * Genuine Algorithmic Execution Tracer for Minimum Depth of Binary Tree (LeetCode 111)
 * DFS / Recursion tracking current depth, call stack, and shortest path to a leaf node.
 */

/**
 * Word Search (LeetCode 79)
 * 2D Grid Backtracking DFS trace generator
 */
const extractBoardAndWord = (input) => {
  if (!input) return { board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word: 'ABCCED' };
  let board = input.board;
  let word = input.word;
  if (!board && input.input && typeof input.input === 'object') {
    board = input.input.board;
    word = input.input.word;
  }
  if (!board && Array.isArray(input)) {
    board = input[0];
    word = input[1];
  }
  if (typeof board === 'string') {
    try { board = JSON.parse(board); } catch (e) {}
  }
  if (!Array.isArray(board) || board.length === 0 || !Array.isArray(board[0])) {
    board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']];
  }
  if (typeof word !== 'string' || !word) {
    word = 'ABCCED';
  }
  return { board, word };
};

const traceWordSearchAlgorithm = (rawBoard, rawWord, options = {}) => {
  const problemId = options.problemId || 'word-search';
  const approachId = options.approachId || 'backtrackingDfs';
  const approachName = options.approachName || 'Backtracking DFS';
  const traceId = `trace-${problemId}-${options.testCaseId || 1}-${Date.now()}`;

  let board = rawBoard;
  let word = rawWord;
  if (board && typeof board === 'object' && !Array.isArray(board) && board.board) {
    word = board.word;
    board = board.board;
  }
  const extracted = extractBoardAndWord({ board, word });
  board = extracted.board.map(row => [...row]);
  word = extracted.word;

  const rows = board.length;
  const cols = board[0]?.length || 0;

  const initialPrimitives = {
    board: {
      id: 'board',
      type: 'grid',
      label: '2D Board Grid',
      rows,
      cols,
      values: board.map(row => [...row])
    },
    word: {
      id: 'word',
      type: 'variable',
      label: 'Target Word',
      value: word,
      typeLabel: 'string'
    },
    callStack: {
      id: 'callStack',
      type: 'stack',
      label: 'Backtracking Call Stack',
      items: []
    },
    matchedPath: {
      id: 'matchedPath',
      type: 'array',
      label: 'Matched Cell Coordinates',
      values: []
    }
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Word Search',
    primitives: initialPrimitives,
    flatState: {
      board: board.map(row => [...row]),
      word,
      callStack: [],
      matchedPath: [],
      headCell: null,
      found: false,
      result: null
    },
    board: board.map(row => [...row]),
    word,
    callStack: [],
    matchedPath: [],
    headCell: null,
    found: false,
    result: null,
    problemInput: { board: board.map(row => [...row]), word }
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    stepIndex: currentStepNumber - 1,
    label: `Step ${currentStepNumber}: Initialize Board & Target Word`,
    operation: 'INITIALIZE',
    description: `Initialize 2D grid (${rows}x${cols}) and prepare search for target word "${word}".`,
    phase: 'INITIALIZATION',
    activeLine: 1,
    explanation: `Initialize 2D grid (${rows}x${cols}) and search for target word "${word}".`,
    status: 'exploring',
    pathSequence: [],
    callStack: [],
    matchedLength: 0,
    headCell: null,
    visitedCells: [],
    changed: ['board', 'word'],
    state: {
      board: board.map(row => [...row]),
      word,
      pathSequence: [],
      callStack: [],
      matchedLength: 0,
      headCell: null,
      visitedCells: []
    },
    primitives: {
      board: {
        id: 'board',
        type: 'grid',
        label: '2D Board Grid',
        rows,
        cols,
        values: board.map(row => [...row]),
        highlights: {}
      },
      word: {
        id: 'word',
        type: 'variable',
        label: 'Target Word',
        value: word,
        matchedLength: 0
      },
      callStack: {
        id: 'callStack',
        type: 'stack',
        label: 'Backtracking Call Stack',
        values: []
      },
      matchedPath: {
        id: 'matchedPath',
        type: 'array',
        label: 'Matched Cell Coordinates',
        values: []
      }
    },
    highlights: {},
    events: [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'word' },
        data: { value: word },
        description: `Search initialized for word "${word}" in ${rows}x${cols} board`,
        schemaVersion: EVENT_SCHEMA_VERSION
      }
    ]
  });
  currentStepNumber++;

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const currentPath = [];
  let found = false;

  function dfs(r, c, k) {
    if (found) return true;
    if (k === word.length) {
      found = true;
      return true;
    }

    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      return false;
    }

    const cellVal = board[r][c];

    if (visited[r][c] || cellVal !== word[k]) {
      if (k === 0 && cellVal !== word[k]) {
        // Skip silent mismatch on root searches to prevent millions of steps
      } else {
        const explanation = visited[r][c]
          ? `Cell (${r}, ${c}) already visited on current path. Pruning branch.`
          : `Cell (${r}, ${c}) contains '${cellVal}', does not match target character '${word[k]}'. Backtracking.`;

        steps.push({
          id: `step-${currentStepNumber}`,
          stepNumber: currentStepNumber,
          stepIndex: currentStepNumber - 1,
          label: `Step ${currentStepNumber}: Mismatch at (${r}, ${c})`,
          operation: 'BACKTRACK_MISMATCH',
          description: explanation,
          phase: 'MISMATCH',
          activeLine: 7,
          explanation,
          status: 'mismatch',
          pathSequence: currentPath.map(p => ({ ...p })),
          callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
          matchedLength: k,
          headCell: { row: r, col: c, char: cellVal },
          visitedCells: currentPath.map(p => ({ row: p.row, col: p.col })),
          changed: ['callStack'],
          state: {
            board: board.map(row => [...row]),
            word,
            pathSequence: currentPath.map(p => ({ ...p })),
            callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
            matchedLength: k,
            headCell: { row: r, col: c, char: cellVal }
          },
          primitives: {
            board: {
              id: 'board',
              type: 'grid',
              label: '2D Board Grid',
              rows,
              cols,
              values: board.map(row => [...row]),
              highlights: { [`${r}-${c}`]: 'mismatch' }
            },
            word: {
              id: 'word',
              type: 'variable',
              label: 'Target Word',
              value: word,
              matchedLength: k
            },
            callStack: {
              id: 'callStack',
              type: 'stack',
              label: 'Backtracking Call Stack',
              values: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`)
            },
            matchedPath: {
              id: 'matchedPath',
              type: 'array',
              label: 'Matched Cell Coordinates',
              values: currentPath.map(p => `(${p.row},${p.col})`)
            }
          },
          highlights: { [`${r}-${c}`]: 'mismatch' },
          events: [
            {
              id: `evt-${String(eventCounter++).padStart(2, '0')}`,
              step: currentStepNumber,
              type: VISUALIZATION_EVENTS.VARIABLE_SET,
              target: { primitiveId: 'word' },
              data: { value: cellVal, action: 'mismatch', row: r, col: c },
              description: explanation,
              schemaVersion: EVENT_SCHEMA_VERSION
            }
          ]
        });
        currentStepNumber++;
      }
      return false;
    }

    visited[r][c] = true;
    currentPath.push({ row: r, col: c, char: cellVal, charIdx: k });

    const isLastChar = (k === word.length - 1);
    const explanation = isLastChar
      ? `Matched last character '${cellVal}' at (${r}, ${c})! Complete word "${word}" found!`
      : `Matched '${cellVal}' at cell (${r}, ${c}) with word[${k}]. Exploring adjacent cells (up, down, left, right).`;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      stepIndex: currentStepNumber - 1,
      label: `Step ${currentStepNumber}: Matched '${cellVal}' at (${r}, ${c})`,
      operation: isLastChar ? 'FOUND' : 'DFS_VISIT',
      description: explanation,
      phase: isLastChar ? 'FOUND' : 'MATCH',
      activeLine: 12,
      explanation,
      status: isLastChar ? 'found' : 'matched',
      pathSequence: currentPath.map(p => ({ ...p })),
      callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
      matchedLength: k + 1,
      headCell: { row: r, col: c, char: cellVal },
      visitedCells: currentPath.map(p => ({ row: p.row, col: p.col })),
      changed: ['board', 'callStack', 'matchedPath'],
      state: {
        board: board.map(row => [...row]),
        word,
        pathSequence: currentPath.map(p => ({ ...p })),
        callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
        matchedLength: k + 1,
        headCell: { row: r, col: c, char: cellVal }
      },
      primitives: {
        board: {
          id: 'board',
          type: 'grid',
          label: '2D Board Grid',
          rows,
          cols,
          values: board.map(row => [...row]),
          highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {})
        },
        word: {
          id: 'word',
          type: 'variable',
          label: 'Target Word',
          value: word,
          matchedLength: k + 1
        },
        callStack: {
          id: 'callStack',
          type: 'stack',
          label: 'Backtracking Call Stack',
          values: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`)
        },
        matchedPath: {
          id: 'matchedPath',
          type: 'array',
          label: 'Matched Cell Coordinates',
          values: currentPath.map(p => `(${p.row},${p.col})`)
        }
      },
      highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {}),
      events: [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_PUSH,
          target: { primitiveId: 'callStack' },
          data: { value: `dfs(${r}, ${c}, idx=${k})`, row: r, col: c, char: cellVal, charIdx: k },
          description: `Push dfs(${r}, ${c}, idx=${k}) onto call stack`,
          schemaVersion: EVENT_SCHEMA_VERSION
        }
      ]
    });
    currentStepNumber++;

    if (isLastChar) {
      found = true;
      return true;
    }

    const directions = [
      [0, 1, 'right'],
      [1, 0, 'down'],
      [0, -1, 'left'],
      [-1, 0, 'up']
    ];

    for (const [dr, dc] of directions) {
      if (dfs(r + dr, c + dc, k + 1)) {
        return true;
      }
    }

    visited[r][c] = false;
    currentPath.pop();

    const backtrackExpl = `No valid path forward from (${r}, ${c}). Backtracking and unmarking cell.`;

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      stepIndex: currentStepNumber - 1,
      label: `Step ${currentStepNumber}: Backtrack from (${r}, ${c})`,
      operation: 'STACK_POP',
      description: backtrackExpl,
      phase: 'BACKTRACK',
      activeLine: 18,
      explanation: backtrackExpl,
      status: 'backtracking',
      pathSequence: currentPath.map(p => ({ ...p })),
      callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
      matchedLength: currentPath.length,
      headCell: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null,
      visitedCells: currentPath.map(p => ({ row: p.row, col: p.col })),
      changed: ['board', 'callStack', 'matchedPath'],
      state: {
        board: board.map(row => [...row]),
        word,
        pathSequence: currentPath.map(p => ({ ...p })),
        callStack: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`),
        matchedLength: currentPath.length,
        headCell: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null
      },
      primitives: {
        board: {
          id: 'board',
          type: 'grid',
          label: '2D Board Grid',
          rows,
          cols,
          values: board.map(row => [...row]),
          highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {})
        },
        word: {
          id: 'word',
          type: 'variable',
          label: 'Target Word',
          value: word,
          matchedLength: currentPath.length
        },
        callStack: {
          id: 'callStack',
          type: 'stack',
          label: 'Backtracking Call Stack',
          values: currentPath.map(p => `dfs(${p.row}, ${p.col}, idx=${p.charIdx})`)
        },
        matchedPath: {
          id: 'matchedPath',
          type: 'array',
          label: 'Matched Cell Coordinates',
          values: currentPath.map(p => `(${p.row},${p.col})`)
        }
      },
      highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {}),
      events: [
        {
          id: `evt-${String(eventCounter++).padStart(2, '0')}`,
          step: currentStepNumber,
          type: VISUALIZATION_EVENTS.STACK_POP,
          target: { primitiveId: 'callStack' },
          data: { value: `dfs(${r}, ${c})`, poppedValue: `dfs(${r}, ${c})`, row: r, col: c },
          description: `Pop dfs(${r}, ${c}) from call stack (backtracking)`,
          schemaVersion: EVENT_SCHEMA_VERSION
        }
      ]
    });
    currentStepNumber++;

    return false;
  }

  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === word[0]) {
        if (dfs(r, c, 0)) {
          break outer;
        }
      }
    }
  }

  const finalExpl = found
    ? `Target word "${word}" successfully discovered in the grid! Returning true.`
    : `Target word "${word}" could not be formed from adjacent cells in grid. Returning false.`;

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    stepIndex: currentStepNumber - 1,
    label: `Step ${currentStepNumber}: Search Complete`,
    operation: 'COMPLETE',
    description: finalExpl,
    phase: 'COMPLETION',
    activeLine: 24,
    explanation: finalExpl,
    status: found ? 'found' : 'not-found',
    pathSequence: currentPath.map(p => ({ ...p })),
    callStack: [],
    matchedLength: found ? word.length : 0,
    headCell: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null,
    visitedCells: currentPath.map(p => ({ row: p.row, col: p.col })),
    changed: ['result'],
    state: {
      board: board.map(row => [...row]),
      word,
      pathSequence: currentPath.map(p => ({ ...p })),
      callStack: [],
      matchedLength: found ? word.length : 0,
      headCell: currentPath.length > 0 ? currentPath[currentPath.length - 1] : null,
      result: found
    },
    primitives: {
      board: {
        id: 'board',
        type: 'grid',
        label: '2D Board Grid',
        rows,
        cols,
        values: board.map(row => [...row]),
        highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {})
      },
      word: {
        id: 'word',
        type: 'variable',
        label: 'Target Word',
        value: word,
        matchedLength: found ? word.length : 0
      },
      callStack: {
        id: 'callStack',
        type: 'stack',
        label: 'Backtracking Call Stack',
        values: []
      },
      matchedPath: {
        id: 'matchedPath',
        type: 'array',
        label: 'Matched Cell Coordinates',
        values: currentPath.map(p => `(${p.row},${p.col})`)
      }
    },
    highlights: currentPath.reduce((acc, p) => { acc[`${p.row}-${p.col}`] = 'matched'; return acc; }, {}),
    events: [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'word' },
        data: { value: found },
        description: finalExpl,
        schemaVersion: EVENT_SCHEMA_VERSION
      }
    ]
  });

  const rawTrace = {
    traceId,
    problemId,
    title: options.title || 'Word Search',
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    metadata: {
      algorithm: 'Word Search DFS Backtracking',
      approachId,
      approachName,
      language: 'pseudocode'
    },
    initialState,
    steps,
    totalSteps: steps.length,
    finalState: {
      result: found,
      board: board.map(row => [...row]),
      matchedLength: found ? word.length : 0,
      pathSequence: currentPath.map(p => ({ ...p }))
    },
    result: found
  };

  return normalizeExecutionTrace(rawTrace);
};


const traceMinimumDepthAlgorithm = (rawRoot, options = {}) => {
  const problemId = options.problemId || 'minimum-depth-of-binary-tree';
  const approachId = options.approachId || 'dfs';
  const approachName = options.approachName || 'Depth-First Search (DFS)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const inputArr = Array.isArray(rawRoot) ? rawRoot : [3, 9, 20, null, null, 15, 7];
  const { rootId, rootVal, treeMap, nodes, edges } = buildTreeFromLevelOrder(inputArr);

  const initialPrimitives = {
    tree: {
      id: 'tree',
      type: 'tree',
      label: 'Binary Tree',
      root: rootVal,
      rootId,
      treeMap,
      nodes,
      edges,
      currentNode: null,
      visitedNodes: [],
    },
    stack: {
      id: 'stack',
      type: 'stack',
      label: 'DFS Call Stack',
      items: [],
    },
    minDepth: {
      id: 'minDepth',
      type: 'variable',
      name: 'minDepth',
      value: null,
      typeLabel: 'number',
    },
    currentDepth: {
      id: 'currentDepth',
      type: 'variable',
      name: 'currentDepth',
      value: 0,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Minimum Depth of Binary Tree',
    primitives: initialPrimitives,
    flatState: {
      root: rootVal,
      currentNode: null,
      stack: [],
      visited: [],
      minDepth: null,
      currentDepth: 0,
      result: null,
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    root: rootVal,
    currentNode: null,
    stack: [],
    visited: [],
    minDepth: null,
    currentDepth: 0,
    result: null,
    tree: { root: rootVal, rootId, treeMap, nodes, edges },
    problemInput: { root: inputArr },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Edge case: Empty tree (root = null)
  if (rootId === null) {
    const finalEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'minDepth' },
        data: { value: 0 },
        description: 'Tree is empty (root = null). Minimum depth is 0.',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'minDepth' },
        data: { value: 0, result: 0 },
        description: 'Return 0',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty Tree (root = null)',
      operation: 'complete',
      description: 'The binary tree is empty (root = null). Minimum depth is 0.',
      changed: ['minDepth', 'result'],
      state: {
        root: null,
        currentNode: null,
        curr: null,
        stack: [],
        visited: [],
        minDepth: 0,
        currentDepth: 0,
        result: 0,
        tree: { root: null, rootId: null, treeMap: {}, nodes: [], edges: [] },
      },
      highlights: {
        currentNode: null,
        stackNodes: [],
        visitedNodes: [],
      },
      events: finalEvents,
    });

    return normalizeExecutionTrace({
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Minimum Depth of Binary Tree',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { minDepth: 0, result: 0 },
      result: 0,
    });
  }

  // DFS Traversal to find minDepth
  let minDepth = Infinity;
  let bestPath = [];
  const callStack = [];
  const visited = [];

  function dfs(nodeId, depth) {
    if (!nodeId || !treeMap[nodeId]) return;
    const node = treeMap[nodeId];
    const nodeVal = node.val;
    const isLeaf = node.left === null && node.right === null;

    callStack.push({ id: nodeId, val: nodeVal, depth });
    visited.push(nodeVal);
    const stackDisplay = callStack.map((s) => s.val);

    const pushEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.TREE_CURRENT,
        target: { primitiveId: 'tree' },
        data: { nodeId, nodeVal },
        description: `Inspect Node ${nodeVal} at depth ${depth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.STACK_PUSH,
        target: { primitiveId: 'stack' },
        data: { value: nodeVal, items: [...stackDisplay] },
        description: `Push Node ${nodeVal} (depth ${depth}) onto call stack`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'currentDepth' },
        data: { value: depth },
        description: `Current depth = ${depth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    if (isLeaf) {
      if (depth < minDepth) {
        minDepth = depth;
        bestPath = [...stackDisplay];
      }
      pushEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.TREE_VISIT,
        target: { primitiveId: 'tree' },
        data: { nodeId, nodeVal },
        description: `Node ${nodeVal} is a LEAF node! Path depth is ${depth}. Minimum depth updated to ${minDepth}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
      pushEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'minDepth' },
        data: { value: minDepth },
        description: `minDepth = ${minDepth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: isLeaf
        ? `Step ${currentStepNumber}: Leaf Found! Node ${nodeVal} (Depth ${depth}, Min Depth = ${minDepth})`
        : `Step ${currentStepNumber}: Visit Node ${nodeVal} (Depth ${depth})`,
      operation: isLeaf ? 'LEAF_FOUND' : 'STACK_PUSH',
      description: isLeaf
        ? `Reached leaf node ${nodeVal} with no children at depth ${depth}. Updated minDepth = ${minDepth}.`
        : `Visiting Node ${nodeVal} at depth ${depth}. Call stack: [${stackDisplay.join(' -> ')}].`,
      changed: isLeaf ? ['stack', 'currentDepth', 'minDepth', 'currentNode'] : ['stack', 'currentDepth', 'currentNode'],
      state: {
        root: rootVal,
        currentNode: nodeVal,
        curr: nodeVal,
        currentDepth: depth,
        minDepth: minDepth === Infinity ? null : minDepth,
        shortestPath: bestPath.length > 0 ? [...bestPath] : [],
        stack: [...stackDisplay],
        visited: [...visited],
        result: minDepth === Infinity ? null : minDepth,
        tree: { root: rootVal, rootId, treeMap, nodes, edges },
      },
      highlights: {
        currentNode: nodeVal,
        currentNodeId: nodeId,
        stackNodes: [...stackDisplay],
        visitedNodes: [...visited],
      },
      events: pushEvents,
    });
    currentStepNumber++;

    if (node.left !== null) {
      dfs(node.left, depth + 1);
    }

    if (node.right !== null) {
      dfs(node.right, depth + 1);
    }

    callStack.pop();
    const remainingStack = callStack.map((s) => s.val);

    const popEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.STACK_POP,
        target: { primitiveId: 'stack' },
        data: { value: nodeVal, items: [...remainingStack] },
        description: `Backtrack from Node ${nodeVal}. Pop from call stack.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Backtrack from Node ${nodeVal}`,
      operation: 'STACK_POP',
      description: `Finished inspecting subtrees of Node ${nodeVal}. Returning to parent. Remaining stack: [${remainingStack.join(', ')}].`,
      changed: ['stack', 'currentNode'],
      state: {
        root: rootVal,
        currentNode: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        curr: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        currentDepth: callStack.length,
        minDepth: minDepth === Infinity ? null : minDepth,
        shortestPath: bestPath.length > 0 ? [...bestPath] : [],
        stack: [...remainingStack],
        visited: [...visited],
        result: minDepth === Infinity ? null : minDepth,
        tree: { root: rootVal, rootId, treeMap, nodes, edges },
      },
      highlights: {
        currentNode: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        stackNodes: [...remainingStack],
        visitedNodes: [...visited],
      },
      events: popEvents,
    });
    currentStepNumber++;
  }

  dfs(rootId, 1);

  const finalMin = minDepth === Infinity ? 0 : minDepth;
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'minDepth' },
      data: { value: finalMin, result: finalMin },
      description: `Minimum depth calculation complete. Minimum depth = ${finalMin}.`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Complete — Minimum Depth is ${finalMin}`,
    operation: 'complete',
    description: `All paths inspected. The minimum depth from root ${rootVal} to nearest leaf node is ${finalMin}.`,
    changed: ['result', 'minDepth', 'currentNode'],
    state: {
      root: rootVal,
      currentNode: null,
      curr: null,
      currentDepth: 0,
      minDepth: finalMin,
      shortestPath: [...bestPath],
      stack: [],
      visited: [...visited],
      result: finalMin,
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    highlights: {
      currentNode: null,
      stackNodes: [],
      visitedNodes: [...visited],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Minimum Depth of Binary Tree',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      minDepth: finalMin,
      result: finalMin,
    },
    result: finalMin,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Genuine Algorithmic Execution Tracer for Maximum Depth of Binary Tree (LeetCode 104)
 * DFS / Recursion tracking current depth, call stack, and longest path to a leaf node.
 */
const traceMaximumDepthAlgorithm = (rawRoot, options = {}) => {
  const problemId = options.problemId || 'maximum-depth-of-binary-tree';
  const approachId = options.approachId || 'dfs';
  const approachName = options.approachName || 'Depth-First Search (DFS / Recursion)';
  const testCaseId = options.testCaseId || 1;
  const traceId = `exec-${problemId}-tc${testCaseId}-${Date.now()}`;

  const inputArr = Array.isArray(rawRoot) ? rawRoot : [3, 9, 20, null, null, 15, 7];
  const { rootId, rootVal, treeMap, nodes, edges } = buildTreeFromLevelOrder(inputArr);

  const initialPrimitives = {
    tree: {
      id: 'tree',
      type: 'tree',
      label: 'Binary Tree',
      root: rootVal,
      rootId,
      treeMap,
      nodes,
      edges,
      currentNode: null,
      visitedNodes: [],
    },
    stack: {
      id: 'stack',
      type: 'stack',
      label: 'DFS Call Stack',
      items: [],
    },
    maxDepth: {
      id: 'maxDepth',
      type: 'variable',
      name: 'maxDepth',
      value: 0,
      typeLabel: 'number',
    },
    currentDepth: {
      id: 'currentDepth',
      type: 'variable',
      name: 'currentDepth',
      value: 0,
      typeLabel: 'number',
    },
  };

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: options.title || 'Maximum Depth of Binary Tree',
    primitives: initialPrimitives,
    flatState: {
      root: rootVal,
      currentNode: null,
      stack: [],
      visited: [],
      maxDepth: 0,
      currentDepth: 0,
      result: null,
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    root: rootVal,
    currentNode: null,
    stack: [],
    visited: [],
    maxDepth: 0,
    currentDepth: 0,
    result: null,
    tree: { root: rootVal, rootId, treeMap, nodes, edges },
    problemInput: { root: inputArr },
  };

  const steps = [];
  let eventCounter = 1;
  let currentStepNumber = 1;

  // Edge case: Empty tree (root = null)
  if (rootId === null) {
    const finalEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'maxDepth' },
        data: { value: 0 },
        description: 'Tree is empty (root = null). Maximum depth is 0.',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: 1,
        type: VISUALIZATION_EVENTS.RETURN,
        target: { primitiveId: 'maxDepth' },
        data: { value: 0, result: 0 },
        description: 'Return 0',
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: 'step-1',
      stepNumber: 1,
      label: 'Step 1: Empty Tree (root = null)',
      operation: 'complete',
      description: 'The binary tree is empty (root = null). Maximum depth is 0.',
      changed: ['maxDepth', 'result'],
      state: {
        root: null,
        currentNode: null,
        curr: null,
        stack: [],
        visited: [],
        maxDepth: 0,
        currentDepth: 0,
        result: 0,
        tree: { root: null, rootId: null, treeMap: {}, nodes: [], edges: [] },
      },
      highlights: {
        currentNode: null,
        stackNodes: [],
        visitedNodes: [],
      },
      events: finalEvents,
    });

    return normalizeExecutionTrace({
      schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
      traceId,
      problemId,
      title: options.title || 'Maximum Depth of Binary Tree',
      source: TRACE_SOURCES.EXECUTION,
      metadata: {
        language: 'javascript',
        algorithm: approachName,
        approachId,
        sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
      },
      initialState,
      steps,
      finalState: { maxDepth: 0, result: 0, longestPath: [] },
      result: 0,
    });
  }

  // DFS Traversal to find maxDepth
  let maxDepth = 0;
  let bestPath = [];
  const callStack = [];
  const visited = [];

  function dfs(nodeId, depth) {
    if (!nodeId || !treeMap[nodeId]) return;
    const node = treeMap[nodeId];
    const nodeVal = node.val;
    const isLeaf = node.left === null && node.right === null;

    callStack.push({ id: nodeId, val: nodeVal, depth });
    visited.push(nodeVal);
    const stackDisplay = callStack.map((s) => s.val);

    if (depth > maxDepth) {
      maxDepth = depth;
      bestPath = [...stackDisplay];
    }

    const pushEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.TREE_CURRENT,
        target: { primitiveId: 'tree' },
        data: { nodeId, nodeVal },
        description: `Inspect Node ${nodeVal} at depth ${depth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.STACK_PUSH,
        target: { primitiveId: 'stack' },
        data: { value: nodeVal, items: [...stackDisplay] },
        description: `Push Node ${nodeVal} (depth ${depth}) onto call stack`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'currentDepth' },
        data: { value: depth },
        description: `currentDepth = ${depth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    if (isLeaf) {
      pushEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.TREE_VISIT,
        target: { primitiveId: 'tree' },
        data: { nodeId, nodeVal },
        description: `Node ${nodeVal} is a LEAF node at depth ${depth}. Updated maxDepth = ${maxDepth}.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
      pushEvents.push({
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.VARIABLE_SET,
        target: { primitiveId: 'maxDepth' },
        data: { value: maxDepth },
        description: `maxDepth = ${maxDepth}`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      });
    }

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: isLeaf
        ? `Step ${currentStepNumber}: Leaf Node ${nodeVal} (Depth ${depth}, Max Depth = ${maxDepth})`
        : `Step ${currentStepNumber}: Visit Node ${nodeVal} (Depth ${depth})`,
      operation: isLeaf ? 'LEAF_REACHED' : 'STACK_PUSH',
      description: isLeaf
        ? `Reached leaf node ${nodeVal} with no children at depth ${depth}. Current maxDepth is ${maxDepth}.`
        : `Visiting Node ${nodeVal} at depth ${depth}. Call stack: [${stackDisplay.join(' -> ')}].`,
      changed: isLeaf ? ['stack', 'currentDepth', 'maxDepth', 'currentNode'] : ['stack', 'currentDepth', 'currentNode'],
      state: {
        root: rootVal,
        currentNode: nodeVal,
        curr: nodeVal,
        currentDepth: depth,
        maxDepth,
        longestPath: bestPath.length > 0 ? [...bestPath] : [],
        stack: [...stackDisplay],
        visited: [...visited],
        result: maxDepth,
        tree: { root: rootVal, rootId, treeMap, nodes, edges },
      },
      highlights: {
        currentNode: nodeVal,
        currentNodeId: nodeId,
        stackNodes: [...stackDisplay],
        visitedNodes: [...visited],
      },
      events: pushEvents,
    });
    currentStepNumber++;

    if (node.left !== null) {
      dfs(node.left, depth + 1);
    }

    if (node.right !== null) {
      dfs(node.right, depth + 1);
    }

    callStack.pop();
    const remainingStack = callStack.map((s) => s.val);

    const popEvents = [
      {
        id: `evt-${String(eventCounter++).padStart(2, '0')}`,
        step: currentStepNumber,
        type: VISUALIZATION_EVENTS.STACK_POP,
        target: { primitiveId: 'stack' },
        data: { value: nodeVal, items: [...remainingStack] },
        description: `Backtrack from Node ${nodeVal}. Pop from call stack.`,
        schemaVersion: EVENT_SCHEMA_VERSION,
      },
    ];

    steps.push({
      id: `step-${currentStepNumber}`,
      stepNumber: currentStepNumber,
      label: `Step ${currentStepNumber}: Backtrack from Node ${nodeVal}`,
      operation: 'STACK_POP',
      description: `Finished inspecting subtrees of Node ${nodeVal}. Returning to parent. Remaining stack: [${remainingStack.join(', ')}].`,
      changed: ['stack', 'currentNode'],
      state: {
        root: rootVal,
        currentNode: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        curr: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        currentDepth: callStack.length,
        maxDepth,
        longestPath: bestPath.length > 0 ? [...bestPath] : [],
        stack: [...remainingStack],
        visited: [...visited],
        result: maxDepth,
        tree: { root: rootVal, rootId, treeMap, nodes, edges },
      },
      highlights: {
        currentNode: remainingStack.length > 0 ? remainingStack[remainingStack.length - 1] : null,
        stackNodes: [...remainingStack],
        visitedNodes: [...visited],
      },
      events: popEvents,
    });
    currentStepNumber++;
  }

  dfs(rootId, 1);

  const finalMax = maxDepth;
  const finalEvents = [
    {
      id: `evt-${String(eventCounter++).padStart(2, '0')}`,
      step: currentStepNumber,
      type: VISUALIZATION_EVENTS.RETURN,
      target: { primitiveId: 'maxDepth' },
      data: { value: finalMax, result: finalMax },
      description: `Maximum depth calculation complete. Maximum depth = ${finalMax}.`,
      schemaVersion: EVENT_SCHEMA_VERSION,
    },
  ];

  steps.push({
    id: `step-${currentStepNumber}`,
    stepNumber: currentStepNumber,
    label: `Step ${currentStepNumber}: Complete — Maximum Depth is ${finalMax}`,
    operation: 'complete',
    description: `All paths inspected. The maximum depth from root ${rootVal} to farthest leaf node is ${finalMax}. Longest path: [${bestPath.join(' -> ')}].`,
    changed: ['result', 'maxDepth', 'currentNode'],
    state: {
      root: rootVal,
      currentNode: null,
      curr: null,
      currentDepth: 0,
      maxDepth: finalMax,
      longestPath: [...bestPath],
      stack: [],
      visited: [...visited],
      result: finalMax,
      tree: { root: rootVal, rootId, treeMap, nodes, edges },
    },
    highlights: {
      currentNode: null,
      stackNodes: [],
      visitedNodes: [...visited],
    },
    events: finalEvents,
  });

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: options.title || 'Maximum Depth of Binary Tree',
    source: TRACE_SOURCES.EXECUTION,
    metadata: {
      language: 'javascript',
      algorithm: approachName,
      approachId,
      sourceStage: 'Stage 09 Visualization (Genuine Algorithmic Tracer)',
    },
    initialState,
    steps,
    finalState: {
      maxDepth: finalMax,
      result: finalMax,
      longestPath: [...bestPath],
    },
    result: finalMax,
  };

  return normalizeExecutionTrace(rawTrace);
};

/**
 * Authoritative Data-Access Method for Stage 09 Visualization
 * Retrieves existing ProblemDryRun and deterministically derives normalized ExecutionTrace.
 * If autoGenerate is true and trace is missing, automatically generates via Gemini AI.
 */
const getVisualizationTrace = async (problemIdOrSlug, userOrId, approachIdQuery, testCaseIdQuery, autoGenerate = false) => {
  // 1. Resolve Problem and enforce published/ownership access checks
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userOrId);

  const userId = userOrId?._id ? userOrId._id : userOrId;

  // 2. Resolve Approach and TestCase
  const { approachId, approachName } = await validateApproach(problem, approachIdQuery, userId);
  const { testCaseId, selectedTestCase } = resolveTestCase(problem, testCaseIdQuery);

  // 3. Dynamic Execution Strategy Router Dispatch (Path A: Specific Strategy -> Path B: Reusable Family Engine)
  const strategyRegistry = require('./executionStrategyRegistry');
  const routerMatch = strategyRegistry.resolveStrategyRouter(problem, {
    approachId,
    approachName,
    algorithmFamily: problem.algorithmFamily || problem.category,
  });

  if (routerMatch) {
    const execResult = strategyRegistry.executeWithTrace(
      problem,
      {
        testCase: selectedTestCase,
        problem,
      },
      {
        approachId,
        approachName,
        testCaseId,
        algorithmFamily: problem.algorithmFamily || problem.category,
      }
    );

    if (execResult.isSupported && execResult.trace) {
      return {
        trace: execResult.trace,
        approachId: execResult.approachId || approachId,
        approachName: execResult.approachName || approachName,
        testCaseId,
        isFromDryRun: false,
        source: 'execution',
        resolutionTier: execResult.resolutionTier || routerMatch.tier,
        isSupported: true,
        verificationStatus: execResult.verificationStatus || 'TRUSTED_UNCHECKED',
        resultVerified: Boolean(execResult.resultVerified),
        supportState: execResult.supportState,
        isPlaybackUnlocked: execResult.isPlaybackUnlocked,
      };
    } else {
      throw new AppError(execResult.message || `Execution strategy failed for "${problem.problemId || problemIdOrSlug}".`, 400);
    }
  }

  // 4. Query Authoritative Dry Run Source from MongoDB using .lean() for zero-overhead performance
  let existingDryRun = null;

  if (userId) {
    // Check for user-owned trace first
    existingDryRun = await ProblemDryRun.findOne({
      problemId: problem._id,
      approachId,
      testCaseId,
      userId,
    }).lean();
  }

  // Fallback to public shared traces ONLY.
  // Anonymous requests or other users can only access public shared traces, never private user-owned traces!
  if (!existingDryRun) {
    const publicSharedConditions = [{ isPublic: true }];
    if (problem.createdBy) {
      publicSharedConditions.push({ userId: problem.createdBy });
    }

    existingDryRun = await ProblemDryRun.findOne({
      problemId: problem._id,
      approachId,
      testCaseId,
      $or: publicSharedConditions,
    }).lean();
  }

  // 4. Handle Missing Source Record or Failed Generation Status
  if (
    !existingDryRun ||
    existingDryRun.generationStatus === 'failed' ||
    !Array.isArray(existingDryRun.steps) ||
    existingDryRun.steps.length === 0
  ) {
    if (autoGenerate) {
      return await generateVisualizationTrace(problemIdOrSlug, userOrId, approachIdQuery, testCaseIdQuery);
    }

    const dryRunError = new AppError(
      `Execution trace data not found for approach "${approachName}" (testCase: ${testCaseId}). You can generate it directly with AI.`,
      404,
      [{ code: 'DRY_RUN_REQUIRED', stage: 'dryrun', stageNo: 8 }]
    );
    dryRunError.code = 'DRY_RUN_REQUIRED';
    throw dryRunError;
  }

  // 5. Transform Dry Run Document into Phase 12 Normalized ExecutionTrace via Master Builder
  const trace = buildExecutionTrace(existingDryRun, {
    problem,
    approachId,
    approachName,
  });

  // Independent verification for dry run traces against authoritative test case expected output
  const expectedOutput = selectedTestCase?.outputStructured !== undefined
    ? selectedTestCase.outputStructured
    : selectedTestCase?.outputRaw !== undefined
      ? selectedTestCase.outputRaw
      : problem?.outputData;

  let verificationStatus = 'AI_ASSISTED_UNVERIFIED';
  let resultVerified = false;

  if (expectedOutput !== undefined && expectedOutput !== null && expectedOutput !== '') {
    if (areResultsEquivalent(trace.result, expectedOutput)) {
      verificationStatus = 'VERIFIED';
      resultVerified = true;
    }
  }

  return {
    trace,
    approachId,
    approachName,
    testCaseId,
    isFromDryRun: true,
    isSupported: true,
    verificationStatus,
    resultVerified,
  };
};

module.exports = {
  AppError,
  EXECUTION_TRACE_SCHEMA_VERSION,
  EVENT_SCHEMA_VERSION,
  MAX_TRACE_STEPS,
  MAX_STEP_EVENTS,
  MAX_TOTAL_EVENTS,
  VISUALIZATION_EVENTS,
  TRACE_SOURCES,
  BENCHMARK_MAPPINGS,
  getDryRunMappingForProblem,
  validateVisualizationEvent,
  validateExecutionTrace,
  normalizeExecutionTrace,
  areResultsEquivalent,
  deepFreeze,
  adaptDryRunToExecutionTrace,
  buildExecutionTrace,
  resolveProblemAndCheckAccess,
  validateApproach,
  resolveTestCase,
  traceTwoSumAlgorithm,
  traceLongestSubstringAlgorithm,
  traceTopKFrequentBucketSort,
  traceLongestConsecutiveAlgorithm,
  traceValidParenthesesAlgorithm,
  traceReverseLinkedListAlgorithm,
  traceBinaryTreeInorderAlgorithm,
  traceKthLargestAlgorithm,
  traceSlidingWindowMaximumAlgorithm,
  traceProductExceptSelfAlgorithm,
  traceWordSearchAlgorithm,
  extractBoardAndWord,
  traceMinimumDepthAlgorithm,
  traceMaximumDepthAlgorithm,
  extractNumsAndK,
  extractNumsAndTarget,
  extractStringInput,
  extractNumsArray,
  extractLinkedListInput,
  extractTreeInput,
  getVisualizationTrace,
  generateVisualizationTrace,
  SUPPORT_STATES,
  EXECUTION_AVAILABILITY,
  TRACE_VALIDITY,
  RESULT_VERIFICATION,
  validateTraceInvariants,
  determineSupportStateAndDimensions,
  inputNormalizer,
  normalizeTestCaseInput: inputNormalizer.normalizeTestCaseInput,
  parseRawInputString: inputNormalizer.parseRawInputString,
  parseLiteralValue: inputNormalizer.parseLiteralValue,
};