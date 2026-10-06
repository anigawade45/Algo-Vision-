const env = require('../config/env');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const buildUnderstandingPrompt = (problem) => {
  const problemContext = {
    id: String(problem._id || problem.id || ''),
    problemId: problem.problemId || '',
    title: problem.title || '',
    category: problem.category || '',
    difficulty: problem.difficulty || '',
    objective: problem.objective || '',
    description: problem.description || '',
    constraints: problem.constraints || [],
    inputData: problem.inputData || {},
    outputData: problem.outputData || {},
    testCases: problem.testCases || [],
  };

  const problemIdentityBlock = `
PROBLEM ID: ${problemContext.id}
PROBLEM SLUG: ${problemContext.problemId}
TITLE: ${problemContext.title}
CATEGORY: ${problemContext.category}
DIFFICULTY: ${problemContext.difficulty}

OBJECTIVE:
${problemContext.objective}

DESCRIPTION:
${problemContext.description}

CONSTRAINTS:
${JSON.stringify(problemContext.constraints, null, 2)}

INPUT DATA:
${JSON.stringify(problemContext.inputData, null, 2)}

OUTPUT DATA:
${JSON.stringify(problemContext.outputData, null, 2)}

TEST CASES:
${JSON.stringify(
    (problemContext.testCases || []).map((tc, idx) => ({
      testCaseId: tc.id || idx + 1,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
      inputStructured: tc.inputStructured || null,
      outputStructured: tc.outputStructured || null,
      reasoning: tc.reasoning || [],
    })),
    null,
    2
  )}
`.trim();

  const promptText = `
You are the Stage 02 Understanding generator for AlgoVision, an interactive Data Structures and Algorithms visual learning system.

=== AUTHORITATIVE PROBLEM CONTEXT ===
${problemIdentityBlock}

=== IMPORTANT DATA INTEGRITY RULES ===
1. The supplied problem data above is authoritative.
2. Do NOT modify, reinterpret, invent, replace, or reconstruct the actual input structure.
3. Do NOT invent graph nodes or graph edges.
4. Do NOT invent tree nodes or array values.
5. Do NOT invent matrix values, linked-list values, or test cases.
6. Your job is to EXPLAIN the supplied problem, not to create a new problem.
7. If the input data appears unusual, explain exactly what is supplied.
8. Never silently substitute a familiar example such as Two Sum.

Your task is to analyze this exact problem and produce a structured JSON explanation containing:
1. "objectiveExplanation": What the problem is asking - MUST be VERY SHORT, punchy, and direct (max 10-14 words).
2. "inputExplanation": What the input represents.
3. "outputExplanation": What the output represents.
4. "inputToOutputFlow": How input relates to/transforms into the required output.
5. "testCaseExplanations": An array of objects [{ "testCaseId": Number, "explanation": String }], explaining EACH test case listed above matching its exact testCaseId.
6. "commonMisunderstandings": Array of 1 to 5 common learner traps.
7. "edgeCaseInsights": Array of 1 to 5 boundary value insights.

CRITICAL CONSTRAINTS:
- Keep "objectiveExplanation" extremely short and clear (e.g. "Find indices of two numbers in array that add up to target.").
- Do NOT solve the problem with an algorithm (no hash map, no two-pointers, no binary search, no DP, no DFS/BFS, etc.).
- Do NOT provide code or pseudocode.
- For testCaseExplanations, include an explanation for EACH test case listed above, matching its exact testCaseId.

--- FEW-SHOT EXAMPLES OF DESIRED JSON OUTPUT ---

EXAMPLE 1 (Problem: Two Sum - Array + Target):
{
  "objectiveExplanation": "Find indices of two numbers in array that add up to target.",
  "inputExplanation": "An array of integers (nums) and a target sum integer.",
  "outputExplanation": "An array containing the 0-based index positions of the matching pair.",
  "inputToOutputFlow": "Examine element values in the array, find the pair summing to target, and return [index1, index2].",
  "testCaseExplanations": [
    {
      "testCaseId": 1,
      "explanation": "In nums = [2, 7, 11, 15] with target = 9, elements 2 (idx 0) and 7 (idx 1) add to 9. Output is [0, 1]."
    },
    {
      "testCaseId": 2,
      "explanation": "In nums = [3, 2, 4] with target = 6, elements 2 (idx 1) and 4 (idx 2) add to 6. Output is [1, 2]."
    }
  ],
  "commonMisunderstandings": [
    "Assuming you can pick the same array index twice.",
    "Returning array values instead of index positions."
  ],
  "edgeCaseInsights": [
    "Negative numbers or negative target values.",
    "Minimum array length of 2 elements."
  ]
}

EXAMPLE 2 (Problem: Valid Parentheses - String Bracket Sequence):
{
  "objectiveExplanation": "Check if all open brackets are correctly matched and closed in order.",
  "inputExplanation": "A string s containing bracket characters.",
  "outputExplanation": "Boolean true if valid, false otherwise.",
  "inputToOutputFlow": "Check bracket pairs from left to right to ensure proper nesting.",
  "testCaseExplanations": [
    {
      "testCaseId": 1,
      "explanation": "In s = '([{}])', all brackets close in proper nested order. Output is true."
    },
    {
      "testCaseId": 2,
      "explanation": "In s = '([)]', closing ')' mismatches '[', breaking nesting order. Output is false."
    }
  ],
  "commonMisunderstandings": [
    "Counting bracket totals without verifying exact closure order.",
    "Ignoring mismatched bracket types."
  ],
  "edgeCaseInsights": [
    "Odd string length (always invalid).",
    "String starting with a closing bracket."
  ]
}

EXAMPLE 3 (Problem: Reverse Linked List - Singly Linked List):
{
  "objectiveExplanation": "Invert all node pointers so tail becomes the new head.",
  "inputExplanation": "The head pointer of a singly linked list.",
  "outputExplanation": "The new head pointer of the reversed list.",
  "inputToOutputFlow": "Reverse each next pointer to point to the preceding node.",
  "testCaseExplanations": [
    {
      "testCaseId": 1,
      "explanation": "In 1 -> 2 -> 3 -> 4 -> 5, links are reversed to 5 -> 4 -> 3 -> 2 -> 1."
    },
    {
      "testCaseId": 2,
      "explanation": "In 1 -> 2, link is reversed to 2 -> 1 with 2 as head."
    }
  ],
  "commonMisunderstandings": [
    "Copying node values instead of updating pointer links.",
    "Losing head reference during link reversal."
  ],
  "edgeCaseInsights": [
    "Empty list (head is null).",
    "Single-node list."
  ]
}

--- CURRENT TARGET PROBLEM CONTEXT ---
${JSON.stringify(problemContext, null, 2)}

REQUIRED JSON OUTPUT SCHEMA:
Return ONLY a valid JSON object for "${problem.title}" matching this exact schema:
{
  "objectiveExplanation": "Short 1-sentence explanation of what to find (max 10-14 words).",
  "inputExplanation": "Brief description of given input.",
  "outputExplanation": "Brief description of required output.",
  "inputToOutputFlow": "Brief 1-sentence conceptual flow from input to output.",
  "testCaseExplanations": [
    {
      "testCaseId": 1,
      "explanation": "Brief explanation of sample test case."
    }
  ],
  "commonMisunderstandings": [
    "Common misunderstanding or trap."
  ],
  "edgeCaseInsights": [
    "Important edge case condition or boundary value insight for this problem."
  ]
}

Return ONLY valid raw JSON. No Markdown formatting. No \`\`\`json fences. No text before or after the JSON.
`.trim();

  return promptText;
};

