const mongoose = require('mongoose');

const { Mixed } = mongoose.Schema.Types;

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TEST_CASES = 8;
const MAX_LIST_ITEMS = 50;

const limitArray = (max, label) => ({
  validator: (value) => !value || value.length <= max,
  message: `${label} cannot contain more than ${max} items`,
});

const testCaseSchema = new mongoose.Schema(
  {
    id: { type: Number },
    inputRaw: { type: String, required: true, maxlength: 20000 },
    outputRaw: { type: String, required: true, maxlength: 20000 },
    inputStructured: { type: Mixed },
    outputStructured: { type: Mixed },
    reasoning: {
      type: [{ type: String, maxlength: 2000 }],
      validate: limitArray(MAX_LIST_ITEMS, 'Reasoning'),
    },
    interaction: { type: Mixed },
  },
  { _id: false }
);

const observationSchema = new mongoose.Schema(
  {
    stepNo: { type: String, trim: true, maxlength: 20 },
    title: { type: String, trim: true, maxlength: 200 },
    detail: { type: String, trim: true, maxlength: 5000 },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    problemId: {
      type: String,
      required: [true, 'Problem ID / Slug is required'],
      unique: true, // creates the index; do not also set index: true
      trim: true,
      lowercase: true,
      maxlength: [100, 'Problem ID cannot exceed 100 characters'],
      match: [SLUG_REGEX, 'Problem ID must be a lowercase slug (letters, numbers, hyphens)'],
    },
    title: {
      type: String,
      required: [true, 'Problem title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Problem category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
    difficulty: {
      type: String,
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: 'Difficulty must be Easy, Medium or Hard',
      },
      required: [true, 'Difficulty level is required'],
    },
    objective: {
      type: String,
      required: [true, 'Objective is required'],
      trim: true,
      maxlength: 2000,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 20000,
    },
    constraints: {
      type: [{ type: String, trim: true, maxlength: 500 }],
      validate: limitArray(MAX_LIST_ITEMS, 'Constraints'),
    },
    inputData: {
      type: Mixed,
      required: [true, 'Input data is required'],
    },
    outputData: {
      type: Mixed,
      required: [true, 'Output data is required'],
    },
    testCases: {
      type: [testCaseSchema],
      validate: [
        limitArray(MAX_TEST_CASES, 'Test cases'),
        {
          validator: (cases) => {
            const ids = (cases || [])
              .map((c) => c.id)
              .filter((id) => id !== undefined && id !== null);
            return new Set(ids).size === ids.length;
          },
          message: 'Test case ids must be unique within a problem',
        },
      ],
    },
    // Stored so list endpoints can exclude testCases and still show the count.
    testCaseCount: {
      type: Number,
      default: 0,
    },
    observations: {
      type: [observationSchema],
      validate: limitArray(MAX_LIST_ITEMS, 'Observations'),
    },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 40 }],
      validate: limitArray(MAX_LIST_ITEMS, 'Tags'),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

// ---------- Indexes (match real query patterns; avoid redundant single-field ones) ----------

// Public listing with filters: GET /problems?category=&difficulty=
problemSchema.index({ isPublished: 1, category: 1, difficulty: 1, createdAt: -1 });
// Owner/admin listing
problemSchema.index({ createdBy: 1, createdAt: -1 });
// Search
problemSchema.index(
  { title: 'text', tags: 'text' },
  { weights: { title: 5, tags: 2 } }
);

// ---------- Hooks ----------

// Keeps testCaseCount in sync on create/save.
// NOTE: findOneAndUpdate/updateOne bypass this; use doc.save() or set the count yourself.
problemSchema.pre('validate', function () {
  this.testCaseCount = this.testCases ? this.testCases.length : 0;
});

// ---------- Serialization ----------

problemSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret.problemId || ret._id; // frontend identifies problems by slug
    ret.slug = ret.problemId;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Problem || mongoose.model('Problem', problemSchema);