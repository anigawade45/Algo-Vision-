/**
 * CPU Scheduling Algorithm Simulations
 * Supports: FCFS, SJF, SRTF, Priority (Non-preemptive & Preemptive), Round Robin (RR), Multilevel Queue (MLQ)
 */

import { runFcfsSimulation } from './fcfsSimulation';

/**
 * Deep copy and standardize input processes
 */
function prepareProcesses(inputProcesses) {
  if (!inputProcesses || inputProcesses.length === 0) return [];
  return inputProcesses.map((p, idx) => ({
    id: p.id,
    arrivalTime: Math.max(0, Number(p.arrivalTime) || 0),
    burstTime: Math.max(1, Number(p.burstTime) || 1),
    priority: Math.max(0, Number(p.priority) || 0),
    inputIndex: idx,
    remainingTime: Math.max(1, Number(p.burstTime) || 1),
    startTime: -1,
    completionTime: -1,
    turnaroundTime: -1,
    waitingTime: -1,
    responseTime: -1,
    isCompleted: false
  }));
}

/**
 * Calculates metrics and builds step timeline from raw execution log
 */
function buildSimulationResult(originalProcesses, timeline, stepsLog) {
  const processes = originalProcesses.map(p => ({ ...p }));
  const totalTime = timeline.length > 0 ? timeline[timeline.length - 1].end : 0;

  const totalWT = processes.reduce((sum, p) => sum + (p.waitingTime >= 0 ? p.waitingTime : 0), 0);
  const totalTAT = processes.reduce((sum, p) => sum + (p.turnaroundTime >= 0 ? p.turnaroundTime : 0), 0);
  const totalRT = processes.reduce((sum, p) => sum + (p.responseTime >= 0 ? p.responseTime : 0), 0);
  const totalBusyTime = processes.reduce((sum, p) => sum + p.burstTime, 0);

  const count = processes.length || 1;
  const avgWaitingTime = Number((totalWT / count).toFixed(2));
  const avgTurnaroundTime = Number((totalTAT / count).toFixed(2));
  const avgResponseTime = Number((totalRT / count).toFixed(2));
  const cpuUtilization = totalTime > 0 ? Number(((totalBusyTime / totalTime) * 100).toFixed(2)) : 0;

  const metrics = {
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    totalTime
  };

  return {
    processes,
    timeline,
    steps: stepsLog,
    metrics
  };
}

/**
 * ----------------------------------------------------
 * 1. Shortest Job First (SJF) - Non-Preemptive
 * ----------------------------------------------------
 */