const generateStage02Content = async (problem) => {
  const apiKey = env.geminiApiKey;
  const primaryModel = env.geminiModel || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('[Gemini Service] GEMINI_API_KEY is missing from environment variables');
    throw new AppError('Gemini API key is not configured on the server', 500);
  }

  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ]));

  const prompt = buildUnderstandingPrompt(problem);
  let lastError = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Gemini Service] Calling Gemini API (Model: ${model}, Attempt: ${attempts}) for Stage 02 Problem Understanding: "${problem.title}"`);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const statusMessage = errorData.error?.message || res.statusText || 'Unknown Gemini error';
          console.warn(`[Gemini Service] API HTTP ${res.status} (${model}):`, statusMessage);

          if ((res.status === 503 || res.status === 429) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
            continue;
          }

          lastError = new AppError(`Gemini API error (${model}): ${statusMessage}`, res.status >= 500 ? 502 : 400);
          break;
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          lastError = new AppError(`Gemini model ${model} returned an empty response`, 502);
          break;
        }

        console.log(`[Gemini Service] Successfully generated Stage 02 content using model "${model}"`);
        return {
          rawText: responseText,
          model,
          promptVersion: 'understanding-v1',
        };
      } catch (err) {
        console.error(`[Gemini Service] Connection error with model ${model}:`, err.message);
        lastError = err;
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw (
    lastError ||
    new AppError('Gemini AI models are currently experiencing high demand. Please try again in a few moments.', 503)
  );
};

const buildAnalogyPrompt = (problem) => {
  const problemContext = {
    id: String(problem._id || problem.id || ''),
    problemId: problem.problemId || '',
    title: problem.title || '',
    category: problem.category || '',
    difficulty: problem.difficulty || '',
    objective: problem.objective || '',
    description: problem.description || '',
    constraints: problem.constraints || [],
    inputData: problem.inputData || {},
    outputData: problem.outputData || {},
    testCases: problem.testCases || [],
  };

  const problemIdentityBlock = `
