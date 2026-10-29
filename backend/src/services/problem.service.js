const crypto = require('crypto');
const Problem = require('../models/Problem');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
 * Fetch all published DSA problems with optional category/difficulty filters, user ownership, and text search
 */
const getAllProblems = async ({ category, difficulty, search, createdBy } = {}) => {
  const query = { isPublished: true };

  if (createdBy) {
    query.createdBy = createdBy;
  }

  if (category && category.trim()) {
    const escapedCat = escapeRegex(category.trim());
    query.category = { $regex: new RegExp(`^${escapedCat}$`, 'i') };
  }

  if (difficulty && difficulty.trim()) {
    const escapedDiff = escapeRegex(difficulty.trim());
    query.difficulty = { $regex: new RegExp(`^${escapedDiff}$`, 'i') };
  }

  if (search && search.trim()) {
    const escapedSearch = escapeRegex(search.trim());
    const searchRegex = new RegExp(escapedSearch, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { category: searchRegex },
      { tags: searchRegex },
    ];
  }

  const problems = await Problem.find(query).sort({ createdAt: -1 });
  return problems;
};

/**
 * Fetch a single problem by problemId (slug) or MongoDB _id with access check
 */
const getProblemByIdOrSlug = async (idOrSlug, userId = null) => {
  if (!idOrSlug) {
    throw new AppError('Problem identifier is required', 400);
  }

  const idStr = String(idOrSlug).trim();
  const normalizedSlug = idStr.toLowerCase();

  let problem = await Problem.findOne({
    problemId: normalizedSlug,
  });

  if (!problem && /^[0-9a-fA-F]{24}$/.test(idStr)) {
    problem = await Problem.findById(idStr);
  }

  if (!problem) {
    throw new AppError(`Problem not found for identifier "${idOrSlug}"`, 404);
  }

  // Check ownership / public visibility
  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to view this private problem', 403);
  }

  return problem;
};

/**
 * Get problems created or contributed to by a specific user (deduplicated)
 */
const getMyProblems = async (userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problems = await Problem.find({
    $or: [{ createdBy: userId }, { contributors: userId }],
  }).sort({ createdAt: -1 });

  // Backend deduplication by fingerprint to prevent duplicate cards
  const seen = new Set();
  const uniqueProblems = [];

  for (const p of problems) {
    const key = p.fingerprint || generateProblemFingerprint(p.title, p.description) || String(p._id);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProblems.push(p);
    }
  }

  return uniqueProblems;
};

/**
 * Get distinct categories of published problems
 */
const getProblemCategories = async () => {
  const categories = await Problem.distinct('category', { isPublished: true });
  return categories.sort();
};

/**
 * Normalizes text content for stable fingerprint comparison:
 * - converts to lowercase
 * - strips markdown/punctuation
 * - collapses all whitespace and newlines
 * - trims
 */
