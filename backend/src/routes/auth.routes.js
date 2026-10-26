const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authLimiter, emailLimiter } = require('../middleware/rateLimit.middleware');

const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateResendVerification,
  validateVerifyEmailToken,
} = require('../middleware/validate.middleware');

const router = express.Router();

// Limiters run first so rejected and malformed requests are counted too.
// authLimiter counts failed attempts only; emailLimiter counts every request
// because register/resend always answer 2xx by design.
router.post('/register', emailLimiter, validateRegister, authController.register);
router.get('/verify-email/:token', authLimiter, validateVerifyEmailToken, authController.verifyEmail);
router.post('/resend-verification', emailLimiter, validateResendVerification, authController.resendVerification);
router.post('/login', authLimiter, validateLogin, authController.login);
router.post('/logout', authController.logout);

router.get('/me', protect, authController.getMe);
router.put('/profile', protect, validateUpdateProfile, authController.updateProfile);
// Brute-forcing the current password with a stolen session must be throttled too
router.put('/change-password', protect, authLimiter, validateChangePassword, authController.changePassword);

module.exports = router;