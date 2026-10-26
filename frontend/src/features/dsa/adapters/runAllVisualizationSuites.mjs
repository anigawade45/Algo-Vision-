import { runVisualizationEventTests } from '../events/visualizationEvent.test.js';
import { runExecutionTraceTests } from '../trace/executionTrace.test.js';
import { runDryRunAdapterTests } from './dryRunTraceAdapter.test.js';
import { runDirectTestCaseAdapterTests } from './testCaseInputAdapter.test.js';
import { runVisualizationPlaybackTests } from './visualizationPlayback.test.mjs';
import { runGenericD3VisualizationTests } from './genericD3Visualization.test.mjs';

console.log('===============================================================');
console.log('AlgoVision — All Visualization Test Suites (Phases 11-13 & Stage 09)');
console.log('===============================================================\n');

function runSuite(name, runner) {
  console.log(`--- [SUITE] ${name} ---`);
  const res = runner();
  let passed = 0;
  let total = 0;

  // Support both object results and { allPassed, results }
  if (res.results && Array.isArray(res.results)) {
    total = res.results.length;
    passed = res.results.filter((r) => r.pass).length;
    res.results.forEach((r) => {
      const icon = r.pass ? '✅' : '❌';
      console.log(`  ${icon} [${r.pass ? 'PASS' : 'FAIL'}] ${r.name}`);
    });
  } else {
    for (const [k, v] of Object.entries(res)) {
      total++;
      const icon = v === 'PASS' ? '✅' : '❌';
      if (v === 'PASS') passed++;
      console.log(`  ${icon} [${v}] ${k}`);
    }
  }
  console.log(`  Result: ${passed}/${total} passed\n`);
  return { passed, total };
}

const s1 = runSuite('Phase 11: Visualization Events & Replay', runVisualizationEventTests);
const s2 = runSuite('Phase 12: Execution Trace Validator & Replay', runExecutionTraceTests);
const s3 = runSuite('Phase 13: Dry Run -> Trace Adapter', runDryRunAdapterTests);
const s4 = runSuite('Stage 09: Direct Test-Case Visualization', runDirectTestCaseAdapterTests);
const s5 = runSuite('Stage 09: Visualization Playback & Controls Engine', runVisualizationPlaybackTests);
const s6 = runSuite('Stage 09: Generic D3 Visualization & Replay Integration', runGenericD3VisualizationTests);

const totalPassed = s1.passed + s2.passed + s3.passed + s4.passed + s5.passed + s6.passed;
const totalTests = s1.total + s2.total + s3.total + s4.total + s5.total + s6.total;

console.log('===============================================================');
console.log(`GRAND TOTAL: ${totalPassed} / ${totalTests} tests passed (${Math.round((totalPassed / totalTests) * 100)}%)`);
console.log('===============================================================\n');

if (totalPassed !== totalTests) {
  process.exit(1);
} else {
  console.log('ALL SUITES PASSED CLEANLY! No regressions detected.\n');
}
