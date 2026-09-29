import { twoSumAnalogy, getAnalogyForProblem, MOCK_ANALOGIES } from '../src/features/dsa/data/analogy/index.js';

console.log('Testing Stage 03 Analogy Data Architecture...');

// 1. Test Two Sum Analogy Data
console.assert(twoSumAnalogy.problemId === 'two-sum', 'twoSumAnalogy problemId should be two-sum');
console.assert(twoSumAnalogy.scenario.target.value === 9, 'Two sum target budget should be 9');
console.assert(twoSumAnalogy.scenario.items.length === 4, 'Two sum should have 4 items');

console.log('✓ Two Sum Analogy Data verified.');

// 2. Test Cross-Problem Analogy Access for all 10 mock problems
const problemIds = [
  'two-sum',
  'valid-parentheses',
  'reverse-linked-list',
  'binary-tree-inorder',
  'number-of-islands',
  'kth-largest-element',
  'sliding-window-maximum',
  'merge-intervals',
  'longest-substring-no-repeat',
  'shortest-path-graph',
];

for (const pid of problemIds) {
  const data = getAnalogyForProblem(pid);
  console.assert(data && data.scenario && data.interaction && data.dsaConnection && data.takeaway, `Analogy data missing required fields for ${pid}`);
  console.log(`  ✓ Problem [${pid}] analogy schema verified (${data.scenario.items.length} items)`);
}

console.log('✓ All 10 problem analogy schemas verified successfully.');
