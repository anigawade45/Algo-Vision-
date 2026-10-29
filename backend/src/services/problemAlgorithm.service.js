const Problem = require('../models/Problem');
const ProblemAlgorithm = require('../models/ProblemAlgorithm');
const ProblemPattern = require('../models/ProblemPattern');
const geminiService = require('./gemini.service');
const { computeProblemHash } = require('../utils/problemHash');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const resolveProblemAndCheckAccess = async (problemIdOrSlug, userId) => {
  if (!problemIdOrSlug) {
    throw new AppError('Problem identifier is required', 400);
  }

  const idStr = String(problemIdOrSlug).trim();
  const normalizedSlug = idStr.toLowerCase();

  let problem = await Problem.findOne({ problemId: normalizedSlug });

  if (!problem && /^[0-9a-fA-F]{24}$/.test(idStr)) {
    problem = await Problem.findById(idStr);
  }

  if (!problem) {
    throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
  }

  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to access algorithm for this private problem', 403);
  }

  return problem;
};

const getAlgorithm = async (problemIdOrSlug, userId, approachId = 'default') => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const algorithm = await ProblemAlgorithm.findOne({
    problemId: problem._id,
    userId,
    approachId,
  });

  if (algorithm && algorithm.sourceProblemHash && algorithm.sourceProblemHash !== currentHash) {
    console.log(`[Algorithm Service] Stale algorithm detected for problem "${problem.problemId}". Requesting regeneration.`);
    return {
      problem,
      algorithm: null,
      stale: true,
    };
  }

  return {
    problem,
    algorithm: algorithm || null,
    stale: false,
  };
};

const generateAlgorithm = async (problemIdOrSlug, userId, approachId = 'default') => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  let existing = await ProblemAlgorithm.findOne({
    problemId: problem._id,
    userId,
    approachId,
  });

  if (existing && existing.sourceProblemHash === currentHash) {
    return {
      problem,
      algorithm: existing,
    };
  }

  // Fetch Pattern to get approach details
  const pattern = await ProblemPattern.findOne({ problemId: problem._id, userId });
  let approachDetails = null;
  if (pattern && pattern.solutionFamilies) {
    const family = pattern.solutionFamilies.families.find(f => f.id === approachId);
    if (family) {
      approachDetails = { name: family.name, detail: family.detail };
    }
  }

  const { rawText, model, promptVersion } = await geminiService.generateStage05AlgorithmContent(problem, approachDetails);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  const payload = {
    rawText,
    sourceProblemVersion,
    sourceProblemHash: currentHash,
    generatedBy: 'gemini',
    model,
    promptVersion,
    generationStatus: 'generated',
    generatedAt: new Date(),
  };

  let savedDoc = null;
  if (existing) {
    savedDoc = await ProblemAlgorithm.findOneAndUpdate(
      { problemId: problem._id, userId, approachId },
      payload,
      { new: true, runValidators: true }
    );
  } else {
    try {
      savedDoc = await ProblemAlgorithm.create({
        problemId: problem._id,
        userId,
        approachId,
        ...payload,
      });
    } catch (err) {
      if (err.code === 11000) {
        savedDoc = await ProblemAlgorithm.findOneAndUpdate(
          { problemId: problem._id, userId, approachId },
          payload,
          { new: true }
        );
      } else {
        throw err;
      }
    }
  }

  return {
    problem,
    algorithm: savedDoc,
  };
};

const regenerateAlgorithm = async (problemIdOrSlug, userId, approachId = 'default') => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  // Fetch Pattern to get approach details
  const pattern = await ProblemPattern.findOne({ problemId: problem._id, userId });
  let approachDetails = null;
  if (pattern && pattern.solutionFamilies) {
    const family = pattern.solutionFamilies.families.find(f => f.id === approachId);
    if (family) {
      approachDetails = { name: family.name, detail: family.detail };
    }
  }

  const { rawText, model, promptVersion } = await geminiService.generateStage05AlgorithmContent(problem, approachDetails);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  const updatedDoc = await ProblemAlgorithm.findOneAndUpdate(
    { problemId: problem._id, userId, approachId },
    {
      rawText,
      sourceProblemVersion,
      sourceProblemHash: currentHash,
      generatedBy: 'gemini',
      model,
      promptVersion,
      generationStatus: 'generated',
      generatedAt: new Date(),
    },
    { new: true, upsert: true, runValidators: true }
  );

  return {
    problem,
    algorithm: updatedDoc,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  getAlgorithm,
  generateAlgorithm,
  regenerateAlgorithm,
};
