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
  BUCKET_SORT: 'bucket-sort',
  EVENT_SCENE: 'event-scene',
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
  [VISUALIZATION_TYPES.BUCKET_SORT]: 'Bucket Sort (Frequency Ranking)',
  [VISUALIZATION_TYPES.EVENT_SCENE]: 'Event-Driven Scene (Phase 11 Demo)',
};

/**
 * Canonical Mapping from Problem Identifiers / Slugs to Archetype Visualization Types
 */
export const PROBLEM_SLUG_ARCHETYPE_MAP = {
  'two-sum': VISUALIZATION_TYPES.ARRAY_HASHMAP,
  'longest-substring-without-repeating-characters': VISUALIZATION_TYPES.SLIDING_WINDOW,
  'longest-substring-no-repeat': VISUALIZATION_TYPES.SLIDING_WINDOW,
  'longest-substring': VISUALIZATION_TYPES.SLIDING_WINDOW,
  '3': VISUALIZATION_TYPES.SLIDING_WINDOW,
  'top-k-frequent': VISUALIZATION_TYPES.BUCKET_SORT,
  'top-k-frequent-elements': VISUALIZATION_TYPES.BUCKET_SORT,
  '347': VISUALIZATION_TYPES.BUCKET_SORT,
  'valid-sudoku': VISUALIZATION_TYPES.MATRIX_HASHSET,
  'valid-parentheses': VISUALIZATION_TYPES.STACK,
  '20': VISUALIZATION_TYPES.STACK,
  'number-of-recent-calls': VISUALIZATION_TYPES.QUEUE,
  'matrix': VISUALIZATION_TYPES.MATRIX,
  'reverse-linked-list': VISUALIZATION_TYPES.LINKED_LIST,
  'reverse-list': VISUALIZATION_TYPES.LINKED_LIST,
  '206': VISUALIZATION_TYPES.LINKED_LIST,
  'binary-tree-inorder-traversal': VISUALIZATION_TYPES.BINARY_TREE,
  'inorder-traversal': VISUALIZATION_TYPES.BINARY_TREE,
  '94': VISUALIZATION_TYPES.BINARY_TREE,
  'minimum-depth-of-binary-tree': VISUALIZATION_TYPES.BINARY_TREE,
  'min-depth': VISUALIZATION_TYPES.BINARY_TREE,
  '111': VISUALIZATION_TYPES.BINARY_TREE,
  'maximum-depth-of-binary-tree': VISUALIZATION_TYPES.BINARY_TREE,
  'max-depth': VISUALIZATION_TYPES.BINARY_TREE,
  '104': VISUALIZATION_TYPES.BINARY_TREE,
  'longest-consecutive-sequence': VISUALIZATION_TYPES.ARRAY_HASHMAP,
  'longest-consecutive': VISUALIZATION_TYPES.ARRAY_HASHMAP,
  '128': VISUALIZATION_TYPES.ARRAY_HASHMAP,
  'number-of-islands': VISUALIZATION_TYPES.GRID,
  'kth-largest-element': VISUALIZATION_TYPES.HEAP,
  'kth-largest-element-in-an-array': VISUALIZATION_TYPES.HEAP,
  'furthest-building-1642': VISUALIZATION_TYPES.EVENT_SCENE,
  '1642': VISUALIZATION_TYPES.EVENT_SCENE,
};

/**
 * Deterministic Archetype Resolver (Phase 4)
 * Resolution Order:
 * 1. Explicit valid problem.visualizationType
 * 2. Problem identifier / slug lookup in PROBLEM_SLUG_ARCHETYPE_MAP
 * 3. Title / Slug / Category / Pattern inference
 * 4. Fallback to EVENT_SCENE if composite primitives exist, or ARRAY_HASHMAP
 */
export function resolveVisualizationType(problem) {
  if (!problem) return null;

  // 1. Explicit valid visualizationType metadata
  if (
    problem.visualizationType &&
    Object.values(VISUALIZATION_TYPES).includes(problem.visualizationType)
  ) {
    return problem.visualizationType;
  }

  // 2. Centralized problem identifier / slug lookup
  const slug = (problem.problemId || problem.id || problem.slug || '').toString().toLowerCase().trim();
  if (slug && PROBLEM_SLUG_ARCHETYPE_MAP[slug]) {
    return PROBLEM_SLUG_ARCHETYPE_MAP[slug];
  }

  // 3. Title / Slug / Category inference
  const category = (problem.category || '').toLowerCase();
  const title = (problem.title || '').toLowerCase();

  if (category.includes('sliding') || category.includes('substring') || category.includes('window') || slug.includes('substring')) return VISUALIZATION_TYPES.SLIDING_WINDOW;
  if (category.includes('tree') || slug.includes('tree') || title.includes('tree')) return VISUALIZATION_TYPES.BINARY_TREE;
  if (category.includes('linked list') || category.includes('linkedlist') || slug.includes('linked-list') || title.includes('linked list')) return VISUALIZATION_TYPES.LINKED_LIST;
  if (category.includes('stack') || slug.includes('parentheses') || slug.includes('stack')) return VISUALIZATION_TYPES.STACK;
  if (category.includes('queue') || slug.includes('queue')) return VISUALIZATION_TYPES.QUEUE;
  if (category.includes('bucket') || category.includes('frequent') || slug.includes('top-k')) return VISUALIZATION_TYPES.BUCKET_SORT;
  if (category.includes('heap') || category.includes('priority') || slug.includes('heap')) return VISUALIZATION_TYPES.HEAP;
  if (category.includes('grid') || category.includes('graph') || category.includes('island') || slug.includes('island')) return VISUALIZATION_TYPES.GRID;
  if (category.includes('matrix') || slug.includes('matrix')) return VISUALIZATION_TYPES.MATRIX;

  // 4. Fallback: if custom primitive events are present, use EVENT_SCENE
  if (problem.initialState?.primitives || problem.events || problem.executionTrace?.initialState?.primitives) {
    return VISUALIZATION_TYPES.EVENT_SCENE;
  }

  return VISUALIZATION_TYPES.ARRAY_HASHMAP;
}
