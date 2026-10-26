/**
 * AlgoVision — Universal DSA Problem Input Normalizer
 *
 * Responsibilities:
 * 1. Parses raw test-case strings (e.g. 'nums = [2, 7, 11, 15], target = 9', 's = "()"', 'head = [1,2,3]')
 * 2. Normalizes structured input objects and user custom inputs
 * 3. Enforces strict type conversion without silent coercion or data fabrication
 * 4. Extracts canonical DSA data types: arrays, strings, numbers, linked lists, binary trees, grids
 */

class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

/**
 * Parses raw parameter assignment strings like:
 * 'nums = [2, 7, 11, 15], target = 9'
 * 's = "()[]{}"'
 * 'root = [3, 9, 20, null, null, 15, 7]'
 * 'head = [1, 2, 3, 4, 5]'
 * 'matrix = [[1, 2], [3, 4]]'
 */
function parseRawInputString(rawStr) {
  if (typeof rawStr !== 'string' || rawStr.trim() === '') {
    return {};
  }

  const trimmed = rawStr.trim();

  // 1. If it's valid JSON directly (object or array)
  if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return { array: parsed };
      }
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // Fall through to regex extraction
    }
  }

  const result = {};

  // 2. Tokenize parameter assignments: paramName = value with nested bracket awareness
  let i = 0;
  let matchedAny = false;

  while (i < trimmed.length) {
    while (i < trimmed.length && /[\s,;\n]/.test(trimmed[i])) i++;
    if (i >= trimmed.length) break;

    const eqIdx = trimmed.indexOf('=', i);
    if (eqIdx === -1) break;

    const varCandidate = trimmed.slice(i, eqIdx).trim();
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(varCandidate)) {
      i = eqIdx + 1;
      continue;
    }

    const paramName = varCandidate;
    i = eqIdx + 1;
    while (i < trimmed.length && /\s/.test(trimmed[i])) i++;
    if (i >= trimmed.length) break;

    let valStr = '';
    if (trimmed[i] === '[' || trimmed[i] === '{') {
      const openChar = trimmed[i];
      const closeChar = openChar === '[' ? ']' : '}';
      let depth = 0;
      let start = i;
      let inQuote = null;

      while (i < trimmed.length) {
        const ch = trimmed[i];
        if (inQuote) {
          if (ch === inQuote && trimmed[i - 1] !== '\\') inQuote = null;
        } else if (ch === '"' || ch === "'") {
          inQuote = ch;
        } else if (ch === openChar) {
          depth++;
        } else if (ch === closeChar) {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
        i++;
      }
      valStr = trimmed.slice(start, i);
    } else if (trimmed[i] === '"' || trimmed[i] === "'") {
      const quoteChar = trimmed[i];
      let start = i;
      i++;
      while (i < trimmed.length) {
        if (trimmed[i] === quoteChar && trimmed[i - 1] !== '\\') {
          i++;
          break;
        }
        i++;
      }
      valStr = trimmed.slice(start, i);
    } else {
      let start = i;
      while (i < trimmed.length && !/[,;\n]/.test(trimmed[i])) {
        i++;
      }
      valStr = trimmed.slice(start, i).trim();
    }

    result[paramName] = parseLiteralValue(valStr);
    matchedAny = true;
  }

  // 3. If no "key = val" was found, try extracting a single array or string literal
  if (!matchedAny) {
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      result.array = parseLiteralValue(trimmed);
    } else {
      const arrayMatch = trimmed.match(/\[([\s\S]*?)\]/);
      if (arrayMatch) {
        result.array = parseLiteralValue(arrayMatch[0]);
      } else if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        result.string = trimmed.slice(1, -1);
      } else if (!isNaN(Number(trimmed))) {
        result.number = Number(trimmed);
      }
    }
  }

  return result;
}

/**
 * Parses a single literal string into a JavaScript primitive or collection
 */
function parseLiteralValue(rawVal) {
  if (rawVal === undefined || rawVal === null) return null;
  const s = String(rawVal).trim();

  if (s === 'null' || s === 'None' || s === 'undefined') return null;
  if (s === 'true' || s === 'True') return true;
  if (s === 'false' || s === 'False') return false;

  // String literals
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }

  // Numeric literals
  if (!isNaN(Number(s)) && s !== '') {
    return Number(s);
  }

  // Array literals: [1, 2, 3] or [1, null, 2]
  if (s.startsWith('[') && s.endsWith(']')) {
    try {
      return JSON.parse(s);
    } catch {
      // Manual comma-split parser handling nulls, strings, numbers
      const inner = s.slice(1, -1).trim();
      if (inner === '') return [];

      return inner.split(',').map((item) => {
        const itemTrim = item.trim();
        if (itemTrim === 'null' || itemTrim === 'None' || itemTrim === '') return null;
        if (itemTrim === 'true') return true;
        if (itemTrim === 'false') return false;
        if ((itemTrim.startsWith('"') && itemTrim.endsWith('"')) || (itemTrim.startsWith("'") && itemTrim.endsWith("'"))) {
          return itemTrim.slice(1, -1);
        }
        const num = Number(itemTrim);
        return isNaN(num) ? itemTrim : num;
      });
    }
  }

  // Object literals
  if (s.startsWith('{') && s.endsWith('}')) {
    try {
      return JSON.parse(s);
    } catch {
      return s;
    }
  }

  return s;
}

