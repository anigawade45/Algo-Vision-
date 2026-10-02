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

  // Model fallback queue using verified Google Gemini API production models
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
        console.log(`[Gemini Service] Calling Gemini API (Model: ${model}, Attempt: ${attempts}) for problem: "${problem.title}"`);

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

          // Retry on 503 (high demand) or 429 (rate limit)
          if ((res.status === 503 || res.status === 429) && attempts < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 1500 * attempts));
            continue;
          }

          // If persistent 503 or 429 or invalid model, break out of attempt loop to try next fallback model
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

  // If all candidate models failed, throw the last error or friendly message
  throw (
    lastError ||
    new AppError('Gemini AI models are currently experiencing high demand. Please try again in a few moments.', 503)
  );
};

module.exports = {
  AppError,
  buildUnderstandingPrompt,
  generateStage02Content,
};
