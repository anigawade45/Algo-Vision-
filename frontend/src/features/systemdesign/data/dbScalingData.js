/**
 * Data and configuration for Database Scaling, Replication & Sharding Module
 */

export const DB_SCALING_STEPS = [
  { id: 'sql-nosql', label: '1. SQL vs. NoSQL', short: 'SQL vs NoSQL', icon: 'Database', desc: 'Relational Schema vs. Document Store' },
  { id: 'indexing', label: '2. Indexing Simulator', short: 'Indexing Lab', icon: 'Search', desc: 'Full Table Scan vs. B-Tree Index Lookups' },
  { id: 'replication', label: '3. Primary-Replica Lab', short: 'Replication', icon: 'GitBranch', desc: 'Read Replicas, Replication Lag & Stale Reads' },
  { id: 'sharding', label: '4. Database Sharding', short: 'Sharding Lab', icon: 'Grid', desc: 'Range vs. Hash Sharding & Hot Spots' },
  { id: 'matrix', label: '5. Read vs. Write Scaling', short: 'Scaling Matrix', icon: 'Layers', desc: 'Replication vs. Sharding vs. CQRS' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Mastery Review & Assessment' },
];

export const SQL_NOSQL_DATA = {
  sql: {
    name: 'Relational Database (SQL / PostgreSQL)',
    tag: 'Structured & ACID',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    model: 'Tables, Rows, Columns & Foreign Keys',
    schema: 'Strict Predefined Schema (DDL Migrations required)',
    transactions: 'Full ACID (Atomicity, Consistency, Isolation, Durability)',
    scaling: 'Vertical Scale-Up default; Read Replicas for reads; Sharding requires complex application logic',
    bestFor: 'Complex relational business logic, financial ledgers, multi-table transactions (e-commerce checkout, banking).',
    exampleSchema: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total_amount NUMERIC(10, 2),
  created_at TIMESTAMP
);

-- Multi-table JOIN required to read order with customer details
SELECT users.name, orders.id, orders.total_amount
FROM orders
JOIN users ON orders.user_id = users.id
WHERE orders.id = 1042;`
  },
  nosql: {
    name: 'Document Database (NoSQL / MongoDB)',
    tag: 'Flexible & BASE',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    model: 'JSON / BSON Document Collections',
    schema: 'Schema-less / Dynamic Schema (Fields vary per document)',
    transactions: 'BASE (Basic Availability, Soft-state, Eventual consistency); single-document ACID',
    scaling: 'Horizontal Scale-Out default (built-in automatic sharding & partition clustering)',
    bestFor: 'Rapidly evolving schemas, high-throughput writes, unstructured payloads, real-time analytics, content catalogs.',
    exampleSchema: `// Embedded document: all data retrieved in a single lookup
{
  "_id": "ord_1042",
  "customer": {
    "userId": "usr_99",
    "name": "Alice Cooper",
    "email": "alice@company.com"
  },
  "items": [
    { "productId": "p_404", "title": "MacBook Pro M3", "price": 3499, "qty": 1 }
  ],
  "totalAmount": 3499.00,
  "status": "PAID"
}

// Single lookup without any relational JOINs:
db.orders.findOne({ _id: "ord_1042" });`
  }
};

export const INITIAL_INDEXING_RECORDS = [
  { id: 101, name: 'Alice Cooper', email: 'alice@cloud.com', city: 'San Francisco', department: 'Engineering', salary: 165000 },
  { id: 102, name: 'Bob Martinez', email: 'bob@tech.io', city: 'Austin', department: 'Product', salary: 140000 },
  { id: 103, name: 'Charlie Kim', email: 'charlie@web.org', city: 'New York', department: 'Engineering', salary: 175000 },
  { id: 104, name: 'Diana Prince', email: 'diana@hero.net', city: 'Seattle', department: 'Security', salary: 190000 },
  { id: 105, name: 'Ethan Hunt', email: 'ethan@mission.org', city: 'Austin', department: 'Operations', salary: 130000 },
  { id: 106, name: 'Fiona Gallagher', email: 'fiona@chicago.edu', city: 'Chicago', department: 'Marketing', salary: 120000 },
  { id: 107, name: 'George Clark', email: 'george@london.co', city: 'London', department: 'Engineering', salary: 155000 },
  { id: 108, name: 'Hannah Abbott', email: 'hannah@magic.uk', city: 'London', department: 'Product', salary: 145000 },
  { id: 109, name: 'Ian Malcolm', email: 'ian@chaos.edu', city: 'Austin', department: 'Research', salary: 180000 },
  { id: 110, name: 'Julia Roberts', email: 'julia@film.la', city: 'Los Angeles', department: 'Design', salary: 135000 },
];

export const INITIAL_SHARD_RECORDS = [
  { id: 'usr_101', name: 'Alice Cooper', email: 'alice@corp.com', country: 'US', spend: '$1,450' },
  { id: 'usr_102', name: 'Bob Miller', email: 'bob@corp.com', country: 'US', spend: '$820' },
  { id: 'usr_103', name: 'Carlos Gomez', email: 'carlos@es.com', country: 'EU', spend: '$2,100' },
  { id: 'usr_104', name: 'Deepa Patel', email: 'deepa@in.com', country: 'APAC', spend: '$3,400' },
  { id: 'usr_105', name: 'Emma Watson', email: 'emma@uk.com', country: 'EU', spend: '$980' },
  { id: 'usr_106', name: 'Faisal Al-Mansoor', email: 'faisal@ae.com', country: 'MEA', spend: '$4,500' },
  { id: 'usr_107', name: 'Grace Hopper', email: 'grace@navy.mil', country: 'US', spend: '$5,200' },
  { id: 'usr_108', name: 'Hans Gruber', email: 'hans@de.com', country: 'EU', spend: '$750' },
  { id: 'usr_109', name: 'Ivan Petrov', email: 'ivan@ru.com', country: 'EU', spend: '$1,120' },
  { id: 'usr_110', name: 'Jenny Kim', email: 'jenny@kr.com', country: 'APAC', spend: '$2,890' },
  { id: 'usr_111', name: 'Kenji Sato', email: 'kenji@jp.com', country: 'APAC', spend: '$3,150' },
  { id: 'usr_112', name: 'Liam Neeson', email: 'liam@ie.com', country: 'EU', spend: '$1,650' },
];

export const DB_SCALING_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'How does creating a B-Tree database index improve search performance on large SQL tables?',
    options: [
      'It compresses the database file so it loads faster from hard disk.',
      'It creates an ordered balanced tree structure that allows lookups in O(log N) comparisons instead of scanning every single row in O(N) time.',
      'It converts the relational database into a NoSQL document database.',
      'It moves the entire database into the client browser memory.'
    ],
    correctIndex: 1,
    explanation: 'A B-Tree index maintains keys in sorted order in self-balancing tree nodes. Searching for an indexed value traverses the tree in O(log N) steps (examining just 3-4 tree pages) rather than scanning millions of rows sequentially.'
  },
  {
    id: 2,
    question: 'What is the primary drawback of adding too many secondary indexes to a high-throughput SQL database table?',
    options: [
      'Indexes make SELECT queries run slower.',
      'Every INSERT, UPDATE, and DELETE statement must update all corresponding index trees, increasing write latency and consuming substantial RAM/disk.',
      'Indexes prevent the database from using transactions.',
      'Indexes only work on integer data types.'
    ],
    correctIndex: 1,
    explanation: 'Indexes accelerate reads but penalize writes: every time a record is inserted, modified, or deleted, every index referencing those columns must rebalance and write to disk, adding CPU and I/O overhead.'
  },
  {
    id: 3,
    question: 'What causes "Replication Lag" in a Primary-Replica database cluster, and what is its consequence?',
    options: [
      'The Primary database crashing permanently.',
      'Asynchronous replication delay where writes committed on the Primary take milliseconds or seconds to apply on Replicas, potentially causing clients to read stale data.',
      'Clients typing database queries too quickly.',
      'The database running out of foreign keys.'
    ],
    correctIndex: 1,
    explanation: 'Because replicas sync writes asynchronously over the network to avoid slowing down Primary write acknowledgments, a client reading from a replica immediately after writing to the Primary may read outdated (stale) data.'
  },
  {
    id: 4,
    question: 'What is the key difference between Range-Based Sharding and Hash-Based Sharding?',
    options: [
      'Range sharding splits by continuous key intervals (e.g. A-M, N-Z) which can cause hot spots; Hash sharding applies a hash function (hash(id) % N) for uniform mathematical distribution.',
      'Range sharding only works on MongoDB; Hash sharding only works on MySQL.',
      'Range sharding encrypts data while Hash sharding compresses it.',
      'Range sharding is only for read replicas; Hash sharding is for caching.'
    ],
    correctIndex: 0,
    explanation: 'Range sharding assigns contiguous ranges (e.g., users by registration date or letter), which can overload a single shard if recent users or certain letters are hot. Hash-based sharding uniformly scatters keys across all shards using hashing.'
  }
];