export function runSjfSimulation(inputProcesses) {
  const processes = prepareProcesses(inputProcesses);
  if (processes.length === 0) return buildSimulationResult([], [], []);

  let currentTime = 0;
  const timeline = [];
  const completed = [];
  const readyQueue = [];
  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);
  const stepsLog = [];

  const processesState = {};
  processes.forEach(p => { processesState[p.id] = 'NOT_ARRIVED'; });

  let stepIdx = 1;

  function pushStep(time, type, pId, currentCpu, queueList, explanation, whyReason) {
    const ganttBlocks = timeline
      .filter(b => b.start < time)
      .map(b => ({
        processId: b.processId,
        start: b.start,
        end: Math.min(b.end, time),
        isIdle: b.isIdle,
        isActive: b.start <= time && b.end >= time && !b.isIdle
      }));

    stepsLog.push({
      stepIndex: stepIdx++,
      time,
      eventType: type,
      eventProcessId: pId,
      cpu: currentCpu ? { ...currentCpu } : null,
      readyQueue: queueList.map(q => ({ ...q })),
      completed: completed.map(c => ({ ...c })),
      processesState: { ...processesState },
      ganttBlocks,
      explanation,
      whyReason
    });
  }

  while (completed.length < processes.length) {
    // Add processes that arrived up to currentTime
    while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
      const arrived = remaining.shift();
      readyQueue.push(arrived);
      processesState[arrived.id] = 'READY';
      pushStep(
        arrived.arrivalTime,
        'arrival',
        arrived.id,
        null,
        readyQueue,
        `At time ${arrived.arrivalTime}, process ${arrived.id} arrives and enters the Ready Queue.`,
        `${arrived.id} arrived (Burst Time = ${arrived.burstTime}).`
      );
    }

    if (readyQueue.length === 0 && remaining.length > 0) {
      // CPU Idle
      const nextArrival = remaining[0].arrivalTime;
      timeline.push({ processId: 'IDLE', start: currentTime, end: nextArrival, isIdle: true });
      pushStep(
        currentTime,
        'idle_start',
        'IDLE',
        null,
        readyQueue,
        `At time ${currentTime}, Ready Queue is empty. CPU is idle until time ${nextArrival}.`,
        `No arrived processes ready for execution.`
      );
      currentTime = nextArrival;
      continue;
    }

    if (readyQueue.length > 0) {
      // Sort ready queue by burstTime (SJF), then arrivalTime, then inputIndex
      readyQueue.sort((a, b) => a.burstTime - b.burstTime || a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);

      const nextProc = readyQueue.shift();
      const start = currentTime;
      const end = start + nextProc.burstTime;

      if (nextProc.startTime === -1) {
        nextProc.startTime = start;
        nextProc.responseTime = start - nextProc.arrivalTime;
      }

      processesState[nextProc.id] = 'RUNNING';
      timeline.push({ processId: nextProc.id, start, end, isIdle: false });

      pushStep(
        start,
        'start',
        nextProc.id,
        nextProc,
        readyQueue,
        `SJF selects process ${nextProc.id} because it has the shortest burst time (${nextProc.burstTime}) in the Ready Queue.`,
        `${nextProc.id} has the minimum burst time (${nextProc.burstTime}) among all available ready processes.`
      );

      currentTime = end;
      nextProc.completionTime = end;
      nextProc.turnaroundTime = nextProc.completionTime - nextProc.arrivalTime;
      nextProc.waitingTime = nextProc.turnaroundTime - nextProc.burstTime;
      nextProc.isCompleted = true;

      // Update in processes list
      const orig = processes.find(p => p.id === nextProc.id);
      if (orig) Object.assign(orig, nextProc);

      completed.push(nextProc);
      processesState[nextProc.id] = 'COMPLETED';

      pushStep(
        end,
        'completion',
        nextProc.id,
        null,
        readyQueue,
        `Process ${nextProc.id} completed execution at time ${end}.`,
        `${nextProc.id} finished its burst time of ${nextProc.burstTime}. CPU released.`
      );
    }
  }

  return buildSimulationResult(processes, timeline, stepsLog);
}

/**
 * ----------------------------------------------------
 * 2. Shortest Remaining Time First (SRTF) - Preemptive
 * ----------------------------------------------------
 */
