import { VISUALIZATION_EVENTS, EVENT_SCHEMA_VERSION } from './visualizationEventTypes.js';

/**
 * Validates a single Visualization Event object against the Phase 11 Event Schema Contract.
 *
 * @param {Object} event - The event object to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateVisualizationEvent(event) {
  const errors = [];

  if (!event || typeof event !== 'object') {
    return {
      isValid: false,
      errors: ['Event must be a valid non-null object.'],
    };
  }

  // 1. Mandatory ID
  if (!event.id || typeof event.id !== 'string' || event.id.trim() === '') {
    errors.push('Event must contain a non-empty string "id".');
  }

  // 2. Mandatory Step
  if (typeof event.step !== 'number' || event.step < 0 || !Number.isInteger(event.step)) {
    errors.push('Event must contain a valid non-negative integer "step".');
  }

  // 3. Mandatory Event Type
  if (!event.type || typeof event.type !== 'string') {
    errors.push('Event must contain a string "type".');
  } else {
    const validTypes = Object.values(VISUALIZATION_EVENTS);
    if (!validTypes.includes(event.type)) {
      errors.push(`Unknown event type "${event.type}". Must be a recognized VISUALIZATION_EVENTS token.`);
    }
  }

  // 4. Mandatory Data
  if (!event.data || typeof event.data !== 'object') {
    errors.push('Event must contain a "data" object.');
  }

  // 5. Optional Target Validation
  if (event.target !== undefined && (typeof event.target !== 'object' || event.target === null)) {
    errors.push('Optional field "target" must be an object containing "primitiveId" when specified.');
  }

  // 6. Optional Highlights Validation
  if (event.highlights !== undefined && !Array.isArray(event.highlights)) {
    errors.push('Optional field "highlights" must be an array when specified.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an array of Visualization Events.
 *
 * @param {Array} events - Array of events
 * @returns {{ isValid: boolean, invalidEvents: Array<{ index: number, event: Object, errors: string[] }> }}
 */
export function validateVisualizationEvents(events) {
  if (!Array.isArray(events)) {
    return {
      isValid: false,
      invalidEvents: [{ index: -1, event: events, errors: ['Events must be an array.'] }],
    };
  }

  const invalidEvents = [];

  events.forEach((evt, idx) => {
    const res = validateVisualizationEvent(evt);
    if (!res.isValid) {
      invalidEvents.push({
        index: idx,
        event: evt,
        errors: res.errors,
      });
    }
  });

  return {
    isValid: invalidEvents.length === 0,
    invalidEvents,
  };
}
