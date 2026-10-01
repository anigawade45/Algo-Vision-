const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema(
  {
    id: { type: Number },
    inputRaw: { type: String, required: true },
    outputRaw: { type: String, required: true },
    inputStructured: { type: mongoose.Schema.Types.Mixed },
    outputStructured: { type: mongoose.Schema.Types.Mixed },
    reasoning: [{ type: String }],
    interaction: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const observationSchema = new mongoose.Schema(
  {
    stepNo: { type: String },
    title: { type: String },
    detail: { type: String },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: [true, 'Problem ID / Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Problem category is required'],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      required: [true, 'Difficulty level is required'],
      index: true,
    },
    objective: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    constraints: [{ type: String }],
    inputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    outputData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    testCases: [testCaseSchema],
    observations: [observationSchema],
    tags: [{ type: String }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

problemSchema.index({ createdBy: 1, createdAt: -1 });

problemSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.problemId || ret._id;
    ret.slug = ret.problemId;
    ret.testCaseCount = ret.testCases ? ret.testCases.length : 0;
    delete ret.__v;
    return ret;
  },
});

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
