const problemDryRunService = require('../services/problemDryRun.service');

/**
 * Controller to fetch existing Stage 08 Dry Run for a problem, approach, and testCase
 * GET /api/problems/:problemId/dry-run?approachId=...&testCaseId=...
 */
const getDryRun = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, testCaseId } = req.query;
    const userId = req.user._id;

    const result = await problemDryRunService.getDryRun(problemId, userId, approachId, testCaseId);

    return res.status(200).json({
      success: true,
      message: result.dryRun
        ? 'Problem dry run retrieved successfully.'
        : 'No dry run found for this approach and test case yet.',
      data: {
        dryRun: result.dryRun,
        stale: result.stale || false,
        problem: result.problem,
        approachId: result.approachId,
        approachName: result.approachName,
        testCaseId: result.testCaseId,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate Stage 08 Dry Run execution trace via Gemini AI
 * POST /api/problems/:problemId/dry-run/generate
 * Body: { approachId, testCaseId }
 */
const generateDryRun = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, testCaseId } = req.body || {};
    const userId = req.user._id;

    const result = await problemDryRunService.generateDryRun(
      problemId,
      userId,
      approachId,
      testCaseId,
      false
    );

    return res.status(200).json({
      success: true,
      message: 'Problem dry run trace generated successfully.',
      data: {
        dryRun: result.dryRun,
        stale: result.stale || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to force regenerate Stage 08 Dry Run execution trace via Gemini AI
 * POST /api/problems/:problemId/dry-run/regenerate
 * Body: { approachId, testCaseId }
 */
const regenerateDryRun = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, testCaseId } = req.body || {};
    const userId = req.user._id;

    const result = await problemDryRunService.generateDryRun(
      problemId,
      userId,
      approachId,
      testCaseId,
      true
    );

    return res.status(200).json({
      success: true,
      message: 'Problem dry run trace regenerated successfully.',
      data: {
        dryRun: result.dryRun,
        stale: result.stale || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDryRun,
  generateDryRun,
  regenerateDryRun,
};
