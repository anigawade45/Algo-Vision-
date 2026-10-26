const mongoose = require('mongoose');
const env = require('./env');
const { logger, serializeError } = require('../utils/logger');

// Unknown fields in a query filter THROW instead of being silently dropped.
// With `true`, User.findOne({ emial: x }) loses the bad key and matches the
// first user in the collection.
mongoose.set('strictQuery', 'throw');

let connectionPromise = null;
let listenersAttached = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Keep credentials out of logs, whatever the driver puts in a message. */
const redact = (text = '') =>
  String(text).replace(/(mongodb(?:\+srv)?:\/\/)[^@\s/]+@/gi, '$1***@');

/** Errors that will never succeed on retry (bad URI, bad credentials). */
const isFatalConnectError = (err) =>
  ['MongoParseError', 'MongoAPIError', 'MongoInvalidArgumentError'].includes(err?.name) ||
  err?.code === 18 ||
  err?.codeName === 'AuthenticationFailed';

const attachListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  const { connection } = mongoose;

  connection.on('error', (err) => {
    logger.error('MongoDB runtime error', { error: { ...serializeError(err), message: redact(err.message) } });
  });
  connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected; the driver will try to reconnect');
  });
  connection.on('reconnected', () => {
    logger.info('MongoDB reconnected');
  });
};

const connectOptions = {
  maxPoolSize: env.mongoMaxPoolSize,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 10_000,
  socketTimeoutMS: 45_000,
  ...(env.mongoIpFamily ? { family: env.mongoIpFamily } : {}),
  // In production, indexes (including UNIQUE ones such as user email) must be
  // created by a deploy step. See scripts/createIndexes.js
  autoIndex: !env.isProduction,
};

/**
 * Connects to MongoDB. Idempotent and de-duplicated: concurrent callers share
 * one in-flight attempt. Throws on final failure so server.js decides what to do.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  attachListeners();

  connectionPromise = (async () => {
    let lastError;

    for (let attempt = 1; attempt <= env.mongoMaxRetries; attempt += 1) {
      try {
        await mongoose.connect(env.mongoUri, connectOptions);
        const { host, name } = mongoose.connection;
        logger.info('MongoDB connected', { host, database: name });
        return mongoose.connection;
      } catch (error) {
        lastError = error;
        const fatal = isFatalConnectError(error);

        logger.error('MongoDB connection attempt failed', {
          attempt,
          maxAttempts: env.mongoMaxRetries,
          willRetry: !fatal && attempt < env.mongoMaxRetries,
          error: { name: error.name, code: error.code, message: redact(error.message) },
        });

        if (fatal) break; // retrying a wrong password or URI only delays the failure
        if (attempt < env.mongoMaxRetries) await sleep(env.mongoRetryDelayMs * attempt); // linear backoff
      }
    }

    lastError.message = redact(lastError.message);
    throw lastError;
  })();

  try {
    return await connectionPromise;
  } finally {
    connectionPromise = null; // allow a later call to retry after a final failure
  }
};

/** Closes the connection. Called from the graceful shutdown in server.js. */
const disconnectDB = async () => {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.connection.close();
  logger.info('MongoDB connection closed');
};

/** For health checks: true when connected. */
const isDBHealthy = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.connectDB = connectDB;
module.exports.disconnectDB = disconnectDB;
module.exports.isDBHealthy = isDBHealthy;