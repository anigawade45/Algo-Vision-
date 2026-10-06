const problemPseudocodeService = require('../services/problemPseudocode.service');

/**
 * Controller to fetch existing Stage 05 Pseudocode for a problem & approach
 * GET /api/problems/:problemId/pseudocode?approachId=...
 */
const getPseudocode = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.query;
    const userId = req.user._id;

    const result = await problemPseudocodeService.getPseudocode(problemId, userId, approachId);

    return res.status(200).json({
      success: true,
      message: result.pseudocode
        ? 'Problem pseudocode retrieved successfully.'
        : 'No pseudocode found for this approach yet.',
      data: {
        pseudocode: result.pseudocode,
        stale: result.stale || false,
        problem: {
          id: result.problem?.problemId || result.problem?._id,
          title: result.problem?.title,
          category: result.problem?.category,
        },
        approach: {
          approachId: result.approachId,
          approachName: result.approachName,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate Stage 05 Pseudocode via Gemini AI
 * POST /api/problems/:problemId/pseudocode/generate
 * Body: { approachId, approachName }
 */
const generatePseudocode = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, approachName } = req.body || {};
    const userId = req.user._id;

    const pseudocode = await problemPseudocodeService.generatePseudocode(
      problemId,
      userId,
      approachId,
      approachName
    );

    return res.status(200).json({
      success: true,
      message: 'Problem pseudocode generated successfully.',
      data: {
        pseudocode,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to force regenerate Stage 05 Pseudocode via Gemini AI
 * POST /api/problems/:problemId/pseudocode/regenerate
 * Body: { approachId, approachName }
 */
const regeneratePseudocode = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, approachName } = req.body || {};
    const userId = req.user._id;

    const pseudocode = await problemPseudocodeService.regeneratePseudocode(
      problemId,
      userId,
      approachId,
      approachName
    );

    return res.status(200).json({
      success: true,
      message: 'Problem pseudocode regenerated successfully.',
      data: {
        pseudocode,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPseudocode,
  generatePseudocode,
  regeneratePseudocode,
};
