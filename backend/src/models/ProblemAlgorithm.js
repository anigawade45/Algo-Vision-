const mongoose = require('mongoose');

const MAX_RAW_TEXT = 30000; // AI output is untrusted: always cap it
const PENDING_TIMEOUT_MS = 2 * 60 * 1000; // a pending run older than this is considered stuck
const APPROACH_ID_REGEX = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

const requiredWhenGenerated = function () {
  return this.generationStatus === 'generated';
};

const problemAlgorithmSchema = new mongoose.Schema(
  {
    // References Problem._id (ObjectId), NOT the public slug.
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    approachId: {
      type: String,
      default: 'default',
      trim: true,
      lowercase: true,
      maxlength: [50, 'Approach ID cannot exceed 50 characters'],
      match: [APPROACH_ID_REGEX, 'Approach ID may only contain letters, numbers, hyphens and underscores'],
    },
    // Empty while pending or failed, so only required once generation succeeded.
    rawText: {
      type: String,
      required: [requiredWhenGenerated, 'Generated algorithm text is required'],
      maxlength: [MAX_RAW_TEXT, `Algorithm text cannot exceed ${MAX_RAW_TEXT} characters`],
    },
    sourceProblemVersion: {
      problemObjectId: { type: String },
      problemId: { type: String },
      title: { type: String, maxlength: 200 },
      updatedAt: { type: Date },
    },
    // Hash of the problem content used for generation; detects stale output.
    sourceProblemHash: {
      type: String,
      required: [true, 'Source problem hash is required'],
      maxlength: 128,
    },
    generatedBy: {
      type: String,
      enum: ['gemini'],
      default: 'gemini',
    },
    model: {
      type: String,
      maxlength: 100,
    },
    promptVersion: {
      type: String,
      default: 'algorithm-v1',
      maxlength: 50,
    },
    generationStatus: {
      type: String,
      enum: ['pending', 'generated', 'failed'],
      default: 'pending',
    },
    // Short, sanitized reason for a failed generation. Never store raw API errors or keys.
    failureReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    generatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// One document per user per problem per approach.
problemAlgorithmSchema.index({ problemId: 1, userId: 1, approachId: 1 }, { unique: true });
// "My algorithms" listing.
problemAlgorithmSchema.index({ userId: 1, updatedAt: -1 });

// A 'pending' document acts as a generation lock. If the server crashed mid-call
// it would stay pending forever, so treat old pending documents as stuck.
problemAlgorithmSchema.methods.isGenerationStuck = function () {
  return (
    this.generationStatus === 'pending' &&
    Date.now() - this.updatedAt.getTime() > PENDING_TIMEOUT_MS
  );
};

// True if the stored output no longer matches the current problem or prompt.
problemAlgorithmSchema.methods.isStale = function (currentHash, currentPromptVersion) {
  return (
    this.generationStatus !== 'generated' ||
    this.sourceProblemHash !== currentHash ||
    (currentPromptVersion !== undefined && this.promptVersion !== currentPromptVersion)
  );
};

problemAlgorithmSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ProblemAlgorithm ||
  mongoose.model('ProblemAlgorithm', problemAlgorithmSchema);

module.exports.PENDING_TIMEOUT_MS = PENDING_TIMEOUT_MS;