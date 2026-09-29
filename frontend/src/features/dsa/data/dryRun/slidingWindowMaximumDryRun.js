/**
 * Stage 08 - Dry Run Execution Data for Sliding Window Maximum
 * Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 * Approach: Monotonic Deque
 */
export const slidingWindowMaximumDryRun = {
  "problemId": "sliding-window-maximum",
  "approachId": "deque",
  "approachName": "Monotonic Deque",
  "input": {
    "title": "Sliding Window Maximum",
    "inputVisual": "nums = [ 1, 3, -1, -3, 5, 3, 6, 7 ], k = 3",
    "items": [
      {
        "label": "Array (nums)",
        "value": "[ 1, 3, -1, -3, 5, 3, 6, 7 ]"
      },
      {
        "label": "Window Size (k)",
        "value": "3"
      }
    ],
    "expectedOutput": "[ 3, 3, 5, 5, 6, 7 ]"
  },
  "initialState": {
    "variables": [
      {
        "name": "i",
        "value": "-",
        "label": "Current Index (i)"
      },
      {
        "name": "nums[i]",
        "value": "-",
        "label": "Current Element"
      },
      {
        "name": "deque",
        "value": "[ ]",
        "label": "Monotonic Deque (Indices)"
      },
      {
        "name": "activeWindow",
        "value": "[ ]",
        "label": "Active Window Elements"
      },
      {
        "name": "result",
        "value": "[ ]",
        "label": "Result Array"
      }
    ]
  },
  "steps": [
    {
      "stepNo": 1,
      "pseudocodeLine": 2,
      "pseudocodeText": "Initialize empty deque and result array.",
      "operation": "INITIALIZE",
      "title": "Initialize Monotonic Deque & Result Array",
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "-",
        "nums[i]": "-",
        "deque": "[ ]",
        "activeWindow": "[ ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Execution starting",
        "evaluation": "START",
        "passes": true
      },
      "action": {
        "description": "Create an empty deque to store candidate indices and an empty result array."
      },
      "after": {
        "i": "-",
        "nums[i]": "-",
        "deque": "[ ]",
        "activeWindow": "[ ]",
        "result": "[ ]"
      },
      "changes": [],
      "currentResult": "[ ]",
      "explanation": "Algorithm begins with an empty deque and result list."
    },
    {
      "stepNo": 2,
      "pseudocodeLine": 3,
      "pseudocodeText": "FOR each index i in array:",
      "operation": "LOOP_STEP",
      "title": "Process Index i = 0 (Value = 1)",
      "variables": [
        {
          "name": "i",
          "value": "0",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "1",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "-",
        "nums[i]": "-",
        "deque": "[ ]",
        "activeWindow": "[ ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Is i (0) < array length (8)?",
        "evaluation": "0 < 8",
        "passes": true
      },
      "action": {
        "description": "Advance loop to index i = 0, value = 1."
      },
      "after": {
        "i": "0",
        "nums[i]": "1",
        "deque": "[ ]",
        "activeWindow": "[ 1 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "i",
          "from": "-",
          "to": "0"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "First element nums[0] = 1 is inspected."
    },
    {
      "stepNo": 3,
      "pseudocodeLine": 8,
      "pseudocodeText": "Push i to back of deque.",
      "operation": "PUSH_BACK",
      "title": "Push Index 0 to Deque",
      "variables": [
        {
          "name": "i",
          "value": "0",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "1",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 0 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "0",
        "nums[i]": "1",
        "deque": "[ ]",
        "activeWindow": "[ 1 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Is deque back <= nums[0] (1)?",
        "evaluation": "Deque empty",
        "passes": true
      },
      "action": {
        "description": "Push index 0 (val 1) to back of deque."
      },
      "after": {
        "i": "0",
        "nums[i]": "1",
        "deque": "[ 0 ]",
        "activeWindow": "[ 1 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ ]",
          "to": "[ 0 ]"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Index 0 is pushed into the empty deque as candidate max."
    },
    {
      "stepNo": 4,
      "pseudocodeLine": 3,
      "pseudocodeText": "FOR each index i in array:",
      "operation": "LOOP_STEP",
      "title": "Process Index i = 1 (Value = 3)",
      "variables": [
        {
          "name": "i",
          "value": "1",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 0 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "0",
        "nums[i]": "1",
        "deque": "[ 0 ]",
        "activeWindow": "[ 1 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Is i (1) < 8?",
        "evaluation": "1 < 8",
        "passes": true
      },
      "action": {
        "description": "Advance to index i = 1, value = 3."
      },
      "after": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ 0 ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "i",
          "from": "0",
          "to": "1"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Inspect element nums[1] = 3."
    },
    {
      "stepNo": 5,
      "pseudocodeLine": 6,
      "pseudocodeText": "WHILE deque not empty AND array[deque back] <= array[i]:",
      "operation": "EVICT_SMALLER",
      "title": "Maintain Monotonicity (Remove Smaller Back Elements)",
      "variables": [
        {
          "name": "i",
          "value": "1",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ 0 ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "nums[deque back (0)] <= nums[1] ?",
        "evaluation": "1 <= 3",
        "passes": true
      },
      "action": {
        "description": "Remove back index 0 (val 1) because 1 <= 3."
      },
      "after": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 0 ]",
          "to": "[ ]"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Index 0 (val 1) is evicted because current element 3 is larger and comes later."
    },
    {
      "stepNo": 6,
      "pseudocodeLine": 8,
      "pseudocodeText": "Push i to back of deque.",
      "operation": "PUSH_BACK",
      "title": "Push Index 1 to Deque",
      "variables": [
        {
          "name": "i",
          "value": "1",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Deque is empty",
        "evaluation": "OK",
        "passes": true
      },
      "action": {
        "description": "Push index 1 (val 3) to back of deque."
      },
      "after": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ 1 ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ ]",
          "to": "[ 1 ]"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Index 1 is pushed to back. Deque values: [3]."
    },
    {
      "stepNo": 7,
      "pseudocodeLine": 3,
      "pseudocodeText": "FOR each index i in array:",
      "operation": "LOOP_STEP",
      "title": "Process Index i = 2 (Value = -1)",
      "variables": [
        {
          "name": "i",
          "value": "2",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-1",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3, -1 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "1",
        "nums[i]": "3",
        "deque": "[ 1 ]",
        "activeWindow": "[ 1, 3 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Is i (2) < 8?",
        "evaluation": "2 < 8",
        "passes": true
      },
      "action": {
        "description": "Advance to index i = 2, value = -1."
      },
      "after": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "i",
          "from": "1",
          "to": "2"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Inspect element nums[2] = -1."
    },
    {
      "stepNo": 8,
      "pseudocodeLine": 8,
      "pseudocodeText": "Push i to back of deque.",
      "operation": "PUSH_BACK",
      "title": "Push Index 2 to Deque",
      "variables": [
        {
          "name": "i",
          "value": "2",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-1",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1, 2 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3, -1 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "nums[deque back (1)] <= nums[2] ?",
        "evaluation": "3 <= -1",
        "passes": false
      },
      "action": {
        "description": "Do not evict back (3 > -1). Push index 2 to back."
      },
      "after": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 1 ]",
          "to": "[ 1, 2 ]"
        }
      ],
      "currentResult": "[ ]",
      "explanation": "Since -1 is smaller than 3, we push index 2 without evicting index 1."
    },
    {
      "stepNo": 9,
      "pseudocodeLine": 10,
      "pseudocodeText": "Append array[deque front] to result array.",
      "operation": "RECORD_MAX",
      "title": "Record Window 1 Max (i = 2 >= k - 1)",
      "variables": [
        {
          "name": "i",
          "value": "2",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-1",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1, 2 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 1, 3, -1 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ ]"
      },
      "condition": {
        "text": "Is i (2) >= k - 1 (2)?",
        "evaluation": "2 >= 2",
        "passes": true
      },
      "action": {
        "description": "First full window [1, 3, -1] complete! Append nums[deque front (1)] = 3 to result."
      },
      "after": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ 3 ]"
      },
      "changes": [
        {
          "var": "result",
          "from": "[ ]",
          "to": "[ 3 ]"
        }
      ],
      "currentResult": "[ 3 ]",
      "explanation": "Window 1 [1, 3, -1] is complete. Deque front (index 1, val 3) is recorded as max."
    },
    {
      "stepNo": 10,
      "pseudocodeLine": 3,
      "pseudocodeText": "FOR each index i in array:",
      "operation": "LOOP_STEP",
      "title": "Process Index i = 3 (Value = -3)",
      "variables": [
        {
          "name": "i",
          "value": "3",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1, 2 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 3, -1, -3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "2",
        "nums[i]": "-1",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 1, 3, -1 ]",
        "result": "[ 3 ]"
      },
      "condition": {
        "text": "Is i (3) < 8?",
        "evaluation": "3 < 8",
        "passes": true
      },
      "action": {
        "description": "Advance to index i = 3, value = -3."
      },
      "after": {
        "i": "3",
        "nums[i]": "-3",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 3, -1, -3 ]",
        "result": "[ 3 ]"
      },
      "changes": [
        {
          "var": "i",
          "from": "2",
          "to": "3"
        }
      ],
      "currentResult": "[ 3 ]",
      "explanation": "Window shifts to [3, -1, -3]. Inspect nums[3] = -3."
    },
    {
      "stepNo": 11,
      "pseudocodeLine": 8,
      "pseudocodeText": "Push i to back of deque & Append max.",
      "operation": "PUSH_AND_RECORD",
      "title": "Push Index 3 & Record Window 2 Max",
      "variables": [
        {
          "name": "i",
          "value": "3",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 1, 2, 3 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 3, -1, -3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "3",
        "nums[i]": "-3",
        "deque": "[ 1, 2 ]",
        "activeWindow": "[ 3, -1, -3 ]",
        "result": "[ 3 ]"
      },
      "condition": {
        "text": "Is deque front (1) < i - k + 1 (1)?",
        "evaluation": "1 < 1",
        "passes": false
      },
      "action": {
        "description": "Front index 1 is inside window. Push index 3. Record nums[deque front (1)] = 3."
      },
      "after": {
        "i": "3",
        "nums[i]": "-3",
        "deque": "[ 1, 2, 3 ]",
        "activeWindow": "[ 3, -1, -3 ]",
        "result": "[ 3, 3 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 1, 2 ]",
          "to": "[ 1, 2, 3 ]"
        },
        {
          "var": "result",
          "from": "[ 3 ]",
          "to": "[ 3, 3 ]"
        }
      ],
      "currentResult": "[ 3, 3 ]",
      "explanation": "Window 2 max is 3. Result becomes [3, 3]."
    },
    {
      "stepNo": 12,
      "pseudocodeLine": 4,
      "pseudocodeText": "IF deque front index < i - K + 1: Remove front",
      "operation": "EVICT_EXPIRED",
      "title": "Evict Expired Front Index (i = 4)",
      "variables": [
        {
          "name": "i",
          "value": "4",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "5",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 2, 3 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ -1, -3, 5 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "3",
        "nums[i]": "-3",
        "deque": "[ 1, 2, 3 ]",
        "activeWindow": "[ 3, -1, -3 ]",
        "result": "[ 3, 3 ]"
      },
      "condition": {
        "text": "Is deque front (1) < i - k + 1 (2)?",
        "evaluation": "1 < 2",
        "passes": true
      },
      "action": {
        "description": "Index 1 is out of window boundary [2..4]. Evict front index 1!"
      },
      "after": {
        "i": "4",
        "nums[i]": "5",
        "deque": "[ 2, 3 ]",
        "activeWindow": "[ -1, -3, 5 ]",
        "result": "[ 3, 3 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 1, 2, 3 ]",
          "to": "[ 2, 3 ]"
        }
      ],
      "currentResult": "[ 3, 3 ]",
      "explanation": "Front index 1 (val 3) slid outside window boundary [2..4] and was removed."
    },
    {
      "stepNo": 13,
      "pseudocodeLine": 6,
      "pseudocodeText": "WHILE deque not empty AND array[deque back] <= array[i]: Remove back",
      "operation": "EVICT_SMALLER",
      "title": "Evict Smaller Back Elements (Value 5 Arrives)",
      "variables": [
        {
          "name": "i",
          "value": "4",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "5",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 4 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ -1, -3, 5 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "4",
        "nums[i]": "5",
        "deque": "[ 2, 3 ]",
        "activeWindow": "[ -1, -3, 5 ]",
        "result": "[ 3, 3 ]"
      },
      "condition": {
        "text": "nums[deque back] <= nums[4] (5)?",
        "evaluation": "-3 <= 5 and -1 <= 5",
        "passes": true
      },
      "action": {
        "description": "Evict indices 2 (-1) and 3 (-3). Push index 4 (val 5). Append nums[4] = 5 to result."
      },
      "after": {
        "i": "4",
        "nums[i]": "5",
        "deque": "[ 4 ]",
        "activeWindow": "[ -1, -3, 5 ]",
        "result": "[ 3, 3, 5 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 2, 3 ]",
          "to": "[ 4 ]"
        },
        {
          "var": "result",
          "from": "[ 3, 3 ]",
          "to": "[ 3, 3, 5 ]"
        }
      ],
      "currentResult": "[ 3, 3, 5 ]",
      "explanation": "Value 5 dominates all smaller previous elements. Deque becomes [4] and Window 3 max = 5."
    },
    {
      "stepNo": 14,
      "pseudocodeLine": 8,
      "pseudocodeText": "Push i to back of deque & Append max.",
      "operation": "PUSH_AND_RECORD",
      "title": "Process Index i = 5 (Value = 3)",
      "variables": [
        {
          "name": "i",
          "value": "5",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "3",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 4, 5 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ -3, 5, 3 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5, 5 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "4",
        "nums[i]": "5",
        "deque": "[ 4 ]",
        "activeWindow": "[ -1, -3, 5 ]",
        "result": "[ 3, 3, 5 ]"
      },
      "condition": {
        "text": "nums[4] (5) <= nums[5] (3)?",
        "evaluation": "5 <= 3",
        "passes": false
      },
      "action": {
        "description": "Push index 5 (val 3) to back. Append nums[deque front (4)] = 5 to result."
      },
      "after": {
        "i": "5",
        "nums[i]": "3",
        "deque": "[ 4, 5 ]",
        "activeWindow": "[ -3, 5, 3 ]",
        "result": "[ 3, 3, 5, 5 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 4 ]",
          "to": "[ 4, 5 ]"
        },
        {
          "var": "result",
          "from": "[ 3, 3, 5 ]",
          "to": "[ 3, 3, 5, 5 ]"
        }
      ],
      "currentResult": "[ 3, 3, 5, 5 ]",
      "explanation": "Window 4 [-3, 5, 3] max is 5. Result becomes [3, 3, 5, 5]."
    },
    {
      "stepNo": 15,
      "pseudocodeLine": 6,
      "pseudocodeText": "WHILE deque not empty AND array[deque back] <= array[i]: Remove back",
      "operation": "EVICT_SMALLER",
      "title": "Process Index i = 6 (Value = 6)",
      "variables": [
        {
          "name": "i",
          "value": "6",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "6",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 6 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 5, 3, 6 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5, 5, 6 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "5",
        "nums[i]": "3",
        "deque": "[ 4, 5 ]",
        "activeWindow": "[ -3, 5, 3 ]",
        "result": "[ 3, 3, 5, 5 ]"
      },
      "condition": {
        "text": "nums[5] (3) <= 6 and nums[4] (5) <= 6?",
        "evaluation": "True",
        "passes": true
      },
      "action": {
        "description": "Evict indices 5 and 4. Push index 6 (val 6). Append 6 to result."
      },
      "after": {
        "i": "6",
        "nums[i]": "6",
        "deque": "[ 6 ]",
        "activeWindow": "[ 5, 3, 6 ]",
        "result": "[ 3, 3, 5, 5, 6 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 4, 5 ]",
          "to": "[ 6 ]"
        },
        {
          "var": "result",
          "from": "[ 3, 3, 5, 5 ]",
          "to": "[ 3, 3, 5, 5, 6 ]"
        }
      ],
      "currentResult": "[ 3, 3, 5, 5, 6 ]",
      "explanation": "Value 6 clears previous smaller values. Window 5 [5, 3, 6] max = 6."
    },
    {
      "stepNo": 16,
      "pseudocodeLine": 6,
      "pseudocodeText": "WHILE deque not empty AND array[deque back] <= array[i]: Remove back",
      "operation": "EVICT_SMALLER",
      "title": "Process Index i = 7 (Value = 7)",
      "variables": [
        {
          "name": "i",
          "value": "7",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "7",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 7 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "[ 3, 6, 7 ]",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5, 5, 6, 7 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "6",
        "nums[i]": "6",
        "deque": "[ 6 ]",
        "activeWindow": "[ 5, 3, 6 ]",
        "result": "[ 3, 3, 5, 5, 6 ]"
      },
      "condition": {
        "text": "nums[6] (6) <= nums[7] (7)?",
        "evaluation": "6 <= 7",
        "passes": true
      },
      "action": {
        "description": "Evict index 6 (val 6). Push index 7 (val 7). Append 7 to result."
      },
      "after": {
        "i": "7",
        "nums[i]": "7",
        "deque": "[ 7 ]",
        "activeWindow": "[ 3, 6, 7 ]",
        "result": "[ 3, 3, 5, 5, 6, 7 ]"
      },
      "changes": [
        {
          "var": "deque",
          "from": "[ 6 ]",
          "to": "[ 7 ]"
        },
        {
          "var": "result",
          "from": "[ 3, 3, 5, 5, 6 ]",
          "to": "[ 3, 3, 5, 5, 6, 7 ]"
        }
      ],
      "currentResult": "[ 3, 3, 5, 5, 6, 7 ]",
      "explanation": "Final element 7 evicts 6. Window 6 [3, 6, 7] max = 7."
    },
    {
      "stepNo": 17,
      "pseudocodeLine": 11,
      "pseudocodeText": "RETURN result array.",
      "operation": "RETURN",
      "title": "Loop Complete & Return Result",
      "variables": [
        {
          "name": "i",
          "value": "8",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 7 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "-",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5, 5, 6, 7 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "7",
        "nums[i]": "7",
        "deque": "[ 7 ]",
        "activeWindow": "[ 3, 6, 7 ]",
        "result": "[ 3, 3, 5, 5, 6, 7 ]"
      },
      "condition": {
        "text": "Is i (8) < 8?",
        "evaluation": "8 < 8",
        "passes": false
      },
      "action": {
        "description": "Loop terminates. Algorithm returns final result array."
      },
      "after": {
        "i": "8",
        "nums[i]": "-",
        "deque": "[ 7 ]",
        "activeWindow": "-",
        "result": "[ 3, 3, 5, 5, 6, 7 ]"
      },
      "changes": [],
      "currentResult": "[ 3, 3, 5, 5, 6, 7 ]",
      "explanation": "Array traversal complete. Result [3, 3, 5, 5, 6, 7] contains all window maximums."
    },
    {
      "stepNo": 18,
      "pseudocodeLine": 12,
      "pseudocodeText": "END",
      "operation": "END",
      "title": "Execution Complete",
      "variables": [
        {
          "name": "i",
          "value": "8",
          "label": "Current Index (i)"
        },
        {
          "name": "nums[i]",
          "value": "-",
          "label": "Current Element"
        },
        {
          "name": "deque",
          "value": "[ 7 ]",
          "label": "Monotonic Deque (Indices)"
        },
        {
          "name": "activeWindow",
          "value": "-",
          "label": "Active Window Elements"
        },
        {
          "name": "result",
          "value": "[ 3, 3, 5, 5, 6, 7 ]",
          "label": "Result Array"
        }
      ],
      "before": {
        "i": "8",
        "nums[i]": "-",
        "deque": "[ 7 ]",
        "activeWindow": "-",
        "result": "[ 3, 3, 5, 5, 6, 7 ]"
      },
      "condition": {
        "text": "Execution complete",
        "evaluation": "DONE",
        "passes": true
      },
      "action": {
        "description": "All steps executed successfully."
      },
      "after": {
        "i": "8",
        "nums[i]": "-",
        "deque": "[ 7 ]",
        "activeWindow": "-",
        "result": "[ 3, 3, 5, 5, 6, 7 ]"
      },
      "changes": [],
      "currentResult": "[ 3, 3, 5, 5, 6, 7 ]",
      "explanation": "Monotonic deque processed array with double-ended queue operations."
    }
  ],
  "finalState": {
    "result": "[ 3, 3, 5, 5, 6, 7 ]",
    "explanation": "Monotonic deque processed all sliding windows in O(N) time; final maximums array is [3, 3, 5, 5, 6, 7]."
  }
};

export default slidingWindowMaximumDryRun;
