const express = require('express');
const problemVisualizationController = require('../controllers/problemVisualization.controller');
const { optionalProtect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// GET /api/problems/:problemId/visualization
router.get('/', optionalProtect, problemVisualizationController.getVisualizationTrace);

// POST /api/problems/:problemId/visualization/generate
router.post('/generate', optionalProtect, problemVisualizationController.generateVisualizationTrace);

// GET /api/problems/:problemId/visualization/plan
router.get('/plan', optionalProtect, problemVisualizationController.getVisualizationPlan);

// POST /api/problems/:problemId/visualization/plan
router.post('/plan', optionalProtect, problemVisualizationController.getVisualizationPlan);

module.exports = router;
