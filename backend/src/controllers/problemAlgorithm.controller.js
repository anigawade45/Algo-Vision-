const problemAlgorithmService = require('../services/problemAlgorithm.service');
const { successResponse } = require('../utils/apiResponse');

const getAlgorithm = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.query;
    const userId = req.user._id;

    const result = await problemAlgorithmService.getAlgorithm(problemId, userId, approachId);

    const message = result.algorithm
      ? 'Algorithm retrieved successfully'
      : 'Algorithm not generated yet';

    return successResponse(res, 200, message, result);
  } catch (error) {
    next(error);
  }
};

const generateAlgorithm = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.body;
    const userId = req.user._id;

    const result = await problemAlgorithmService.generateAlgorithm(problemId, userId, approachId);

    return successResponse(res, 200, 'Algorithm generated successfully', result);
  } catch (error) {
    next(error);
  }
};

const regenerateAlgorithm = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.body;
    const userId = req.user._id;

    const result = await problemAlgorithmService.regenerateAlgorithm(problemId, userId, approachId);

    return successResponse(res, 200, 'Algorithm regenerated successfully', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlgorithm,
  generateAlgorithm,
  regenerateAlgorithm,
};
