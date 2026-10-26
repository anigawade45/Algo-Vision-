const authService = require('../services/auth.service');
const { sendTokenResponse } = require('../utils/generateToken');
const { successResponse } = require('../utils/apiResponse');
const env = require('../config/env');

/** Single place that decides which user fields leave the API. */
const serializeUser = (user) => {
  const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };
  return {
    id: data.id ?? data._id,
    name: data.name,
    email: data.email,
    avatar: data.avatar ?? null,
    isVerified: data.isVerified ?? false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

/**
 * @desc    Register new user & send email verification link (NO auto-login)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await authService.registerUser({ name, email, password });

    // Same response for new and existing emails (no account enumeration)
    return successResponse(
      res,
      201,
      'Registration successful. Please check your email to verify your account.'
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Verify user email via token from email link
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
const verifyEmail = async (req, res, next) => {
  try {
    const result = await authService.verifyEmailToken(req.params.token);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Resend email verification link
 * @route   POST /api/auth/resend-verification
 * @access  Public
 */
const resendVerification = async (req, res, next) => {
  try {
    const result = await authService.resendVerificationEmail(req.body.email);
    return successResponse(res, 200, result.message);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user (requires verified account)
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });
    return sendTokenResponse(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Public
 *
 * The cookie attributes (httpOnly, secure, sameSite, path, domain) must match
 * the ones used when the cookie is set in utils/generateToken.js, otherwise the
 * browser keeps the original cookie.
 */
const logout = (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: env.isProduction,
      sameSite: env.isProduction ? 'none' : 'lax',
    });
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = (req, res, next) => {
  try {
    // protect() already loaded the user; no second database query needed
    return successResponse(res, 200, 'User profile fetched successfully', {
      user: serializeUser(req.user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile (name)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return successResponse(res, 200, 'Profile updated successfully', { user: serializeUser(user) });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 *
 * Every token issued before the change is now invalid (passwordChangedAt), so a
 * fresh token is issued to keep the current session logged in.
 */
const changePassword = async (req, res, next) => {
  try {
    const user = await authService.changePassword(req.user.id, req.body);
    return sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};