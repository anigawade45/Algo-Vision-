import twoSumPattern from './twoSumPattern.js';

/**
 * Stage 04 - Standalone Pattern Dataset for all 20 problems in AlgoVision.
 * Contains full 10-section pattern objects directly in this single file for all 20 problems
 * with 100% schema parity across all 10 required sections.
 */
export const MOCK_PATTERNS = {
  'two-sum': twoSumPattern,

  'valid-parentheses': {
    problemId: 'valid-parentheses',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual characters to nested structural balance.',
      inputLabel: 'STRING SEQUENCE',
      inputVisual: ['[ ( ]', '[ { ]', '[ } ]', '[ ) ]'],
      targetLabel: 'VALIDITY',
      targetValue: 'NESTED MATCH',
      coreRelationship: [
        { label: 'Open & Close Pairs', sub: 'Matched symbols' },
        { label: 'Symmetrical Order', sub: 'Last opened closed first' },
        { label: 'Complete Balance', sub: 'No unmatched brackets' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        {
          id: 'signal_1',
          title: 'SIGNAL 01',
          label: 'Elements have natural matching partners.',
          detail: 'Opening brackets require corresponding closing brackets of the same type.',
        },
        {
          id: 'signal_2',
          title: 'SIGNAL 02',
          label: 'Order of closing depends on order of opening.',
          detail: 'The most recently opened bracket must be closed before outer brackets can close.',
        },
        {
          id: 'signal_3',
          title: 'SIGNAL 03',
          label: 'Structural nesting creates dependency.',
          detail: 'Sub-expressions are nested hierarchically inside parent brackets.',
        },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Specific bracket types are no longer important. What matters is nested symmetry.',
      concrete: { items: ['(', '{', '}', ')'], target: 'BALANCED' },
      abstractFormula: {
        varA: 'OPEN ( X )',
        operator: '➜',
        varB: 'MATCH ( X )',
        equals: '=',
        result: 'VALID PAIR',
      },
      statement: 'Specific bracket shapes change, but the nested matching structure remains.',
    },
    pattern: {
      name: 'Matching / Nested Sequence Pattern',
      tagline: 'Match paired elements where recent additions must be satisfied before earlier ones.',
      description: 'When a problem involves nested structures or paired symbols where inner scope must resolve before outer scope, you are looking at a nested sequence pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Sequence of opening & closing items' },
        { stage: 'RELATIONSHIP', value: 'Paired match condition' },
        { stage: 'CONDITION', value: 'Inner pairs resolve before outer pairs' },
        { stage: 'OUTPUT', value: 'Boolean structural validity' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Matching / Nested Structure problems?',
      families: [
        { id: 'fam_1', name: 'Stack', detail: 'Last-In-First-Out sequence matching for nested symbols.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What structure to look for', 'What symmetry matters', 'What signals identify nesting'],
      doesNotTellUs: ['Which data structure to use', 'Whether to use iteration or recursion', 'Exact code steps'],
    },
    recognitionCheck: {
      question: 'Which description best matches the structure of Valid Parentheses?',
      options: [
        { id: 'a', text: 'Find a numeric sum of elements.', isCorrect: false, feedback: 'Incorrect. The problem is about structural balance, not arithmetic.' },
        { id: 'b', text: 'Symmetrical matching of nested opening and closing elements.', isCorrect: true, feedback: 'Correct! The problem structure requires matching nested pairs.' },
        { id: 'c', text: 'Sort elements in non-decreasing order.', isCorrect: false, feedback: 'Incorrect. Order of sorting is unrelated to nested bracket balance.' },
      ],
    },
    takeaway: {
      specificProblem: 'Check if string brackets match in order.',
      generalPattern: 'Match nested pairs in Last-In-First-Out sequence.',
      finalStatement: 'When elements must close in reverse order of opening, look for the nested sequence structure.',
    },
  },

  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from node values to directional link orientations.',
      inputLabel: 'LINKED SEQUENCE',
      inputVisual: ['(1) ➔', '(2) ➔', '(3) ➔', '(4) ➔ NULL'],
      targetLabel: 'INVERSION',
      targetValue: 'REVERSED LINKS',
      coreRelationship: [
        { label: 'Directed Links', sub: 'Each node points to next' },
        { label: 'Directional Inversion', sub: 'Change A ➔ B into B ➔ A' },
        { label: 'New Head Position', sub: 'Old tail becomes new start' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Elements are connected sequentially by single links.', detail: 'Each node only knows its immediate successor.' },
        { id: 's2', title: 'SIGNAL 02', label: 'The structural order must be completely inverted.', detail: 'The relationship between adjacent nodes is flipped.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Node values are irrelevant. What matters is reversing directional links.',
      concrete: { items: ['1', '2', '3'], target: 'REVERSED' },
      abstractFormula: { varA: 'NODE A', operator: '➔', varB: 'NODE B', equals: 'becomes', result: 'NODE B ➔ NODE A' },
      statement: 'Node contents do not change; only link directions flip.',
    },
    pattern: {
      name: 'Sequence Pointer Transformation Pattern',
      tagline: 'Invert directional connections between adjacent nodes in a sequence.',
      description: 'When a problem requires modifying unidirectional sequence links without changing element identities, you are looking at a pointer transformation pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Singly-linked sequential nodes' },
        { stage: 'RELATIONSHIP', value: 'Adjacent directional links' },
        { stage: 'CONDITION', value: 'Invert pointer directions' },
        { stage: 'OUTPUT', value: 'Reversed sequence head' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Linked List Transformation problems?',
      families: [
        { id: 'fam_1', name: 'Pointer-based Traversal', detail: 'Iterative link redirection while traversing nodes.' },
        { id: 'fam_2', name: 'Linked-list Manipulation', detail: 'Recursive pointer unwinding and tail returning.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What link direction to change', 'What node relationships exist'],
      doesNotTellUs: ['Iterative vs recursive method', 'How many pointer variables to track'],
    },
    recognitionCheck: {
      question: 'Which description best matches the structure of Reverse Linked List?',
      options: [
        { id: 'a', text: 'Invert directional links between adjacent sequence elements.', isCorrect: true, feedback: 'Correct! Reversing a list is fundamentally a pointer transformation pattern.' },
        { id: 'b', text: 'Find two numbers that sum to a target.', isCorrect: false, feedback: 'Incorrect. This is a sequence pointer inversion, not a pair sum.' },
      ],
    },
    takeaway: {
      specificProblem: 'Reverse pointers in 1 ➔ 2 ➔ 3.',
      generalPattern: 'Invert directional sequence relationships.',
      finalStatement: 'Focus on pointer orientation rather than element data.',
    },
  },

  'binary-tree-inorder-traversal': {
    problemId: 'binary-tree-inorder-traversal',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual nodes to hierarchical subtree order.',
      inputLabel: 'HIERARCHICAL TREE',
      inputVisual: ['[ Root ]', '↙  ↘', '[ Left ] [ Right ]'],
      targetLabel: 'ORDERING',
      targetValue: 'LEFT ➔ ROOT ➔ RIGHT',
      coreRelationship: [
        { label: 'Parent-Child Links', sub: 'Hierarchical branching' },
        { label: 'Subtree Ordering', sub: 'Process left before root' },
        { label: 'Sequential Flattening', sub: 'Tree to ordered list' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Data is structured in parent and child branches.', detail: 'Hierarchical tree branching instead of flat arrays.' },
        { id: 's2', title: 'SIGNAL 02', label: 'A systematic traversal rule governs node sequence.', detail: 'Inorder specifies Left Subtree ➔ Node ➔ Right Subtree.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Node numbers do not matter; subtree visit precedence defines the shape.',
      concrete: { items: ['Root', 'Left', 'Right'], target: 'INORDER' },
      abstractFormula: { varA: 'LEFT SUBTREE', operator: '+', varB: 'NODE', equals: '+', result: 'RIGHT SUBTREE' },
      statement: 'Hierarchical branching is flattened into a linear sequence.',
    },
    pattern: {
      name: 'Hierarchical Tree Traversal Pattern',
      tagline: 'Systematically visit hierarchical nodes following recursive structural precedence.',
      description: 'When a problem requires processing tree nodes in a defined order relative to subtrees, you are looking at a tree traversal pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Hierarchical tree structure' },
        { stage: 'RELATIONSHIP', value: 'Parent, Left Child, Right Child' },
        { stage: 'CONDITION', value: 'Left ➔ Current ➔ Right' },
        { stage: 'OUTPUT', value: 'Linear sequence of values' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Tree Traversal / Ordered Visit problems?',
      families: [
        { id: 'fam_1', name: 'Recursion', detail: 'Implicit call stack visiting left, root, and right subtrees.' },
        { id: 'fam_2', name: 'Stack-based Traversal', detail: 'Explicit stack simulation of tree depth traversal.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What node precedence rule applies', 'What hierarchy exists'],
      doesNotTellUs: ['Recursion vs Stack iteration vs Morris traversal', 'Call stack depth details'],
    },
    recognitionCheck: {
      question: 'Which description best matches Binary Tree Inorder Traversal?',
      options: [
        { id: 'a', text: 'Flatten a hierarchical tree following Left ➔ Root ➔ Right order.', isCorrect: true, feedback: 'Correct! Inorder traversal is a structural tree order pattern.' },
        { id: 'b', text: 'Sort a 1D array using quicksort.', isCorrect: false, feedback: 'Incorrect. The input structure is a tree, not an unsorted array.' },
      ],
    },
    takeaway: {
      specificProblem: 'Traverse binary tree in inorder.',
      generalPattern: 'Flatten tree hierarchy based on structural precedence.',
      finalStatement: 'Recognize hierarchical branching rules before writing traversal logic.',
    },
  },

  'number-of-islands': {
    problemId: 'number-of-islands',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual grid cells to connected spatial regions.',
      inputLabel: '2D GRID MATRIX',
      inputVisual: ['1  1  0', '1  0  0', '0  0  1'],
      targetLabel: 'REGION COUNT',
      targetValue: 'ISLANDS = 2',
      coreRelationship: [
        { label: 'Grid Neighbor Links', sub: 'Up, Down, Left, Right' },
        { label: 'Contiguous Clusters', sub: 'Adjacent land cells (1s)' },
        { label: 'Boundary Separation', sub: 'Water cells (0s) divide regions' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Elements exist in 2D spatial grid coordinates.', detail: 'Each cell has up to 4 orthogonal neighbors.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Connected adjacent land cells form unified regions.', detail: 'Adjacent 1s belong to the same island.' },
        { id: 's3', title: 'SIGNAL 03', label: 'The goal is counting distinct connected components.', detail: 'Separate islands are partitioned by water boundaries.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Grid coordinates are abstract nodes; adjacency forms connected components.',
      concrete: { items: ['Grid of 1s and 0s'], target: 'COUNT REGIONS' },
      abstractFormula: { varA: 'CELL (r,c)', operator: '↔', varB: 'NEIGHBOR (r\',c\')', equals: 'form', result: 'CONNECTED REGION' },
      statement: 'Grid cells act as vertices connected by spatial adjacency.',
    },
    pattern: {
      name: 'Connected Components in Grid Pattern',
      tagline: 'Identify and count distinct contiguous clusters of related items in a spatial grid.',
      description: 'When a problem asks to count or explore connected regions in a 2D matrix, you are looking at a connected components pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: '2D Grid Matrix (M × N)' },
        { stage: 'RELATIONSHIP', value: 'Orthogonal 4-directional adjacency' },
        { stage: 'CONDITION', value: 'Land cells (1s) form connected sets' },
        { stage: 'OUTPUT', value: 'Total count of isolated components' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Grid Connectivity / Connected Components problems?',
      families: [
        { id: 'fam_1', name: 'Depth-First Search (DFS)', detail: 'Explore contiguous land paths recursively.' },
        { id: 'fam_2', name: 'Breadth-First Search (BFS)', detail: 'Level-by-level grid expansion using a queue.' },
        { id: 'fam_3', name: 'Visited-state Tracking', detail: 'Matrix mutation or visited grid set to prevent cycles.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What adjacency rule connects cells', 'What defines a boundary'],
      doesNotTellUs: ['Whether to use DFS or BFS or Union-Find', 'Grid mutation vs visited matrix'],
    },
    recognitionCheck: {
      question: 'Which description best matches Number of Islands?',
      options: [
        { id: 'a', text: 'Count connected contiguous regions in a 2D matrix.', isCorrect: true, feedback: 'Correct! Number of Islands is a connected components in grid pattern.' },
        { id: 'b', text: 'Calculate shortest path between two points.', isCorrect: false, feedback: 'Incorrect. The task is counting all isolated components, not finding a single shortest path.' },
      ],
    },
    takeaway: {
      specificProblem: 'Count 1s connected horizontally/vertically.',
      generalPattern: 'Group connected spatial nodes into distinct components.',
      finalStatement: 'See grids as connected component maps before thinking about graph algorithms.',
    },
  },

  'kth-largest-element-in-an-array': {
    problemId: 'kth-largest-element-in-an-array',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from full array ordering to specific rank statistics.',
      inputLabel: 'UNSORTED ARRAY',
      inputVisual: ['[ 3, 2, 1, 5, 6, 4 ]'],
      targetLabel: 'RANK K',
      targetValue: 'k = 2 ➔ 5th largest',
      coreRelationship: [
        { label: 'Relative Magnitude', sub: 'Greater than / Less than' },
        { label: 'Exact Position K', sub: 'Target rank position' },
        { label: 'Partial Order Requirement', sub: 'Only rank K matters' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Elements have a total ordering by numerical value.', detail: 'Items can be compared as greater or smaller.' },
        { id: 's2', title: 'SIGNAL 02', label: 'We need a single element at rank K, not a fully sorted array.', detail: 'Full sorting may be unnecessary if rank K is found.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Array contents change; the objective is locating rank position K.',
      concrete: { items: [3, 2, 1, 5, 6, 4], target: 'k = 2' },
      abstractFormula: { varA: 'COLLECTION', operator: 'Rank K', varB: 'RANKING', equals: '=', result: 'Kth VALUE' },
      statement: 'Rank statistics focus on relative order position.',
    },
    pattern: {
      name: 'Order Statistic / Ranking Pattern',
      tagline: 'Locate an element corresponding to a specific rank index in a comparative collection.',
      description: 'When a problem asks for the Kth largest or smallest item in a collection, you are looking at an order statistic pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Unsorted array of elements' },
        { stage: 'RELATIONSHIP', value: 'Comparative value ranking' },
        { stage: 'CONDITION', value: 'Position K in sorted order' },
        { stage: 'OUTPUT', value: 'Element at rank K' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Order Statistic / Ranking problems?',
      families: [
        { id: 'fam_1', name: 'Sorting', detail: 'Order the entire array to locate position K.' },
        { id: 'fam_2', name: 'Priority Queue / Heap', detail: 'Maintain a size-K min-heap or max-heap.' },
        { id: 'fam_3', name: 'Selection-based Approaches', detail: 'QuickSelect partitioning targeting rank index K.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What rank metric is requested', 'What comparative relationship exists'],
      doesNotTellUs: ['Min-Heap vs QuickSelect vs Sorting', 'Time complexity O(N log K) vs O(N)'],
    },
    recognitionCheck: {
      question: 'Which description best matches Kth Largest Element?',
      options: [
        { id: 'a', text: 'Find the element occupying rank position K in ordering.', isCorrect: true, feedback: 'Correct! This is an order statistic / ranking pattern.' },
        { id: 'b', text: 'Find two numbers that sum to 9.', isCorrect: false, feedback: 'Incorrect. This asks for rank position, not pair sums.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find 2nd largest in [3,2,1,5,6,4].',
      generalPattern: 'Isolate value at rank index K.',
      finalStatement: 'Recognize rank selection problems before choosing sorting or priority structures.',
    },
  },

  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from static arrays to a moving contiguous window.',
      inputLabel: 'ARRAY & WINDOW SIZE K',
      inputVisual: ['[ 1, 3, -1 ] ➔ Max: 3', '[ 3, -1, -3 ] ➔ Max: 3'],
      targetLabel: 'WINDOW SLIDE',
      targetValue: 'K = 3',
      coreRelationship: [
        { label: 'Contiguous Subset', sub: 'Window of size K' },
        { label: 'Incremental Slide', sub: 'Add right, remove left' },
        { label: 'Local Property', sub: 'Maximum within current window' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Evaluation applies to contiguous subarrays of size K.', detail: 'A fixed-length window moves across the array.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Adjacent windows overlap significantly.', detail: 'Only 1 element enters and 1 leaves per step.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Window contents update incrementally as the boundary shifts.',
      concrete: { items: [1, 3, -1, -3, 5, 3, 6, 7], target: 'Window K=3' },
      abstractFormula: { varA: 'WINDOW [i...i+k]', operator: '➔ Slide', varB: 'MAX IN WINDOW', equals: '=', result: 'WINDOW RESULT' },
      statement: 'Overlapping contiguous subsets create a sliding window structure.',
    },
    pattern: {
      name: 'Fixed-Size Sliding Window Pattern',
      tagline: 'Track an optimal or aggregate property over shifting contiguous subarrays of size K.',
      description: 'When a problem repeatedly evaluates contiguous sub-ranges of fixed length K across an array, you are looking at a sliding window pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Array + Window Size K' },
        { stage: 'RELATIONSHIP', value: 'Shifting contiguous sub-segment' },
        { stage: 'CONDITION', value: 'Subarray maximum per window position' },
        { stage: 'OUTPUT', value: 'Array of window maxima' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Fixed-Window / Range Query problems?',
      families: [
        { id: 'fam_1', name: 'Double-Ended Queue (Deque)', detail: 'Maintain monotonic element indices within window bounds.' },
        { id: 'fam_2', name: 'Heap / Priority Queue', detail: 'Track max value paired with index invalidation.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What window size K applies', 'What local property is evaluated'],
      doesNotTellUs: ['Monotonic Deque vs Heap vs Segment Tree', 'How to maintain O(1) amortized updates'],
    },
    recognitionCheck: {
      question: 'Which description best matches Sliding Window Maximum?',
      options: [
        { id: 'a', text: 'Evaluate maximum within shifting fixed-length contiguous subarrays.', isCorrect: true, feedback: 'Correct! This is a fixed-size sliding window pattern.' },
        { id: 'b', text: 'Count connected islands in a 2D matrix.', isCorrect: false, feedback: 'Incorrect. This involves 1D contiguous windows, not 2D matrix components.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find max in every window of size 3.',
      generalPattern: 'Maintain local properties over shifting contiguous boundaries.',
      finalStatement: 'Recognize window overlap before designing optimization structures.',
    },
  },

  'merge-intervals': {
    problemId: 'merge-intervals',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual ranges to overlapping interval relationships.',
      inputLabel: 'INTERVAL RANGES',
      inputVisual: ['[1, 3]', '[2, 6]', '[8, 10]'],
      targetLabel: 'MERGED RANGES',
      targetValue: '[1, 6], [8, 10]',
      coreRelationship: [
        { label: 'Range Boundaries', sub: '[Start, End] pairs' },
        { label: 'Overlap Condition', sub: 'Start B ≤ End A' },
        { label: 'Range Consolidation', sub: 'Combine overlapping bounds' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Inputs are continuous 1D range segments [start, end].', detail: 'Items represent span boundaries.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Adjacent or intersecting spans must be consolidated.', detail: 'If ranges intersect, they form a single larger range.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Specific coordinate numbers change; interval intersection shape remains.',
      concrete: { items: ['[1,3]', '[2,6]'], target: 'MERGE' },
      abstractFormula: { varA: 'INTERVAL A', operator: 'Overlap?', varB: 'INTERVAL B', equals: '➔', result: 'MERGED [minStart, maxEnd]' },
      statement: 'Intersecting ranges collapse into consolidated spans.',
    },
    pattern: {
      name: 'Overlapping Interval Relationship Pattern',
      tagline: 'Detect and consolidate overlapping or adjacent 1D range boundaries.',
      description: 'When a problem asks to combine, schedule, or resolve overlapping range pairs, you are looking at an interval pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'List of 1D Interval Ranges' },
        { stage: 'RELATIONSHIP', value: 'Spatial range overlap condition' },
        { stage: 'CONDITION', value: 'Unify intersecting ranges' },
        { stage: 'OUTPUT', value: 'Non-overlapping consolidated intervals' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Interval Overlap / Merging problems?',
      families: [
        { id: 'fam_1', name: 'Sorting + Interval Processing', detail: 'Order intervals by start coordinate then sweep linearly.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What range overlap rule exists', 'What output format is expected'],
      doesNotTellUs: ['Sorting intervals by start time', 'Greedy sweep-line vs tree methods'],
    },
    recognitionCheck: {
      question: 'Which description best matches Merge Intervals?',
      options: [
        { id: 'a', text: 'Consolidate intersecting range boundaries into unified spans.', isCorrect: true, feedback: 'Correct! Merge Intervals is an overlapping interval relationship pattern.' },
        { id: 'b', text: 'Reverse directional pointers in a linked list.', isCorrect: false, feedback: 'Incorrect. This involves 1D range overlaps, not linked pointer inversion.' },
      ],
    },
    takeaway: {
      specificProblem: 'Merge [1,3] and [2,6] into [1,6].',
      generalPattern: 'Unify overlapping continuous range boundaries.',
      finalStatement: 'Identify interval boundary intersections before designing sorting/merging algorithms.',
    },
  },

  'longest-substring-without-repeating-characters': {
    problemId: 'longest-substring-without-repeating-characters',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from full strings to dynamic contiguous substring boundaries.',
      inputLabel: 'STRING SEQUENCE',
      inputVisual: ['" a  b  c  a  b  c  b  b "'],
      targetLabel: 'MAX LENGTH',
      targetValue: 'Length = 3 ("abc")',
      coreRelationship: [
        { label: 'Contiguous Substring', sub: 'Continuous character sequence' },
        { label: 'Uniqueness Constraint', sub: 'No duplicate characters' },
        { label: 'Dynamic Boundary', sub: 'Expand right, contract left' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Target is a contiguous portion of a string sequence.', detail: 'Characters must be adjacent in the original text.' },
        { id: 's2', title: 'SIGNAL 02', label: 'A validity constraint (all unique) restricts the window.', detail: 'Duplication breaks substring validity.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Character values change; dynamic boundary expansion under constraint remains.',
      concrete: { items: ['abcabcbb'], target: 'MAX UNIQUE LENGTH' },
      abstractFormula: { varA: 'LEFT BOUNDARY', operator: '↔', varB: 'RIGHT BOUNDARY', equals: 'Constraint:', result: 'UNIQUE CHARACTERS' },
      statement: 'Window boundaries expand until invalid, then contract to restore validity.',
    },
    pattern: {
      name: 'Dynamic Boundary Substring Pattern',
      tagline: 'Expand and contract contiguous boundaries to find the maximum substring satisfying a constraint.',
      description: 'When a problem asks for the maximum contiguous substring satisfying a condition (like uniqueness), you are looking at a dynamic boundary pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Character string sequence' },
        { stage: 'RELATIONSHIP', value: 'Contiguous substring window' },
        { stage: 'CONDITION', value: 'All characters within window are distinct' },
        { stage: 'OUTPUT', value: 'Maximum valid window length' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Contiguous Window + Constraint problems?',
      families: [
        { id: 'fam_1', name: 'Sliding Window', detail: 'Dynamic left/right pointers expanding and contracting.' },
        { id: 'fam_2', name: 'Hashing / Frequency Tracking', detail: 'Set or character map for instant duplicate detection.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What constraint defines validity', 'What boundary movement applies'],
      doesNotTellUs: ['HashSet vs HashMap vs Array lookup', 'Two-pointer index update steps'],
    },
    recognitionCheck: {
      question: 'Which description best matches Longest Substring Without Repeating Characters?',
      options: [
        { id: 'a', text: 'Adjust contiguous boundaries to maximize a unique character substring.', isCorrect: true, feedback: 'Correct! This is a dynamic boundary substring pattern.' },
        { id: 'b', text: 'Traverse a binary tree Left ➔ Root ➔ Right.', isCorrect: false, feedback: 'Incorrect. This involves string boundaries, not binary tree nodes.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find longest substring with no duplicate letters.',
      generalPattern: 'Optimize variable-length contiguous window under constraint.',
      finalStatement: 'Recognize dynamic window constraints before writing boundary logic.',
    },
  },

  'shortest-path-in-unweighted-graph': {
    problemId: 'shortest-path-in-unweighted-graph',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual nodes to edge-step distance relationships.',
      inputLabel: 'GRAPH ADJACENCY MAP',
      inputVisual: ['A ➔ [B, C]', 'B ➔ [D]', 'C ➔ [D]'],
      targetLabel: 'SHORTEST PATH',
      targetValue: 'A ➔ D = 2 Steps',
      coreRelationship: [
        { label: 'Graph Nodes & Edges', sub: 'Vertices with connections' },
        { label: 'Step Distance Metric', sub: 'Number of edge transitions' },
        { label: 'Minimal Path Objective', sub: 'Fewest steps from Start to Goal' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Entities are connected in an arbitrary network of nodes and edges.', detail: 'Connections can form cycles or multiple paths.' },
        { id: 's2', title: 'SIGNAL 02', label: 'All edge connections have equal cost (unweighted).', detail: 'Distance is measured in total number of steps.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Goal is finding the path with minimum total steps.', detail: 'Fewest edge traversals from start node.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Node labels are arbitrary; step-distance exploration defines the structure.',
      concrete: { items: ['A➔B, A➔C, B➔D, C➔D'], target: 'MIN STEPS A to D' },
      abstractFormula: { varA: 'START NODE', operator: '➔ Edge Steps ➔', varB: 'TARGET NODE', equals: '=', result: 'MINIMAL EDGES' },
      statement: 'Unweighted edge networks measure distance in step counts.',
    },
    pattern: {
      name: 'Graph Distance Relationship Pattern',
      tagline: 'Find the minimum step distance between nodes in an unweighted graph network.',
      description: 'When a problem asks for the shortest path or fewest steps between nodes in an unweighted graph, you are looking at a graph distance pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Unweighted Graph (V, E)' },
        { stage: 'RELATIONSHIP', value: 'Node-to-node edge links' },
        { stage: 'CONDITION', value: 'Fewest edge steps from Start to Target' },
        { stage: 'OUTPUT', value: 'Minimal step count / path sequence' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Graph Traversal / Shortest Path problems?',
      families: [
        { id: 'fam_1', name: 'Breadth-First Search (BFS)', detail: 'Level-by-level shortest path traversal in unweighted graphs.' },
        { id: 'fam_2', name: 'Dijkstra / Shortest-Path Methods', detail: 'Distance pathfinding frameworks depending on graph properties.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What network topology exists', 'What distance metric applies'],
      doesNotTellUs: ['BFS Queue traversal vs Dijkstra vs Matrix exponentiation', 'Visited set tracking method'],
    },
    recognitionCheck: {
      question: 'Which description best matches Shortest Path in Unweighted Graph?',
      options: [
        { id: 'a', text: 'Find minimum edge step distance between nodes in a network.', isCorrect: true, feedback: 'Correct! This is a graph distance relationship pattern.' },
        { id: 'b', text: 'Identify two numbers in a 1D array that sum to a target.', isCorrect: false, feedback: 'Incorrect. This involves graph edge steps, not 1D array sums.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find fewest steps from Node A to Node D.',
      generalPattern: 'Minimize edge step counts in unweighted node networks.',
      finalStatement: 'Recognize unweighted graph step metrics before choosing traversal algorithms.',
    },
  },

  // GENERALIZATION BENCHMARKS (PROBLEMS 11 - 20 STANDALONE)

  'climbing-stairs': {
    problemId: 'climbing-stairs',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from step counting to overlapping subproblems.',
      inputLabel: 'STAIRCASE STEPS',
      inputVisual: ['[ 1 step ]', '[ 2 steps ]', '➜ Target: N=5'],
      targetLabel: 'TOTAL PATHS',
      targetValue: '8 WAYS',
      coreRelationship: [
        { label: 'Subproblem Dependence', sub: 'Reach step N from N-1 or N-2' },
        { label: 'Additive Recurrence', sub: 'Ways(N) = Ways(N-1) + Ways(N-2)' },
        { label: 'Optimal Substructure', sub: 'Base steps build larger steps' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Choices at step i depend on previous step results.', detail: 'To reach step N, you must arrive from step N-1 or step N-2.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Subproblem answers repeat and overlap.', detail: 'Calculating ways to step 3 is needed for both step 4 and step 5.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Total count is accumulated from sub-results.', detail: 'Summing combinations creates linear recurrence.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Staircase steps are abstract states; decision choices form recurrence.',
      concrete: { items: ['n = 5', 'steps: 1 or 2'], target: 'dp[5] = 8' },
      abstractFormula: { varA: 'STATE (N-1)', operator: '+', varB: 'STATE (N-2)', equals: '=', result: 'STATE (N)' },
      statement: 'Linear step choices form an overlapping subproblem recurrence.',
    },
    pattern: {
      name: '1D Dynamic Programming / Linear Recurrence Pattern',
      tagline: 'Express target state as an additive combination of preceding subproblem states.',
      description: 'When a problem asks for total ways or optimal cost to reach state N using fixed previous choices, you are looking at a linear recurrence dynamic programming pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Target count N + choices [1, 2]' },
        { stage: 'RELATIONSHIP', value: 'Step N depends on N-1 and N-2' },
        { stage: 'CONDITION', value: 'Sum distinct arriving paths' },
        { stage: 'OUTPUT', value: 'Total path count at step N' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Linear Recurrence / DP problems?',
      families: [
        { id: 'fam_1', name: 'Bottom-Up Iterative DP Table', detail: 'Tabulate answers from 1 to N in a 1D array.' },
        { id: 'fam_2', name: 'Space-Optimized Rolling Variables', detail: 'Track only last two states using O(1) memory.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What recurrence relationship exists', 'Which states depend on prior states'],
      doesNotTellUs: ['Whether to use 1D array or 2 rolling variables', 'Top-down memoization vs bottom-up loop'],
    },
    recognitionCheck: {
      question: 'Which description best matches Climbing Stairs?',
      options: [
        { id: 'a', text: 'Express target state N as sum of preceding subproblem states N-1 and N-2.', isCorrect: true, feedback: 'Correct! Climbing Stairs is a 1D linear recurrence DP pattern.' },
        { id: 'b', text: 'Sort an array using QuickSelect.', isCorrect: false, feedback: 'Incorrect. The problem is counting state combinations, not rank sorting.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find distinct ways to climb 5 steps taking 1 or 2 steps.',
      generalPattern: 'Combine solutions of smaller subproblems to build the target state.',
      finalStatement: 'Recognize overlapping subproblem recurrences before choosing tabular or variable DP.',
    },
  },

  'house-robber': {
    problemId: 'house-robber',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual houses to binary include/exclude constraints.',
      inputLabel: 'HOUSE VALUES',
      inputVisual: ['[ 2 ]', '[ 7 ]', '[ 9 ]', '[ 3 ]', '[ 1 ]'],
      targetLabel: 'MAX PROFIT',
      targetValue: '12 (2+9+1)',
      coreRelationship: [
        { label: 'Adjacent Exclusion', sub: 'Cannot rob adjacent houses' },
        { label: 'Binary Choice', sub: 'Rob house i OR skip house i' },
        { label: 'Optimal State Transition', sub: 'MAX(Rob i-1, Rob i-2 + val)' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Constraint prevents choosing consecutive elements.', detail: 'Selecting index i prohibits selecting index i-1 or i+1.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Each element presents a binary choice: include or exclude.', detail: 'At each house, compare robbing it vs skipping it.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Maximum sum relies on optimal past choices.', detail: 'Current decision builds on optimal totals from earlier indices.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'House amounts change; binary include/exclude state machine remains.',
      concrete: { items: [2, 7, 9, 3, 1], target: 'MAX PROFIT = 12' },
      abstractFormula: { varA: 'SKIP (DP[i-1])', operator: 'MAX', varB: 'ROB (DP[i-2] + val)', equals: '=', result: 'DP[i]' },
      statement: 'Adjacency constraints force a two-state choice at every sequence index.',
    },
    pattern: {
      name: 'Include / Exclude Dynamic Programming Pattern',
      tagline: 'Maximize accumulated reward along a sequence subject to adjacent choice constraints.',
      description: 'When a problem requires choosing non-adjacent elements to maximize total value, you are looking at an include/exclude dynamic programming pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Sequence of non-negative house values' },
        { stage: 'RELATIONSHIP', value: 'Adjacent items mutually exclusive' },
        { stage: 'CONDITION', value: 'Maximize sum without adjacent pairs' },
        { stage: 'OUTPUT', value: 'Maximum total robbery loot' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Include/Exclude DP problems?',
      families: [
        { id: 'fam_1', name: 'Space-Optimized 2-Variable DP', detail: 'Track rolling rob1 and rob2 variables in O(1) space.' },
        { id: 'fam_2', name: '1D Tabular DP Array', detail: 'Maintain DP table of max loot up to index i.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What state transition formula applies', 'What adjacency restriction exists'],
      doesNotTellUs: ['Whether to use extra array memory or rolling variables', 'Iteration order details'],
    },
    recognitionCheck: {
      question: 'Which description best matches House Robber?',
      options: [
        { id: 'a', text: 'Maximize cumulative reward subject to non-adjacent item selection constraint.', isCorrect: true, feedback: 'Correct! House Robber is an include/exclude state machine DP pattern.' },
        { id: 'b', text: 'Traverse a graph using Breadth-First Search.', isCorrect: false, feedback: 'Incorrect. This is a 1D sequence decision problem, not a graph BFS.' },
      ],
    },
    takeaway: {
      specificProblem: 'Rob houses [2,7,9,3,1] without triggering alarms on adjacent houses.',
      generalPattern: 'Choose optimal non-adjacent element combinations along a 1D sequence.',
      finalStatement: 'Recognize include/exclude state choices before designing space-optimized DP variables.',
    },
  },

  'subsets': {
    problemId: 'subsets',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual numbers to complete power set generation.',
      inputLabel: 'UNIQUE NUMBERS',
      inputVisual: ['[ 1 ]', '[ 2 ]', '[ 3 ]'],
      targetLabel: 'ALL SUBSETS',
      targetValue: '2^N = 8 SUBSETS',
      coreRelationship: [
        { label: 'Element Decision', sub: 'Include or Exclude each item' },
        { label: 'Combinatorial Expansion', sub: '2^N total unique combinations' },
        { label: 'Tree Branching', sub: 'Decision tree of depth N' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Output requires generating all possible combinations.', detail: 'We need every subset of any size, from empty [] to full set.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Each element has exactly two choices: in or out.', detail: 'Including or excluding element i doubles the number of partial subsets.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Total output size grows exponentially (2^N).', detail: 'N=3 yields 8 subsets; N=4 yields 16 subsets.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Element identities do not matter; binary choice branching generates power set.',
      concrete: { items: [1, 2, 3], target: '2^3 = 8 Subsets' },
      abstractFormula: { varA: 'CHOICE (In / Out)', operator: '× N', varB: 'DECISION DEPTH', equals: '=', result: '2^N POWER SET' },
      statement: 'Binary include/exclude decisions across N items form a combinatorial tree.',
    },
    pattern: {
      name: 'Combinatorial Power Set / Backtracking Pattern',
      tagline: 'Explore all binary decision branches to build all subsets of a collection.',
      description: 'When a problem asks for all possible subsets or combinations of a set, you are looking at a power set / backtracking pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Set of N unique elements' },
        { stage: 'RELATIONSHIP', value: 'Binary decision tree (Include / Exclude)' },
        { stage: 'CONDITION', value: 'Collect subset at every tree node' },
        { stage: 'OUTPUT', value: 'List of all 2^N subsets' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Subsets / Power Set problems?',
      families: [
        { id: 'fam_1', name: 'Recursive Backtracking', detail: 'Explore include/exclude decision tree with state push/pop.' },
        { id: 'fam_2', name: 'Cascading Iterative Generation', detail: 'Add current element to all existing subsets step-by-step.' },
        { id: 'fam_3', name: 'Bitmask Manipulation', detail: 'Map numbers 0 to 2^N-1 to bit patterns.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['What combinatorial space exists', 'That 2^N subsets must be generated'],
      doesNotTellUs: ['Recursive backtracking vs iterative cascade vs bitmasking', 'Order of subsets in output list'],
    },
    recognitionCheck: {
      question: 'Which description best matches Subsets?',
      options: [
        { id: 'a', text: 'Generate all 2^N combinations using binary inclusion/exclusion decisions.', isCorrect: true, feedback: 'Correct! Subsets is a combinatorial power set / backtracking pattern.' },
        { id: 'b', text: 'Find the shortest path in an unweighted graph.', isCorrect: false, feedback: 'Incorrect. This is combinatorial subset generation, not graph pathfinding.' },
      ],
    },
    takeaway: {
      specificProblem: 'Generate all 8 subsets of [1, 2, 3].',
      generalPattern: 'Explore binary inclusion choices across N items to produce all subsets.',
      finalStatement: 'Recognize exponential binary decision trees before choosing backtracking or cascading algorithms.',
    },
  },

  'course-schedule': {
    problemId: 'course-schedule',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from course names to directional prerequisite dependencies.',
      inputLabel: 'PREREQUISITES',
      inputVisual: ['0 ➔ [1]', '1 ➔ [2]', '2 ➔ [0] (Cycle!)'],
      targetLabel: 'FEASIBILITY',
      targetValue: 'CAN FINISH = FALSE',
      coreRelationship: [
        { label: 'Directed Dependency', sub: 'Course B must precede Course A' },
        { label: 'Directed Graph Nodes', sub: 'Courses are vertices, prereqs are edges' },
        { label: 'Cycle Detection', sub: 'Circular dependencies prevent completion' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Items have directional ordering dependencies.', detail: 'Taking course A requires taking course B first (B ➔ A).' },
        { id: 's2', title: 'SIGNAL 02', label: 'Dependencies form a directed graph.', detail: 'Courses are nodes and prerequisite requirements are directed edges.' },
        { id: 's3', title: 'SIGNAL 03', label: 'A circular dependency makes completion impossible.', detail: 'If A ➔ B and B ➔ A, neither course can ever be completed first.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Course names are arbitrary; directed graph cycle validation defines structure.',
      concrete: { items: ['numCourses = 2', 'prereqs = [[1,0]]'], target: 'CAN FINISH = TRUE' },
      abstractFormula: { varA: 'NODE (A)', operator: '➔ Directed Edge ➔', varB: 'NODE (B)', equals: 'Check:', result: 'NO CYCLES (DAG)' },
      statement: 'Prerequisite rules form a directed graph that must be a Directed Acyclic Graph (DAG).',
    },
    pattern: {
      name: 'Directed Graph Dependency / Topological Order Pattern',
      tagline: 'Detect cycles or establish valid ordering in directed dependency networks.',
      description: 'When a problem involves ordering items with prerequisite dependencies, you are looking at a directed graph dependency pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'N course nodes + prerequisite pairs' },
        { stage: 'RELATIONSHIP', value: 'Directed edge B ➔ A' },
        { stage: 'CONDITION', value: 'Detect circular dependency loops' },
        { stage: 'OUTPUT', value: 'Boolean true if DAG, false if cycle' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Dependency / Topological Sorting problems?',
      families: [
        { id: 'fam_1', name: "Kahn's Algorithm (BFS In-Degree)", detail: 'Process zero in-degree nodes iteratively with a queue.' },
        { id: 'fam_2', name: 'DFS Cycle Detection', detail: 'Track recursion stack states (unvisited, visiting, visited).' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That prerequisites form a directed graph', 'That circular dependency validation is required'],
      doesNotTellUs: ["BFS Kahn's algorithm vs DFS cycle detection", 'Exact graph adjacency representation'],
    },
    recognitionCheck: {
      question: 'Which description best matches Course Schedule?',
      options: [
        { id: 'a', text: 'Validate directed graph dependencies for circular cycles.', isCorrect: true, feedback: 'Correct! Course Schedule is a directed graph dependency / topological sorting pattern.' },
        { id: 'b', text: 'Find two numbers that sum to a target.', isCorrect: false, feedback: 'Incorrect. This involves graph cycle detection, not array pair sum.' },
      ],
    },
    takeaway: {
      specificProblem: 'Determine if 2 courses can be finished with [[1,0]].',
      generalPattern: 'Verify whether a directed dependency network contains circular cycles.',
      finalStatement: 'Recognize directed graph dependency structures before writing BFS Kahn or DFS cycle traversal.',
    },
  },

  'connected-components': {
    problemId: 'connected-components',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from individual edges to isolated graph subnets.',
      inputLabel: 'UNDIRECTED GRAPH',
      inputVisual: ['0 ➔ 1 ➔ 2', '3 ➔ 4'],
      targetLabel: 'COMPONENT COUNT',
      targetValue: '2 COMPONENTS',
      coreRelationship: [
        { label: 'Undirected Connections', sub: 'Nodes connected in both directions' },
        { label: 'Reachable Clusters', sub: 'Nodes in same component can reach each other' },
        { label: 'Disjoint Partition', sub: 'Graph split into isolated groups' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Graph nodes are connected by bidirectional edges.', detail: 'Edges represent symmetric reachability between node pairs.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Nodes form isolated clusters with no links between clusters.', detail: 'A connected component is a maximal set of reachable vertices.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Objective is counting distinct disconnected sub-graphs.', detail: 'Count how many separate groups of connected nodes exist.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Node labels are arbitrary; equivalence partitioning forms connected sets.',
      concrete: { items: ['n = 5', 'edges = [[0,1],[1,2],[3,4]]'], target: '2 COMPONENTS' },
      abstractFormula: { varA: 'VERTEX (U)', operator: '↔ Undirected ↔', varB: 'VERTEX (V)', equals: 'forms', result: 'DISJOINT COMPONENT' },
      statement: 'Undirected edges partition vertices into disjoint connected equivalence sets.',
    },
    pattern: {
      name: 'Undirected Graph Connected Components Pattern',
      tagline: 'Partition vertices into maximal sets of mutually reachable nodes.',
      description: 'When a problem asks for the number of disconnected groups in an undirected network, you are looking at a connected components pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'N vertices + undirected edge list' },
        { stage: 'RELATIONSHIP', value: 'Bidirectional reachability' },
        { stage: 'CONDITION', value: 'Group mutually reachable nodes' },
        { stage: 'OUTPUT', value: 'Count of isolated components' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Graph Connectivity problems?',
      families: [
        { id: 'fam_1', name: 'Depth-First Search (DFS)', detail: 'Traverse and mark visited nodes recursively for each unvisited node.' },
        { id: 'fam_2', name: 'Disjoint Set Union (DSU / Union-Find)', detail: 'Merge connected sets and count remaining parent components.' },
        { id: 'fam_3', name: 'Breadth-First Search (BFS)', detail: 'Queue-based traversal exploring connected clusters.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That graph reachability partitions nodes into components', 'That unvisited nodes trigger new components'],
      doesNotTellUs: ['DFS vs BFS vs Union-Find DSU', 'Adjacency list vs adjacency matrix format'],
    },
    recognitionCheck: {
      question: 'Which description best matches Connected Components?',
      options: [
        { id: 'a', text: 'Partition undirected graph vertices into isolated reachable clusters.', isCorrect: true, feedback: 'Correct! This is an undirected graph connected components pattern.' },
        { id: 'b', text: 'Find maximum sliding window value.', isCorrect: false, feedback: 'Incorrect. This involves graph partition, not array window maxima.' },
      ],
    },
    takeaway: {
      specificProblem: 'Count components in graph with 5 nodes and 3 edges.',
      generalPattern: 'Find maximal sets of connected vertices in undirected networks.',
      finalStatement: 'Recognize disjoint graph components before choosing DFS, BFS, or Union-Find algorithms.',
    },
  },

  'kth-smallest-bst': {
    problemId: 'kth-smallest-bst',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from tree pointers to sorted in-order traversal properties.',
      inputLabel: 'BINARY SEARCH TREE',
      inputVisual: ['[ 3 ]', '↙   ↘', '[ 1 ]  [ 4 ]', '   ↘', '   [ 2 ]'],
      targetLabel: 'RANK K',
      targetValue: 'k = 1 ➔ Value: 1',
      coreRelationship: [
        { label: 'BST Property', sub: 'Left < Node < Right' },
        { label: 'Inorder Sort Sequence', sub: 'Inorder traversal yields sorted order' },
        { label: 'Target Rank K', sub: 'Stop at Kth visited node' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Input tree is a Binary Search Tree (BST).', detail: 'Left subtree values < Root value < Right subtree values.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Inorder traversal visits BST nodes in ascending sorted order.', detail: 'Left ➔ Node ➔ Right produces strictly increasing values.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Objective is locating the Kth element in sorted sequence.', detail: 'Counting visited nodes during inorder traversal gives answer at count K.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Tree structure maps directly to sorted rank statistics via inorder traversal.',
      concrete: { items: ['BST: [3,1,4,null,2]', 'k = 1'], target: '1st smallest = 1' },
      abstractFormula: { varA: 'BST INORDER', operator: '➜ Traversal Step K', varB: 'SORTED SEQUENCE', equals: '=', result: 'KTH SMALLEST VALUE' },
      statement: 'Inorder traversal transforms a Binary Search Tree into a sorted rank statistic.',
    },
    pattern: {
      name: 'BST In-Order Traversal / Rank Statistic Pattern',
      tagline: 'Exploit binary search tree order invariant to retrieve the Kth ordered element.',
      description: 'When a problem asks for the Kth smallest or largest value in a Binary Search Tree, you are looking at a BST in-order rank statistic pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Binary Search Tree + Integer K' },
        { stage: 'RELATIONSHIP', value: 'Inorder traversal (Left ➔ Root ➔ Right)' },
        { stage: 'CONDITION', value: 'Count visited nodes until count equals K' },
        { stage: 'OUTPUT', value: 'Value at Kth visited node' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with BST Ordering / Rank Statistic problems?',
      families: [
        { id: 'fam_1', name: 'Iterative Stack-based Inorder', detail: 'Traverse left branches onto stack, popping K times.' },
        { id: 'fam_2', name: 'Recursive Inorder Traversal', detail: 'Recursively process left, decrement K, process right.' },
        { id: 'fam_3', name: 'Augmented BST Nodes', detail: 'Store left subtree node count for O(H) rank lookup.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That BST inorder yields sorted order', 'That Kth visit answers the query'],
      doesNotTellUs: ['Iterative stack vs recursive call stack traversal', 'Early stopping short-circuit details'],
    },
    recognitionCheck: {
      question: 'Which description best matches Kth Smallest Element in a BST?',
      options: [
        { id: 'a', text: 'Leverage BST inorder sorted property to locate element at rank K.', isCorrect: true, feedback: 'Correct! This is a BST in-order traversal / rank statistic pattern.' },
        { id: 'b', text: 'Merge overlapping interval ranges.', isCorrect: false, feedback: 'Incorrect. This involves BST traversal ordering, not interval merging.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find 1st smallest value in BST [3,1,4,null,2].',
      generalPattern: 'Use BST in-order traversal to extract the Kth sorted value.',
      finalStatement: 'Recognize BST sorted invariants before implementing stack or recursive traversal logic.',
    },
  },

  'top-k-frequent': {
    problemId: 'top-k-frequent',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from raw element lists to frequency count rankings.',
      inputLabel: 'NUMERIC ARRAY',
      inputVisual: ['[ 1, 1, 1, 2, 2, 3 ]', 'k = 2'],
      targetLabel: 'TOP K FREQUENT',
      targetValue: '[ 1, 2 ]',
      coreRelationship: [
        { label: 'Frequency Hash Map', sub: 'Element ➔ Count occurrences' },
        { label: 'Frequency Ranking', sub: 'Order elements by occurrence count' },
        { label: 'Top K Selection', sub: 'Extract top K elements by count' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Need counts of how many times each element appears.', detail: 'Mapping elements to occurrence frequencies is required first.' },
        { id: 's2', title: 'SIGNAL 02', label: 'We need the K most frequent items, not full sorting.', detail: 'Ranking is based on frequency values rather than element values.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Target is a subset of size K containing max frequencies.', detail: 'Extract K elements with highest occurrence count.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Element identities are secondary; frequency aggregation + top-K ranking defines shape.',
      concrete: { items: [1, 1, 1, 2, 2, 3], target: 'Top k=2 ➔ [1, 2]' },
      abstractFormula: { varA: 'FREQUENCY MAP', operator: '➔ Rank Top K ➔', varB: 'PRIORITY / BUCKET', equals: '=', result: 'TOP K FREQUENT' },
      statement: 'Elements map to occurrence counts, which are then selected by top-K rank.',
    },
    pattern: {
      name: 'Frequency Aggregation & Priority Ranking Pattern',
      tagline: 'Count frequencies in a map then extract the K highest-frequency elements.',
      description: 'When a problem asks for the K most frequent or common elements in a collection, you are looking at a frequency aggregation pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Array of numbers + integer K' },
        { stage: 'RELATIONSHIP', value: 'Element-to-frequency hash count' },
        { stage: 'CONDITION', value: 'Select top K highest frequencies' },
        { stage: 'OUTPUT', value: 'Array of K most frequent elements' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Frequency Ranking / Top-K problems?',
      families: [
        { id: 'fam_1', name: 'Min-Heap Priority Queue O(N log K)', detail: 'Maintain size-K min-heap ordered by frequency.' },
        { id: 'fam_2', name: 'Bucket Sort O(N)', detail: 'Group elements into frequency buckets indexed 1..N.' },
        { id: 'fam_3', name: 'HashMap + Full Sorting O(N log N)', detail: 'Build frequency map then sort entries by count.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That frequency mapping is required', 'That selection depends on occurrence count'],
      doesNotTellUs: ['Bucket sort O(N) vs Heap O(N log K)', 'Tie-breaking ordering rules'],
    },
    recognitionCheck: {
      question: 'Which description best matches Top K Frequent Elements?',
      options: [
        { id: 'a', text: 'Aggregate element occurrence counts and select top K by frequency.', isCorrect: true, feedback: 'Correct! Top K Frequent Elements is a frequency aggregation & priority ranking pattern.' },
        { id: 'b', text: 'Find maximum unique character substring window.', isCorrect: false, feedback: 'Incorrect. This involves frequency count rankings, not string substring windows.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find 2 most frequent numbers in [1,1,1,2,2,3].',
      generalPattern: 'Map elements to frequencies then extract top K counts.',
      finalStatement: 'Recognize frequency mapping and top-K selection before choosing Heap vs Bucket Sort.',
    },
  },

  'product-except-self': {
    problemId: 'product-except-self',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from total division to prefix and suffix cumulative products.',
      inputLabel: 'INPUT ARRAY',
      inputVisual: ['[ 1 ]', '[ 2 ]', '[ 3 ]', '[ 4 ]'],
      targetLabel: 'PRODUCT EXCEPT SELF',
      targetValue: '[ 24, 12, 8, 6 ]',
      coreRelationship: [
        { label: 'Prefix Cumulative Product', sub: 'Product of all items to left of i' },
        { label: 'Suffix Cumulative Product', sub: 'Product of all items to right of i' },
        { label: 'Combined Output', sub: 'Prefix[i] × Suffix[i]' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Output at index i equals product of all other elements.', detail: 'Result[i] excludes nums[i] from the total product.' },
        { id: 's2', title: 'SIGNAL 02', label: 'Division is explicitly forbidden (O(N) time required).', detail: 'Cannot compute total product and divide by nums[i].' },
        { id: 's3', title: 'SIGNAL 03', label: 'Output splits cleanly into left sub-product and right sub-product.', detail: 'Left items (0 to i-1) and right items (i+1 to N-1) multiply together.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Array values change; prefix-suffix cumulative decomposition remains.',
      concrete: { items: [1, 2, 3, 4], target: '[24, 12, 8, 6]' },
      abstractFormula: { varA: 'PREFIX (0...i-1)', operator: '×', varB: 'SUFFIX (i+1...N-1)', equals: '=', result: 'RESULT[i]' },
      statement: 'Excluding index i decomposes an array product into prefix and suffix accumulators.',
    },
    pattern: {
      name: 'Prefix / Suffix Accumulator Decomposition Pattern',
      tagline: 'Decompose global sequence calculations into left prefix and right suffix cumulative passes.',
      description: 'When a problem evaluates an aggregate over all elements except the current index without division, you are looking at a prefix/suffix pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Array of N integers' },
        { stage: 'RELATIONSHIP', value: 'Prefix product (left) × Suffix product (right)' },
        { stage: 'CONDITION', value: 'Exclude current index i without division' },
        { stage: 'OUTPUT', value: 'Array of products except self' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Prefix/Suffix Accumulator problems?',
      families: [
        { id: 'fam_1', name: 'Two-Pass Prefix-Suffix Sweeps', detail: 'Compute left products in pass 1, right products in pass 2.' },
        { id: 'fam_2', name: 'O(1) Extra Space Rolling Accumulator', detail: 'Reuse output array for prefix pass and accumulate suffix in a single variable.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That result[i] = prefix[i-1] * suffix[i+1]', 'That left and right sweeps isolate index i'],
      doesNotTellUs: ['Whether to store explicit prefix/suffix arrays or use rolling variable O(1) space', 'Handling zero elements'],
    },
    recognitionCheck: {
      question: 'Which description best matches Product of Array Except Self?',
      options: [
        { id: 'a', text: 'Decompose calculations into left prefix and right suffix accumulators.', isCorrect: true, feedback: 'Correct! Product Except Self is a prefix/suffix accumulator decomposition pattern.' },
        { id: 'b', text: 'Traverse binary tree in order.', isCorrect: false, feedback: 'Incorrect. This involves array prefix/suffix sweeps, not binary tree nodes.' },
      ],
    },
    takeaway: {
      specificProblem: 'Calculate products except self for [1,2,3,4].',
      generalPattern: 'Combine left prefix and right suffix accumulated values to exclude current index.',
      finalStatement: 'Recognize prefix and suffix cumulative sweeps before implementing two-pass array loops.',
    },
  },

  'single-number': {
    problemId: 'single-number',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from counting to self-canceling binary pair properties.',
      inputLabel: 'PAIRED ARRAY',
      inputVisual: ['[ 4, 1, 2, 1, 2 ]'],
      targetLabel: 'SINGLE ELEMENT',
      targetValue: '4 (Unpaired)',
      coreRelationship: [
        { label: 'Duplicate Pairs', sub: 'Every element appears twice except one' },
        { label: 'Symmetric Cancellation', sub: 'Identical pairs cancel out' },
        { label: 'Residual Element', sub: 'Single unique item remains' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Every number appears exactly twice except for one unique number.', detail: 'Elements are paired symmetrically throughout the array.' },
        { id: 's2', title: 'SIGNAL 02', label: 'O(N) time and O(1) extra memory constraint.', detail: 'Using extra HashSets or sorting violates O(1) memory or time limits.' },
        { id: 's3', title: 'SIGNAL 03', label: 'Order of elements does not matter.', detail: 'Pair cancellation is invariant under array permutations.' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Array values change; self-inverting algebraic cancellation property remains.',
      concrete: { items: [4, 1, 2, 1, 2], target: '4' },
      abstractFormula: { varA: 'PAIR (X ⊕ X = 0)', operator: '⊕', varB: 'SINGLE (Y)', equals: '=', result: 'Y (RESIDUAL)' },
      statement: 'Self-canceling operations reduce duplicate pairs to zero, isolating the single element.',
    },
    pattern: {
      name: 'Symmetric Pair Cancellation / Bitwise Invariant Pattern',
      tagline: 'Exploit self-canceling mathematical properties (X ⊕ X = 0) to isolate unique elements.',
      description: 'When a problem requires finding an unpaired element among duplicate pairs in linear time and constant space, you are looking at a bitwise cancellation pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: 'Array with duplicate pairs + 1 single item' },
        { stage: 'RELATIONSHIP', value: 'Symmetric cancellation (X ⊕ X = 0)' },
        { stage: 'CONDITION', value: 'Accumulate XOR across all elements' },
        { stage: 'OUTPUT', value: 'Single non-repeating element' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Pair Cancellation problems?',
      families: [
        { id: 'fam_1', name: 'Bitwise XOR Accumulation O(N) time O(1) space', detail: 'XOR all elements together; paired values cancel to 0.' },
        { id: 'fam_2', name: 'HashMap Frequency Counting O(N) space', detail: 'Track counts in hash map then return key with count 1.' },
        { id: 'fam_3', name: 'Sorting + Adjacent Comparison O(N log N)', detail: 'Sort array then check adjacent pairs.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That duplicate pairs cancel out', 'That XOR operator satisfies commutativity and associativity'],
      doesNotTellUs: ['Bitwise XOR bit manipulation vs HashMap space tradeoff', 'Exact low-level bitwise syntax'],
    },
    recognitionCheck: {
      question: 'Which description best matches Single Number?',
      options: [
        { id: 'a', text: 'Isolate unpaired element via self-canceling bitwise XOR invariant.', isCorrect: true, feedback: 'Correct! Single Number is a symmetric pair cancellation / bitwise invariant pattern.' },
        { id: 'b', text: 'Count connected graph components.', isCorrect: false, feedback: 'Incorrect. This involves bitwise pair cancellation, not graph connectivity.' },
      ],
    },
    takeaway: {
      specificProblem: 'Find unique number in [4, 1, 2, 1, 2].',
      generalPattern: 'Use self-inverting algebraic properties to cancel duplicate pairs.',
      finalStatement: 'Recognize bitwise XOR pair cancellation invariants before choosing O(1) space bit manipulation.',
    },
  },

  'word-search': {
    problemId: 'word-search',
    intro: {
      eyebrow: '04 · PATTERN',
      title: 'Recognize the structure behind the problem.',
      subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: 'Look at what the problem is asking.',
      subtitle: 'Shift attention from static grid cells to pathfinding matching sequences with backtracking.',
      inputLabel: '2D CHARACTER GRID',
      inputVisual: ['A  B  C  E', 'S  F  C  S', 'A  D  E  E'],
      targetLabel: 'TARGET WORD & PATH',
      targetValue: 'Word: "ABCCED" ➔ EXISTS',
      coreRelationship: [
        { label: '2D Grid Adjacency', sub: 'Horizontal & vertical neighbors' },
        { label: 'Character Sequence Match', sub: 'Match word[i] at step i' },
        { label: 'Visited State Reset', sub: 'Unmark cell when backtracking' },
      ],
    },
    signals: {
      title: 'What stands out?',
      subtitle: 'Identify key structural signals from the problem description.',
      observations: [
        { id: 's1', title: 'SIGNAL 01', label: 'Search occurs in a 2D matrix of character cells.', detail: 'Movement proceeds to adjacent orthogonal neighbors (up, down, left, right).' },
        { id: 's2', title: 'SIGNAL 02', label: 'Cell values must match consecutive characters of a target word.', detail: 'Step k in grid path must equal word[k].' },
        { id: 's3', title: 'SIGNAL 03', label: 'Same grid cell cannot be reused within a single path.', detail: 'Visited cells must be tracked and restored when stepping back (backtracking).' },
      ],
    },
    abstraction: {
      title: 'Abstract the problem.',
      subtitle: 'Grid letters change; 2D spatial path search with state restoration defines structure.',
      concrete: { items: ['Grid: 3x4 board', 'Word: "ABCCED"'], target: 'EXISTS = TRUE' },
      abstractFormula: { varA: 'CELL (r,c) == WORD[k]', operator: '➜ 4-Dir Step ➜', varB: 'UNVISITED NEIGHBOR', equals: 'Match:', result: 'PATH VALIDITY' },
      statement: 'Sequential character matching over 2D grid neighbors forms a spatial backtracking path search.',
    },
    pattern: {
      name: '2D Grid Path Search & Backtracking Pattern',
      tagline: 'Search for sequential character matches across grid neighbor paths with state undo.',
      description: 'When a problem requires finding a sequence path in a 2D grid where visited cells must be restored during exploration, you are looking at a grid backtracking pattern.',
    },
    fingerprint: {
      title: 'Pattern Fingerprint',
      steps: [
        { stage: 'INPUT', value: '2D Grid Matrix + Target Word String' },
        { stage: 'RELATIONSHIP', value: 'Orthogonal 4-directional neighbor path' },
        { stage: 'CONDITION', value: 'Match word characters without reusing cells' },
        { stage: 'OUTPUT', value: 'Boolean true if valid path exists' },
      ],
    },
    solutionFamilies: {
      title: 'Solution Families',
      subtitle: 'What approaches should come to mind for this pattern?',
      question: 'Which tools or solution families are commonly associated with Grid Path Search / Backtracking problems?',
      families: [
        { id: 'fam_1', name: 'DFS with Backtracking (In-place Grid Mutation)', detail: 'Temporarily mark cell visited (e.g., "#"), recurse 4 directions, restore original character.' },
        { id: 'fam_2', name: 'DFS with Visited Set Tracking', detail: 'Pass set of visited (r,c) coordinates into recursive calls.' },
      ],
      note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
    },
    limitations: {
      title: 'What the Pattern Does NOT Tell Us',
      subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: ['That 4-directional grid traversal applies', 'That visited state must be restored upon dead ends'],
      doesNotTellUs: ['In-place grid mutation vs visited coordinate Set', 'Exact boundary pruning order'],
    },
    recognitionCheck: {
      question: 'Which description best matches Word Search?',
      options: [
        { id: 'a', text: 'Search 2D grid for sequential character path with backtracking state restoration.', isCorrect: true, feedback: 'Correct! Word Search is a 2D grid path search & backtracking pattern.' },
        { id: 'b', text: 'Find minimum steps in unweighted graph using BFS.', isCorrect: false, feedback: 'Incorrect. This involves 2D grid word path matching with backtracking, not graph BFS.' },
      ],
    },
    takeaway: {
      specificProblem: 'Search 3x4 board for word "ABCCED".',
      generalPattern: 'Match sequence characters across 2D grid paths restoring visited states.',
      finalStatement: 'Recognize 2D grid spatial path requirements and visited state undo before writing recursive DFS backtracking.',
    },
  },
};

// Map ID aliases to ensure exact match between mockProblems.js IDs and mockPatterns.js keys
MOCK_PATTERNS['binary-tree-inorder'] = MOCK_PATTERNS['binary-tree-inorder-traversal'];
MOCK_PATTERNS['kth-largest-element'] = MOCK_PATTERNS['kth-largest-element-in-an-array'];
MOCK_PATTERNS['longest-substring-no-repeat'] = MOCK_PATTERNS['longest-substring-without-repeating-characters'];
MOCK_PATTERNS['shortest-path-graph'] = MOCK_PATTERNS['shortest-path-in-unweighted-graph'];

/**
 * Helper function to retrieve pattern data by problem ID.
 * Defaults to twoSumPattern if problem ID is unknown or omitted.
 */
export function getPatternByProblemId(problemId) {
  if (!problemId) return twoSumPattern;

  const aliasMap = {
    'binary-tree-inorder': 'binary-tree-inorder-traversal',
    'kth-largest-element': 'kth-largest-element-in-an-array',
    'longest-substring-no-repeat': 'longest-substring-without-repeating-characters',
    'shortest-path-graph': 'shortest-path-in-unweighted-graph',
  };

  const key = aliasMap[problemId] || problemId;

  if (MOCK_PATTERNS[key]) {
    return MOCK_PATTERNS[key];
  }

  return twoSumPattern;
}

export default MOCK_PATTERNS;