PROBLEM ID: ${problemContext.id}
PROBLEM SLUG: ${problemContext.problemId}
TITLE: ${problemContext.title}
CATEGORY: ${problemContext.category}
DIFFICULTY: ${problemContext.difficulty}

OBJECTIVE:
${problemContext.objective}

DESCRIPTION:
${problemContext.description}

CONSTRAINTS:
${JSON.stringify(problemContext.constraints, null, 2)}

INPUT DATA:
${JSON.stringify(problemContext.inputData, null, 2)}

OUTPUT DATA:
${JSON.stringify(problemContext.outputData, null, 2)}

TEST CASES:
${JSON.stringify(
    (problemContext.testCases || []).map((tc, idx) => ({
      testCaseId: tc.id || idx + 1,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
      inputStructured: tc.inputStructured || null,
      outputStructured: tc.outputStructured || null,
    })),
    null,
    2
  )}
`.trim();

  const promptText = `
You are the Stage 03 Analogy generator for AlgoVision, an interactive Data Structures and Algorithms visual learning system.

=== AUTHORITATIVE PROBLEM CONTEXT ===
${problemIdentityBlock}

=== INSTRUCTIONS FOR STAGE 03 REAL-WORLD STORY ANALOGY ===
1. Create a vivid, immersive, real-world story analogy for this problem.
2. Translate the core problem into familiar physical objects or everyday human activities (e.g., shopping budgets, Russian nesting dolls, scavenger hunts, camera viewfinders, office room bookings, bouncers at a club, expanding water ripples, thieves with alarms, packing luggage, etc.).
3. The story MUST consist of multiple clear paragraphs separated by double newlines ("\\n\\n").
4. Explaining paragraph by paragraph:
   - Paragraph 1: Set up the real-world scene, main characters/objects, and goal.
   - Paragraph 2: Explain the real-world problem or bottleneck that would happen if solved naively or brute-force.
   - Paragraph 3: Explain the clever real-world trick or mechanism that solves it cleanly.
   - Paragraph 4: Connect the real-world metaphor back to the core concept in plain English.
5. CRITICAL RULE - DO NOT UNLOCK OR MENTION DATA STRUCTURES OR ALGORITHMS:
   - DO NOT mention computer science data structure names (e.g. NEVER say "Hash Set", "Hash Map", "Stack", "Queue", "Min-Heap", "Max-Heap", "Binary Search Tree", "Graph", "Matrix", "Array", "Linked List", etc.).
   - DO NOT mention algorithm/technique names (e.g. NEVER say "BFS", "DFS", "Breadth-First Search", "Depth-First Search", "Two Pointers", "Sliding Window", "Dynamic Programming", "Backtracking", "Topological Sort", etc.).
   - Stage 03 is PURE REAL-WORLD STORYTELLING. Technical data structures and algorithmic patterns will be unlocked in Stage 04 and Stage 05.
6. Make the title of the scenario catchy, creative, and memorable (e.g. "The Budget Shopping Trip", "The Russian Nesting Dolls", "Consolidating Meeting Bookings").

--- FEW-SHOT EXAMPLES OF DESIRED ANALOGY JSON OUTPUT ---

EXAMPLE 1 (Problem: Two Sum):
{
  "intro": {
    "title": "Connect to a Familiar Analogy",
    "subtitle": "A familiar situation that mirrors this algorithm without the code."
  },
  "scenario": {
    "title": "The Budget Shopping Trip",
    "story": "Imagine you are at a supermarket with a very strict shopping list. You have a gift card worth exactly ₹900, and you want to buy exactly two items that will use up the entire balance. No more, no less.\\n\\nInstead of blindly picking up an item and walking through the entire store trying to find another item that perfectly matches the remaining balance (which would take forever), you decide to use your memory.\\n\\nAs you walk down the aisle, you pick up a ₹200 item. You mentally calculate: \\"I need a ₹700 item to finish my shopping.\\" You keep the ₹200 item in mind. Later, you spot a ₹700 item. Because you remembered the first item, you instantly know you've found your perfect pair without having to search the store twice!\\n\\nThis is exactly how this problem is solved efficiently. By checking each item once and keeping track of what you've already seen, you instantly recognize when the matching partner appears."
  }
}

