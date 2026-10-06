/**
 * Data and configuration for System Design Basics & Client-Server Architecture module.
 */

export const BASICS_STEPS = [
  { id: 'overview', label: '1. Concept Overview', short: 'Overview', icon: 'BookOpen', desc: 'Core Principles & Architecture Foundations' },
  { id: 'requirements', label: '2. Requirements Explorer', short: 'Requirements', icon: 'ListFilter', desc: 'Functional vs Non-Functional Trade-offs' },
  { id: 'client-server', label: '3. Client-Server Flow', short: 'Client-Server Flow', icon: 'Network', desc: 'Interactive 5-Step Request/Response Lifecycle' },
  { id: 'stateless-stateful', label: '4. Stateless vs Stateful', short: 'Stateless vs Stateful', icon: 'Server', desc: 'Session Management & Horizontal Scaling' },
  { id: 'quality-attributes', label: '5. Quality Attributes', short: 'Quality & Scalability', icon: 'Gauge', desc: 'Traffic, Capacity & Latency Simulation' },
  { id: 'quiz', label: '6. Checkpoint Quiz', short: 'Review & Quiz', icon: 'Award', desc: 'Knowledge Check & Summary Recap' },
];

export const CORE_CONCEPTS = [
  {
    id: 'what-is-sd',
    title: 'What is System Design?',
    tag: 'Foundation',
    badgeColor: 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    summary: 'The systematic process of defining the architecture, components, modules, interfaces, and data flow of a software system to satisfy specified requirements.',
    keyPoints: [
      'Bridges product vision with engineering reality.',
      'Anticipates bottlenecks before writing production code.',
      'Evaluates trade-offs between speed, cost, reliability, and complexity.'
    ],
    realWorldExample: 'Designing Uber requires mapping riders to drivers in real-time, computing shortest routes, processing millions of concurrent GPS pings, and guaranteeing payment transactions.',
    formula: 'Requirements + Constraints ➔ Architecture Components ➔ Trade-off Decisions'
  },
  {
    id: 'scaling',
    title: 'Vertical vs. Horizontal Scaling',
    tag: 'Scalability',
    badgeColor: 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    summary: 'How a system adapts to increasing workloads by either adding more power to a single machine or distributing load across multiple machines.',
    keyPoints: [
      'Vertical Scaling (Scale Up): Add more CPU, RAM, or SSD to one server. Simpler, but hits hard hardware ceilings and creates a single point of failure (SPOF).',
      'Horizontal Scaling (Scale Out): Add more servers behind a load balancer. Infinite scaling potential and high fault tolerance, but requires stateless servers and distributed coordination.'
    ],
    realWorldExample: 'Instagram started vertically scaling a single massive PostgreSQL instance before transitioning to horizontal database sharding across hundreds of distributed nodes.',
    formula: 'Vertical = Bigger Box | Horizontal = More Boxes + Load Balancer'
  },
  {
    id: 'latency-throughput',
    title: 'Latency vs. Throughput',
    tag: 'Performance',
    badgeColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    summary: 'Two fundamental dimensions of system speed that are related but distinctly different.',
    keyPoints: [
      'Latency (Time): Time required to complete a single operation (measured in milliseconds, e.g. 35ms response time).',
      'Throughput (Volume): Number of operations processed per unit of time (measured in Requests Per Second / RPS, e.g. 50,000 RPS).',
      'Analogy: Latency is how fast a train travels between two stations; Throughput is how many passengers arrive per hour.'
    ],
    realWorldExample: 'Google Search prioritizes latency (<200ms round-trip to render search results), while Apache Kafka video ingestion pipelines prioritize throughput (terabytes per hour).',
    formula: 'Throughput = Concurrent Requests / Latency'
  },
  {
    id: 'availability-reliability',
    title: 'Availability & Reliability ("Nines")',
    tag: 'Resilience',
    badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    summary: 'Availability is the percentage of time a system is accessible and operational. Reliability is the probability that a system performs without failure over time.',
    keyPoints: [
      '99.0% ("Two Nines"): ~3.65 days downtime per year (Unacceptable for modern web services).',
      '99.9% ("Three Nines"): ~8.76 hours downtime per year (Standard for internal tools).',
      '99.99% ("Four Nines"): ~52.6 minutes downtime per year (Industry gold standard for SaaS).',
      '99.999% ("Five Nines"): ~5.26 minutes downtime per year (Mission critical: payments, telecom, aerospace).'
    ],
    realWorldExample: 'Amazon Web Services S3 Standard Storage is engineered for 99.99% availability and 99.999999999% (11 9s) data durability.',
    formula: 'Availability = Uptime / (Uptime + Downtime)'
  }
];

