/**
 * AlgoVision — Stage 09 Generic Visualization Plan Service
 *
 * Responsibilities:
 * 1. Problem Definition Resolver: Canonical metadata normalization.
 * 2. Visualization Plan Schema & Semantic Validator.
 * 3. Gemini AI Plan Generation Service (declarative plan only, NEVER executes algorithm).
 * 4. High-performance plan caching and controlled fallbacks.
 */

const env = require('../config/env');
const { resolveProblemAndCheckAccess } = require('./problemVisualization.service');
const { hasStrategy, getStrategy, hasFamilyEngine, getFamilyEngine } = require('./executionStrategyRegistry');

const PLAN_SCHEMA_VERSION = 1;
const MAX_PLAN_SIZE_BYTES = 16384; // 16KB max payload
const MAX_NESTING_DEPTH = 4;

const SUPPORTED_ALGORITHM_FAMILIES = Object.freeze([
  'array-hashmap',
  'sliding-window',
  'two-pointers',
  'bucket-sort',
  'stack',
  'queue',
  'matrix',
  'linked-list',
  'binary-tree',
  'bst',
  'heap',
  'graph',
  'grid-traversal',
  'dynamic-programming',
  'dp',
  'generic',
]);

const SUPPORTED_LAYOUTS = Object.freeze([
  'array-with-map',
  'sliding-window',
  'bucket-sort',
  'linear-array',
  'grid-traversal',
  'stack-queue',
  'tree-traversal',
  'composite-scene',
  'linked-list',
  'pointer-chain',
  'generic-d3',
]);

const SUPPORTED_STRUCTURE_TYPES = Object.freeze([
  'array',
  'hashmap',
  'string',
  'sliding-window',
  'grid',
  'matrix',
  'tree',
  'linked-list',
  'stack',
  'queue',
  'heap',
  'bucket-sort',
  'variable',
  'result',
]);

