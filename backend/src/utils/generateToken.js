const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { successResponse } = require('./apiResponse');

/**
 * Generate JWT token for a given user ID
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Helper to parse expiration string (e.g. "7d") into milliseconds
 */
const parseExpiresInToMs = (expiresInStr) => {
  if (typeof expiresInStr === 'number') return expiresInStr;
  const match = String(expiresInStr).match(/^(\d+)([smhd])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
  const val = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's': return val * 1000;
    case 'm': return val * 60 * 1000;
    case 'h': return val * 60 * 60 * 1000;
    case 'd': return val * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
};

/**
 * Generate JWT and send response with HTTP-only cookie
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  const isProduction = env.nodeEnv === 'production';
  const cookieMaxAge = parseExpiresInToMs(env.jwtExpiresIn);

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: cookieMaxAge,
  };

  res.cookie('token', token, cookieOptions);

  const userObj = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete userObj.password;
  delete userObj.__v;

  const safeUser = {
    id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    avatar: userObj.avatar ?? null,
    isVerified: userObj.isVerified ?? false,
    createdAt: userObj.createdAt,
    updatedAt: userObj.updatedAt,
  };

  return successResponse(res, statusCode, message, { user: safeUser });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
