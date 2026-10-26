/**
 * Page Replacement Algorithms Simulation Utility
 * Supports FIFO, LRU, Optimal, and Second Chance (Clock) algorithms.
 * Returns step-by-step state trace objects driving the interactive visualizer.
 */

/**
 * Parses and validates raw input string into an array of integer page references.
 */
export function parseReferenceString(input) {
  if (!input || typeof input !== 'string') return [];
  // Split by whitespace or commas
  const rawTokens = input.trim().split(/[\s,]+/);
  const parsed = [];
  for (const token of rawTokens) {
    if (token === '') continue;
    const num = parseInt(token, 10);
    if (!isNaN(num) && num >= 0 && num <= 99) {
      parsed.push(num);
    }
  }
  return parsed;
}

/**
 * FIFO (First-In, First-Out) Algorithm Simulation
 */
export function simulateFIFO(refString, frameCount) {
  const frames = Array(frameCount).fill(null);
  const fifoQueue = []; // Tracks order of page insertions
  const steps = [];
  let hits = 0;
  let faults = 0;

  refString.forEach((page, idx) => {
    const isHit = frames.includes(page);
    let replacedPage = null;
    let targetFrameIndex;
    let explanation;

    if (isHit) {
      hits++;
      targetFrameIndex = frames.indexOf(page);
      explanation = `Page ${page} is already in Frame ${targetFrameIndex + 1}. Page Hit! No replacement needed. FIFO arrival queue remains [${fifoQueue.join(', ')}].`;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        targetFrameIndex = emptyIdx;
        fifoQueue.push(page);
        explanation = `Page ${page} not in memory. Page Fault! Allocated to free Frame ${emptyIdx + 1}. FIFO arrival order: [${fifoQueue.join(', ')}].`;
      } else {
        replacedPage = fifoQueue.shift();
        targetFrameIndex = frames.indexOf(replacedPage);
        frames[targetFrameIndex] = page;
        fifoQueue.push(page);
        explanation = `Page ${page} not in memory. Page Fault! All frames occupied. FIFO victim: Page ${replacedPage} (entered earliest). Replaced in Frame ${targetFrameIndex + 1}. New FIFO queue: [${fifoQueue.join(', ')}].`;
      }
    }

    steps.push({
      stepNum: idx + 1,
      page,
      frames: [...frames],
      result: isHit ? 'HIT' : 'FAULT',
      replacedPage,
      frameIndexReplaced: targetFrameIndex,
      hits,
      faults,
      explanation,
      fifoQueue: [...fifoQueue]
    });
  });

  return { algorithm: 'FIFO', steps, hits, faults, total: refString.length };
}

/**
 * LRU (Least Recently Used) Algorithm Simulation
 */
export function simulateLRU(refString, frameCount) {
  const frames = Array(frameCount).fill(null);
  const lastUsed = {}; // Page -> step index of last access
  const steps = [];
  let hits = 0;
  let faults = 0;

  refString.forEach((page, idx) => {
    const isHit = frames.includes(page);
    let replacedPage = null;
    let targetFrameIndex;
    let explanation;

    if (isHit) {
      hits++;
      targetFrameIndex = frames.indexOf(page);
      const prevStep = lastUsed[page];
      lastUsed[page] = idx;
      explanation = `Page ${page} found in Frame ${targetFrameIndex + 1}. Page Hit! Updated recency timestamp from step ${prevStep + 1} to step ${idx + 1}.`;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        targetFrameIndex = emptyIdx;
        lastUsed[page] = idx;
        explanation = `Page ${page} not in memory. Page Fault! Loaded into empty Frame ${emptyIdx + 1}. Recency set to step ${idx + 1}.`;
      } else {
        let lruPage = frames[0];
        let minTime = lastUsed[lruPage];
        frames.forEach((p) => {
          if (lastUsed[p] < minTime) {
            minTime = lastUsed[p];
            lruPage = p;
          }
        });

        replacedPage = lruPage;
        targetFrameIndex = frames.indexOf(replacedPage);
        frames[targetFrameIndex] = page;
        lastUsed[page] = idx;
        delete lastUsed[replacedPage];

        explanation = `Page ${page} not in memory. Page Fault! All frames occupied. LRU victim: Page ${replacedPage} (last referenced at step ${minTime + 1}, ${idx - minTime} steps ago). Replaced in Frame ${targetFrameIndex + 1}.`;
      }
    }

    steps.push({
      stepNum: idx + 1,
      page,
      frames: [...frames],
      result: isHit ? 'HIT' : 'FAULT',
      replacedPage,
      frameIndexReplaced: targetFrameIndex,
      hits,
      faults,
      explanation,
      recencyMap: { ...lastUsed }
    });
  });

  return { algorithm: 'LRU', steps, hits, faults, total: refString.length };
}

/**
 * Optimal Algorithm Simulation
 */
