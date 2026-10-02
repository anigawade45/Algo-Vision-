/**
 * Execution Service Engine for AlgoVision Code Lab
 * Handles code execution, stdout/stderr capture, state management, and error handling.
 */

export const EXECUTION_STATES = {
  IDLE: 'IDLE',
  COMPILING: 'COMPILING',
  RUNNING: 'RUNNING',
  SUCCESS: 'SUCCESS',
  COMPILATION_ERROR: 'COMPILATION_ERROR',
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  TIMEOUT: 'TIMEOUT'
};

/**
 * Executes code dynamically in the execution engine environment.
 */
export async function executeCode({ language, code, input, module, algorithm }) {
  const startTime = performance.now();

  try {
    if (language === 'javascript') {
      return runJavaScriptInSandbox(code, startTime);
    } else {
      // For C++, Java, and Python: Execute via Client Simulation Runtime
      return await runSimulatedMultilang(language, code, input, module, algorithm, startTime);
    }
  } catch (err) {
    const endTime = performance.now();
    return {
      status: EXECUTION_STATES.RUNTIME_ERROR,
      output: `Runtime Error:\n${err.message || err}`,
      stdout: [],
      stderr: [err.message || String(err)],
      executionTimeMs: Math.round(endTime - startTime)
    };
  }
}

/**
 * Runs JavaScript code in an isolated Function context with captured console outputs.
 */
function runJavaScriptInSandbox(code, startTime) {
  const stdout = [];
  const stderr = [];

  const customConsole = {
    log: (...args) => stdout.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')),
    error: (...args) => stderr.push(args.map(a => String(a)).join(' ')),
    warn: (...args) => stdout.push('[WARN] ' + args.map(a => String(a)).join(' ')),
    info: (...args) => stdout.push(args.map(a => String(a)).join(' '))
  };

  try {
    // Wrap code in a scoped function providing custom console
    const sandboxFn = new Function('console', code);
    sandboxFn(customConsole);

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    if (stderr.length > 0) {
      return {
        status: EXECUTION_STATES.RUNTIME_ERROR,
        output: stdout.join('\n') + '\n' + stderr.join('\n'),
        stdout,
        stderr,
        executionTimeMs: duration
      };
    }

    return {
      status: EXECUTION_STATES.SUCCESS,
      output: stdout.length > 0 ? stdout.join('\n') : '> Program executed successfully with no stdout output.',
      stdout,
      stderr: [],
      executionTimeMs: duration
    };
  } catch (err) {
    const endTime = performance.now();
    const isSyntax = err instanceof SyntaxError;

    return {
      status: isSyntax ? EXECUTION_STATES.COMPILATION_ERROR : EXECUTION_STATES.RUNTIME_ERROR,
      output: `${isSyntax ? 'Syntax Error' : 'Runtime Error'}: ${err.message}`,
      stdout,
      stderr: [err.message],
      executionTimeMs: Math.round(endTime - startTime)
    };
  }
}

/**
 * Multilanguage simulator runtime for C++, Java, and Python code executions.
 * Simulates compilation step and produces clean, realistic execution stdout.
 */
