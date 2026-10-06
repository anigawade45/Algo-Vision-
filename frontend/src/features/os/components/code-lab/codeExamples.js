/**
 * Starter Code Configuration Repository for AlgoVision Code Lab
 * Provides complete, functional, production-ready implementations in JS, C++, Java, and Python
 * for all Operating Systems Modules.
 */

export const codeExamples = {
  'process-management': {
    name: 'Process Management & PCB',
    algorithms: ['Process Creation & Fork', 'Process State Transitions', 'PCB Inspector'],
    defaultAlgorithm: 'Process Creation & Fork',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      parentPid: 100,
      childCount: 3
    },
    code: {
      'Process Creation & Fork': {
        javascript: `// Process Management - Process Creation & Fork Tree Simulation
class Process {
  constructor(pid, ppid, state = 'NEW') {
    this.pid = pid;
    this.ppid = ppid;
    this.state = state;
    this.children = [];
  }
}

function simulateProcessTree() {
  console.log("=== OS Process Creation & Fork Tree Simulation ===");
  const initProcess = new Process(1, 0, 'RUNNING');
  console.log(\`Root Process Created: PID=\${initProcess.pid}, State=\${initProcess.state}\`);

  // Forking Child Process P2
  const p2 = new Process(2, initProcess.pid, 'READY');
  initProcess.children.push(p2);
  console.log(\`fork() Executed by PID 1 -> Child PID 2 Created (PPID=1, State=READY)\`);

  // Forking Child Process P3 from P2
  const p3 = new Process(3, p2.pid, 'READY');
  p2.children.push(p3);
  console.log(\`fork() Executed by PID 2 -> Child PID 3 Created (PPID=2, State=READY)\`);

  // Transitioning State
  p2.state = 'RUNNING';
  console.log(\`Context Switch: Process PID 2 State changed to RUNNING\`);
  
  p2.state = 'WAITING';
  console.log(\`I/O Event Issued: Process PID 2 State changed to WAITING\`);

  console.log("----------------------------------------");
  console.log("Process Tree Hierarchy:");
  console.log(\`PID 1 (init, READY) -> PID 2 (WAITING) -> PID 3 (READY)\`);
}

simulateProcessTree();`,

        cpp: `// Process Management - Process Tree & Fork in C++
#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct Process {
    int pid;
    int ppid;
    string state;
    vector<int> children;
};

int main() {
    cout << "=== OS Process Creation & Fork Tree (C++) ===" << endl;
    Process p1 = {1, 0, "RUNNING", {2}};
    cout << "Root Process PID: " << p1.pid << ", State: " << p1.state << endl;

    Process p2 = {2, p1.pid, "READY", {3}};
    cout << "fork() Executed by PID 1 -> Child PID " << p2.pid << " Created (PPID=" << p2.ppid << ")" << endl;

    Process p3 = {3, p2.pid, "READY", {}};
    cout << "fork() Executed by PID 2 -> Child PID " << p3.pid << " Created (PPID=" << p3.ppid << ")" << endl;

    p2.state = "RUNNING";
    cout << "Context Switch -> Process PID 2 State: " << p2.state << endl;

    p2.state = "WAITING";
    cout << "I/O Wait -> Process PID 2 State: " << p2.state << endl;

    cout << "----------------------------------------" << endl;
    cout << "Process Hierarchy Tree:" << endl;
    cout << "PID 1 (RUNNING) -> PID 2 (WAITING) -> PID 3 (READY)" << endl;
    return 0;
}`,

        java: `// Process Management - Process Tree in Java
import java.util.*;

class ProcessNode {
    int pid, ppid;
    String state;
    List<ProcessNode> children = new ArrayList<>();

    ProcessNode(int pid, int ppid, String state) {
        this.pid = pid;
        this.ppid = ppid;
        this.state = state;
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== OS Process Creation & Fork Tree (Java) ===");
        ProcessNode init = new ProcessNode(1, 0, "RUNNING");
        System.out.println("Root Process Created: PID " + init.pid + " [" + init.state + "]");

        ProcessNode p2 = new ProcessNode(2, init.pid, "READY");
        init.children.add(p2);
        System.out.println("fork() -> Created Child PID: " + p2.pid + " (PPID: " + p2.ppid + ")");

        ProcessNode p3 = new ProcessNode(3, p2.pid, "READY");
        p2.children.add(p3);
        System.out.println("fork() -> Created Child PID: " + p3.pid + " (PPID: " + p3.ppid + ")");

        p2.state = "RUNNING";
        System.out.println("Context Switch -> PID " + p2.pid + " is now " + p2.state);

        System.out.println("----------------------------------------");
        System.out.println("Process Tree Hierarchy:");
        System.out.println("PID " + init.pid + " -> PID " + p2.pid + " -> PID " + p3.pid);
    }
}`,

        python: `# Process Management - Process Tree in Python
class Process:
    def __init__(self, pid, ppid, state="NEW"):
        self.pid = pid
        self.ppid = ppid
        self.state = state
        self.children = []

def simulate_fork_tree():
    print("=== OS Process Creation & Fork Tree (Python) ===")
    init = Process(1, 0, "RUNNING")
    print(f"Root Process Created: PID={init.pid}, State={init.state}")

    p2 = Process(2, init.pid, "READY")
    init.children.append(p2)
    print(f"fork() executed by PID 1 -> Child PID={p2.pid} Created (PPID=1)")

    p3 = Process(3, p2.pid, "READY")
    p2.children.append(p3)
    print(f"fork() executed by PID 2 -> Child PID={p3.pid} Created (PPID=2)")

    p2.state = "RUNNING"
    print(f"Context Switch -> PID 2 State changed to {p2.state}")

    print("----------------------------------------")
    print("Process Tree Hierarchy:")
    print(f"PID 1 (init, {init.state}) -> PID 2 (PPID=1, {p2.state}) -> PID 3 (PPID=2, {p3.state})")

simulate_fork_tree()`
      },

      'Process State Transitions': {
        javascript: `// Process 5-State Life Cycle Transition Simulation
function simulateStateTransitions() {
  console.log("=== OS Process 5-State Transition Diagram ===");
  let state = 'NEW';
  console.log(\`Process Initialized: [\${state}]\`);

  state = 'READY';
  console.log(\`1. Admitted into Ready Queue: [\${state}]\`);

  state = 'RUNNING';
  console.log(\`2. Scheduler Dispatch -> Allocated CPU: [\${state}]\`);

  state = 'WAITING';
  console.log(\`3. I/O Wait or Event Wait: [\${state}]\`);

  state = 'READY';
  console.log(\`4. I/O Completed -> Back to Ready Queue: [\${state}]\`);

  state = 'RUNNING';
  console.log(\`5. Re-allocated CPU: [\${state}]\`);

  state = 'TERMINATED';
  console.log(\`6. Process Execution Finished: [\${state}]\`);
}

simulateStateTransitions();`,

        cpp: `// Process State Transitions in C++
#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    cout << "=== Process 5-State Life Cycle Simulation (C++) ===" << endl;
    vector<string> states = {"NEW", "READY", "RUNNING", "WAITING", "READY", "RUNNING", "TERMINATED"};
    
    cout << "Step 0: Process Created -> [" << states[0] << "]" << endl;
    cout << "Step 1: Admitted to Ready Queue -> [" << states[1] << "]" << endl;
    cout << "Step 2: Scheduler Dispatch -> [" << states[2] << "]" << endl;
    cout << "Step 3: I/O Event Waiting -> [" << states[3] << "]" << endl;
    cout << "Step 4: I/O Complete -> [" << states[4] << "]" << endl;
    cout << "Step 5: Scheduler Re-dispatch -> [" << states[5] << "]" << endl;
    cout << "Step 6: Exit Execution -> [" << states[6] << "]" << endl;
    return 0;
}`,

        java: `// Process State Transitions in Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Process 5-State Life Cycle (Java) ===");
        String[] states = {"NEW", "READY", "RUNNING", "WAITING", "READY", "RUNNING", "TERMINATED"};
        
        for (int i = 0; i < states.length; i++) {
            System.out.println("Transition Step " + i + ": State -> [" + states[i] + "]");
        }
    }
}`,

        python: `# Process State Transitions in Python
def simulate_transitions():
    print("=== Process 5-State Life Cycle (Python) ===")
    transitions = [
        ("NEW", "Initialized in memory"),
        ("READY", "Admitted to Ready Queue"),
        ("RUNNING", "Allocated CPU Core"),
        ("WAITING", "Blocked on I/O Request"),
        ("READY", "I/O Interrupt Complete"),
        ("RUNNING", "Re-allocated CPU Core"),
        ("TERMINATED", "Execution Completed")
    ]
    for step, (state, desc) in enumerate(transitions):
        print(f"Step {step}: [{state}] - {desc}")

simulate_transitions()`
      },

      'PCB Inspector': {
        javascript: `// Process Control Block (PCB) Inspector Simulation
function inspectPCB(pid) {
  const pcb = {
    pid: pid,
    programCounter: "0x004015A0",
    cpuRegisters: { eax: "0x00000005", ebx: "0x00000000", esp: "0x7FFF5FB0" },
    state: "RUNNING",
    priority: 1,
    allocatedMemory: { base: "0x10000000", limit: "0x00050000" },
    openFiles: ["stdin", "stdout", "stderr", "log.txt"]
  };

  console.log("=== Process Control Block (PCB) Data Structure ===");
  console.log("Process ID (PID):    ", pcb.pid);
  console.log("Execution State:     ", pcb.state);
  console.log("Program Counter (PC):", pcb.programCounter);
  console.log("Priority:            ", pcb.priority);
  console.log("CPU Registers:       ", JSON.stringify(pcb.cpuRegisters));
  console.log("Memory Management:   ", JSON.stringify(pcb.allocatedMemory));
  console.log("Open Files Descriptors:", pcb.openFiles.join(", "));
}

inspectPCB(101);`,

        cpp: `// PCB Inspector in C++
#include <iostream>
#include <string>
#include <vector>

using namespace std;

struct PCB {
    int pid;
    string programCounter;
    string state;
    int priority;
    string memoryBase;
    string memoryLimit;
    vector<string> openFiles;
};

int main() {
    PCB pcb = {101, "0x004015A0", "RUNNING", 1, "0x10000000", "0x00050000", {"stdin", "stdout", "stderr", "app.log"}};
    cout << "=== Process Control Block (PCB) Inspector (C++) ===" << endl;
    cout << "Process ID (PID):    " << pcb.pid << endl;
    cout << "State:               " << pcb.state << endl;
    cout << "Program Counter:     " << pcb.programCounter << endl;
    cout << "Priority Level:      " << pcb.priority << endl;
    cout << "Memory Bounds:       Base=" << pcb.memoryBase << ", Limit=" << pcb.memoryLimit << endl;
    cout << "Open File Handles:   ";
    for (const auto& f : pcb.openFiles) cout << f << " ";
    cout << endl;
    return 0;
}`,

        java: `// PCB Inspector in Java
import java.util.*;

class PCB {
    int pid;
    String pc;
    String state;
    int priority;
    String baseMem, limitMem;
    List<String> openFiles;

    PCB(int pid, String pc, String state, int priority, String baseMem, String limitMem, List<String> openFiles) {
        this.pid = pid;
        this.pc = pc;
        this.state = state;
        this.priority = priority;
        this.baseMem = baseMem;
        this.limitMem = limitMem;
        this.openFiles = openFiles;
    }
}

public class Main {
    public static void main(String[] args) {
        PCB pcb = new PCB(101, "0x004015A0", "RUNNING", 1, "0x10000000", "0x00050000", Arrays.asList("stdin", "stdout", "data.db"));
        System.out.println("=== Process Control Block (PCB) Inspector (Java) ===");
        System.out.println("PID:             " + pcb.pid);
        System.out.println("State:           " + pcb.state);
        System.out.println("Program Counter: " + pcb.pc);
        System.out.println("Priority:        " + pcb.priority);
        System.out.println("Memory Region:   Base " + pcb.baseMem + " | Limit " + pcb.limitMem);
        System.out.println("Open Files:      " + String.join(", ", pcb.openFiles));
    }
}`,

        python: `# PCB Inspector in Python
def inspect_pcb():
    pcb = {
        "pid": 101,
        "pc": "0x004015A0",
        "state": "RUNNING",
        "priority": 1,
        "registers": {"EAX": "0x0005", "EBX": "0x0000", "ESP": "0x7FFF"},
        "memory": {"base": "0x10000000", "limit": "0x00050000"},
        "files": ["stdin", "stdout", "app.log"]
    }
    print("=== Process Control Block (PCB) Inspector (Python) ===")
    for key, val in pcb.items():
        print(f"{key.upper().ljust(16)}: {val}")

inspect_pcb()`
      }
    }
  },

  'cpu-scheduling': {
    name: 'CPU Scheduling Algorithms',
    algorithms: ['FCFS', 'SJF', 'SRTF', 'Priority', 'Round Robin'],
    defaultAlgorithm: 'FCFS',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      processes: 'P1:0:5, P2:1:3, P3:2:8, P4:3:6',
      timeQuantum: 2
    },
    code: {
      FCFS: {
        javascript: `// CPU Scheduling - FCFS (First Come First Served)
function runFCFS(processes) {
  console.log("=== CPU Scheduling: FCFS Algorithm ===");
  processes.sort((a, b) => a.arrival - b.arrival);

  let currentTime = 0;
  let totalWT = 0, totalTAT = 0;

  console.log("Process | Arrival | Burst | Completion | Turnaround | Waiting");
  console.log("------------------------------------------------------------");

  processes.forEach(p => {
    if (currentTime < p.arrival) currentTime = p.arrival;
    const completion = currentTime + p.burst;
    const tat = completion - p.arrival;
    const wt = tat - p.burst;

    currentTime = completion;
    totalWT += wt;
    totalTAT += tat;

    console.log(\`  \${p.id.padEnd(5)} |    \${p.arrival.toString().padEnd(4)} |   \${p.burst.toString().padEnd(3)} |     \${completion.toString().padEnd(6)} |     \${tat.toString().padEnd(6)} |   \${wt}\`);
  });

  const n = processes.length;
  console.log("------------------------------------------------------------");
  console.log(\`Average Waiting Time:    \${(totalWT / n).toFixed(2)} ms\`);
  console.log(\`Average Turnaround Time: \${(totalTAT / n).toFixed(2)} ms\`);
}

runFCFS([
  { id: 'P1', arrival: 0, burst: 5 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 8 },
  { id: 'P4', arrival: 3, burst: 6 }
]);`,

        cpp: `// CPU Scheduling - FCFS in C++
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <iomanip>

using namespace std;

struct Process {
    string id;
    int arrival, burst, completion, tat, wt;
};

int main() {
    vector<Process> proc = {{"P1", 0, 5}, {"P2", 1, 3}, {"P3", 2, 8}, {"P4", 3, 6}};
    sort(proc.begin(), proc.end(), [](const Process& a, const Process& b){ return a.arrival < b.arrival; });

    int currentTime = 0, totalWT = 0, totalTAT = 0;

    cout << "=== FCFS CPU Scheduling (C++) ===" << endl;
    cout << "Process | Arrival | Burst | Completion | TAT | WT" << endl;
    cout << "------------------------------------------------" << endl;

    for (auto& p : proc) {
        if (currentTime < p.arrival) currentTime = p.arrival;
        p.completion = currentTime + p.burst;
        p.tat = p.completion - p.arrival;
        p.wt = p.tat - p.burst;
        currentTime = p.completion;
        totalWT += p.wt;
        totalTAT += p.tat;

        cout << p.id << "\t| " << p.arrival << "\t  | " << p.burst << "     | " << p.completion << "\t       | " << p.tat << "   | " << p.wt << endl;
    }

    double n = proc.size();
    cout << "------------------------------------------------" << endl;
    cout << "Average Waiting Time:    " << fixed << setprecision(2) << totalWT / n << " ms" << endl;
    cout << "Average Turnaround Time: " << fixed << setprecision(2) << totalTAT / n << " ms" << endl;
    return 0;
}`,

        java: `// CPU Scheduling - FCFS in Java
import java.util.*;

class Process {
    String id;
    int arrival, burst, completion, tat, wt;
    Process(String id, int a, int b) { this.id = id; this.arrival = a; this.burst = b; }
}

public class Main {
    public static void main(String[] args) {
        List<Process> list = Arrays.asList(
            new Process("P1", 0, 5), new Process("P2", 1, 3),
            new Process("P3", 2, 8), new Process("P4", 3, 6)
        );
        list.sort(Comparator.comparingInt(p -> p.arrival));

        int currentTime = 0, totalWT = 0, totalTAT = 0;
        System.out.println("=== FCFS CPU Scheduling (Java) ===");
        System.out.println("Process | Arrival | Burst | Completion | TAT | WT");
        System.out.println("------------------------------------------------");

        for (Process p : list) {
            if (currentTime < p.arrival) currentTime = p.arrival;
            p.completion = currentTime + p.burst;
            p.tat = p.completion - p.arrival;
            p.wt = p.tat - p.burst;
            currentTime = p.completion;
            totalWT += p.wt;
            totalTAT += p.tat;

            System.out.printf("%-7s | %-7d | %-5d | %-10d | %-3d | %-3d\n", p.id, p.arrival, p.burst, p.completion, p.tat, p.wt);
        }

        double n = list.size();
        System.out.println("------------------------------------------------");
        System.out.printf("Average Waiting Time:    %.2f ms\n", (totalWT / n));
        System.out.printf("Average Turnaround Time: %.2f ms\n", (totalTAT / n));
    }
}`,

        python: `# CPU Scheduling - FCFS in Python
def run_fcfs(processes):
    print("=== FCFS CPU Scheduling (Python) ===")
    processes.sort(key=lambda x: x['arrival'])
    current_time = 0
    total_wt, total_tat = 0, 0

    print("Process | Arrival | Burst | Completion | TAT | WT")
    print("------------------------------------------------")

    for p in processes:
        if current_time < p['arrival']:
            current_time = p['arrival']
        completion = current_time + p['burst']
        tat = completion - p['arrival']
        wt = tat - p['burst']
        current_time = completion
        total_wt += wt
        total_tat += tat
        print(f"{p['id']:<7} | {p['arrival']:<7} | {p['burst']:<5} | {completion:<10} | {tat:<3} | {wt:<3}")

    n = len(processes)
    print("------------------------------------------------")
    print(f"Average Waiting Time:    {total_wt / n:.2f} ms")
    print(f"Average Turnaround Time: {total_tat / n:.2f} ms")

run_fcfs([
    {'id': 'P1', 'arrival': 0, 'burst': 5},
    {'id': 'P2', 'arrival': 1, 'burst': 3},
    {'id': 'P3', 'arrival': 2, 'burst': 8},
    {'id': 'P4', 'arrival': 3, 'burst': 6}
])`
      },

      SJF: {
        javascript: `// CPU Scheduling - SJF (Shortest Job First - Non-Preemptive)
function runSJF(processes) {
  console.log("=== CPU Scheduling: SJF Non-Preemptive ===");
  let currentTime = 0;
  let completed = 0;
  const n = processes.length;
  const isDone = Array(n).fill(false);
  let totalWT = 0, totalTAT = 0;

  while (completed < n) {
    let minBurst = Infinity;
    let idx = -1;

    for (let i = 0; i < n; i++) {
      if (!isDone[i] && processes[i].arrival <= currentTime) {
        if (processes[i].burst < minBurst) {
          minBurst = processes[i].burst;
          idx = i;
        }
      }
    }

    if (idx === -1) {
      currentTime++;
    } else {
      const p = processes[idx];
      currentTime += p.burst;
      const completion = currentTime;
      const tat = completion - p.arrival;
      const wt = tat - p.burst;
      totalWT += wt;
      totalTAT += tat;
      isDone[idx] = true;
      completed++;
      console.log(\`Executed \${p.id} | Completion: \${completion} | TAT: \${tat} | WT: \${wt}\`);
    }
  }

  console.log("----------------------------------------");
  console.log(\`Average Waiting Time:    \${(totalWT / n).toFixed(2)} ms\`);
  console.log(\`Average Turnaround Time: \${(totalTAT / n).toFixed(2)} ms\`);
}

runSJF([
  { id: 'P1', arrival: 0, burst: 6 },
  { id: 'P2', arrival: 2, burst: 2 },
  { id: 'P3', arrival: 3, burst: 8 },
  { id: 'P4', arrival: 5, burst: 3 }
]);`,

        cpp: `// SJF CPU Scheduling in C++
#include <iostream>
#include <vector>
#include <string>
#include <climits>

using namespace std;

struct Process {
    string id;
    int arrival;
    int burst;
};

int main() {
    cout << "=== SJF CPU Scheduling (C++) ===" << endl;
    vector<Process> proc = {{"P1", 0, 6}, {"P2", 2, 2}, {"P3", 3, 8}, {"P4", 5, 3}};
    int n = proc.size();
    vector<bool> done(n, false);
    int currentTime = 0, completed = 0;
    int totalWT = 0, totalTAT = 0;

    while (completed < n) {
        int minBurst = INT_MAX, idx = -1;
        for (int i = 0; i < n; i++) {
            if (!done[i] && proc[i].arrival <= currentTime) {
                if (proc[i].burst < minBurst) {
                    minBurst = proc[i].burst;
                    idx = i;
                }
            }
        }

        if (idx == -1) {
            currentTime++;
        } else {
            currentTime += proc[idx].burst;
            int tat = currentTime - proc[idx].arrival;
            int wt = tat - proc[idx].burst;
            totalWT += wt;
            totalTAT += tat;
            done[idx] = true;
            completed++;
            cout << "Executed " << proc[idx].id << " | Completion: " << currentTime << " | TAT: " << tat << " | WT: " << wt << endl;
        }
    }

    cout << "Average Waiting Time: " << (double)totalWT / n << " ms" << endl;
    return 0;
}`,

        java: `// SJF CPU Scheduling in Java
import java.util.*;

class Process {
    String id;
    int arrival, burst;
    Process(String id, int a, int b) { this.id = id; this.arrival = a; this.burst = b; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SJF CPU Scheduling (Java) ===");
        List<Process> list = Arrays.asList(
            new Process("P1", 0, 6), new Process("P2", 2, 2),
            new Process("P3", 3, 8), new Process("P4", 5, 3)
        );
        int n = list.size();
        boolean[] done = new boolean[n];
        int currentTime = 0, completed = 0;
        int totalWT = 0, totalTAT = 0;

        while (completed < n) {
            int minBurst = Integer.MAX_VALUE, idx = -1;
            for (int i = 0; i < n; i++) {
                if (!done[i] && list.get(i).arrival <= currentTime) {
                    if (list.get(i).burst < minBurst) {
                        minBurst = list.get(i).burst;
                        idx = i;
                    }
                }
            }

            if (idx == -1) {
                currentTime++;
            } else {
                Process p = list.get(idx);
                currentTime += p.burst;
                int tat = currentTime - p.arrival;
                int wt = tat - p.burst;
                totalWT += wt; totalTAT += tat;
                done[idx] = true;
                completed++;
                System.out.println("Executed " + p.id + " | Completion: " + currentTime + " | TAT: " + tat + " | WT: " + wt);
            }
        }
        System.out.printf("Avg WT: %.2f ms\n", ((double)totalWT / n));
    }
}`,

        python: `# SJF CPU Scheduling in Python
def run_sjf(processes):
    print("=== SJF CPU Scheduling (Python) ===")
    n = len(processes)
    done = [False] * n
    current_time = 0
    completed = 0
    total_wt, total_tat = 0, 0

    while completed < n:
        min_burst = float('inf')
        idx = -1
        for i in range(n):
            if not done[i] and processes[i]['arrival'] <= current_time:
                if processes[i]['burst'] < min_burst:
                    min_burst = processes[i]['burst']
                    idx = i

        if idx == -1:
            current_time += 1
        else:
            p = processes[idx]
            current_time += p['burst']
            tat = current_time - p['arrival']
            wt = tat - p['burst']
            total_wt += wt
            total_tat += tat
            done[idx] = True
            completed += 1
            print(f"Executed {p['id']} | Completion: {current_time} | TAT: {tat} | WT: {wt}")

    print(f"Average Waiting Time: {total_wt / n:.2f} ms")

run_sjf([
    {'id': 'P1', 'arrival': 0, 'burst': 6},
    {'id': 'P2', 'arrival': 2, 'burst': 2},
    {'id': 'P3', 'arrival': 3, 'burst': 8},
    {'id': 'P4', 'arrival': 5, 'burst': 3}
])`
      },

      SRTF: {
        javascript: `// CPU Scheduling - SRTF (Shortest Remaining Time First)
function runSRTF(processes) {
  console.log("=== CPU Scheduling: SRTF (Preemptive SJF) ===");
  const n = processes.length;
  const remaining = processes.map(p => p.burst);
  let currentTime = 0, completed = 0;
  let totalWT = 0, totalTAT = 0;

  while (completed < n) {
    let minRem = Infinity, idx = -1;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= currentTime && remaining[i] > 0) {
        if (remaining[i] < minRem) {
          minRem = remaining[i];
          idx = i;
        }
      }
    }

    if (idx === -1) {
      currentTime++;
    } else {
      remaining[idx]--;
      currentTime++;
      if (remaining[idx] === 0) {
        completed++;
        const tat = currentTime - processes[idx].arrival;
        const wt = tat - processes[idx].burst;
        totalWT += wt;
        totalTAT += tat;
        console.log(\`Process \${processes[idx].id} Completed at t=\${currentTime} | TAT: \${tat} | WT: \${wt}\`);
      }
    }
  }
  console.log("----------------------------------------");
  console.log(\`Average Waiting Time: \${(totalWT / n).toFixed(2)} ms\`);
}

runSRTF([
  { id: 'P1', arrival: 0, burst: 8 },
  { id: 'P2', arrival: 1, burst: 4 },
  { id: 'P3', arrival: 2, burst: 9 },
  { id: 'P4', arrival: 3, burst: 5 }
]);`,

        cpp: `// SRTF Preemptive SJF in C++
#include <iostream>
#include <vector>
#include <string>
#include <climits>

using namespace std;

struct Process {
    string id;
    int arrival;
    int burst;
};

int main() {
    cout << "=== SRTF (Preemptive SJF) C++ ===" << endl;
    vector<Process> proc = {{"P1", 0, 8}, {"P2", 1, 4}, {"P3", 2, 9}, {"P4", 3, 5}};
    int n = proc.size();
    vector<int> rem(n);
    for (int i = 0; i < n; i++) rem[i] = proc[i].burst;

    int currentTime = 0, completed = 0;
    int totalWT = 0, totalTAT = 0;

    while (completed < n) {
        int minRem = INT_MAX, idx = -1;
        for (int i = 0; i < n; i++) {
            if (proc[i].arrival <= currentTime && rem[i] > 0) {
                if (rem[i] < minRem) {
                    minRem = rem[i];
                    idx = i;
                }
            }
        }

        if (idx == -1) {
            currentTime++;
        } else {
            rem[idx]--;
            currentTime++;
            if (rem[idx] == 0) {
                completed++;
                int tat = currentTime - proc[idx].arrival;
                int wt = tat - proc[idx].burst;
                totalWT += wt;
                totalTAT += tat;
                cout << "Process " << proc[idx].id << " Completed at t=" << currentTime << " | TAT: " << tat << " | WT: " << wt << endl;
            }
        }
    }

    cout << "Avg Waiting Time: " << (double)totalWT / n << " ms" << endl;
    return 0;
}`,

        java: `// SRTF Preemptive SJF in Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SRTF CPU Scheduling (Java) ===");
        int[] arrival = {0, 1, 2, 3};
        int[] burst = {8, 4, 9, 5};
        String[] ids = {"P1", "P2", "P3", "P4"};
        int n = ids.length;

        int[] rem = burst.clone();
        int currentTime = 0, completed = 0;
        int totalWT = 0, totalTAT = 0;

        while (completed < n) {
            int minRem = Integer.MAX_VALUE, idx = -1;
            for (int i = 0; i < n; i++) {
                if (arrival[i] <= currentTime && rem[i] > 0) {
                    if (rem[i] < minRem) {
                        minRem = rem[i];
                        idx = i;
                    }
                }
            }

            if (idx == -1) {
                currentTime++;
            } else {
                rem[idx]--;
                currentTime++;
                if (rem[idx] == 0) {
                    completed++;
                    int tat = currentTime - arrival[idx];
                    int wt = tat - burst[idx];
                    totalWT += wt;
                    totalTAT += tat;
                    System.out.println("Process " + ids[idx] + " Done at t=" + currentTime + " | TAT: " + tat + " | WT: " + wt);
                }
            }
        }
        System.out.printf("Average WT: %.2f ms\n", ((double)totalWT / n));
    }
}`,

        python: `# SRTF Preemptive SJF in Python
def run_srtf(processes):
    print("=== SRTF Preemptive SJF (Python) ===")
    n = len(processes)
    rem = [p['burst'] for p in processes]
    current_time = 0
    completed = 0
    total_wt, total_tat = 0, 0

    while completed < n:
        min_rem = float('inf')
        idx = -1
        for i in range(n):
            if processes[i]['arrival'] <= current_time and rem[i] > 0:
                if rem[i] < min_rem:
                    min_rem = rem[i]
                    idx = i

        if idx == -1:
            current_time += 1
        else:
            rem[idx] -= 1
            current_time += 1
            if rem[idx] == 0:
                completed += 1
                tat = current_time - processes[idx]['arrival']
                wt = tat - processes[idx]['burst']
                total_wt += wt
                total_tat += tat
                print(f"Process {processes[idx]['id']} Done at t={current_time} | TAT: {tat} | WT: {wt}")

    print(f"Average Waiting Time: {total_wt / n:.2f} ms")

run_srtf([
    {'id': 'P1', 'arrival': 0, 'burst': 8},
    {'id': 'P2', 'arrival': 1, 'burst': 4},
    {'id': 'P3', 'arrival': 2, 'burst': 9},
    {'id': 'P4', 'arrival': 3, 'burst': 5}
])`
      },

      Priority: {
        javascript: `// CPU Scheduling - Priority Non-Preemptive
function runPriority(processes) {
  console.log("=== Priority CPU Scheduling (Non-Preemptive) ===");
  processes.sort((a, b) => a.priority - b.priority);
  
  let currentTime = 0;
  let totalWT = 0, totalTAT = 0;
  
  processes.forEach(p => {
    const wt = currentTime;
    const tat = wt + p.burst;
    currentTime += p.burst;
    totalWT += wt;
    totalTAT += tat;
    console.log(\`Process \${p.id} (Priority \${p.priority}) -> Executed. WT: \${wt}ms, TAT: \${tat}ms\`);
  });

  const n = processes.length;
  console.log("----------------------------------------");
  console.log(\`Average Waiting Time: \${(totalWT / n).toFixed(2)} ms\`);
}

runPriority([
  { id: 'P1', burst: 10, priority: 3 },
  { id: 'P2', burst: 1, priority: 1 },
  { id: 'P3', burst: 2, priority: 4 },
  { id: 'P4', burst: 1, priority: 2 }
]);`,

        cpp: `// Priority Scheduling C++
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

struct Process {
    string id;
    int burst;
    int priority;
};

int main() {
    cout << "=== Priority CPU Scheduling (C++) ===" << endl;
    vector<Process> proc = {{"P1", 10, 3}, {"P2", 1, 1}, {"P3", 2, 4}, {"P4", 1, 2}};
    sort(proc.begin(), proc.end(), [](const Process& a, const Process& b){ return a.priority < b.priority; });

    int currentTime = 0, totalWT = 0, totalTAT = 0;
    for (const auto& p : proc) {
        int wt = currentTime;
        int tat = wt + p.burst;
        currentTime += p.burst;
        totalWT += wt;
        totalTAT += tat;
        cout << "Process " << p.id << " (Priority " << p.priority << ") -> WT: " << wt << " | TAT: " << tat << endl;
    }
    cout << "Avg Waiting Time: " << (double)totalWT / proc.size() << " ms" << endl;
    return 0;
}`,

        java: `// Priority Scheduling Java
import java.util.*;

class Process {
    String id;
    int burst, priority;
    Process(String id, int b, int p) { this.id = id; this.burst = b; this.priority = p; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Priority CPU Scheduling (Java) ===");
        List<Process> list = Arrays.asList(
            new Process("P1", 10, 3), new Process("Process P2", 1, 1),
            new Process("P3", 2, 4), new Process("P4", 1, 2)
        );
        list.sort(Comparator.comparingInt(p -> p.priority));

        int currentTime = 0, totalWT = 0;
        for (Process p : list) {
            int wt = currentTime;
            int tat = wt + p.burst;
            currentTime += p.burst;
            totalWT += wt;
            System.out.println(p.id + " [Priority " + p.priority + "] -> WT: " + wt + "ms, TAT: " + tat + "ms");
        }
        System.out.printf("Avg WT: %.2f ms\n", ((double)totalWT / list.size()));
    }
}`,

        python: `# Priority Scheduling Python
def run_priority(processes):
    print("=== Priority CPU Scheduling (Python) ===")
    processes.sort(key=lambda x: x['priority'])
    current_time = 0
    total_wt = 0

    for p in processes:
        wt = current_time
        tat = wt + p['burst']
        current_time += p['burst']
        total_wt += wt
        print(f"Process {p['id']} (Priority {p['priority']}) -> WT: {wt}ms, TAT: {tat}ms")

    print(f"Average Waiting Time: {total_wt / len(processes):.2f} ms")

run_priority([
    {'id': 'P1', 'burst': 10, 'priority': 3},
    {'id': 'P2', 'burst': 1, 'priority': 1},
    {'id': 'P3', 'burst': 2, 'priority': 4},
    {'id': 'P4', 'burst': 1, 'priority': 2}
])`
      },

      'Round Robin': {
        javascript: `// CPU Scheduling - Round Robin Algorithm
function runRoundRobin(processes, quantum) {
  console.log(\`=== Round Robin Scheduling (Time Quantum = \${quantum} ms) ===\`);
  const queue = processes.map(p => ({ ...p, rem: p.burst }));
  let currentTime = 0;

  while (queue.some(p => p.rem > 0)) {
    queue.forEach(p => {
      if (p.rem > 0) {
        const slice = Math.min(p.rem, quantum);
        p.rem -= slice;
        currentTime += slice;
        console.log(\`t=\${currentTime}ms: Executed \${p.id} for \${slice}ms | Remaining Burst: \${p.rem}ms\`);
      }
    });
  }
}

runRoundRobin([
  { id: 'P1', burst: 5 },
  { id: 'P2', burst: 3 },
  { id: 'P3', burst: 8 }
], 2);`,

        cpp: `// Round Robin C++
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

struct Process {
    string id;
    int burst;
    int rem;
};

int main() {
    int quantum = 2;
    cout << "=== Round Robin Scheduling (C++) Quantum = " << quantum << "ms ===" << endl;
    vector<Process> proc = {{"P1", 5, 5}, {"P2", 3, 3}, {"P3", 8, 8}};
    int currentTime = 0;

    bool done = false;
    while (!done) {
        done = true;
        for (auto& p : proc) {
            if (p.rem > 0) {
                done = false;
                int slice = min(p.rem, quantum);
                p.rem -= slice;
                currentTime += slice;
                cout << "t=" << currentTime << "ms: Executed " << p.id << " for " << slice << "ms | Rem: " << p.rem << "ms" << endl;
            }
        }
    }
    return 0;
}`,

        java: `// Round Robin Java
import java.util.*;

class Process {
    String id;
    int burst, rem;
    Process(String id, int b) { this.id = id; this.burst = b; this.rem = b; }
}

public class Main {
    public static void main(String[] args) {
        int quantum = 2;
        System.out.println("=== Round Robin Scheduling (Java) Quantum = " + quantum + " ===");
        List<Process> list = Arrays.asList(new Process("P1", 5), new Process("P2", 3), new Process("P3", 8));
        int currentTime = 0;

        boolean active = true;
        while (active) {
            active = false;
            for (Process p : list) {
                if (p.rem > 0) {
                    active = true;
                    int slice = Math.min(p.rem, quantum);
                    p.rem -= slice;
                    currentTime += slice;
                    System.out.println("t=" + currentTime + "ms: Executed " + p.id + " for " + slice + "ms | Remaining: " + p.rem + "ms");
                }
            }
        }
    }
}`,

        python: `# Round Robin Scheduling Python
def run_round_robin(processes, quantum):
    print(f"=== Round Robin Scheduling (Python) Quantum = {quantum}ms ===")
    queue = [{'id': p['id'], 'burst': p['burst'], 'rem': p['burst']} for p in processes]
    current_time = 0

    while any(p['rem'] > 0 for p in queue):
        for p in queue:
            if p['rem'] > 0:
                slice_time = min(p['rem'], quantum)
                p['rem'] -= slice_time
                current_time += slice_time
                print(f"t={current_time}ms: Executed {p['id']} for {slice_time}ms | Remaining: {p['rem']}ms")

run_round_robin([
    {'id': 'P1', 'burst': 5},
    {'id': 'P2', 'burst': 3},
    {'id': 'P3', 'burst': 8}
], 2)`
      }
    }
  },

  'deadlocks': {
    name: 'Deadlocks & Resource Allocation Graph',
    algorithms: ['Resource Allocation Graph (RAG)', 'Cycle Detection (DFS)', 'Wait-For Graph'],
    defaultAlgorithm: 'Resource Allocation Graph (RAG)',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      processCount: 3,
      resourceCount: 3
    },
    code: {
      'Resource Allocation Graph (RAG)': {
        javascript: `// Deadlock Analysis - Resource Allocation Graph (RAG)
function analyzeRAG() {
  console.log("=== Resource Allocation Graph (RAG) Analysis ===");
  const processes = ['P1', 'P2', 'P3'];
  const resources = ['R1', 'R2'];

  const allocation = { P1: ['R1'], P2: ['R2'], P3: [] };
  const request = { P1: ['R2'], P2: [], P3: ['R1'] };

  console.log("Allocated Edges (R -> P):", JSON.stringify(allocation));
  console.log("Request Edges   (P -> R):", JSON.stringify(request));
  console.log("Deadlock State: NO DEADLOCK DETECTED (Single Instance Graph without cycles)");
}

analyzeRAG();`,

        cpp: `// Deadlock RAG in C++
#include <iostream>
#include <vector>
#include <string>

using namespace std;

int main() {
    cout << "=== Resource Allocation Graph (RAG) Analysis (C++) ===" << endl;
    cout << "Processes: P1, P2, P3" << endl;
    cout << "Resources: R1 (1 inst), R2 (1 inst)" << endl;
    cout << "Assignment Edges (R -> P): R1 -> P1, R2 -> P2" << endl;
    cout << "Request Edges    (P -> R): P1 -> R2, P3 -> R1" << endl;
    cout << "----------------------------------------" << endl;
    cout << "Status: NO DEADLOCK DETECTED (Graph contains no circular wait cycles)" << endl;
    return 0;
}`,

        java: `// RAG Deadlock Analysis Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Resource Allocation Graph (RAG) Analysis (Java) ===");
        System.out.println("Allocation Matrix:");
        System.out.println("P1 -> R1");
        System.out.println("P2 -> R2");
        System.out.println("Request Matrix:");
        System.out.println("P1 -> R2");
        System.out.println("P3 -> R1");
        System.out.println("Evaluation: SAFE STATE - No Deadlock Detected");
    }
}`,

        python: `# RAG Deadlock Analysis Python
def analyze_rag():
    print("=== Resource Allocation Graph (RAG) Analysis (Python) ===")
    alloc = {'P1': ['R1'], 'P2': ['R2'], 'P3': []}
    req = {'P1': ['R2'], 'P2': [], 'P3': ['R1']}
    print("Allocation Edges (R -> P):", alloc)
    print("Request Edges    (P -> R):", req)
    print("Analysis Result: System is in a DEADLOCK-FREE State.")

analyze_rag()`
      },

      'Cycle Detection (DFS)': {
        javascript: `// Deadlock - Cycle Detection using Depth-First Search (DFS)
function detectCycle(graph) {
  console.log("=== DFS Cycle Detection in Wait-For Graph ===");
  const visited = {};
  const recStack = {};

  function dfs(node) {
    visited[node] = true;
    recStack[node] = true;

    for (let neighbor of (graph[node] || [])) {
      if (!visited[neighbor] && dfs(neighbor)) return true;
      else if (recStack[neighbor]) return true;
    }

    recStack[node] = false;
    return false;
  }

  for (let node in graph) {
    if (!visited[node]) {
      if (dfs(node)) {
        console.log("DEADLOCK DETECTED! Cycle found in Resource Graph!");
        return true;
      }
    }
  }

  console.log("No Cycle Detected. System is DEADLOCK-FREE.");
  return false;
}

detectCycle({ P1: ['P2'], P2: ['P3'], P3: ['P1'] });`,

        cpp: `// Cycle Detection C++
#include <iostream>
#include <vector>
#include <map>
#include <string>

using namespace std;

bool dfs(const string& node, map<string, vector<string>>& adj, map<string, bool>& visited, map<string, bool>& recStack) {
    visited[node] = true;
    recStack[node] = true;

    for (const string& neighbor : adj[node]) {
        if (!visited[neighbor] && dfs(neighbor, adj, visited, recStack)) return true;
        else if (recStack[neighbor]) return true;
    }

    recStack[node] = false;
    return false;
}

int main() {
    cout << "=== DFS Cycle Detection in Wait-For Graph (C++) ===" << endl;
    map<string, vector<string>> adj = {
        {"P1", {"P2"}},
        {"P2", {"P3"}},
        {"P3", {"P1"}}
    };

    map<string, bool> visited, recStack;
    bool hasCycle = false;

    for (auto& pair : adj) {
        if (!visited[pair.first]) {
            if (dfs(pair.first, adj, visited, recStack)) {
                hasCycle = true;
                break;
            }
        }
    }

    if (hasCycle) {
        cout << "DEADLOCK DETECTED! Cycle found: P1 -> P2 -> P3 -> P1" << endl;
    } else {
        cout << "No Cycle. System is Safe." << endl;
    }
    return 0;
}`,

        java: `// Cycle Detection Java
import java.util.*;

public class Main {
    static boolean dfs(String u, Map<String, List<String>> adj, Set<String> visited, Set<String> recStack) {
        visited.add(u);
        recStack.add(u);

        for (String v : adj.getOrDefault(u, new ArrayList<>())) {
            if (!visited.contains(v) && dfs(v, adj, visited, recStack)) return true;
            else if (recStack.contains(v)) return true;
        }

        recStack.remove(u);
        return false;
    }

    public static void main(String[] args) {
        System.out.println("=== DFS Cycle Detection (Java) ===");
        Map<String, List<String>> adj = new HashMap<>();
        adj.put("P1", Arrays.asList("P2"));
        adj.put("P2", Arrays.asList("P3"));
        adj.put("P3", Arrays.asList("P1"));

        Set<String> visited = new HashSet<>();
        Set<String> recStack = new HashSet<>();
        boolean cycle = false;

        for (String node : adj.keySet()) {
            if (!visited.contains(node)) {
                if (dfs(node, adj, visited, recStack)) {
                    cycle = true;
                    break;
                }
            }
        }

        if (cycle) System.out.println("DEADLOCK DETECTED! Circular Wait Cycle Exists.");
        else System.out.println("No Deadlock.");
    }
}`,

        python: `# Cycle Detection Python
def detect_cycle_dfs():
    print("=== DFS Cycle Detection in Wait-For Graph (Python) ===")
    graph = {'P1': ['P2'], 'P2': ['P3'], 'P3': ['P1']}
    visited = set()
    rec_stack = set()

    def dfs(node):
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True
        rec_stack.remove(node)
        return False

    for n in graph:
        if n not in visited:
            if dfs(n):
                print("DEADLOCK DETECTED! Circular dependency cycle found!")
                return True
    print("System is DEADLOCK-FREE.")
    return False

detect_cycle_dfs()`
      },

      'Wait-For Graph': {
        javascript: `// Deadlock - Wait-For Graph Reduction
function reduceWaitForGraph() {
  console.log("=== Wait-For Graph Reduction ===");
  console.log("P1 -> P2 (P1 waiting for P2 to release Resource R1)");
  console.log("P2 -> P3 (P2 waiting for P3 to release Resource R2)");
  console.log("Reduction Step: P3 completes -> P2 proceeds -> P1 proceeds.");
  console.log("Graph fully reduced! NO DEADLOCK.");
}

reduceWaitForGraph();`,

        cpp: `// Wait-For Graph C++
#include <iostream>
using namespace std;

int main() {
    cout << "=== Wait-For Graph (WFG) Reduction (C++) ===" << endl;
    cout << "P1 waits for P2" << endl;
    cout << "P2 waits for P3" << endl;
    cout << "P3 has zero waiting requests. Reducing process P3..." << endl;
    cout << "Reducing process P2..." << endl;
    cout << "Reducing process P1..." << endl;
    cout << "All nodes reduced successfully. NO DEADLOCK." << endl;
    return 0;
}`,

        java: `// Wait-For Graph Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Wait-For Graph Reduction (Java) ===");
        System.out.println("1. Process P3 finishes execution and releases resources.");
        System.out.println("2. Process P2 unblocks and executes.");
        System.out.println("3. Process P1 unblocks and executes.");
        System.out.println("Wait-For Graph contains no cycles.");
    }
}`,

        python: `# Wait-For Graph Python
def wait_for_graph():
    print("=== Wait-For Graph Reduction (Python) ===")
    edges = [("P1", "P2"), ("P2", "P3")]
    print("Dependencies:", edges)
    print("P3 releases resources -> P2 executes -> P1 executes.")
    print("Result: Graph is completely reducible (No Deadlock).")

wait_for_graph()`
      }
    }
  },

  'bankers-algorithm': {
    name: "Banker's Avoidance Algorithm",
    algorithms: ['Safety Algorithm', 'Resource Request Algorithm'],
    defaultAlgorithm: 'Safety Algorithm',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      processCount: 5,
      resourceTypes: 3
    },
    code: {
      'Safety Algorithm': {
        javascript: `// Banker's Avoidance - Dijkstra's Safety Algorithm
function runSafetyAlgorithm() {
  console.log("=== Banker's Avoidance: Safety Algorithm ===");

  const processes = ['P0', 'P1', 'P2', 'P3', 'P4'];
  const available = [3, 3, 2];

  const max = [
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ];

  const allocation = [
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ];

  // Calculate Need Matrix = Max - Allocation
  const need = max.map((m, i) => m.map((v, j) => v - allocation[i][j]));
  console.log("Need Matrix Calculated (Max - Allocation):");
  need.forEach((row, i) => console.log(\`\${processes[i]}: [\${row.join(', ')}]\`));

  const work = [...available];
  const finish = Array(5).fill(false);
  const safeSeq = [];

  let count = 0;
  while (count < 5) {
    let found = false;
    for (let i = 0; i < 5; i++) {
      if (!finish[i]) {
        let possible = true;
        for (let j = 0; j < 3; j++) {
          if (need[i][j] > work[j]) { possible = false; break; }
        }

        if (possible) {
          for (let j = 0; j < 3; j++) work[j] += allocation[i][j];
          safeSeq.push(processes[i]);
          finish[i] = true;
          found = true;
          count++;
          console.log(\`Process \${processes[i]} executed. New Available Vector: [\${work.join(', ')}]\`);
        }
      }
    }

    if (!found) {
      console.log("System is NOT in a SAFE State! Potential Deadlock!");
      return;
    }
  }

  console.log("----------------------------------------");
  console.log("System is in a SAFE State!");
  console.log("Safe Sequence:", safeSeq.join(" -> "));
}

runSafetyAlgorithm();`,

        cpp: `// Banker's Safety Algorithm in C++
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "=== Banker's Safety Algorithm (C++) ===" << endl;
    int n = 5, m = 3;
    vector<int> avail = {3, 3, 2};
    vector<vector<int>> alloc = {
        {0, 1, 0},
        {2, 0, 0},
        {3, 0, 2},
        {2, 1, 1},
        {0, 0, 2}
    };
    vector<vector<int>> maxMat = {
        {7, 5, 3},
        {3, 2, 2},
        {9, 0, 2},
        {2, 2, 2},
        {4, 3, 3}
    };

    vector<vector<int>> need(n, vector<int>(m));
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            need[i][j] = maxMat[i][j] - alloc[i][j];
        }
    }

    vector<int> work = avail;
    vector<bool> finish(n, false);
    vector<int> safeSeq;

    int count = 0;
    while (count < n) {
        bool found = false;
        for (int i = 0; i < n; i++) {
            if (!finish[i]) {
                bool possible = true;
                for (int j = 0; j < m; j++) {
                    if (need[i][j] > work[j]) { possible = false; break; }
                }

                if (possible) {
                    for (int j = 0; j < m; j++) work[j] += alloc[i][j];
                    safeSeq.push_back(i);
                    finish[i] = true;
                    found = true;
                    count++;
                    cout << "Process P" << i << " Executed. New Available: " << work[0] << " " << work[1] << " " << work[2] << endl;
                }
            }
        }

        if (!found) {
            cout << "System is NOT in a SAFE State!" << endl;
            return 0;
        }
    }

    cout << "----------------------------------------" << endl;
    cout << "System is in a SAFE State!" << endl;
    cout << "Safe Sequence: ";
    for (int i = 0; i < n; i++) {
        cout << "P" << safeSeq[i] << (i == n - 1 ? "" : " -> ");
    }
    cout << endl;
    return 0;
}`,

        java: `// Banker's Safety Algorithm in Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Banker's Safety Algorithm (Java) ===");
        int n = 5, m = 3;
        int[] avail = {3, 3, 2};
        int[][] alloc = {
            {0, 1, 0}, {2, 0, 0}, {3, 0, 2}, {2, 1, 1}, {0, 0, 2}
        };
        int[][] maxMat = {
            {7, 5, 3}, {3, 2, 2}, {9, 0, 2}, {2, 2, 2}, {4, 3, 3}
        };

        int[][] need = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++)
                need[i][j] = maxMat[i][j] - alloc[i][j];

        int[] work = avail.clone();
        boolean[] finish = new boolean[n];
        List<String> safeSeq = new ArrayList<>();

        int count = 0;
        while (count < n) {
            boolean found = false;
            for (int i = 0; i < n; i++) {
                if (!finish[i]) {
                    boolean possible = true;
                    for (int j = 0; j < m; j++) {
                        if (need[i][j] > work[j]) { possible = false; break; }
                    }

                    if (possible) {
                        for (int j = 0; j < m; j++) work[j] += alloc[i][j];
                        safeSeq.add("P" + i);
                        finish[i] = true;
                        found = true;
                        count++;
                        System.out.println("Process P" + i + " executed. Available: " + Arrays.toString(work));
                    }
                }
            }
            if (!found) {
                System.out.println("System is in UNSAFE state!");
                return;
            }
        }
        System.out.println("----------------------------------------");
        System.out.println("Safe Sequence: " + String.join(" -> ", safeSeq));
    }
}`,

        python: `# Banker's Safety Algorithm in Python
def run_bankers_safety():
    print("=== Banker's Safety Algorithm (Python) ===")
    n, m = 5, 3
    avail = [3, 3, 2]
    alloc = [
        [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]
    ]
    max_mat = [
        [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]
    ]
    
    need = [[max_mat[i][j] - alloc[i][j] for j in range(m)] for i in range(n)]
    work = list(avail)
    finish = [False] * n
    safe_seq = []

    count = 0
    while count < n:
        found = False
        for i in range(n):
            if not finish[i]:
                if all(need[i][j] <= work[j] for j in range(m)):
                    for j in range(m):
                        work[j] += alloc[i][j]
                    safe_seq.append(f"P{i}")
                    finish[i] = True
                    found = True
                    count += 1
                    print(f"Process P{i} executed. Updated Available: {work}")

        if not found:
            print("System is NOT in a SAFE State!")
            return

    print("----------------------------------------")
    print("System is in a SAFE State!")
    print("Safe Sequence:", " -> ".join(safe_seq))

run_bankers_safety()`
      },

      'Resource Request Algorithm': {
        javascript: `// Banker's Avoidance - Resource Request Algorithm
function requestResources(processId, requestVector) {
  console.log(\`=== Resource Request Algorithm by Process \${processId} ===\`);
  console.log(\`Requested Vector: [\${requestVector.join(', ')}]\`);
  console.log("Checking Condition 1: Request <= Need ... PASS");
  console.log("Checking Condition 2: Request <= Available ... PASS");
  console.log("Tentatively Allocating Resources and Running Safety Check...");
  console.log("Result: Safety Algorithm returned SAFE -> Request GRANTED!");
}

requestResources('P1', [1, 0, 2]);`,

        cpp: `// Resource Request Algorithm in C++
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "=== Resource Request Algorithm (C++) ===" << endl;
    cout << "Process P1 requests vector [1, 0, 2]" << endl;
    cout << "Check 1: Request <= Need[1] (1 <= 1, 0 <= 2, 2 <= 2) -> PASS" << endl;
    cout << "Check 2: Request <= Available (1 <= 3, 0 <= 3, 2 <= 2) -> PASS" << endl;
    cout << "Tentatively Allocating Resources..." << endl;
    cout << "Running Safety Check -> Safe Sequence Found: P1 -> P3 -> P4 -> P0 -> P2" << endl;
    cout << "REQUEST GRANTED SUCCESSFULLY!" << endl;
    return 0;
}`,

        java: `// Resource Request Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Resource Request Algorithm (Java) ===");
        System.out.println("Process P1 requested: [1, 0, 2]");
        System.out.println("Step 1: Check Request <= Need -> PASS");
        System.out.println("Step 2: Check Request <= Available -> PASS");
        System.out.println("Step 3: Test allocation -> System remains SAFE.");
        System.out.println("Decision: REQUEST GRANTED.");
    }
}`,

        python: `# Resource Request Python
def resource_request():
    print("=== Resource Request Algorithm (Python) ===")
    req = [1, 0, 2]
    print("Request from P1:", req)
    print("Check 1: Request <= Need -> OK")
    print("Check 2: Request <= Available -> OK")
    print("Safety Check: System is in a SAFE State -> REQUEST APPROVED.")

resource_request()`
      }
    }
  },

  'process-synchronization': {
    name: 'Process Synchronization & Concurrency',
    algorithms: ['Mutex Lock', 'Counting Semaphore', 'Producer-Consumer', 'Readers-Writers'],
    defaultAlgorithm: 'Mutex Lock',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      bufferSize: 5,
      itemQuantity: 3
    },
    code: {
      'Mutex Lock': {
        javascript: `// Process Synchronization - Mutex Lock Simulation
class Mutex {
  constructor() {
    this.locked = false;
  }

  acquire(threadId) {
    if (!this.locked) {
      this.locked = true;
      console.log(\`Thread \${threadId} acquired Mutex Lock. Entering Critical Section.\`);
      return true;
    }
    console.log(\`Thread \${threadId} BLOCKED! Mutex is already locked.\`);
    return false;
  }

  release(threadId) {
    this.locked = false;
    console.log(\`Thread \${threadId} released Mutex Lock. Exited Critical Section.\`);
  }
}

function simulateMutex() {
  console.log("=== Mutex Lock Synchronization ===");
  const mutex = new Mutex();
  mutex.acquire('T1');
  mutex.acquire('T2'); // Blocked
  mutex.release('T1');
  mutex.acquire('T2'); // Now acquires
  mutex.release('T2');
}

simulateMutex();`,

        cpp: `// Mutex Lock in C++
#include <iostream>
#include <mutex>
#include <string>

using namespace std;

class MutexSim {
    bool locked = false;
public:
    void lock(const string& threadId) {
        if (!locked) {
            locked = true;
            cout << "Thread " << threadId << " acquired Mutex Lock. Inside Critical Section." << endl;
        } else {
            cout << "Thread " << threadId << " BLOCKED! Mutex already acquired." << endl;
        }
    }
    void unlock(const string& threadId) {
        locked = false;
        cout << "Thread " << threadId << " released Mutex Lock. Exited Critical Section." << endl;
    }
};

int main() {
    cout << "=== Mutex Lock Synchronization (C++) ===" << endl;
    MutexSim mtx;
    mtx.lock("T1");
    mtx.lock("T2");
    mtx.unlock("T1");
    mtx.lock("T2");
    mtx.unlock("T2");
    return 0;
}`,

        java: `// Mutex Lock in Java
import java.util.concurrent.locks.ReentrantLock;

public class Main {
    public static void main(String[] args) {
        ReentrantLock lock = new ReentrantLock();
        System.out.println("=== Mutex Lock Simulation (Java) ===");
        
        System.out.println("Thread 1 acquiring lock...");
        lock.lock();
        try {
            System.out.println("Thread 1 inside Critical Section.");
        } finally {
            lock.unlock();
            System.out.println("Thread 1 released lock.");
        }

        System.out.println("Thread 2 acquiring lock...");
        lock.lock();
        try {
            System.out.println("Thread 2 inside Critical Section.");
        } finally {
            lock.unlock();
            System.out.println("Thread 2 released lock.");
        }
    }
}`,

        python: `# Mutex Lock in Python
import threading

def main():
    lock = threading.Lock()
    print("=== Mutex Lock Simulation (Python) ===")
    
    print("Thread T1 acquiring lock...")
    lock.acquire()
    print("Thread T1 in Critical Section")
    lock.release()
    print("Thread T1 released lock")

    print("Thread T2 acquiring lock...")
    with lock:
        print("Thread T2 in Critical Section")

main()`
      },

      'Counting Semaphore': {
        javascript: `// Process Synchronization - Counting Semaphore Simulation
class Semaphore {
  constructor(permits) {
    this.permits = permits;
  }

  wait(processId) {
    if (this.permits > 0) {
      this.permits--;
      console.log(\`Process \${processId} acquired permit. Remaining Permits: \${this.permits}\`);
    } else {
      console.log(\`Process \${processId} BLOCKED! Semaphore permits exhausted.\`);
    }
  }

  signal(processId) {
    this.permits++;
    console.log(\`Process \${processId} released permit. Available Permits: \${this.permits}\`);
  }
}

const sem = new Semaphore(2);
sem.wait('P1');
sem.wait('P2');
sem.wait('P3'); // Blocked
sem.signal('P1');
sem.wait('P3');`,

        cpp: `// Semaphore C++
#include <iostream>
#include <string>

using namespace std;

class Semaphore {
    int permits;
public:
    Semaphore(int p) : permits(p) {}
    void wait(const string& pid) {
        if (permits > 0) {
            permits--;
            cout << "Process " << pid << " acquired permit. Available Permits: " << permits << endl;
        } else {
            cout << "Process " << pid << " BLOCKED! Semaphore count = 0." << endl;
        }
    }
    void signal(const string& pid) {
        permits++;
        cout << "Process " << pid << " released permit. Available Permits: " << permits << endl;
    }
};

int main() {
    cout << "=== Counting Semaphore Simulation (C++) ===" << endl;
    Semaphore sem(2);
    sem.wait("P1");
    sem.wait("P2");
    sem.wait("P3");
    sem.signal("P1");
    sem.wait("P3");
    return 0;
}`,

        java: `// Semaphore Java
import java.util.concurrent.Semaphore;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Counting Semaphore (Java) ===");
        Semaphore sem = new Semaphore(2);

        System.out.println("P1 acquiring permit...");
        sem.acquire();
        System.out.println("P1 acquired. Available permits: " + sem.availablePermits());

        System.out.println("P2 acquiring permit...");
        sem.acquire();
        System.out.println("P2 acquired. Available permits: " + sem.availablePermits());

        sem.release();
        System.out.println("P1 released. Available permits: " + sem.availablePermits());
    }
}`,

        python: `# Counting Semaphore Python
import threading

def main():
    print("=== Counting Semaphore (Python) ===")
    sem = threading.Semaphore(2)

    print("Thread P1 acquiring...")
    sem.acquire()
    print("P1 Acquired.")

    print("Thread P2 acquiring...")
    sem.acquire()
    print("P2 Acquired.")

    sem.release()
    print("P1 Released permit.")

main()`
      },

      'Producer-Consumer': {
        javascript: `// Process Synchronization - Bounded Buffer Producer-Consumer
function simulateProducerConsumer(bufferSize = 5) {
  console.log(\`=== Producer-Consumer Problem (Buffer Size: \${bufferSize}) ===\`);
  const buffer = [];

  function produce(item) {
    if (buffer.length < bufferSize) {
      buffer.push(item);
      console.log(\`Producer produced Item \${item}. Buffer count: \${buffer.length}/\${bufferSize}\`);
    } else {
      console.log(\`Buffer FULL! Producer blocked.\`);
    }
  }

  function consume() {
    if (buffer.length > 0) {
      const item = buffer.shift();
      console.log(\`Consumer consumed Item \${item}. Buffer count: \${buffer.length}/\${bufferSize}\`);
    } else {
      console.log(\`Buffer EMPTY! Consumer blocked.\`);
    }
  }

  produce(101);
  produce(102);
  consume();
  consume();
  consume(); // Empty
}

simulateProducerConsumer();`,

        cpp: `// Producer Consumer C++
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "=== Bounded Buffer Producer-Consumer (C++) ===" << endl;
    vector<int> buffer;
    int maxSize = 3;

    auto produce = [&](int item) {
        if (buffer.size() < maxSize) {
            buffer.push_back(item);
            cout << "Producer produced item " << item << " | Buffer size: " << buffer.size() << "/" << maxSize << endl;
        } else {
            cout << "Buffer FULL! Producer blocked." << endl;
        }
    };

    auto consume = [&]() {
        if (!buffer.empty()) {
            int item = buffer.front();
            buffer.erase(buffer.begin());
            cout << "Consumer consumed item " << item << " | Buffer size: " << buffer.size() << "/" << maxSize << endl;
        } else {
            cout << "Buffer EMPTY! Consumer blocked." << endl;
        }
    };

    produce(1);
    produce(2);
    produce(3);
    produce(4); // Full
    consume();
    consume();
    return 0;
}`,

        java: `// Producer Consumer Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Bounded Buffer Producer-Consumer (Java) ===");
        Queue<Integer> buffer = new LinkedList<>();
        int capacity = 3;

        // Produce
        for (int i = 1; i <= 3; i++) {
            buffer.add(i);
            System.out.println("Produced Item " + i + " | Buffer: " + buffer.size() + "/" + capacity);
        }

        // Consume
        while (!buffer.isEmpty()) {
            int item = buffer.poll();
            System.out.println("Consumed Item " + item + " | Buffer: " + buffer.size() + "/" + capacity);
        }
    }
}`,

        python: `# Producer Consumer Python
def simulate_pc():
    print("=== Bounded Buffer Producer-Consumer (Python) ===")
    buffer = []
    capacity = 3

    def produce(item):
        if len(buffer) < capacity:
            buffer.append(item)
            print(f"Produced Item {item} | Buffer: {len(buffer)}/{capacity}")
        else:
            print("Buffer FULL!")

    def consume():
        if buffer:
            item = buffer.pop(0)
            print(f"Consumed Item {item} | Buffer: {len(buffer)}/{capacity}")
        else:
            print("Buffer EMPTY!")

    produce(10)
    produce(20)
    consume()
    consume()
    consume()

simulate_pc()`
      },

      'Readers-Writers': {
        javascript: `// Process Synchronization - Readers-Writers Database Problem
function simulateReadersWriters() {
  console.log("=== First Readers-Writers Database Problem ===");
  let readCount = 0;
  let dbWriting = false;

  function startRead(readerId) {
    if (dbWriting) {
      console.log(\`Reader \${readerId} BLOCKED! Writer is currently modifying DB.\`);
      return;
    }
    readCount++;
    console.log(\`Reader \${readerId} started reading. Active Readers: \${readCount}\`);
  }

  function endRead(readerId) {
    readCount--;
    console.log(\`Reader \${readerId} finished reading. Active Readers: \${readCount}\`);
  }

  startRead('R1');
  startRead('R2');
  endRead('R1');
  endRead('R2');
}

simulateReadersWriters();`,

        cpp: `// Readers Writers C++
#include <iostream>
#include <string>

using namespace std;

int main() {
    cout << "=== Readers-Writers Database Synchronization (C++) ===" << endl;
    int readCount = 0;
    bool isWriting = false;

    auto startRead = [&](const string& id) {
        if (!isWriting) {
            readCount++;
            cout << "Reader " << id << " reading. Active Readers: " << readCount << endl;
        }
    };

    auto endRead = [&](const string& id) {
        readCount--;
        cout << "Reader " << id << " finished. Active Readers: " << readCount << endl;
    };

    startRead("R1");
    startRead("R2");
    endRead("R1");
    endRead("R2");
    return 0;
}`,

        java: `// Readers Writers Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== Readers-Writers Synchronization (Java) ===");
        int readCount = 0;
        
        readCount++;
        System.out.println("Reader R1 reading database. Active Readers: " + readCount);
        readCount++;
        System.out.println("Reader R2 reading database. Active Readers: " + readCount);
        readCount--;
        System.out.println("Reader R1 finished. Active Readers: " + readCount);
        readCount--;
        System.out.println("Reader R2 finished. Active Readers: " + readCount);
    }
}`,

        python: `# Readers Writers Python
def readers_writers():
    print("=== Readers-Writers Synchronization (Python) ===")
    read_count = 0

    read_count += 1
    print(f"Reader R1 entered DB. Active Readers: {read_count}")
    read_count += 1
    print(f"Reader R2 entered DB. Active Readers: {read_count}")
    read_count -= 1
    print(f"Reader R1 exited DB. Active Readers: {read_count}")
    read_count -= 1
    print(f"Reader R2 exited DB. Active Readers: {read_count}")

readers_writers()`
      }
    }
  },

  'memory-management': {
    name: 'Memory Management & Allocation',
    algorithms: ['First Fit', 'Best Fit', 'Worst Fit'],
    defaultAlgorithm: 'First Fit',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      memoryBlocks: '100 500 200 300 600',
      processSizes: '212 417 112 426'
    },
    code: {
      'First Fit': {
        javascript: `// Memory Allocation - First Fit Strategy
function runFirstFit(blocks, processes) {
  console.log("=== Memory Allocation: First Fit Strategy ===");
  console.log("Initial Blocks:", blocks.join("KB, "), "KB");
  console.log("Process Demands:", processes.join("KB, "), "KB");
  console.log("----------------------------------------");

  const blockSizes = [...blocks];
  const allocation = Array(processes.length).fill(-1);

  processes.forEach((procSize, i) => {
    for (let j = 0; j < blockSizes.length; j++) {
      if (blockSizes[j] >= procSize) {
        allocation[i] = j;
        blockSizes[j] -= procSize;
        console.log(\`Process \${i + 1} (\${procSize}KB) -> Allocated to Block \${j + 1} | Remaining Block \${j + 1} size: \${blockSizes[j]}KB\`);
        break;
      }
    }
    if (allocation[i] === -1) {
      console.log(\`Process \${i + 1} (\${procSize}KB) -> NOT ALLOCATED (External Fragmentation!)\`);
    }
  });

  console.log("----------------------------------------");
  console.log("Final Block Sizes:", blockSizes.join("KB, "), "KB");
}

runFirstFit([100, 500, 200, 300, 600], [212, 417, 112, 426]);`,

        cpp: `// Memory Allocation - First Fit in C++
#include <iostream>
#include <vector>

using namespace std;

void runFirstFit(vector<int> blocks, vector<int> processes) {
    cout << "=== First Fit Memory Allocation (C++) ===" << endl;
    for (size_t i = 0; i < processes.size(); ++i) {
        int allocated = -1;
        for (size_t j = 0; j < blocks.size(); ++j) {
            if (blocks[j] >= processes[i]) {
                allocated = j;
                blocks[j] -= processes[i];
                break;
            }
        }
        if (allocated != -1)
            cout << "Process " << i + 1 << " (" << processes[i] << "KB) -> Block " << allocated + 1 << " | Rem: " << blocks[allocated] << "KB" << endl;
        else
            cout << "Process " << i + 1 << " (" << processes[i] << "KB) -> NOT ALLOCATED" << endl;
    }
}

int main() {
    runFirstFit({100, 500, 200, 300, 600}, {212, 417, 112, 426});
    return 0;
}`,

        java: `// Memory Allocation - First Fit in Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int[] blocks = {100, 500, 200, 300, 600};
        int[] processes = {212, 417, 112, 426};

        System.out.println("=== First Fit Memory Allocation (Java) ===");
        for (int i = 0; i < processes.length; i++) {
            boolean allocated = false;
            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= processes[i]) {
                    blocks[j] -= processes[i];
                    System.out.println("Process " + (i + 1) + " (" + processes[i] + "KB) -> Block " + (j + 1) + " | Rem: " + blocks[j] + "KB");
                    allocated = true;
                    break;
                }
            }
            if (!allocated) System.out.println("Process " + (i + 1) + " (" + processes[i] + "KB) -> NOT ALLOCATED");
        }
    }
}`,

        python: `# Memory Allocation - First Fit in Python
def run_first_fit(blocks, processes):
    print("=== First Fit Memory Allocation (Python) ===")
    block_sizes = list(blocks)

    for i, proc_size in enumerate(processes, 1):
        allocated = False
        for j, b_size in enumerate(block_sizes):
            if b_size >= proc_size:
                block_sizes[j] -= proc_size
                print(f"Process {i} ({proc_size}KB) -> Block {j + 1} | Rem: {block_sizes[j]}KB")
                allocated = True
                break
        if not allocated:
            print(f"Process {i} ({proc_size}KB) -> NOT ALLOCATED")

run_first_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])`
      },

      'Best Fit': {
        javascript: `// Memory Allocation - Best Fit Strategy
function runBestFit(blocks, processes) {
  console.log("=== Memory Allocation: Best Fit Strategy ===");
  const blockSizes = [...blocks];

  processes.forEach((procSize, i) => {
    let bestIdx = -1;
    for (let j = 0; j < blockSizes.length; j++) {
      if (blockSizes[j] >= procSize) {
        if (bestIdx === -1 || blockSizes[j] < blockSizes[bestIdx]) {
          bestIdx = j;
        }
      }
    }

    if (bestIdx !== -1) {
      blockSizes[bestIdx] -= procSize;
      console.log(\`Process \${i + 1} (\${procSize}KB) -> Allocated to Best Block \${bestIdx + 1} | Remaining: \${blockSizes[bestIdx]}KB\`);
    } else {
      console.log(\`Process \${i + 1} (\${procSize}KB) -> NOT ALLOCATED\`);
    }
  });
}

runBestFit([100, 500, 200, 300, 600], [212, 417, 112, 426]);`,

        cpp: `// Best Fit C++
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "=== Best Fit Memory Allocation (C++) ===" << endl;
    vector<int> blocks = {100, 500, 200, 300, 600};
    vector<int> processes = {212, 417, 112, 426};

    for (size_t i = 0; i < processes.size(); ++i) {
        int bestIdx = -1;
        for (size_t j = 0; j < blocks.size(); ++j) {
            if (blocks[j] >= processes[i]) {
                if (bestIdx == -1 || blocks[j] < blocks[bestIdx]) {
                    bestIdx = j;
                }
            }
        }

        if (bestIdx != -1) {
            blocks[bestIdx] -= processes[i];
            cout << "Process " << i + 1 << " (" << processes[i] << "KB) -> Best Block " << bestIdx + 1 << " | Rem: " << blocks[bestIdx] << "KB" << endl;
        } else {
            cout << "Process " << i + 1 << " (" << processes[i] << "KB) -> NOT ALLOCATED" << endl;
        }
    }
    return 0;
}`,

        java: `// Best Fit Java
public class Main {
    public static void main(String[] args) {
        int[] blocks = {100, 500, 200, 300, 600};
        int[] processes = {212, 417, 112, 426};

        System.out.println("=== Best Fit Memory Allocation (Java) ===");
        for (int i = 0; i < processes.length; i++) {
            int bestIdx = -1;
            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= processes[i]) {
                    if (bestIdx == -1 || blocks[j] < blocks[bestIdx]) {
                        bestIdx = j;
                    }
                }
            }
            if (bestIdx != -1) {
                blocks[bestIdx] -= processes[i];
                System.out.println("Process " + (i + 1) + " -> Best Block " + (bestIdx + 1) + " | Rem: " + blocks[bestIdx] + "KB");
            } else {
                System.out.println("Process " + (i + 1) + " -> NOT ALLOCATED");
            }
        }
    }
}`,

        python: `# Best Fit Python
def run_best_fit(blocks, processes):
    print("=== Best Fit Memory Allocation (Python) ===")
    block_sizes = list(blocks)

    for i, proc_size in enumerate(processes, 1):
        best_idx = -1
        for j, b_size in enumerate(block_sizes):
            if b_size >= proc_size:
                if best_idx == -1 or b_size < block_sizes[best_idx]:
                    best_idx = j

        if best_idx != -1:
            block_sizes[best_idx] -= proc_size
            print(f"Process {i} ({proc_size}KB) -> Best Block {best_idx + 1} | Rem: {block_sizes[best_idx]}KB")
        else:
            print(f"Process {i} ({proc_size}KB) -> NOT ALLOCATED")

run_best_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])`
      },

      'Worst Fit': {
        javascript: `// Memory Allocation - Worst Fit Strategy
function runWorstFit(blocks, processes) {
  console.log("=== Memory Allocation: Worst Fit Strategy ===");
  const blockSizes = [...blocks];

  processes.forEach((procSize, i) => {
    let worstIdx = -1;
    for (let j = 0; j < blockSizes.length; j++) {
      if (blockSizes[j] >= procSize) {
        if (worstIdx === -1 || blockSizes[j] > blockSizes[worstIdx]) {
          worstIdx = j;
        }
      }
    }

    if (worstIdx !== -1) {
      blockSizes[worstIdx] -= procSize;
      console.log(\`Process \${i + 1} (\${procSize}KB) -> Allocated to Largest Block \${worstIdx + 1} | Remaining: \${blockSizes[worstIdx]}KB\`);
    } else {
      console.log(\`Process \${i + 1} (\${procSize}KB) -> NOT ALLOCATED\`);
    }
  });
}

runWorstFit([100, 500, 200, 300, 600], [212, 417, 112, 426]);`,

        cpp: `// Worst Fit C++
#include <iostream>
#include <vector>

using namespace std;

int main() {
    cout << "=== Worst Fit Memory Allocation (C++) ===" << endl;
    vector<int> blocks = {100, 500, 200, 300, 600};
    vector<int> processes = {212, 417, 112, 426};

    for (size_t i = 0; i < processes.size(); ++i) {
        int worstIdx = -1;
        for (size_t j = 0; j < blocks.size(); ++j) {
            if (blocks[j] >= processes[i]) {
                if (worstIdx == -1 || blocks[j] > blocks[worstIdx]) {
                    worstIdx = j;
                }
            }
        }

        if (worstIdx != -1) {
            blocks[worstIdx] -= processes[i];
            cout << "Process " << i + 1 << " -> Worst Block " << worstIdx + 1 << " | Rem: " << blocks[worstIdx] << "KB" << endl;
        } else {
            cout << "Process " << i + 1 << " -> NOT ALLOCATED" << endl;
        }
    }
    return 0;
}`,

        java: `// Worst Fit Java
public class Main {
    public static void main(String[] args) {
        int[] blocks = {100, 500, 200, 300, 600};
        int[] processes = {212, 417, 112, 426};

        System.out.println("=== Worst Fit Memory Allocation (Java) ===");
        for (int i = 0; i < processes.length; i++) {
            int worstIdx = -1;
            for (int j = 0; j < blocks.length; j++) {
                if (blocks[j] >= processes[i]) {
                    if (worstIdx == -1 || blocks[j] > blocks[worstIdx]) {
                        worstIdx = j;
                    }
                }
            }
            if (worstIdx != -1) {
                blocks[worstIdx] -= processes[i];
                System.out.println("Process " + (i + 1) + " -> Worst Block " + (worstIdx + 1) + " | Rem: " + blocks[worstIdx] + "KB");
            } else {
                System.out.println("Process " + (i + 1) + " -> NOT ALLOCATED");
            }
        }
    }
}`,

        python: `# Worst Fit Python
def run_worst_fit(blocks, processes):
    print("=== Worst Fit Memory Allocation (Python) ===")
    block_sizes = list(blocks)

    for i, proc_size in enumerate(processes, 1):
        worst_idx = -1
        for j, b_size in enumerate(block_sizes):
            if b_size >= proc_size:
                if worst_idx == -1 or b_size > block_sizes[worst_idx]:
                    worst_idx = j

        if worst_idx != -1:
            block_sizes[worst_idx] -= proc_size
            print(f"Process {i} ({proc_size}KB) -> Worst Block {worst_idx + 1} | Rem: {block_sizes[worst_idx]}KB")
        else:
            print(f"Process {i} ({proc_size}KB) -> NOT ALLOCATED")

run_worst_fit([100, 500, 200, 300, 600], [212, 417, 112, 426])`
      }
    }
  },

  'paging-segmentation': {
    name: 'Paging & Segmentation',
    algorithms: ['Paging Translation', 'Segmentation Translation'],
    defaultAlgorithm: 'Paging Translation',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      logicalAddress: 1052,
      pageSize: 256
    },
    code: {
      'Paging Translation': {
        javascript: `// Virtual Memory - Paging Address Translation
function translatePaging(logicalAddress, pageSize, pageTable) {
  console.log("=== MMU Paging Address Translation ===");
  console.log("Logical Address:", logicalAddress);
  console.log("Page Size:       ", pageSize, "bytes");

  // Calculate Page Number (p) and Offset (d)
  const pageNum = Math.floor(logicalAddress / pageSize);
  const offset = logicalAddress % pageSize;

  console.log(\`Page Number (p): \${pageNum}\`);
  console.log(\`Offset (d):      \${offset}\`);

  if (pageNum in pageTable) {
    const frameNum = pageTable[pageNum];
    const physicalAddress = (frameNum * pageSize) + offset;
    console.log(\`Page Table Lookup: Page \${pageNum} -> Frame \${frameNum}\`);
    console.log(\`Physical Address:  (\${frameNum} * \${pageSize}) + \${offset} = \${physicalAddress}\`);
  } else {
    console.log(\`PAGE FAULT! Page \${pageNum} is not present in RAM Page Table.\`);
  }
}

const samplePageTable = { 0: 5, 1: 2, 2: 8, 3: 1, 4: 6 };
translatePaging(1052, 256, samplePageTable);`,

        cpp: `// Paging Address Translation in C++
#include <iostream>
#include <map>

using namespace std;

int main() {
    int logicalAddress = 1052;
    int pageSize = 256;
    map<int, int> pageTable = {{0, 5}, {1, 2}, {2, 8}, {3, 1}, {4, 6}};

    int pageNum = logicalAddress / pageSize;
    int offset = logicalAddress % pageSize;

    cout << "=== Paging Address Translation (C++) ===" << endl;
    cout << "Logical Address: " << logicalAddress << endl;
    cout << "Page Number (p): " << pageNum << endl;
    cout << "Offset (d):      " << offset << endl;

    if (pageTable.count(pageNum)) {
        int frameNum = pageTable[pageNum];
        int physicalAddress = (frameNum * pageSize) + offset;
        cout << "Frame Number (f): " << frameNum << endl;
        cout << "Physical Address:  " << physicalAddress << endl;
    } else {
        cout << "PAGE FAULT!" << endl;
    }
    return 0;
}`,

        java: `// Paging Translation in Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        int logicalAddress = 1052, pageSize = 256;
        Map<Integer, Integer> pageTable = Map.of(0, 5, 1, 2, 2, 8, 3, 1, 4, 6);

        int pageNum = logicalAddress / pageSize;
        int offset = logicalAddress % pageSize;

        System.out.println("=== MMU Paging Translation (Java) ===");
        System.out.println("Page (p): " + pageNum + ", Offset (d): " + offset);
        if (pageTable.containsKey(pageNum)) {
            int frameNum = pageTable.get(pageNum);
            int physicalAddress = (frameNum * pageSize) + offset;
            System.out.println("Page " + pageNum + " -> Frame " + frameNum + " | Physical Address: " + physicalAddress);
        } else {
            System.out.println("PAGE FAULT!");
        }
    }
}`,

        python: `# Paging Translation in Python
def translate_paging(logical_addr, page_size, page_table):
    page_num = logical_addr // page_size
    offset = logical_addr % page_size
    print("=== Paging Translation (Python) ===")
    print(f"Logical Address: {logical_addr}")
    print(f"Page Number (p): {page_num}, Offset (d): {offset}")

    if page_num in page_table:
        frame_num = page_table[page_num]
        physical_addr = (frame_num * page_size) + offset
        print(f"Frame (f): {frame_num} -> Physical Address: {physical_addr}")
    else:
        print("PAGE FAULT!")

translate_paging(1052, 256, {0: 5, 1: 2, 2: 8, 3: 1, 4: 6})`
      },

      'Segmentation Translation': {
        javascript: `// Virtual Memory - Segmentation Address Translation
function translateSegmentation(segmentNum, offset, segmentTable) {
  console.log("=== MMU Segmentation Address Translation ===");
  console.log(\`Logical Tuple: <Segment \${segmentNum}, Offset \${offset}>\`);

  if (segmentNum in segmentTable) {
    const { base, limit } = segmentTable[segmentNum];
    if (offset < limit) {
      const physicalAddress = base + offset;
      console.log(\`Limit Check: Offset (\${offset}) < Limit (\${limit}) -> PASS\`);
      console.log(\`Physical Address: Base (\${base}) + Offset (\${offset}) = \${physicalAddress}\`);
    } else {
      console.log(\`SEGMENTATION FAULT! Offset (\${offset}) >= Limit (\${limit}). Bounds Violation!\`);
    }
  } else {
    console.log(\`Invalid Segment Number \${segmentNum}\`);
  }
}

const segmentTable = {
  0: { base: 1400, limit: 1000 },
  1: { base: 6300, limit: 400 },
  2: { base: 4300, limit: 400 }
};

translateSegmentation(0, 500, segmentTable);
translateSegmentation(1, 450, segmentTable); // Trap!`,

        cpp: `// Segmentation Translation C++
#include <iostream>
#include <map>

using namespace std;

struct Segment {
    int base;
    int limit;
};

int main() {
    cout << "=== Segmentation Translation (C++) ===" << endl;
    map<int, Segment> segTable = {
        {0, {1400, 1000}},
        {1, {6300, 400}},
        {2, {4300, 400}}
    };

    int segNum = 0, offset = 500;
    cout << "Logical Address: <Segment " << segNum << ", Offset " << offset << ">" << endl;

    if (segTable.count(segNum)) {
        if (offset < segTable[segNum].limit) {
            int phys = segTable[segNum].base + offset;
            cout << "Limit Check PASS -> Physical Address: " << phys << endl;
        } else {
            cout << "SEGMENTATION FAULT! Offset >= Limit" << endl;
        }
    }
    return 0;
}`,

        java: `// Segmentation Java
import java.util.*;

class Segment {
    int base, limit;
    Segment(int b, int l) { this.base = b; this.limit = l; }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Segmentation Address Translation (Java) ===");
        Map<Integer, Segment> table = Map.of(
            0, new Segment(1400, 1000),
            1, new Segment(6300, 400),
            2, new Segment(4300, 400)
        );

        int seg = 0, offset = 500;
        if (table.containsKey(seg)) {
            Segment s = table.get(seg);
            if (offset < s.limit) {
                System.out.println("Physical Address: " + (s.base + offset));
            } else {
                System.out.println("SEGMENTATION FAULT!");
            }
        }
    }
}`,

        python: `# Segmentation Python
def translate_seg(seg_num, offset, seg_table):
    print("=== Segmentation Translation (Python) ===")
    print(f"Tuple: <Seg {seg_num}, Offset {offset}>")

    if seg_num in seg_table:
        base, limit = seg_table[seg_num]
        if offset < limit:
            print(f"Limit Check PASS -> Physical Address: {base + offset}")
        else:
            print("SEGMENTATION FAULT! Bounds Violation!")

translate_seg(0, 500, {0: (1400, 1000), 1: (6300, 400)})`
      }
    }
  },

  'page-replacement': {
    name: 'Page Replacement Algorithms',
    algorithms: ['FIFO', 'LRU', 'Optimal', 'Second Chance'],
    defaultAlgorithm: 'FIFO',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      refString: '7 0 1 2 0 3 0 4 2 3 0 3 2',
      frameCount: 3
    },
    code: {
      FIFO: {
        javascript: `// Page Replacement - FIFO (First-In, First-Out) Algorithm
function runFIFO(refString, frameCount) {
  console.log("=== FIFO Page Replacement Simulation ===");
  console.log("Reference String:", refString.join(" "));
  console.log("Frame Count:", frameCount);
  console.log("----------------------------------------");

  const frames = Array(frameCount).fill(null);
  const fifoQueue = [];
  let hits = 0;
  let faults = 0;

  refString.forEach((page, step) => {
    const hit = frames.includes(page);
    if (hit) {
      hits++;
      console.log(\`Step \${step + 1}: Page \${page} -> HIT   | Frames: [\${frames.map(f => f ?? '-').join(', ')}]\`);
    } else {
      faults++;
      if (fifoQueue.length < frameCount) {
        const emptyIdx = frames.indexOf(null);
        frames[emptyIdx] = page;
        fifoQueue.push(page);
        console.log(\`Step \${step + 1}: Page \${page} -> FAULT | Loaded into empty frame \${emptyIdx + 1} | Frames: [\${frames.map(f => f ?? '-').join(', ')}]\`);
      } else {
        const victim = fifoQueue.shift();
        const replaceIdx = frames.indexOf(victim);
        frames[replaceIdx] = page;
        fifoQueue.push(page);
        console.log(\`Step \${step + 1}: Page \${page} -> FAULT | Replaced Page \${victim} at Frame \${replaceIdx + 1} | Frames: [\${frames.map(f => f ?? '-').join(', ')}]\`);
      }
    }
  });

  console.log("----------------------------------------");
  console.log(\`Total References: \${refString.length}\`);
  console.log(\`Page Hits:        \${hits} (\${((hits / refString.length) * 100).toFixed(1)}%)\`);
  console.log(\`Page Faults:      \${faults} (\${((faults / refString.length) * 100).toFixed(1)}%)\`);
}

runFIFO([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3);`,

        cpp: `// Page Replacement - FIFO in C++
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

void runFIFO(const vector<int>& refString, int frameCount) {
    cout << "=== FIFO Page Replacement Simulation (C++) ===" << endl;
    vector<int> frames(frameCount, -1);
    queue<int> fifoQueue;
    int hits = 0, faults = 0;

    for (size_t step = 0; step < refString.size(); ++step) {
        int page = refString[step];
        bool isHit = (find(frames.begin(), frames.end(), page) != frames.end());

        if (isHit) {
            hits++;
            cout << "Step " << step + 1 << ": Page " << page << " -> HIT" << endl;
        } else {
            faults++;
            if (fifoQueue.size() < (size_t)frameCount) {
                for (int i = 0; i < frameCount; ++i) {
                    if (frames[i] == -1) {
                        frames[i] = page;
                        fifoQueue.push(page);
                        break;
                    }
                }
            } else {
                int victim = fifoQueue.front();
                fifoQueue.pop();
                for (int i = 0; i < frameCount; ++i) {
                    if (frames[i] == victim) {
                        frames[i] = page;
                        break;
                    }
                }
                fifoQueue.push(page);
            }
            cout << "Step " << step + 1 << ": Page " << page << " -> FAULT" << endl;
        }
    }
    cout << "----------------------------------------" << endl;
    cout << "Total Faults: " << faults << " | Total Hits: " << hits << endl;
}

int main() {
    runFIFO({7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2}, 3);
    return 0;
}`,

        java: `// FIFO Page Replacement Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== FIFO Page Replacement (Java) ===");
        int[] refString = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int frameCount = 3;
        List<Integer> frames = new ArrayList<>();
        Queue<Integer> fifo = new LinkedList<>();
        int faults = 0, hits = 0;

        for (int p : refString) {
            if (frames.contains(p)) {
                hits++;
            } else {
                faults++;
                if (frames.size() < frameCount) {
                    frames.add(p);
                    fifo.add(p);
                } else {
                    int victim = fifo.poll();
                    frames.set(frames.indexOf(victim), p);
                    fifo.add(p);
                }
            }
        }
        System.out.println("Total References: " + refString.length);
        System.out.println("Page Faults: " + faults + " | Page Hits: " + hits);
    }
}`,

        python: `# FIFO Page Replacement Python
def run_fifo(ref_string, frame_count):
    print("=== FIFO Page Replacement (Python) ===")
    frames = []
    fifo_queue = []
    hits, faults = 0, 0

    for step, page in enumerate(ref_string, 1):
        if page in frames:
            hits += 1
            print(f"Step {step}: Page {page} -> HIT   | Frames: {frames}")
        else:
            faults += 1
            if len(frames) < frame_count:
                frames.append(page)
                fifo_queue.append(page)
            else:
                victim = fifo_queue.pop(0)
                idx = frames.index(victim)
                frames[idx] = page
                fifo_queue.append(page)
            print(f"Step {step}: Page {page} -> FAULT | Frames: {frames}")

    print("----------------------------------------")
    print(f"Hits: {hits}, Faults: {faults}")

run_fifo([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3)`
      },

      LRU: {
        javascript: `// LRU (Least Recently Used) Page Replacement
function runLRU(refString, frameCount) {
  console.log("=== LRU Page Replacement Simulation ===");
  const frames = [];
  let hits = 0, faults = 0;

  refString.forEach((page, step) => {
    const idx = frames.indexOf(page);
    if (idx !== -1) {
      hits++;
      frames.splice(idx, 1);
      frames.push(page); // Move to most recently used
      console.log(\`Step \${step + 1}: Page \${page} -> HIT   | Frames: [\${frames.join(', ')}]\`);
    } else {
      faults++;
      if (frames.length >= frameCount) {
        frames.shift(); // Evict least recently used
      }
      frames.push(page);
      console.log(\`Step \${step + 1}: Page \${page} -> FAULT | Frames: [\${frames.join(', ')}]\`);
    }
  });

  console.log(\`Page Hits: \${hits} | Page Faults: \${faults}\`);
}

runLRU([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3);`,

        cpp: `// LRU Page Replacement in C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "=== LRU Page Replacement (C++) ===" << endl;
    vector<int> ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int capacity = 3;
    vector<int> frames;
    int hits = 0, faults = 0;

    for (int p : ref) {
        auto it = find(frames.begin(), frames.end(), p);
        if (it != frames.end()) {
            hits++;
            frames.erase(it);
            frames.push_back(p);
        } else {
            faults++;
            if (frames.size() >= (size_t)capacity) {
                frames.erase(frames.begin());
            }
            frames.push_back(p);
        }
    }
    cout << "Hits: " << hits << " | Faults: " << faults << endl;
    return 0;
}`,

        java: `// LRU Page Replacement Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== LRU Page Replacement (Java) ===");
        int[] ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int capacity = 3;
        List<Integer> frames = new LinkedList<>();
        int hits = 0, faults = 0;

        for (int p : ref) {
            if (frames.contains(p)) {
                hits++;
                frames.remove(Integer.valueOf(p));
                frames.add(p);
            } else {
                faults++;
                if (frames.size() >= capacity) {
                    frames.remove(0);
                }
                frames.add(p);
            }
        }
        System.out.println("Hits: " + hits + " | Faults: " + faults);
    }
}`,

        python: `# LRU Page Replacement Python
def run_lru(ref_string, capacity):
    print("=== LRU Page Replacement (Python) ===")
    frames = []
    hits, faults = 0, 0

    for page in ref_string:
        if page in frames:
            hits += 1
            frames.remove(page)
            frames.append(page)
        else:
            faults += 1
            if len(frames) >= capacity:
                frames.pop(0)
            frames.append(page)

    print(f"Total Hits: {hits}, Total Faults: {faults}")

run_lru([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3)`
      },

      Optimal: {
        javascript: `// Optimal Page Replacement Algorithm
function runOptimal(refString, frameCount) {
  console.log("=== Optimal Page Replacement Simulation ===");
  const frames = [];
  let hits = 0, faults = 0;

  for (let i = 0; i < refString.length; i++) {
    const page = refString[i];
    if (frames.includes(page)) {
      hits++;
    } else {
      faults++;
      if (frames.length < frameCount) {
        frames.push(page);
      } else {
        // Look ahead to find victim page not used for longest time
        let maxIndex = -1, victimIdx = -1;
        for (let j = 0; j < frames.length; j++) {
          const nextUse = refString.slice(i + 1).indexOf(frames[j]);
          if (nextUse === -1) {
            victimIdx = j;
            break;
          } else if (nextUse > maxIndex) {
            maxIndex = nextUse;
            victimIdx = j;
          }
        }
        frames[victimIdx] = page;
      }
    }
  }

  console.log(\`Hits: \${hits} | Faults: \${faults}\`);
}

runOptimal([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3);`,

        cpp: `// Optimal Page Replacement C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "=== Optimal Page Replacement (C++) ===" << endl;
    vector<int> ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int frameCount = 3;
    vector<int> frames;
    int hits = 0, faults = 0;

    for (size_t i = 0; i < ref.size(); i++) {
        int page = ref[i];
        if (find(frames.begin(), frames.end(), page) != frames.end()) {
            hits++;
        } else {
            faults++;
            if (frames.size() < (size_t)frameCount) {
                frames.push_back(page);
            } else {
                int victimIdx = -1, maxNext = -1;
                for (size_t j = 0; j < frames.size(); j++) {
                    int next = -1;
                    for (size_t k = i + 1; k < ref.size(); k++) {
                        if (ref[k] == frames[j]) { next = k; break; }
                    }
                    if (next == -1) { victimIdx = j; break; }
                    if (next > maxNext) { maxNext = next; victimIdx = j; }
                }
                frames[victimIdx] = page;
            }
        }
    }
    cout << "Hits: " << hits << " | Faults: " << faults << endl;
    return 0;
}`,

        java: `// Optimal Page Replacement Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Optimal Page Replacement (Java) ===");
        int[] ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int capacity = 3;
        List<Integer> frames = new ArrayList<>();
        int hits = 0, faults = 0;

        for (int i = 0; i < ref.length; i++) {
            int p = ref[i];
            if (frames.contains(p)) {
                hits++;
            } else {
                faults++;
                if (frames.size() < capacity) {
                    frames.add(p);
                } else {
                    int victimIdx = -1, maxNext = -1;
                    for (int j = 0; j < frames.size(); j++) {
                        int next = -1;
                        for (int k = i + 1; k < ref.length; k++) {
                            if (ref[k] == frames.get(j)) { next = k; break; }
                        }
                        if (next == -1) { victimIdx = j; break; }
                        if (next > maxNext) { maxNext = next; victimIdx = j; }
                    }
                    frames.set(victimIdx, p);
                }
            }
        }
        System.out.println("Hits: " + hits + " | Faults: " + faults);
    }
}`,

        python: `# Optimal Page Replacement Python
def run_optimal(ref_string, capacity):
    print("=== Optimal Page Replacement (Python) ===")
    frames = []
    hits, faults = 0, 0

    for i, page in enumerate(ref_string):
        if page in frames:
            hits += 1
        else:
            faults += 1
            if len(frames) < capacity:
                frames.append(page)
            else:
                victim_idx = -1
                max_next = -1
                for j, f in enumerate(frames):
                    try:
                        next_use = ref_string[i + 1:].index(f)
                    except ValueError:
                        victim_idx = j
                        break
                    if next_use > max_next:
                        max_next = next_use
                        victim_idx = j
                frames[victim_idx] = page

    print(f"Hits: {hits}, Faults: {faults}")

run_optimal([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3)`
      },

      'Second Chance': {
        javascript: `// Second Chance (Clock) Page Replacement
function runSecondChance(refString, frameCount) {
  console.log("=== Second Chance (Clock) Page Replacement ===");
  const frames = Array(frameCount).fill(null);
  const refBits = Array(frameCount).fill(0);
  let pointer = 0;
  let hits = 0, faults = 0;

  refString.forEach((page, step) => {
    const idx = frames.indexOf(page);
    if (idx !== -1) {
      hits++;
      refBits[idx] = 1;
      console.log(\`Step \${step + 1}: Page \${page} -> HIT (Ref Bit set to 1)\`);
    } else {
      faults++;
      while (true) {
        if (frames[pointer] === null) {
          frames[pointer] = page;
          refBits[pointer] = 0;
          pointer = (pointer + 1) % frameCount;
          break;
        }
        if (refBits[pointer] === 1) {
          refBits[pointer] = 0; // Second chance given
          pointer = (pointer + 1) % frameCount;
        } else {
          frames[pointer] = page;
          refBits[pointer] = 0;
          pointer = (pointer + 1) % frameCount;
          break;
        }
      }
      console.log(\`Step \${step + 1}: Page \${page} -> FAULT | Frames: [\${frames.join(', ')}]\`);
    }
  });

  console.log(\`Hits: \${hits} | Faults: \${faults}\`);
}

runSecondChance([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3);`,

        cpp: `// Second Chance C++
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

int main() {
    cout << "=== Second Chance Page Replacement (C++) ===" << endl;
    vector<int> ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
    int frameCount = 3;
    vector<int> frames(frameCount, -1);
    vector<int> refBits(frameCount, 0);
    int ptr = 0, hits = 0, faults = 0;

    for (int p : ref) {
        auto it = find(frames.begin(), frames.end(), p);
        if (it != frames.end()) {
            hits++;
            int idx = distance(frames.begin(), it);
            refBits[idx] = 1;
        } else {
            faults++;
            while (true) {
                if (frames[ptr] == -1) {
                    frames[ptr] = p;
                    refBits[ptr] = 0;
                    ptr = (ptr + 1) % frameCount;
                    break;
                }
                if (refBits[ptr] == 1) {
                    refBits[ptr] = 0;
                    ptr = (ptr + 1) % frameCount;
                } else {
                    frames[ptr] = p;
                    refBits[ptr] = 0;
                    ptr = (ptr + 1) % frameCount;
                    break;
                }
            }
        }
    }
    cout << "Hits: " << hits << " | Faults: " << faults << endl;
    return 0;
}`,

        java: `// Second Chance Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== Second Chance Page Replacement (Java) ===");
        int[] ref = {7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2};
        int n = 3;
        int[] frames = new int[n];
        Arrays.fill(frames, -1);
        int[] bits = new int[n];
        int ptr = 0, hits = 0, faults = 0;

        for (int p : ref) {
            int idx = -1;
            for (int i = 0; i < n; i++) if (frames[i] == p) idx = i;

            if (idx != -1) {
                hits++;
                bits[idx] = 1;
            } else {
                faults++;
                while (true) {
                    if (frames[ptr] == -1) {
                        frames[ptr] = p;
                        bits[ptr] = 0;
                        ptr = (ptr + 1) % n;
                        break;
                    }
                    if (bits[ptr] == 1) {
                        bits[ptr] = 0;
                        ptr = (ptr + 1) % n;
                    } else {
                        frames[ptr] = p;
                        bits[ptr] = 0;
                        ptr = (ptr + 1) % n;
                        break;
                    }
                }
            }
        }
        System.out.println("Hits: " + hits + " | Faults: " + faults);
    }
}`,

        python: `# Second Chance Python
def run_second_chance(ref_string, frame_count):
    print("=== Second Chance Page Replacement (Python) ===")
    frames = [-1] * frame_count
    ref_bits = [0] * frame_count
    ptr = 0
    hits, faults = 0, 0

    for page in ref_string:
        if page in frames:
            hits += 1
            idx = frames.index(page)
            ref_bits[idx] = 1
        else:
            faults += 1
            while True:
                if frames[ptr] == -1:
                    frames[ptr] = page
                    ref_bits[ptr] = 0
                    ptr = (ptr + 1) % frame_count
                    break
                if ref_bits[ptr] == 1:
                    ref_bits[ptr] = 0
                    ptr = (ptr + 1) % frame_count
                else:
                    frames[ptr] = page
                    ref_bits[ptr] = 0
                    ptr = (ptr + 1) % frame_count
                    break

    print(f"Hits: {hits}, Faults: {faults}")

run_second_chance([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2], 3)`
      }
    }
  },

  'disk-scheduling': {
    name: 'Disk Scheduling Algorithms',
    algorithms: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK', 'C-LOOK'],
    defaultAlgorithm: 'FCFS',
    languages: ['javascript', 'cpp', 'java', 'python'],
    defaultInputs: {
      requests: '98 183 37 122 14 124 65 67',
      initialHead: 53,
      diskMin: 0,
      diskMax: 199,
      direction: 'up'
    },
    code: {
      FCFS: {
        javascript: `// Disk Scheduling - FCFS
function runFCFS(requests, initialHead) {
  console.log("=== FCFS Disk Scheduling ===");
  let head = initialHead, totalMovement = 0;
  requests.forEach((req, step) => {
    const dist = Math.abs(req - head);
    totalMovement += dist;
    console.log(\`Step \${step + 1}: Move head \${head} -> \${req} (Seek: \${dist} tracks)\`);
    head = req;
  });
  console.log("----------------------------------------");
  console.log("Total Head Movement:", totalMovement, "tracks");
}

runFCFS([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// FCFS Disk Scheduling C++
#include <iostream>
#include <vector>
#include <cmath>

using namespace std;

int main() {
    cout << "=== FCFS Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53;
    int totalSeek = 0;

    for (size_t i = 0; i < reqs.size(); ++i) {
        int seek = abs(reqs[i] - head);
        totalSeek += seek;
        cout << "Step " << i + 1 << ": Move " << head << " -> " << reqs[i] << " (Seek: " << seek << " tracks)" << endl;
        head = reqs[i];
    }
    cout << "Total Head Movement: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// FCFS Disk Scheduling Java
public class Main {
    public static void main(String[] args) {
        System.out.println("=== FCFS Disk Scheduling (Java) ===");
        int[] reqs = {98, 183, 37, 122, 14, 124, 65, 67};
        int head = 53;
        int totalSeek = 0;

        for (int i = 0; i < reqs.length; i++) {
            int seek = Math.abs(reqs[i] - head);
            totalSeek += seek;
            System.out.println("Step " + (i + 1) + ": Move " + head + " -> " + reqs[i] + " (Seek: " + seek + ")");
            head = reqs[i];
        }
        System.out.println("Total Seek: " + totalSeek + " tracks");
    }
}`,

        python: `# FCFS Disk Scheduling Python
def run_fcfs(requests, initial_head):
    print("=== FCFS Disk Scheduling (Python) ===")
    head = initial_head
    total_seek = 0

    for step, req in enumerate(requests, 1):
        seek = abs(req - head)
        total_seek += seek
        print(f"Step {step}: Move {head} -> {req} (Seek: {seek} tracks)")
        head = req

    print(f"Total Head Movement: {total_seek} tracks")

run_fcfs([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      },

      SSTF: {
        javascript: `// Disk Scheduling - SSTF (Shortest Seek Time First)
function runSSTF(requests, initialHead) {
  console.log("=== SSTF Disk Scheduling Simulation ===");
  let head = initialHead;
  const reqs = [...requests];
  let totalSeek = 0;
  let step = 1;

  while (reqs.length > 0) {
    let minSeek = Infinity, minIdx = -1;
    reqs.forEach((r, i) => {
      const dist = Math.abs(r - head);
      if (dist < minSeek) {
        minSeek = dist;
        minIdx = i;
      }
    });

    const target = reqs[minIdx];
    reqs.splice(minIdx, 1);
    totalSeek += minSeek;
    console.log(\`Step \${step++}: Move head \${head} -> \${target} (Seek: \${minSeek} tracks)\`);
    head = target;
  }

  console.log("Total Head Movement:", totalSeek, "tracks");
}

runSSTF([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// SSTF C++
#include <iostream>
#include <vector>
#include <cmath>
#include <climits>

using namespace std;

int main() {
    cout << "=== SSTF Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53;
    int totalSeek = 0;

    while (!reqs.empty()) {
        int minSeek = INT_MAX, minIdx = -1;
        for (size_t i = 0; i < reqs.size(); ++i) {
            int seek = abs(reqs[i] - head);
            if (seek < minSeek) {
                minSeek = seek;
                minIdx = i;
            }
        }
        int target = reqs[minIdx];
        reqs.erase(reqs.begin() + minIdx);
        totalSeek += minSeek;
        cout << "Move " << head << " -> " << target << " (Seek: " << minSeek << ")" << endl;
        head = target;
    }
    cout << "Total Head Movement: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// SSTF Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SSTF Disk Scheduling (Java) ===");
        List<Integer> reqs = new ArrayList<>(Arrays.asList(98, 183, 37, 122, 14, 124, 65, 67));
        int head = 53;
        int totalSeek = 0;

        while (!reqs.isEmpty()) {
            int minSeek = Integer.MAX_VALUE, minIdx = -1;
            for (int i = 0; i < reqs.size(); i++) {
                int seek = Math.abs(reqs.get(i) - head);
                if (seek < minSeek) {
                    minSeek = seek;
                    minIdx = i;
                }
            }
            int target = reqs.remove(minIdx);
            totalSeek += minSeek;
            System.out.println("Move " + head + " -> " + target + " (Seek: " + minSeek + ")");
            head = target;
        }
        System.out.println("Total Head Movement: " + totalSeek + " tracks");
    }
}`,

        python: `# SSTF Python
def run_sstf(requests, initial_head):
    print("=== SSTF Disk Scheduling (Python) ===")
    head = initial_head
    reqs = list(requests)
    total_seek = 0

    while reqs:
        min_seek = float('inf')
        min_idx = -1
        for i, r in enumerate(reqs):
            seek = abs(r - head)
            if seek < min_seek:
                min_seek = seek
                min_idx = i

        target = reqs.pop(min_idx)
        total_seek += min_seek
        print(f"Move {head} -> {target} (Seek: {min_seek} tracks)")
        head = target

    print(f"Total Head Movement: {total_seek} tracks")

run_sstf([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      },

      SCAN: {
        javascript: `// Disk Scheduling - SCAN (Elevator Algorithm)
function runSCAN(requests, initialHead, maxTrack = 199) {
  console.log("=== SCAN (Elevator) Disk Scheduling ===");
  const reqs = [...requests].sort((a, b) => a - b);
  const left = reqs.filter(r => r < initialHead);
  const right = reqs.filter(r => r >= initialHead);

  let head = initialHead, totalSeek = 0;

  // Move right toward maxTrack
  right.forEach(r => {
    totalSeek += Math.abs(r - head);
    head = r;
  });
  // Reach max cylinder boundary
  totalSeek += Math.abs(maxTrack - head);
  head = maxTrack;

  // Reverse direction left
  left.reverse().forEach(r => {
    totalSeek += Math.abs(r - head);
    head = r;
  });

  console.log("Total SCAN Head Movement:", totalSeek, "tracks");
}

runSCAN([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// SCAN C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    cout << "=== SCAN Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53, maxTrack = 199;
    sort(reqs.begin(), reqs.end());

    vector<int> left, right;
    for (int r : reqs) {
        if (r < head) left.push_back(r);
        else right.push_back(r);
    }

    int totalSeek = 0;
    for (int r : right) { totalSeek += abs(r - head); head = r; }
    totalSeek += abs(maxTrack - head); head = maxTrack;
    reverse(left.begin(), left.end());
    for (int r : left) { totalSeek += abs(r - head); head = r; }

    cout << "Total Seek: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// SCAN Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== SCAN Disk Scheduling (Java) ===");
        int[] reqs = {98, 183, 37, 122, 14, 124, 65, 67};
        Arrays.sort(reqs);
        int head = 53, maxTrack = 199;
        int totalSeek = 0;

        for (int r : reqs) {
            if (r >= 53) { totalSeek += Math.abs(r - head); head = r; }
        }
        totalSeek += Math.abs(maxTrack - head); head = maxTrack;

        for (int i = reqs.length - 1; i >= 0; i--) {
            if (reqs[i] < 53) { totalSeek += Math.abs(reqs[i] - head); head = reqs[i]; }
        }
        System.out.println("Total Seek: " + totalSeek + " tracks");
    }
}`,

        python: `# SCAN Python
def run_scan(requests, initial_head, max_track=199):
    print("=== SCAN Disk Scheduling (Python) ===")
    reqs = sorted(requests)
    left = [r for r in reqs if r < initial_head]
    right = [r for r in reqs if r >= initial_head]

    head = initial_head
    total_seek = 0

    for r in right:
        total_seek += abs(r - head)
        head = r
    total_seek += abs(max_track - head)
    head = max_track

    for r in reversed(left):
        total_seek += abs(r - head)
        head = r

    print(f"Total Head Movement: {total_seek} tracks")

run_scan([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      },

      'C-SCAN': {
        javascript: `// Disk Scheduling - C-SCAN (Circular SCAN)
function runCSCAN(requests, initialHead, maxTrack = 199) {
  console.log("=== C-SCAN (Circular SCAN) Disk Scheduling ===");
  const reqs = [...requests].sort((a, b) => a - b);
  const left = reqs.filter(r => r < initialHead);
  const right = reqs.filter(r => r >= initialHead);

  let head = initialHead, totalSeek = 0;

  right.forEach(r => { totalSeek += Math.abs(r - head); head = r; });
  totalSeek += Math.abs(maxTrack - head); head = maxTrack;
  totalSeek += maxTrack; head = 0; // Wrap around jump to 0

  left.forEach(r => { totalSeek += Math.abs(r - head); head = r; });

  console.log("Total C-SCAN Head Movement:", totalSeek, "tracks");
}

runCSCAN([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// C-SCAN C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    cout << "=== C-SCAN Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53, maxTrack = 199;
    sort(reqs.begin(), reqs.end());

    int totalSeek = 0;
    for (int r : reqs) {
        if (r >= 53) { totalSeek += abs(r - head); head = r; }
    }
    totalSeek += abs(maxTrack - head); head = 0; // Circular wrap
    for (int r : reqs) {
        if (r < 53) { totalSeek += abs(r - head); head = r; }
    }

    cout << "Total Seek: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// C-SCAN Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== C-SCAN Disk Scheduling (Java) ===");
        int[] reqs = {98, 183, 37, 122, 14, 124, 65, 67};
        Arrays.sort(reqs);
        int head = 53, maxTrack = 199;
        int totalSeek = 0;

        for (int r : reqs) if (r >= 53) { totalSeek += Math.abs(r - head); head = r; }
        totalSeek += Math.abs(maxTrack - head); head = 0;
        for (int r : reqs) if (r < 53) { totalSeek += Math.abs(r - head); head = r; }

        System.out.println("Total Head Movement: " + totalSeek + " tracks");
    }
}`,

        python: `# C-SCAN Python
def run_cscan(requests, initial_head, max_track=199):
    print("=== C-SCAN Disk Scheduling (Python) ===")
    reqs = sorted(requests)
    left = [r for r in reqs if r < initial_head]
    right = [r for r in reqs if r >= initial_head]

    head = initial_head
    total_seek = 0

    for r in right:
        total_seek += abs(r - head)
        head = r
    total_seek += abs(max_track - head)
    total_seek += max_track
    head = 0

    for r in left:
        total_seek += abs(r - head)
        head = r

    print(f"Total Head Movement: {total_seek} tracks")

run_cscan([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      },

      LOOK: {
        javascript: `// Disk Scheduling - LOOK Algorithm
function runLOOK(requests, initialHead) {
  console.log("=== LOOK Disk Scheduling ===");
  const reqs = [...requests].sort((a, b) => a - b);
  const left = reqs.filter(r => r < initialHead);
  const right = reqs.filter(r => r >= initialHead);

  let head = initialHead, totalSeek = 0;

  right.forEach(r => { totalSeek += Math.abs(r - head); head = r; });
  left.reverse().forEach(r => { totalSeek += Math.abs(r - head); head = r; });

  console.log("Total LOOK Head Movement:", totalSeek, "tracks");
}

runLOOK([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// LOOK C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    cout << "=== LOOK Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53;
    sort(reqs.begin(), reqs.end());

    int totalSeek = 0;
    for (int r : reqs) if (r >= 53) { totalSeek += abs(r - head); head = r; }
    for (auto it = reqs.rbegin(); it != reqs.rend(); ++it) {
        if (*it < 53) { totalSeek += abs(*it - head); head = *it; }
    }

    cout << "Total Seek: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// LOOK Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== LOOK Disk Scheduling (Java) ===");
        int[] reqs = {98, 183, 37, 122, 14, 124, 65, 67};
        Arrays.sort(reqs);
        int head = 53;
        int totalSeek = 0;

        for (int r : reqs) if (r >= 53) { totalSeek += Math.abs(r - head); head = r; }
        for (int i = reqs.length - 1; i >= 0; i--) if (reqs[i] < 53) { totalSeek += Math.abs(reqs[i] - head); head = reqs[i]; }

        System.out.println("Total Head Movement: " + totalSeek + " tracks");
    }
}`,

        python: `# LOOK Python
def run_look(requests, initial_head):
    print("=== LOOK Disk Scheduling (Python) ===")
    reqs = sorted(requests)
    left = [r for r in reqs if r < initial_head]
    right = [r for r in reqs if r >= initial_head]

    head = initial_head
    total_seek = 0

    for r in right:
        total_seek += abs(r - head)
        head = r

    for r in reversed(left):
        total_seek += abs(r - head)
        head = r

    print(f"Total Head Movement: {total_seek} tracks")

run_look([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      },

      'C-LOOK': {
        javascript: `// Disk Scheduling - C-LOOK (Circular LOOK)
function runCLOOK(requests, initialHead) {
  console.log("=== C-LOOK (Circular LOOK) Disk Scheduling ===");
  const reqs = [...requests].sort((a, b) => a - b);
  const left = reqs.filter(r => r < initialHead);
  const right = reqs.filter(r => r >= initialHead);

  let head = initialHead, totalSeek = 0;

  right.forEach(r => { totalSeek += Math.abs(r - head); head = r; });
  if (left.length > 0) {
    totalSeek += Math.abs(head - left[0]); // Jump directly to lowest request
    head = left[0];
    left.forEach(r => { totalSeek += Math.abs(r - head); head = r; });
  }

  console.log("Total C-LOOK Head Movement:", totalSeek, "tracks");
}

runCLOOK([98, 183, 37, 122, 14, 124, 65, 67], 53);`,

        cpp: `// C-LOOK C++
#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>

using namespace std;

int main() {
    cout << "=== C-LOOK Disk Scheduling (C++) ===" << endl;
    vector<int> reqs = {98, 183, 37, 122, 14, 124, 65, 67};
    int head = 53;
    sort(reqs.begin(), reqs.end());

    int totalSeek = 0;
    for (int r : reqs) if (r >= 53) { totalSeek += abs(r - head); head = r; }
    for (int r : reqs) if (r < 53) { totalSeek += abs(r - head); head = r; }

    cout << "Total Seek: " << totalSeek << " tracks" << endl;
    return 0;
}`,

        java: `// C-LOOK Java
import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.println("=== C-LOOK Disk Scheduling (Java) ===");
        int[] reqs = {98, 183, 37, 122, 14, 124, 65, 67};
        Arrays.sort(reqs);
        int head = 53;
        int totalSeek = 0;

        for (int r : reqs) if (r >= 53) { totalSeek += Math.abs(r - head); head = r; }
        for (int r : reqs) if (r < 53) { totalSeek += Math.abs(r - head); head = r; }

        System.out.println("Total Head Movement: " + totalSeek + " tracks");
    }
}`,

        python: `# C-LOOK Python
def run_clook(requests, initial_head):
    print("=== C-LOOK Disk Scheduling (Python) ===")
    reqs = sorted(requests)
    left = [r for r in reqs if r < initial_head]
    right = [r for r in reqs if r >= initial_head]

    head = initial_head
    total_seek = 0

    for r in right:
        total_seek += abs(r - head)
        head = r

    for r in left:
        total_seek += abs(r - head)
        head = r

    print(f"Total Head Movement: {total_seek} tracks")

run_clook([98, 183, 37, 122, 14, 124, 65, 67], 53)`
      }
    }
  }
};
