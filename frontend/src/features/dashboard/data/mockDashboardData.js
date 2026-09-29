export const studentProfile = {
  name: "Ritesh Patil",
  initials: "RP",
  role: "B.Tech Computer Science",
  specialization: "Final Year • Semester 6",
  rollNo: "BT22CSE084",
  email: "ritesh.patil@student.ac.in",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  streakDays: 14,
  cohortRank: "#4 in Cohort",
  dailyTarget: {
    completed: 3,
    total: 4,
    label: "Daily Goal: 3/4 Tasks",
  },
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
      title: "Simulation Completed: OS Scheduling",
      description: "You completed CPU Scheduling & Deadlocks interactive simulation!",
      time: "2h ago",
      unread: true,
      type: "simulation",
    },
    {
      id: 3,
      title: "AI Mentor Reminder",
      description: "Recommended: Review Graph Traversal and Dry Runs.",
      time: "1d ago",
      unread: false,
      type: "ai",
    },
  ],
};

export const continueLearningData = {
  module: "Data Structures & Algorithms",
  topic: "Recursion & Backtracking",
  subtopic: "N-Queens & Subsets State-Space Tree",
  lastActivity: "Backtracking Visualization",
  progress: 72,
  completedSteps: 18,
  totalSteps: 25,
  estimatedTimeLeft: "15 mins remaining",
  badge: "In Progress",
  accentColor: "indigo",
};

