const problemUnderstandingService = require('../services/problemUnderstanding.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * Controller to GET existing Stage 02 Problem Understanding
 */
const getUnderstanding = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemUnderstandingService.getUnderstanding(problemId, userId);

    const message = result.understanding
      ? 'Understanding retrieved successfully'
      : 'Understanding not generated yet';

    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST generate Stage 02 Problem Understanding via Gemini AI
 */
const generateUnderstanding = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemUnderstandingService.generateUnderstanding(problemId, userId);

    return successResponse(res, 200, 'Understanding generated successfully', result);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to POST force-regenerate Stage 02 Problem Understanding via Gemini AI
 */
const regenerateUnderstanding = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const result = await problemUnderstandingService.regenerateUnderstanding(problemId, userId);

    return successResponse(res, 200, 'Understanding regenerated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUnderstanding,
  generateUnderstanding,
  regenerateUnderstanding,
};
