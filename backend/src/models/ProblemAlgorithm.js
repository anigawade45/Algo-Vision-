const mongoose = require('mongoose');

const problemAlgorithmSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approachId: {
      type: String,
      default: 'default',
    },
    rawText: {
      type: String,
      required: true,
    },
    sourceProblemVersion: {
      problemObjectId: String,
      problemId: String,
      title: String,
      updatedAt: Date,
    },
    sourceProblemHash: {
      type: String,
      required: true,
    },
    generatedBy: {
      type: String,
      default: 'gemini',
    },
    model: String,
    promptVersion: String,
    generationStatus: {
      type: String,
      enum: ['pending', 'generated', 'failed'],
      default: 'pending',
    },
    generatedAt: Date,
  },
  {
    timestamps: true,
  }
);

problemAlgorithmSchema.index({ problemId: 1, userId: 1, approachId: 1 }, { unique: true });

const ProblemAlgorithm = mongoose.model('ProblemAlgorithm', problemAlgorithmSchema);

module.exports = ProblemAlgorithm;
