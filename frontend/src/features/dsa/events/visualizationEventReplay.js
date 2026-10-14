import { processVisualizationEvent } from './visualizationEventProcessor.js';

/**
 * Pure Event Replay Engine for AlgoVision Visualization Events (Phase 11).
 * Replays sequential event streams starting from initialState up to targetStep.
 *
 * @param {Object} initialState - Initial scene primitive state
 * @param {Array} events - Ordered array of visualization events
 * @param {number} targetStep - Target step number to replay up to
 * @returns {Object} Calculated scene state at targetStep
 */
export function replayVisualizationEvents(initialState = {}, events = [], targetStep = 0) {
  if (!Array.isArray(events) || events.length === 0) {
    return initialState;
  }

  // Filter events occurring at or prior to targetStep, sorted by step and order
  const relevantEvents = events
    .filter((evt) => evt && typeof evt.step === 'number' && evt.step <= targetStep)
    .sort((a, b) => a.step - b.step);

  let currentState = initialState;

  for (const evt of relevantEvents) {
    currentState = processVisualizationEvent(currentState, evt);
  }

  return currentState;
}

/**
 * Returns all events associated with a specific step number.
 *
 * @param {Array} events - Ordered array of visualization events
 * @param {number} step - Step index number
 * @returns {Array} List of events for that step
 */
export function getEventsForStep(events = [], step = 0) {
  if (!Array.isArray(events)) return [];
  return events.filter((evt) => evt && evt.step === step);
}

/**
 * Groups an array of events by their step number.
 *
 * @param {Array} events - Ordered array of visualization events
 * @returns {Object} Map of { [stepNumber]: Event[] }
 */
export function groupEventsByStep(events = []) {
  if (!Array.isArray(events)) return {};
  const map = {};
  events.forEach((evt) => {
    if (!evt || typeof evt.step !== 'number') return;
    if (!map[evt.step]) map[evt.step] = [];
    map[evt.step].push(evt);
  });
  return map;
}
