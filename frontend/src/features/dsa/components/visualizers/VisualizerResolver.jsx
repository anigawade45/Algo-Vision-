import React from 'react';
import { VISUALIZATION_TYPES, resolveVisualizationType } from '../../data/visualizationTypes';
import { ArrayHashMapVisualizer } from './ArrayHashMapVisualizer';
import { SlidingWindowVisualizer } from './SlidingWindowVisualizer';
import { MatrixHashSetVisualizer } from './MatrixHashSetVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { MatrixVisualizer } from './MatrixVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { BinaryTreeVisualizer } from './BinaryTreeVisualizer';
import { HeapVisualizer } from './HeapVisualizer';
import { BucketSortVisualizer } from './BucketSortVisualizer';
import { GridVisualizer } from './GridVisualizer';
import { EventDrivenScene } from './EventDrivenScene';
import { FallbackVisualizer } from './FallbackVisualizer';
import { GenericD3Visualization } from './GenericD3Visualization';

export function VisualizerResolver({ problem, plan, step, stepIndex, state, highlights }) {
  if (!problem) return null;

  const activePlan = plan || problem?.visualizationPlan || null;
  const useD3 = Boolean(problem?.renderMode === 'd3' || problem?.useD3 || activePlan?.layout === 'generic-d3');

  // If D3 rendering is explicitly requested and a validated plan exists, use GenericD3Visualization
  if (activePlan && useD3) {
    return (
      <GenericD3Visualization
        plan={activePlan}
        sceneState={state}
        problem={problem}
        highlights={highlights}
        stepIndex={stepIndex}
      />
    );
  }

  // 1. Resolve directly from active plan layout if present
  if (activePlan?.layout) {
    const layout = activePlan.layout.toLowerCase();
    if (layout === 'tree-traversal' || layout === 'binary-tree' || layout === 'tree') {
      return <BinaryTreeVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'pointer-chain' || layout === 'linked-list') {
      return <LinkedListVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'stack-queue' || layout === 'stack') {
      return <StackVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'queue') {
      return <QueueVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'sliding-window') {
      return <SlidingWindowVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'matrix-hashset') {
      return <MatrixHashSetVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'matrix') {
      return <MatrixVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'bucket-sort') {
      return <BucketSortVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'heap') {
      return <HeapVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'grid') {
      return <GridVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
    if (layout === 'array-with-map' || layout === 'array-hashmap') {
      return <ArrayHashMapVisualizer problem={problem} step={step} state={state} highlights={highlights} />;
    }
  }

  const vizType = resolveVisualizationType(problem);

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

    case VISUALIZATION_TYPES.BUCKET_SORT:
      return <BucketSortVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.GRID:
      return <GridVisualizer problem={problem} step={step} state={state} highlights={highlights} />;

    case VISUALIZATION_TYPES.EVENT_SCENE:
      return <EventDrivenScene problem={problem} step={step} stepIndex={stepIndex} state={state} highlights={highlights} />;

    default:
      if (activePlan) {
        return (
          <GenericD3Visualization
            plan={activePlan}
            sceneState={state}
            problem={problem}
            highlights={highlights}
            stepIndex={stepIndex}
          />
        );
      }
      if (step?.events || step?.initialState || problem?.events || problem?.initialState) {
        return <EventDrivenScene problem={problem} step={step} stepIndex={stepIndex} state={state} highlights={highlights} />;
      }
      return <FallbackVisualizer problem={problem} step={step} state={state} />;
  }
}