EXAMPLE 2 (Problem: Valid Parentheses):
{
  "intro": {
    "title": "Connect to a Familiar Analogy",
    "subtitle": "A familiar situation that mirrors this algorithm without the code."
  },
  "scenario": {
    "title": "The Russian Nesting Dolls",
    "story": "Think of a set of beautiful Russian Matryoshka dolls. When you are assembling them, every time you open a bottom half of a doll (an opening bracket), you must eventually cap it with its exact matching top half (a closing bracket).\\n\\nIf you open a large red doll, then open a medium blue doll inside it, and finally a small green doll inside that... you cannot just put the large red lid on right away. You must close the small green doll first, then the medium blue doll, and finally the large red one.\\n\\nThe last doll you opened must be the first one you close. If you try to put a square lid on a round box, or close the outer box before the inner box is sealed, the whole set breaks.\\n\\nThis strict Last-In, First-Out sequence ensures every nested container is closed in exact reverse order of how it was opened."
  }
}

EXAMPLE 3 (Problem: Number of Islands):
{
  "intro": {
    "title": "Connect to a Familiar Analogy",
    "subtitle": "A familiar situation that mirrors this algorithm without the code."
  },
  "scenario": {
    "title": "Exploring Uncharted Archipelago",
    "story": "Imagine you are an explorer flying over an uncharted ocean dotted with islands. You have a blank map, and your job is to count exactly how many distinct islands exist.\\n\\nYou decide to parachute down onto the first piece of land you see. To ensure you don't count this island twice, you pull out a red marker and paint the ground you are standing on. Then, you walk north, south, east, and west, painting all connected landmasses red until you hit water in every direction.\\n\\nOnce the entire island is painted, you fly back up into the sky. You scan the ocean again. If you see unpainted land, you know it must be a brand new island! You parachute down and repeat the process.\\n\\nThis methodical exploration and marking of connected land ensures every continuous landmass is fully explored and counted exactly once."
  }
}

--- CURRENT TARGET PROBLEM CONTEXT ---
${JSON.stringify(problemContext, null, 2)}

REQUIRED JSON OUTPUT SCHEMA:
Return ONLY a valid JSON object for "${problem.title}" matching this exact schema:
{
  "intro": {
    "title": "Connect to a Familiar Analogy",
    "subtitle": "A familiar situation that mirrors this algorithm without the code."
  },
  "scenario": {
    "title": "Catchy Metaphor Title",
    "story": "Multi-paragraph storytelling text with \\n\\n separating paragraphs."
  }
}

Return ONLY valid raw JSON. No Markdown formatting. No \`\`\`json fences. No text before or after the JSON.
`.trim();

  return promptText;
};

const generateStage03AnalogyContent = async (problem) => {
  const apiKey = env.geminiApiKey;
  const primaryModel = env.geminiModel || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('[Gemini Service] GEMINI_API_KEY is missing from environment variables');
    throw new AppError('Gemini API key is not configured on the server', 500);
  }

  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ]));

  const prompt = buildAnalogyPrompt(problem);
  let lastError = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    };

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Gemini Service] Calling Gemini API (Model: ${model}, Attempt: ${attempts}) for Stage 03 Analogy: "${problem.title}"`);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const statusMessage = errorData.error?.message || res.statusText || 'Unknown Gemini error';
          console.warn(`[Gemini Service] API HTTP ${res.status} (${model}):`, statusMessage);

          if ((res.status === 503 || res.status === 429) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
            continue;
          }

          lastError = new AppError(`Gemini API error (${model}): ${statusMessage}`, res.status >= 500 ? 502 : 400);
          break;
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          lastError = new AppError(`Gemini model ${model} returned an empty response`, 502);
          break;
        }

        console.log(`[Gemini Service] Successfully generated Stage 03 Analogy content using model "${model}"`);
        return {
          rawText: responseText,
          model,
          promptVersion: 'analogy-v1',
        };
      } catch (err) {
        console.error(`[Gemini Service] Connection error with model ${model}:`, err.message);
        lastError = err;
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw (
    lastError ||
    new AppError('Gemini AI models are currently experiencing high demand. Please try again in a few moments.', 503)
  );
};

const buildPatternPrompt = (problem) => {
  const problemContext = {
    id: String(problem._id || problem.id || ''),
    problemId: problem.problemId || '',
    title: problem.title || '',
    category: problem.category || '',
    difficulty: problem.difficulty || '',
    objective: problem.objective || '',
    description: problem.description || '',
    constraints: problem.constraints || [],
    inputData: problem.inputData || {},
    outputData: problem.outputData || {},
    testCases: problem.testCases || [],
  };

  const problemIdentityBlock = `
