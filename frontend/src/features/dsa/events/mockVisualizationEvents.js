import { VISUALIZATION_EVENTS, EVENT_SCHEMA_VERSION } from './visualizationEventTypes.js';

/**
 * Mock Visualization Event Trace — LeetCode 1642. Furthest Building You Can Reach (Phase 11 Demo)
 * Proves that multiple primitives (Array + Pointer + Min Heap + Resources + Variables)
 * can coexist and render dynamically using generic visualization events.
 */

export const furthestBuildingInitialState = {
  schemaVersion: EVENT_SCHEMA_VERSION,
  problemId: 'furthest-building-1642',
  title: '1642. Furthest Building You Can Reach',
  primitives: {
    heights: {
      id: 'heights',
      type: 'array',
      label: 'Building Heights (Towers)',
      values: [4, 2, 7, 6, 9, 14, 12],
      showBarHeights: true,
      maxBarValue: 14,
      activeIndex: 0,
      pointerLabels: { 0: { label: 'building (i)', color: 'blue' } },
    },
    climbs: {
      id: 'climbs',
      type: 'heap',
      label: 'Ladder Climbs (Min-Heap)',
      values: [],
      heapType: 'min',
      showArrayBuffer: true,
    },
    bricks: {
      id: 'bricks',
      type: 'resource',
      label: 'Bricks Remaining',
      value: 5,
      max: 5,
      icon: '🧱',
    },
    ladders: {
      id: 'ladders',
      type: 'resource',
      label: 'Ladders Available',
      value: 1,
      max: 1,
      icon: '🪜',
    },
    currentClimb: {
      id: 'currentClimb',
      type: 'variable',
      name: 'currentClimb',
      value: 0,
      typeLabel: 'number',
    },
  },
};

