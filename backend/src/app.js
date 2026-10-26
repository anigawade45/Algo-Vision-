const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { isDBHealthy } = require('./config/db');

const env = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const { globalLimiter } = require('./middleware/rateLimit.middleware');

const app = express();
const isProduction = env.nodeEnv === 'production';

// ---------------------------------------------------------------
// Core settings
// ---------------------------------------------------------------
app.disable('x-powered-by');

// Behind a load balancer / reverse proxy, req.ip, secure cookies and rate
// limiting only work correctly if Express trusts the proxy. The value is the
// number of proxy hops in front of the app (parse as a number in env.js).
app.set('trust proxy', env.trustProxy ?? (isProduction ? 1 : false));

// ---------------------------------------------------------------
// Request ID (correlates logs and error reports across a request)
// ---------------------------------------------------------------
app.use((req, res, next) => {
  const incoming = req.get('x-request-id');
  req.id = incoming && /^[\w-]{8,64}$/.test(incoming) ? incoming : crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Tell clients/LB to close the connection while the server is draining
app.use((req, res, next) => {
  if (app.locals.isShuttingDown) res.setHeader('Connection', 'close');
  next();
});

// ---------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------
app.use(helmet());

// ---------------------------------------------------------------
// Health checks (before CORS, logging and rate limiting so load balancers
// and orchestrators are never throttled and logs stay clean)
// ---------------------------------------------------------------
app.get('/health/live', (req, res) => {
  res.set('Cache-Control', 'no-store').status(200).json({ status: 'ok' });
});

app.get('/health/ready', (req, res) => {
  const databaseUp = isDBHealthy();
  const shuttingDown = app.locals.isShuttingDown === true;
  const ready = databaseUp && !shuttingDown;

  res
    .set('Cache-Control', 'no-store')
    .status(ready ? 200 : 503)
    .json({
      status: ready ? 'ready' : 'unavailable',
      checks: { database: databaseUp ? 'up' : 'down', shuttingDown },
    });
});

// ---------------------------------------------------------------
// Compression (trace payloads can be large JSON)
// ---------------------------------------------------------------
app.use(compression());

// ---------------------------------------------------------------
// CORS: explicit allowlist (CLIENT_URL may be comma-separated)
// ---------------------------------------------------------------
// Parsed and validated in config/env.js (bare https origins, no "*", no localhost in production)
const allowedOrigins = env.clientUrls;

app.use(
  cors({
    origin(origin, callback) {
      // No Origin header: same-origin requests, curl, server-to-server
      if (!origin) return callback(null, true);
      return callback(null, allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id', 'RateLimit', 'RateLimit-Policy'],
    maxAge: 600, // cache preflight responses for 10 minutes
  })
);

// ---------------------------------------------------------------
// Request logging (structured JSON in production, no query strings so
// tokens in URLs never reach the logs)
// ---------------------------------------------------------------
const jsonFormat = (tokens, req, res) =>
  JSON.stringify({
    level: 'info',
    time: new Date().toISOString(),
    message: 'http_request',
    requestId: req.id,
    method: req.method,
    path: req.originalUrl.split('?')[0],
    status: Number(tokens.status(req, res)),
    responseTimeMs: Number(tokens['response-time'](req, res)),
    contentLength: tokens.res(req, res, 'content-length') || 0,
    ip: req.ip,
    userAgent: tokens['user-agent'](req, res),
  });

app.use(
  env.nodeEnv === 'development'
    ? morgan('dev')
    : morgan(jsonFormat, { skip: () => env.nodeEnv === 'test' })
);

// ---------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------
app.use('/api', globalLimiter);

// ---------------------------------------------------------------
// Body parsers with explicit size limits
// ---------------------------------------------------------------
app.use(express.json({ limit: env.jsonBodyLimit || '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb', parameterLimit: 100 }));

// ---------------------------------------------------------------
// NoSQL injection protection: strip keys like {"$gt": ""} or "a.b" that
// reach Mongo queries. Mutates in place (works on Express 4 and 5, where
// req.query is a getter). Route-level schema validation is still required.
// ---------------------------------------------------------------
const MAX_DEPTH = 50;

function sanitizeInPlace(value, depth = 0) {
  if (value === null || typeof value !== 'object') return;
  if (depth > MAX_DEPTH) {
    const err = new Error('Request payload is nested too deeply');
    err.status = 400;
    err.statusCode = 400;
    err.isOperational = true;
    throw err;
  }
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key];
    } else {
      sanitizeInPlace(value[key], depth + 1);
    }
  }
}

app.use((req, res, next) => {
  try {
    sanitizeInPlace(req.body);
    sanitizeInPlace(req.params);
    sanitizeInPlace(req.query);
    next();
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------
// Cookies (pass a secret only if you use signed cookies)
// ---------------------------------------------------------------
app.use(cookieParser(env.cookieSecret));

// ---------------------------------------------------------------
// Routes
// ---------------------------------------------------------------
app.use('/api', routes);

// 404 handler and global error handler (must stay last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;