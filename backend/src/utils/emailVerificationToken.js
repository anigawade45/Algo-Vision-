const crypto = require('crypto');

/**
 * Generate a random verification token, its SHA-256 hash, and expiration date (30 mins)
 */
const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  return {
    rawToken,
    hashedToken,
    expiresAt,
  };
};

/**
 * Hash a raw verification token using SHA-256
 */
const hashToken = (rawToken) => {
  if (!rawToken) return null;
  return crypto.createHash('sha256').update(rawToken).digest('hex');
};

module.exports = {
  generateVerificationToken,
  hashToken,
};
