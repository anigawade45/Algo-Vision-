/**
 * Stage 06 - Pseudocode Data for Kth Largest Element (Min-Heap Approach)
 * Translates the selected algorithm into language-independent, step-by-step logic.
 */
export const kthLargestPseudocode = {
  problemId: 'kth-largest-element',
  approachId: 'minHeap',
  approachName: 'Min-Heap',
  approachContext: 'This is the approach selected in Stage 05.',
  intro: {
    eyebrow: '06 · PSEUDOCODE',
    title: 'Turn the chosen algorithm into clear, step-by-step logic.',
    subtitle: 'Before writing code, describe exactly what the algorithm needs to do.',
  },
  context: {
    title: 'Kth Largest Element in an Array',
    inputFormat: 'nums = Array[int], k = int',
    inputVisual: 'nums = [ 3, 2, 1, 5, 6, 4 ], k = 2',
    kValue: 'K = 2',
    goal: 'Find the 2nd largest value in the array.',
  },
  stepOverview: [
    { stepNo: '01', title: 'Initialize', description: 'Create an empty min-heap.' },
    { stepNo: '02', title: 'Process values', description: 'Iterate over each value in the array.' },
    { stepNo: '03', title: 'Add value', description: 'Insert the current value into the heap.' },
    { stepNo: '04', title: 'Maintain K values', description: 'If heap size exceeds K, remove the smallest value.' },
    { stepNo: '05', title: 'Return result', description: 'Return the smallest value remaining in the heap.' },
  ],
  lines: [
    { line: 1, type: 'start', text: 'START', explanation: 'Algorithm execution begins.' },
    { line: 2, type: 'instruction', text: 'Create an empty min-heap.', explanation: 'Initialize a min-heap structure to hold our top K candidate values.' },
    { line: 3, type: 'loop', text: 'FOR each value in the array:', explanation: 'Iterate sequentially through every number in the input list.' },
    { line: 4, type: 'instruction', indent: true, indentLevel: 1, text: 'Add the value to the heap.', explanation: 'Insert the current number into the min-heap.' },
    { line: 5, type: 'condition', indent: true, indentLevel: 1, text: 'IF the heap contains more than K values:', explanation: 'Check if the heap has grown larger than K elements.' },
    { line: 6, type: 'instruction', indent: true, indentLevel: 2, text: 'Remove the smallest value.', explanation: 'Evict the minimum value so only the largest K values remain in the heap.' },
    { line: 7, type: 'return', text: 'RETURN the smallest value in the heap.', explanation: 'In a min-heap of size K, the root holds the smallest of the K largest elements (the Kth largest overall).' },
    { line: 8, type: 'end', text: 'END', explanation: 'Algorithm execution finishes.' },
  ],
  walkthrough: [
    {
      stepNo: '01',
      action: 'Create an empty min-heap.',
      why: 'We need a data structure that automatically maintains candidate values and allows instant access to the smallest among them.',
    },
    {
      stepNo: '02',
      action: 'Process each array value.',
      why: 'Every element in the array must be considered to determine the top K largest values.',
    },
    {
      stepNo: '03',
      action: 'Add the value to the heap.',
      why: 'Adding the value places it into our active set of candidate numbers.',
    },
    {
      stepNo: '04',
      action: 'If the heap contains more than K values, remove the smallest value.',
      why: 'Discarding the smallest value whenever size exceeds K guarantees that only the K largest elements remain.',
    },
    {
      stepNo: '05',
      action: 'Return the smallest value in the heap.',
      why: 'The root of a min-heap containing the K largest items is precisely the Kth largest element in the original array.',
    },
  ],
  decisions: [
    {
      condition: 'Does the heap contain more than K values?',
      yes: 'Remove the smallest value from the heap.',
      no: 'Continue processing the next array element.',
    },
  ],
  takeaway: {
    statement: 'Your algorithm is now expressed as language-independent steps.',
    subtitle: 'The algorithm defines the approach. Pseudocode turns that approach into precise, language-independent steps. The next stage translates those steps into code.',
  },
};

export default kthLargestPseudocode;
