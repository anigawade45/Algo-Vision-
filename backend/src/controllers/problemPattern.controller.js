const problemPatternService = require('../services/problemPattern.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * Controller to GET existing Stage 04 Problem Pattern
 */
const getPattern = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemPatternService.getPattern(problemId, userId);

    const message = result.pattern
      ? 'Pattern retrieved successfully'
      : 'Pattern not generated yet';

    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST generate Stage 04 Problem Pattern via Gemini AI
 */
const generatePattern = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemPatternService.generatePattern(problemId, userId);

    return successResponse(res, 200, 'Pattern generated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST force-regenerate Stage 04 Problem Pattern via Gemini AI
 */
const regeneratePattern = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemPatternService.regeneratePattern(problemId, userId);

    return successResponse(res, 200, 'Pattern regenerated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPattern,
  generatePattern,
  regeneratePattern,
};
