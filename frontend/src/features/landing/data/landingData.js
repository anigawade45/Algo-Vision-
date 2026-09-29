import {
  GitBranch,
  Cpu,
  Database,
  Network,
  Boxes,
  Layers3,
  Layers,
  Binary,
  Wifi,
  Server,
  Eye,
  Brain,
  Link,
  Sliders,
  Bot,
  FileCode2,
  BrainCircuit,
  Unlink,
  Gauge,
} from 'lucide-react';

/**
 * Structured Landing Page Data Configuration
 * Maintains single source of truth for CS domains, capabilities, curriculum modules, FAQs, and AI prompts.
 */

export const CS_DOMAINS_DATA = [
  {
    id: 'dsa',
    label: 'Data Structures & Algorithms',
    short: 'DSA',
    icon: GitBranch,
    color: 'blue',
    description: 'Visualize algorithms, data structures and problem-solving patterns.',
    concepts: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    metric: '120+ Concepts',
  },
  {
    id: 'os',
    label: 'Operating Systems',
    short: 'OS',
    icon: Cpu,
    color: 'violet',
    description: 'Understand processes, memory, scheduling and system behavior.',
    concepts: ['Processes', 'Threads', 'Memory', 'Scheduling'],
    metric: '40+ Concepts',
  },
  {
    id: 'dbms',
    label: 'Database Management',
    short: 'DBMS',
    icon: Database,
    color: 'emerald',
    description: 'Explore queries, indexing, transactions and database internals.',
    concepts: ['SQL', 'Indexing', 'Transactions', 'Normalization'],
    metric: '35+ Concepts',
  },
  {
    id: 'networks',
    label: 'Computer Networks',
    short: 'Networks',
    icon: Network,
    color: 'cyan',
    description: 'See how data moves through protocols and network layers.',
    concepts: ['TCP/IP', 'HTTP', 'DNS', 'Routing'],
    metric: '30+ Concepts',
  },
  {
    id: 'oop',
    label: 'Object-Oriented Programming',
    short: 'OOP',
    icon: Boxes,
    color: 'amber',
    description: 'Understand classes, objects and relationships visually.',
    concepts: ['Classes', 'Inheritance', 'Polymorphism', 'Abstraction'],
    metric: '25+ Concepts',
  },
  {
    id: 'system',
    label: 'System Design',
    short: 'System Design',
    icon: Layers3,
    color: 'rose',
    description: 'Visualize scalable architectures and distributed systems.',
    concepts: ['Caching', 'Load Balancing', 'Queues', 'Scalability'],
    metric: '20+ Concepts',
  },
];

export const CAPABILITIES_DATA = [
  {
    id: 'viz',
    title: 'Concept Visualization',
    description: 'See complex concepts represented visually instead of relying only on static explanations.',
    icon: Eye,
  },
  {
    id: 'behavior',
    title: 'System Behavior',
    description: 'Observe how processes, memory, databases, networks and components behave over time.',
    icon: Brain,
  },
  {
    id: 'connections',
    title: 'Concept Connections',
    description: 'Understand how ideas across different CS domains connect to one another.',
    icon: Link,
  },
  {
    id: 'interactive',
    title: 'Interactive Exploration',
    description: 'Change inputs, explore states, and investigate concepts instead of only reading about them.',
    icon: Sliders,
  },
  {
    id: 'ai',
    title: 'AI Explanation',
    description: 'Ask questions and receive contextual explanations while exploring a concept.',
    icon: Bot,
  },
];

export const PROBLEM_CARDS_DATA = [
  {
    cardNum: '01',
    title: 'Static Learning',
    titleColor: 'border-blue-500/40',
    description: "Reading pseudocode or theory doesn't explain what happens at every execution step.",
    badgeColor: 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    numColor: 'text-blue-600 dark:text-[#3B82F6]',
    icon: FileCode2,
  },
  {
    cardNum: '02',
    title: 'Abstract Concepts',
    titleColor: 'border-purple-500/40',
    description: 'Data structures, operating systems, and networks can be difficult to visualize mentally.',
    badgeColor: 'border-purple-200 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
    numColor: 'text-purple-600 dark:text-purple-400',
    icon: BrainCircuit,
  },
  {
    cardNum: '03',
    title: 'Disconnected Resources',
    titleColor: 'border-cyan-500/40',
    description: 'Students jump between static videos, articles, code platforms, and fragmented notes.',
    badgeColor: 'border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    numColor: 'text-cyan-600 dark:text-cyan-400',
    icon: Unlink,
  },
  {
    cardNum: '04',
    title: 'Limited Feedback',
    titleColor: 'border-blue-500/40',
    description: "Knowing the answer doesn't always mean understanding the execution process.",
    badgeColor: 'border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    numColor: 'text-blue-600 dark:text-[#3B82F6]',
    icon: Gauge,
  },
];

export const FAQ_DATA = [
  {
    category: 'General',
    q: 'What is AlgoVision?',
    a: 'AlgoVision is an interactive Computer Science learning platform built as a B.Tech final-year project. It transforms abstract technical concepts into visual simulations with synchronized step-by-step code execution and AI assistance.',
  },
  {
    category: 'Curriculum',
    q: 'Which Computer Science topics are supported?',
    a: 'AlgoVision supports Data Structures & Algorithms (Arrays, Trees, Graphs, DP), Operating Systems (CPU Scheduling, Memory, Deadlocks), Computer Networks (OSI, TCP/IP, DNS), and System Design architectures.',
  },
  {
    category: 'Visualizer',
    q: 'Can I visualize algorithms step-by-step?',
    a: 'Yes! You have full player controls (Play, Pause, Step Next, Step Previous, Reset, and Speed Slider) allowing you to inspect array indices, pointer movements, and call stack changes at your own pace.',
  },
  {
    category: 'AI Tutor',
    q: 'Does AlgoVision provide AI explanations?',
    a: 'Absolutely. AlgoVision features an integrated AI tutor that provides simplified conceptual breakdowns, hints, real-world analogies, and instant answers tailored to your skill level.',
  },
  {
    category: 'Practice',
    q: 'Can I practice coding problems and test cases?',
    a: 'Yes, AlgoVision includes an interactive code sandbox where you can write code in C++, Java, Python, or JavaScript and run it directly against test cases while viewing real-time visual solutions.',
  },
  {
    category: 'General',
    q: 'Is AlgoVision free for students?',
    a: 'Yes, AlgoVision is completely free and built as an open educational project for Computer Science students and engineering learners.',
  },
];

export const PROMPT_CHIPS_DATA = [
  { label: 'Explain', query: 'Explain monotonic stack in simple terms' },
  { label: 'Simplify', query: 'Simplify Dijkstra algorithm intuition' },
  { label: 'Give Example', query: 'Give a real-world example of CPU scheduling' },
  { label: 'Give Hint', query: 'Give a hint for Two Pointer technique' },
  { label: 'Generate Quiz', query: 'Generate a quick 3-question quiz on B-Trees' },
];
