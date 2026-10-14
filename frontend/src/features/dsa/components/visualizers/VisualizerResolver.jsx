import React from 'react';
import { VISUALIZATION_TYPES } from '../../data/visualizationTypes';
import { ArrayHashMapVisualizer } from './ArrayHashMapVisualizer';
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer';
import { MatrixHashSetVisualizer } from './MatrixHashSetVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { BinaryTreeVisualizer } from './BinaryTreeVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { EventDrivenScene } from './EventDrivenScene';
import { FallbackVisualizer } from './FallbackVisualizer';

export function VisualizerResolver({ problem, step, state, highlights }) {
  if (!problem) return null;

  const vizType = problem.visualizationType;

  switch (vizType) {
    case VISUALIZATION_TYPES.ARRAY_HASHMAP:
      return <ArrayHashMapVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.SLIDING_WINDOW:
      return <SlidingWindowVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.MATRIX_HASHSET:
      return <MatrixHashSetVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.STACK:
      return <StackVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.QUEUE:
      return <QueueVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.MATRIX:
      return <MatrixVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.LINKED_LIST:
      return <LinkedListVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.BINARY_TREE:
      return <BinaryTreeVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.HEAP:
      return <HeapVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.GRID:
      return <GridVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.EVENT_SCENE:
      return <EventDrivenScene problem={problem} step={step} state={state} highlights={highlights} />;

    default:
      if (step?.events || step?.initialState || problem?.events || problem?.initialState) {
        return <EventDrivenScene problem={problem} step={step} state={state} highlights={highlights} />;
      }
      return <FallbackVisualizer problem={problem} step={step} state={state} />;
  }
}





