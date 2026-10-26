const {
  traceTwoSumAlgorithm,
  traceLongestSubstringAlgorithm,
  traceTopKFrequentBucketSort,
  traceLongestConsecutiveAlgorithm,
  traceValidParenthesesAlgorithm,
  traceReverseLinkedListAlgorithm,
  traceBinaryTreeInorderAlgorithm,
  traceMinimumDepthAlgorithm,
  traceMaximumDepthAlgorithm,
  extractNumsAndTarget,
  extractStringInput,
  extractNumsAndK,
  extractNumsArray,
  extractLinkedListInput,
  extractTreeInput,
  validateExecutionTrace,
  normalizeExecutionTrace,
  areResultsEquivalent,
  validateTraceInvariants,
  SUPPORT_STATES,
  EXECUTION_AVAILABILITY,
  TRACE_VALIDITY,
  RESULT_VERIFICATION,
} = require('./problemVisualization.service');

const {
  traceArrayHashMapFamily,
  traceTwoPointersFamily,
  traceStackQueueFamily,
  traceLinkedListFamily,
  traceBinaryTreeFamily,
  traceGraphFamily,
  traceHeapFamily,
  traceDynamicProgrammingFamily,
} = require('./reusableExecutionEngines.service');

// Default limits to prevent infinite loops, memory leaks, and malicious inputs
const DEFAULT_LIMITS = Object.freeze({
  maxSteps: 500,
  maxEvents: 1000,
  maxInputLength: 500,
  timeoutMs: 2500,
});

// Server-controlled maximum ceilings to prevent unvalidated client overrides
const SERVER_MAX_LIMITS = Object.freeze({
  maxSteps: 2000,
  maxEvents: 5000,
  maxInputLength: 2000,
  timeoutMs: 5000,
});

const SERVER_MIN_LIMITS = Object.freeze({
  maxSteps: 1,
  maxEvents: 1,
  maxInputLength: 1,
  timeoutMs: 100,
});

/**
 * Validates and clamps safety limits against server-enforced bounds.
 * Prevents callers from bypassing execution limits with arbitrary large or negative numbers.
 *
 * @param {Object} clientLimits - Limits proposed by caller
 * @param {boolean} isTrustedInternal - Whether caller has trusted internal privileges
 * @returns {Object} Validated and clamped limits
 */
function sanitizeAndClampLimits(clientLimits = {}, isTrustedInternal = false) {
  const sanitized = { ...DEFAULT_LIMITS };

  if (!clientLimits || typeof clientLimits !== 'object') {
    return sanitized;
  }

  for (const key of ['maxSteps', 'maxEvents', 'maxInputLength', 'timeoutMs']) {
    if (clientLimits[key] !== undefined && clientLimits[key] !== null) {
      const val = Number(clientLimits[key]);
      if (Number.isFinite(val) && val > 0) {
        const intVal = Math.floor(val);
        if (isTrustedInternal) {
          sanitized[key] = intVal;
        } else {
          sanitized[key] = Math.min(SERVER_MAX_LIMITS[key], Math.max(SERVER_MIN_LIMITS[key], intVal));
        }
      }
    }
  }

  return Object.freeze(sanitized);
}

// Canonical problem alias dictionary for multi-format problem resolution
const CANONICAL_PROBLEM_ALIASES = Object.freeze({
  // 1. Two Sum
  '1': 'two-sum',
  'two-sum': 'two-sum',
  'twosum': 'two-sum',
  'two_sum': 'two-sum',

  // 2. Add Two Numbers
  '2': 'add-two-numbers',
  'add-two-numbers': 'add-two-numbers',

  // 3. Longest Substring Without Repeating Characters
  '3': 'longest-substring-without-repeating-characters',
  'longest-substring': 'longest-substring-without-repeating-characters',
  'longest-substring-without-repeating-characters': 'longest-substring-without-repeating-characters',
  'longestsubstring': 'longest-substring-without-repeating-characters',
  'longest-substring-no-repeat': 'longest-substring-without-repeating-characters',

  // 20. Valid Parentheses
  '20': 'valid-parentheses',
  'valid-parentheses': 'valid-parentheses',
  'validparentheses': 'valid-parentheses',
  'valid_parentheses': 'valid-parentheses',
  'parentheses': 'valid-parentheses',

  // 94. Binary Tree Inorder Traversal
  '94': 'binary-tree-inorder-traversal',
  'binary-tree-inorder-traversal': 'binary-tree-inorder-traversal',
  'inorder-traversal': 'binary-tree-inorder-traversal',
  'inordertraversal': 'binary-tree-inorder-traversal',

  // 104. Maximum Depth of Binary Tree
  '104': 'maximum-depth-of-binary-tree',
  'maximum-depth-of-binary-tree': 'maximum-depth-of-binary-tree',
  'max-depth': 'maximum-depth-of-binary-tree',
  'maxdepth': 'maximum-depth-of-binary-tree',

  // 111. Minimum Depth of Binary Tree
  '111': 'minimum-depth-of-binary-tree',
  'minimum-depth-of-binary-tree': 'minimum-depth-of-binary-tree',
  'min-depth': 'minimum-depth-of-binary-tree',
  'mindepth': 'minimum-depth-of-binary-tree',

  // 128. Longest Consecutive Sequence
  '128': 'longest-consecutive-sequence',
  'longest-consecutive-sequence': 'longest-consecutive-sequence',
  'longest-consecutive': 'longest-consecutive-sequence',
  'longestconsecutive': 'longest-consecutive-sequence',

  // 206. Reverse Linked List
  '206': 'reverse-linked-list',
  'reverse-linked-list': 'reverse-linked-list',
  'reverse-list': 'reverse-linked-list',
  'reverselist': 'reverse-linked-list',
  'reverselinkedlist': 'reverse-linked-list',

  // 347. Top K Frequent Elements
  '347': 'top-k-frequent-elements',
  'top-k-frequent-elements': 'top-k-frequent-elements',
  'top-k-frequent': 'top-k-frequent-elements',
  'topkfrequent': 'top-k-frequent-elements',
});

