/**
 * Stage 04 - Pattern Data for Two Sum
 * Teaches structural pattern recognition without revealing algorithms, data structures, or code.
 */
export const twoSumPattern = {
  problemId: 'two-sum',
  intro: {
    eyebrow: '04 · PATTERN',
    title: 'Recognize the structure behind the problem.',
    subtitle: 'Before choosing an algorithm, identify the shape of the problem.',
  },

  structure: {
    title: 'Look at what the problem is asking.',
    subtitle: 'Shift attention from individual elements to the relationship between elements.',
    inputLabel: 'ARRAY',
    inputVisual: ['[ 2 ]', '[ 7 ]', '[ 11 ]', '[ 15 ]'],
    targetLabel: 'TARGET',
    targetValue: '9',
    coreRelationship: [
      { label: 'Two values', sub: 'Input elements in array' },
      { label: 'Must satisfy', sub: 'Required relation' },
      { label: 'Target condition', sub: 'Sum equals 9' },
    ],
  },

  signals: {
    title: 'What stands out?',
    subtitle: 'Identify key structural signals from the problem description.',
    observations: [
      {
        id: 'signal_1',
        title: 'SIGNAL 01',
        label: 'More than one value must work together.',
        detail: 'The objective requires selecting a pair of elements, not evaluating a single item in isolation.',
      },
      {
        id: 'signal_2',
        title: 'SIGNAL 02',
        label: 'The values are connected by a condition.',
        detail: 'The two selected items cannot be arbitrary; their mathematical relationship defines validity.',
      },
      {
        id: 'signal_3',
        title: 'SIGNAL 03',
        label: 'The target defines the required relationship.',
        detail: 'The target value sets an exact constraint (Value A + Value B = Target) that the pair must satisfy.',
      },
      {
        id: 'signal_4',
        title: 'SIGNAL 04',
        label: 'The answer depends on a pair of values.',
        detail: 'Output requires identifying the exact indices/positions corresponding to the valid pair.',
      },
    ],
  },

  abstraction: {
    title: 'Abstract the problem.',
    subtitle: 'Specific numbers are no longer important. What matters is the relationship.',
    concrete: {
      items: ['2', '7', '11', '15'],
      target: '9',
    },
    abstractFormula: {
      varA: 'VALUE A',
      operator: '+',
      varB: 'VALUE B',
      equals: '=',
      result: 'TARGET',
    },
    statement: 'When specific values disappear, the relationship remains intact.',
  },

  pattern: {
    name: 'Pair / Relationship Pattern',
    tagline: 'Identify two values whose relationship satisfies a required target condition.',
    description: 'When a problem asks you to find two values that satisfy a relationship or condition, you are looking at a pair/relationship structure.',
  },

  fingerprint: {
    title: 'Pattern Fingerprint',
    steps: [
      { stage: 'INPUT', value: 'Array / Collection of elements' },
      { stage: 'RELATIONSHIP', value: 'Two values working together' },
      { stage: 'CONDITION', value: 'Sum / Relation equals Target' },
      { stage: 'OUTPUT', value: 'Required pair / indices' },
    ],
  },

  solutionFamilies: {
    title: 'Solution Families',
    subtitle: 'What approaches should come to mind for this pattern?',
    question: 'Which tools or solution families are commonly associated with Pair / Relationship problems?',
    families: [
      {
        id: 'fam_1',
        name: 'HashMap / Hashing',
        detail: 'Fast lookup of element pairs or complements.',
      },
      {
        id: 'fam_2',
        name: 'Brute-force Pair Checking',
        detail: 'Iterating over candidate element pairs.',
      },
    ],
    note: 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose and how it works.',
  },

  limitations: {
    title: 'What the Pattern Does NOT Tell Us',
    subtitle: 'Recognizing a pattern does not tell us the algorithm yet.',
    tellsUs: [
      'What structure to look for',
      'What relationships matter',
      'What signals identify the problem',
    ],
    doesNotTellUs: [
      'Which data structure to use',
      'Which traversal to perform',
      'Which optimization to use',
      'Exact implementation steps',
    ],
  },

  recognitionCheck: {
    question: 'Which description best matches the structural pattern of Two Sum?',
    options: [
      {
        id: 'opt_a',
        text: 'Find a single value that satisfies a condition.',
        isCorrect: false,
        feedback: 'Incorrect. Two Sum requires evaluating a pair of values working together, not a single element.',
      },
      {
        id: 'opt_b',
        text: 'Find two values whose relationship satisfies a target.',
        isCorrect: true,
        feedback: 'Correct! The problem is defined by a pair of values satisfying a specified relationship.',
      },
      {
        id: 'opt_c',
        text: 'Traverse every value in a fixed sequential order.',
        isCorrect: false,
        feedback: 'Incorrect. Sequential traversal describes an execution step (algorithm), not the core structural pattern.',
      },
    ],
  },

  takeaway: {
    specificProblem: 'Find two values that sum to 9.',
    generalPattern: 'Find two values that satisfy a required relationship.',
    finalStatement: 'The numbers changed, but the structure stayed the same. When a problem is defined by a relationship between multiple values, look for the relationship before thinking about the algorithm.',
  },
};

export default twoSumPattern;
