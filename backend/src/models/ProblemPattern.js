const mongoose = require('mongoose');

const MAX_SHORT = 200;
const MAX_MEDIUM = 1000;
const MAX_LONG = 5000; // AI output is untrusted: always cap it
const MAX_ITEMS = 30;

// `this` is the root document for plain nested paths, but the subdocument for
// array items, so resolve the owning document before reading generationStatus.
const isGenerated = function () {
  const root = typeof this.ownerDocument === 'function' ? this.ownerDocument() : this;
  return root.generationStatus === 'generated';
};

// Required only on successful generation, so a 'failed' document can be saved empty.
const text = (label, maxlength = MAX_MEDIUM, { required = true, defaultValue } = {}) => {
  const field = {
    type: String,
    trim: true,
    maxlength: [maxlength, `${label} cannot exceed ${maxlength} characters`],
  };
  if (required) field.required = [isGenerated, `${label} is required`];
  if (defaultValue !== undefined) field.default = defaultValue;
  return field;
};

const list = (label, maxItemLength = MAX_MEDIUM) => ({
  type: [{ type: String, trim: true, maxlength: maxItemLength }],
  validate: {
    validator: (value) => !value || value.length <= MAX_ITEMS,
    message: `${label} cannot contain more than ${MAX_ITEMS} items`,
  },
});

// Array of subdocuments without auto-generated _id and with a size cap.
const subList = (fields, label) => ({
  type: [new mongoose.Schema(fields, { _id: false })],
  validate: {
    validator: (value) => !value || value.length <= MAX_ITEMS,
    message: `${label} cannot contain more than ${MAX_ITEMS} items`,
  },
});

const hasUniqueIds = (items) => {
  const ids = (items || []).map((item) => item.id).filter(Boolean);
  return new Set(ids).size === ids.length;
};

