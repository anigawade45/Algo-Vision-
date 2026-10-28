const express = require('express');
const authRoutes = require('./auth.routes');
const problemRoutes = require('./problem.routes');
const aiMentorRoutes = require('./aiMentor.routes');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

// Health Check API
router.get('/health', (req, res) => {
  return successResponse(res, 200, 'AlgoVision API is running');
});

// Auth Routes
router.use('/auth', authRoutes);

// Dashboard Routes
const dashboardRoutes = require('./dashboard.routes');
router.use('/dashboard', dashboardRoutes);

// DSA Problems Routes
router.use('/problems', problemRoutes);

// Generic Visualization Plan Direct Route (POST /api/visualization/plan, GET /api/visualization/plan)
const problemVisualizationController = require('../controllers/problemVisualization.controller');
const { optionalProtect } = require('../middleware/auth.middleware');
router.get('/visualization/plan', optionalProtect, problemVisualizationController.getVisualizationPlan);
router.post('/visualization/plan', optionalProtect, problemVisualizationController.getVisualizationPlan);

// AI Mentor Routes
router.use('/ai-mentor', aiMentorRoutes);

module.exports = router;
