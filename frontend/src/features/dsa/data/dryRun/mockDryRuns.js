import slidingWindowMaximumDryRun from './slidingWindowMaximumDryRun.js';
import kthLargestDryRun from './kthLargestDryRun.js';

/**
 * Mock Dry Run Datasets for all 20 problems in AlgoVision.
 * Ensures Stage 08 renders language-independent step execution traces
 * for any selected problem in the workspace without problem-specific JSX conditionals.
 */
export const MOCK_DRY_RUNS = {
  "sliding-window-maximum": slidingWindowMaximumDryRun,
  "kth-largest-element": kthLargestDryRun,
  "two-sum": {
    "problemId": "two-sum",
    "approachId": "hashTable",
    "approachName": "HashMap",
    "input": {
      "title": "Two Sum",
      "inputVisual": "nums = [ 2, 7, 11, 15 ], target = 9",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 2, 7, 11, 15 ]"
        },
        {
          "label": "Target Sum",
          "value": "9"
        }
      ],
      "expectedOutput": "[ 0, 1 ]"
    },
    "initialState": {
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Current Index"
        },
        {
          "name": "num",
          "value": "-",
          "label": "Current Number"
        },
        {
          "name": "complement",
          "value": "-",
          "label": "Target Complement"
        },
        {
          "name": "hashMap",
          "value": "{ }",
          "label": "Hash Map (num ➔ index)"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Indices Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 2,
        "pseudocodeText": "Create an empty hash map (value ➔ index).",
        "operation": "INITIALIZE",
        "title": "Initialize Hash Map",
        "variables": [
          {
            "name": "i",
            "value": "-"
          },
          {
            "name": "num",
            "value": "-"
          },
          {
            "name": "complement",
            "value": "-"
          },
          {
            "name": "hashMap",
            "value": "{ }"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "hashMap": "{ }"
        },
        "condition": {
          "text": "Execution starting",
          "evaluation": "START",
          "passes": true
        },
        "action": {
          "description": "Create an empty hash map."
        },
        "after": {
          "hashMap": "{ }"
        },
        "changes": [],
        "currentResult": "[ ]",
        "explanation": "Hash map will track previously visited numbers and their indices."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 4,
        "pseudocodeText": "Calculate complement = target - num.",
        "operation": "COMPUTE",
        "title": "Inspect i = 0 (num = 2)",
        "variables": [
          {
            "name": "i",
            "value": "0"
          },
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "complement",
            "value": "7"
          },
          {
            "name": "hashMap",
            "value": "{ }"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "i": "-",
          "num": "-"
        },
        "condition": {
          "text": "Calculate complement: 9 - 2 = 7",
          "evaluation": "7",
          "passes": true
        },
        "action": {
          "description": "Calculate complement = 9 - 2 = 7."
        },
        "after": {
          "i": "0",
          "num": "2",
          "complement": "7"
        },
        "changes": [
          {
            "var": "i",
            "from": "-",
            "to": "0"
          },
          {
            "var": "num",
            "from": "-",
            "to": "2"
          },
          {
            "var": "complement",
            "from": "-",
            "to": "7"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Complement 7 is needed to reach target sum 9."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 7,
        "pseudocodeText": "Store hash map[num] = i.",
        "operation": "STORE_MAP",
        "title": "Check Map & Store (2 ➔ 0)",
        "variables": [
          {
            "name": "i",
            "value": "0"
          },
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "complement",
            "value": "7"
          },
          {
            "name": "hashMap",
            "value": "{ 2: 0 }"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "hashMap": "{ }"
        },
        "condition": {
          "text": "Is 7 in hashMap { }?",
          "evaluation": "False",
          "passes": false
        },
        "action": {
          "description": "Complement 7 not found. Store map[2] = 0."
        },
        "after": {
          "hashMap": "{ 2: 0 }"
        },
        "changes": [
          {
            "var": "hashMap",
            "from": "{ }",
            "to": "{ 2: 0 }"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Store 2 at index 0 in hash map for future complement lookups."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 4,
        "pseudocodeText": "Calculate complement = target - num.",
        "operation": "COMPUTE",
        "title": "Inspect i = 1 (num = 7)",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "num",
            "value": "7"
          },
          {
            "name": "complement",
            "value": "2"
          },
          {
            "name": "hashMap",
            "value": "{ 2: 0 }"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "i": "0",
          "num": "2"
        },
        "condition": {
          "text": "Calculate complement: 9 - 7 = 2",
          "evaluation": "2",
          "passes": true
        },
        "action": {
          "description": "Calculate complement = 9 - 7 = 2."
        },
        "after": {
          "i": "1",
          "num": "7",
          "complement": "2"
        },
        "changes": [
          {
            "var": "i",
            "from": "0",
            "to": "1"
          },
          {
            "var": "num",
            "from": "2",
            "to": "7"
          },
          {
            "var": "complement",
            "from": "7",
            "to": "2"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Complement required for num 7 is 2."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 6,
        "pseudocodeText": "RETURN [hash map[complement], i].",
        "operation": "RETURN",
        "title": "Match Found! Return [0, 1]",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "num",
            "value": "7"
          },
          {
            "name": "complement",
            "value": "2"
          },
          {
            "name": "hashMap",
            "value": "{ 2: 0 }"
          },
          {
            "name": "result",
            "value": "[ 0, 1 ]"
          }
        ],
        "before": {
          "result": "[ ]"
        },
        "condition": {
          "text": "Is complement (2) in hashMap { 2: 0 }?",
          "evaluation": "True! index = 0",
          "passes": true
        },
        "action": {
          "description": "Match found! Return index of 2 (0) and current index 1."
        },
        "after": {
          "result": "[ 0, 1 ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "[ ]",
            "to": "[ 0, 1 ]"
          }
        ],
        "currentResult": "[ 0, 1 ]",
        "explanation": "Pair found: nums[0] (2) + nums[1] (7) = 9. Returns [0, 1]."
      }
    ],
    "summary": {
      "title": "Two Sum Dry Run Summary",
      "inputSummary": "nums = [ 2, 7, 11, 15 ], target = 9",
      "finalOutput": "[ 0, 1 ]",
      "takeaway": "Single-pass HashMap lookup tracked visited numbers and found the target complement pair.",
      "observations": [
        "Calculating target - num yields the exact missing value.",
        "HashMap provides fast lookup for previously encountered numbers.",
        "Returning immediately upon first match guarantees minimum steps."
      ]
    },
    "finalState": {
      "result": "[ 0, 1 ]",
      "explanation": "Pair found: nums[0] (2) + nums[1] (7) = 9. Returns [0, 1]."
    }
  },
  "valid-parentheses": {
    "problemId": "valid-parentheses",
    "approachId": "stack",
    "approachName": "Stack",
    "input": {
      "title": "Valid Parentheses",
      "inputVisual": "s = \" ( [ ] ) \"",
      "items": [
        {
          "label": "Input String (s)",
          "value": "\" ( [ ] ) \""
        },
        {
          "label": "Length",
          "value": "4"
        }
      ],
      "expectedOutput": "true"
    },
    "initialState": {
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Character Index"
        },
        {
          "name": "currentChar",
          "value": "-",
          "label": "Current Character"
        },
        {
          "name": "stack",
          "value": "[ ]",
          "label": "Symbol Stack"
        },
        {
          "name": "isValid",
          "value": "true",
          "label": "Valid Status"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 2,
        "pseudocodeText": "Create an empty stack.",
        "operation": "INITIALIZE",
        "title": "Initialize Stack",
        "variables": [
          {
            "name": "i",
            "value": "-"
          },
          {
            "name": "currentChar",
            "value": "-"
          },
          {
            "name": "stack",
            "value": "[ ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "stack": "[ ]",
          "isValid": "true"
        },
        "condition": {
          "text": "Start execution",
          "evaluation": "START",
          "passes": true
        },
        "action": {
          "description": "Initialize empty symbol stack."
        },
        "after": {
          "stack": "[ ]",
          "isValid": "true"
        },
        "changes": [],
        "currentResult": "isValid = true",
        "explanation": "The stack will keep track of the most recently opened bracket so each closing bracket can be checked against it."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 5,
        "pseudocodeText": "Push currentChar onto stack.",
        "operation": "PUSH_STACK",
        "title": "Process index 0: \"(\" ➔ Push Stack",
        "variables": [
          {
            "name": "i",
            "value": "0"
          },
          {
            "name": "currentChar",
            "value": "\"(\""
          },
          {
            "name": "stack",
            "value": "[ \"(\" ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "currentChar": "-",
          "stack": "[ ]"
        },
        "condition": {
          "text": "Is \"(\" an opening bracket?",
          "evaluation": "YES ➔ Push",
          "passes": true
        },
        "action": {
          "description": "Push \"(\" onto stack."
        },
        "after": {
          "currentChar": "\"(\"",
          "stack": "[ \"(\" ]"
        },
        "changes": [
          {
            "var": "currentChar",
            "from": "-",
            "to": "\"(\""
          },
          {
            "var": "stack",
            "from": "[ ]",
            "to": "[ \"(\" ]"
          }
        ],
        "currentResult": "isValid = true",
        "explanation": "Opening bracket \"(\" pushed onto stack."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 5,
        "pseudocodeText": "Push currentChar onto stack.",
        "operation": "PUSH_STACK",
        "title": "Process index 1: \"[\" ➔ Push Stack",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "currentChar",
            "value": "\"[\""
          },
          {
            "name": "stack",
            "value": "[ \"(\", \"[\" ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "currentChar": "\"(\"",
          "stack": "[ \"(\" ]"
        },
        "condition": {
          "text": "Is \"[\" an opening bracket?",
          "evaluation": "YES ➔ Push",
          "passes": true
        },
        "action": {
          "description": "Push \"[\" onto stack."
        },
        "after": {
          "currentChar": "\"[\"",
          "stack": "[ \"(\", \"[\" ]"
        },
        "changes": [
          {
            "var": "currentChar",
            "from": "\"(\"",
            "to": "\"[\""
          },
          {
            "var": "stack",
            "from": "[ \"(\" ]",
            "to": "[ \"(\", \"[\" ]"
          }
        ],
        "currentResult": "isValid = true",
        "explanation": "Opening bracket \"[\" pushed onto stack."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 9,
        "pseudocodeText": "Pop top character from stack.",
        "operation": "POP_STACK",
        "title": "Process index 2: \"]\" ➔ Match & Pop Stack",
        "variables": [
          {
            "name": "i",
            "value": "2"
          },
          {
            "name": "currentChar",
            "value": "\"]\""
          },
          {
            "name": "stack",
            "value": "[ \"(\" ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "currentChar": "\"[\"",
          "stack": "[ \"(\", \"[\" ]"
        },
        "condition": {
          "text": "Is \"]\" a closing bracket & does top \"[\" match \"]\"?",
          "evaluation": "YES ➔ Match found!",
          "passes": true
        },
        "action": {
          "description": "Pop \"[\" from stack top."
        },
        "after": {
          "currentChar": "\"]\"",
          "stack": "[ \"(\" ]"
        },
        "changes": [
          {
            "var": "currentChar",
            "from": "\"[\"",
            "to": "\"]\""
          },
          {
            "var": "stack",
            "from": "[ \"(\", \"[\" ]",
            "to": "[ \"(\" ]"
          }
        ],
        "currentResult": "isValid = true",
        "explanation": "Closing \"]\" matches top opening \"[\". Top element \"[\" popped from stack."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 9,
        "pseudocodeText": "Pop top character from stack.",
        "operation": "POP_STACK",
        "title": "Process index 3: \")\" ➔ Match & Pop Stack",
        "variables": [
          {
            "name": "i",
            "value": "3"
          },
          {
            "name": "currentChar",
            "value": "\")\""
          },
          {
            "name": "stack",
            "value": "[ ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "currentChar": "\"]\"",
          "stack": "[ \"(\" ]"
        },
        "condition": {
          "text": "Is \")\" a closing bracket & does top \"(\" match \")\"?",
          "evaluation": "YES ➔ Match found!",
          "passes": true
        },
        "action": {
          "description": "Pop \"(\" from stack top."
        },
        "after": {
          "currentChar": "\")\"",
          "stack": "[ ]"
        },
        "changes": [
          {
            "var": "currentChar",
            "from": "\"]\"",
            "to": "\")\""
          },
          {
            "var": "stack",
            "from": "[ \"(\" ]",
            "to": "[ ]"
          }
        ],
        "currentResult": "isValid = true",
        "explanation": "Closing \")\" matches top opening \"(\". Stack is now empty."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 10,
        "pseudocodeText": "RETURN stack is empty.",
        "operation": "RETURN",
        "title": "End of Input ➔ Check Stack Empty (isValid = true)",
        "variables": [
          {
            "name": "i",
            "value": "4"
          },
          {
            "name": "currentChar",
            "value": "-"
          },
          {
            "name": "stack",
            "value": "[ ]"
          },
          {
            "name": "isValid",
            "value": "true"
          }
        ],
        "before": {
          "currentChar": "\")\"",
          "stack": "[ ]"
        },
        "condition": {
          "text": "End of input reached. Is stack empty?",
          "evaluation": "YES ➔ isValid = true",
          "passes": true
        },
        "action": {
          "description": "Return true because stack is completely empty."
        },
        "after": {
          "currentChar": "-",
          "isValid": "true"
        },
        "changes": [
          {
            "var": "currentChar",
            "from": "\")\"",
            "to": "-"
          }
        ],
        "currentResult": "true",
        "explanation": "All opening brackets were matched and popped. Empty stack confirms valid parentheses string s."
      }
    ],
    "summary": {
      "title": "Valid Parentheses Dry Run Summary",
      "inputSummary": "s = \" ( [ ] ) \"",
      "finalOutput": "true",
      "takeaway": "The stack tracked the most recently opened bracket, allowing each closing bracket to be matched with the correct opening bracket.",
      "observations": [
        "Opening brackets are pushed onto the stack.",
        "A closing bracket checks the bracket currently at the top of the stack.",
        "After all characters are processed, an empty stack means every opening bracket was matched."
      ]
    },
    "finalState": {
      "result": "true",
      "explanation": "All opening brackets were matched and popped. Empty stack confirms valid parentheses string s."
    }
  },
  "reverse-linked-list": {
    "problemId": "reverse-linked-list",
    "approachId": "threePointers",
    "approachName": "Three-Pointer Iteration",
    "input": {
      "title": "Reverse Linked List",
      "inputVisual": "1 ➔ 2 ➔ 3 ➔ NULL",
      "items": [
        {
          "label": "Initial List",
          "value": "1 ➔ 2 ➔ 3 ➔ NULL"
        }
      ],
      "expectedOutput": "3 ➔ 2 ➔ 1 ➔ NULL"
    },
    "initialState": {
      "variables": [
        {
          "name": "prev",
          "value": "NULL",
          "label": "Previous Node (prev)"
        },
        {
          "name": "curr",
          "value": "Node(1)",
          "label": "Current Node (curr)"
        },
        {
          "name": "nextTemp",
          "value": "NULL",
          "label": "Next Temp Node (nextTemp)"
        },
        {
          "name": "reversedPortion",
          "value": "NULL",
          "label": "Reversed Portion"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 4,
        "pseudocodeText": "Set nextTemp = curr.next, curr.next = prev.",
        "operation": "REVERSE_LINK",
        "title": "Step 1: Save nextTemp (2) & Reverse Link (1 ➔ NULL)",
        "variables": [
          {
            "name": "prev",
            "value": "Node(1)"
          },
          {
            "name": "curr",
            "value": "Node(2)"
          },
          {
            "name": "nextTemp",
            "value": "Node(2)"
          },
          {
            "name": "reversedPortion",
            "value": "1 ➔ NULL"
          }
        ],
        "before": {
          "prev": "NULL",
          "curr": "Node(1)",
          "nextTemp": "NULL",
          "reversedPortion": "NULL"
        },
        "condition": {
          "text": "Is curr (Node 1) != NULL?",
          "evaluation": "YES ➔ Save nextTemp = Node(2)",
          "passes": true
        },
        "action": {
          "description": "Save nextTemp = Node(2). Point Node(1).next to NULL (prev). Advance prev = Node(1), curr = Node(2)."
        },
        "after": {
          "prev": "Node(1)",
          "curr": "Node(2)",
          "nextTemp": "Node(2)",
          "reversedPortion": "1 ➔ NULL"
        },
        "changes": [
          {
            "var": "nextTemp",
            "from": "NULL",
            "to": "Node(2)"
          },
          {
            "var": "prev",
            "from": "NULL",
            "to": "Node(1)"
          },
          {
            "var": "curr",
            "from": "Node(1)",
            "to": "Node(2)"
          },
          {
            "var": "reversedPortion",
            "from": "NULL",
            "to": "1 ➔ NULL"
          }
        ],
        "currentResult": "1 ➔ NULL",
        "explanation": "Save nextTemp = Node(2) to preserve forward path. Invert Node(1).next to point backward to NULL. Advance prev to Node(1), curr to Node(2)."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 5,
        "pseudocodeText": "Advance prev = curr, curr = nextTemp.",
        "operation": "REVERSE_LINK",
        "title": "Step 2: Save nextTemp (3) & Reverse Link (2 ➔ 1)",
        "variables": [
          {
            "name": "prev",
            "value": "Node(2)"
          },
          {
            "name": "curr",
            "value": "Node(3)"
          },
          {
            "name": "nextTemp",
            "value": "Node(3)"
          },
          {
            "name": "reversedPortion",
            "value": "2 ➔ 1 ➔ NULL"
          }
        ],
        "before": {
          "prev": "Node(1)",
          "curr": "Node(2)",
          "nextTemp": "Node(2)",
          "reversedPortion": "1 ➔ NULL"
        },
        "condition": {
          "text": "Is curr (Node 2) != NULL?",
          "evaluation": "YES ➔ Save nextTemp = Node(3)",
          "passes": true
        },
        "action": {
          "description": "Save nextTemp = Node(3). Point Node(2).next to Node(1) (prev). Advance prev = Node(2), curr = Node(3)."
        },
        "after": {
          "prev": "Node(2)",
          "curr": "Node(3)",
          "nextTemp": "Node(3)",
          "reversedPortion": "2 ➔ 1 ➔ NULL"
        },
        "changes": [
          {
            "var": "nextTemp",
            "from": "Node(2)",
            "to": "Node(3)"
          },
          {
            "var": "prev",
            "from": "Node(1)",
            "to": "Node(2)"
          },
          {
            "var": "curr",
            "from": "Node(2)",
            "to": "Node(3)"
          },
          {
            "var": "reversedPortion",
            "from": "1 ➔ NULL",
            "to": "2 ➔ 1 ➔ NULL"
          }
        ],
        "currentResult": "2 ➔ 1 ➔ NULL",
        "explanation": "Save nextTemp = Node(3). Invert Node(2).next to point backward to Node(1). Advance prev to Node(2), curr to Node(3)."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 5,
        "pseudocodeText": "Advance prev = curr, curr = nextTemp.",
        "operation": "REVERSE_LINK",
        "title": "Step 3: Save nextTemp (NULL) & Reverse Link (3 ➔ 2)",
        "variables": [
          {
            "name": "prev",
            "value": "Node(3)"
          },
          {
            "name": "curr",
            "value": "NULL"
          },
          {
            "name": "nextTemp",
            "value": "NULL"
          },
          {
            "name": "reversedPortion",
            "value": "3 ➔ 2 ➔ 1 ➔ NULL"
          }
        ],
        "before": {
          "prev": "Node(2)",
          "curr": "Node(3)",
          "nextTemp": "Node(3)",
          "reversedPortion": "2 ➔ 1 ➔ NULL"
        },
        "condition": {
          "text": "Is curr (Node 3) != NULL?",
          "evaluation": "YES ➔ Save nextTemp = NULL",
          "passes": true
        },
        "action": {
          "description": "Save nextTemp = NULL. Point Node(3).next to Node(2) (prev). Advance prev = Node(3), curr = NULL."
        },
        "after": {
          "prev": "Node(3)",
          "curr": "NULL",
          "nextTemp": "NULL",
          "reversedPortion": "3 ➔ 2 ➔ 1 ➔ NULL"
        },
        "changes": [
          {
            "var": "nextTemp",
            "from": "Node(3)",
            "to": "NULL"
          },
          {
            "var": "prev",
            "from": "Node(2)",
            "to": "Node(3)"
          },
          {
            "var": "curr",
            "from": "Node(3)",
            "to": "NULL"
          },
          {
            "var": "reversedPortion",
            "from": "2 ➔ 1 ➔ NULL",
            "to": "3 ➔ 2 ➔ 1 ➔ NULL"
          }
        ],
        "currentResult": "3 ➔ 2 ➔ 1 ➔ NULL",
        "explanation": "Save nextTemp = NULL. Point Node(3).next to Node(2). Advance prev to Node(3), curr to NULL."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 8,
        "pseudocodeText": "RETURN prev (new head).",
        "operation": "RETURN",
        "title": "Step 4: Loop Complete (curr == NULL) ➔ Return prev (Node 3)",
        "variables": [
          {
            "name": "prev",
            "value": "Node(3)"
          },
          {
            "name": "curr",
            "value": "NULL"
          },
          {
            "name": "nextTemp",
            "value": "NULL"
          },
          {
            "name": "reversedPortion",
            "value": "3 ➔ 2 ➔ 1 ➔ NULL"
          }
        ],
        "before": {
          "curr": "NULL",
          "prev": "Node(3)"
        },
        "condition": {
          "text": "Is curr == NULL?",
          "evaluation": "YES ➔ Traversal finished",
          "passes": true
        },
        "action": {
          "description": "Return prev (Node 3 as new head of reversed list)."
        },
        "after": {
          "curr": "NULL",
          "prev": "Node(3)"
        },
        "changes": [],
        "currentResult": "3 ➔ 2 ➔ 1 ➔ NULL",
        "explanation": "Traversal complete because curr reached NULL. Pointer prev holds original tail Node(3), which is the head of the reversed list."
      }
    ],
    "summary": {
      "title": "Reverse Linked List Dry Run Summary",
      "inputSummary": "1 ➔ 2 ➔ 3 ➔ NULL",
      "finalOutput": "3 ➔ 2 ➔ 1 ➔ NULL",
      "takeaway": "Each iteration saved the next node, reversed the current node's link, and advanced the pointers.",
      "observations": [
        "Saving nextTemp before mutating curr.next prevents losing forward reference.",
        "Inverting curr.next = prev reverses pointer arrow direction in-place.",
        "When curr becomes NULL, prev holds the new head of the reversed list."
      ]
    },
    "finalState": {
      "result": "3 ➔ 2 ➔ 1 ➔ NULL",
      "explanation": "Traversal complete because curr reached NULL. Pointer prev holds original tail Node(3), which is the head of the reversed list."
    }
  },
  "binary-tree-inorder": {
    "problemId": "binary-tree-inorder",
    "approachId": "recursive",
    "approachName": "DFS / Recursion",
    "input": {
      "title": "Binary Tree Inorder Traversal",
      "inputVisual": "1 ➔ Right: 2 (Left: 3)",
      "items": [
        {
          "label": "Tree Nodes",
          "value": "1 ➔ Right: 2 (Left: 3)"
        }
      ],
      "expectedOutput": "[ 1, 3, 2 ]"
    },
    "initialState": {
      "subtitle": "State at start of traverse(1)",
      "variables": [
        {
          "name": "node",
          "value": "Node(1)",
          "label": "Active Node"
        },
        {
          "name": "callStack",
          "value": "[ traverse(1) ]",
          "label": "Call Stack"
        },
        {
          "name": "result",
          "value": "[ ]",
          "label": "Inorder Result Array"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 2,
        "pseudocodeText": "Function traverse(node, result):",
        "operation": "CALL",
        "title": "Start Traversal at Root 1",
        "variables": [
          {
            "name": "node",
            "value": "Node(1)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "node": "Node(1)",
          "callStack": "[ traverse(1) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "Starting recursive traversal at Root Node 1",
          "evaluation": "START",
          "passes": true
        },
        "action": {
          "description": "Invoke traverse(Node 1)."
        },
        "after": {
          "node": "Node(1)",
          "callStack": "[ traverse(1) ]",
          "result": "[ ]"
        },
        "changes": [],
        "currentResult": "[ ]",
        "explanation": "Algorithm begins execution at root node 1."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 3,
        "pseudocodeText": "IF node is NULL: RETURN / Check left child.",
        "operation": "CHECK_LEFT",
        "title": "Node 1: Check Left Child",
        "variables": [
          {
            "name": "node",
            "value": "Node(1)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "node": "Node(1)",
          "result": "[ ]"
        },
        "condition": {
          "text": "Does Node 1 have a left child?",
          "evaluation": "NULL (No left child)",
          "passes": false
        },
        "action": {
          "description": "Left child is NULL. Proceed to visit and record current node 1."
        },
        "after": {
          "node": "Node(1)",
          "result": "[ ]"
        },
        "changes": [],
        "currentResult": "[ ]",
        "explanation": "Root node 1 has no left child (NULL), so left traversal returns immediately."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 6,
        "pseudocodeText": "Append node.value to result.",
        "operation": "RECORD_NODE",
        "title": "Node 1: Visit & Record Value 1",
        "variables": [
          {
            "name": "node",
            "value": "Node(1)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1) ]"
          },
          {
            "name": "result",
            "value": "[ 1 ]"
          }
        ],
        "before": {
          "result": "[ ]"
        },
        "condition": {
          "text": "Append Node 1 value to result array?",
          "evaluation": "Record 1",
          "passes": true
        },
        "action": {
          "description": "Append Node 1 value to result array."
        },
        "after": {
          "result": "[ 1 ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "[ ]",
            "to": "[ 1 ]"
          }
        ],
        "currentResult": "[ 1 ]",
        "explanation": "Inorder records Node 1 value after left child check. Result is now [1]."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 7,
        "pseudocodeText": "traverse(node.right, result).",
        "operation": "RECURSE_RIGHT",
        "title": "Node 1: Recurse to Right Child (Node 2)",
        "variables": [
          {
            "name": "node",
            "value": "Node(2)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1), traverse(2) ]"
          },
          {
            "name": "result",
            "value": "[ 1 ]"
          }
        ],
        "before": {
          "node": "Node(1)",
          "callStack": "[ traverse(1) ]"
        },
        "condition": {
          "text": "Does Node 1 have a right child?",
          "evaluation": "Node(2)",
          "passes": true
        },
        "action": {
          "description": "Call traverse(Node 2). Push traverse(2) onto call stack."
        },
        "after": {
          "node": "Node(2)",
          "callStack": "[ traverse(1), traverse(2) ]"
        },
        "changes": [
          {
            "var": "node",
            "from": "Node(1)",
            "to": "Node(2)"
          },
          {
            "var": "callStack",
            "from": "[ traverse(1) ]",
            "to": "[ traverse(1), traverse(2) ]"
          }
        ],
        "currentResult": "[ 1 ]",
        "explanation": "Recurse into right child Node 2. Result remains [1]."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 5,
        "pseudocodeText": "traverse(node.left, result).",
        "operation": "RECURSE_LEFT",
        "title": "Node 2: Recurse to Left Child (Node 3)",
        "variables": [
          {
            "name": "node",
            "value": "Node(3)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1), traverse(2), traverse(3) ]"
          },
          {
            "name": "result",
            "value": "[ 1 ]"
          }
        ],
        "before": {
          "node": "Node(2)",
          "callStack": "[ traverse(1), traverse(2) ]"
        },
        "condition": {
          "text": "Does Node 2 have a left child?",
          "evaluation": "Node(3)",
          "passes": true
        },
        "action": {
          "description": "Call traverse(Node 3). Push traverse(3) onto call stack."
        },
        "after": {
          "node": "Node(3)",
          "callStack": "[ traverse(1), traverse(2), traverse(3) ]"
        },
        "changes": [
          {
            "var": "node",
            "from": "Node(2)",
            "to": "Node(3)"
          },
          {
            "var": "callStack",
            "from": "[ traverse(1), traverse(2) ]",
            "to": "[ traverse(1), traverse(2), traverse(3) ]"
          }
        ],
        "currentResult": "[ 1 ]",
        "explanation": "Inorder processes left subtree first. Recurse into left child Node 3 before recording Node 2."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 3,
        "pseudocodeText": "IF node is NULL: RETURN / Check left child.",
        "operation": "CHECK_LEFT",
        "title": "Node 3: Check Left Child",
        "variables": [
          {
            "name": "node",
            "value": "Node(3)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1), traverse(2), traverse(3) ]"
          },
          {
            "name": "result",
            "value": "[ 1 ]"
          }
        ],
        "before": {
          "node": "Node(3)",
          "result": "[ 1 ]"
        },
        "condition": {
          "text": "Does Node 3 have a left child?",
          "evaluation": "NULL (No left child)",
          "passes": false
        },
        "action": {
          "description": "Node 3 left child is NULL. Proceed to record Node 3 value."
        },
        "after": {
          "node": "Node(3)",
          "result": "[ 1 ]"
        },
        "changes": [],
        "currentResult": "[ 1 ]",
        "explanation": "Node 3 has no left subtree (NULL)."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 6,
        "pseudocodeText": "Append node.value to result.",
        "operation": "RECORD_NODE",
        "title": "Node 3: Visit & Record Value 3",
        "variables": [
          {
            "name": "node",
            "value": "Node(3)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1), traverse(2) ]"
          },
          {
            "name": "result",
            "value": "[ 1, 3 ]"
          }
        ],
        "before": {
          "result": "[ 1 ]"
        },
        "condition": {
          "text": "Append Node 3 value (3) to result array?",
          "evaluation": "Record 3",
          "passes": true
        },
        "action": {
          "description": "Append 3 to result array. Pop traverse(3) from call stack."
        },
        "after": {
          "result": "[ 1, 3 ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "[ 1 ]",
            "to": "[ 1, 3 ]"
          },
          {
            "var": "callStack",
            "from": "[ traverse(1), traverse(2), traverse(3) ]",
            "to": "[ traverse(1), traverse(2) ]"
          }
        ],
        "currentResult": "[ 1, 3 ]",
        "explanation": "Node 3 value is recorded. Result becomes [1, 3]."
      },
      {
        "stepNo": 8,
        "pseudocodeLines": [
          6,
          7,
          8
        ],
        "pseudocodeLine": 6,
        "pseudocodeText": "Return to Node 2, append 2 to result, complete traverse(Node 2).",
        "operation": "RECORD_NODE",
        "title": "Node 2: Visit Value 2 & Finish traverse(2)",
        "variables": [
          {
            "name": "node",
            "value": "Node(2)"
          },
          {
            "name": "callStack",
            "value": "[ traverse(1) ]"
          },
          {
            "name": "result",
            "value": "[ 1, 3, 2 ]"
          }
        ],
        "before": {
          "node": "Node(3)",
          "result": "[ 1, 3 ]",
          "callStack": "[ traverse(1), traverse(2) ]"
        },
        "condition": {
          "text": "Has the left subtree of Node 2 completed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return to Node 2, append value 2 to the result, then complete traverse(Node 2)."
        },
        "after": {
          "node": "Node(2)",
          "result": "[ 1, 3, 2 ]",
          "callStack": "[ traverse(1) ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "[ 1, 3 ]",
            "to": "[ 1, 3, 2 ]"
          },
          {
            "var": "callStack",
            "from": "[ traverse(1), traverse(2) ]",
            "to": "[ traverse(1) ]"
          }
        ],
        "currentResult": "[ 1, 3, 2 ]",
        "explanation": "Left subtree (Node 3) completed. Returned to Node 2, recorded 2, and finished traverse(Node 2)."
      },
      {
        "stepNo": 9,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 8,
        "pseudocodeText": "Return from traverse(Node 2) to Node 1 and return final result [1, 3, 2].",
        "operation": "RETURN",
        "title": "Return Complete Inorder Traversal Array",
        "variables": [
          {
            "name": "node",
            "value": "NULL"
          },
          {
            "name": "callStack",
            "value": "[ ]"
          },
          {
            "name": "result",
            "value": "[ 1, 3, 2 ]"
          }
        ],
        "before": {
          "node": "Node(2)",
          "callStack": "[ traverse(1) ]"
        },
        "condition": {
          "text": "Are all recursive calls now complete?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return from traverse(Node 2) to Node 1, complete traverse(Node 1), and return the final inorder result [1, 3, 2]."
        },
        "after": {
          "node": "NULL",
          "callStack": "[ ]"
        },
        "changes": [
          {
            "var": "node",
            "from": "Node(2)",
            "to": "NULL"
          },
          {
            "var": "callStack",
            "from": "[ traverse(1) ]",
            "to": "[ ]"
          }
        ],
        "currentResult": "[ 1, 3, 2 ]",
        "explanation": "All recursive traversals finished. Call stack emptied and final inorder traversal output is [1, 3, 2]."
      }
    ],
    "summary": {
      "title": "Binary Tree Inorder Traversal Dry Run Summary",
      "inputSummary": "Tree with nodes [1, null, 2, 3]",
      "finalOutput": "[ 1, 3, 2 ]",
      "takeaway": "Inorder depth-first traversal visited nodes in Left ➔ Root ➔ Right sequence.",
      "observations": [
        "Recursive call stack processes leftmost descendant branches first.",
        "Root values are appended between left and right subtree visits.",
        "The result array grows in Left ➔ Root ➔ Right visitation order."
      ]
    },
    "finalState": {
      "result": "[ 1, 3, 2 ]",
      "explanation": "All recursive traversals finished. Call stack emptied and final inorder traversal output is [1, 3, 2]."
    }
  },
  "number-of-islands": {
    "problemId": "number-of-islands",
    "approachId": "dfs",
    "approachName": "DFS",
    "input": {
      "title": "Number of Islands",
      "inputVisual": "2D Grid (Land \"1\", Water \"0\")",
      "items": [
        {
          "label": "Grid Dimensions",
          "value": "4 x 5 Matrix"
        }
      ],
      "expectedOutput": "1"
    },
    "initialState": {
      "subtitle": "State before grid scan begins",
      "variables": [
        {
          "name": "r",
          "value": "0",
          "label": "Row Index (r)"
        },
        {
          "name": "c",
          "value": "0",
          "label": "Column Index (c)"
        },
        {
          "name": "grid[r][c]",
          "value": "\"1\"",
          "label": "Cell Value"
        },
        {
          "name": "islandCount",
          "value": "0",
          "label": "Island Counter"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 5,
        "pseudocodeText": "Increment islandCount by 1.",
        "operation": "DISCOVER_ISLAND",
        "title": "Step 1: Scan Reaches Land at (0, 0) ➔ Island Discovered",
        "variables": [
          {
            "name": "r",
            "value": "0"
          },
          {
            "name": "c",
            "value": "0"
          },
          {
            "name": "grid[r][c]",
            "value": "\"1\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "r": "0",
          "c": "0",
          "grid[0][0]": "\"1\"",
          "islandCount": "0"
        },
        "condition": {
          "text": "Is grid[0][0] unvisited land (\"1\")?",
          "evaluation": "YES ➔ Increment islandCount & launch DFS",
          "passes": true
        },
        "action": {
          "description": "Increment islandCount to 1 and trigger DFS(grid, 0, 0)."
        },
        "after": {
          "r": "0",
          "c": "0",
          "grid[0][0]": "\"1\"",
          "islandCount": "1"
        },
        "changes": [
          {
            "var": "islandCount",
            "from": "0",
            "to": "1"
          }
        ],
        "currentResult": "islandCount = 1",
        "explanation": "Grid scan finds unvisited land cell \"1\" at (0, 0). Increment islandCount to 1 and launch DFS flood-fill."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 6,
        "pseudocodeText": "Call DFS(grid, r, c) to sink connected land.",
        "operation": "SINK_ORIGIN",
        "title": "Step 2: DFS Starts ➔ Sink Origin Cell (0,0) to \"0\"",
        "variables": [
          {
            "name": "r",
            "value": "0"
          },
          {
            "name": "c",
            "value": "0"
          },
          {
            "name": "grid[r][c]",
            "value": "\"0\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "r": "0",
          "c": "0",
          "grid[0][0]": "\"1\"",
          "islandCount": "1"
        },
        "condition": {
          "text": "Is cell (0,0) land (\"1\")?",
          "evaluation": "YES ➔ Sink land cell to \"0\"",
          "passes": true
        },
        "action": {
          "description": "Mutate grid[0][0] from \"1\" to \"0\" to mark it visited."
        },
        "after": {
          "r": "0",
          "c": "0",
          "grid[0][0]": "\"0\"",
          "islandCount": "1"
        },
        "changes": [
          {
            "var": "c",
            "from": "0",
            "to": "1"
          }
        ],
        "currentResult": "islandCount = 1",
        "explanation": "DFS mutates origin cell (0,0) from \"1\" to \"0\" so it will not be counted again."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 6,
        "pseudocodeText": "DFS recursively visits connected neighbor land cells.",
        "operation": "SINK_NEIGHBORS",
        "title": "Step 3: DFS Flood-Fill ➔ Sink Connected Neighbors (0,1) & (1,0)",
        "variables": [
          {
            "name": "r",
            "value": "0"
          },
          {
            "name": "c",
            "value": "1"
          },
          {
            "name": "grid[r][c]",
            "value": "\"0\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "grid[0][1]": "\"1\"",
          "grid[1][0]": "\"1\"",
          "islandCount": "1"
        },
        "condition": {
          "text": "Are connected neighbors (0,1) and (1,0) land?",
          "evaluation": "YES ➔ Sink connected land cells",
          "passes": true
        },
        "action": {
          "description": "Recursively sink connected land cells grid[0][1] and grid[1][0] to \"0\"."
        },
        "after": {
          "grid[0][1]": "\"0\"",
          "grid[1][0]": "\"0\"",
          "islandCount": "1"
        },
        "changes": [
          {
            "var": "grid[0][1]",
            "from": "\"1\"",
            "to": "\"0\""
          },
          {
            "var": "grid[1][0]",
            "from": "\"1\"",
            "to": "\"0\""
          }
        ],
        "currentResult": "islandCount = 1",
        "explanation": "DFS flood-fill recursively traverses adjacent land cells and changes them from \"1\" to \"0\"."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 4,
        "pseudocodeText": "IF grid[r][c] is \"1\":",
        "operation": "SCAN_CONTINUE",
        "title": "Step 4: Grid Scan Resumes ➔ Inspect Sunk Cell (0,1)",
        "variables": [
          {
            "name": "r",
            "value": "0"
          },
          {
            "name": "c",
            "value": "1"
          },
          {
            "name": "grid[r][c]",
            "value": "\"0\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "r": "0",
          "c": "1",
          "grid[0][1]": "\"0\"",
          "islandCount": "1"
        },
        "condition": {
          "text": "Is cell (0,1) unvisited land (\"1\")?",
          "evaluation": "NO ➔ Already changed to \"0\" by DFS",
          "passes": false
        },
        "action": {
          "description": "Skip cell (0,1) because DFS already changed it to \"0\"."
        },
        "after": {
          "r": "0",
          "c": "1",
          "grid[0][1]": "\"0\"",
          "islandCount": "1"
        },
        "changes": [
          {
            "var": "r",
            "from": "0",
            "to": "0"
          },
          {
            "var": "c",
            "from": "0",
            "to": "1"
          }
        ],
        "currentResult": "islandCount = 1",
        "explanation": "Grid scan moves to (0,1). Because DFS already changed it to \"0\", it is skipped without incrementing islandCount."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 3,
        "pseudocodeText": "FOR each row r and column c in grid:",
        "operation": "SCAN_COMPLETE",
        "title": "Step 5: Grid Scan Continues Across Remaining Cells",
        "variables": [
          {
            "name": "r",
            "value": "3"
          },
          {
            "name": "c",
            "value": "4"
          },
          {
            "name": "grid[r][c]",
            "value": "\"0\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "r": "0",
          "c": "1",
          "grid[0][1]": "\"0\"",
          "islandCount": "1"
        },
        "condition": {
          "text": "Are remaining grid cells unvisited land (\"1\")?",
          "evaluation": "NO ➔ All remaining cells are water \"0\"",
          "passes": false
        },
        "action": {
          "description": "Scan remaining grid positions through row 3, col 4. No new land cells found."
        },
        "after": {
          "r": "3",
          "c": "4",
          "grid[3][4]": "\"0\"",
          "islandCount": "1"
        },
        "changes": [
          {
            "var": "r",
            "from": "0",
            "to": "3"
          },
          {
            "var": "c",
            "from": "1",
            "to": "4"
          }
        ],
        "currentResult": "islandCount = 1",
        "explanation": "Scan finishes evaluating all matrix positions. Total island count remains 1."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 7,
        "pseudocodeText": "RETURN islandCount.",
        "operation": "RETURN",
        "title": "Step 6: Grid Scan Complete ➔ Return islandCount (1)",
        "variables": [
          {
            "name": "r",
            "value": "3"
          },
          {
            "name": "c",
            "value": "4"
          },
          {
            "name": "grid[r][c]",
            "value": "\"0\""
          },
          {
            "name": "islandCount",
            "value": "1"
          }
        ],
        "before": {
          "r": "3",
          "c": "4",
          "grid[3][4]": "\"0\"",
          "islandCount": "1"
        },
        "condition": {
          "text": "Have all cells in 4x5 grid been scanned?",
          "evaluation": "YES ➔ Return final count",
          "passes": true
        },
        "action": {
          "description": "Return islandCount = 1."
        },
        "after": {
          "r": "3",
          "c": "4",
          "grid[3][4]": "\"0\"",
          "islandCount": "1"
        },
        "changes": [],
        "currentResult": "1",
        "explanation": "Grid scan complete. Algorithm returns total islandCount = 1."
      }
    ],
    "summary": {
      "title": "Number of Islands Dry Run Summary",
      "inputSummary": "4x5 Grid",
      "finalOutput": "1",
      "takeaway": "The scan found an unvisited land cell, increased the island count, and DFS changed its connected land cells to \"0\" before the scan continued.",
      "observations": [
        "Finding an unvisited land cell \"1\" triggers a new island discovery.",
        "DFS flood-fill changes connected land cells from \"1\" to \"0\".",
        "Mutated cells are not counted again when the grid scan continues."
      ]
    },
    "finalState": {
      "result": "1",
      "explanation": "Grid scan complete. Algorithm returns total islandCount = 1."
    }
  },
  "merge-intervals": {
    "problemId": "merge-intervals",
    "approachId": "sorting",
    "approachName": "Sorting + Sweep",
    "input": {
      "title": "Merge Intervals",
      "inputVisual": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
      "items": [
        {
          "label": "Interval Ranges",
          "value": "[[1,3], [2,6], [8,10], [15,18]]"
        }
      ],
      "expectedOutput": "[[1,6], [8,10], [15,18]]"
    },
    "initialState": {
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Interval Index"
        },
        {
          "name": "curr",
          "value": "-",
          "label": "Current Interval"
        },
        {
          "name": "lastMerged",
          "value": "-",
          "label": "Last Merged Range"
        },
        {
          "name": "merged",
          "value": "[ ]",
          "label": "Merged Intervals"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 3,
        "pseudocodeText": "Create merged array with intervals[0].",
        "operation": "INITIALIZE",
        "title": "Sort & Seed Merged Array with [1, 3]",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "curr",
            "value": "[2, 6]"
          },
          {
            "name": "lastMerged",
            "value": "[1, 3]"
          },
          {
            "name": "merged",
            "value": "[[1, 3]]"
          }
        ],
        "before": {
          "merged": "[ ]"
        },
        "condition": {
          "text": "Sorted by start time",
          "evaluation": "SORTED",
          "passes": true
        },
        "action": {
          "description": "Seed merged list with first interval [1, 3]."
        },
        "after": {
          "merged": "[[1, 3]]"
        },
        "changes": [
          {
            "var": "merged",
            "from": "[ ]",
            "to": "[[1, 3]]"
          }
        ],
        "currentResult": "[[1, 3]]",
        "explanation": "Sorting by start coordinate guarantees adjacent overlaps."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 7,
        "pseudocodeText": "Set lastMerged.end = MAX(lastMerged.end, interval.end).",
        "operation": "MERGE_RANGE",
        "title": "Merge Overlapping Interval [2, 6]",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "curr",
            "value": "[2, 6]"
          },
          {
            "name": "lastMerged",
            "value": "[1, 6]"
          },
          {
            "name": "merged",
            "value": "[[1, 6]]"
          }
        ],
        "before": {
          "lastMerged": "[1, 3]"
        },
        "condition": {
          "text": "Does curr.start (2) <= lastMerged.end (3)?",
          "evaluation": "2 <= 3 (Overlap!)",
          "passes": true
        },
        "action": {
          "description": "Extend lastMerged.end = MAX(3, 6) = 6."
        },
        "after": {
          "lastMerged": "[1, 6]"
        },
        "changes": [
          {
            "var": "merged",
            "from": "[[1, 3]]",
            "to": "[[1, 6]]"
          }
        ],
        "currentResult": "[[1, 6]]",
        "explanation": "Interval [2, 6] overlaps with [1, 3]. Merged into [1, 6]."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 9,
        "pseudocodeText": "Append interval to merged array.",
        "operation": "APPEND_NEW",
        "title": "Non-Overlapping [8, 10] ➔ Append",
        "variables": [
          {
            "name": "i",
            "value": "2"
          },
          {
            "name": "curr",
            "value": "[8, 10]"
          },
          {
            "name": "lastMerged",
            "value": "[8, 10]"
          },
          {
            "name": "merged",
            "value": "[[1, 6], [8, 10]]"
          }
        ],
        "before": {
          "merged": "[[1, 6]]"
        },
        "condition": {
          "text": "Does curr.start (8) <= lastMerged.end (6)?",
          "evaluation": "8 <= 6 (No overlap)",
          "passes": false
        },
        "action": {
          "description": "Append new independent interval [8, 10]."
        },
        "after": {
          "merged": "[[1, 6], [8, 10]]"
        },
        "changes": [
          {
            "var": "merged",
            "from": "[[1, 6]]",
            "to": "[[1, 6], [8, 10]]"
          }
        ],
        "currentResult": "[[1, 6], [8, 10]]",
        "explanation": "[8, 10] starts after 6. Appended as separate range."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 9,
        "pseudocodeText": "Append interval to merged array.",
        "operation": "APPEND_NEW",
        "title": "Non-Overlapping [15, 18] ➔ Append",
        "variables": [
          {
            "name": "i",
            "value": "3"
          },
          {
            "name": "curr",
            "value": "[15, 18]"
          },
          {
            "name": "lastMerged",
            "value": "[15, 18]"
          },
          {
            "name": "merged",
            "value": "[[1, 6], [8, 10], [15, 18]]"
          }
        ],
        "before": {
          "merged": "[[1, 6], [8, 10]]"
        },
        "condition": {
          "text": "Does curr.start (15) <= lastMerged.end (10)?",
          "evaluation": "15 <= 10 (No overlap)",
          "passes": false
        },
        "action": {
          "description": "Append interval [15, 18]."
        },
        "after": {
          "merged": "[[1, 6], [8, 10], [15, 18]]"
        },
        "changes": [
          {
            "var": "merged",
            "from": "[[1, 6], [8, 10]]",
            "to": "[[1, 6], [8, 10], [15, 18]]"
          }
        ],
        "currentResult": "[[1, 6], [8, 10], [15, 18]]",
        "explanation": "[15, 18] appended."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 10,
        "pseudocodeText": "RETURN merged array.",
        "operation": "RETURN",
        "title": "Return Consolidated Merged Intervals",
        "variables": [
          {
            "name": "i",
            "value": "4"
          },
          {
            "name": "curr",
            "value": "-"
          },
          {
            "name": "lastMerged",
            "value": "[15, 18]"
          },
          {
            "name": "merged",
            "value": "[[1, 6], [8, 10], [15, 18]]"
          }
        ],
        "before": {},
        "condition": {
          "text": "Linear sweep complete",
          "evaluation": "DONE",
          "passes": true
        },
        "action": {
          "description": "Return merged array."
        },
        "after": {},
        "changes": [],
        "currentResult": "[[1, 6], [8, 10], [15, 18]]",
        "explanation": "All overlapping ranges consolidated."
      }
    ],
    "summary": {
      "title": "Merge Intervals Dry Run Summary",
      "inputSummary": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
      "finalOutput": "[[1,6], [8,10], [15,18]]",
      "takeaway": "Sorting by start coordinate enabled single-pass interval consolidation.",
      "observations": [
        "Sorting ensures all potentially overlapping ranges are adjacent.",
        "If current start <= last merged end, extend end coordinate.",
        "Otherwise start a new interval."
      ]
    },
    "finalState": {
      "result": "[[1, 6], [8, 10], [15, 18]]",
      "explanation": "All overlapping ranges consolidated."
    }
  },
  "longest-substring-no-repeat": {
    "problemId": "longest-substring-no-repeat",
    "approachId": "slidingWindow",
    "approachName": "Sliding Window + HashSet",
    "input": {
      "title": "Longest Substring Without Repeating Characters",
      "inputVisual": "s = \" a b c a b c b b \"",
      "items": [
        {
          "label": "Input String (s)",
          "value": "\"a b c a b c b b\""
        }
      ],
      "expectedOutput": "3"
    },
    "initialState": {
      "variables": [
        {
          "name": "left",
          "value": "0",
          "label": "Left Pointer"
        },
        {
          "name": "right",
          "value": "0",
          "label": "Right Pointer"
        },
        {
          "name": "char",
          "value": "a",
          "label": "Current Character"
        },
        {
          "name": "charSet",
          "value": "{ }",
          "label": "HashSet (Unique Chars)"
        },
        {
          "name": "maxLength",
          "value": "0",
          "label": "Max Length"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLines": [
          1,
          2
        ],
        "pseudocodeLine": 2,
        "pseudocodeText": "Initialize left = 0, maxLength = 0, charSet = empty set.",
        "operation": "INITIALIZE",
        "title": "Initialize Window Pointers & HashSet",
        "variables": [
          {
            "name": "left",
            "value": "0"
          },
          {
            "name": "right",
            "value": "0"
          },
          {
            "name": "char",
            "value": "-"
          },
          {
            "name": "charSet",
            "value": "{ }"
          },
          {
            "name": "maxLength",
            "value": "0"
          }
        ],
        "before": {
          "charSet": "{ }"
        },
        "condition": {
          "text": "Start execution",
          "evaluation": "START",
          "passes": true
        },
        "action": {
          "description": "Set left = 0, maxLength = 0, charSet = empty set."
        },
        "after": {
          "charSet": "{ }"
        },
        "changes": [],
        "currentResult": "0",
        "explanation": "Pointers initialized. Beginning iteration over string \"abcabcbb\"."
      },
      {
        "stepNo": 2,
        "pseudocodeLines": [
          3,
          4,
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[0] (\"a\") to charSet. Set maxLength = MAX(0, 0-0+1) = 1.",
        "operation": "EXPAND_RIGHT",
        "title": "Expand right = 0 (\"a\")",
        "variables": [
          {
            "name": "left",
            "value": "0"
          },
          {
            "name": "right",
            "value": "0"
          },
          {
            "name": "char",
            "value": "\"a\""
          },
          {
            "name": "charSet",
            "value": "{ \"a\" }"
          },
          {
            "name": "maxLength",
            "value": "1"
          }
        ],
        "before": {
          "charSet": "{ }",
          "maxLength": "0"
        },
        "condition": {
          "text": "Is s[0] (\"a\") in charSet { }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"a\" to charSet. Update maxLength = MAX(0, 1) = 1."
        },
        "after": {
          "charSet": "{ \"a\" }",
          "maxLength": "1"
        },
        "changes": [
          {
            "var": "char",
            "from": "-",
            "to": "\"a\""
          },
          {
            "var": "charSet",
            "from": "{ }",
            "to": "{ \"a\" }"
          },
          {
            "var": "maxLength",
            "from": "0",
            "to": "1"
          }
        ],
        "currentResult": "1",
        "explanation": "Window \"a\" has no duplicates. Added \"a\" to set."
      },
      {
        "stepNo": 3,
        "pseudocodeLines": [
          3,
          4,
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[1] (\"b\") to charSet. Set maxLength = MAX(1, 1-0+1) = 2.",
        "operation": "EXPAND_RIGHT",
        "title": "Expand right = 1 (\"b\")",
        "variables": [
          {
            "name": "left",
            "value": "0"
          },
          {
            "name": "right",
            "value": "1"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"a\", \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "2"
          }
        ],
        "before": {
          "charSet": "{ \"a\" }",
          "maxLength": "1"
        },
        "condition": {
          "text": "Is s[1] (\"b\") in charSet { \"a\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"b\" to charSet. Update maxLength = MAX(1, 2) = 2."
        },
        "after": {
          "charSet": "{ \"a\", \"b\" }",
          "maxLength": "2"
        },
        "changes": [
          {
            "var": "right",
            "from": "0",
            "to": "1"
          },
          {
            "var": "char",
            "from": "\"a\"",
            "to": "\"b\""
          },
          {
            "var": "charSet",
            "from": "{ \"a\" }",
            "to": "{ \"a\", \"b\" }"
          },
          {
            "var": "maxLength",
            "from": "1",
            "to": "2"
          }
        ],
        "currentResult": "2",
        "explanation": "Window \"ab\" is valid. Added \"b\" to set."
      },
      {
        "stepNo": 4,
        "pseudocodeLines": [
          3,
          4,
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[2] (\"c\") to charSet. Set maxLength = MAX(2, 2-0+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Expand right = 2 (\"c\")",
        "variables": [
          {
            "name": "left",
            "value": "0"
          },
          {
            "name": "right",
            "value": "2"
          },
          {
            "name": "char",
            "value": "\"c\""
          },
          {
            "name": "charSet",
            "value": "{ \"a\", \"b\", \"c\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ \"a\", \"b\" }",
          "maxLength": "2"
        },
        "condition": {
          "text": "Is s[2] (\"c\") in charSet { \"a\", \"b\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"c\" to charSet. Update maxLength = MAX(2, 3) = 3."
        },
        "after": {
          "charSet": "{ \"a\", \"b\", \"c\" }",
          "maxLength": "3"
        },
        "changes": [
          {
            "var": "right",
            "from": "1",
            "to": "2"
          },
          {
            "var": "char",
            "from": "\"b\"",
            "to": "\"c\""
          },
          {
            "var": "charSet",
            "from": "{ \"a\", \"b\" }",
            "to": "{ \"a\", \"b\", \"c\" }"
          },
          {
            "var": "maxLength",
            "from": "2",
            "to": "3"
          }
        ],
        "currentResult": "3",
        "explanation": "Window \"abc\" length = 3. Added \"c\" to set."
      },
      {
        "stepNo": 5,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[3] (\"a\") in charSet: Remove s[0] (\"a\"), increment left to 1.",
        "operation": "CONTRACT_LEFT",
        "title": "Duplicate \"a\" Found at right = 3 ➔ Evict s[0]",
        "variables": [
          {
            "name": "left",
            "value": "1"
          },
          {
            "name": "right",
            "value": "3"
          },
          {
            "name": "char",
            "value": "\"a\""
          },
          {
            "name": "charSet",
            "value": "{ \"b\", \"c\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "0",
          "charSet": "{ \"a\", \"b\", \"c\" }"
        },
        "condition": {
          "text": "Is s[3] (\"a\") in charSet { \"a\", \"b\", \"c\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[0] (\"a\") from charSet. Increment left = 1."
        },
        "after": {
          "left": "1",
          "charSet": "{ \"b\", \"c\" }"
        },
        "changes": [
          {
            "var": "right",
            "from": "2",
            "to": "3"
          },
          {
            "var": "char",
            "from": "\"c\"",
            "to": "\"a\""
          },
          {
            "var": "left",
            "from": "0",
            "to": "1"
          },
          {
            "var": "charSet",
            "from": "{ \"a\", \"b\", \"c\" }",
            "to": "{ \"b\", \"c\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"a\" detected. Evicted s[0] (\"a\") to shrink window left bound."
      },
      {
        "stepNo": 6,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[3] (\"a\") to charSet. Set maxLength = MAX(3, 3-1+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Add s[3] (\"a\") ➔ charSet { \"b\", \"c\", \"a\" }",
        "variables": [
          {
            "name": "left",
            "value": "1"
          },
          {
            "name": "right",
            "value": "3"
          },
          {
            "name": "char",
            "value": "\"a\""
          },
          {
            "name": "charSet",
            "value": "{ \"b\", \"c\", \"a\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ \"b\", \"c\" }"
        },
        "condition": {
          "text": "Is s[3] (\"a\") in charSet { \"b\", \"c\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"a\" to charSet. Current window \"bca\" length = 3."
        },
        "after": {
          "charSet": "{ \"b\", \"c\", \"a\" }"
        },
        "changes": [
          {
            "var": "charSet",
            "from": "{ \"b\", \"c\" }",
            "to": "{ \"b\", \"c\", \"a\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Added s[3] (\"a\") to charSet. Valid window \"bca\" size is 3."
      },
      {
        "stepNo": 7,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[4] (\"b\") in charSet: Remove s[1] (\"b\"), increment left to 2.",
        "operation": "CONTRACT_LEFT",
        "title": "Duplicate \"b\" Found at right = 4 ➔ Evict s[1]",
        "variables": [
          {
            "name": "left",
            "value": "2"
          },
          {
            "name": "right",
            "value": "4"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"c\", \"a\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "1",
          "charSet": "{ \"b\", \"c\", \"a\" }"
        },
        "condition": {
          "text": "Is s[4] (\"b\") in charSet { \"b\", \"c\", \"a\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[1] (\"b\") from charSet. Increment left = 2."
        },
        "after": {
          "left": "2",
          "charSet": "{ \"c\", \"a\" }"
        },
        "changes": [
          {
            "var": "right",
            "from": "3",
            "to": "4"
          },
          {
            "var": "char",
            "from": "\"a\"",
            "to": "\"b\""
          },
          {
            "var": "left",
            "from": "1",
            "to": "2"
          },
          {
            "var": "charSet",
            "from": "{ \"b\", \"c\", \"a\" }",
            "to": "{ \"c\", \"a\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"b\" detected. Evicted s[1] (\"b\") from set."
      },
      {
        "stepNo": 8,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[4] (\"b\") to charSet. Set maxLength = MAX(3, 4-2+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Add s[4] (\"b\") ➔ charSet { \"c\", \"a\", \"b\" }",
        "variables": [
          {
            "name": "left",
            "value": "2"
          },
          {
            "name": "right",
            "value": "4"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"c\", \"a\", \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ \"c\", \"a\" }"
        },
        "condition": {
          "text": "Is s[4] (\"b\") in charSet { \"c\", \"a\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"b\" to charSet. Current window \"cab\" length = 3."
        },
        "after": {
          "charSet": "{ \"c\", \"a\", \"b\" }"
        },
        "changes": [
          {
            "var": "charSet",
            "from": "{ \"c\", \"a\" }",
            "to": "{ \"c\", \"a\", \"b\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Added s[4] (\"b\") to charSet. Valid window \"cab\" size is 3."
      },
      {
        "stepNo": 9,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[5] (\"c\") in charSet: Remove s[2] (\"c\"), increment left to 3.",
        "operation": "CONTRACT_LEFT",
        "title": "Duplicate \"c\" Found at right = 5 ➔ Evict s[2]",
        "variables": [
          {
            "name": "left",
            "value": "3"
          },
          {
            "name": "right",
            "value": "5"
          },
          {
            "name": "char",
            "value": "\"c\""
          },
          {
            "name": "charSet",
            "value": "{ \"a\", \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "2",
          "charSet": "{ \"c\", \"a\", \"b\" }"
        },
        "condition": {
          "text": "Is s[5] (\"c\") in charSet { \"c\", \"a\", \"b\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[2] (\"c\") from charSet. Increment left = 3."
        },
        "after": {
          "left": "3",
          "charSet": "{ \"a\", \"b\" }"
        },
        "changes": [
          {
            "var": "right",
            "from": "4",
            "to": "5"
          },
          {
            "var": "char",
            "from": "\"b\"",
            "to": "\"c\""
          },
          {
            "var": "left",
            "from": "2",
            "to": "3"
          },
          {
            "var": "charSet",
            "from": "{ \"c\", \"a\", \"b\" }",
            "to": "{ \"a\", \"b\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"c\" detected. Evicted s[2] (\"c\") from set."
      },
      {
        "stepNo": 10,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[5] (\"c\") to charSet. Set maxLength = MAX(3, 5-3+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Add s[5] (\"c\") ➔ charSet { \"a\", \"b\", \"c\" }",
        "variables": [
          {
            "name": "left",
            "value": "3"
          },
          {
            "name": "right",
            "value": "5"
          },
          {
            "name": "char",
            "value": "\"c\""
          },
          {
            "name": "charSet",
            "value": "{ \"a\", \"b\", \"c\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ \"a\", \"b\" }"
        },
        "condition": {
          "text": "Is s[5] (\"c\") in charSet { \"a\", \"b\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"c\" to charSet. Current window \"abc\" length = 3."
        },
        "after": {
          "charSet": "{ \"a\", \"b\", \"c\" }"
        },
        "changes": [
          {
            "var": "charSet",
            "from": "{ \"a\", \"b\" }",
            "to": "{ \"a\", \"b\", \"c\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Added s[5] (\"c\") to charSet. Valid window \"abc\" size is 3."
      },
      {
        "stepNo": 11,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[6] (\"b\") in charSet: Remove s[3] (\"a\"), increment left to 4.",
        "operation": "CONTRACT_LEFT",
        "title": "Duplicate \"b\" Found at right = 6 ➔ Evict s[3] (\"a\")",
        "variables": [
          {
            "name": "left",
            "value": "4"
          },
          {
            "name": "right",
            "value": "6"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"b\", \"c\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "3",
          "charSet": "{ \"a\", \"b\", \"c\" }"
        },
        "condition": {
          "text": "Is s[6] (\"b\") in charSet { \"a\", \"b\", \"c\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[3] (\"a\") from charSet. Increment left = 4."
        },
        "after": {
          "left": "4",
          "charSet": "{ \"b\", \"c\" }"
        },
        "changes": [
          {
            "var": "right",
            "from": "5",
            "to": "6"
          },
          {
            "var": "char",
            "from": "\"c\"",
            "to": "\"b\""
          },
          {
            "var": "left",
            "from": "3",
            "to": "4"
          },
          {
            "var": "charSet",
            "from": "{ \"a\", \"b\", \"c\" }",
            "to": "{ \"b\", \"c\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"b\" detected. Evicted s[3] (\"a\") to shrink window."
      },
      {
        "stepNo": 12,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[6] (\"b\") in charSet: Remove s[4] (\"b\"), increment left to 5.",
        "operation": "CONTRACT_LEFT",
        "title": "Still Duplicate \"b\" ➔ Evict s[4] (\"b\")",
        "variables": [
          {
            "name": "left",
            "value": "5"
          },
          {
            "name": "right",
            "value": "6"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"c\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "4",
          "charSet": "{ \"b\", \"c\" }"
        },
        "condition": {
          "text": "Is s[6] (\"b\") still in charSet { \"b\", \"c\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[4] (\"b\") from charSet. Increment left = 5."
        },
        "after": {
          "left": "5",
          "charSet": "{ \"c\" }"
        },
        "changes": [
          {
            "var": "left",
            "from": "4",
            "to": "5"
          },
          {
            "var": "charSet",
            "from": "{ \"b\", \"c\" }",
            "to": "{ \"c\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"b\" evicted. Window shrink complete."
      },
      {
        "stepNo": 13,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[6] (\"b\") to charSet. Set maxLength = MAX(3, 6-5+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Add s[6] (\"b\") ➔ charSet { \"c\", \"b\" }",
        "variables": [
          {
            "name": "left",
            "value": "5"
          },
          {
            "name": "right",
            "value": "6"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"c\", \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ \"c\" }"
        },
        "condition": {
          "text": "Is s[6] (\"b\") in charSet { \"c\" }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"b\" to charSet. Current window \"cb\" length = 2."
        },
        "after": {
          "charSet": "{ \"c\", \"b\" }"
        },
        "changes": [
          {
            "var": "charSet",
            "from": "{ \"c\" }",
            "to": "{ \"c\", \"b\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Added s[6] (\"b\") to set. Window \"cb\" size is 2."
      },
      {
        "stepNo": 14,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[7] (\"b\") in charSet: Remove s[5] (\"c\"), increment left to 6.",
        "operation": "CONTRACT_LEFT",
        "title": "Duplicate \"b\" Found at right = 7 ➔ Evict s[5] (\"c\")",
        "variables": [
          {
            "name": "left",
            "value": "6"
          },
          {
            "name": "right",
            "value": "7"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "5",
          "charSet": "{ \"c\", \"b\" }"
        },
        "condition": {
          "text": "Is s[7] (\"b\") in charSet { \"c\", \"b\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[5] (\"c\") from charSet. Increment left = 6."
        },
        "after": {
          "left": "6",
          "charSet": "{ \"b\" }"
        },
        "changes": [
          {
            "var": "right",
            "from": "6",
            "to": "7"
          },
          {
            "var": "left",
            "from": "5",
            "to": "6"
          },
          {
            "var": "charSet",
            "from": "{ \"c\", \"b\" }",
            "to": "{ \"b\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"b\" detected at last char. Evicted s[5] (\"c\")."
      },
      {
        "stepNo": 15,
        "pseudocodeLines": [
          4,
          5,
          6
        ],
        "pseudocodeLine": 5,
        "pseudocodeText": "WHILE s[7] (\"b\") in charSet: Remove s[6] (\"b\"), increment left to 7.",
        "operation": "CONTRACT_LEFT",
        "title": "Still Duplicate \"b\" ➔ Evict s[6] (\"b\")",
        "variables": [
          {
            "name": "left",
            "value": "7"
          },
          {
            "name": "right",
            "value": "7"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "left": "6",
          "charSet": "{ \"b\" }"
        },
        "condition": {
          "text": "Is s[7] (\"b\") still in charSet { \"b\" }?",
          "evaluation": "YES (Duplicate!)",
          "passes": true
        },
        "action": {
          "description": "Remove s[6] (\"b\") from charSet. Increment left = 7."
        },
        "after": {
          "left": "7",
          "charSet": "{ }"
        },
        "changes": [
          {
            "var": "left",
            "from": "6",
            "to": "7"
          },
          {
            "var": "charSet",
            "from": "{ \"b\" }",
            "to": "{ }"
          }
        ],
        "currentResult": "3",
        "explanation": "Duplicate \"b\" evicted. Window set now empty."
      },
      {
        "stepNo": 16,
        "pseudocodeLines": [
          7,
          8
        ],
        "pseudocodeLine": 7,
        "pseudocodeText": "Add s[7] (\"b\") to charSet. Set maxLength = MAX(3, 7-7+1) = 3.",
        "operation": "EXPAND_RIGHT",
        "title": "Add s[7] (\"b\") ➔ charSet { \"b\" }",
        "variables": [
          {
            "name": "left",
            "value": "7"
          },
          {
            "name": "right",
            "value": "7"
          },
          {
            "name": "char",
            "value": "\"b\""
          },
          {
            "name": "charSet",
            "value": "{ \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {
          "charSet": "{ }"
        },
        "condition": {
          "text": "Is s[7] (\"b\") in charSet { }?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Add \"b\" to charSet. Window \"b\" length = 1."
        },
        "after": {
          "charSet": "{ \"b\" }"
        },
        "changes": [
          {
            "var": "charSet",
            "from": "{ }",
            "to": "{ \"b\" }"
          }
        ],
        "currentResult": "3",
        "explanation": "Added last character \"b\" to set. Loop finishes."
      },
      {
        "stepNo": 17,
        "pseudocodeLines": [
          9,
          10
        ],
        "pseudocodeLine": 9,
        "pseudocodeText": "RETURN maxLength.",
        "operation": "RETURN",
        "title": "Return Max Substring Length (3)",
        "variables": [
          {
            "name": "left",
            "value": "7"
          },
          {
            "name": "right",
            "value": "7"
          },
          {
            "name": "char",
            "value": "-"
          },
          {
            "name": "charSet",
            "value": "{ \"b\" }"
          },
          {
            "name": "maxLength",
            "value": "3"
          }
        ],
        "before": {},
        "condition": {
          "text": "Traversal complete (right = 8 >= len)",
          "evaluation": "DONE",
          "passes": true
        },
        "action": {
          "description": "Traversal finished. All 8 characters processed. Return final maxLength = 3."
        },
        "after": {},
        "changes": [],
        "currentResult": "3",
        "explanation": "Completed scan over entire string \"abcabcbb\". Longest unique substring length is 3 (\"abc\")."
      }
    ],
    "summary": {
      "title": "Longest Substring Without Repeating Characters Dry Run Summary",
      "inputSummary": "s = \" a b c a b c b b \"",
      "finalOutput": "3",
      "takeaway": "Dynamic sliding window with HashSet tracked unique character spans.",
      "observations": [
        "Right pointer expands window when character is unique.",
        "Left pointer contracts window when duplicate character is encountered.",
        "HashSet offers fast duplicate membership checks."
      ]
    },
    "finalState": {
      "result": "3",
      "explanation": "Completed scan over entire string \"abcabcbb\". Longest unique substring length is 3 (\"abc\")."
    }
  },
  "shortest-path-graph": {
    "problemId": "shortest-path-graph",
    "approachId": "bfs",
    "approachName": "BFS",
    "input": {
      "title": "Shortest Path in Unweighted Graph",
      "inputVisual": "Graph: Node A ➔ Nodes B, C ➔ Node D",
      "items": [
        {
          "label": "Start Node",
          "value": "A"
        },
        {
          "label": "Destination Node",
          "value": "D"
        }
      ],
      "expectedOutput": "2"
    },
    "initialState": {
      "variables": [
        {
          "name": "currNode",
          "value": "A",
          "label": "Current Node"
        },
        {
          "name": "dist",
          "value": "0",
          "label": "Distance Hops"
        },
        {
          "name": "queue",
          "value": "[ (A, 0) ]",
          "label": "BFS Queue"
        },
        {
          "name": "visited",
          "value": "{ A }",
          "label": "Visited Set"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLines": [
          1,
          2
        ],
        "pseudocodeLine": 2,
        "pseudocodeText": "Initialize queue = [(A, 0)], visited = {A}.",
        "operation": "INITIALIZE",
        "title": "Initialize BFS Queue & Visited Set",
        "variables": [
          {
            "name": "currNode",
            "value": "A"
          },
          {
            "name": "dist",
            "value": "0"
          },
          {
            "name": "queue",
            "value": "[ (A, 0) ]"
          },
          {
            "name": "visited",
            "value": "{ A }"
          }
        ],
        "before": {
          "queue": "[ (A, 0) ]"
        },
        "condition": {
          "text": "Start BFS traversal",
          "evaluation": "START",
          "passes": true
        },
        "action": {
          "description": "Enqueue (A, 0) and mark A visited."
        },
        "after": {
          "queue": "[ (A, 0) ]"
        },
        "changes": [],
        "currentResult": "0",
        "explanation": "BFS queue initialized with start node A at distance 0."
      },
      {
        "stepNo": 2,
        "pseudocodeLines": [
          3,
          4,
          5,
          7,
          8,
          9,
          10
        ],
        "pseudocodeLine": 4,
        "pseudocodeText": "Pop (A, 0). Check A == D (NO). Enqueue neighbors B, C with dist = 1.",
        "operation": "ENQUEUE_NEIGHBORS",
        "title": "Pop A ➔ Push Neighbors B & C (Dist 1)",
        "variables": [
          {
            "name": "currNode",
            "value": "A"
          },
          {
            "name": "dist",
            "value": "0"
          },
          {
            "name": "queue",
            "value": "[ (B, 1), (C, 1) ]"
          },
          {
            "name": "visited",
            "value": "{ A, B, C }"
          }
        ],
        "before": {
          "queue": "[ (A, 0) ]",
          "visited": "{ A }"
        },
        "condition": {
          "text": "Is A destination D?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Pop (A, 0). Discover and enqueue unvisited neighbors B and C with distance 1."
        },
        "after": {
          "queue": "[ (B, 1), (C, 1) ]",
          "visited": "{ A, B, C }"
        },
        "changes": [
          {
            "var": "queue",
            "from": "[ (A, 0) ]",
            "to": "[ (B, 1), (C, 1) ]"
          },
          {
            "var": "visited",
            "from": "{ A }",
            "to": "{ A, B, C }"
          }
        ],
        "currentResult": "0",
        "explanation": "Node A processed. Level 1 neighbors B and C enqueued."
      },
      {
        "stepNo": 3,
        "pseudocodeLines": [
          3,
          4,
          5,
          7,
          8,
          9,
          10
        ],
        "pseudocodeLine": 4,
        "pseudocodeText": "Pop (B, 1). Check B == D (NO). Enqueue neighbor D with dist = 2.",
        "operation": "ENQUEUE_NEIGHBORS",
        "title": "Pop B ➔ Push Neighbor D (Dist 2)",
        "variables": [
          {
            "name": "currNode",
            "value": "B"
          },
          {
            "name": "dist",
            "value": "1"
          },
          {
            "name": "queue",
            "value": "[ (C, 1), (D, 2) ]"
          },
          {
            "name": "visited",
            "value": "{ A, B, C, D }"
          }
        ],
        "before": {
          "currNode": "A",
          "dist": "0",
          "queue": "[ (B, 1), (C, 1) ]",
          "visited": "{ A, B, C }"
        },
        "condition": {
          "text": "Is B destination D?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Pop (B, 1). Discover and enqueue unvisited neighbor D with distance 2."
        },
        "after": {
          "currNode": "B",
          "dist": "1",
          "queue": "[ (C, 1), (D, 2) ]",
          "visited": "{ A, B, C, D }"
        },
        "changes": [
          {
            "var": "currNode",
            "from": "A",
            "to": "B"
          },
          {
            "var": "dist",
            "from": "0",
            "to": "1"
          },
          {
            "var": "queue",
            "from": "[ (B, 1), (C, 1) ]",
            "to": "[ (C, 1), (D, 2) ]"
          },
          {
            "var": "visited",
            "from": "{ A, B, C }",
            "to": "{ A, B, C, D }"
          }
        ],
        "currentResult": "1",
        "explanation": "Node B processed. Destination node D discovered and enqueued at distance 2."
      },
      {
        "stepNo": 4,
        "pseudocodeLines": [
          3,
          4,
          5,
          7
        ],
        "pseudocodeLine": 4,
        "pseudocodeText": "Pop (C, 1). Check C == D (NO). No unvisited neighbors to enqueue.",
        "operation": "DEQUEUE_NODE",
        "title": "Pop C ➔ No Unvisited Neighbors",
        "variables": [
          {
            "name": "currNode",
            "value": "C"
          },
          {
            "name": "dist",
            "value": "1"
          },
          {
            "name": "queue",
            "value": "[ (D, 2) ]"
          },
          {
            "name": "visited",
            "value": "{ A, B, C, D }"
          }
        ],
        "before": {
          "currNode": "B",
          "queue": "[ (C, 1), (D, 2) ]"
        },
        "condition": {
          "text": "Is C destination D?",
          "evaluation": "NO",
          "passes": false
        },
        "action": {
          "description": "Pop (C, 1). Check neighbors: no unvisited neighbors to enqueue."
        },
        "after": {
          "currNode": "C",
          "queue": "[ (D, 2) ]"
        },
        "changes": [
          {
            "var": "currNode",
            "from": "B",
            "to": "C"
          },
          {
            "var": "queue",
            "from": "[ (C, 1), (D, 2) ]",
            "to": "[ (D, 2) ]"
          }
        ],
        "currentResult": "1",
        "explanation": "Node C dequeued and processed. Node C has no remaining unvisited outgoing edges."
      },
      {
        "stepNo": 5,
        "pseudocodeLines": [
          3,
          4,
          5,
          6
        ],
        "pseudocodeLine": 6,
        "pseudocodeText": "Pop (D, 2). Check D == D (YES). RETURN distance 2.",
        "operation": "RETURN",
        "title": "Pop D ➔ Destination Reached! Return Dist 2",
        "variables": [
          {
            "name": "currNode",
            "value": "D"
          },
          {
            "name": "dist",
            "value": "2"
          },
          {
            "name": "queue",
            "value": "[ ]"
          },
          {
            "name": "visited",
            "value": "{ A, B, C, D }"
          }
        ],
        "before": {
          "currNode": "C",
          "dist": "1",
          "queue": "[ (D, 2) ]"
        },
        "condition": {
          "text": "Is D destination D?",
          "evaluation": "YES (Target Reached!)",
          "passes": true
        },
        "action": {
          "description": "Pop (D, 2). Destination node D reached. Return shortest path distance 2."
        },
        "after": {
          "currNode": "D",
          "dist": "2",
          "queue": "[ ]"
        },
        "changes": [
          {
            "var": "currNode",
            "from": "C",
            "to": "D"
          },
          {
            "var": "dist",
            "from": "1",
            "to": "2"
          },
          {
            "var": "queue",
            "from": "[ (D, 2) ]",
            "to": "[ ]"
          }
        ],
        "currentResult": "2",
        "explanation": "Dequeued D from queue. Target reached at distance 2. BFS guarantees shortest path."
      }
    ],
    "summary": {
      "title": "Shortest Path Graph Dry Run Summary",
      "inputSummary": "Graph: A ➔ D",
      "finalOutput": "2",
      "takeaway": "Level-order BFS queue expansion found the shortest path in the unweighted graph.",
      "observations": [
        "BFS expands graph nodes level by level in increasing distance order.",
        "First time destination is dequeued guarantees minimum hop count.",
        "Visited set prevents processing cyclic or redundant graph paths."
      ]
    },
    "finalState": {
      "result": "2",
      "explanation": "Dequeued D from queue. Target reached at distance 2. BFS guarantees shortest path."
    }
  },
  "climbing-stairs": {
    "problemId": "climbing-stairs",
    "approachId": "dpTable",
    "approachName": "Bottom-Up Dynamic Programming",
    "input": {
      "title": "Climbing Stairs",
      "inputVisual": "n = 5",
      "items": [
        {
          "label": "Target Steps (n)",
          "value": "5"
        }
      ],
      "expectedOutput": "8"
    },
    "initialState": {
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Current Step Index"
        },
        {
          "name": "dp",
          "value": "[ 0, -, -, -, -, - ]",
          "label": "DP Array (ways to step)"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 3,
        "pseudocodeText": "dp[1] = 1, dp[2] = 2",
        "operation": "INITIALIZE",
        "title": "Initialize Base Cases",
        "variables": [
          {
            "name": "i",
            "value": "-"
          },
          {
            "name": "dp",
            "value": "[ 0, 1, 2, -, -, - ]"
          },
          {
            "name": "result",
            "value": "2"
          }
        ],
        "before": {
          "i": "-",
          "dp": "[ 0, -, -, -, -, - ]",
          "result": "-"
        },
        "condition": {
          "text": "Base cases need to be initialized",
          "evaluation": "INITIALIZE BASE CASES",
          "passes": true
        },
        "action": {
          "description": "Set dp[1] = 1 (1 way: [1]) and dp[2] = 2 (2 ways: [1+1, 2])."
        },
        "after": {
          "i": "-",
          "dp": "[ 0, 1, 2, -, -, - ]",
          "result": "2"
        },
        "changes": [
          {
            "var": "dp",
            "from": "[ 0, -, -, -, -, - ]",
            "to": "[ 0, 1, 2, -, -, - ]"
          },
          {
            "var": "result",
            "from": "-",
            "to": "2"
          }
        ],
        "currentResult": "2",
        "explanation": "Step 1 establishes the base cases.\n\nThere is 1 way to reach step 1:\n1\n\nThere are 2 ways to reach step 2:\n1 + 1\n2"
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 5,
        "pseudocodeText": "dp[3] = dp[2] + dp[1]",
        "operation": "TRANSITION",
        "title": "Calculate Step 3",
        "variables": [
          {
            "name": "i",
            "value": "3"
          },
          {
            "name": "dp",
            "value": "[ 0, 1, 2, 3, -, - ]"
          },
          {
            "name": "result",
            "value": "3"
          }
        ],
        "before": {
          "i": "-",
          "dp": "[ 0, 1, 2, -, -, - ]",
          "result": "2"
        },
        "condition": {
          "text": "i = 3 <= n = 5",
          "evaluation": "COMPUTE DP[3]",
          "passes": true
        },
        "action": {
          "description": "dp[3] = dp[2] (2) + dp[1] (1) = 3."
        },
        "after": {
          "i": "3",
          "dp": "[ 0, 1, 2, 3, -, - ]",
          "result": "3"
        },
        "changes": [
          {
            "var": "i",
            "from": "-",
            "to": "3"
          },
          {
            "var": "dp",
            "from": "[ 0, 1, 2, -, -, - ]",
            "to": "[ 0, 1, 2, 3, -, - ]"
          },
          {
            "var": "result",
            "from": "2",
            "to": "3"
          }
        ],
        "currentResult": "3",
        "explanation": "To reach step 3, the final move can come from step 2 (1 step jump) or step 1 (2 step jump).\n\ndp[3] = dp[2] + dp[1]\n     = 2 + 1\n     = 3"
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 5,
        "pseudocodeText": "dp[4] = dp[3] + dp[2]",
        "operation": "TRANSITION",
        "title": "Calculate Step 4",
        "variables": [
          {
            "name": "i",
            "value": "4"
          },
          {
            "name": "dp",
            "value": "[ 0, 1, 2, 3, 5, - ]"
          },
          {
            "name": "result",
            "value": "5"
          }
        ],
        "before": {
          "i": "3",
          "dp": "[ 0, 1, 2, 3, -, - ]",
          "result": "3"
        },
        "condition": {
          "text": "i = 4 <= n = 5",
          "evaluation": "COMPUTE DP[4]",
          "passes": true
        },
        "action": {
          "description": "dp[4] = dp[3] (3) + dp[2] (2) = 5."
        },
        "after": {
          "i": "4",
          "dp": "[ 0, 1, 2, 3, 5, - ]",
          "result": "5"
        },
        "changes": [
          {
            "var": "i",
            "from": "3",
            "to": "4"
          },
          {
            "var": "dp",
            "from": "[ 0, 1, 2, 3, -, - ]",
            "to": "[ 0, 1, 2, 3, 5, - ]"
          },
          {
            "var": "result",
            "from": "3",
            "to": "5"
          }
        ],
        "currentResult": "5",
        "explanation": "To reach step 4, combine the ways to reach step 3 and step 2.\n\ndp[4] = dp[3] + dp[2]\n     = 3 + 2\n     = 5"
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 5,
        "pseudocodeText": "dp[5] = dp[4] + dp[3]",
        "operation": "TRANSITION",
        "title": "Calculate Step 5",
        "variables": [
          {
            "name": "i",
            "value": "5"
          },
          {
            "name": "dp",
            "value": "[ 0, 1, 2, 3, 5, 8 ]"
          },
          {
            "name": "result",
            "value": "8"
          }
        ],
        "before": {
          "i": "4",
          "dp": "[ 0, 1, 2, 3, 5, - ]",
          "result": "5"
        },
        "condition": {
          "text": "i = 5 <= n = 5",
          "evaluation": "COMPUTE DP[5]",
          "passes": true
        },
        "action": {
          "description": "dp[5] = dp[4] (5) + dp[3] (3) = 8."
        },
        "after": {
          "i": "5",
          "dp": "[ 0, 1, 2, 3, 5, 8 ]",
          "result": "8"
        },
        "changes": [
          {
            "var": "i",
            "from": "4",
            "to": "5"
          },
          {
            "var": "dp",
            "from": "[ 0, 1, 2, 3, 5, - ]",
            "to": "[ 0, 1, 2, 3, 5, 8 ]"
          },
          {
            "var": "result",
            "from": "5",
            "to": "8"
          }
        ],
        "currentResult": "8",
        "explanation": "To reach step 5, combine the ways to reach step 4 and step 3.\n\ndp[5] = dp[4] + dp[3]\n     = 5 + 3\n     = 8"
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 6,
        "pseudocodeText": "RETURN dp[n]",
        "operation": "RETURN",
        "title": "Return Result",
        "variables": [
          {
            "name": "i",
            "value": "5"
          },
          {
            "name": "dp",
            "value": "[ 0, 1, 2, 3, 5, 8 ]"
          },
          {
            "name": "result",
            "value": "8"
          }
        ],
        "before": {
          "i": "5",
          "dp": "[ 0, 1, 2, 3, 5, 8 ]",
          "result": "8"
        },
        "condition": {
          "text": "All required DP values computed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return dp[5] = 8."
        },
        "after": {
          "i": "5",
          "dp": "[ 0, 1, 2, 3, 5, 8 ]",
          "result": "8"
        },
        "changes": [],
        "currentResult": "8",
        "explanation": "All required DP states have been computed.\n\nThe final answer is dp[5] = 8."
      }
    ],
    "finalState": {
      "result": "8",
      "explanation": "The DP algorithm correctly computes 8 unique ways to reach step 5."
    }
  },
  "house-robber": {
    "problemId": "house-robber",
    "approachId": "twoPointersDP",
    "approachName": "Space-Optimized DP",
    "input": {
      "title": "House Robber",
      "inputVisual": "nums = [ 2, 7, 9, 3, 1 ]",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 2, 7, 9, 3, 1 ]"
        }
      ],
      "expectedOutput": "12"
    },
    "initialState": {
      "variables": [
        {
          "name": "num",
          "value": "-",
          "label": "Current House Value"
        },
        {
          "name": "rob1",
          "value": "0",
          "label": "Max (2 steps back)"
        },
        {
          "name": "rob2",
          "value": "0",
          "label": "Max (1 step back)"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Max Profit"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "INITIALIZE rob1 = 0, rob2 = 0",
        "operation": "INITIALIZE",
        "title": "Initialize DP State Variables",
        "variables": [
          {
            "name": "num",
            "value": "-"
          },
          {
            "name": "rob1",
            "value": "0"
          },
          {
            "name": "rob2",
            "value": "0"
          },
          {
            "name": "result",
            "value": "0"
          }
        ],
        "before": {
          "num": "-",
          "rob1": "0",
          "rob2": "0",
          "result": "-"
        },
        "condition": {
          "text": "DP variables need initialization",
          "evaluation": "INITIALIZE DP TRACKERS",
          "passes": true
        },
        "action": {
          "description": "Set rolling profit trackers rob1 = 0, rob2 = 0."
        },
        "after": {
          "num": "-",
          "rob1": "0",
          "rob2": "0",
          "result": "0"
        },
        "changes": [
          {
            "var": "result",
            "from": "-",
            "to": "0"
          }
        ],
        "currentResult": "0",
        "explanation": "Initialize rolling profit trackers rob1 (2 steps back) = 0 and rob2 (1 step back) = 0 before inspecting houses."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 3,
        "pseudocodeText": "temp = MAX(rob2, rob1 + num)",
        "operation": "DECISION",
        "title": "Evaluate House 0 (val: 2)",
        "variables": [
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "rob1",
            "value": "0"
          },
          {
            "name": "rob2",
            "value": "2"
          },
          {
            "name": "result",
            "value": "2"
          }
        ],
        "before": {
          "num": "-",
          "rob1": "0",
          "rob2": "0",
          "result": "0"
        },
        "condition": {
          "text": "MAX(rob2: 0, rob1 + 2: 2) == 2",
          "evaluation": "ROB HOUSE 0",
          "passes": true
        },
        "action": {
          "description": "rob1 becomes 0, rob2 becomes 2."
        },
        "after": {
          "num": "2",
          "rob1": "0",
          "rob2": "2",
          "result": "2"
        },
        "changes": [
          {
            "var": "num",
            "from": "-",
            "to": "2"
          },
          {
            "var": "rob2",
            "from": "0",
            "to": "2"
          },
          {
            "var": "result",
            "from": "0",
            "to": "2"
          }
        ],
        "currentResult": "2",
        "explanation": "House 0 (val 2):\n\nRobbing house 0 yields 2 (rob1: 0 + 2 = 2).\nSkipping yields 0 (rob2: 0).\n\nMax profit up to house 0 = 2."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 3,
        "pseudocodeText": "temp = MAX(rob2, rob1 + num)",
        "operation": "DECISION",
        "title": "Evaluate House 1 (val: 7)",
        "variables": [
          {
            "name": "num",
            "value": "7"
          },
          {
            "name": "rob1",
            "value": "2"
          },
          {
            "name": "rob2",
            "value": "7"
          },
          {
            "name": "result",
            "value": "7"
          }
        ],
        "before": {
          "num": "2",
          "rob1": "0",
          "rob2": "2",
          "result": "2"
        },
        "condition": {
          "text": "MAX(rob2: 2, rob1 + 7: 7) == 7",
          "evaluation": "ROB HOUSE 1",
          "passes": true
        },
        "action": {
          "description": "rob1 becomes 2, rob2 becomes 7."
        },
        "after": {
          "num": "7",
          "rob1": "2",
          "rob2": "7",
          "result": "7"
        },
        "changes": [
          {
            "var": "num",
            "from": "2",
            "to": "7"
          },
          {
            "var": "rob1",
            "from": "0",
            "to": "2"
          },
          {
            "var": "rob2",
            "from": "2",
            "to": "7"
          },
          {
            "var": "result",
            "from": "2",
            "to": "7"
          }
        ],
        "currentResult": "7",
        "explanation": "House 1 (val 7):\n\nRobbing house 1 yields 7 (rob1: 0 + 7 = 7).\nSkipping yields 2 (rob2: 2).\n\nMax profit up to house 1 = 7."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 3,
        "pseudocodeText": "temp = MAX(rob2, rob1 + num)",
        "operation": "DECISION",
        "title": "Evaluate House 2 (val: 9)",
        "variables": [
          {
            "name": "num",
            "value": "9"
          },
          {
            "name": "rob1",
            "value": "7"
          },
          {
            "name": "rob2",
            "value": "11"
          },
          {
            "name": "result",
            "value": "11"
          }
        ],
        "before": {
          "num": "7",
          "rob1": "2",
          "rob2": "7",
          "result": "7"
        },
        "condition": {
          "text": "MAX(rob2: 7, rob1 + 9: 11) == 11",
          "evaluation": "ROB HOUSE 2",
          "passes": true
        },
        "action": {
          "description": "rob1 becomes 7, rob2 becomes 11."
        },
        "after": {
          "num": "9",
          "rob1": "7",
          "rob2": "11",
          "result": "11"
        },
        "changes": [
          {
            "var": "num",
            "from": "7",
            "to": "9"
          },
          {
            "var": "rob1",
            "from": "2",
            "to": "7"
          },
          {
            "var": "rob2",
            "from": "7",
            "to": "11"
          },
          {
            "var": "result",
            "from": "7",
            "to": "11"
          }
        ],
        "currentResult": "11",
        "explanation": "House 2 (val 9):\n\nRobbing house 2 yields 11 (rob1: 2 + 9 = 11).\nSkipping yields 7 (rob2: 7).\n\nMax profit up to house 2 = 11 (House 0 + House 2)."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 3,
        "pseudocodeText": "temp = MAX(rob2, rob1 + num)",
        "operation": "DECISION",
        "title": "Evaluate House 3 (val: 3)",
        "variables": [
          {
            "name": "num",
            "value": "3"
          },
          {
            "name": "rob1",
            "value": "11"
          },
          {
            "name": "rob2",
            "value": "11"
          },
          {
            "name": "result",
            "value": "11"
          }
        ],
        "before": {
          "num": "9",
          "rob1": "7",
          "rob2": "11",
          "result": "11"
        },
        "condition": {
          "text": "MAX(rob2: 11, rob1 + 3: 10) == 11",
          "evaluation": "SKIP HOUSE 3",
          "passes": true
        },
        "action": {
          "description": "rob1 becomes 11, rob2 remains 11."
        },
        "after": {
          "num": "3",
          "rob1": "11",
          "rob2": "11",
          "result": "11"
        },
        "changes": [
          {
            "var": "num",
            "from": "9",
            "to": "3"
          },
          {
            "var": "rob1",
            "from": "7",
            "to": "11"
          }
        ],
        "currentResult": "11",
        "explanation": "House 3 (val 3):\n\nRobbing house 3 yields 10 (rob1: 7 + 3 = 10).\nSkipping yields 11 (rob2: 11).\n\nSkipping house 3 maintains optimal total of 11."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 3,
        "pseudocodeText": "temp = MAX(rob2, rob1 + num)",
        "operation": "DECISION",
        "title": "Evaluate House 4 (val: 1)",
        "variables": [
          {
            "name": "num",
            "value": "1"
          },
          {
            "name": "rob1",
            "value": "11"
          },
          {
            "name": "rob2",
            "value": "12"
          },
          {
            "name": "result",
            "value": "12"
          }
        ],
        "before": {
          "num": "3",
          "rob1": "11",
          "rob2": "11",
          "result": "11"
        },
        "condition": {
          "text": "MAX(rob2: 11, rob1 + 1: 12) == 12",
          "evaluation": "ROB HOUSE 4",
          "passes": true
        },
        "action": {
          "description": "rob1 becomes 11, rob2 becomes 12."
        },
        "after": {
          "num": "1",
          "rob1": "11",
          "rob2": "12",
          "result": "12"
        },
        "changes": [
          {
            "var": "num",
            "from": "3",
            "to": "1"
          },
          {
            "var": "rob2",
            "from": "11",
            "to": "12"
          },
          {
            "var": "result",
            "from": "11",
            "to": "12"
          }
        ],
        "currentResult": "12",
        "explanation": "House 4 (val 1):\n\nRobbing house 4 yields 12 (rob1: 11 + 1 = 12).\nSkipping yields 11 (rob2: 11).\n\nMax profit up to house 4 = 12 (Houses 0, 2, and 4)."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 6,
        "pseudocodeText": "RETURN rob2",
        "operation": "RETURN",
        "title": "Return Maximum Amount",
        "variables": [
          {
            "name": "num",
            "value": "1"
          },
          {
            "name": "rob1",
            "value": "11"
          },
          {
            "name": "rob2",
            "value": "12"
          },
          {
            "name": "result",
            "value": "12"
          }
        ],
        "before": {
          "num": "1",
          "rob1": "11",
          "rob2": "12",
          "result": "12"
        },
        "condition": {
          "text": "All houses processed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return rob2 = 12."
        },
        "after": {
          "result": "12"
        },
        "changes": [],
        "currentResult": "12",
        "explanation": "All houses evaluated. The final maximum non-adjacent robbery total is rob2 = 12."
      }
    ],
    "finalState": {
      "result": "12",
      "explanation": "The DP algorithm correctly computes maximum loot of 12."
    }
  },
  "subsets": {
    "problemId": "subsets",
    "approachId": "backtracking",
    "approachName": "Recursive Backtracking DFS",
    "input": {
      "title": "Subsets",
      "inputVisual": "nums = [ 1, 2, 3 ]",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 1, 2, 3 ]"
        }
      ],
      "expectedOutput": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]"
    },
    "initialState": {
      "variables": [
        {
          "name": "index",
          "value": "-",
          "label": "Recursion Depth Index"
        },
        {
          "name": "path",
          "value": "[ ]",
          "label": "Current Subset Path"
        },
        {
          "name": "callStack",
          "value": "[ ]",
          "label": "Call Stack"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Generated Power Set"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "INITIALIZE result = []; CALL backtrack(0, [])",
        "operation": "INITIALIZE",
        "title": "Start Backtracking Search",
        "variables": [
          {
            "name": "index",
            "value": "0"
          },
          {
            "name": "path",
            "value": "[ ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "index": "-",
          "path": "[ ]",
          "callStack": "[ ]",
          "result": "-"
        },
        "condition": {
          "text": "Backtracking initialization",
          "evaluation": "START SEARCH",
          "passes": true
        },
        "action": {
          "description": "Initialize empty result list and invoke backtrack(0, [])."
        },
        "after": {
          "index": "0",
          "path": "[ ]",
          "callStack": "[ backtrack(0,[]) ]",
          "result": "[ ]"
        },
        "changes": [
          {
            "var": "index",
            "from": "-",
            "to": "0"
          },
          {
            "var": "callStack",
            "from": "[ ]",
            "to": "[ backtrack(0,[]) ]"
          },
          {
            "var": "result",
            "from": "-",
            "to": "[ ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Root of decision tree initialized at index 0 with empty path [] and empty result list."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 5,
        "pseudocodeText": "path.PUSH(nums[0]) -> backtrack(1, [1])",
        "operation": "PUSH",
        "title": "Include 1 (path: [1])",
        "variables": [
          {
            "name": "index",
            "value": "1"
          },
          {
            "name": "path",
            "value": "[ 1 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "index": "0",
          "path": "[ ]",
          "callStack": "[ backtrack(0,[]) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "index (0) < nums.length (3)",
          "evaluation": "RECURSE INCLUDE 1",
          "passes": true
        },
        "action": {
          "description": "Include element 1 into path. Recurse to index 1."
        },
        "after": {
          "index": "1",
          "path": "[ 1 ]",
          "callStack": "[ backtrack(0,[]), backtrack(1,[1]) ]"
        },
        "changes": [
          {
            "var": "index",
            "from": "0",
            "to": "1"
          },
          {
            "var": "path",
            "from": "[ ]",
            "to": "[ 1 ]"
          },
          {
            "var": "callStack",
            "from": "[ backtrack(0,[]) ]",
            "to": "[ backtrack(0,[]), backtrack(1,[1]) ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Branching left at depth 0: INCLUDE element 1 (path becomes [1])."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 5,
        "pseudocodeText": "path.PUSH(nums[1]) -> backtrack(2, [1,2])",
        "operation": "PUSH",
        "title": "Include 2 (path: [1, 2])",
        "variables": [
          {
            "name": "index",
            "value": "2"
          },
          {
            "name": "path",
            "value": "[ 1, 2 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "index": "1",
          "path": "[ 1 ]",
          "callStack": "[ backtrack(0,[]), backtrack(1,[1]) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "index (1) < nums.length (3)",
          "evaluation": "RECURSE INCLUDE 2",
          "passes": true
        },
        "action": {
          "description": "Include element 2 into path. Recurse to index 2."
        },
        "after": {
          "index": "2",
          "path": "[ 1, 2 ]",
          "callStack": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]"
        },
        "changes": [
          {
            "var": "index",
            "from": "1",
            "to": "2"
          },
          {
            "var": "path",
            "from": "[ 1 ]",
            "to": "[ 1, 2 ]"
          },
          {
            "var": "callStack",
            "from": "[ backtrack(0,[]), backtrack(1,[1]) ]",
            "to": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Branching left at depth 1: INCLUDE element 2 (path becomes [1, 2])."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 4,
        "pseudocodeText": "result.APPEND([1, 2, 3]) at leaf node",
        "operation": "COLLECT",
        "title": "Include 3 & Collect [1, 2, 3]",
        "variables": [
          {
            "name": "index",
            "value": "3"
          },
          {
            "name": "path",
            "value": "[ 1, 2, 3 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]), backtrack(3,[1,2,3]) ]"
          },
          {
            "name": "result",
            "value": "[ [1, 2, 3] ]"
          }
        ],
        "before": {
          "index": "2",
          "path": "[ 1, 2 ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "index (3) == nums.length (3)",
          "evaluation": "LEAF REACHED",
          "passes": true
        },
        "action": {
          "description": "Push 3, reach index 3 (leaf). Append copy [1, 2, 3] to result."
        },
        "after": {
          "index": "3",
          "path": "[ 1, 2, 3 ]",
          "result": "[ [1, 2, 3] ]"
        },
        "changes": [
          {
            "var": "index",
            "from": "2",
            "to": "3"
          },
          {
            "var": "path",
            "from": "[ 1, 2 ]",
            "to": "[ 1, 2, 3 ]"
          },
          {
            "var": "result",
            "from": "[ ]",
            "to": "[ [1, 2, 3] ]"
          }
        ],
        "currentResult": "[ [1, 2, 3] ]",
        "explanation": "Leaf node reached at index 3: Append full subset [1, 2, 3] into result list."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 7,
        "pseudocodeText": "path.POP() -> Backtrack to [1, 2]",
        "operation": "BACKTRACK",
        "title": "Backtrack: Pop 3, Exclude 3",
        "variables": [
          {
            "name": "index",
            "value": "3"
          },
          {
            "name": "path",
            "value": "[ 1, 2 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]"
          },
          {
            "name": "result",
            "value": "[ [1, 2, 3], [1, 2] ]"
          }
        ],
        "before": {
          "path": "[ 1, 2, 3 ]",
          "result": "[ [1, 2, 3] ]"
        },
        "condition": {
          "text": "Backtracking choice EXCLUDE 3",
          "evaluation": "POP 3",
          "passes": true
        },
        "action": {
          "description": "Pop 3 from path. Recurse right (exclude 3) and collect subset [1, 2]."
        },
        "after": {
          "path": "[ 1, 2 ]",
          "result": "[ [1, 2, 3], [1, 2] ]"
        },
        "changes": [
          {
            "var": "path",
            "from": "[ 1, 2, 3 ]",
            "to": "[ 1, 2 ]"
          },
          {
            "var": "callStack",
            "from": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]), backtrack(3,[1,2,3]) ]",
            "to": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]"
          },
          {
            "var": "result",
            "from": "[ [1, 2, 3] ]",
            "to": "[ [1, 2, 3], [1, 2] ]"
          }
        ],
        "currentResult": "[ [1, 2, 3], [1, 2] ]",
        "explanation": "Backtrack: Pop 3 from path to explore right branch (excluding 3). Append subset [1, 2]."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 7,
        "pseudocodeText": "path.POP() -> Backtrack to [1], Push 3 -> [1, 3]",
        "operation": "BACKTRACK",
        "title": "Pop 2, Include 3 (path: [1, 3])",
        "variables": [
          {
            "name": "index",
            "value": "3"
          },
          {
            "name": "path",
            "value": "[ 1, 3 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(3,[1,3]) ]"
          },
          {
            "name": "result",
            "value": "[ [1, 2, 3], [1, 2], [1, 3] ]"
          }
        ],
        "before": {
          "path": "[ 1, 2 ]",
          "result": "[ [1, 2, 3], [1, 2] ]"
        },
        "condition": {
          "text": "Backtrack 2, branch to 3",
          "evaluation": "POP 2 & INCLUDE 3",
          "passes": true
        },
        "action": {
          "description": "Pop 2, exclude 2, push 3. Collect leaf subset [1, 3]."
        },
        "after": {
          "path": "[ 1, 3 ]",
          "result": "[ [1, 2, 3], [1, 2], [1, 3] ]"
        },
        "changes": [
          {
            "var": "path",
            "from": "[ 1, 2 ]",
            "to": "[ 1, 3 ]"
          },
          {
            "var": "callStack",
            "from": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(2,[1,2]) ]",
            "to": "[ backtrack(0,[]), backtrack(1,[1]), backtrack(3,[1,3]) ]"
          },
          {
            "var": "result",
            "from": "[ [1, 2, 3], [1, 2] ]",
            "to": "[ [1, 2, 3], [1, 2], [1, 3] ]"
          }
        ],
        "currentResult": "[ [1, 2, 3], [1, 2], [1, 3] ]",
        "explanation": "Backtrack: Pop 2, include 3 to form path [1, 3]. Append subset [1, 3]."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 8,
        "pseudocodeText": "Pop 3 -> [1] Leaf collected",
        "operation": "COLLECT",
        "title": "Pop 3 -> Collect subset [1]",
        "variables": [
          {
            "name": "index",
            "value": "3"
          },
          {
            "name": "path",
            "value": "[ 1 ]"
          },
          {
            "name": "callStack",
            "value": "[ backtrack(0,[]), backtrack(1,[1]) ]"
          },
          {
            "name": "result",
            "value": "[ [1, 2, 3], [1, 2], [1, 3], [1] ]"
          }
        ],
        "before": {
          "path": "[ 1, 3 ]",
          "result": "[ [1, 2, 3], [1, 2], [1, 3] ]"
        },
        "condition": {
          "text": "Exclude 3 from [1]",
          "evaluation": "POP 3 & COLLECT [1]",
          "passes": true
        },
        "action": {
          "description": "Pop 3. Collect leaf subset [1]."
        },
        "after": {
          "path": "[ 1 ]",
          "result": "[ [1, 2, 3], [1, 2], [1, 3], [1] ]"
        },
        "changes": [
          {
            "var": "path",
            "from": "[ 1, 3 ]",
            "to": "[ 1 ]"
          },
          {
            "var": "result",
            "from": "[ [1, 2, 3], [1, 2], [1, 3] ]",
            "to": "[ [1, 2, 3], [1, 2], [1, 3], [1] ]"
          }
        ],
        "currentResult": "[ [1, 2, 3], [1, 2], [1, 3], [1] ]",
        "explanation": "Pop 3. Collect subset [1]. All subtrees incorporating element 1 are now complete."
      },
      {
        "stepNo": 8,
        "pseudocodeLine": 10,
        "pseudocodeText": "Pop 1 -> Branch Right (Exclude 1): Process 2 & 3",
        "operation": "RETURN",
        "title": "Exclude 1 -> Complete Remaining Subsets",
        "variables": [
          {
            "name": "index",
            "value": "3"
          },
          {
            "name": "path",
            "value": "[ ]"
          },
          {
            "name": "callStack",
            "value": "[ ]"
          },
          {
            "name": "result",
            "value": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]"
          }
        ],
        "before": {
          "path": "[ 1 ]"
        },
        "condition": {
          "text": "All subtrees explored?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Pop 1, complete right subtree (excluding 1) generating subsets [2,3], [2], [3], []. Return result."
        },
        "after": {
          "index": "3",
          "path": "[ ]",
          "callStack": "[ ]",
          "result": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]"
        },
        "changes": [
          {
            "var": "index",
            "from": "3",
            "to": "3"
          },
          {
            "var": "path",
            "from": "[ 1 ]",
            "to": "[ ]"
          },
          {
            "var": "callStack",
            "from": "[ backtrack(0,[]), backtrack(1,[1]) ]",
            "to": "[ ]"
          },
          {
            "var": "result",
            "from": "[ [1, 2, 3], [1, 2], [1, 3], [1] ]",
            "to": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]"
          }
        ],
        "currentResult": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]",
        "explanation": "All 8 subsets of the 2^3 power set generated successfully. Backtracking search complete."
      }
    ],
    "finalState": {
      "result": "[ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]",
      "explanation": "Backtracking tree exploration generated all 8 subsets."
    }
  },
  "course-schedule": {
    "problemId": "course-schedule",
    "approachId": "kahnsBFS",
    "approachName": "Kahn's BFS Topological Sort",
    "input": {
      "title": "Course Schedule",
      "inputVisual": "numCourses = 4, prereqs = [ [1,0], [2,0], [3,1], [3,2] ]",
      "items": [
        {
          "label": "Total Courses",
          "value": "4"
        },
        {
          "label": "Prerequisites",
          "value": "[ [1,0], [2,0], [3,1], [3,2] ]"
        }
      ],
      "expectedOutput": "true"
    },
    "initialState": {
      "variables": [
        {
          "name": "curr",
          "value": "-",
          "label": "Currently Processed Course"
        },
        {
          "name": "inDegree",
          "value": "[ 0, 1, 1, 2 ]",
          "label": "In-Degrees [c0, c1, c2, c3]"
        },
        {
          "name": "queue",
          "value": "[ ]",
          "label": "Zero In-Degree Queue"
        },
        {
          "name": "processedCount",
          "value": "0",
          "label": "Completed Courses Count"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 4,
        "pseudocodeText": "INITIALIZE queue with 0 in-degree nodes -> queue = [0]",
        "operation": "INITIALIZE",
        "title": "Calculate In-Degrees & Enqueue Course 0",
        "variables": [
          {
            "name": "curr",
            "value": "-"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 1, 1, 2 ]"
          },
          {
            "name": "queue",
            "value": "[ 0 ]"
          },
          {
            "name": "processedCount",
            "value": "0"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "-",
          "inDegree": "[ 0, 1, 1, 2 ]",
          "queue": "[ ]",
          "processedCount": "0",
          "result": "-"
        },
        "condition": {
          "text": "inDegree[0] == 0",
          "evaluation": "ENQUEUE COURSE 0",
          "passes": true
        },
        "action": {
          "description": "Course 0 has 0 prerequisites. Enqueue course 0."
        },
        "after": {
          "inDegree": "[ 0, 1, 1, 2 ]",
          "queue": "[ 0 ]",
          "result": "false"
        },
        "changes": [
          {
            "var": "queue",
            "from": "[ ]",
            "to": "[ 0 ]"
          },
          {
            "var": "result",
            "from": "-",
            "to": "false"
          }
        ],
        "currentResult": "-",
        "explanation": "In-degree array built: Course 0 has 0 prerequisites (ready to take first), Course 1 needs 0, Course 2 needs 0, Course 3 needs 1 and 2."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 7,
        "pseudocodeText": "curr = queue.DEQUEUE() -> curr = 0; processedCount = 1",
        "operation": "DEQUEUE",
        "title": "Process Course 0 (Unlock 1 & 2)",
        "variables": [
          {
            "name": "curr",
            "value": "0"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 0, 0, 2 ]"
          },
          {
            "name": "queue",
            "value": "[ 1, 2 ]"
          },
          {
            "name": "processedCount",
            "value": "1"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "-",
          "queue": "[ 0 ]",
          "processedCount": "0",
          "result": "false"
        },
        "condition": {
          "text": "queue not empty",
          "evaluation": "PROCESS COURSE 0",
          "passes": true
        },
        "action": {
          "description": "Complete course 0. Decrement inDegree[1] (1->0) and inDegree[2] (1->0). Enqueue 1, 2."
        },
        "after": {
          "curr": "0",
          "inDegree": "[ 0, 0, 0, 2 ]",
          "queue": "[ 1, 2 ]",
          "processedCount": "1"
        },
        "changes": [
          {
            "var": "curr",
            "from": "-",
            "to": "0"
          },
          {
            "var": "inDegree",
            "from": "[ 0, 1, 1, 2 ]",
            "to": "[ 0, 0, 0, 2 ]"
          },
          {
            "var": "queue",
            "from": "[ 0 ]",
            "to": "[ 1, 2 ]"
          },
          {
            "var": "processedCount",
            "from": "0",
            "to": "1"
          }
        ],
        "currentResult": "-",
        "explanation": "Completing course 0 satisfies prerequisite for dependent courses 1 and 2. Both now have in-degree 0 and enter queue."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 7,
        "pseudocodeText": "curr = queue.DEQUEUE() -> curr = 1; processedCount = 2",
        "operation": "DEQUEUE",
        "title": "Process Course 1",
        "variables": [
          {
            "name": "curr",
            "value": "1"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 0, 0, 1 ]"
          },
          {
            "name": "queue",
            "value": "[ 2 ]"
          },
          {
            "name": "processedCount",
            "value": "2"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "0",
          "queue": "[ 1, 2 ]",
          "processedCount": "1",
          "result": "false"
        },
        "condition": {
          "text": "queue not empty",
          "evaluation": "PROCESS COURSE 1",
          "passes": true
        },
        "action": {
          "description": "Complete course 1. Decrement inDegree[3] from 2 to 1."
        },
        "after": {
          "curr": "1",
          "inDegree": "[ 0, 0, 0, 1 ]",
          "queue": "[ 2 ]",
          "processedCount": "2"
        },
        "changes": [
          {
            "var": "curr",
            "from": "0",
            "to": "1"
          },
          {
            "var": "inDegree",
            "from": "[ 0, 0, 0, 2 ]",
            "to": "[ 0, 0, 0, 1 ]"
          },
          {
            "var": "queue",
            "from": "[ 1, 2 ]",
            "to": "[ 2 ]"
          },
          {
            "var": "processedCount",
            "from": "1",
            "to": "2"
          }
        ],
        "currentResult": "-",
        "explanation": "Completing course 1 reduces remaining prerequisites of course 3 from 2 to 1."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 7,
        "pseudocodeText": "curr = queue.DEQUEUE() -> curr = 2; processedCount = 3",
        "operation": "DEQUEUE",
        "title": "Process Course 2 (Unlock 3)",
        "variables": [
          {
            "name": "curr",
            "value": "2"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 0, 0, 0 ]"
          },
          {
            "name": "queue",
            "value": "[ 3 ]"
          },
          {
            "name": "processedCount",
            "value": "3"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "1",
          "queue": "[ 2 ]",
          "processedCount": "2",
          "result": "false"
        },
        "condition": {
          "text": "queue not empty",
          "evaluation": "PROCESS COURSE 2",
          "passes": true
        },
        "action": {
          "description": "Complete course 2. Decrement inDegree[3] from 1 to 0. Enqueue course 3."
        },
        "after": {
          "curr": "2",
          "inDegree": "[ 0, 0, 0, 0 ]",
          "queue": "[ 3 ]",
          "processedCount": "3"
        },
        "changes": [
          {
            "var": "curr",
            "from": "1",
            "to": "2"
          },
          {
            "var": "inDegree",
            "from": "[ 0, 0, 0, 1 ]",
            "to": "[ 0, 0, 0, 0 ]"
          },
          {
            "var": "queue",
            "from": "[ 2 ]",
            "to": "[ 3 ]"
          },
          {
            "var": "processedCount",
            "from": "2",
            "to": "3"
          }
        ],
        "currentResult": "-",
        "explanation": "Completing course 2 satisfies final prerequisite for course 3. Course 3 in-degree becomes 0 and enters queue."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 7,
        "pseudocodeText": "curr = queue.DEQUEUE() -> curr = 3; processedCount = 4",
        "operation": "DEQUEUE",
        "title": "Process Course 3",
        "variables": [
          {
            "name": "curr",
            "value": "3"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 0, 0, 0 ]"
          },
          {
            "name": "queue",
            "value": "[ ]"
          },
          {
            "name": "processedCount",
            "value": "4"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "2",
          "queue": "[ 3 ]",
          "processedCount": "3",
          "result": "false"
        },
        "condition": {
          "text": "queue not empty",
          "evaluation": "PROCESS COURSE 3",
          "passes": true
        },
        "action": {
          "description": "Complete course 3. Increment processedCount to 4."
        },
        "after": {
          "curr": "3",
          "queue": "[ ]",
          "processedCount": "4",
          "result": "true"
        },
        "changes": [
          {
            "var": "curr",
            "from": "2",
            "to": "3"
          },
          {
            "var": "queue",
            "from": "[ 3 ]",
            "to": "[ ]"
          },
          {
            "var": "processedCount",
            "from": "3",
            "to": "4"
          },
          {
            "var": "result",
            "from": "false",
            "to": "true"
          }
        ],
        "currentResult": "-",
        "explanation": "Course 3 completed. Total processed courses count reaches 4 (matching numCourses)."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 11,
        "pseudocodeText": "RETURN processedCount == numCourses -> 4 == 4 (true)",
        "operation": "RETURN",
        "title": "Return Topological Sort Success",
        "variables": [
          {
            "name": "curr",
            "value": "3"
          },
          {
            "name": "inDegree",
            "value": "[ 0, 0, 0, 0 ]"
          },
          {
            "name": "queue",
            "value": "[ ]"
          },
          {
            "name": "processedCount",
            "value": "4"
          },
          {
            "name": "result",
            "value": "true"
          }
        ],
        "before": {
          "processedCount": "4",
          "result": "true"
        },
        "condition": {
          "text": "processedCount (4) == numCourses (4)?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return true."
        },
        "after": {
          "result": "true"
        },
        "changes": [],
        "currentResult": "true",
        "explanation": "No cycles detected in DAG. All 4 courses can be completed in topological order [0, 1, 2, 3]."
      }
    ],
    "finalState": {
      "result": "true",
      "explanation": "Kahn's algorithm confirmed valid acyclic topological order."
    }
  },
  "connected-components": {
    "problemId": "connected-components",
    "approachId": "unionFind",
    "approachName": "Union-Find (Disjoint Set Union)",
    "input": {
      "title": "Connected Components",
      "inputVisual": "n = 5, edges = [ [0,1], [1,2], [3,4] ]",
      "items": [
        {
          "label": "Nodes (n)",
          "value": "5"
        },
        {
          "label": "Edges",
          "value": "[ [0,1], [1,2], [3,4] ]"
        }
      ],
      "expectedOutput": "2"
    },
    "initialState": {
      "variables": [
        {
          "name": "edge",
          "value": "-",
          "label": "Current Edge [u, v]"
        },
        {
          "name": "parent",
          "value": "[ 0, 1, 2, 3, 4 ]",
          "label": "Parent Pointer Array"
        },
        {
          "name": "components",
          "value": "5",
          "label": "Component Count"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "INITIALIZE parent = [0, 1, 2, 3, 4], components = 5",
        "operation": "INITIALIZE",
        "title": "Initialize Union-Find Data Structure",
        "variables": [
          {
            "name": "edge",
            "value": "-"
          },
          {
            "name": "parent",
            "value": "[ 0, 1, 2, 3, 4 ]"
          },
          {
            "name": "components",
            "value": "5"
          },
          {
            "name": "result",
            "value": "5"
          }
        ],
        "before": {
          "edge": "-",
          "parent": "[ 0, 1, 2, 3, 4 ]",
          "components": "5",
          "result": "-"
        },
        "condition": {
          "text": "DSU initialization required",
          "evaluation": "INITIALIZE PARENT ARRAY",
          "passes": true
        },
        "action": {
          "description": "Each node is its own root component. Initial count components = 5."
        },
        "after": {
          "edge": "-",
          "parent": "[ 0, 1, 2, 3, 4 ]",
          "components": "5",
          "result": "5"
        },
        "changes": [
          {
            "var": "result",
            "from": "-",
            "to": "5"
          }
        ],
        "currentResult": "5",
        "explanation": "5 isolated nodes (0, 1, 2, 3, 4) produce 5 initial connected components."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 8,
        "pseudocodeText": "Union(0, 1): rootU = 0, rootV = 1 -> parent[0] = 1, components = 4",
        "operation": "UNION",
        "title": "Process Edge [0, 1]",
        "variables": [
          {
            "name": "edge",
            "value": "[ 0, 1 ]"
          },
          {
            "name": "parent",
            "value": "[ 1, 1, 2, 3, 4 ]"
          },
          {
            "name": "components",
            "value": "4"
          },
          {
            "name": "result",
            "value": "4"
          }
        ],
        "before": {
          "edge": "-",
          "parent": "[ 0, 1, 2, 3, 4 ]",
          "components": "5",
          "result": "5"
        },
        "condition": {
          "text": "find(0) != find(1) (0 != 1)",
          "evaluation": "MERGE SETS",
          "passes": true
        },
        "action": {
          "description": "Set parent[0] = 1. Decrement components count to 4."
        },
        "after": {
          "edge": "[ 0, 1 ]",
          "parent": "[ 1, 1, 2, 3, 4 ]",
          "components": "4",
          "result": "4"
        },
        "changes": [
          {
            "var": "edge",
            "from": "-",
            "to": "[ 0, 1 ]"
          },
          {
            "var": "parent",
            "from": "[ 0, 1, 2, 3, 4 ]",
            "to": "[ 1, 1, 2, 3, 4 ]"
          },
          {
            "var": "components",
            "from": "5",
            "to": "4"
          },
          {
            "var": "result",
            "from": "5",
            "to": "4"
          }
        ],
        "currentResult": "4",
        "explanation": "Edge [0, 1]: Node 0 and Node 1 belong to separate sets. Merged into set with root 1. Components count = 4."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 8,
        "pseudocodeText": "Union(1, 2): rootU = 1, rootV = 2 -> parent[1] = 2, components = 3",
        "operation": "UNION",
        "title": "Process Edge [1, 2]",
        "variables": [
          {
            "name": "edge",
            "value": "[ 1, 2 ]"
          },
          {
            "name": "parent",
            "value": "[ 1, 2, 2, 3, 4 ]"
          },
          {
            "name": "components",
            "value": "3"
          },
          {
            "name": "result",
            "value": "3"
          }
        ],
        "before": {
          "edge": "[ 0, 1 ]",
          "parent": "[ 1, 1, 2, 3, 4 ]",
          "components": "4",
          "result": "4"
        },
        "condition": {
          "text": "find(1) != find(2) (1 != 2)",
          "evaluation": "MERGE SETS",
          "passes": true
        },
        "action": {
          "description": "Set parent[1] = 2. Decrement components count to 3."
        },
        "after": {
          "edge": "[ 1, 2 ]",
          "parent": "[ 1, 2, 2, 3, 4 ]",
          "components": "3",
          "result": "3"
        },
        "changes": [
          {
            "var": "edge",
            "from": "[ 0, 1 ]",
            "to": "[ 1, 2 ]"
          },
          {
            "var": "parent",
            "from": "[ 1, 1, 2, 3, 4 ]",
            "to": "[ 1, 2, 2, 3, 4 ]"
          },
          {
            "var": "components",
            "from": "4",
            "to": "3"
          },
          {
            "var": "result",
            "from": "4",
            "to": "3"
          }
        ],
        "currentResult": "3",
        "explanation": "Edge [1, 2]: Set {0, 1} merged with Node 2. Combined subgraph {0, 1, 2} has root 2. Components count = 3."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 8,
        "pseudocodeText": "Union(3, 4): rootU = 3, rootV = 4 -> parent[3] = 4, components = 2",
        "operation": "UNION",
        "title": "Process Edge [3, 4]",
        "variables": [
          {
            "name": "edge",
            "value": "[ 3, 4 ]"
          },
          {
            "name": "parent",
            "value": "[ 1, 2, 2, 4, 4 ]"
          },
          {
            "name": "components",
            "value": "2"
          },
          {
            "name": "result",
            "value": "2"
          }
        ],
        "before": {
          "edge": "[ 1, 2 ]",
          "parent": "[ 1, 2, 2, 3, 4 ]",
          "components": "3",
          "result": "3"
        },
        "condition": {
          "text": "find(3) != find(4) (3 != 4)",
          "evaluation": "MERGE SETS",
          "passes": true
        },
        "action": {
          "description": "Set parent[3] = 4. Decrement components count to 2."
        },
        "after": {
          "edge": "[ 3, 4 ]",
          "parent": "[ 1, 2, 2, 4, 4 ]",
          "components": "2",
          "result": "2"
        },
        "changes": [
          {
            "var": "edge",
            "from": "[ 1, 2 ]",
            "to": "[ 3, 4 ]"
          },
          {
            "var": "parent",
            "from": "[ 1, 2, 2, 3, 4 ]",
            "to": "[ 1, 2, 2, 4, 4 ]"
          },
          {
            "var": "components",
            "from": "3",
            "to": "2"
          },
          {
            "var": "result",
            "from": "3",
            "to": "2"
          }
        ],
        "currentResult": "2",
        "explanation": "Edge [3, 4]: Node 3 and Node 4 merged into second distinct component {3, 4} with root 4. Components count = 2."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 10,
        "pseudocodeText": "RETURN components -> 2",
        "operation": "RETURN",
        "title": "Return Connected Component Count",
        "variables": [
          {
            "name": "edge",
            "value": "[ 3, 4 ]"
          },
          {
            "name": "parent",
            "value": "[ 1, 2, 2, 4, 4 ]"
          },
          {
            "name": "components",
            "value": "2"
          },
          {
            "name": "result",
            "value": "2"
          }
        ],
        "before": {
          "edge": "[ 3, 4 ]",
          "parent": "[ 1, 2, 2, 4, 4 ]",
          "components": "2",
          "result": "2"
        },
        "condition": {
          "text": "All edges processed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return remaining components count = 2."
        },
        "after": {
          "result": "2"
        },
        "changes": [],
        "currentResult": "2",
        "explanation": "All edges evaluated. The graph consists of 2 disjoint connected components: {0,1,2} and {3,4}."
      }
    ],
    "finalState": {
      "result": "2",
      "explanation": "Union-Find correctly calculated 2 connected components."
    }
  },
  "kth-smallest-bst": {
    "problemId": "kth-smallest-bst",
    "approachId": "iterativeInorder",
    "approachName": "Iterative Inorder BST Traversal",
    "input": {
      "title": "Kth Smallest Element in BST",
      "inputVisual": "Tree = [5, 3, 6, 2, 4, null, null, 1], k = 3",
      "items": [
        {
          "label": "Tree Nodes",
          "value": "[5, 3, 6, 2, 4, null, null, 1]"
        },
        {
          "label": "Target Rank (k)",
          "value": "3"
        }
      ],
      "expectedOutput": "3"
    },
    "initialState": {
      "variables": [
        {
          "name": "curr",
          "value": "Node(5)",
          "label": "Current Node"
        },
        {
          "name": "stack",
          "value": "[ ]",
          "label": "Traversal Stack"
        },
        {
          "name": "count",
          "value": "0",
          "label": "Rank Counter"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 4,
        "pseudocodeText": "Traverse left subtree: Push 5, 3, 2, 1 to stack",
        "operation": "PUSH",
        "title": "Traverse Left to Minimum Node",
        "variables": [
          {
            "name": "curr",
            "value": "NULL"
          },
          {
            "name": "stack",
            "value": "[ Node(5), Node(3), Node(2), Node(1) ]"
          },
          {
            "name": "count",
            "value": "0"
          },
          {
            "name": "result",
            "value": "-"
          }
        ],
        "before": {
          "curr": "Node(5)",
          "stack": "[ ]",
          "count": "0",
          "result": "-"
        },
        "condition": {
          "text": "curr != NULL",
          "evaluation": "PUSH LEFT CHILD NODES",
          "passes": true
        },
        "action": {
          "description": "Push nodes 5, 3, 2, 1 to stack until curr reaches leftmost leaf (NULL)."
        },
        "after": {
          "curr": "NULL",
          "stack": "[ Node(5), Node(3), Node(2), Node(1) ]",
          "count": "0",
          "result": "-"
        },
        "changes": [
          {
            "var": "curr",
            "from": "Node(5)",
            "to": "NULL"
          },
          {
            "var": "stack",
            "from": "[ ]",
            "to": "[ Node(5), Node(3), Node(2), Node(1) ]"
          }
        ],
        "currentResult": "-",
        "explanation": "Traversal pushes ancestors 5, 3, 2, 1 to stack while moving left. Leftmost node (Node 1) is now top of stack."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 6,
        "pseudocodeText": "curr = stack.POP() -> Node(1); count = 1",
        "operation": "POP",
        "title": "Visit 1st Smallest (Node 1)",
        "variables": [
          {
            "name": "curr",
            "value": "Node(1)"
          },
          {
            "name": "stack",
            "value": "[ Node(5), Node(3), Node(2) ]"
          },
          {
            "name": "count",
            "value": "1"
          },
          {
            "name": "result",
            "value": "1"
          }
        ],
        "before": {
          "curr": "NULL",
          "stack": "[ Node(5), Node(3), Node(2), Node(1) ]",
          "count": "0",
          "result": "-"
        },
        "condition": {
          "text": "count (1) == k (3)",
          "evaluation": "FALSE",
          "passes": false
        },
        "action": {
          "description": "Pop Node(1). Increment count to 1. Set curr = Node(1).right (NULL)."
        },
        "after": {
          "curr": "Node(1)",
          "stack": "[ Node(5), Node(3), Node(2) ]",
          "count": "1",
          "result": "1"
        },
        "changes": [
          {
            "var": "curr",
            "from": "NULL",
            "to": "Node(1)"
          },
          {
            "var": "stack",
            "from": "[ Node(5), Node(3), Node(2), Node(1) ]",
            "to": "[ Node(5), Node(3), Node(2) ]"
          },
          {
            "var": "count",
            "from": "0",
            "to": "1"
          },
          {
            "var": "result",
            "from": "-",
            "to": "1"
          }
        ],
        "currentResult": "1",
        "explanation": "Pop Node 1. Rank count becomes 1. Node 1 is the 1st smallest element in the BST."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 6,
        "pseudocodeText": "curr = stack.POP() -> Node(2); count = 2",
        "operation": "POP",
        "title": "Visit 2nd Smallest (Node 2)",
        "variables": [
          {
            "name": "curr",
            "value": "Node(2)"
          },
          {
            "name": "stack",
            "value": "[ Node(5), Node(3) ]"
          },
          {
            "name": "count",
            "value": "2"
          },
          {
            "name": "result",
            "value": "2"
          }
        ],
        "before": {
          "curr": "Node(1)",
          "stack": "[ Node(5), Node(3), Node(2) ]",
          "count": "1",
          "result": "1"
        },
        "condition": {
          "text": "count (2) == k (3)",
          "evaluation": "FALSE",
          "passes": false
        },
        "action": {
          "description": "Pop Node(2). Increment count to 2. Set curr = Node(2).right (NULL)."
        },
        "after": {
          "curr": "Node(2)",
          "stack": "[ Node(5), Node(3) ]",
          "count": "2",
          "result": "2"
        },
        "changes": [
          {
            "var": "curr",
            "from": "Node(1)",
            "to": "Node(2)"
          },
          {
            "var": "stack",
            "from": "[ Node(5), Node(3), Node(2) ]",
            "to": "[ Node(5), Node(3) ]"
          },
          {
            "var": "count",
            "from": "1",
            "to": "2"
          },
          {
            "var": "result",
            "from": "1",
            "to": "2"
          }
        ],
        "currentResult": "2",
        "explanation": "Pop Node 2. Rank count becomes 2. Node 2 is the 2nd smallest element in the BST."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 7,
        "pseudocodeText": "curr = stack.POP() -> Node(3); count = 3 == k (3)",
        "operation": "MATCH",
        "title": "Visit 3rd Smallest (Node 3) - Match K!",
        "variables": [
          {
            "name": "curr",
            "value": "Node(3)"
          },
          {
            "name": "stack",
            "value": "[ Node(5) ]"
          },
          {
            "name": "count",
            "value": "3"
          },
          {
            "name": "result",
            "value": "3"
          }
        ],
        "before": {
          "curr": "Node(2)",
          "stack": "[ Node(5), Node(3) ]",
          "count": "2",
          "result": "2"
        },
        "condition": {
          "text": "count (3) == k (3)",
          "evaluation": "MATCH TARGET K",
          "passes": true
        },
        "action": {
          "description": "Pop Node(3). Increment count to 3. Condition count == k met!"
        },
        "after": {
          "curr": "Node(3)",
          "stack": "[ Node(5) ]",
          "count": "3",
          "result": "3"
        },
        "changes": [
          {
            "var": "curr",
            "from": "Node(2)",
            "to": "Node(3)"
          },
          {
            "var": "stack",
            "from": "[ Node(5), Node(3) ]",
            "to": "[ Node(5) ]"
          },
          {
            "var": "count",
            "from": "2",
            "to": "3"
          },
          {
            "var": "result",
            "from": "2",
            "to": "3"
          }
        ],
        "currentResult": "3",
        "explanation": "Pop Node 3. Rank count reaches k = 3. Target rank matched! Return Node 3 value (3)."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 7,
        "pseudocodeText": "RETURN curr.val -> 3",
        "operation": "RETURN",
        "title": "Return Kth Smallest Value",
        "variables": [
          {
            "name": "curr",
            "value": "Node(3)"
          },
          {
            "name": "stack",
            "value": "[ Node(5) ]"
          },
          {
            "name": "count",
            "value": "3"
          },
          {
            "name": "result",
            "value": "3"
          }
        ],
        "before": {
          "curr": "Node(3)",
          "count": "3",
          "result": "3"
        },
        "condition": {
          "text": "Target k reached?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return value 3."
        },
        "after": {
          "result": "3"
        },
        "changes": [],
        "currentResult": "3",
        "explanation": "Iterative inorder traversal returned the 3rd smallest BST value: 3."
      }
    ],
    "finalState": {
      "result": "3",
      "explanation": "Inorder BST traversal located rank k=3 value without processing remaining nodes."
    }
  },
  "top-k-frequent": {
    "problemId": "top-k-frequent",
    "approachId": "minHeapK",
    "approachName": "Frequency HashMap + Min-Heap of Size K",
    "input": {
      "title": "Top K Frequent Elements",
      "inputVisual": "nums = [ 1, 1, 1, 2, 2, 3 ], k = 2",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 1, 1, 1, 2, 2, 3 ]"
        },
        {
          "label": "Target K",
          "value": "2"
        }
      ],
      "expectedOutput": "[ 1, 2 ]"
    },
    "initialState": {
      "variables": [
        {
          "name": "freqMap",
          "value": "{ }",
          "label": "Frequency Map"
        },
        {
          "name": "minHeap",
          "value": "[ ]",
          "label": "Min-Heap [(freq, num)]"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "BUILD freqMap from nums -> { 1: 3, 2: 2, 3: 1 }",
        "operation": "INITIALIZE",
        "title": "Build Frequency Map",
        "variables": [
          {
            "name": "freqMap",
            "value": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "name": "minHeap",
            "value": "[ ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "freqMap": "{ }",
          "minHeap": "[ ]",
          "result": "-"
        },
        "condition": {
          "text": "Build element frequency occurrences map",
          "evaluation": "BUILD MAP",
          "passes": true
        },
        "action": {
          "description": "Construct map: 1 has freq 3, 2 has freq 2, 3 has freq 1."
        },
        "after": {
          "freqMap": "{ 1: 3, 2: 2, 3: 1 }",
          "minHeap": "[ ]",
          "result": "[ ]"
        },
        "changes": [
          {
            "var": "freqMap",
            "from": "{ }",
            "to": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "var": "result",
            "from": "-",
            "to": "[ ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "O(N) frequency counting phase complete. Unique elements mapped: 1 (freq 3), 2 (freq 2), 3 (freq 1)."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 4,
        "pseudocodeText": "minHeap.PUSH((freq: 3, num: 1))",
        "operation": "PUSH",
        "title": "Push Pair (3, 1) into Min-Heap",
        "variables": [
          {
            "name": "freqMap",
            "value": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "name": "minHeap",
            "value": "[ (3, 1) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "freqMap": "{ 1: 3, 2: 2, 3: 1 }",
          "minHeap": "[ ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "minHeap.SIZE (1) <= k (2)",
          "evaluation": "KEEP IN HEAP",
          "passes": true
        },
        "action": {
          "description": "Push (freq: 3, num: 1). Min-heap size becomes 1."
        },
        "after": {
          "minHeap": "[ (3, 1) ]"
        },
        "changes": [
          {
            "var": "minHeap",
            "from": "[ ]",
            "to": "[ (3, 1) ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Element 1 (freq 3) added to priority queue. Heap size 1 <= k (2)."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 4,
        "pseudocodeText": "minHeap.PUSH((freq: 2, num: 2))",
        "operation": "PUSH",
        "title": "Push Pair (2, 2) into Min-Heap",
        "variables": [
          {
            "name": "freqMap",
            "value": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "name": "minHeap",
            "value": "[ (2, 2), (3, 1) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "freqMap": "{ 1: 3, 2: 2, 3: 1 }",
          "minHeap": "[ (3, 1) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "minHeap.SIZE (2) <= k (2)",
          "evaluation": "KEEP IN HEAP",
          "passes": true
        },
        "action": {
          "description": "Push (freq: 2, num: 2). Heap rearranges: (2,2) at root (min frequency)."
        },
        "after": {
          "minHeap": "[ (2, 2), (3, 1) ]"
        },
        "changes": [
          {
            "var": "minHeap",
            "from": "[ (3, 1) ]",
            "to": "[ (2, 2), (3, 1) ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Element 2 (freq 2) added. Min-heap size is 2 <= k (2). Root holds minimum frequency 2."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 5,
        "pseudocodeText": "minHeap.PUSH((1, 3)) -> SIZE 3 > k (2) -> minHeap.POP_MIN()",
        "operation": "EVICT",
        "title": "Push (1, 3) & Evict Minimum (1, 3)",
        "variables": [
          {
            "name": "freqMap",
            "value": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "name": "minHeap",
            "value": "[ (2, 2), (3, 1) ]"
          },
          {
            "name": "result",
            "value": "[ ]"
          }
        ],
        "before": {
          "freqMap": "{ 1: 3, 2: 2, 3: 1 }",
          "minHeap": "[ (2, 2), (3, 1) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "minHeap.SIZE (3) > k (2)",
          "evaluation": "EVICT SMALLEST FREQUENCY",
          "passes": true
        },
        "action": {
          "description": "Push (1,3). Heap size becomes 3 > 2. Pop root min pair (1,3)."
        },
        "after": {
          "minHeap": "[ (2, 2), (3, 1) ]"
        },
        "changes": [
          {
            "var": "minHeap",
            "from": "[ (2, 2), (3, 1) ]",
            "to": "[ (2, 2), (3, 1) ]"
          }
        ],
        "currentResult": "[ ]",
        "explanation": "Push pair (1,3). Heap size exceeds K (3 > 2). Evict pair (1,3) because frequency 1 is smaller than top candidates."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 6,
        "pseudocodeText": "RETURN elements from minHeap -> [ 1, 2 ]",
        "operation": "RETURN",
        "title": "Extract Remaining Top K Elements",
        "variables": [
          {
            "name": "freqMap",
            "value": "{ 1: 3, 2: 2, 3: 1 }"
          },
          {
            "name": "minHeap",
            "value": "[ (2, 2), (3, 1) ]"
          },
          {
            "name": "result",
            "value": "[ 1, 2 ]"
          }
        ],
        "before": {
          "minHeap": "[ (2, 2), (3, 1) ]",
          "result": "[ ]"
        },
        "condition": {
          "text": "All frequency pairs processed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Extract numbers {1, 2} from remaining heap pairs."
        },
        "after": {
          "result": "[ 1, 2 ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "[ ]",
            "to": "[ 1, 2 ]"
          }
        ],
        "currentResult": "[ 1, 2 ]",
        "explanation": "Extract top K=2 most frequent numbers from remaining min-heap: [ 1, 2 ]."
      }
    ],
    "finalState": {
      "result": "[ 1, 2 ]",
      "explanation": "Frequency Map + Min-Heap of size K correctly identified top 2 elements."
    }
  },
  "product-except-self": {
    "problemId": "product-except-self",
    "approachId": "prefixSuffixPass",
    "approachName": "Two-Pass Prefix / Suffix Product",
    "input": {
      "title": "Product of Array Except Self",
      "inputVisual": "nums = [ 1, 2, 3, 4 ]",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 1, 2, 3, 4 ]"
        }
      ],
      "expectedOutput": "[ 24, 12, 8, 6 ]"
    },
    "initialState": {
      "variables": [
        {
          "name": "i",
          "value": "-",
          "label": "Pass Index"
        },
        {
          "name": "prefix",
          "value": "1",
          "label": "Prefix Accumulator"
        },
        {
          "name": "suffix",
          "value": "1",
          "label": "Suffix Accumulator"
        },
        {
          "name": "ans",
          "value": "[ 1, 1, 1, 1 ]",
          "label": "Answer Array"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "INITIALIZE ans = [1, 1, 1, 1], prefix = 1",
        "operation": "INITIALIZE",
        "title": "Initialize Accumulators",
        "variables": [
          {
            "name": "i",
            "value": "-"
          },
          {
            "name": "prefix",
            "value": "1"
          },
          {
            "name": "suffix",
            "value": "1"
          },
          {
            "name": "ans",
            "value": "[ 1, 1, 1, 1 ]"
          },
          {
            "name": "result",
            "value": "[ 1, 1, 1, 1 ]"
          }
        ],
        "before": {
          "i": "-",
          "prefix": "1",
          "suffix": "1",
          "ans": "[ 1, 1, 1, 1 ]",
          "result": "-"
        },
        "condition": {
          "text": "Prefix accumulator initialization",
          "evaluation": "START PASS 1",
          "passes": true
        },
        "action": {
          "description": "Set output array ans to [1,1,1,1]. Prefix accumulator = 1."
        },
        "after": {
          "prefix": "1",
          "ans": "[ 1, 1, 1, 1 ]",
          "result": "[ 1, 1, 1, 1 ]"
        },
        "changes": [
          {
            "var": "result",
            "from": "-",
            "to": "[ 1, 1, 1, 1 ]"
          }
        ],
        "currentResult": "[ 1, 1, 1, 1 ]",
        "explanation": "Pass 1 initialized: stores product of all elements to the left of each index i."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 4,
        "pseudocodeText": "Pass 1 (Left to Right): ans = [ 1, 1, 2, 6 ]",
        "operation": "ACCUMULATE",
        "title": "Complete Pass 1 (Prefix Products)",
        "variables": [
          {
            "name": "i",
            "value": "3"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "1"
          },
          {
            "name": "ans",
            "value": "[ 1, 1, 2, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 1, 1, 2, 6 ]"
          }
        ],
        "before": {
          "i": "-",
          "prefix": "1",
          "ans": "[ 1, 1, 1, 1 ]",
          "result": "[ 1, 1, 1, 1 ]"
        },
        "condition": {
          "text": "Sweep left to right i = 0..3",
          "evaluation": "PREFIX PASS COMPLETE",
          "passes": true
        },
        "action": {
          "description": "ans[0]=1, ans[1]=1, ans[2]=2, ans[3]=6. Final prefix = 24."
        },
        "after": {
          "i": "3",
          "prefix": "24",
          "ans": "[ 1, 1, 2, 6 ]",
          "result": "[ 1, 1, 2, 6 ]"
        },
        "changes": [
          {
            "var": "i",
            "from": "-",
            "to": "3"
          },
          {
            "var": "prefix",
            "from": "1",
            "to": "24"
          },
          {
            "var": "ans",
            "from": "[ 1, 1, 1, 1 ]",
            "to": "[ 1, 1, 2, 6 ]"
          },
          {
            "var": "result",
            "from": "[ 1, 1, 1, 1 ]",
            "to": "[ 1, 1, 2, 6 ]"
          }
        ],
        "currentResult": "[ 1, 1, 2, 6 ]",
        "explanation": "Pass 1 complete. ans[i] now contains total product of all numbers to the left of index i."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 7,
        "pseudocodeText": "Pass 2 i=3: ans[3] = ans[3] (6) * suffix (1) = 6; suffix = 1 * 4 = 4",
        "operation": "ACCUMULATE",
        "title": "Pass 2 (Right to Left): Index 3",
        "variables": [
          {
            "name": "i",
            "value": "3"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "4"
          },
          {
            "name": "ans",
            "value": "[ 1, 1, 2, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 1, 1, 2, 6 ]"
          }
        ],
        "before": {
          "i": "3",
          "suffix": "1",
          "ans": "[ 1, 1, 2, 6 ]",
          "result": "[ 1, 1, 2, 6 ]"
        },
        "condition": {
          "text": "Multiply suffix at index 3",
          "evaluation": "SUFFIX PASS i=3",
          "passes": true
        },
        "action": {
          "description": "ans[3] = 6 * 1 = 6. Update suffix = 1 * 4 = 4."
        },
        "after": {
          "i": "3",
          "suffix": "4",
          "ans": "[ 1, 1, 2, 6 ]"
        },
        "changes": [
          {
            "var": "suffix",
            "from": "1",
            "to": "4"
          }
        ],
        "currentResult": "[ 1, 1, 2, 6 ]",
        "explanation": "Pass 2 at i=3: ans[3] = left_prod(6) * right_prod(1) = 6. Update suffix tracker = 4."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 7,
        "pseudocodeText": "Pass 2 i=2: ans[2] = ans[2] (2) * suffix (4) = 8; suffix = 4 * 3 = 12",
        "operation": "ACCUMULATE",
        "title": "Pass 2: Index 2",
        "variables": [
          {
            "name": "i",
            "value": "2"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "12"
          },
          {
            "name": "ans",
            "value": "[ 1, 1, 8, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 1, 1, 8, 6 ]"
          }
        ],
        "before": {
          "i": "3",
          "suffix": "4",
          "ans": "[ 1, 1, 2, 6 ]",
          "result": "[ 1, 1, 2, 6 ]"
        },
        "condition": {
          "text": "Multiply suffix at index 2",
          "evaluation": "SUFFIX PASS i=2",
          "passes": true
        },
        "action": {
          "description": "ans[2] = 2 * 4 = 8. Update suffix = 4 * 3 = 12."
        },
        "after": {
          "i": "2",
          "suffix": "12",
          "ans": "[ 1, 1, 8, 6 ]",
          "result": "[ 1, 1, 8, 6 ]"
        },
        "changes": [
          {
            "var": "i",
            "from": "3",
            "to": "2"
          },
          {
            "var": "suffix",
            "from": "4",
            "to": "12"
          },
          {
            "var": "ans",
            "from": "[ 1, 1, 2, 6 ]",
            "to": "[ 1, 1, 8, 6 ]"
          },
          {
            "var": "result",
            "from": "[ 1, 1, 2, 6 ]",
            "to": "[ 1, 1, 8, 6 ]"
          }
        ],
        "currentResult": "[ 1, 1, 8, 6 ]",
        "explanation": "Pass 2 at i=2: ans[2] = left_prod(2) * right_prod(4) = 8. Update suffix tracker = 12."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 7,
        "pseudocodeText": "Pass 2 i=1: ans[1] = ans[1] (1) * suffix (12) = 12; suffix = 12 * 2 = 24",
        "operation": "ACCUMULATE",
        "title": "Pass 2: Index 1",
        "variables": [
          {
            "name": "i",
            "value": "1"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "24"
          },
          {
            "name": "ans",
            "value": "[ 1, 12, 8, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 1, 12, 8, 6 ]"
          }
        ],
        "before": {
          "i": "2",
          "suffix": "12",
          "ans": "[ 1, 1, 8, 6 ]",
          "result": "[ 1, 1, 8, 6 ]"
        },
        "condition": {
          "text": "Multiply suffix at index 1",
          "evaluation": "SUFFIX PASS i=1",
          "passes": true
        },
        "action": {
          "description": "ans[1] = 1 * 12 = 12. Update suffix = 12 * 2 = 24."
        },
        "after": {
          "i": "1",
          "suffix": "24",
          "ans": "[ 1, 12, 8, 6 ]",
          "result": "[ 1, 12, 8, 6 ]"
        },
        "changes": [
          {
            "var": "i",
            "from": "2",
            "to": "1"
          },
          {
            "var": "suffix",
            "from": "12",
            "to": "24"
          },
          {
            "var": "ans",
            "from": "[ 1, 1, 8, 6 ]",
            "to": "[ 1, 12, 8, 6 ]"
          },
          {
            "var": "result",
            "from": "[ 1, 1, 8, 6 ]",
            "to": "[ 1, 12, 8, 6 ]"
          }
        ],
        "currentResult": "[ 1, 12, 8, 6 ]",
        "explanation": "Pass 2 at i=1: ans[1] = left_prod(1) * right_prod(12) = 12. Update suffix tracker = 24."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 7,
        "pseudocodeText": "Pass 2 i=0: ans[0] = ans[0] (1) * suffix (24) = 24",
        "operation": "ACCUMULATE",
        "title": "Pass 2: Index 0",
        "variables": [
          {
            "name": "i",
            "value": "0"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "24"
          },
          {
            "name": "ans",
            "value": "[ 24, 12, 8, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 24, 12, 8, 6 ]"
          }
        ],
        "before": {
          "i": "1",
          "suffix": "24",
          "ans": "[ 1, 12, 8, 6 ]",
          "result": "[ 1, 12, 8, 6 ]"
        },
        "condition": {
          "text": "Multiply suffix at index 0",
          "evaluation": "SUFFIX PASS i=0",
          "passes": true
        },
        "action": {
          "description": "ans[0] = 1 * 24 = 24."
        },
        "after": {
          "i": "0",
          "ans": "[ 24, 12, 8, 6 ]",
          "result": "[ 24, 12, 8, 6 ]"
        },
        "changes": [
          {
            "var": "i",
            "from": "1",
            "to": "0"
          },
          {
            "var": "ans",
            "from": "[ 1, 12, 8, 6 ]",
            "to": "[ 24, 12, 8, 6 ]"
          },
          {
            "var": "result",
            "from": "[ 1, 12, 8, 6 ]",
            "to": "[ 24, 12, 8, 6 ]"
          }
        ],
        "currentResult": "[ 24, 12, 8, 6 ]",
        "explanation": "Pass 2 at i=0: ans[0] = left_prod(1) * right_prod(24) = 24."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 8,
        "pseudocodeText": "RETURN ans -> [ 24, 12, 8, 6 ]",
        "operation": "RETURN",
        "title": "Return Product Array",
        "variables": [
          {
            "name": "i",
            "value": "0"
          },
          {
            "name": "prefix",
            "value": "24"
          },
          {
            "name": "suffix",
            "value": "24"
          },
          {
            "name": "ans",
            "value": "[ 24, 12, 8, 6 ]"
          },
          {
            "name": "result",
            "value": "[ 24, 12, 8, 6 ]"
          }
        ],
        "before": {
          "ans": "[ 24, 12, 8, 6 ]",
          "result": "[ 24, 12, 8, 6 ]"
        },
        "condition": {
          "text": "Both sweeps complete?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return result array [ 24, 12, 8, 6 ]."
        },
        "after": {
          "result": "[ 24, 12, 8, 6 ]"
        },
        "changes": [],
        "currentResult": "[ 24, 12, 8, 6 ]",
        "explanation": "Both sweeps complete. Prefix and Suffix products combined in O(N) time without division operator: [ 24, 12, 8, 6 ]."
      }
    ],
    "finalState": {
      "result": "[ 24, 12, 8, 6 ]",
      "explanation": "Two-pass accumulator algorithm generated correct products."
    }
  },
  "single-number": {
    "problemId": "single-number",
    "approachId": "xorAccumulator",
    "approachName": "Bitwise XOR Accumulator",
    "input": {
      "title": "Single Number",
      "inputVisual": "nums = [ 4, 1, 2, 1, 2 ]",
      "items": [
        {
          "label": "Array (nums)",
          "value": "[ 4, 1, 2, 1, 2 ]"
        }
      ],
      "expectedOutput": "4"
    },
    "initialState": {
      "variables": [
        {
          "name": "num",
          "value": "-",
          "label": "Current Number"
        },
        {
          "name": "acc",
          "value": "0",
          "label": "XOR Accumulator (Decimal)"
        },
        {
          "name": "accBit",
          "value": "0000",
          "label": "XOR Accumulator (Binary)"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 1,
        "pseudocodeText": "INITIALIZE acc = 0",
        "operation": "INITIALIZE",
        "title": "Initialize XOR Accumulator",
        "variables": [
          {
            "name": "num",
            "value": "-"
          },
          {
            "name": "acc",
            "value": "0"
          },
          {
            "name": "accBit",
            "value": "0000"
          },
          {
            "name": "result",
            "value": "0"
          }
        ],
        "before": {
          "num": "-",
          "acc": "0",
          "accBit": "0000",
          "result": "-"
        },
        "condition": {
          "text": "XOR accumulator initialization",
          "evaluation": "INITIALIZE ACCUMULATOR",
          "passes": true
        },
        "action": {
          "description": "Set XOR accumulator acc to 0 (binary 0000)."
        },
        "after": {
          "acc": "0",
          "accBit": "0000",
          "result": "0"
        },
        "changes": [
          {
            "var": "result",
            "from": "-",
            "to": "0"
          }
        ],
        "currentResult": "0",
        "explanation": "0 is the identity element for bitwise XOR operations (0 ^ X = X). Accumulator initialized to 0."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 3,
        "pseudocodeText": "acc = 0 XOR 4 -> acc = 4 (0100)",
        "operation": "XOR",
        "title": "XOR num = 4",
        "variables": [
          {
            "name": "num",
            "value": "4"
          },
          {
            "name": "acc",
            "value": "4"
          },
          {
            "name": "accBit",
            "value": "0100"
          },
          {
            "name": "result",
            "value": "4"
          }
        ],
        "before": {
          "num": "-",
          "acc": "0",
          "accBit": "0000",
          "result": "0"
        },
        "condition": {
          "text": "0000 ^ 0100 == 0100",
          "evaluation": "COMPUTE XOR",
          "passes": true
        },
        "action": {
          "description": "Compute 0 XOR 4. acc becomes 4."
        },
        "after": {
          "num": "4",
          "acc": "4",
          "accBit": "0100",
          "result": "4"
        },
        "changes": [
          {
            "var": "num",
            "from": "-",
            "to": "4"
          },
          {
            "var": "acc",
            "from": "0",
            "to": "4"
          },
          {
            "var": "accBit",
            "from": "0000",
            "to": "0100"
          },
          {
            "var": "result",
            "from": "0",
            "to": "4"
          }
        ],
        "currentResult": "4",
        "explanation": "XOR num = 4: 0000 ^ 0100 = 0100 (decimal 4). Accumulator updated to 4."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 3,
        "pseudocodeText": "acc = 4 XOR 1 -> acc = 5 (0101)",
        "operation": "XOR",
        "title": "XOR num = 1",
        "variables": [
          {
            "name": "num",
            "value": "1"
          },
          {
            "name": "acc",
            "value": "5"
          },
          {
            "name": "accBit",
            "value": "0101"
          },
          {
            "name": "result",
            "value": "5"
          }
        ],
        "before": {
          "num": "4",
          "acc": "4",
          "accBit": "0100",
          "result": "4"
        },
        "condition": {
          "text": "0100 ^ 0001 == 0101",
          "evaluation": "COMPUTE XOR",
          "passes": true
        },
        "action": {
          "description": "Compute 4 XOR 1. acc becomes 5."
        },
        "after": {
          "num": "1",
          "acc": "5",
          "accBit": "0101",
          "result": "5"
        },
        "changes": [
          {
            "var": "num",
            "from": "4",
            "to": "1"
          },
          {
            "var": "acc",
            "from": "4",
            "to": "5"
          },
          {
            "var": "accBit",
            "from": "0100",
            "to": "0101"
          },
          {
            "var": "result",
            "from": "4",
            "to": "5"
          }
        ],
        "currentResult": "5",
        "explanation": "XOR num = 1: 0100 ^ 0001 = 0101 (decimal 5). Accumulator updated to 5."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 3,
        "pseudocodeText": "acc = 5 XOR 2 -> acc = 7 (0111)",
        "operation": "XOR",
        "title": "XOR num = 2",
        "variables": [
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "acc",
            "value": "7"
          },
          {
            "name": "accBit",
            "value": "0111"
          },
          {
            "name": "result",
            "value": "7"
          }
        ],
        "before": {
          "num": "1",
          "acc": "5",
          "accBit": "0101",
          "result": "5"
        },
        "condition": {
          "text": "0101 ^ 0010 == 0111",
          "evaluation": "COMPUTE XOR",
          "passes": true
        },
        "action": {
          "description": "Compute 5 XOR 2. acc becomes 7."
        },
        "after": {
          "num": "2",
          "acc": "7",
          "accBit": "0111",
          "result": "7"
        },
        "changes": [
          {
            "var": "num",
            "from": "1",
            "to": "2"
          },
          {
            "var": "acc",
            "from": "5",
            "to": "7"
          },
          {
            "var": "accBit",
            "from": "0101",
            "to": "0111"
          },
          {
            "var": "result",
            "from": "5",
            "to": "7"
          }
        ],
        "currentResult": "7",
        "explanation": "XOR num = 2: 0101 ^ 0010 = 0111 (decimal 7). Accumulator updated to 7."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 3,
        "pseudocodeText": "acc = 7 XOR 1 -> acc = 6 (0110)",
        "operation": "XOR",
        "title": "XOR num = 1 (Duplicates Cancel 1)",
        "variables": [
          {
            "name": "num",
            "value": "1"
          },
          {
            "name": "acc",
            "value": "6"
          },
          {
            "name": "accBit",
            "value": "0110"
          },
          {
            "name": "result",
            "value": "6"
          }
        ],
        "before": {
          "num": "2",
          "acc": "7",
          "accBit": "0111",
          "result": "7"
        },
        "condition": {
          "text": "0111 ^ 0001 == 0110",
          "evaluation": "CANCEL DUPLICATE 1",
          "passes": true
        },
        "action": {
          "description": "Compute 7 XOR 1. Duplicate 1 bits cancel out. acc becomes 6."
        },
        "after": {
          "num": "1",
          "acc": "6",
          "accBit": "0110",
          "result": "6"
        },
        "changes": [
          {
            "var": "num",
            "from": "2",
            "to": "1"
          },
          {
            "var": "acc",
            "from": "7",
            "to": "6"
          },
          {
            "var": "accBit",
            "from": "0111",
            "to": "0110"
          },
          {
            "var": "result",
            "from": "7",
            "to": "6"
          }
        ],
        "currentResult": "6",
        "explanation": "XOR num = 1: Second occurrence of 1 cancels its bit contribution (1 ^ 1 = 0). Accumulator becomes 6."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 3,
        "pseudocodeText": "acc = 6 XOR 2 -> acc = 4 (0100)",
        "operation": "XOR",
        "title": "XOR num = 2 (Duplicates Cancel 2)",
        "variables": [
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "acc",
            "value": "4"
          },
          {
            "name": "accBit",
            "value": "0100"
          },
          {
            "name": "result",
            "value": "4"
          }
        ],
        "before": {
          "num": "1",
          "acc": "6",
          "accBit": "0110",
          "result": "6"
        },
        "condition": {
          "text": "0110 ^ 0010 == 0100",
          "evaluation": "CANCEL DUPLICATE 2",
          "passes": true
        },
        "action": {
          "description": "Compute 6 XOR 2. Duplicate 2 bits cancel out. acc becomes 4."
        },
        "after": {
          "num": "2",
          "acc": "4",
          "accBit": "0100",
          "result": "4"
        },
        "changes": [
          {
            "var": "num",
            "from": "1",
            "to": "2"
          },
          {
            "var": "acc",
            "from": "6",
            "to": "4"
          },
          {
            "var": "accBit",
            "from": "0110",
            "to": "0100"
          },
          {
            "var": "result",
            "from": "6",
            "to": "4"
          }
        ],
        "currentResult": "4",
        "explanation": "XOR num = 2: Second occurrence of 2 cancels out (2 ^ 2 = 0). Only the unique single number 4 remains."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 4,
        "pseudocodeText": "RETURN acc -> 4",
        "operation": "RETURN",
        "title": "Return Single Number",
        "variables": [
          {
            "name": "num",
            "value": "2"
          },
          {
            "name": "acc",
            "value": "4"
          },
          {
            "name": "accBit",
            "value": "0100"
          },
          {
            "name": "result",
            "value": "4"
          }
        ],
        "before": {
          "acc": "4",
          "accBit": "0100",
          "result": "4"
        },
        "condition": {
          "text": "All array elements processed?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "Return accumulator result = 4."
        },
        "after": {
          "result": "4"
        },
        "changes": [],
        "currentResult": "4",
        "explanation": "All array elements processed. Bitwise XOR cancellation isolated the single non-duplicate number: 4."
      }
    ],
    "finalState": {
      "result": "4",
      "explanation": "Bitwise XOR correctly identified the single non-duplicate element."
    }
  },
  "word-search": {
    "problemId": "word-search",
    "approachId": "gridDFSBacktracking",
    "approachName": "2D Grid DFS Backtracking",
    "input": {
      "title": "Word Search",
      "inputVisual": "Grid: 3x4 Matrix, word = \"ABCCED\"",
      "items": [
        {
          "label": "Grid",
          "value": "[ [\"A\",\"B\",\"C\",\"E\"], [\"S\",\"F\",\"C\",\"S\"], [\"A\",\"D\",\"E\",\"E\"] ]"
        },
        {
          "label": "Target Word",
          "value": "\"ABCCED\""
        }
      ],
      "expectedOutput": "true"
    },
    "initialState": {
      "variables": [
        {
          "name": "cell",
          "value": "(-, -)",
          "label": "Current Grid Coordinate"
        },
        {
          "name": "char",
          "value": "-",
          "label": "Grid Character"
        },
        {
          "name": "idx",
          "value": "0",
          "label": "Word Target Index"
        },
        {
          "name": "path",
          "value": "\"\"",
          "label": "Matched Substring Path (Derived State)"
        },
        {
          "name": "result",
          "value": "-",
          "label": "Current Result"
        }
      ]
    },
    "steps": [
      {
        "stepNo": 1,
        "pseudocodeLine": 3,
        "pseudocodeText": "dfs(0, 0, 0): board[0][0] == \"A\" matches word[0]",
        "operation": "MATCH",
        "title": "Start DFS at (0,0) \"A\"",
        "variables": [
          {
            "name": "cell",
            "value": "(0, 0)"
          },
          {
            "name": "char",
            "value": "A"
          },
          {
            "name": "idx",
            "value": "0"
          },
          {
            "name": "path",
            "value": "\"A\""
          },
          {
            "name": "result",
            "value": "false"
          }
        ],
        "before": {
          "cell": "(-, -)",
          "char": "-",
          "idx": "0",
          "path": "\"\"",
          "result": "-"
        },
        "condition": {
          "text": "board[0][0] == word[0] (\"A\")",
          "evaluation": "MATCH STARTING CELL",
          "passes": true
        },
        "action": {
          "description": "Mark board[0][0] = \"#\". Recurse right to (0, 1) for word[1] (\"B\")."
        },
        "after": {
          "cell": "(0, 0)",
          "char": "A",
          "idx": "0",
          "path": "\"A\"",
          "result": "false"
        },
        "changes": [
          {
            "var": "cell",
            "from": "(-, -)",
            "to": "(0, 0)"
          },
          {
            "var": "char",
            "from": "-",
            "to": "A"
          },
          {
            "var": "path",
            "from": "\"\"",
            "to": "\"A\""
          },
          {
            "var": "result",
            "from": "-",
            "to": "false"
          }
        ],
        "currentResult": "false",
        "explanation": "Cell (0,0) matches starting letter \"A\". Cell marked \"#\" during search. Proceeding to adjacent neighbors."
      },
      {
        "stepNo": 2,
        "pseudocodeLine": 8,
        "pseudocodeText": "dfs(0, 1, 1): board[0][1] == \"B\" matches word[1]",
        "operation": "MATCH",
        "title": "Step Right to (0,1) \"B\"",
        "variables": [
          {
            "name": "cell",
            "value": "(0, 1)"
          },
          {
            "name": "char",
            "value": "B"
          },
          {
            "name": "idx",
            "value": "1"
          },
          {
            "name": "path",
            "value": "\"AB\""
          },
          {
            "name": "result",
            "value": "false"
          }
        ],
        "before": {
          "cell": "(0, 0)",
          "char": "A",
          "idx": "0",
          "path": "\"A\"",
          "result": "false"
        },
        "condition": {
          "text": "board[0][1] == word[1] (\"B\")",
          "evaluation": "MATCH SECOND LETTER",
          "passes": true
        },
        "action": {
          "description": "Mark board[0][1] = \"#\". Recurse right to (0, 2) for word[2] (\"C\")."
        },
        "after": {
          "cell": "(0, 1)",
          "char": "B",
          "idx": "1",
          "path": "\"AB\""
        },
        "changes": [
          {
            "var": "cell",
            "from": "(0, 0)",
            "to": "(0, 1)"
          },
          {
            "var": "char",
            "from": "A",
            "to": "B"
          },
          {
            "var": "idx",
            "from": "0",
            "to": "1"
          },
          {
            "var": "path",
            "from": "\"A\"",
            "to": "\"AB\""
          }
        ],
        "currentResult": "false",
        "explanation": "Cell (0,1) matches \"B\". Path updated to \"AB\". Recurse to explore next character."
      },
      {
        "stepNo": 3,
        "pseudocodeLine": 8,
        "pseudocodeText": "dfs(0, 2, 2): board[0][2] == \"C\" matches word[2]",
        "operation": "MATCH",
        "title": "Step Right to (0,2) \"C\"",
        "variables": [
          {
            "name": "cell",
            "value": "(0, 2)"
          },
          {
            "name": "char",
            "value": "C"
          },
          {
            "name": "idx",
            "value": "2"
          },
          {
            "name": "path",
            "value": "\"ABC\""
          },
          {
            "name": "result",
            "value": "false"
          }
        ],
        "before": {
          "cell": "(0, 1)",
          "char": "B",
          "idx": "1",
          "path": "\"AB\"",
          "result": "false"
        },
        "condition": {
          "text": "board[0][2] == word[2] (\"C\")",
          "evaluation": "MATCH THIRD LETTER",
          "passes": true
        },
        "action": {
          "description": "Mark board[0][2] = \"#\". Recurse down to (1, 2) for word[3] (\"C\")."
        },
        "after": {
          "cell": "(0, 2)",
          "char": "C",
          "idx": "2",
          "path": "\"ABC\""
        },
        "changes": [
          {
            "var": "cell",
            "from": "(0, 1)",
            "to": "(0, 2)"
          },
          {
            "var": "char",
            "from": "B",
            "to": "C"
          },
          {
            "var": "idx",
            "from": "1",
            "to": "2"
          },
          {
            "var": "path",
            "from": "\"AB\"",
            "to": "\"ABC\""
          }
        ],
        "currentResult": "false",
        "explanation": "Cell (0,2) matches \"C\". Path updated to \"ABC\". Recurse down to (1, 2)."
      },
      {
        "stepNo": 4,
        "pseudocodeLine": 8,
        "pseudocodeText": "dfs(1, 2, 3): board[1][2] == \"C\" matches word[3]",
        "operation": "MATCH",
        "title": "Step Down to (1,2) \"C\"",
        "variables": [
          {
            "name": "cell",
            "value": "(1, 2)"
          },
          {
            "name": "char",
            "value": "C"
          },
          {
            "name": "idx",
            "value": "3"
          },
          {
            "name": "path",
            "value": "\"ABCC\""
          },
          {
            "name": "result",
            "value": "false"
          }
        ],
        "before": {
          "cell": "(0, 2)",
          "char": "C",
          "idx": "2",
          "path": "\"ABC\"",
          "result": "false"
        },
        "condition": {
          "text": "board[1][2] == word[3] (\"C\")",
          "evaluation": "MATCH FOURTH LETTER",
          "passes": true
        },
        "action": {
          "description": "Mark board[1][2] = \"#\". Recurse down to (2, 2) for word[4] (\"E\")."
        },
        "after": {
          "cell": "(1, 2)",
          "char": "C",
          "idx": "3",
          "path": "\"ABCC\""
        },
        "changes": [
          {
            "var": "cell",
            "from": "(0, 2)",
            "to": "(1, 2)"
          },
          {
            "var": "char",
            "from": "C",
            "to": "C"
          },
          {
            "var": "idx",
            "from": "2",
            "to": "3"
          },
          {
            "var": "path",
            "from": "\"ABC\"",
            "to": "\"ABCC\""
          }
        ],
        "currentResult": "false",
        "explanation": "Cell (1,2) matches second \"C\". Path updated to \"ABCC\". Recurse down to (2, 2)."
      },
      {
        "stepNo": 5,
        "pseudocodeLine": 8,
        "pseudocodeText": "dfs(2, 2, 4): board[2][2] == \"E\" matches word[4]",
        "operation": "MATCH",
        "title": "Step Down to (2,2) \"E\"",
        "variables": [
          {
            "name": "cell",
            "value": "(2, 2)"
          },
          {
            "name": "char",
            "value": "E"
          },
          {
            "name": "idx",
            "value": "4"
          },
          {
            "name": "path",
            "value": "\"ABCCE\""
          },
          {
            "name": "result",
            "value": "false"
          }
        ],
        "before": {
          "cell": "(1, 2)",
          "char": "C",
          "idx": "3",
          "path": "\"ABCC\"",
          "result": "false"
        },
        "condition": {
          "text": "board[2][2] == word[4] (\"E\")",
          "evaluation": "MATCH FIFTH LETTER",
          "passes": true
        },
        "action": {
          "description": "Mark board[2][2] = \"#\". Recurse left to (2, 1) for word[5] (\"D\")."
        },
        "after": {
          "cell": "(2, 2)",
          "char": "E",
          "idx": "4",
          "path": "\"ABCCE\""
        },
        "changes": [
          {
            "var": "cell",
            "from": "(1, 2)",
            "to": "(2, 2)"
          },
          {
            "var": "char",
            "from": "C",
            "to": "E"
          },
          {
            "var": "idx",
            "from": "3",
            "to": "4"
          },
          {
            "var": "path",
            "from": "\"ABCC\"",
            "to": "\"ABCCE\""
          }
        ],
        "currentResult": "false",
        "explanation": "Cell (2,2) matches \"E\". Path updated to \"ABCCE\". Recurse left to (2, 1)."
      },
      {
        "stepNo": 6,
        "pseudocodeLine": 6,
        "pseudocodeText": "dfs(2, 1, 5): board[2][1] == word[5] (\"D\") → YES",
        "operation": "MATCH",
        "title": "Step Left to (2,1) \"D\" - Final Match",
        "variables": [
          {
            "name": "cell",
            "value": "(2, 1)"
          },
          {
            "name": "char",
            "value": "D"
          },
          {
            "name": "idx",
            "value": "6"
          },
          {
            "name": "path",
            "value": "\"ABCCED\""
          },
          {
            "name": "result",
            "value": "true"
          }
        ],
        "before": {
          "cell": "(2, 2)",
          "char": "E",
          "idx": "4",
          "path": "\"ABCCE\"",
          "result": "false"
        },
        "condition": {
          "text": "board[2][1] == word[5] (\"D\")",
          "evaluation": "MATCH FINAL CHARACTER",
          "passes": true
        },
        "action": {
          "description": "Match final character \"D\". Advance idx from 5 → 6. Entire target word \"ABCCED\" is matched!"
        },
        "after": {
          "cell": "(2, 1)",
          "char": "D",
          "idx": "6",
          "path": "\"ABCCED\"",
          "result": "true"
        },
        "changes": [
          {
            "var": "cell",
            "from": "(2, 2)",
            "to": "(2, 1)"
          },
          {
            "var": "char",
            "from": "E",
            "to": "D"
          },
          {
            "var": "idx",
            "from": "4",
            "to": "6"
          },
          {
            "var": "path",
            "from": "\"ABCCE\"",
            "to": "\"ABCCED\""
          },
          {
            "var": "result",
            "from": "false",
            "to": "true"
          }
        ],
        "currentResult": "true",
        "explanation": "Cell (2,1) matches the final character \"D\". Target index advances from 5 to 6, completing the full word \"ABCCED\"."
      },
      {
        "stepNo": 7,
        "pseudocodeLine": 5,
        "pseudocodeText": "RETURN true",
        "operation": "RETURN",
        "title": "Return Search Success (true)",
        "variables": [
          {
            "name": "cell",
            "value": "(2, 1)"
          },
          {
            "name": "char",
            "value": "D"
          },
          {
            "name": "idx",
            "value": "6"
          },
          {
            "name": "path",
            "value": "\"ABCCED\""
          },
          {
            "name": "result",
            "value": "true"
          }
        ],
        "before": {
          "cell": "(2, 1)",
          "char": "D",
          "idx": "6",
          "path": "\"ABCCED\"",
          "result": "true"
        },
        "condition": {
          "text": "Search succeeded?",
          "evaluation": "YES",
          "passes": true
        },
        "action": {
          "description": "The search succeeds immediately. Return true."
        },
        "after": {
          "result": "true"
        },
        "changes": [],
        "currentResult": "true",
        "explanation": "All characters of \"ABCCED\" have been matched. The recursion returns true directly and execution terminates without post-success backtracking."
      }
    ],
    "finalState": {
      "result": "true",
      "explanation": "2D Grid DFS backtracking located the contiguous path for \"ABCCED\"."
    }
  }
};

/**
 * Helper function to retrieve dry run dataset by problem ID and approach ID.
 * Returns null if problem ID is unknown or not matched (no fallback to wrong problem).
 */
export function getDryRunByProblemAndApproach(problemId, approachId) {
  if (!problemId) return null;

  if (MOCK_DRY_RUNS[problemId]) {
    return MOCK_DRY_RUNS[problemId];
  }

  // Alias lookup map for normalized slug titles
  const aliasMap = {
    'two-sum': 'two-sum',
    'valid-parentheses': 'valid-parentheses',
    'reverse-linked-list': 'reverse-linked-list',
    'binary-tree-inorder': 'binary-tree-inorder',
    'binary-tree-inorder-traversal': 'binary-tree-inorder',
    'number-of-islands': 'number-of-islands',
    'kth-largest-element': 'kth-largest-element',
    'kth-largest-element-in-an-array': 'kth-largest-element',
    'sliding-window-maximum': 'sliding-window-maximum',
    'merge-intervals': 'merge-intervals',
    'longest-substring-without-repeating-characters': 'longest-substring-no-repeat',
    'longest-substring-no-repeat': 'longest-substring-no-repeat',
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

  const matchedKey = aliasMap[problemId];
  if (matchedKey && MOCK_DRY_RUNS[matchedKey]) {
    return MOCK_DRY_RUNS[matchedKey];
  }

  return null;
}

export default MOCK_DRY_RUNS;
