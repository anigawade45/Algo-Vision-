const rateLimit = require('express-rate-limit'); // requires v7+ (uses the `limit` option)
const env = require('../config/env');

/**
 * Forward rate-limit rejections to the global error handler so 429 responses
 * share the same JSON shape as every other error in the API.
 */
const handler = (req, res, next, options) => {
  const err = new Error(options.message || 'Too many requests, please try again later.');
  err.status = 429;
  err.statusCode = 429;
  err.isOperational = true;
  next(err);
};

const baseOptions = {
  standardHeaders: 'draft-7', // RateLimit-* headers
  legacyHeaders: false, // drop X-RateLimit-* headers
  handler,
  skip: () => env.nodeEnv === 'test',
  message: 'Too many requests, please try again later.',
};

/**
 * Broad safety net applied to all /api traffic.
 */
const globalLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 300,
});

/**
 * Strict limiter for login / register / refresh / password reset routes.
 * Only failed attempts count, so legitimate users are not locked out.
 * Usage: router.post('/login', authLimiter, controller.login)
 */
const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.',
});

/**
 * Strict limiter for email sending routes (register, resend verification).
 * Counts every request to prevent outbound email flooding and abuse.
 * Usage: router.post('/resend-verification', emailLimiter, controller.resendVerification)
 */
const emailLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: 'Too many email requests, please try again later.',
});

/**
 * Limiter for CPU-heavy endpoints (trace generation / visualization execution).
 * Usage: router.post('/visualize', executionLimiter, controller.visualize)
 */
const executionLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 1000,
  limit: 30,
  message: 'Too many execution requests, please slow down.',
});

module.exports = { globalLimiter, authLimiter, emailLimiter, executionLimiter };