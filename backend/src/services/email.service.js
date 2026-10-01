const nodemailer = require('nodemailer');
const env = require('../config/env');

// Create reusable Nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth:
      env.smtpUser && env.smtpPassword
        ? {
            user: env.smtpUser,
            pass: env.smtpPassword,
          }
        : undefined,
  });
};

/**
 * Send account verification email
 */
const sendVerificationEmail = async ({ to, name, verificationUrl }) => {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
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
        .btn:hover { background-color: #1d4ed8; }
        .link-box { background-color: #05070e; border: 1px solid #1e2638; padding: 12px; border-radius: 8px; font-size: 12px; color: #64748b; word-break: break-all; }
        .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #1e2638; font-size: 12px; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">⚡ AlgoVision</div>
        <h1>Verify your email address</h1>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Thank you for joining AlgoVision! Please verify your email address to activate your account and start exploring interactive CS learning modules.</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="btn">Verify Email Address</a>
        </div>
        
        <p>This verification link will expire in <strong>30 minutes</strong>.</p>
        <p>If the button above does not work, copy and paste this link into your browser:</p>
        <div class="link-box">${verificationUrl}</div>

        <p style="margin-top: 24px;">If you did not create an AlgoVision account, you can safely ignore this email.</p>
        
        <div class="footer">
          AlgoVision &copy; 2026 • Interactive CS Learning Platform
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Hello ${name},

Welcome to AlgoVision!

Please verify your email address to activate your account:
${verificationUrl}

This verification link expires in 30 minutes.

If you did not create an account, you can safely ignore this email.

Regards,
AlgoVision Team
  `;

  try {
    const info = await transporter.sendMail({
      from: env.emailFrom,
      to,
      subject: 'Verify your AlgoVision account',
      text: textContent,
      html: htmlContent,
    });

    console.log(`Verification email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Failed to send verification email to ${to}:`, error.message);

    const emailError = new Error(
      'Unable to send verification email. Please check your email address or try again later.'
    );
    emailError.statusCode = 500;
    throw emailError;
  }
};

module.exports = {
  sendVerificationEmail,
};
