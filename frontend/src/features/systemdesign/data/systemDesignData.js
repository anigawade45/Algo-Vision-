/**
 * System Design & Distributed Systems Tracks Data
 * Structured identically to Computer Networks (CN) module tracks
 */

export const SYSTEM_DESIGN_TOPICS = [
  {
    id: 'fundamentals',
    title: 'System Design Basics & Client-Server Architecture',
    description: 'Master core system design principles, functional vs non-functional requirements, 5-stage client-server request-response lifecycle, stateless vs stateful servers, and quality attributes simulation.',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/fundamentals',
    badge: 'Foundational Track',
    badgeColor: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
  },
  {
    id: 'load-balancing',
    title: 'Load Balancing, Routing & Horizontal Scalability',
    description: 'Explore Layer 4 vs Layer 7 traffic routing, Round Robin, Least Connections, active/passive redundant failover clusters, and vertical vs horizontal scaling trade-offs.',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/load-balancing',
    badge: 'Traffic & Routing',
    badgeColor: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
  },
  {
    id: 'caching',
    title: 'Distributed Caching Strategies & Redis',
    description: 'Simulate Cache-Aside, Write-Through, Write-Back, and Write-Around patterns, Redis key-value storage, Cache Stampede mitigation, and eviction algorithms (LRU, LFU, FIFO).',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/caching',
    badge: 'High-Speed Caching',
    badgeColor: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
  },
  {
    id: 'database-scaling',
    title: 'Database Sharding, Replication & Partitioning',
    description: 'Analyze SQL vs NoSQL, B-Tree database indexing, Primary-Replica replication lag, range/hash-based database sharding, cross-shard queries, and read vs write scaling.',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/database-scaling',
    badge: 'Data Tier & Storage',
    badgeColor: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
  },
  {
    id: 'message-queues',
    title: 'Message Queues & Event Streaming (Kafka / RabbitMQ)',
    description: 'Understand sync vs async processing, FIFO message queues, worker pools, exponential backoff retries, Dead-Letter Queues (DLQ), and idempotent delivery.',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/message-queues',
    badge: 'Event-Driven Systems',
    badgeColor: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting Algorithms & API Gateways',
    description: 'Simulate Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window rate limiting algorithms, distributed throttling with Redis sliding logs, and API Gateway capabilities.',
    //author: 'Core Architecture Team',
    //status: 'Live & Ready',
    isLive: true,
    path: '/systemdesign/rate-limiting',
    badge: 'API Gateways & Limits',
    badgeColor: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800'
  },
];