const problemPatternSchema = new mongoose.Schema(
  {
    // References Problem._id (ObjectId), NOT the public slug.
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
    intro: {
      eyebrow: text('Intro eyebrow', MAX_SHORT, { required: false, defaultValue: '04 · PATTERN' }),
      title: text('Intro title', MAX_SHORT),
      subtitle: text('Intro subtitle'),
    },
    structure: {
      title: text('Structure title', MAX_SHORT),
      subtitle: text('Structure subtitle'),
      inputLabel: text('Input label', MAX_SHORT),
      inputVisual: list('Input visual', MAX_SHORT),
      targetLabel: text('Target label', MAX_SHORT),
      targetValue: text('Target value', MAX_SHORT),
      coreRelationship: subList(
        {
          label: text('Relationship label', MAX_SHORT),
          sub: text('Relationship detail'),
        },
        'Core relationships'
      ),
    },
    signals: {
      title: text('Signals title', MAX_SHORT),
      subtitle: text('Signals subtitle'),
      observations: {
        ...subList(
          {
            id: text('Observation id', 50),
            title: text('Observation title', MAX_SHORT),
            label: text('Observation label', MAX_SHORT),
            detail: text('Observation detail', MAX_LONG),
          },
          'Observations'
        ),
        validate: [
          {
            validator: (value) => !value || value.length <= MAX_ITEMS,
            message: `Observations cannot contain more than ${MAX_ITEMS} items`,
          },
          { validator: hasUniqueIds, message: 'Observation ids must be unique' },
        ],
      },
    },
    abstraction: {
      title: text('Abstraction title', MAX_SHORT),
      subtitle: text('Abstraction subtitle'),
      concrete: {
        items: list('Concrete items', MAX_SHORT),
        target: text('Concrete target', MAX_SHORT, { required: false }),
      },
      abstractFormula: {
        varA: text('Formula varA', MAX_SHORT, { required: false }),
        operator: text('Formula operator', 50, { required: false }),
        varB: text('Formula varB', MAX_SHORT, { required: false }),
        equals: text('Formula equals', 50, { required: false }),
        result: text('Formula result', MAX_SHORT, { required: false }),
      },
      statement: text('Abstraction statement', MAX_LONG),
    },
    pattern: {
      name: text('Pattern name', MAX_SHORT),
      tagline: text('Pattern tagline'),
      description: text('Pattern description', MAX_LONG),
    },
    fingerprint: {
      title: text('Fingerprint title', MAX_SHORT, {
        required: false,
        defaultValue: 'Pattern Fingerprint',
      }),
      steps: subList(
        {
          stage: text('Fingerprint stage', MAX_SHORT),
          value: text('Fingerprint value'),
        },
        'Fingerprint steps'
      ),
    },
    solutionFamilies: {
      title: text('Solution families title', MAX_SHORT),
      subtitle: text('Solution families subtitle'),
      question: text('Solution families question'),
      families: {
        ...subList(
          {
            id: text('Family id', 50),
            name: text('Family name', MAX_SHORT),
            detail: text('Family detail', MAX_LONG),
          },
          'Solution families'
        ),
        validate: [
          {
            validator: (value) => !value || value.length <= MAX_ITEMS,
            message: `Solution families cannot contain more than ${MAX_ITEMS} items`,
          },
          { validator: hasUniqueIds, message: 'Solution family ids must be unique' },
        ],
      },
      note: text('Solution families note', MAX_LONG, { required: false }),
    },
    limitations: {
      title: text('Limitations title', MAX_SHORT, {
        required: false,
        defaultValue: 'What the Pattern Does NOT Tell Us',
      }),
      subtitle: text('Limitations subtitle', MAX_MEDIUM, { required: false }),
      tellsUs: list('Tells us'),
      doesNotTellUs: list('Does not tell us'),
    },
    recognitionCheck: {
      question: text('Recognition question', MAX_MEDIUM, { required: false }),
      options: {
        ...subList(
          {
            id: text('Option id', 50, { required: false }),
            text: text('Option text', MAX_MEDIUM, { required: false }),
            isCorrect: { type: Boolean, default: false },
            feedback: text('Option feedback', MAX_MEDIUM, { required: false }),
          },
          'Recognition options'
        ),
        validate: [
          {
            validator: (value) => !value || value.length <= 10,
            message: 'Recognition check cannot have more than 10 options',
          },
          {
            validator: (options) =>
              !options || options.length === 0 || options.filter((o) => o.isCorrect).length === 1,
            message: 'Recognition check must have exactly one correct option',
          },
        ],
      },
    },
    takeaway: {
      specificProblem: text('Takeaway specific problem', MAX_LONG, { required: false }),
      generalPattern: text('Takeaway general pattern', MAX_LONG, { required: false }),
      finalStatement: text('Takeaway final statement', MAX_LONG, { required: false }),
    },
    sourceProblemVersion: {
      problemObjectId: { type: String },
      problemId: { type: String },
      title: { type: String, maxlength: 200 },
      updatedAt: { type: Date },
    },
    // Hash of the problem content used for generation; detects stale output.
    sourceProblemHash: {
      type: String,
      maxlength: 128,
    },
    generatedBy: {
      type: String,
      enum: ['gemini'],
      default: 'gemini',
    },
    model: {
      type: String,
      default: null,
      maxlength: 100,
    },
    promptVersion: {
      type: String,
      default: 'pattern-v1',
      maxlength: 50,
    },
    generationStatus: {
      type: String,
      enum: ['generated', 'failed'],
      default: 'generated',
    },
    // Short, sanitized reason for a failed generation. Never store raw API errors or keys.
    failureReason: {
      type: String,
      trim: true,
      maxlength: 300,
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

// One Stage 04 document per user per problem. Also serves problemId-prefix lookups.
problemPatternSchema.index({ problemId: 1, userId: 1 }, { unique: true });
// "My patterns" listing.
problemPatternSchema.index({ userId: 1, updatedAt: -1 });

// True if the stored output no longer matches the current problem or prompt.
problemPatternSchema.methods.isStale = function (currentHash, currentPromptVersion) {
  return (
    this.generationStatus !== 'generated' ||
    this.sourceProblemHash !== currentHash ||
    (currentPromptVersion !== undefined && this.promptVersion !== currentPromptVersion)
  );
};

problemPatternSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports =
  mongoose.models.ProblemPattern ||
  mongoose.model('ProblemPattern', problemPatternSchema);