PROBLEM ID: ${problemContext.id}
PROBLEM SLUG: ${problemContext.problemId}
TITLE: ${problemContext.title}
CATEGORY: ${problemContext.category}
DIFFICULTY: ${problemContext.difficulty}

OBJECTIVE:
${problemContext.objective}

DESCRIPTION:
${problemContext.description}

CONSTRAINTS:
${JSON.stringify(problemContext.constraints, null, 2)}

INPUT DATA:
${JSON.stringify(problemContext.inputData, null, 2)}

OUTPUT DATA:
${JSON.stringify(problemContext.outputData, null, 2)}

TEST CASES:
${JSON.stringify(
    (problemContext.testCases || []).map((tc, idx) => ({
      testCaseId: tc.id || idx + 1,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
      inputStructured: tc.inputStructured || null,
      outputStructured: tc.outputStructured || null,
    })),
    null,
    2
  )}
`.trim();

  const promptText = `
You are the Stage 04 Pattern generator for AlgoVision, an interactive Data Structures and Algorithms visual learning system.

=== AUTHORITATIVE PROBLEM CONTEXT ===
${problemIdentityBlock}

=== INSTRUCTIONS FOR STAGE 04 PATTERN RECOGNITION ===
Your task is to analyze this exact problem and produce a structured JSON object for Stage 04 Pattern Recognition.
Focus on identifying the underlying structural pattern, problem shape, observations, abstractions, and potential solution families without writing code.

--- FEW-SHOT EXAMPLE OF DESIRED PATTERN JSON OUTPUT ---

EXAMPLE 1 (Problem: Two Sum):
{
  "intro": {
    "eyebrow": "04 · PATTERN",
    "title": "Recognize the structure behind the problem.",
    "subtitle": "Before choosing an algorithm, identify the shape of the problem."
  },
  "structure": {
    "title": "Look at what the problem is asking.",
    "subtitle": "Shift attention from individual elements to the relationship between elements.",
    "inputLabel": "ARRAY & TARGET",
    "inputVisual": ["[ 2 ]", "[ 7 ]", "[ 11 ]", "[ 15 ]"],
    "targetLabel": "TARGET SUM",
    "targetValue": "9",
    "coreRelationship": [
      { "label": "Two values", "sub": "Input elements in array" },
      { "label": "Must satisfy", "sub": "Required mathematical relation" },
      { "label": "Target condition", "sub": "Sum equals Target" }
    ]
  },
  "signals": {
    "title": "What stands out?",
    "subtitle": "Identify key structural signals from the problem description.",
    "observations": [
      {
        "id": "signal_1",
        "title": "SIGNAL 01",
        "label": "More than one value must work together.",
        "detail": "The objective requires selecting a pair of elements, not evaluating a single item in isolation."
      },
      {
        "id": "signal_2",
        "title": "SIGNAL 02",
        "label": "The values are connected by an exact condition.",
        "detail": "The two selected items cannot be arbitrary; Value A + Value B = Target defines validity."
      },
      {
        "id": "signal_3",
        "title": "SIGNAL 03",
        "label": "The answer depends on element positions.",
        "detail": "Output requires identifying the exact indices corresponding to the valid pair."
      }
    ]
  },
  "abstraction": {
    "title": "Abstract the problem.",
    "subtitle": "Specific numbers fade away; the structural relationship remains.",
    "concrete": {
      "items": ["2", "7", "11", "15"],
      "target": "9"
    },
    "abstractFormula": {
      "varA": "VALUE A",
      "operator": "+",
      "varB": "VALUE B",
      "equals": "=",
      "result": "TARGET"
    },
    "statement": "When specific values disappear, the pair relationship remains intact."
  },
  "pattern": {
    "name": "Pair / Complement Relationship Pattern",
    "tagline": "Identify two values whose relationship satisfies a required target condition.",
    "description": "When a problem asks you to find two values that satisfy a relationship or condition, you are looking at a pair relationship pattern."
  },
  "fingerprint": {
    "title": "Pattern Fingerprint",
    "steps": [
      { "stage": "INPUT", "value": "Array / Collection of elements" },
      { "stage": "RELATIONSHIP", "value": "Two values working together" },
      { "stage": "CONDITION", "value": "Sum / Relation equals Target" },
      { "stage": "OUTPUT", "value": "Required pair indices" }
    ]
  },
  "solutionFamilies": {
    "title": "Solution Families",
    "subtitle": "What approaches should come to mind for this pattern?",
    "question": "Which tools or solution families are commonly associated with Pair / Relationship problems?",
    "families": [
      {
        "id": "fam_1",
        "name": "Hash Table / Complement Lookup",
        "detail": "Fast O(1) lookup of required complement values."
      },
      {
        "id": "fam_2",
        "name": "Two-Pointer / Sorting",
        "detail": "Shrinking search space on sorted inputs."
      }
    ],
    "note": "Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works."
  },
  "limitations": {
    "title": "What the Pattern Does NOT Tell Us",
    "subtitle": "Recognizing a pattern does not tell us the algorithm yet.",
    "tellsUs": ["What structure to look for", "What relationships matter", "What signals identify the problem"],
    "doesNotTellUs": ["Which specific data structure implementation to use", "Exact line-by-line code steps"]
  },
  "takeaway": {
    "specificProblem": "Find indices of two numbers that sum to target.",
    "generalPattern": "Identify pair elements satisfying target constraint.",
    "finalStatement": "Focus on value relationships before choosing specific data structures."
  }
}

