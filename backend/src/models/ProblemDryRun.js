const mongoose = require('mongoose');

const dryRunVariableSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    label: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const dryRunStepSchema = new mongoose.Schema(
  {
    stepNo: { type: Number, required: true },
    pseudocodeLine: { type: Number, required: true },
    pseudocodeText: { type: String, required: true, trim: true },
    operation: { type: String, default: 'EXECUTE', trim: true },
    title: { type: String, default: '', trim: true },
    variables: [dryRunVariableSchema],
    before: { type: mongoose.Schema.Types.Mixed, default: {} },
    condition: {
      text: { type: String, default: '', trim: true },
      evaluation: { type: String, default: '', trim: true },
      passes: { type: Boolean, default: true },
    },
    action: {
      description: { type: String, required: true, trim: true },
    },
    after: { type: mongoose.Schema.Types.Mixed, default: {} },
    changes: [{ type: String, trim: true }],
    currentResult: { type: mongoose.Schema.Types.Mixed, default: '' },
    explanation: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const problemDryRunSchema = new mongoose.Schema(
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
    testCaseId: {
      type: Number,
      required: [true, 'Test case ID is required'],
      default: 1,
    },
    testCaseInput: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expectedOutput: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    input: {
      title: { type: String, default: '' },
      inputVisual: { type: String, default: '' },
      items: [
        {
          label: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      expectedOutput: { type: String, default: '' },
    },
    initialState: {
      subtitle: { type: String, default: 'Initial state before step 1 execution' },
      variables: [dryRunVariableSchema],
    },
    steps: [dryRunStepSchema],
    finalResult: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    executionSummary: {
      type: String,
      default: '',
      trim: true,
    },
    sourceProblemHash: {
      type: String,
      required: true,
    },
    sourcePatternHash: {
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
      default: 'dry-run-v1',
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

// Unique Compound Index: One trace per (problemId + userId + approachId + testCaseId)
problemDryRunSchema.index(
  {
    problemId: 1,
    userId: 1,
    approachId: 1,
    testCaseId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model('ProblemDryRun', problemDryRunSchema);