export const SYSTEM_CASES = [
  {
    id: 'ecommerce',
    name: 'ShopSphere E-Commerce System',
    description: 'An online global retail shopping platform serving 10M+ daily active shoppers with catalog browsing, shopping carts, checkout, and inventory management.',
    icon: 'ShoppingCart',
    functionalRequirements: [
      {
        id: 'fr-catalog',
        title: 'Product Catalog & Search',
        description: 'Shoppers must be able to search and filter through millions of products by category, price, and ratings within milliseconds.',
        addressedBy: ['Elasticsearch / Algolia', 'Redis Read Cache', 'CDN for Product Images'],
        tradeoff: 'Eventual consistency on newly listed items to achieve <50ms query response time worldwide.'
      },
      {
        id: 'fr-cart',
        title: 'Persistent Shopping Cart',
        description: 'Shoppers can add/remove items to cart, with item state preserved across multiple browser sessions and device switching.',
        addressedBy: ['Distributed Redis Session Cache', 'Client-side JWT / LocalStorage sync'],
        tradeoff: 'In-memory storage speeds up cart updates but requires replication to avoid lost items during server failover.'
      },
      {
        id: 'fr-checkout',
        title: 'Checkout & Atomic Order Creation',
        description: 'When placing an order, inventory reservation and payment processing must succeed atomically without overselling items.',
        addressedBy: ['ACID Relational Database (PostgreSQL)', 'Distributed Locks (Redis Redlock)', 'Two-Phase Commit (2PC) / Saga Pattern'],
        tradeoff: 'Strict consistency on inventory reduces write throughput compared to loose eventual consistency.'
      },
      {
        id: 'fr-notifications',
        title: 'Order Status & Notifications',
        description: 'Send instant email, SMS, and push notification updates when an order is confirmed, shipped, or delivered.',
        addressedBy: ['Kafka Message Broker / RabbitMQ', 'Worker Microservice Cluster'],
        tradeoff: 'Asynchronous background queues decouple slow third-party email APIs from the checkout critical path.'
      }
    ],
    nonFunctionalRequirements: [
      {
        id: 'nfr-latency',
        title: 'Ultra-Low Read Latency (< 100ms)',
        description: '99th percentile (p99) search response time should remain below 100ms globally to maximize conversion rates.',
        addressedBy: ['Cloudflare / CloudFront CDN', 'Distributed In-Memory Cache (Redis)', 'Read Replicas'],
        impact: 'High Impact on User Retention & Revenue'
      },
      {
        id: 'nfr-availability',
        title: 'High Availability (99.99% Uptime)',
        description: 'Platform must experience less than 52 minutes of unplanned downtime per year, including during major sales events.',
        addressedBy: ['Multi-Region Server Deployments', 'Automated Health Checks & Auto-scaling', 'Redundant Load Balancers'],
        impact: 'Prevents Revenue Loss & Brand Damage'
      },
      {
        id: 'nfr-scalability',
        title: 'Elastic Scalability (10x Flash Sales)',
        description: 'System must handle sudden 10x traffic spikes during Black Friday / Cyber Monday sales without crashing.',
        addressedBy: ['Stateless Server Instances', 'Horizontal Auto-Scaling Groups', 'Asynchronous Message Queues (Kafka)'],
        impact: 'Handles Peak Loads Cost-Effectively'
      },
      {
        id: 'nfr-consistency',
        title: 'Strong Consistency on Inventory',
        description: 'Prevent double-selling the last stock unit when two shoppers click "Buy Now" at the exact same millisecond.',
        addressedBy: ['Transactional DB Isolation (Serializable / Read Committed)', 'Distributed Mutex Locks'],
        impact: 'Ensures Business Integrity & Trust'
      }
    ]
  },
  {
    id: 'streaming',
    name: 'StreamPulse Video Platform',
    description: 'A global video on-demand platform handling HD/4K video streaming, personalized recommendations, and user watch history.',
    icon: 'Video',
    functionalRequirements: [
      {
        id: 'fr-stream',
        title: 'Smooth Video Streaming',
        description: 'Stream adaptive bitrate (HLS/DASH) video chunks without buffering.',
        addressedBy: ['Edge CDN Points of Presence (PoPs)', 'S3 Object Storage', 'Transcoding Pipeline'],
        tradeoff: 'Higher CDN bandwidth costs in exchange for zero buffering.'
      },
      {
        id: 'fr-recommend',
        title: 'Personalized Recommendations',
        description: 'Generate customized video feed based on watch history and user preferences.',
        addressedBy: ['Vector Database / ML Inference Engine', 'Graph DB / Redis Cache'],
        tradeoff: 'Recommendations can be computed asynchronously in offline batch jobs.'
      }
    ],
    nonFunctionalRequirements: [
      {
        id: 'nfr-bandwidth',
        title: 'High Throughput & Edge Delivery',
        description: 'Deliver petabytes of video data per second globally with 99.999% video playback reliability.',
        addressedBy: ['Global CDN Edge Cache', 'Anycast Routing', 'Chunked HTTP range requests'],
        impact: 'Core User Experience'
      },
      {
        id: 'nfr-fault',
        title: 'Graceful Degradation',
        description: 'If recommendation server fails, fallback to trending video list rather than showing an error page.',
        addressedBy: ['Circuit Breaker Pattern (Resilience4j / Hystrix)', 'Fallback Cache'],
        impact: 'Maintains High Perceived Availability'
      }
    ]
  }
];

