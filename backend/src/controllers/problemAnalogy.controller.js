const problemAnalogyService = require('../services/problemAnalogy.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * Controller to GET existing Stage 03 Problem Analogy
 */
const getAnalogy = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemAnalogyService.getAnalogy(problemId, userId);

    const message = result.analogy
      ? 'Analogy retrieved successfully'
      : 'Analogy not generated yet';

    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST generate Stage 03 Problem Analogy via Gemini AI
 */
const generateAnalogy = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemAnalogyService.generateAnalogy(problemId, userId);

    return successResponse(res, 200, 'Analogy generated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST force-regenerate Stage 03 Problem Analogy via Gemini AI
 */
const regenerateAnalogy = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemAnalogyService.regenerateAnalogy(problemId, userId);

    return successResponse(res, 200, 'Analogy regenerated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalogy,
  generateAnalogy,
  regenerateAnalogy,
};
