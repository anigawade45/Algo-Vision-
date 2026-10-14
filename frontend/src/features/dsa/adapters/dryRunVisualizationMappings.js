/**
 * Stage 08 Dry Run -> Stage 09 Visualization Mapping Configuration
 * Pure configuration defining how Stage 08 Dry Run variables map to Stage 09 generic visualization primitives.
 */

export const DRY_RUN_VISUALIZATION_MAPPINGS = {
  'furthest-building-1642': {
    problemId: 'furthest-building-1642',
    title: '1642. Furthest Building You Can Reach',
    primitives: {
      heights: {
        id: 'heights',
        type: 'array',
        label: 'Building Heights',
        sourceVar: 'heights',
        defaultValues: [4, 2, 7, 6, 9, 14, 12],
        showBarHeights: true,
        maxBarValue: 14,
      },
      currentBuilding: {
        id: 'heights',
        type: 'pointer',
        label: 'building (i)',
        sourceVar: 'currentIndex',
        color: 'blue',
      },
      climbs: {
        id: 'climbs',
        type: 'heap',
        label: 'Ladder Climbs (Min-Heap)',
        sourceVar: 'minHeap',
        heapType: 'min',
        showArrayBuffer: true,
      },
      bricks: {
        id: 'bricks',
        type: 'resource',
        label: 'Bricks Remaining',
        sourceVar: 'bricks',
        max: 5,
        icon: '🧱',
      },
      ladders: {
        id: 'ladders',
        type: 'resource',
        label: 'Ladders Available',
        sourceVar: 'ladders',
        max: 1,
        icon: '🪜',
      },
      currentClimb: {
        id: 'currentClimb',
        type: 'variable',
        name: 'currentClimb',
        sourceVar: 'currentClimb',
        typeLabel: 'number',
      },
    },
    variableMap: {
      currentIndex: { targetId: 'heights', type: 'pointer', pointerId: 'building (i)', color: 'blue' },
      currentClimb: { targetId: 'currentClimb', type: 'variable' },
      minHeap: { targetId: 'climbs', type: 'heap' },
      heap: { targetId: 'climbs', type: 'heap' },
      bricks: { targetId: 'bricks', type: 'resource' },
      ladders: { targetId: 'ladders', type: 'resource' },
    },
  },

  'two-sum': {
    problemId: 'two-sum',
    title: 'Two Sum',
    primitives: {
      nums: {
        id: 'nums',
        type: 'array',
        label: 'Input Array (nums)',
        sourceVar: 'nums',
        defaultValues: [2, 7, 11, 15],
      },
      pointerI: {
        id: 'nums',
        type: 'pointer',
        label: 'i',
        sourceVar: 'i',
        color: 'blue',
      },
      num: {
        id: 'num',
        type: 'variable',
        name: 'num',
        sourceVar: 'num',
      },
      complement: {
        id: 'complement',
        type: 'variable',
        name: 'complement',
        sourceVar: 'complement',
      },
    },
    variableMap: {
      i: { targetId: 'nums', type: 'pointer', pointerId: 'i', color: 'blue' },
      num: { targetId: 'num', type: 'variable' },
      complement: { targetId: 'complement', type: 'variable' },
    },
  },

  'kth-largest-element': {
    problemId: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    primitives: {
      nums: {
        id: 'nums',
        type: 'array',
        label: 'Input Array (nums)',
        sourceVar: 'nums',
        defaultValues: [3, 2, 1, 5, 6, 4],
      },
      minHeap: {
        id: 'minHeap',
        type: 'heap',
        label: 'Min-Heap (Capacity K)',
        sourceVar: 'minHeap',
        heapType: 'min',
        showArrayBuffer: true,
      },
      val: {
        id: 'val',
        type: 'variable',
        name: 'val',
        sourceVar: 'val',
      },
    },
    variableMap: {
      minHeap: { targetId: 'minHeap', type: 'heap' },
      val: { targetId: 'val', type: 'variable' },
    },
  },

  'valid-parentheses': {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    primitives: {
      stack: {
        id: 'stack',
        type: 'stack',
        label: 'Character Stack',
        sourceVar: 'stack',
        items: [],
      },
      char: {
        id: 'char',
        type: 'variable',
        name: 'char',
        sourceVar: 'c',
      },
    },
    variableMap: {
      stack: { targetId: 'stack', type: 'stack' },
      char: { targetId: 'char', type: 'variable' },
      c: { targetId: 'char', type: 'variable' },
    },
  },
};

