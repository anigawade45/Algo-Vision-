import React from 'react';
import { ArrayVisualizer } from './ArrayVisualizer';
import { HashMapVisualizer } from './HashMapVisualizer';

export function ArrayHashMapVisualizer({ problem, step, state, highlights = {} }) {
  const hashMap = state?.hashMap || {};
  const activeKey = state?.complement ?? null;
  const insertedKey = step?.operation === 'insert_hashmap' ? state?.currentNum : null;
  const matchedKey = highlights?.matchedPair ? state?.complement : null;

  return (
    <div className="space-y-6">
      {/* Top Section: Real Array Visualizer */}
      <ArrayVisualizer
        problem={problem}
        step={step}
        state={state}
        highlights={highlights}
      />

      {/* Bottom Section: Dedicated HashMap Visualizer */}
      <HashMapVisualizer
        hashMap={hashMap}
        activeKey={activeKey}
        insertedKey={insertedKey}
        matchedKey={matchedKey}
        title="HashMap Entries (Seen Value → Index)"
      />
    </div>
  );
}