export const coreModules = [
  {
    id: "dsa",
    name: "DSA Learning & Visualization",
    shortName: "DSA",
    tagline: "Data Structures & Algorithms",
    description: "Understand algorithms through AI explanations, dry runs and interactive visualizations.",
    progress: 68,
    completedTopics: 24,
    totalTopics: 36,
    badgeText: "Algorithms",
    accentColor: "indigo",
    route: "/dashboard?module=dsa",
    popularTopics: ["Binary Search Trees", "Dijkstra's Algorithm", "Dynamic Programming", "QuickSort"],
    colorTheme: {
      lightBg: "bg-indigo-50/70",
      darkBg: "dark:bg-indigo-950/20",
      border: "border-indigo-200/70 dark:border-indigo-500/20",
      hoverBorder: "hover:border-indigo-400 dark:hover:border-indigo-500/40",
      badge: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700/40",
      iconBg: "bg-indigo-600 text-white shadow-indigo-500/20",
      progressFill: "bg-indigo-600 dark:bg-indigo-500",
      button: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/15",
    },
  },
  {
    id: "os",
    name: "Operating Systems",
    shortName: "OS",
    tagline: "Core Kernel & Scheduling",
    description: "Simulate process scheduling, memory management and OS concepts.",
    progress: 42,
    completedTopics: 15,
    totalTopics: 35,
    badgeText: "Systems",
    accentColor: "cyan",
    route: "/dashboard?module=os",
    popularTopics: ["Round Robin Gantt", "Banker's Deadlock", "LRU Page Replacement", "Semaphores"],
    colorTheme: {
      lightBg: "bg-cyan-50/70",
      darkBg: "dark:bg-cyan-950/20",
      border: "border-cyan-200/70 dark:border-cyan-500/20",
      hoverBorder: "hover:border-cyan-400 dark:hover:border-cyan-500/40",
      badge: "bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700/40",
      iconBg: "bg-cyan-600 text-white shadow-cyan-500/20",
      progressFill: "bg-cyan-500 dark:bg-cyan-400",
      button: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-500/15",
    },
  },
  {
    id: "networks",
    name: "Computer Networks",
    shortName: "Networks",
    tagline: "Protocols & Packet Tracing",
    description: "Visualize packet flow, protocols, routing and network communication.",
    progress: 35,
    completedTopics: 12,
    totalTopics: 34,
    badgeText: "Networking",
    accentColor: "emerald",
    route: "/dashboard?module=networks",
    popularTopics: ["TCP 3-Way Handshake", "OSI 7 Layers", "DNS Lookup", "Subnet Masking"],
    colorTheme: {
      lightBg: "bg-emerald-50/70",
      darkBg: "dark:bg-emerald-950/20",
      border: "border-emerald-200/70 dark:border-emerald-500/20",
      hoverBorder: "hover:border-emerald-400 dark:hover:border-emerald-500/40",
      badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
      iconBg: "bg-emerald-600 text-white shadow-emerald-500/20",
      progressFill: "bg-emerald-500 dark:bg-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/15",
    },
  },
  {
    id: "sysdesign",
    name: "System Design",
    shortName: "SysDesign",
    tagline: "Distributed Architectures",
    description: "Explore real-world architectures, request flows and scalable system components.",
    progress: 28,
    completedTopics: 8,
    totalTopics: 28,
    badgeText: "Architecture",
    accentColor: "purple",
    route: "/dashboard?module=sysdesign",
    popularTopics: ["Load Balancer Setup", "Redis Caching Layer", "Database Sharding", "Kafka Messaging"],
    colorTheme: {
      lightBg: "bg-purple-50/70",
      darkBg: "dark:bg-purple-950/20",
      border: "border-purple-200/70 dark:border-purple-500/20",
      hoverBorder: "hover:border-purple-400 dark:hover:border-purple-500/40",
      badge: "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700/40",
      iconBg: "bg-purple-600 text-white shadow-purple-500/20",
      progressFill: "bg-purple-600 dark:bg-purple-400",
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

export const learningStats = [
  {
    id: "hours",
    label: "Learning Hours",
    value: "48.5",
    unit: "hrs",
    delta: "+14%",
    trend: "up",
    subtext: "vs last week (Avg 2.4h/day)",
    icon: "Clock",
    color: "text-blue-600 dark:text-blue-400",
    bgLight: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    id: "topics",
    label: "Topics Completed",
    value: "59",
    unit: "/133",
    delta: "+5",
    trend: "up",
    subtext: "topics mastered this week",
    icon: "CheckCircle2",
    color: "text-emerald-600 dark:text-emerald-400",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    id: "simulations",
    label: "Concepts Mastered",
    value: "42",
    unit: "/60",
    delta: "Top 5%",
    trend: "badge",
    subtext: "High mastery across modules",
    icon: "Trophy",
    color: "text-amber-600 dark:text-amber-400",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
  },
  {
    id: "streak",
    label: "Learning Streak",
    value: "14",
    unit: "Days 🔥",
    delta: "Best",
    trend: "badge",
    subtext: "Active today • Keep it up!",
    icon: "Flame",
    color: "text-rose-600 dark:text-rose-400",
    bgLight: "bg-rose-50 dark:bg-rose-950/40",
  },
];

export const weeklyActivityData = [
  { day: "Mon", hours: 3.2, target: 3.0, completed: true, topics: 3, sessions: 2, date: "Mon, 24 Feb" },
  { day: "Tue", hours: 4.5, target: 3.0, completed: true, topics: 4, sessions: 3, date: "Tue, 25 Feb" },
  { day: "Wed", hours: 2.8, target: 3.0, completed: false, topics: 2, sessions: 2, date: "Wed, 26 Feb" },
  { day: "Thu", hours: 5.1, target: 3.0, completed: true, topics: 5, sessions: 4, peak: true, date: "Thu, 27 Feb" },
  { day: "Fri", hours: 3.6, target: 3.0, completed: true, topics: 3, sessions: 2, date: "Fri, 28 Feb" },
  { day: "Sat", hours: 6.2, target: 3.0, completed: true, topics: 6, sessions: 5, peak: true, date: "Sat, 01 Mar" },
  { day: "Sun", hours: 4.0, target: 3.0, completed: true, topics: 4, sessions: 3, isToday: true, date: "Sun, 02 Mar" },
];

export const aiRecommendations = [
  {
    id: 1,
    title: "Graph Traversal (BFS / DFS)",
    module: "Data Structures & Algorithms",
    difficulty: "Medium",
    badgeType: "weak",
    badgeLabel: "Review Topic",
    reason: "Recommended simulation for cycle detection & pathfinding algorithms.",
    actionText: "Visualize Graph",
    actionType: "visualize",
    time: "20 min",
    icon: "Network",
    accent: "indigo",
  },
  {
    id: 2,
    title: "Round Robin Scheduling",
    module: "Operating Systems",
    difficulty: "Medium",
    badgeType: "continue",
    badgeLabel: "Continue OS",
    reason: "2 unfinished interactive Gantt chart time-quantum simulations.",
    actionText: "Simulate Gantt",
    actionType: "visualize",
    time: "15 min",
    icon: "Cpu",
    accent: "cyan",
  },
  {
    id: 3,
    title: "TCP Three-Way Handshake",
    module: "Computer Networks",
    difficulty: "Easy",
    badgeType: "next",
    badgeLabel: "Next Topic",
    reason: "Prerequisite for understanding SYN floods & HTTP/3 Transport.",
    actionText: "Start Learning",
    actionType: "learn",
    time: "12 min",
    icon: "Wifi",
    accent: "emerald",
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
- **DFS (Depth-First Search):** Uses a **LIFO Stack / Call Stack**. Explores deeply along each branch before backtracking. Great for cycle detection, topological sorting, and connected components.

*AlgoVision Tip: Practice the Weak Topic "Cycle Detection in Directed Graphs" to boost your cohort score!*`,
  },
  {
    keywords: ["system design", "redis", "cache", "load balancer"],
    response: `**System Design: Distributed Caching Architecture**

1. **Cache-Aside Pattern:** App checks Redis first. On cache miss, it queries PostgreSQL, then writes to Redis with TTL.
2. **Eviction Policies:** LRU (Least Recently Used), LFU (Least Frequently Used).
3. **Cache Invalidation:** Keep TTLs reasonable and invalidate on database updates to avoid stale data.

*Would you like to explore the High-Availability Cluster interactive diagram?*`,
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
