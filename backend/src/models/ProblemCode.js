const mongoose = require('mongoose');

const problemCodeSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // null means it's a global/system generation
  },
  approachId: {
    type: String,
    required: true,
  },
  approachName: {
    type: String,
  },
  intro: {
    eyebrow: String,
    title: String,
    subtitle: String,
  },
  cpp: {
    type: String,
    default: '',
  },
  java: {
    type: String,
    default: '',
  },
  python: {
    type: String,
    default: '',
  },
  sourceProblemHash: {
    type: String,
    required: true,
  },
  sourcePatternHash: {
    type: String,
    required: true,
  },
  sourcePseudocodeHash: {
    type: String,
    required: true,
  },
  generatedBy: {
    type: String,
    enum: ['system', 'gemini', 'user'],
    default: 'gemini',
  },
  model: {
    type: String,
  },
  promptVersion: {
    type: String,
  },
  generationStatus: {
    type: String,
    enum: ['pending', 'generating', 'generated', 'failed'],
    default: 'generated',
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Ensure uniqueness per problem + user + approach
problemCodeSchema.index({ problemId: 1, userId: 1, approachId: 1 }, { unique: true });

module.exports = mongoose.model('ProblemCode', problemCodeSchema);
