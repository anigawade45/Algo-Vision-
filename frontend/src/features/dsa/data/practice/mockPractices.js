/**
 * MOCK_PRACTICES Dataset for Stage 11 — Practice
 * 
 * Provides complete, structured practice datasets for all 10 benchmark problems.
 * Schema includes:
 * - intro: Title, subtitle, context
 * - recall: 3 multiple-choice conceptual questions
 * - patternCheck: Related problem pattern recognition check
 * - guidedChallenge: Progressive conceptual prompts for a related variation
 * - independentChallenge: 4-part decision breakdown (Pattern, Approach, Reasoning, starterTemplate)
 * - variationChallenge: Adaptation check when a constraint changes
 * - hints: Progressive 4-tier hint ladder (conceptual only — NO solution code dump)
 * - recommendations: Exactly 2 external recommendations with educational reasoning
 * - takeaway: Stage takeaway statement
 */

export const MOCK_PRACTICES = {
  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Reverse Linked List',
        patternName: 'Linked List Transformation',
        approachName: 'Three-Pointer Iteration',
        summaryHint: 'Recall how node pointers (prev, curr, nextTemp) are updated iteratively.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the key structural change when reversing a singly linked list?',
        options: [
          'Swapping node values in-place',
          'Redirecting node.next pointers to point to the previous node',
          'Creating a copy of all nodes in reverse order',
          'Sorting the nodes by value',
        ],
        correctAnswer: 1,
        explanation: 'Reversing a linked list changes the direction of node links in-place (curr.next = prev) without altering node values or allocating extra nodes.',
      },
      {
        id: 'r2',
        question: 'Which pointer variable tracks the already-reversed portion of the list during iteration?',
        options: ['curr', 'head', 'prev', 'nextTemp'],
        correctAnswer: 2,
        explanation: 'The `prev` pointer always points to the head of the newly reversed portion built so far.',
      },
      {
        id: 'r3',
        question: 'Before changing curr.next, what critical reference must be preserved?',
        options: ['Previous node', 'Next node (nextTemp = curr.next)', 'Head value', 'List length'],
        correctAnswer: 1,
        explanation: 'If you overwrite `curr.next` before storing `curr.next` in a temporary variable, you lose access to the remaining unvisited nodes.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Given the head of a singly linked list, return the middle node.',
      inputVisual: '1 ➔ 2 ➔ 3 ➔ 4 ➔ 5',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Linked List / Slow & Fast Two-Pointers',
          pattern: 'Linked List Traversal',
          family: 'Two Pointers (Fast & Slow)',
          isCorrect: true,
        },
        {
          label: 'Array / Prefix Sum',
          pattern: 'Prefix Sum',
          family: 'Cumulative Addition',
          isCorrect: false,
        },
        {
          label: 'Stack / LIFO Matching',
          pattern: 'LIFO Processing',
          family: 'Auxiliary Stack',
          isCorrect: false,
        },
        {
          label: 'Binary Search / Range Halving',
          pattern: 'Logarithmic Division',
          family: 'Binary Search',
          isCorrect: false,
        },
      ],
      explanation: 'Linked list structural problems requiring positional retrieval without counting size beforehand utilize fast and slow pointer traversal.',
    },
    guidedChallenge: {
      title: 'Guided Application: Reverse Nodes in Sub-range [left, right]',
      description: 'Given head = [1, 2, 3, 4, 5], left = 2, right = 4, reverse only nodes 2 through 4.',
      inputVisual: '1 ➔ [2 ➔ 3 ➔ 4] ➔ 5',
      expectedOutput: '1 ➔ 4 ➔ 3 ➔ 2 ➔ 5',
      prompts: [
        {
          stepNo: '01',
          question: 'Which part of the list needs to be reversed?',
          options: ['The entire list', 'Only nodes between index left and right', 'Only the first two nodes'],
          correctAnswer: 1,
          explanation: 'Only the subsegment between positions 2 and 4 (nodes 2, 3, 4) is reversed.',
        },
        {
          stepNo: '02',
          question: 'Which outer links need to be reconnected after reversing the subsegment?',
          options: [
            'Node 1.next must point to Node 4, and Node 2.next must point to Node 5',
            'Node 1.next must point to NULL',
            'No outer links change',
          ],
          correctAnswer: 0,
          explanation: 'Node 1 (before subsegment) connects to new subsegment head (4), and original subsegment head (2) connects to remainder (5).',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Middle of the Linked List',
      description: 'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.',
      inputVisual: '1 ➔ 2 ➔ 3 ➔ 4 ➔ 5',
      expectedOutput: 'Node(3) with value 3',
      patternOptions: [
        { value: 'linked-list-two-pointers', label: 'Linked List Traversal / Two-Pointers' },
        { value: 'hash-map-lookup', label: 'Hash Table Value Lookup' },
        { value: 'divide-conquer-tree', label: 'Divide and Conquer Tree Splitting' },
      ],
      correctPattern: 'linked-list-two-pointers',

      approachOptions: [
        { value: 'fast-slow-pointers', label: 'Slow (1 step) and Fast (2 steps) Pointers' },
        { value: 'reverse-entire-list', label: 'Reverse Entire List first' },
        { value: 'min-heap-priority', label: 'Push nodes into Min-Heap' },
      ],
      correctApproach: 'fast-slow-pointers',

      reasoningOptions: [
        { value: 'fast-moves-double', label: 'When fast pointer reaches the end, slow pointer is exactly at the middle node.' },
        { value: 'reverse-and-compare', label: 'Reversing the list moves the middle node to index 0.' },
        { value: 'heap-sort-extract', label: 'Extracting min node K times finds the middle value.' },
      ],
      correctReasoning: 'fast-moves-double',

      starterTemplate: `// Write your implementation here...
function middleNode(head) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if the linked list contains a cycle (loop) instead of ending at NULL?',
      question: 'How does the pointer-based algorithm adapt to detect if a cycle exists?',
      options: [
        'If fast pointer catches up to slow pointer (fast === slow), a cycle exists.',
        'Count total nodes; if count > 1000, assume cycle.',
        'Reverse the list; if it throws a Stack Overflow, a cycle exists.',
      ],
      correctAnswer: 0,
      explanation: 'Floyd\'s Cycle Detection algorithm uses slow and fast pointers. If a cycle exists, the fast pointer will eventually overlap with the slow pointer.',
    },
    hints: [
      'Hint 1: Think about how moving two pointers at different speeds (1 step vs 2 steps) changes their relative position.',
      'Hint 2: As fast moves twice as fast as slow, slow covers half the distance that fast covers.',
      'Hint 3: When fast reaches the end of the list (NULL), slow has covered half of the list length.',
      'Hint 4: Use a while loop with condition (fast !== null && fast.next !== null), then return slow.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Middle of the Linked List',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice pointer movement on a related linked-list problem.',
      },
      {
        id: 'rec-2',
        title: 'Linked List Cycle',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/linked-list-cycle/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply pointer-based reasoning to detect a structural loop relationship.',
      },
    ],
    takeaway: 'You moved from guided understanding of Reverse Linked List to independent application across pointer-based linked list problems.',
  },

  'two-sum': {
    problemId: 'two-sum',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Two Sum from understanding to execution. Now apply complement lookup yourself.",
      context: {
        problemTitle: 'Two Sum',
        patternName: 'Hash Table / Complement Lookup',
        approachName: 'Single-Pass Hash Map',
        summaryHint: 'Recall checking map.has(target - num) before inserting the current number.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the target complement for a value x given target T?',
        options: ['x - T', 'T - x', 'T + x', 'T * x'],
        correctAnswer: 1,
        explanation: 'The complement needed to sum up to T with value x is target - x.',
      },
      {
        id: 'r2',
        question: 'Why is a Hash Map optimal for Two Sum over nested loops?',
        options: [
          'It sorts the array automatically',
          'It allows O(1) average lookup time for the required complement',
          'It reduces memory usage to zero',
          'It works without iterating through the array',
        ],
        correctAnswer: 1,
        explanation: 'Checking whether a complement exists in a Hash Map takes O(1) time on average.',
      },
      {
        id: 'r3',
        question: 'Why do we store value-to-index pairs in the Hash Map?',
        options: [
          'The problem requires returning indices of the two numbers',
          'To sort the numbers by frequency',
          'To prevent duplicate values from being added',
          'Because arrays cannot store numbers',
        ],
        correctAnswer: 0,
        explanation: 'Storing num -> index in the map allows instant retrieval of the complement index.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Contains Duplicate — Given an integer array nums, return true if any value appears at least twice.',
      inputVisual: 'nums = [1, 2, 3, 1]',
      question: 'What pattern family can verify previously seen elements in O(1) time?',
      options: [
        {
          label: 'Hash Set / Frequency Tracking',
          pattern: 'Hash Table Lookup',
          family: 'Hash Set',
          isCorrect: true,
        },
        {
          label: 'Binary Search Tree Traversal',
          pattern: 'Tree Division',
          family: 'BST',
          isCorrect: false,
        },
        {
          label: 'Matrix Sweep',
          pattern: '2D Traversal',
          family: 'Grid Search',
          isCorrect: false,
        },
      ],
      explanation: 'Checking if an element was previously encountered utilizes a Hash Set for instant O(1) membership checks.',
    },
    guidedChallenge: {
      title: 'Guided Application: Two Sum II (Input Array Is Sorted)',
      description: 'Given a 1-indexed array of integers sorted in non-decreasing order, find two numbers that add up to target.',
      inputVisual: 'numbers = [2, 7, 11, 15], target = 9',
      expectedOutput: '[1, 2]',
      prompts: [
        {
          stepNo: '01',
          question: 'Since the array is already sorted, can we solve this without extra hash map space?',
          options: ['Yes, using Two Pointers (left at start, right at end)', 'No, Hash Map is mandatory', 'Yes, using DFS'],
          correctAnswer: 0,
          explanation: 'Sorted order enables Two Pointers: if sum < target, left++; if sum > target, right--.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: 3Sum',
      description: 'Given an integer array nums, return all unique triplets [nums[i], nums[j], nums[k]] such that nums[i] + nums[j] + nums[k] == 0.',
      inputVisual: 'nums = [-1, 0, 1, 2, -1, -4]',
      expectedOutput: '[[-1, -1, 2], [-1, 0, 1]]',
      patternOptions: [
        { value: 'sorting-two-pointers', label: 'Sorting + Two Pointers' },
        { value: 'recursion-tree', label: 'Recursive Subtree Traversal' },
      ],
      correctPattern: 'sorting-two-pointers',

      approachOptions: [
        { value: 'fix-one-two-sum', label: 'Fix one element i, then use Two Pointers for remaining sub-array' },
        { value: 'triple-nested-loop', label: 'Brute force 3 nested loops' },
      ],
      correctApproach: 'fix-one-two-sum',

      reasoningOptions: [
        { value: 'reduce-3sum-to-2sum', label: 'Fixing one number reduces 3Sum to a 2Sum problem targeting -nums[i].' },
        { value: 'multiply-target', label: 'Multiplying target by 3 reveals the middle triplet.' },
      ],
      correctReasoning: 'reduce-3sum-to-2sum',

      starterTemplate: `// Write your implementation here...
function threeSum(nums) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: Find all pairs whose sum is strictly GREATER than target.',
      question: 'How does the Two Pointers approach adapt when counting pairs summing > target in a sorted array?',
      options: [
        'When nums[l] + nums[r] > target, all elements between l and r-1 also form valid pairs with nums[r] (count += r - l).',
        'Increment l for every invalid sum.',
        'Convert all negative numbers to positive.',
      ],
      correctAnswer: 0,
      explanation: 'In a sorted array, if nums[l] + nums[r] > target, then nums[i] + nums[r] > target for all i between l and r.',
    },
    hints: [
      'Hint 1: Think about how fixing one variable reduces 3Sum to 2Sum.',
      'Hint 2: Sorting the array first makes duplicate skipping and directional pointer updates trivial.',
      'Hint 3: Target for the 2Sum subproblem is 0 - nums[i].',
      'Hint 4: Remember to advance pointers past duplicate values after recording a valid triplet.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Two Sum',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/two-sum/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve the exact Two Sum problem independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Two Sum II - Input Array Is Sorted',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
        relationship: 'constraint-variation',
        relationshipLabel: 'CONSTRAINT VARIATION',
        reason: 'Apply Two Pointers complement reasoning when input array is sorted.',
      },
    ],
    takeaway: 'You applied complement reasoning from Two Sum to multi-pointer sum problems.',
  },

  'valid-parentheses': {
    problemId: 'valid-parentheses',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Valid Parentheses. Now test your stack-based LIFO matching skills.",
      context: {
        problemTitle: 'Valid Parentheses',
        patternName: 'LIFO Stack Matching',
        approachName: 'Character Stack',
        summaryHint: 'Push opening brackets, pop and verify matching pairs for closing brackets.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why is a Stack (LIFO) the ideal data structure for checking nested brackets?',
        options: [
          'It preserves insertion order from left to right',
          'The most recently opened bracket must be the first one closed',
          'It automatically sorts characters alphabetically',
          'It uses zero memory',
        ],
        correctAnswer: 1,
        explanation: 'Stack LIFO property enforces that inner nested brackets are closed before outer brackets.',
      },
      {
        id: 'r2',
        question: 'When encountering a closing bracket like ")", what condition must hold?',
        options: [
          'Stack is empty',
          'Stack top matches the corresponding opening bracket "("',
          'Stack length equals string length',
          'Current character equals previous character',
        ],
        correctAnswer: 1,
        explanation: 'The character on top of the stack must match the expected opening bracket for the current closing symbol.',
      },
      {
        id: 'r3',
        question: 'What does an non-empty stack at the end of string processing indicate?',
        options: ['Valid string', 'Unmatched opening bracket remains', 'All brackets matched', 'Syntax error in array'],
        correctAnswer: 1,
        explanation: 'If the stack still contains symbols after processing all characters, there were unclosed opening brackets.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Simplify Path — Given an absolute Unix file path like "/a/./b/../../c/", simplify it.',
      inputVisual: 'path = "/a/./b/../../c/"',
      question: 'Which data structure helps process directory navigation (".." pops parent, dir pushes)?',
      options: [
        {
          label: 'Stack (LIFO)',
          pattern: 'Directory Traversal',
          family: 'Stack',
          isCorrect: true,
        },
        {
          label: 'Queue (FIFO)',
          pattern: 'Level Order',
          family: 'Queue',
          isCorrect: false,
        },
      ],
      explanation: 'Unix path resolution uses a stack: directory names are pushed, and ".." pops the most recent directory.',
    },
    guidedChallenge: {
      title: 'Guided Application: Minimum Remove to Make Valid Parentheses',
      description: 'Remove the minimum number of parentheses so that the remaining string is valid.',
      inputVisual: 's = "a)b(c)d"',
      expectedOutput: '"ab(c)d"',
      prompts: [
        {
          stepNo: '01',
          question: 'How can a stack track invalid bracket indices?',
          options: ['Push indices of "(" into stack; if unmatched, mark for removal', 'Reverse the string', 'Count characters'],
          correctAnswer: 0,
          explanation: 'Push indices of "(" onto stack. Pop when ")" matches. Unmatched "(" indices remaining in stack are invalid.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Evaluate Reverse Polish Notation',
      description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, /.',
      inputVisual: 'tokens = ["2", "1", "+", "3", "*"]',
      expectedOutput: '9 ((2 + 1) * 3)',
      patternOptions: [
        { value: 'stack-eval', label: 'Stack-based Postfix Operand Evaluation' },
        { value: 'sliding-window-max', label: 'Sliding Window Range' },
      ],
      correctPattern: 'stack-eval',

      approachOptions: [
        { value: 'push-operands-pop-operators', label: 'Push numbers onto stack; when operator appears, pop 2 numbers, evaluate, push result' },
        { value: 'sort-tokens', label: 'Sort tokens numerically first' },
      ],
      correctApproach: 'push-operands-pop-operators',

      reasoningOptions: [
        { value: 'lifo-operand-order', label: 'The second popped operand is the left operand, maintaining LIFO math evaluation.' },
        { value: 'queue-fifo-eval', label: 'First in first out maintains addition order.' },
      ],
      correctReasoning: 'lifo-operand-order',

      starterTemplate: `// Write your implementation here...
function evalRPN(tokens) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if backspaces "#" delete the previous character in a text editor string?',
      question: 'Given strings s = "ab#c" and t = "ad#c", how does stack matching verify if they are equal?',
      options: [
        'Build final strings by pushing normal characters and popping on "#", then compare results.',
        'Count total "#" symbols in both strings.',
        'Replace "#" with spaces.',
      ],
      correctAnswer: 0,
      explanation: 'Simulating backspaces using a stack produces the resultant typed string for direct comparison.',
    },
    hints: [
      'Hint 1: Push numbers onto the stack as you encounter them.',
      'Hint 2: When an operator is encountered, pop the top two numbers.',
      'Hint 3: Note the operand order: first popped is right operand, second popped is left operand.',
      'Hint 4: Push the result of the arithmetic operation back onto the stack.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Valid Parentheses',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/valid-parentheses/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Valid Parentheses independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Evaluate Reverse Polish Notation',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply LIFO stack matching reasoning to postfix mathematical evaluation.',
      },
    ],
    takeaway: 'You applied LIFO stack processing across string matching and postfix evaluation problems.',
  },

  'binary-tree-inorder': {
    problemId: 'binary-tree-inorder',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Binary Tree Inorder Traversal. Now test your recursive tree traversal skills.",
      context: {
        problemTitle: 'Binary Tree Inorder Traversal',
        patternName: 'Tree Hierarchy / DFS',
        approachName: 'Recursive DFS (Left ➔ Root ➔ Right)',
        summaryHint: 'Recall traversing left subtree, processing current node, then traversing right subtree.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the exact visitation order for Inorder Traversal?',
        options: ['Root ➔ Left ➔ Right', 'Left ➔ Root ➔ Right', 'Left ➔ Right ➔ Root', 'Level by Level'],
        correctAnswer: 1,
        explanation: 'Inorder traversal recursively visits Left subtree first, processes Root node, then visits Right subtree.',
      },
      {
        id: 'r2',
        question: 'When performing Inorder Traversal on a Binary Search Tree (BST), what property holds for the result?',
        options: ['Values are in strictly sorted ascending order', 'Values are in random order', 'Values are reverse sorted', 'Only leaf nodes are included'],
        correctAnswer: 0,
        explanation: 'Inorder traversal of a valid BST produces node values in strictly ascending sorted order.',
      },
      {
        id: 'r3',
        question: 'What is the base case for the recursive traversal helper function traverse(node)?',
        options: ['node === null', 'node.left === null', 'node.val === 0', 'result.length === 10'],
        correctAnswer: 0,
        explanation: 'When node is NULL, the call stack returns to the parent frame without adding any value.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Kth Smallest Element in a BST — Given the root of a BST, return the kth smallest value.',
      inputVisual: 'root = [3,1,4,null,2], k = 1',
      question: 'Which tree traversal order naturally yields elements in sorted order to pick the Kth item?',
      options: [
        {
          label: 'Inorder Traversal (Left ➔ Root ➔ Right)',
          pattern: 'Sorted Tree Traversal',
          family: 'Inorder DFS',
          isCorrect: true,
        },
        {
          label: 'Preorder Traversal (Root ➔ Left ➔ Right)',
          pattern: 'Hierarchy First',
          family: 'Preorder DFS',
          isCorrect: false,
        },
      ],
      explanation: 'Inorder traversal visits BST nodes in sorted order, so the Kth visited node is the Kth smallest element.',
    },
    guidedChallenge: {
      title: 'Guided Application: Validate Binary Search Tree',
      description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
      inputVisual: 'root = [2, 1, 3]',
      expectedOutput: 'true',
      prompts: [
        {
          stepNo: '01',
          question: 'How can Inorder traversal verify if a tree is a valid BST?',
          options: [
            'During Inorder traversal, each visited value must be strictly greater than the previous visited value',
            'Count total nodes in left subtree',
            'Check if root is even',
          ],
          correctAnswer: 0,
          explanation: 'Inorder traversal of a valid BST must yield a strictly increasing sequence of values.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Binary Tree Preorder Traversal',
      description: 'Given the root of a binary tree, return the preorder traversal of its nodes values.',
      inputVisual: 'root = [1, null, 2, 3]',
      expectedOutput: '[1, 2, 3]',
      patternOptions: [
        { value: 'tree-dfs-preorder', label: 'Tree DFS / Preorder (Root ➔ Left ➔ Right)' },
        { value: 'grid-bfs', label: 'Grid BFS Traversal' },
      ],
      correctPattern: 'tree-dfs-preorder',

      approachOptions: [
        { value: 'process-root-first', label: 'Process Root first, then recurse on Left, then Right' },
        { value: 'process-right-first', label: 'Process Right subtree before Left' },
      ],
      correctApproach: 'process-root-first',

      reasoningOptions: [
        { value: 'root-left-right-order', label: 'Preorder visits the current node before either of its subtrees.' },
        { value: 'left-right-root-order', label: 'Postorder visits subtrees before current node.' },
      ],
      correctReasoning: 'root-left-right-order',

      starterTemplate: `// Write your implementation here...
function preorderTraversal(root) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if we want to traverse the tree level by level (top to bottom, left to right)?',
      question: 'Which traversal algorithm and data structure should replace recursive DFS for Level Order Traversal?',
      options: [
        'Breadth-First Search (BFS) using a Queue (FIFO)',
        'Depth-First Search (DFS) using a Stack',
        'Sorting nodes by value using a Min-Heap',
      ],
      correctAnswer: 0,
      explanation: 'Level order traversal visits nodes level by level using BFS with a FIFO Queue.',
    },
    hints: [
      'Hint 1: Recall how recursive tree traversal visits nodes.',
      'Hint 2: Preorder processes Root before visiting Left and Right subtrees.',
      'Hint 3: Think about which operation must happen before the recursive calls.',
      'Hint 4: The current node is processed first before visiting Left and Right subtrees.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Binary Tree Inorder Traversal',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Binary Tree Inorder Traversal independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Kth Smallest Element in a BST',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply Inorder traversal to extract the Kth sorted element from a BST.',
      },
    ],
    takeaway: 'You applied tree traversal patterns across Inorder, Preorder, and BST search problems.',
  },

  'number-of-islands': {
    problemId: 'number-of-islands',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Number of Islands. Now test your 2D grid matrix traversal skills.",
      context: {
        problemTitle: 'Number of Islands',
        patternName: '2D Grid Flood-Fill / Connected Components',
        approachName: 'Grid DFS Flood-Fill',
        summaryHint: 'Scan each cell; when land "1" is found, increment island count and sink connected land to "0".',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What triggers a new island discovery during grid iteration?',
        options: [
          'Encountering any water cell "0"',
          'Finding an unvisited land cell "1"',
          'Reaching the bottom-right corner of the grid',
          'Counting 4 neighbors',
        ],
        correctAnswer: 1,
        explanation: 'Encountering an unvisited land cell "1" during the outer loop scan triggers a new island count.',
      },
      {
        id: 'r2',
        question: 'Why does DFS mutate connected land cells from "1" to "0"?',
        options: [
          'To save memory space',
          'To mark them visited so they are not counted as separate islands later',
          'To delete the grid',
          'Because water is required for matrix multiplication',
        ],
        correctAnswer: 1,
        explanation: 'Sinking connected land cells to "0" prevents them from being counted as new islands during subsequent scan steps.',
      },
      {
        id: 'r3',
        question: 'What are the boundary conditions for stopping a grid DFS traversal?',
        options: [
          'Out of bounds (r < 0, r >= rows, c < 0, c >= cols) OR cell value is water "0"',
          'When r + c === 10',
          'When islandCount reaches 5',
          'When all corners are visited',
        ],
        correctAnswer: 0,
        explanation: 'DFS returns immediately if coordinates fall out of matrix boundaries or if the cell is water "0".',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Max Area of Island — Given a 2D binary grid, return the maximum area (number of connected 1s) of an island.',
      inputVisual: 'grid = [[0,0,1,0],[1,1,1,0],[0,1,0,0]]',
      question: 'Which grid traversal technique computes connected component sizes?',
      options: [
        {
          label: 'Grid DFS / BFS Component Area Counting',
          pattern: 'Connected Components',
          family: 'Grid DFS/BFS',
          isCorrect: true,
        },
        {
          label: 'Prefix Matrix Sum',
          pattern: 'Cumulative Area',
          family: 'Prefix Sum',
          isCorrect: false,
        },
      ],
      explanation: 'Flood-fill DFS/BFS returns 1 + sum of neighbor areas, tracking the max component size.',
    },
    guidedChallenge: {
      title: 'Guided Application: Flood Fill (Image Coloring)',
      description: 'Given an image grid, starting pixel (sr, sc), and new color, fill connected pixels of the same starting color.',
      inputVisual: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
      expectedOutput: '[[2,2,2],[2,2,0],[2,0,1]]',
      prompts: [
        {
          stepNo: '01',
          question: 'How does Flood Fill adapt the Number of Islands DFS?',
          options: [
            'Check starting color instead of "1", change visited pixels to new color instead of "0"',
            'Sort the pixels by intensity',
            'Transpose the 2D matrix',
          ],
          correctAnswer: 0,
          explanation: 'Instead of looking for land "1" and sinking to "0", flood fill matches target color and mutates to new color.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Surrounding Regions (Captured Cells)',
      description: 'Given an m x n matrix containing "X" and "O", capture all regions that are 4-directionally surrounded by "X" by turning "O" to "X".',
      inputVisual: 'board = [["X","X","X"],["X","O","X"],["X","X","X"]]',
      expectedOutput: '[["X","X","X"],["X","X","X"],["X","X","X"]]',
      patternOptions: [
        { value: 'boundary-grid-dfs', label: 'Boundary DFS Flood-Fill' },
        { value: 'binary-search-matrix', label: 'Binary Search in Sorted Matrix' },
      ],
      correctPattern: 'boundary-grid-dfs',

      approachOptions: [
        { value: 'dfs-from-borders', label: 'Run DFS from border "O" cells to mark uncapturable regions, then flip remaining "O"s' },
        { value: 'flip-all-os', label: 'Flip every "O" without checking borders' },
      ],
      correctApproach: 'dfs-from-borders',

      reasoningOptions: [
        { value: 'border-connected-saved', label: 'Any "O" connected to a border "O" cannot be surrounded by "X".' },
        { value: 'center-first', label: 'Center cells are always surrounded regardless of border paths.' },
      ],
      correctReasoning: 'border-connected-saved',

      starterTemplate: `// Write your implementation here...
function solve(board) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if diagonal cells (top-left, top-right, bottom-left, bottom-right) are also connected?',
      question: 'How many directional directions must DFS explore for 8-directional connected components?',
      options: [
        '8 directions (up, down, left, right + 4 diagonals)',
        '4 directions',
        '16 directions',
      ],
      correctAnswer: 0,
      explanation: 'Allowing diagonal connections expands the DFS recursive offset array to 8 directions.',
    },
    hints: [
      'Hint 1: Border "O" cells can never be surrounded.',
      'Hint 2: Start DFS from all border "O" cells and mark them as safe.',
      'Hint 3: After border DFS, any remaining "O" is surrounded and should become "X".',
      'Hint 4: Restore safe "E" cells back to "O".',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Number of Islands',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/number-of-islands/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Number of Islands independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Max Area of Island',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/max-area-of-island/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Apply grid DFS flood-fill to compute component areas.',
      },
    ],
    takeaway: 'You applied 2D grid flood-fill traversal across island counting, area calculation, and boundary capture problems.',
  },

  'kth-largest-element': {
    problemId: 'kth-largest-element',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Kth Largest Element in an Array. Now test your heap/selection reasoning.",
      context: {
        problemTitle: 'Kth Largest Element in an Array',
        patternName: 'Priority Queue / Min-Heap',
        approachName: 'Min-Heap of Size K',
        summaryHint: 'Maintain a Min-Heap of size K; when size exceeds K, pop smallest element.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why does a Min-Heap of size K maintain the K largest elements?',
        options: [
          'The root of a Min-Heap holds the minimum of the K candidates; discarding root drops smaller elements',
          'A Min-Heap sorts all elements in descending order',
          'A Min-Heap uses O(1) space regardless of K',
          'It stores elements in array order',
        ],
        correctAnswer: 0,
        explanation: 'A Min-Heap keeps the smallest of the top-K elements at the root. Evicting root when size > K keeps only the K largest numbers.',
      },
      {
        id: 'r2',
        question: 'After processing all N elements, what element is at the root of the size-K Min-Heap?',
        options: ['The largest element in the array', 'The Kth largest element in the array', 'The smallest element in the array', 'Zero'],
        correctAnswer: 1,
        explanation: 'The root of a size-K Min-Heap containing the K largest items is precisely the Kth largest element.',
      },
      {
        id: 'r3',
        question: 'What is the time complexity of pushing into a heap of size K?',
        options: ['O(1)', 'O(log K)', 'O(K)', 'O(N)'],
        correctAnswer: 1,
        explanation: 'Heap insertion and deletion in a heap of size K takes O(log K) time.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Top K Frequent Elements — Given an integer array nums and integer k, return the k most frequent elements.',
      inputVisual: 'nums = [1,1,1,2,2,3], k = 2',
      question: 'Which pattern maintains top K elements ordered by frequency?',
      options: [
        {
          label: 'Min-Heap of Size K (ordered by frequency)',
          pattern: 'Heap Bounded Priority',
          family: 'Min-Heap',
          isCorrect: true,
        },
        {
          label: 'Binary Search Tree Search',
          pattern: 'Range Splitting',
          family: 'BST',
          isCorrect: false,
        },
      ],
      explanation: 'Maintaining a Min-Heap of size K keyed by frequency keeps the top K most frequent elements.',
    },
    guidedChallenge: {
      title: 'Guided Application: Find K Pairs with Smallest Sums',
      description: 'Given two sorted arrays nums1 and nums2, return the k pairs (u, v) with the smallest sums.',
      inputVisual: 'nums1 = [1,7,11], nums2 = [2,4,6], k = 3',
      expectedOutput: '[[1,2],[1,4],[1,6]]',
      prompts: [
        {
          stepNo: '01',
          question: 'What heap type should track candidate smallest pair sums?',
          options: ['Min-Heap tracking pair sum', 'Max-Heap tracking array length', 'Queue'],
          correctAnswer: 0,
          explanation: 'A Min-Heap keyed by pair sum (u + v) extracts smallest sum pairs efficiently.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Kth Smallest Element in a Sorted Matrix',
      description: 'Given an n x n matrix where each row and column is sorted in ascending order, find the kth smallest element.',
      inputVisual: 'matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8',
      expectedOutput: '13',
      patternOptions: [
        { value: 'min-heap-k-pointers', label: 'Min-Heap for Merging K Sorted Rows' },
        { value: 'hash-map-freq', label: 'Hash Map Frequency Count' },
      ],
      correctPattern: 'min-heap-k-pointers',

      approachOptions: [
        { value: 'push-row-heads-pop-k', label: 'Push first element of each row to Min-Heap; pop K times, pushing next row element' },
        { value: 'sort-entire-matrix', label: 'Flatten matrix into array and call sort()' },
      ],
      correctApproach: 'push-row-heads-pop-k',

      reasoningOptions: [
        { value: 'merge-k-sorted', label: 'The matrix represents N sorted lists; a Min-Heap of size N extracts elements in global ascending order.' },
        { value: 'matrix-diagonal', label: 'The Kth smallest is always on the main diagonal.' },
      ],
      correctReasoning: 'merge-k-sorted',

      starterTemplate: `// Write your implementation here...
function kthSmallest(matrix, k) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if stream data arrives continuously and we must return the Kth largest after every insertion?',
      question: 'How does Kth Largest Element in a Stream maintain real-time answers?',
      options: [
        'Maintain a persistent Min-Heap of size K across add(val) invocations.',
        'Re-sort the entire array on every add() call.',
        'Use a static array of size N.',
      ],
      correctAnswer: 0,
      explanation: 'A persistent Min-Heap of size K provides O(log K) insertion and O(1) retrieval for streaming data.',
    },
    hints: [
      'Hint 1: Think about how N sorted lists can be merged.',
      'Hint 2: A Min-Heap can store one candidate element from each row.',
      'Hint 3: Pop the smallest element from heap K times.',
      'Hint 4: Each pop reveals 1 smallest element and pushes the next element from that same row.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Kth Largest Element in an Array',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Kth Largest Element in an Array independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Top K Frequent Elements',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Apply size-K Min-Heap pattern to frequency tracking.',
      },
    ],
    takeaway: 'You applied Min-Heap bounded selection across array elements, frequencies, and matrix selection problems.',
  },

  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Sliding Window Maximum. Now test your monotonic queue range reasoning.",
      context: {
        problemTitle: 'Sliding Window Maximum',
        patternName: 'Sliding Window / Monotonic Deque',
        approachName: 'Monotonic Decreasing Deque',
        summaryHint: 'Maintain deque indices in decreasing order of values; remove expired indices from front.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why does the Monotonic Deque store indices rather than raw element values?',
        options: [
          'Indices allow checking whether an element has fallen outside the current window (index <= i - k)',
          'JavaScript arrays only accept integer indices',
          'Values consume more memory than indices',
          'To sort the array in-place',
        ],
        correctAnswer: 0,
        explanation: 'Storing indices lets us easily verify whether the element at the front of the deque is still inside the current window bounds.',
      },
      {
        id: 'r2',
        question: 'What property does a Monotonic Decreasing Deque maintain?',
        options: [
          'Elements corresponding to stored indices are in strictly decreasing order from front to back',
          'All numbers are even',
          'Deque length equals window size K',
          'Front of deque holds the minimum value',
        ],
        correctAnswer: 0,
        explanation: 'Decreasing order ensures that the max element for the current window is always at deque front (`deque[0]`).',
      },
      {
        id: 'r3',
        question: 'When a new value nums[i] is processed, what elements are popped from the BACK of the deque?',
        options: [
          'All indices whose values are less than or equal to nums[i]',
          'The front element only',
          'All odd indices',
          'None',
        ],
        correctAnswer: 0,
        explanation: 'Elements smaller than `nums[i]` can never be the maximum for `nums[i]` or any future window, so they are evicted from the back.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Longest Subarray of 1s After Deleting One Element — Find longest subarray of 1s allowing at most one 0 deletion.',
      inputVisual: 'nums = [1,1,0,1]',
      question: 'Which window technique adjusts left boundary when 0 count exceeds threshold?',
      options: [
        {
          label: 'Dynamic Sliding Window (Two Pointers)',
          pattern: 'Variable Window',
          family: 'Sliding Window',
          isCorrect: true,
        },
        {
          label: 'Monotonic Stack',
          pattern: 'LIFO Processing',
          family: 'Stack',
          isCorrect: false,
        },
      ],
      explanation: 'Dynamic Sliding Window expands right pointer and shrinks left pointer when zero count exceeds 1.',
    },
    guidedChallenge: {
      title: 'Guided Application: Minimum Size Subarray Sum',
      description: 'Given an array of positive integers nums and target, return minimal length of subarray whose sum >= target.',
      inputVisual: 'target = 7, nums = [2,3,1,2,4,3]',
      expectedOutput: '2 ([4, 3])',
      prompts: [
        {
          stepNo: '01',
          question: 'How does dynamic sliding window update window length?',
          options: ['Expand right pointer; while sum >= target, update minLen and shrink left pointer', 'Use Min-Heap', 'Sort nums'],
          correctAnswer: 0,
          explanation: 'Expand right to add values; shrink left while condition holds to minimize window length.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Subarrays with K Different Integers',
      description: 'Given an integer array nums and integer k, return the number of good subarrays with exactly k different integers.',
      inputVisual: 'nums = [1,2,1,2,3], k = 2',
      expectedOutput: '7',
      patternOptions: [
        { value: 'at-most-k-sliding-window', label: 'Sliding Window (atMost(K) - atMost(K-1))' },
        { value: 'binary-search-tree', label: 'BST Traversal' },
      ],
      correctPattern: 'at-most-k-sliding-window',

      approachOptions: [
        { value: 'exact-k-formula', label: 'Compute count of subarrays with at most K distinct minus at most K-1 distinct' },
        { value: 'all-substring-brute-force', label: 'Generate all O(N^2) subarrays' },
      ],
      correctApproach: 'exact-k-formula',

      reasoningOptions: [
        { value: 'exact-equals-atmost-diff', label: 'exactly(K) = atMost(K) - atMost(K - 1) makes variable sliding window tractable.' },
        { value: 'fixed-k-window', label: 'Use a fixed window of size K.' },
      ],
      correctReasoning: 'exact-equals-atmost-diff',

      starterTemplate: `// Write your implementation here...
function subarraysWithKDistinct(nums, k) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if window size K is not fixed, but determined dynamically by target sum?',
      question: 'What changes in the sliding window state maintenance?',
      options: [
        'Left pointer moves dynamically based on window sum condition instead of fixed i - k + 1.',
        'Window size remains constant at 5.',
        'Use DFS instead of window pointers.',
      ],
      correctAnswer: 0,
      explanation: 'Dynamic sliding window contracts left pointer when constraint is met/violated rather than incrementing left fixedly.',
    },
    hints: [
      'Hint 1: Counting exactly K distinct items directly with sliding window is tricky because shrinking left might stay at K.',
      'Hint 2: Notice that exactly(K) = atMost(K) - atMost(K - 1).',
      'Hint 3: Writing a helper function atMost(goal) using dynamic sliding window is straightforward.',
      'Hint 4: In atMost(goal), adding nums[right] adds (right - left + 1) valid subarrays to total.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Sliding Window Maximum',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/sliding-window-maximum/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Sliding Window Maximum independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Minimum Size Subarray Sum',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
        relationship: 'constraint-variation',
        relationshipLabel: 'CONSTRAINT VARIATION',
        reason: 'Apply variable sliding window pointers to subarray sum constraints.',
      },
    ],
    takeaway: 'You applied fixed and dynamic sliding window patterns across range maximums and subarray count constraints.',
  },

  'merge-intervals': {
    problemId: 'merge-intervals',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Merge Intervals. Now test your interval sorting & sweep line skills.",
      context: {
        problemTitle: 'Merge Intervals',
        patternName: 'Interval Processing / Sorting + Sweep',
        approachName: 'Start-Time Sort + Linear Sweep',
        summaryHint: 'Sort intervals by start time; merge if current.start <= lastMerged.end.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why is sorting intervals by start time essential before performing a linear sweep?',
        options: [
          'It guarantees that overlapping intervals are adjacent in the list',
          'It reduces the number of intervals to zero',
          'It turns 2D intervals into 1D integers',
          'It calculates total interval area',
        ],
        correctAnswer: 0,
        explanation: 'Sorting by start time ensures that any interval that could overlap with previous intervals appears immediately after them.',
      },
      {
        id: 'r2',
        question: 'When comparing current interval [start, end] with lastMerged [lastStart, lastEnd], what condition indicates overlap?',
        options: ['start <= lastEnd', 'start > lastEnd', 'end === lastStart', 'start === 0'],
        correctAnswer: 0,
        explanation: 'If `curr.start <= lastMerged.end`, the two intervals overlap and must be merged.',
      },
      {
        id: 'r3',
        question: 'When merging overlapping interval [start, end] into lastMerged [lastStart, lastEnd], how is the new end updated?',
        options: ['lastEnd = Math.max(lastEnd, end)', 'lastEnd = end', 'lastEnd = lastStart + start', 'lastEnd = 0'],
        correctAnswer: 0,
        explanation: 'The merged end boundary extends to `Math.max(lastEnd, end)` to encompass the full span.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Insert Interval — Given sorted non-overlapping intervals, insert newInterval and merge if necessary.',
      inputVisual: 'intervals = [[1,3],[6,9]], newInterval = [2,5]',
      question: 'Which strategy handles insertion and merging cleanly?',
      options: [
        {
          label: '3-Phase Sweep (Before, Merge Overlaps, After)',
          pattern: 'Interval Sweep',
          family: 'Linear Sweep',
          isCorrect: true,
        },
        {
          label: 'Binary Search Tree Balancing',
          pattern: 'Tree Division',
          family: 'BST',
          isCorrect: false,
        },
      ],
      explanation: '3-phase linear sweep adds non-overlapping left intervals, merges all overlapping intervals with newInterval, then appends right intervals.',
    },
    guidedChallenge: {
      title: 'Guided Application: Non-overlapping Intervals (Min Removals)',
      description: 'Given an array of intervals, find the minimum number of intervals to remove to make the rest non-overlapping.',
      inputVisual: 'intervals = [[1,2],[2,3],[3,4],[1,3]]',
      expectedOutput: '1 (remove [1,3])',
      prompts: [
        {
          stepNo: '01',
          question: 'To minimize removals, should we sort by start time or END time?',
          options: ['End time (Greedy: pick interval that finishes earliest)', 'Start time', 'Interval length'],
          correctAnswer: 0,
          explanation: 'Sorting by end time greedily leaves maximum remaining room for future intervals.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Meeting Rooms II',
      description: 'Given an array of meeting time intervals consisting of start and end times [[s1,e1],[s2,e2],...], find the minimum number of conference rooms required.',
      inputVisual: 'intervals = [[0,30],[5,10],[15,20]]',
      expectedOutput: '2',
      patternOptions: [
        { value: 'min-heap-end-times', label: 'Min-Heap of Active End Times / Sweep Line' },
        { value: 'binary-search-intervals', label: 'Binary Search Range' },
      ],
      correctPattern: 'min-heap-end-times',

      approachOptions: [
        { value: 'sort-start-min-heap-end', label: 'Sort intervals by start time; use Min-Heap to track earliest ending meeting room' },
        { value: 'count-total-hours', label: 'Sum all meeting durations' },
      ],
      correctApproach: 'sort-start-min-heap-end',

      reasoningOptions: [
        { value: 'heap-root-earliest-finish', label: 'If earliest ending meeting in Min-Heap <= current meeting start, reuse room (pop & push new end); else allocate new room (push).' },
        { value: 'matrix-grid-fill', label: 'Fill 2D grid cells for each hour.' },
      ],
      correctReasoning: 'heap-root-earliest-finish',

      starterTemplate: `// Write your implementation here...
function minMeetingRooms(intervals) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if intervals arrive in real-time as a data stream?',
      question: 'How do we maintain merged interval ranges efficiently in a stream?',
      options: [
        'Use a Balanced BST (Interval Tree / TreeMap) to search and merge overlapping ranges in O(log N) per insertion.',
        'Re-sort all intervals from scratch on every stream event.',
        'Convert intervals into strings.',
      ],
      correctAnswer: 0,
      explanation: 'Balanced BSTs allow O(log N) lookup and deletion of overlapping intervals during real-time insertion.',
    },
    hints: [
      'Hint 1: Think about when two meetings can share the same conference room.',
      'Hint 2: Meeting A and Meeting B share a room if Meeting B starts after Meeting A ends.',
      'Hint 3: Sort meetings by start time first.',
      'Hint 4: Use a Min-Heap of meeting end times. The size of the heap at the end is the minimum room count.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Merge Intervals',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/merge-intervals/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Merge Intervals independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Insert Interval',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/insert-interval/',
        relationship: 'constraint-variation',
        relationshipLabel: 'CONSTRAINT VARIATION',
        reason: 'Apply interval sweep merging to an already-sorted interval list.',
      },
    ],
    takeaway: 'You applied interval sorting and sweep line reasoning across merging, insertion, and meeting room allocation problems.',
  },

  'longest-substring-no-repeat': {
    problemId: 'longest-substring-no-repeat',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Longest Substring Without Repeating Characters. Now test your dynamic window frequency skills.",
      context: {
        problemTitle: 'Longest Substring Without Repeating Characters',
        patternName: 'Sliding Window / Map Frequency',
        approachName: 'Dynamic Window with Last-Seen Map',
        summaryHint: 'Expand right pointer; when duplicate seen, jump left = Math.max(left, map.get(char) + 1).',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why does storing the last-seen index of each character optimize sliding window performance?',
        options: [
          'It allows the left pointer to jump directly past the duplicate position in O(1) time',
          'It sorts the characters alphabetically',
          'It eliminates the need for the right pointer',
          'It compresses the string',
        ],
        correctAnswer: 0,
        explanation: 'When a duplicate is encountered, jumping `left = Math.max(left, map.get(char) + 1)` avoids incrementing `left` one step at a time.',
      },
      {
        id: 'r2',
        question: 'Why is Math.max(left, map.get(char) + 1) used when updating the left pointer?',
        options: [
          'To ensure the left pointer never moves backward for duplicates outside the current window',
          'To guarantee the window size is always odd',
          'To count total unique characters',
          'Because Math.max is required by JavaScript',
        ],
        correctAnswer: 0,
        explanation: 'If a character\'s previous index is smaller than `left`, it is already outside the active window and must not pull `left` backward.',
      },
      {
        id: 'r3',
        question: 'How is the maximum window length updated at each step?',
        options: ['maxLen = Math.max(maxLen, right - left + 1)', 'maxLen = right + left', 'maxLen = map.size', 'maxLen = 1'],
        correctAnswer: 0,
        explanation: 'The current valid window span is `right - left + 1`. We update `maxLen` with `Math.max(maxLen, right - left + 1)`.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Longest Repeating Character Replacement — Given string s and integer k, replace up to k chars to get longest same-char substring.',
      inputVisual: 's = "AABABBA", k = 1',
      question: 'Which window condition maintains valid replacements (windowLength - maxFreq <= k)?',
      options: [
        {
          label: 'Dynamic Sliding Window with Frequency Map',
          pattern: 'Variable Window',
          family: 'Sliding Window',
          isCorrect: true,
        },
        {
          label: 'Binary Search Tree',
          pattern: 'Tree Search',
          family: 'BST',
          isCorrect: false,
        },
      ],
      explanation: 'Dynamic sliding window tracks max frequency char in current window; if `(right - left + 1) - maxFreq > k`, shrink left.',
    },
    guidedChallenge: {
      title: 'Guided Application: Max Consecutive Ones III',
      description: 'Given a binary array nums and integer k, return max consecutive 1s if you can flip at most k 0s.',
      inputVisual: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2',
      expectedOutput: '6',
      prompts: [
        {
          stepNo: '01',
          question: 'How does sliding window track the flip budget k?',
          options: ['Expand right; increment zeroCount when nums[right] === 0. While zeroCount > k, shrink left.', 'Use Stack', 'Sort array'],
          correctAnswer: 0,
          explanation: 'Track zero count in window; when zeros > k, increment left and decrement zero count if nums[left] was 0.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Fruit Into Baskets (At Most 2 Distinct Types)',
      description: 'Given an integer array fruits, return the maximum number of fruits you can collect using 2 baskets (at most 2 distinct fruit types).',
      inputVisual: 'fruits = [1,2,3,2,2]',
      expectedOutput: '4 ([2,3,2,2])',
      patternOptions: [
        { value: 'dynamic-sliding-window-map', label: 'Dynamic Sliding Window with Type Count Map' },
        { value: 'prefix-sum-array', label: 'Prefix Sum Array' },
      ],
      correctPattern: 'dynamic-sliding-window-map',

      approachOptions: [
        { value: 'expand-right-shrink-left-map-size-2', label: 'Expand right pointer adding fruits; while map.size > 2, shrink left pointer' },
        { value: 'sort-fruit-types', label: 'Sort fruits array numerically' },
      ],
      correctApproach: 'expand-right-shrink-left-map-size-2',

      reasoningOptions: [
        { value: 'two-distinct-constraint', label: 'At most 2 distinct types means map.size <= 2; shrinking left preserves window validity.' },
        { value: 'even-indices-only', label: 'Baskets only pick even index fruits.' },
      ],
      correctReasoning: 'two-distinct-constraint',

      starterTemplate: `// Write your implementation here...
function totalFruit(fruits) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if string s is infinitely long stream data?',
      question: 'How does sliding window maintain frequency state for a sliding stream?',
      options: [
        'Maintain a queue of recent window characters and a fixed size frequency map.',
        'Store all stream characters in a global array.',
        'Reset map to zero every 10 characters.',
      ],
      correctAnswer: 0,
      explanation: 'For streaming data, a Queue maintains active window elements while a HashMap tracks frequencies.',
    },
    hints: [
      'Hint 1: Think of 2 baskets as a constraint: at most 2 distinct fruit types in the active window.',
      'Hint 2: Use a HashMap to store (fruitType -> count) in the current window.',
      'Hint 3: Expand right pointer. If map.size > 2, decrement count of fruits[left] and increment left.',
      'Hint 4: Update maxLen = Math.max(maxLen, right - left + 1) at each step.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Longest Substring Without Repeating Characters',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        relationship: 'same-problem',
        relationshipLabel: 'SAME PROBLEM',
        reason: 'Solve Longest Substring Without Repeating Characters independently on LeetCode.',
      },
      {
        id: 'rec-2',
        title: 'Fruit Into Baskets',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/fruit-into-baskets/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Apply dynamic sliding window with HashMap frequency constraint (at most 2 types).',
      },
    ],
    takeaway: 'You applied dynamic sliding window with HashMap frequency tracking across substring and subarray constraints.',
  },

  'shortest-path-graph': {
    problemId: 'shortest-path-graph',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through Shortest Path in Unweighted Graph. Now test your BFS level-order traversal skills.",
      context: {
        problemTitle: 'Shortest Path in Unweighted Graph',
        patternName: 'Graph Traversal / BFS Level Order',
        approachName: 'BFS Queue with Distance Array',
        summaryHint: 'Enqueue start node with dist 0; visit unvisited neighbors level by level with dist + 1.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why does Breadth-First Search (BFS) guarantee the shortest path in an UNWEIGHTED graph?',
        options: [
          'BFS explores graph nodes in increasing order of distance (level by level)',
          'BFS sorts edge weights in ascending order',
          'BFS visits deeper nodes first',
          'BFS uses a stack',
        ],
        correctAnswer: 0,
        explanation: 'In an unweighted graph, exploring level by level ensures that the first time a node is reached, it is via the path with the fewest edges.',
      },
      {
        id: 'r2',
        question: 'What is the role of the visited set (or visited array) during BFS graph traversal?',
        options: [
          'To prevent processing the same node multiple times and avoid infinite loops in cycles',
          'To store node labels alphabetically',
          'To count total edges in the graph',
          'To calculate node degrees',
        ],
        correctAnswer: 0,
        explanation: 'A visited tracker prevents re-enqueueing nodes, avoiding infinite loops in cyclic graphs.',
      },
      {
        id: 'r3',
        question: 'What data structure enforces the FIFO level-by-level processing required by BFS?',
        options: ['Queue (FIFO)', 'Stack (LIFO)', 'Min-Heap', 'Hash Table'],
        correctAnswer: 0,
        explanation: 'A FIFO Queue processes earlier-discovered shallow nodes before deeper nodes.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Word Ladder — Transform beginWord to endWord by changing 1 letter at a time, using a dictionary of valid words.',
      inputVisual: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
      question: 'Why is BFS ideal for finding the shortest transformation sequence length?',
      options: [
        {
          label: 'BFS finds shortest unweighted path in word graph level by level',
          pattern: 'Unweighted Graph BFS',
          family: 'BFS Queue',
          isCorrect: true,
        },
        {
          label: 'DFS Backtracking',
          pattern: 'Exhaustive Search',
          family: 'DFS',
          isCorrect: false,
        },
      ],
      explanation: 'Word transformations represent unit-weight graph edges. BFS level-order search finds minimum transformations.',
    },
    guidedChallenge: {
      title: 'Guided Application: Rotting Oranges (Multi-Source BFS)',
      description: 'Every minute, any fresh orange 4-directionally adjacent to a rotten orange becomes rotten. Return minimum minutes until no fresh orange remains.',
      inputVisual: 'grid = [[2,1,1],[1,1,0],[0,1,1]]',
      expectedOutput: '4',
      prompts: [
        {
          stepNo: '01',
          question: 'How does Multi-Source BFS start?',
          options: ['Enqueue ALL initial rotten oranges at minute 0 simultaneously', 'Enqueue only top-left orange', 'Run DFS from bottom right'],
          correctAnswer: 0,
          explanation: 'Multi-Source BFS enqueues all initial rotten oranges together into the queue as level 0.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Open the Lock',
      description: 'You have a 4-wheel lock starting at "0000". Each wheel can turn 0-9. Return minimum total turns to reach target without hitting deadends.',
      inputVisual: 'deadends = ["0201","0101","0102","1210","2001"], target = "0202"',
      expectedOutput: '6',
      patternOptions: [
        { value: 'state-space-bfs', label: 'Implicit State Graph BFS' },
        { value: 'binary-search-digits', label: 'Binary Search Digits' },
      ],
      correctPattern: 'state-space-bfs',

      approachOptions: [
        { value: 'bfs-queue-deadends-set', label: 'Treat 10,000 combinations as graph nodes; run BFS queue from "0000", avoiding deadend set' },
        { value: 'dfs-recursive-lock', label: 'Run DFS recursion on 4 wheels' },
      ],
      correctApproach: 'bfs-queue-deadends-set',

      reasoningOptions: [
        { value: 'each-turn-1-edge', label: 'Each wheel movement is a unit-weight edge (+1/-1 turn). BFS guarantees minimum turns.' },
        { value: 'sort-deadends', label: 'Sorting deadends reduces search space.' },
      ],
      correctReasoning: 'each-turn-1-edge',

      starterTemplate: `// Write your implementation here...
function openLock(deadends, target) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if edges have non-negative weights (costs) instead of unweighted unit cost?',
      question: 'Which shortest path algorithm replaces BFS Queue when edge weights vary?',
      options: [
        'Dijkstra\'s Algorithm using a Priority Queue (Min-Heap)',
        'Standard BFS Queue',
        'Inorder Tree Traversal',
      ],
      correctAnswer: 0,
      explanation: 'Dijkstra\'s Algorithm uses a Min-Heap to extract the shortest tentative distance node for weighted graphs.',
    },
    hints: [
      'Hint 1: Think of the lock states "0000" to "9999" as 10,000 nodes in an implicit graph.',
      'Hint 2: From any state, there are 8 possible single-wheel turns (4 wheels * 2 directions).',
      'Hint 3: Use a Set for deadends and visited states for O(1) lookup.',
      'Hint 4: Run standard BFS using a FIFO queue tracking [state, turns].',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Rotting Oranges',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/rotting-oranges/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Apply Multi-Source BFS level-order traversal on a 2D grid.',
      },
      {
        id: 'rec-2',
        title: 'Open the Lock',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/open-the-lock/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply BFS shortest path to implicit state space graph traversal.',
      },
    ],
    takeaway: 'You applied BFS shortest path level-order traversal across graphs, grids, and implicit state spaces.',
  },

  'climbing-stairs': {
    problemId: 'climbing-stairs',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Climbing Stairs',
        patternName: 'Dynamic Programming / Fibonacci Recurrence',
        approachName: 'Bottom-Up Tabulation / Space-Optimized DP',
        summaryHint: 'Recall how dp[i] = dp[i-1] + dp[i-2] calculates path counts.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the core recurrence relation for counting ways to reach step N?',
        options: [
          'dp[n] = dp[n-1] * dp[n-2]',
          'dp[n] = dp[n-1] + dp[n-2]',
          'dp[n] = min(dp[n-1], dp[n-2]) + 1',
          'dp[n] = dp[n-1] + 1',
        ],
        correctAnswer: 1,
        explanation: 'To reach step N, you can take a 1-step jump from N-1 or a 2-step jump from N-2, making total ways dp[n-1] + dp[n-2].',
      },
      {
        id: 'r2',
        question: 'What are the base cases for a 1-step and 2-step staircase?',
        options: [
          'dp[1] = 0, dp[2] = 1',
          'dp[1] = 1, dp[2] = 2',
          'dp[1] = 2, dp[2] = 3',
          'dp[1] = 1, dp[2] = 1',
        ],
        correctAnswer: 1,
        explanation: 'There is 1 way to reach step 1 (1 step) and 2 ways to reach step 2 (1+1, 2 steps).',
      },
      {
        id: 'r3',
        question: 'How can we optimize space complexity from O(N) to O(1)?',
        options: [
          'Using a HashMap for lookup',
          'Maintaining two scalar variables (prev1, prev2) for the last two values',
          'Reversing the DP array',
          'Using a Min-Heap of size 2',
        ],
        correctAnswer: 1,
        explanation: 'Since dp[i] only depends on the previous two states, we only need two variables to compute the current state.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Min Cost Climbing Stairs (each step has a cost, find min cost to reach top).',
      inputVisual: 'cost = [10, 15, 20]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Dynamic Programming / Overlapping Subproblems',
          pattern: 'State-Space Transitions',
          family: '1D Dynamic Programming',
          isCorrect: true,
        },
        {
          label: 'Two Pointers / Opposite Ends',
          pattern: 'Array Shrinking',
          family: 'Two Pointers',
          isCorrect: false,
        },
        {
          label: 'Binary Search / Range Halving',
          pattern: 'Search Space Reduction',
          family: 'Binary Search',
          isCorrect: false,
        },
        {
          label: 'Graph BFS / Level Order',
          pattern: 'Queue Traversal',
          family: 'Breadth-First Search',
          isCorrect: false,
        },
      ],
      explanation: 'Problems with optimal substructure where minimum cost at step i depends on min cost of previous steps are solved with Dynamic Programming.',
    },
    guidedChallenge: {
      title: 'Guided Application: Min Cost Climbing Stairs',
      description: 'Given cost array [10, 15, 20], find the minimum cost to reach the top of the staircase.',
      inputVisual: 'cost = [10, 15, 20]',
      expectedOutput: '15 (start at index 1 with cost 15, jump 2 steps to top)',
      prompts: [
        {
          stepNo: '01',
          question: 'What is the recurrence relation for minimum cost to reach step i?',
          options: [
            'minCost[i] = cost[i] + min(minCost[i-1], minCost[i-2])',
            'minCost[i] = cost[i-1] + cost[i-2]',
            'minCost[i] = min(cost[i], cost[i-1])',
          ],
          correctAnswer: 0,
          explanation: 'The cost to step onto i is cost[i] plus the minimum of costs to reach i-1 or i-2.',
        },
        {
          stepNo: '02',
          question: 'From index 0 (cost 10) or index 1 (cost 15), which starting choice yields lower total cost to reach step 3?',
          options: [
            'Start at index 1: total cost 15 to jump 2 steps to top',
            'Start at index 0: total cost 10 + 20 = 30 to reach top',
            'Both starting points yield cost 25',
          ],
          correctAnswer: 0,
          explanation: 'Starting at index 1 costs 15, and a 2-step jump reaches the top directly with total cost 15.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: N-th Tribonacci Number',
      description: 'The Tribonacci sequence Tn is defined as: T0 = 0, T1 = 1, T2 = 1, and T(n+3) = Tn + T(n+1) + T(n+2). Given n, return Tn.',
      inputVisual: 'n = 4 -> T4 = T3 + T2 + T1 = 2 + 1 + 1 = 4',
      expectedOutput: '4',
      patternOptions: [
        { value: '1d-dp-recurrence', label: '1D Dynamic Programming / Recurrence State Tracking' },
        { value: 'greedy-choice', label: 'Greedy Choice Property' },
        { value: 'backtracking-search', label: 'Recursive Backtracking Search' },
      ],
      correctPattern: '1d-dp-recurrence',

      approachOptions: [
        { value: 'three-variable-dp', label: 'Iterative 3-Variable Shift (a, b, c = b, c, a + b + c)' },
        { value: 'full-recursion-no-memo', label: 'Naïve Un-memoized 3-way Recursion' },
        { value: 'binary-search-val', label: 'Binary Search on Value Range' },
      ],
      correctApproach: 'three-variable-dp',

      reasoningOptions: [
        { value: 'sum-last-three', label: 'Each term depends strictly on the sum of the last 3 terms. Keeping 3 variables gives O(N) time and O(1) space.' },
        { value: 'divide-conquer-halves', label: 'Halving the input range reduces terms logarithmicly.' },
        { value: 'sort-history', label: 'Sorting previous values yields median element.' },
      ],
      correctReasoning: 'sum-last-three',

      starterTemplate: `// Write your implementation here...
function tribonacci(n) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if you can take 1, 2, or up to K steps at a time?',
      question: 'How does the DP state transition formula generalize for up to K steps?',
      options: [
        'dp[i] = sum(dp[i-j] for j from 1 to K)',
        'dp[i] = dp[i-1] * K',
        'dp[i] = dp[i-K] + K',
      ],
      correctAnswer: 0,
      explanation: 'With K allowable step sizes, the number of ways to reach step i is the sum of ways to reach all previous K steps (dp[i-1] + ... + dp[i-K]).',
    },
    hints: [
      'Hint 1: Recognize that Tribonacci is a direct extension of Fibonacci / Climbing Stairs from 2 steps to 3 steps.',
      'Hint 2: Initialize base cases: T0 = 0, T1 = 1, T2 = 1.',
      'Hint 3: Use three variables (a=0, b=1, c=1) and loop from i = 3 to n.',
      'Hint 4: In each iteration, compute nextVal = a + b + c, then shift: a = b; b = c; c = nextVal.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Min Cost Climbing Stairs',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice 1D DP state transition with step costs.',
      },
      {
        id: 'rec-2',
        title: 'N-th Tribonacci Number',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/n-th-tribonacci-number/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Extend 2-step DP recurrence to 3-step sum state tracking.',
      },
    ],
    takeaway: 'You moved from understanding Climbing Stairs to applying DP recurrence relations across staircase and Tribonacci variations.',
  },

  'house-robber': {
    problemId: 'house-robber',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'House Robber',
        patternName: 'Dynamic Programming / Non-Adjacent Choice',
        approachName: '1D DP / Two-Variable State Tracking',
        summaryHint: 'Recall dp[i] = max(dp[i-1], dp[i-2] + nums[i]) non-adjacent robbery decision.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why can we NOT rob two adjacent houses in the House Robber problem?',
        options: [
          'It triggers security alarms connected between neighboring houses',
          'Adjacent houses have identical loot values',
          'Robbing adjacent houses reduces total loot',
          'The array is sorted in ascending order',
        ],
        correctAnswer: 0,
        explanation: 'The problem constraint specifies that adjacent houses are connected to security alarms, preventing adjacent house selection.',
      },
      {
        id: 'r2',
        question: 'What are the two choices at house i in the optimal state transition?',
        options: [
          'Rob house i (gain nums[i] + dp[i-2]) OR skip house i (keep dp[i-1])',
          'Rob house i (gain nums[i] + dp[i-1]) OR skip house i',
          'Rob all even houses OR rob all odd houses',
          'Take average of house i and house i-1',
        ],
        correctAnswer: 0,
        explanation: 'At house i, you either skip it (preserving dp[i-1]) or rob it (adding nums[i] to max loot up to house i-2).',
      },
      {
        id: 'r3',
        question: 'How do we achieve O(1) auxiliary space complexity for House Robber?',
        options: [
          'Using a single running sum variable',
          'Maintaining two variables (prev1, prev2) representing dp[i-1] and dp[i-2]',
          'Sorting the array in descending order',
          'Using a stack to store house indices',
        ],
        correctAnswer: 1,
        explanation: 'Since dp[i] only depends on dp[i-1] and dp[i-2], we only need two scalar variables updated iteratively.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: House Robber II (Houses are arranged in a circle, so house 0 and house N-1 are adjacent).',
      inputVisual: 'nums = [2, 3, 2] (Circle: 2 -> 3 -> 2 -> 2)',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Dynamic Programming / Circular Subarray Cases',
          pattern: 'State-Space Transitions',
          family: '1D Dynamic Programming (2 Sub-passes)',
          isCorrect: true,
        },
        {
          label: 'Graph BFS / Shortest Path',
          pattern: 'Level Order',
          family: 'Breadth-First Search',
          isCorrect: false,
        },
        {
          label: 'Two Pointers / Partitioning',
          pattern: 'Array Shrinking',
          family: 'Two Pointers',
          isCorrect: false,
        },
        {
          label: 'Greedy Choice / Max Element Selection',
          pattern: 'Local Optima',
          family: 'Greedy Algorithm',
          isCorrect: false,
        },
      ],
      explanation: 'Circular constraint means house 0 and house N-1 cannot both be robbed. We run standard House Robber twice: once for houses 0..N-2 and once for houses 1..N-1.',
    },
    guidedChallenge: {
      title: 'Guided Application: House Robber II (Circular Neighborhood)',
      description: 'Given nums = [2, 3, 2], find maximum loot when first and last houses are adjacent.',
      inputVisual: 'nums = [2, 3, 2]',
      expectedOutput: '3 (rob middle house only)',
      prompts: [
        {
          stepNo: '01',
          question: 'Why does robbing house 0 prevent robbing house N-1 in a circular arrangement?',
          options: [
            'Because house 0 and house N-1 are adjacent neighbors in a circular street',
            'Because house N-1 always has zero loot',
            'Because array length must be even',
          ],
          correctAnswer: 0,
          explanation: 'In a circular street, the last house (N-1) connects back to the first house (0), making them adjacent.',
        },
        {
          stepNo: '02',
          question: 'How do we split the circular problem into standard linear House Robber subproblems?',
          options: [
            'Max of (Robber on nums[0..N-2]) AND (Robber on nums[1..N-1])',
            'Sum of all even indices minus all odd indices',
            'Rob only the largest element in the array',
          ],
          correctAnswer: 0,
          explanation: 'Running standard House Robber on 0..N-2 excludes house N-1, and 1..N-1 excludes house 0, covering all valid circular choices.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Maximum Alternating Subsequence Sum',
      description: 'Given an array nums, return the maximum alternating sum of a subsequence (sum of elements at even indices minus sum at odd indices of subsequence).',
      inputVisual: 'nums = [4, 2, 5, 3] -> Subsequence [4, 2, 5] -> Sum: 4 - 2 + 5 = 7',
      expectedOutput: '7',
      patternOptions: [
        { value: 'dp-two-states', label: 'Dynamic Programming (Even/Odd State Machine)' },
        { value: 'binary-search-range', label: 'Binary Search on Subsequence Sum' },
        { value: 'divide-conquer-split', label: 'Divide and Conquer Half Splitting' },
      ],
      correctPattern: 'dp-two-states',

      approachOptions: [
        { value: 'track-even-odd-max', label: 'Maintain two DP states: maxEven (ending with +) and maxOdd (ending with -)' },
        { value: 'sort-array-descending', label: 'Sort array descending and take first two elements' },
        { value: 'sliding-window-pair', label: 'Sliding window of fixed size 2' },
      ],
      correctApproach: 'track-even-odd-max',

      reasoningOptions: [
        { value: 'dp-state-update', label: 'At element x: newEven = max(even, odd + x), newOdd = max(odd, even - x). Tracks optimal alternating transitions.' },
        { value: 'sum-positive-only', label: 'Summing all positive elements ignores alternating subtraction rule.' },
        { value: 'sliding-max', label: 'Window size 2 misses non-contiguous subsequences.' },
      ],
      correctReasoning: 'dp-state-update',

      starterTemplate: `// Write your implementation here...
function maxAlternatingSum(nums) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if houses are structured as nodes in a Binary Tree (House Robber III)?',
      question: 'How do DP choices change when house connections form a Binary Tree?',
      options: [
        'Each node returns a pair [maxWithNode, maxWithoutNode], where maxWithNode includes root + grandchildren',
        'Run level order BFS and rob even levels',
        'Sort tree nodes by value in descending order',
      ],
      correctAnswer: 0,
      explanation: 'Tree DP computes a 2-element tuple [robThis, skipThis] per node bottom-up, where robbing a node requires skipping both immediate children.',
    },
    hints: [
      'Hint 1: Break circular House Robber II into two linear runs: nums[0..N-2] and nums[1..N-1].',
      'Hint 2: For each linear run, use two scalar variables: prev2 = 0, prev1 = 0.',
      'Hint 3: Iterate through numbers and compute curr = Math.max(prev1, prev2 + num), then update prev2 = prev1, prev1 = curr.',
      'Hint 4: Return Math.max(run1Result, run2Result). Handle N=1 base case explicitly.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'House Robber II',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/house-robber-ii/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice circular neighborhood DP state decomposition.',
      },
      {
        id: 'rec-2',
        title: 'House Robber III',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/house-robber-iii/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Extend non-adjacent DP decision tracking to tree structures.',
      },
    ],
    takeaway: 'You mastered non-adjacent DP decision-making and expanded it to circular and tree-structured house arrangements.',
  },

  'subsets': {
    problemId: 'subsets',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Subsets',
        patternName: 'Backtracking / Power Set Generation',
        approachName: 'Recursive Backtracking (Include/Exclude)',
        summaryHint: 'Recall how recursive choices branch at each index to form all 2^N subsets.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'How many total subsets are generated for an array with N unique elements?',
        options: ['N^2 subsets', '2^N subsets', 'N! subsets', '2*N subsets'],
        correctAnswer: 1,
        explanation: 'Every element has 2 choices (include or exclude), resulting in 2 * 2 * ... * 2 = 2^N total subsets (the power set).',
      },
      {
        id: 'r2',
        question: 'What backtracking step is essential when returning from a recursive branch?',
        options: [
          'Popping the last element from the current path array (path.pop())',
          'Clearing the entire result array',
          'Sorting the current path array',
          'Decrementing recursion index by 2',
        ],
        correctAnswer: 0,
        explanation: 'Backtracking requires removing the last element added to path array to restore state for exploring alternate choices.',
      },
      {
        id: 'r3',
        question: 'When should the current path be added to the final result list in Subsets?',
        options: [
          'At every decision state (node) in the recursion tree',
          'Only when path length equals N',
          'Only when path is empty',
          'Only when path sum is even',
        ],
        correctAnswer: 0,
        explanation: 'Every node in the subset recursion tree represents a valid subset, so a copy of path is added at every step.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Subsets II (Given an array nums that may contain duplicates, return all possible unique subsets).',
      inputVisual: 'nums = [1, 2, 2]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Backtracking / Sorting & Duplicate Pruning',
          pattern: 'State-Space Tree Traversal',
          family: 'Recursive Backtracking',
          isCorrect: true,
        },
        {
          label: 'Dynamic Programming / Overlapping Subproblems',
          pattern: 'Memoization',
          family: '1D DP',
          isCorrect: false,
        },
        {
          label: 'Binary Search / Range Halving',
          pattern: 'Search Space Reduction',
          family: 'Binary Search',
          isCorrect: false,
        },
        {
          label: 'Graph BFS / Level Order',
          pattern: 'Queue Traversal',
          family: 'Breadth-First Search',
          isCorrect: false,
        },
      ],
      explanation: 'Generating unique subsets with duplicate input elements requires sorting the array first and pruning identical choices at the same recursion depth.',
    },
    guidedChallenge: {
      title: 'Guided Application: Subsets II (Handling Duplicates)',
      description: 'Given nums = [1, 2, 2], return all unique subsets without duplicate subset arrays.',
      inputVisual: 'nums = [1, 2, 2]',
      expectedOutput: '[[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]',
      prompts: [
        {
          stepNo: '01',
          question: 'Why is sorting the input array nums first necessary before backtracking?',
          options: [
            'Sorting groups duplicate numbers together so we can skip them easily',
            'Sorting reduces time complexity to O(N log N)',
            'Sorting reverses the array order',
          ],
          correctAnswer: 0,
          explanation: 'Sorting brings duplicate elements adjacent to each other, enabling simple condition check: if (i > start && nums[i] == nums[i-1]) continue.',
        },
        {
          stepNo: '02',
          question: 'Which condition correctly prunes duplicate branch exploration at index i?',
          options: [
            'if (i > start && nums[i] === nums[i - 1]) continue;',
            'if (nums[i] === 0) break;',
            'if (path.length > N) return;',
          ],
          correctAnswer: 0,
          explanation: 'If i > start and nums[i] === nums[i - 1], the element is a duplicate of a previously explored choice at the same tree level, so we skip it.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Combinations (K elements from 1..N)',
      description: 'Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].',
      inputVisual: 'n = 4, k = 2 -> Combinations of length 2',
      expectedOutput: '[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]',
      patternOptions: [
        { value: 'backtracking-fixed-depth', label: 'Backtracking with Bounded Depth K' },
        { value: 'greedy-pair-selection', label: 'Greedy Pair Selection' },
        { value: 'binary-search-comb', label: 'Binary Search Combination' },
      ],
      correctPattern: 'backtracking-fixed-depth',

      approachOptions: [
        { value: 'recursive-combine-k', label: 'Recursive backtracking: append to path, if path.length == k add to result, then backtrack' },
        { value: 'nested-k-loops', label: 'Hardcode K nested for-loops' },
        { value: 'bit-manipulation-k', label: 'Bitmask iteration checking popcount == k' },
      ],
      correctApproach: 'recursive-combine-k',

      reasoningOptions: [
        { value: 'k-depth-pruning', label: 'Recursion terminates and records result as soon as path reaches length k, exploring all valid combinations.' },
        { value: 'loop-count-fixed', label: 'Nested loops fail when K is dynamic.' },
        { value: 'bitmask-slow', label: 'Bitmask checks all 2^N states instead of directly generating K-size paths.' },
      ],
      correctReasoning: 'k-depth-pruning',

      starterTemplate: `// Write your implementation here...
function combine(n, k) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if target sum constraint S is added (Combination Sum)?',
      question: 'How does backtracking adapt when candidates can be reused unlimited times to reach target sum S?',
      options: [
        'Recursive call passes index i instead of i + 1, and backtracks when current sum exceeds target S',
        'Sort candidates and take largest numbers first using Greedy choice',
        'Use BFS queue with depth limited to S',
      ],
      correctAnswer: 0,
      explanation: 'Passing index i allows reusing the current candidate. Subtree is pruned immediately when running sum exceeds target S.',
    },
    hints: [
      'Hint 1: Sort the input array first to group duplicate values together.',
      'Hint 2: In the recursive helper backtrack(start, path), iterate i from start to nums.length - 1.',
      'Hint 3: Skip duplicate elements at the same tree depth: if (i > start && nums[i] === nums[i - 1]) continue;',
      'Hint 4: Push nums[i] to path, call backtrack(i + 1, path), and then path.pop() to backtrack.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Subsets II',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/subsets-ii/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice duplicate pruning in state-space backtracking.',
      },
      {
        id: 'rec-2',
        title: 'Combination Sum',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/combination-sum/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Extend subset backtracking to target sum constraints with candidate reuse.',
      },
    ],
    takeaway: 'You applied state-space tree traversal and backtracking to generate combinations and subsets with duplicate pruning.',
  },

  'course-schedule': {
    problemId: 'course-schedule',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Course Schedule',
        patternName: 'Graph Topological Sort / Cycle Detection',
        approachName: "Kahn's Algorithm (BFS In-Degree Queue)",
        summaryHint: 'Recall tracking in-degrees of prerequisites and processing nodes with 0 dependencies.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What graph condition makes completing all courses impossible?',
        options: [
          'The presence of a directed cycle in the prerequisite graph',
          'The graph having more edges than vertices',
          'Vertices having an out-degree of 0',
          'The graph being disconnected into multiple components',
        ],
        correctAnswer: 0,
        explanation: 'A directed cycle creates circular dependencies (e.g. A requires B, B requires A), making it impossible to take any course in the cycle.',
      },
      {
        id: 'r2',
        question: "In Kahn's algorithm (BFS Topological Sort), which nodes enter the queue first?",
        options: [
          'Nodes with an in-degree of 0 (courses with no prerequisites)',
          'Nodes with the highest out-degree',
          'Node 0 always',
          'Nodes with in-degree equal to total courses',
        ],
        correctAnswer: 0,
        explanation: 'Nodes with in-degree 0 have no prerequisites remaining, so they can be completed immediately and pushed to the BFS queue.',
      },
      {
        id: 'r3',
        question: "How do we verify if all courses were successfully processed at the end of Kahn's algorithm?",
        options: [
          'Check if the count of processed nodes equals total courses count numCourses',
          'Check if queue is empty',
          'Check if adjacency list is empty',
          'Check if total edges equal numCourses - 1',
        ],
        correctAnswer: 0,
        explanation: 'If processed node count === numCourses, no cycle existed. If processed count < numCourses, a cycle prevented remaining nodes from reaching in-degree 0.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Course Schedule II (Return the exact order of courses you should take to finish all courses).',
      inputVisual: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Graph Topological Sort / Order Recording',
          pattern: 'Directed Acyclic Graph Ordering',
          family: "Topological Sort (Kahn's BFS / DFS Post-order)",
          isCorrect: true,
        },
        {
          label: 'Minimum Spanning Tree / Edge Weight',
          pattern: 'Greedy Edge Selection',
          family: "Kruskal's Algorithm",
          isCorrect: false,
        },
        {
          label: 'Disjoint Set Union / Component Count',
          pattern: 'Equivalence Relations',
          family: 'Union-Find',
          isCorrect: false,
        },
        {
          label: 'Shortest Path / Weighted Distances',
          pattern: 'Priority Queue Relaxation',
          family: "Dijkstra's Algorithm",
          isCorrect: false,
        },
      ],
      explanation: 'Course Schedule II requires recording the sequence of nodes processed during topological sort rather than just a boolean feasibility check.',
    },
    guidedChallenge: {
      title: 'Guided Application: Course Schedule II (Course Ordering)',
      description: 'Given numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]], return valid course ordering array.',
      inputVisual: '0 -> 1, 0 -> 2, 1 -> 3, 2 -> 3',
      expectedOutput: '[0, 1, 2, 3] or [0, 2, 1, 3]',
      prompts: [
        {
          stepNo: '01',
          question: 'Which node in the prerequisite graph has in-degree 0 initially?',
          options: [
            'Course 0 (no prerequisites point to course 0)',
            'Course 3',
            'Course 1 and Course 2',
          ],
          correctAnswer: 0,
          explanation: 'Course 0 is required by 1 and 2, but has no incoming prerequisite edges itself, so inDegree[0] === 0.',
        },
        {
          stepNo: '02',
          question: 'When a course is popped from the BFS queue and added to resultOrder, what action is performed on its neighbors?',
          options: [
            'Decrement neighbor in-degrees by 1; if neighbor in-degree reaches 0, push it to queue',
            'Remove neighbors from adjacency list',
            'Multiply neighbor in-degrees by 2',
          ],
          correctAnswer: 0,
          explanation: 'Completing a course satisfies 1 prerequisite for all dependent downstream courses, reducing their in-degree.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Alien Dictionary',
      description: 'Given a sorted dictionary of words from an alien language, derive the order of letters in the alien alphabet.',
      inputVisual: 'words = ["wrt","wrf","er","ett","rftt"] -> Letter rules: t->f, w->e, e->r, r->t',
      expectedOutput: '"wertf"',
      patternOptions: [
        { value: 'topological-sort-graph', label: 'Topological Sort on Character Dependency Graph' },
        { value: 'string-sorting-lexico', label: 'Standard Lexicographical String Sorting' },
        { value: 'trie-prefix-tree', label: 'Trie Prefix Tree Building' },
      ],
      correctPattern: 'topological-sort-graph',

      approachOptions: [
        { value: 'build-char-dag-bfs', label: "Compare adjacent words to find first differing char (u -> v edge), build graph & run Kahn's Topological Sort" },
        { value: 'count-char-frequencies', label: 'Count character frequencies in all words' },
        { value: 'brute-force-permutations', label: 'Generate all 26! character permutations' },
      ],
      correctApproach: 'build-char-dag-bfs',

      reasoningOptions: [
        { value: 'adjacent-word-diff', label: 'Comparing adjacent words gives direct ordering edges between letters. Topological sort produces valid character ordering.' },
        { value: 'frequency-wrong', label: 'Character frequency does not determine relative order.' },
        { value: 'permutations-impossible', label: '26! is computationally impossible.' },
      ],
      correctReasoning: 'adjacent-word-diff',

      starterTemplate: `// Write your implementation here...
function alienOrder(words) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if courses can be taken concurrently in parallel semesters?',
      question: 'How do we calculate the minimum semesters required to complete all courses?',
      options: [
        'Process queue in level-by-level batches (each BFS level = 1 semester)',
        'Multiply numCourses by average course duration',
        'Find the node with maximum out-degree',
      ],
      correctAnswer: 0,
      explanation: 'Processing all in-degree 0 nodes available at the current level simultaneously represents 1 semester. Total levels = min semesters.',
    },
    hints: [
      'Hint 1: Build an adjacency list adj and an inDegree array of size numCourses.',
      'Hint 2: For each pair [course, prereq] in prerequisites, add course to adj[prereq] and increment inDegree[course]++.',
      'Hint 3: Push all courses with inDegree[i] === 0 into a FIFO queue and initialize an empty order array.',
      'Hint 4: While queue is not empty, pop curr, append to order, and decrement neighbor in-degrees. Return order.length === numCourses ? order : [].',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Course Schedule II',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/course-schedule-ii/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice returning topological order of prerequisite dependencies.',
      },
      {
        id: 'rec-2',
        title: 'Alien Dictionary',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/alien-dictionary/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Construct implicit DAG from character comparisons and solve topological ordering.',
      },
    ],
    takeaway: 'You applied topological sorting and in-degree BFS tracking to dependency graphs and sequence resolution.',
  },

  'connected-components': {
    problemId: 'connected-components',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Connected Components in Undirected Graph',
        patternName: 'Graph Traversal / Disjoint Set Union',
        approachName: 'Union-Find / DFS Component Count',
        summaryHint: 'Recall traversing unvisited neighbors or union-ing edge endpoints to count components.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What defines a connected component in an undirected graph?',
        options: [
          'A maximal subgraph where every pair of vertices is connected by a path',
          'A set of vertices with equal degrees',
          'A graph cycle with no branches',
          'A single isolated vertex with no edges',
        ],
        correctAnswer: 0,
        explanation: 'A connected component is a maximal subset of vertices such that any two vertices in the subset can reach each other via paths.',
      },
      {
        id: 'r2',
        question: 'How does Union-Find count connected components starting with N isolated nodes?',
        options: [
          'Start with count = N, and decrement count by 1 for each successful union of two disjoint sets',
          'Start with count = 0, and increment count by 1 for every edge',
          'Multiply component count by 2 for each union',
          'Count total edges divided by 2',
        ],
        correctAnswer: 0,
        explanation: 'Starting with N disjoint components, each union operation merges two separate sets into one, decrementing total component count by 1.',
      },
      {
        id: 'r3',
        question: 'What optimization in Union-Find flattens tree height to make operations nearly O(1)?',
        options: [
          'Path Compression (pointing visited nodes directly to the root during find)',
          'Binary Search Tree insertion',
          'Sorting edges by weight',
          'Re-indexing graph vertices',
        ],
        correctAnswer: 0,
        explanation: 'Path compression makes nodes on the find path point directly to the set root, giving amortized alpha(N) ~ O(1) time per operation.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Number of Provinces (Given an N x N matrix isConnected where isConnected[i][j] = 1 if city i and city j are connected).',
      inputVisual: 'isConnected = [[1,1,0],[1,1,0],[0,0,1]]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Graph Traversal / Disjoint Set Union',
          pattern: 'Connected Subgraph Partitioning',
          family: 'DFS Traversal / Union-Find',
          isCorrect: true,
        },
        {
          label: 'Dynamic Programming / Grid Paths',
          pattern: 'Memoized Transitions',
          family: '2D DP',
          isCorrect: false,
        },
        {
          label: 'Binary Search / Range Halving',
          pattern: 'Search Space Reduction',
          family: 'Binary Search',
          isCorrect: false,
        },
        {
          label: 'Monotonic Queue / Window Max',
          pattern: 'Sliding Window',
          family: 'Deque',
          isCorrect: false,
        },
      ],
      explanation: 'Provinces are connected components of cities. Finding total provinces requires counting connected components via DFS or Union-Find.',
    },
    guidedChallenge: {
      title: 'Guided Application: Number of Provinces',
      description: 'Given adjacency matrix isConnected = [[1,1,0],[1,1,0],[0,0,1]], count total provinces.',
      inputVisual: 'City 0 -> City 1 (Province 1), City 2 isolated (Province 2)',
      expectedOutput: '2',
      prompts: [
        {
          stepNo: '01',
          question: 'If we iterate through city 0 to N-1 with a visited array, what triggers a new province count?',
          options: [
            'Encountering an unvisited city visited[i] === false triggers a DFS traversal and increments province count by 1',
            'Every cell with value 1 in matrix adds 1 to province count',
            'Every city adds 1 to province count regardless of connections',
          ],
          correctAnswer: 0,
          explanation: 'Starting DFS from an unvisited city marks all reachable cities in that province as visited and counts as 1 province.',
        },
        {
          stepNo: '02',
          question: 'During DFS from city u, which neighbor condition determines recursive continuation?',
          options: [
            'If isConnected[u][v] === 1 and visited[v] === false',
            'If isConnected[u][v] === 0',
            'If v === u',
          ],
          correctAnswer: 0,
          explanation: 'DFS visits neighbor v only if there is a direct edge (isConnected[u][v] === 1) and v has not been visited yet.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Redundant Connection',
      description: 'Given an undirected graph with N nodes and N edges (a tree plus 1 extra edge), find the edge that creates a cycle.',
      inputVisual: 'edges = [[1,2], [1,3], [2,3]] -> Edge [2,3] completes cycle 1-2-3',
      expectedOutput: '[2,3]',
      patternOptions: [
        { value: 'union-find-cycle-detection', label: 'Union-Find Cycle Detection' },
        { value: 'shortest-path-dijkstra', label: 'Dijkstra Shortest Path' },
        { value: 'topological-sort-dag', label: 'Topological Sort' },
      ],
      correctPattern: 'union-find-cycle-detection',

      approachOptions: [
        { value: 'uf-union-check', label: 'Iterate edges: if find(u) === find(v), edge (u, v) is redundant! Otherwise union(u, v).' },
        { value: 'dfs-all-paths', label: 'Run DFS for every edge to count total paths' },
        { value: 'sort-edge-weights', label: 'Sort edges by node numbers' },
      ],
      correctApproach: 'uf-union-check',

      reasoningOptions: [
        { value: 'same-set-cycle', label: 'If two vertices already belong to the same set before adding the edge, adding this edge forms a cycle.' },
        { value: 'dfs-too-slow', label: 'Running full DFS per edge takes O(N^2) time compared to Union-Find O(N alpha(N)).' },
        { value: 'sort-wrong', label: 'Sorting edge numbers ignores structural connectivity.' },
      ],
      correctReasoning: 'same-set-cycle',

      starterTemplate: `// Write your implementation here...
function findRedundantConnection(edges) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if edges are dynamically added online, and we need to answer connectivity queries instantaneously?',
      question: 'Which data structure is optimal for online dynamic connectivity queries?',
      options: [
        'Disjoint Set Union (Union-Find) with Path Compression and Rank',
        'Rebuilding DFS traversal graph on every query',
        'Storing adjacency matrix in a 2D array',
      ],
      correctAnswer: 0,
      explanation: 'Union-Find processes incremental edge additions and answers connectivity queries in near O(1) time without re-traversing.',
    },
    hints: [
      'Hint 1: Initialize Union-Find parent array where parent[i] = i for i = 0..N-1 and count = N.',
      'Hint 2: Define find(i): if parent[i] !== i, parent[i] = find(parent[i]); return parent[i].',
      'Hint 3: Define union(i, j): rootI = find(i), rootJ = find(j). If rootI !== rootJ, parent[rootI] = rootJ and count--.',
      'Hint 4: For each edge [u, v], call union(u, v). Final component count is the value of count.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Number of Provinces',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/number-of-provinces/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice counting connected components in an adjacency matrix graph.',
      },
      {
        id: 'rec-2',
        title: 'Redundant Connection',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/redundant-connection/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Detect cycles and identify redundant graph edges using Union-Find.',
      },
    ],
    takeaway: 'You mastered graph connectivity analysis using DFS traversal and Disjoint Set Union (Union-Find).',
  },

  'kth-smallest-bst': {
    problemId: 'kth-smallest-bst',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Kth Smallest Element in a BST',
        patternName: 'Binary Search Tree Traversal',
        approachName: 'In-Order Traversal (Left-Node-Right)',
        summaryHint: 'Recall how in-order traversal yields BST nodes in strictly sorted ascending order.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why is In-Order traversal (Left -> Node -> Right) ideal for finding Kth smallest element in a BST?',
        options: [
          'In-order traversal visits BST node values in strictly sorted ascending order',
          'In-order traversal visits leaf nodes first',
          'In-order traversal processes nodes in level order',
          'In-order traversal runs in O(1) space always',
        ],
        correctAnswer: 0,
        explanation: 'Due to BST property (left < root < right), performing in-order traversal visits values in strictly increasing sorted order.',
      },
      {
        id: 'r2',
        question: 'How can in-order traversal be optimized to avoid traversing the entire tree when K is small?',
        options: [
          'Maintain a visited counter and stop traversal immediately when count reaches K',
          'Traverse only right subtrees',
          'Sort all node values after visiting',
          'Delete nodes as they are visited',
        ],
        correctAnswer: 0,
        explanation: 'The Kth visited node during in-order traversal is the Kth smallest element, so we can return immediately without visiting remaining nodes.',
      },
      {
        id: 'r3',
        question: 'What is the auxiliary space complexity of iterative stack-based BST in-order traversal?',
        options: [
          'O(H) where H is the height of the binary search tree',
          'O(N^2) quadratic space',
          'O(1) space always without Morris traversal',
          'O(N log N) space',
        ],
        correctAnswer: 0,
        explanation: 'The stack stores nodes along the current left branch path, consuming space proportional to tree height H (O(log N) for balanced, O(N) for skewed).',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Validate Binary Search Tree (Determine if a given binary tree is a valid BST).',
      inputVisual: 'Tree: [2, 1, 3] -> Left=1 < Root=2 < Right=3',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'BST In-Order Traversal / Strictly Increasing Property',
          pattern: 'Tree Order Verification',
          family: 'In-Order Traversal / Range Bounds Check',
          isCorrect: true,
        },
        {
          label: 'Heap Sorting / Priority Queue',
          pattern: 'Array Heapification',
          family: 'Priority Queue',
          isCorrect: false,
        },
        {
          label: 'Graph Shortest Path / BFS',
          pattern: 'Level Order',
          family: 'Breadth-First Search',
          isCorrect: false,
        },
        {
          label: 'Dynamic Programming / Grid Paths',
          pattern: 'Grid Transitions',
          family: '2D DP',
          isCorrect: false,
        },
      ],
      explanation: 'A tree is a valid BST if and only if its in-order traversal produces a strictly increasing sequence of values.',
    },
    guidedChallenge: {
      title: 'Guided Application: Validate Binary Search Tree',
      description: 'Given root of binary tree, determine if it is a valid BST (left child < node < right child for all subtrees).',
      inputVisual: 'Tree: root=5, left=1, right=4 (sub-children 3 and 6)',
      expectedOutput: 'false (right child 4 has left child 3 < root 5)',
      prompts: [
        {
          stepNo: '01',
          question: 'Why is comparing only immediate root with left/right children insufficient to validate a BST?',
          options: [
            'All nodes in the left subtree must be less than root, and all nodes in right subtree must be greater than root',
            'Subtrees can be empty',
            'Tree height can exceed 100',
          ],
          correctAnswer: 0,
          explanation: 'A BST constraint applies globally to all ancestors: e.g. right child subtree cannot contain any value smaller than root.',
        },
        {
          stepNo: '02',
          question: 'What range condition helper validate(node, minVal, maxVal) correctly enforces BST constraints recursively?',
          options: [
            'node.val > minVal && node.val < maxVal, then recurse left(minVal, node.val) and right(node.val, maxVal)',
            'node.val === minVal + maxVal',
            'node.left.val < node.right.val',
          ],
          correctAnswer: 0,
          explanation: 'Passing allowed (minVal, maxVal) bounds down the recursion tree ensures all descendant values satisfy global BST constraints.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Binary Search Tree Iterator',
      description: 'Implement the BSTIterator class that represents an in-order iterator over a BST. next() returns next smallest value, hasNext() checks if nodes remain.',
      inputVisual: 'BSTIterator iterator = new BSTIterator(root); iterator.next(); // returns 3',
      expectedOutput: 'next() in O(1) amortized time, O(H) memory',
      patternOptions: [
        { value: 'iterative-stack-inorder', label: 'Iterative Stack-based In-Order Traversal' },
        { value: 'array-flatten-full', label: 'Flatten tree to array in constructor' },
        { value: 'bfs-level-queue', label: 'BFS Queue Traversal' },
      ],
      correctPattern: 'iterative-stack-inorder',

      approachOptions: [
        { value: 'controlled-stack-push', label: 'Maintain stack; pushAllLeft(node) in constructor and after popping top element' },
        { value: 'flatten-constructor', label: 'Run full in-order traversal in constructor storing all N elements' },
        { value: 're-search-root', label: 'Re-traverse from root for every next() call' },
      ],
      correctApproach: 'controlled-stack-push',

      reasoningOptions: [
        { value: 'o-h-memory-guarantee', label: 'Controlled stack only holds left nodes along height H, meeting O(H) memory constraint while achieving O(1) amortized next().' },
        { value: 'flatten-o-n-memory', label: 'Flattening to array takes O(N) memory, violating O(H) requirement for large trees.' },
        { value: 're-search-slow', label: 'Re-searching root takes O(N) per call.' },
      ],
      correctReasoning: 'o-h-memory-guarantee',

      starterTemplate: `// Write your implementation here...
class BSTIterator {
  constructor(root) {
    // Your code here
  }
  next() {
    // Your code here
  }
  hasNext() {
    // Your code here
  }
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if the BST is modified frequently with inserts/deletes, and Kth smallest queries are called repeatedly?',
      question: 'How can tree nodes be augmented to support O(H) Kth smallest queries under frequent modifications?',
      options: [
        'Augment each node with a leftCount field (count of nodes in left subtree)',
        'Maintain a separate sorted array rebuilt after every edit',
        'Convert BST to a Singly Linked List',
      ],
      correctAnswer: 0,
      explanation: 'With leftCount stored at each node, we can binary search down the BST to find the Kth element in O(H) time without traversing.',
    },
    hints: [
      'Hint 1: Remember that in-order traversal of a BST yields elements in strictly increasing order.',
      'Hint 2: Use an iterative stack approach: initialize empty stack and curr = root.',
      'Hint 3: Push all left nodes: while (curr !== null) { stack.push(curr); curr = curr.left; }.',
      'Hint 4: Pop node: curr = stack.pop(), decrement k--. If k === 0 return curr.val. Set curr = curr.right.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Validate Binary Search Tree',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice BST in-order traversal and range validation.',
      },
      {
        id: 'rec-2',
        title: 'Binary Search Tree Iterator',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/binary-search-tree-iterator/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Build an O(H) space lazy in-order iterator using custom stack control.',
      },
    ],
    takeaway: 'You leveraged the ordered property of BST in-order traversals to solve positional and validation tree problems.',
  },

  'top-k-frequent': {
    problemId: 'top-k-frequent',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Top K Frequent Elements',
        patternName: 'Frequency Counting / Bucket Sort / Min-Heap',
        approachName: 'Hash Map + Bucket Sort (O(N) time)',
        summaryHint: 'Recall grouping numbers into frequency buckets of size 1 to N.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the optimal time complexity achievable for Top K Frequent Elements using Bucket Sort?',
        options: ['O(N) linear time', 'O(N log N)', 'O(N^2) quadratic time', 'O(K log N)'],
        correctAnswer: 0,
        explanation: 'By using an array of buckets where index i holds elements with frequency i, we avoid sorting and achieve O(N) time.',
      },
      {
        id: 'r2',
        question: 'When using a Min-Heap of size K for frequency tracking, what is the time complexity?',
        options: ['O(N log K)', 'O(N^2)', 'O(N log N)', 'O(1)'],
        correctAnswer: 0,
        explanation: 'Inserting N elements into a Min-Heap capped at size K takes log(K) per insertion, yielding O(N log K) overall time.',
      },
      {
        id: 'r3',
        question: 'What does bucket[i] represent in the Bucket Sort frequency algorithm?',
        options: [
          'A list of all input numbers that appear with frequency exactly equal to i',
          'The first i elements of the sorted array',
          'Elements smaller than value i',
          'The top i most frequent elements',
        ],
        correctAnswer: 0,
        explanation: 'Bucket at index i stores a list of unique numbers from the input that appeared exactly i times.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Sort Characters By Frequency (Given a string s, sort it in decreasing order based on the frequency of the characters).',
      inputVisual: 's = "tree" -> Frequency: e:2, t:1, r:1',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Frequency Mapping / Bucket Sort / Heap',
          pattern: 'Frequency Distribution Ranking',
          family: 'Bucket Sort / Priority Queue',
          isCorrect: true,
        },
        {
          label: 'Two Pointers / Opposite Traversal',
          pattern: 'Array Shrinking',
          family: 'Two Pointers',
          isCorrect: false,
        },
        {
          label: 'Dynamic Programming / Grid Paths',
          pattern: 'State Transitions',
          family: '2D DP',
          isCorrect: false,
        },
        {
          label: 'Binary Search / Range Halving',
          pattern: 'Search Space Reduction',
          family: 'Binary Search',
          isCorrect: false,
        },
      ],
      explanation: 'Sorting characters by frequency requires building a frequency map first and then bucket-sorting or heap-sorting characters by count.',
    },
    guidedChallenge: {
      title: 'Guided Application: Sort Characters By Frequency',
      description: 'Given s = "tree", return sorted string ordered by frequency ("eert" or "eetr").',
      inputVisual: 's = "tree"',
      expectedOutput: '"eert"',
      prompts: [
        {
          stepNo: '01',
          question: 'What is the maximum possible frequency of any single character in string s of length N?',
          options: [
            'N (if all characters in s are identical)',
            '26 (alphabet size)',
            'N / 2',
          ],
          correctAnswer: 0,
          explanation: 'If string s consists of a single repeated character, its frequency is N.',
        },
        {
          stepNo: '02',
          question: 'After building buckets array of size N+1, how do we construct the result string?',
          options: [
            'Iterate buckets from index N down to 1, repeating each character freq times in result',
            'Iterate buckets from 1 to N',
            'Sort characters alphabetically',
          ],
          correctAnswer: 0,
          explanation: 'Iterating buckets in descending frequency order ensures highest frequency characters are appended first.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Top K Frequent Words',
      description: 'Given an array of strings words and an integer k, return the k most frequent strings. Sort words with same frequency by alphabetical order.',
      inputVisual: 'words = ["i","love","leetcode","i","love","coding"], k = 2',
      expectedOutput: '["i", "love"]',
      patternOptions: [
        { value: 'freq-map-min-heap-custom', label: 'Frequency Map + Custom Comparator Min-Heap' },
        { value: 'brute-force-all-pairs', label: 'Brute Force Pairwise Comparisons' },
        { value: 'trie-alphabet-sort', label: 'Trie Lexicographical Traversal' },
      ],
      correctPattern: 'freq-map-min-heap-custom',

      approachOptions: [
        { value: 'min-heap-size-k-comparator', label: 'Min-Heap of size K: higher frequency wins; for equal frequency, lower alphabetical word wins (so higher alphabetical gets evicted)' },
        { value: 'bucket-sort-only', label: 'Bucket sort with standard string sort per bucket' },
        { value: 'radix-sort-words', label: 'Radix sort on word lengths' },
      ],
      correctApproach: 'min-heap-size-k-comparator',

      reasoningOptions: [
        { value: 'custom-comparator-heap', label: 'Custom heap comparator handles multi-criteria ordering (frequency descending, tie-break alphabetical ascending) in O(N log K) time.' },
        { value: 'bucket-sort-complex', label: 'Bucket sort still requires sorting strings inside each bucket.' },
        { value: 'radix-ignores-freq', label: 'Radix sort operates on string length rather than frequency.' },
      ],
      correctReasoning: 'custom-comparator-heap',

      starterTemplate: `// Write your implementation here...
function topKFrequent(words, k) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if numbers arrive in a continuous real-time stream (Streaming Top K)?',
      question: 'Which data structure maintains top K elements dynamically during a stream?',
      options: [
        'A Min-Heap of size K combined with a HashMap for stream counts',
        'Re-sorting a dynamic array on every incoming number',
        'A fixed-size array of size 100',
      ],
      correctAnswer: 0,
      explanation: 'Maintaining a HashMap of counts + Min-Heap capped at size K updates stream frequencies in O(log K) per incoming element.',
    },
    hints: [
      'Hint 1: Build a frequency map by iterating through input array.',
      'Hint 2: Create a bucket array of empty arrays buckets of length nums.length + 1.',
      'Hint 3: For each [num, freq] in frequency map, push num to buckets[freq].',
      'Hint 4: Iterate buckets backwards from nums.length down to 1. Collect numbers into result until result.length === k.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Sort Characters By Frequency',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/sort-characters-by-frequency/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice bucket sorting based on frequency distribution.',
      },
      {
        id: 'rec-2',
        title: 'Top K Frequent Words',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/top-k-frequent-words/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply Min-Heap with multi-criteria tie-breaking for frequency ranking.',
      },
    ],
    takeaway: 'You applied frequency mapping, bucket sorting, and min-heaps to rank and filter frequency distributions.',
  },

  'product-except-self': {
    problemId: 'product-except-self',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Product of Array Except Self',
        patternName: 'Prefix & Suffix Accumulation',
        approachName: 'Two-Pass Prefix-Suffix Arrays (O(N) time, O(1) extra space)',
        summaryHint: 'Recall prefix product pass (left to right) followed by suffix product pass (right to left).',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why is division disallowed in Product of Array Except Self?',
        options: [
          'Division fails when input contains one or more zeros (division by zero)',
          'Division requires O(N^2) execution time',
          'Division alters floating point precision',
          'Division requires auxiliary stack memory',
        ],
        correctAnswer: 0,
        explanation: 'Division cannot handle arrays containing 0 values and violates the problem constraint requiring a division-free algorithm.',
      },
      {
        id: 'r2',
        question: 'What does prefix[i] store before the suffix multiplication pass?',
        options: [
          'The product of all elements strictly to the left of index i (nums[0] * ... * nums[i-1])',
          'The product of all elements to the right of index i',
          'The sum of all elements up to i',
          'The cumulative max element',
        ],
        correctAnswer: 0,
        explanation: 'The prefix pass accumulates products from left to right, storing product of elements 0..i-1 in result[i].',
      },
      {
        id: 'r3',
        question: 'How do we achieve O(1) auxiliary space complexity for this problem?',
        options: [
          'Reuse the output array for prefix products and maintain a single running scalar variable for suffix product',
          'Modify the input array nums in-place',
          'Use bitwise XOR operations',
          'Use two stacks',
        ],
        correctAnswer: 0,
        explanation: 'Writing prefix products directly into output array res and multiplying by a running scalar suffix right-to-left takes O(1) auxiliary space.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Find Pivot Index (Find index where sum of elements to the left equals sum of elements to the right).',
      inputVisual: 'nums = [1, 7, 3, 6, 5, 6] -> Left sum at index 3 = 1+7+3 = 11, Right sum = 5+6 = 11',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Prefix & Suffix Cumulative Accumulation',
          pattern: 'Array Partitioning Sums',
          family: 'Prefix Sum / Total Sum Accumulation',
          isCorrect: true,
        },
        {
          label: 'Binary Search Tree Traversal',
          pattern: 'Tree Bounds',
          family: 'In-Order Traversal',
          isCorrect: false,
        },
        {
          label: '2D Grid Backtracking DFS',
          pattern: 'Grid Search',
          family: 'Backtracking',
          isCorrect: false,
        },
        {
          label: 'Sliding Window Deque',
          pattern: 'Monotonic Queue',
          family: 'Deque',
          isCorrect: false,
        },
      ],
      explanation: 'Pivot index comparison uses total array sum minus left sum to derive right sum in O(N) time.',
    },
    guidedChallenge: {
      title: 'Guided Application: Find Pivot Index',
      description: 'Given nums = [1, 7, 3, 6, 5, 6], find the leftmost pivot index.',
      inputVisual: 'nums = [1, 7, 3, 6, 5, 6]',
      expectedOutput: '3',
      prompts: [
        {
          stepNo: '01',
          question: 'How can rightSum at index i be derived without building a separate suffix array?',
          options: [
            'rightSum = totalSum - leftSum - nums[i]',
            'rightSum = totalSum / 2',
            'rightSum = leftSum * nums[i]',
          ],
          correctAnswer: 0,
          explanation: 'Since totalSum = leftSum + nums[i] + rightSum, subtracting leftSum and nums[i] gives rightSum.',
        },
        {
          stepNo: '02',
          question: 'What is the matching condition at index i to identify a valid pivot index?',
          options: [
            'if (leftSum === totalSum - leftSum - nums[i]) return i;',
            'if (leftSum === nums[i]) return i;',
            'if (leftSum === 0) return i;',
          ],
          correctAnswer: 0,
          explanation: 'When leftSum equals rightSum (totalSum - leftSum - nums[i]), index i is the pivot index.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Continuous Subarray Sum',
      description: 'Given an integer array nums and an integer k, return true if nums has a good subarray of length >= 2 whose sum is a multiple of k.',
      inputVisual: 'nums = [23, 2, 4, 6, 7], k = 6 -> Subarray [2, 4] sum = 6 (multiple of 6)',
      expectedOutput: 'true',
      patternOptions: [
        { value: 'prefix-sum-modulo-map', label: 'Prefix Sum + Hash Map (Remainder Modulo k)' },
        { value: 'sliding-window-variable', label: 'Variable Size Sliding Window' },
        { value: 'brute-force-all-subarrays', label: 'Brute Force All Subarrays O(N^2)' },
      ],
      correctPattern: 'prefix-sum-modulo-map',

      approachOptions: [
        { value: 'track-remainder-index-map', label: 'Track running (prefixSum % k) in HashMap storing first seen index. If same remainder seen at index > prevIndex+1, return true.' },
        { value: 'two-pointers-window', label: 'Expand window right and shrink left' },
        { value: 'sort-elements', label: 'Sort array elements' },
      ],
      correctApproach: 'track-remainder-index-map',

      reasoningOptions: [
        { value: 'modulo-difference-property', label: 'If two prefix sums have the same remainder modulo k, the sum of elements between them is a multiple of k.' },
        { value: 'window-fails-negatives', label: 'Sliding window fails because elements can produce non-monotonic sums modulo k.' },
        { value: 'sort-destroys-order', label: 'Sorting destroys contiguous subarray structure.' },
      ],
      correctReasoning: 'modulo-difference-property',

      starterTemplate: `// Write your implementation here...
function checkSubarraySum(nums, k) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if array elements are updated dynamically and product queries are requested repeatedly?',
      question: 'Which data structure maintains dynamic prefix product queries with updates?',
      options: [
        'Segment Tree or Fenwick Tree (Binary Indexed Tree) using multiplication',
        'Rebuilding prefix array from scratch on every query',
        'A Singly Linked List',
      ],
      correctAnswer: 0,
      explanation: 'Segment Trees support point updates and range product queries in O(log N) time.',
    },
    hints: [
      'Hint 1: Initialize output array res of size N with res[0] = 1.',
      'Hint 2: First pass (left to right): compute res[i] = res[i-1] * nums[i-1] for i = 1..N-1.',
      'Hint 3: Second pass (right to left): maintain scalar suffix = 1. For i = N-1 down to 0, res[i] *= suffix; suffix *= nums[i];.',
      'Hint 4: Return res. All multiplications are division-free and execute in O(N) time.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Find Pivot Index',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/find-pivot-index/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice prefix sum and right sum comparison.',
      },
      {
        id: 'rec-2',
        title: 'Continuous Subarray Sum',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/continuous-subarray-sum/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Apply prefix sum modulo properties with HashMap index tracking.',
      },
    ],
    takeaway: 'You mastered left-to-right and right-to-left prefix/suffix cumulative transformations without division.',
  },

  'single-number': {
    problemId: 'single-number',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Single Number',
        patternName: 'Bit Manipulation / XOR Properties',
        approachName: 'Bitwise XOR Accumulation (O(N) time, O(1) space)',
        summaryHint: 'Recall A ^ A = 0 and A ^ 0 = A properties cancel out paired duplicates.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'What is the fundamental result of Bitwise XORing a number with itself (X ^ X)?',
        options: ['0', 'X', '1', '2 * X'],
        correctAnswer: 0,
        explanation: 'Bitwise XOR of identical bit patterns produces 0 for every bit position (X ^ X = 0).',
      },
      {
        id: 'r2',
        question: 'Why does Bitwise XOR eliminate all duplicate numbers regardless of array order?',
        options: [
          'XOR is commutative (A ^ B = B ^ A) and associative (A ^ (B ^ C) = (A ^ B) ^ C)',
          'XOR sorts the array automatically',
          'XOR converts negative numbers to positive',
          'XOR executes in logarithmic time',
        ],
        correctAnswer: 0,
        explanation: 'Due to commutative and associative properties, pairs cancel out into 0s regardless of sequence, leaving only the single number.',
      },
      {
        id: 'r3',
        question: 'What is the auxiliary space complexity of the XOR single number solution?',
        options: [
          'O(1) constant space',
          'O(N) space for hash set',
          'O(log N) stack space',
          'O(N^2) space',
        ],
        correctAnswer: 0,
        explanation: 'XOR accumulation requires only a single scalar variable accumulator initialized to 0.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Single Number II (Every element appears 3 times except for one element which appears exactly once).',
      inputVisual: 'nums = [2, 2, 3, 2]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: 'Bit Manipulation / Bitwise State Machine',
          pattern: 'Bit Count Modulo 3',
          family: 'Bitwise State Machine (ones, twos)',
          isCorrect: true,
        },
        {
          label: 'Graph BFS / Level Order',
          pattern: 'Queue Traversal',
          family: 'Breadth-First Search',
          isCorrect: false,
        },
        {
          label: 'Two Pointers / Array Partitioning',
          pattern: 'Array Shrinking',
          family: 'Two Pointers',
          isCorrect: false,
        },
        {
          label: 'Dynamic Programming / Grid Paths',
          pattern: 'Grid Transitions',
          family: '2D DP',
          isCorrect: false,
        },
      ],
      explanation: 'When elements appear 3 times, simple XOR cancels pairs but not triplets. We track bit counts modulo 3 using a 2-bit state machine (ones, twos).',
    },
    guidedChallenge: {
      title: 'Guided Application: Single Number II (3-Appearance Variant)',
      description: 'Given nums = [2, 2, 3, 2], find the single number appearing once.',
      inputVisual: 'nums = [2, 2, 3, 2]',
      expectedOutput: '3',
      prompts: [
        {
          stepNo: '01',
          question: "If we sum bit counts at position b across all numbers in nums, what remainder modulo 3 corresponds to the single number's bit?",
          options: [
            'sum % 3 === 1 (since 3-time elements contribute multiples of 3)',
            'sum % 3 === 0',
            'sum % 3 === 2',
          ],
          correctAnswer: 0,
          explanation: "Elements appearing 3 times contribute 3 to bit sum (3 % 3 = 0), leaving only the single element's bit (1 % 3 = 1).",
        },
        {
          stepNo: '02',
          question: 'How do bitwise accumulators ones and twos update when processing number num?',
          options: [
            'ones = (ones ^ num) & ~twos; twos = (twos ^ num) & ~ones;',
            'ones = ones + num; twos = twos + num;',
            'ones = ones & num; twos = twos | num;',
          ],
          correctAnswer: 0,
          explanation: 'This state machine transition resets a bit to 0 when it appears 3 times, leaving the single element in ones.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Single Number III (Two Single Numbers)',
      description: 'Given an integer array nums, in which exactly two elements appear only once and all other elements appear exactly twice. Find the two elements.',
      inputVisual: 'nums = [1, 2, 1, 3, 2, 5] -> Single numbers: 3 and 5',
      expectedOutput: '[3, 5]',
      patternOptions: [
        { value: 'xor-diff-bit-partition', label: 'XOR Accumulation + Differentiating Bit Partitioning' },
        { value: 'hash-set-count', label: 'Hash Set Counting O(N) space' },
        { value: 'sorting-adjacent-check', label: 'Sorting + Adjacent Check O(N log N)' },
      ],
      correctPattern: 'xor-diff-bit-partition',

      approachOptions: [
        { value: 'find-diff-bit-split-xor', label: 'Compute total XOR (a ^ b). Find lowest set bit diffBit = xor & -xor. Partition array into two groups by diffBit and XOR each group separately.' },
        { value: 'hash-map-freq', label: 'Store frequencies in HashMap' },
        { value: 'binary-search-val-range', label: 'Binary search on integer range' },
      ],
      correctApproach: 'find-diff-bit-split-xor',

      reasoningOptions: [
        { value: 'diff-bit-separates-a-b', label: 'Since a != b, total XOR has at least one set bit (diffBit). Partitioning numbers by diffBit places a and b into separate groups.' },
        { value: 'hash-uses-extra-memory', label: 'HashMap uses O(N) extra space.' },
        { value: 'binary-search-invalid', label: 'Binary search cannot partition arbitrary un-sorted integers.' },
      ],
      correctReasoning: 'diff-bit-separates-a-b',

      starterTemplate: `// Write your implementation here...
function singleNumber(nums) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if array elements appear K times except one which appears L times (L < K)?',
      question: 'How does bitwise counting generalize for arbitrary K appearances?',
      options: [
        'Count bits across 32 bit positions and take (count % K)',
        'Multiply all numbers together',
        'Sort numbers and divide by K',
      ],
      correctAnswer: 0,
      explanation: 'Summing bits at each position 0..31 across all numbers and computing bitSum[b] % K reconstructs the L-appearance number.',
    },
    hints: [
      'Hint 1: Recall XOR properties: x ^ x = 0, x ^ 0 = x.',
      'Hint 2: Initialize let xorSum = 0.',
      'Hint 3: Loop through array and accumulate xorSum ^= num.',
      'Hint 4: Return xorSum. Duplicate pairs cancel out automatically in O(N) time and O(1) space.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Single Number II',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/single-number-ii/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Practice bitwise state machine for 3-appearance elements.',
      },
      {
        id: 'rec-2',
        title: 'Single Number III',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Medium',
        url: 'https://leetcode.com/problems/single-number-iii/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Partition array into two groups using XOR differentiating bit.',
      },
    ],
    takeaway: 'You applied algebraic bitwise XOR properties to isolate non-repeating elements in O(1) space.',
  },

  'word-search': {
    problemId: 'word-search',
    intro: {
      eyebrow: '11 · PRACTICE',
      title: 'Now solve without the walkthrough.',
      subtitle: "You've worked through the problem from understanding to execution. Now apply the same reasoning yourself.",
      context: {
        problemTitle: 'Word Search',
        patternName: '2D Grid Backtracking / DFS Traversal',
        approachName: 'Recursive DFS with Grid Cell In-Place Marking',
        summaryHint: 'Recall marking visited cells with "#" during recursion and restoring them afterwards.',
      },
    },
    recall: [
      {
        id: 'r1',
        question: 'Why must visited grid cells be temporarily altered (e.g. board[r][c] = "#") during DFS recursion?',
        options: [
          'To prevent reusing the same grid cell twice within a single word path',
          'To permanently delete characters from the board',
          'To speed up string concatenation',
          'To count total board cells',
        ],
        correctAnswer: 0,
        explanation: 'In-place cell marking prevents DFS from looping back onto cells already used in the current word match path.',
      },
      {
        id: 'r2',
        question: 'What critical backtracking action must be taken when a recursive DFS branch fails?',
        options: [
          'Restore original character: board[r][c] = originalChar',
          'Leave cell as "#"',
          'Clear the board array',
          'Return true immediately',
        ],
        correctAnswer: 0,
        explanation: 'Backtracking requires un-marking the cell (board[r][c] = temp) so subsequent search paths originating from other cells can visit it.',
      },
      {
        id: 'r3',
        question: 'What is the base success condition in Word Search DFS recursion?',
        options: [
          'index === word.length (meaning all characters in word have been matched)',
          'board cell character is "#"',
          'r === board.length - 1 && c === board[0].length - 1',
          'index === 0',
        ],
        correctAnswer: 0,
        explanation: 'When index reaches word.length, every character in the target word has been successfully matched in sequence.',
      },
    ],
    patternCheck: {
      prompt: 'New Problem: Word Search II (Given an m x n board of characters and a list of strings words, return all words on the board).',
      inputVisual: 'board = [["o","a","a","n"],["e","t","a","e"]], words = ["oath","pea","eat","rain"]',
      question: 'What structural pattern and solution family does this problem belong to?',
      options: [
        {
          label: '2D Grid Backtracking DFS + Trie (Prefix Tree)',
          pattern: 'Multi-Word Prefix Search',
          family: 'Grid DFS + Trie Data Structure',
          isCorrect: true,
        },
        {
          label: 'Breadth-First Search / Shortest Path',
          pattern: 'Level Order',
          family: 'BFS Queue',
          isCorrect: false,
        },
        {
          label: 'Dynamic Programming / Grid Transitions',
          pattern: 'Grid Path Counts',
          family: '2D DP',
          isCorrect: false,
        },
        {
          label: 'Disjoint Set Union / Component Count',
          pattern: 'Equivalence Relations',
          family: 'Union-Find',
          isCorrect: false,
        },
      ],
      explanation: 'Searching for multiple words simultaneously in a 2D grid requires a Trie to prune DFS search branches as soon as a cell prefix is not in any word.',
    },
    guidedChallenge: {
      title: 'Guided Application: Word Search II (Trie Integration)',
      description: 'Given board and word list ["oath", "pea", "eat"], efficiently find all matching words.',
      inputVisual: 'board 4x4, words = ["oath", "pea", "eat"]',
      expectedOutput: '["oath", "eat"]',
      prompts: [
        {
          stepNo: '01',
          question: 'Why is running standard Word Search DFS independently for each word inefficient when word list is large?',
          options: [
            'It re-traverses identical grid prefix paths multiple times for different words sharing prefixes',
            'DFS does not support strings longer than 5',
            'Grid size increases exponentially',
          ],
          correctAnswer: 0,
          explanation: 'Running separate DFS per word repeats grid explorations. A Trie combines shared prefixes into single DFS paths.',
        },
        {
          stepNo: '02',
          question: 'How does Trie node pruning prevent unnecessary DFS steps?',
          options: [
            'If current board cell character does not exist as a child in Trie node, terminate DFS branch immediately',
            'Delete board cells with vowels',
            'Limit DFS depth to 3',
          ],
          correctAnswer: 0,
          explanation: 'If node.children[char] is null, no target word starts with this prefix, so DFS prunes the branch instantly.',
        },
      ],
    },
    independentChallenge: {
      title: 'Independent Challenge: Flood Fill',
      description: 'An image is represented by an m x n grid. Given starting pixel (sr, sc) and new color, perform a flood fill to change all connected same-color pixels.',
      inputVisual: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2',
      expectedOutput: '[[2,2,2],[2,2,0],[2,0,1]]',
      patternOptions: [
        { value: 'grid-dfs-bfs-flood-fill', label: '2D Grid Connected Component DFS/BFS' },
        { value: 'trie-prefix-traversal', label: 'Trie Tree Search' },
        { value: 'monotonic-stack-grid', label: 'Monotonic Stack Grid' },
      ],
      correctPattern: 'grid-dfs-bfs-flood-fill',

      approachOptions: [
        { value: 'dfs-recursive-fill', label: 'If starting color !== newColor, run recursive DFS from (sr, sc). Change image[r][c] = newColor and recurse in 4 directions.' },
        { value: 'sort-grid-pixels', label: 'Sort grid matrix by row' },
        { value: 'binary-search-color', label: 'Binary search for color' },
      ],
      correctApproach: 'dfs-recursive-fill',

      reasoningOptions: [
        { value: 'connected-color-change', label: 'DFS visits all 4-directionally connected pixels with initial color and recolors them, completing flood fill in O(M*N) time.' },
        { value: 'sort-ruins-grid', label: 'Sorting destroys grid spatial layout.' },
        { value: 'binary-search-wrong', label: 'Binary search cannot find connected spatial regions.' },
      ],
      correctReasoning: 'connected-color-change',

      starterTemplate: `// Write your implementation here...
function floodFill(image, sr, sc, color) {
  // Your code here
}`,
    },
    variationChallenge: {
      title: 'Constraint Variation Challenge',
      changedConstraint: 'Constraint Change: What if words can be formed by wrapping around grid boundaries (Toroidal Grid)?',
      question: 'How do boundary check conditions change for toroidal grid wrapping?',
      options: [
        'Use modulo arithmetic for neighbor coordinates: r = (r + dr + M) % M, c = (c + dc + N) % N',
        'Return false if boundary is hit',
        'Double grid size M x N',
      ],
      correctAnswer: 0,
      explanation: 'Modulo arithmetic wraps out-of-bounds row/col indices to opposite grid edges seamlessly.',
    },
    hints: [
      'Hint 1: Iterate all grid cells (r, c). If board[r][c] === word[0], launch dfs(r, c, 0).',
      'Hint 2: In DFS: check boundary r < 0 || r >= M || c < 0 || c >= N || board[r][c] !== word[idx] -> return false.',
      'Hint 3: Save const temp = board[r][c], mark board[r][c] = "#".',
      'Hint 4: Recurse 4 directions dfs(r+1, c, idx+1) || dfs(r-1, c, idx+1) || dfs(r, c+1, idx+1) || dfs(r, c-1, idx+1). Un-mark board[r][c] = temp before returning.',
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Word Search II',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Hard',
        url: 'https://leetcode.com/problems/word-search-ii/',
        relationship: 'same-pattern',
        relationshipLabel: 'SAME PATTERN',
        reason: 'Combine 2D Grid Backtracking DFS with Trie data structure.',
      },
      {
        id: 'rec-2',
        title: 'Flood Fill',
        platform: { id: 'leetcode', name: 'LeetCode' },
        difficulty: 'Easy',
        url: 'https://leetcode.com/problems/flood-fill/',
        relationship: 'pattern-extension',
        relationshipLabel: 'PATTERN EXTENSION',
        reason: 'Practice 4-directional grid traversal for connected region recoloring.',
      },
    ],
    takeaway: 'You mastered 2D spatial backtracking DFS with temporary state mutations and un-marking.',
  },
};

export function getPracticeByProblemId(problemId) {
  if (!problemId) return MOCK_PRACTICES['reverse-linked-list'];
  
  if (MOCK_PRACTICES[problemId]) {
    return MOCK_PRACTICES[problemId];
  }


  const aliasMap = {
    'binary-tree-inorder': 'binary-tree-inorder',
    'binary-tree-inorder-traversal': 'binary-tree-inorder',
    'kth-largest-element': 'kth-largest-element',
    'kth-largest-element-in-an-array': 'kth-largest-element',
    'longest-substring-no-repeat': 'longest-substring-no-repeat',
    'longest-substring-without-repeating-characters': 'longest-substring-no-repeat',
    'shortest-path-graph': 'shortest-path-graph',
    'shortest-path-in-unweighted-graph': 'shortest-path-graph',
    'climbing-stairs': 'climbing-stairs',
    'house-robber': 'house-robber',
    'subsets': 'subsets',
    'course-schedule': 'course-schedule',
    'connected-components': 'connected-components',
    'number-of-connected-components-in-an-undirected-graph': 'connected-components',
    'kth-smallest-bst': 'kth-smallest-bst',
    'kth-smallest-element-in-a-bst': 'kth-smallest-bst',
    'top-k-frequent': 'top-k-frequent',
    'top-k-frequent-elements': 'top-k-frequent',
    'product-except-self': 'product-except-self',
    'product-of-array-except-self': 'product-except-self',
    'single-number': 'single-number',
    'word-search': 'word-search',
  };


  const targetKey = aliasMap[problemId];
  if (targetKey && MOCK_PRACTICES[targetKey]) {
    return MOCK_PRACTICES[targetKey];
  }

  return MOCK_PRACTICES['reverse-linked-list'];
}

export default MOCK_PRACTICES;
