const ProblemWorkspace = require('../models/ProblemWorkspace');
const Problem = require('../models/Problem');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Helper to resolve Problem by slug or ID and verify user access rights
 */
const resolveProblemAndCheckAccess = async (problemIdOrSlug, userId) => {
  if (!problemIdOrSlug) {
    throw new AppError('Problem identifier is required', 400);
  }

  const normalizedSlug = String(problemIdOrSlug).trim().toLowerCase();

  let problem = await Problem.findOne({ problemId: normalizedSlug });

  if (!problem && problemIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    problem = await Problem.findById(problemIdOrSlug);
  }

  if (!problem) {
    throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
  }

  // Ownership / Public visibility check
  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to access workspace for this private problem', 403);
  }

  return problem;
};

/**
 * Retrieve user's workspace state for a given problem
 */
const getWorkspace = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);

  let workspace = await ProblemWorkspace.findOne({
    problemId: problem._id,
    userId,
  });

  if (workspace) {
    workspace.lastVisitedAt = new Date();
    await workspace.save();
  }

  return workspace;
};

/**
 * Initialize or get existing workspace state for a given problem
 */
const createWorkspace = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);

  let workspace = await ProblemWorkspace.findOne({
    problemId: problem._id,
    userId,
  });

  if (workspace) {
    workspace.lastVisitedAt = new Date();
    await workspace.save();
    return workspace;
  }

  try {
    workspace = await ProblemWorkspace.create({
      problemId: problem._id,
      userId,
      currentStage: 1,
      completedStages: [],
      lastVisitedAt: new Date(),
    });
  } catch (error) {
    // Handle potential compound unique index race condition
    if (error.code === 11000) {
      workspace = await ProblemWorkspace.findOne({
        problemId: problem._id,
        userId,
      });
    } else {
      throw error;
    }
  }

  return workspace;
};

/**
 * Update user's workspace state (currentStage and completedStages)
 */
const updateWorkspace = async (problemIdOrSlug, userId, updateData = {}) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);

  let workspace = await ProblemWorkspace.findOne({
    problemId: problem._id,
    userId,
  });

  if (!workspace) {
    throw new AppError('Workspace not initialized for this problem. Please initialize workspace first.', 404);
  }

  const { currentStage, completedStages } = updateData;

  // Validate currentStage if provided
  if (currentStage !== undefined) {
    const stageNum = Number(currentStage);
    if (!Number.isInteger(stageNum) || stageNum < 1 || stageNum > 11) {
      throw new AppError('Invalid stage number. Must be an integer between 1 and 11.', 400);
    }
    workspace.currentStage = stageNum;
  }

  // Validate and normalize completedStages if provided
  if (completedStages !== undefined) {
    if (!Array.isArray(completedStages)) {
      throw new AppError('completedStages must be an array of stage numbers.', 400);
    }

    const uniqueStages = Array.from(new Set(completedStages.map(Number))).filter(
      (n) => Number.isInteger(n) && n >= 1 && n <= 11
    );

    workspace.completedStages = uniqueStages;
  }

  workspace.lastVisitedAt = new Date();
  await workspace.save();

  return workspace;
};

module.exports = {
  AppError,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
};