--- CURRENT TARGET PROBLEM CONTEXT ---
${JSON.stringify(problemContext, null, 2)}

REQUIRED JSON OUTPUT SCHEMA:
Return ONLY a valid JSON object for "${problem.title}" matching this exact schema:
{
  "intro": {
    "eyebrow": "04 · PATTERN",
    "title": "Recognize the structure behind the problem.",
    "subtitle": "Before choosing an algorithm, identify the shape of the problem."
  },
  "structure": {
    "title": "Look at what the problem is asking.",
    "subtitle": "Brief subtitle on structural focus.",
    "inputLabel": "SHORT INPUT TYPE",
    "inputVisual": ["visual item 1", "visual item 2"],
    "targetLabel": "TARGET LABEL",
    "targetValue": "TARGET VALUE",
    "coreRelationship": [
      { "label": "Relationship Label", "sub": "Brief subtext" }
    ]
  },
  "signals": {
    "title": "What stands out?",
    "subtitle": "Identify key structural signals from the problem description.",
    "observations": [
      {
        "id": "signal_1",
        "title": "SIGNAL 01",
        "label": "Key Signal Headline",
        "detail": "Detailed explanation of observation."
      }
    ]
  },
  "abstraction": {
    "title": "Abstract the problem.",
    "subtitle": "Abstract formula subtitle.",
    "concrete": {
      "items": ["Sample item 1", "Sample item 2"],
      "target": "Target description"
    },
    "abstractFormula": {
      "varA": "VAR A",
      "operator": "➔",
      "varB": "VAR B",
      "equals": "=",
      "result": "RESULT"
    },
    "statement": "Abstraction takeaway statement."
  },
  "pattern": {
    "name": "Recognized Pattern Name",
    "tagline": "Single sentence tagline.",
    "description": "Clear description of when this pattern applies."
  },
  "fingerprint": {
    "title": "Pattern Fingerprint",
    "steps": [
      { "stage": "INPUT", "value": "Input description" },
      { "stage": "RELATIONSHIP", "value": "Relationship description" },
      { "stage": "CONDITION", "value": "Condition description" },
      { "stage": "OUTPUT", "value": "Output description" }
    ]
  },
  "solutionFamilies": {
    "title": "Solution Families",
    "subtitle": "What approaches should come to mind for this pattern?",
    "question": "Which tools or solution families are commonly associated with this problem?",
    "families": [
      {
        "id": "fam_1",
        "name": "Family Name 1",
        "detail": "Family detail description."
      }
    ],
    "note": "Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works."
  },
  "limitations": {
    "title": "What the Pattern Does NOT Tell Us",
    "subtitle": "Recognizing a pattern does not tell us the algorithm yet.",
    "tellsUs": ["Point 1", "Point 2"],
    "doesNotTellUs": ["Point 1", "Point 2"]
  },
  "takeaway": {
    "specificProblem": "Specific problem statement.",
    "generalPattern": "General pattern concept.",
    "finalStatement": "Concluding takeaway line."
  }
}

Return ONLY valid raw JSON. No Markdown formatting. No \`\`\`json fences. No text before or after the JSON.
`.trim();

  return promptText;
};

