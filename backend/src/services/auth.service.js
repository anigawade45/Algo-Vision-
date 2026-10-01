const User = require('../models/User');
const env = require('../config/env');
const { generateVerificationToken, hashToken } = require('../utils/emailVerificationToken');
const { sendVerificationEmail } = require('./email.service');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Register a new user and generate email verification token
 */
const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser && existingUser.isVerified) {
    throw new AppError('An account with this email already exists.', 400);
  }

  const { rawToken, hashedToken, expiresAt } = generateVerificationToken();

  let user = existingUser;

  if (user) {
    // If registered before but unverified, update credentials and send new token
    user.name = name;
    user.password = password;
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = expiresAt;
    user.lastVerificationResend = new Date();
    await user.save();
  } else {
    // Create new unverified user
    user = await User.create({
      name,
      email: normalizedEmail,
      password,
      isVerified: false,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expiresAt,
      lastVerificationResend: new Date(),
    });
  }

  const verificationUrl = `${env.clientUrl}/verify-email/${rawToken}`;
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    isVerified: false,
  };
};

/**
 * Verify user email using raw verification token
 */
const verifyEmailToken = async (rawToken) => {
  if (!rawToken) {
    throw new AppError('Verification token is missing', 400);
  }

  const hashedToken = hashToken(rawToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new AppError('Invalid or expired verification link', 400);
  }

  user.isVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return { success: true, message: 'Email verified successfully' };
};

/**
 * Resend email verification link with rate limiting
 */
const resendVerificationEmail = async (email) => {
  if (!email) {
    throw new AppError('Email address is required', 400);
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select(
    '+emailVerificationToken +emailVerificationExpires +lastVerificationResend'
  );

  // Return generic response if user doesn't exist to prevent email enumeration
  if (!user) {
    return {
      success: true,
      message: 'If an account with that email exists, a verification email has been sent.',
    };
  }

  if (user.isVerified) {
    return {
      success: true,
      message: 'This account is already verified. Please log in.',
    };
  }

  // Cooldown rate limit: 60 seconds
  if (user.lastVerificationResend) {
    const timeDiff = Date.now() - new Date(user.lastVerificationResend).getTime();
    if (timeDiff < 60000) {
      const waitSeconds = Math.ceil((60000 - timeDiff) / 1000);
      throw new AppError(
        `Please wait ${waitSeconds} seconds before requesting another verification email.`,
        429
      );
    }
  }

  const { rawToken, hashedToken, expiresAt } = generateVerificationToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = expiresAt;
  user.lastVerificationResend = new Date();
  await user.save();

  const verificationUrl = `${env.clientUrl}/verify-email/${rawToken}`;
  await sendVerificationEmail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  return {
    success: true,
    message: 'If an account with that email exists, a verification email has been sent.',
  };
};

/**
 * Authenticate user with email and password
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Reject unverified account login attempt
  if (!user.isVerified) {
    throw new AppError('Please verify your email before logging in.', 403);
  }

  return user;
};

/**
 * Fetch current user by ID
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

module.exports = {
  AppError,
  registerUser,
  verifyEmailToken,
  resendVerificationEmail,
  loginUser,
  getCurrentUser,
};
