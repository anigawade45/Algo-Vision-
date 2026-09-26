/**
 * Stage 01 — Understanding Data Store for All 20 DSA Problems.
 * Provides unified, structured Stage 01 Understand data (input, output, test cases, observations, constraints)
 * for all benchmark problems in AlgoVision.
 */
export const MOCK_UNDERSTAND = {
  'two-sum': {
    problemId: 'two-sum',
    title: 'Two Sum',
    category: 'Array',
    difficulty: 'Easy',
    objective: 'Find two numbers in the array whose sum equals the target.',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    constraints: [
      '2 ≤ nums.length ≤ 10⁴',
      '-10⁹ ≤ nums[i] ≤ 10⁹',
      '-10⁹ ≤ target ≤ 10⁹',
      'Only one valid answer exists.',
    ],
    inputData: {
      type: 'array_with_target',
      label: 'INPUT DATA',
      value: { array: [2, 7, 11, 15], target: 9 },
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
        inputStructured: { type: 'array_with_target', array: [2, 7, 11, 15], target: 9 },
        outputStructured: { type: 'indices', value: [0, 1] },
        reasoning: [
          '2 + 7 = 9 (matches target 9)',
          '2 is at array index 0, 7 is at array index 1',
          'Therefore: [0, 1]',
        ],
      },
      {
        id: 2,
        inputRaw: 'nums = [3, 2, 4], target = 6',
        outputRaw: '[1, 2]',
        inputStructured: { type: 'array_with_target', array: [3, 2, 4], target: 6 },
        outputStructured: { type: 'indices', value: [1, 2] },
        reasoning: [
          '2 + 4 = 6 (matches target 6)',
          '2 is at array index 1, 4 is at array index 2',
          'Therefore: [1, 2]',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'TWO VALUES WORK TOGETHER',
        detail: 'The answer depends on a pair of values, not a single value.',
      },
      {
        stepNo: '02',
        title: 'THE TARGET DEFINES THE RELATIONSHIP',
        detail: 'The two values must combine to produce the given target sum.',
      },
      {
        stepNo: '03',
        title: 'THE OUTPUT IDENTIFIES THEIR POSITIONS',
        detail: 'The answer refers to where the values appear in the original array.',
      },
    ],
  },

  'valid-parentheses': {
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    category: 'String',
    difficulty: 'Easy',
    objective: 'Determine whether the bracket sequence is valid.',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
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
        inputStructured: { type: 'string', value: '([{}])' },
        outputStructured: { type: 'boolean', value: true },
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
        inputStructured: { type: 'string', value: '([)]' },
        outputStructured: { type: 'boolean', value: false },
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

  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    title: 'Reverse Linked List',
    category: 'Linked List',
    difficulty: 'Easy',
    objective: 'Return the linked list with its node order reversed.',
    description: 'Given the head of a singly linked list, reverse the list, and return the head of the reversed list.',
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
        inputStructured: { type: 'linked_list', nodes: [1, 2, 3, 4, 5] },
        outputStructured: { type: 'linked_list', value: [5, 4, 3, 2, 1] },
        reasoning: [
          'Pointer 1->next becomes null (new tail).',
          'Pointer 2->next points to 1.',
          'Pointer 5 becomes the new head.',
          'Reversed list: 5 -> 4 -> 3 -> 2 -> 1 -> null.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'POINTER REVERSAL REQUIREMENT',
        detail: 'Reversing a linked list requires changing the direction of next pointers.',
      },
      {
        stepNo: '02',
        title: 'NEW HEAD IDENTIFICATION',
        detail: 'The original tail node becomes the head of the reversed list.',
      },
    ],
  },

  'binary-tree-inorder-traversal': {
    problemId: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    category: 'Binary Tree',
    difficulty: 'Easy',
    objective: 'Return the inorder traversal sequence of node values (Left -> Root -> Right).',
    description: 'Given the root of a binary tree, return the inorder traversal of its nodes values.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 ≤ Node.val ≤ 100',
    ],
    inputData: {
      type: 'binary_tree',
      label: 'BINARY TREE ROOT',
      value: { arrayForm: [1, null, 2, 3] },
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'An array of node values visited during inorder traversal.',
      expectedRepresentation: 'TRAVERSAL VALUE SEQUENCE',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'root = [1, null, 2, 3]',
        outputRaw: '[1, 3, 2]',
        inputStructured: { type: 'binary_tree', value: { arrayForm: [1, null, 2, 3] } },
        outputStructured: { type: 'array', value: [1, 3, 2] },
        reasoning: [
          'Visit left subtree of root 1 (empty).',
          'Visit root 1.',
          'Visit right subtree of 1: left child is 3, root is 2.',
          'Sequence: [1, 3, 2].',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'LEFT -> ROOT -> RIGHT ORDER',
        detail: 'Inorder traversal recursively visits left subtree first, then current node, then right subtree.',
      },
    ],
  },

  'number-of-islands': {
    problemId: 'number-of-islands',
    title: 'Number of Islands',
    category: '2D Grid Matrix',
    difficulty: 'Medium',
    objective: 'Count the number of disconnected land masses (connected 1s) in a 2D grid.',
    description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    constraints: [
      '1 ≤ m, n ≤ 300',
      'grid[i][j] is "0" or "1".',
    ],
    inputData: {
      type: 'matrix',
      label: '2D GRID MATRIX',
      value: {
        grid: [
          ['1', '1', '0', '0', '0'],
          ['1', '1', '0', '0', '0'],
          ['0', '0', '1', '0', '0'],
          ['0', '0', '0', '1', '1'],
        ],
      },
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'The count of distinct connected land islands.',
      expectedRepresentation: 'ISLAND COUNT INTEGER',
    },
    testCases: [
      {
        id: 1,
        inputRaw: '4x5 Grid with 3 land masses',
        outputRaw: '3',
        inputStructured: {
          type: 'matrix',
          grid: [
            ['1', '1', '0', '0', '0'],
            ['1', '1', '0', '0', '0'],
            ['0', '0', '1', '0', '0'],
            ['0', '0', '0', '1', '1'],
          ],
        },
        outputStructured: { type: 'number', value: 3 },
        reasoning: [
          'Top-left 2x2 block of 1s forms Island 1.',
          'Middle cell (2,2) forms Island 2.',
          'Bottom-right 1x2 block forms Island 3.',
          'Total = 3 islands.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: '4-DIRECTIONAL CONNECTIVITY',
        detail: 'Cells connect vertically or horizontally to form an island.',
      },
    ],
  },

  'kth-largest-element-in-an-array': {
    problemId: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    category: 'Heap / Priority Queue',
    difficulty: 'Medium',
    objective: 'Find the kth largest element in an unsorted array.',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    constraints: [
      '1 ≤ k ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
    ],
    inputData: {
      type: 'array_with_k',
      label: 'ARRAY & RANK K',
      value: { array: [3, 2, 1, 5, 6, 4], k: 2 },
      kVal: 2,
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'The element value at rank k in descending order.',
      expectedRepresentation: 'KTH LARGEST ELEMENT VALUE',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
        outputRaw: '5',
        inputStructured: { type: 'array_with_k', array: [3, 2, 1, 5, 6, 4], k: 2 },
        outputStructured: { type: 'number', value: 5 },
        reasoning: [
          'Sorted descending: [6, 5, 4, 3, 2, 1].',
          '1st largest = 6.',
          '2nd largest = 5.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'RANK BASED ON SORTED POSITION',
        detail: 'Kth largest corresponds to element at index k-1 in sorted descending order.',
      },
    ],
  },

  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    category: 'Sliding Window / Monotonic Queue',
    difficulty: 'Hard',
    objective: 'Find the maximum value in each sliding window of size k moving from left to right.',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.',
    constraints: [
      '1 ≤ nums.length ≤ 10⁵',
      '-10⁴ ≤ nums[i] ≤ 10⁴',
      '1 ≤ k ≤ nums.length',
    ],
    inputData: {
      type: 'array_with_window',
      label: 'ARRAY & WINDOW SIZE K',
      value: { array: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
      kVal: 3,
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'An array of maximum values for each window position.',
      expectedRepresentation: 'WINDOW MAXIMA ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
        outputRaw: '[3, 3, 5, 5, 6, 7]',
        inputStructured: { type: 'array_with_window', array: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 },
        outputStructured: { type: 'array', value: [3, 3, 5, 5, 6, 7] },
        reasoning: [
          'Window [1, 3, -1] -> max = 3',
          'Window [3, -1, -3] -> max = 3',
          'Window [-1, -3, 5] -> max = 5',
          'Window [-3, 5, 3] -> max = 5',
          'Window [5, 3, 6] -> max = 6',
          'Window [3, 6, 7] -> max = 7',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'WINDOW SLIDES ONE STEP AT A TIME',
        detail: 'For array of length N and window size K, there are exactly N - K + 1 window positions.',
      },
    ],
  },

  'merge-intervals': {
    problemId: 'merge-intervals',
    title: 'Merge Intervals',
    category: 'Intervals / Sorting',
    difficulty: 'Medium',
    objective: 'Merge all overlapping intervals into non-overlapping ranges.',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    constraints: [
      '1 ≤ intervals.length ≤ 10⁴',
      'intervals[i].length == 2',
      '0 ≤ starti ≤ endi ≤ 10⁴',
    ],
    inputData: {
      type: 'intervals',
      label: 'INTERVAL RANGES',
      value: { ranges: [[1, 3], [2, 6], [8, 10], [15, 18]] },
    },
    outputData: {
      type: 'intervals',
      label: 'REQUIRED OUTPUT',
      description: 'Merged non-overlapping intervals.',
      expectedRepresentation: 'MERGED INTERVALS LIST',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        outputRaw: '[[1,6],[8,10],[15,18]]',
        inputStructured: { type: 'intervals', ranges: [[1, 3], [2, 6], [8, 10], [15, 18]] },
        outputStructured: { type: 'intervals', ranges: [[1, 6], [8, 10], [15, 18]] },
        reasoning: [
          'Intervals [1,3] and [2,6] overlap since 2 <= 3 -> merged into [1,6].',
          'Intervals [8,10] and [15,18] do not overlap.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'OVERLAP CONDITION',
        detail: 'Two sorted intervals [a, b] and [c, d] overlap if c <= b.',
      },
    ],
  },

  'longest-substring-without-repeating-characters': {
    problemId: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    category: 'String / Sliding Window',
    difficulty: 'Medium',
    objective: 'Find the length of the longest substring containing no duplicate characters.',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: [
      '0 ≤ s.length ≤ 5 * 10⁴',
      's consists of English letters, digits, symbols and spaces.',
    ],
    inputData: {
      type: 'string',
      label: 'INPUT STRING',
      value: 'abcabcbb',
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'Integer length of the longest unique character substring.',
      expectedRepresentation: 'MAXIMUM SUBSTRING LENGTH',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 's = "abcabcbb"',
        outputRaw: '3',
        inputStructured: { type: 'string', value: 'abcabcbb' },
        outputStructured: { type: 'number', value: 3 },
        reasoning: [
          'Substrings without repetition: "abc" (len 3), "bca" (len 3), "cab" (len 3).',
          'Max length is 3.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'DYNAMIC WINDOW BOUNDARIES',
        detail: 'When a duplicate is encountered, shrink left pointer past the previous index of that character.',
      },
    ],
  },

  'shortest-path-in-unweighted-graph': {
    problemId: 'shortest-path-in-unweighted-graph',
    title: 'Shortest Path in Unweighted Graph',
    category: 'Graph / BFS',
    difficulty: 'Medium',
    objective: 'Find the minimum number of edges to reach destination node from start node in an unweighted graph.',
    description: 'Given an unweighted graph, find the shortest path distance (edge count) from start node to destination node.',
    constraints: [
      '1 ≤ V ≤ 1000',
      '0 ≤ E ≤ 2000',
    ],
    inputData: {
      type: 'graph',
      label: 'GRAPH ADJACENCY MAP',
      value: {
        start: '0',
        destination: '3',
        adjacency: {
          '0': ['1', '2'],
          '1': ['2'],
          '2': ['3'],
          '3': [],
        },
      },
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'The minimum edge distance count to reach destination.',
      expectedRepresentation: 'SHORTEST DISTANCE INTEGER',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'graph = {0:[1,2], 1:[2], 2:[3], 3:[]}, start = 0, destination = 3',
        outputRaw: '2',
        inputStructured: {
          type: 'graph',
          start: '0',
          destination: '3',
          adjacency: { '0': ['1', '2'], '1': ['2'], '2': ['3'], '3': [] },
        },
        outputStructured: { type: 'number', value: 2 },
        reasoning: [
          'Path A: 0 → 1 → 2 → 3 (Length: 3 edges)',
          'Path B: 0 → 2 → 3 (Length: 2 edges)',
          'Shortest distance from Node 0 to Node 3 is 2 edges.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'BFS GUARANTEES SHORTEST PATH',
        detail: 'In unweighted graphs, BFS explores nodes level by level, ensuring first arrival at destination is optimal.',
      },
    ],
  },

  'climbing-stairs': {
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

  'house-robber': {
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

  'subsets': {
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

  'course-schedule': {
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

  'connected-components': {
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

  'kth-smallest-bst': {
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

  'top-k-frequent': {
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

  'product-except-self': {
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

  'single-number': {
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

  'word-search': {
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
};


// Map ID aliases to ensure exact match between short IDs and long IDs
MOCK_UNDERSTAND['binary-tree-inorder'] = MOCK_UNDERSTAND['binary-tree-inorder-traversal'];
MOCK_UNDERSTAND['kth-largest-element'] = MOCK_UNDERSTAND['kth-largest-element-in-an-array'];
MOCK_UNDERSTAND['longest-substring-no-repeat'] = MOCK_UNDERSTAND['longest-substring-without-repeating-characters'];
MOCK_UNDERSTAND['shortest-path-graph'] = MOCK_UNDERSTAND['shortest-path-in-unweighted-graph'];

MOCK_UNDERSTAND['binary-tree-inorder-traversal'] = MOCK_UNDERSTAND['binary-tree-inorder'];
MOCK_UNDERSTAND['kth-largest-element-in-an-array'] = MOCK_UNDERSTAND['kth-largest-element'];
MOCK_UNDERSTAND['longest-substring-without-repeating-characters'] = MOCK_UNDERSTAND['longest-substring-no-repeat'];
MOCK_UNDERSTAND['shortest-path-in-unweighted-graph'] = MOCK_UNDERSTAND['shortest-path-graph'];

/**
 * Getter function to retrieve Stage 01 Understanding data for any problem ID.
 */
export function getUnderstandingByProblemId(id) {
  if (!id) return MOCK_UNDERSTAND['two-sum'];

  const aliasMap = {
    'binary-tree-inorder': 'binary-tree-inorder-traversal',
    'kth-largest-element': 'kth-largest-element-in-an-array',
    'longest-substring-no-repeat': 'longest-substring-without-repeating-characters',
    'shortest-path-graph': 'shortest-path-in-unweighted-graph',
  };

  const key = aliasMap[id] || id;
  const found = MOCK_UNDERSTAND[key] || MOCK_UNDERSTAND[id];
  if (found) return found;

  return MOCK_UNDERSTAND['two-sum'];
}

export default MOCK_UNDERSTAND;