const generateStage04PatternContent = async (problem) => {
  const apiKey = env.geminiApiKey;
  const primaryModel = env.geminiModel || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('[Gemini Service] GEMINI_API_KEY is missing from environment variables');
    throw new AppError('Gemini API key is not configured on the server', 500);
  }

  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ]));

  const prompt = buildPatternPrompt(problem);
  let lastError = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Gemini Service] Calling Gemini API (Model: ${model}, Attempt: ${attempts}) for Stage 04 Pattern: "${problem.title}"`);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const statusMessage = errorData.error?.message || res.statusText || 'Unknown Gemini error';
          console.warn(`[Gemini Service] API HTTP ${res.status} (${model}):`, statusMessage);

          if ((res.status === 503 || res.status === 429) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
            continue;
          }

          lastError = new AppError(`Gemini API error (${model}): ${statusMessage}`, res.status >= 500 ? 502 : 400);
          break;
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          lastError = new AppError(`Gemini model ${model} returned an empty response`, 502);
          break;
        }

        console.log(`[Gemini Service] Successfully generated Stage 04 Pattern content using model "${model}"`);
        return {
          rawText: responseText,
          model,
          promptVersion: 'pattern-v1',
        };
      } catch (err) {
        console.error(`[Gemini Service] Connection error with model ${model}:`, err.message);
        lastError = err;
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw (
    lastError ||
    new AppError('Gemini AI models are currently experiencing high demand. Please try again in a few moments.', 503)
  );
};

const buildPseudocodePrompt = (problem, approachId, approachName) => {
  const problemContext = {
    id: String(problem._id || problem.id || ''),
    problemId: problem.problemId || '',
    title: problem.title || '',
    category: problem.category || '',
    difficulty: problem.difficulty || '',
    objective: problem.objective || '',
    description: problem.description || '',
    constraints: problem.constraints || [],
    inputData: problem.inputData || {},
    outputData: problem.outputData || {},
    testCases: problem.testCases || [],
  };

  const problemIdentityBlock = `
PROBLEM ID: ${problemContext.id}
PROBLEM SLUG: ${problemContext.problemId}
TITLE: ${problemContext.title}
CATEGORY: ${problemContext.category}
DIFFICULTY: ${problemContext.difficulty}

OBJECTIVE:
${problemContext.objective}

DESCRIPTION:
${problemContext.description}

CONSTRAINTS:
${JSON.stringify(problemContext.constraints, null, 2)}

INPUT DATA:
${JSON.stringify(problemContext.inputData, null, 2)}

OUTPUT DATA:
${JSON.stringify(problemContext.outputData, null, 2)}

TEST CASES:
${JSON.stringify(
    (problemContext.testCases || []).map((tc, idx) => ({
      testCaseId: tc.id || idx + 1,
      inputRaw: tc.inputRaw,
      outputRaw: tc.outputRaw,
    })),
    null,
    2
  )}
`.trim();

  const promptText = `
You are the Stage 05 Pseudocode Generator for AlgoVision, an interactive Data Structures and Algorithms visual learning system.

=== AUTHORITATIVE PROBLEM CONTEXT ===
${problemIdentityBlock}

=== SELECTED PATTERN & APPROACH (STRICT APPROACH LOCK) ===
APPROACH ID: ${approachId}
APPROACH NAME: ${approachName}

STRICT APPROACH LOCK RULES:
1. The user selected the approach "${approachName}" (ID: "${approachId}") in Stage 04 (Pattern).
2. You MUST generate pseudocode ONLY for this selected approach.
3. You MUST NOT select, recommend, or substitute a different pattern or algorithm approach.
4. Do NOT substitute BFS for DFS, HashMap for Two Pointers, DP for recursion, etc.
5. Even if another approach seems more optimal, stay strictly locked to "${approachName}".

=== PSEUDOCODE GENERATION RULES ===
1. Generate clear, language-independent pseudocode for solving the exact problem above using the selected approach.
2. DO NOT output programming-language-specific code or syntax (NO Java, C++, Python, JavaScript syntax like 'unordered_map', 'ArrayList', 'vector<int>', 'Map()', 'function', 'heapq', 'dict()').
3. Use language-independent control-flow keywords: START, INITIALIZE, CREATE, FOR, WHILE, IF, ELSE, RETURN, END, PUSH, POP, INSERT, REMOVE.
4. Line numbers MUST be sequential integers starting from 1 with NO gaps or duplicates (1, 2, 3, 4, ...).
5. Each line object must contain:
   - "line": integer (1, 2, 3, ...)
   - "type": string, one of ["start", "instruction", "loop", "condition", "return", "end", "comment", "initialization", "operation", "update", "call"]
   - "text": string (pseudocode statement)
   - "explanation": string (short pedagogical explanation of what this line does)
   - "indent": boolean (true if indented, false otherwise)
   - "indentLevel": integer (0 for base, 1 for inside loop/condition, 2 for nested)
