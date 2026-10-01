const problemService = require('../services/problem.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all DSA problems with optional filters (category, difficulty, search)
 * @route   GET /api/problems
 * @access  Public
 */
const getProblems = async (req, res, next) => {
  try {
    const { category, difficulty, search } = req.query;
    const problems = await problemService.getAllProblems({ category, difficulty, search });
    
    return successResponse(res, 200, 'Problems retrieved successfully', {
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get distinct problem categories
 * @route   GET /api/problems/categories
 * @access  Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await problemService.getProblemCategories();
    return successResponse(res, 200, 'Categories retrieved successfully', { categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single problem by slug / problemId or ID
 * @route   GET /api/problems/:idOrSlug
 * @access  Public / Private
 */
const getProblemById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const userId = req.user ? req.user._id : null;
    const problem = await problemService.getProblemByIdOrSlug(idOrSlug, userId);
    return successResponse(res, 200, 'Problem retrieved successfully', { problem });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get problems created by the logged-in user
 * @route   GET /api/problems/mine
 * @access  Private
 */
const getMyProblems = async (req, res, next) => {
  try {
    const problems = await problemService.getMyProblems(req.user._id);
    return successResponse(res, 200, 'User problems retrieved successfully', {
      count: problems.length,
      problems,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new DSA problem
 * @route   POST /api/problems
 * @access  Private
 */
const createProblem = async (req, res, next) => {
  try {
    // Strip client-supplied createdBy to enforce server-side ownership
    const payload = { ...req.body };
    delete payload.createdBy;

    const problem = await problemService.createProblem({
      ...payload,
      createdBy: req.user._id,
    });
    return successResponse(res, 201, 'Problem created successfully', { problem });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getMyProblems,
  getCategories,
  getProblemById,
  createProblem,
};
