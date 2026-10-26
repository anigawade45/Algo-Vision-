const path = require('path');
const dotenv = require('dotenv');

// In production, variables come from the platform (Render, Railway, Docker, etc.).
// dotenv never overrides existing variables and silently ignores a missing file.
dotenv.config({
  path: path.resolve(__dirname, '../../.env'), // adjust if your .env is in the backend root
});

// Required AFTER dotenv so LOG_LEVEL from .env is honoured
const { logger } = require('../utils/logger');

const errors = [];

// ---------------------------------------------------------------
// Parsing helpers (strict: a value that is SET but invalid is an error,
// never silently replaced by the fallback)
// ---------------------------------------------------------------
const readString = (name, fallback = '') => {
  const raw = process.env[name];
  return raw === undefined ? fallback : raw.trim();
};

const readInt = (name, fallback, { min = -Infinity, max = Infinity } = {}) => {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    const range =
      Number.isFinite(min) || Number.isFinite(max)
        ? ` between ${Number.isFinite(min) ? min : '-∞'} and ${Number.isFinite(max) ? max : '∞'}`
        : '';
    errors.push(`${name} must be an integer${range} (got "${raw}")`);
    return fallback;
  }
  return value;
};

const parseTrustProxy = (raw) => {
  if (raw === undefined || raw.trim() === '') return undefined; // app.js picks the default
  const value = raw.trim();
  const lower = value.toLowerCase();

  if (lower === 'false') return false;
  if (lower === 'true') {
    errors.push(
      'TRUST_PROXY=true trusts every proxy and lets clients spoof their IP. ' +
      'Set the number of proxy hops (e.g. 1) or a subnet list (e.g. "loopback, uniquelocal")'
    );
    return undefined;
  }
  if (/^\d+$/.test(value)) return Number(value);
  return value; // "loopback", "uniquelocal", CIDR list
};

// ---------------------------------------------------------------
// Environment
// ---------------------------------------------------------------
const NODE_ENVS = ['development', 'test', 'production'];
const nodeEnv = readString('NODE_ENV', 'development').toLowerCase();
const isProduction = nodeEnv === 'production';

if (!NODE_ENVS.includes(nodeEnv)) {
  errors.push(`NODE_ENV must be one of: ${NODE_ENVS.join(', ')} (got "${nodeEnv}")`);
}

// ---------------------------------------------------------------
// Server
// ---------------------------------------------------------------
const port = readInt('PORT', 5000, { min: 1, max: 65535 });
const trustProxy = parseTrustProxy(process.env.TRUST_PROXY);
const shutdownTimeoutMs = readInt('SHUTDOWN_TIMEOUT_MS', 10_000, { min: 1_000, max: 120_000 });
// Must exceed your load balancer's idle timeout (AWS ALB: 60s)
const keepAliveTimeoutMs = readInt('KEEP_ALIVE_TIMEOUT_MS', 65_000, { min: 1_000, max: 600_000 });
const requestTimeoutMs = readInt('REQUEST_TIMEOUT_MS', 30_000, { min: 1_000, max: 600_000 });

const jsonBodyLimit = readString('JSON_BODY_LIMIT', '100kb');
if (!/^\d+(b|kb|mb)$/i.test(jsonBodyLimit)) {
  errors.push(`JSON_BODY_LIMIT must look like "100kb" or "1mb" (got "${jsonBodyLimit}")`);
}

// ---------------------------------------------------------------
// MongoDB
// ---------------------------------------------------------------
const mongoUri = readString('MONGO_URI');
if (!mongoUri) {
  errors.push('MONGO_URI is required');
} else if (!/^mongodb(\+srv)?:\/\//.test(mongoUri)) {
  errors.push('MONGO_URI must start with mongodb:// or mongodb+srv://');
}

const mongoMaxPoolSize = readInt('MONGO_MAX_POOL_SIZE', 10, { min: 1, max: 500 });
const mongoMaxRetries = readInt('MONGO_MAX_RETRIES', 5, { min: 1, max: 20 });
const mongoRetryDelayMs = readInt('MONGO_RETRY_DELAY_MS', 3000, { min: 0, max: 60_000 });
// Only set this if your network has IPv6 DNS problems with Atlas (then use 4)
const mongoIpFamily = readInt('MONGO_IP_FAMILY', undefined);
if (mongoIpFamily !== undefined && ![4, 6].includes(mongoIpFamily)) {
  errors.push('MONGO_IP_FAMILY must be 4 or 6');
}

// ---------------------------------------------------------------
// Auth
// ---------------------------------------------------------------
const WEAK_SECRETS = new Set([
  'secret',
  'changeme',
  'change-me',
  'change_me',
  'jwt_secret',
  'jwtsecret',
  'your-secret-key',
  'your_jwt_secret',
  'supersecret',
  'password',
]);

