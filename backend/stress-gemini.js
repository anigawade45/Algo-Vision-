require('dotenv').config();
const { generateStage06CodeContent } = require('./src/services/gemini.service');
const { parseJsonSafely } = require('./src/services/problemCode.service');

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

  for (let i = 1; i <= 5; i++) {
    console.log(`\n--- Attempt ${i} ---`);
    try {
      const result = await generateStage06CodeContent(problem, approachDetails, pseudocodeDoc);
      const text = result.rawText;
      
      try {
        const parsed = parseJsonSafely(text);
        console.log("PARSE SUCCESSFUL!");
      } catch (e) {
        console.error("FAILED TO PARSE. RAW TEXT:");
        console.error(text);
        require('fs').writeFileSync(`failed_text_${i}.txt`, text);
        console.error("Saved to failed_text_" + i + ".txt");
      }
    } catch (err) {
      console.error("API CALL FAILED:", err.message);
    }
  }
  process.exit(0);
}

test();
