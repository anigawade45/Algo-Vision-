/**
 * AlgoVision — Stage 09 Client-Side Visualization Plan Validator
 *
 * Validates candidate visualization plans at the client boundary before rendering.
 * Ensures no malformed schemas, unknown structure types, invalid paths, or malicious code
 * ever reach the D3 rendering tree.
 */

export const PLAN_SCHEMA_VERSION = 1;
export const MAX_PLAN_SIZE_BYTES = 16384;
export const MAX_NESTING_DEPTH = 4;

export const SUPPORTED_ALGORITHM_FAMILIES = Object.freeze([
  'array-hashmap',
  'sliding-window',
  'two-pointers',
  'bucket-sort',
  'stack',
  'queue',
  'matrix',
  'linked-list',
  'binary-tree',
  'heap',
  'grid-traversal',
  'generic',
]);

export const SUPPORTED_LAYOUTS = Object.freeze([
  'array-with-map',
  'sliding-window',
  'bucket-sort',
  'linear-array',
  'grid-traversal',
  'stack-queue',
  'tree-traversal',
  'composite-scene',
  'generic-d3',
]);

export const SUPPORTED_STRUCTURE_TYPES = Object.freeze([
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
 * Validates a visualization plan object before handing off to D3 renderer.
 *
 * @param {Object} plan - Candidate plan
 * @param {string} [expectedProblemId] - Expected problem ID
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateVisualizationPlan(plan, expectedProblemId = null) {
  const errors = [];

  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) {
    return { isValid: false, errors: ['Visualization plan must be a non-null object.'] };
  }

  // 1. Serialization, Size, and Depth limits
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
    errors.push(`Plan nesting depth (${depth}) exceeds limit of ${MAX_NESTING_DEPTH}.`);
  }

  // 2. Security Check: Reject forbidden patterns
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
    errors.push('ProblemId must be a valid alphanumeric string.');
  } else if (expectedProblemId) {
    const normExpected = String(expectedProblemId).trim().toLowerCase();
    const normActual = String(plan.problemId).trim().toLowerCase();
    const isAliasMatch =
      (normExpected === 'top-k-frequent' && normActual === 'top-k-frequent-elements') ||
      (normExpected === 'top-k-frequent-elements' && normActual === 'top-k-frequent') ||
      (normExpected === '347' && normActual === 'top-k-frequent-elements') ||
      (normExpected === '3' && normActual === 'longest-substring-without-repeating-characters') ||
      (normExpected === '1' && normActual === 'two-sum');

    if (normActual !== normExpected && !isAliasMatch) {
      errors.push(`Plan problemId "${plan.problemId}" does not match requested problem "${expectedProblemId}".`);
    }
  }

  // 5. Algorithm Family
  if (!SUPPORTED_ALGORITHM_FAMILIES.includes(plan.algorithmFamily)) {
    errors.push(`Unsupported algorithmFamily "${plan.algorithmFamily}".`);
  }

  // 6. Layout
  if (!SUPPORTED_LAYOUTS.includes(plan.layout)) {
    errors.push(`Unsupported layout "${plan.layout}".`);
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

      if (!st.id || typeof st.id !== 'string' || !/^[a-zA-Z0-9_-]{1,50}$/.test(st.id)) {
        errors.push(`Structure at index ${idx} has invalid ID "${st.id}".`);
      } else if (seenIds.has(st.id)) {
        errors.push(`Duplicate structure ID "${st.id}" detected in plan.`);
      } else {
        seenIds.add(st.id);
      }

      if (!SUPPORTED_STRUCTURE_TYPES.includes(st.type)) {
        errors.push(`Structure "${st.id}" has unsupported type "${st.type}".`);
      }

      if (!st.source || typeof st.source !== 'string' || !validPathRegex.test(st.source)) {
        errors.push(`Structure "${st.id}" has invalid source path "${st.source}".`);
      }

      if (st.label && (typeof st.label !== 'string' || st.label.length > 100)) {
        errors.push(`Structure "${st.id}" label must be at most 100 characters.`);
      }

      if (st.options !== undefined && (typeof st.options !== 'object' || Array.isArray(st.options))) {
        errors.push(`Structure "${st.id}" options must be a plain object.`);
      }
    });
  }

  // 8. State Bindings
  if (plan.stateBindings !== undefined) {
    if (!Array.isArray(plan.stateBindings)) {
      errors.push('"stateBindings" must be an array.');
    } else if (plan.stateBindings.length > 20) {
      errors.push(`"stateBindings" contains ${plan.stateBindings.length} entries; max is 20.`);
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

  return {
    isValid: errors.length === 0,
    errors,
  };
}
