const problemWorkspaceService = require('../services/problemWorkspace.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get user's workspace state for a problem
 * @route   GET /api/problems/:problemId/workspace
 * @access  Private
 */
const getWorkspace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;
    const workspace = await problemWorkspaceService.getWorkspace(problemId, userId);

    if (!workspace) {
      return successResponse(res, 200, 'Workspace not initialized', {
        workspace: null,
      });
    }

    return successResponse(res, 200, 'Workspace fetched successfully', {
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initialize or retrieve workspace state for a problem
 * @route   POST /api/problems/:problemId/workspace
 * @access  Private
 */
const createWorkspace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const workspace = await problemWorkspaceService.createWorkspace(problemId, userId);

    return successResponse(res, 201, 'Workspace initialized successfully', {
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update workspace state (currentStage / completedStages)
 * @route   PATCH /api/problems/:problemId/workspace
 * @access  Private
 */
const updateWorkspace = async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const { currentStage, completedStages } = req.body;

    const workspace = await problemWorkspaceService.updateWorkspace(problemId, userId, {
      currentStage,
      completedStages,
    });

    return successResponse(res, 200, 'Workspace updated successfully', {
      workspace,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
};
