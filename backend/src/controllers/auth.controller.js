const authService = require('../services/auth.service');
const { sendTokenResponse } = require('../utils/generateToken');
const { successResponse } = require('../utils/apiResponse');
const env = require('../config/env');

/**
 * @desc    Register new user & send email verification link (NO auto-login)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await authService.registerUser({ name, email, password });

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
    const { token } = req.params;
    const result = await authService.verifyEmailToken(token);
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
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
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
 */
const logout = async (req, res, next) => {
  try {
    const isProduction = env.nodeEnv === 'production';
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
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
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    const userObj = user.toJSON ? user.toJSON() : { ...user };

    const safeUser = {
      id: userObj._id || userObj.id,
      name: userObj.name,
      email: userObj.email,
      avatar: userObj.avatar ?? null,
      isVerified: userObj.isVerified ?? false,
      createdAt: userObj.createdAt,
      updatedAt: userObj.updatedAt,
    };

    return successResponse(res, 200, 'User profile fetched successfully', { user: safeUser });
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
};