// Internal registry map: canonical problemId -> strategy record
const STRATEGY_REGISTRY = new Map();

// Internal family engine map: algorithmFamily -> generic engine record
const FAMILY_ENGINE_REGISTRY = new Map();

/**
 * Dedicated Canonical Problem Identifier Resolver.
 * Resolves canonical ID from numeric IDs, slugs, aliases, and title variations.
 *
 * @param {Object|string} problemDefinition - Problem object or raw string identifier
 * @param {Object} options - Optional overrides
 * @returns {string|null} Resolved canonical identifier, or null if unresolvable
 */
function resolveCanonicalProblemId(problemDefinition, options = {}) {
  const candidates = [];

  if (typeof problemDefinition === 'string' || typeof problemDefinition === 'number') {
    candidates.push(String(problemDefinition));
  } else if (problemDefinition && typeof problemDefinition === 'object') {
    if (problemDefinition.canonicalId !== undefined) candidates.push(String(problemDefinition.canonicalId));
    if (problemDefinition.problemId !== undefined) candidates.push(String(problemDefinition.problemId));
    if (problemDefinition.slug !== undefined) candidates.push(String(problemDefinition.slug));
    if (problemDefinition.id !== undefined) candidates.push(String(problemDefinition.id));
    if (problemDefinition.title !== undefined) candidates.push(String(problemDefinition.title));
  }

  if (options.problemId !== undefined) candidates.push(String(options.problemId));
  if (options.canonicalId !== undefined) candidates.push(String(options.canonicalId));
  if (options.slug !== undefined) candidates.push(String(options.slug));
  if (options.id !== undefined) candidates.push(String(options.id));

  for (const raw of candidates) {
    if (!raw) continue;
    const trimmed = String(raw).trim();
    if (!trimmed) continue;

    // 1. Direct match in canonical alias map
    const lower = trimmed.toLowerCase();
    if (CANONICAL_PROBLEM_ALIASES[lower]) {
      return CANONICAL_PROBLEM_ALIASES[lower];
    }

    // 2. Direct match in STRATEGY_REGISTRY
    if (STRATEGY_REGISTRY.has(lower)) {
      return lower;
    }

    // 3. Strip prefix like "leetcode-", "lc-", "problem-"
    const strippedPrefix = lower
      .replace(/^(leetcode|lc|problem)[-_]/i, '')
      .replace(/^(\d+)[._\s-]+/, '');

    if (CANONICAL_PROBLEM_ALIASES[strippedPrefix]) {
      return CANONICAL_PROBLEM_ALIASES[strippedPrefix];
    }
    if (STRATEGY_REGISTRY.has(strippedPrefix)) {
      return strippedPrefix;
    }

    // 4. Title to kebab-case
    const kebab = trimmed
      .replace(/^[0-9]+[.\s-]+/, '') // Strip leading problem number e.g. "20. "
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');

    if (CANONICAL_PROBLEM_ALIASES[kebab]) {
      return CANONICAL_PROBLEM_ALIASES[kebab];
    }
    if (STRATEGY_REGISTRY.has(kebab)) {
      return kebab;
    }

    // 5. Extract trailing number if present (e.g. "LeetCode 20" -> "20")
    const matchNum = trimmed.match(/\b([0-9]+)\b/);
    if (matchNum && CANONICAL_PROBLEM_ALIASES[matchNum[1]]) {
      return CANONICAL_PROBLEM_ALIASES[matchNum[1]];
    }
  }

  const fallback = candidates[0];
  return fallback ? String(fallback).trim().toLowerCase() : null;
}

/**
 * Registers a trusted algorithm execution strategy for a problem identifier or alias.
 * Supports both (id, fn, metadata) and (id, { executeFn, metadata, ... }).
 *
 * @param {string|string[]} problemIds - Canonical problem ID or array of aliases
 * @param {Function|Object} executeFnOrConfig - Function or config object
 * @param {Object} metadata - Optional metadata (algorithmFamily, approachId, approachName)
 */