export function simulateOptimal(refString, frameCount) {
  const frames = Array(frameCount).fill(null);
  const steps = [];
  let hits = 0;
  let faults = 0;

  refString.forEach((page, idx) => {
    const isHit = frames.includes(page);
    let replacedPage = null;
    let targetFrameIndex;
    let explanation;
    const futureDistances = {};

    if (isHit) {
      hits++;
      targetFrameIndex = frames.indexOf(page);
      explanation = `Page ${page} found in Frame ${targetFrameIndex + 1}. Page Hit! Optimal algorithm retains current frame layout.`;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        targetFrameIndex = emptyIdx;
        explanation = `Page ${page} not in memory. Page Fault! Loaded into empty Frame ${emptyIdx + 1}.`;
      } else {
        const futureSlice = refString.slice(idx + 1);
        let farthestDist = -1;
        let victim = frames[0];

        frames.forEach((p) => {
          const nextPos = futureSlice.indexOf(p);
          if (nextPos === -1) {
            futureDistances[p] = Infinity;
          } else {
            futureDistances[p] = nextPos + 1;
          }
        });

        frames.forEach((p) => {
          const dist = futureDistances[p];
          if (dist > farthestDist) {
            farthestDist = dist;
            victim = p;
          }
        });

        replacedPage = victim;
        targetFrameIndex = frames.indexOf(replacedPage);
        frames[targetFrameIndex] = page;

        const distStr = farthestDist === Infinity ? 'never used again' : `farthest in future (${farthestDist} steps away)`;
        explanation = `Page ${page} not in memory. Page Fault! Optimal algorithm inspected future references. Victim: Page ${replacedPage} (${distStr}). Replaced in Frame ${targetFrameIndex + 1}.`;
      }
    }

    steps.push({
      stepNum: idx + 1,
      page,
      frames: [...frames],
      result: isHit ? 'HIT' : 'FAULT',
      replacedPage,
      frameIndexReplaced: targetFrameIndex,
      hits,
      faults,
      explanation,
      futureDistances: { ...futureDistances }
    });
  });

  return { algorithm: 'Optimal', steps, hits, faults, total: refString.length };
}

/**
 * Second Chance (Clock) Algorithm Simulation
 */
export function simulateSecondChance(refString, frameCount) {
  const frames = Array(frameCount).fill(null);
  const bits = Array(frameCount).fill(0);
  let pointer = 0; // Clock hand index
  const steps = [];
  let hits = 0;
  let faults = 0;

  refString.forEach((page, idx) => {
    const isHit = frames.includes(page);
    let replacedPage = null;
    let targetFrameIndex;
    let explanation;
    const secondChanceLog = [];

    if (isHit) {
      hits++;
      const hitIndex = frames.indexOf(page);
      bits[hitIndex] = 1; // Set reference bit to 1 on hit
      targetFrameIndex = hitIndex;
      explanation = `Page ${page} found in Frame ${hitIndex + 1}. Page Hit! Reference bit set to 1. Pointer stays at Frame ${pointer + 1}.`;
    } else {
      faults++;
      const emptyIdx = frames.indexOf(null);
      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        bits[emptyIdx] = 1;
        targetFrameIndex = emptyIdx;
        pointer = (emptyIdx + 1) % frameCount;
        explanation = `Page ${page} not in memory. Page Fault! Loaded into empty Frame ${emptyIdx + 1} with Ref Bit = 1. Clock pointer moved to Frame ${pointer + 1}.`;
      } else {
        while (true) {
          if (bits[pointer] === 1) {
            secondChanceLog.push(`Frame ${pointer + 1} (Page ${frames[pointer]}): Bit=1 -> Second chance granted! Reset Bit=0.`);
            bits[pointer] = 0;
            pointer = (pointer + 1) % frameCount;
          } else {
            replacedPage = frames[pointer];
            targetFrameIndex = pointer;
            frames[pointer] = page;
            bits[pointer] = 1; // New page gets reference bit 1
            secondChanceLog.push(`Frame ${pointer + 1} (Page ${replacedPage}): Bit=0 -> Selected as Victim! Replaced with Page ${page}.`);
            pointer = (pointer + 1) % frameCount;
            break;
          }
        }

        explanation = `Page ${page} not in memory. Page Fault! Clock sweep: ${secondChanceLog.join(' ')} Pointer advanced to Frame ${pointer + 1}.`;
      }
    }

    steps.push({
      stepNum: idx + 1,
      page,
      frames: [...frames],
      refBits: [...bits],
      pointer,
      result: isHit ? 'HIT' : 'FAULT',
      replacedPage,
      frameIndexReplaced: targetFrameIndex,
      hits,
      faults,
      explanation,
      secondChanceLog
    });
  });

  return { algorithm: 'Second Chance', steps, hits, faults, total: refString.length };
}

/**
 * Runner function for executing a selected algorithm name
 */
export function runSimulation(algoName, refString, frameCount) {
  switch (algoName.toUpperCase()) {
    case 'FIFO':
      return simulateFIFO(refString, frameCount);
    case 'LRU':
      return simulateLRU(refString, frameCount);
    case 'OPTIMAL':
      return simulateOptimal(refString, frameCount);
    case 'SECOND CHANCE':
    case 'SECONDCHANCE':
    case 'CLOCK':
      return simulateSecondChance(refString, frameCount);
    default:
      return simulateFIFO(refString, frameCount);
  }
}
