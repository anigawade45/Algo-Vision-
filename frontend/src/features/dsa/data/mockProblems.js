import { getUnderstandingByProblemId } from './understanding/index.js';


/**
 * Mock Problems Database for AlgoVision DSA Workspace
 * Contains 10 structurally diverse DSA problems with standardized Stage 01 & Stage 02 schemas:
 * 1. Two Sum (Array + Target -> Indices)
 * 2. Valid Parentheses (String -> Boolean)
 * 3. Reverse Linked List (Singly Linked List -> Reversed List)
 * 4. Binary Tree Inorder Traversal (Binary Tree -> Value Sequence Array)
 * 5. Number of Islands (2D Grid Matrix -> Integer Count)
 * 6. Kth Largest Element in an Array (Array + Rank K -> Integer)
 * 7. Sliding Window Maximum (Array + Window Size K -> Array of Maxima)
 * 8. Merge Intervals (Array of Ranges -> Merged Ranges Array)
 * 9. Longest Substring Without Repeating Characters (String -> Length Integer)
 * 10. Shortest Path in Unweighted Graph (Graph Adjacency Map -> Distance Integer)
 */

const INITIAL_MOCK_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    objective: 'Find two numbers in the array whose sum equals the target.',
    description:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    inputData: {
      type: 'array_with_target',
      label: 'INPUT DATA',
      value: {
        array: [2, 7, 11, 15],
        target: 9,
      },
    },
    outputData: {
      type: 'indices',
      label: 'REQUIRED OUTPUT',
      description: 'The positions (indices) of the two numbers that satisfy the target condition.',
      expectedRepresentation: 'INDICES OF MATCHING VALUES',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [2, 7, 11, 15], target = 9',
        outputRaw: '[0, 1]',
        inputStructured: {
          type: 'array_with_target',
          array: [2, 7, 11, 15],
          target: 9,
        },
        outputStructured: {
          type: 'indices',
          value: [0, 1],
        },
        reasoning: [
          '2 + 7 = 9 (matches target 9)',
          '2 is at array index 0',
          '7 is at array index 1',
          'Therefore: [0, 1]',
        ],
        interaction: {
          type: 'pair_sum',
          array: [2, 7, 11, 15],
          target: 9,
          expectedIndices: [0, 1],
        },
      },
      {
        id: 2,
        inputRaw: 'nums = [3, 2, 4], target = 6',
        outputRaw: '[1, 2]',
        inputStructured: {
          type: 'array_with_target',
          array: [3, 2, 4],
          target: 6,
        },
        outputStructured: {
          type: 'indices',
          value: [1, 2],
        },
        reasoning: [
          '2 + 4 = 6 (matches target 6)',
          '2 is at array index 1',
          '4 is at array index 2',
          'Therefore: [1, 2]',
        ],
        interaction: {
          type: 'pair_sum',
          array: [3, 2, 4],
          target: 6,
          expectedIndices: [1, 2],
        },
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'EXACTLY ONE SOLUTION EXISTS',
        detail: 'The problem guarantees that each input will have precisely one valid pair that satisfies the condition, eliminating ambiguous or multiple answers.',
      },
      {
        stepNo: '02',
        title: 'ELEMENT REUSE IS FORBIDDEN',
        detail: 'The same array element at a single index cannot be used twice to reach the target sum.',
      },
      {
        stepNo: '03',
        title: 'ORDER OF INDICES IN OUTPUT IS FLEXIBLE',
        detail: 'The resulting index pair can be returned in any order without affecting correctness.',
      },
    ],
  },

  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    category: 'String',
    difficulty: 'Easy',
    objective: 'Determine whether the bracket sequence is valid.',
    description:
      'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.\n\nAn input string is valid if open brackets are closed by the same type of brackets and closed in the correct order.',
    constraints: [
      '1 ≤ s.length ≤ 10⁴',
      's consists of parentheses only: "()[]{}"',
    ],
    inputData: {
      type: 'string',
      label: 'INPUT STRING (s)',
      value: '([{}])',
    },
    outputData: {
      type: 'boolean',
      label: 'REQUIRED OUTPUT',
      description: 'A boolean value indicating whether all open brackets close in the correct order.',
      expectedRepresentation: 'BOOLEAN DECISION (true / false)',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 's = "([{}])"',
        outputRaw: 'true',
        inputStructured: {
          type: 'string',
          value: '([{}])',
        },
        outputStructured: {
          type: 'boolean',
          value: true,
        },
        reasoning: [
          'Inner bracket pair {} opens at index 2 and closes at index 3.',
          'Middle bracket pair [] opens at index 1 and closes at index 4.',
          'Outer bracket pair () opens at index 0 and closes at index 5.',
          'All pairs match and close in proper nested order → true.',
        ],
      },
      {
        id: 2,
        inputRaw: 's = "([)]"',
        outputRaw: 'false',
        inputStructured: {
          type: 'string',
          value: '([)]',
        },
        outputStructured: {
          type: 'boolean',
          value: false,
        },
        reasoning: [
          'The opening bracket "[" is closed by ")", which is an invalid bracket type mismatch.',
          'Result: false.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'NESTED BRACKETS MUST CLOSE IN CORRECT ORDER',
        detail: 'A bracket sequence is valid only when each opening bracket is matched by the correct closing bracket in the required nested order.',
      },
      {
        stepNo: '02',
        title: 'TYPES MUST MATCH EXACTLY',
        detail: 'An opening brace "{" can only be closed by a matching closing brace "}".',
      },
      {
        stepNo: '03',
        title: 'DECISION IS A BOOLEAN RESULT',
        detail: 'The output is a boolean flag indicating whether the sequence satisfies nesting rules.',
      },
    ],
  },

  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    category: 'Linked List',
    difficulty: 'Easy',
    objective: 'Return the linked list with its node order reversed.',
    description:
      'Given the head of a singly linked list, reverse the list, and return the head of the reversed list.',
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 ≤ Node.val ≤ 5000',
    ],
    inputData: {
      type: 'linked_list',
      label: 'HEAD OF LINKED LIST',
      nodes: [1, 2, 3, 4, 5],
    },
    outputData: {
      type: 'linked_list',
      label: 'REQUIRED OUTPUT',
      description: 'The head node of the reversed singly linked list.',
      expectedRepresentation: 'REVERSED LINKED LIST HEAD',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'head = [1, 2, 3, 4, 5]',
        outputRaw: '[5, 4, 3, 2, 1]',
        inputStructured: {
          type: 'linked_list',
          nodes: [1, 2, 3, 4, 5],
        },
        outputStructured: {
          type: 'linked_list',
          nodes: [5, 4, 3, 2, 1],
        },
        reasoning: [
          'Original sequence: 1 → 2 → 3 → 4 → 5 → null',
          'Reversed sequence: 5 → 4 → 3 → 2 → 1 → null',
          'The original tail node (5) becomes the new head of the returned list.',
        ],
      },
      {
        id: 2,
        inputRaw: 'head = [1, 2]',
        outputRaw: '[2, 1]',
        inputStructured: {
          type: 'linked_list',
          nodes: [1, 2],
        },
        outputStructured: {
          type: 'linked_list',
          nodes: [2, 1],
        },
        reasoning: [
          'Original sequence: 1 → 2 → null',
          'Reversed sequence: 2 → 1 → null',
          'Node 2 becomes the new head.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'THE NODE ORDER IS REVERSED',
        detail: 'The nodes appear in the opposite order in the resulting linked list.',
      },
      {
        stepNo: '02',
        title: 'THE ORIGINAL LAST NODE BECOMES FIRST',
        detail: 'The node at the end of the original sequence becomes the first node of the result.',
      },
      {
        stepNo: '03',
        title: 'ORIGINAL HEAD POINTS TO NULL',
        detail: 'The first node of the input list becomes the terminal node pointing to null.',
      },
    ],
  },

  {
    id: 'binary-tree-inorder',
    title: 'Binary Tree Inorder Traversal',
    category: 'Trees',
    difficulty: 'Easy',
    objective: 'Return the values of the tree in inorder sequence.',
    description:
      'Given the root of a binary tree, return the inorder traversal of its nodes values.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 ≤ Node.val ≤ 100',
    ],
    inputData: {
      type: 'binary_tree',
      label: 'BINARY TREE ROOT',
      nodes: [
        { id: 1, val: 1, left: null, right: 2 },
        { id: 2, val: 2, left: 3, right: null },
        { id: 3, val: 3, left: null, right: null },
      ],
      arrayForm: [1, null, 2, 3],
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'An array of node values collected in Left → Root → Right sequence.',
      expectedRepresentation: 'INORDER VALUE SEQUENCE ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'root = [1, null, 2, 3]',
        outputRaw: '[1, 3, 2]',
        inputStructured: {
          type: 'binary_tree',
          arrayForm: [1, null, 2, 3],
          treeNodes: [
            { id: 1, val: 1, left: null, right: 2 },
            { id: 2, val: 2, left: 3, right: null },
            { id: 3, val: 3, left: null, right: null },
          ],
        },
        outputStructured: {
          type: 'array',
          value: [1, 3, 2],
        },
        reasoning: [
          'Visit Left subtree of Node 1: empty (null).',
          'Record Node 1 value → [1].',
          'Traverse Right subtree of Node 1 (Rooted at Node 2).',
          'Visit Left child of Node 2: Node 3 → Record Node 3 value → [1, 3].',
          'Record Node 2 value → [1, 3, 2].',
          'Inorder Sequence: [1, 3, 2].',
        ],
      },
      {
        id: 2,
        inputRaw: 'root = [1, 2, 3]',
        outputRaw: '[2, 1, 3]',
        inputStructured: {
          type: 'binary_tree',
          arrayForm: [1, 2, 3],
          treeNodes: [
            { id: 1, val: 1, left: 2, right: 3 },
            { id: 2, val: 2, left: null, right: null },
            { id: 3, val: 3, left: null, right: null },
          ],
        },
        outputStructured: {
          type: 'array',
          value: [2, 1, 3],
        },
        reasoning: [
          'Traverse Left subtree of Node 1: Node 2 → Record [2].',
          'Record Root Node 1 value → [2, 1].',
          'Traverse Right subtree of Node 1: Node 3 → Record [2, 1, 3].',
          'Inorder Sequence: [2, 1, 3].',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'THE OUTPUT FOLLOWS A SPECIFIC TREE ORDER',
        detail: "The required sequence follows the tree's left → node → right ordering.",
      },
      {
        stepNo: '02',
        title: 'HIERARCHY FLATTENED INTO ARRAY',
        detail: 'The hierarchical 2D tree structure is transformed into a 1D sequential list of values.',
      },
      {
        stepNo: '03',
        title: 'NULL NODES DO NOT PRODUCE VALUES',
        detail: 'Missing child links (null pointers) are skipped in the output sequence.',
      },
    ],
  },

  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    category: '2D Matrix',
    difficulty: 'Medium',
    objective: 'Count the number of connected islands in the grid.',
    description:
      'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 300',
      'grid[i][j] is "0" or "1".',
    ],
    inputData: {
      type: 'matrix',
      label: '2D GRID MATRIX (m × n)',
      grid: [
        ['1', '1', '0', '0'],
        ['1', '1', '0', '0'],
        ['0', '0', '1', '0'],
        ['0', '0', '0', '1'],
      ],
      legend: { '1': 'Land', '0': 'Water' },
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'An integer representing the total count of isolated connected land regions.',
      expectedRepresentation: 'TOTAL ISLAND COUNT (INTEGER)',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'grid = [["1","1","0"],["1","0","0"],["0","0","1"]]',
        outputRaw: '2',
        inputStructured: {
          type: 'matrix',
          grid: [
            ['1', '1', '0'],
            ['1', '0', '0'],
            ['0', '0', '1'],
          ],
          legend: { '1': 'Land', '0': 'Water' },
        },
        outputStructured: {
          type: 'number',
          value: 2,
        },
        reasoning: [
          'Region 1: Land cells at (0,0), (0,1), and (1,0) are horizontally/vertically adjacent → 1 island.',
          'Region 2: Isolated land cell at (2,2) surrounded by water → 1 island.',
          'Total distinct connected land regions = 2.',
        ],
      },
      {
        id: 2,
        inputRaw: 'grid = [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]',
        outputRaw: '3',
        inputStructured: {
          type: 'matrix',
          grid: [
            ['1', '1', '0', '0'],
            ['1', '1', '0', '0'],
            ['0', '0', '1', '0'],
            ['0', '0', '0', '1'],
          ],
          legend: { '1': 'Land', '0': 'Water' },
        },
        outputStructured: {
          type: 'number',
          value: 3,
        },
        reasoning: [
          'Region 1: Land cells at (0,0), (0,1), (1,0), (1,1) form a 2x2 connected block → 1 island.',
          'Region 2: Isolated land cell at (2,2) → 1 island.',
          'Region 3: Isolated land cell at (3,3) → 1 island.',
          'Total distinct connected land regions = 3.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'LAND CONNECTS HORIZONTALLY & VERTICALLY',
        detail: 'Cells with value "1" belong to the same island if they touch left, right, top, or bottom.',
      },
      {
        stepNo: '02',
        title: 'WATER ACTS AS A BOUNDARY',
        detail: 'Surrounding "0" cells separate distinct islands from one another.',
      },
      {
        stepNo: '03',
        title: 'RESULT IS A SINGLE NUMERICAL COUNT',
        detail: 'The output measures the total number of connected land components.',
      },
    ],
  },

  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    category: 'Array',
    difficulty: 'Medium',
    objective: 'Find the kth largest value in the array.',
    description:
      'Given an integer array nums and an integer k, return the kth largest element in the array.\n\nNote that it is the kth largest element in the sorted order, not the kth distinct element.',
    constraints: [
      '1 ≤ k ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    inputData: {
      type: 'array_with_k',
      label: 'INPUT ARRAY (nums) & RANK (k)',
      array: [3, 2, 1, 5, 6, 4],
      k: 2,
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'The single numerical element value positioned at k-th rank when ordered from largest to smallest.',
      expectedRepresentation: 'SCALAR VALUE',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
        outputRaw: '5',
        inputStructured: {
          type: 'array_with_k',
          array: [3, 2, 1, 5, 6, 4],
          k: 2,
        },
        outputStructured: {
          type: 'number',
          value: 5,
        },
        reasoning: [
          'In the values [3, 2, 1, 5, 6, 4]:',
          '6 is the 1st largest value.',
          '5 is the 2nd largest value.',
          'For k = 2, the 2nd largest value is 5.',
        ],
      },
      {
        id: 2,
        inputRaw: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
        outputRaw: '4',
        inputStructured: {
          type: 'array_with_k',
          array: [3, 2, 3, 1, 2, 4, 5, 5, 6],
          k: 4,
        },
        outputStructured: {
          type: 'number',
          value: 4,
        },
        reasoning: [
          'Sorted in descending order: [6, 5, 5, 4, 3, 3, 2, 2, 1].',
          '1st largest: 6, 2nd largest: 5, 3rd largest: 5, 4th largest: 4.',
          'For k = 4, the 4th largest value is 4.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'RANKING IS 1-INDEXED',
        detail: 'k = 1 refers to the maximum element value in the array.',
      },
      {
        stepNo: '02',
        title: 'DUPLICATE VALUES ARE COUNTED SEPARATELY',
        detail: 'The rank is based on overall position rank, not distinct element filtering.',
      },
      {
        stepNo: '03',
        title: 'RETURN VALUE IS THE NUMERICAL ELEMENT',
        detail: 'The output is the value itself, not its original index position.',
      },
    ],
  },

  {
    id: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    category: 'Array',
    difficulty: 'Hard',
    objective: 'Find the maximum value in every window of size k.',
    description:
      'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.\n\nReturn the max sliding window.',
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      '1 ≤ k ≤ nums.length',
    ],
    inputData: {
      type: 'array_with_window',
      label: 'ARRAY (nums) & WINDOW SIZE (k)',
      array: [1, 3, -1, -3, 5, 3, 6, 7],
      k: 3,
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'An array recording the local maximum value observed in each k-length window.',
      expectedRepresentation: 'MAXIMA VALUE ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
        outputRaw: '[3, 3, 5, 5, 6, 7]',
        inputStructured: {
          type: 'array_with_window',
          array: [1, 3, -1, -3, 5, 3, 6, 7],
          k: 3,
        },
        outputStructured: {
          type: 'array',
          value: [3, 3, 5, 5, 6, 7],
        },
        reasoning: [
          'Window 1: [1, 3, -1] → Max is 3',
          'Window 2: [3, -1, -3] → Max is 3',
          'Window 3: [-1, -3, 5] → Max is 5',
          'Window 4: [-3, 5, 3] → Max is 5',
          'Window 5: [5, 3, 6] → Max is 6',
          'Window 6: [3, 6, 7] → Max is 7',
          'Result array: [3, 3, 5, 5, 6, 7]',
        ],
      },
      {
        id: 2,
        inputRaw: 'nums = [9, 11, 8, 5, 7, 10], k = 3',
        outputRaw: '[11, 11, 8, 10]',
        inputStructured: {
          type: 'array_with_window',
          array: [9, 11, 8, 5, 7, 10],
          k: 3,
        },
        outputStructured: {
          type: 'array',
          value: [11, 11, 8, 10],
        },
        reasoning: [
          'Window 1: [9, 11, 8] → Max is 11',
          'Window 2: [11, 8, 5] → Max is 11',
          'Window 3: [8, 5, 7] → Max is 8',
          'Window 4: [5, 7, 10] → Max is 10',
          'Result array: [11, 11, 8, 10]',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'WINDOW HAS FIXED LENGTH K',
        detail: 'The window spans k consecutive array elements at every step.',
      },
      {
        stepNo: '02',
        title: 'TOTAL WINDOWS FORMED',
        detail: 'For an array of length N, exactly (N - k + 1) window outputs are produced.',
      },
      {
        stepNo: '03',
        title: 'EACH OUTPUT IS A LOCAL MAXIMUM',
        detail: 'The result array stores the highest value found inside each window frame.',
      },
    ],
  },

  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    category: 'Intervals',
    difficulty: 'Medium',
    objective: 'Merge all overlapping intervals.',
    description:
      'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: [
      '1 ≤ intervals.length ≤ 10⁴',
      'intervals[i].length == 2',
      '0 ≤ starti ≤ endi ≤ 10⁴',
    ],
    inputData: {
      type: 'intervals',
      label: 'INTERVAL RANGES',
      ranges: [
        [1, 3],
        [2, 6],
        [8, 10],
        [15, 18],
      ],
    },
    outputData: {
      type: 'intervals',
      label: 'REQUIRED OUTPUT',
      description: 'An array of consolidated non-overlapping interval ranges.',
      expectedRepresentation: 'CONSOLIDATED INTERVAL RANGES',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        outputRaw: '[[1,6],[8,10],[15,18]]',
        inputStructured: {
          type: 'intervals',
          ranges: [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        },
        outputStructured: {
          type: 'intervals',
          ranges: [
            [1, 6],
            [8, 10],
            [15, 18],
          ],
        },
        reasoning: [
          'Intervals [1, 3] and [2, 6] overlap because start 2 ≤ end 3 → Combined into [1, 6].',
          'Interval [8, 10] does not overlap with [1, 6] → Retained as [8, 10].',
          'Interval [15, 18] does not overlap with [8, 10] → Retained as [15, 18].',
          'Merged Result: [[1, 6], [8, 10], [15, 18]].',
        ],
      },
      {
        id: 2,
        inputRaw: 'intervals = [[1,4],[4,5]]',
        outputRaw: '[[1,5]]',
        inputStructured: {
          type: 'intervals',
          ranges: [
            [1, 4],
            [4, 5],
          ],
        },
        outputStructured: {
          type: 'intervals',
          ranges: [
            [1, 5],
          ],
        },
        reasoning: [
          'Intervals [1, 4] and [4, 5] overlap at boundary point (start 4 ≤ end 4).',
          'Combined range spans from min(1, 4) = 1 to max(4, 5) = 5 → [1, 5].',
          'Merged Result: [[1, 5]].',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'OVERLAP CONDITION',
        detail: 'Two ranges overlap if the start of one range is less than or equal to the end of another.',
      },
      {
        stepNo: '02',
        title: 'MERGED BOUNDARIES',
        detail: 'The merged interval spans from min(start1, start2) to max(end1, end2).',
      },
      {
        stepNo: '03',
        title: 'NON-OVERLAPPING RANGES ARE PRESERVED',
        detail: 'Ranges with no mutual intersection remain separate in the final list.',
      },
    ],
  },

  {
    id: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    category: 'String',
    difficulty: 'Medium',
    objective: 'Find the length of the longest substring without repeating characters.',
    description:
      'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: [
      '0 ≤ s.length ≤ 5 × 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    inputData: {
      type: 'string',
      label: 'INPUT STRING (s)',
      value: 'abcabcbb',
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'An integer representing the maximum length of a contiguous substring containing all unique characters.',
      expectedRepresentation: 'MAXIMUM SUBSTRING LENGTH (INTEGER)',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 's = "abcabcbb"',
        outputRaw: '3',
        inputStructured: {
          type: 'string',
          value: 'abcabcbb',
        },
        outputStructured: {
          type: 'number',
          value: 3,
        },
        reasoning: [
          'Contiguous substrings with unique characters include "abc", "bca", "cab".',
          'The maximum length among all valid unique substrings is 3.',
          'Therefore output is 3.',
        ],
      },
      {
        id: 2,
        inputRaw: 's = "bbbbb"',
        outputRaw: '1',
        inputStructured: {
          type: 'string',
          value: 'bbbbb',
        },
        outputStructured: {
          type: 'number',
          value: 1,
        },
        reasoning: [
          'All characters in the string are identical ("b").',
          'The longest substring with all unique characters is single character "b".',
          'Therefore max length is 1.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'SUBSTRING MUST BE CONTIGUOUS',
        detail: 'Characters must appear sequentially without gaps in the original string.',
      },
      {
        stepNo: '02',
        title: 'ALL CHARACTERS IN SPAN MUST BE DISTINCT',
        detail: 'No character can appear more than once within the candidate substring window.',
      },
      {
        stepNo: '03',
        title: 'OUTPUT IS AN INTEGER LENGTH',
        detail: 'The result is the numerical length of the longest valid substring.',
      },
    ],
  },

  {
    id: 'shortest-path-graph',
    title: 'Shortest Path in Unweighted Graph',
    category: 'Graph',
    difficulty: 'Medium',
    objective: 'Find the minimum number of edge hops from start to destination.',
    description:
      'Given an unweighted directed graph represented as an adjacency list, a source node start, and a target node destination, return the minimum distance (number of edges) from start to destination.',
    constraints: [
      '1 ≤ V ≤ 1000 nodes',
      '0 ≤ E ≤ 5000 edges',
      '0 ≤ start, destination < V',
    ],
    inputData: {
      type: 'graph',
      label: 'GRAPH ADJACENCY MAP',
      adjacency: {
        0: [1, 2],
        1: [2],
        2: [3],
        3: [],
      },
      start: 0,
      destination: 3,
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'An integer representing the minimum edge count required to travel from start to destination node.',
      expectedRepresentation: 'MINIMUM EDGE DISTANCE (INTEGER)',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'graph = {0:[1,2], 1:[2], 2:[3], 3:[]}, start = 0, destination = 3',
        outputRaw: '2',
        inputStructured: {
          type: 'graph',
          adjacency: {
            0: [1, 2],
            1: [2],
            2: [3],
            3: [],
          },
          start: 0,
          destination: 3,
        },
        outputStructured: {
          type: 'number',
          value: 2,
        },
        reasoning: [
          'Path A: 0 → 1 → 2 → 3 (Length: 3 edges)',
          'Path B: 0 → 2 → 3 (Length: 2 edges)',
          'Shortest distance from Node 0 to Node 3 is 2 edges.',
        ],
      },
      {
        id: 2,
        inputRaw: 'graph = {0:[1], 1:[2], 2:[3], 3:[]}, start = 0, destination = 3',
        outputRaw: '3',
        inputStructured: {
          type: 'graph',
          adjacency: {
            0: [1],
            1: [2],
            2: [3],
            3: [],
          },
          start: 0,
          destination: 3,
        },
        outputStructured: {
          type: 'number',
          value: 3,
        },
        reasoning: [
          'Only one simple path exists: 0 → 1 → 2 → 3.',
          'Path length: 3 edges.',
          'Shortest distance from Node 0 to Node 3 is 3 edges.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'UNWEIGHTED EDGES HAVE UNIFORM COST',
        detail: 'Every edge connection between nodes counts as exactly 1 unit of distance.',
      },
      {
        stepNo: '02',
        title: 'MULTIPLE PATHWAYS MAY CONNECT NODES',
        detail: 'The goal is to measure the path with the minimum total edge steps.',
      },
      {
        stepNo: '03',
        title: 'RESULT IS A SHORTEST DISTANCE VALUE',
        detail: 'The output is the integer edge count representing the shortest path length.',
      },
    ],
  },

  {
    id: 'climbing-stairs',
    problemId: 'climbing-stairs',
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    objective: 'Calculate the total number of distinct ways to reach the top of an n-step staircase taking 1 or 2 steps at a time.',
    description: 'Given an integer n representing an n-step staircase, return the total number of distinct ways to reach the top taking 1 or 2 steps at a time.',
    constraints: ['1 ≤ n ≤ 45', 'Memory and execution time must be O(N).'],
    inputData: {
      type: 'single_value',
      label: 'STAIRCASE STEPS',
      value: { n: 5, allowedSteps: [1, 2] },
    },
    outputData: {
      type: 'integer',
      label: 'REQUIRED OUTPUT',
      description: 'The count of distinct paths to reach the top step.',
      expectedRepresentation: 'INTEGER PATH COUNT',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'n = 5',
        outputRaw: '8',
        inputStructured: { type: 'single_value', value: { n: 5, allowedSteps: [1, 2] } },
        outputStructured: { type: 'integer', value: 8 },
        reasoning: [
          'Each stride can be 1 step or 2 steps.',
          'To reach step 5, jump from step 4 (+1 step) or step 3 (+2 steps).',
          'dp[5] = dp[4] + dp[3] = 5 + 3 = 8 total ways.',
        ],
      },
      {
        id: 2,
        inputRaw: 'n = 3',
        outputRaw: '3',
        inputStructured: { type: 'single_value', value: { n: 3, allowedSteps: [1, 2] } },
        outputStructured: { type: 'integer', value: 3 },
        reasoning: ['Paths to step 3 are: (1+1+1), (1+2), and (2+1). Total = 3 unique ways.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'OPTIMAL SUBSTRUCTURE', detail: 'Reaching step i depends directly on solutions for steps i-1 and i-2.' },
      { stepNo: '02', title: 'OVERLAPPING SUBPROBLEMS', detail: 'Ways to reach step 3 is reused when computing step 4 and step 5.' },
    ],
  },

  {
    id: 'house-robber',
    problemId: 'house-robber',
    title: 'House Robber',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    objective: 'Determine the maximum amount of money you can rob tonight without alerting the police.',
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night.',
    constraints: ['1 ≤ nums.length ≤ 100', '0 ≤ nums[i] ≤ 400'],
    inputData: {
      type: 'array',
      label: 'HOUSE LOOT VALUES',
      value: [2, 7, 9, 3, 1],
    },
    outputData: {
      type: 'integer',
      label: 'REQUIRED OUTPUT',
      description: 'Maximum amount of money that can be stolen without robbing adjacent houses.',
      expectedRepresentation: 'MAXIMUM TOTAL LOOT',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [2, 7, 9, 3, 1]',
        outputRaw: '12',
        inputStructured: { type: 'array', value: [2, 7, 9, 3, 1] },
        outputStructured: { type: 'integer', value: 12 },
        reasoning: [
          'Rob house 1 (money = 2), rob house 3 (money = 9), rob house 5 (money = 1).',
          'Total loot = 2 + 9 + 1 = 12.',
        ],
      },
      {
        id: 2,
        inputRaw: 'nums = [1, 2, 3, 1]',
        outputRaw: '4',
        inputStructured: { type: 'array', value: [1, 2, 3, 1] },
        outputStructured: { type: 'integer', value: 4 },
        reasoning: ['Rob house 1 (money = 1) and rob house 3 (money = 3). Total = 4.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'NON-ADJACENT CHOICE', detail: 'At each house i, rob (nums[i] + dp[i-2]) or skip (dp[i-1]).' },
      { stepNo: '02', title: '1D STATE DEPENDENCY', detail: 'Only previous two max values are needed for state transitions.' },
    ],
  },

  {
    id: 'subsets',
    problemId: 'subsets',
    title: 'Subsets',
    category: 'Backtracking',
    difficulty: 'Medium',
    objective: 'Generate all possible unique subsets (the power set) of a unique integer array.',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
    constraints: ['1 ≤ nums.length ≤ 10', '-10 ≤ nums[i] ≤ 10', 'All elements of nums are unique.'],
    inputData: {
      type: 'array',
      label: 'INPUT ARRAY (nums)',
      value: [1, 2, 3],
    },
    outputData: {
      type: 'array_of_arrays',
      label: 'REQUIRED OUTPUT',
      description: 'List of all 2^N unique subsets.',
      expectedRepresentation: 'POWER SET ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [1, 2, 3]',
        outputRaw: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]',
        inputStructured: { type: 'array', value: [1, 2, 3] },
        outputStructured: { type: 'array_of_arrays', value: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]] },
        reasoning: ['Array length N=3 produces 2^3 = 8 subsets.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'EXPONENTIAL POWER SET', detail: 'Every element has 2 choices (include/exclude), producing 2^N subsets.' },
      { stepNo: '02', title: 'RECURSIVE BACKTRACKING', detail: 'Include element, recurse, backtrack by popping element.' },
    ],
  },

  {
    id: 'course-schedule',
    problemId: 'course-schedule',
    title: 'Course Schedule',
    category: 'Graph',
    difficulty: 'Medium',
    objective: 'Determine if it is possible to finish all courses given prerequisite dependencies.',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take course b first if you want to take course a. Return true if you can finish all courses, otherwise return false.',
    constraints: ['1 ≤ numCourses ≤ 2000', '0 ≤ prerequisites.length ≤ 5000', 'prerequisites[i].length == 2'],
    inputData: {
      type: 'graph_prerequisites',
      label: 'COURSES & PREREQUISITES',
      value: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] },
    },
    outputData: {
      type: 'boolean',
      label: 'REQUIRED OUTPUT',
      description: 'Boolean true if a valid course order exists with no directed cycles.',
      expectedRepresentation: 'FEASIBILITY BOOLEAN',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
        outputRaw: 'true',
        inputStructured: { type: 'graph_prerequisites', value: { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] } },
        outputStructured: { type: 'boolean', value: true },
        reasoning: ['Prerequisite DAG has topological order [0, 1, 2, 3]. Return true.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'DIRECTED CYCLE DETECTION', detail: 'A directed cycle in prerequisites makes taking all courses impossible.' },
      { stepNo: '02', title: 'KAHN BFS TOPOLOGICAL SORT', detail: 'Process nodes with in-degree 0 iteratively.' },
    ],
  },

  {
    id: 'connected-components',
    problemId: 'connected-components',
    title: 'Number of Connected Components in an Undirected Graph',
    category: 'Graph',
    difficulty: 'Medium',
    objective: 'Find the total number of connected components in an undirected graph.',
    description: 'Given n nodes labeled from 0 to n - 1 and a list of undirected edges, write a function to find the number of connected components in an undirected graph.',
    constraints: ['1 ≤ n ≤ 2000', '0 ≤ edges.length ≤ 5000'],
    inputData: {
      type: 'graph_edges',
      label: 'GRAPH NODES & EDGES',
      value: { n: 5, edges: [[0, 1], [1, 2], [3, 4]] },
    },
    outputData: {
      type: 'integer',
      label: 'REQUIRED OUTPUT',
      description: 'The number of disconnected subgraphs.',
      expectedRepresentation: 'COMPONENT COUNT',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
        outputRaw: '2',
        inputStructured: { type: 'graph_edges', value: { n: 5, edges: [[0, 1], [1, 2], [3, 4]] } },
        outputStructured: { type: 'integer', value: 2 },
        reasoning: ['Subgraphs {0,1,2} and {3,4} form 2 connected components.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'DISJOINT SET UNION', detail: 'Union-Find merges nodes connected by edges, decrementing component count.' },
    ],
  },

  {
    id: 'kth-smallest-bst',
    problemId: 'kth-smallest-bst',
    title: 'Kth Smallest Element in a BST',
    category: 'Tree',
    difficulty: 'Medium',
    objective: 'Find the K-th smallest value in a Binary Search Tree.',
    description: 'Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    constraints: ['1 ≤ k ≤ n ≤ 10⁴', '0 ≤ Node.val ≤ 10⁴'],
    inputData: {
      type: 'binary_tree',
      label: 'BST ROOT & K',
      value: { arrayForm: [5, 3, 6, 2, 4, null, null, 1], k: 3 },
    },
    outputData: {
      type: 'integer',
      label: 'REQUIRED OUTPUT',
      description: 'The K-th smallest node value.',
      expectedRepresentation: 'K-TH VALUE',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'root = [5,3,6,2,4,null,null,1], k = 3',
        outputRaw: '3',
        inputStructured: { type: 'binary_tree', value: { arrayForm: [5, 3, 6, 2, 4, null, null, 1], k: 3 } },
        outputStructured: { type: 'integer', value: 3 },
        reasoning: ['Inorder traversal [1, 2, 3, 4, 5, 6]. 3rd element is 3.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'IN-ORDER TRAVERSAL SORTED PROPERTY', detail: 'Inorder BST traversal yields values in ascending order.' },
    ],
  },

  {
    id: 'top-k-frequent',
    problemId: 'top-k-frequent',
    title: 'Top K Frequent Elements',
    category: 'Heap / Bucket Sort',
    difficulty: 'Medium',
    objective: 'Return the k most frequent elements from an integer array.',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    constraints: ['1 ≤ nums.length ≤ 10⁵', 'k is in range [1, number of unique elements]'],
    inputData: {
      type: 'array_with_k',
      label: 'INPUT ARRAY & K',
      value: { array: [1, 1, 1, 2, 2, 3], k: 2 },
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'Array of top k frequent elements.',
      expectedRepresentation: 'TOP K FREQUENT ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [1,1,1,2,2,3], k = 2',
        outputRaw: '[1, 2]',
        inputStructured: { type: 'array_with_k', value: { array: [1, 1, 1, 2, 2, 3], k: 2 } },
        outputStructured: { type: 'array', value: [1, 2] },
        reasoning: ['1 appears 3 times, 2 appears 2 times, 3 appears 1 time. Top 2 frequent: [1, 2].'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'BUCKET SORT FREQUENCY RANKING', detail: 'Group numbers by frequency in 1..N buckets for O(N) execution.' },
    ],
  },

  {
    id: 'product-except-self',
    problemId: 'product-except-self',
    title: 'Product of Array Except Self',
    category: 'Array / Prefix Sum',
    difficulty: 'Medium',
    objective: 'Calculate product array without division.',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm must run in O(N) time and without using division.',
    constraints: ['2 ≤ nums.length ≤ 10⁵', '-30 ≤ nums[i] ≤ 30'],
    inputData: {
      type: 'array',
      label: 'INPUT ARRAY',
      value: [1, 2, 3, 4],
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'Array of products except self.',
      expectedRepresentation: 'PRODUCTS ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [1,2,3,4]',
        outputRaw: '[24,12,8,6]',
        inputStructured: { type: 'array', value: [1, 2, 3, 4] },
        outputStructured: { type: 'array', value: [24, 12, 8, 6] },
        reasoning: ['res[0] = 2*3*4=24, res[1] = 1*3*4=12, res[2] = 1*2*4=8, res[3] = 1*2*3=6.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'PREFIX & SUFFIX PRODUCTS', detail: 'Result at i = (prefix product of 0..i-1) * (suffix product of i+1..N-1).' },
    ],
  },

  {
    id: 'single-number',
    problemId: 'single-number',
    title: 'Single Number',
    category: 'Bit Manipulation',
    difficulty: 'Easy',
    objective: 'Find the single non-repeating element in O(N) time and O(1) space.',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
    constraints: ['1 ≤ nums.length ≤ 3 * 10⁴', '-3 * 10⁴ ≤ nums[i] ≤ 3 * 10⁴'],
    inputData: {
      type: 'array',
      label: 'INPUT ARRAY',
      value: [4, 1, 2, 1, 2],
    },
    outputData: {
      type: 'integer',
      label: 'REQUIRED OUTPUT',
      description: 'The single element that appears only once.',
      expectedRepresentation: 'SINGLE INTEGER',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [4,1,2,1,2]',
        outputRaw: '4',
        inputStructured: { type: 'array', value: [4, 1, 2, 1, 2] },
        outputStructured: { type: 'integer', value: 4 },
        reasoning: ['4 ^ 1 ^ 2 ^ 1 ^ 2 = 4 ^ (1^1) ^ (2^2) = 4 ^ 0 ^ 0 = 4.'],
      },
    ],
    observations: [
      { stepNo: '01', title: 'XOR ALGEBRAIC PROPERTY', detail: 'A ^ A = 0 and A ^ 0 = A cancels out all paired numbers in O(1) space.' },
    ],
  },

  {
    id: 'word-search',
    problemId: 'word-search',
    title: 'Word Search',
    category: 'Backtracking',
    difficulty: 'Medium',
    objective: 'Determine if a target word exists in a 2D grid of characters.',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.',
    constraints: ['1 ≤ m, n ≤ 6', '1 ≤ word.length ≤ 15'],
    inputData: {
      type: 'matrix',
      label: 'BOARD GRID & TARGET WORD',
      value: {
        grid: [
          ['A', 'B', 'C', 'E'],
          ['S', 'F', 'C', 'S'],
          ['A', 'D', 'E', 'E'],
        ],
        word: 'ABCCED',
      },
    },
    outputData: {
      type: 'boolean',
      label: 'REQUIRED OUTPUT',
      description: 'Boolean true if the target word exists in the grid.',
      expectedRepresentation: 'EXISTS BOOLEAN',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        outputRaw: 'true',
        inputStructured: {
          type: 'matrix',
          value: {
            grid: [
              ['A', 'B', 'C', 'E'],
              ['S', 'F', 'C', 'S'],
              ['A', 'D', 'E', 'E'],
            ],
            word: 'ABCCED',
          },
        },
        outputStructured: { type: 'boolean', value: true },
        reasoning: ['Path (0,0) -> (0,1) -> (0,2) -> (1,2) -> (2,2) -> (2,1) matches "ABCCED".'],
      },
    ],
    observations: [
      { stepNo: '01', title: '2D GRID BACKTRACKING DFS', detail: 'Mark cell visited in-place with "#" during recursion and restore afterwards.' },
    ],
  },
];

