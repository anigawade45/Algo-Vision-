const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { successResponse } = require('./apiResponse');
const serializeUser = require('./serializeUser');

const COOKIE_NAME = 'token';

/**
 * Generate a signed JWT for a user ID.
 * The algorithm is pinned (auth.middleware verifies with the same one).
 */
const generateToken = (userId) =>
  jwt.sign({ userId: String(userId) }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.jwtExpiresIn,
  });

/**
 * Cookie attributes. Used both to SET and to CLEAR the cookie: the browser only
 * removes a cookie when name, path and domain match the original exactly.
 */
const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.cookieSameSite,
  path: '/',
  ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
});

const clearAuthCookie = (res) => res.clearCookie(COOKIE_NAME, getAuthCookieOptions());

/**
 * Issue a JWT in an HTTP-only cookie and respond with the safe user object.
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);

  // Derive the cookie lifetime from the token's own "exp" claim so the two can
  // never drift apart (the old hand-written duration parser could disagree with
  // what jsonwebtoken actually applied).
  const { exp } = jwt.decode(token);
  const maxAge = Math.max(0, exp * 1000 - Date.now());

  res.cookie(COOKIE_NAME, token, { ...getAuthCookieOptions(), maxAge });
  res.set('Cache-Control', 'no-store'); // never cache responses that set credentials

  return successResponse(res, statusCode, message, { user: serializeUser(user) });
};

module.exports = {
  generateToken,
  getAuthCookieOptions,
  clearAuthCookie,
  sendTokenResponse,
};