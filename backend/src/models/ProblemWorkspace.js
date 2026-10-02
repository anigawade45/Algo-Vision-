const mongoose = require('mongoose');

const problemWorkspaceSchema = new mongoose.Schema(
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
    currentStage: {
      type: Number,
      default: 1,
      min: 1,
      max: 11,
    },
    completedStages: {
      type: [Number],
      default: [],
    },
    lastVisitedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique workspace state per problem per user
problemWorkspaceSchema.index(
  { problemId: 1, userId: 1 },
  { unique: true }
);

problemWorkspaceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProblemWorkspace = mongoose.model('ProblemWorkspace', problemWorkspaceSchema);

module.exports = ProblemWorkspace;
