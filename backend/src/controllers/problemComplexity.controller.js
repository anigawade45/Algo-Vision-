const complexityService = require('../services/problemComplexity.service');
const { AppError } = require('../services/gemini.service');

const getComplexity = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, approachName } = req.query;
    const userId = req.user._id;

    const result = await complexityService.getComplexity(problemId, userId, approachId, approachName);
    
    res.json({
      success: true,
      data: result.complexity,
      stale: result.stale,
      approachId: result.approachId,
      approachName: result.approachName
    });
  } catch (error) {
    next(error);
  }
};

const generateComplexity = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const { approachId, approachName } = req.body;
    const userId = req.user._id;

    const result = await complexityService.generateComplexity(problemId, userId, approachId, approachName);
    
    res.json({
      success: true,
      data: result,
      generated: true
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getComplexity,
  generateComplexity,
};
