/**
 * Stage 03 — Analogy Data for Two Sum
 * 
 * Strict Scope Boundary:
 * - REAL WORLD idea ONLY.
 * - NO HashMap, complement lookup, time/space complexity, or code algorithms.
 * - Pure data-driven representation.
 */

export const twoSumAnalogy = {
  problemId: 'two-sum',
  problemTitle: 'Two Sum',
  intro: {
    tag: '03 · ANALOGY',
    subtitle: 'Sometimes a familiar situation makes the structure of a problem easier to see.',
  },
  scenario: {
    title: 'Imagine you are shopping.',
    context: 'You have a target shopping budget of ₹9 and a list of available items with different prices.',
    question: 'Can you find two items that add up to ₹9?',
    target: {
      label: 'TARGET BUDGET',
      unit: '₹',
      value: 9,
      display: '₹9',
    },
    items: [
      { id: 'item_1', label: 'Item A', priceDisplay: '₹2', value: 2, arrayIndex: 0 },
      { id: 'item_2', label: 'Item B', priceDisplay: '₹7', value: 7, arrayIndex: 1 },
      { id: 'item_3', label: 'Item C', priceDisplay: '₹11', value: 11, arrayIndex: 2 },
      { id: 'item_4', label: 'Item D', priceDisplay: '₹15', value: 15, arrayIndex: 3 },
    ],
  },
  interaction: {
    type: 'pair_sum',
    requiredCount: 2,
    targetValue: 9,
    correctPairIds: ['item_1', 'item_2'],
    successMessage: 'You just found two values that satisfy a target.',
    bridgeMessage: 'That is exactly what the Two Sum problem asks.',
    hint: 'Click or tap any two item cards to check their combined total against the target budget.',
  },
  dsaConnection: {
    title: 'Connecting Real World to DSA',
    arrayLabel: 'ARRAY',
    arrayValues: [2, 7, 11, 15],
    targetLabel: 'TARGET',
    targetValue: 9,
    question: 'Find two values whose sum is 9.',
    formulaRealWorld: '₹2 + ₹7 = ₹9',
    formulaDSA: '2 + 7 = 9',
    matchingIndices: [0, 1],
  },
  mapping: [
    { id: 'm1', realWorld: 'Item price', dsa: 'Array value', example: '₹2 → 2' },
    { id: 'm2', realWorld: 'Shopping list', dsa: 'Array', example: '[₹2, ₹7, ₹11, ₹15] → [2, 7, 11, 15]' },
    { id: 'm3', realWorld: 'Budget', dsa: 'Target', example: '₹9 → 9' },
    { id: 'm4', realWorld: 'Two items', dsa: 'Two values', example: 'Item A + Item B → Index 0 + Index 1' },
  ],
  takeaway: {
    headline: 'The story changed, but the relationship stayed the same.',
    realWorldSummary: 'Two item prices + Target = Required total',
    dsaSummary: 'Two array values + Target = Required sum',
    finalNote: 'Analogy connects an abstract numerical condition to a familiar real-world decision.',
  },
};

export default twoSumAnalogy;
