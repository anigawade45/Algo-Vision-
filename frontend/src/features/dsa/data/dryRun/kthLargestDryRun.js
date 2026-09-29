/**
 * Stage 08 - Dry Run Execution Data for Kth Largest Element
 * Input: nums = [3, 2, 1, 5, 6, 4], k = 2
 * Approach: Min-Heap
 */
export const kthLargestDryRun = {
  "problemId": "kth-largest-element",
  "approachId": "minHeap",
  "approachName": "Min-Heap",
  "input": {
    "title": "Kth Largest Element in an Array",
    "inputVisual": "nums = [ 3, 2, 1, 5, 6, 4 ], k = 2",
    "items": [
      {
        "label": "Array (nums)",
        "value": "[ 3, 2, 1, 5, 6, 4 ]"
      },
      {
        "label": "Target Rank (K)",
        "value": "2"
      }
    ],
    "expectedOutput": "5"
  },
  "initialState": {
    "variables": [
      {
        "name": "val",
        "value": "-",
        "label": "Current Element"
      },
      {
        "name": "minHeap",
        "value": "[ ]",
        "label": "Min-Heap (Size <= 2)"
      },
      {
        "name": "heapSize",
        "value": "0",
        "label": "Heap Size"
      },
      {
        "name": "kthLargest",
        "value": "-",
        "label": "Heap Root (Min value)"
      }
    ]
  },
  "steps": [
    {
      "stepNo": 1,
      "pseudocodeLine": 2,
      "pseudocodeText": "Create an empty min-heap.",
      "operation": "INITIALIZE",
      "title": "Initialize Min-Heap",
      "variables": [
        {
          "name": "val",
          "value": "-",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "0",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "-",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "-",
        "minHeap": "[ ]",
        "heapSize": "0",
        "kthLargest": "-"
      },
      "condition": {
        "text": "Execution starting",
        "evaluation": "START",
        "passes": true
      },
      "action": {
        "description": "Create empty min-heap of size capacity K = 2."
      },
      "after": {
        "val": "-",
        "minHeap": "[ ]",
        "heapSize": "0",
        "kthLargest": "-"
      },
      "changes": [],
      "currentResult": "Not determined",
      "explanation": "Min-heap will hold top K (2) largest elements."
    },
    {
      "stepNo": 2,
      "pseudocodeLine": 4,
      "pseudocodeText": "Add the value to the heap.",
      "operation": "PUSH_HEAP",
      "title": "Add Value 3 to Min-Heap",
      "variables": [
        {
          "name": "val",
          "value": "3",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 3 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "1",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "3",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "-",
        "minHeap": "[ ]",
        "heapSize": "0",
        "kthLargest": "-"
      },
      "condition": {
        "text": "Heap size (0) > K (2)?",
        "evaluation": "0 > 2",
        "passes": false
      },
      "action": {
        "description": "Push value 3 into min-heap. Size becomes 1."
      },
      "after": {
        "val": "3",
        "minHeap": "[ 3 ]",
        "heapSize": "1",
        "kthLargest": "3"
      },
      "changes": [
        {
          "var": "val",
          "from": "-",
          "to": "3"
        },
        {
          "var": "minHeap",
          "from": "[ ]",
          "to": "[ 3 ]"
        }
      ],
      "currentResult": "3",
      "explanation": "Value 3 inserted. Min-heap size is 1 <= K (2)."
    },
    {
      "stepNo": 3,
      "pseudocodeLine": 4,
      "pseudocodeText": "Add the value to the heap.",
      "operation": "PUSH_HEAP",
      "title": "Add Value 2 to Min-Heap",
      "variables": [
        {
          "name": "val",
          "value": "2",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 2, 3 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "2",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "3",
        "minHeap": "[ 3 ]",
        "heapSize": "1",
        "kthLargest": "3"
      },
      "condition": {
        "text": "Heap size (1) > K (2)?",
        "evaluation": "1 > 2",
        "passes": false
      },
      "action": {
        "description": "Push value 2. Heap bubbles 2 to root. Min-heap: [2, 3]."
      },
      "after": {
        "val": "2",
        "minHeap": "[ 2, 3 ]",
        "heapSize": "2",
        "kthLargest": "2"
      },
      "changes": [
        {
          "var": "val",
          "from": "3",
          "to": "2"
        },
        {
          "var": "minHeap",
          "from": "[ 3 ]",
          "to": "[ 2, 3 ]"
        }
      ],
      "currentResult": "2",
      "explanation": "Value 2 inserted. Min-heap root is 2."
    },
    {
      "stepNo": 4,
      "pseudocodeLine": 6,
      "pseudocodeText": "Remove the smallest value (if size > K).",
      "operation": "EVICT_MIN",
      "title": "Process Value 1 & Evict Min",
      "variables": [
        {
          "name": "val",
          "value": "1",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 2, 3 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "2",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "2",
        "minHeap": "[ 2, 3 ]",
        "heapSize": "2",
        "kthLargest": "2"
      },
      "condition": {
        "text": "Heap size after push (3) > K (2)?",
        "evaluation": "3 > 2",
        "passes": true
      },
      "action": {
        "description": "Push 1 (heap size 3), then pop root 1. Heap restores to [2, 3]."
      },
      "after": {
        "val": "1",
        "minHeap": "[ 2, 3 ]",
        "heapSize": "2",
        "kthLargest": "2"
      },
      "changes": [
        {
          "var": "val",
          "from": "2",
          "to": "1"
        }
      ],
      "currentResult": "2",
      "explanation": "Value 1 is smaller than top 2 largest items and gets evicted."
    },
    {
      "stepNo": 5,
      "pseudocodeLine": 6,
      "pseudocodeText": "Remove the smallest value (if size > K).",
      "operation": "EVICT_MIN",
      "title": "Process Value 5 & Evict Root 2",
      "variables": [
        {
          "name": "val",
          "value": "5",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 3, 5 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "3",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "1",
        "minHeap": "[ 2, 3 ]",
        "heapSize": "2",
        "kthLargest": "2"
      },
      "condition": {
        "text": "Heap size after push 5 (3) > K (2)?",
        "evaluation": "3 > 2",
        "passes": true
      },
      "action": {
        "description": "Push 5, pop smallest value 2. Heap becomes [3, 5]."
      },
      "after": {
        "val": "5",
        "minHeap": "[ 3, 5 ]",
        "heapSize": "2",
        "kthLargest": "3"
      },
      "changes": [
        {
          "var": "val",
          "from": "1",
          "to": "5"
        },
        {
          "var": "minHeap",
          "from": "[ 2, 3 ]",
          "to": "[ 3, 5 ]"
        }
      ],
      "currentResult": "3",
      "explanation": "Value 5 enters top 2 largest candidates. Root 2 is evicted."
    },
    {
      "stepNo": 6,
      "pseudocodeLine": 6,
      "pseudocodeText": "Remove the smallest value (if size > K).",
      "operation": "EVICT_MIN",
      "title": "Process Value 6 & Evict Root 3",
      "variables": [
        {
          "name": "val",
          "value": "6",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 5, 6 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "5",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "5",
        "minHeap": "[ 3, 5 ]",
        "heapSize": "2",
        "kthLargest": "3"
      },
      "condition": {
        "text": "Heap size after push 6 (3) > K (2)?",
        "evaluation": "3 > 2",
        "passes": true
      },
      "action": {
        "description": "Push 6, pop smallest value 3. Heap becomes [5, 6]."
      },
      "after": {
        "val": "6",
        "minHeap": "[ 5, 6 ]",
        "heapSize": "2",
        "kthLargest": "5"
      },
      "changes": [
        {
          "var": "val",
          "from": "5",
          "to": "6"
        },
        {
          "var": "minHeap",
          "from": "[ 3, 5 ]",
          "to": "[ 5, 6 ]"
        }
      ],
      "currentResult": "5",
      "explanation": "Value 6 enters top 2 candidates. Root 3 is evicted. Root becomes 5."
    },
    {
      "stepNo": 7,
      "pseudocodeLine": 6,
      "pseudocodeText": "Remove the smallest value (if size > K).",
      "operation": "EVICT_MIN",
      "title": "Process Value 4 & Evict Value 4",
      "variables": [
        {
          "name": "val",
          "value": "4",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 5, 6 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "5",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "6",
        "minHeap": "[ 5, 6 ]",
        "heapSize": "2",
        "kthLargest": "5"
      },
      "condition": {
        "text": "Heap size after push 4 (3) > K (2)?",
        "evaluation": "3 > 2",
        "passes": true
      },
      "action": {
        "description": "Push 4, pop 4. Heap remains [5, 6]."
      },
      "after": {
        "val": "4",
        "minHeap": "[ 5, 6 ]",
        "heapSize": "2",
        "kthLargest": "5"
      },
      "changes": [
        {
          "var": "val",
          "from": "6",
          "to": "4"
        }
      ],
      "currentResult": "5",
      "explanation": "Value 4 is smaller than root 5 and is evicted immediately."
    },
    {
      "stepNo": 8,
      "pseudocodeLine": 7,
      "pseudocodeText": "RETURN the smallest value in the heap.",
      "operation": "RETURN",
      "title": "Return Root of Min-Heap (Value = 5)",
      "variables": [
        {
          "name": "val",
          "value": "-",
          "label": "Current Element"
        },
        {
          "name": "minHeap",
          "value": "[ 5, 6 ]",
          "label": "Min-Heap (Size <= 2)"
        },
        {
          "name": "heapSize",
          "value": "2",
          "label": "Heap Size"
        },
        {
          "name": "kthLargest",
          "value": "5",
          "label": "Heap Root (Min value)"
        }
      ],
      "before": {
        "val": "4",
        "minHeap": "[ 5, 6 ]",
        "heapSize": "2",
        "kthLargest": "5"
      },
      "condition": {
        "text": "Loop complete",
        "evaluation": "DONE",
        "passes": true
      },
      "action": {
        "description": "Return minHeap root value (5)."
      },
      "after": {
        "val": "-",
        "minHeap": "[ 5, 6 ]",
        "heapSize": "2",
        "kthLargest": "5"
      },
      "changes": [],
      "currentResult": "5",
      "explanation": "In a min-heap of size K=2, the root holds the 2nd largest element (5)."
    }
  ],
  "finalState": {
    "result": "5",
    "explanation": "Min-Heap of size 2 maintained the top 2 largest values; root node 5 is the 2nd largest element overall."
  }
};

export default kthLargestDryRun;
