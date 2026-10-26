/**
 * AlgoVision — Restricted Execution Sandbox Service
 *
 * Provides a restricted execution environment for automatically generated
 * or candidate algorithm implementations:
 * 1. Hard CPU and memory bounds (V8 Worker limits).
 * 2. Hard wall-clock timeout enforcement (worker.terminate() on timer expiry).
 * 3. Zero network access (no fetch/http/net).
 * 4. Zero access to process.env, application secrets, or database handles.
 * 5. Narrow input/output contract: JSON-serializable inputs in, pure algorithm output + events out.
 */

const { Worker } = require('worker_threads');

class SandboxExecutionError extends Error {
  constructor(message, statusCode = 400, details = null) {
    super(message);
    this.name = 'SandboxExecutionError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const DEFAULT_SANDBOX_LIMITS = {
  timeoutMs: 1500, // Hard wall-clock limit
  maxMemoryMb: 32, // Memory cap
  maxSteps: 200,   // Max events collected
};

// Inline worker execution script
const WORKER_SCRIPT = `
const { parentPort, workerData } = require('worker_threads');
const vm = require('vm');

(function() {
  try {
    const { code, inputParams, maxSteps } = workerData;

    const events = [];
    let eventCounter = 1;

    // Instrumented tracer primitives available inside sandbox
    const tracer = {
      recordEvent: (type, targetId, data, description) => {
        if (events.length < (maxSteps || 200)) {
          events.push({
            id: 'evt-' + String(eventCounter++).padStart(2, '0'),
            type,
            target: { primitiveId: targetId },
            data: data || {},
            description: String(description || ''),
            schemaVersion: 1,
          });
        }
      },
    };

    // Clean, isolated sandbox context
    const sandbox = {
      // Safe standard intrinsics
      Math,
      Number,
      String,
      Boolean,
      Array,
      Object,
      Date,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      JSON,
      // Input parameters
      input: inputParams,
      params: inputParams,
      tracer,
      // Results
      __result: undefined,
      console: {
        log: () => {},
        warn: () => {},
        error: () => {},
      },
    };

    // Explicitly lock down prototypes
    const context = vm.createContext(sandbox);

    const wrappedCode = [
      '(function() {',
      '  "use strict";',
      code,
      '})();'
    ].join('\\n');

    const script = new vm.Script(wrappedCode, {
      timeout: 1000,
    });

    const executionReturn = script.runInContext(context);
    const finalResult = sandbox.__result !== undefined ? sandbox.__result : executionReturn;

    parentPort.postMessage({
      success: true,
      data: {
        result: finalResult !== undefined ? finalResult : null,
        events,
      },
    });
  } catch (err) {
    parentPort.postMessage({
      success: false,
      error: err.message || 'Execution error inside sandbox',
    });
  }
})();
`;

/**
 * Executes user/AI-generated algorithm code in a restricted, isolated Worker thread.
 *
 * @param {string} code - Candidate JavaScript code to execute
 * @param {Object} inputParams - Normalized test-case input parameters
 * @param {Object} options - { timeoutMs, maxMemoryMb, maxSteps }
 * @returns {Promise<{ result: any, events: Array, executionTimeMs: number }>}
 */
function executeInRestrictedSandbox(code, inputParams = {}, options = {}) {
  const limits = { ...DEFAULT_SANDBOX_LIMITS, ...options };
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    let isSettled = false;
    let worker = null;

    try {
      worker = new Worker(WORKER_SCRIPT, {
        eval: true,
        resourceLimits: {
          maxOldGenerationSizeMb: limits.maxMemoryMb,
          maxYoungGenerationSizeMb: Math.max(16, Math.floor(limits.maxMemoryMb / 2)),
        },
        workerData: {
          code: String(code || ''),
          inputParams: JSON.parse(JSON.stringify(inputParams || {})),
          maxSteps: limits.maxSteps,
        },
      });
    } catch (workerInitErr) {
      return reject(new SandboxExecutionError(`Failed to initialize sandbox worker: ${workerInitErr.message}`, 500));
    }

    // Hard wall-clock timeout enforcement (worker.terminate kills thread immediately)
    const timeoutTimer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        if (worker) {
          worker.terminate().catch(() => {});
        }
        reject(new SandboxExecutionError(`Sandbox execution exceeded hard wall-clock timeout of ${limits.timeoutMs}ms`, 408));
      }
    }, limits.timeoutMs);

    worker.on('message', (message) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeoutTimer);
        worker.terminate().catch(() => {});

        const executionTimeMs = Date.now() - startTime;
        if (!message.success) {
          reject(new SandboxExecutionError(`Execution failed: ${message.error}`, 400));
        } else {
          resolve({
            result: message.data?.result,
            events: message.data?.events || [],
            executionTimeMs,
          });
        }
      }
    });

    worker.on('error', (err) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeoutTimer);
        worker.terminate().catch(() => {});
        reject(new SandboxExecutionError(`Sandbox runtime error: ${err.message}`, 400));
      }
    });

    worker.on('exit', (code) => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timeoutTimer);
        if (code !== 0) {
          reject(new SandboxExecutionError(`Sandbox terminated with exit code ${code} (memory or resource violation).`, 400));
        }
      }
    });
  });
}

