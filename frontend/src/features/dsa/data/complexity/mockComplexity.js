export const MOCK_COMPLEXITY = {
  'two-sum': {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'We start by inspecting the main loops in the algorithm. We see a single loop iterating through the array of size n.',
          code: 'for (let i = 0; i < nums.length; i++)',
          calculation: 'Loop runs n times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Inside the loop, we perform hash map lookups (`map.has`) and insertions (`map.set`). A hash map takes O(1) constant time on average for these operations.',
          code: 'if (map.has(target - nums[i])) ...\nmap.set(nums[i], i);',
          calculation: 'n iterations × 1 operation = n',
          action: 'Find dominant term'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Since we drop constant multipliers in Big-O notation, n × 1 simplifies to n.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'We do not count the input array `nums`. We only count auxiliary (extra) memory created by the algorithm, which is the hash map.',
          code: 'const map = new Map();',
          calculation: 'Hash Map created',
          action: 'Determine max size'
        },
        {
          title: 'WORST CASE SCENARIO',
          description: 'In the worst case, the matching pair is at the very end of the array, meaning we will insert n - 1 elements into the map before returning.',
          code: 'map.set(nums[i], i);',
          calculation: 'Map stores up to n elements',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'Because the hash map size grows linearly with the input array size n.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    }
  },
  'valid-parentheses': {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'The algorithm uses a single loop to iterate over each character in the string `s` of length n.',
          code: 'for (let c of s)',
          calculation: 'Loop runs n times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Inside the loop, we push to or pop from a Stack. These are O(1) constant time operations.',
          code: 'st.push(c);\n// OR\nst.pop();',
          calculation: 'n iterations × 1 operation = n',
          action: 'Find dominant term'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Linear time because we process each character exactly once.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'We create a stack data structure to track the open brackets.',
          code: 'const st = [];',
          calculation: 'Stack created',
          action: 'Determine max size'
        },
        {
          title: 'WORST CASE SCENARIO',
          description: 'If the string contains only open brackets like "(((((", every character will be pushed onto the stack.',
          code: 'st.push(c);',
          calculation: 'Stack stores up to n characters',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'The stack size grows linearly with the input string length.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    }
  },
  'binary-tree-inorder': {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'This is a recursive algorithm. To find the time complexity, we count how many times the recursive function `dfs` is called.',
          code: 'const dfs = (n) => {\n  if (!n) return;\n  dfs(n.left);\n  res.push(n.val);\n  dfs(n.right);\n};',
          calculation: 'Function called for every node',
          action: 'Count recursive calls'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'The function visits every single node in the tree exactly once. Inside the function, appending to the array takes O(1) time.',
          code: 'res.push(n.val);',
          calculation: 'n nodes × 1 operation = n',
          action: 'Find dominant term'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Since every node is visited exactly once, the time complexity is proportional to the number of nodes.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'Aside from the output array, recursive algorithms use memory on the Call Stack.',
          code: 'dfs(root);',
          calculation: 'Call Stack memory used',
          action: 'Determine recursion depth'
        },
        {
          title: 'WORST CASE SCENARIO',
          description: 'In the worst case (a skewed tree like a linked list), the recursion goes n levels deep before returning.',
          code: 'dfs(n.left); // goes deep down one side',
          calculation: 'Call Stack depth = n',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'O(n) for the worst case. Note: In a perfectly balanced tree, the space complexity would be O(log n).',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    }
  },
  'reverse-linked-list': {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'We iterate through the linked list using a while loop until we reach the end (null).',
          code: 'while (head) { ... }',
          calculation: 'Loop runs n times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Inside the loop, we simply reassign pointers (`next`, `head`, `prev`). This takes constant O(1) time.',
          code: 'let next = head.next;\nhead.next = prev;\nprev = head;\nhead = next;',
          calculation: 'n iterations × 1 operation',
          action: 'Find dominant term'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Each node is visited exactly once.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(1)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'We only create three pointer variables (`prev`, `next`, `head`) to keep track of our position.',
          code: 'let prev = null;\nlet next = head.next;',
          calculation: 'Fixed number of variables',
          action: 'Determine size growth'
        },
        {
          title: 'DOES IT GROW WITH N?',
          description: 'No matter how large the linked list is (10 nodes or 10,000 nodes), we still only use the exact same three pointer variables.',
          code: '',
          calculation: 'Constant Extra Space',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'Auxiliary space is O(1) because we do not allocate any new nodes or dynamic structures.',
          code: '',
          calculation: 'O(1)',
          action: ''
        }
      ]
    }
  },
  'merge-intervals': {
    time: {
      complexity: 'O(n log n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'The algorithm has two main parts: sorting the intervals, and then iterating through them.',
          code: 'intervals.sort((a, b) => a[0] - b[0]);\n...\nfor (const i of intervals) { ... }',
          calculation: 'Sort + Loop',
          action: 'Calculate Parts'
        },
        {
          title: 'ANALYZE PARTS',
          description: 'Sorting n elements takes O(n log n) time. The for loop iterates over the n elements exactly once, taking O(n) time.',
          code: 'Sort = O(n log n)\nLoop = O(n)',
          calculation: 'O(n log n) + O(n)',
          action: 'Keep Dominant Term'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'In Big-O, we only keep the fastest growing (dominant) term. Since n log n grows much faster than n, the O(n) is dropped.',
          code: '',
          calculation: 'O(n log n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'First, the output array `res` can store up to n intervals if there are no overlaps.',
          code: 'const res = [];',
          calculation: 'Result Array Size = n',
          action: 'Analyze Sorting Space'
        },
        {
          title: 'SORTING MEMORY',
          description: 'Depending on the language implementation, the sorting algorithm (like Timsort or Merge Sort) may require O(n) auxiliary space as well.',
          code: 'intervals.sort(...)',
          calculation: 'Sort Space = O(n)',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'Both the result array and sorting space scale linearly with n.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    }
  },
  'kth-largest-element': {
    time: {
      complexity: 'O(n log k)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'We iterate through the array of size n, and maintain a Min-Heap of size k.',
          code: 'for (int x : nums) {\n    pq.push(x);\n    ...\n}',
          calculation: 'Loop n times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Inside the loop, we push to a heap of maximum size k. A heap push/pop operation takes O(log k) time.',
          code: 'pq.push(x);\nif (pq.size() > k) pq.pop();',
          calculation: 'n iterations × log k work',
          action: 'Calculate Total'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'We do O(log k) work exactly n times.',
          code: '',
          calculation: 'O(n log k)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(k)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'We create a Priority Queue (Min-Heap).',
          code: 'priority_queue<int, vector<int>, greater<int>> pq;',
          calculation: 'Heap created',
          action: 'Determine Max Size'
        },
        {
          title: 'WORST CASE SCENARIO',
          description: 'The algorithm explicitly guarantees that the heap size never exceeds k. If it does, we pop an element.',
          code: 'if (pq.size() > k) pq.pop();',
          calculation: 'Max size = k elements',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'The space is strictly bounded by k, which is often much smaller than n.',
          code: '',
          calculation: 'O(k)',
          action: ''
        }
      ]
    }
  },
  'climbing-stairs': {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'We have a single loop that starts from 3 and goes up to n.',
          code: 'for (let i = 3; i <= n; i++)',
          calculation: 'Loop runs (n - 2) times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Inside the loop, we perform simple constant time addition and variable reassignment.',
          code: 'let c = a + b;\na = b;\nb = c;',
          calculation: '(n - 2) × 1 operations',
          action: 'Remove constants'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'In Big-O, we drop the -2 constant. The work scales perfectly linearly with n.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(1)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'Instead of using an entire array `dp[n]` to store results, we only store the previous two results in variables `a` and `b`.',
          code: 'let a = 1, b = 2;\nlet c = a + b;',
          calculation: '3 Integer Variables',
          action: 'Determine size growth'
        },
        {
          title: 'DOES IT GROW WITH N?',
          description: 'No matter if n is 10 or 1,000,000, we still only use exactly 3 variables.',
          code: '',
          calculation: 'Constant Extra Space',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'This is an optimized Dynamic Programming solution with O(1) auxiliary space.',
          code: '',
          calculation: 'O(1)',
          action: ''
        }
      ]
    }
  },
  'subsets': {
    time: {
      complexity: 'O(n × 2^n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'For an array of length n, there are 2^n possible subsets (each element can either be included or excluded).',
          code: '',
          calculation: '2^n subsets generated',
          action: 'Analyze inner operations'
        },
        {
          title: 'COPYING SUBSETS',
          description: 'For each generated subset, we must copy its elements into a new array. A subset can have up to n elements, so copying it takes O(n) time.',
          code: 'res.push([...res[i], num]);',
          calculation: '2^n operations × O(n) work',
          action: 'Final Time Complexity'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Generating 2^n subsets where each subset copy takes up to n operations.',
          code: '',
          calculation: 'O(n × 2^n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n × 2^n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'We must store the final result array containing all subsets.',
          code: 'const res = [[]];',
          calculation: 'Result Array',
          action: 'Determine size growth'
        },
        {
          title: 'WORST CASE SCENARIO',
          description: 'The result array holds exactly 2^n subsets. Each subset contains on average n/2 elements (which is O(n)).',
          code: '',
          calculation: '2^n lists × O(n) elements',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'The total memory required to hold the power set.',
          code: '',
          calculation: 'O(n × 2^n)',
          action: ''
        }
      ]
    }
  }
};

