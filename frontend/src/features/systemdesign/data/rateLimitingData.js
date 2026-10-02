/**
 * Data and configuration for Rate Limiting & Traffic Shaping Module
 */

export const RATE_LIMIT_STEPS = [
  { id: 'algorithms', label: '1. Core Algorithms', short: '5 Algorithms', icon: 'Sliders', desc: 'Token Bucket, Leaky Bucket & Windowing' },
  { id: 'request-flow', label: '2. Request Flow Pipeline', short: 'Request Flow', icon: 'Activity', desc: 'Admitted, Rejected & HTTP 429 Pipeline' },
  { id: 'identity-scopes', label: '3. Identity Scopes & Scenarios', short: 'Scopes & Scenarios', icon: 'Users', desc: 'Global vs Per-User vs Per-IP Rate Limits' },
  { id: 'retry-policy', label: '4. HTTP 429 & Client Retries', short: 'HTTP 429 & Retries', icon: 'RotateCcw', desc: 'Retry-After, Backoff & Jitter' },
  { id: 'distributed-matrix', label: '5. Distributed & Matrix', short: 'Redis & Comparison', icon: 'Layers', desc: 'Distributed Redis Lua vs Local Counters' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Mastery Assessment & Cheatsheet' },
];

export const RATE_LIMIT_ALGORITHMS = [
  {
    id: 'token-bucket',
    name: 'Token Bucket',
    tag: 'Industry Standard (Stripe / AWS)',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300',
    description: 'Tokens are added to a bucket at a constant refill rate up to a maximum capacity. Each request consumes 1 or more tokens. Allows bursts while maintaining long-term average rate.',
    burstSupport: 'High (up to bucket capacity)',
    memory: 'Minimal (2 numbers: token count + last refill timestamp)',
    smoothness: 'Bursty (allows instant drain of full bucket)',
    useCase: 'General API rate limiting (Stripe, GitHub, AWS), APIs with bursty user traffic.',
    defaultConfig: { capacity: 10, refillRate: 2, cost: 1 },
  },
  {
    id: 'leaky-bucket',
    name: 'Leaky Bucket (Queue-Based)',
    tag: 'Traffic Smoothing',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300',
    description: 'Requests enter a FIFO queue buffer. The bucket leaks (processes) requests at a strictly constant rate. Requests overflow and receive HTTP 429 if the queue is full.',
    burstSupport: 'None (Smooths all bursts to constant leak rate)',
    memory: 'Medium (FIFO queue buffer for pending requests)',
    smoothness: 'Extremely Smooth (constant egress rate)',
    useCase: 'Protecting fragile downstream legacy databases, message ingestion, packet traffic shaping (ATM/telecom).',
    defaultConfig: { capacity: 8, leakRate: 2 },
  },
  {
    id: 'fixed-window',
    name: 'Fixed Window Counter',
    tag: 'Simple & Fast',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300',
    description: 'Counts requests in fixed time windows (e.g., 00:00-00:10). Resets counter to 0 at window boundary. Vulnerable to 2x boundary bursts at window edges.',
    burstSupport: '2x Boundary Vulnerability',
    memory: 'Extremely Low (1 integer counter per window)',
    smoothness: 'Uneven (resets instantly at boundaries)',
    useCase: 'Simple tier quotas (e.g., 1,000 requests per calendar month, daily billing limits).',
    defaultConfig: { windowSec: 10, limit: 6 },
  },
  {
    id: 'sliding-window-log',
    name: 'Sliding Window Log',
    tag: '100% Mathematically Exact',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-300',
    description: 'Stores exact timestamps for every admitted request in a sorted set. Prunes timestamps older than (current_time - window_duration). Rejects if remaining count >= limit.',
    burstSupport: 'Strictly bounded to limit per rolling window',
    memory: 'High (stores every timestamp in memory / Redis ZSET)',
    smoothness: 'Perfect rolling enforcement',
    useCase: 'Security-critical operations (login attempt throttling, OTP brute-force protection, high-value financial endpoints).',
    defaultConfig: { windowSec: 10, limit: 6 },
  },
  {
    id: 'sliding-window-counter',
    name: 'Sliding Window Counter',
    tag: 'Cloudflare / Hybrid Approximator',
    badgeColor: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300',
    description: 'Estimates rolling rate using: previous_count * (1 - elapsed_fraction) + current_count. Solves boundary burst problem with minimal memory (only 2 counters).',
    burstSupport: 'Well controlled (approximates sliding window)',
    memory: 'Very Low (2 counters: previous window + current window)',
    smoothness: 'Smooth weighted approximation (99.7% accuracy)',
    useCase: 'Large-scale distributed edge rate limiting (Cloudflare, Nginx, high-volume microservices).',
    defaultConfig: { windowSec: 10, limit: 6 },
  },
];

export const RATE_LIMIT_SCENARIOS = [
  {
    id: 'normal',
    title: '1. Steady Normal Traffic',
    trafficDesc: '3 requests every 3 seconds (Below Limit)',
    expected: 'All requests admitted (HTTP 200 OK) with 100% acceptance rate.',
    algorithm: 'token-bucket',
    burst: 3,
  },
  {
    id: 'burst',
    title: '2. Sudden Flash Traffic Burst',
    trafficDesc: '15 requests injected simultaneously',
    expected: 'First 10 consume full bucket capacity; remaining 5 rejected with HTTP 429 Too Many Requests.',
    algorithm: 'token-bucket',
    burst: 15,
  },
  {
    id: 'boundary-exploit',
    title: '3. Fixed Window Boundary Exploit',
    trafficDesc: '6 requests at 00:09 (end of window) + 6 requests at 00:10 (start of next window)',
    expected: 'Fixed window admits 12 requests in 2 seconds (2x nominal limit!), demonstrating why Sliding Window is superior.',
    algorithm: 'fixed-window',
    burst: 12,
  },
  {
    id: 'leaky-overflow',
    title: '4. Leaky Bucket Queue Overflow',
    trafficDesc: '12 requests burst into an 8-slot queue leaking at 2 req/sec',
    expected: '8 admitted to queue and processed smoothly; 4 overflow requests immediately rejected.',
    algorithm: 'leaky-bucket',
    burst: 12,
  },
  {
    id: 'competing-users',
    title: '5. Noisy Neighbor (Global vs Per-User Quota)',
    trafficDesc: 'User A sends 12 requests; User B sends 2 requests',
    expected: 'Under Global limit, User A starves User B. Under Per-User limit, User A throttles while User B passes safely.',
    algorithm: 'token-bucket',
    burst: 14,
  },
];

export const RATE_LIMIT_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is the primary vulnerability of the Fixed Window Counter algorithm, and why does it happen?',
    options: [
      'It consumes too much memory because it stores all timestamps.',
      'A traffic surge right at the window boundary (e.g. 100% limit at end of Window 1 + 100% limit at start of Window 2) allows twice the allowed limit in a narrow time slice.',
      'It cannot run on Linux servers.',
      'It rejects all requests if CPU utilization exceeds 50%.'
    ],
    correctIndex: 1,
    explanation: 'Because fixed window boundaries reset counters instantly at fixed clock ticks, a client sending a burst at the end of one window and immediately at the beginning of the next can push 2x the rate limit through the system without triggering a block.'
  },
  {
    id: 2,
    question: 'How does a Token Bucket differ from a Leaky Bucket in traffic handling?',
    options: [
      'Token Bucket is only for database queries; Leaky Bucket is for DNS.',
      'Token Bucket allows instantaneous bursts up to bucket capacity and processes immediately; Leaky Bucket forces all outgoing traffic through a FIFO queue at a strictly constant leak rate.',
      'Token Bucket deletes expired requests while Leaky Bucket stores them permanently.',
      'There is no difference; they are exact synonyms.'
    ],
    correctIndex: 1,
    explanation: 'Token Bucket accumulates tokens, allowing immediate execution of bursts as long as tokens are available. Leaky Bucket enforces smooth, constant egress rate via a queue, absorbing bursts into delay rather than instant throughput.'
  },
  {
    id: 3,
    question: 'What is the purpose of the "Retry-After" HTTP response header sent with an HTTP 429 Too Many Requests?',
    options: [
      'It tells the client browser to refresh the entire web page.',
      'It informs the client how many seconds (or what timestamp) they must wait before attempting the request again, preventing client retry storms.',
      'It instructs the server to shut down.',
      'It changes the user password.'
    ],
    correctIndex: 1,
    explanation: 'When returning HTTP 429, the server includes `Retry-After: <seconds>` to tell clients when token capacity or window quotas will refresh, preventing clients from hammering the server with aggressive, continuous retry loops.'
  },
  {
    id: 4,
    question: 'Why is an atomic Redis Lua script (`EVAL`) commonly used for distributed rate limiting across multiple API servers?',
    options: [
      'It encrypts the rate limit tokens in transit.',
      'To prevent Race Conditions (Check-Then-Act): Redis executes Lua scripts atomically in a single thread, guaranteeing counter checks and token deductions happen without concurrent server conflicts.',
      'Lua scripts make HTTP requests run faster than pure C++.',
      'It eliminates the need for any backend database.'
    ],
    correctIndex: 1,
    explanation: 'Without atomic Lua scripts, two API servers reading a counter at the same microsecond might both see `count = 9` (limit 10) and both approve their requests, resulting in 11 requests. A Redis Lua script inspects and increments atomically in a single operation.'
  }
];