// In-memory cache for validated plans: key -> { plan, timestamp }
const PLAN_CACHE = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// -------------------------------------------------------------
// CANONICAL DEFAULT PLANS FOR BENCHMARK PROBLEMS
// -------------------------------------------------------------
const DEFAULT_PLANS = {
  'two-sum': {
    schemaVersion: 1,
    problemId: 'two-sum',
    algorithmFamily: 'array-hashmap',
    layout: 'array-with-map',
    structures: [
      {
        id: 'nums',
        type: 'array',
        source: 'input.nums',
        label: 'Input Array (nums)',
        options: { showIndices: true },
      },
      {
        id: 'hashMap',
        type: 'hashmap',
        source: 'state.hashMap',
        label: 'Seen Values (Value → Index)',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'currentIndex', source: 'state.currentIndex' },
      { visualProperty: 'currentNum', source: 'state.currentNum' },
      { visualProperty: 'complement', source: 'state.complement' },
      { visualProperty: 'matchedPair', source: 'state.result' },
    ],
    explanation: 'Iterate through the array, calculate each number\'s complement, and check if it already exists in the hash map.',
  },

  'longest-substring-without-repeating-characters': {
    schemaVersion: 1,
    problemId: 'longest-substring-without-repeating-characters',
    algorithmFamily: 'sliding-window',
    layout: 'sliding-window',
    structures: [
      {
        id: 's',
        type: 'string',
        source: 'input.s',
        label: 'Character Stream (s)',
        options: { showIndices: true },
      },
      {
        id: 'window',
        type: 'sliding-window',
        source: 'state.windowString',
        label: 'Active Sliding Window',
        options: { trackOptimal: true },
      },
      {
        id: 'windowChars',
        type: 'hashmap',
        source: 'state.windowChars',
        label: 'Window Character Set',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'left', source: 'state.left' },
      { visualProperty: 'right', source: 'state.right' },
      { visualProperty: 'currentLength', source: 'state.currentLength' },
      { visualProperty: 'maxLength', source: 'state.maxLength' },
      { visualProperty: 'bestWindow', source: 'state.bestWindow' },
    ],
    explanation: 'Expand the right pointer to include characters, and shrink from the left whenever a duplicate is found while recording the maximum length window.',
  },

  'top-k-frequent-elements': {
    schemaVersion: 1,
    problemId: 'top-k-frequent-elements',
    algorithmFamily: 'bucket-sort',
    layout: 'bucket-sort',
    structures: [
      {
        id: 'nums',
        type: 'array',
        source: 'input.nums',
        label: 'Input Elements (nums)',
        options: { showIndices: true },
      },
      {
        id: 'frequencyMap',
        type: 'hashmap',
        source: 'state.frequencyMap',
        label: 'Frequency Counts (Num → Count)',
        options: {},
      },
      {
        id: 'buckets',
        type: 'bucket-sort',
        source: 'state.buckets',
        label: 'Frequency Buckets (1..N)',
        options: {},
      },
      {
        id: 'topKResult',
        type: 'result',
        source: 'state.topKResult',
        label: 'Top K Elements Collected',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'k', source: 'input.k' },
      { visualProperty: 'currentIndex', source: 'state.currentIndex' },
      { visualProperty: 'currentFrequency', source: 'state.currentFrequency' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Count frequencies of each number, place numbers into frequency buckets, and scan buckets in descending order to collect the top k frequent numbers.',
  },

  'longest-consecutive-sequence': {
    schemaVersion: 1,
    problemId: 'longest-consecutive-sequence',
    algorithmFamily: 'hash-set',
    layout: 'array-with-map',
    structures: [
      {
        id: 'nums',
        type: 'array',
        source: 'input.nums',
        label: 'Input Array (nums)',
        options: { showIndices: true },
      },
      {
        id: 'numSet',
        type: 'hashmap',
        source: 'state.numSet',
        label: 'Hash Set (Seen Numbers)',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'currentIndex', source: 'state.currentIndex' },
      { visualProperty: 'currentNum', source: 'state.currentNum' },
      { visualProperty: 'currentStreak', source: 'state.currentStreak' },
      { visualProperty: 'longestStreak', source: 'state.longestStreak' },
      { visualProperty: 'sequence', source: 'state.sequence' },
    ],
    explanation: 'Insert all numbers into a Hash Set. For each number that forms the start of a streak, count consecutive elements in O(1) time.',
  },

  'valid-parentheses': {
    schemaVersion: 1,
    problemId: 'valid-parentheses',
    algorithmFamily: 'stack',
    layout: 'stack-queue',
    structures: [
      {
        id: 's',
        type: 'string',
        source: 'input.s',
        label: 'Bracket Stream (s)',
        options: { showIndices: true },
      },
      {
        id: 'stack',
        type: 'stack',
        source: 'state.stack',
        label: 'Character Stack (LIFO)',
        options: {},
      },
      {
        id: 'char',
        type: 'variable',
        source: 'state.currentChar',
        label: 'Active Bracket',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 's', source: 'input.s' },
      { visualProperty: 'currentIndex', source: 'state.currentIndex' },
      { visualProperty: 'currentChar', source: 'state.currentChar' },
      { visualProperty: 'stack', source: 'state.stack' },
      { visualProperty: 'isValid', source: 'state.isValid' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Push opening brackets onto the stack. For each closing bracket, check if it matches the top of the stack and pop; if it mismatches or the stack is empty, return false.',
  },

  'reverse-linked-list': {
    schemaVersion: 1,
    problemId: 'reverse-linked-list',
    algorithmFamily: 'linked-list',
    layout: 'linked-list',
    structures: [
      {
        id: 'list',
        type: 'linked-list',
        source: 'state.nodes',
        label: 'Singly Linked List',
        options: {},
      },
      {
        id: 'prev',
        type: 'variable',
        source: 'state.prev',
        label: 'PREV Pointer',
        options: {},
      },
      {
        id: 'curr',
        type: 'variable',
        source: 'state.curr',
        label: 'CURR Pointer',
        options: {},
      },
      {
        id: 'next',
        type: 'variable',
        source: 'state.next',
        label: 'NEXT Pointer',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'nodes', source: 'state.nodes' },
      { visualProperty: 'prev', source: 'state.prev' },
      { visualProperty: 'curr', source: 'state.curr' },
      { visualProperty: 'next', source: 'state.next' },
      { visualProperty: 'head', source: 'state.head' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Iterate through the list, saving curr.next, redirecting curr.next to prev, and shifting prev and curr forward.',
  },

  'binary-tree-inorder-traversal': {
    schemaVersion: 1,
    problemId: 'binary-tree-inorder-traversal',
    algorithmFamily: 'binary-tree',
    layout: 'tree-traversal',
    structures: [
      {
        id: 'tree',
        type: 'tree',
        source: 'state.root',
        label: 'Binary Tree Hierarchy',
        options: {},
      },
      {
        id: 'stack',
        type: 'stack',
        source: 'state.stack',
        label: 'DFS Call Stack',
        options: {},
      },
      {
        id: 'result',
        type: 'result',
        source: 'state.result',
        label: 'Inorder Sequence Output',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'root', source: 'state.root' },
      { visualProperty: 'currentNode', source: 'state.currentNode' },
      { visualProperty: 'stack', source: 'state.stack' },
      { visualProperty: 'visited', source: 'state.visited' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Traverse the binary tree using depth-first search in Left -> Root -> Right order using a call stack.',
  },

  'minimum-depth-of-binary-tree': {
    schemaVersion: 1,
    problemId: 'minimum-depth-of-binary-tree',
    algorithmFamily: 'binary-tree',
    layout: 'tree-traversal',
    structures: [
      {
        id: 'tree',
        type: 'tree',
        source: 'state.root',
        label: 'Binary Tree Hierarchy',
        options: {},
      },
      {
        id: 'stack',
        type: 'stack',
        source: 'state.stack',
        label: 'DFS Call Stack',
        options: {},
      },
      {
        id: 'minDepth',
        type: 'variable',
        source: 'state.minDepth',
        label: 'Minimum Depth',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'root', source: 'state.root' },
      { visualProperty: 'currentNode', source: 'state.currentNode' },
      { visualProperty: 'currentDepth', source: 'state.currentDepth' },
      { visualProperty: 'minDepth', source: 'state.minDepth' },
      { visualProperty: 'stack', source: 'state.stack' },
      { visualProperty: 'visited', source: 'state.visited' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Find the shortest path from the root node down to the nearest leaf node using depth-first search.',
  },

  'maximum-depth-of-binary-tree': {
    schemaVersion: 1,
    problemId: 'maximum-depth-of-binary-tree',
    algorithmFamily: 'binary-tree',
    layout: 'tree-traversal',
    structures: [
      {
        id: 'tree',
        type: 'tree',
        source: 'state.root',
        label: 'Binary Tree Hierarchy',
        options: {},
      },
      {
        id: 'stack',
        type: 'stack',
        source: 'state.stack',
        label: 'DFS Call Stack',
        options: {},
      },
      {
        id: 'maxDepth',
        type: 'variable',
        source: 'state.maxDepth',
        label: 'Maximum Depth',
        options: {},
      },
    ],
    stateBindings: [
      { visualProperty: 'root', source: 'state.root' },
      { visualProperty: 'currentNode', source: 'state.currentNode' },
      { visualProperty: 'currentDepth', source: 'state.currentDepth' },
      { visualProperty: 'maxDepth', source: 'state.maxDepth' },
      { visualProperty: 'stack', source: 'state.stack' },
      { visualProperty: 'visited', source: 'state.visited' },
      { visualProperty: 'result', source: 'state.result' },
    ],
    explanation: 'Find the maximum depth (longest path from root down to the farthest leaf node) using depth-first search recursion.',
  },
};

// Aliases for benchmark problems
DEFAULT_PLANS['top-k-frequent'] = DEFAULT_PLANS['top-k-frequent-elements'];
DEFAULT_PLANS['347'] = DEFAULT_PLANS['top-k-frequent-elements'];
DEFAULT_PLANS['longest-substring-no-repeat'] = DEFAULT_PLANS['longest-substring-without-repeating-characters'];
DEFAULT_PLANS['longest-substring'] = DEFAULT_PLANS['longest-substring-without-repeating-characters'];
DEFAULT_PLANS['3'] = DEFAULT_PLANS['longest-substring-without-repeating-characters'];
DEFAULT_PLANS['1'] = DEFAULT_PLANS['two-sum'];
DEFAULT_PLANS['128'] = DEFAULT_PLANS['longest-consecutive-sequence'];
DEFAULT_PLANS['longest-consecutive'] = DEFAULT_PLANS['longest-consecutive-sequence'];
DEFAULT_PLANS['20'] = DEFAULT_PLANS['valid-parentheses'];
DEFAULT_PLANS['reverse-list'] = DEFAULT_PLANS['reverse-linked-list'];
DEFAULT_PLANS['206'] = DEFAULT_PLANS['reverse-linked-list'];
DEFAULT_PLANS['inorder-traversal'] = DEFAULT_PLANS['binary-tree-inorder-traversal'];
DEFAULT_PLANS['94'] = DEFAULT_PLANS['binary-tree-inorder-traversal'];
DEFAULT_PLANS['min-depth'] = DEFAULT_PLANS['minimum-depth-of-binary-tree'];
DEFAULT_PLANS['111'] = DEFAULT_PLANS['minimum-depth-of-binary-tree'];
DEFAULT_PLANS['max-depth'] = DEFAULT_PLANS['maximum-depth-of-binary-tree'];
DEFAULT_PLANS['104'] = DEFAULT_PLANS['maximum-depth-of-binary-tree'];

/**
 * Calculates maximum nesting depth of an object.
 */
function getObjectDepth(obj, currentDepth = 1) {
  if (obj === null || typeof obj !== 'object') return currentDepth;
  let max = currentDepth;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const depth = getObjectDepth(obj[key], currentDepth + 1);
      if (depth > max) max = depth;
    }
  }
  return max;
}

/**
 * Semantic and Schema Validator for Visualization Plans.
 * Rejects unsupported structure types, layouts, unknown paths, duplicate IDs, oversized inputs, and executable code.
 *
 * @param {Object} plan - Candidate visualization plan
 * @param {string} [expectedProblemId] - Expected canonical problem ID to enforce match
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateVisualizationPlan(plan, expectedProblemId = null) {
  const errors = [];

  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    return { isValid: false, errors: ['Visualization plan must be a non-null JSON object.'] };
  }

  // 1. Size & Depth Constraints
  let rawJson = '';
  try {
    rawJson = JSON.stringify(plan);
  } catch {
    return { isValid: false, errors: ['Plan could not be serialized to JSON.'] };
  }

  if (rawJson.length > MAX_PLAN_SIZE_BYTES) {
    errors.push(`Plan payload size (${rawJson.length} bytes) exceeds limit of ${MAX_PLAN_SIZE_BYTES} bytes.`);
  }

  const depth = getObjectDepth(plan);
  if (depth > MAX_NESTING_DEPTH) {
    errors.push(`Plan object depth (${depth}) exceeds maximum allowed depth of ${MAX_NESTING_DEPTH}.`);
  }

  // 2. Security Check: No script, dynamic execution or prototype pollution
  const forbiddenPatterns = [
    /<script/i,
    /javascript:/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /__proto__/i,
    /constructor\s*\[/i,
    /prototype/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(rawJson)) {
      errors.push('Plan contains forbidden executable or malicious patterns.');
      break;
    }
  }

  // 3. Schema Version
  if (plan.schemaVersion !== PLAN_SCHEMA_VERSION) {
    errors.push(`Invalid schemaVersion (${plan.schemaVersion}). Supported version is ${PLAN_SCHEMA_VERSION}.`);
  }

  // 4. Problem ID Match
  if (!plan.problemId || typeof plan.problemId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(plan.problemId)) {
    errors.push('ProblemId must be a valid alphanumeric string with hyphens or underscores.');
  } else if (expectedProblemId) {
    const normExpected = String(expectedProblemId).trim().toLowerCase();
    const normActual = String(plan.problemId).trim().toLowerCase();
    // Allow canonical aliases via executionStrategyRegistry or hyphen-stripped match
    const stratExpected = getStrategy(normExpected);
    const stratActual = getStrategy(normActual);
    const isAliasMatch =
      (stratExpected && stratActual && stratExpected === stratActual) ||
      (stratExpected?.metadata?.canonicalId === normActual) ||
      (stratActual?.metadata?.canonicalId === normExpected) ||
      (normExpected.replace(/-/g, '') === normActual.replace(/-/g, ''));

    if (normActual !== normExpected && !isAliasMatch) {
      errors.push(`Plan problemId "${plan.problemId}" does not match requested problem "${expectedProblemId}".`);
    }
  }

  // 5. Algorithm Family
  if (!SUPPORTED_ALGORITHM_FAMILIES.includes(plan.algorithmFamily)) {
    errors.push(
      `Unsupported algorithmFamily "${plan.algorithmFamily}". Must be one of: ${SUPPORTED_ALGORITHM_FAMILIES.join(', ')}`
    );
  }

  // 6. Layout
  if (!SUPPORTED_LAYOUTS.includes(plan.layout)) {
    errors.push(`Unsupported layout "${plan.layout}". Must be one of: ${SUPPORTED_LAYOUTS.join(', ')}`);
  }

  // 7. Visual Structures
  if (!Array.isArray(plan.structures) || plan.structures.length === 0) {
    errors.push('Plan must define at least one visual structure in "structures".');
  } else if (plan.structures.length > 10) {
    errors.push(`Plan defines ${plan.structures.length} structures; maximum allowed is 10.`);
  } else {
    const seenIds = new Set();
    const validPathRegex = /^(input|state)(\.[a-zA-Z0-9_]+)+$/;

    plan.structures.forEach((st, idx) => {
      if (!st || typeof st !== 'object') {
        errors.push(`Structure at index ${idx} must be an object.`);
        return;
      }

      // Structure ID
      if (!st.id || typeof st.id !== 'string' || !/^[a-zA-Z0-9_-]{1,50}$/.test(st.id)) {
        errors.push(`Structure at index ${idx} has invalid ID "${st.id}". Must be alphanumeric (1-50 chars).`);
      } else if (seenIds.has(st.id)) {
        errors.push(`Duplicate structure ID "${st.id}" detected in plan.`);
      } else {
        seenIds.add(st.id);
      }

      // Structure Type
      if (!SUPPORTED_STRUCTURE_TYPES.includes(st.type)) {
        errors.push(
          `Structure "${st.id}" has unsupported type "${st.type}". Must be one of: ${SUPPORTED_STRUCTURE_TYPES.join(', ')}`
        );
      }

      // Source Path
      if (!st.source || typeof st.source !== 'string' || !validPathRegex.test(st.source)) {
        errors.push(
          `Structure "${st.id}" has invalid source path "${st.source}". Path must start with "input." or "state." and contain only valid property segments.`
        );
      }

      // Label length
      if (st.label && (typeof st.label !== 'string' || st.label.length > 100)) {
        errors.push(`Structure "${st.id}" label must be a string up to 100 characters.`);
      }

      // Options
      if (st.options !== undefined && (typeof st.options !== 'object' || Array.isArray(st.options))) {
        errors.push(`Structure "${st.id}" options must be a plain object.`);
      }
    });
  }

  // 8. State Bindings (Optional)
  if (plan.stateBindings !== undefined) {
    if (!Array.isArray(plan.stateBindings)) {
      errors.push('"stateBindings" must be an array.');
    } else if (plan.stateBindings.length > 20) {
      errors.push(`"stateBindings" contains ${plan.stateBindings.length} entries; maximum allowed is 20.`);
    } else {
      const validPathRegex = /^(input|state)(\.[a-zA-Z0-9_]+)+$/;
      plan.stateBindings.forEach((binding, idx) => {
        if (!binding || typeof binding !== 'object') {
          errors.push(`Binding at index ${idx} must be an object.`);
          return;
        }
        if (
          !binding.visualProperty ||
          typeof binding.visualProperty !== 'string' ||
          !/^[a-zA-Z0-9_-]{1,50}$/.test(binding.visualProperty)
        ) {
          errors.push(`Binding at index ${idx} has invalid visualProperty.`);
        }
        if (!binding.source || typeof binding.source !== 'string' || !validPathRegex.test(binding.source)) {
          errors.push(`Binding at index ${idx} has invalid source path "${binding.source}".`);
        }
      });
    }
  }

  // 9. Explanation (Optional)
  if (plan.explanation !== undefined && (typeof plan.explanation !== 'string' || plan.explanation.length > 500)) {
    errors.push('Plan explanation must be a string of at most 500 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalizes Problem Definition into Canonical Interface.
 *
 * @param {string} problemIdOrSlug - Problem ID or slug
 * @param {Object} [user] - Requesting user
 * @returns {Promise<Object>} Normalized Problem Definition
 */
async function resolveProblemDefinition(problemIdOrSlug, user = null) {
  let problem = null;
  try {
    problem = await resolveProblemAndCheckAccess(problemIdOrSlug, user);
  } catch {
    problem = {
      problemId: String(problemIdOrSlug || '').trim().toLowerCase(),
      title: problemIdOrSlug || 'DSA Problem',
      category: 'Algorithms',
      difficulty: 'Medium',
      description: `Problem definition for ${problemIdOrSlug}`,
      constraints: [],
      testCases: [],
      isPublished: true,
    };
  }

  const normalizedSlug = (problem.problemId || problemIdOrSlug || '').toString().toLowerCase().trim();
  const candidateFamily = problem.algorithmFamily || problem.category;

  const isExecutionSupported = hasStrategy(normalizedSlug) || hasFamilyEngine(candidateFamily);
  const strategyInfo = getStrategy(normalizedSlug) || getFamilyEngine(candidateFamily);

  return {
    problemId: normalizedSlug,
    title: problem.title || 'DSA Problem',
    category: problem.category || 'Algorithms',
    difficulty: problem.difficulty || 'Medium',
    objective: problem.objective || problem.description || '',
    description: problem.description || '',
    constraints: Array.isArray(problem.constraints) ? problem.constraints : [],
    inputSchema: problem.inputData || {},
    outputSchema: problem.outputData || {},
    testCases: (problem.testCases || []).map((tc, idx) => ({
      id: tc.id || idx + 1,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
    })),
    supportedAlgorithmFamilies: SUPPORTED_ALGORITHM_FAMILIES,
    supportedLayouts: SUPPORTED_LAYOUTS,
    supportedStructures: SUPPORTED_STRUCTURE_TYPES,
    isExecutionSupported,
    registeredStrategy: strategyInfo
      ? {
          approachId: strategyInfo.metadata.approachId,
          approachName: strategyInfo.metadata.approachName,
          algorithmFamily: strategyInfo.metadata.algorithmFamily,
        }
      : null,
  };
}

/**
 * Builds the strictly bounded prompt sent to Gemini AI for declarative visualization plan generation.
 * Critical Rule: Gemini is asked for a declarative visualization plan ONLY. It is NEVER asked to fabricate traces.
 */
function buildGeminiPlanPrompt(problemDef) {
  return `
You are an expert algorithm visualizer system architect for AlgoVision.
Generate a structured, declarative JSON visualization plan for the problem described below.

IMPORTANT SYSTEM CONTRACT:
1. Generate ONLY a declarative visual arrangement plan.
2. DO NOT invent, generate, or execute algorithm execution traces or steps.
3. The response MUST be strictly valid JSON matching the schema below.
4. Output MUST NOT contain any markdown wraps (no \`\`\`json), comments, or code execution.

PROBLEM SPECIFICATION:
Problem ID: "${problemDef.problemId}"
Title: "${problemDef.title}"
Category: "${problemDef.category}"
Difficulty: "${problemDef.difficulty}"
Objective: "${problemDef.objective}"
Constraints: ${JSON.stringify(problemDef.constraints)}
Sample Test Cases: ${JSON.stringify(problemDef.testCases.slice(0, 2))}

SUPPORTED ARCHITECTURE VOCABULARY:
- Algorithm Families: ${JSON.stringify(SUPPORTED_ALGORITHM_FAMILIES)}
- Layouts: ${JSON.stringify(SUPPORTED_LAYOUTS)}
- Structure Types: ${JSON.stringify(SUPPORTED_STRUCTURE_TYPES)}

SCHEMA EXAMPLE (Use this exact structure):
{
  "schemaVersion": 1,
  "problemId": "${problemDef.problemId}",
  "algorithmFamily": "array-hashmap",
  "layout": "array-with-map",
  "structures": [
    {
      "id": "nums",
      "type": "array",
      "source": "input.nums",
      "label": "Input Array",
      "options": { "showIndices": true }
    },
    {
      "id": "hashMap",
      "type": "hashmap",
      "source": "state.hashMap",
      "label": "Seen Values",
      "options": {}
    }
  ],
  "stateBindings": [
    { "visualProperty": "currentIndex", "source": "state.currentIndex" },
    { "visualProperty": "matchedPair", "source": "state.result" }
  ],
  "explanation": "Concise summary of the visual layout."
}
`.trim();
}

/**
 * Calls Gemini API to generate a declarative visualization plan.
 * Uses @google/genai SDK with graceful fallback to REST endpoint and default plans.
 *
 * @param {Object} problemDef - Canonical problem definition
 * @param {Object} options - Options including mockAiResponse for testing
 * @returns {Promise<Object>} Validated visualization plan
 */
async function callGeminiForPlan(problemDef, options = {}) {
  // If test mock provided, use it directly
  if (options.mockAiResponse) {
    if (typeof options.mockAiResponse === 'function') {
      return await options.mockAiResponse(problemDef);
    }
    return options.mockAiResponse;
  }

  const apiKey = env.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the backend.');
  }

  const model = env.geminiModel || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const prompt = buildGeminiPlanPrompt(problemDef);

  // Try official @google/genai SDK
  try {
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response?.text ? (typeof response.text === 'function' ? response.text() : response.text) : '';
    const cleaned = String(rawText).replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
    return JSON.parse(cleaned);
  } catch (sdkError) {
    // If SDK fails due to network/method, try fetch REST endpoint
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Gemini API returned status ${res.status}: ${errorBody}`);
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      return JSON.parse(cleaned);
    } catch (fetchError) {
      throw new Error(`Gemini plan generation failed: ${fetchError.message || sdkError.message}`);
    }
  }
}

/**
 * Main Service API: Generates or retrieves a validated visualization plan for a problem.
 *
 * @param {string} problemIdOrSlug - Canonical problem identifier
 * @param {Object} [options] - Options { user, bypassCache, mockAiResponse }
 * @returns {Promise<Object>} Response envelope with validated plan and execution support metadata
 */
async function generateVisualizationPlan(problemIdOrSlug, options = {}) {
  const problemDef = await resolveProblemDefinition(problemIdOrSlug, options.user);
  const canonicalId = problemDef.problemId;
  const cacheKey = `${canonicalId}:v${PLAN_SCHEMA_VERSION}`;

  // 1. Check in-memory cache
  if (!options.bypassCache && PLAN_CACHE.has(cacheKey)) {
    const cached = PLAN_CACHE.get(cacheKey);
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return {
        plan: cached.plan,
        problemId: canonicalId,
        schemaVersion: PLAN_SCHEMA_VERSION,
        cached: true,
        isSupported: true,
        source: cached.source || 'cache',
        executionSupported: problemDef.isExecutionSupported,
      };
    }
  }

  // 2. Attempt AI Plan Generation via Gemini API
  let generatedPlan = null;
  let isFallback = false;
  let generationError = null;

  try {
    generatedPlan = await callGeminiForPlan(problemDef, options);

    // Validate the plan generated by AI
    const validation = validateVisualizationPlan(generatedPlan, canonicalId);
    if (!validation.isValid) {
      generationError = `Plan failed semantic validation: ${validation.errors.join('; ')}`;
      generatedPlan = null;
    }
  } catch (err) {
    generationError = err.message || 'Gemini service unreachable.';
  }

  // 3. Graceful Fallback if Gemini failed or produced invalid plan
  if (!generatedPlan) {
    if (DEFAULT_PLANS[canonicalId]) {
      generatedPlan = JSON.parse(JSON.stringify(DEFAULT_PLANS[canonicalId]));
      isFallback = true;
    } else {
      // If no default plan exists and AI failed, return clean controlled unsupported result
      return {
        plan: null,
        problemId: canonicalId,
        schemaVersion: PLAN_SCHEMA_VERSION,
        cached: false,
        isSupported: false,
        status: 'PLAN_UNAVAILABLE',
        executionSupported: problemDef.isExecutionSupported,
        error: generationError || 'Could not generate visualization plan for problem.',
        explanation: `Unable to produce a valid visualization plan for "${problemDef.title}".`,
      };
    }
  }

  // 4. Cache Validated Plan
  PLAN_CACHE.set(cacheKey, {
    plan: generatedPlan,
    timestamp: Date.now(),
    source: isFallback ? 'default-plan' : 'gemini',
  });

  return {
    plan: generatedPlan,
    problemId: canonicalId,
    schemaVersion: PLAN_SCHEMA_VERSION,
    cached: false,
    isSupported: true,
    isFallback,
    source: isFallback ? 'default-plan' : 'gemini',
    executionSupported: problemDef.isExecutionSupported,
    explanation: generatedPlan.explanation || `Visual layout for ${problemDef.title}.`,
  };
}

module.exports = {
  PLAN_SCHEMA_VERSION,
  MAX_PLAN_SIZE_BYTES,
  MAX_NESTING_DEPTH,
  SUPPORTED_ALGORITHM_FAMILIES,
  SUPPORTED_LAYOUTS,
  SUPPORTED_STRUCTURE_TYPES,
  DEFAULT_PLANS,
  validateVisualizationPlan,
  resolveProblemDefinition,
  generateVisualizationPlan,
};
