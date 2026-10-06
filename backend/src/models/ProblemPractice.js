const mongoose = require('mongoose');

const practiceQuestionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    questionNumber: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    question: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    correctAnswer: { type: Number, required: true }, // 0 for A, 1 for B, 2 for C, 3 for D
    explanation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const problemPracticeSchema = new mongoose.Schema(
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
    approachId: {
      type: String,
      required: [true, 'Approach identifier is required'],
      trim: true,
    },
    approachName: {
      type: String,
      required: [true, 'Approach name is required'],
      trim: true,
    },
    questions: [practiceQuestionSchema],
    totalQuestions: {
      type: Number,
      default: 10,
    },
    sourceProblemHash: {
      type: String,
      required: true,
    },
    sourcePatternHash: {
      type: String,
      default: '',
    },
    sourceAlgorithmHash: {
      type: String,
      default: '',
    },
    sourcePseudocodeHash: {
      type: String,
      default: '',
    },
    sourceCodeHash: {
      type: String,
      default: '',
    },
    sourceDryRunHash: {
      type: String,
      default: '',
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
      default: 'practice-v1',
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

// Unique Compound Index: One practice quiz per (problemId + userId + approachId)
problemPracticeSchema.index(
  {
    problemId: 1,
    userId: 1,
    approachId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model('ProblemPractice', problemPracticeSchema);
