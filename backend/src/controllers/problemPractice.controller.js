const problemPracticeService = require('../services/problemPractice.service');

/**
 * Controller to fetch existing Stage 11 Practice quiz for a problem & approach
 * GET /api/problems/:problemId/practice?approachId=...
 */
const getPractice = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.query;
    const userId = req.user._id;

    const result = await problemPracticeService.getPractice(problemId, userId, approachId);

    return res.status(200).json({
      success: true,
      message: result.practice
        ? 'Problem practice quiz retrieved successfully.'
        : 'No practice quiz found for this approach yet.',
      data: {
        practice: result.practice,
        stale: result.stale || false,
        problem: result.problem,
        approachId: result.approachId,
        approachName: result.approachName,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate Stage 11 Practice quiz via Gemini AI
 * POST /api/problems/:problemId/practice/generate
 * Body: { approachId }
 */
const generatePractice = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.body || {};
    const userId = req.user._id;

    const result = await problemPracticeService.generatePractice(
      problemId,
      userId,
      approachId,
      false
    );

    return res.status(200).json({
      success: true,
      message: 'Problem practice quiz generated successfully.',
      data: {
        practice: result.practice,
        stale: result.stale || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to force regenerate Stage 11 Practice quiz via Gemini AI
 * POST /api/problems/:problemId/practice/regenerate
 * Body: { approachId }
 */
const regeneratePractice = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.body || {};
    const userId = req.user._id;

    const result = await problemPracticeService.generatePractice(
      problemId,
      userId,
      approachId,
      true
    );

    return res.status(200).json({
      success: true,
      message: 'Problem practice quiz regenerated successfully.',
      data: {
        practice: result.practice,
        stale: result.stale || false,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPractice,
  generatePractice,
  regeneratePractice,
};
