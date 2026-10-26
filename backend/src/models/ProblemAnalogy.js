const mongoose = require('mongoose');

const MAX_TITLE = 200;
const MAX_SUBTITLE = 500;
const MAX_STORY = 8000; // AI output is untrusted: always cap it

const isGenerated = function () {
  return this.generationStatus === 'generated';
};

const textField = (label, maxlength) => ({
  type: String,
  trim: true,
  maxlength: [maxlength, `${label} cannot exceed ${maxlength} characters`],
  // Failed generations are stored without content, so only require it on success.
  required: [isGenerated, `${label} is required`],
});

const problemAnalogySchema = new mongoose.Schema(
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
    intro: {
      title: textField('Intro title', MAX_TITLE),
      subtitle: textField('Intro subtitle', MAX_SUBTITLE),
    },
    scenario: {
      title: textField('Scenario title', MAX_TITLE),
      story: textField('Scenario story', MAX_STORY),
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
      default: 'analogy-v1',
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

// One Stage 03 document per user per problem. Also serves problemId-prefix lookups.
problemAnalogySchema.index({ problemId: 1, userId: 1 }, { unique: true });
// "My analogies" listing.
problemAnalogySchema.index({ userId: 1, updatedAt: -1 });

// True if the stored output no longer matches the current problem or prompt.
problemAnalogySchema.methods.isStale = function (currentHash, currentPromptVersion) {
  return (
    this.generationStatus !== 'generated' ||
    this.sourceProblemHash !== currentHash ||
    (currentPromptVersion !== undefined && this.promptVersion !== currentPromptVersion)
  );
};

problemAnalogySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ProblemAnalogy ||
  mongoose.model('ProblemAnalogy', problemAnalogySchema);