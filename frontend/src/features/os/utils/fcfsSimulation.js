/**
 * FCFS (First Come, First Served) CPU Scheduling Simulation Logic
 * 
 * Receives an array of processes:
 * [{ id, arrivalTime, burstTime, priority }]
 * 
 * Returns:
 * {
 *   processes: [...],    // processes with all calculated metrics
 *   timeline: [...],     // Gantt chart blocks (including IDLE blocks)
 *   steps: [...],        // step-by-step state for visualization
 *   metrics: {...}       // average waiting time, average turnaround time, etc.
 * }
 */
export function runFcfsSimulation(inputProcesses) {
  if (!inputProcesses || inputProcesses.length === 0) {
    return {
      processes: [],
      timeline: [],
      steps: [],
      metrics: {
        avgWaitingTime: 0,
        avgTurnaroundTime: 0,
        avgResponseTime: 0,
        cpuUtilization: 0,
        totalTime: 0
      }
    };
  }

  // Deep copy and format process fields
  const processes = inputProcesses.map((p, idx) => ({
    id: p.id,
    arrivalTime: Math.max(0, Number(p.arrivalTime)),
    burstTime: Math.max(1, Number(p.burstTime)), // Burst time should be at least 1
    priority: Number(p.priority || 0),
    inputIndex: idx, // For stable sorting
    startTime: -1,
    completionTime: -1,
    turnaroundTime: -1,
    waitingTime: -1,
    responseTime: -1,
    isCompleted: false
  }));

  // Sort processes: primary by Arrival Time, secondary by inputIndex to preserve order
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime !== b.arrivalTime) {
      return a.arrivalTime - b.arrivalTime;
    }
    return a.inputIndex - b.inputIndex;
  });

  // Calculate timeline
  let currentTime = 0;
  const timeline = []; // Array of { processId, start, end, isIdle }
  const queue = [];
  const remaining = [...sortedProcesses];

  while (remaining.length > 0 || queue.length > 0) {
    // If queue is empty and the next process arrives in the future, CPU is IDLE
    if (queue.length === 0 && remaining.length > 0 && remaining[0].arrivalTime > currentTime) {
      const nextArrival = remaining[0].arrivalTime;
      timeline.push({
        processId: "IDLE",
        start: currentTime,
        end: nextArrival,
        isIdle: true
      });
      currentTime = nextArrival;
    }

    // Add all processes that have arrived by currentTime to the ready queue
    while (remaining.length > 0 && remaining[0].arrivalTime <= currentTime) {
      queue.push(remaining.shift());
    }

    // Execute next process in queue
    if (queue.length > 0) {
      const currentProcess = queue.shift();
      const start = currentTime;
      const end = start + currentProcess.burstTime;

      timeline.push({
        processId: currentProcess.id,
        start: start,
        end: end,
        isIdle: false
      });

      // Update process metrics in the original processes array
      const proc = processes.find(p => p.id === currentProcess.id);
      if (proc) {
        proc.startTime = start;
        proc.completionTime = end;
        proc.turnaroundTime = proc.completionTime - proc.arrivalTime;
        proc.waitingTime = proc.turnaroundTime - proc.burstTime;
        proc.responseTime = proc.startTime - proc.arrivalTime;
        proc.isCompleted = true;
      }

      currentTime = end;
    }
  }

  const totalTime = currentTime;

  // Calculate average metrics
  const totalWT = processes.reduce((sum, p) => sum + p.waitingTime, 0);
  const totalTAT = processes.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalRT = processes.reduce((sum, p) => sum + p.responseTime, 0);
  const totalBusyTime = processes.reduce((sum, p) => sum + p.burstTime, 0);

  const avgWaitingTime = Number((totalWT / processes.length).toFixed(2));
  const avgTurnaroundTime = Number((totalTAT / processes.length).toFixed(2));
  const avgResponseTime = Number((totalRT / processes.length).toFixed(2));
  const cpuUtilization = totalTime > 0 ? Number(((totalBusyTime / totalTime) * 100).toFixed(2)) : 0;

  const metrics = {
    avgWaitingTime,
    avgTurnaroundTime,
    avgResponseTime,
    cpuUtilization,
    totalTime
  };

  // Generate simulation steps/events
  const events = [];

  processes.forEach(p => {
    events.push({
      time: p.arrivalTime,
      type: 'arrival',
      processId: p.id,
      process: { ...p }
    });
    events.push({
      time: p.startTime,
      type: 'start',
      processId: p.id,
      process: { ...p }
    });
    events.push({
      time: p.completionTime,
      type: 'completion',
      processId: p.id,
      process: { ...p }
    });
  });

  timeline.forEach(block => {
    if (block.isIdle) {
      events.push({
        time: block.start,
        type: 'idle_start',
        processId: 'IDLE'
      });
    }
  });

  // Sort events chronologically.
  // Tie-breaker order: completion (1) -> idle_start (2) -> arrival (3) -> start (4)
  const typeOrder = {
    'completion': 1,
    'idle_start': 2,
    'arrival': 3,
    'start': 4
  };

  events.sort((a, b) => {
    if (a.time !== b.time) {
      return a.time - b.time;
    }
    return typeOrder[a.type] - typeOrder[b.type];
  });

  // Re-simulate events to build snapshot at each step
  const steps = [];
  let currentQueue = [];
  let currentCpu = null;
  const currentCompleted = [];
  const processesState = {}; // { [id]: 'NOT_ARRIVED' | 'READY' | 'RUNNING' | 'COMPLETED' }

  processes.forEach(p => {
    processesState[p.id] = 'NOT_ARRIVED';
  });

  events.forEach((evt, idx) => {
    const { time, type, processId, process } = evt;

    if (type === 'arrival') {
      currentQueue.push(process);
      processesState[processId] = 'READY';
    } else if (type === 'start') {
      // Remove from queue
      currentQueue = currentQueue.filter(p => p.id !== processId);
      currentCpu = { ...process, elapsed: 0 };
      processesState[processId] = 'RUNNING';
    } else if (type === 'completion') {
      currentCpu = null;
      currentCompleted.push(process);
      processesState[processId] = 'COMPLETED';
    } else if (type === 'idle_start') {
      currentCpu = null;
    }

    // Build the Gantt Chart up to current step time
    const stepGanttBlocks = [];
    timeline.forEach(block => {
      if (block.start < time) {
        const blockEnd = Math.min(block.end, time);
        stepGanttBlocks.push({
          processId: block.processId,
          start: block.start,
          end: blockEnd,
          isIdle: block.isIdle,
          isActive: block.start <= time && block.end >= time && !block.isIdle
        });
      }
    });

    // Generate step explanations
    let explanation = '';
    let whyReason = '';

    if (type === 'arrival') {
      explanation = `At time ${time}, process ${processId} arrives and is added to the Ready Queue.`;
      whyReason = `${processId} has reached its Arrival Time of ${time} and is waiting for CPU availability.`;
    } else if (type === 'start') {
      explanation = `FCFS selects ${processId} from the Ready Queue because it has the earliest arrival time.`;
      whyReason = `${processId} starts executing because the CPU is free and it was the first in the Ready Queue.`;
    } else if (type === 'completion') {
      explanation = `Process ${processId} finishes executing at time ${time}.`;
      whyReason = `${processId} completed its Burst Time of ${process.burstTime}. The CPU is now released.`;
    } else if (type === 'idle_start') {
      explanation = `At time ${time}, the Ready Queue is empty and no processes are executing. CPU is idle.`;
      whyReason = `No process has arrived yet (or all arrived processes are completed) at time ${time}.`;
    }

    steps.push({
      stepIndex: idx + 1,
      time,
      eventType: type,
      eventProcessId: processId,
      cpu: currentCpu ? { ...currentCpu } : null,
      readyQueue: [...currentQueue],
      completed: [...currentCompleted],
      processesState: { ...processesState },
      ganttBlocks: stepGanttBlocks,
      explanation,
      whyReason
    });
  });

  return {
    processes,
    timeline,
    steps,
    metrics
  };
}