/**
 * Master input normalizer: extracts and normalizes all parameters
 * from testCase (structured or raw) and problem defaults.
 *
 * @param {Object} testCase - Test case object { inputStructured, inputRaw, ... }
 * @param {Object} problem - Problem document { inputData, ... }
 * @returns {Object} Normalized dictionary of parameters
 */
function normalizeTestCaseInput(testCase, problem = null) {
  const params = {};

  // 1. Ingest problem defaults if available
  if (problem?.inputData) {
    if (typeof problem.inputData === 'object' && !Array.isArray(problem.inputData)) {
      Object.assign(params, problem.inputData);
    } else if (Array.isArray(problem.inputData)) {
      params.array = problem.inputData;
      params.nums = problem.inputData;
    }
  }

  // 2. Ingest structured input from testCase
  if (testCase?.inputStructured && typeof testCase.inputStructured === 'object') {
    Object.assign(params, testCase.inputStructured);
  }

  // 3. Ingest and override with parsed raw input string if available
  if (testCase?.inputRaw) {
    const parsedRaw = parseRawInputString(testCase.inputRaw);
    Object.assign(params, parsedRaw);
  }

  // 4. Ingest direct testCase.input if passed (e.g. from user workspace API)
  if (testCase?.input) {
    if (typeof testCase.input === 'string') {
      Object.assign(params, parseRawInputString(testCase.input));
    } else if (typeof testCase.input === 'object') {
      Object.assign(params, testCase.input);
    }
  }

  return params;
}

/**
 * Extracts a typed numeric array from normalized parameters.
 * Validates each element strictly.
 */
function extractNumericArray(params, keys = ['nums', 'arr', 'array', 'heights', 'values']) {
  let arr = null;
  for (const k of keys) {
    if (Array.isArray(params[k])) {
      arr = params[k];
      break;
    }
  }

  if (!arr && Array.isArray(params)) {
    arr = params;
  }

  if (!Array.isArray(arr)) {
    throw new AppError('No valid numeric array found in test case input.', 400);
  }

  return arr.map((item, idx) => {
    if (typeof item === 'number' && Number.isFinite(item)) return item;
    if (typeof item === 'string' && item.trim() !== '' && Number.isFinite(Number(item))) {
      return Number(item);
    }
    throw new AppError(`Invalid non-numeric element at index ${idx} ("${item}"). Array must contain valid numbers.`, 400);
  });
}

/**
 * Extracts a string parameter from normalized parameters.
 */
function extractString(params, keys = ['s', 'str', 'string', 'word', 'text'], defaultValue = null) {
  for (const k of keys) {
    if (typeof params[k] === 'string') {
      return params[k];
    }
  }

  if (defaultValue !== null) {
    return defaultValue;
  }

  throw new AppError('No valid string found in test case input.', 400);
}

/**
 * Extracts a single integer or number from normalized parameters.
 */
function extractNumber(params, keys = ['target', 'k', 'n', 'val', 'val1', 'val2'], paramName = 'number') {
  for (const k of keys) {
    const val = params[k];
    if (typeof val === 'number' && Number.isFinite(val)) return val;
    if (typeof val === 'string' && val.trim() !== '' && Number.isFinite(Number(val))) {
      return Number(val);
    }
  }

  throw new AppError(`Invalid or missing ${paramName} parameter in test case input. Must be a valid number.`, 400);
}

/**
 * Extracts a linked list values array from normalized parameters.
 */
function extractLinkedList(params, keys = ['head', 'list', 'nodes', 'array', 'values']) {
  let rawList = null;

  for (const k of keys) {
    if (params[k] !== undefined) {
      rawList = params[k];
      break;
    }
  }

  if (rawList === null || rawList === undefined) {
    throw new AppError('No valid linked list found in test case input.', 400);
  }

  if (Array.isArray(rawList)) {
    return rawList.map((item, idx) => {
      if (item && typeof item === 'object') {
        const v = item.val !== undefined ? item.val : item.value !== undefined ? item.value : null;
        if (v !== null && Number.isFinite(Number(v))) return Number(v);
      }
      if (typeof item === 'number' && Number.isFinite(item)) return item;
      if (typeof item === 'string' && item.trim() !== '' && Number.isFinite(Number(item))) return Number(item);
      throw new AppError(`Invalid linked list node value at index ${idx} ("${item}"). Must be a valid number.`, 400);
    });
  }

  throw new AppError('No valid linked list array found in test case input.', 400);
}

/**
 * Extracts a binary tree level-order array from normalized parameters.
 */
function extractBinaryTree(params, keys = ['root', 'tree', 'array', 'values']) {
  let rawTree = null;

  for (const k of keys) {
    if (params[k] !== undefined) {
      rawTree = params[k];
      break;
    }
  }

  if (rawTree === null || rawTree === undefined) {
    throw new AppError('No valid binary tree input found in test case.', 400);
  }

  if (Array.isArray(rawTree)) {
    return rawTree.map((item, idx) => {
      if (item === null || item === undefined || item === 'null' || item === 'None') return null;
      if (typeof item === 'number' && Number.isFinite(item)) return item;
      if (typeof item === 'string' && item.trim() !== '' && Number.isFinite(Number(item))) return Number(item);
      throw new AppError(`Invalid binary tree node value at index ${idx} ("${item}"). Must be a number or null.`, 400);
    });
  }

  throw new AppError('No valid binary tree array found in test case input.', 400);
}

module.exports = {
  parseRawInputString,
  parseLiteralValue,
  normalizeTestCaseInput,
  extractNumericArray,
  extractString,
  extractNumber,
  extractLinkedList,
  extractBinaryTree,
};
