const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, default: '' },
  calculation: { type: String, default: '' },
  action: { type: String, default: '' }
}, { _id: false });

const problemComplexitySchema = new mongoose.Schema({
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
    required: true,
  },
  approachName: {
    type: String,
    required: true,
  },
  time: {
    complexity: { type: String, required: true },
    steps: [stepSchema]
  },
  space: {
    complexity: { type: String, required: true },
    steps: [stepSchema]
  },
  sourceProblemHash: String,
  sourcePatternHash: String,
  sourceAlgorithmHash: String,
  sourcePseudocodeHash: String,
  sourceCodeHash: String,
  generatedBy: {
    type: String,
    enum: ['gemini', 'user', 'system'],
    default: 'gemini',
  },
  model: String,
  promptVersion: String,
  generationStatus: {
    type: String,
    enum: ['pending', 'generated', 'failed'],
    default: 'generated',
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

problemComplexitySchema.index({ problemId: 1, userId: 1, approachId: 1 }, { unique: true });

module.exports = mongoose.model('ProblemComplexity', problemComplexitySchema);
