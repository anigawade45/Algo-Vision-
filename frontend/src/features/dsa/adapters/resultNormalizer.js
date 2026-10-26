/**
 * Canonical Result and Solution-Pair Normalizer for AlgoVision Stage 09
 *
 * Normalizes disparate representations of algorithm results and matched indices
 * across trace sources, event streams, and visual components.
 */

/**
 * Normalizes any raw representation of a matched pair / solution result into a canonical number array.
 * Supported shapes:
 * - Direct array of numbers: [1, 2]
 * - Object with indices/result/matchedPair: { matchedPair: [1, 2] }, { result: [1, 2] }, { indices: [1, 2] }
 * - Object with named pairs: { first: 1, second: 2 }, { index1: 1, index2: 2 }
 * - JSON or comma-separated string: "[1, 2]", "1, 2"
 *
 * @param {*} raw - Raw input representation
 * @returns {number[]|null} Normalized array of integer indices or null
 */
export function normalizeMatchedPair(raw) {
  if (raw === null || raw === undefined) return null;

  // 1. Direct array of numbers
  if (Array.isArray(raw)) {
    if (
      raw.length >= 2 &&
      raw.every((idx) => typeof idx === 'number' && Number.isInteger(idx) && idx >= 0)
    ) {
      return [...raw];
    }
    // Also handle array of string indices e.g. ["1", "2"]
    if (
      raw.length >= 2 &&
      raw.every((idx) => (typeof idx === 'string' || typeof idx === 'number') && !isNaN(Number(idx)) && Number(idx) >= 0)
    ) {
      return raw.map(Number);
    }
    return null;
  }

  // 2. String representation e.g. "[1, 2]" or "1, 2"
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return normalizeMatchedPair(parsed);
      } catch {
        // Fall through to manual split
      }
    }
    const parts = trimmed
      .replace(/[\[\]]/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map(Number);
    if (parts.length >= 2 && parts.every((n) => !isNaN(n) && Number.isInteger(n) && n >= 0)) {
      return parts;
    }
    return null;
  }

  // 3. Object with properties
  if (typeof raw === 'object') {
    if (Array.isArray(raw.matchedPair)) return normalizeMatchedPair(raw.matchedPair);
    if (Array.isArray(raw.result)) return normalizeMatchedPair(raw.result);
    if (Array.isArray(raw.indices)) return normalizeMatchedPair(raw.indices);
    if (raw.first !== undefined && raw.second !== undefined) {
      const f = Number(raw.first);
      const s = Number(raw.second);
      if (!isNaN(f) && !isNaN(s) && f >= 0 && s >= 0) return [f, s];
    }
    if (raw.index1 !== undefined && raw.index2 !== undefined) {
      const f = Number(raw.index1);
      const s = Number(raw.index2);
      if (!isNaN(f) && !isNaN(s) && f >= 0 && s >= 0) return [f, s];
    }
  }

  return null;
}

/**
 * Extracts and canonicalizes the solution pair from step, state, and highlights.
 *
 * @param {Object} context
 * @param {Object} [context.step] - Active step object
 * @param {Object} [context.state] - Active scene state
 * @param {Object} [context.highlights] - Step highlights
 * @returns {number[]|null} Canonical solution pair e.g. [1, 2] or null if not yet discovered
 */
export function extractCanonicalSolutionPair({ step, state, highlights } = {}) {
  // Priority 1: Direct highlights on step or prop
  const fromHighlights = normalizeMatchedPair(highlights?.matchedPair || step?.highlights?.matchedPair);
  if (fromHighlights) return fromHighlights;

  // Priority 2: Direct state result
  const fromState = normalizeMatchedPair(state?.result || step?.state?.result);
  if (fromState) return fromState;

  // Priority 3: Primitives matchedIndices
  const fromPrimitives = normalizeMatchedPair(
    state?.primitives?.nums?.matchedIndices ||
    step?.state?.primitives?.nums?.matchedIndices
  );
  if (fromPrimitives) return fromPrimitives;

  // Priority 4: Search events in step for RETURN or ARRAY_COMPARE with matched = true
  const events = Array.isArray(step?.events) ? step.events : [];
  for (const evt of events) {
    if ((evt.type === 'RETURN' || evt.type === 'ALGORITHM_RETURN') && evt.data) {
      const fromReturn = normalizeMatchedPair(evt.data.result || evt.data.value);
      if (fromReturn) return fromReturn;
    }
    if (
      (evt.type === 'ARRAY_COMPARE' || evt.type === 'COMPARE') &&
      evt.data?.matched &&
      evt.data?.indices
    ) {
      const fromCompare = normalizeMatchedPair(evt.data.indices);
      if (fromCompare) return fromCompare;
    }
  }

  return null;
}