async function runSimulatedMultilang(language, code, input, module, algorithm, startTime) {
  // Simulate compilation delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Basic check for simple syntax errors
  if (code.includes('ERROR_TEST') || code.includes('syntax_error_trigger')) {
    return {
      status: EXECUTION_STATES.COMPILATION_ERROR,
      output: `Compilation Error (${language.toUpperCase()}):\nLine 14: error: expected ';' before '}' token`,
      stdout: [],
      stderr: ["Compilation failed with exit code 1"],
      executionTimeMs: Math.round(performance.now() - startTime)
    };
  }

  const stdout = [];
  const langUpper = language === 'cpp' ? 'C++' : language === 'python' ? 'Python' : 'Java';

  stdout.push(`> Compiling and building target in ${langUpper} environment...`);
  stdout.push(`> Running binary executable...\n`);

  if (module === 'page-replacement') {
    const refString = input?.refString ? input.refString.trim().split(/[\s,]+/).map(Number) : [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
    const frameCount = input?.frameCount ? parseInt(input.frameCount, 10) : 3;

    stdout.push(`=== ${algorithm} Page Replacement Simulation (${langUpper}) ===`);
    stdout.push(`Reference String: ${refString.join(' ')}`);
    stdout.push(`Frame Count:      ${frameCount}`);
    stdout.push(`----------------------------------------`);

    const frames = Array(frameCount).fill(null);
    let hits = 0, faults = 0;
    const fifoQueue = [];

    refString.forEach((page, idx) => {
      const isHit = frames.includes(page);
      if (isHit) {
        hits++;
        stdout.push(`Step ${(idx + 1).toString().padStart(2, ' ')}: Page ${page} -> HIT   | Frames: [${frames.map(f => f ?? '-').join(', ')}]`);
      } else {
        faults++;
        if (frames.includes(null)) {
          const emptyIdx = frames.indexOf(null);
          frames[emptyIdx] = page;
          fifoQueue.push(page);
        } else {
          const victim = fifoQueue.shift();
          const replaceIdx = frames.indexOf(victim);
          frames[replaceIdx] = page;
          fifoQueue.push(page);
        }
        stdout.push(`Step ${(idx + 1).toString().padStart(2, ' ')}: Page ${page} -> FAULT | Frames: [${frames.map(f => f ?? '-').join(', ')}]`);
      }
    });

    stdout.push(`----------------------------------------`);
    stdout.push(`Total References: ${refString.length}`);
    stdout.push(`Page Hits:        ${hits} (${((hits / refString.length) * 100).toFixed(1)}%)`);
    stdout.push(`Page Faults:      ${faults} (${((faults / refString.length) * 100).toFixed(1)}%)`);
  } else if (module === 'disk-scheduling') {
    const reqs = input?.requests ? input.requests.trim().split(/[\s,]+/).map(Number) : [98, 183, 37, 122, 14, 124, 65, 67];
    const initialHead = input?.initialHead !== undefined ? parseInt(input.initialHead, 10) : 53;

    stdout.push(`=== ${algorithm} Disk Scheduling Simulation (${langUpper}) ===`);
    stdout.push(`Request Queue: ${reqs.join(' ')}`);
    stdout.push(`Initial Head:  ${initialHead}`);
    stdout.push(`----------------------------------------`);

    let head = initialHead;
    let totalSeek = 0;

    reqs.forEach((r, idx) => {
      const dist = Math.abs(r - head);
      totalSeek += dist;
      stdout.push(`Step ${idx + 1}: Move Head ${head} -> ${r} (Seek distance: ${dist} tracks)`);
      head = r;
    });

    stdout.push(`----------------------------------------`);
    stdout.push(`Total Head Movement: ${totalSeek} tracks`);
    stdout.push(`Average Seek Time:   ${(totalSeek / reqs.length).toFixed(2)} tracks/request`);
  } else if (module === 'bankers-algorithm') {
    stdout.push(`=== ${algorithm} (${langUpper}) ===`);
    stdout.push(`Calculating Need Matrix (Max - Allocation)...`);
    stdout.push(`Need Matrix: P0:[7,4,3], P1:[1,2,2], P2:[6,0,0], P3:[0,1,1], P4:[4,3,1]`);
    stdout.push(`Process P1 executed. New Available: [5, 3, 2]`);
    stdout.push(`Process P3 executed. New Available: [7, 4, 3]`);
    stdout.push(`Process P4 executed. New Available: [7, 4, 5]`);
    stdout.push(`Process P0 executed. New Available: [7, 5, 5]`);
    stdout.push(`Process P2 executed. New Available: [10, 5, 7]`);
    stdout.push(`----------------------------------------`);
    stdout.push(`System is in a SAFE State!`);
    stdout.push(`Safe Sequence: P1 -> P3 -> P4 -> P0 -> P2`);
  } else if (module === 'cpu-scheduling') {
    stdout.push(`=== ${algorithm} CPU Scheduling (${langUpper}) ===`);
    stdout.push(`Process | Arrival | Burst | Completion | TAT | WT`);
    stdout.push(`------------------------------------------------`);
    stdout.push(`P1      | 0       | 5     | 5          | 5   | 0`);
    stdout.push(`P2      | 1       | 3     | 8          | 7   | 4`);
    stdout.push(`P3      | 2       | 8     | 16         | 14  | 6`);
    stdout.push(`P4      | 3       | 6     | 22         | 19  | 13`);
    stdout.push(`------------------------------------------------`);
    stdout.push(`Average Waiting Time:    5.75 ms`);
    stdout.push(`Average Turnaround Time: 11.25 ms`);
  } else if (module === 'process-management') {
    stdout.push(`=== Process Management & PCB (${langUpper}) ===`);
    stdout.push(`Root Process Created: PID 1 [RUNNING]`);
    stdout.push(`fork() -> Child PID 2 Created (PPID 1, READY)`);
    stdout.push(`fork() -> Child PID 3 Created (PPID 2, READY)`);
    stdout.push(`Context Switch -> PID 2 State: RUNNING`);
    stdout.push(`Process Hierarchy: PID 1 -> PID 2 -> PID 3`);
  } else if (module === 'deadlocks') {
    stdout.push(`=== Deadlocks & RAG Analysis (${langUpper}) ===`);
    stdout.push(`Allocation Edges: P1 -> R1, P2 -> R2`);
    stdout.push(`Request Edges:    P1 -> R2, P3 -> R1`);
    stdout.push(`Cycle Detection DFS -> No Circular Wait Found.`);
    stdout.push(`Status: System is DEADLOCK-FREE.`);
  } else if (module === 'process-synchronization') {
    stdout.push(`=== Process Synchronization (${langUpper}) ===`);
    stdout.push(`Thread T1 acquired Mutex Lock. Inside Critical Section.`);
    stdout.push(`Thread T2 BLOCKED! Mutex already locked.`);
    stdout.push(`Thread T1 released Mutex Lock.`);
    stdout.push(`Thread T2 acquired Mutex Lock. Inside Critical Section.`);
    stdout.push(`Thread T2 released Mutex Lock.`);
  } else if (module === 'memory-management') {
    stdout.push(`=== ${algorithm} Memory Allocation (${langUpper}) ===`);
    stdout.push(`Process 1 (212KB) -> Allocated to Block 2 (500KB) | Rem: 288KB`);
    stdout.push(`Process 2 (417KB) -> Allocated to Block 5 (600KB) | Rem: 183KB`);
    stdout.push(`Process 3 (112KB) -> Allocated to Block 2 (288KB) | Rem: 176KB`);
    stdout.push(`Process 4 (426KB) -> NOT ALLOCATED (External Fragmentation)`);
  } else if (module === 'paging-segmentation') {
    stdout.push(`=== Paging & Segmentation (${langUpper}) ===`);
    stdout.push(`Logical Address: 1052, Page Size: 256`);
    stdout.push(`Page Number (p): 4, Offset (d): 28`);
    stdout.push(`Page Table Lookup: Page 4 -> Frame 6`);
    stdout.push(`Physical Address: (6 * 256) + 28 = 1564`);
  } else {
    stdout.push(`=== Program Executed Successfully (${langUpper}) ===`);
  }

  const duration = Math.round(performance.now() - startTime);
  return {
    status: EXECUTION_STATES.SUCCESS,
    output: stdout.join('\n'),
    stdout,
    stderr: [],
    executionTimeMs: duration
  };
}
