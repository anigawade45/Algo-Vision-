const Problem = require('../models/Problem');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Fetch all published DSA problems with optional category/difficulty filters, user ownership, and text search
 */
const getAllProblems = async ({ category, difficulty, search, createdBy } = {}) => {
  const query = { isPublished: true };

  if (createdBy) {
    query.createdBy = createdBy;
  }

  if (category) {
    query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
  }

  if (difficulty) {
    query.difficulty = { $regex: new RegExp(`^${difficulty.trim()}$`, 'i') };
  }

  if (search) {
    const searchRegex = new RegExp(search.trim(), 'i');
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

  const normalizedSlug = idOrSlug.trim().toLowerCase();
  
  let problem = await Problem.findOne({
    problemId: normalizedSlug,
  });

  if (!problem && idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    problem = await Problem.findById(idOrSlug);
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
 * Get problems created by a specific user
 */
const getMyProblems = async (userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }
  const problems = await Problem.find({ createdBy: userId }).sort({ createdAt: -1 });
  return problems;
};

/**
 * Get distinct categories of published problems
 */
const getProblemCategories = async () => {
  const categories = await Problem.distinct('category', { isPublished: true });
  return categories.sort();
};

/**
 * Create a new DSA problem
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

  // Slug generation
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

  // Slug collision handling
  const existing = await Problem.findOne({ problemId: slug });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-6)}`;
  }

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

  const firstInput = formattedTestCases[0]?.inputRaw || '';
  const firstOutput = formattedTestCases[0]?.outputRaw || '';

  const newProblem = await Problem.create({
    problemId: slug,
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
    isPublished: true,
  });

  return newProblem;
};

module.exports = {
  AppError,
  getAllProblems,
  getMyProblems,
  getProblemByIdOrSlug,
  getProblemCategories,
  createProblem,
};
