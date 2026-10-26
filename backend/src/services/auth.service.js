const User = require('../models/User');
const env = require('../config/env');
const { generateVerificationToken, hashToken } = require('../utils/emailVerificationToken');
const { sendVerificationEmail } = require('./email.service');
const { logger, serializeError } = require('../utils/logger');

const RESEND_COOLDOWN_MS = 60 * 1000;

// Same wording whether or not the account exists (prevents email enumeration)
const GENERIC_VERIFICATION_MESSAGE =
  'If an account with that email exists, a verification email has been sent.';

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.status = statusCode;
    this.isOperational = true; // safe to show the message to the client
  }
}

/**
 * Issues a fresh verification token and emails it.
 *
 * The cooldown is claimed ATOMICALLY in a single conditional update, so
 * concurrent requests cannot bypass it and trigger several emails.
 * Returns false when the user is already verified or is still inside the cooldown.
 * Throws AppError(503) if the email could not be sent (the cooldown is rolled back
 * so the user can retry immediately).
 */
const issueVerificationEmail = async (userId) => {
  const { rawToken, hashedToken, expiresAt } = generateVerificationToken();
  const now = new Date();
  const cutoff = new Date(now.getTime() - RESEND_COOLDOWN_MS);

  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      isVerified: false,
      $or: [
        { lastVerificationResend: { $exists: false } },
        { lastVerificationResend: null },
        { lastVerificationResend: { $lte: cutoff } },
      ],
    },
    {
      $set: {
        emailVerificationToken: hashedToken,
        emailVerificationExpires: expiresAt,
        lastVerificationResend: now,
      },
    },
    { new: true }
  );

  if (!user) return false;

  try {
    await sendVerificationEmail({
      to: user.email,
      name: user.name,
      verificationUrl: `${env.clientUrl}/verify-email/${rawToken}`,
    });
    return true;
  } catch (error) {
    logger.error('Failed to send verification email', {
      userId: String(user._id),
      error: serializeError(error),
    });
    await User.updateOne({ _id: user._id }, { $unset: { lastVerificationResend: 1 } }).catch(() => { });
    throw new AppError('We could not send the verification email. Please try again in a moment.', 503);
  }
};

/**
 * Register a new user and send the verification email.
 *
 * Security notes:
 * - An existing account is NEVER modified. Overwriting the password of an
 *   unverified account would let an attacker register a victim's email with the
 *   attacker's password; once the victim clicks the (legitimate) verification
 *   link, the attacker owns a verified account.
 * - The response is identical for new and existing emails (no enumeration).
 *   Trade-off: someone who already has an account gets no email. Consider adding an
 *   "you already have an account" email to email.service.
 */
const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail }).select('_id isVerified');

  if (existing) {
    if (!existing.isVerified) await issueVerificationEmail(existing._id);
    return;
  }

  let user;
  try {
    user = await User.create({ name, email: normalizedEmail, password, isVerified: false });
  } catch (error) {
    if (error.code === 11000) return; // lost a race with a concurrent registration
    throw error;
  }

  await issueVerificationEmail(user._id);
};

/**
 * Verify user email using the raw token from the link.
 */
const verifyEmailToken = async (rawToken) => {
  if (typeof rawToken !== 'string' || !rawToken || rawToken.length > 256) {
    throw new AppError('Verification token is missing or malformed', 400);
  }

  const user = await User.findOne({
    emailVerificationToken: hashToken(rawToken),
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!user) {
    throw new AppError('Invalid or expired verification link', 400);
  }

  // Unsets the token fields (null values would stay in the sparse index)
  user.markEmailVerified();
  await user.save();

  return { success: true, message: 'Email verified successfully' };
};

/**
 * Resend the verification link. Always answers with the same message.
 */
const resendVerificationEmail = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('_id isVerified');

  if (user && !user.isVerified) {
    try {
      await issueVerificationEmail(user._id);
    } catch (error) {
      // Send failures are already logged. Swallowing them keeps the response
      // identical for existing and unknown emails.
      if (!(error instanceof AppError)) throw error;
    }
  }

  return { success: true, message: GENERIC_VERIFICATION_MESSAGE };
};

/**
 * Authenticate user with email and password.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    await User.burnPasswordCheck(password); // equalize timing with the real path
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Checked only AFTER the password so verification status is not revealed to guessers
  if (!user.isVerified) {
    throw new AppError('Please verify your email before logging in.', 403);
  }

  return user;
};

const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, { name }) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);

  user.name = name;
  await user.save();

  return user;
};

/**
 * Change password. Returns the user so the controller can issue a fresh token:
 * saving the password sets passwordChangedAt, which invalidates every token issued
 * before the change (including the caller's current one).
 * Length and policy are enforced by the validators and the User model.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 400);
  }

  user.password = newPassword;
  await user.save();

  return user;
};

module.exports = {
  AppError,
  registerUser,
  verifyEmailToken,
  resendVerificationEmail,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword,
};