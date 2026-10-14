/**
 * Execution Trace Constants & Schema Definitions — AlgoVision Trace Engine (Phase 12)
 * Pure, deterministic execution trace representation standards.
 */

export const EXECUTION_TRACE_SCHEMA_VERSION = 1;

export const TRACE_SOURCES = {
  MOCK: 'mock',
  DRY_RUN: 'dry-run',
  EXECUTION: 'execution',
  IMPORTED: 'imported',
  AI: 'ai',
};

export const TRACE_STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  COMPLETED: 'COMPLETED',
};
