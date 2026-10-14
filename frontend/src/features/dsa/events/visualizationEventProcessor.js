import { VISUALIZATION_EVENTS } from './visualizationEventTypes.js';

/**
 * Pure, Immutable, Deterministic Event Processor for AlgoVision Visualization Primitives.
 * Computes state transitions by applying visualization events to scene primitive state.
 *
 * @param {Object} previousState - Current scene state containing primitives map
 * @param {Object} event - Validated visualization event
 * @returns {Object} New state with updated primitive branches
 */
export function processVisualizationEvent(previousState = {}, event) {
  if (!event || typeof event !== 'object' || !event.type) {
    return previousState;
  }

  // Ensure primitives container exists immutably
  const currentPrimitives = previousState.primitives ? { ...previousState.primitives } : {};
  const targetId = event.target?.primitiveId || event.data?.primitiveId || event.target || null;

  // Clone primitive target state if it exists
  const targetPrimitive = targetId && currentPrimitives[targetId]
    ? { ...currentPrimitives[targetId] }
    : null;

  const data = event.data || {};

  switch (event.type) {
    // --- ARRAY & POINTER EVENTS ---
    case VISUALIZATION_EVENTS.ARRAY_ACCESS:
    case VISUALIZATION_EVENTS.ARRAY_COMPARE: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeIndex: data.index !== undefined ? data.index : targetPrimitive.activeIndex,
        matchedIndices: data.matchedIndices || targetPrimitive.matchedIndices || [],
        changedIndices: data.changedIndices || targetPrimitive.changedIndices || [],
      };
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_UPDATE: {
      if (!targetPrimitive) break;
      const newValues = Array.isArray(data.values)
        ? data.values
        : Array.isArray(targetPrimitive.values)
        ? [...targetPrimitive.values]
        : [];
      if (data.index !== undefined && data.value !== undefined) {
        newValues[data.index] = data.value;
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        values: newValues,
        changedIndices: data.index !== undefined ? [data.index] : (data.changedIndices || []),
      };
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_HIGHLIGHT:
    case VISUALIZATION_EVENTS.HIGHLIGHT_SET: {
      if (!targetPrimitive) break;
      const currentBadges = { ...(targetPrimitive.statusBadges || {}) };
      const currentDuplicates = Array.isArray(targetPrimitive.duplicateIndices) ? [...targetPrimitive.duplicateIndices] : [];
      if (data.index !== undefined) {
        if (data.status) {
          currentBadges[data.index] = data.status;
          if (data.status === 'BLOCKED' && !currentDuplicates.includes(data.index)) {
            currentDuplicates.push(data.index);
          }
        }
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        statusBadges: currentBadges,
        duplicateIndices: currentDuplicates,
      };
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_POINTER_MOVE:
    case VISUALIZATION_EVENTS.POINTER_MOVE: {
      if (!targetPrimitive) break;
      const pointerId = data.pointerId || 'current';
      const targetIdx = data.index !== undefined ? data.index : data.targetIndex;

      // Clean previous position of this specific pointerId so badges do not accumulate across all elements
      const cleanPointerLabels = {};
      if (targetPrimitive.pointerLabels) {
        Object.entries(targetPrimitive.pointerLabels).forEach(([idxKey, pObj]) => {
          if (pObj && pObj.label !== pointerId) {
            cleanPointerLabels[idxKey] = pObj;
          }
        });
      }
      if (targetIdx !== undefined) {
        cleanPointerLabels[targetIdx] = { label: pointerId, color: data.color || 'blue' };
      }

      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeIndex: targetIdx !== undefined ? targetIdx : targetPrimitive.activeIndex,
        targetIndex: targetIdx !== undefined ? targetIdx : targetPrimitive.targetIndex,
        pointerLabels: cleanPointerLabels,
      };
      break;
    }

    // --- HEAP EVENTS ---
    case VISUALIZATION_EVENTS.HEAP_INSERT: {
      if (!targetPrimitive) break;
      const updatedValues = Array.isArray(data.resultingState)
        ? data.resultingState
        : Array.isArray(data.values)
        ? data.values
        : [...(targetPrimitive.values || []), data.value];
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        values: updatedValues,
        insertedIndex: updatedValues.length - 1,
      };
      break;
    }

    case VISUALIZATION_EVENTS.HEAP_REMOVE: {
      if (!targetPrimitive) break;
      const updatedValues = Array.isArray(data.resultingState)
        ? data.resultingState
        : Array.isArray(data.values)
        ? data.values
        : (targetPrimitive.values || []).filter((v) => v !== data.value);
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        values: updatedValues,
        poppedVal: data.value !== undefined ? data.value : targetPrimitive.poppedVal,
      };
      break;
    }

    case VISUALIZATION_EVENTS.HEAP_UPDATE:
    case VISUALIZATION_EVENTS.HEAP_STATE: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        values: Array.isArray(data.values) ? data.values : targetPrimitive.values,
        poppedVal: data.poppedVal !== undefined ? data.poppedVal : targetPrimitive.poppedVal,
      };
      break;
    }

    // --- RESOURCE EVENTS ---
    case VISUALIZATION_EVENTS.RESOURCE_UPDATE:
    case VISUALIZATION_EVENTS.RESOURCE_CONSUME:
    case VISUALIZATION_EVENTS.RESOURCE_GAIN: {
      if (!targetPrimitive) break;
      const prevVal = data.previousValue !== undefined ? data.previousValue : targetPrimitive.value;
      const newVal = data.value !== undefined ? data.value : (prevVal - (data.amount || 0));
      const delta = data.changeDelta !== undefined
        ? data.changeDelta
        : (data.amount ? -data.amount : newVal - prevVal);

      currentPrimitives[targetId] = {
        ...targetPrimitive,
        value: newVal,
        previousValue: prevVal,
        changeDelta: delta,
      };
      break;
    }

    // --- VARIABLE EVENTS ---
    case VISUALIZATION_EVENTS.VARIABLE_SET:
    case VISUALIZATION_EVENTS.VARIABLE_UPDATE: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        value: data.value,
        previousValue: data.previousValue !== undefined ? data.previousValue : targetPrimitive.value,
        isChanged: true,
      };
      break;
    }

    // --- STACK EVENTS ---
    case VISUALIZATION_EVENTS.STACK_PUSH: {
      if (!targetPrimitive) break;
      const currentItems = Array.isArray(targetPrimitive.items) ? [...targetPrimitive.items] : [];
      if (data.value !== undefined) currentItems.push(data.value);
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        items: data.items || currentItems,
        isPushing: true,
      };
      break;
    }

    case VISUALIZATION_EVENTS.STACK_POP: {
      if (!targetPrimitive) break;
      const currentItems = Array.isArray(targetPrimitive.items) ? [...targetPrimitive.items] : [];
      const popped = currentItems.pop();
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        items: data.items || currentItems,
        poppedItem: data.value !== undefined ? data.value : popped,
        isPopping: true,
      };
      break;
    }

    // --- QUEUE EVENTS ---
    case VISUALIZATION_EVENTS.QUEUE_ENQUEUE: {
      if (!targetPrimitive) break;
      const items = Array.isArray(targetPrimitive.items) ? [...targetPrimitive.items] : [];
      if (data.value !== undefined) items.push(data.value);
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        items: data.items || items,
      };
      break;
    }

    case VISUALIZATION_EVENTS.QUEUE_DEQUEUE: {
      if (!targetPrimitive) break;
      const items = Array.isArray(targetPrimitive.items) ? [...targetPrimitive.items] : [];
      const dequeued = items.shift();
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        items: data.items || items,
        dequeuedItem: data.value !== undefined ? data.value : dequeued,
      };
      break;
    }

    // --- GRID & MATRIX EVENTS ---
    case VISUALIZATION_EVENTS.GRID_VISIT:
    case VISUALIZATION_EVENTS.GRID_CURRENT_CELL: {
      if (!targetPrimitive) break;
      const visited = Array.isArray(targetPrimitive.visitedCells) ? [...targetPrimitive.visitedCells] : [];
      if (data.row !== undefined && data.col !== undefined) {
        visited.push([data.row, data.col]);
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        currentCell: data.row !== undefined ? [data.row, data.col] : targetPrimitive.currentCell,
        visitedCells: visited,
      };
      break;
    }

    case VISUALIZATION_EVENTS.MATRIX_UPDATE:
    case VISUALIZATION_EVENTS.MATRIX_SWAP: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        matrix: data.matrix || targetPrimitive.matrix,
        swappedCells: data.swappedCells || (data.first && data.second ? [data.first, data.second] : []),
      };
      break;
    }

    // --- LINKED LIST EVENTS ---
    case VISUALIZATION_EVENTS.LINKED_LIST_CURRENT:
    case VISUALIZATION_EVENTS.LINKED_LIST_POINTER_MOVE: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        currId: data.currId !== undefined ? data.currId : data.nodeId,
        prevId: data.prevId !== undefined ? data.prevId : targetPrimitive.prevId,
        nextId: data.nextId !== undefined ? data.nextId : targetPrimitive.nextId,
      };
      break;
    }

    // --- TREE EVENTS ---
    case VISUALIZATION_EVENTS.TREE_CURRENT:
    case VISUALIZATION_EVENTS.TREE_VISIT: {
      if (!targetPrimitive) break;
      const visitedNodes = Array.isArray(targetPrimitive.visitedNodes) ? [...targetPrimitive.visitedNodes] : [];
      if (data.nodeId !== undefined && !visitedNodes.includes(data.nodeId)) {
        visitedNodes.push(data.nodeId);
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        currentNode: data.nodeId !== undefined ? data.nodeId : targetPrimitive.currentNode,
        visitedNodes: visitedNodes,
      };
      break;
    }

    // Fallback: If event contains full resulting Primitive state, update directly
    default: {
      if (targetId && data.primitiveState) {
        currentPrimitives[targetId] = {
          ...targetPrimitive,
          ...data.primitiveState,
        };
      }
      break;
    }
  }

  return {
    ...previousState,
    primitives: currentPrimitives,
    lastProcessedEventId: event.id,
    lastProcessedStep: event.step,
  };
}
