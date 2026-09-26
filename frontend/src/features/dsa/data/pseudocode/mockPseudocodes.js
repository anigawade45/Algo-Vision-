import kthLargestPseudocode from './kthLargestPseudocode.js';

/**
 * Mock Pseudocodes Dataset for all 10 problems in AlgoVision.
 * Ensures Stage 06 renders language-independent pseudocode for any selected problem
 * and selected approach without title-specific conditionals in JSX.
 */
export const MOCK_PSEUDOCODES = {
  'two-sum': {
    problemId: 'two-sum',
    approachId: 'hashTable',
    approachName: 'HashMap',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Two Sum',
      inputFormat: 'nums = Array[int], target = int',
      inputVisual: 'nums = [ 2, 7, 11, 15 ], target = 9',
      kValue: 'Target = 9',
      goal: 'Find two indices whose values sum to 9.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize', description: 'Create an empty hash map for value-to-index mapping.' },
      { stepNo: '02', title: 'Calculate complement', description: 'For each item, compute complement = target - current value.' },
      { stepNo: '03', title: 'Check map', description: 'If complement exists in map, return indices immediately.' },
      { stepNo: '04', title: 'Store entry', description: 'Otherwise store current value and index in map.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Algorithm begins.' },
      { line: 2, type: 'instruction', text: 'Create an empty hash map (value ➔ index).', explanation: 'Map allows O(1) average lookup for required complement values.' },
      { line: 3, type: 'loop', text: 'FOR each index i and value num in array:', explanation: 'Iterate through array elements sequentially.' },
      { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Calculate complement = target - num.', explanation: 'Determine the exact matching value required to reach target sum.' },
      { line: 5, type: 'condition', indent: true, indentLevel: 1, text: 'IF complement exists in hash map:', explanation: 'Check if we previously encountered the matching pair item.' },
      { line: 6, type: 'return', indent: true, indentLevel: 2, text: 'RETURN [hash map[complement], i].', explanation: 'Pair found! Return indices of complement and current element.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Store hash map[num] = i.', explanation: 'Record current element so future numbers can pair with it.' },
      { line: 8, type: 'end', text: 'END', explanation: 'Algorithm finishes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Create hash map', why: 'Instant O(1) lookup of previously seen values.' },
      { stepNo: '02', action: 'Calculate complement', why: 'Value A + Value B = Target implies Value B = Target - Value A.' },
      { stepNo: '03', action: 'Check & Return match', why: 'If complement is found, pair is complete.' },
    ],
    decisions: [
      { condition: 'Does complement exist in hash map?', yes: 'Return pair indices immediately.', no: 'Store current value in map and continue.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'valid-parentheses': {
    problemId: 'valid-parentheses',
    approachId: 'stack',
    approachName: 'Stack',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Valid Parentheses',
      inputFormat: 's = String of brackets',
      inputVisual: 's = " ( [ { } ] ) "',
      kValue: 'Bracket Sequence',
      goal: 'Determine if all open brackets close in correct nested order.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize', description: 'Create an empty stack structure.' },
      { stepNo: '02', title: 'Push open brackets', description: 'Push opening symbols onto stack.' },
      { stepNo: '03', title: 'Match closing brackets', description: 'Pop and check matching type when closing symbol is seen.' },
      { stepNo: '04', title: 'Verify empty stack', description: 'Return true if stack is empty at end.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Algorithm starts.' },
      { line: 2, type: 'instruction', text: 'Create an empty stack.', explanation: 'Stack tracks nested opening symbols in Last-In-First-Out order.' },
      { line: 3, type: 'loop', text: 'FOR each character char in string s:', explanation: 'Process bracket characters sequentially.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 1, text: 'IF char is opening bracket ("(", "{", "["):', explanation: 'Identify opening scope boundaries.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 2, text: 'Push char onto stack.', explanation: 'Store opening bracket to match later.' },
      { line: 6, type: 'condition', indent: true, indentLevel: 1, text: 'ELSE IF stack is empty OR top of stack does not match char:', explanation: 'Invalid closing bracket or unmatched symbol.' },
      { line: 7, type: 'return', indent: true, indentLevel: 2, text: 'RETURN false.', explanation: 'Nesting rule violated.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'ELSE:', explanation: 'Valid closing match.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 2, text: 'Pop top character from stack.', explanation: 'Close innermost open scope.' },
      { line: 10, type: 'return', text: 'RETURN stack is empty.', explanation: 'All opening brackets must be closed.' },
      { line: 11, type: 'end', text: 'END', explanation: 'Algorithm completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Push opening brackets', why: 'Recent scope must resolve first.' },
      { stepNo: '02', action: 'Pop on matching close', why: 'Closing bracket fulfills innermost open bracket.' },
    ],
    decisions: [
      { condition: 'Is char a closing bracket?', yes: 'Check top of stack for matching opening type.', no: 'Push opening bracket onto stack.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'reverse-linked-list': {
    problemId: 'reverse-linked-list',
    approachId: 'threePointers',
    approachName: 'Three-Pointer Iteration',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Reverse Linked List',
      inputFormat: 'head = ListNode (val, next)',
      inputVisual: 'head = 1 ➔ 2 ➔ 3 ➔ 4 ➔ NULL',
      kValue: 'Singly Linked List',
      goal: 'Invert pointer directions so tail becomes new head.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize pointers', description: 'Set prev = null, curr = head.' },
      { stepNo: '02', title: 'Save next node', description: 'Store reference to curr.next.' },
      { stepNo: '03', title: 'Reverse pointer', description: 'Point curr.next to prev.' },
      { stepNo: '04', title: 'Advance pointers', description: 'Move prev and curr forward.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize prev = NULL, curr = head.', explanation: 'Track previous and current node pointers.' },
      { line: 3, type: 'loop', text: 'WHILE curr is not NULL:', explanation: 'Traverse list nodes until reaching end.' },
      { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Set nextTemp = curr.next.', explanation: 'Save original next node before changing link.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'Set curr.next = prev.', explanation: 'Reverse directional arrow to point backward.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Move prev = curr.', explanation: 'Advance prev to current node.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Move curr = nextTemp.', explanation: 'Advance curr to next node in original list.' },
      { line: 8, type: 'return', text: 'RETURN prev (new head).', explanation: 'prev now points to original tail, which is new head.' },
      { line: 9, type: 'end', text: 'END', explanation: 'Execution finishes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Save next node', why: 'Changing curr.next breaks the forward path.' },
      { stepNo: '02', action: 'Set curr.next = prev', why: 'Inverts link direction.' },
    ],
    decisions: [
      { condition: 'Is curr node NULL?', yes: 'Traverse finished. Return prev.', no: 'Save next, reverse link, and advance pointers.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'binary-tree-inorder': {
    problemId: 'binary-tree-inorder',
    approachId: 'recursive',
    approachName: 'DFS / Recursion',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Binary Tree Inorder Traversal',
      inputFormat: 'root = TreeNode (val, left, right)',
      inputVisual: 'root = [ 1, null, 2, 3 ]',
      kValue: 'Tree Hierarchy',
      goal: 'Collect node values in Left ➔ Root ➔ Right order.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Base condition', description: 'If node is null, return.' },
      { stepNo: '02', title: 'Traverse left', description: 'Recursively visit left subtree.' },
      { stepNo: '03', title: 'Record node', description: 'Append current node value to result.' },
      { stepNo: '04', title: 'Traverse right', description: 'Recursively visit right subtree.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Function traverse(node, result):', explanation: 'Define recursive traversal helper.' },
      { line: 3, type: 'condition', indent: true, indentLevel: 1, text: 'IF node is NULL:', explanation: 'Base case check.' },
      { line: 4, type: 'return', indent: true, indentLevel: 2, text: 'RETURN.', explanation: 'Stop recursion at empty branches.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'traverse(node.left, result).', explanation: 'Visit all nodes in left subtree first.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Append node.value to result.', explanation: 'Record current root node value.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'traverse(node.right, result).', explanation: 'Visit all nodes in right subtree.' },
      { line: 8, type: 'return', text: 'RETURN result.', explanation: 'Return collected inorder array.' },
      { line: 9, type: 'end', text: 'END', explanation: 'Execution finishes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Traverse left first', why: 'Inorder specifies Left ➔ Root ➔ Right precedence.' },
    ],
    decisions: [
      { condition: 'Is current node NULL?', yes: 'Return to caller.', no: 'Recursively process left subtree, record node, then right subtree.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'number-of-islands': {
    problemId: 'number-of-islands',
    approachId: 'dfs',
    approachName: 'DFS',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Number of Islands',
      inputFormat: 'grid = 2D Matrix [row][col]',
      inputVisual: 'grid = [ ["1","1","0"], ["1","1","0"], ["0","0","1"] ]',
      kValue: 'Spatial Matrix',
      goal: 'Count isolated contiguous land components.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Scan grid', description: 'Iterate over grid coordinates (row r, col c).' },
      { stepNo: '02', title: 'Find land', description: 'When grid[r][c] is "1", increment islandCount.' },
      { stepNo: '03', title: 'Explore DFS', description: 'Flood-fill connected land cells to "0" (water).' },
      { stepNo: '04', title: 'Return total', description: 'Return total islandCount.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Set islandCount = 0.', explanation: 'Initialize region counter.' },
      { line: 3, type: 'loop', text: 'FOR each row r and column c in grid:', explanation: 'Scan entire 2D matrix.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 1, text: 'IF grid[r][c] is "1":', explanation: 'Unvisited land cell found.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 2, text: 'Increment islandCount by 1.', explanation: 'Discovered a new distinct island.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 2, text: 'Call DFS(grid, r, c) to sink connected land.', explanation: 'Recursively sink adjacent land cells to avoid re-counting.' },
      { line: 7, type: 'return', text: 'RETURN islandCount.', explanation: 'Return total component count.' },
      { line: 8, type: 'end', text: 'END', explanation: 'Execution finishes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Scan grid', why: 'Find every unvisited land component.' },
      { stepNo: '02', action: 'Sink land in DFS', why: 'Marks entire island as visited.' },
    ],
    decisions: [
      { condition: 'Is cell value "1"?', yes: 'Increment count & sink island via DFS.', no: 'Skip cell and continue scanning.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'kth-largest-element': kthLargestPseudocode,
  'kth-largest-element-in-an-array': kthLargestPseudocode,

  'sliding-window-maximum': {
    problemId: 'sliding-window-maximum',
    approachId: 'deque',
    approachName: 'Monotonic Deque',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Sliding Window Maximum',
      inputFormat: 'nums = Array[int], k = int',
      inputVisual: 'nums = [ 1, 3, -1, -3, 5, 3, 6, 7 ], k = 3',
      kValue: 'Window K = 3',
      goal: 'Find max element in every shifting window.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Deque', description: 'Create empty deque for candidate indices.' },
      { stepNo: '02', title: 'Remove Out-of-Window Indices', description: 'Pop index from front if outside window.' },
      { stepNo: '03', title: 'Maintain monotonicity', description: 'Pop smaller elements from back.' },
      { stepNo: '04', title: 'Record result', description: 'Front of deque holds window max.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution starts.' },
      { line: 2, type: 'instruction', text: 'Initialize empty deque and result array.', explanation: 'Deque stores candidate indices in decreasing value order.' },
      { line: 3, type: 'loop', text: 'FOR each index i in array:', explanation: 'Process elements from left to right.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 1, text: 'IF deque front index < i - K + 1:', explanation: 'Front index is out of current window.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 2, text: 'Remove front index from deque.', explanation: 'Evict expired out-of-window index.' },
      { line: 6, type: 'loop', indent: true, indentLevel: 1, text: 'WHILE deque not empty AND array[deque back] <= array[i]:', explanation: 'Smaller elements behind current element cannot be window max.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 2, text: 'Remove back index from deque.', explanation: 'Maintain decreasing monotonic value order.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'Push i to back of deque.', explanation: 'The current index is now a candidate for maximum of current and upcoming windows.' },
      { line: 9, type: 'condition', indent: true, indentLevel: 1, text: 'IF i >= K - 1:', explanation: 'First full window of size K has been formed.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 2, text: 'Append array[deque front] to result array.', explanation: 'Front holds current window maximum.' },
      { line: 11, type: 'return', text: 'RETURN result array.', explanation: 'Return max values.' },
      { line: 12, type: 'end', text: 'END', explanation: 'Execution finishes.' },
    ],
    walkthrough: [
      {
        stepNo: '01',
        action: 'Initialize empty deque and result array',
        why: 'The deque stores indices of elements that are still useful candidates for the window maximum.',
      },
      {
        stepNo: '02',
        action: 'Remove out-of-window indices',
        why: 'An index outside the current window boundary (index < i - K + 1) can no longer contribute to the answer.',
      },
      {
        stepNo: '03',
        action: 'Remove smaller elements from back',
        why: 'A smaller element behind the current element can never become the maximum while the current element remains in the window.',
      },
      {
        stepNo: '04',
        action: 'Push current index to back of deque',
        why: 'The current index is now a candidate for the maximum of the current and upcoming windows.',
      },
      {
        stepNo: '05',
        action: 'Record front element as current window max',
        why: 'The deque front represents the largest remaining element inside the active window once index i >= K - 1.',
      },
    ],
    decisions: [
      {
        condition: 'Is front index outside the window (deque front < i - K + 1)?',
        yes: 'Pop front index from deque.',
        no: 'Keep front index in deque.',
      },
      {
        condition: 'Is deque back value <= current value (array[deque back] <= array[i])?',
        yes: 'Pop back index from deque to maintain decreasing order.',
        no: 'Stop removing elements from back.',
      },
      {
        condition: 'Is the current window complete (i >= K - 1)?',
        yes: 'Record array[deque front] as maximum for current window.',
        no: 'Continue building first window until size K is reached.',
      },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'merge-intervals': {
    problemId: 'merge-intervals',
    approachId: 'sorting',
    approachName: 'Sorting + Sweep',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Merge Intervals',
      inputFormat: 'intervals = [[start, end], ...]',
      inputVisual: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
      kValue: 'Interval Ranges',
      goal: 'Consolidate overlapping range boundaries.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Sort intervals', description: 'Sort list by start coordinates.' },
      { stepNo: '02', title: 'Initialize merged list', description: 'Add first interval to merged result.' },
      { stepNo: '03', title: 'Check overlap', description: 'If current start <= last merged end, extend end.' },
      { stepNo: '04', title: 'Append non-overlapping', description: 'Otherwise append current interval.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Sort intervals by start coordinate ascending.', explanation: 'Ordering ensures adjacent intervals overlap.' },
      { line: 3, type: 'instruction', text: 'Create merged array with intervals[0].', explanation: 'Seed merged list with first interval.' },
      { line: 4, type: 'loop', text: 'FOR each interval in sorted intervals (from index 1):', explanation: 'Process remaining intervals.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'Let lastMerged = last interval in merged array.', explanation: 'Inspect latest range.' },
      { line: 6, type: 'condition', indent: true, indentLevel: 1, text: 'IF interval.start <= lastMerged.end:', explanation: 'Ranges overlap.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 2, text: 'Set lastMerged.end = MAX(lastMerged.end, interval.end).', explanation: 'Extend consolidated end boundary.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'ELSE:', explanation: 'No overlap.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 2, text: 'Append interval to merged array.', explanation: 'Start new distinct interval.' },
      { line: 10, type: 'return', text: 'RETURN merged array.', explanation: 'Return non-overlapping ranges.' },
      { line: 11, type: 'end', text: 'END', explanation: 'Execution finishes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Sort by start time', why: 'Enables single-pass overlap detection.' },
    ],
    decisions: [
      { condition: 'Does current start <= last merged end?', yes: 'Merge by updating end coordinate.', no: 'Append as new independent interval.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'longest-substring-no-repeat': {
    problemId: 'longest-substring-no-repeat',
    approachId: 'slidingWindow',
    approachName: 'Sliding Window + HashSet',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Longest Substring Without Repeating Characters',
      inputFormat: 's = String',
      inputVisual: 's = " a b c a b c b b "',
      kValue: 'Unique Character Span',
      goal: 'Find max length of contiguous distinct substring.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize pointers', description: 'Set left = 0, maxLength = 0, charSet = empty.' },
      { stepNo: '02', title: 'Expand right', description: 'Advance right pointer through string.' },
      { stepNo: '03', title: 'Contract left on duplicate', description: 'Shrink left while character is duplicated.' },
      { stepNo: '04', title: 'Update max', description: 'Update maxLength = MAX(maxLength, right - left + 1).' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution starts.' },
      { line: 2, type: 'instruction', text: 'Initialize left = 0, maxLength = 0, charSet = empty set.', explanation: 'Setup window bounds and duplicate tracker.' },
      { line: 3, type: 'loop', text: 'FOR right from 0 to string length - 1:', explanation: 'Expand right window boundary.' },
      { line: 4, type: 'loop', indent: true, indentLevel: 1, text: 'WHILE s[right] is in charSet:', explanation: 'Duplicate detected in current window.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 2, text: 'Remove s[left] from charSet.', explanation: 'Evict left character.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 2, text: 'Increment left by 1.', explanation: 'Contract left boundary.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Add s[right] to charSet.', explanation: 'Add current character to window set.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'Set maxLength = MAX(maxLength, right - left + 1).', explanation: 'Record largest valid window length.' },
      { line: 9, type: 'return', text: 'RETURN maxLength.', explanation: 'Return max length.' },
      { line: 10, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      {
        stepNo: '01',
        action: 'Initialize window pointers & character set',
        why: 'Left and right pointers define the contiguous substring, while charSet tracks unique characters in O(1) time.',
      },
      {
        stepNo: '02',
        action: 'Contract window left when duplicate is found',
        why: 'If s[right] is already in charSet, shrinking left until the duplicate is evicted restores window uniqueness.',
      },
      {
        stepNo: '03',
        action: 'Add current character to set',
        why: 'Once the window is valid and contains no duplicates, s[right] can safely be added to charSet.',
      },
      {
        stepNo: '04',
        action: 'Update maximum substring length',
        why: 'The current valid window size is (right - left + 1), so maxLength is updated to store the largest span seen.',
      },
    ],
    decisions: [
      {
        condition: 'Is s[right] already present in charSet (Duplicate check)?',
        yes: 'Enter WHILE loop to shrink window from the left.',
        no: 'Skip eviction loop — current window is duplicate-free.',
      },
      {
        condition: 'Should while-loop continue contracting left boundary?',
        yes: 'Remove s[left] from charSet and increment left until duplicate is evicted.',
        no: 'Stop contracting left once s[right] is no longer in charSet.',
      },
      {
        condition: 'Is current window length (right - left + 1) > maxLength?',
        yes: 'Update maxLength to current window size.',
        no: 'Keep existing maxLength unchanged.',
      },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'shortest-path-graph': {
    problemId: 'shortest-path-graph',
    approachId: 'bfs',
    approachName: 'BFS',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Shortest Path in Unweighted Graph',
      inputFormat: 'graph = Adjacency List [node ➔ neighbors]',
      inputVisual: 'graph = A ➔ [B, C], B ➔ [D], start = A, target = D',
      kValue: 'Unweighted Graph',
      goal: 'Find minimum edge step hops from start to destination.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Queue', description: 'Push (startNode, distance 0) to queue.' },
      { stepNo: '02', title: 'Pop node', description: 'De-queue current node and distance.' },
      { stepNo: '03', title: 'Check target', description: 'If node is target, return distance.' },
      { stepNo: '04', title: 'Push neighbors', description: 'Push unvisited neighbors with dist + 1.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution starts.' },
      { line: 2, type: 'instruction', text: 'Initialize queue = [(startNode, 0)], visited = {startNode}.', explanation: 'BFS queue ensures level-by-level shortest path expansion.' },
      { line: 3, type: 'loop', text: 'WHILE queue is not empty:', explanation: 'Explore reachable nodes level by level.' },
      { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Pop (currNode, dist) from queue.', explanation: 'Get next node to explore.' },
      { line: 5, type: 'condition', indent: true, indentLevel: 1, text: 'IF currNode == destinationNode:', explanation: 'Target node reached.' },
      { line: 6, type: 'return', indent: true, indentLevel: 2, text: 'RETURN dist.', explanation: 'Return shortest step distance.' },
      { line: 7, type: 'loop', indent: true, indentLevel: 1, text: 'FOR each neighbor of currNode:', explanation: 'Explore adjacent nodes.' },
      { line: 8, type: 'condition', indent: true, indentLevel: 2, text: 'IF neighbor not in visited:', explanation: 'Unvisited path found.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 3, text: 'Add neighbor to visited set.', explanation: 'Mark visited to avoid infinite loops.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 3, text: 'Push (neighbor, dist + 1) to queue.', explanation: 'Queue next level traversal node.' },
      { line: 11, type: 'return', text: 'RETURN -1.', explanation: 'Target unreachable.' },
      { line: 12, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'BFS queue level expansion', why: 'First time destination is reached guarantees minimum hops.' },
    ],
    decisions: [
      { condition: 'Is currNode == destinationNode?', yes: 'Return current dist value.', no: 'Enqueue unvisited neighbors with dist + 1.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'climbing-stairs': {
    problemId: 'climbing-stairs',
    approachId: 'dpTable',
    approachName: 'Bottom-Up Dynamic Programming Array',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Climbing Stairs',
      inputFormat: 'n = int (staircase steps)',
      inputVisual: 'n = 5',
      kValue: 'Staircase Steps N = 5',
      goal: 'Compute distinct ways to reach top using jumps of 1 or 2 steps.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Check Base Cases', description: 'If n <= 2, return n immediately.' },
      { stepNo: '02', title: 'Initialize DP Table', description: 'Create dp array of size n + 1 with dp[1] = 1, dp[2] = 2.' },
      { stepNo: '03', title: 'Iterate & Transition', description: 'For i from 3 to n, calculate dp[i] = dp[i-1] + dp[i-2].' },
      { stepNo: '04', title: 'Return Result', description: 'Return dp[n] as the total distinct ways.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'condition', text: 'IF n <= 2:', explanation: 'Direct base case check for small staircases.' },
      { line: 3, type: 'return', indent: true, indentLevel: 1, text: 'RETURN n.', explanation: 'Return 1 way for n=1, or 2 ways for n=2.' },
      { line: 4, type: 'instruction', text: 'Initialize dp array of size n + 1.', explanation: 'Allocate memory for dynamic programming table.' },
      { line: 5, type: 'instruction', text: 'Set dp[1] = 1, dp[2] = 2.', explanation: 'Set base case path counts.' },
      { line: 6, type: 'loop', text: 'FOR i from 3 to n:', explanation: 'Fill DP table bottom-up sequentially.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Set dp[i] = dp[i - 1] + dp[i - 2].', explanation: 'Ways to step i equals sum of landing from i-1 (+1 step) and i-2 (+2 steps).' },
      { line: 8, type: 'return', text: 'RETURN dp[n].', explanation: 'Return total ways to reach top step n.' },
      { line: 9, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Initialize base cases dp[1]=1, dp[2]=2', why: 'Direct base solutions serve as building blocks.' },
      { stepNo: '02', action: 'Loop i from 3 to n and add dp[i-1] + dp[i-2]', why: 'Combines independent paths from prior landings.' },
    ],
    decisions: [
      { condition: 'Is n <= 2?', yes: 'Return n directly.', no: 'Initialize DP table and run iterative loop from 3 to n.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'house-robber': {
    problemId: 'house-robber',
    approachId: 'twoPointersDP',
    approachName: '2-Variable Space-Optimized Dynamic Programming',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'House Robber',
      inputFormat: 'nums = Array[int] (house stash values)',
      inputVisual: 'nums = [ 2, 7, 9, 3, 1 ]',
      kValue: 'Stash Values',
      goal: 'Maximize total loot without robbing two adjacent houses.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Rolling Vars', description: 'Set rob1 = 0 and rob2 = 0 to track previous maximums.' },
      { stepNo: '02', title: 'Iterate Houses', description: 'For each house num in nums, compute max loot.' },
      { stepNo: '03', title: 'Compute Transition', description: 'temp = MAX(rob2, rob1 + num).' },
      { stepNo: '04', title: 'Update Rolling Vars', description: 'Shift rob1 = rob2 and rob2 = temp.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize rob1 = 0, rob2 = 0.', explanation: 'rob1 tracks max loot 2 houses back; rob2 tracks max loot 1 house back.' },
      { line: 3, type: 'loop', text: 'FOR EACH num IN nums DO:', explanation: 'Iterate through every house stash value in sequence.' },
      { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Set temp = MAX(rob2, rob1 + num).', explanation: 'Decide whether to skip current house (rob2) or rob it (rob1 + num).' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'Set rob1 = rob2.', explanation: 'Shift 2-house-back variable forward.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Set rob2 = temp.', explanation: 'Update 1-house-back variable to latest computed maximum.' },
      { line: 7, type: 'return', text: 'RETURN rob2.', explanation: 'rob2 holds the maximum achievable loot across all houses.' },
      { line: 8, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Initialize rob1=0, rob2=0', why: 'Start with 0 loot before inspecting houses.' },
      { stepNo: '02', action: 'Compute temp = MAX(rob2, rob1 + num)', why: 'Compares skipping current house vs robbing it.' },
      { stepNo: '03', action: 'Shift rob1 = rob2, rob2 = temp', why: 'Advances rolling window variables in O(1) space.' },
    ],
    decisions: [
      { condition: 'Is robbing current house (rob1 + num) better than skipping it (rob2)?', yes: 'Set temp = rob1 + num.', no: 'Set temp = rob2.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'subsets': {
    problemId: 'subsets',
    approachId: 'backtracking',
    approachName: 'Recursive Backtracking (DFS)',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Subsets',
      inputFormat: 'nums = Array[int] (unique elements)',
      inputVisual: 'nums = [ 1, 2, 3 ]',
      kValue: 'Unique Elements',
      goal: 'Generate all 2^N possible unique subsets (Power Set).',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Result', description: 'Create empty result list.' },
      { stepNo: '02', title: 'Base Case Check', description: 'When index == nums.length, append copy of path to result.' },
      { stepNo: '03', title: 'Include Choice', description: 'Push nums[index] to path and recurse.' },
      { stepNo: '04', title: 'Exclude Choice', description: 'Pop nums[index] from path and recurse.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize result = [].', explanation: 'Create accumulator for all generated subsets.' },
      { line: 3, type: 'instruction', text: 'FUNCTION backtrack(index, path):', explanation: 'Define recursive helper taking current element index and current path.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 1, text: 'IF index == nums.length:', explanation: 'Leaf of decision tree reached.' },
      { line: 5, type: 'return', indent: true, indentLevel: 2, text: 'Append COPY(path) to result and RETURN.', explanation: 'Store completed subset snapshot.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Push nums[index] onto path.', explanation: 'Branch 1: Include current element in subset.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'backtrack(index + 1, path).', explanation: 'Recurse deeper with element included.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'Pop last element from path.', explanation: 'Backtrack: remove element to restore path state.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 1, text: 'backtrack(index + 1, path).', explanation: 'Branch 2: Recurse deeper with element excluded.' },
      { line: 10, type: 'instruction', text: 'CALL backtrack(0, []).', explanation: 'Kick off recursion at index 0 with empty path.' },
      { line: 11, type: 'return', text: 'RETURN result.', explanation: 'Return full power set array.' },
      { line: 12, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Include element & recurse', why: 'Explores subset branch containing nums[index].' },
      { stepNo: '02', action: 'Pop element & recurse', why: 'Backtracks state to explore subset branch excluding nums[index].' },
    ],
    decisions: [
      { condition: 'Has index reached nums.length?', yes: 'Append copy of path to result and return.', no: 'Make Include and Exclude recursive choices.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'course-schedule': {
    problemId: 'course-schedule',
    approachId: 'kahnsBFS',
    approachName: 'Kahn\'s BFS Topological Sort',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Course Schedule',
      inputFormat: 'numCourses = int, prerequisites = [[a, b], ...]',
      inputVisual: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]',
      kValue: 'Directed Graph',
      goal: 'Determine if all courses can be finished without circular dependencies.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Build Graph', description: 'Create adjacency list adj and inDegree array.' },
      { stepNo: '02', title: 'Enqueue Zero In-Degree Nodes', description: 'Push all courses with inDegree == 0 into queue.' },
      { stepNo: '03', title: 'Process Queue', description: 'Dequeue node, increment processedCount, decrement neighbor in-degrees.' },
      { stepNo: '04', title: 'Verify Completion', description: 'Return true if processedCount == numCourses.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Build adj list and inDegree array from prerequisites.', explanation: 'Map directed edges (b -> a) and compute in-degrees for each course.' },
      { line: 3, type: 'instruction', text: 'Initialize queue = [], processedCount = 0.', explanation: 'Queue holds courses with zero remaining prerequisite dependencies.' },
      { line: 4, type: 'loop', text: 'FOR i FROM 0 TO numCourses - 1:', explanation: 'Find initial courses with no prerequisites.' },
      { line: 5, type: 'condition', indent: true, indentLevel: 1, text: 'IF inDegree[i] == 0:', explanation: 'Course has 0 prerequisites.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 2, text: 'Enqueue i into queue.', explanation: 'Course is ready to be taken.' },
      { line: 7, type: 'loop', text: 'WHILE queue IS NOT EMPTY DO:', explanation: 'Process unlocked courses iteratively.' },
      { line: 8, type: 'instruction', indent: true, indentLevel: 1, text: 'Set curr = Dequeue course from queue.', explanation: 'Take course.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 1, text: 'Increment processedCount by 1.', explanation: 'Record course as successfully finished.' },
      { line: 10, type: 'loop', indent: true, indentLevel: 1, text: 'FOR EACH neighbor IN adj[curr]:', explanation: 'Inspect courses dependent on curr.' },
      { line: 11, type: 'instruction', indent: true, indentLevel: 2, text: 'Decrement inDegree[neighbor] by 1.', explanation: 'Fulfill one prerequisite for neighbor.' },
      { line: 12, type: 'condition', indent: true, indentLevel: 2, text: 'IF inDegree[neighbor] == 0:', explanation: 'All prerequisites for neighbor are completed.' },
      { line: 13, type: 'instruction', indent: true, indentLevel: 3, text: 'Enqueue neighbor into queue.', explanation: 'Unlock neighbor for taking.' },
      { line: 14, type: 'return', text: 'RETURN processedCount == numCourses.', explanation: 'True if no cycle blocked remaining courses.' },
      { line: 15, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Enqueue zero in-degree courses', why: 'Courses with 0 prerequisites can start immediately.' },
      { stepNo: '02', action: 'Decrement neighbor in-degree on pop', why: 'Fulfilling prerequisites unlocks dependent courses.' },
    ],
    decisions: [
      { condition: 'Does neighbor in-degree reach 0?', yes: 'Enqueue neighbor into queue.', no: 'Keep neighbor waiting for remaining prerequisites.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'connected-components': {
    problemId: 'connected-components',
    approachId: 'unionFind',
    approachName: 'Union-Find (Disjoint Set Union)',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Number of Connected Components in an Undirected Graph',
      inputFormat: 'n = int (nodes), edges = [[u, v], ...]',
      inputVisual: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
      kValue: 'Undirected Graph',
      goal: 'Count distinct connected subgraphs using Disjoint Set Union.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize DSU', description: 'Set parent[i] = i for all nodes 0..n-1 and components = n.' },
      { stepNo: '02', title: 'Define Find with Path Compression', description: 'Recursively trace root and flatten tree structure.' },
      { stepNo: '03', title: 'Process Edges', description: 'Find root U and root V for each edge [u, v].' },
      { stepNo: '04', title: 'Union Roots', description: 'If rootU != rootV, set parent[rootU] = rootV and decrement components.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize parent array parent[i] = i for i=0..n-1, components = n.', explanation: 'Start with n disconnected component trees.' },
      { line: 3, type: 'instruction', text: 'FUNCTION find(u):', explanation: 'Find representative root with path compression.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 1, text: 'IF parent[u] == u THEN RETURN u.', explanation: 'Base case: u is root of its set.' },
      { line: 5, type: 'return', indent: true, indentLevel: 1, text: 'RETURN parent[u] = find(parent[u]).', explanation: 'Compress path by connecting node directly to root.' },
      { line: 6, type: 'loop', text: 'FOR EACH [u, v] IN edges DO:', explanation: 'Process graph edges sequentially.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Set rootU = find(u), rootV = find(v).', explanation: 'Find root set representatives for endpoints u and v.' },
      { line: 8, type: 'condition', indent: true, indentLevel: 1, text: 'IF rootU != rootV:', explanation: 'Endpoints belong to separate components.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 2, text: 'Set parent[rootU] = rootV.', explanation: 'Union sets by linking rootU to rootV.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 2, text: 'Decrement components by 1.', explanation: 'Merging two components reduces total count by 1.' },
      { line: 11, type: 'return', text: 'RETURN components.', explanation: 'Return final count of remaining connected components.' },
      { line: 12, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Initialize parent array & components = n', why: 'Initially each node is its own isolated component.' },
      { stepNo: '02', action: 'Union distinct roots on edge encounter', why: 'Combines two separate sets and decrements total count.' },
    ],
    decisions: [
      { condition: 'Do rootU and rootV match?', yes: 'Nodes already connected — skip edge.', no: 'Union roots and decrement components count.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'kth-smallest-bst': {
    problemId: 'kth-smallest-bst',
    approachId: 'iterativeInorder',
    approachName: 'Iterative Inorder BST Traversal',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Kth Smallest Element in a BST',
      inputFormat: 'root = TreeNode, k = int',
      inputVisual: 'Tree = [5, 3, 6, 2, 4, 1], k = 3',
      kValue: 'Rank K = 3',
      goal: 'Find the k-th smallest key using in-order traversal (Left-Root-Right).',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Traversal Stack', description: 'Create empty stack, set curr = root and count = 0.' },
      { stepNo: '02', title: 'Push Left Branch', description: 'Push all left subchild nodes onto stack.' },
      { stepNo: '03', title: 'Pop & Increment Count', description: 'Pop top node, increment count by 1.' },
      { stepNo: '04', title: 'Check K Rank', description: 'If count == k, return curr.val. Else move curr to curr.right.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize stack = [], curr = root, count = 0.', explanation: 'Stack simulates recursion stack for iterative inorder traversal.' },
      { line: 3, type: 'loop', text: 'WHILE curr != NULL OR stack IS NOT EMPTY DO:', explanation: 'Traverse until all nodes are processed or k-th element is found.' },
      { line: 4, type: 'loop', indent: true, indentLevel: 1, text: 'WHILE curr != NULL DO:', explanation: 'Drill down left branch to find smallest unvisited node.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 2, text: 'Push curr onto stack; Set curr = curr.left.', explanation: 'Save parent and move to left child.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Set curr = Pop node from stack.', explanation: 'Visit smallest remaining node.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 1, text: 'Increment count by 1.', explanation: 'Record visited rank in sorted order.' },
      { line: 8, type: 'condition', indent: true, indentLevel: 1, text: 'IF count == k:', explanation: 'Target rank reached.' },
      { line: 9, type: 'return', indent: true, indentLevel: 2, text: 'RETURN curr.val.', explanation: 'Return value of k-th smallest element.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 1, text: 'Set curr = curr.right.', explanation: 'Move to right child to process next in-order branch.' },
      { line: 11, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Push left nodes to stack', why: 'BST left children contain smallest values.' },
      { stepNo: '02', action: 'Pop stack and increment count', why: 'In-order traversal visits nodes in strictly increasing order.' },
    ],
    decisions: [
      { condition: 'Does count == k?', yes: 'Return curr.val immediately.', no: 'Advance curr to curr.right and continue traversal.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'top-k-frequent': {
    problemId: 'top-k-frequent',
    approachId: 'minHeapK',
    approachName: 'Frequency HashMap + Min-Heap of Size K',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Top K Frequent Elements',
      inputFormat: 'nums = Array[int], k = int',
      inputVisual: 'nums = [ 1, 1, 1, 2, 2, 3 ], k = 2',
      kValue: 'Target K = 2',
      goal: 'Find the k most frequent numbers using frequency counting and a bounded min-heap.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Build Frequency Map', description: 'Count frequency of each element in nums array.' },
      { stepNo: '02', title: 'Initialize Min-Heap', description: 'Create empty min-heap for (frequency, element) pairs.' },
      { stepNo: '03', title: 'Maintain Bounded Heap', description: 'Push pairs; if size > k, pop min element.' },
      { stepNo: '04', title: 'Extract Result', description: 'Return elements remaining in min-heap.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Build freqMap from nums array.', explanation: 'Map each unique number to its occurrence count in O(N) time.' },
      { line: 3, type: 'instruction', text: 'Initialize minHeap = [].', explanation: 'Min-heap ordered by frequency keeps top-K frequent elements at top.' },
      { line: 4, type: 'loop', text: 'FOR EACH (num, freq) IN freqMap DO:', explanation: 'Iterate over unique frequency entries.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'Push (freq, num) onto minHeap.', explanation: 'Insert pair into min-heap.' },
      { line: 6, type: 'condition', indent: true, indentLevel: 1, text: 'IF minHeap.SIZE > k:', explanation: 'Heap exceeds target size K.' },
      { line: 7, type: 'instruction', indent: true, indentLevel: 2, text: 'Pop smallest frequency item from minHeap.', explanation: 'Evict least frequent candidate.' },
      { line: 8, type: 'return', text: 'RETURN elements extracted from minHeap.', explanation: 'Return remaining top-K elements.' },
      { line: 9, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Count element frequencies', why: 'Transforms raw list into frequency map.' },
      { stepNo: '02', action: 'Push to min-heap and evict min if size > k', why: 'Maintains top K highest frequency elements in O(N log K) time.' },
    ],
    decisions: [
      { condition: 'Does minHeap size exceed k?', yes: 'Pop smallest frequency element from top of heap.', no: 'Keep element in heap.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'product-except-self': {
    problemId: 'product-except-self',
    approachId: 'prefixSuffixPass',
    approachName: 'Two-Pass Prefix / Suffix Product',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Product of Array Except Self',
      inputFormat: 'nums = Array[int]',
      inputVisual: 'nums = [ 1, 2, 3, 4 ]',
      kValue: 'Array Elements',
      goal: 'Compute array where output[i] equals product of all elements except nums[i] in O(N) without division.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Answer Array', description: 'Create ans array of size N filled with 1s.' },
      { stepNo: '02', title: 'Left Prefix Pass', description: 'Multiply left products into ans array from i=0 to N-1.' },
      { stepNo: '03', title: 'Right Suffix Pass', description: 'Multiply right products into ans array from i=N-1 down to 0.' },
      { stepNo: '04', title: 'Return Output', description: 'Return ans array.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize ans array of size N filled with 1.', explanation: 'Ans stores running prefix and suffix product results.' },
      { line: 3, type: 'instruction', text: 'Set prefix = 1.', explanation: 'Initialize prefix product accumulator.' },
      { line: 4, type: 'loop', text: 'FOR i FROM 0 TO N - 1 DO:', explanation: 'Pass 1: Accumulate left products.' },
      { line: 5, type: 'instruction', indent: true, indentLevel: 1, text: 'Set ans[i] = prefix.', explanation: 'Store product of all elements to left of index i.' },
      { line: 6, type: 'instruction', indent: true, indentLevel: 1, text: 'Set prefix = prefix * nums[i].', explanation: 'Include nums[i] in prefix accumulator.' },
      { line: 7, type: 'instruction', text: 'Set suffix = 1.', explanation: 'Initialize suffix product accumulator.' },
      { line: 8, type: 'loop', text: 'FOR i FROM N - 1 DOWNTO 0 DO:', explanation: 'Pass 2: Accumulate right products.' },
      { line: 9, type: 'instruction', indent: true, indentLevel: 1, text: 'Set ans[i] = ans[i] * suffix.', explanation: 'Combine left product with product of all elements to right.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 1, text: 'Set suffix = suffix * nums[i].', explanation: 'Include nums[i] in suffix accumulator.' },
      { line: 11, type: 'return', text: 'RETURN ans.', explanation: 'Return completed product array.' },
      { line: 12, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Left prefix pass', why: 'Stores product of all elements left of index i.' },
      { stepNo: '02', action: 'Right suffix pass', why: 'Multiplies left product with suffix product of all elements right of index i.' },
    ],
    decisions: [
      { condition: 'First pass (Prefix)?', yes: 'Set ans[i] = prefix, update prefix *= nums[i].', no: 'Second pass (Suffix): Set ans[i] *= suffix, update suffix *= nums[i].' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'single-number': {
    problemId: 'single-number',
    approachId: 'xorAccumulator',
    approachName: 'Bitwise XOR Accumulator',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Single Number',
      inputFormat: 'nums = Array[int]',
      inputVisual: 'nums = [ 4, 1, 2, 1, 2 ]',
      kValue: 'Paired Integers',
      goal: 'Find unique non-repeated element in linear time O(N) and O(1) extra space.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Initialize Accumulator', description: 'Set acc = 0.' },
      { stepNo: '02', title: 'Iterate & XOR', description: 'For each num in nums, compute acc = acc XOR num.' },
      { stepNo: '03', title: 'Return Unique Number', description: 'Return acc (duplicate pairs cancel out).' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'instruction', text: 'Initialize acc = 0.', explanation: '0 is identity element for XOR operation (A ^ 0 = A).' },
      { line: 3, type: 'loop', text: 'FOR EACH num IN nums DO:', explanation: 'Iterate over all elements in input array.' },
      { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Set acc = acc XOR num.', explanation: 'Bitwise XOR cancels matching bit pairs (A ^ A = 0).' },
      { line: 5, type: 'return', text: 'RETURN acc.', explanation: 'The remaining non-zero accumulator value is the single non-repeated element.' },
      { line: 6, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Initialize acc = 0', why: 'XOR with 0 leaves any value unchanged.' },
      { stepNo: '02', action: 'XOR every number into acc', why: 'Self-inverse property A ^ A = 0 cancels out all paired numbers.' },
    ],
    decisions: [
      { condition: 'Is number part of a duplicate pair?', yes: 'Duplicate pair cancels out to 0.', no: 'Unique single number remains intact in acc.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },

  'word-search': {
    problemId: 'word-search',
    approachId: 'gridDFSBacktracking',
    approachName: '2D Grid DFS Backtracking',
    approachContext: 'This is the approach selected in Stage 05.',
    intro: {
      eyebrow: '06 · PSEUDOCODE',
      title: 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    context: {
      title: 'Word Search',
      inputFormat: 'board = 2D Matrix[char], word = string',
      inputVisual: 'board = [ ["A","B","C","E"], ["S","F","C","S"], ["A","D","E","E"] ], word = "ABCCED"',
      kValue: '2D Grid & Word String',
      goal: 'Determine if word exists in grid by traversing adjacent cells without reusing any cell in a single path.',
    },
    stepOverview: [
      { stepNo: '01', title: 'Scan Grid Cells', description: 'Loop row r and col c across board.' },
      { stepNo: '02', title: 'Start DFS Search', description: 'If board[r][c] matches word[0], run dfs(r, c, 0).' },
      { stepNo: '03', title: 'DFS Base & Boundary Checks', description: 'Return true if idx == word.length; return false if out of bounds or character mismatch.' },
      { stepNo: '04', title: 'Mark Visited & Backtrack', description: 'Temporarily mark cell with "#", explore 4 neighbors, restore cell value.' },
    ],
    lines: [
      { line: 1, type: 'start', text: 'START', explanation: 'Execution begins.' },
      { line: 2, type: 'loop', text: 'FOR r FROM 0 TO ROWS - 1 DO:', explanation: 'Scan every row in grid.' },
      { line: 3, type: 'loop', indent: true, indentLevel: 1, text: 'FOR c FROM 0 TO COLS - 1 DO:', explanation: 'Scan every column in grid.' },
      { line: 4, type: 'condition', indent: true, indentLevel: 2, text: 'IF dfs(r, c, 0) == TRUE:', explanation: 'Word path found starting at cell (r, c).' },
      { line: 5, type: 'return', indent: true, indentLevel: 3, text: 'RETURN TRUE.', explanation: 'Successfully matched target word in grid.' },
      { line: 6, type: 'instruction', text: 'FUNCTION dfs(r, c, idx):', explanation: 'Recursive DFS function to match character at word index idx.' },
      { line: 7, type: 'condition', indent: true, indentLevel: 1, text: 'IF idx == word.length THEN RETURN TRUE.', explanation: 'Matched all characters in word.' },
      { line: 8, type: 'condition', indent: true, indentLevel: 1, text: 'IF out_of_bounds(r, c) OR board[r][c] != word[idx]:', explanation: 'Invalid step or letter mismatch.' },
      { line: 9, type: 'return', indent: true, indentLevel: 2, text: 'RETURN FALSE.', explanation: 'Prune search branch.' },
      { line: 10, type: 'instruction', indent: true, indentLevel: 1, text: 'Set temp = board[r][c]; board[r][c] = \'#\'.', explanation: 'In-place mark cell as visited to prevent reuse.' },
      { line: 11, type: 'instruction', indent: true, indentLevel: 1, text: 'Set found = dfs(r+1,c,idx+1) OR dfs(r-1,c,idx+1) OR dfs(r,c+1,idx+1) OR dfs(r,c-1,idx+1).', explanation: 'Explore 4 orthogonal directions (down, up, right, left).' },
      { line: 12, type: 'instruction', indent: true, indentLevel: 1, text: 'Set board[r][c] = temp.', explanation: 'Backtrack: restore cell character for alternative paths.' },
      { line: 13, type: 'return', indent: true, indentLevel: 1, text: 'RETURN found.', explanation: 'Return whether word path was successfully completed.' },
      { line: 14, type: 'return', text: 'RETURN FALSE.', explanation: 'Return false if no grid cell yielded a complete match.' },
      { line: 15, type: 'end', text: 'END', explanation: 'Execution completes.' },
    ],
    walkthrough: [
      { stepNo: '01', action: 'Check cell match and mark visited with "#"', why: 'In-place visited marker prevents reusing cell in same path.' },
      { stepNo: '02', action: 'Recurse 4 directions and restore character', why: 'Explores orthogonal paths then backtracks for clean state.' },
    ],
    decisions: [
      { condition: 'Does cell match word[idx]?', yes: 'Mark "#", explore 4 neighbor directions, and backtrack.', no: 'Return false to prune branch.' },
    ],
    takeaway: {
      statement: 'Your algorithm is now expressed as language-independent steps.',
      subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
    },
  },
};

// Aliases for short/long IDs
MOCK_PSEUDOCODES['binary-tree-inorder-traversal'] = MOCK_PSEUDOCODES['binary-tree-inorder'];
MOCK_PSEUDOCODES['longest-substring-without-repeating-characters'] = MOCK_PSEUDOCODES['longest-substring-no-repeat'];
MOCK_PSEUDOCODES['shortest-path-in-unweighted-graph'] = MOCK_PSEUDOCODES['shortest-path-graph'];
MOCK_PSEUDOCODES['kth-largest-element-in-an-array'] = MOCK_PSEUDOCODES['kth-largest-element'];

/**
 * Helper function to retrieve pseudocode data by problem ID and approach ID.
 * Defaults to kthLargestPseudocode if problem ID or approach ID is unknown.
 */
export function getPseudocodeByProblemAndApproach(problemId, approachId) {
  if (!problemId) return MOCK_PSEUDOCODES['binary-tree-inorder'] || kthLargestPseudocode;
  
  if (MOCK_PSEUDOCODES[problemId]) {
    return MOCK_PSEUDOCODES[problemId];
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
  };

  const matchedKey = aliasMap[problemId];
  if (matchedKey && MOCK_PSEUDOCODES[matchedKey]) {
    return MOCK_PSEUDOCODES[matchedKey];
  }

  return kthLargestPseudocode;
}

export default MOCK_PSEUDOCODES;
