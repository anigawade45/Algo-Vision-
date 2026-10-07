require('dotenv').config();
const { generateStage06CodeContent } = require('./src/services/gemini.service');

const parseJsonSafely = (rawText) => {
  if (typeof rawText !== 'string') return rawText;
  let cleaned = rawText.trim();
  
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // Fix common invalid JSON escape sequences that LLMs generate (like \')
  cleaned = cleaned.replace(/\\'/g, "'");

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Code Service] JSON parse failed on text:', rawText);
    throw new Error('AI generated invalid JSON output');
  }
};

async function test() {
  const problem = {
    _id: '6abf873fbcaa9c57d2f3c456',
    problemId: 'valid-parentheses',
    title: 'Valid Parentheses',
    objective: 'Check if all open brackets are correctly matched and closed in order.',
    constraints: []
  };
  const approachDetails = { id: 'stack', name: 'Explicit Stack Data Structure', patternName: 'Stack' };
  const pseudocodeDoc = { lines: [
    { line: 1, text: 'START' },
    { line: 2, text: 'CREATE empty stack' },
    { line: 3, text: 'FOR char in s' },
    { line: 4, text: 'IF char is open bracket' }
  ] };

  try {
    console.log("Requesting Gemini API...");
    const result = await generateStage06CodeContent(problem, approachDetails, pseudocodeDoc);
    const text = result.rawText;
    
    console.log("Attempting to parse...");
    const parsed = parseJsonSafely(text);
    console.log("PARSE SUCCESSFUL!");
  } catch (err) {
    console.error("FAILED TO PARSE OR GENERATE!");
    console.error(err);
  }
  process.exit(0);
}

test();