export function runSrtfSimulation(inputProcesses) {
  const processes = prepareProcesses(inputProcesses);
  if (processes.length === 0) return buildSimulationResult([], [], []);

  let currentTime = 0;
  const timeline = [];
  const completed = [];
  const readyQueue = [];
  let currentCpu = null;
  const stepsLog = [];

  const processesState = {};
  processes.forEach(p => { processesState[p.id] = 'NOT_ARRIVED'; });

  let stepIdx = 1;

  function pushStep(time, type, pId, cpuObj, queueList, explanation, whyReason) {
    const ganttBlocks = timeline
      .filter(b => b.start < time)
      .map(b => ({
        processId: b.processId,
        start: b.start,
        end: Math.min(b.end, time),
        isIdle: b.isIdle,
        isActive: b.start <= time && b.end >= time && !b.isIdle
      }));

    stepsLog.push({
      stepIndex: stepIdx++,
      time,
      eventType: type,
      eventProcessId: pId,
      cpu: cpuObj ? { ...cpuObj } : null,
      readyQueue: queueList.map(q => ({ ...q })),
      completed: completed.map(c => ({ ...c })),
      processesState: { ...processesState },
      ganttBlocks,
      explanation,
      whyReason
    });
  }

  // Find total execution time required
  const remaining = [...processes];

  while (completed.length < processes.length) {
    // Add arrived processes at currentTime
    const newlyArrived = remaining.filter(p => p.arrivalTime === currentTime && processesState[p.id] === 'NOT_ARRIVED');
    newlyArrived.forEach(p => {
      readyQueue.push(p);
      processesState[p.id] = 'READY';
      pushStep(
        currentTime,
        'arrival',
        p.id,
        currentCpu,
        readyQueue,
        `At time ${currentTime}, process ${p.id} arrives (Burst: ${p.burstTime}).`,
        `${p.id} arrived and was placed into the Ready Queue.`
      );
    });

    // Check if ready queue + current CPU has any process
    const candidates = [...readyQueue];
    if (currentCpu) candidates.push(currentCpu);

    if (candidates.length === 0) {
      // Idle slot
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== 'IDLE') {
        timeline.push({ processId: 'IDLE', start: currentTime, end: currentTime + 1, isIdle: true });
      } else {
        timeline[timeline.length - 1].end += 1;
      }
      currentTime++;
      continue;
    }

    // Sort candidates by remainingTime, then arrivalTime, then inputIndex
    candidates.sort((a, b) => a.remainingTime - b.remainingTime || a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);
    const bestProc = candidates[0];

    // Check if preemption needed
    if (currentCpu && currentCpu.id !== bestProc.id) {
      // Preempt current process
      readyQueue.push(currentCpu);
      processesState[currentCpu.id] = 'READY';

      pushStep(
        currentTime,
        'preemption',
        currentCpu.id,
        null,
        readyQueue,
        `Process ${currentCpu.id} preempted by ${bestProc.id} because ${bestProc.id} has shorter remaining time (${bestProc.remainingTime} vs ${currentCpu.remainingTime}).`,
        `SRTF is preemptive; ${bestProc.id} has smaller remaining burst time.`
      );

      // Remove bestProc from readyQueue
      const bIdx = readyQueue.findIndex(q => q.id === bestProc.id);
      if (bIdx !== -1) readyQueue.splice(bIdx, 1);

      currentCpu = bestProc;
      processesState[currentCpu.id] = 'RUNNING';

      if (currentCpu.startTime === -1) {
        currentCpu.startTime = currentTime;
        currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
      }

      pushStep(
        currentTime,
        'start',
        currentCpu.id,
        currentCpu,
        readyQueue,
        `Process ${currentCpu.id} takes CPU at time ${currentTime}.`,
        `${currentCpu.id} selected with shortest remaining time (${currentCpu.remainingTime}).`
      );
    } else if (!currentCpu) {
      // Dispatch bestProc
      const bIdx = readyQueue.findIndex(q => q.id === bestProc.id);
      if (bIdx !== -1) readyQueue.splice(bIdx, 1);

      currentCpu = bestProc;
      processesState[currentCpu.id] = 'RUNNING';

      if (currentCpu.startTime === -1) {
        currentCpu.startTime = currentTime;
        currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
      }

      pushStep(
        currentTime,
        'start',
        currentCpu.id,
        currentCpu,
        readyQueue,
        `SRTF dispatches process ${currentCpu.id} at time ${currentTime}.`,
        `${currentCpu.id} has shortest remaining time (${currentCpu.remainingTime}).`
      );
    }

    // Record timeline segment
    if (timeline.length === 0 || timeline[timeline.length - 1].processId !== currentCpu.id) {
      timeline.push({ processId: currentCpu.id, start: currentTime, end: currentTime + 1, isIdle: false });
    } else {
      timeline[timeline.length - 1].end += 1;
    }

    // Execute 1 unit of time
    currentCpu.remainingTime -= 1;
    currentTime += 1;

    // If completed
    if (currentCpu.remainingTime === 0) {
      currentCpu.completionTime = currentTime;
      currentCpu.turnaroundTime = currentCpu.completionTime - currentCpu.arrivalTime;
      currentCpu.waitingTime = currentCpu.turnaroundTime - currentCpu.burstTime;
      currentCpu.isCompleted = true;

      const orig = processes.find(p => p.id === currentCpu.id);
      if (orig) Object.assign(orig, currentCpu);

      completed.push(currentCpu);
      processesState[currentCpu.id] = 'COMPLETED';

      pushStep(
        currentTime,
        'completion',
        currentCpu.id,
        null,
        readyQueue,
        `Process ${currentCpu.id} completed at time ${currentTime}.`,
        `${currentCpu.id} remaining burst time reached 0.`
      );

      currentCpu = null;
    }
  }

  return buildSimulationResult(processes, timeline, stepsLog);
}

