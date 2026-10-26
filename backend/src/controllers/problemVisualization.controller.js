const problemVisualizationService = require('../services/problemVisualization.service');
const visualizationPlanService = require('../services/visualizationPlan.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// Lightweight in-memory rate limiter for visualization plan requests (60 per minute per IP)
const planRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 60;

const checkPlanRateLimit = (ip) => {
  const now = Date.now();
  const entry = planRequestCounts.get(ip);
  if (!entry || now - entry.startTime > RATE_LIMIT_WINDOW_MS) {
    planRequestCounts.set(ip, { count: 1, startTime: now });
    return true;
  }
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  entry.count++;
  return true;
};

/**
 * Controller to fetch existing Stage 09 Visualization validated execution trace.
 * GET /api/problems/:problemId/visualization?approachId=...&testCaseId=...
 *
 * Query Parameters:
 * - approachId (string, optional): Algorithm approach ID (e.g. 'minHeapGreedy', 'hashMap')
 * - testCaseId (number|string, optional): Numeric test case ID (defaults to 1)
 *
 * Access Rules:
 * - Public for published problems.
 * - Private (owner only) for unpublished problems.
 * - User-scoped execution retrieval with safe system fallback.
 */
const getVisualizationTrace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, testCaseId } = req.query;
    const user = req.user || null;

    // 1. Input Validation: Problem Identifier (Slug or MongoDB ObjectId)
    if (!problemId || typeof problemId !== 'string' || problemId.trim() === '') {
      return errorResponse(res, 400, 'Problem identifier is required.');
    }

    const trimmedProblemId = problemId.trim();
    if (trimmedProblemId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(trimmedProblemId)) {
      return errorResponse(res, 400, 'Problem identifier is invalid. Must be an alphanumeric slug or valid ID.');
    }

    // 2. Input Validation: Approach Identifier (NoSQL injection and length protection)
    let sanitizedApproachId = undefined;
    if (approachId !== undefined && approachId !== null && approachId !== '') {
      if (
        typeof approachId !== 'string' ||
        approachId.length > 64 ||
        !/^[a-zA-Z0-9_-]+$/.test(approachId.trim())
      ) {
        return errorResponse(
          res,
          400,
          'Approach identifier is invalid. Must be an alphanumeric string up to 64 characters.'
        );
      }
      sanitizedApproachId = approachId.trim();
    }

    // 3. Input Validation: Test Case Identifier (Must be bounded positive integer: 1 - 1000)
    let sanitizedTestCaseId = undefined;
    if (testCaseId !== undefined && testCaseId !== null && testCaseId !== '') {
      const parsedNum = Number(testCaseId);
      if (
        (typeof testCaseId !== 'string' && typeof testCaseId !== 'number') ||
        isNaN(parsedNum) ||
        !Number.isInteger(parsedNum) ||
        parsedNum < 1 ||
        parsedNum > 1000
      ) {
        return errorResponse(res, 400, 'Test case identifier must be a valid positive integer between 1 and 1000.');
      }
      sanitizedTestCaseId = parsedNum;
    }

    const autoGenerate = req.query.autoGenerate === 'true';

    // 4. Delegate to Data-Access & Trace-Building Service
    const result = await problemVisualizationService.getVisualizationTrace(
      trimmedProblemId,
      user,
      sanitizedApproachId,
      sanitizedTestCaseId,
      autoGenerate
    );

    // 5. Return Finalized Response Envelope
    return successResponse(res, 200, 'Visualization trace retrieved successfully', {
      trace: result.trace,
      approachId: result.approachId,
      approachName: result.approachName,
      testCaseId: result.testCaseId,
      isFromDryRun: result.isFromDryRun,
      generatedByAi: result.generatedByAi,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to explicitly generate a Stage 09 Visualization execution trace using Gemini AI.
 * POST /api/problems/:problemId/visualization/generate
 */
const generateVisualizationTrace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, testCaseId } = req.body || req.query;
    const user = req.user || null;

    if (!problemId || typeof problemId !== 'string' || problemId.trim() === '') {
      return errorResponse(res, 400, 'Problem identifier is required.');
    }

    const trimmedProblemId = problemId.trim();
    const result = await problemVisualizationService.generateVisualizationTrace(
      trimmedProblemId,
      user,
      approachId,
      testCaseId
    );

    return successResponse(res, 201, 'Visualization trace generated successfully via AI', {
      trace: result.trace,
      approachId: result.approachId,
      approachName: result.approachName,
      testCaseId: result.testCaseId,
      isFromDryRun: result.isFromDryRun,
      generatedByAi: result.generatedByAi,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get or generate a Stage 09 Generic Visualization Plan.
 * GET/POST /api/problems/:problemId/visualization/plan
 * POST /api/visualization/plan
 */
const getVisualizationPlan = async (req, res, next) => {
  try {
    const problemId = req.params.problemId || req.body?.problemId || req.query?.problemId;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';

    if (!checkPlanRateLimit(clientIp)) {
      return errorResponse(res, 429, 'Rate limit exceeded for AI visualization plan generation. Please slow down.');
    }

    if (!problemId || typeof problemId !== 'string' || problemId.trim() === '') {
      return errorResponse(res, 400, 'Problem identifier is required.');
    }

    const trimmedProblemId = problemId.trim();
    if (trimmedProblemId.length > 100 || !/^[a-zA-Z0-9_-]+$/.test(trimmedProblemId)) {
      return errorResponse(res, 400, 'Problem identifier is invalid. Must be an alphanumeric slug or ID.');
    }

    const bypassCache = req.query.bypassCache === 'true' || req.body?.bypassCache === true;

    const result = await visualizationPlanService.generateVisualizationPlan(trimmedProblemId, {
      user: req.user || null,
      bypassCache,
    });

    return successResponse(res, 200, 'Visualization plan retrieved successfully', {
      plan: result.plan,
      problemId: result.problemId,
      schemaVersion: result.schemaVersion,
      cached: result.cached,
      isSupported: result.isSupported,
      isFallback: result.isFallback || false,
      source: result.source,
      executionSupported: result.executionSupported,
      explanation: result.explanation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVisualizationTrace,
  generateVisualizationTrace,
  getVisualizationPlan,
};
