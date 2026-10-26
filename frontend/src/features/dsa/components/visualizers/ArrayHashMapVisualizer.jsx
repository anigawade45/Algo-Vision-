import React from 'react';
import { ArrayVisualizer } from './ArrayVisualizer';
import { HashMapVisualizer } from './HashMapVisualizer';
import { extractCanonicalSolutionPair } from '../../adapters/resultNormalizer';

export function ArrayHashMapVisualizer({ problem, step, state, highlights = {} }) {
  const isSet = Boolean(
    state?.numSet ||
    problem?.id === 'longest-consecutive-sequence' ||
    problem?.problemId === 'longest-consecutive-sequence' ||
    problem?.visualizationPlan?.algorithmFamily === 'hash-set'
  );
  const hashMap = state?.numSet || state?.hashMap || state?.frequencyMap || {};
  const activeKey = state?.currentNum ?? state?.complement ?? null;
  const insertedKey = (step?.operation === 'insert_hashmap' || step?.operation === 'set_insert') ? state?.currentNum : null;
  const matchedPair = extractCanonicalSolutionPair({ step, state, highlights });
  const matchedKey = matchedPair ? state?.complement : null;

  const title = isSet
    ? 'Hash Set Elements (Stored Unique Numbers)'
    : 'HashMap Entries (Seen Value → Index)';

  return (
    <div className="space-y-6">
      {/* Top Section: Real Array Visualizer (with duplicate inline hashmap suppressed) */}
      <ArrayVisualizer
        problem={problem}
        step={step}
        state={state}
        highlights={highlights}
        showInlineHashMap={false}
      />

      {/* Bottom Section: Dedicated HashMap/Set Visualizer */}
      <HashMapVisualizer
        hashMap={hashMap}
        activeKey={activeKey}
        insertedKey={insertedKey}
        matchedKey={matchedKey}
        title={title}
        isSet={isSet}
      />
    </div>
  );
}