/**
 * ----------------------------------------------------
 * 3. Priority Scheduling (Non-Preemptive & Preemptive)
 * ----------------------------------------------------
 */
export function runPrioritySimulation(inputProcesses, isPreemptive = false) {
  const processes = prepareProcesses(inputProcesses);
  if (processes.length === 0) return buildSimulationResult([], [], []);

  let currentTime = 0;
  const timeline = [];
  const completed = [];
  const readyQueue = [];
  let currentCpu = null;
  const stepsLog = [];

  const processesState = {};
  processes.forEach(p => { processesState[p.id] = 'NOT_ARRIVED'; });

  let stepIdx = 1;

  function pushStep(time, type, pId, cpuObj, queueList, explanation, whyReason) {
    const ganttBlocks = timeline
      .filter(b => b.start < time)
      .map(b => ({
        processId: b.processId,
        start: b.start,
        end: Math.min(b.end, time),
        isIdle: b.isIdle,
        isActive: b.start <= time && b.end >= time && !b.isIdle
      }));

    stepsLog.push({
      stepIndex: stepIdx++,
      time,
      eventType: type,
      eventProcessId: pId,
      cpu: cpuObj ? { ...cpuObj } : null,
      readyQueue: queueList.map(q => ({ ...q })),
      completed: completed.map(c => ({ ...c })),
      processesState: { ...processesState },
      ganttBlocks,
      explanation,
      whyReason
    });
  }

  const remaining = [...processes];

  while (completed.length < processes.length) {
    // Arrival check
    const newlyArrived = remaining.filter(p => p.arrivalTime === currentTime && processesState[p.id] === 'NOT_ARRIVED');
    newlyArrived.forEach(p => {
      readyQueue.push(p);
      processesState[p.id] = 'READY';
      pushStep(
        currentTime,
        'arrival',
        p.id,
        currentCpu,
        readyQueue,
        `At time ${currentTime}, process ${p.id} (Priority: ${p.priority}) arrives.`,
        `${p.id} added to Ready Queue with priority ${p.priority}.`
      );
    });

    const candidates = [...readyQueue];
    if (currentCpu) candidates.push(currentCpu);

    if (candidates.length === 0) {
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== 'IDLE') {
        timeline.push({ processId: 'IDLE', start: currentTime, end: currentTime + 1, isIdle: true });
      } else {
        timeline[timeline.length - 1].end += 1;
      }
      currentTime++;
      continue;
    }

    // Sort by Priority (lower number = higher priority), then arrivalTime, then inputIndex
    candidates.sort((a, b) => a.priority - b.priority || a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);
    const bestProc = candidates[0];

    if (isPreemptive && currentCpu && currentCpu.id !== bestProc.id) {
      readyQueue.push(currentCpu);
      processesState[currentCpu.id] = 'READY';

      pushStep(
        currentTime,
        'preemption',
        currentCpu.id,
        null,
        readyQueue,
        `Process ${currentCpu.id} preempted by ${bestProc.id} due to higher priority (${bestProc.priority} < ${currentCpu.priority}).`,
        `Preemptive priority scheduling switches to higher priority process.`
      );

      const bIdx = readyQueue.findIndex(q => q.id === bestProc.id);
      if (bIdx !== -1) readyQueue.splice(bIdx, 1);

      currentCpu = bestProc;
      processesState[currentCpu.id] = 'RUNNING';

      if (currentCpu.startTime === -1) {
        currentCpu.startTime = currentTime;
        currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
      }

      pushStep(
        currentTime,
        'start',
        currentCpu.id,
        currentCpu,
        readyQueue,
        `Process ${currentCpu.id} takes CPU at time ${currentTime}.`,
        `${currentCpu.id} has highest priority (${currentCpu.priority}).`
      );
    } else if (!currentCpu) {
      const bIdx = readyQueue.findIndex(q => q.id === bestProc.id);
      if (bIdx !== -1) readyQueue.splice(bIdx, 1);

      currentCpu = bestProc;
      processesState[currentCpu.id] = 'RUNNING';

      if (currentCpu.startTime === -1) {
        currentCpu.startTime = currentTime;
        currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
      }

      pushStep(
        currentTime,
        'start',
        currentCpu.id,
        currentCpu,
        readyQueue,
        `Priority scheduling dispatches process ${currentCpu.id} (Priority: ${currentCpu.priority}).`,
        `${currentCpu.id} selected with highest priority (${currentCpu.priority}).`
      );
    }

    // Update timeline
    if (timeline.length === 0 || timeline[timeline.length - 1].processId !== currentCpu.id) {
      timeline.push({ processId: currentCpu.id, start: currentTime, end: currentTime + 1, isIdle: false });
    } else {
      timeline[timeline.length - 1].end += 1;
    }

    currentCpu.remainingTime -= 1;
    currentTime += 1;

    if (currentCpu.remainingTime === 0) {
      currentCpu.completionTime = currentTime;
      currentCpu.turnaroundTime = currentCpu.completionTime - currentCpu.arrivalTime;
      currentCpu.waitingTime = currentCpu.turnaroundTime - currentCpu.burstTime;
      currentCpu.isCompleted = true;

      const orig = processes.find(p => p.id === currentCpu.id);
      if (orig) Object.assign(orig, currentCpu);

      completed.push(currentCpu);
      processesState[currentCpu.id] = 'COMPLETED';

      pushStep(
        currentTime,
        'completion',
        currentCpu.id,
        null,
        readyQueue,
        `Process ${currentCpu.id} finished execution at time ${currentTime}.`,
        `${currentCpu.id} burst completed.`
      );

      currentCpu = null;
    }
  }

  return buildSimulationResult(processes, timeline, stepsLog);
}

