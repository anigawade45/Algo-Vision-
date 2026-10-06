/**
 * Data and configuration for Distributed Caching & Cache-Aside Module
 */

export const CACHING_STEPS = [
  { id: 'concepts', label: '1. Concepts & Hierarchy', short: 'Principles', icon: 'BookOpen', desc: 'Memory Hierarchy, Hits vs. Misses & Latency' },
  { id: 'visualizer', label: '2. Cache-Aside Simulator', short: 'Live Simulator', icon: 'Database', desc: 'Client ➔ Server ➔ Redis ➔ SQL DB' },
  { id: 'strategies', label: '3. Caching Strategies', short: 'Write Strategies', icon: 'Layers', desc: 'Cache-Aside, Write-Through & Write-Back' },
  { id: 'invalidation', label: '4. TTL & Invalidation', short: 'TTL & Stale Data', icon: 'Clock', desc: 'Expiration, Invalidation & Cache Stampede' },
  { id: 'eviction', label: '5. Eviction Policies', short: 'LRU / LFU / FIFO', icon: 'Cpu', desc: 'Memory Caps & Buffer Eviction Algorithms' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Mastery Review & Assessment' },
];

export const LATENCY_HIERARCHY = [
  { level: 'CPU L1 Cache', time: '0.5 ns', multiplier: '1x', type: 'cpu', desc: 'On-die ultra-fast silicon SRAM' },
  { level: 'CPU L2 / L3 Cache', time: '7 ns', multiplier: '14x', type: 'cpu', desc: 'Shared processor SRAM' },
  { level: 'System RAM (Redis / Memcached)', time: '100 ns (~1ms network roundtrip)', multiplier: '200x', type: 'ram', desc: 'In-memory key-value store' },
  { level: 'NVMe Solid State Drive (SSD)', time: '100 μs', multiplier: '200,000x', type: 'disk', desc: 'Fast block storage read' },
  { level: 'Relational DB Query (PostgreSQL / MySQL)', time: '20 ms – 100 ms', multiplier: '200,000,000x', type: 'db', desc: 'Disk I/O, joins, indexes, locking' },
  { level: 'Cross-Region / Remote Cloud API', time: '150 ms – 350 ms', multiplier: '700,000,000x', type: 'network', desc: 'Trans-Atlantic WAN fiber hop' },
];

export const CACHING_CONCEPTS = [
  {
    id: 'why-cache',
    title: 'Why is Caching Essential in Distributed Systems?',
    tag: 'High-Throughput',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    summary: 'Caching stores copies of frequently requested data in fast, transient in-memory storage (e.g., Redis or Memcached) to bypass expensive database I/O and heavy computational operations.',
    keyPoints: [
      'Sub-millisecond read latencies compared to 50ms+ database disk queries.',
      'Protects backend database clusters from saturation and connection pool exhaustion.',
      'Increases system throughput from thousands of requests per second to millions.',
    ],
    realWorldExample: 'Twitter caches user home timelines in Redis clusters so viewing tweets does not trigger multi-table database joins across millions of follower records.',
    formula: 'Avg Latency = (Hit Ratio × Cache Latency) + (Miss Ratio × DB Query Latency)'
  },
  {
    id: 'hit-vs-miss',
    title: 'Cache Hit vs. Cache Miss Anatomy',
    tag: 'Lifecycle',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    summary: 'Every cache read produces either an instantaneous cache hit or a cache miss requiring a fallback database retrieval.',
    keyPoints: [
      'Cache Hit: Requested key exists in memory and TTL is valid. Returned immediately (~1ms) with zero DB load.',
      'Cache Miss: Key is not found or has expired. App server queries database (~80ms), populates cache for subsequent requests, and returns data.',
      'Target Hit Ratio: Production web apps aim for a Cache Hit Ratio > 85–95%.'
    ],
    realWorldExample: 'An e-commerce flash sale caches product details. The first shopper incurs a miss (populating Redis); the next 100,000 shoppers enjoy instant cache hits.',
    formula: 'Cache Hit Ratio (%) = (Total Cache Hits / Total Requests) × 100'
  },
  {
    id: 'cache-aside',
    title: 'The Cache-Aside (Lazy Loading) Pattern',
    tag: 'Design Pattern',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    summary: 'The application code explicitly orchestrates interactions with both the cache and the database directly.',
    keyPoints: [
      'Read Flow: Check cache ➔ on hit return ➔ on miss query DB, write to cache, return.',
      'Write Flow: Update database ➔ invalidate (evict) key from cache to prevent stale reads.',
      'Resilience: If the cache crashes, requests gracefully fall back directly to the database.'
    ],
    realWorldExample: 'Django and Spring Boot ORMs commonly implement the Cache-Aside pattern via `@cache_page` and `@Cacheable` decorators.',
    formula: 'Client ➔ App Server ➔ Cache? (Hit/Miss) ➔ Database (on Miss)'
  },
  {
    id: 'ttl-stale-data',
    title: 'TTL, Stale Data & Cache Invalidation',
    tag: 'Data Consistency',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    summary: '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
    keyPoints: [
      'Time-To-Live (TTL): Automatically expires keys after a set duration (e.g. 60s) to guarantee eventual consistency.',
      'Write Invalidation: Explicitly deleting cached keys when underlying database records are updated.',
      'Cache Stampede (Thundering Herd): When a hot key expires and hundreds of simultaneous queries overload the database simultaneously.'
    ],
    realWorldExample: 'Stock ticker prices use short 2-second TTLs, while user profile avatars use 24-hour TTLs with explicit invalidation upon photo upload.',
    formula: 'Strict Invalidation on Write + Mutex Locks = Zero Stale Data & Zero Stampede'
  }
];

export const SAMPLE_DATASET = [
  {
    key: 'user:101',
    label: 'User: Alice (Staff Eng)',
    dbValue: { name: 'Alice Cooper', role: 'Staff Engineer', plan: 'Enterprise Pro', balance: '$1,250' },
    sizeBytes: 128,
    defaultTtl: 30
  },
  {
    key: 'product:404',
    label: 'Product: MacBook Pro M3',
    dbValue: { name: 'MacBook Pro M3 Max', price: '$3,499', stock: 18, rating: '4.9/5' },
    sizeBytes: 164,
    defaultTtl: 45
  },
  {
    key: 'config:site',
    label: 'Config: Global Flags',
    dbValue: { theme: 'Dark Obsidian', betaFeatures: true, maintenanceMode: false },
    sizeBytes: 96,
    defaultTtl: 60
  },
  {
    key: 'leaderboard:top',
    label: 'Leaderboard: Q3 Top 10',
    dbValue: { leader: 'alex_99', totalScore: 9840, activeCompetitors: 1420 },
    sizeBytes: 210,
    defaultTtl: 20
  }
];

export const CACHE_STRATEGIES = [
  {
    id: 'cache-aside',
    name: 'Cache-Aside (Lazy Loading)',
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    flowSummary: 'App reads from Cache; on miss reads DB & caches. App writes to DB then evicts cache key.',
    readFlow: '1. App checks Cache ➔ 2. On Miss, reads DB ➔ 3. Writes result to Cache ➔ 4. Returns data',
    writeFlow: '1. App writes to Database ➔ 2. App invalidates (deletes) key in Cache',
    pros: [
      'Only requested data is cached (memory efficient).',
      'Cache failure does not break the application (graceful degradation to DB).',
      'Simple data model and resilient.'
    ],
    cons: [
      'Cache miss penalty on the first read for any key.',
      'Potential for stale data if database is updated by third-party systems without eviction.'
    ],
    bestFor: 'Read-heavy workloads with non-predictable access patterns (e.g. user profiles, blog posts).'
  },
  {
    id: 'write-through',
    name: 'Write-Through',
    badge: 'Strict Consistency',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    flowSummary: 'App writes to Cache; Cache synchronously writes to DB before acknowledging write success.',
    readFlow: '1. App reads from Cache (always warm & up-to-date) ➔ 2. If missing, read DB and update Cache',
    writeFlow: '1. App writes to Cache ➔ 2. Cache immediately writes to DB ➔ 3. Write succeeds when DB commits',
    pros: [
      'Data in Cache is never stale; reads are fast and 100% consistent.',
      'Zero cache-miss latency on newly written data.'
    ],
    cons: [
      'Higher write latency because two storage systems must commit before responding.',
      'Wasted memory for data that is written frequently but rarely read.'
    ],
    bestFor: 'Critical data requiring strict consistency where reads are frequent (e.g. banking balances, auth tokens).'
  },
  {
    id: 'write-back',
    name: 'Write-Back (Write-Behind)',
    badge: 'Ultra-Fast Writes',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    flowSummary: 'App writes directly to Cache with instant ACK. Cache asynchronously flushes batched writes to DB.',
    readFlow: '1. App reads directly from Cache ➔ 2. Always fresh',
    writeFlow: '1. App writes to Cache (instant ACK) ➔ 2. Background worker batches writes to DB every N seconds',
    pros: [
      'Sub-millisecond write response times.',
      'Drastically reduces DB write IOPS through write deduplication and batching.'
    ],
    cons: [
      'Risk of data loss: if the Cache node crashes before flushing to DB, uncommitted writes are permanently lost.',
      'Complex transaction and conflict management.'
    ],
    bestFor: 'High-velocity write workloads where occasional data loss is tolerable (e.g. video view counters, IoT sensor feeds, real-time analytics).'
  },
  {
    id: 'write-around',
    name: 'Write-Around',
    badge: 'Memory Protection',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    flowSummary: 'App writes directly to DB bypassing Cache entirely. Data is only loaded into Cache upon subsequent read.',
    readFlow: '1. App reads Cache ➔ 2. On miss, reads DB and caches data',
    writeFlow: '1. App writes directly to Database ➔ 2. Cache is not updated or touched',
    pros: [
      'Prevents cache churn and memory flooding for data that is written once and rarely read.',
      'Conserves expensive RAM capacity.'
    ],
    cons: [
      'First read after write always experiences a cache miss.',
      'Risk of stale cache if existing cached key is not invalidated upon write.'
    ],
    bestFor: 'Write-once, read-rarely data (e.g. large file upload metadata, historical logging records, invoice PDFs).'
  }
];

export const CACHING_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'In the standard Cache-Aside (Lazy Loading) pattern, what happens when an application executes a write or update operation?',
    options: [
      'The application writes to the cache and delays writing to the database by 10 minutes.',
      'The application writes the update to the database and invalidates (deletes) the key in the cache.',
      'The application deletes the database table and rebuilds it from the Redis cache.',
      'The application sends the write to all browser clients via WebSockets.'
    ],
    correctIndex: 1,
    explanation: 'In the Cache-Aside pattern, write operations update the authoritative database first and immediately invalidate (evict) the cached key so that the next read will pull fresh data from the DB into the cache.'
  },
  {
    id: 2,
    question: 'Why is reading from an in-memory cache (Redis/Memcached) orders of magnitude faster than querying a relational database (PostgreSQL)?',
    options: [
      'Redis compiles SQL queries directly into C++ machine bytecode.',
      'Redis keeps all data in system RAM and key lookups run in O(1) time, avoiding disk I/O, locks, and multi-table joins.',
      'Redis encrypts data so network packets travel faster across fiber optic cables.',
      'PostgreSQL is single-threaded while Redis runs on infinite CPU cores.'
    ],
    correctIndex: 1,
    explanation: 'System RAM has ~100ns access latency, whereas relational databases must access NVMe SSDs/disks, manage row locks, perform B-Tree indexing, and execute query planners (taking 20ms to 100ms).'
  },
  {
    id: 3,
    question: 'What is a "Cache Stampede" (Thundering Herd Problem), and how can engineers mitigate it?',
    options: [
      'When a cache server runs out of disk space and crashes the operating system.',
      'When an extremely hot cached key expires, causing hundreds of concurrent requests to hit the database at the exact same moment; mitigated using Mutex locks or probabilistic early expiration (XFetch).',
      'When users send too many password reset emails simultaneously.',
      'When Redis fails to serialize JSON strings.'
    ],
    correctIndex: 1,
    explanation: 'When a popular cached item expires, hundreds of simultaneous requests experience a cache miss and all query the DB concurrently, causing DB CPU spikes or crashes. Mutex locking ensures only ONE thread queries the DB while others wait for the cache to repopulate.'
  },
  {
    id: 4,
    question: 'What is the primary difference between the LRU (Least Recently Used) and LFU (Least Frequently Used) cache eviction policies?',
    options: [
      'LRU evicts keys based on how long ago they were last accessed, while LFU evicts keys with the lowest total access frequency counter.',
      'LRU only works on strings, while LFU only works on Redis hashes and sorted sets.',
      'LRU stores data on hard disks while LFU stores data in memory.',
      'LRU deletes keys randomly when memory reaches 90% capacity.'
    ],
    correctIndex: 0,
    explanation: 'LRU tracks temporal recency (evicting the item that has sat unaccessed the longest), whereas LFU tracks total access counts (evicting items that have been read the fewest times overall).'
  }
];
