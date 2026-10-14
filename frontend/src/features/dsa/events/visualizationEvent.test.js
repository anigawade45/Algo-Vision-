import { validateVisualizationEvent, validateVisualizationEvents } from './visualizationEvent.validator.js';
import { processVisualizationEvent } from './visualizationEventProcessor.js';
import { replayVisualizationEvents, getEventsForStep } from './visualizationEventReplay.js';
import { furthestBuildingInitialState, furthestBuildingEvents } from './mockVisualizationEvents.js';
import { VISUALIZATION_EVENTS } from './visualizationEventTypes.js';

/**
 * Phase 11 — Event Schema, Processor & Replay Test Verification Suite
 * Verifies contract specifications, immutability, determinism, and multi-primitive event composition.
 */
export function runVisualizationEventTests() {
  const results = {
    validation: 'FAIL',
    processing: 'FAIL',
    replay: 'FAIL',
    immutability: 'FAIL',
    determinism: 'FAIL',
    multiEventSteps: 'FAIL',
    unknownEvents: 'FAIL',
    multiPrimitiveComposition: 'FAIL',
  };

  try {
    // 1. Validation Test
    const validEvt = {
      id: 'test-evt-01',
      step: 1,
      type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
      data: { index: 2, pointerId: 'current' },
    };
    const invalidEvt = { step: -1 };

    const validRes = validateVisualizationEvent(validEvt);
    const invalidRes = validateVisualizationEvent(invalidEvt);

    if (validRes.isValid && !invalidRes.isValid && invalidRes.errors.length >= 3) {
      results.validation = 'PASS';
    }

    // 2. State Immutability Test
    const initialState = {
      primitives: {
        heights: { type: 'array', values: [4, 2, 7], activeIndex: 0 },
        bricks: { type: 'resource', value: 5, max: 5 },
      },
    };
    const stateCopy = JSON.parse(JSON.stringify(initialState));

    const nextState = processVisualizationEvent(initialState, {
      id: 'test-evt-02',
      step: 1,
      type: VISUALIZATION_EVENTS.RESOURCE_CONSUME,
      target: { primitiveId: 'bricks' },
      data: { amount: 3, previousValue: 5, value: 2 },
    });

    if (
      JSON.stringify(initialState) === JSON.stringify(stateCopy) &&
      nextState.primitives.bricks.value === 2 &&
      initialState.primitives.bricks.value === 5
    ) {
      results.immutability = 'PASS';
    }

    // 3. Unknown Event Safety Test
    const unknownEvtState = processVisualizationEvent(initialState, {
      id: 'test-evt-03',
      step: 1,
      type: 'UNKNOWN_MAGIC_EVENT',
      data: { foo: 'bar' },
    });

    if (unknownEvtState && typeof unknownEvtState === 'object') {
      results.unknownEvents = 'PASS';
    }

    // 4. Processing Test
    const processedState = processVisualizationEvent(initialState, {
      id: 'test-evt-04',
      step: 1,
      type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
      target: { primitiveId: 'heights' },
      data: { index: 2, pointerId: 'i' },
    });

    if (processedState.primitives.heights.activeIndex === 2) {
      results.processing = 'PASS';
    }

    // 5. Determinism Test
    const runA = processVisualizationEvent(initialState, validEvt);
    const runB = processVisualizationEvent(initialState, validEvt);
    if (JSON.stringify(runA) === JSON.stringify(runB)) {
      results.determinism = 'PASS';
    }

    // 6. Replay Engine Test
    const replayedStep4 = replayVisualizationEvents(
      furthestBuildingInitialState,
      furthestBuildingEvents,
      4
    );

    if (
      replayedStep4.primitives.heights.activeIndex === 4 &&
      replayedStep4.primitives.bricks.value === 2 &&
      replayedStep4.primitives.climbs.values.length === 1 &&
      replayedStep4.primitives.climbs.values[0] === 5
    ) {
      results.replay = 'PASS';
      results.multiPrimitiveComposition = 'PASS';
    }

    // 7. Multi-Event Step Test
    const step4Events = getEventsForStep(furthestBuildingEvents, 4);
    if (step4Events.length === 5) {
      results.multiEventSteps = 'PASS';
    }
  } catch (err) {
    console.error('Visualization Event Test Exception:', err);
  }

  return results;
}
