const crypto = require('crypto');

const VERIFICATION_TOKEN_TTL_MINUTES = 30;

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

/**
 * Generate a random verification token, its SHA-256 hash and its expiry.
 * Only the hash is stored in the database; the raw token goes into the email.
 */
const generateVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex'); // 256 bits of entropy
  const hashedToken = sha256(rawToken);
  const expiresAt = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MINUTES * 60 * 1000);

  return { rawToken, hashedToken, expiresAt };
};

/**
 * Hash a raw verification token.
 *
 * Throws on anything that is not a non-empty string. It used to return null,
 * which is dangerous: a query like { emailVerificationToken: null } matches
 * every account that has no pending token.
 */
const hashToken = (rawToken) => {
  if (typeof rawToken !== 'string' || rawToken.length === 0) {
    throw new TypeError('Verification token must be a non-empty string');
  }
  return sha256(rawToken);
};

module.exports = {
  VERIFICATION_TOKEN_TTL_MINUTES,
  generateVerificationToken,
  hashToken,
};