// Generalized fallback for unlisted problems
export const getComplexityData = (problemId) => {
  if (MOCK_COMPLEXITY[problemId]) {
    return MOCK_COMPLEXITY[problemId];
  }

  return {
    time: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'HOW DO WE COUNT THE WORK?',
          description: 'First, we inspect the algorithm to identify the main loops or recursive calls that process the input data of size n.',
          code: '// Traverse input\nfor (let i = 0; i < n; i++)',
          calculation: 'Loop runs n times',
          action: 'Analyze inner operations'
        },
        {
          title: 'COUNT OPERATIONS',
          description: 'Next, we look at the work done inside the loops. If it only does basic comparisons and arithmetic, it takes O(1) constant time.',
          code: '// O(1) constant work\nprocess(data[i]);',
          calculation: 'n iterations × 1 operation',
          action: 'Remove constants'
        },
        {
          title: 'FINAL TIME COMPLEXITY',
          description: 'Since constant multipliers are dropped in Big-O notation, the time complexity is proportional to the dominant term.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    },
    space: {
      complexity: 'O(n)',
      steps: [
        {
          title: 'COUNT EXTRA MEMORY',
          description: 'Space complexity refers to the auxiliary (extra) memory allocated by the algorithm, excluding the input data itself.',
          code: 'const extraStructure = new Array();',
          calculation: 'Auxiliary Data Structure',
          action: 'Determine max size'
        },
        {
          title: 'DOES IT GROW WITH N?',
          description: 'We evaluate how large this extra structure grows relative to the input size n in the worst-case scenario.',
          code: '',
          calculation: 'Scales with input',
          action: 'Final Space Complexity'
        },
        {
          title: 'FINAL SPACE COMPLEXITY',
          description: 'The final classification based on the memory footprint.',
          code: '',
          calculation: 'O(n)',
          action: ''
        }
      ]
    }
  };
};
