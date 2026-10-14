import { EXECUTION_TRACE_SCHEMA_VERSION, TRACE_SOURCES } from '../trace/executionTraceTypes.js';
import { validateExecutionTrace, normalizeExecutionTrace } from '../trace/executionTraceValidator.js';
import { VISUALIZATION_EVENTS, EVENT_SCHEMA_VERSION } from '../events/visualizationEventTypes.js';
import { getDryRunMappingForProblem } from './dryRunVisualizationMappings.js';

/**
 * Pure, deterministic adapter converting Stage 08 Dry Run execution data
 * into the Phase 12 ExecutionTrace format.
 *
 * @param {Object} dryRun - Stage 08 Dry Run data object
 * @param {Object} [options={}] - Options: { mapping, strict, traceId }
 * @returns {{ trace: Object|null, diagnostics: Array<Object>, isValid: boolean, errors: Array<string> }}
 */
export function adaptDryRunToExecutionTrace(dryRun, options = {}) {
  const diagnostics = [];

  if (!dryRun || typeof dryRun !== 'object' || !Array.isArray(dryRun.steps) || dryRun.steps.length === 0) {
    diagnostics.push({
      severity: 'error',
      message: 'Dry Run contains no execution steps.',
    });
    return {
      trace: null,
      diagnostics,
      isValid: false,
      errors: ['Dry Run contains no execution steps.'],
    };
  }

  const problemId = dryRun.problemId || dryRun.id || 'generic-problem';
  const mapping = options.mapping || getDryRunMappingForProblem(problemId, dryRun);
  const traceId = options.traceId || `dry-run-${problemId}`;
  const strict = options.strict === true;

  // 1. Build initial scene state primitives
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
        ...(primConfig.type === 'pointer' ? { activeIndex: 0, pointerLabels: { 0: { label: primConfig.label, color: primConfig.color || 'blue' } } } : {}),
        ...(primConfig.type === 'heap' ? { values: [], heapType: primConfig.heapType || 'min', showArrayBuffer: true } : {}),
        ...(primConfig.type === 'resource' ? { value: primConfig.max || 5, max: primConfig.max || 5, icon: primConfig.icon || '🧱' } : {}),
        ...(primConfig.type === 'variable' ? { name: primConfig.name || primKey, value: 0, typeLabel: primConfig.typeLabel || 'number' } : {}),
        ...(primConfig.type === 'stack' ? { items: [] } : {}),
        ...(primConfig.type === 'queue' ? { items: [] } : {}),
      };
    });
  }

  // Populate initial state values from dryRun.initialState if present
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
        }
      }
    });
  }

  const initialState = {
    schemaVersion: EVENT_SCHEMA_VERSION,
    problemId,
    title: dryRun.input?.title || dryRun.title || problemId,
    primitives: initialPrimitives,
  };

  // 2. Translate Steps and generate Events
  const steps = [];
  let eventCounter = 1;
  let previousStateMap = extractStateMap(dryRun.steps[0]?.before || dryRun.initialState);

  dryRun.steps.forEach((dryStep, index) => {
    const stepNumber = dryStep.stepNo !== undefined ? dryStep.stepNo : index;
    const stepEvents = [];

    const pseudocodeLine = dryStep.pseudocodeLine !== undefined
      ? dryStep.pseudocodeLine
      : (Array.isArray(dryStep.pseudocodeLines) ? dryStep.pseudocodeLines[0] : null);
    
    const condition = dryStep.condition?.text || (typeof dryStep.condition === 'string' ? dryStep.condition : null);
    const action = dryStep.action?.description || (typeof dryStep.action === 'string' ? dryStep.action : null);
    
    const currentStateMap = extractStateMap(dryStep.after || dryStep);

    // Track unmapped variables for diagnostics
    Object.keys(currentStateMap).forEach((key) => {
      if (mapping.variableMap && !mapping.variableMap[key]) {
        diagnostics.push({
          severity: 'warning',
          stepNumber,
          field: key,
          message: `Unmapped dry run variable: "${key}"`,
        });
      }
    });

    // Generate Events based on mapped variable changes
    if (mapping.variableMap) {
      Object.keys(mapping.variableMap).forEach((varName) => {
        const varConfig = mapping.variableMap[varName];
        const prevVal = parseDryRunValue(previousStateMap[varName]);
        const currVal = parseDryRunValue(currentStateMap[varName]);

        const isExplicitChange = Array.isArray(dryStep.changes) && dryStep.changes.includes(varName);
        const hasChanged = JSON.stringify(prevVal) !== JSON.stringify(currVal) || stepNumber === 0 || isExplicitChange;

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

            const isHeapChangedInStep = dryStep.changes?.includes(varName) || dryStep.operation === 'USE_BRICKS' || dryStep.operation === 'LADDER_CLIMB';

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
            } else if (isHeapChangedInStep) {
              // Re-allocation operation (insert climb into heap, then pop min climb)
              const climbVal = parseDryRunValue(currentStateMap['currentClimb']) || 3;
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.HEAP_INSERT,
                target: { primitiveId: varConfig.targetId },
                data: { value: climbVal, resultingState: [climbVal, ...arrCurr] },
                description: `Insert climb ${climbVal} into Min-Heap`,
                schemaVersion: EVENT_SCHEMA_VERSION,
              });
              stepEvents.push({
                id: `evt-dr-${String(eventCounter++).padStart(2, '0')}`,
                step: stepNumber,
                type: VISUALIZATION_EVENTS.HEAP_REMOVE,
                target: { primitiveId: varConfig.targetId },
                data: { value: climbVal, resultingState: [...arrCurr] },
                description: `Pop smallest climb ${climbVal} from Min-Heap`,
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
            }
          }
        }
      });
    }

    // Terminal step return event check
    if (index === dryRun.steps.length - 1 || dryStep.operation === 'STOP_RESULT') {
      const resultValue = dryRun.result !== undefined ? dryRun.result : (dryStep.currentResult || dryRun.input?.expectedOutput);
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

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      label: dryStep.title || dryStep.label || `Step ${stepNumber}`,
      operation: dryStep.operation || 'STEP',
      explanation: dryStep.explanation || action || '',
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

  const finalResultValue = dryRun.result !== undefined ? dryRun.result : dryRun.input?.expectedOutput;

  const rawTrace = {
    schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
    traceId,
    problemId,
    title: dryRun.input?.title || dryRun.title || problemId,
    source: TRACE_SOURCES.DRY_RUN,
    metadata: {
      language: 'pseudocode',
      algorithm: dryRun.approachName || 'Dry Run Algorithm',
      approachId: dryRun.approachId,
      sourceStage: 'Stage 08 Dry Run',
    },
    initialState,
    steps,
    finalState: {
      result: finalResultValue,
    },
    result: finalResultValue,
  };

  if (strict && diagnostics.some((d) => d.severity === 'error')) {
    return {
      trace: null,
      diagnostics,
      isValid: false,
      errors: diagnostics.filter((d) => d.severity === 'error').map((d) => d.message),
    };
  }

  const validationResult = validateExecutionTrace(rawTrace);
  const normalizedTrace = normalizeExecutionTrace(rawTrace);

  return {
    trace: normalizedTrace,
    diagnostics,
    isValid: validationResult.isValid,
    errors: validationResult.errors,
  };
}

/**
 * Parses raw Dry Run variable values (strings like "[ 3, 5 ]" or numbers).
 */
function parseDryRunValue(val) {
  if (val === undefined || val === null || val === '-' || val === '[ ]' || val === '{ }') {
    if (val === '[ ]') return [];
    if (val === '{ }') return {};
    return val;
  }
  if (typeof val === 'number' || Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const items = trimmed
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((s) => (isNaN(Number(s)) ? s : Number(s)));
        return items;
      } catch (e) {
        return trimmed;
      }
    }
    if (!isNaN(Number(trimmed))) {
      return Number(trimmed);
    }
  }
  return val;
}

/**
 * Extracts a state map from Dry Run step state objects.
 */
function extractStateMap(stateObj) {
  if (!stateObj) return {};
  if (stateObj.variables && Array.isArray(stateObj.variables)) {
    const map = {};
    stateObj.variables.forEach((v) => {
      if (v.name) map[v.name] = v.value;
    });
    return map;
  }
  return typeof stateObj === 'object' ? stateObj : {};
}
