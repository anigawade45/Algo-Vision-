export const MOCK_ALGORITHMS = {
  'two-sum': {
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Hash Map Lookup',
      subtitle: 'Use a Hash Map to find the complement instantly.',
    },
    strategy: {
      title: 'One-Pass Hash Map',
      summary: 'Store numbers in a map as you iterate. Check if (target - current) is already in the map.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'A Hash Map turns a slow O(N) pair search into an instant O(1) lookup.',
    },
    steps: [
      { stepNo: '01', title: 'Init Map', description: 'Create an empty Hash Map.' },
      { stepNo: '02', title: 'Iterate', description: 'Loop through the array.' },
      { stepNo: '03', title: 'Check Map', description: 'If (target - num) is in map, return indices.' },
      { stepNo: '04', title: 'Save Num', description: 'Otherwise, save num and its index to the map.' }
    ],
    flowchart: {
      title: 'Two Sum Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'map = {}', codeSnippet: 'const map = new Map();', state: { map: '{}' } },
        { id: 'loop', type: 'decision', label: 'MORE?', title: 'Loop', description: 'Check array', codeSnippet: 'for(let i=0; i<nums.length; i++)', yesNextId: 'check', noNextId: 'end', state: { map: '...' } },
        { id: 'check', type: 'decision', label: 'IN MAP?', title: 'Check', description: 'Map has complement?', codeSnippet: 'if(map.has(target-nums[i]))', yesNextId: 'found', noNextId: 'add', state: { map: '...' } },
        { id: 'add', type: 'process', label: 'ADD', title: 'Save', description: 'Save to map', codeSnippet: 'map.set(nums[i], i);', nextId: 'loop', state: { map: 'Added' } },
        { id: 'found', type: 'end', label: 'RETURN', title: 'Found', description: 'Return indices', codeSnippet: 'return [map.get(comp), i];', state: { result: '[i, j]' } },
        { id: 'end', type: 'end', label: 'END', title: 'Fail', description: 'Return empty', codeSnippet: 'return [];', state: { result: '[]' } }
      ],
      executionPath: ['start', 'loop', 'check', 'add', 'loop', 'check', 'found']
    },
    exampleWalkthrough: {
      input: 'nums=[2,7,11,15], target=9',
      steps: [
        { action: 'Num 2', explanation: 'Complement 7 not in map. Map: {2: 0}' },
        { action: 'Num 7', explanation: 'Complement 2 IS in map! Return [0, 1].' }
      ],
      result: '[0, 1]'
    },
    codeConnection: [
      { step: 'Check map', code: 'if(map.has(target-num)) return [map.get(target-num), i];' }
    ]
  },
  
  'valid-parentheses': {
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'LIFO Stack',
      subtitle: 'Use a Stack to track opening brackets.',
    },
    strategy: {
      title: 'Stack Push-Pop',
      summary: 'Push open brackets onto a stack. For closing brackets, pop the stack and check if they match.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'A Last-In-First-Out (LIFO) stack perfectly enforces nested rules.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Create an empty stack.' },
      { stepNo: '02', title: 'Push Open', description: 'If bracket is open, push it.' },
      { stepNo: '03', title: 'Match Close', description: 'If closed, pop stack and check for mismatch.' },
      { stepNo: '04', title: 'Final Check', description: 'Return true if stack is empty at the end.' }
    ],
    flowchart: {
      title: 'Stack Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'stack = []', codeSnippet: 'let stack = [];', state: { stack: '[]' } },
        { id: 'loop', type: 'decision', label: 'MORE?', title: 'Loop', description: 'Iterate string', codeSnippet: 'for(let char of s)', yesNextId: 'is_open', noNextId: 'check_empty', state: { stack: '...' } },
        { id: 'is_open', type: 'decision', label: 'OPEN?', title: 'Check', description: 'Is open bracket?', codeSnippet: 'if(isOpen(c))', yesNextId: 'push', noNextId: 'pop', state: { char: 'c' } },
        { id: 'push', type: 'process', label: 'PUSH', title: 'Push', description: 'Add to stack', codeSnippet: 'stack.push(c);', nextId: 'loop', state: { stack: 'Added' } },
        { id: 'pop', type: 'decision', label: 'MATCH?', title: 'Match', description: 'Matches top?', codeSnippet: 'if(stack.pop() !== map[c])', yesNextId: 'loop', noNextId: 'fail', state: { stack: 'Popped' } },
        { id: 'fail', type: 'end', label: 'FALSE', title: 'Invalid', description: 'Return false', codeSnippet: 'return false;', state: { result: 'false' } },
        { id: 'check_empty', type: 'decision', label: 'EMPTY?', title: 'Empty?', description: 'stack.length==0?', codeSnippet: 'return stack.length === 0;', yesNextId: 'success', noNextId: 'fail', state: { stack: '[]' } },
        { id: 'success', type: 'end', label: 'TRUE', title: 'Valid', description: 'Return true', codeSnippet: 'return true;', state: { result: 'true' } }
      ],
      executionPath: ['start', 'loop', 'is_open', 'push', 'loop', 'is_open', 'pop', 'loop', 'check_empty', 'success']
    },
    exampleWalkthrough: {
      input: 's = "([])"',
      steps: [
        { action: 'Read "("', explanation: 'Push. Stack: ["("]' },
        { action: 'Read "["', explanation: 'Push. Stack: ["(", "["]' },
        { action: 'Read "]"', explanation: 'Matches "[". Pop. Stack: ["("]' },
        { action: 'Read ")"', explanation: 'Matches "(". Pop. Stack: []' }
      ],
      result: 'true'
    },
    codeConnection: [
      { step: 'Mismatch check', code: 'if (stack.pop() !== match[char]) return false;' }
    ]
  },

  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    problemTitle: 'Reverse Linked List',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Three-Pointer Reversal',
      subtitle: 'Use prev, curr, and next to flip links iteratively.',
    },
    strategy: {
      title: 'Iterative Link Flip',
      summary: 'Traverse the list. Save the next node, flip the current node\'s pointer to prev, then advance all pointers.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'Always save `curr.next` before overwriting it.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'prev = null, curr = head.' },
      { stepNo: '02', title: 'Save Next', description: 'nextTemp = curr.next' },
      { stepNo: '03', title: 'Flip', description: 'curr.next = prev' },
      { stepNo: '04', title: 'Advance', description: 'prev = curr, curr = nextTemp' }
    ],
    flowchart: {
      title: 'Reverse Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'prev=null, curr=head', codeSnippet: 'let prev=null, curr=head;', state: { prev: 'null', curr: 'head' } },
        { id: 'loop', type: 'decision', label: 'CURR?', title: 'Loop', description: 'curr != null?', codeSnippet: 'while(curr !== null)', yesNextId: 'save', noNextId: 'end', state: { curr: 'Valid' } },
        { id: 'save', type: 'process', label: 'SAVE', title: 'Save', description: 'next = curr.next', codeSnippet: 'let next = curr.next;', nextId: 'flip', state: { next: 'curr.next' } },
        { id: 'flip', type: 'process', label: 'FLIP', title: 'Reverse', description: 'curr.next = prev', codeSnippet: 'curr.next = prev;', nextId: 'adv', state: { currNext: 'prev' } },
        { id: 'adv', type: 'process', label: 'ADVANCE', title: 'Move', description: 'prev=curr, curr=next', codeSnippet: 'prev=curr; curr=next;', nextId: 'loop', state: { prev: 'curr', curr: 'next' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return prev', codeSnippet: 'return prev;', state: { result: 'prev' } }
      ],
      executionPath: ['start', 'loop', 'save', 'flip', 'adv', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: '1 -> 2 -> 3',
      steps: [
        { action: 'curr = 1', explanation: 'Save 2. 1 points to null. prev=1, curr=2.' },
        { action: 'curr = 2', explanation: 'Save 3. 2 points to 1. prev=2, curr=3.' },
        { action: 'curr = 3', explanation: 'Save null. 3 points to 2. prev=3, curr=null.' }
      ],
      result: '3 -> 2 -> 1'
    },
    codeConnection: [
      { step: 'Reverse pointer', code: 'curr.next = prev;' }
    ]
  },
  
  'binary-tree-inorder': {
    problemId: 'binary-tree-inorder',
    problemTitle: 'Binary Tree Inorder',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Recursive DFS',
      subtitle: 'Visit left, then root, then right.',
    },
    strategy: {
      title: 'Left-Root-Right',
      summary: 'Recursively traverse the left subtree, record the current node, then traverse the right subtree.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'Inorder places the root strictly in the middle of left and right.',
    },
    steps: [
      { stepNo: '01', title: 'Base', description: 'If node is null, return.' },
      { stepNo: '02', title: 'Left', description: 'Recursively call left child.' },
      { stepNo: '03', title: 'Root', description: 'Add node value to result.' },
      { stepNo: '04', title: 'Right', description: 'Recursively call right child.' }
    ],
    flowchart: {
      title: 'DFS Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'DFS', description: 'dfs(root)', codeSnippet: 'dfs(root);', state: { node: 'root' } },
        { id: 'base', type: 'decision', label: 'NULL?', title: 'Check Null', description: 'Is node null?', codeSnippet: 'if(!node) return;', yesNextId: 'ret', noNextId: 'left', state: { node: '...' } },
        { id: 'left', type: 'process', label: 'LEFT', title: 'Go Left', description: 'dfs(node.left)', codeSnippet: 'dfs(node.left);', nextId: 'root', state: { action: 'Left' } },
        { id: 'root', type: 'process', label: 'VALUE', title: 'Save Val', description: 'res.push(node.val)', codeSnippet: 'res.push(node.val);', nextId: 'right', state: { result: 'Added' } },
        { id: 'right', type: 'process', label: 'RIGHT', title: 'Go Right', description: 'dfs(node.right)', codeSnippet: 'dfs(node.right);', nextId: 'ret', state: { action: 'Right' } },
        { id: 'ret', type: 'end', label: 'RETURN', title: 'Done', description: 'Return', codeSnippet: 'return;', state: { status: 'Done' } }
      ],
      executionPath: ['start', 'base', 'left', 'root', 'right', 'ret']
    },
    exampleWalkthrough: {
      input: 'Root=1, Right=2, Left of 2=3',
      steps: [
        { action: 'dfs(1)', explanation: 'Left is null. Add 1. Go Right to 2.' },
        { action: 'dfs(2)', explanation: 'Left is 3. Go left.' },
        { action: 'dfs(3)', explanation: 'Left is null. Add 3. Right is null. Return.' },
        { action: 'Back to 2', explanation: 'Add 2. Right is null. Return.' }
      ],
      result: '[1, 3, 2]'
    },
    codeConnection: [
      { step: 'Traverse left', code: 'dfs(node.left);' }
    ]
  },
  
  'number-of-islands': {
    problemId: 'number-of-islands',
    problemTitle: 'Number of Islands',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Grid DFS',
      subtitle: 'Sink connected lands to count islands accurately.',
    },
    strategy: {
      title: 'Flood Fill',
      summary: 'Scan the grid. When you find "1" (land), increment the count and use DFS to turn all connected "1"s into "0"s.',
      timeComplexity: 'O(M × N)',
      spaceComplexity: 'O(M × N)',
      keyInsight: 'Sinking (modifying grid) acts as an automatic visited tracker.',
    },
    steps: [
      { stepNo: '01', title: 'Scan', description: 'Loop over all grid cells.' },
      { stepNo: '02', title: 'Check', description: 'If cell is "1", count++.' },
      { stepNo: '03', title: 'DFS Sink', description: 'Run DFS to change adjacent "1"s to "0"s.' },
      { stepNo: '04', title: 'Return', description: 'Return the total count.' }
    ],
    flowchart: {
      title: 'Grid Traversal Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'count=0', codeSnippet: 'let count=0;', state: { count: 0 } },
        { id: 'loop', type: 'decision', label: 'CELLS?', title: 'Loop Grid', description: 'Check cells', codeSnippet: 'for(let r... for let c...)', yesNextId: 'check', noNextId: 'end', state: { cell: '...' } },
        { id: 'check', type: 'decision', label: 'IS "1"?', title: 'Check Land', description: 'cell == 1?', codeSnippet: 'if(grid[r][c] === "1")', yesNextId: 'dfs', noNextId: 'loop', state: { cell: '1' } },
        { id: 'dfs', type: 'process', label: 'SINK (DFS)', title: 'Sink', description: 'count++; dfs()', codeSnippet: 'count++; dfs(r, c);', nextId: 'loop', state: { count: 'count++' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return count', codeSnippet: 'return count;', state: { result: 'count' } }
      ],
      executionPath: ['start', 'loop', 'check', 'dfs', 'loop', 'check', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: 'grid = [["1","1","0"], ["0","0","1"]]',
      steps: [
        { action: '(0,0) is 1', explanation: 'Count = 1. DFS sinks (0,0) and (0,1).' },
        { action: '(1,2) is 1', explanation: 'Count = 2. DFS sinks (1,2).' }
      ],
      result: '2'
    },
    codeConnection: [
      { step: 'Sink land', code: 'grid[r][c] = "0";' }
    ]
  },
  
  'kth-largest-element': {
    problemId: 'kth-largest-element',
    problemTitle: 'Kth Largest Element',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Min-Heap',
      subtitle: 'Keep a Heap of size K to gatekeep the largest elements.',
    },
    strategy: {
      title: 'Size-K Heap',
      summary: 'Add numbers to a Min-Heap. If the heap grows larger than K, pop the smallest. The Kth largest remains at the root.',
      timeComplexity: 'O(N log K)',
      spaceComplexity: 'O(K)',
      keyInsight: 'A Min-Heap naturally pushes the smallest items out when restricted to size K.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Create a Min-Heap.' },
      { stepNo: '02', title: 'Push', description: 'Add each array number to the heap.' },
      { stepNo: '03', title: 'Pop', description: 'If size > K, remove the smallest element.' },
      { stepNo: '04', title: 'Return', description: 'Return the heap root.' }
    ],
    flowchart: {
      title: 'Heap Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'heap = []', codeSnippet: 'let heap = new MinHeap();', state: { heap: '[]' } },
        { id: 'loop', type: 'decision', label: 'NUMS?', title: 'Loop', description: 'Iterate nums', codeSnippet: 'for(let num of nums)', yesNextId: 'push', noNextId: 'end', state: { num: '...' } },
        { id: 'push', type: 'process', label: 'PUSH', title: 'Add', description: 'Add num', codeSnippet: 'heap.enqueue(num);', nextId: 'check', state: { heap: 'Added' } },
        { id: 'check', type: 'decision', label: 'SIZE > K?', title: 'Check Size', description: 'Size > K?', codeSnippet: 'if(heap.size() > k)', yesNextId: 'pop', noNextId: 'loop', state: { size: '...' } },
        { id: 'pop', type: 'process', label: 'POP', title: 'Remove', description: 'Pop smallest', codeSnippet: 'heap.dequeue();', nextId: 'loop', state: { heap: 'Popped' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return root', codeSnippet: 'return heap.front();', state: { result: 'Root' } }
      ],
      executionPath: ['start', 'loop', 'push', 'check', 'pop', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: 'nums=[3,2,1,5], k=2',
      steps: [
        { action: 'Add 3, 2', explanation: 'Heap: [2, 3]' },
        { action: 'Add 1', explanation: 'Heap: [1, 2, 3]. Size > 2, pop 1. Heap: [2, 3]' },
        { action: 'Add 5', explanation: 'Heap: [2, 3, 5]. Size > 2, pop 2. Heap: [3, 5]' }
      ],
      result: '3'
    },
    codeConnection: [
      { step: 'Maintain size K', code: 'if(heap.size() > k) heap.dequeue();' }
    ]
  },
  
  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    problemTitle: 'Sliding Window Max',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Monotonic Deque',
      subtitle: 'Keep a strictly decreasing queue of indices.',
    },
    strategy: {
      title: 'Decreasing Queue',
      summary: 'Use a Deque. Remove smaller elements from the back (they are useless). Remove old elements from the front (out of window). The front is always the max.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(K)',
      keyInsight: 'If a new number is larger than older ones, older ones can never be the max.',
    },
    steps: [
      { stepNo: '01', title: 'Clean Back', description: 'Pop elements smaller than current.' },
      { stepNo: '02', title: 'Push', description: 'Add current index.' },
      { stepNo: '03', title: 'Clean Front', description: 'Pop front if it fell out of the window.' },
      { stepNo: '04', title: 'Record', description: 'Save the front element as the window max.' }
    ],
    flowchart: {
      title: 'Deque Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'q = []', codeSnippet: 'let q = [];', state: { q: '[]' } },
        { id: 'loop', type: 'decision', label: 'ITEMS?', title: 'Loop', description: 'Process array', codeSnippet: 'for(let i=0; i<nums.length; i++)', yesNextId: 'clean_b', noNextId: 'end', state: { i: 0 } },
        { id: 'clean_b', type: 'process', label: 'POP SMALL', title: 'Clean Back', description: 'Pop smaller', codeSnippet: 'while(nums[q.back] <= nums[i]) pop();', nextId: 'push', state: { q: 'Decreasing' } },
        { id: 'push', type: 'process', label: 'PUSH', title: 'Add idx', description: 'q.push(i)', codeSnippet: 'q.push(i);', nextId: 'clean_f', state: { q: 'Added' } },
        { id: 'clean_f', type: 'process', label: 'POP OLD', title: 'Clean Front', description: 'Pop if old', codeSnippet: 'if(q[0] < i-k+1) shift();', nextId: 'rec', state: { q: 'Valid' } },
        { id: 'rec', type: 'process', label: 'RECORD', title: 'Save Max', description: 'Save front', codeSnippet: 'if(i >= k-1) res.push(nums[q[0]]);', nextId: 'loop', state: { res: 'Max saved' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return res', codeSnippet: 'return res;', state: { result: 'res' } }
      ],
      executionPath: ['start', 'loop', 'clean_b', 'push', 'clean_f', 'rec', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: 'nums=[1,3,-1], k=2',
      steps: [
        { action: 'Num 1', explanation: 'q = [0]. Window not full.' },
        { action: 'Num 3', explanation: '3 > 1, pop 0. q = [1]. Max = 3.' },
        { action: 'Num -1', explanation: '-1 < 3. q = [1, 2]. Max = 3.' }
      ],
      result: '[3, 3]'
    },
    codeConnection: [
      { step: 'Remove useless', code: 'while (q.length && nums[q.at(-1)] <= nums[i]) q.pop();' }
    ]
  },
  
  'merge-intervals': {
    problemId: 'merge-intervals',
    problemTitle: 'Merge Intervals',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Sort and Merge',
      subtitle: 'Sort by start time, then merge overlaps linearly.',
    },
    strategy: {
      title: 'Greedy Overlap Check',
      summary: 'Sort intervals. Compare current interval to the last merged one. If they overlap (curr.start <= last.end), merge them. Else, add as new.',
      timeComplexity: 'O(N log N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'Sorting guarantees that overlapping intervals are right next to each other.',
    },
    steps: [
      { stepNo: '01', title: 'Sort', description: 'Sort intervals by start time.' },
      { stepNo: '02', title: 'Init', description: 'Add the first interval to results.' },
      { stepNo: '03', title: 'Compare', description: 'If curr.start <= last.end, update last.end = max(ends).' },
      { stepNo: '04', title: 'Add', description: 'Otherwise, add current to results.' }
    ],
    flowchart: {
      title: 'Merge Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'SORT', title: 'Sort', description: 'Sort array', codeSnippet: 'arr.sort((a,b)=>a[0]-b[0])', state: { arr: 'Sorted' } },
        { id: 'loop', type: 'decision', label: 'MORE?', title: 'Loop', description: 'Iterate', codeSnippet: 'for(let i=1; i<arr.length; i++)', yesNextId: 'check', noNextId: 'end', state: { i: '...' } },
        { id: 'check', type: 'decision', label: 'OVERLAP?', title: 'Check', description: 'start <= end?', codeSnippet: 'if(curr[0] <= last[1])', yesNextId: 'merge', noNextId: 'add', state: { check: '...' } },
        { id: 'merge', type: 'process', label: 'MERGE', title: 'Update', description: 'last[1] = max', codeSnippet: 'last[1] = max(last[1], curr[1])', nextId: 'loop', state: { res: 'Merged' } },
        { id: 'add', type: 'process', label: 'ADD', title: 'Push', description: 'res.push(curr)', codeSnippet: 'res.push(curr)', nextId: 'loop', state: { res: 'Added' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return res', codeSnippet: 'return res;', state: { result: 'res' } }
      ],
      executionPath: ['start', 'loop', 'check', 'merge', 'loop', 'check', 'add', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: '[[1,3], [2,6], [8,10]]',
      steps: [
        { action: '[2,6]', explanation: 'Start 2 <= End 3. Merge: [1, 6].' },
        { action: '[8,10]', explanation: 'Start 8 > End 6. Add as new.' }
      ],
      result: '[[1,6], [8,10]]'
    },
    codeConnection: [
      { step: 'Merge operation', code: 'last[1] = Math.max(last[1], curr[1]);' }
    ]
  },
  
  'longest-substring-no-repeat': {
    problemId: 'longest-substring-no-repeat',
    problemTitle: 'Longest Substring',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Sliding Window',
      subtitle: 'Use two pointers to track a valid unique window.',
    },
    strategy: {
      title: 'Window + Set',
      summary: 'Expand the right pointer. If a duplicate is in the Set, shrink the left pointer until the duplicate is gone. Track the max window size.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'A Set enables instant duplicate checking.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Set left = 0, maxLength = 0, create a Set.' },
      { stepNo: '02', title: 'Expand', description: 'Iterate right pointer over string.' },
      { stepNo: '03', title: 'Shrink', description: 'While s[right] is in Set, delete s[left] and left++.' },
      { stepNo: '04', title: 'Record', description: 'Add s[right] to Set. Update maxLength.' }
    ],
    flowchart: {
      title: 'Window Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'Set, l=0, max=0', codeSnippet: 'let set = new Set();', state: { max: 0 } },
        { id: 'loop', type: 'decision', label: 'CHARS?', title: 'Loop', description: 'Move right', codeSnippet: 'for(let r=0; r<s.length; r++)', yesNextId: 'check', noNextId: 'end', state: { r: '...' } },
        { id: 'check', type: 'decision', label: 'IN SET?', title: 'Check', description: 'Has duplicate?', codeSnippet: 'while(set.has(s[r]))', yesNextId: 'shrink', noNextId: 'add', state: { char: '...' } },
        { id: 'shrink', type: 'process', label: 'SHRINK', title: 'Move Left', description: 'Delete left, l++', codeSnippet: 'set.delete(s[l]); l++;', nextId: 'check', state: { l: 'l++' } },
        { id: 'add', type: 'process', label: 'ADD', title: 'Add & Max', description: 'Add char, update max', codeSnippet: 'set.add(s[r]); max=Math.max(...)', nextId: 'loop', state: { max: 'Updated' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return max', codeSnippet: 'return max;', state: { result: 'max' } }
      ],
      executionPath: ['start', 'loop', 'check', 'shrink', 'check', 'add', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: '"abcabc"',
      steps: [
        { action: 'a, b, c', explanation: 'Set: {a, b, c}. Max = 3.' },
        { action: 'Second a', explanation: 'Delete left (a). Add new a. Max = 3.' }
      ],
      result: '3'
    },
    codeConnection: [
      { step: 'Shrink window', code: 'while(set.has(s[r])) { set.delete(s[l]); l++; }' }
    ]
  },
  
  'shortest-path-graph': {
    problemId: 'shortest-path-graph',
    problemTitle: 'Shortest Path BFS',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Breadth-First Search',
      subtitle: 'Explore level by level to find the shortest path.',
    },
    strategy: {
      title: 'Queue BFS',
      summary: 'Use a Queue. Start with source node at distance 0. For each node, if it is the destination, return distance. Else, enqueue its unvisited neighbors with distance + 1.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      keyInsight: 'BFS expands uniformly; the first time you reach a node, it is guaranteed to be the shortest path.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Queue = [[start, 0]]. Visited set = {start}.' },
      { stepNo: '02', title: 'Pop', description: 'Pop the front node.' },
      { stepNo: '03', title: 'Check Target', description: 'If it is destination, return distance.' },
      { stepNo: '04', title: 'Neighbors', description: 'Enqueue unvisited neighbors with distance + 1.' }
    ],
    flowchart: {
      title: 'BFS Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init Q', description: 'Q=[[s,0]]', codeSnippet: 'let q=[[start,0]];', state: { q: '[[start,0]]' } },
        { id: 'loop', type: 'decision', label: 'Q EMPTY?', title: 'Loop', description: 'While q length', codeSnippet: 'while(q.length)', yesNextId: 'pop', noNextId: 'end_fail', state: { q: '...' } },
        { id: 'pop', type: 'process', label: 'POP', title: 'Pop', description: 'Pop front', codeSnippet: 'let [curr, dist] = q.shift();', nextId: 'check', state: { curr: '...' } },
        { id: 'check', type: 'decision', label: 'TARGET?', title: 'Target?', description: 'curr == target?', codeSnippet: 'if(curr === dest) return dist;', yesNextId: 'end_ok', noNextId: 'push', state: { curr: '...' } },
        { id: 'push', type: 'process', label: 'ENQUEUE', title: 'Neighbors', description: 'Push neighbors', codeSnippet: 'q.push([n, dist+1]);', nextId: 'loop', state: { q: 'Updated' } },
        { id: 'end_ok', type: 'end', label: 'RETURN', title: 'Found', description: 'Return dist', codeSnippet: 'return dist;', state: { result: 'dist' } },
        { id: 'end_fail', type: 'end', label: 'FAIL', title: 'Not Found', description: 'Return -1', codeSnippet: 'return -1;', state: { result: '-1' } }
      ],
      executionPath: ['start', 'loop', 'pop', 'check', 'push', 'loop', 'pop', 'check', 'end_ok']
    },
    exampleWalkthrough: {
      input: 'edges: 0-1, 1-2. target: 2',
      steps: [
        { action: 'Pop 0', explanation: 'Add neighbor 1 with dist 1.' },
        { action: 'Pop 1', explanation: 'Add neighbor 2 with dist 2.' },
        { action: 'Pop 2', explanation: 'Target found! Return dist 2.' }
      ],
      result: '2'
    },
    codeConnection: [
      { step: 'Check destination', code: 'if(curr === destination) return dist;' }
    ]
  },
  
  'climbing-stairs': {
    problemId: 'climbing-stairs',
    problemTitle: 'Climbing Stairs',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Dynamic Programming',
      subtitle: 'Sum the ways from the previous two steps.',
    },
    strategy: {
      title: 'Fibonacci Sequence',
      summary: 'To reach step i, you must jump from i-1 or i-2. Therefore, ways(i) = ways(i-1) + ways(i-2). Just track the last two numbers.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'You only need to store the previous two values, saving O(N) space.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'prev1 = 1, prev2 = 1.' },
      { stepNo: '02', title: 'Iterate', description: 'Loop from step 2 to N.' },
      { stepNo: '03', title: 'Sum', description: 'curr = prev1 + prev2.' },
      { stepNo: '04', title: 'Shift', description: 'prev2 = prev1, prev1 = curr.' }
    ],
    flowchart: {
      title: 'DP Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'p1=1, p2=1', codeSnippet: 'let p1=1, p2=1;', state: { p1: 1, p2: 1 } },
        { id: 'loop', type: 'decision', label: 'i<=N?', title: 'Loop', description: 'Iterate steps', codeSnippet: 'for(let i=2; i<=n; i++)', yesNextId: 'calc', noNextId: 'end', state: { i: 2 } },
        { id: 'calc', type: 'process', label: 'SUM', title: 'Sum', description: 'curr = p1 + p2', codeSnippet: 'let curr = p1 + p2;', nextId: 'shift', state: { curr: 2 } },
        { id: 'shift', type: 'process', label: 'SHIFT', title: 'Shift', description: 'p2=p1, p1=curr', codeSnippet: 'p2=p1; p1=curr;', nextId: 'loop', state: { p1: 2, p2: 1 } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return p1', codeSnippet: 'return p1;', state: { result: 'p1' } }
      ],
      executionPath: ['start', 'loop', 'calc', 'shift', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: 'n=3',
      steps: [
        { action: 'i=2', explanation: 'curr = 1 + 1 = 2. p2=1, p1=2.' },
        { action: 'i=3', explanation: 'curr = 2 + 1 = 3. p2=2, p1=3.' }
      ],
      result: '3'
    },
    codeConnection: [
      { step: 'State transition', code: 'let curr = prev1 + prev2;' }
    ]
  },

  'house-robber': {
    problemId: 'house-robber',
    problemTitle: 'House Robber',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Iterative DP',
      subtitle: 'Decide whether to rob or skip the current house.',
    },
    strategy: {
      title: '1D DP State',
      summary: 'At house i, max loot = max(rob house i + loot from i-2, skip house i + loot from i-1). Track only the last two maximums.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'The choice at house i only depends on the optimal choices at i-1 and i-2.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'rob1 = 0, rob2 = 0.' },
      { stepNo: '02', title: 'Iterate', description: 'Loop through each house loot.' },
      { stepNo: '03', title: 'Decide', description: 'curr = max(loot + rob1, rob2).' },
      { stepNo: '04', title: 'Shift', description: 'rob1 = rob2; rob2 = curr.' }
    ],
    flowchart: {
      title: 'Robber Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'r1=0, r2=0', codeSnippet: 'let r1=0, r2=0;', state: { r1: 0, r2: 0 } },
        { id: 'loop', type: 'decision', label: 'HOUSES?', title: 'Loop', description: 'Iterate', codeSnippet: 'for(let n of nums)', yesNextId: 'calc', noNextId: 'end', state: { n: '...' } },
        { id: 'calc', type: 'process', label: 'MAX', title: 'Max', description: 'curr = max(n+r1, r2)', codeSnippet: 'let curr = Math.max(n+r1, r2);', nextId: 'shift', state: { curr: '...' } },
        { id: 'shift', type: 'process', label: 'SHIFT', title: 'Shift', description: 'r1=r2, r2=curr', codeSnippet: 'r1=r2; r2=curr;', nextId: 'loop', state: { r1: '...', r2: '...' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return r2', codeSnippet: 'return r2;', state: { result: 'r2' } }
      ],
      executionPath: ['start', 'loop', 'calc', 'shift', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: '[2, 7, 9]',
      steps: [
        { action: 'n=2', explanation: 'curr = max(2+0, 0) = 2. r1=0, r2=2.' },
        { action: 'n=7', explanation: 'curr = max(7+0, 2) = 7. r1=2, r2=7.' },
        { action: 'n=9', explanation: 'curr = max(9+2, 7) = 11. r1=7, r2=11.' }
      ],
      result: '11'
    },
    codeConnection: [
      { step: 'Take max', code: 'let curr = Math.max(n + rob1, rob2);' }
    ]
  },

  'subsets': {
    problemId: 'subsets',
    problemTitle: 'Subsets',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Backtracking',
      subtitle: 'Build subsets element by element.',
    },
    strategy: {
      title: 'Include or Exclude',
      summary: 'For every element, branch into two paths: include it in the current subset, or exclude it.',
      timeComplexity: 'O(N * 2^N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'Every element is a binary yes/no choice, perfectly generating 2^N subsets.',
    },
    steps: [
      { stepNo: '01', title: 'Base Case', description: 'If index == length, save a copy of the subset.' },
      { stepNo: '02', title: 'Include', description: 'Add current element, recurse to next index.' },
      { stepNo: '03', title: 'Exclude', description: 'Pop current element, recurse to next index.' }
    ],
    flowchart: {
      title: 'DFS Backtracking Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'DFS(0)', description: 'dfs(0, [])', codeSnippet: 'dfs(0, []);', state: { path: '[]' } },
        { id: 'base', type: 'decision', label: 'i==N?', title: 'Base', description: 'End of array?', codeSnippet: 'if(i === nums.length)', yesNextId: 'save', noNextId: 'inc', state: { i: '...' } },
        { id: 'save', type: 'process', label: 'SAVE', title: 'Save', description: 'res.push(path)', codeSnippet: 'res.push([...path]);', nextId: 'ret', state: { res: 'Added' } },
        { id: 'inc', type: 'process', label: 'INCLUDE', title: 'Include', description: 'path.push; dfs(i+1)', codeSnippet: 'path.push(nums[i]); dfs(i+1);', nextId: 'exc', state: { path: 'Added' } },
        { id: 'exc', type: 'process', label: 'EXCLUDE', title: 'Exclude', description: 'path.pop; dfs(i+1)', codeSnippet: 'path.pop(); dfs(i+1);', nextId: 'ret', state: { path: 'Popped' } },
        { id: 'ret', type: 'end', label: 'RETURN', title: 'Backtrack', description: 'Return up', codeSnippet: 'return;', state: { status: 'Back' } }
      ],
      executionPath: ['start', 'base', 'inc', 'base', 'save', 'ret', 'exc', 'ret']
    },
    exampleWalkthrough: {
      input: '[1, 2]',
      steps: [
        { action: 'Include 1', explanation: 'Path: [1].' },
        { action: 'Include 2', explanation: 'Path: [1, 2]. Base case reached, save it.' },
        { action: 'Exclude 2', explanation: 'Pop 2. Path: [1]. Base case reached, save it.' }
      ],
      result: '[[1,2], [1], ...]'
    },
    codeConnection: [
      { step: 'Backtrack pop', code: 'path.pop(); dfs(i + 1);' }
    ]
  },
  
  'course-schedule': {
    problemId: 'course-schedule',
    problemTitle: 'Course Schedule',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Cycle Detection',
      subtitle: 'Use DFS to detect dependency cycles.',
    },
    strategy: {
      title: '3-State DFS',
      summary: 'Track node states: 0=unvisited, 1=visiting, 2=visited. If DFS hits a node with state 1, a cycle exists.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V + E)',
      keyInsight: 'A node currently in the recursion stack (state 1) means it depends on itself.',
    },
    steps: [
      { stepNo: '01', title: 'Build Graph', description: 'Create adjacency list.' },
      { stepNo: '02', title: 'State Check', description: 'If state=1, return cycle. If state=2, return safe.' },
      { stepNo: '03', title: 'DFS Neighbors', description: 'Set state=1. DFS all neighbors. Then set state=2.' }
    ],
    flowchart: {
      title: 'DFS Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'DFS', title: 'dfs(node)', description: 'Start dfs', codeSnippet: 'dfs(node);', state: { node: '...' } },
        { id: 'visiting', type: 'decision', label: 'STATE 1?', title: 'Visiting?', description: 'Cycle check', codeSnippet: 'if(state[node]===1) return false;', yesNextId: 'cycle', noNextId: 'mark1', state: { state: '...' } },
        { id: 'cycle', type: 'end', label: 'CYCLE', title: 'Fail', description: 'Cycle found', codeSnippet: 'return false;', state: { result: 'false' } },
        { id: 'mark1', type: 'process', label: 'MARK 1', title: 'Visiting', description: 'state = 1', codeSnippet: 'state[node] = 1;', nextId: 'neighbors', state: { state: 1 } },
        { id: 'neighbors', type: 'process', label: 'NEIGHBORS', title: 'DFS', description: 'dfs(neighbor)', codeSnippet: 'for(let n of adj[node]) dfs(n);', nextId: 'mark2', state: { checking: '...' } },
        { id: 'mark2', type: 'process', label: 'MARK 2', title: 'Visited', description: 'state = 2', codeSnippet: 'state[node] = 2;', nextId: 'safe', state: { state: 2 } },
        { id: 'safe', type: 'end', label: 'SAFE', title: 'Ok', description: 'Return true', codeSnippet: 'return true;', state: { result: 'true' } }
      ],
      executionPath: ['start', 'visiting', 'mark1', 'neighbors', 'mark2', 'safe']
    },
    exampleWalkthrough: {
      input: '0 requires 1, 1 requires 0',
      steps: [
        { action: 'dfs(0)', explanation: 'State[0]=1. Needs 1. dfs(1).' },
        { action: 'dfs(1)', explanation: 'State[1]=1. Needs 0. dfs(0).' },
        { action: 'dfs(0)', explanation: 'State[0] is 1! Cycle found.' }
      ],
      result: 'false'
    },
    codeConnection: [
      { step: 'Cycle check', code: 'if (state[node] === 1) return false;' }
    ]
  },

  'connected-components': {
    problemId: 'connected-components',
    problemTitle: 'Connected Components',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Union-Find',
      subtitle: 'Merge connected nodes together into sets.',
    },
    strategy: {
      title: 'Disjoint Set Union',
      summary: 'Start with N components. For each edge, find the root of both nodes. If roots differ, union them and reduce total components by 1.',
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      keyInsight: 'Every valid union connects two disjoint sets, exactly reducing the count by 1.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Count = N. parent array where parent[i] = i.' },
      { stepNo: '02', title: 'Find', description: 'Trace up to the root.' },
      { stepNo: '03', title: 'Union', description: 'If roots differ, parent[root1] = root2. Count--.' }
    ],
    flowchart: {
      title: 'Union-Find Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'count=N', codeSnippet: 'let count=n;', state: { count: 'N' } },
        { id: 'loop', type: 'decision', label: 'EDGES?', title: 'Loop', description: 'Process edge', codeSnippet: 'for(let [n1, n2] of edges)', yesNextId: 'find', noNextId: 'end', state: { edge: '...' } },
        { id: 'find', type: 'process', label: 'FIND', title: 'Find roots', description: 'r1=find(n1)', codeSnippet: 'let r1=find(n1), r2=find(n2);', nextId: 'check', state: { r1: '...', r2: '...' } },
        { id: 'check', type: 'decision', label: 'r1 != r2?', title: 'Check', description: 'Different roots?', codeSnippet: 'if(r1 !== r2)', yesNextId: 'union', noNextId: 'loop', state: { check: '...' } },
        { id: 'union', type: 'process', label: 'UNION', title: 'Union', description: 'count--', codeSnippet: 'parent[r1]=r2; count--;', nextId: 'loop', state: { count: 'Decreased' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return count', codeSnippet: 'return count;', state: { result: 'count' } }
      ],
      executionPath: ['start', 'loop', 'find', 'check', 'union', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: 'N=3, edges=[[0,1]]',
      steps: [
        { action: 'Init', explanation: 'Count = 3. parent = [0, 1, 2]' },
        { action: 'Edge [0,1]', explanation: 'Find(0)=0. Find(1)=1. Roots differ. Union! Count = 2.' }
      ],
      result: '2'
    },
    codeConnection: [
      { step: 'Reduce count on union', code: 'if(r1 !== r2) { parent[r1]=r2; count--; }' }
    ]
  },

  'kth-smallest-bst': {
    problemId: 'kth-smallest-bst',
    problemTitle: 'Kth Smallest in BST',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Inorder DFS',
      subtitle: 'Inorder traversal processes a BST in strictly sorted order.',
    },
    strategy: {
      title: 'Iterative Stack Traversal',
      summary: 'Go as far left as possible, pushing to a stack. Pop (this is the smallest unvisited element) and decrement K. If K=0, return it. Else, go right.',
      timeComplexity: 'O(H + K)',
      spaceComplexity: 'O(H)',
      keyInsight: 'The K-th element popped in an inorder traversal is exactly the K-th smallest element.',
    },
    steps: [
      { stepNo: '01', title: 'Left Loop', description: 'Push nodes leftward into stack.' },
      { stepNo: '02', title: 'Pop & Process', description: 'Pop the top. Decrease K.' },
      { stepNo: '03', title: 'Check K', description: 'If K is 0, we found it.' },
      { stepNo: '04', title: 'Go Right', description: 'Move to the popped node\'s right child.' }
    ],
    flowchart: {
      title: 'BST Stack Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'stack=[], curr=root', codeSnippet: 'let stack=[], curr=root;', state: { curr: 'root' } },
        { id: 'loop', type: 'decision', label: 'CURR?', title: 'Deep left', description: 'While curr valid', codeSnippet: 'while(curr)', yesNextId: 'push', noNextId: 'pop', state: { curr: '...' } },
        { id: 'push', type: 'process', label: 'PUSH', title: 'Push left', description: 'stack.push', codeSnippet: 'stack.push(curr); curr=curr.left;', nextId: 'loop', state: { stack: 'Added' } },
        { id: 'pop', type: 'process', label: 'POP', title: 'Process', description: 'k--', codeSnippet: 'curr = stack.pop(); k--;', nextId: 'check', state: { k: 'Decreased' } },
        { id: 'check', type: 'decision', label: 'K==0?', title: 'Check', description: 'Found?', codeSnippet: 'if(k===0) return curr.val;', yesNextId: 'done', noNextId: 'right', state: { k: '...' } },
        { id: 'right', type: 'process', label: 'RIGHT', title: 'Go right', description: 'curr=curr.right', codeSnippet: 'curr = curr.right;', nextId: 'loop', state: { curr: 'curr.right' } },
        { id: 'done', type: 'end', label: 'RETURN', title: 'Done', description: 'Return value', codeSnippet: 'return curr.val;', state: { result: 'curr.val' } }
      ],
      executionPath: ['start', 'loop', 'push', 'loop', 'pop', 'check', 'right', 'loop']
    },
    exampleWalkthrough: {
      input: 'root=[2,1,3], k=1',
      steps: [
        { action: 'Go Left', explanation: 'Push 2. Push 1. Stack: [2, 1].' },
        { action: 'Pop', explanation: 'Pop 1. Decrease K. K is now 0. Found it!' }
      ],
      result: '1'
    },
    codeConnection: [
      { step: 'Check k count', code: 'if(--k === 0) return curr.val;' }
    ]
  },

  'top-k-frequent': {
    problemId: 'top-k-frequent',
    problemTitle: 'Top K Frequent',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Bucket Sort',
      subtitle: 'Use array indices as frequencies to group numbers.',
    },
    strategy: {
      title: 'Frequency Buckets',
      summary: 'Count frequencies. Create an array `buckets` where the index is the frequency. Iterate backwards from highest index to extract the top K elements in O(N).',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(N)',
      keyInsight: 'The maximum frequency is N. An array of size N can group items perfectly without sorting.',
    },
    steps: [
      { stepNo: '01', title: 'Count', description: 'Map numbers to their frequencies.' },
      { stepNo: '02', title: 'Bucket', description: 'Push number to buckets[frequency].' },
      { stepNo: '03', title: 'Extract', description: 'Loop buckets backwards. Add to result until length K.' }
    ],
    flowchart: {
      title: 'Bucket Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'COUNT', title: 'Count', description: 'Count freqs', codeSnippet: 'countMap.set(...)', state: { map: 'Built' } },
        { id: 'bucket', type: 'process', label: 'BUCKET', title: 'Bucket', description: 'buckets[f].push(n)', codeSnippet: 'buckets[freq].push(num);', nextId: 'loop', state: { buckets: 'Filled' } },
        { id: 'loop', type: 'decision', label: 'REVERSE?', title: 'Loop', description: 'i=N down to 0', codeSnippet: 'for(let i=N; i>=0; i--)', yesNextId: 'add', noNextId: 'end', state: { i: '...' } },
        { id: 'add', type: 'process', label: 'ADD', title: 'Add', description: 'res.push(bucket)', codeSnippet: 'res.push(...buckets[i]);', nextId: 'check', state: { res: 'Added' } },
        { id: 'check', type: 'decision', label: 'LEN==K?', title: 'Check', description: 'Found K?', codeSnippet: 'if(res.length === k)', yesNextId: 'end', noNextId: 'loop', state: { resLength: '...' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return res', codeSnippet: 'return res;', state: { result: 'res' } }
      ],
      executionPath: ['start', 'bucket', 'loop', 'add', 'check', 'end']
    },
    exampleWalkthrough: {
      input: 'nums=[1,1,2], k=1',
      steps: [
        { action: 'Count', explanation: 'Freq: {1: 2, 2: 1}' },
        { action: 'Bucket', explanation: 'buckets[2] = [1], buckets[1] = [2]' },
        { action: 'Extract', explanation: 'i=2. Res gets [1]. Length is 1 == K. Return.' }
      ],
      result: '[1]'
    },
    codeConnection: [
      { step: 'Reverse loop extraction', code: 'for(let i=buckets.length-1; i>=0; i--) { ... }' }
    ]
  },
  
  'product-except-self': {
    problemId: 'product-except-self',
    problemTitle: 'Product Except Self',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Prefix & Postfix',
      subtitle: 'Multiply left products with right products.',
    },
    strategy: {
      title: 'Two Passes',
      summary: 'Pass 1 (left-to-right): store prefix product in result. Pass 2 (right-to-left): multiply the postfix product into the result.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'Result[i] is just Prefix[i-1] * Postfix[i+1].',
    },
    steps: [
      { stepNo: '01', title: 'Prefix Pass', description: 'res[i] = prefix. prefix *= nums[i].' },
      { stepNo: '02', title: 'Postfix Pass', description: 'res[i] *= postfix. postfix *= nums[i].' }
    ],
    flowchart: {
      title: 'Prefix/Postfix Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'PREFIX', title: 'Prefix', description: 'Left to right', codeSnippet: 'res[i]=pre; pre*=nums[i];', state: { res: 'Prefixes' } },
        { id: 'post', type: 'process', label: 'POSTFIX', title: 'Postfix', description: 'Right to left', codeSnippet: 'res[i]*=post; post*=nums[i];', nextId: 'end', state: { res: 'Final' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return res', codeSnippet: 'return res;', state: { result: 'res' } }
      ],
      executionPath: ['start', 'post', 'end']
    },
    exampleWalkthrough: {
      input: '[1, 2, 3]',
      steps: [
        { action: 'Prefix Pass', explanation: 'res = [1, 1, 2]' },
        { action: 'Postfix Pass', explanation: 'res[2]=2*1. res[1]=1*3. res[0]=1*6.' }
      ],
      result: '[6, 3, 2]'
    },
    codeConnection: [
      { step: 'In-place postfix multiplication', code: 'res[i] *= postfix; postfix *= nums[i];' }
    ]
  },
  
  'single-number': {
    problemId: 'single-number',
    problemTitle: 'Single Number',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'Bitwise XOR',
      subtitle: 'XOR all numbers to cancel out pairs.',
    },
    strategy: {
      title: 'XOR Cancellation',
      summary: 'A ^ A = 0. A ^ 0 = A. XORing all elements together cancels out duplicate pairs instantly.',
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'Pairs annihilate each other, leaving only the single number behind.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'res = 0' },
      { stepNo: '02', title: 'XOR', description: 'res ^= nums[i]' }
    ],
    flowchart: {
      title: 'XOR Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'START', title: 'Init', description: 'res = 0', codeSnippet: 'let res = 0;', state: { res: 0 } },
        { id: 'loop', type: 'decision', label: 'NUMS?', title: 'Loop', description: 'Iterate', codeSnippet: 'for(let num of nums)', yesNextId: 'xor', noNextId: 'end', state: { num: '...' } },
        { id: 'xor', type: 'process', label: 'XOR', title: 'XOR', description: 'res ^= num', codeSnippet: 'res ^= num;', nextId: 'loop', state: { res: 'Updated' } },
        { id: 'end', type: 'end', label: 'RETURN', title: 'Done', description: 'Return res', codeSnippet: 'return res;', state: { result: 'res' } }
      ],
      executionPath: ['start', 'loop', 'xor', 'loop', 'end']
    },
    exampleWalkthrough: {
      input: '[2, 1, 2]',
      steps: [
        { action: 'num=2', explanation: '0 ^ 2 = 2' },
        { action: 'num=1', explanation: '2 ^ 1 = 3' },
        { action: 'num=2', explanation: '3 ^ 2 = 1. (The 2s cancelled!)' }
      ],
      result: '1'
    },
    codeConnection: [
      { step: 'Running XOR', code: 'res ^= num;' }
    ]
  },
  
  'word-search': {
    problemId: 'word-search',
    problemTitle: 'Word Search',
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: 'DFS Backtracking',
      subtitle: 'Temporarily mark cells as visited to explore all paths.',
    },
    strategy: {
      title: 'Grid Backtracking',
      summary: 'Search from every matching first letter. Temporarily mutate the cell to "#" to prevent reusing it, then restore it (backtrack) when the path fails.',
      timeComplexity: 'O(M×N×4^L)',
      spaceComplexity: 'O(L)',
      keyInsight: 'Temporarily mutating the board saves us from allocating a new visited matrix.',
    },
    steps: [
      { stepNo: '01', title: 'Base', description: 'If matched all letters, return true.' },
      { stepNo: '02', title: 'Mark', description: 'Set cell to "#" so it cannot be reused.' },
      { stepNo: '03', title: 'Explore', description: 'DFS 4 directions. If any true, return true.' },
      { stepNo: '04', title: 'Restore', description: 'Change cell back to original letter.' }
    ],
    flowchart: {
      title: 'Backtrack Flow',
      nodes: [
        { id: 'start', type: 'start', label: 'DFS', title: 'dfs(r, c)', description: 'Start DFS', codeSnippet: 'dfs(r, c, idx)', state: { idx: 0 } },
        { id: 'check', type: 'decision', label: 'MATCH?', title: 'Match', description: 'Found?', codeSnippet: 'if(idx === word.length)', yesNextId: 'ok', noNextId: 'mark', state: { idx: '...' } },
        { id: 'ok', type: 'end', label: 'TRUE', title: 'Done', description: 'Word found', codeSnippet: 'return true;', state: { result: 'true' } },
        { id: 'mark', type: 'process', label: 'MARK', title: 'Mutate', description: 'board[r][c] = "#"', codeSnippet: 'let temp = board; board = "#"', nextId: 'exp', state: { board: 'Mutated' } },
        { id: 'exp', type: 'process', label: 'DFS 4 WAYS', title: 'Explore', description: 'dfs up/down/L/R', codeSnippet: 'let found = dfs(...)', nextId: 'res', state: { checking: '...' } },
        { id: 'res', type: 'process', label: 'RESTORE', title: 'Backtrack', description: 'Restore cell', codeSnippet: 'board = temp;', nextId: 'ret', state: { board: 'Restored' } },
        { id: 'ret', type: 'end', label: 'RETURN', title: 'Done', description: 'Return found', codeSnippet: 'return found;', state: { result: 'found' } }
      ],
      executionPath: ['start', 'check', 'mark', 'exp', 'res', 'ret']
    },
    exampleWalkthrough: {
      input: 'board=[["A","B"]], word="AB"',
      steps: [
        { action: '"A"', explanation: 'Mark "A" as "#". Explore right.' },
        { action: '"B"', explanation: 'Matches. Word found! Return true.' }
      ],
      result: 'true'
    },
    codeConnection: [
      { step: 'Backtrack restore', code: 'board[r][c] = temp;' }
    ]
  }
};

export function getAlgorithmForProblem(problemId, problemTitle = 'Problem') {
  if (MOCK_ALGORITHMS[problemId]) {
    return MOCK_ALGORITHMS[problemId];
  }

  return {
    problemId,
    problemTitle,
    intro: {
      eyebrow: '05 · ALGORITHM',
      title: `${problemTitle} Algorithm`,
      subtitle: `Systematic step-by-step procedure.`,
    },
    strategy: {
      title: 'Algorithmic Strategy',
      summary: `Iterate and update candidate solutions.`,
      timeComplexity: 'O(N)',
      spaceComplexity: 'O(1)',
      keyInsight: 'Minimize redundant operations.',
    },
    steps: [
      { stepNo: '01', title: 'Init', description: 'Define variables.' },
      { stepNo: '02', title: 'Traverse', description: 'Iterate data.' },
      { stepNo: '03', title: 'Return', description: 'Return result.' }
    ],
    flowchart: null,
    exampleWalkthrough: null,
    codeConnection: []
  };
}

export default MOCK_ALGORITHMS;
