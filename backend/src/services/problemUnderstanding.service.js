const Problem = require('../models/Problem');
const ProblemUnderstanding = require('../models/ProblemUnderstanding');
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
    throw new AppError('You do not have permission to access understanding for this private problem', 403);
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
    console.error('[Understanding Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

/**
 * Validates and normalizes Gemini AI response against strict Stage 02 schema contract
 */
const validateAndNormalizeUnderstandingData = (rawData, problem) => {
  const parsed = parseJsonSafely(rawData);

  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('AI response must be a structured JSON object', 502);
  }

  const {
    objectiveExplanation,
    inputExplanation,
    outputExplanation,
    inputToOutputFlow,
    testCaseExplanations,
    commonMisunderstandings,
    edgeCaseInsights,
  } = parsed;

  // 1. Validate required text explanations
  if (!objectiveExplanation || typeof objectiveExplanation !== 'string' || !objectiveExplanation.trim()) {
    throw new AppError('AI response missing valid objectiveExplanation', 502);
  }

  if (!inputExplanation || typeof inputExplanation !== 'string' || !inputExplanation.trim()) {
    throw new AppError('AI response missing valid inputExplanation', 502);
  }

  if (!outputExplanation || typeof outputExplanation !== 'string' || !outputExplanation.trim()) {
    throw new AppError('AI response missing valid outputExplanation', 502);
  }

  if (!inputToOutputFlow || typeof inputToOutputFlow !== 'string' || !inputToOutputFlow.trim()) {
    throw new AppError('AI response missing valid inputToOutputFlow', 502);
  }

  // 2. Validate and normalize testCaseExplanations
  const validProblemTestCases = problem.testCases || [];
  const problemTestCaseIds = validProblemTestCases.map((tc, idx) => tc.id || idx + 1);

  let normalizedTestCaseExplanations = [];
  if (Array.isArray(testCaseExplanations) && testCaseExplanations.length > 0) {
    normalizedTestCaseExplanations = testCaseExplanations
      .map((item, idx) => {
        if (!item || typeof item !== 'object') return null;
        const tcId = Number(item.testCaseId || idx + 1);
        const explanation = String(item.explanation || '').trim();
        if (!explanation) return null;

        // Reject unknown testCaseId that does not belong to real problem
        if (!problemTestCaseIds.includes(tcId)) {
          console.warn(`[Understanding Service] Unknown testCaseId ${tcId} in AI response for problem ${problem.problemId}`);
          return null;
        }

        return { testCaseId: tcId, explanation };
      })
      .filter(Boolean);
  }

  // Fallback: If AI omitted specific test case explanations, generate clean entries from problem test cases
  if (normalizedTestCaseExplanations.length === 0 && validProblemTestCases.length > 0) {
    normalizedTestCaseExplanations = validProblemTestCases.map((tc, idx) => ({
      testCaseId: tc.id || idx + 1,
      explanation: `Test case ${tc.id || idx + 1}: Maps input ${tc.inputRaw} to expected output ${tc.outputRaw}.`,
    }));
  }

  // 3. Validate and normalize commonMisunderstandings (max 5)
  let normalizedMisunderstandings = [];
  if (Array.isArray(commonMisunderstandings)) {
    normalizedMisunderstandings = commonMisunderstandings
      .slice(0, 5)
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  // 4. Validate and normalize edgeCaseInsights (max 5)
  let normalizedEdgeCases = [];
  if (Array.isArray(edgeCaseInsights)) {
    normalizedEdgeCases = edgeCaseInsights
      .slice(0, 5)
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return {
    objectiveExplanation: objectiveExplanation.trim(),
    inputExplanation: inputExplanation.trim(),
    outputExplanation: outputExplanation.trim(),
    inputToOutputFlow: inputToOutputFlow.trim(),
    testCaseExplanations: normalizedTestCaseExplanations,
    commonMisunderstandings: normalizedMisunderstandings,
    edgeCaseInsights: normalizedEdgeCases,
  };
};

/**
 * Retrieve user's stored Stage 02 ProblemUnderstanding (with stale check)
 */
const getUnderstanding = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const understanding = await ProblemUnderstanding.findOne({
    problemId: problem._id,
    userId,
  });

  // Stale check: if problem hash differs, mark stale
  if (understanding && understanding.sourceProblemHash && understanding.sourceProblemHash !== currentHash) {
    console.log(`[Understanding Service] Stale understanding detected for problem "${problem.problemId}". Requesting regeneration.`);
    return {
      problem,
      understanding: null,
      stale: true,
    };
  }

  return {
    problem,
    understanding: understanding || null,
    stale: false,
  };
};

/**
 * Generate (or return existing non-stale) Stage 02 ProblemUnderstanding via Gemini AI
 */
const generateUnderstanding = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  // Check if understanding already exists and is up to date
  let existing = await ProblemUnderstanding.findOne({
    problemId: problem._id,
    userId,
  });

  if (existing && existing.sourceProblemHash === currentHash) {
    return {
      problem,
      understanding: existing,
    };
  }

  // Generate content using Gemini Service with exact problem context
  const { rawText, model, promptVersion } = await geminiService.generateStage02Content(problem);
  const normalizedData = validateAndNormalizeUnderstandingData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  let savedDoc = null;
  if (existing) {
    savedDoc = await ProblemUnderstanding.findOneAndUpdate(
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
      savedDoc = await ProblemUnderstanding.create({
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
        savedDoc = await ProblemUnderstanding.findOneAndUpdate(
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
    understanding: savedDoc,
  };
};

/**
 * Force regenerate Stage 02 ProblemUnderstanding via Gemini AI
 */
const regenerateUnderstanding = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const { rawText, model, promptVersion } = await geminiService.generateStage02Content(problem);
  const normalizedData = validateAndNormalizeUnderstandingData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  const updatedDoc = await ProblemUnderstanding.findOneAndUpdate(
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
    understanding: updatedDoc,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  getUnderstanding,
  generateUnderstanding,
  regenerateUnderstanding,
};