function registerStrategy(problemIds, executeFnOrConfig, metadata = {}) {
  const ids = Array.isArray(problemIds) ? problemIds : [problemIds];
  let executeFn = executeFnOrConfig;
  let meta = metadata;

  if (typeof executeFnOrConfig === 'object' && executeFnOrConfig !== null) {
    executeFn = executeFnOrConfig.executeFn;
    meta = { ...executeFnOrConfig, ...(executeFnOrConfig.metadata || {}), ...metadata };
  }

  for (const id of ids) {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) continue;
    const normalized = String(id).trim().toLowerCase();
    STRATEGY_REGISTRY.set(normalized, {
      problemId: normalized,
      executeFn,
      metadata: {
        algorithmFamily: meta?.algorithmFamily || 'generic',
        approachId: meta?.approachId || 'default',
        approachName: meta?.approachName || 'Optimal Approach',
        ...meta,
      },
    });
  }
}

/**
 * Registers a reusable generic algorithm family execution engine
 * (e.g. 'binary-tree', 'linked-list', 'stack', 'two-pointers', 'sliding-window', 'array-hashmap')
 *
 * @param {string|string[]} familyIds - One or more algorithm family identifiers
 * @param {Function|Object} engineFnOrConfig - Function or config object
 * @param {Object} metadata - Optional metadata
 */
function registerFamilyEngine(familyIds, engineFnOrConfig, metadata = {}) {
  const ids = Array.isArray(familyIds) ? familyIds : [familyIds];
  let engineFn = engineFnOrConfig;
  let meta = metadata;

  if (typeof engineFnOrConfig === 'object' && engineFnOrConfig !== null) {
    engineFn = engineFnOrConfig.engineFn || engineFnOrConfig.executeFn;
    meta = { ...engineFnOrConfig, ...(engineFnOrConfig.metadata || {}), ...metadata };
  }

  for (const id of ids) {
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) continue;
    const normalized = String(id).trim().toLowerCase();
    FAMILY_ENGINE_REGISTRY.set(normalized, {
      familyId: normalized,
      engineFn,
      metadata: {
        approachId: meta?.approachId || 'genericFamilyEngine',
        approachName: meta?.approachName || 'Generic Algorithm Family Engine',
        algorithmFamily: normalized,
        ...meta,
      },
    });
  }
}

function hasStrategy(problemIdOrFamily) {
  if (!problemIdOrFamily) return false;
  const canonical = resolveCanonicalProblemId(problemIdOrFamily);
  if (canonical && (STRATEGY_REGISTRY.has(canonical) || FAMILY_ENGINE_REGISTRY.has(canonical))) {
    return true;
  }
  const normalized = String(problemIdOrFamily).trim().toLowerCase();
  return STRATEGY_REGISTRY.has(normalized) || FAMILY_ENGINE_REGISTRY.has(normalized);
}

function hasFamilyEngine(familyId) {
  if (!familyId || typeof familyId !== 'string') return false;
  return FAMILY_ENGINE_REGISTRY.has(familyId.trim().toLowerCase());
}

/**
 * Retrieves strategy record for a problem ID.
 */
function getStrategy(problemId) {
  if (!problemId || typeof problemId !== 'string') return null;
  return STRATEGY_REGISTRY.get(problemId.trim().toLowerCase()) || null;
}

function getFamilyEngine(familyId) {
  if (!familyId || typeof familyId !== 'string') return null;
  return FAMILY_ENGINE_REGISTRY.get(familyId.trim().toLowerCase()) || null;
}

/**
 * Multi-tier Execution Strategy Router:
 * Tier 1: Canonical problem-specific strategy (exact problem match)
 * Tier 2: Generic algorithm family engine (archetype match)
 * Tier 3: Controlled unsupported fallback
 */
function resolveStrategyRouter(problemDefinition, options = {}) {
  const canonicalId = resolveCanonicalProblemId(problemDefinition, options);
  const rawId = problemDefinition?.problemId || problemDefinition?.id || options.problemId || '';
  const normalizedId = String(canonicalId || rawId).trim().toLowerCase();

  // Tier 1: Problem-Specific Canonical Strategy
  const specific = getStrategy(normalizedId);
  if (specific) {
    return {
      tier: 'SPECIFIC_STRATEGY',
      strategy: specific,
      identifier: normalizedId,
    };
  }

  // Tier 2: Generic Algorithm Family Engine
  const candidateFamily =
    options.algorithmFamily ||
    problemDefinition?.algorithmFamily ||
    problemDefinition?.category;

  if (candidateFamily) {
    const normFamily = String(candidateFamily).trim().toLowerCase();
    const familyEngine = getFamilyEngine(normFamily);
    if (familyEngine) {
      return {
        tier: 'FAMILY_ENGINE',
        strategy: {
          executeFn: familyEngine.engineFn,
          metadata: {
            ...familyEngine.metadata,
            approachId: options.approachId || familyEngine.metadata.approachId,
            approachName: options.approachName || familyEngine.metadata.approachName,
          },
        },
        identifier: normFamily,
      };
    }
  }

  return null;
}

