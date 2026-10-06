/**
 * Data and configuration for Message Queue & Asynchronous Processing Module
 */

export const MSG_QUEUE_STEPS = [
  { id: 'sync-async', label: '1. Sync vs. Async', short: 'Sync vs Async', icon: 'Clock', desc: 'Blocking Call Chain vs. Decoupled Queues' },
  { id: 'simulator', label: '2. Queue Simulator', short: 'Producer-Consumer', icon: 'Layers', desc: 'Producers, FIFO Buffer & Worker Pool' },
  { id: 'dlq-retry', label: '3. Retries & DLQ', short: 'Retries & DLQ', icon: 'AlertTriangle', desc: 'Exponential Backoff & Dead-Letter Queue' },
  { id: 'idempotency', label: '4. Delivery & Idempotency', short: 'Idempotency Lab', icon: 'ShieldCheck', desc: 'At-Least-Once & Deduplication Keys' },
  { id: 'matrix', label: '5. Broker Matrix', short: 'Kafka vs RabbitMQ', icon: 'Server', desc: 'RabbitMQ vs Kafka vs SQS vs Redis Streams' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Mastery Assessment & Cheatsheet' },
];

export const SAMPLE_MESSAGE_TEMPLATES = [
  { type: 'ORDER_CONFIRMATION', name: 'Order Confirmation Email', defaultDuration: 1800, priority: 'HIGH', payload: '{ orderId: 1042, email: "alice@store.com", amount: $349 }' },
  { type: 'VIDEO_TRANSCODE', name: 'Video 1080p Transcode', defaultDuration: 3200, priority: 'NORMAL', payload: '{ videoId: "vid_99", codec: "H.264", length: "04:15" }' },
  { type: 'INVOICE_PDF', name: 'Generate PDF Tax Invoice', defaultDuration: 1400, priority: 'NORMAL', payload: '{ invoiceId: "inv_781", customer: "Acme Corp" }' },
  { type: 'PUSH_NOTIFICATION', name: 'Mobile Push Alert', defaultDuration: 600, priority: 'HIGH', payload: '{ userId: "usr_42", title: "Flash Sale Live!" }' },
  { type: 'AI_EMBEDDING', name: 'Vectorize Text Embedding', defaultDuration: 2400, priority: 'LOW', payload: '{ docId: "doc_552", tokens: 1840 }' },
];

export const BROKER_COMPARISONS = [
  {
    id: 'rabbitmq',
    name: 'RabbitMQ (AMQP)',
    type: 'Smart Broker / Dumb Consumer',
    tag: 'Traditional Message Broker',
    badgeColor: 'bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border-orange-300',
    model: 'Exchanges ➔ Bindings ➔ Queues (Push model)',
    throughput: 'Medium-High (50k - 100k msgs/sec)',
    latency: 'Sub-millisecond (< 5ms)',
    ordering: 'Strict FIFO per queue',
    retention: 'Transient: message deleted upon worker ACK',
    replayable: 'No (consumed messages are pruned)',
    bestFor: 'Complex routing (topic/headers), background tasks, transactional messaging, immediate task distribution.',
  },
  {
    id: 'kafka',
    name: 'Apache Kafka',
    type: 'Dumb Broker / Smart Consumer',
    tag: 'Distributed Event Streaming Log',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300',
    model: 'Partitioned Append-Only Commit Logs (Pull model)',
    throughput: 'Massive (1,000,000+ msgs/sec with batching)',
    latency: 'Low (10ms - 25ms with batch buffering)',
    ordering: 'Strict FIFO per partition key (not cluster-wide)',
    retention: 'Persistent (Retained for days/years on disk)',
    replayable: 'Yes (Consumers can reset offset to beginning)',
    bestFor: 'High-throughput event streaming, user activity logs, stream processing (Kafka Streams/Flink), real-time analytics.',
  },
  {
    id: 'sqs',
    name: 'AWS SQS (Simple Queue Service)',
    type: 'Fully Managed Cloud Queue',
    tag: 'Serverless Managed Queue',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300',
    model: 'Standard (best-effort ordering) & FIFO Queues',
    throughput: 'Virtually Unlimited (Standard) / 3,000 msgs/sec (FIFO)',
    latency: 'Medium (20ms - 50ms HTTP polling)',
    ordering: 'Standard: Best effort; FIFO: Strict with MessageGroupId',
    retention: 'Up to 14 days (Visibility Timeout mechanism)',
    replayable: 'No (deleted via DeleteMessage API call)',
    bestFor: 'Cloud-native microservices, serverless AWS Lambda triggers, zero-maintenance background queues.',
  },
  {
    id: 'redis',
    name: 'Redis Streams / BullMQ',
    type: 'In-Memory Stream / Task Queue',
    tag: 'High-Speed In-Memory',
    badgeColor: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300',
    model: 'Append-Only Stream + Consumer Groups in RAM',
    throughput: 'Extremely High (100k - 500k ops/sec in RAM)',
    latency: 'Sub-millisecond (< 1ms)',
    ordering: 'Strict FIFO by time ID',
    retention: 'Configurable MAXLEN / Eviction policy',
    replayable: 'Yes (Consumer groups can seek stream IDs)',
    bestFor: 'Node.js/Python job scheduling, delayed jobs, rate-limited background queues, real-time gaming alerts.',
  },
];

export const MSG_QUEUE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How does an asynchronous message queue decouple a web application producer from its backend workers?',
    options: [
      'It forces the web client to wait until every worker finishes processing.',
      'The producer enqueues the message in milliseconds and receives an immediate acknowledgment, allowing the client request to complete while workers process jobs independently at their own pace.',
      'It converts all HTTP requests into synchronous database stored procedures.',
      'It prevents consumers from ever throwing errors.'
    ],
    correctIndex: 1,
    explanation: 'By buffering work in a queue, producers do not block waiting for slow downstream tasks (such as sending emails or transcoding videos). Downstream consumers can process messages at a steady, sustainable rate (backpressure buffer).'
  },
  {
    id: 2,
    question: 'Why is "At-Least-Once" message delivery the standard in distributed queues, and what is its primary side effect?',
    options: [
      'It guarantees each message is processed exactly one time without duplicates.',
      'To prevent message loss, the broker redelivers a message if a worker crashes before sending an ACK; this can cause duplicate processing if the worker crashed after doing the work but before ACKing.',
      'It deletes messages before workers start processing them.',
      'It only allows one consumer per queue.'
    ],
    correctIndex: 1,
    explanation: 'In distributed systems, network partitions or worker crashes can prevent ACK packets from reaching the broker. To avoid data loss, the broker re-queues the message for another worker, which can cause duplicate processing unless the worker is idempotent.'
  },
  {
    id: 3,
    question: 'What is a "Dead-Letter Queue" (DLQ) and when is a message moved into it?',
    options: [
      'A queue for storing deleted user accounts permanently.',
      'A holding queue where poisonous or malformed messages are moved after exceeding the maximum retry threshold, preventing them from endlessly blocking healthy consumers.',
      'A queue with zero latency that bypasses memory.',
      'A log of all successfully processed messages.'
    ],
    correctIndex: 1,
    explanation: 'If a message fails repeatedly (e.g. due to corrupted JSON payload or a permanent 400 bad request), exponential retries will eventually exhaust the retry limit. The broker moves it to a DLQ so engineers can inspect and fix the root cause without crashing worker threads.'
  },
  {
    id: 4,
    question: 'How can a consumer achieve "Idempotent Processing" to handle duplicate message deliveries safely?',
    options: [
      'By turning off worker logging completely.',
      'By checking an Idempotency Key (e.g., UUID or OrderID) in a deduplication database (Redis/SQL) before executing business logic, returning success if already processed.',
      'By deleting the queue after each message.',
      'By running all consumers on a single CPU core.'
    ],
    correctIndex: 1,
    explanation: 'An idempotent consumer records a unique message/order key in a fast lookup store (like Redis `SETNX` or SQL unique constraint). If a duplicate message arrives, the worker detects that the key already exists and safely acknowledges without re-charging or re-shipping.'
  }
];
