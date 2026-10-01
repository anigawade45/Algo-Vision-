export const studentProfile = {
  name: "Student",
  initials: "ST",
  role: "Computer Science",
  specialization: "Semester 6",
  rollNo: "CS2026",
  email: "student@algovision.io",
  avatarUrl: null,
  notifications: [
    {
      id: 1,
      title: "New Simulation Unlocked",
      description: "Distributed Caching (Redis) visualization is now available.",
      time: "10m ago",
      unread: true,
      type: "unlock",
    },
    {
      id: 2,
      title: "Simulation Available: OS Scheduling",
      description: "CPU Scheduling & Deadlocks interactive simulation is ready to explore!",
      time: "2h ago",
      unread: true,
      type: "simulation",
    },
    {
      id: 3,
      title: "AI Mentor Tip",
      description: "Ask the AI Mentor for step-by-step dry runs on Graph Traversal.",
      time: "1d ago",
      unread: false,
      type: "ai",
    },
  ],
};

export const continueLearningData = {
  module: "Data Structures & Algorithms",
  topic: "Recursion & Backtracking",
  description: "Explore recursion, backtracking patterns, and interactive visualizations.",
};

export const coreModules = [
  {
    id: "dsa",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    tagline: "Data Structures & Algorithms",
    description: "Learn, practice, and visualize data structures and algorithms interactively.",
    badgeText: "Algorithms",
    accentColor: "indigo",
    route: "/dsa",
    colorTheme: {
      lightBg: "bg-indigo-50/70",
      darkBg: "dark:bg-indigo-950/20",
      border: "border-slate-200/80 dark:border-slate-800/80",
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500/40",
      badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40",
      iconBg: "bg-indigo-600 text-white shadow-indigo-500/20",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/15",
    },
  },
  {
    id: "os",
    name: "Operating Systems",
    shortName: "OS",
    tagline: "Core Kernel & Scheduling",
    description: "Understand operating system concepts through interactive simulations.",
    badgeText: "Systems",
    accentColor: "cyan",
    route: "/os",
    colorTheme: {
      lightBg: "bg-cyan-50/70",
      darkBg: "dark:bg-cyan-950/20",
      border: "border-slate-200/80 dark:border-slate-800/80",
      hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/40",
      badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/40",
      iconBg: "bg-cyan-600 text-white shadow-cyan-500/20",
      button: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/15",
    },
  },
  {
    id: "networks",
    name: "Computer Networks",
    shortName: "Networks",
    tagline: "Protocols & Packet Tracing",
    description: "Explore networking concepts, protocols, and visualizations.",
    badgeText: "Networking",
    accentColor: "emerald",
    route: "/cn",
    colorTheme: {
      lightBg: "bg-emerald-50/70",
      darkBg: "dark:bg-emerald-950/20",
      border: "border-slate-200/80 dark:border-slate-800/80",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/40",
      badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
      iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/15",
    },
  },
  {
    id: "sysdesign",
    name: "System Design",
    shortName: "SysDesign",
    tagline: "Distributed Architectures",
    description: "Learn system design concepts through interactive architecture visualizations.",
    badgeText: "Architecture",
    accentColor: "purple",
    route: "/modules/sysdesign",
    colorTheme: {
      lightBg: "bg-purple-50/70",
      darkBg: "dark:bg-purple-950/20",
      border: "border-purple-200/70 dark:border-purple-500/20",
      hoverBorder: "hover:border-purple-400 dark:hover:border-purple-500/40",
      badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/40",
      iconBg: "bg-purple-600 text-white shadow-purple-500/20",
      button: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/15",
    },
  },
];

export const quickActions = [
  {
    id: "ai-mentor",
    title: "Ask AI Mentor",
    description: "Instant explanations, dry runs & algorithmic proofing",
    icon: "Bot",
    color: "from-blue-600 to-indigo-600",
    badge: "AI Powered",
    actionType: "open-ai",
  },
  {
    id: "visualize-concept",
    title: "Visualize a Concept",
    description: "Run step-by-step visualizations for any CS topic",
    icon: "Sparkles",
    color: "from-cyan-600 to-blue-600",
    badge: "Interactive",
    actionType: "open-visualizer",
  },
];

