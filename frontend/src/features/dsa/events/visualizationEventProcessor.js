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
    case VISUALIZATION_EVENTS.ARRAY_ACCESS: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeIndex: data.index !== undefined ? data.index : targetPrimitive.activeIndex,
        matchedIndices: data.matchedIndices || targetPrimitive.matchedIndices || [],
        changedIndices: data.changedIndices || targetPrimitive.changedIndices || [],
      };
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_COMPARE: {
      if (!targetPrimitive) break;
      const matchedIdxs = Array.isArray(data.indices) && data.matched
        ? [...data.indices]
        : (data.matchedIndices || targetPrimitive.matchedIndices || []);
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeIndex: data.index !== undefined ? data.index : targetPrimitive.activeIndex,
        comparingIndices: Array.isArray(data.indices) ? [...data.indices] : (targetPrimitive.comparingIndices || []),
        matchedIndices: matchedIdxs,
        changedIndices: data.changedIndices || targetPrimitive.changedIndices || [],
      };
      break;
    }

    // --- HASHMAP EVENTS ---
    case VISUALIZATION_EVENTS.HASHMAP_SET: {
      const prevMap = targetPrimitive?.value && typeof targetPrimitive.value === 'object'
        ? { ...targetPrimitive.value }
        : {};
      if (data.key !== undefined && data.value !== undefined) {
        prevMap[data.key] = data.value;
      }
      currentPrimitives[targetId] = {
        ...(targetPrimitive || { id: targetId, type: 'variable', name: targetId, label: 'HashMap' }),
        value: prevMap,
        lastInsertedKey: data.key,
        activeKey: data.key,
        isChanged: true,
      };
      break;
    }

    case VISUALIZATION_EVENTS.HASHMAP_LOOKUP: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeKey: data.key,
        lookupFound: Boolean(data.found),
        foundIndex: data.foundIndex ?? null,
      };
      break;
    }

    case VISUALIZATION_EVENTS.HASHMAP_DELETE: {
      if (!targetPrimitive) break;
      const prevMap = targetPrimitive.value && typeof targetPrimitive.value === 'object'
        ? { ...targetPrimitive.value }
        : {};
      if (data.key !== undefined) {
        delete prevMap[data.key];
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        value: prevMap,
        deletedKey: data.key,
      };
      break;
    }

    case VISUALIZATION_EVENTS.HASHMAP_CLEAR: {
      if (!targetPrimitive) break;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        value: {},
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

      // Synchronize scalar pointer variables if present
      if (pointerId === 'L' && currentPrimitives.left) {
        currentPrimitives.left = { ...currentPrimitives.left, value: targetIdx };
      } else if (pointerId === 'R' && currentPrimitives.right) {
        currentPrimitives.right = { ...currentPrimitives.right, value: targetIdx };
      }
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_COMPARE:
    case 'ARRAY_COMPARE': {
      if (!targetPrimitive) break;
      const isMatched = Boolean(data.matched);
      const matchedIdxs = isMatched && Array.isArray(data.indices) ? [...data.indices] : (targetPrimitive.matchedIndices || []);
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        activeIndex: data.indices?.[1] !== undefined ? data.indices[1] : targetPrimitive.activeIndex,
        matchedIndices: isMatched ? matchedIdxs : (targetPrimitive.matchedIndices || []),
        comparedIndices: data.indices || [],
        isMatch: isMatched,
      };
      break;
    }

    case VISUALIZATION_EVENTS.RETURN:
    case 'RETURN': {
      if (!targetPrimitive) break;
      const resVal = data.result !== undefined ? data.result : data.value;
      const resIndices = Array.isArray(resVal) ? [...resVal] : [];
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        matchedIndices: resIndices.length > 0 ? resIndices : targetPrimitive.matchedIndices,
        returnResult: resVal,
      };
      if (data.bestWindow !== undefined && currentPrimitives.bestWindow) {
        currentPrimitives.bestWindow = { ...currentPrimitives.bestWindow, value: data.bestWindow };
      }
      if (data.bestRange !== undefined) {
        if (currentPrimitives.bestRange) {
          currentPrimitives.bestRange = { ...currentPrimitives.bestRange, value: data.bestRange };
        }
        currentPrimitives[targetId].bestWindowRange = data.bestRange;
      }
      if (data.windowRange !== undefined) {
        currentPrimitives[targetId].windowRange = data.windowRange;
      }
      if (data.value !== undefined && currentPrimitives.maxLength) {
        currentPrimitives.maxLength = { ...currentPrimitives.maxLength, value: data.value };
      }
      break;
    }

    case VISUALIZATION_EVENTS.ARRAY_RANGE_UPDATE:
    case 'ARRAY_RANGE_UPDATE': {
      if (!targetPrimitive) break;
      const range = Array.isArray(data.range)
        ? data.range
        : [data.start !== undefined ? data.start : data.left, data.end !== undefined ? data.end : data.right];
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        windowRange: range,
        range,
      };
      if (range && range.length === 2) {
        if (range[0] !== null && range[0] !== undefined && currentPrimitives.left) {
          currentPrimitives.left = { ...currentPrimitives.left, value: range[0] };
        }
        if (range[1] !== null && range[1] !== undefined && currentPrimitives.right) {
          currentPrimitives.right = { ...currentPrimitives.right, value: range[1] };
        }
      }
      break;
    }

    // --- BUCKET SORT EVENTS ---
    case VISUALIZATION_EVENTS.BUCKET_INSERT: {
      const prevBuckets = targetPrimitive?.value && Array.isArray(targetPrimitive.value)
        ? targetPrimitive.value.map((b) => [...b])
        : [];
      if (data.frequency !== undefined && data.value !== undefined) {
        while (prevBuckets.length <= data.frequency) {
          prevBuckets.push([]);
        }
        if (!prevBuckets[data.frequency].includes(data.value)) {
          prevBuckets[data.frequency].push(data.value);
        }
      }
      currentPrimitives[targetId] = {
        ...(targetPrimitive || { id: targetId, type: 'variable', name: targetId, label: 'Buckets' }),
        value: prevBuckets,
        lastInsertedValue: data.value,
        lastInsertedFrequency: data.frequency,
        activeFrequency: data.frequency,
      };
      if (currentPrimitives.currentFrequency) {
        currentPrimitives.currentFrequency = { ...currentPrimitives.currentFrequency, value: data.frequency };
      }
      if (currentPrimitives.currentNum && data.value !== undefined) {
        currentPrimitives.currentNum = { ...currentPrimitives.currentNum, value: data.value };
      }
      break;
    }

    case VISUALIZATION_EVENTS.BUCKET_TRAVERSE: {
      const freq = data.frequency;
      currentPrimitives[targetId] = {
        ...(targetPrimitive || { id: targetId, type: 'variable', name: targetId, label: 'Buckets' }),
        activeFrequency: freq,
      };
      if (currentPrimitives.currentFrequency) {
        currentPrimitives.currentFrequency = { ...currentPrimitives.currentFrequency, value: freq };
      }
      break;
    }

    case VISUALIZATION_EVENTS.RESULT_COLLECT: {
      const prevList = targetPrimitive?.value && Array.isArray(targetPrimitive.value)
        ? [...targetPrimitive.value]
        : [];
      if (data.value !== undefined && !prevList.includes(data.value)) {
        prevList.push(data.value);
      }
      currentPrimitives[targetId] = {
        ...(targetPrimitive || { id: targetId, type: 'variable', name: targetId, label: 'Top K Result' }),
        value: prevList,
        lastCollected: data.value,
      };
      if (currentPrimitives.currentNum && data.value !== undefined) {
        currentPrimitives.currentNum = { ...currentPrimitives.currentNum, value: data.value };
      }
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
      currentPrimitives[targetId] = {
        ...(targetPrimitive || { id: targetId, type: 'variable', name: targetId }),
        value: data.value,
        previousValue: data.previousValue !== undefined ? data.previousValue : targetPrimitive?.value,
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
    case VISUALIZATION_EVENTS.GRID_UPDATE: {
      if (!targetPrimitive) break;
      const grid = Array.isArray(targetPrimitive.grid)
        ? targetPrimitive.grid.map((r) => (Array.isArray(r) ? [...r] : r))
        : [];
      if (data.row !== undefined && data.col !== undefined && grid[data.row]) {
        grid[data.row][data.col] = data.value !== undefined ? data.value : data.val;
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        grid: data.grid || grid,
      };
      break;
    }

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

    case VISUALIZATION_EVENTS.LINKED_LIST_LINK_UPDATE: {
      if (!targetPrimitive) break;
      const nodes = Array.isArray(targetPrimitive.nodes)
        ? targetPrimitive.nodes.map((n) => (n.id === data.nodeId ? { ...n, nextId: data.newNextId } : { ...n }))
        : [];
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        nodes,
      };
      break;
    }

    // --- TREE EVENTS ---
    case VISUALIZATION_EVENTS.TREE_CURRENT: {
      if (!targetPrimitive) break;
      const currentVal = data.nodeVal !== undefined ? data.nodeVal : data.nodeId;
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        currentNode: currentVal !== undefined ? currentVal : targetPrimitive.currentNode,
      };
      break;
    }

    case VISUALIZATION_EVENTS.TREE_VISIT: {
      if (!targetPrimitive) break;
      const visitedNodes = Array.isArray(targetPrimitive.visitedNodes) ? [...targetPrimitive.visitedNodes] : [];
      const valToAdd = data.nodeVal !== undefined ? data.nodeVal : data.nodeId;
      if (valToAdd !== undefined) {
        visitedNodes.push(valToAdd);
      }
      currentPrimitives[targetId] = {
        ...targetPrimitive,
        currentNode: valToAdd !== undefined ? valToAdd : targetPrimitive.currentNode,
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

  // Derive flat projections for visualizers expecting flat properties
  const flatUpdates = {};
  if (currentPrimitives.nums?.values) flatUpdates.nums = currentPrimitives.nums.values;
  if (currentPrimitives.target?.value !== undefined) flatUpdates.target = currentPrimitives.target.value;
  if (currentPrimitives.nums?.activeIndex !== undefined) flatUpdates.currentIndex = currentPrimitives.nums.activeIndex;
  if (currentPrimitives.num?.value !== undefined) flatUpdates.currentNum = currentPrimitives.num.value;
  if (currentPrimitives.complement?.value !== undefined) flatUpdates.complement = currentPrimitives.complement.value;
  if (currentPrimitives.hashMap?.value !== undefined) flatUpdates.hashMap = currentPrimitives.hashMap.value;
  if (currentPrimitives.numSet?.value !== undefined) {
    flatUpdates.numSet = currentPrimitives.numSet.value;
    if (!flatUpdates.hashMap) flatUpdates.hashMap = currentPrimitives.numSet.value;
  }
  if (currentPrimitives.longestStreak?.value !== undefined) {
    flatUpdates.longestStreak = currentPrimitives.longestStreak.value;
  }
  if (currentPrimitives.currentStreak?.value !== undefined) {
    flatUpdates.currentStreak = currentPrimitives.currentStreak.value;
  }
  if (currentPrimitives.chars?.values) flatUpdates.chars = currentPrimitives.chars.values;
  if (currentPrimitives.s?.value !== undefined) flatUpdates.s = currentPrimitives.s.value;
  if (currentPrimitives.left?.value !== undefined) flatUpdates.left = currentPrimitives.left.value;
  if (currentPrimitives.right?.value !== undefined) flatUpdates.right = currentPrimitives.right.value;
  if (currentPrimitives.windowString?.value !== undefined) flatUpdates.windowString = currentPrimitives.windowString.value;
  if (currentPrimitives.windowChars?.value !== undefined) flatUpdates.windowChars = currentPrimitives.windowChars.value;
  if (currentPrimitives.maxLength?.value !== undefined) flatUpdates.maxLength = currentPrimitives.maxLength.value;
  if (currentPrimitives.bestWindow?.value !== undefined) flatUpdates.bestWindow = currentPrimitives.bestWindow.value;
  if (currentPrimitives.bestRange?.value !== undefined) {
    flatUpdates.bestRange = currentPrimitives.bestRange.value;
    flatUpdates.bestWindowRange = currentPrimitives.bestRange.value;
  }
  if (currentPrimitives.chars?.bestWindowRange) {
    flatUpdates.bestWindowRange = currentPrimitives.chars.bestWindowRange;
  }
  if (currentPrimitives.chars?.windowRange) {
    flatUpdates.windowRange = currentPrimitives.chars.windowRange;
    if (flatUpdates.left === undefined || flatUpdates.left === null) {
      flatUpdates.left = currentPrimitives.chars.windowRange[0];
    }
    if (flatUpdates.right === undefined || flatUpdates.right === null) {
      flatUpdates.right = currentPrimitives.chars.windowRange[1];
    }
  }
  if (currentPrimitives.chars?.returnResult !== undefined) {
    flatUpdates.result = currentPrimitives.chars.returnResult;
  }
  if (currentPrimitives.nums?.matchedIndices?.length > 0) {
    flatUpdates.result = currentPrimitives.nums.matchedIndices;
    flatUpdates.matchedPair = currentPrimitives.nums.matchedIndices;
  }
  if (currentPrimitives.k?.value !== undefined) flatUpdates.k = currentPrimitives.k.value;
  if (currentPrimitives.frequencyMap?.value !== undefined) flatUpdates.frequencyMap = currentPrimitives.frequencyMap.value;
  if (currentPrimitives.buckets?.value !== undefined) flatUpdates.buckets = currentPrimitives.buckets.value;
  if (currentPrimitives.buckets?.activeFrequency !== undefined) flatUpdates.activeFrequency = currentPrimitives.buckets.activeFrequency;
  if (currentPrimitives.currentFrequency?.value !== undefined) flatUpdates.currentFrequency = currentPrimitives.currentFrequency.value;
  if (currentPrimitives.topKResult?.value !== undefined) {
    flatUpdates.topKResult = currentPrimitives.topKResult.value;
    if (currentPrimitives.topKResult.value.length > 0) {
      flatUpdates.result = currentPrimitives.topKResult.value;
    }
  }

  // Stack flat projections
  if (currentPrimitives.stack?.items) {
    flatUpdates.stack = currentPrimitives.stack.items;
  }
  if (currentPrimitives.char?.value !== undefined) {
    flatUpdates.char = currentPrimitives.char.value;
    flatUpdates.currentChar = currentPrimitives.char.value;
  }
  if (currentPrimitives.isValid?.value !== undefined) {
    flatUpdates.isValid = currentPrimitives.isValid.value;
    flatUpdates.result = currentPrimitives.isValid.value;
  }

  // Linked List flat projections
  if (currentPrimitives.list?.nodes) {
    flatUpdates.nodes = currentPrimitives.list.nodes;
  }
  if (currentPrimitives.prev?.value !== undefined) {
    flatUpdates.prev = currentPrimitives.prev.value;
  } else if (currentPrimitives.list?.prevId !== undefined) {
    flatUpdates.prev = currentPrimitives.list.prevId;
  }
  if (currentPrimitives.curr?.value !== undefined) {
    flatUpdates.curr = currentPrimitives.curr.value;
  } else if (currentPrimitives.list?.currId !== undefined) {
    flatUpdates.curr = currentPrimitives.list.currId;
  }
  if (currentPrimitives.next?.value !== undefined) {
    flatUpdates.next = currentPrimitives.next.value;
  } else if (currentPrimitives.list?.nextId !== undefined) {
    flatUpdates.next = currentPrimitives.list.nextId;
  }

  // Binary Tree flat projections
  if (currentPrimitives.tree?.root !== undefined) {
    flatUpdates.root = currentPrimitives.tree.root;
  }
  if (currentPrimitives.tree?.currentNode !== undefined) {
    flatUpdates.currentNode = currentPrimitives.tree.currentNode;
  }
  if (currentPrimitives.tree?.visitedNodes) {
    flatUpdates.visited = currentPrimitives.tree.visitedNodes;
  }
  if (currentPrimitives.result?.value !== undefined) {
    flatUpdates.result = currentPrimitives.result.value;
  }

  return {
    ...previousState,
    ...flatUpdates,
    primitives: currentPrimitives,
  };
}