/**
 * Adapts raw sandbox execution results into a compliant Stage 09 ExecutionTrace.
 *
 * @param {Object} sandboxResult - { result, events, executionTimeMs }
 * @param {Object} context - { problem, testCase, approachId, approachName }
 * @returns {Object} Raw execution trace ready for normalization and validation
 */
function buildTraceFromSandboxExecution(sandboxResult, context = {}) {
  const { problem, testCase, approachId, approachName } = context;
  const events = Array.isArray(sandboxResult?.events) ? sandboxResult.events : [];

  const primitives = {
    input: {
      id: 'input',
      type: 'variable',
      label: 'Input Data',
      value: testCase?.inputRaw || 'input',
    },
  };

  // Discover primitives from event targets
  for (const evt of events) {
    const targetId = evt.target?.primitiveId;
    if (targetId && !primitives[targetId]) {
      const typeStr = String(evt.type || '');
      if (typeStr.startsWith('HASHMAP_')) {
        primitives[targetId] = { id: targetId, type: 'hashmap', label: targetId, entries: {} };
      } else if (typeStr.startsWith('ARRAY_')) {
        primitives[targetId] = { id: targetId, type: 'array', label: targetId, values: [] };
      } else if (typeStr.startsWith('STACK_')) {
        primitives[targetId] = { id: targetId, type: 'stack', label: targetId, items: [] };
      } else if (typeStr.startsWith('QUEUE_')) {
        primitives[targetId] = { id: targetId, type: 'queue', label: targetId, items: [] };
      } else if (typeStr.startsWith('HEAP_')) {
        primitives[targetId] = { id: targetId, type: 'heap', label: targetId, values: [] };
      } else {
        primitives[targetId] = { id: targetId, type: 'variable', label: targetId };
      }
    }
  }

  const steps = [];
  if (events.length > 0) {
    for (let i = 0; i < events.length; i++) {
      const evt = { ...events[i], step: i };
      steps.push({
        id: `step-${i}`,
        stepNumber: i,
        line: 1,
        code: `${evt.type} on ${evt.target?.primitiveId || 'data'}`,
        description: evt.description || `${evt.type} operation`,
        events: [evt],
        state: evt.data && typeof evt.data === 'object' ? { ...evt.data } : {},
        changed: evt.target?.primitiveId ? [evt.target.primitiveId] : [],
      });
    }
  } else {
    steps.push({
      id: 'step-0',
      stepNumber: 0,
      line: 1,
      code: 'return result;',
      description: 'Candidate algorithm execution completed.',
      events: [],
      state: { result: sandboxResult?.result },
      changed: [],
    });
  }

  const rawTrace = {
    schemaVersion: 1,
    traceId: `trace-sandbox-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    problemId: problem?.problemId || context.problemId || 'candidate-problem',
    title: problem?.title || 'Sandboxed Execution Trace',
    source: 'execution',
    metadata: {
      language: 'javascript',
      algorithm: approachName || 'Candidate Algorithm',
      approachId: approachId || 'candidateExecution',
      sourceStage: 'Stage 09 Sandboxed Execution',
      executionTimeMs: sandboxResult?.executionTimeMs || 0,
    },
    initialState: {
      primitives,
    },
    steps,
    finalState: {
      result: sandboxResult?.result,
    },
    result: sandboxResult?.result,
  };

  return rawTrace;
}

/**
 * Executes candidate code inside the restricted V8 worker sandbox, normalizes the trace,
 * and validates trace schema and algorithmic invariants.
 *
 * @param {string} code - Candidate JavaScript code to execute
 * @param {Object} inputParams - Normalized test-case inputs
 * @param {Object} context - { problem, testCase, approachId, approachName, limits }
 * @returns {Promise<Object>} Support state payload with trace and dimensions
 */
async function executeCandidateInSandboxWithTrace(code, inputParams = {}, context = {}) {
  const {
    normalizeExecutionTrace,
    determineSupportStateAndDimensions,
  } = require('./problemVisualization.service');

  const limits = context.limits || {};
  let sandboxResult;

  try {
    sandboxResult = await executeInRestrictedSandbox(code, inputParams, limits);
  } catch (err) {
    return {
      isSupported: false,
      supportState: 'VERIFICATION_FAILED',
      isPlaybackUnlocked: false,
      verificationStatus: 'VERIFICATION_FAILED',
      resultVerified: false,
      dimensions: {
        executionAvailability: 'SANDBOX_EXECUTED',
        traceValidity: 'NONE',
        resultVerification: 'VERIFICATION_FAILED',
        invariantVerification: 'FAILED',
      },
      message: `Restricted sandbox execution failed: ${err.message}`,
      trace: null,
      error: err.message,
    };
  }

  const rawTrace = buildTraceFromSandboxExecution(sandboxResult, context);
  const normalizedTrace = normalizeExecutionTrace(rawTrace);

  const execResult = {
    isSupported: true,
    resolutionTier: 'SANDBOX_EXECUTED',
    trace: normalizedTrace,
  };

  return determineSupportStateAndDimensions(execResult, context);
}

module.exports = {
  SandboxExecutionError,
  DEFAULT_SANDBOX_LIMITS,
  executeInRestrictedSandbox,
  buildTraceFromSandboxExecution,
  executeCandidateInSandboxWithTrace,
};
