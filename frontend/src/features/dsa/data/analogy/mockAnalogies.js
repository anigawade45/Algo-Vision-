import { twoSumAnalogy } from './twoSumAnalogy.js';

/**
 * Mock Analogy Database — ALL 20 DSA Problems
 * Each problem has a `stepVisualizer` with problem-specific interactive steps.
 */
export const MOCK_ANALOGIES = {

  /* ─────────────────────────────────────── 1. TWO SUM ── */
  'two-sum': {
    ...twoSumAnalogy,
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Two people scan a price list from opposite ends to find two items that hit an exact budget.',
    },
    scenario: {
      title: 'Budget Shopping: find two items that cost exactly ₹9 together.',
      context: 'Prices: [₹2, ₹7, ₹11, ₹15]. You need exactly ₹9. Which pair adds up?',
      question: 'Select the two items whose prices sum to ₹9.',
      target: { label: 'TARGET BUDGET', unit: '₹', value: 9, display: '₹9' },
      items: [
        { id: 'item_1', label: 'Item A', priceDisplay: '₹2', value: 2, arrayIndex: 0 },
        { id: 'item_2', label: 'Item B', priceDisplay: '₹7', value: 7, arrayIndex: 1 },
        { id: 'item_3', label: 'Item C', priceDisplay: '₹11', value: 11, arrayIndex: 2 },
        { id: 'item_4', label: 'Item D', priceDisplay: '₹15', value: 15, arrayIndex: 3 },
      ],
    },
    stepVisualizer: {
      title: 'Hash Map Lookup: Check the complement for each price',
      description: 'For each item, ask: "Does its complement (target − price) already exist in my seen list?" This is O(1) lookup.',
      steps: [
        {
          type: 'array', label: 'Start',
          array: [2, 7, 11, 15], highlight: [],
          explanation: 'Array: [2, 7, 11, 15]. Target = 9. We scan left to right.',
        },
        {
          type: 'array', label: 'Check 2',
          array: [2, 7, 11, 15], highlight: [0],
          explanation: 'nums[0] = 2. Complement = 9 − 2 = 7. Is 7 in our map? No. Store {2 → index 0}.',
        },
        {
          type: 'array', label: 'Check 7 → Found!',
          array: [2, 7, 11, 15], highlight: [0, 1],
          explanation: 'nums[1] = 7. Complement = 9 − 7 = 2. Is 2 in our map? YES → index 0! Answer: [0, 1] ✓',
        },
      ],
      mapping: [
        { realWorld: 'Item price', dsa: 'Array element', example: '₹2 → nums[0] = 2' },
        { realWorld: 'Budget', dsa: 'Target', example: '₹9 → target = 9' },
        { realWorld: '"Have I seen the complement?"', dsa: 'HashMap lookup', example: 'map[7] → index 0' },
        { realWorld: 'Two matching items', dsa: 'Answer indices', example: '[0, 1]' },
      ],
    },
  },

  /* ─────────────────────────────────────── 2. VALID PARENTHESES ── */
  'valid-parentheses': {
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Nesting gift boxes: every opened box must be closed by its matching lid before the outer box closes.',
    },
    scenario: {
      title: 'Russian Matryoshka boxes — every lid must match its box.',
      context: 'String: "([{}])". You open (, then [, then {. The innermost box must close first: }, then ], then ).',
      question: 'Select an opening box and its exact matching lid.',
      target: { label: 'VALID PAIR', unit: '', value: 'LIFO Pair', display: 'VALID PAIR (true)' },
      items: [
        { id: 'item_1', label: 'Outer Box', priceDisplay: '(', value: '(', arrayIndex: 0 },
        { id: 'item_2', label: 'Middle Box', priceDisplay: '[', value: '[', arrayIndex: 1 },
        { id: 'item_3', label: 'Inner Box', priceDisplay: '{', value: '{', arrayIndex: 2 },
        { id: 'item_4', label: 'Inner Lid', priceDisplay: '}', value: '}', arrayIndex: 3 },
        { id: 'item_5', label: 'Middle Lid', priceDisplay: ']', value: ']', arrayIndex: 4 },
        { id: 'item_6', label: 'Outer Lid', priceDisplay: ')', value: ')', arrayIndex: 5 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Matching Pair',
      correctPairIds: ['item_3', 'item_4'],
      validPairs: [['item_3','item_4'],['item_2','item_5'],['item_1','item_6']],
      successMessage: 'You matched { with } — the innermost open bracket closes first!',
      bridgeMessage: 'That is exactly how the Stack enforces LIFO order for Valid Parentheses.',
      hint: 'Select an opening bracket and its matching closing bracket.',
    },
    stepVisualizer: {
      title: 'Stack simulation: process "([{}])"',
      description: 'Push opening brackets. When a closing bracket appears, pop the top and verify it matches.',
      steps: [
        { type: 'stack', label: 'Read (', stack: ['('], op: 'push', operand: '(',
          explanation: 'See "(": it is an opener → push onto stack. Stack: [(]' },
        { type: 'stack', label: 'Read [', stack: ['(', '['], op: 'push', operand: '[',
          explanation: 'See "[": opener → push. Stack: [(, []' },
        { type: 'stack', label: 'Read {', stack: ['(', '[', '{'], op: 'push', operand: '{',
          explanation: 'See "{": opener → push. Stack: [(, [, {]' },
        { type: 'stack', label: 'Read } → match!', stack: ['(', '['], op: 'pop', operand: '{',
          explanation: 'See "}": closer → pop top "{". They match! ✓ Stack: [(, []' },
        { type: 'stack', label: 'Read ] → match!', stack: ['('], op: 'pop', operand: '[',
          explanation: 'See "]": closer → pop top "[". Match! ✓ Stack: [()]' },
        { type: 'stack', label: 'Read ) → match!', stack: [], op: 'pop', operand: '(',
          explanation: 'See ")": closer → pop top "(". Match! ✓ Stack empty → VALID ✓' },
      ],
      mapping: [
        { realWorld: 'Opening a box', dsa: 'Push to stack', example: '( → stack.push("(")' },
        { realWorld: 'Closing a box', dsa: 'Pop & compare', example: ') → pop "(", check match' },
        { realWorld: 'Innermost box closes first', dsa: 'LIFO order', example: 'Last in = First out' },
        { realWorld: 'All boxes closed', dsa: 'Stack is empty', example: 'stack.length === 0 → true' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INPUT STRING (s)', arrayValues: ['(', '[', '{', '}', ']', ')'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 'true',
      question: 'Verify that brackets close in exact nested order.',
      formulaRealWorld: 'Inner Box "{" + Lid "}" = Sealed', formulaDSA: 'push/pop → stack empty = valid',
      matchingIndices: [2, 3],
    },
    takeaway: {
      headline: 'Last opened must be first closed — that is LIFO.',
      realWorldSummary: 'Innermost box lid seals first → all boxes can close',
      dsaSummary: 'Stack LIFO order ensures correct bracket nesting',
      finalNote: 'Every valid parentheses sequence is just correct nesting — a stack enforces that naturally.',
    },
  },

  /* ─────────────────────────────────────── 3. REVERSE LINKED LIST ── */
  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    problemTitle: 'Reverse Linked List',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'A train flipping its direction: every coupling between carriages is re-linked in reverse.',
    },
    scenario: {
      title: 'Train reversal: flip every coupling so Carriage 5 becomes the new engine.',
      context: 'Carriages: 1→2→3→4→5. You must re-link so 5→4→3→2→1. Only one coupling at a time.',
      question: 'Select Carriage 5 and then Carriage 4 to reverse the first pointer.',
      target: { label: 'NEW ENGINE', unit: '', value: 5, display: 'Node 5 (HEAD)' },
      items: [
        { id: 'item_1', label: 'Carriage 1', priceDisplay: '1→', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Carriage 2', priceDisplay: '2→', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Carriage 3', priceDisplay: '3→', value: 3, arrayIndex: 2 },
        { id: 'item_4', label: 'Carriage 4', priceDisplay: '4→', value: 4, arrayIndex: 3 },
        { id: 'item_5', label: 'Carriage 5', priceDisplay: '5', value: 5, arrayIndex: 4 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Reverse Coupling',
      correctPairIds: ['item_5', 'item_4'],
      validPairs: [['item_5','item_4'],['item_4','item_3'],['item_3','item_2'],['item_2','item_1']],
      successMessage: 'You reversed the coupling: 5 → 4. Keep going until 5→4→3→2→1.',
      bridgeMessage: 'That is exactly how reversing a linked list redirects next pointers one at a time.',
      hint: 'Select Carriage 5 first, then Carriage 4 to flip the coupling direction.',
    },
    stepVisualizer: {
      title: 'Three-pointer reversal: prev, curr, next',
      description: 'We use three variables: prev (null), curr (head), next. Each step flips one pointer.',
      steps: [
        {
          type: 'linked_list', label: 'Initial',
          nodes: [{id:1,val:1,label:'head'},{id:2,val:2},{id:3,val:3},{id:4,val:4},{id:5,val:5,label:'tail'}],
          highlight: [1],
          explanation: 'prev = null, curr = Node 1. We will flip curr.next to point backward.',
        },
        {
          type: 'linked_list', label: 'Step 1: flip 1',
          nodes: [{id:1,val:1,label:'curr'},{id:2,val:2,label:'next'},{id:3,val:3},{id:4,val:4},{id:5,val:5}],
          highlight: [1, 2],
          explanation: 'next = curr.next (Node 2). curr.next = prev (null). prev = curr. curr = next.',
        },
        {
          type: 'linked_list', label: 'Step 2: flip 2',
          nodes: [{id:1,val:1},{id:2,val:2,label:'curr'},{id:3,val:3,label:'next'},{id:4,val:4},{id:5,val:5}],
          highlight: [2, 3],
          explanation: 'curr = Node 2. next = Node 3. curr.next = prev (Node 1). Pointer 2→1 created.',
        },
        {
          type: 'linked_list', label: 'Step 3: flip 3',
          nodes: [{id:1,val:1},{id:2,val:2},{id:3,val:3,label:'curr'},{id:4,val:4,label:'next'},{id:5,val:5}],
          highlight: [3, 4],
          explanation: 'curr = Node 3. Flip: 3→2. Move forward.',
        },
        {
          type: 'linked_list', label: 'Step 4: flip 4',
          nodes: [{id:1,val:1},{id:2,val:2},{id:3,val:3},{id:4,val:4,label:'curr'},{id:5,val:5,label:'next'}],
          highlight: [4, 5],
          explanation: 'curr = Node 4. Flip: 4→3. Move forward.',
        },
        {
          type: 'linked_list', label: 'Done! 5 is head',
          nodes: [{id:5,val:5,label:'new head'},{id:4,val:4},{id:3,val:3},{id:2,val:2},{id:1,val:1,label:'new tail'}],
          highlight: [5],
          explanation: 'curr = Node 5. Flip: 5→4. curr = null → loop ends. prev = Node 5 = new head! ✓',
        },
      ],
      mapping: [
        { realWorld: 'Carriage coupling direction', dsa: 'next pointer', example: '1→2 becomes 2→1' },
        { realWorld: 'Previous carriage', dsa: 'prev variable', example: 'prev = Node 1' },
        { realWorld: 'Current carriage', dsa: 'curr variable', example: 'curr = Node 2' },
        { realWorld: 'New engine (Carriage 5)', dsa: 'New head', example: 'return prev = Node 5' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'LINKED NODES (head)', arrayValues: [1, 2, 3, 4, 5],
      targetLabel: 'REVERSED LIST', targetValue: '[5,4,3,2,1]',
      question: 'Flip pointer directions so node 5 points backward to 1.',
      formulaRealWorld: 'Engine(1)→Caboose(5) becomes Engine(5)→Caboose(1)',
      formulaDSA: 'Head(1)→Tail(5) → Head(5)→Tail(1)',
      matchingIndices: [0, 4],
    },
    takeaway: {
      headline: 'Flip one pointer at a time — no extra array needed.',
      realWorldSummary: 'Re-couple carriages backwards using only 3 hands (prev, curr, next)',
      dsaSummary: 'O(N) time, O(1) space — just 3 pointers',
      finalNote: 'The train analogy shows exactly why we need 3 variables: to not lose track of where we came from.',
    },
  },

  /* ─────────────────────────────────────── 4. BINARY TREE INORDER ── */
  'binary-tree-inorder': {
    problemId: 'binary-tree-inorder',
    problemTitle: 'Binary Tree Inorder Traversal',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Reading a family tree register: always read the left branch completely before the parent, then the right.',
    },
    scenario: {
      title: 'Family Archive: Left branch → Parent → Right branch.',
      context: 'Tree: root=1, right=2, left-of-2=3. Inorder means: visit leftmost first, then up, then right.',
      question: 'Select Node 1 and Node 3 — which comes first in Left→Root→Right order?',
      target: { label: 'INORDER', unit: '', value: '[1,3,2]', display: 'INORDER [1,3,2]' },
      items: [
        { id: 'item_1', label: 'Root Node 1', priceDisplay: 'Node 1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Right Node 2', priceDisplay: 'Node 2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Left-of-2 Node 3', priceDisplay: 'Node 3', value: 3, arrayIndex: 2 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Left→Root order',
      correctPairIds: ['item_1', 'item_3'],
      successMessage: 'Node 1 is read first (no left child), then Node 3 (left of 2), then Node 2.',
      bridgeMessage: 'That is exactly how inorder traversal (Left → Root → Right) linearizes a tree.',
      hint: 'Select Node 1 (root) and Node 3 (left child of 2).',
    },
    stepVisualizer: {
      title: 'Inorder traversal of [1, null, 2, 3]',
      description: 'Inorder = Left → Root → Right. We recurse left first, then record the node, then recurse right.',
      steps: [
        {
          type: 'tree', label: 'At Node 1',
          rows: [[{id:1,val:1}], [null, {id:2,val:2}]], traversal: [],
          highlight: [1],
          explanation: 'Visit Node 1. No left child → record Node 1. Output: [1]',
        },
        {
          type: 'tree', label: 'Go right → Node 2',
          rows: [[{id:1,val:1}], [null, {id:2,val:2}]], traversal: [1],
          highlight: [2],
          explanation: 'Go to right child Node 2. It has a left child (Node 3). Go left first.',
        },
        {
          type: 'tree', label: 'At Node 3 (left of 2)',
          rows: [[{id:1,val:1}], [null, {id:2,val:2}], [null, {id:3,val:3}, null, null]], traversal: [1],
          highlight: [3],
          explanation: 'Node 3: no children. Record it. Output: [1, 3]',
        },
        {
          type: 'tree', label: 'Back to Node 2',
          rows: [[{id:1,val:1}], [null, {id:2,val:2}]], traversal: [1, 3],
          highlight: [2],
          explanation: 'Return to Node 2. Left done → record Node 2. No right child. Output: [1, 3, 2] ✓',
        },
      ],
      mapping: [
        { realWorld: 'Left branch of family', dsa: 'Left subtree', example: 'null left of Node 1' },
        { realWorld: 'Family patriarch', dsa: 'Root node', example: 'Node 1' },
        { realWorld: 'Right branch of family', dsa: 'Right subtree', example: 'Node 2 subtree' },
        { realWorld: 'Order of reading records', dsa: 'Inorder [1,3,2]', example: 'output array' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'TREE NODES (root)', arrayValues: [1, 3, 2],
      targetLabel: 'REQUIRED OUTPUT', targetValue: '[1,3,2]',
      question: 'Collect node values in Left→Root→Right order.',
      formulaRealWorld: 'Root(1) then Left-of-right(3) then Right(2)',
      formulaDSA: 'Inorder = [1, 3, 2]',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: '"Left first" is the golden rule of inorder.',
      realWorldSummary: 'Always finish the left branch before reading the parent',
      dsaSummary: 'Recurse left, record root, recurse right → sorted for BST',
      finalNote: 'Inorder traversal of a BST always yields a sorted sequence — that is its superpower.',
    },
  },

  /* ─────────────────────────────────────── 5. NUMBER OF ISLANDS ── */
  'number-of-islands': {
    problemId: 'number-of-islands',
    problemTitle: 'Number of Islands',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Counting landmasses on a satellite photo — flood-fill each discovered land patch so you never count it twice.',
    },
    scenario: {
      title: 'Satellite land-survey: count disconnected land regions.',
      context: 'Grid with "1"=land, "0"=water. Adjacent land cells form one island. Your goal: count distinct islands.',
      question: 'Identify the two separate island clusters from the grid.',
      target: { label: 'ISLAND COUNT', unit: ' islands', value: 3, display: '3 ISLANDS' },
      items: [
        { id: 'item_1', label: 'Island A (2×2 block)', priceDisplay: 'Island 1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Island B (cell 2,2)', priceDisplay: 'Island 2', value: 1, arrayIndex: 1 },
        { id: 'item_3', label: 'Island C (cell 3,3)', priceDisplay: 'Island 3', value: 1, arrayIndex: 2 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 3,
      correctPairIds: ['item_1', 'item_2'],
      successMessage: 'Island A and Island B are separate — water breaks them apart.',
      bridgeMessage: 'DFS/BFS floods an island to "0" after counting so it is never double-counted.',
      hint: 'Select Island A (top-left block) and Island B (lone cell).',
    },
    stepVisualizer: {
      title: 'DFS flood-fill on the grid',
      description: 'When we find a land cell "1", we increment the count and DFS-flood all connected land to "0" so we never visit it again.',
      steps: [
        {
          type: 'grid', label: 'Start at (0,0)',
          grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
          highlight: [[0,0]], visited: [],
          explanation: 'Grid (0,0) = "1" → Island count = 1. Start DFS to flood all connected land.',
        },
        {
          type: 'grid', label: 'Flood island 1',
          grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']],
          highlight: [], visited: [[0,0],[0,1],[1,0],[1,1]],
          explanation: 'DFS marks (0,0),(0,1),(1,0),(1,1) as visited (green). Island 1 fully flooded.',
        },
        {
          type: 'grid', label: 'Scan → (2,2) found',
          grid: [['0','0','0','0'],['0','0','0','0'],['0','0','1','0'],['0','0','0','1']],
          highlight: [[2,2]], visited: [[0,0],[0,1],[1,0],[1,1]],
          explanation: 'Continue scanning. (2,2) = "1" → Island count = 2. Flood it.',
        },
        {
          type: 'grid', label: 'Scan → (3,3) found',
          grid: [['0','0','0','0'],['0','0','0','0'],['0','0','0','0'],['0','0','0','1']],
          highlight: [[3,3]], visited: [[0,0],[0,1],[1,0],[1,1],[2,2]],
          explanation: '(3,3) = "1" → Island count = 3. Flood it. No more land. Answer = 3 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Land cell', dsa: '"1" in grid', example: 'grid[0][0] = "1"' },
        { realWorld: 'Water cell', dsa: '"0" in grid', example: 'grid[0][2] = "0"' },
        { realWorld: 'Flood painting a landmass', dsa: 'DFS/BFS from cell', example: 'mark "1"→"0" recursively' },
        { realWorld: 'Distinct landmasses', dsa: 'Component count', example: 'count = 3' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: '2D GRID', arrayValues: ['Island 1', 'Island 2', 'Island 3'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 3,
      question: 'Count connected "1" components separated by "0".',
      formulaRealWorld: 'Land A + Land B + Land C = 3 islands',
      formulaDSA: 'DFS connected components = 3',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Flood to mark, count each fresh flood.',
      realWorldSummary: 'Each new undiscovered land patch = one island',
      dsaSummary: 'DFS/BFS from each unvisited "1" → count increments once per island',
      finalNote: 'Flooding prevents double-counting — just like crossing off a landmass once you have surveyed it.',
    },
  },

  /* ─────────────────────────────────────── 6. KTH LARGEST ELEMENT ── */
  'kth-largest-element': {
    problemId: 'kth-largest-element',
    problemTitle: 'Kth Largest Element in an Array',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'A tournament leaderboard: maintain a "top-k" shortlist using a min-heap of exactly size k.',
    },
    scenario: {
      title: 'Sports Leaderboard: Silver medal = 2nd highest score.',
      context: 'Scores: [3,2,1,5,6,4], k=2. Without sorting everything, find the 2nd highest.',
      question: 'Which player holds the Silver Medal (rank k=2)?',
      target: { label: 'SILVER (k=2)', unit: ' pts', value: 5, display: 'RANK 2 = 5' },
      items: [
        { id: 'item_1', label: 'Gold (6)', priceDisplay: '6 pts', value: 6, arrayIndex: 4 },
        { id: 'item_2', label: 'Silver (5)', priceDisplay: '5 pts', value: 5, arrayIndex: 3 },
        { id: 'item_3', label: 'Bronze (4)', priceDisplay: '4 pts', value: 4, arrayIndex: 5 },
        { id: 'item_4', label: '4th (3)', priceDisplay: '3 pts', value: 3, arrayIndex: 0 },
      ],
    },
    interaction: {
      type: 'select_target_value', requiredCount: 1, targetValue: 5,
      correctPairIds: ['item_2'],
      successMessage: 'Score 5 is the 2nd highest — the Silver Medal rank!',
      bridgeMessage: 'A min-heap of size k=2 always ejects the smallest, keeping the top-k inside.',
      hint: 'Select the Silver medal holder: score 5.',
    },
    stepVisualizer: {
      title: 'Min-Heap of size k=2: process [3,2,1,5,6,4]',
      description: 'Maintain a min-heap of exactly k elements. Anything larger than the heap\'s minimum replaces it. The final minimum of the heap = kth largest.',
      steps: [
        {
          type: 'array', label: 'Push 3,2',
          array: [3, 2, 1, 5, 6, 4], highlight: [0, 1],
          explanation: 'Heap = [2, 3] (size k=2). Min = 2.',
        },
        {
          type: 'array', label: '1 < min → skip',
          array: [3, 2, 1, 5, 6, 4], highlight: [2],
          explanation: '1 < heap minimum (2) → 1 cannot be in top-2 → skip.',
        },
        {
          type: 'array', label: '5 > min → replace',
          array: [3, 2, 1, 5, 6, 4], highlight: [3],
          explanation: '5 > 2 → pop 2, push 5. Heap = [3, 5]. Min = 3.',
        },
        {
          type: 'array', label: '6 > min → replace',
          array: [3, 2, 1, 5, 6, 4], highlight: [4],
          explanation: '6 > 3 → pop 3, push 6. Heap = [5, 6]. Min = 5.',
        },
        {
          type: 'array', label: '4 < min → skip',
          array: [3, 2, 1, 5, 6, 4], highlight: [5],
          explanation: '4 < 5 → skip. Heap stays [5, 6]. Answer = heap.min = 5 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Scores on leaderboard', dsa: 'Input array nums', example: '[3,2,1,5,6,4]' },
        { realWorld: 'Silver medal shortlist of 2', dsa: 'Min-heap of size k', example: 'heap=[5,6]' },
        { realWorld: 'Weakest player on shortlist', dsa: 'Heap minimum', example: 'heap.peek() = 5' },
        { realWorld: 'Silver medal value', dsa: 'Kth largest', example: 'return 5' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INPUT ARRAY (nums)', arrayValues: [6, 5, 4, 3, 2, 1],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 5,
      question: 'Find the element at rank k=2 in descending order.',
      formulaRealWorld: '1st (6) → 2nd (5)', formulaDSA: 'MinHeap[k].peek() = 5',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Keep only the top-k; the weakest of that group = answer.',
      realWorldSummary: 'Top-2 shortlist: {6, 5}. Weakest = 5 = Silver.',
      dsaSummary: 'Min-heap size k → peek = kth largest in O(N log k)',
      finalNote: 'No need to sort everything — just maintain a fixed-size leaderboard.',
    },
  },

  /* ─────────────────────────────────────── 7. SLIDING WINDOW MAX ── */
  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    problemTitle: 'Sliding Window Maximum',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'A camera viewfinder slides across a skyline capturing the tallest building in each 3-building frame.',
    },
    scenario: {
      title: 'Camera viewfinder: tallest building in each 3-wide frame.',
      context: 'Heights: [1,3,-1,-3,5,3,6,7], k=3. Frame slides one step right each time.',
      question: 'Which window frame first captures a peak of 5?',
      target: { label: 'PEAK HEIGHT', unit: 'm', value: 5, display: 'PEAK 5' },
      items: [
        { id: 'item_1', label: 'Frame [1,3,-1]', priceDisplay: 'Max 3', value: 3, arrayIndex: 0 },
        { id: 'item_2', label: 'Frame [3,-1,-3]', priceDisplay: 'Max 3', value: 3, arrayIndex: 1 },
        { id: 'item_3', label: 'Frame [-1,-3,5]', priceDisplay: 'Max 5', value: 5, arrayIndex: 2 },
        { id: 'item_4', label: 'Frame [-3,5,3]', priceDisplay: 'Max 5', value: 5, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_target_value', requiredCount: 1, targetValue: 5,
      correctPairIds: ['item_3'],
      successMessage: 'Frame [-1,-3,5] is the first window where the peak reaches 5!',
      bridgeMessage: 'A monotonic deque tracks the current maximum without rescanning the whole window.',
      hint: 'Select the window frame that first captures height 5.',
    },
    stepVisualizer: {
      title: 'Window slides across [1,3,-1,-3,5,3,6,7], k=3',
      description: 'Each step the window moves right by 1. One element enters, one leaves. Record the max of each window.',
      steps: [
        { type: 'sliding_window', label: 'Window 1', array: [1,3,-1,-3,5,3,6,7], ws: 0, we: 2, sum: null, best: 3,
          explanation: 'Window [1,3,-1]. Max = 3. Output: [3]' },
        { type: 'sliding_window', label: 'Window 2', array: [1,3,-1,-3,5,3,6,7], ws: 1, we: 3, sum: null, best: 3, leaving: 0,
          explanation: 'Slide right: 1 leaves, -3 enters. Window [3,-1,-3]. Max = 3. Output: [3,3]' },
        { type: 'sliding_window', label: 'Window 3', array: [1,3,-1,-3,5,3,6,7], ws: 2, we: 4, sum: null, best: 5, leaving: 1, entering: 4,
          explanation: 'Slide: 3 leaves, 5 enters. Window [-1,-3,5]. Max = 5. Output: [3,3,5]' },
        { type: 'sliding_window', label: 'Window 4', array: [1,3,-1,-3,5,3,6,7], ws: 3, we: 5, sum: null, best: 5, entering: 5,
          explanation: 'Window [-3,5,3]. Max = 5. Output: [3,3,5,5]' },
        { type: 'sliding_window', label: 'Window 5', array: [1,3,-1,-3,5,3,6,7], ws: 4, we: 6, sum: null, best: 6, entering: 6,
          explanation: 'Window [5,3,6]. Max = 6. Output: [3,3,5,5,6]' },
        { type: 'sliding_window', label: 'Window 6', array: [1,3,-1,-3,5,3,6,7], ws: 5, we: 7, sum: null, best: 7, entering: 7,
          explanation: 'Window [3,6,7]. Max = 7. Final Output: [3,3,5,5,6,7] ✓' },
      ],
      mapping: [
        { realWorld: 'Camera frame (3 buildings wide)', dsa: 'Window of size k=3', example: '[1,3,-1]' },
        { realWorld: 'Tallest building in frame', dsa: 'Window maximum', example: 'max([1,3,-1]) = 3' },
        { realWorld: 'Slide frame right', dsa: 'Move window by 1', example: 'ws++, we++' },
        { realWorld: 'List of peak heights', dsa: 'Output array', example: '[3,3,5,5,6,7]' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'WINDOW MAXIMA', arrayValues: [3, 3, 5, 5, 6, 7],
      targetLabel: 'REQUIRED OUTPUT', targetValue: '[3,3,5,5,6,7]',
      question: 'Record max element in each k-length sliding window.',
      formulaRealWorld: 'Frame [-1,-3,5] → peak 5', formulaDSA: 'max(window) = 5 at index 2',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'The window always sees exactly k elements — slide, don\'t restart.',
      realWorldSummary: 'Only the tallest building in the current frame matters',
      dsaSummary: 'Monotonic deque tracks max in O(1) per slide = O(N) total',
      finalNote: 'Sliding the window adds one element and removes one — recomputing from scratch would be O(Nk).',
    },
  },

  /* ─────────────────────────────────────── 8. MERGE INTERVALS ── */
  'merge-intervals': {
    problemId: 'merge-intervals',
    problemTitle: 'Merge Intervals',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Calendar bookings that overlap get merged into one continuous block so the room is never double-booked.',
    },
    scenario: {
      title: 'Merge overlapping meeting bookings.',
      context: 'Meetings: [1,3],[2,6],[8,10],[15,18]. [1,3] and [2,6] overlap between 2 and 3 → merge to [1,6].',
      question: 'Select the two meetings that overlap and should be merged.',
      target: { label: 'MERGED BLOCK', unit: '', value: '[1,6]', display: '[1,6]' },
      items: [
        { id: 'item_1', label: 'Meeting A [1,3]', priceDisplay: '[1,3]', value: 3, arrayIndex: 0 },
        { id: 'item_2', label: 'Meeting B [2,6]', priceDisplay: '[2,6]', value: 6, arrayIndex: 1 },
        { id: 'item_3', label: 'Meeting C [8,10]', priceDisplay: '[8,10]', value: 10, arrayIndex: 2 },
        { id: 'item_4', label: 'Meeting D [15,18]', priceDisplay: '[15,18]', value: 18, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: '[1,6]',
      correctPairIds: ['item_1', 'item_2'],
      successMessage: '[1,3] and [2,6] overlap (2 ≤ 3) → merge to [1, max(3,6)] = [1,6].',
      bridgeMessage: 'Sort by start time, then merge whenever next.start ≤ current.end.',
      hint: 'Select Meeting A and Meeting B — they overlap.',
    },
    stepVisualizer: {
      title: 'Merge sorted intervals [[1,3],[2,6],[8,10],[15,18]]',
      description: 'Sort intervals by start. Compare each interval to the last merged: if they overlap, extend; if not, push as-is.',
      steps: [
        {
          type: 'interval', label: 'Add [1,3]',
          intervals: [[1,3],[2,6],[8,10],[15,18]], merged: [], current: 0,
          explanation: 'Result so far: []. Add [1,3] as first interval.',
        },
        {
          type: 'interval', label: 'Check [2,6]',
          intervals: [[1,3],[2,6],[8,10],[15,18]], merged: [], current: 1,
          explanation: '[2,6] start (2) ≤ last end (3) → OVERLAP! Extend last to max(3,6)=6 → [1,6].',
        },
        {
          type: 'interval', label: 'Check [8,10]',
          intervals: [[1,3],[2,6],[8,10],[15,18]], merged: [[1,6]], current: 2,
          explanation: '[8,10] start (8) > last end (6) → NO overlap. Append [8,10].',
        },
        {
          type: 'interval', label: 'Check [15,18]',
          intervals: [[1,3],[2,6],[8,10],[15,18]], merged: [[1,6],[8,10]], current: 3,
          explanation: '[15,18] start (15) > 10 → append [15,18]. Done! Result: [[1,6],[8,10],[15,18]] ✓',
        },
      ],
      mapping: [
        { realWorld: 'Meeting time slot', dsa: 'Interval [start, end]', example: '[1,3] = 1pm–3pm' },
        { realWorld: 'Two meetings overlap', dsa: 'next.start ≤ prev.end', example: '2 ≤ 3' },
        { realWorld: 'Merge into one booking', dsa: 'Extend end = max', example: 'end = max(3,6) = 6' },
        { realWorld: 'Gap between bookings', dsa: 'No overlap → append', example: '8 > 6 → new interval' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INTERVALS', arrayValues: ['[1,3]','[2,6]','[8,10]','[15,18]'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: '[[1,6],[8,10],[15,18]]',
      question: 'Combine all intervals whose ranges overlap.',
      formulaRealWorld: '[1:00-3:00]+[2:00-6:00]=[1:00-6:00]',
      formulaDSA: 'min(1,2)=1, max(3,6)=6 → [1,6]',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Sort first, then one forward pass — overlap check is just comparing two numbers.',
      realWorldSummary: 'Overlapping meetings get one continuous booking block',
      dsaSummary: 'O(N log N) sort + O(N) merge pass = O(N log N) total',
      finalNote: 'The key insight: after sorting by start, you only ever need to compare adjacent intervals.',
    },
  },

  /* ─────────────────────────────────────── 9. LONGEST SUBSTRING NO REPEAT ── */
  'longest-substring-no-repeat': {
    problemId: 'longest-substring-no-repeat',
    problemTitle: 'Longest Substring Without Repeating Characters',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Building a team of unique badge-holders: the moment a duplicate badge appears, shrink the team from the left until uniqueness is restored.',
    },
    scenario: {
      title: 'Unique-badge team: max streak without duplicate specialists.',
      context: 'Badges arrive: a,b,c,a,b,c,b,b. You hold an expanding team window. When "a" repeats, shrink from left.',
      question: 'Select the first and last member of the longest unique streak.',
      target: { label: 'MAX UNIQUE STREAK', unit: ' members', value: 3, display: '3 UNIQUE' },
      items: [
        { id: 'item_1', label: 'Specialist a (0)', priceDisplay: '"a"', value: 'a', arrayIndex: 0 },
        { id: 'item_2', label: 'Specialist b (1)', priceDisplay: '"b"', value: 'b', arrayIndex: 1 },
        { id: 'item_3', label: 'Specialist c (2)', priceDisplay: '"c"', value: 'c', arrayIndex: 2 },
        { id: 'item_4', label: 'Duplicate a (3)', priceDisplay: '"a" dup', value: 'a', arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 3,
      correctPairIds: ['item_1', 'item_3'],
      successMessage: 'Streak "a"→"b"→"c" = length 3, the longest unique window.',
      bridgeMessage: 'Sliding window + HashSet: expand right, shrink left on duplicate.',
      hint: 'Select specialist "a" (index 0) and "c" (index 2) — the full unique streak.',
    },
    stepVisualizer: {
      title: 'Sliding window on "abcabcbb"',
      description: 'Right pointer expands. When a duplicate is found, left pointer shrinks until the window is unique again. Track max window size.',
      steps: [
        { type: 'sliding_window', label: 'a,b,c — unique', array: ['a','b','c','a','b','c','b','b'], ws:0, we:2, best:3,
          explanation: 'Window "abc" (0–2). All unique. Max = 3.' },
        { type: 'sliding_window', label: '"a" duplicate!', array: ['a','b','c','a','b','c','b','b'], ws:0, we:3, best:3,
          explanation: '"a" at index 3 duplicates index 0. Shrink left: move left past the old "a". Left = 1.' },
        { type: 'sliding_window', label: 'Shrunk to b,c,a', array: ['a','b','c','a','b','c','b','b'], ws:1, we:3, best:3,
          explanation: 'Window "bca" (1–3). Unique again. Max still 3.' },
        { type: 'sliding_window', label: '"b" duplicate!', array: ['a','b','c','a','b','c','b','b'], ws:2, we:4, best:3,
          explanation: '"b" at index 4 duplicates index 1. Shrink left to 2. Window "cab".' },
        { type: 'sliding_window', label: 'Final max = 3', array: ['a','b','c','a','b','c','b','b'], ws:5, we:6, best:3,
          explanation: 'Window keeps shrinking as duplicates appear. Maximum unique window = 3. Answer = 3 ✓' },
      ],
      mapping: [
        { realWorld: 'Arriving specialist', dsa: 'Right pointer character', example: 's[right] = "a"' },
        { realWorld: 'Duplicate badge detected', dsa: 'Character in HashSet', example: 'set.has("a")' },
        { realWorld: 'Remove leftmost specialist', dsa: 'Move left pointer', example: 'left++; set.delete(s[left])' },
        { realWorld: 'Longest unique team', dsa: 'Max window size', example: 'maxLen = max(maxLen, right-left+1)' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INPUT STRING (s)', arrayValues: ['a','b','c','a','b','c','b','b'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 3,
      question: 'Find max length of contiguous substring with all unique chars.',
      formulaRealWorld: 'Unique team "abc" = 3 members',
      formulaDSA: 'Substring "abc" = length 3',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'Two pointers + a set: expand until duplicate, shrink until unique.',
      realWorldSummary: 'Biggest duplicate-free team window = 3',
      dsaSummary: 'O(N) — each character enters and leaves the window at most once',
      finalNote: 'The shrink step is the key: we don\'t restart, we just move left past the duplicate\'s old position.',
    },
  },

  /* ─────────────────────────────────────── 10. SHORTEST PATH GRAPH ── */
  'shortest-path-graph': {
    problemId: 'shortest-path-graph',
    problemTitle: 'Shortest Path in Unweighted Graph',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'A subway map: BFS expands level by level (one stop at a time) guaranteeing the first time you reach a station is via the shortest route.',
    },
    scenario: {
      title: 'Subway navigation: fewest hops from Station A to Station D.',
      context: 'Stations: A→[B,C], B→[C], C→[D]. Direct path A→C→D = 2 hops. A→B→C→D = 3 hops.',
      question: 'Select Station A (start) and Station D (destination).',
      target: { label: 'MIN HOPS', unit: ' hops', value: 2, display: '2 HOPS' },
      items: [
        { id: 'item_1', label: 'Station A (Start)', priceDisplay: 'Station A', value: 0, arrayIndex: 0 },
        { id: 'item_2', label: 'Station B', priceDisplay: 'Station B', value: 1, arrayIndex: 1 },
        { id: 'item_3', label: 'Station C', priceDisplay: 'Station C', value: 2, arrayIndex: 2 },
        { id: 'item_4', label: 'Station D (End)', priceDisplay: 'Station D', value: 3, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 2,
      correctPairIds: ['item_1', 'item_4'],
      successMessage: 'A→C→D is the shortest path: only 2 hops!',
      bridgeMessage: 'BFS guarantees the first time we reach a node is via the shortest path.',
      hint: 'Select Station A (start) and Station D (destination).',
    },
    stepVisualizer: {
      title: 'BFS from Node A (0) to Node D (3)',
      description: 'BFS explores all nodes at distance 1 before distance 2. First time we reach the destination = shortest path.',
      steps: [
        {
          type: 'graph', label: 'Start at A',
          nodes: [{id:'A',label:'A'},{id:'B',label:'B'},{id:'C',label:'C'},{id:'D',label:'D'}],
          visited: ['A'], current: 'A', bfsQ: ['A'],
          explanation: 'Queue: [A]. Visit A. Distance 0. Enqueue neighbors B and C.',
        },
        {
          type: 'graph', label: 'Level 1: B and C',
          nodes: [{id:'A',label:'A'},{id:'B',label:'B'},{id:'C',label:'C'},{id:'D',label:'D'}],
          visited: ['A','B','C'], current: 'B', bfsQ: ['B','C'],
          explanation: 'Queue: [B, C]. Distance 1. Visit B (neighbors: C already seen). Visit C (neighbor: D).',
        },
        {
          type: 'graph', label: 'Level 2: D found!',
          nodes: [{id:'A',label:'A'},{id:'B',label:'B'},{id:'C',label:'C'},{id:'D',label:'D'}],
          visited: ['A','B','C','D'], current: 'D', bfsQ: ['D'],
          explanation: 'Queue: [D]. Distance 2. D reached! Shortest path = 2 hops (A→C→D) ✓',
        },
      ],
      mapping: [
        { realWorld: 'Subway station', dsa: 'Graph node', example: 'Station A = Node 0' },
        { realWorld: 'Train connection', dsa: 'Graph edge', example: 'A→C edge' },
        { realWorld: 'Explore all 1-stop stations first', dsa: 'BFS level order', example: 'Queue FIFO' },
        { realWorld: 'Fewest train hops', dsa: 'Shortest path distance', example: 'dist[D] = 2' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'GRAPH EDGES', arrayValues: ['A→B','A→C','B→C','C→D'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 2,
      question: 'Find minimum edge count from start (A=0) to destination (D=3).',
      formulaRealWorld: 'A → C → D = 2 stops',
      formulaDSA: 'BFS dist[3] = 2',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'BFS = guarantees shortest in unweighted graphs because it expands level by level.',
      realWorldSummary: 'First time you arrive at a station via BFS = fewest hops',
      dsaSummary: 'BFS O(V+E) — shortest path by edge count',
      finalNote: 'In a weighted graph you\'d use Dijkstra. In an unweighted graph, BFS is optimal.',
    },
  },

  /* ─────────────────────────────────────── 11. CLIMBING STAIRS ── */
  'climbing-stairs': {
    problemId: 'climbing-stairs',
    problemTitle: 'Climbing Stairs',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Every step you can reach from either the previous step (+1) or two steps back (+2) — so the ways to reach step i equals ways[i-1] + ways[i-2].',
    },
    scenario: {
      title: 'Stadium stairs: 1-step or 2-step strides only. How many distinct ways to reach Step 5?',
      context: 'n=5. You can reach Step 5 by arriving from Step 4 (+1) or Step 3 (+2). Ways[5] = Ways[4] + Ways[3].',
      question: 'Select Step 3 (3 ways) and Step 4 (5 ways) to sum them into Step 5 (8 ways).',
      target: { label: 'PATHS TO STEP 5', unit: ' paths', value: 8, display: '8 PATHS' },
      items: [
        { id: 'item_1', label: '+1 stride', priceDisplay: '+1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: '+2 stride', priceDisplay: '+2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Ways to Step 3', priceDisplay: '3 ways', value: 3, arrayIndex: 2 },
        { id: 'item_4', label: 'Ways to Step 4', priceDisplay: '5 ways', value: 5, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'pair_sum', requiredCount: 2, targetValue: 8,
      correctPairIds: ['item_3', 'item_4'],
      successMessage: '3 + 5 = 8. Ways[5] = Ways[4] + Ways[3].',
      bridgeMessage: 'That is the DP recurrence: dp[i] = dp[i-1] + dp[i-2].',
      hint: 'Select Step 3 Ways (3) and Step 4 Ways (5) — they sum to 8.',
    },
    stepVisualizer: {
      title: 'Build up the DP table step by step',
      description: 'dp[i] = number of distinct ways to reach step i. Base cases: dp[1]=1, dp[2]=2.',
      steps: [
        {
          type: 'dp_table', label: 'Base cases',
          table: [[1,2,null,null,null]], colLabels: ['Step 1','Step 2','Step 3','Step 4','Step 5'],
          highlight: [[0,0],[0,1]],
          explanation: 'dp[1]=1 (only one way: take 1 step). dp[2]=2 (1+1 or 2). These are our base cases.',
        },
        {
          type: 'dp_table', label: 'dp[3] = 1+2 = 3',
          table: [[1,2,3,null,null]], colLabels: ['Step 1','Step 2','Step 3','Step 4','Step 5'],
          highlight: [[0,2]],
          explanation: 'dp[3] = dp[2] + dp[1] = 2 + 1 = 3. Three paths: (1,1,1),(1,2),(2,1).',
        },
        {
          type: 'dp_table', label: 'dp[4] = 2+3 = 5',
          table: [[1,2,3,5,null]], colLabels: ['Step 1','Step 2','Step 3','Step 4','Step 5'],
          highlight: [[0,3]],
          explanation: 'dp[4] = dp[3] + dp[2] = 3 + 2 = 5.',
        },
        {
          type: 'dp_table', label: 'dp[5] = 3+5 = 8',
          table: [[1,2,3,5,8]], colLabels: ['Step 1','Step 2','Step 3','Step 4','Step 5'],
          highlight: [[0,4]],
          explanation: 'dp[5] = dp[4] + dp[3] = 5 + 3 = 8. Answer = 8 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Step number', dsa: 'Index i in dp array', example: 'Step 5 → dp[5]' },
        { realWorld: 'Arrive by +1 stride', dsa: 'dp[i-1]', example: 'from step 4' },
        { realWorld: 'Arrive by +2 stride', dsa: 'dp[i-2]', example: 'from step 3' },
        { realWorld: 'Total unique ways', dsa: 'dp[n]', example: 'dp[5] = 8' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'STAIRCASE (n=5)', arrayValues: ['Step 1','Step 2','Step 3','Step 4','Step 5'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 8,
      question: 'Count distinct paths to step n using +1 or +2 strides.',
      formulaRealWorld: 'Ways(Step 4: 5) + Ways(Step 3: 3) = 8',
      formulaDSA: 'dp[5] = dp[4] + dp[3] = 5 + 3 = 8',
      matchingIndices: [2, 3],
    },
    takeaway: {
      headline: 'Fibonacci in disguise — each step is the sum of the two before it.',
      realWorldSummary: 'Ways to any step = ways from one below + ways from two below',
      dsaSummary: 'dp[i] = dp[i-1] + dp[i-2] → O(N) time, O(1) space',
      finalNote: 'You only need the last two values — no full table necessary.',
    },
  },

  /* ─────────────────────────────────────── 12. HOUSE ROBBER ── */
  'house-robber': {
    problemId: 'house-robber',
    problemTitle: 'House Robber',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Harvesting fruit trees: you cannot pick two adjacent trees or the alarm triggers — maximize total harvest.',
    },
    scenario: {
      title: 'Orchard harvest: pick non-adjacent trees for maximum yield.',
      context: 'Trees: [2,7,9,3,1]. Picking adjacent trees triggers the alarm. Best strategy: 2+9+1=12.',
      question: 'Select non-adjacent Tree 1 (2) and Tree 3 (9) for part of the max harvest.',
      target: { label: 'MAX HARVEST', unit: ' apples', value: 12, display: '12 APPLES' },
      items: [
        { id: 'item_1', label: 'Tree 1 (2)', priceDisplay: '2 apples', value: 2, arrayIndex: 0 },
        { id: 'item_2', label: 'Tree 2 (7)', priceDisplay: '7 apples', value: 7, arrayIndex: 1 },
        { id: 'item_3', label: 'Tree 3 (9)', priceDisplay: '9 apples', value: 9, arrayIndex: 2 },
        { id: 'item_4', label: 'Tree 4 (3)', priceDisplay: '3 apples', value: 3, arrayIndex: 3 },
        { id: 'item_5', label: 'Tree 5 (1)', priceDisplay: '1 apple', value: 1, arrayIndex: 4 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 12,
      correctPairIds: ['item_1', 'item_3'],
      successMessage: 'Tree 1 (2) and Tree 3 (9) are non-adjacent. With Tree 5 (1): total = 12.',
      bridgeMessage: 'At each tree: max(skip this tree, pick this tree + best 2 trees ago).',
      hint: 'Select non-adjacent Tree 1 (2) and Tree 3 (9).',
    },
    stepVisualizer: {
      title: 'DP table: max loot through each house [2,7,9,3,1]',
      description: 'dp[i] = max loot considering houses 0..i. At each step: pick = nums[i] + dp[i-2]; skip = dp[i-1].',
      steps: [
        {
          type: 'dp_table', label: 'dp[0] = 2',
          table: [[2,null,null,null,null]], colLabels: ['H1=2','H2=7','H3=9','H4=3','H5=1'],
          highlight: [[0,0]],
          explanation: 'dp[0] = 2. Only house 1 → take it.',
        },
        {
          type: 'dp_table', label: 'dp[1] = max(2,7) = 7',
          table: [[2,7,null,null,null]], colLabels: ['H1=2','H2=7','H3=9','H4=3','H5=1'],
          highlight: [[0,1]],
          explanation: 'dp[1] = max(dp[0], 7) = max(2,7) = 7. Take house 2 alone.',
        },
        {
          type: 'dp_table', label: 'dp[2] = max(7, 9+2) = 11',
          table: [[2,7,11,null,null]], colLabels: ['H1=2','H2=7','H3=9','H4=3','H5=1'],
          highlight: [[0,2]],
          explanation: 'dp[2] = max(dp[1]=7, 9+dp[0]=11) = 11. Take houses 1+3.',
        },
        {
          type: 'dp_table', label: 'dp[3] = max(11, 3+7) = 11',
          table: [[2,7,11,11,null]], colLabels: ['H1=2','H2=7','H3=9','H4=3','H5=1'],
          highlight: [[0,3]],
          explanation: 'dp[3] = max(dp[2]=11, 3+dp[1]=10) = 11. Skip house 4.',
        },
        {
          type: 'dp_table', label: 'dp[4] = max(11, 1+11) = 12',
          table: [[2,7,11,11,12]], colLabels: ['H1=2','H2=7','H3=9','H4=3','H5=1'],
          highlight: [[0,4]],
          explanation: 'dp[4] = max(dp[3]=11, 1+dp[2]=12) = 12. Take houses 1+3+5. Answer = 12 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Tree yield', dsa: 'nums[i]', example: 'Tree 3 = 9' },
        { realWorld: 'Cannot pick adjacent trees', dsa: 'Cannot use dp[i-1]', example: 'skip one house' },
        { realWorld: 'Best harvest including this tree', dsa: 'nums[i] + dp[i-2]', example: '9 + dp[0]=2 = 11' },
        { realWorld: 'Best harvest skipping this tree', dsa: 'dp[i-1]', example: '7' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'HOUSE VALUES', arrayValues: [2, 7, 9, 3, 1],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 12,
      question: 'Maximum sum of non-adjacent elements.',
      formulaRealWorld: 'Harvest Tree 1(2)+Tree 3(9)+Tree 5(1)=12',
      formulaDSA: 'dp[i]=max(dp[i-1], nums[i]+dp[i-2])=12',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'At every house: compare "rob it" vs "skip it" — keep the better.',
      realWorldSummary: 'Non-adjacent orchard picks = maximum harvest',
      dsaSummary: 'O(N) DP with O(1) space using just two variables',
      finalNote: 'The "adjacency alarm" is just a constraint that forces us to skip one dp step.',
    },
  },

  /* ─────────────────────────────────────── 13. SUBSETS ── */
  'subsets': {
    problemId: 'subsets',
    problemTitle: 'Subsets',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Every pizza topping is either ON or OFF the pizza — 3 toppings = 2³ = 8 possible pizzas.',
    },
    scenario: {
      title: 'Pizza customizer: include or exclude each topping.',
      context: 'Toppings: [1=Mushroom, 2=Pepperoni, 3=Olive]. Each can be included or skipped → 8 combos.',
      question: 'Select Mushroom and Pepperoni to form subset [1,2].',
      target: { label: 'SUBSET', unit: '', value: '[1,2]', display: 'SUBSET [1,2]' },
      items: [
        { id: 'item_1', label: 'Mushroom (1)', priceDisplay: 'Item 1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Pepperoni (2)', priceDisplay: 'Item 2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Olive (3)', priceDisplay: 'Item 3', value: 3, arrayIndex: 2 },
        { id: 'item_4', label: 'Full [1,2,3]', priceDisplay: 'Full Set', value: 3, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: '[1,2]',
      correctPairIds: ['item_1', 'item_2'],
      successMessage: 'Mushroom + Pepperoni = subset [1,2]. One of 8 possible pizzas.',
      bridgeMessage: 'Backtracking: for each element, branch into "include" and "exclude" recursively.',
      hint: 'Select Mushroom (1) and Pepperoni (2).',
    },
    stepVisualizer: {
      title: 'Backtracking decision tree for [1,2,3]',
      description: 'At each element we branch: INCLUDE it, recurse, then EXCLUDE it and recurse again.',
      steps: [
        {
          type: 'subset', label: 'Decide on 1',
          items: [1,2,3], included: [], excluded: [], current: 0, subsets: [[]],
          explanation: 'Start with empty subset []. Decide: include 1 or skip 1?',
        },
        {
          type: 'subset', label: 'Include 1 → decide on 2',
          items: [1,2,3], included: [0], excluded: [], current: 1, subsets: [[]],
          explanation: 'Branch A: include 1. Now decide: include 2 or skip 2?',
        },
        {
          type: 'subset', label: 'Include 1,2 → decide on 3',
          items: [1,2,3], included: [0,1], excluded: [], current: 2, subsets: [[],[1],[1,2]],
          explanation: 'Branch: include 2. Path: [1,2]. Decide on 3.',
        },
        {
          type: 'subset', label: 'All 8 subsets found',
          items: [1,2,3], included: [], excluded: [], current: -1,
          subsets: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]],
          explanation: 'After exploring all branches: 2³=8 unique subsets ✓',
        },
      ],
      mapping: [
        { realWorld: 'Pizza topping choice', dsa: 'Include/Exclude decision', example: 'Mushroom: IN or OUT' },
        { realWorld: 'One pizza recipe', dsa: 'One subset', example: '[1,2] = Mushroom+Pepperoni' },
        { realWorld: '2 choices per topping', dsa: '2^N total subsets', example: '2³ = 8' },
        { realWorld: 'All possible pizzas', dsa: 'Power set', example: '[[], [1], [2], ... [1,2,3]]' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INPUT ARRAY (nums)', arrayValues: ['[]','[1]','[2]','[1,2]','[3]','[1,3]','[2,3]','[1,2,3]'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 8,
      question: 'Generate all 2^N unique subset combinations.',
      formulaRealWorld: '2 choices per topping ^ 3 toppings = 8 unique pizzas',
      formulaDSA: '2^N = 2^3 = 8 subsets',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Include or exclude — apply that choice recursively to get all subsets.',
      realWorldSummary: 'Binary choices per ingredient → 8 unique pizza recipes',
      dsaSummary: 'Backtracking: O(2^N) time, O(N) recursion stack',
      finalNote: 'The decision tree has exactly 2^N leaves — one for each subset.',
    },
  },

  /* ─────────────────────────────────────── 14. COURSE SCHEDULE ── */
  'course-schedule': {
    problemId: 'course-schedule',
    problemTitle: 'Course Schedule',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Flight school training: if Basic Flying is required before Jet Piloting which is required before Basic Flying — you\'re trapped in a loop and can never graduate.',
    },
    scenario: {
      title: 'Can you complete all 4 flight modules with no circular prerequisites?',
      context: 'Prereqs: [1←0],[2←0],[3←1],[3←2]. Module 0 unlocks 1 and 2; both unlock 3. No cycles.',
      question: 'Select the starting module (0) and final module (3) to verify no deadlock.',
      target: { label: 'FEASIBLE', unit: '', value: 'Acyclic', display: 'POSSIBLE (true)' },
      items: [
        { id: 'item_1', label: 'Module 0 (Basic)', priceDisplay: 'Module 0', value: 0, arrayIndex: 0 },
        { id: 'item_2', label: 'Module 1 (Nav)', priceDisplay: 'Module 1', value: 1, arrayIndex: 1 },
        { id: 'item_3', label: 'Module 2 (Weather)', priceDisplay: 'Module 2', value: 2, arrayIndex: 2 },
        { id: 'item_4', label: 'Module 3 (Jet)', priceDisplay: 'Module 3', value: 3, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Valid Order',
      correctPairIds: ['item_1', 'item_4'],
      successMessage: 'Module 0 → 1 → 3 and 0 → 2 → 3: no circular dependency!',
      bridgeMessage: 'Topological sort via BFS (Kahn\'s algorithm): process nodes with in-degree 0 first.',
      hint: 'Select Module 0 (start) and Module 3 (finish).',
    },
    stepVisualizer: {
      title: 'Kahn\'s BFS: process in-degree 0 nodes first',
      description: 'Count in-degrees. Enqueue nodes with in-degree 0. Process them, reduce neighbors\' in-degrees. If all processed → no cycle.',
      steps: [
        {
          type: 'graph', label: 'In-degrees: 0→0, 1→1, 2→1, 3→2',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'}],
          visited: [], current: null, bfsQ: ['0'],
          explanation: 'Module 0 has in-degree 0 (no prerequisites). Enqueue it.',
        },
        {
          type: 'graph', label: 'Process 0 → enqueue 1,2',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'}],
          visited: ['0'], current: '1', bfsQ: ['1','2'],
          explanation: 'Process 0. Reduce in-degree of 1 (→0) and 2 (→0). Both enqueued.',
        },
        {
          type: 'graph', label: 'Process 1 → reduce 3 in-degree',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'}],
          visited: ['0','1'], current: '2', bfsQ: ['2'],
          explanation: 'Process 1. In-degree of 3 becomes 1. Process 2. In-degree of 3 becomes 0.',
        },
        {
          type: 'graph', label: 'Process 3 → all done!',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'}],
          visited: ['0','1','2','3'], current: '3', bfsQ: [],
          explanation: 'All 4 modules processed. No cycle detected → return true ✓',
        },
      ],
      mapping: [
        { realWorld: 'Training module', dsa: 'Graph node', example: 'Module 0' },
        { realWorld: 'Prerequisite relationship', dsa: 'Directed edge', example: '0 → 1' },
        { realWorld: 'Circular prerequisite = deadlock', dsa: 'Directed cycle', example: 'A→B→A' },
        { realWorld: 'Valid training order', dsa: 'Topological ordering', example: '[0, 1, 2, 3]' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'PREREQUISITE EDGES', arrayValues: ['0→1','0→2','1→3','2→3'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 'true',
      question: 'Does a valid non-circular course completion order exist?',
      formulaRealWorld: 'Module 0 → Module 3 with no deadlock',
      formulaDSA: 'DAG → topological sort possible → true',
      matchingIndices: [0, 3],
    },
    takeaway: {
      headline: 'A cycle = impossible to start. No cycle = there is always a valid order.',
      realWorldSummary: 'No circular prerequisites → can graduate from all modules',
      dsaSummary: 'Kahn\'s BFS / DFS cycle detection on directed graph',
      finalNote: 'If processed count < numCourses at end → a cycle exists → return false.',
    },
  },

  /* ─────────────────────────────────────── 15. CONNECTED COMPONENTS ── */
  'connected-components': {
    problemId: 'connected-components',
    problemTitle: 'Number of Connected Components in an Undirected Graph',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Island archipelagoes connected by footbridges — count how many disconnected island clusters exist.',
    },
    scenario: {
      title: 'Archipelago count: islands 0,1,2 linked; islands 3,4 linked separately.',
      context: 'n=5, edges: [0-1],[1-2],[3-4]. Two separate island groups — 2 components.',
      question: 'Select Archipelago A (islands 0,1,2) and Archipelago B (islands 3,4).',
      target: { label: 'COMPONENTS', unit: ' groups', value: 2, display: '2 GROUPS' },
      items: [
        { id: 'item_1', label: 'Archipelago A (0,1,2)', priceDisplay: 'Group 1', value: 3, arrayIndex: 0 },
        { id: 'item_2', label: 'Archipelago B (3,4)', priceDisplay: 'Group 2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Island Node 0', priceDisplay: 'Node 0', value: 0, arrayIndex: 2 },
        { id: 'item_4', label: 'Island Node 3', priceDisplay: 'Node 3', value: 3, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 2,
      correctPairIds: ['item_1', 'item_2'],
      successMessage: 'Two separate island clusters — count = 2.',
      bridgeMessage: 'Union-Find: merge connected nodes; each separate root = 1 component.',
      hint: 'Select Archipelago A and Archipelago B.',
    },
    stepVisualizer: {
      title: 'Union-Find: merge connected nodes',
      description: 'Start with 5 separate islands (components=5). Each edge merges two islands. Final component count = 5 − merges.',
      steps: [
        {
          type: 'graph', label: 'Start: 5 isolated islands',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'},{id:'4',label:'4'}],
          visited: [], current: null, bfsQ: [],
          explanation: 'All 5 nodes isolated. Components = 5.',
        },
        {
          type: 'graph', label: 'Union(0,1) → components=4',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'},{id:'4',label:'4'}],
          visited: ['0','1'], current: null, bfsQ: [],
          explanation: 'Edge 0-1: union 0 and 1. They share a root. Components = 4.',
        },
        {
          type: 'graph', label: 'Union(1,2) → components=3',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'},{id:'4',label:'4'}],
          visited: ['0','1','2'], current: null, bfsQ: [],
          explanation: 'Edge 1-2: union 2 into same group as 0,1. Components = 3.',
        },
        {
          type: 'graph', label: 'Union(3,4) → components=2',
          nodes: [{id:'0',label:'0'},{id:'1',label:'1'},{id:'2',label:'2'},{id:'3',label:'3'},{id:'4',label:'4'}],
          visited: ['0','1','2','3','4'], current: null, bfsQ: [],
          explanation: 'Edge 3-4: union 3 and 4. Components = 2. Answer = 2 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Individual island', dsa: 'Graph node', example: 'Node 0' },
        { realWorld: 'Footbridge between islands', dsa: 'Undirected edge', example: 'edge(0,1)' },
        { realWorld: 'Island cluster', dsa: 'Connected component', example: '{0,1,2}' },
        { realWorld: 'Count of clusters', dsa: 'Component count', example: '2' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'EDGES [[0,1],[1,2],[3,4]]', arrayValues: ['Group {0,1,2}','Group {3,4}'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 2,
      question: 'Count total connected subgraphs.',
      formulaRealWorld: 'Cluster A {0,1,2} + Cluster B {3,4} = 2 groups',
      formulaDSA: 'Union-Find → 2 distinct roots',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Each union operation merges two islands — what remains separate = component count.',
      realWorldSummary: 'Disconnected island clusters = distinct components',
      dsaSummary: 'Union-Find O(N·α(N)) ≈ O(N) with path compression',
      finalNote: 'Start with n components. Each successful union reduces the count by 1.',
    },
  },

  /* ─────────────────────────────────────── 16. KTH SMALLEST BST ── */
  'kth-smallest-bst': {
    problemId: 'kth-smallest-bst',
    problemTitle: 'Kth Smallest Element in a BST',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Library shelves sorted by call number — inorder traversal reads them left-to-right in ascending order, so the kth book = kth smallest.',
    },
    scenario: {
      title: 'Sorted library shelves: find the 3rd smallest call number.',
      context: 'BST: [5,3,6,2,4,null,null,1]. Inorder=[1,2,3,4,5,6]. k=3 → value 3.',
      question: 'Select Book 3 (call number 3) — the 3rd book in inorder order.',
      target: { label: 'k=3 SMALLEST', unit: '', value: 3, display: 'BOOK 3 (RANK 3)' },
      items: [
        { id: 'item_1', label: 'Book 1 (rank 1)', priceDisplay: 'Rank 1: 1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Book 2 (rank 2)', priceDisplay: 'Rank 2: 2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Book 3 (TARGET)', priceDisplay: 'Rank 3: 3', value: 3, arrayIndex: 2 },
        { id: 'item_4', label: 'Book 5 (root)', priceDisplay: 'Rank 5: 5', value: 5, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_target_value', requiredCount: 1, targetValue: 3,
      correctPairIds: ['item_3'],
      successMessage: 'Book 3 (call number 3) is the 3rd smallest — inorder[k-1] = 3.',
      bridgeMessage: 'Inorder traversal of a BST always yields sorted ascending values.',
      hint: 'Select Book 3 — the 3rd in inorder sequence.',
    },
    stepVisualizer: {
      title: 'Inorder traversal of BST: count to k=3',
      description: 'BST inorder = sorted ascending. Visit nodes left→root→right, count until reaching kth.',
      steps: [
        {
          type: 'tree', label: 'Go to leftmost: 1',
          rows: [[{id:5,val:5}],[{id:3,val:3},{id:6,val:6}],[{id:2,val:2},{id:4,val:4},null,null],[{id:1,val:1},null,null,null]],
          highlight: [1], traversal: [],
          explanation: 'Go all the way left. Node 1 is leftmost (no left child). Visit it. Count=1.',
        },
        {
          type: 'tree', label: 'Visit 2: count=2',
          rows: [[{id:5,val:5}],[{id:3,val:3},{id:6,val:6}],[{id:2,val:2},{id:4,val:4},null,null],[{id:1,val:1},null,null,null]],
          highlight: [2], traversal: [1],
          explanation: 'Return to Node 2. Left subtree done. Visit Node 2. Count=2.',
        },
        {
          type: 'tree', label: 'Visit 3: count=3 → FOUND!',
          rows: [[{id:5,val:5}],[{id:3,val:3},{id:6,val:6}],[{id:2,val:2},{id:4,val:4},null,null]],
          highlight: [3], traversal: [1, 2],
          explanation: 'Return to Node 3 (left subtree = {1,2} done). Visit Node 3. Count=3=k → return 3 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Book on left shelf', dsa: 'Left subtree node', example: 'Node 1 (leftmost)' },
        { realWorld: 'Reading left-to-right', dsa: 'Inorder traversal', example: '[1,2,3,4,5,6]' },
        { realWorld: 'kth book in order', dsa: 'kth inorder node', example: 'k=3 → value 3' },
        { realWorld: 'Call number', dsa: 'Node value', example: 'node.val = 3' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INORDER BST', arrayValues: [1, 2, 3, 4, 5, 6],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 3,
      question: 'Return the kth (3rd) value in inorder traversal of the BST.',
      formulaRealWorld: '3rd book left-to-right = call number 3',
      formulaDSA: 'inorder[k-1] = inorder[2] = 3',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'Inorder BST = sorted list. kth smallest = kth inorder node.',
      realWorldSummary: '3rd book on sorted shelf = call number 3',
      dsaSummary: 'O(H+k) time — stop early once k is reached',
      finalNote: 'You don\'t have to collect all nodes — stop the moment your counter reaches k.',
    },
  },

  /* ─────────────────────────────────────── 17. TOP K FREQUENT ── */
  'top-k-frequent': {
    problemId: 'top-k-frequent',
    problemTitle: 'Top K Frequent Elements',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Radio chart: count every listener vote, then bucket-sort by vote count to retrieve the top k song IDs in O(N).',
    },
    scenario: {
      title: 'Radio votes: [1,1,1,2,2,3], k=2. Which songs get the most requests?',
      context: 'Song 1 → 3 votes, Song 2 → 2 votes, Song 3 → 1 vote. Top-2: [1, 2].',
      question: 'Select the top 2 most requested songs.',
      target: { label: 'TOP 2', unit: ' songs', value: '[1,2]', display: 'TOP 2 [1,2]' },
      items: [
        { id: 'item_1', label: 'Song 1 (3 votes)', priceDisplay: '1st (3)', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Song 2 (2 votes)', priceDisplay: '2nd (2)', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Song 3 (1 vote)', priceDisplay: '3rd (1)', value: 3, arrayIndex: 2 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: '[1,2]',
      correctPairIds: ['item_1', 'item_2'],
      successMessage: 'Song 1 (3 votes) and Song 2 (2 votes) are the top-2 most frequent.',
      bridgeMessage: 'Bucket sort by frequency: buckets[freq].push(element). Read from highest bucket.',
      hint: 'Select Song 1 and Song 2 — most votes.',
    },
    stepVisualizer: {
      title: 'Bucket sort by frequency for [1,1,1,2,2,3], k=2',
      description: 'Step 1: count frequencies. Step 2: bucket[freq].push(element). Step 3: read from highest bucket down until k elements found.',
      steps: [
        {
          type: 'array', label: 'Count frequencies',
          array: [1, 1, 1, 2, 2, 3], highlight: [0,1,2,3,4,5],
          explanation: 'HashMap: {1→3, 2→2, 3→1}. Song 1 appears 3 times, Song 2 twice, Song 3 once.',
        },
        {
          type: 'dp_table', label: 'Fill buckets',
          table: [[null,3,2,1]], colLabels: ['Freq 0','Freq 1','Freq 2','Freq 3'],
          rowLabels: ['songs'],
          highlight: [[0,1],[0,2],[0,3]],
          explanation: 'bucket[3]=[1], bucket[2]=[2], bucket[1]=[3]. Max freq bucket = 3.',
        },
        {
          type: 'array', label: 'Read top-2 from highest bucket',
          array: [1, 2], highlight: [0, 1],
          explanation: 'Read bucket[3]=[1] → 1 element. Read bucket[2]=[2] → 2 elements. k=2 reached. Answer: [1,2] ✓',
        },
      ],
      mapping: [
        { realWorld: 'Vote count per song', dsa: 'Frequency map', example: 'freq[1] = 3' },
        { realWorld: 'Chart position (by votes)', dsa: 'Bucket index = frequency', example: 'bucket[3] = [song1]' },
        { realWorld: 'Top-k chart winners', dsa: 'Read k from highest buckets', example: '[1,2]' },
        { realWorld: 'O(N) no-sort approach', dsa: 'Bucket sort', example: 'vs O(N log N) heap sort' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'VOTE TALLY', arrayValues: ['Song1:3','Song2:2','Song3:1'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: '[1,2]',
      question: 'Identify k elements with highest occurrence frequency.',
      formulaRealWorld: 'Song 1 (3 votes) > Song 2 (2) > Song 3 (1) → Top 2: [1,2]',
      formulaDSA: 'bucket[maxFreq..1] → first k elements',
      matchingIndices: [0, 1],
    },
    takeaway: {
      headline: 'Count, bucket, and read — O(N) vs sorting.',
      realWorldSummary: 'Radio chart ranks by vote count — highest bucket first',
      dsaSummary: 'Bucket sort: O(N) time, O(N) space',
      finalNote: 'Bucket sort exploits the fact that frequency ≤ N — so bucket array size is bounded.',
    },
  },

  /* ─────────────────────────────────────── 18. PRODUCT EXCEPT SELF ── */
  'product-except-self': {
    problemId: 'product-except-self',
    problemTitle: 'Product of Array Except Self',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Multi-gear drivetrain: each gear\'s output ratio = product of ALL other gears. Compute this with two passes — no division.',
    },
    scenario: {
      title: 'Gear ratio: output[i] = product of all gears except gear i.',
      context: 'Gears: [1,2,3,4]. output[0] = 2×3×4=24. output[3] = 1×2×3=6.',
      question: 'Select the output at position 0 (24) and position 3 (6).',
      target: { label: 'PRODUCTS', unit: '', value: '[24,12,8,6]', display: '[24,...,6]' },
      items: [
        { id: 'item_1', label: 'Gear 0 (size 1)', priceDisplay: 'Gear 0: 1', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Gear 1 (size 2)', priceDisplay: 'Gear 1: 2', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Output[0] = 24', priceDisplay: 'Res0: 24', value: 24, arrayIndex: 2 },
        { id: 'item_4', label: 'Output[3] = 6', priceDisplay: 'Res3: 6', value: 6, arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Prefix-Suffix',
      correctPairIds: ['item_3', 'item_4'],
      successMessage: 'output[0]=2×3×4=24 and output[3]=1×2×3=6.',
      bridgeMessage: 'Two passes: left prefix sweep, then right suffix sweep. output[i] = prefix[i] × suffix[i].',
      hint: 'Select Output[0]=24 and Output[3]=6.',
    },
    stepVisualizer: {
      title: 'Prefix × Suffix pass for [1,2,3,4]',
      description: 'Pass 1 (left→right): compute prefix product at each position. Pass 2 (right→left): multiply by suffix product.',
      steps: [
        {
          type: 'dp_table', label: 'Prefix products',
          table: [[1,1,2,6]], colLabels: ['idx 0','idx 1','idx 2','idx 3'],
          rowLabels: ['prefix'], highlight: [[0,0],[0,1],[0,2],[0,3]],
          explanation: 'prefix[0]=1 (nothing left), prefix[1]=1, prefix[2]=1×2=2, prefix[3]=1×2×3=6.',
        },
        {
          type: 'dp_table', label: 'Suffix products',
          table: [[24,12,4,1]], colLabels: ['idx 0','idx 1','idx 2','idx 3'],
          rowLabels: ['suffix'], highlight: [[0,0],[0,1],[0,2],[0,3]],
          explanation: 'suffix[3]=1, suffix[2]=4, suffix[1]=3×4=12, suffix[0]=2×3×4=24.',
        },
        {
          type: 'dp_table', label: 'output = prefix × suffix',
          table: [[24,12,8,6]], colLabels: ['idx 0','idx 1','idx 2','idx 3'],
          rowLabels: ['output'], highlight: [[0,0],[0,3]],
          explanation: 'output[i] = prefix[i] × suffix[i]. [1×24, 1×12, 2×4, 6×1] = [24,12,8,6] ✓',
        },
      ],
      mapping: [
        { realWorld: 'Gear size', dsa: 'nums[i]', example: 'nums = [1,2,3,4]' },
        { realWorld: 'All gears left of gear i', dsa: 'Prefix product', example: 'prefix[2] = 1×2 = 2' },
        { realWorld: 'All gears right of gear i', dsa: 'Suffix product', example: 'suffix[2] = 4' },
        { realWorld: 'Output ratio at gear i', dsa: 'prefix[i] × suffix[i]', example: 'output[2] = 2×4 = 8' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'INPUT ARRAY (nums)', arrayValues: [1, 2, 3, 4],
      targetLabel: 'REQUIRED OUTPUT', targetValue: '[24,12,8,6]',
      question: 'Compute answer[i] = product of all nums[j] where j≠i, in O(N) without division.',
      formulaRealWorld: 'Ratio at gear 0 = 2×3×4 = 24',
      formulaDSA: 'prefix[0]×suffix[0] = 1×24 = 24',
      matchingIndices: [0, 3],
    },
    takeaway: {
      headline: 'Two linear passes replace one expensive division.',
      realWorldSummary: 'Each gear output = everything to its left × everything to its right',
      dsaSummary: 'O(N) time, O(1) extra space (aside from output)',
      finalNote: 'The trick is realizing prefix × suffix gives every "except-self" product.',
    },
  },

  /* ─────────────────────────────────────── 19. SINGLE NUMBER ── */
  'single-number': {
    problemId: 'single-number',
    problemTitle: 'Single Number',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'Pairing socks: every sock with a pair cancels out when you XOR them — the lone unpaired sock remains.',
    },
    scenario: {
      title: 'Laundry basket: find the unpaired sock.',
      context: '[4,1,2,1,2]. Socks 1 and 2 each have a pair. Sock 4 is alone.',
      question: 'Select the lone unpaired sock.',
      target: { label: 'LONE SOCK', unit: '', value: 4, display: 'LONE SOCK = 4' },
      items: [
        { id: 'item_1', label: 'Pair (1,1)', priceDisplay: 'Pair (1,1)', value: 1, arrayIndex: 0 },
        { id: 'item_2', label: 'Pair (2,2)', priceDisplay: 'Pair (2,2)', value: 2, arrayIndex: 1 },
        { id: 'item_3', label: 'Lone Sock (4)', priceDisplay: 'Single (4)', value: 4, arrayIndex: 2 },
      ],
    },
    interaction: {
      type: 'select_target_value', requiredCount: 1, targetValue: 4,
      correctPairIds: ['item_3'],
      successMessage: 'Sock 4 is unpaired — XOR of all numbers leaves only 4.',
      bridgeMessage: 'XOR property: A ^ A = 0 (pairs cancel). A ^ 0 = A (lone remains).',
      hint: 'Select the lone unpaired sock (4).',
    },
    stepVisualizer: {
      title: 'XOR cancellation through [4,1,2,1,2]',
      description: 'XOR every number together. Pairs cancel (A^A=0). The unpaired number remains.',
      steps: [
        {
          type: 'array', label: 'XOR = 4',
          array: [4, 1, 2, 1, 2], highlight: [0],
          explanation: 'result = 0 ^ 4 = 4',
        },
        {
          type: 'array', label: 'XOR = 4^1 = 5',
          array: [4, 1, 2, 1, 2], highlight: [0, 1],
          explanation: 'result = 4 ^ 1 = 5',
        },
        {
          type: 'array', label: 'XOR = 5^2 = 7',
          array: [4, 1, 2, 1, 2], highlight: [0, 1, 2],
          explanation: 'result = 5 ^ 2 = 7',
        },
        {
          type: 'array', label: 'XOR = 7^1 = 6 (1 cancels)',
          array: [4, 1, 2, 1, 2], highlight: [0, 1, 2, 3],
          explanation: 'result = 7 ^ 1 = 6. The second 1 partially undoes the first.',
        },
        {
          type: 'array', label: 'XOR = 6^2 = 4 (2 cancels)',
          array: [4, 1, 2, 1, 2], highlight: [0, 1, 2, 3, 4],
          explanation: 'result = 6 ^ 2 = 4. The pair (2,2) fully cancelled. Only 4 remains. Answer = 4 ✓',
        },
      ],
      mapping: [
        { realWorld: 'Pair of identical socks', dsa: 'A ^ A = 0', example: '1 ^ 1 = 0' },
        { realWorld: 'Lone unpaired sock', dsa: 'A ^ 0 = A', example: '4 ^ 0 = 4' },
        { realWorld: 'Toss all socks in a basket XOR-style', dsa: 'XOR all elements', example: '4^1^2^1^2 = 4' },
        { realWorld: 'What is left after pairing', dsa: 'Final XOR result', example: '4' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'ARRAY [4,1,2,1,2]', arrayValues: [4, 1, 2, 1, 2],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 4,
      question: 'Find the single non-repeating element in O(N) time and O(1) space.',
      formulaRealWorld: 'Pairs (1,1) and (2,2) vanish → lone sock 4 remains',
      formulaDSA: '4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4',
      matchingIndices: [0, 2],
    },
    takeaway: {
      headline: 'XOR is the magic pairing eraser — O(1) space, O(N) time.',
      realWorldSummary: 'All matched pairs cancel, lone sock survives',
      dsaSummary: 'A^A=0, A^0=A — XOR all elements → only the singleton remains',
      finalNote: 'No HashMap needed. No sorting needed. One XOR loop does it all.',
    },
  },

  /* ─────────────────────────────────────── 20. WORD SEARCH ── */
  'word-search': {
    problemId: 'word-search',
    problemTitle: 'Word Search',
    intro: {
      tag: '03 · ANALOGY',
      subtitle: 'A detective steps across adjacent letter stones spelling a word — can never re-visit a stone already stepped on.',
    },
    scenario: {
      title: 'Letter-stone path: trace "ABCCED" on the grid.',
      context: 'Grid: [A,B,C,E],[S,F,C,S],[A,D,E,E]. Target: "ABCCED". Path: (0,0)→(0,1)→(0,2)→(1,2)→(2,2)→(2,1).',
      question: 'Select start stone "A" (0,0) and end stone "D" (2,1) to complete the path.',
      target: { label: 'WORD FOUND', unit: '', value: 'true', display: 'MATCHED (true)' },
      items: [
        { id: 'item_1', label: 'Start "A" (0,0)', priceDisplay: 'Step 1: A', value: 'A', arrayIndex: 0 },
        { id: 'item_2', label: 'Corner "C" (0,2)', priceDisplay: 'Step 3: C', value: 'C', arrayIndex: 1 },
        { id: 'item_3', label: 'Turn "C" (1,2)', priceDisplay: 'Step 4: C', value: 'C', arrayIndex: 2 },
        { id: 'item_4', label: 'End "D" (2,1)', priceDisplay: 'Step 6: D', value: 'D', arrayIndex: 3 },
      ],
    },
    interaction: {
      type: 'select_two_values', requiredCount: 2, targetValue: 'Path Start & End',
      correctPairIds: ['item_1', 'item_4'],
      successMessage: 'Path A(0,0)→B→C→C→E→D(2,1) spells "ABCCED" ✓',
      bridgeMessage: 'DFS + backtracking: mark cell visited, recurse neighbors, un-mark on backtrack.',
      hint: 'Select Start stone A at (0,0) and End stone D at (2,1).',
    },
    stepVisualizer: {
      title: 'DFS backtracking to spell "ABCCED"',
      description: 'Start at any cell matching word[0]. DFS to adjacent cells matching word[1], word[2]... Mark visited with "#", restore on backtrack.',
      steps: [
        {
          type: 'grid', label: 'Start at A (0,0)',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[0,0]], visited: [],
          explanation: 'word[0]="A". Found at (0,0). Mark visited. DFS neighbors for "B".',
        },
        {
          type: 'grid', label: 'Step to B (0,1)',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[0,1]], visited: [[0,0]],
          explanation: 'word[1]="B". Found at (0,1). Mark visited. DFS for "C".',
        },
        {
          type: 'grid', label: 'Step to C (0,2)',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[0,2]], visited: [[0,0],[0,1]],
          explanation: 'word[2]="C". Found at (0,2). Mark. DFS for second "C".',
        },
        {
          type: 'grid', label: 'Step to C (1,2)',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[1,2]], visited: [[0,0],[0,1],[0,2]],
          explanation: 'word[3]="C". Found at (1,2). Mark. DFS for "E".',
        },
        {
          type: 'grid', label: 'Step to E (2,2)',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[2,2]], visited: [[0,0],[0,1],[0,2],[1,2]],
          explanation: 'word[4]="E". Found at (2,2). Mark. DFS for "D".',
        },
        {
          type: 'grid', label: 'Step to D (2,1) → FOUND!',
          grid: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
          highlight: [[2,1]], visited: [[0,0],[0,1],[0,2],[1,2],[2,2]],
          explanation: 'word[5]="D". Found at (2,1). All 6 letters matched. Return true ✓',
        },
      ],
      mapping: [
        { realWorld: 'Letter stone on ground', dsa: 'Grid cell board[r][c]', example: 'board[0][0]="A"' },
        { realWorld: 'Step to adjacent stone', dsa: 'DFS to neighbor cell', example: '(0,0)→(0,1)' },
        { realWorld: 'Never re-step same stone', dsa: 'Mark cell visited "#"', example: 'board[r][c]="#"' },
        { realWorld: 'Backtrack: lift foot', dsa: 'Restore cell on return', example: 'board[r][c]=letter' },
      ],
    },
    dsaConnection: {
      title: 'Connecting Real World to DSA',
      arrayLabel: 'GRID PATH', arrayValues: ['(0,0)A','(0,1)B','(0,2)C','(1,2)C','(2,2)E','(2,1)D'],
      targetLabel: 'REQUIRED OUTPUT', targetValue: 'true',
      question: 'Does a sequential adjacent path spelling "ABCCED" exist in the grid?',
      formulaRealWorld: 'Stone path A→B→C→C→E→D = "ABCCED"',
      formulaDSA: '2D DFS backtracking matched "ABCCED" = true',
      matchingIndices: [0, 5],
    },
    takeaway: {
      headline: 'DFS explores a path; backtracking un-marks the path if it dead-ends.',
      realWorldSummary: 'Stepping stone footprint = DFS path; stepping back = backtrack',
      dsaSummary: 'O(N·4^L) worst case where L=word length',
      finalNote: 'The "never re-visit" rule is what makes it backtracking — you explore and undo.',
    },
  },
};

/**
 * Safe accessor — falls back to Two Sum analogy if ID not found.
 */
export function getAnalogyForProblem(problemId) {
  if (!problemId) return MOCK_ANALOGIES['two-sum'];
  return MOCK_ANALOGIES[problemId] || MOCK_ANALOGIES['two-sum'];
}

export default MOCK_ANALOGIES;
