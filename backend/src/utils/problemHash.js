const crypto = require('crypto');

/**
 * Deterministically stringifies any object with sorted keys
 */
const canonicalStringify = (obj) => {
  if (obj === null || obj === undefined) return String(obj);
  if (typeof obj !== 'object') return JSON.stringify(obj);
  if (obj instanceof Date) return obj.toISOString();
  if (typeof obj.toJSON === 'function') {
    obj = obj.toJSON();
    // Re-check type after toJSON
    if (obj === null || obj === undefined) return String(obj);
    if (typeof obj !== 'object') return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalStringify).join(',') + ']';
  }

  const sortedKeys = Object.keys(obj).sort();
  const entries = sortedKeys.map((key) => `${JSON.stringify(key)}:${canonicalStringify(obj[key])}`);
  return '{' + entries.join(',') + '}';
};

/**
 * Computes a deterministic SHA-256 hash for a Problem's structural & text fields.
 * Includes: title, category, difficulty, objective, description, constraints, inputData, outputData, testCases.
 */
const computeProblemHash = (problem) => {
  if (!problem) return '';

  const payload = {
    title: problem.title || '',
    category: problem.category || '',
    difficulty: problem.difficulty || '',
    objective: problem.objective || '',
    description: problem.description || '',
    constraints: problem.constraints || [],
    inputData: problem.inputData || {},
    outputData: problem.outputData || {},
    testCases: (problem.testCases || []).map((tc) => ({
      id: tc.id,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
      inputStructured: tc.inputStructured || null,
      outputStructured: tc.outputStructured || null,
    })),
  };

  const canonicalString = canonicalStringify(payload);
  return crypto.createHash('sha256').update(canonicalString).digest('hex');
};

module.exports = {
  canonicalStringify,
  computeProblemHash,
};
