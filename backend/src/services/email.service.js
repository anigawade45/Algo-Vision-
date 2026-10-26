const nodemailer = require('nodemailer');
const env = require('../config/env');
const { logger, serializeError } = require('../utils/logger');
const { VERIFICATION_TOKEN_TTL_MINUTES } = require('../utils/emailVerificationToken');

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------

/** Escape user-controlled text before it is placed inside HTML. */
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });

/** Keep full addresses (personal data) out of the logs: j***@example.com */
const maskEmail = (address) => {
  const [local = '', domain = ''] = String(address).split('@');
  return `${local.slice(0, 1)}***@${domain}`;
};

// ---------------------------------------------------------------
// Transport: created once and reused, with bounded timeouts. Nodemailer's
// defaults (2 minute connect, 10 minute socket) would hang the request
// whenever the SMTP provider is slow or down.
// ---------------------------------------------------------------
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure, // implicit TLS on port 465
      requireTLS: env.isProduction && !env.smtpSecure, // refuse a STARTTLS downgrade
      auth: { user: env.smtpUser, pass: env.smtpPassword },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
};

// ---------------------------------------------------------------
// Verification email
// ---------------------------------------------------------------
const buildHtml = ({ safeName, safeUrl }) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #05070e; color: #f8fafc; margin: 0; padding: 40px 20px; }
    .container { max-width: 560px; margin: 0 auto; background-color: #0b101d; border: 1px solid #1e2638; border-radius: 16px; padding: 36px; }
    .logo { font-size: 20px; font-weight: 800; color: #3b82f6; text-decoration: none; display: inline-block; margin-bottom: 24px; }
    h1 { font-size: 22px; font-weight: 700; color: #ffffff; margin-top: 0; }
    p { font-size: 14px; line-height: 1.6; color: #94a3b8; }
    .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 24px 0; }
    .link-box { background-color: #05070e; border: 1px solid #1e2638; padding: 12px; border-radius: 8px; font-size: 12px; color: #64748b; word-break: break-all; }
    .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e2638; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">⚡ AlgoVision</div>
    <h1>Verify your email address</h1>
    <p>Hi <strong>${safeName}</strong>,</p>
    <p>Thank you for joining AlgoVision! Please verify your email address to activate your account and start exploring interactive CS learning modules.</p>

    <div style="text-align: center;">
      <a href="${safeUrl}" class="btn">Verify Email Address</a>
    </div>

    <p>This verification link will expire in <strong>${VERIFICATION_TOKEN_TTL_MINUTES} minutes</strong>.</p>
    <p>If the button above does not work, copy and paste this link into your browser:</p>
    <div class="link-box">${safeUrl}</div>

    <p style="margin-top: 24px;">If you did not create an AlgoVision account, you can safely ignore this email.</p>

    <div class="footer">
      AlgoVision &copy; ${new Date().getFullYear()} • Interactive CS Learning Platform
    </div>
  </div>
</body>
</html>`;

const buildText = ({ displayName, verificationUrl }) =>
  [
    `Hello ${displayName},`,
    '',
    'Welcome to AlgoVision!',
    '',
    'Please verify your email address to activate your account:',
    verificationUrl,
    '',
    `This verification link expires in ${VERIFICATION_TOKEN_TTL_MINUTES} minutes.`,
    '',
    'If you did not create an account, you can safely ignore this email.',
    '',
    'Regards,',
    'AlgoVision Team',
  ].join('\n');

/**
 * Send the account verification email.
 * Throws an operational error (503) with the SMTP error attached as `cause`.
 */
const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  if (!/^https?:\/\//i.test(String(verificationUrl))) {
    throw new Error('verificationUrl must be an http(s) URL');
  }

  // Local development without SMTP credentials: print the link instead of
  // waiting for a connection to a mail server that will never answer.
  if (!env.emailEnabled) {
    if (env.isProduction) throw new Error('Email delivery is not configured');
    logger.info('SMTP not configured; verification link for local testing', {
      to: maskEmail(to),
      verificationUrl,
    });
    return { success: true, messageId: null };
  }

  // name is user-controlled: strip line breaks for the text part, escape for HTML.
  // Without escaping, anyone could register a victim's address with a name such as
  // <a href="https://evil.example">...</a> and make AlgoVision deliver phishing.
  const displayName = String(name).replace(/[\r\n\t]+/g, ' ').trim();

  try {
    const info = await getTransporter().sendMail({
      from: env.emailFrom,
      to,
      subject: 'Verify your AlgoVision account',
      text: buildText({ displayName, verificationUrl }),
      html: buildHtml({
        safeName: escapeHtml(displayName),
        safeUrl: escapeHtml(verificationUrl),
      }),
    });

    logger.info('Verification email sent', { to: maskEmail(to), messageId: info.messageId });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error('SMTP delivery failed', {
      to: maskEmail(to),
      error: { ...serializeError(error), command: error.command, responseCode: error.responseCode },
    });

    const emailError = new Error('Unable to send verification email. Please try again later.');
    emailError.statusCode = 503;
    emailError.status = 503;
    emailError.isOperational = true;
    emailError.cause = error;
    throw emailError;
  }
};

module.exports = {
  sendVerificationEmail,
  escapeHtml, // exported for tests
};