export const furthestBuildingEvents = [
  {
    id: 'evt-1642-01',
    step: 0,
    type: VISUALIZATION_EVENTS.STEP_START,
    target: { primitiveId: 'heights' },
    data: { index: 0, value: 4 },
    description: 'Start at building 0 (height = 4). Bricks = 5, Ladders = 1 available.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },

  {
    id: 'evt-1642-02',
    step: 1,
    type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
    target: { primitiveId: 'heights' },
    data: { index: 1, pointerId: 'building (i)', color: 'blue' },
    description: 'Move from building 0 (height 4) to building 1 (height 2). Downhill jump: no resources needed.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-03',
    step: 1,
    type: VISUALIZATION_EVENTS.VARIABLE_SET,
    target: { primitiveId: 'currentClimb' },
    data: { value: -2, previousValue: 0 },
    description: 'Height delta = 2 - 4 = -2 (no climb required).',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },

  {
    id: 'evt-1642-04',
    step: 2,
    type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
    target: { primitiveId: 'heights' },
    data: { index: 2, pointerId: 'building (i)', color: 'blue' },
    description: 'Move to building 2 (height 7). Climb required: 7 - 2 = +5.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-05',
    step: 2,
    type: VISUALIZATION_EVENTS.VARIABLE_SET,
    target: { primitiveId: 'currentClimb' },
    data: { value: 5, previousValue: -2 },
    description: 'Height delta = 7 - 2 = 5.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-06',
    step: 2,
    type: VISUALIZATION_EVENTS.HEAP_INSERT,
    target: { primitiveId: 'climbs' },
    data: { value: 5, resultingState: [5] },
    description: 'Insert climb of 5 into ladder Min-Heap [5]. Allocate 1 ladder.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-06b',
    step: 2,
    type: VISUALIZATION_EVENTS.RESOURCE_CONSUME,
    target: { primitiveId: 'ladders' },
    data: { amount: 1, previousValue: 1, value: 0, changeDelta: -1 },
    description: 'Allocate 1 ladder to climb 5. Ladders available: 1 - 1 = 0.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },

  {
    id: 'evt-1642-07',
    step: 3,
    type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
    target: { primitiveId: 'heights' },
    data: { index: 3, pointerId: 'building (i)', color: 'blue' },
    description: 'Move to building 3 (height 6). Downhill jump: no resources needed.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-08',
    step: 3,
    type: VISUALIZATION_EVENTS.VARIABLE_SET,
    target: { primitiveId: 'currentClimb' },
    data: { value: -1, previousValue: 5 },
    description: 'Height delta = 6 - 7 = -1.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },

  {
    id: 'evt-1642-09',
    step: 4,
    type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
    target: { primitiveId: 'heights' },
    data: { index: 4, pointerId: 'building (i)', color: 'blue' },
    description: 'Move to building 4 (height 9). Climb required: 9 - 6 = +3.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-10',
    step: 4,
    type: VISUALIZATION_EVENTS.VARIABLE_SET,
    target: { primitiveId: 'currentClimb' },
    data: { value: 3, previousValue: -1 },
    description: 'Height delta = 9 - 6 = 3.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-11',
    step: 4,
    type: VISUALIZATION_EVENTS.HEAP_INSERT,
    target: { primitiveId: 'climbs' },
    data: { value: 3, resultingState: [3, 5] },
    description: 'Insert climb of 3 into Min-Heap [3, 5]. Heap size (2) > Ladders (1). Must pop smallest climb!',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-12',
    step: 4,
    type: VISUALIZATION_EVENTS.HEAP_REMOVE,
    target: { primitiveId: 'climbs' },
    data: { value: 3, resultingState: [5] },
    description: 'Pop smallest climb (3) from Min-Heap. Allocate 3 bricks for this climb.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-13',
    step: 4,
    type: VISUALIZATION_EVENTS.RESOURCE_CONSUME,
    target: { primitiveId: 'bricks' },
    data: { amount: 3, previousValue: 5, value: 2, changeDelta: -3 },
    description: 'Deduct 3 bricks (Bricks remaining: 5 - 3 = 2). Successfully reached building 4!',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },

  {
    id: 'evt-1642-14',
    step: 5,
    type: VISUALIZATION_EVENTS.ARRAY_HIGHLIGHT,
    target: { primitiveId: 'heights' },
    data: { index: 5, status: 'BLOCKED' },
    description: 'Attempt building 5 (height 14). Climb required: 14 - 9 = 5. Insufficient bricks (needs 5, only 2 left) and 0 ladders remaining! BLOCKED.',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-14a',
    step: 5,
    type: VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE,
    target: { primitiveId: 'heights' },
    data: { index: 4, pointerId: 'building (i)', color: 'emerald' },
    description: 'Furthest reachable building remains index 4 (height 9).',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-14b',
    step: 5,
    type: VISUALIZATION_EVENTS.VARIABLE_SET,
    target: { primitiveId: 'currentClimb' },
    data: { value: 5, previousValue: 3 },
    description: 'Height delta = 14 - 9 = 5 (requires 5 bricks or 1 ladder).',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
  {
    id: 'evt-1642-15',
    step: 5,
    type: VISUALIZATION_EVENTS.RETURN,
    target: { primitiveId: 'heights' },
    data: { value: 4 },
    description: 'FURTHEST REACHED BUILDING: Index 4!',
    schemaVersion: EVENT_SCHEMA_VERSION,
  },
];

export const furthestBuildingSteps = [
  {
    stepNumber: 0,
    operation: 'START',
    description: 'Start at building 0 (height = 4). Initial Bricks: 5, Ladders: 1 available.',
  },
  {
    stepNumber: 1,
    operation: 'DOWNHILL_JUMP',
    description: 'Move to building 1 (height 2). Downhill jump (delta: -2). No bricks or ladders needed.',
  },
  {
    stepNumber: 2,
    operation: 'LADDER_CLIMB',
    description: 'Move to building 2 (height 7). Climb of +5 required. Allocate 1 ladder (0 ladders left). Min-heap holds [5].',
  },
  {
    stepNumber: 3,
    operation: 'DOWNHILL_JUMP',
    description: 'Move to building 3 (height 6). Downhill jump (delta: -1). No resources needed.',
  },
  {
    stepNumber: 4,
    operation: 'USE_BRICKS',
    description: 'Move to building 4 (height 9). Climb of +3. Heap has [3, 5] > 1 ladder. Pop smallest climb (3) and pay with 3 bricks (Bricks left: 2). Ladder kept for climb 5.',
  },
  {
    stepNumber: 5,
    operation: 'STOP_RESULT',
    description: 'Attempt building 5 (height 14). Climb of +5 needed. Insufficient bricks (has 2, needs 5) and 0 ladders left! Cannot proceed. Furthest reached building is index 4.',
  },
];
