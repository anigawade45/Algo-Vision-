const mongoose = require('mongoose');

const problemAnalogySchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: [true, 'Problem reference is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    intro: {
      title: {
        type: String,
        required: [true, 'Intro title is required'],
        trim: true,
      },
      subtitle: {
        type: String,
        required: [true, 'Intro subtitle is required'],
        trim: true,
      },
    },
    scenario: {
      title: {
        type: String,
        required: [true, 'Scenario title is required'],
        trim: true,
      },
      story: {
        type: String,
        required: [true, 'Scenario story is required'],
        trim: true,
      },
    },
    sourceProblemVersion: {
      problemObjectId: { type: String },
      problemId: { type: String },
      title: { type: String },
      updatedAt: { type: Date },
    },
    sourceProblemHash: {
      type: String,
      index: true,
    },
    generatedBy: {
      type: String,
      enum: ['gemini'],
      default: 'gemini',
    },
    model: {
      type: String,
      default: null,
    },
    promptVersion: {
      type: String,
      default: 'analogy-v1',
    },
    generationStatus: {
      type: String,
      enum: ['generated', 'failed'],
      default: 'generated',
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

// Enforce unique Stage 03 analogy document per problem per user
problemAnalogySchema.index(
  { problemId: 1, userId: 1 },
  { unique: true }
);

problemAnalogySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProblemAnalogy = mongoose.model(
  'ProblemAnalogy',
  problemAnalogySchema
);

module.exports = ProblemAnalogy;
