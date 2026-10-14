import { EXECUTION_TRACE_SCHEMA_VERSION, TRACE_SOURCES } from './executionTraceTypes.js';
import { furthestBuildingInitialState, furthestBuildingEvents } from '../events/mockVisualizationEvents.js';

/**
 * Normalized Mock Execution Trace — LeetCode 1642. Furthest Building You Can Reach (Phase 12 Demo)
 * Complete execution trace representation containing ordered steps, multi-event steps, and final result.
 */
export const furthestBuildingExecutionTrace = {
  schemaVersion: EXECUTION_TRACE_SCHEMA_VERSION,
  traceId: 'trace-1642-demo',
  problemId: 'furthest-building-1642',
  title: '1642. Furthest Building You Can Reach',
  source: TRACE_SOURCES.MOCK,
  metadata: {
    language: 'conceptual',
    algorithm: 'Greedy + Min Heap',
    category: 'Heap / Greedy',
    difficulty: 'Medium',
    inputSummary: 'heights = [4, 2, 7, 6, 9, 14, 12], bricks = 5, ladders = 1',
  },
  initialState: furthestBuildingInitialState,
  steps: [
    {
      id: 'step-0',
      stepNumber: 0,
      label: 'Initialize Execution',
      operation: 'START',
      explanation: 'Start at building 0 (height = 4). Initial Bricks: 5, Ladders: 1.',
      events: furthestBuildingEvents.filter((e) => e.step === 0),
    },
    {
      id: 'step-1',
      stepNumber: 1,
      label: 'Building 1 (Height 2)',
      operation: 'DOWNHILL_JUMP',
      explanation: 'Move from building 0 to 1. Height delta = 2 - 4 = -2 (no resources needed).',
      events: furthestBuildingEvents.filter((e) => e.step === 1),
    },
    {
      id: 'step-2',
      stepNumber: 2,
      label: 'Building 2 (Height 7)',
      operation: 'LADDER_CLIMB',
      explanation: 'Move to building 2. Climb required = 7 - 2 = 5. Insert 5 into Ladder Min-Heap [5].',
      events: furthestBuildingEvents.filter((e) => e.step === 2),
    },
    {
      id: 'step-3',
      stepNumber: 3,
      label: 'Building 3 (Height 6)',
      operation: 'DOWNHILL_JUMP',
      explanation: 'Move to building 3. Height delta = 6 - 7 = -1 (no resources needed).',
      events: furthestBuildingEvents.filter((e) => e.step === 3),
    },
    {
      id: 'step-4',
      stepNumber: 4,
      label: 'Building 4 (Height 9)',
      operation: 'USE_BRICKS',
      explanation: 'Move to building 4. Climb = 3. Heap size (2) > Ladders (1). Smallest climb (3) extracted from Min-Heap and paid using 3 bricks (Bricks remaining: 2).',
      events: furthestBuildingEvents.filter((e) => e.step === 4),
    },
    {
      id: 'step-5',
      stepNumber: 5,
      label: 'Building 5 (Height 14)',
      operation: 'STOP_RESULT',
      explanation: 'Attempt building 5. Climb required = 14 - 9 = 5. Insufficient bricks (needs 5, has 2). Execution terminates. Furthest building reached is index 4.',
      events: furthestBuildingEvents.filter((e) => e.step === 5),
    },
  ],
  finalState: {
    result: 4,
    furthestBuilding: 4,
  },
  result: 4,
};

import { adaptDryRunToExecutionTrace } from '../adapters/dryRunTraceAdapter.js';
import { furthestBuildingDryRun } from '../data/dryRun/furthestBuildingDryRun.js';

export const furthestBuildingAdaptedTrace = adaptDryRunToExecutionTrace(furthestBuildingDryRun).trace;

/**
 * Mock Execution Trace Registry
 */
export const mockExecutionTraces = {
  'trace-1642-demo': furthestBuildingExecutionTrace,
  'furthest-building-1642': furthestBuildingExecutionTrace,
  'dry-run-furthest-building-1642': furthestBuildingAdaptedTrace,
};
