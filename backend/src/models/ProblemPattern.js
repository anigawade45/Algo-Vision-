const mongoose = require('mongoose');

const problemPatternSchema = new mongoose.Schema(
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
    intro: {
      eyebrow: { type: String, default: '04 · PATTERN', trim: true },
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
    },
    structure: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      inputLabel: { type: String, required: true, trim: true },
      inputVisual: [{ type: String, trim: true }],
      targetLabel: { type: String, required: true, trim: true },
      targetValue: { type: String, required: true, trim: true },
      coreRelationship: [
        {
          label: { type: String, required: true, trim: true },
          sub: { type: String, required: true, trim: true },
        },
      ],
    },
    signals: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      observations: [
        {
          id: { type: String, required: true, trim: true },
          title: { type: String, required: true, trim: true },
          label: { type: String, required: true, trim: true },
          detail: { type: String, required: true, trim: true },
        },
      ],
    },
    abstraction: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      concrete: {
        items: [{ type: String, trim: true }],
        target: { type: String, trim: true },
      },
      abstractFormula: {
        varA: { type: String, trim: true },
        operator: { type: String, trim: true },
        varB: { type: String, trim: true },
        equals: { type: String, trim: true },
        result: { type: String, trim: true },
      },
      statement: { type: String, required: true, trim: true },
    },
    pattern: {
      name: { type: String, required: true, trim: true },
      tagline: { type: String, required: true, trim: true },
      description: { type: String, required: true, trim: true },
    },
    fingerprint: {
      title: { type: String, default: 'Pattern Fingerprint', trim: true },
      steps: [
        {
          stage: { type: String, required: true, trim: true },
          value: { type: String, required: true, trim: true },
        },
      ],
    },
    solutionFamilies: {
      title: { type: String, required: true, trim: true },
      subtitle: { type: String, required: true, trim: true },
      question: { type: String, required: true, trim: true },
      families: [
        {
          id: { type: String, required: true, trim: true },
          name: { type: String, required: true, trim: true },
          detail: { type: String, required: true, trim: true },
        },
      ],
      note: { type: String, trim: true },
    },
    limitations: {
      title: { type: String, default: 'What the Pattern Does NOT Tell Us', trim: true },
      subtitle: { type: String, trim: true },
      tellsUs: [{ type: String, trim: true }],
      doesNotTellUs: [{ type: String, trim: true }],
    },
    recognitionCheck: {
      question: { type: String, trim: true },
      options: [
        {
          id: { type: String, trim: true },
          text: { type: String, trim: true },
          isCorrect: { type: Boolean, default: false },
          feedback: { type: String, trim: true },
        },
      ],
    },
    takeaway: {
      specificProblem: { type: String, trim: true },
      generalPattern: { type: String, trim: true },
      finalStatement: { type: String, trim: true },
    },
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
      default: 'pattern-v1',
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

// Enforce unique Stage 04 pattern document per problem per user
problemPatternSchema.index(
  { problemId: 1, userId: 1 },
  { unique: true }
);

problemPatternSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret.__v;
    return ret;
  },
});

const ProblemPattern = mongoose.model(
  'ProblemPattern',
  problemPatternSchema
);

module.exports = ProblemPattern;
