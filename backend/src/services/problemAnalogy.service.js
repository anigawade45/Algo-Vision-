const Problem = require('../models/Problem');
const ProblemAnalogy = require('../models/ProblemAnalogy');
const geminiService = require('./gemini.service');
const { computeProblemHash } = require('../utils/problemHash');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * Resolves Problem by slug or ObjectId and verifies user access rights
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
    throw new AppError('You do not have permission to access analogy for this private problem', 403);
  }

  return problem;
};

/**
 * Strips markdown fences and parses raw JSON string safely
 */
const parseJsonSafely = (rawText) => {
  if (typeof rawText !== 'string') return rawText;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Analogy Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

/**
 * Validates and normalizes Gemini AI response against strict Stage 03 schema contract
 */
const validateAndNormalizeAnalogyData = (rawData, problem) => {
  const parsed = parseJsonSafely(rawData);

  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('AI response must be a structured JSON object', 502);
  }

  const { intro, scenario } = parsed;

  const introTitle = String(intro?.title || 'Connect to a Familiar Analogy').trim();
  const introSubtitle = String(intro?.subtitle || 'A familiar situation that mirrors this algorithm without the code.').trim();

  const scenarioTitle = String(scenario?.title || `${problem.title} Metaphor`).trim();
  const scenarioStory = String(scenario?.story || '').trim();

  if (!scenarioStory) {
    throw new AppError('AI response missing valid scenario story', 502);
  }

  return {
    intro: {
      title: introTitle,
      subtitle: introSubtitle,
    },
    scenario: {
      title: scenarioTitle,
      story: scenarioStory,
    },
  };
};

/**
 * Retrieve user's stored Stage 03 ProblemAnalogy (with stale check)
 */
const getAnalogy = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const analogy = await ProblemAnalogy.findOne({
    problemId: problem._id,
    userId,
  });

  // Stale check: if problem hash differs, mark stale
  if (analogy && analogy.sourceProblemHash && analogy.sourceProblemHash !== currentHash) {
    console.log(`[Analogy Service] Stale analogy detected for problem "${problem.problemId}". Requesting regeneration.`);
    return {
      problem,
      analogy: null,
      stale: true,
    };
  }

  return {
    problem,
    analogy: analogy || null,
    stale: false,
  };
};

/**
 * Generate (or return existing non-stale) Stage 03 ProblemAnalogy via Gemini AI
 */
const generateAnalogy = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  // Check if analogy already exists and is up to date
  let existing = await ProblemAnalogy.findOne({
    problemId: problem._id,
    userId,
  });

  if (existing && existing.sourceProblemHash === currentHash) {
    return {
      problem,
      analogy: existing,
    };
  }

  // Generate content using Gemini Service with exact problem context
  const { rawText, model, promptVersion } = await geminiService.generateStage03AnalogyContent(problem);
  const normalizedData = validateAndNormalizeAnalogyData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  let savedDoc = null;
  if (existing) {
    savedDoc = await ProblemAnalogy.findOneAndUpdate(
      { problemId: problem._id, userId },
      {
        ...normalizedData,
        sourceProblemVersion,
        sourceProblemHash: currentHash,
        generatedBy: 'gemini',
        model,
        promptVersion,
        generationStatus: 'generated',
        generatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
  } else {
    try {
      savedDoc = await ProblemAnalogy.create({
        problemId: problem._id,
        userId,
        ...normalizedData,
        sourceProblemVersion,
        sourceProblemHash: currentHash,
        generatedBy: 'gemini',
        model,
        promptVersion,
        generationStatus: 'generated',
        generatedAt: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) {
        savedDoc = await ProblemAnalogy.findOneAndUpdate(
          { problemId: problem._id, userId },
          {
            ...normalizedData,
            sourceProblemVersion,
            sourceProblemHash: currentHash,
            generatedBy: 'gemini',
            model,
            promptVersion,
            generationStatus: 'generated',
            generatedAt: new Date(),
          },
          { new: true }
        );
      } else {
        throw err;
      }
    }
  }

  return {
    problem,
    analogy: savedDoc,
  };
};

/**
 * Force regenerate Stage 03 ProblemAnalogy via Gemini AI
 */
const regenerateAnalogy = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const { rawText, model, promptVersion } = await geminiService.generateStage03AnalogyContent(problem);
  const normalizedData = validateAndNormalizeAnalogyData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  const updatedDoc = await ProblemAnalogy.findOneAndUpdate(
    { problemId: problem._id, userId },
    {
      ...normalizedData,
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
    analogy: updatedDoc,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  getAnalogy,
  generateAnalogy,
  regenerateAnalogy,
};