const normalizeText = (text) => {
  if (!text) return '';
  return String(text)
    .toLowerCase()
    .replace(/\r\n/g, '\n')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Computes a deterministic SHA-256 fingerprint for canonical deduplication
 * based on normalized title and normalized full problem statement.
 * This prevents minor constraint formatting differences (e.g. 10^4 vs 104 or copy-pasted notes)
 * from fracturing the same canonical problem into duplicates.
 */
const generateProblemFingerprint = (title, description) => {
  const normTitle = normalizeText(title);
  const normDesc = normalizeText(description);
  const contentToHash = `${normTitle}:::${normDesc}`;
  return crypto.createHash('sha256').update(contentToHash).digest('hex');
};

/**
 * Create or reuse a canonical DSA problem using deterministic content fingerprinting
 */
const createProblem = async (data) => {
  let { title, category, difficulty, objective, description, constraints, inputData, outputData, testCases, tags, createdBy } = data;

  if (!title || !title.trim()) {
    throw new AppError('Problem title is required', 400);
  }

  if (!description || !description.trim()) {
    throw new AppError('Problem description is required', 400);
  }

  category = (category || 'General').trim();
  difficulty = (difficulty || 'Medium').trim();

  // Format and normalize constraints (remove empty lines and trim whitespace)
  let parsedConstraints = [];
  if (Array.isArray(constraints)) {
    parsedConstraints = constraints.map((c) => String(c).trim()).filter(Boolean);
  } else if (typeof constraints === 'string') {
    parsedConstraints = constraints.split('\n').map((c) => c.trim()).filter(Boolean);
  }

  // Format and normalize test cases
  let formattedTestCases = [];
  if (Array.isArray(testCases)) {
    formattedTestCases = testCases
      .map((tc, idx) => {
        const inputRaw = (tc.inputRaw || tc.input || '').trim();
        const outputRaw = (tc.outputRaw || tc.output || '').trim();
        if (!inputRaw && !outputRaw) return null;
        return {
          id: tc.id || idx + 1,
          inputRaw,
          outputRaw,
        };
      })
      .filter(Boolean);
  }

  // Enforce maximum 8 test cases backend constraint
  if (formattedTestCases.length > 8) {
    throw new AppError('Maximum of 8 input/output test case pairs allowed', 400);
  }

  // Generate stable fingerprint based on normalized title and description
  const fingerprint = generateProblemFingerprint(title, description);

  // 1. Check if an existing canonical problem matches this exact fingerprint
  let canonicalProblem = await Problem.findOne({ fingerprint });

  // 2. Base slug generation
  let slug = data.slug || data.problemId;
  if (!slug) {
    slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  if (!slug) {
    slug = `problem-${Date.now()}`;
  }

  // 3. Fallback check: match existing seeded problems by computing title + description fingerprint
  if (!canonicalProblem) {
    const existingBySlug = await Problem.findOne({ problemId: slug });
    if (existingBySlug) {
      const existingFingerprint =
        existingBySlug.fingerprint ||
        generateProblemFingerprint(existingBySlug.title, existingBySlug.description);

      if (existingFingerprint === fingerprint) {
        canonicalProblem = existingBySlug;
        if (!canonicalProblem.fingerprint) {
          await Problem.findByIdAndUpdate(canonicalProblem._id, {
            fingerprint,
          }).catch((err) => {
            console.error('Failed to backfill fingerprint for canonical problem:', err);
          });
          canonicalProblem.fingerprint = fingerprint;
        }
      }
    }
  }

  // If duplicate canonical problem is found, reuse it immediately (no duplicate created!)
  if (canonicalProblem) {
    if (createdBy) {
      canonicalProblem.contributors = canonicalProblem.contributors || [];
      const alreadyContributor = canonicalProblem.contributors.some(
        (id) => String(id) === String(createdBy)
      );
      if (!alreadyContributor && String(canonicalProblem.createdBy) !== String(createdBy)) {
        canonicalProblem.contributors.push(createdBy);
        await canonicalProblem.save().catch(() => { });
      }
    }

    return {
      problem: canonicalProblem,
      isExisting: true,
    };
  }

  // 4. Handle slug collisions for a different problem that happened to generate the same slug
  const slugConflict = await Problem.findOne({ problemId: slug });
  if (slugConflict) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

  const firstInput = formattedTestCases[0]?.inputRaw || '';
  const firstOutput = formattedTestCases[0]?.outputRaw || '';

  try {
    const newProblem = await Problem.create({
      problemId: slug,
      fingerprint,
      title: title.trim(),
      category,
      difficulty,
      objective: objective ? objective.trim() : title.trim(),
      description: description.trim(),
      constraints: parsedConstraints,
      inputData: inputData || { type: 'custom', label: 'INPUT DATA', value: firstInput },
      outputData: outputData || { type: 'custom', label: 'REQUIRED OUTPUT', description: firstOutput },
      testCases: formattedTestCases,
      tags: Array.isArray(tags) ? tags : [category],
      createdBy: createdBy || null,
      contributors: createdBy ? [createdBy] : [],
      isPublished: true,
    });

    return {
      problem: newProblem,
      isExisting: false,
    };
  } catch (error) {
    // Handle concurrent submission race conditions safely
    if (error.code === 11000) {
      // 1. If fingerprint already exists, it is an identical canonical problem
      const existingByFingerprint = await Problem.findOne({ fingerprint });
      if (existingByFingerprint) {
        if (createdBy && String(existingByFingerprint.createdBy) !== String(createdBy)) {
          await Problem.updateOne(
            { _id: existingByFingerprint._id },
            { $addToSet: { contributors: createdBy } }
          ).catch(() => {});
        }
        return {
          problem: existingByFingerprint,
          isExisting: true,
        };
      }

      // 2. If it was a slug collision for a different problem, retry with a unique slug
      if (error.keyPattern?.problemId || (error.message && error.message.includes('problemId'))) {
        const uniqueSlug = `${slug}-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const retriedProblem = await Problem.create({
          problemId: uniqueSlug,
          fingerprint,
          title: title.trim(),
          category,
          difficulty,
          objective: objective ? objective.trim() : title.trim(),
          description: description.trim(),
          constraints: parsedConstraints,
          inputData: inputData || { type: 'custom', label: 'INPUT DATA', value: firstInput },
          outputData: outputData || { type: 'custom', label: 'REQUIRED OUTPUT', description: firstOutput },
          testCases: formattedTestCases,
          tags: Array.isArray(tags) ? tags : [category],
          createdBy: createdBy || null,
          contributors: createdBy ? [createdBy] : [],
          isPublished: true,
        });

        return {
          problem: retriedProblem,
          isExisting: false,
        };
      }
    }
    throw error;
  }
};

module.exports = {
  AppError,
  getAllProblems,
  getMyProblems,
  getProblemByIdOrSlug,
  getProblemCategories,
  createProblem,
  normalizeText,
  generateProblemFingerprint,
};
