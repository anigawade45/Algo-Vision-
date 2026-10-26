const { body, param, validationResult, matchedData } = require('express-validator');

// ---------------------------------------------------------------
// Limits
// ---------------------------------------------------------------
const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const EMAIL_MAX_LENGTH = 254; // RFC 5321 maximum
const PASSWORD_MIN_LENGTH = 8;
// bcrypt silently ignores everything after 72 bytes. Rejecting longer input
// avoids false confidence and caps hashing cost. Remove if you use argon2.
const PASSWORD_MAX_BYTES = 72;
// Hard cap for login/current-password so huge payloads are never hashed
const PASSWORD_INPUT_MAX_LENGTH = 128;

// ---------------------------------------------------------------
// Result handler: forwards to the global error handler so validation
// failures are logged and shaped exactly like every other error.
// ---------------------------------------------------------------
const handleValidationErrors = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const err = new Error('Validation failed');
  err.status = 400;
  err.statusCode = 400;
  err.isOperational = true;
  // One message per field; submitted values are never echoed back (passwords!)
  err.errors = result.array({ onlyFirstError: true }).map((e) => ({
    field: e.path || e.param,
    message: e.msg,
  }));
  return next(err);
};

/**
 * Mass-assignment protection: replaces req.body with ONLY the fields that
 * passed validation, so extra properties such as { role: 'admin' } or
 * { isVerified: true } can never reach the controller or Model.create().
 * Must run after handleValidationErrors.
 */
const pickValidatedBody = (req, res, next) => {
  req.body = matchedData(req, { locations: ['body'] });
  next();
};

// ---------------------------------------------------------------
// Reusable rules (factories, so each route gets its own chain)
// ---------------------------------------------------------------
const nameRule = (emptyMessage) =>
  body('name')
    .notEmpty()
    .withMessage(emptyMessage)
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .trim()
    .notEmpty()
    .withMessage(emptyMessage)
    .bail()
    .isLength({ min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH })
    .withMessage(`Name must be between ${NAME_MIN_LENGTH} and ${NAME_MAX_LENGTH} characters long`);

const emailRule = () =>
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isString() // blocks objects/arrays such as { "$gt": "" } or ["a@b.com"]
    .withMessage('Email must be a string')
    .bail()
    .trim()
    .isLength({ max: EMAIL_MAX_LENGTH })
    .withMessage('Email is too long')
    .bail()
    .isEmail()
    .withMessage('Valid email is required')
    .bail()
    // Lowercase + domain normalization only. The default options strip dots and
    // "+tags" from Gmail addresses, which merges distinct addresses into one account.
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    });

/** Policy for creating or changing a password. */
const newPasswordRule = (field, label) =>
  body(field)
    .notEmpty()
    .withMessage(`${label} is required`)
    .bail()
    .isString()
    .withMessage(`${label} must be a string`)
    .bail()
    .isLength({ min: PASSWORD_MIN_LENGTH })
    .withMessage(`${label} must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .bail()
    .custom((value) => Buffer.byteLength(value, 'utf8') <= PASSWORD_MAX_BYTES)
    .withMessage(`${label} must be at most ${PASSWORD_MAX_BYTES} bytes long`);

/** Existing passwords are only checked for presence, type and size (no policy). */
const existingPasswordRule = (field, label) =>
  body(field)
    .notEmpty()
    .withMessage(`${label} is required`)
    .bail()
    .isString()
    .withMessage(`${label} must be a string`)
    .bail()
    .isLength({ max: PASSWORD_INPUT_MAX_LENGTH })
    .withMessage(`${label} is too long`);

// ---------------------------------------------------------------
// Route validators
// ---------------------------------------------------------------
const validateRegister = [
  nameRule('Name is required'),
  emailRule(),
  newPasswordRule('password', 'Password'),
  handleValidationErrors,
  pickValidatedBody,
];

const validateLogin = [
  emailRule(),
  existingPasswordRule('password', 'Password'),
  handleValidationErrors,
  pickValidatedBody,
];

const validateUpdateProfile = [
  nameRule('Name cannot be empty'),
  handleValidationErrors,
  pickValidatedBody,
];

const validateChangePassword = [
  existingPasswordRule('currentPassword', 'Current password'),
  newPasswordRule('newPassword', 'New password')
    .bail()
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('New password must be different from the current password'),
  handleValidationErrors,
  pickValidatedBody,
];

const validateResendVerification = [
  emailRule(),
  handleValidationErrors,
  pickValidatedBody,
];

const validateVerifyEmailToken = [
  param('token')
    .notEmpty()
    .withMessage('Verification token is required')
    .bail()
    .isString()
    .withMessage('Verification token must be a string')
    .bail()
    .trim()
    .isLength({ min: 1, max: 256 })
    .withMessage('Invalid verification token length'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
  validateResendVerification,
  validateVerifyEmailToken,
  handleValidationErrors,
  pickValidatedBody,
};