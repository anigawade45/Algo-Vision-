import { EXECUTION_TRACE_SCHEMA_VERSION, TRACE_SOURCES } from './executionTraceTypes.js';
import { validateVisualizationEvent } from '../events/visualizationEvent.validator.js';

/**
 * Validates an Execution Trace object against the Phase 12 Execution Trace Contract.
 *
 * @param {Object} trace - Execution Trace object to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateExecutionTrace(trace) {
  const errors = [];

  if (!trace || typeof trace !== 'object') {
    return {
      isValid: false,
      errors: ['Execution trace must be a valid non-null object.'],
    };
  }

  // 1. Mandatory Schema Version
  if (trace.schemaVersion !== EXECUTION_TRACE_SCHEMA_VERSION) {
    errors.push(
      `Invalid or unsupported trace schemaVersion: ${trace.schemaVersion}. Expected ${EXECUTION_TRACE_SCHEMA_VERSION}.`
    );
  }

  // 2. Mandatory Trace ID
  if (!trace.traceId || typeof trace.traceId !== 'string' || trace.traceId.trim() === '') {
    errors.push('Trace must contain a non-empty string "traceId".');
  }

  // 3. Mandatory Problem ID
  if (!trace.problemId || typeof trace.problemId !== 'string' || trace.problemId.trim() === '') {
    errors.push('Trace must contain a non-empty string "problemId".');
  }

  // 4. Mandatory Initial State
  if (!trace.initialState || typeof trace.initialState !== 'object' || !trace.initialState.primitives) {
    errors.push('Trace must contain a valid "initialState" object with "primitives".');
  }

  // 5. Mandatory Steps Array
  if (!Array.isArray(trace.steps)) {
    errors.push('Trace must contain a "steps" array.');
  } else {
    const seenStepNumbers = new Set();

    trace.steps.forEach((stepObj, sIdx) => {
      const stepPrefix = `Step [${sIdx}]`;

      if (!stepObj || typeof stepObj !== 'object') {
        errors.push(`${stepPrefix}: Step entry must be an object.`);
        return;
      }

      if (typeof stepObj.stepNumber !== 'number' || stepObj.stepNumber < 0 || !Number.isInteger(stepObj.stepNumber)) {
        errors.push(`${stepPrefix}: Step must contain a non-negative integer "stepNumber".`);
      } else {
        if (seenStepNumbers.has(stepObj.stepNumber)) {
          errors.push(`${stepPrefix}: Duplicate stepNumber ${stepObj.stepNumber} detected.`);
        } else {
          seenStepNumbers.add(stepObj.stepNumber);
        }
      }

      if (!stepObj.id || typeof stepObj.id !== 'string') {
        errors.push(`${stepPrefix}: Step must contain a string "id".`);
      }

      if (!Array.isArray(stepObj.events)) {
        errors.push(`${stepPrefix}: Step must contain an "events" array.`);
      } else {
        stepObj.events.forEach((evt, eIdx) => {
          const evtRes = validateVisualizationEvent(evt);
          if (!evtRes.isValid) {
            errors.push(
              `${stepPrefix} Event [${eIdx}] (${evt?.id || 'unknown'}): ${evtRes.errors.join(' | ')}`
            );
          }
        });
      }
    });
  }

  // 6. Cross-check Result Consistency
  if (trace.result !== undefined && trace.finalState?.result !== undefined) {
    if (JSON.stringify(trace.result) !== JSON.stringify(trace.finalState.result)) {
      errors.push('Contradictory result detected between trace.result and trace.finalState.result.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Normalizes an execution trace by sorting steps and events, freezing objects,
 * and assigning default metadata fields.
 *
 * @param {Object} rawTrace - Raw trace object
 * @returns {Object} Normalized, frozen Execution Trace
 */
export function normalizeExecutionTrace(rawTrace) {
  const validation = validateExecutionTrace(rawTrace);
  if (!validation.isValid) {
    throw new Error(`Trace normalization failed:\n- ${validation.errors.join('\n- ')}`);
  }

  const normalizedSteps = [...rawTrace.steps]
    .sort((a, b) => a.stepNumber - b.stepNumber)
    .map((stepObj) => ({
      ...stepObj,
      events: [...(stepObj.events || [])].sort((a, b) => (a.order || 0) - (b.order || 0)),
    }));

  return Object.freeze({
    schemaVersion: rawTrace.schemaVersion || EXECUTION_TRACE_SCHEMA_VERSION,
    traceId: rawTrace.traceId,
    problemId: rawTrace.problemId,
    title: rawTrace.title || 'Execution Trace',
    source: rawTrace.source || TRACE_SOURCES.MOCK,
    metadata: {
      language: 'conceptual',
      algorithm: 'Execution Trace Engine',
      ...(rawTrace.metadata || {}),
    },
    initialState: Object.freeze(JSON.parse(JSON.stringify(rawTrace.initialState))),
    steps: Object.freeze(normalizedSteps),
    finalState: rawTrace.finalState ? Object.freeze(JSON.parse(JSON.stringify(rawTrace.finalState))) : null,
    result: rawTrace.result !== undefined ? rawTrace.result : null,
    totalSteps: normalizedSteps.length,
    minStep: normalizedSteps.length > 0 ? normalizedSteps[0].stepNumber : 0,
    maxStep: normalizedSteps.length > 0 ? normalizedSteps[normalizedSteps.length - 1].stepNumber : 0,
  });
}