/**
 * Lists all registered problem IDs.
 */
function listStrategies() {
  const seen = new Set();
  const list = [];
  for (const [id, entry] of STRATEGY_REGISTRY.entries()) {
    const canonical = entry.metadata?.canonicalId || id;
    if (!seen.has(canonical)) {
      seen.add(canonical);
      list.push({
        problemId: canonical,
        algorithmFamily: entry.metadata?.algorithmFamily,
        approachId: entry.metadata?.approachId,
        approachName: entry.metadata?.approachName,
      });
    }
  }
  return list;
}

/**
 * Lists all registered algorithm family engines.
 */
function listFamilyEngines() {
  const seen = new Set();
  const list = [];
  for (const [id, entry] of FAMILY_ENGINE_REGISTRY.entries()) {
    const family = entry.metadata?.algorithmFamily || id;
    if (!seen.has(family)) {
      seen.add(family);
      list.push({
        familyId: family,
        approachId: entry.metadata?.approachId,
        approachName: entry.metadata?.approachName,
      });
    }
  }
  return list;
}

// -------------------------------------------------------------
// REGISTER CANONICAL STAGE 09 EXECUTION STRATEGIES
// -------------------------------------------------------------

// 1. Two Sum Strategy (One-Pass Hash Table)
registerStrategy(
  ['two-sum', '1'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const { nums, target } = extractNumsAndTarget(input.testCase, input.problem);

    if (Array.isArray(nums) && nums.length > limits.maxInputLength) {
      throw new Error(`Input array length (${nums.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceTwoSumAlgorithm(nums, target, {
      problemId: 'two-sum',
      approachId: options.approachId || 'hashMap',
      approachName: options.approachName || 'Hash Table / Complement Lookup',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Two Sum',
    });

    return trace;
  },
  {
    canonicalId: 'two-sum',
    algorithmFamily: 'array-hashmap',
    approachId: 'hashMap',
    approachName: 'Hash Table / Complement Lookup',
  }
);

// 2. Longest Substring Without Repeating Characters (Sliding Window)
registerStrategy(
  ['longest-substring-without-repeating-characters', 'longest-substring-no-repeat', 'longest-substring', '3'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const s = extractStringInput(input.testCase, input.problem);

    if (typeof s === 'string' && s.length > limits.maxInputLength) {
      throw new Error(`Input string length (${s.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceLongestSubstringAlgorithm(s, {
      problemId: 'longest-substring-without-repeating-characters',
      approachId: options.approachId || 'slidingWindow',
      approachName: options.approachName || 'Sliding Window (Hash Set / Visited Indices)',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Longest Substring Without Repeating Characters',
    });

    return trace;
  },
  {
    canonicalId: 'longest-substring-without-repeating-characters',
    algorithmFamily: 'sliding-window',
    approachId: 'slidingWindow',
    approachName: 'Sliding Window (Hash Set / Visited Indices)',
  }
);

// 3. Top K Frequent Elements (Bucket Sort)
registerStrategy(
  ['top-k-frequent-elements', 'top-k-frequent', '347'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const { nums, k } = extractNumsAndK(input.testCase, input.problem);

    if (Array.isArray(nums) && nums.length > limits.maxInputLength) {
      throw new Error(`Input array length (${nums.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceTopKFrequentBucketSort(nums, k, {
      problemId: 'top-k-frequent',
      approachId: options.approachId || 'bucketSort',
      approachName: options.approachName || 'Bucket Sort (Frequency Ranking)',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Top K Frequent Elements',
    });

    return trace;
  },
  {
    canonicalId: 'top-k-frequent-elements',
    algorithmFamily: 'bucket-sort',
    approachId: 'bucketSort',
    approachName: 'Bucket Sort (Frequency Ranking)',
  }
);

// 4. Longest Consecutive Sequence (Hash Set)
registerStrategy(
  ['longest-consecutive-sequence', 'longest-consecutive', '128'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const nums = extractNumsArray(input.testCase, input.problem);

    if (Array.isArray(nums) && nums.length > limits.maxInputLength) {
      throw new Error(`Input array length (${nums.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceLongestConsecutiveAlgorithm(nums, {
      problemId: 'longest-consecutive-sequence',
      approachId: options.approachId || 'hashSet',
      approachName: options.approachName || 'Hash Set Sequence Detector',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Longest Consecutive Sequence',
    });

    return trace;
  },
  {
    canonicalId: 'longest-consecutive-sequence',
    algorithmFamily: 'hash-set',
    approachId: 'hashSet',
    approachName: 'Hash Set Sequence Detector',
  }
);

// 5. Valid Parentheses (Stack)
registerStrategy(
  ['valid-parentheses', '20'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const s = extractStringInput(input.testCase, input.problem, '()[]{}');

    if (typeof s === 'string' && s.length > limits.maxInputLength) {
      throw new Error(`Input string length (${s.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceValidParenthesesAlgorithm(s, {
      problemId: 'valid-parentheses',
      approachId: options.approachId || 'stack',
      approachName: options.approachName || 'Stack Bracket Matching',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Valid Parentheses',
    });

    return trace;
  },
  {
    canonicalId: 'valid-parentheses',
    algorithmFamily: 'stack',
    approachId: 'stack',
    approachName: 'Stack Bracket Matching',
  }
);

// 6. Reverse Linked List (Iterative Pointers)
registerStrategy(
  ['reverse-linked-list', 'reverse-list', '206'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const head = extractLinkedListInput(input.testCase, input.problem);

    if (Array.isArray(head) && head.length > limits.maxInputLength) {
      throw new Error(`Linked list length (${head.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceReverseLinkedListAlgorithm(head, {
      problemId: 'reverse-linked-list',
      approachId: options.approachId || 'iterativePointers',
      approachName: options.approachName || 'Three-Pointer Iterative Reversal',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Reverse Linked List',
    });

    return trace;
  },
  {
    canonicalId: 'reverse-linked-list',
    algorithmFamily: 'linked-list',
    approachId: 'iterativePointers',
    approachName: 'Three-Pointer Iterative Reversal',
  }
);

// 7. Binary Tree Inorder Traversal (Call Stack DFS)
registerStrategy(
  ['binary-tree-inorder-traversal', 'inorder-traversal', '94'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const root = extractTreeInput(input.testCase, input.problem);

    if (Array.isArray(root) && root.length > limits.maxInputLength) {
      throw new Error(`Binary tree nodes count (${root.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceBinaryTreeInorderAlgorithm(root, {
      problemId: 'binary-tree-inorder-traversal',
      approachId: options.approachId || 'inorderDfs',
      approachName: options.approachName || 'Inorder Traversal (Call Stack)',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Binary Tree Inorder Traversal',
    });

    return trace;
  },
  {
    canonicalId: 'binary-tree-inorder-traversal',
    algorithmFamily: 'binary-tree',
    approachId: 'inorderDfs',
    approachName: 'Inorder Traversal (Call Stack)',
  }
);

// 8. Minimum Depth of Binary Tree (DFS)
registerStrategy(
  ['minimum-depth-of-binary-tree', 'min-depth', '111'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const root = extractTreeInput(input.testCase, input.problem);

    if (Array.isArray(root) && root.length > limits.maxInputLength) {
      throw new Error(`Binary tree nodes count (${root.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceMinimumDepthAlgorithm(root, {
      problemId: 'minimum-depth-of-binary-tree',
      approachId: options.approachId || 'dfs',
      approachName: options.approachName || 'Depth-First Search (DFS)',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Minimum Depth of Binary Tree',
    });

    return trace;
  },
  {
    canonicalId: 'minimum-depth-of-binary-tree',
    algorithmFamily: 'binary-tree',
    approachId: 'dfs',
    approachName: 'Depth-First Search (DFS)',
  }
);

// 9. Maximum Depth of Binary Tree (DFS)
registerStrategy(
  ['maximum-depth-of-binary-tree', 'max-depth', '104'],
  (input, options = {}, limits = DEFAULT_LIMITS) => {
    const root = extractTreeInput(input.testCase, input.problem);

    if (Array.isArray(root) && root.length > limits.maxInputLength) {
      throw new Error(`Binary tree nodes count (${root.length}) exceeds safety limit of ${limits.maxInputLength}`);
    }

    const trace = traceMaximumDepthAlgorithm(root, {
      problemId: 'maximum-depth-of-binary-tree',
      approachId: options.approachId || 'dfs',
      approachName: options.approachName || 'Depth-First Search (DFS / Recursion)',
      testCaseId: options.testCaseId || 1,
      title: input.problem?.title || 'Maximum Depth of Binary Tree',
    });

    return trace;
  },
  {
    canonicalId: 'maximum-depth-of-binary-tree',
    algorithmFamily: 'binary-tree',
    approachId: 'dfs',
    approachName: 'Depth-First Search (DFS / Recursion)',
  }
);

// -------------------------------------------------------------
// REGISTER REUSABLE ALGORITHM FAMILY ENGINES (Archetypes)
// -------------------------------------------------------------

// 1. Arrays and Hash Maps (array-hashmap)
registerFamilyEngine(
  ['array-hashmap', 'hashmap', 'hash-table', 'array', 'frequency-counting'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceArrayHashMapFamily(input, options, limits),
  {
    algorithmFamily: 'array-hashmap',
    approachId: 'arrayHashMap',
    approachName: 'Array & Hash Map Family Engine',
  }
);

// 2. Sliding Window & Two Pointers (two-pointers, sliding-window)
registerFamilyEngine(
  ['two-pointers', 'sliding-window', 'two-pointer'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceTwoPointersFamily(input, options, limits),
  {
    algorithmFamily: 'two-pointers',
    approachId: 'twoPointers',
    approachName: 'Sliding Window & Two Pointers Family Engine',
  }
);

// 3. Stack and Queue (stack, queue)
registerFamilyEngine(
  ['stack', 'queue', 'monotonic-stack', 'bracket-matching'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceStackQueueFamily(input, options, limits),
  {
    algorithmFamily: 'stack',
    approachId: 'stackQueue',
    approachName: 'Stack & Queue Family Engine',
  }
);

// 4. Linked Lists (linked-list)
registerFamilyEngine(
  ['linked-list', 'singly-linked-list', 'list'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceLinkedListFamily(input, options, limits),
  {
    algorithmFamily: 'linked-list',
    approachId: 'linkedList',
    approachName: 'Linked List Traversal & Mutation Engine',
  }
);

// 5. Binary Trees / BSTs (binary-tree, bst)
registerFamilyEngine(
  ['binary-tree', 'tree', 'bst', 'binary-search-tree', 'binary-tree-traversal'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceBinaryTreeFamily(input, options, limits),
  {
    algorithmFamily: 'binary-tree',
    approachId: 'binaryTree',
    approachName: 'Binary Trees & BSTs Family Engine',
  }
);

// 6. Graphs & Grid Traversal (graph, grid-traversal)
registerFamilyEngine(
  ['graph', 'grid-traversal', 'matrix', 'bfs', 'dfs', 'shortest-path'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceGraphFamily(input, options, limits),
  {
    algorithmFamily: 'graph',
    approachId: 'graphTraversal',
    approachName: 'Graph & Grid Traversal Family Engine',
  }
);

// 7. Heaps & Priority Queues (heap, priority-queue)
registerFamilyEngine(
  ['heap', 'priority-queue', 'min-heap', 'max-heap'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceHeapFamily(input, options, limits),
  {
    algorithmFamily: 'heap',
    approachId: 'minHeap',
    approachName: 'Heap & Priority Queue Family Engine',
  }
);

// 8. Dynamic Programming (dynamic-programming, dp)
registerFamilyEngine(
  ['dynamic-programming', 'dp', 'memoization'],
  (input, options = {}, limits = DEFAULT_LIMITS) => traceDynamicProgrammingFamily(input, options, limits),
  {
    algorithmFamily: 'dynamic-programming',
    approachId: 'dynamicProgramming',
    approachName: 'Dynamic Programming Recurrence Engine',
  }
);

/**
 * Authoritative Execution Dispatcher.
 * Executes a registered strategy or generic algorithm family engine with bounds checking,
 * trace normalization, and validation.
 *
 * @param {Object} problemDefinition - Normalized problem object
 * @param {Object} input - Input container { testCase, problem }
 * @param {Object} options - { approachId, testCaseId, limits, algorithmFamily }
 * @returns {Object} Execution result with trace or controlled unsupported status
 */
function executeWithTrace(problemDefinition, input = {}, options = {}) {
  const canonicalId = resolveCanonicalProblemId(problemDefinition, options);
  const rawId = problemDefinition?.problemId || problemDefinition?.id || options.problemId || canonicalId || '';

  const resolution = resolveStrategyRouter(problemDefinition, options);
  if (!resolution) {
    return {
      isSupported: false,
      status: 'UNSUPPORTED',
      supportState: SUPPORT_STATES ? SUPPORT_STATES.UNSUPPORTED : 'UNSUPPORTED',
      isPlaybackUnlocked: false,
      verificationStatus: 'UNSUPPORTED',
      resultVerified: false,
      dimensions: {
        executionAvailability: EXECUTION_AVAILABILITY ? EXECUTION_AVAILABILITY.UNSUPPORTED : 'UNSUPPORTED',
        traceValidity: TRACE_VALIDITY ? TRACE_VALIDITY.NONE : 'NONE',
        resultVerification: RESULT_VERIFICATION ? RESULT_VERIFICATION.UNCHECKED : 'UNCHECKED',
        invariantVerification: 'SKIPPED',
      },
      message: `No trusted execution strategy or algorithm family engine registered for "${rawId}".`,
      problemId: rawId,
      trace: null,
    };
  }

  const strategy = resolution.strategy;
  // Sanitize and clamp limits against server-enforced max ceilings
  const clientLimits = options.limits || input?.limits || {};
  const isTrusted = Boolean(options.isTrustedInternal || input?.isTrustedInternal);
  const limits = sanitizeAndClampLimits(clientLimits, isTrusted);
  const startTime = Date.now();

  try {
    const trace = strategy.executeFn(
      {
        testCase: input?.testCase || null,
        problem: problemDefinition || input?.problem || null,
      },
      {
        approachId: options.approachId || strategy.metadata?.approachId || 'default',
        approachName: options.approachName || strategy.metadata?.approachName || 'Optimal Approach',
        testCaseId: options.testCaseId || 1,
      },
      limits
    );

    // Wall-clock execution timeout enforcement
    const elapsedMs = Date.now() - startTime;
    if (elapsedMs > limits.timeoutMs) {
      return {
        isSupported: false,
        status: 'TIMEOUT',
        supportState: SUPPORT_STATES ? SUPPORT_STATES.UNSUPPORTED : 'UNSUPPORTED',
        isPlaybackUnlocked: false,
        verificationStatus: 'TIMEOUT',
        resultVerified: false,
        dimensions: {
          executionAvailability: resolution.tier,
          traceValidity: TRACE_VALIDITY ? TRACE_VALIDITY.NONE : 'NONE',
          resultVerification: RESULT_VERIFICATION ? RESULT_VERIFICATION.UNCHECKED : 'UNCHECKED',
          invariantVerification: 'FAILED',
        },
        message: `Execution exceeded hard wall-clock timeout of ${limits.timeoutMs}ms (took ${elapsedMs}ms).`,
        problemId: rawId,
        trace: null,
      };
    }

    // Enforce Step and Event Limits with Truthful Truncation Tracking
    let workingTrace = trace;
    let isTruncated = false;
    const originalResult = trace?.result;

    if (trace?.steps && trace.steps.length > limits.maxSteps) {
      isTruncated = true;
      workingTrace = {
        ...trace,
        steps: trace.steps.slice(0, limits.maxSteps),
      };
    }

    let totalEvents = 0;
    if (Array.isArray(workingTrace?.steps)) {
      let eventsTruncated = false;
      const slicedSteps = workingTrace.steps.map((step) => {
        if (Array.isArray(step.events)) {
          totalEvents += step.events.length;
          if (totalEvents > limits.maxEvents) {
            eventsTruncated = true;
            isTruncated = true;
            return {
              ...step,
              events: step.events.slice(0, Math.max(0, limits.maxEvents - (totalEvents - step.events.length))),
            };
          }
        }
        return step;
      });
      if (eventsTruncated) {
        workingTrace = { ...workingTrace, steps: slicedSteps };
      }
    }

    if (isTruncated) {
      workingTrace = {
        ...workingTrace,
        isTruncated: true,
        isIncomplete: true,
        metadata: {
          ...(workingTrace.metadata || {}),
          isTruncated: true,
          isIncomplete: true,
          untruncatedResult: originalResult,
        },
      };
    }

    // 1. Schema Validation
    const validation = validateExecutionTrace(workingTrace);
    if (!validation.isValid) {
      return {
        isSupported: false,
        status: 'INVALID_TRACE',
        supportState: SUPPORT_STATES ? SUPPORT_STATES.VERIFICATION_FAILED : 'VERIFICATION_FAILED',
        isPlaybackUnlocked: false,
        verificationStatus: 'UNSUPPORTED',
        resultVerified: false,
        dimensions: {
          executionAvailability: resolution.tier,
          traceValidity: TRACE_VALIDITY ? TRACE_VALIDITY.INVALID : 'INVALID',
          resultVerification: RESULT_VERIFICATION ? RESULT_VERIFICATION.VERIFICATION_FAILED : 'VERIFICATION_FAILED',
          invariantVerification: 'FAILED',
        },
        message: `Execution produced an invalid trace: ${validation.errors?.join('; ')}`,
        problemId: rawId,
        trace: null,
      };
    }

    const normalizedTrace = normalizeExecutionTrace(workingTrace);

    // 2. Intermediate Consistency & Algorithmic Invariants
    const expectedOutput = input.testCase?.outputStructured !== undefined
      ? input.testCase.outputStructured
      : input.testCase?.outputRaw !== undefined
        ? input.testCase.outputRaw
        : input.testCase?.expectedOutput;

    const hasExpectedOutput = expectedOutput !== undefined && expectedOutput !== null && expectedOutput !== '';

    const invariantCheck = typeof validateTraceInvariants === 'function'
      ? validateTraceInvariants(normalizedTrace, {
          algorithmFamily: resolution.strategy?.metadata?.algorithmFamily || options.algorithmFamily,
          expectedOutput,
        })
      : { isValid: true, errors: [], invariantsChecked: [] };

    // 3. Status and Oracle Result Verification
    let executionStatus = 'SUCCESS';
    let resultVerified = false;
    let verificationStatus = 'TRUSTED_UNCHECKED';
    let supportState = SUPPORT_STATES ? SUPPORT_STATES.TRACE_VALIDATED : 'TRACE_VALIDATED';
    let isPlaybackUnlocked = true;

    if (isTruncated) {
      // Truncation leaves a partial trace: NEVER mark fully verified!
      executionStatus = 'PARTIAL_TRACE';
      verificationStatus = 'TRUNCATED_PARTIAL_TRACE';
      supportState = SUPPORT_STATES ? SUPPORT_STATES.TRACE_GENERATED : 'TRACE_GENERATED';
      resultVerified = false;
      isPlaybackUnlocked = false;
    } else if (!invariantCheck.isValid) {
      executionStatus = 'VERIFICATION_FAILED';
      supportState = SUPPORT_STATES ? SUPPORT_STATES.VERIFICATION_FAILED : 'VERIFICATION_FAILED';
      verificationStatus = 'VERIFICATION_FAILED';
      resultVerified = false;
      isPlaybackUnlocked = false;
    } else if (hasExpectedOutput) {
      resultVerified = areResultsEquivalent(normalizedTrace.result, expectedOutput);
      if (resultVerified) {
        executionStatus = 'SUCCESS';
        verificationStatus = 'VERIFIED';
        supportState = SUPPORT_STATES ? SUPPORT_STATES.RESULT_VERIFIED : 'RESULT_VERIFIED';
        isPlaybackUnlocked = true;
      } else {
        // Output comparison failure MUST NOT return status: 'SUCCESS'
        executionStatus = 'VERIFICATION_FAILED';
        verificationStatus = 'UNVERIFIED_RESULT_MISMATCH';
        supportState = SUPPORT_STATES ? SUPPORT_STATES.VERIFICATION_FAILED : 'VERIFICATION_FAILED';
        resultVerified = false;
        isPlaybackUnlocked = false;
      }
    } else {
      // Missing expected output defaults to UNVERIFIED (TRUSTED_UNCHECKED), NEVER VERIFIED!
      executionStatus = 'SUCCESS';
      supportState = SUPPORT_STATES ? SUPPORT_STATES.TRACE_VALIDATED : 'TRACE_VALIDATED';
      verificationStatus = 'TRUSTED_UNCHECKED';
      resultVerified = false;
      isPlaybackUnlocked = true;
    }

    const dimensions = {
      executionAvailability: resolution.tier,
      traceValidity: invariantCheck.isValid ? (TRACE_VALIDITY ? TRACE_VALIDITY.VALID : 'VALID') : (TRACE_VALIDITY ? TRACE_VALIDITY.INVALID : 'INVALID'),
      resultVerification: hasExpectedOutput
        ? (resultVerified ? (RESULT_VERIFICATION ? RESULT_VERIFICATION.RESULT_VERIFIED : 'RESULT_VERIFIED') : (RESULT_VERIFICATION ? RESULT_VERIFICATION.VERIFICATION_FAILED : 'VERIFICATION_FAILED'))
        : (RESULT_VERIFICATION ? RESULT_VERIFICATION.TRUSTED_UNCHECKED : 'TRUSTED_UNCHECKED'),
      invariantVerification: isTruncated ? 'PARTIAL' : (invariantCheck.isValid ? 'PASSED' : 'FAILED'),
    };

    return {
      isSupported: true,
      status: executionStatus,
      supportState,
      isPlaybackUnlocked,
      isTruncated: Boolean(isTruncated),
      isIncomplete: Boolean(isTruncated),
      dimensions,
      verificationDetails: {
        schemaValid: true,
        invariantsPassed: invariantCheck.isValid,
        failedInvariants: invariantCheck.errors || [],
        resultMatches: hasExpectedOutput ? resultVerified : null,
        isTruncated: Boolean(isTruncated),
      },
      verificationStatus,
      resultVerified,
      source: 'execution',
      resolutionTier: resolution.tier,
      problemId: rawId,
      approachId: options.approachId || strategy.metadata?.approachId || 'default',
      approachName: options.approachName || strategy.metadata?.approachName || 'Optimal Approach',
      testCaseId: options.testCaseId || 1,
      trace: normalizedTrace,
    };
  } catch (err) {
    return {
      isSupported: false,
      status: 'EXECUTION_ERROR',
      supportState: SUPPORT_STATES ? SUPPORT_STATES.UNSUPPORTED : 'UNSUPPORTED',
      isPlaybackUnlocked: false,
      verificationStatus: 'UNSUPPORTED',
      resultVerified: false,
      dimensions: {
        executionAvailability: resolution?.tier || (EXECUTION_AVAILABILITY ? EXECUTION_AVAILABILITY.UNSUPPORTED : 'UNSUPPORTED'),
        traceValidity: TRACE_VALIDITY ? TRACE_VALIDITY.NONE : 'NONE',
        resultVerification: RESULT_VERIFICATION ? RESULT_VERIFICATION.UNCHECKED : 'UNCHECKED',
        invariantVerification: 'SKIPPED',
      },
      message: err.message || 'Execution failed during algorithm trace generation.',
      problemId: rawId,
      trace: null,
    };
  }
}

module.exports = {
  DEFAULT_LIMITS,
  SERVER_MAX_LIMITS,
  SERVER_MIN_LIMITS,
  sanitizeAndClampLimits,
  CANONICAL_PROBLEM_ALIASES,
  resolveCanonicalProblemId,
  registerStrategy,
  hasStrategy,
  getStrategy,
  listStrategies,
  registerFamilyEngine,
  hasFamilyEngine,
  getFamilyEngine,
  listFamilyEngines,
  resolveStrategyRouter,
  executeWithTrace,
};
