const env = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const { log, serializeError } = require('./utils/logger');
const app = require('./app');

// ---------------------------------------------------------------
// Configuration (override through env.js / environment variables)
// ---------------------------------------------------------------
const SHUTDOWN_TIMEOUT_MS = Number(env.shutdownTimeoutMs) || 10_000;
// Must be higher than your load balancer's idle timeout (AWS ALB default: 60s),
// otherwise the LB can reuse a socket Node just closed and return 502s.
const KEEP_ALIVE_TIMEOUT_MS = Number(env.keepAliveTimeoutMs) || 65_000;
const HEADERS_TIMEOUT_MS = KEEP_ALIVE_TIMEOUT_MS + 1_000;
const REQUEST_TIMEOUT_MS = Number(env.requestTimeoutMs) || 30_000;

// ---------------------------------------------------------------
// State
// ---------------------------------------------------------------
let server = null;
let isShuttingDown = false;

// ---------------------------------------------------------------
// Graceful shutdown (idempotent, bounded by a hard timeout)
// ---------------------------------------------------------------
async function shutdown(reason, exitCode = 0) {
  if (isShuttingDown) return; // ignore repeated signals / cascading errors
  isShuttingDown = true;
  app.locals.isShuttingDown = true; // lets /health/ready return 503 so the LB drains us

  log('info', 'Shutdown started', { reason, exitCode });

  // Hard stop: keep-alive or hung connections must not block the exit forever.
  const forceTimer = setTimeout(() => {
    log('error', 'Graceful shutdown timed out, forcing exit', {
      timeoutMs: SHUTDOWN_TIMEOUT_MS,
    });
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);
  forceTimer.unref();

  try {
    // 1. Stop accepting new connections and let in-flight requests finish
    if (server && server.listening) {
      await new Promise((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
        // Drop idle keep-alive sockets, otherwise close() waits for them to time out
        server.closeIdleConnections?.();
      });
      log('info', 'HTTP server closed');
    }

    // 2. Close the database after the HTTP layer has drained
    await disconnectDB(); // logs on its own
  } catch (err) {
    log('error', 'Error during shutdown', { error: serializeError(err) });
    exitCode = 1;
  }

  clearTimeout(forceTimer);
  process.exit(exitCode);
}

// ---------------------------------------------------------------
// Process-level handlers (registered BEFORE startup so that a signal
// arriving during DB connection is still handled)
// ---------------------------------------------------------------
process.on('SIGINT', () => shutdown('SIGINT', 0));
process.on('SIGTERM', () => shutdown('SIGTERM', 0));

process.on('unhandledRejection', (reason) => {
  log('error', 'Unhandled promise rejection', { error: serializeError(reason) });
  shutdown('unhandledRejection', 1);
});

process.on('uncaughtException', (error) => {
  log('error', 'Uncaught exception', { error: serializeError(error) });
  shutdown('uncaughtException', 1);
});

// ---------------------------------------------------------------
// Startup
// ---------------------------------------------------------------
async function startServer() {
  await connectDB(); // logs on its own

  // A SIGTERM may have arrived while connecting
  if (isShuttingDown) return;

  server = app.listen(env.port);

  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  server.headersTimeout = HEADERS_TIMEOUT_MS;
  server.requestTimeout = REQUEST_TIMEOUT_MS;

  // listen() failures (EADDRINUSE, EACCES) are emitted as events,
  // they are NOT thrown, so try/catch around listen() never sees them.
  server.on('error', (err) => {
    log('error', 'HTTP server error', { error: serializeError(err), port: env.port });
    shutdown('serverError', 1);
  });

  server.on('listening', () => {
    log('info', 'AlgoVision API listening', { port: env.port, environment: env.nodeEnv });
  });
}

startServer().catch((err) => {
  log('error', 'Failed to start server', { error: serializeError(err) });
  shutdown('startupFailure', 1);
});