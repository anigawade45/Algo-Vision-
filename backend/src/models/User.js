const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // see note: native `bcrypt` is a drop-in, faster alternative

const BCRYPT_ROUNDS = 12;
// bcrypt only uses the first 72 BYTES (not characters) of the input.
const BCRYPT_MAX_BYTES = 72;
const EMAIL_VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

const isHttpUrl = (value) => {
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch (_) {
    return false;
  }
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // the index must exist in production, see scripts/createIndexes.js
      lowercase: true,
      trim: true,
      maxlength: [254, 'Email is too long'],
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      validate: {
        // Bytes, not characters: 72 emoji would be 288 bytes and bcrypt would
        // silently ignore most of them.
        validator: (value) => Buffer.byteLength(value, 'utf8') <= BCRYPT_MAX_BYTES,
        message: `Password cannot exceed ${BCRYPT_MAX_BYTES} bytes (fewer characters if it contains non-ASCII symbols)`,
      },
      select: false,
    },
    avatar: {
      type: String,
      default: null,
      trim: true,
      maxlength: [2048, 'Avatar URL is too long'],
      validate: {
        // Blocks javascript:, data: and other schemes that become XSS when rendered
        validator: (value) => value === null || value === '' || isHttpUrl(value),
        message: 'Avatar must be a valid http(s) URL',
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Stores the SHA-256 HASH of the token, never the raw token.
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },
    lastVerificationResend: {
      type: Date,
      select: false,
    },
    // Lets you invalidate JWTs issued before a password change.
    passwordChangedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Sparse: only documents that currently have a pending token are indexed.
userSchema.index({ emailVerificationToken: 1 }, { sparse: true });

// ---------- Hooks ----------

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, BCRYPT_ROUNDS);

  // Subtract 1s so a token issued right after the change is not rejected.
  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

/**
 * Safety net: update queries skip the pre('save') hook above, so a call such as
 *   User.findByIdAndUpdate(id, { password: 'newpass' })
 * would store the password in PLAINTEXT and never set passwordChangedAt.
 * Reject those calls loudly. Always change passwords with document.save().
 *
 * NOTE: Model.insertMany() and Model.bulkWrite() also bypass save hooks and
 * cannot be guarded here. Never use them to write users with passwords.
 */
const PASSWORD_BYPASS_OPS = [
  'updateOne',
  'updateMany',
  'findOneAndUpdate',
  'replaceOne',
  'findOneAndReplace',
];

const updateTouchesPassword = (update) => {
  if (!update) return false;
  if (Array.isArray(update)) return update.some(updateTouchesPassword); // aggregation pipeline
  if (typeof update !== 'object') return false;
  return (
    'password' in update ||
    Object.values(update).some((value) => value && typeof value === 'object' && 'password' in value)
  );
};

userSchema.pre(PASSWORD_BYPASS_OPS, function () {
  if (updateTouchesPassword(this.getUpdate())) {
    throw new Error('Passwords must be changed with document.save() so they are hashed');
  }
});

// ---------- Instance methods ----------

// Requires the document to be loaded with .select('+password').
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password || typeof candidatePassword !== 'string') {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Returns the RAW token (send by email); stores only its hash.
// Caller must call user.save() afterwards.
userSchema.methods.createEmailVerificationToken = function () {
  const rawToken = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = hashToken(rawToken);
  this.emailVerificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);
  this.lastVerificationResend = new Date();

  return rawToken;
};

// Call after a successful verification, then save.
userSchema.methods.markEmailVerified = function () {
  this.isVerified = true;
  this.emailVerificationToken = undefined;
  this.emailVerificationExpires = undefined;
  this.lastVerificationResend = undefined;
};

// jwtIssuedAt is the JWT "iat" claim, in seconds.
// Requires the document to be loaded with .select('+passwordChangedAt').
// Granularity is one second, so a token issued in the same second as the change
// is still accepted.
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return Math.floor(this.passwordChangedAt.getTime() / 1000) > jwtIssuedAt;
};

// ---------- Static helpers ----------

// Look up a user by the raw token from the email link.
userSchema.statics.findByVerificationToken = function (rawToken) {
  return this.findOne({
    emailVerificationToken: hashToken(String(rawToken)),
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');
};

// ---------- Serialization ----------

const sanitize = (doc, ret) => {
  ret.id = ret._id;
  delete ret._id;
  delete ret.password;
  delete ret.emailVerificationToken;
  delete ret.emailVerificationExpires;
  delete ret.lastVerificationResend;
  delete ret.passwordChangedAt;
  return ret;
};

userSchema.set('toJSON', { transform: sanitize });
userSchema.set('toObject', { transform: sanitize });

// Reuse the existing model if the file is loaded twice (tests, hot reload).
module.exports = mongoose.models.User || mongoose.model('User', userSchema);