/**
 * ----------------------------------------------------
 * 4. Round Robin (RR) - Preemptive with Time Quantum Q
 * ----------------------------------------------------
 */
export function runRrSimulation(inputProcesses, timeQuantum = 2) {
  const processes = prepareProcesses(inputProcesses);
  if (processes.length === 0) return buildSimulationResult([], [], []);

  const quantum = Math.max(1, Number(timeQuantum) || 2);
  let currentTime = 0;
  const timeline = [];
  const completed = [];
  const readyQueue = [];
  let currentCpu = null;
  let currentQuantumLeft = 0;
  const stepsLog = [];

  const processesState = {};
  processes.forEach(p => { processesState[p.id] = 'NOT_ARRIVED'; });

  let stepIdx = 1;

  function pushStep(time, type, pId, cpuObj, queueList, explanation, whyReason) {
    const ganttBlocks = timeline
      .filter(b => b.start < time)
      .map(b => ({
        processId: b.processId,
        start: b.start,
        end: Math.min(b.end, time),
        isIdle: b.isIdle,
        isActive: b.start <= time && b.end >= time && !b.isIdle
      }));

    stepsLog.push({
      stepIndex: stepIdx++,
      time,
      eventType: type,
      eventProcessId: pId,
      cpu: cpuObj ? { ...cpuObj } : null,
      readyQueue: queueList.map(q => ({ ...q })),
      completed: completed.map(c => ({ ...c })),
      processesState: { ...processesState },
      ganttBlocks,
      explanation,
      whyReason
    });
  }

  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);

  while (completed.length < processes.length) {
    // Arrived processes at currentTime
    const newlyArrived = remaining.filter(p => p.arrivalTime === currentTime && processesState[p.id] === 'NOT_ARRIVED');
    newlyArrived.forEach(p => {
      readyQueue.push(p);
      processesState[p.id] = 'READY';
      pushStep(
        currentTime,
        'arrival',
        p.id,
        currentCpu,
        readyQueue,
        `At time ${currentTime}, process ${p.id} arrives and enters Ready Queue.`,
        `${p.id} arrived (Burst: ${p.burstTime}).`
      );
    });

    // Quantum expired or CPU free?
    if (currentCpu) {
      if (currentCpu.remainingTime === 0) {
        // Complete
        currentCpu.completionTime = currentTime;
        currentCpu.turnaroundTime = currentCpu.completionTime - currentCpu.arrivalTime;
        currentCpu.waitingTime = currentCpu.turnaroundTime - currentCpu.burstTime;
        currentCpu.isCompleted = true;

        const orig = processes.find(p => p.id === currentCpu.id);
        if (orig) Object.assign(orig, currentCpu);

        completed.push(currentCpu);
        processesState[currentCpu.id] = 'COMPLETED';

        pushStep(
          currentTime,
          'completion',
          currentCpu.id,
          null,
          readyQueue,
          `Process ${currentCpu.id} completed at time ${currentTime}.`,
          `${currentCpu.id} completed execution.`
        );

        currentCpu = null;
        currentQuantumLeft = 0;
      } else if (currentQuantumLeft === 0) {
        // Quantum expired - requeue
        readyQueue.push(currentCpu);
        processesState[currentCpu.id] = 'READY';

        pushStep(
          currentTime,
          'preemption',
          currentCpu.id,
          null,
          readyQueue,
          `Time quantum (${quantum} ms) expired for process ${currentCpu.id}. Re-queued at back of Ready Queue.`,
          `Round Robin rotates process after quantum expiration.`
        );

        currentCpu = null;
      }
    }

    // Select next process if CPU idle
    if (!currentCpu && readyQueue.length > 0) {
      currentCpu = readyQueue.shift();
      currentQuantumLeft = quantum;
      processesState[currentCpu.id] = 'RUNNING';

      if (currentCpu.startTime === -1) {
        currentCpu.startTime = currentTime;
        currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
      }

      pushStep(
        currentTime,
        'start',
        currentCpu.id,
        currentCpu,
        readyQueue,
        `Round Robin dispatches process ${currentCpu.id} for time quantum of ${quantum} ms.`,
        `Next process in FIFO ready queue selected.`
      );
    }

    if (!currentCpu && readyQueue.length === 0 && completed.length < processes.length) {
      // Idle step
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== 'IDLE') {
        timeline.push({ processId: 'IDLE', start: currentTime, end: currentTime + 1, isIdle: true });
      } else {
        timeline[timeline.length - 1].end += 1;
      }
      currentTime++;
      continue;
    }

    // Execute 1 tick
    if (currentCpu) {
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== currentCpu.id) {
        timeline.push({ processId: currentCpu.id, start: currentTime, end: currentTime + 1, isIdle: false });
      } else {
        timeline[timeline.length - 1].end += 1;
      }

      currentCpu.remainingTime -= 1;
      currentQuantumLeft -= 1;
      currentTime += 1;
    }
  }

  return buildSimulationResult(processes, timeline, stepsLog);
}