6. Include a "walkthrough" array of 2-4 key logical steps: [{ "stepNo": "01", "action": "...", "why": "..." }].
7. Include a "decisions" array of 1-3 key branching points: [{ "condition": "...", "yes": "...", "no": "..." }].
8. Include a "takeaway" object: { "statement": "...", "subtitle": "..." }.

--- EXPECTED JSON RESPONSE SCHEMA ---
{
  "approachId": "${approachId}",
  "approachName": "${approachName}",
  "approachContext": "Pseudocode generated for the selected ${approachName} approach.",
  "intro": {
    "eyebrow": "06 · PSEUDOCODE",
    "title": "Turn the chosen algorithm into clear, step-by-step logic.",
    "subtitle": "Before writing code, describe exactly what the algorithm needs to do."
  },
  "lines": [
    {
      "line": 1,
      "type": "start",
      "text": "START",
      "explanation": "Execution begins.",
      "indent": false,
      "indentLevel": 0
    },
    {
      "line": 2,
      "type": "instruction",
      "text": "Initialize data structures for ${approachName}.",
      "explanation": "Set up initial state.",
      "indent": false,
      "indentLevel": 0
    },
    {
      "line": 3,
      "type": "loop",
      "text": "FOR each element in input:",
      "explanation": "Iterate through elements.",
      "indent": false,
      "indentLevel": 0
    },
    {
      "line": 4,
      "type": "condition",
      "text": "IF target condition met:",
      "explanation": "Check terminating condition.",
      "indent": true,
      "indentLevel": 1
    },
    {
      "line": 5,
      "type": "return",
      "text": "RETURN result.",
      "explanation": "Return computed answer.",
      "indent": true,
      "indentLevel": 2
    },
    {
      "line": 6,
      "type": "end",
      "text": "END",
      "explanation": "Algorithm completes.",
      "indent": false,
      "indentLevel": 0
    }
  ],
  "walkthrough": [
    { "stepNo": "01", "action": "Initialize storage", "why": "Track state efficiently." }
  ],
  "decisions": [
    { "condition": "Condition check?", "yes": "Return result", "no": "Continue loop" }
  ],
  "takeaway": {
    "statement": "Your algorithm is now expressed as language-independent steps.",
    "subtitle": "The algorithm defines the approach. Pseudocode turns that approach into precise steps."
  }
}

Return ONLY valid raw JSON. No Markdown formatting. No backtick code fences. No text before or after the JSON.
`.trim();

  return promptText;
};

const generateStage05PseudocodeContent = async (problem, approachId, approachName) => {
  const apiKey = env.geminiApiKey;
  const primaryModel = env.geminiModel || 'gemini-2.5-flash';

  if (!apiKey) {
    console.error('[Gemini Service] GEMINI_API_KEY is missing from environment variables');
    throw new AppError('Gemini API key is not configured on the server', 500);
  }

  const candidateModels = Array.from(new Set([
    primaryModel,
    'gemini-3.8-flash',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
  ]));

  const prompt = buildPseudocodePrompt(problem, approachId, approachName);
  let lastError = null;

  for (const model of candidateModels) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    let attempts = 0;
    const maxAttempts = 2;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        console.log(`[Gemini Service] Calling Gemini API (Model: ${model}, Attempt: ${attempts}) for Stage 05 Pseudocode: "${problem.title}" [Approach: ${approachId}]`);

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const statusMessage = errorData.error?.message || res.statusText || 'Unknown Gemini error';
          console.warn(`[Gemini Service] API HTTP ${res.status} (${model}):`, statusMessage);

          if ((res.status === 503 || res.status === 429) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
            continue;
          }

          lastError = new AppError(`Gemini API error (${model}): ${statusMessage}`, res.status >= 500 ? 502 : 400);
          break;
        }

        const data = await res.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          lastError = new AppError(`Gemini model ${model} returned an empty response`, 502);
          break;
        }

        console.log(`[Gemini Service] Successfully generated Stage 05 Pseudocode content using model "${model}"`);
        return {
          rawText: responseText,
          model,
          promptVersion: 'pseudocode-v1',
        };
      } catch (err) {
        console.error(`[Gemini Service] Connection error with model ${model}:`, err.message);
        lastError = err;
        if (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
  }

  throw (
    lastError ||
    new AppError('Gemini AI models are currently experiencing high demand. Please try again in a few moments.', 503)
  );
};

module.exports = {
  AppError,
  buildUnderstandingPrompt,
  generateStage02Content,
  buildAnalogyPrompt,
  generateStage03AnalogyContent,
  buildPatternPrompt,
  generateStage04PatternContent,
  buildPseudocodePrompt,
  generateStage05PseudocodeContent,
};
