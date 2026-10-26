/**
 * Master Computer Science & AlgoVision Knowledge Base
 * Encompasses DSA, Operating Systems, Computer Networks, System Design, and Platform Navigation.
 */

const ALGOVISION_KNOWLEDGE_BASE = {
  appName: "AlgoVision",
  tagline: "Interactive Computer Science Visualization & Multi-Language Code Execution Sandbox",
  description: "AlgoVision is a modern educational application built for students and engineers to visually understand and execute algorithms in Data Structures & Algorithms, Operating Systems, Networking, and Core CS Concepts.",

  navigationIndex: {
    "/": "Landing Home Page showcasing platform tracks, interactive modules, and feature overviews.",
    "/dashboard": "Student Dashboard with learning tracks, progress metrics, module launcher, and quick access cards.",
    "/os": "Operating Systems Hub containing 9 interactive visualizer modules.",
    "/os/process-management": "Process Management Module (Fork Process Tree, PCB Inspector, 5-State Life Cycle Diagram).",
    "/os/cpu-scheduling": "CPU Scheduling Algorithms (FCFS, SJF Non-Preemptive, SRTF Preemptive, Priority, Round Robin).",
    "/os/deadlocks": "Deadlocks Module (Resource Allocation Graph RAG, DFS Cycle Detection, Wait-For Graph WFG Reduction).",
    "/os/bankers-algorithm": "Banker's Avoidance Engine (Dijkstra's Safety Algorithm, Need Matrix calculation, Resource Request Bench).",
    "/os/process-synchronization": "Process Synchronization (Race Conditions, Mutex Locks, Counting Semaphores, Bounded Buffer Producer-Consumer, Readers-Writers).",
    "/os/memory-management": "Memory Management & Allocation (Address Translation, Relocation Registers, First Fit, Best Fit, Worst Fit, Compaction).",
    "/os/paging-segmentation": "Paging & Segmentation Module (Paging Translation Page p + Offset d -> Frame f, Segmentation Limit check Trap).",
    "/os/page-replacement": "Page Replacement Algorithms (FIFO, LRU, Optimal, Second Chance Clock).",
    "/os/disk-scheduling": "Disk Scheduling Algorithms (FCFS, SSTF, SCAN Elevator, C-SCAN, LOOK, C-LOOK)."
  },

  keyFeatures: {
    "Interactive Visualizers": "Step-by-step playback controls (Play, Pause, Step Next, Step Prev, Speed Slider, Reset). Allows students to watch state changes in real time.",
    "Code Lab & Execution Terminal": "Embedded Monaco Code Editor with line numbers, syntax highlighting, and real-time execution terminal output. Supports JavaScript, C++, Java, and Python.",
    "Use Current Visualizer Input": "Found inside the Code Lab 'Program Input Parameters' panel. Clicking '⚡ Use Current Visualizer Input' automatically extracts active visualizer settings (e.g., page reference string, frame count, disk requests, or process matrices) and imports them into the Code Lab input fields.",
    "Time & Space Complexity Tables": "Located at the bottom of each module page in the 'Key Summary & Comparison Table' section, as well as live metrics badges inside the visualizer cards."
  },

  domains: {
    dsa: {
      title: "Data Structures & Algorithms (DSA)",
      topics: [
        "Arrays & Strings", "Linked Lists (Singly, Doubly, Circular)", "Stacks & Queues",
        "Hash Tables & Collision Resolution (Chaining, Open Addressing)",
        "Trees & Binary Search Trees (BST)", "Heaps & Priority Queues",
        "Graphs (Adjacency Matrix/List, BFS, DFS, Dijkstra, Bellman-Ford, Kruskal, Prim)",
        "Sorting Algorithms (Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix)",
        "Searching Algorithms (Binary Search, Linear Search, Ternary Search)",
        "Dynamic Programming (0/1 Knapsack, LCS, LIS, Matrix Chain, Coin Change)",
        "Greedy Algorithms (Fractional Knapsack, Huffman Coding, Activity Selection)",
        "Time & Space Complexity Derivations (Big-O, Big-Omega, Big-Theta)"
      ]
    },

    os: {
      title: "Operating Systems (OS)",
      topics: [
        "Process vs Thread, PCB (Process Control Block), Context Switching",
        "CPU Scheduling (FCFS, SJF, SRTF, Priority, Round Robin)",
        "Process Synchronization (Race Conditions, Mutex, Semaphores, Critical Section, Producer-Consumer, Readers-Writers)",
        "Deadlocks (Handling, RAG, DFS Cycle Detection, Dijkstra's Banker's Algorithm)",
        "Memory Management (Contiguous Allocation, First/Best/Worst Fit, Fragmentation, Compaction)",
        "Paging & Segmentation (Logical vs Physical Address, Page Table, MMU, Segment Limit Trap)",
        "Page Replacement (FIFO, LRU, Optimal, Second Chance Clock)",
        "Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK)"
      ]
    },

    cn: {
      title: "Computer Networks (CN)",
      topics: [
        "OSI 7-Layer Model & TCP/IP 4-Layer Model",
        "Application Layer Protocols (HTTP/HTTPS, DNS, DHCP, FTP, SSH, SMTP)",
        "Transport Layer Protocols (TCP vs UDP, TCP 3-Way Handshake, Flow Control, Congestion Control)",
        "Network Layer (IPv4 & IPv6, Subnetting, CIDR, Router Operation, ICMP, ARP)",
        "Routing Algorithms (Distance Vector, Link State, OSPF, BGP)",
        "Socket Programming & Client-Server Communication"
      ]
    },

    systemDesign: {
      title: "System Design & Software Architecture",
      topics: [
        "Scalability (Vertical vs Horizontal Scaling, Stateless vs Stateful Services)",
        "Load Balancing (Round Robin, Least Connections, IP Hash, Nginx/HAProxy)",
        "Database Architecture (SQL vs NoSQL, Indexing, Sharding, Replication, ACID vs BASE)",
        "Caching Strategies (Cache-Aside, Write-Through, Redis, Memcached, CDN)",
        "Asynchronous Messaging (Message Queues, Kafka, RabbitMQ, Publisher-Subscriber)",
        "CAP Theorem & Distributed System Trade-offs"
      ]
    }
  },

  faqGuide: [
    {
      question: "Where is time complexity explained?",
      answer: "Scroll down to the 'Key Summary & Comparison Table' section at the bottom of any module page, or check the metrics badges inside the visualizer cards."
    },
    {
      question: "How do I run a simulation?",
      answer: "Select your desired tab or algorithm on any module page, adjust input parameters or choose a preset example, and use the 'Play' or 'Step Next' buttons in the playback bar."
    },
    {
      question: "How do I use the Code Lab?",
      answer: "Click the 'Code Lab & Execution Terminal' tab on any module page. Select your language (JS, C++, Java, Python) from the dropdown, write/edit your code, and press Ctrl+Enter or click 'Run Code'."
    },
    {
      question: "How do I test my visualizer inputs in Code Lab?",
      answer: "In the Code Lab tab, look at the top of the 'Program Input Parameters' panel and click the '⚡ Use Current Visualizer Input' button."
    }
  ]
};

module.exports = ALGOVISION_KNOWLEDGE_BASE;
