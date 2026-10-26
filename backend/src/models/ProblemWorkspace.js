const mongoose = require('mongoose');

// Keep in sync with the number of stages in the frontend workspace.
const MIN_STAGE = 1;
const MAX_STAGE = 11;

const isValidStage = (value) =>
  Number.isInteger(value) && value >= MIN_STAGE && value <= MAX_STAGE;

const stageField = {
  type: Number,
  min: [MIN_STAGE, `Stage must be at least ${MIN_STAGE}`],
  max: [MAX_STAGE, `Stage cannot exceed ${MAX_STAGE}`],
  validate: {
    validator: Number.isInteger,
    message: 'Stage must be an integer',
  },
};

const problemWorkspaceSchema = new mongoose.Schema(
  {
    // References Problem._id (ObjectId), NOT the public slug (Problem.problemId).
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
    currentStage: {
      ...stageField,
      default: MIN_STAGE,
    },
    completedStages: {
      type: [stageField],
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

// One workspace per user per problem. Also serves problemId-prefix lookups.
problemWorkspaceSchema.index({ problemId: 1, userId: 1 }, { unique: true });
// "My workspaces" / continue-where-you-left-off queries.
problemWorkspaceSchema.index({ userId: 1, lastVisitedAt: -1 });

// ---------- Hooks ----------

// Keep completedStages unique and sorted.
problemWorkspaceSchema.pre('validate', function () {
  if (this.isModified('completedStages')) {
    this.completedStages = [...new Set(this.completedStages)].sort((a, b) => a - b);
  }
});

// ---------- Statics ----------

// Atomic upsert: safe under concurrent requests (no duplicate-key race).
// Pass ObjectIds (or valid id strings) for userId and problemId.
problemWorkspaceSchema.statics.saveProgress = function (
  userId,
  problemId,
  { currentStage, completedStage } = {}
) {
  if (currentStage !== undefined && !isValidStage(currentStage)) {
    throw new RangeError(`currentStage must be an integer from ${MIN_STAGE} to ${MAX_STAGE}`);
  }
  if (completedStage !== undefined && !isValidStage(completedStage)) {
    throw new RangeError(`completedStage must be an integer from ${MIN_STAGE} to ${MAX_STAGE}`);
  }

  const update = {
    $set: { lastVisitedAt: new Date() },
    $setOnInsert: {},
  };

  if (currentStage !== undefined) update.$set.currentStage = currentStage;
  if (completedStage !== undefined) {
    update.$addToSet = { completedStages: completedStage };
  } else {
    update.$setOnInsert.completedStages = [];
  }
  if (currentStage === undefined) update.$setOnInsert.currentStage = MIN_STAGE;

  return this.findOneAndUpdate({ userId, problemId }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });
};

// ---------- Serialization ----------

problemWorkspaceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ProblemWorkspace ||
  mongoose.model('ProblemWorkspace', problemWorkspaceSchema);

module.exports.MIN_STAGE = MIN_STAGE;
module.exports.MAX_STAGE = MAX_STAGE;