/**
 * Normalizes a problem object so that ALL 20 problems have 100% identical data fields,
 * including both top-level properties (id, title, category, difficulty, objective, description, constraints, inputData, outputData, testCases, observations)
 * AND a rich `understand` sub-object.
 */
export function normalizeProblemData(p) {
  if (!p) return p;

  const inputData = p.inputData || p.understand?.inputData;
  const outputData = p.outputData || p.understand?.outputData || {
    type: p.understand?.output?.type || 'value',
    label: p.understand?.output?.label || 'REQUIRED OUTPUT',
    description: p.understand?.output?.description || '',
    expectedRepresentation: p.understand?.input?.expectedOutput || '',
  };
  const constraints = Array.isArray(p.constraints)
    ? p.constraints
    : Array.isArray(p.understand?.constraints)
      ? p.understand.constraints
      : [];
  const testCases = Array.isArray(p.testCases)
    ? p.testCases
    : [
        {
          id: 1,
          inputRaw: p.understand?.input?.inputVisual || '',
          outputRaw: p.understand?.input?.expectedOutput || '',
          inputStructured: inputData,
          outputStructured: {
            type: outputData.type,
            value: p.understand?.input?.expectedOutput || '',
          },
          reasoning: p.understand?.known || [],
        },
      ];
  const observations = Array.isArray(p.observations)
    ? p.observations
    : Array.isArray(p.understand?.observations)
      ? p.understand.observations
      : [];

  const baseUnderstand = getUnderstandingByProblemId(p.id) || {};

  const understandObj = {
    ...baseUnderstand,
    ...p.understand,
    title: p.title,
    objective: p.objective,
    constraints,
    inputData,
    outputData,
    testCases,
    observations,
  };

  return {
    ...p,
    description: p.description || p.understand?.objective || p.objective,
    constraints,
    inputData,
    outputData,
    testCases,
    observations,
    understand: understandObj,
  };
}

export const MOCK_PROBLEMS = INITIAL_MOCK_PROBLEMS.map(normalizeProblemData);

/**
 * Development Schema Validator
 * Validates that a problem object has all required structured fields.
 */
export function validateMockProblem(problem) {
  if (process.env.NODE_ENV === 'production') return true;

  const requiredFields = ['id', 'title', 'objective', 'inputData', 'outputData', 'testCases', 'observations'];
  const missing = requiredFields.filter((f) => !problem || !problem[f]);

  if (missing.length > 0) {
    console.warn(`[validateMockProblem] Problem "${problem?.title || 'Unknown'}" missing required fields:`, missing);
    return false;
  }
  return true;
}

/**
 * Get problem by ID or fallback to Two Sum
 */
export function getProblemById(id) {
  const found = MOCK_PROBLEMS.find((p) => p.id === id);
  if (found) return found;

  return MOCK_PROBLEMS[0];
}

export const getMockProblemById = getProblemById;

export default MOCK_PROBLEMS;
