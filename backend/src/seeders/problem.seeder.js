const mongoose = require('mongoose');
const env = require('../config/env');
const Problem = require('../models/Problem');

const initialProblems = [
  {
    problemId: 'two-sum',
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
    tags: ['Array', 'Hash Table'],
    isPublished: true,
  },
  {
    problemId: 'valid-parentheses',
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
    tags: ['String', 'Stack'],
    isPublished: true,
  },
  {
    problemId: 'reverse-linked-list',
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
      description: 'The head node of the newly inverted pointer sequence.',
      expectedRepresentation: 'REVERSED POINTER SEQUENCE',
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
          'Initial pointers: 1 -> 2 -> 3 -> 4 -> 5 -> NULL',
          'Reverse direction of each next pointer.',
          'Final pointers: 5 -> 4 -> 3 -> 2 -> 1 -> NULL',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'POINTER ORIENTATION CHANGES',
        detail: 'Each node next pointer changes from pointing forward to pointing backward.',
      },
      {
        stepNo: '02',
        title: 'HEAD BECOMES TAIL',
        detail: 'The original first node becomes the last node pointing to NULL.',
      },
    ],
    tags: ['Linked List', 'Recursion'],
    isPublished: true,
  },
  {
    problemId: 'binary-tree-inorder-traversal',
    title: 'Binary Tree Inorder Traversal',
    category: 'Tree',
    difficulty: 'Easy',
    objective: 'Traverse the binary tree using Inorder pattern (Left -> Root -> Right).',
    description:
      'Given the root of a binary tree, return the inorder traversal of its nodes values.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 ≤ Node.val ≤ 100',
    ],
    inputData: {
      type: 'binary_tree',
      label: 'ROOT OF BINARY TREE',
      nodes: [1, null, 2, 3],
    },
    outputData: {
      type: 'array',
      label: 'REQUIRED OUTPUT',
      description: 'Array containing node values in Left-Root-Right visit sequence.',
      expectedRepresentation: 'INORDER VALUE ARRAY',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'root = [1, null, 2, 3]',
        outputRaw: '[1, 3, 2]',
        inputStructured: {
          type: 'binary_tree',
          nodes: [1, null, 2, 3],
        },
        outputStructured: {
          type: 'array',
          value: [1, 3, 2],
        },
        reasoning: [
          'Visit Left subtree of 1: empty.',
          'Visit Root node 1: add 1.',
          'Visit Right subtree of 1: root 2.',
          '  Visit Left subtree of 2: root 3.',
          '  Visit Root 3: add 3.',
          '  Visit Root 2: add 2.',
          'Result: [1, 3, 2]',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'LEFT-FIRST RECURSION',
        detail: 'Inorder traversal visits all nodes in the left subtree before recording the current root.',
      },
    ],
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    isPublished: true,
  },
  {
    problemId: 'number-of-islands',
    title: 'Number of Islands',
    category: 'Graph',
    difficulty: 'Medium',
    objective: 'Count the number of connected land component islands in a 2D grid matrix.',
    description:
      'Given an m x n 2D binary grid grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 ≤ m, n ≤ 300',
      'grid[i][j] is "0" or "1"',
    ],
    inputData: {
      type: 'grid_matrix',
      label: '2D GRID MATRIX',
      grid: [
        ['1', '1', '1', '1', '0'],
        ['1', '1', '0', '1', '0'],
        ['1', '1', '0', '0', '0'],
        ['0', '0', '0', '0', '0'],
      ],
    },
    outputData: {
      type: 'number',
      label: 'REQUIRED OUTPUT',
      description: 'Total integer count of disconnected land masses.',
      expectedRepresentation: 'INTEGER COUNT',
    },
    testCases: [
      {
        id: 1,
        inputRaw: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        outputRaw: '1',
        inputStructured: {
          type: 'grid_matrix',
          grid: [
            ['1', '1', '1', '1', '0'],
            ['1', '1', '0', '1', '0'],
            ['1', '1', '0', '0', '0'],
            ['0', '0', '0', '0', '0'],
          ],
        },
        outputStructured: {
          type: 'number',
          value: 1,
        },
        reasoning: [
          'All "1" cells form a single horizontally and vertically connected land block.',
          'Total distinct islands = 1.',
        ],
      },
    ],
    observations: [
      {
        stepNo: '01',
        title: 'CONNECTED COMPONENTS IN 2D GRID',
        detail: 'Adjacent 1s form a single island via 4-directional connectivity (up, down, left, right).',
      },
    ],
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    isPublished: true,
  },
];

const seedProblems = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(env.mongoUri);
    console.log('Database connected successfully.');

    console.log('Seeding DSA problems database...');
    for (const p of initialProblems) {
      await Problem.findOneAndUpdate(
        { problemId: p.problemId },
        p,
        { upsert: true, new: true, runValidators: true }
      );
      console.log(`Seeded problem: ${p.title} (${p.problemId})`);
    }

    console.log('DSA Problems seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding problems:', error);
    process.exit(1);
  }
};

seedProblems();
