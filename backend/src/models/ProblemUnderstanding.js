const mongoose = require('mongoose');

const MAX_TEXT = 5000; // AI output is untrusted: always cap it
const MAX_LIST_ITEMS = 50;

const isGenerated = function () {
  return this.generationStatus === 'generated';
};

const limitArray = (max, label) => ({
  validator: (value) => !value || value.length <= max,
  message: `${label} cannot contain more than ${max} items`,
});

const explanationField = (label) => ({
  type: String,
  trim: true,
  maxlength: [MAX_TEXT, `${label} cannot exceed ${MAX_TEXT} characters`],
  // Failed generations are stored without content, so only require it on success.
  required: [isGenerated, `${label} is required`],
});

const stringList = (label, maxItemLength = 1000) => ({
  type: [{ type: String, trim: true, maxlength: maxItemLength }],
  validate: limitArray(MAX_LIST_ITEMS, label),
});

const testCaseExplanationSchema = new mongoose.Schema(
  {
    testCaseId: { type: Number, required: true },
    explanation: {
      type: String,
      required: true,
      trim: true,
      maxlength: MAX_TEXT,
    },
  },
  { _id: false }
);

const problemUnderstandingSchema = new mongoose.Schema(
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
    objectiveExplanation: explanationField('Objective explanation'),
    inputExplanation: explanationField('Input explanation'),
    outputExplanation: explanationField('Output explanation'),
    inputToOutputFlow: explanationField('Input-to-output flow explanation'),
    testCaseExplanations: {
      type: [testCaseExplanationSchema],
      validate: [
        limitArray(100, 'Test case explanations'),
        {
          validator: (items) => {
            const ids = (items || []).map((i) => i.testCaseId);
            return new Set(ids).size === ids.length;
          },
          message: 'Test case explanation ids must be unique',
        },
      ],
    },
    commonMisunderstandings: stringList('Common misunderstandings'),
    edgeCaseInsights: stringList('Edge case insights'),
    sourceProblemVersion: {
      problemObjectId: { type: String },
      problemId: { type: String },
      title: { type: String, maxlength: 200 },
      updatedAt: { type: Date },
    },
    // Hash of the problem content used for generation; detects stale output.
    sourceProblemHash: {
      type: String,
      maxlength: 128,
    },
    generatedBy: {
      type: String,
      enum: ['gemini'],
      default: 'gemini',
    },
    model: {
      type: String,
      default: null,
      maxlength: 100,
    },
    promptVersion: {
      type: String,
      default: 'understanding-v1',
      maxlength: 50,
    },
    generationStatus: {
      type: String,
      enum: ['generated', 'failed'],
      default: 'generated',
    },
    // Short, sanitized reason for a failed generation. Never store raw API errors or keys.
    failureReason: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One Stage 02 document per user per problem. Also serves problemId-prefix lookups.
problemUnderstandingSchema.index({ problemId: 1, userId: 1 }, { unique: true });
// "My understandings" listing.
problemUnderstandingSchema.index({ userId: 1, updatedAt: -1 });

// True if the stored output no longer matches the current problem or prompt.
problemUnderstandingSchema.methods.isStale = function (currentHash, currentPromptVersion) {
  return (
    this.generationStatus !== 'generated' ||
    this.sourceProblemHash !== currentHash ||
    (currentPromptVersion !== undefined && this.promptVersion !== currentPromptVersion)
  );
};

problemUnderstandingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ProblemUnderstanding ||
  mongoose.model('ProblemUnderstanding', problemUnderstandingSchema);