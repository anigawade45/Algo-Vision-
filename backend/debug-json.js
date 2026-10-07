const fs = require('fs');
const text = fs.readFileSync('failed_text_1.txt', 'utf8');
const firstBrace = text.indexOf('{');
const lastBrace = text.lastIndexOf('}');
let cleaned = text.substring(firstBrace, lastBrace + 1);
cleaned = cleaned.replace(/\\'/g, "'");

try {
  JSON.parse(cleaned);
  console.log('SUCCESS');
} catch (e) {
  console.error('ERROR:', e.message);
  
  // Let's find exactly where it failed by slicing around the error position
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1], 10);
    console.log("Context around error:");
    console.log(cleaned.substring(Math.max(0, pos - 20), Math.min(cleaned.length, pos + 20)));
  }
}