export const CLIENT_SERVER_PRESETS = [
  {
    id: 'search',
    name: '1. Search Products (GET)',
    method: 'GET',
    endpoint: '/api/v1/products?query=laptop&category=electronics',
    requestHeaders: {
      'Host': 'api.shopsphere.com',
      'Accept': 'application/json',
      'User-Agent': 'Chrome/124.0 (Macintosh; Intel Mac OS X)',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    requestPayload: null,
    dbQuery: 'SELECT id, title, price, stock, rating FROM products WHERE category = "electronics" AND title LIKE "%laptop%" LIMIT 20;',
    dbResult: [
      { id: 'prod_901', title: 'UltraBook Pro 16"', price: 1299.99, stock: 45, rating: 4.8 },
      { id: 'prod_902', title: 'AirSlim Laptop 14"', price: 899.50, stock: 112, rating: 4.6 },
      { id: 'prod_903', title: 'Developer Studio Rig', price: 2199.00, stock: 18, rating: 4.9 }
    ],
    statusCode: 200,
    statusText: 'OK',
    responseHeaders: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      'X-Response-Time': '38ms',
      'Server': 'envoy-gateway/1.28'
    },
    responsePayload: {
      status: 'success',
      totalResults: 3,
      page: 1,
      items: [
        { id: 'prod_901', title: 'UltraBook Pro 16"', price: 1299.99, stock: 45, rating: 4.8 },
        { id: 'prod_902', title: 'AirSlim Laptop 14"', price: 899.50, stock: 112, rating: 4.6 },
        { id: 'prod_903', title: 'Developer Studio Rig', price: 2199.00, stock: 18, rating: 4.9 }
      ]
    },
    timings: {
      dns: 8,
      tcpTls: 14,
      serverProcessing: 12,
      dbQuery: 18,
      transfer: 6,
      total: 58
    },
    stepNotes: [
      'Client creates an HTTP GET request with query parameters and auth headers, transmitting it across the public internet.',
      'API Server parses the query parameters, validates the user JWT token, and prepares the SQL search query.',
      'Database Engine scans indexed columns (category, title) in the products table to find matching rows in ~18ms.',
      'Database returns matched rows to the server buffer. Server serializes rows into standard JSON format.',
      'Server returns HTTP 200 OK with payload and cache headers back to the Client. Browser renders product cards.'
    ]
  },
  {
    id: 'checkout',
    name: '2. Place Order (POST)',
    method: 'POST',
    endpoint: '/api/v1/orders/checkout',
    requestHeaders: {
      'Host': 'api.shopsphere.com',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...',
      'X-Idempotency-Key': 'order_uuid_88192a_99'
    },
    requestPayload: {
      productId: 'prod_901',
      quantity: 1,
      paymentMethodId: 'pm_card_visa_4242',
      shippingAddress: {
        street: '123 Market St',
        city: 'San Francisco',
        country: 'US'
      }
    },
    dbQuery: 'BEGIN TRANSACTION;\nUPDATE inventory SET stock = stock - 1 WHERE product_id = "prod_901" AND stock >= 1;\nINSERT INTO orders (id, user_id, product_id, total, status) VALUES ("ord_771", "usr_402", "prod_901", 1299.99, "CONFIRMED");\nCOMMIT;',
    dbResult: {
      rowsAffected: 2,
      orderId: 'ord_771',
      status: 'CONFIRMED',
      timestamp: '2026-10-02T10:15:00Z'
    },
    statusCode: 201,
    statusText: 'Created',
    responseHeaders: {
      'Content-Type': 'application/json',
      'Location': '/api/v1/orders/ord_771',
      'X-Response-Time': '82ms'
    },
    responsePayload: {
      status: 'success',
      message: 'Order created and payment processed successfully',
      order: {
        id: 'ord_771',
        total: 1299.99,
        status: 'CONFIRMED',
        estimatedDelivery: '2026-10-05'
      }
    },
    timings: {
      dns: 4,
      tcpTls: 10,
      serverProcessing: 25,
      dbQuery: 38,
      transfer: 5,
      total: 82
    },
    stepNotes: [
      'Client bundles checkout data into an HTTP POST request with an Idempotency-Key header to prevent duplicate payments.',
      'Application server runs business validation: checks payment gateway token, verifies user credit limit, starts DB transaction.',
      'Database performs an atomic transaction (BEGIN ... COMMIT) with row-level locks to decrement inventory and create the order row.',
      'Database confirms transaction commit and returns the generated order record to the application server.',
      'Server returns HTTP 201 Created to client. Browser updates UI to show "Order Confirmed!" with tracking link.'
    ]
  },
  {
    id: 'profile',
    name: '3. Fetch User Profile (GET)',
    method: 'GET',
    endpoint: '/api/v1/users/me',
    requestHeaders: {
      'Host': 'api.shopsphere.com',
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1Ni...'
    },
    requestPayload: null,
    dbQuery: 'SELECT u.id, u.name, u.email, u.tier, m.points FROM users u JOIN loyalty_members m ON u.id = m.user_id WHERE u.id = "usr_402";',
    dbResult: {
      id: 'usr_402',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      tier: 'Gold Member',
      points: 4850
    },
    statusCode: 200,
    statusText: 'OK',
    responseHeaders: {
      'Content-Type': 'application/json',
      'X-Response-Time': '24ms'
    },
    responsePayload: {
      user: {
        id: 'usr_402',
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        tier: 'Gold Member',
        loyaltyPoints: 4850
      }
    },
    timings: {
      dns: 2,
      tcpTls: 6,
      serverProcessing: 6,
      dbQuery: 8,
      transfer: 2,
      total: 24
    },
    stepNotes: [
      'Client sends authenticated GET request with JWT token in Authorization header.',
      'Server verifies cryptographic signature of JWT token in CPU without database call (fast token verification).',
      'Server executes indexed primary key join to retrieve Alex\'s profile & loyalty rewards from database.',
      'Database returns Alex\'s profile row in ~8ms.',
      'Server formats user JSON object and returns HTTP 200 OK back to the client application.'
    ]
  }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Why is horizontal scaling generally preferred over vertical scaling for modern internet-scale applications?',
    options: [
      'Horizontal scaling does not require load balancers or network connections.',
      'Horizontal scaling allows adding practically unlimited standard commodity servers and eliminates single points of failure.',
      'Horizontal scaling makes relational databases automatically consistent without any sharding or replication.',
      'Vertical scaling is illegal in cloud computing environments like AWS and Azure.'
    ],
    correctIndex: 1,
    explanation: 'Horizontal scaling (scaling out) allows distributing traffic across multiple commodity machines. If one server crashes, the load balancer reroutes traffic to healthy nodes, achieving high availability and virtually unlimited capacity.'
  },
  {
    id: 2,
    question: 'In an e-commerce platform, which of the following is a Non-Functional Requirement (NFR)?',
    options: [
      'Allowing shoppers to search for items by category.',
      'Sending an email confirmation when an order is placed.',
      'Maintaining 99.99% system availability with sub-100ms response times.',
      'Allowing users to save items to their wish list.'
    ],
    correctIndex: 2,
    explanation: 'Functional requirements define WHAT the system does (features like search, checkout, cart). Non-functional requirements define HOW WELL the system performs (quality attributes like availability, latency, scalability, and security).'
  },
  {
    id: 3,
    question: 'What is the primary advantage of a stateless server architecture compared to a stateful server architecture?',
    options: [
      'Stateless servers store all user session state in their local server RAM, eliminating network latency.',
      'Any server instance can handle any incoming request, allowing seamless horizontal scaling and zero-downtime rolling deploys.',
      'Stateless servers do not require authentication or authorization tokens.',
      'Stateless servers run without any CPU or memory.'
    ],
    correctIndex: 1,
    explanation: 'In a stateless architecture, servers do not hold persistent user state in local RAM. Because state is kept in tokens (JWT) or distributed stores (Redis), the load balancer can send any request to any server without breaking sessions.'
  },
  {
    id: 4,
    question: 'During a flash sale, incoming traffic spikes from 1,000 RPS to 30,000 RPS on an un-cached single database. What is the most immediate expected failure mode?',
    options: [
      'Database connection pool exhaustion and severe latency spikes leading to 504 Gateway Timeouts.',
      'Client browsers will run out of hard disk storage.',
      'DNS servers will automatically delete domain records.',
      'HTTP status code 200 OK will be returned for all requests.'
    ],
    correctIndex: 0,
    explanation: 'When requests far exceed database IOPS and connection pool limits, query queues build up, response times surge, and upstream servers experience connection timeouts (504 Gateway Timeout or 503 Service Unavailable).'
  }
];
