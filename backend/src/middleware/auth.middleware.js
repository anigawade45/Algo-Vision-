const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

const INVALID_MESSAGE = 'Unauthorized access. Invalid or expired token.';
const JWT_ERROR_NAMES = new Set(['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError']);

const unauthorized = (message) => {
  const err = new Error(message);
  err.status = 401;
  err.statusCode = 401;
  err.isOperational = true;
  return err;
};

/** Cookie first, then Authorization: Bearer <token>. */
const extractToken = (req) => {
  const cookieToken = req.cookies?.token;
  if (typeof cookieToken === 'string' && cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7).trim() || null;
  }
  return null;
};

/**
 * Verifies the token and loads the user. Returns null when the token is valid but
 * no longer usable (user deleted, or password changed after the token was issued).
 * Throws JWT errors for bad tokens and propagates database errors untouched.
 */
const authenticate = async (token) => {
  // Pin the algorithm so a token can never choose its own
  const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });

  if (typeof decoded?.userId !== 'string' || typeof decoded.iat !== 'number') {
    throw unauthorized(INVALID_MESSAGE);
  }

  const user = await User.findById(decoded.userId).select('+passwordChangedAt');
  if (!user) return null;

  // Tokens issued before the last password change are revoked
  if (user.changedPasswordAfter(decoded.iat)) return null;

  return user;
};

const protect = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) throw unauthorized('Unauthorized access. Token is missing.');

    const user = await authenticate(token);
    if (!user) throw unauthorized(INVALID_MESSAGE);

    req.user = user;
    return next();
  } catch (error) {
    if (JWT_ERROR_NAMES.has(error.name)) return next(unauthorized(INVALID_MESSAGE));
    // Anything else (a database outage, a bug) must NOT look like "invalid token":
    // the client would log the user out, and nothing would be logged server-side.
    return next(error);
  }
};

/**
 * Optional authentication: populates req.user when a valid token is provided,
 * otherwise continues as a guest. Real server errors still propagate.
 */
const optionalProtect = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      req.user = null;
      return next();
    }

    req.user = await authenticate(token);
    return next();
  } catch (error) {
    if (JWT_ERROR_NAMES.has(error.name) || error.statusCode === 401) {
      req.user = null;
      return next();
    }
    return next(error);
  }
};

module.exports = {
  protect,
  optionalProtect,
};