/**
 * ----------------------------------------------------
 * 5. Multilevel Queue (MLQ)
 * Queue 1 (High Priority, Priority <= 2): Round Robin (Quantum Q=2)
 * Queue 2 (Low Priority, Priority > 2): FCFS
 * Queue 1 has preemption rights over Queue 2
 * ----------------------------------------------------
 */
export function runMlqSimulation(inputProcesses, timeQuantum = 2) {
  const processes = prepareProcesses(inputProcesses);
  if (processes.length === 0) return buildSimulationResult([], [], []);

  const quantum = Math.max(1, Number(timeQuantum) || 2);
  let currentTime = 0;
  const timeline = [];
  const completed = [];
  const q1Ready = []; // High priority (Priority <= 2, RR)
  const q2Ready = []; // Low priority (Priority > 2, FCFS)
  let currentCpu = null;
  let currentCpuQueue = 0; // 1 or 2
  let currentQuantumLeft = 0;
  const stepsLog = [];

  const processesState = {};
  processes.forEach(p => { processesState[p.id] = 'NOT_ARRIVED'; });

  let stepIdx = 1;

  function pushStep(time, type, pId, cpuObj, queueList, explanation, whyReason) {
    const ganttBlocks = timeline
      .filter(b => b.start < time)
      .map(b => ({
        processId: b.processId,
        start: b.start,
        end: Math.min(b.end, time),
        isIdle: b.isIdle,
        isActive: b.start <= time && b.end >= time && !b.isIdle
      }));

    stepsLog.push({
      stepIndex: stepIdx++,
      time,
      eventType: type,
      eventProcessId: pId,
      cpu: cpuObj ? { ...cpuObj } : null,
      readyQueue: queueList.map(q => ({ ...q })),
      completed: completed.map(c => ({ ...c })),
      processesState: { ...processesState },
      ganttBlocks,
      explanation,
      whyReason
    });
  }

  const remaining = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.inputIndex - b.inputIndex);

  while (completed.length < processes.length) {
    // Arrival
    const newlyArrived = remaining.filter(p => p.arrivalTime === currentTime && processesState[p.id] === 'NOT_ARRIVED');
    newlyArrived.forEach(p => {
      processesState[p.id] = 'READY';
      if (p.priority <= 2) {
        q1Ready.push(p);
        pushStep(
          currentTime,
          'arrival',
          p.id,
          currentCpu,
          [...q1Ready, ...q2Ready],
          `At time ${currentTime}, process ${p.id} (Priority ${p.priority}) arrives into Queue 1 (High Priority RR).`,
          `Priority <= 2 maps to Queue 1.`
        );
      } else {
        q2Ready.push(p);
        pushStep(
          currentTime,
          'arrival',
          p.id,
          currentCpu,
          [...q1Ready, ...q2Ready],
          `At time ${currentTime}, process ${p.id} (Priority ${p.priority}) arrives into Queue 2 (Low Priority FCFS).`,
          `Priority > 2 maps to Queue 2.`
        );
      }
    });

    // Check completion or quantum expiration of running process
    if (currentCpu) {
      if (currentCpu.remainingTime === 0) {
        currentCpu.completionTime = currentTime;
        currentCpu.turnaroundTime = currentCpu.completionTime - currentCpu.arrivalTime;
        currentCpu.waitingTime = currentCpu.turnaroundTime - currentCpu.burstTime;
        currentCpu.isCompleted = true;

        const orig = processes.find(p => p.id === currentCpu.id);
        if (orig) Object.assign(orig, currentCpu);

        completed.push(currentCpu);
        processesState[currentCpu.id] = 'COMPLETED';

        pushStep(
          currentTime,
          'completion',
          currentCpu.id,
          null,
          [...q1Ready, ...q2Ready],
          `Process ${currentCpu.id} completed at time ${currentTime}.`,
          `${currentCpu.id} finished burst time.`
        );

        currentCpu = null;
        currentCpuQueue = 0;
        currentQuantumLeft = 0;
      } else if (currentCpuQueue === 1 && currentQuantumLeft === 0) {
        // Q1 quantum expired
        q1Ready.push(currentCpu);
        processesState[currentCpu.id] = 'READY';

        pushStep(
          currentTime,
          'preemption',
          currentCpu.id,
          null,
          [...q1Ready, ...q2Ready],
          `Queue 1 quantum (${quantum} ms) expired for ${currentCpu.id}. Re-queued in Queue 1.`,
          `Round Robin rotation in Queue 1.`
        );

        currentCpu = null;
        currentCpuQueue = 0;
      } else if (currentCpuQueue === 2 && q1Ready.length > 0) {
        // Preempt Queue 2 process because Queue 1 has process!
        q2Ready.unshift(currentCpu); // Re-insert at front of Q2 FCFS
        processesState[currentCpu.id] = 'READY';

        pushStep(
          currentTime,
          'preemption',
          currentCpu.id,
          null,
          [...q1Ready, ...q2Ready],
          `Low priority process ${currentCpu.id} (Queue 2) preempted by higher priority Queue 1 process.`,
          `Queue 1 has absolute priority over Queue 2.`
        );

        currentCpu = null;
        currentCpuQueue = 0;
      }
    }

    // Schedule next process
    if (!currentCpu) {
      if (q1Ready.length > 0) {
        currentCpu = q1Ready.shift();
        currentCpuQueue = 1;
        currentQuantumLeft = quantum;
        processesState[currentCpu.id] = 'RUNNING';

        if (currentCpu.startTime === -1) {
          currentCpu.startTime = currentTime;
          currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
        }

        pushStep(
          currentTime,
          'start',
          currentCpu.id,
          currentCpu,
          [...q1Ready, ...q2Ready],
          `Multilevel Queue dispatches ${currentCpu.id} from Queue 1 (High Priority RR).`,
          `Queue 1 is served before Queue 2.`
        );
      } else if (q2Ready.length > 0) {
        currentCpu = q2Ready.shift();
        currentCpuQueue = 2;
        currentQuantumLeft = 99999; // FCFS
        processesState[currentCpu.id] = 'RUNNING';

        if (currentCpu.startTime === -1) {
          currentCpu.startTime = currentTime;
          currentCpu.responseTime = currentTime - currentCpu.arrivalTime;
        }

        pushStep(
          currentTime,
          'start',
          currentCpu.id,
          currentCpu,
          [...q1Ready, ...q2Ready],
          `Multilevel Queue dispatches ${currentCpu.id} from Queue 2 (Low Priority FCFS).`,
          `Queue 1 is empty; serving Queue 2.`
        );
      }
    }

    if (!currentCpu && q1Ready.length === 0 && q2Ready.length === 0 && completed.length < processes.length) {
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== 'IDLE') {
        timeline.push({ processId: 'IDLE', start: currentTime, end: currentTime + 1, isIdle: true });
      } else {
        timeline[timeline.length - 1].end += 1;
      }
      currentTime++;
      continue;
    }

    if (currentCpu) {
      if (timeline.length === 0 || timeline[timeline.length - 1].processId !== currentCpu.id) {
        timeline.push({ processId: currentCpu.id, start: currentTime, end: currentTime + 1, isIdle: false });
      } else {
        timeline[timeline.length - 1].end += 1;
      }

      currentCpu.remainingTime -= 1;
      currentQuantumLeft -= 1;
      currentTime += 1;
    }
  }

  return buildSimulationResult(processes, timeline, stepsLog);
}

/**
 * Main dispatcher to run any CPU Scheduling Algorithm
 */
export function runSchedulingSimulation(algorithmId, inputProcesses, options = {}) {
  const quantum = options.quantum || 2;
  const isPreemptive = options.preemptive !== undefined ? options.preemptive : false;

  switch (algorithmId) {
    case 'FCFS':
      return runFcfsSimulation(inputProcesses);
    case 'SJF':
      return runSjfSimulation(inputProcesses);
    case 'SRTF':
      return runSrtfSimulation(inputProcesses);
    case 'Priority':
      return runPrioritySimulation(inputProcesses, isPreemptive);
    case 'RR':
      return runRrSimulation(inputProcesses, quantum);
    case 'MLQ':
      return runMlqSimulation(inputProcesses, quantum);
    default:
      return runFcfsSimulation(inputProcesses);
  }
}
