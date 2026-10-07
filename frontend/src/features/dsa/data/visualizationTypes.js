/**
 * Stable Visualization Type Identifiers for AlgoVision Stage 09
 * Used by the future Visualization Registry and Rendering Engine
 */

export const VISUALIZATION_TYPES = {
  ARRAY_HASHMAP: 'array-hashmap',
  SLIDING_WINDOW: 'sliding-window',
  MATRIX_HASHSET: 'matrix-hashset',
  STACK: 'stack',
  QUEUE: 'queue',
  MATRIX: 'matrix',
  LINKED_LIST: 'linked-list',
  BINARY_TREE: 'binary-tree',
  GRID: 'grid',
  HEAP: 'heap',
};

export const VISUALIZATION_TYPE_LABELS = {
  [VISUALIZATION_TYPES.ARRAY_HASHMAP]: 'Array + HashMap',
  [VISUALIZATION_TYPES.SLIDING_WINDOW]: 'Sliding Window',
  [VISUALIZATION_TYPES.MATRIX_HASHSET]: 'Matrix + HashSet',
  [VISUALIZATION_TYPES.STACK]: 'Stack',
  [VISUALIZATION_TYPES.QUEUE]: 'Queue',
  [VISUALIZATION_TYPES.MATRIX]: 'Matrix',
  [VISUALIZATION_TYPES.LINKED_LIST]: 'Linked List',
  [VISUALIZATION_TYPES.BINARY_TREE]: 'Binary Tree',
  [VISUALIZATION_TYPES.GRID]: 'Grid (DFS/BFS)',
  [VISUALIZATION_TYPES.HEAP]: 'Heap / Priority Queue',
};