/**
 * Returns a problem mapping configuration if explicitly defined,
 * or dynamically constructs a fallback primitive mapping configuration.
 *
 * @param {string} problemId
 * @param {Object} dryRun
 * @returns {Object} Semantic mapping object
 */
export function getDryRunMappingForProblem(problemId, dryRun = null) {
  if (problemId && DRY_RUN_VISUALIZATION_MAPPINGS[problemId]) {
    return DRY_RUN_VISUALIZATION_MAPPINGS[problemId];
  }

  // Alias lookups
  const aliasMap = {
    'furthest-building': 'furthest-building-1642',
    '1642': 'furthest-building-1642',
    'kth-largest-element-in-an-array': 'kth-largest-element',
  };

  const matchedAlias = aliasMap[problemId];
  if (matchedAlias && DRY_RUN_VISUALIZATION_MAPPINGS[matchedAlias]) {
    return DRY_RUN_VISUALIZATION_MAPPINGS[matchedAlias];
  }

  // Dynamic Fallback Mapping Resolver
  const primitives = {};
  const variableMap = {};

  if (dryRun) {
    const rawVars = dryRun.initialState?.variables || [];
    let hasArray = false;
    let arrayTargetId = 'arr';

    rawVars.forEach((v) => {
      const name = v.name || v.key;
      if (!name) return;

      const lowerName = name.toLowerCase();

      if (lowerName.includes('heap') || lowerName.includes('minheap') || lowerName.includes('maxheap')) {
        primitives[name] = {
          id: name,
          type: 'heap',
          label: v.label || `${name} Heap`,
          sourceVar: name,
          values: [],
          heapType: lowerName.includes('max') ? 'max' : 'min',
        };
        variableMap[name] = { targetId: name, type: 'heap' };
      } else if (lowerName.includes('stack')) {
        primitives[name] = {
          id: name,
          type: 'stack',
          label: v.label || `${name} Stack`,
          sourceVar: name,
          items: [],
        };
        variableMap[name] = { targetId: name, type: 'stack' };
      } else if (lowerName.includes('queue') || lowerName.includes('deque')) {
        primitives[name] = {
          id: name,
          type: 'queue',
          label: v.label || `${name} Queue`,
          sourceVar: name,
          items: [],
        };
        variableMap[name] = { targetId: name, type: 'queue' };
      } else if (
        ['i', 'j', 'idx', 'index', 'currentindex', 'ptr', 'left', 'right', 'mid'].includes(lowerName)
      ) {
        if (!hasArray) {
          primitives[arrayTargetId] = {
            id: arrayTargetId,
            type: 'array',
            label: 'Input Data',
            values: [1, 2, 3, 4, 5],
          };
          hasArray = true;
        }
        variableMap[name] = {
          targetId: arrayTargetId,
          type: 'pointer',
          pointerId: name,
          color: lowerName === 'left' ? 'green' : lowerName === 'right' ? 'purple' : 'blue',
        };
      } else if (['bricks', 'ladders', 'tokens', 'capacity', 'k'].includes(lowerName)) {
        primitives[name] = {
          id: name,
          type: 'resource',
          label: v.label || name,
          sourceVar: name,
          value: Number(v.value) || 0,
          max: Number(v.value) || 10,
        };
        variableMap[name] = { targetId: name, type: 'resource' };
      } else {
        primitives[name] = {
          id: name,
          type: 'variable',
          name,
          sourceVar: name,
          value: v.value || 0,
        };
        variableMap[name] = { targetId: name, type: 'variable' };
      }
    });
  }

  return {
    problemId: problemId || 'generic',
    title: dryRun?.input?.title || problemId || 'Generic Execution',
    primitives,
    variableMap,
  };
}
