const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get dashboard overview data for authenticated user
 * @route   GET /api/dashboard/overview
 * @access  Private
 */
const getOverview = async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboardOverview(req.user);

    // Per-user data must never be stored by shared caches (CDN, proxy) or replayed via ETag
    res.set('Cache-Control', 'private, no-store');

    return successResponse(res, 200, 'Dashboard overview fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverview,
};