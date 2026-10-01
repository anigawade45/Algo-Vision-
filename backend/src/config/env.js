const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

const requiredEnvVars = [];

if (!mongoUri) {
  requiredEnvVars.push('MONGO_URI');
}

if (!jwtSecret) {
  requiredEnvVars.push('JWT_SECRET');
}

if (requiredEnvVars.length > 0) {
  console.error(
    `CRITICAL ERROR: Missing required environment variable(s): ${requiredEnvVars.join(', ')}`
  );

  process.exit(1);
}

const env = Object.freeze({
  port: Number.parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number.parseInt(process.env.SMTP_PORT, 10) || 587,
  smtpUser: process.env.SMTP_USER || '',
  smtpPassword: process.env.SMTP_PASSWORD || '',
  emailFrom: process.env.EMAIL_FROM || 'AlgoVision <no-reply@algovision.io>',
});

module.exports = env;