const jwtSecret = readString('JWT_SECRET');
if (!jwtSecret) {
  errors.push('JWT_SECRET is required');
} else if (isProduction) {
  if (jwtSecret.length < 32) errors.push('JWT_SECRET must be at least 32 characters in production');
  if (WEAK_SECRETS.has(jwtSecret.toLowerCase())) {
    errors.push('JWT_SECRET is a well-known placeholder value; generate a random one');
  }
}

const jwtExpiresIn = readString('JWT_EXPIRES_IN', '7d');
if (!/^\d+(\s*[a-z]+)?$/i.test(jwtExpiresIn)) {
  errors.push(`JWT_EXPIRES_IN must look like "15m", "12h" or "7d" (got "${jwtExpiresIn}")`);
}

const cookieSecret = readString('COOKIE_SECRET') || undefined; // only needed for signed cookies
if (cookieSecret && isProduction && cookieSecret.length < 32) {
  errors.push('COOKIE_SECRET must be at least 32 characters in production');
}

// ---------------------------------------------------------------
// Client / CORS (each entry must be a bare origin)
// ---------------------------------------------------------------
const clientUrls = readString('CLIENT_URL', isProduction ? '' : 'http://localhost:5173')
  .split(',')
  .map((item) => item.trim().replace(/\/+$/, ''))
  .filter(Boolean);

if (isProduction && clientUrls.length === 0) {
  errors.push('CLIENT_URL is required in production');
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);
for (const url of clientUrls) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch (_) {
    errors.push(`CLIENT_URL contains an invalid origin: "${url}" ("*" is not allowed)`);
    continue;
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.origin !== url) {
    errors.push(`CLIENT_URL entries must be bare origins like https://app.example.com (got "${url}")`);
    continue;
  }
  if (isProduction && parsed.protocol !== 'https:') {
    errors.push(`CLIENT_URL must use https in production (got "${url}")`);
  }
  if (isProduction && LOCAL_HOSTS.has(parsed.hostname)) {
    errors.push(`CLIENT_URL must not point to localhost in production (got "${url}")`);
  }
}

// ---------------------------------------------------------------
// Email (SMTP): all-or-nothing, required in production
// ---------------------------------------------------------------
const smtpUser = readString('SMTP_USER');
const smtpPassword = process.env.SMTP_PASSWORD || ''; // never trimmed: may contain spaces
const smtpPort = readInt('SMTP_PORT', 587, { min: 1, max: 65535 });
const emailEnabled = Boolean(smtpUser && smtpPassword);

if ((smtpUser && !smtpPassword) || (!smtpUser && smtpPassword)) {
  errors.push('SMTP_USER and SMTP_PASSWORD must be set together');
} else if (isProduction && !emailEnabled) {
  errors.push('SMTP_USER and SMTP_PASSWORD are required in production');
}
if (isProduction && emailEnabled && !readString('EMAIL_FROM')) {
  errors.push('EMAIL_FROM is required in production (must be an address your SMTP provider allows)');
}

// ---------------------------------------------------------------
// AI (Gemini): optional feature, the app works without it
// ---------------------------------------------------------------
const geminiApiKey = readString('GEMINI_API_KEY');
const aiEnabled = Boolean(geminiApiKey);

// ---------------------------------------------------------------
// Fail fast with ONE readable message. Secret values are never included.
// ---------------------------------------------------------------
if (errors.length > 0) {
  throw new Error(`Invalid environment configuration:\n - ${errors.join('\n - ')}`);
}

if (isProduction && !aiEnabled) {
  logger.warn('GEMINI_API_KEY is not set: AI features are disabled');
}

const env = Object.freeze({
  nodeEnv,
  isProduction,
  port,
  trustProxy,
  shutdownTimeoutMs,
  keepAliveTimeoutMs,
  requestTimeoutMs,
  jsonBodyLimit,

  mongoUri,
  mongoMaxPoolSize,
  mongoMaxRetries,
  mongoRetryDelayMs,
  mongoIpFamily,

  jwtSecret,
  jwtExpiresIn,
  cookieSecret,

  clientUrl: clientUrls[0],
  clientUrls: Object.freeze(clientUrls), // use this for the CORS allowlist

  smtpHost: readString('SMTP_HOST', 'smtp.gmail.com'),
  smtpPort,
  smtpSecure: smtpPort === 465,
  smtpUser,
  smtpPassword,
  emailFrom: readString('EMAIL_FROM', 'AlgoVision <no-reply@algovision.io>'),
  emailEnabled,

  geminiApiKey,
  geminiModel: readString('GEMINI_MODEL', 'gemini-2.5-flash'),
  aiMentorApiKey: readString('AI_MENTOR_API_KEY'),
  aiEnabled,
});

module.exports = env;