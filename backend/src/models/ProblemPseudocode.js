const mongoose = require('mongoose');

const pseudocodeLineSchema = new mongoose.Schema(
  {
    line: {
      type: Number,
      required: [true, 'Line number is required'],
    },
    type: {
      type: String,
      enum: [
        'start',
        'instruction',
        'loop',
        'condition',
        'return',
        'end',
        'comment',
        'initialization',
        'operation',
        'update',
        'call',
      ],
      default: 'instruction',
    },
    text: {
      type: String,
      required: [true, 'Line text is required'],
      trim: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    indent: {
      type: Boolean,
      default: false,
    },
    indentLevel: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const walkthroughStepSchema = new mongoose.Schema(
  {
    stepNo: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    why: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const decisionPointSchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    yes: {
      type: String,
      required: true,
      trim: true,
    },
    no: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const problemPseudocodeSchema = new mongoose.Schema(
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
    approachContext: {
      type: String,
      default: 'This is the approach selected in Stage 04 (Pattern).',
      trim: true,
    },
    intro: {
      eyebrow: {
        type: String,
        default: '06 · PSEUDOCODE',
        trim: true,
      },
      title: {
        type: String,
        default: 'Turn the chosen algorithm into clear, step-by-step logic.',
        trim: true,
      },
      subtitle: {
        type: String,
        default: 'Before writing code, describe exactly what the algorithm needs to do.',
        trim: true,
      },
    },
    lines: [pseudocodeLineSchema],
    walkthrough: [walkthroughStepSchema],
    decisions: [decisionPointSchema],
    takeaway: {
      statement: {
        type: String,
        default: 'Your algorithm is now expressed as language-independent steps.',
        trim: true,
      },
      subtitle: {
        type: String,
        default: 'The algorithm defines the approach. Pseudocode turns that approach into precise steps. The next stage translates those steps into code.',
        trim: true,
      },
    },
    sourceProblemHash: {
      type: String,
      required: [true, 'Source problem hash is required'],
    },
    sourcePatternHash: {
      type: String,
      required: [true, 'Source pattern hash is required'],
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
      default: 'pseudocode-v1',
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

// Compound Unique Index: One pseudocode document per (problemId + userId + approachId)
problemPseudocodeSchema.index(
  {
    problemId: 1,
    userId: 1,
    approachId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model('ProblemPseudocode', problemPseudocodeSchema);