export const aiMentorKnowledgeBase = [
  {
    keywords: ["recursion", "backtracking", "n-queens", "subset"],
    response: `**Backtracking Explained Step-by-Step:**

Backtracking is an algorithmic paradigm that searches incrementally for solutions by trying to build a solution candidate, and abandons a candidate (*"backtracks"*) as soon as it determines the candidate cannot possibly be completed to a valid solution.

**Key Formula / Template:**
\`\`\`javascript
function backtrack(path, choices) {
  if (isSolution(path)) {
    result.push([...path]);
    return;
  }
  for (let choice of choices) {
    if (isValid(choice, path)) {
      path.push(choice);          // 1. Make choice
      backtrack(path, newChoices); // 2. Recurse
      path.pop();                 // 3. Undo choice (Backtrack)
    }
  }
}
\`\`\`

Would you like me to launch the step-by-step **N-Queens Visualizer** on your canvas?`,
  },
  {
    keywords: ["round robin", "os", "scheduling", "gantt", "quantum"],
    response: `**Round Robin (RR) CPU Scheduling:**

- **Preemptive** algorithm designed especially for time-sharing systems.
- Every ready process is assigned a fixed time slot called **Time Quantum (q)**.
- If a process does not complete within its quantum, it is **preempted** and appended to the tail of the Ready Queue.

**Formulas:**
- Turnaround Time ($TAT$) = $\\text{Completion Time} - \\text{Arrival Time}$
- Waiting Time ($WT$) = $TAT - \\text{Burst Time}$

*Tip: If Time Quantum is too large, RR degenerates to FCFS. If too small, context-switch overhead dominates.*`,
  },
  {
    keywords: ["tcp", "handshake", "syn", "ack", "network"],
    response: `**TCP 3-Way Handshake Protocol:**

1. **SYN (Synchronize):** Client sends a segment with \`SYN = 1\`, random \`Seq = X\`. Client enters \`SYN_SENT\` state.
2. **SYN-ACK (Synchronize-Acknowledge):** Server receives SYN, replies with \`SYN = 1\`, \`ACK = 1\`, \`Seq = Y\`, \`Ack = X + 1\`. Server enters \`SYN_RCVD\`.
3. **ACK (Acknowledge):** Client sends \`ACK = 1\`, \`Seq = X + 1\`, \`Ack = Y + 1\`. Connection is now **ESTABLISHED** on both ends!

*Would you like to step through the packet flow animation?*`,
  },
  {
    keywords: ["graph", "bfs", "dfs", "dijkstra", "traversal"],
    response: `**Graph Traversal Overview:**

- **BFS (Breadth-First Search):** Uses a **FIFO Queue**. Explores level by level. Optimal for unweighted shortest paths. Time complexity: $O(V + E)$.
- **DFS (Depth-First Search):** Uses a **LIFO Stack / Call Stack**. Explores deeply along each branch before backtracking. Great for cycle detection, topological sorting, and connected components.`,
  },
  {
    keywords: ["system design", "redis", "cache", "load balancer"],
    response: `**System Design: Distributed Caching Architecture**

1. **Cache-Aside Pattern:** App checks Redis first. On cache miss, it queries PostgreSQL, then writes to Redis with TTL.
2. **Eviction Policies:** LRU (Least Recently Used), LFU (Least Frequently Used).
3. **Cache Invalidation:** Keep TTLs reasonable and invalidate on database updates to avoid stale data.`,
  },
];

export const mockDefaultAiResponse = (query) => {
  const lower = query.toLowerCase();
  for (const item of aiMentorKnowledgeBase) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      return item.response;
    }
  }
  return `Great question regarding **"${query}"**! 

In Computer Science, mastering this concept involves understanding the theoretical foundation, state transitions, and time/space complexity tradeoffs.

- **Key Takeaway:** Break down the problem into base states and transition functions.
- **Visual Dry Run:** Check out the interactive module in the sidebar to simulate this with custom inputs.

Is there a specific sub-topic or code dry run you would like to explore next?`;
};
