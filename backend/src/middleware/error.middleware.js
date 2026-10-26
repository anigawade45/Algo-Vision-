const env = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');

const isDevelopment = env.nodeEnv === 'development';
const isTest = env.nodeEnv === 'test';

const GENERIC_MESSAGE = 'Internal server error';

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

/** Accept only valid HTTP error codes from third-party errors. */
const toHttpStatus = (value) =>
  Number.isInteger(value) && value >= 400 && value <= 599 ? value : null;

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Turns any thrown value into { statusCode, message, errors, expose }.
 * `expose` decides whether the message may be shown to the client.
 */
function normalizeError(err) {
  // body-parser, http-errors and our own errors set `status` and/or `statusCode`
  let statusCode = toHttpStatus(err.statusCode) || toHttpStatus(err.status) || 500;
  let message = err.message || GENERIC_MESSAGE;
  let errors = null;

  // Client errors are intended to be seen; server errors only if explicitly operational
  let expose = statusCode < 500 || err.isOperational === true;

  // Errors attached by our own ApiError-style classes
  if (statusCode < 500 && (Array.isArray(err.errors) || isPlainObject(err.errors))) {
    if (!(err.name === 'ValidationError' && isPlainObject(err.errors))) {
      errors = err.errors;
    }
  }

  // --- MongoDB / Mongoose ------------------------------------------------
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered`;
    expose = true;
  } else if (err.name === 'ValidationError' && isPlainObject(err.errors)) {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((el) => ({
      field: el.path,
      message: el.message,
    }));
    expose = true;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for "${err.path || 'field'}"`;
    expose = true;
  } else if (
    ['MongoServerSelectionError', 'MongoNetworkError', 'MongooseServerSelectionError'].includes(
      err.name
    )
  ) {
    statusCode = 503;
    message = 'Service temporarily unavailable';
    expose = true;
  }

  // --- Validation libraries (Joi / Zod) ----------------------------------
  else if (err.isJoi || (err.name === 'ValidationError' && Array.isArray(err.details))) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.details.map((d) => ({
      field: Array.isArray(d.path) ? d.path.join('.') : d.path,
      message: d.message,
    }));
    expose = true;
  } else if (err.name === 'ZodError' && Array.isArray(err.issues)) {
    statusCode = 400;
    message = 'Validation failed';
    errors = err.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    expose = true;
  }

  // --- JWT ----------------------------------------------------------------
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    expose = true;
  } else if (err.name === 'NotBeforeError') {
    statusCode = 401;
    message = 'Token not active yet';
    expose = true;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    expose = true;
  }

  // --- Body parser --------------------------------------------------------
  else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON in request body';
    expose = true;
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
    expose = true;
  } else if (err.type === 'encoding.unsupported' || err.type === 'charset.unsupported') {
    statusCode = 415;
    message = 'Unsupported content encoding';
    expose = true;
  }

  // Never leak internals for unexpected server errors
  if (statusCode >= 500 && !expose) {
    message = GENERIC_MESSAGE;
    errors = null;
  }

  return { statusCode, message, errors };
}

/**
 * Structured error log. 5xx include the stack and log at "error";
 * 4xx are client mistakes and log at "warn" without a stack.
 */
function logError(err, req, { statusCode, message }) {
  if (isTest) return;

  const isServerError = statusCode >= 500;
  const entry = {
    level: isServerError ? 'error' : 'warn',
    time: new Date().toISOString(),
    message: 'request_error',
    requestId: req.id,
    method: req.method,
    path: (req.originalUrl || req.url || '').split('?')[0], // never log query strings
    statusCode,
    userId: req.user?.id || req.user?._id?.toString(),
    error: {
      name: err.name,
      message: err.message,
      responseMessage: message,
      ...(isServerError || isDevelopment ? { stack: err.stack } : {}),
    },
  };

  (isServerError ? console.error : console.warn)(JSON.stringify(entry));
}

// ---------------------------------------------------------------
// Global error handler (must be registered last)
// ---------------------------------------------------------------

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Express requires delegating if the response has already started streaming
  if (res.headersSent) return next(err);

  // Anything can be thrown, including strings or null
  const error =
    err instanceof Error
      ? err
      : new Error(typeof err === 'string' && err ? err : 'Unknown error');

  const normalized = normalizeError(error);
  logError(error, req, normalized);

  try {
    return errorResponse(res, normalized.statusCode, normalized.message, normalized.errors);
  } catch (responseError) {
    // The error handler itself must never throw
    return res.status(normalized.statusCode).json({
      success: false,
      message: normalized.message,
    });
  }
};

module.exports = errorHandler;