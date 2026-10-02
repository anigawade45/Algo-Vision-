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

/**
 * Calls Gemini REST API to generate structured Stage 02 content with model fallback & retry logic.
 */
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
2. Translate the core algorithm and data structures into familiar physical objects or everyday human activities (e.g., shopping budgets, Russian nesting dolls, scavenger hunts, camera viewfinders, office room bookings, bouncers at a club, expanding water ripples, thieves with alarms, packing luggage, etc.).
3. The story MUST consist of multiple clear paragraphs separated by double newlines ("\\n\\n").
4. Explaining paragraph by paragraph:
   - Paragraph 1: Set up the real-world scene, main characters/objects, and goal.
   - Paragraph 2: Explain the real-world problem or bottleneck that would happen if solved naively or brute-force.
   - Paragraph 3: Explain the clever real-world trick or mechanism that solves it cleanly.
   - Paragraph 4: Directly connect the real-world metaphor back to the algorithmic concept in plain English.
5. NO CODE or pseudo-code in the story. Keep it 100% focused on real-world conceptual intuition.
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
    "story": "Imagine you are at a supermarket with a very strict shopping list. You have a gift card worth exactly ₹900, and you want to buy exactly two items that will use up the entire balance. No more, no less.\\n\\nInstead of blindly picking up an item and walking through the entire store trying to find another item that perfectly matches the remaining balance (which would take forever), you decide to use your memory.\\n\\nAs you walk down the aisle, you pick up a ₹200 item. You mentally calculate: \\"I need a ₹700 item to finish my shopping.\\" You keep the ₹200 item in mind. Later, you spot a ₹700 item. Because you remembered the first item, you instantly know you've found your perfect pair without having to search the store twice!\\n\\nThis is exactly how the Two Sum algorithm works using a Hash Map. It walks through the array once, remembers the elements it has seen, and instantly checks if the \\"missing complement\\" has already been found."
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
    "story": "Think of a set of beautiful Russian Matryoshka dolls. When you are assembling them, every time you open a bottom half of a doll (an opening bracket), you must eventually cap it with its exact matching top half (a closing bracket).\\n\\nIf you open a large red doll, then open a medium blue doll inside it, and finally a small green doll inside that... you cannot just put the large red lid on right away. You must close the small green doll first, then the medium blue doll, and finally the large red one.\\n\\nThe last doll you opened must be the first one you close. If you try to put a square lid on a round box, or close the outer box before the inner box is sealed, the whole set breaks.\\n\\nThis Last-In, First-Out (LIFO) behavior is perfectly mirrored by the Stack data structure used to solve the Valid Parentheses problem."
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
    "story": "Imagine you are an explorer flying over an uncharted ocean dotted with islands. You have a blank map, and your job is to count exactly how many distinct islands exist.\\n\\nYou decide to parachute down onto the first piece of land you see. To ensure you don't count this island twice, you pull out a red marker and paint the ground you are standing on. Then, you walk north, south, east, and west, painting all connected landmasses red until you hit water in every direction.\\n\\nOnce the entire island is painted, you fly back up into the sky. You scan the ocean again. If you see unpainted land, you know it must be a brand new island! You parachute down and repeat the process.\\n\\nThis methodical exploration and marking of connected land is exactly how Breadth-First Search (BFS) or Depth-First Search (DFS) counts connected components in a grid."
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

module.exports = {
  AppError,
  buildUnderstandingPrompt,
  generateStage02Content,
  buildAnalogyPrompt,
  generateStage03AnalogyContent,
};
