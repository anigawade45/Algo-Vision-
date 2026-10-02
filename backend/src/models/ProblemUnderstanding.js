const mongoose = require('mongoose');

const problemUnderstandingSchema = new mongoose.Schema(
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
    objectiveExplanation: {
      type: String,
      required: [true, 'Objective explanation is required'],
      trim: true,
    },
    inputExplanation: {
      type: String,
      required: [true, 'Input explanation is required'],
      trim: true,
    },
    outputExplanation: {
      type: String,
      required: [true, 'Output explanation is required'],
      trim: true,
    },
    inputToOutputFlow: {
      type: String,
      required: [true, 'Input-to-output flow explanation is required'],
      trim: true,
    },
    testCaseExplanations: [
      {
        testCaseId: {
          type: Number,
          required: true,
        },
        explanation: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    commonMisunderstandings: [
      {
        type: String,
        trim: true,
      },
    ],
    edgeCaseInsights: [
      {
        type: String,
        trim: true,
      },
    ],
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
      default: 'understanding-v1',
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

// Enforce unique Stage 02 understanding document per problem per user
problemUnderstandingSchema.index(
  { problemId: 1, userId: 1 },
  { unique: true }
);

problemUnderstandingSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProblemUnderstanding = mongoose.model(
  'ProblemUnderstanding',
  problemUnderstandingSchema
);

module.exports = ProblemUnderstanding;
