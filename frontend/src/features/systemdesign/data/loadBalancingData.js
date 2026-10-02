/**
 * Data and configuration for Load Balancing & Scalability Module
 */

export const LB_STEPS = [
  { id: 'concepts', label: '1. Concepts & Routing', short: 'Concepts', icon: 'BookOpen', desc: 'Core Principles, L4 vs L7 & Health Checks' },
  { id: 'visualizer', label: '2. Live Architecture Flow', short: 'Live Architecture', icon: 'GitFork', desc: 'Users ➔ Load Balancer ➔ Server Pool' },
  { id: 'algorithms', label: '3. Algorithm Deep-Dive', short: 'Algorithms', icon: 'Cpu', desc: 'Round Robin vs. Least Connections' },
  { id: 'failover', label: '4. Failover & Resilience', short: 'Failover Lab', icon: 'ShieldAlert', desc: 'Health Checks & Redundant Load Balancers' },
  { id: 'scaling', label: '5. Vertical vs Horizontal', short: 'Scaling Matrix', icon: 'Layers', desc: 'Hardware Upgrade vs Fleet Expansion' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Mastery Review & Assessment' },
];

export const LB_CONCEPTS = [
  {
    id: 'why-lb',
    title: 'Why is Load Balancing Required?',
    tag: 'Traffic Distribution',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    summary: 'A Load Balancer acts as a reverse proxy traffic cop, evenly distributing incoming client network requests across a pool of backend servers to maximize throughput, minimize latency, and eliminate server bottlenecks.',
    keyPoints: [
      'Prevents any single server from becoming an overloaded bottleneck.',
      'Enables horizontal scaling by allowing compute nodes to be added/removed dynamically.',
      'Increases system availability by automatically rerouting traffic away from unhealthy servers.'
    ],
    realWorldExample: 'Netflix utilizes AWS Elastic Load Balancers (ALBs and NLBs) to distribute millions of concurrent video stream metadata requests across tens of thousands of containerized microservices.',
    formula: 'Incoming Requests ➔ Load Balancer ➔ Target Server Pool (Capacity Balanced)'
  },
  {
    id: 'l4-vs-l7',
    title: 'Layer 4 (Transport) vs. Layer 7 (Application) Balancing',
    tag: 'OSI Layers',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    summary: 'Load balancers operate at different layers of the OSI model, trading packet inspection intelligence for raw routing speed.',
    keyPoints: [
      'Layer 4 (L4 / Transport): Routes based solely on IP address and TCP/UDP port (e.g. HAProxy, AWS NLB, IPVS). Ultra-high throughput (millions of packets/sec), but cannot inspect HTTP headers or URLs.',
      'Layer 7 (L7 / Application): Routes based on HTTP headers, cookies, URL paths (e.g. /api/v1/checkout vs /images), and query params (e.g. NGINX, Envoy, AWS ALB). Highly intelligent routing with TLS termination, but higher CPU consumption.'
    ],
    realWorldExample: 'An e-commerce company routes `/images/*` to an optimized static asset server and `/checkout` to a secure payments microservice using Layer 7 path-based routing.',
    formula: 'L4 = Fast Packet Routing (IP:Port) | L7 = Smart Content-Aware Routing (HTTP Headers/URL)'
  },
  {
    id: 'health-checks',
    title: 'Health Checks & Automatic Failover',
    tag: 'Reliability',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    summary: 'Load balancers continuously ping backend servers with heartbeat health checks. If a server fails consecutive checks, it is removed from the active routing pool within seconds.',
    keyPoints: [
      'Active Health Checks: Periodic synthetic probes (e.g. `GET /healthz` returning HTTP 200 OK every 5 seconds).',
      'Passive Health Checks: Monitors live traffic for real error responses (e.g. three consecutive HTTP 500/504 errors trigger temporary quarantine).',
      'Unhealthy Threshold: Requires 2-3 consecutive failures before quarantine to prevent flapping on temporary network blips.'
    ],
    realWorldExample: 'Kubernetes uses liveness and readiness HTTP probes to ensure kube-proxy only routes traffic to pods that have completed initialization.',
    formula: '3 Failed Probes ➔ Isolate Server ➔ Reroute New Traffic ➔ Zero Customer Downtime'
  },
  {
    id: 'redundancy-spof',
    title: 'Redundant Load Balancers & Eliminating SPOF',
    tag: 'High Availability',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    summary: 'A single load balancer is itself a Single Point of Failure (SPOF). Production architectures pair load balancers in Active-Passive or Active-Active clusters.',
    keyPoints: [
      'Active-Passive with VRRP (Keepalived): Primary LB handles traffic while Standby LB monitors via heartbeats. If Primary dies, Standby acquires the Virtual IP (VIP) in < 1 second.',
      'Active-Active with DNS Anycast: Multiple load balancers share the same public IP address; BGP routing directs requests to the topologically nearest healthy load balancer.',
      'SLA Boost: Upgrades availability from ~99.9% (single LB risk) to 99.999% (five nines).'
    ],
    realWorldExample: 'Cloudflare distributes edge traffic across hundreds of globally distributed Anycast load balancing nodes simultaneously.',
    formula: 'Virtual IP (VIP) + Active-Passive Heartbeat ➔ Automatic VIP Failover in < 500ms'
  }
];

export const INITIAL_SERVERS = [
  {
    id: 'server-1',
    name: 'Server A',
    ip: '10.0.1.101',
    port: 8080,
    capacity: 6, // Max concurrent connections
    activeConnections: 0,
    isHealthy: true,
    isEnabled: true,
    requestsReceived: 0,
    requestsCompleted: 0,
    requestsFailed: 0,
    color: 'purple'
  },
  {
    id: 'server-2',
    name: 'Server B',
    ip: '10.0.1.102',
    port: 8080,
    capacity: 6,
    activeConnections: 0,
    isHealthy: true,
    isEnabled: true,
    requestsReceived: 0,
    requestsCompleted: 0,
    requestsFailed: 0,
    color: 'blue'
  },
  {
    id: 'server-3',
    name: 'Server C',
    ip: '10.0.1.103',
    port: 8080,
    capacity: 6,
    activeConnections: 0,
    isHealthy: true,
    isEnabled: true,
    requestsReceived: 0,
    requestsCompleted: 0,
    requestsFailed: 0,
    color: 'emerald'
  }
];

export const SCALING_COMPARISON_DATA = {
  vertical: {
    title: 'Vertical Scaling (Scale Up)',
    subtitle: 'Make the Existing Machine Bigger',
    pros: [
      'Zero application architecture refactoring (no distributed state/caching required).',
      'No inter-server network latency or RPC communication overhead.',
      'Simpler database consistency models (ACID transactions on a single node).'
    ],
    cons: [
      'Hard physical hardware ceiling (maximum RAM/CPU sockets available on a motherboard).',
      'Single Point of Failure (SPOF) — if the main server hardware fails, the entire application goes down.',
      'Exponential hardware cost scaling (doubling server size often quadruples cost).',
      'Requires downtime or complex hypervisor migration during hardware upgrades.'
    ]
  },
  horizontal: {
    title: 'Horizontal Scaling (Scale Out)',
    subtitle: 'Add More Standard Commodity Machines Behind a Load Balancer',
    pros: [
      'Virtually unlimited elastic scaling (add 10 to 1,000+ nodes on demand during traffic spikes).',
      'High fault tolerance & resilience (any node can crash without taking down the service).',
      'Linear, cost-effective cost scaling using standard cloud virtual machines.',
      'Zero-downtime rolling software deployments and automatic canary testing.'
    ],
    cons: [
      'Requires stateless server architecture (sessions stored in JWT or Redis).',
      'Requires load balancers, health checks, and service discovery mechanisms.',
      'Distributed data consistency and database sharding complexities.'
    ]
  }
};

export const LB_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How does the Round Robin algorithm decide which server receives the next incoming request?',
    options: [
      'It sends the request to the server with the lowest CPU utilization.',
      'It cycles sequentially through healthy servers in a deterministic circular order (e.g. A ➔ B ➔ C ➔ A).',
      'It computes the SHA-256 hash of the client IP address.',
      'It sends all requests to Server A until Server A reaches 100% capacity.'
    ],
    correctIndex: 1,
    explanation: 'Round Robin maintains a sequential pointer that iterates cyclically across healthy servers (Server 1, Server 2, Server 3, then back to Server 1), skipping any node currently marked unhealthy or disabled.'
  },
  {
    id: 2,
    question: 'In which scenario will the Least Connections algorithm perform significantly better than standard Round Robin?',
    options: [
      'When all incoming requests take the exact same 10 milliseconds to process.',
      'When requests have highly variable processing durations (e.g., short 10ms cached queries mixed with long 5000ms report exports).',
      'When there is only one backend server in the pool.',
      'When all backend servers have identical CPU and RAM specifications.'
    ],
    correctIndex: 1,
    explanation: 'When request durations vary widely, Round Robin can pile multiple long-running requests onto the same server, causing severe queueing. Least Connections dynamically routes new requests to servers with the fewest active workloads.'
  },
  {
    id: 3,
    question: 'What is the purpose of an Active-Passive redundant load balancer setup using a Virtual IP (VIP)?',
    options: [
      'To make database queries execute twice as fast.',
      'To eliminate the Load Balancer as a Single Point of Failure (SPOF) by enabling instant failover if the primary LB dies.',
      'To compress HTTP response bodies before sending them to the client browser.',
      'To prevent users from opening multiple browser tabs.'
    ],
    correctIndex: 1,
    explanation: 'A single load balancer is a single point of failure. In an Active-Passive pair, the Standby load balancer monitors the Primary via heartbeat; if the Primary fails, the Standby automatically takes over the Virtual IP (VIP) with sub-second failover.'
  },
  {
    id: 4,
    question: 'What is the key limitation of Vertical Scaling (Scaling Up) compared to Horizontal Scaling (Scaling Out)?',
    options: [
      'Vertical scaling requires using Kubernetes and Docker containers.',
      'Vertical scaling hits hard hardware maximums and retains a single point of failure with high downtime risk.',
      'Vertical scaling is not supported by Linux operating systems.',
      'Vertical scaling cannot be used with relational databases like PostgreSQL.'
    ],
    correctIndex: 1,
    explanation: 'Vertical scaling is bounded by the maximum CPU and RAM a single motherboard can hold, becomes exponentially expensive, and creates a severe Single Point of Failure where hardware failure takes down the entire system.'
  }
];
