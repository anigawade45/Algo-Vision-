const express = require('express');
const problemController = require('../controllers/problem.controller');
const problemWorkspaceRoutes = require('./problemWorkspace.routes');
const problemUnderstandingRoutes = require('./problemUnderstanding.routes');
const problemAnalogyRoutes = require('./problemAnalogy.routes');
const problemPatternRoutes = require('./problemPattern.routes');
const problemPseudocodeRoutes = require('./problemPseudocode.routes');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Workspace routes
router.use('/:problemId/workspace', problemWorkspaceRoutes);

// Stage 02 Understanding routes
router.use('/:problemId/understanding', problemUnderstandingRoutes);

// Stage 03 Analogy routes
router.use('/:problemId/analogy', problemAnalogyRoutes);

// Stage 04 Pattern routes
router.use('/:problemId/pattern', problemPatternRoutes);

// Stage 05 Pseudocode routes
router.use('/:problemId/pseudocode', problemPseudocodeRoutes);


// Base problem routes
router.get('/', problemController.getProblems);
router.get('/categories', problemController.getCategories);
router.get('/mine', protect, problemController.getMyProblems);
router.get('/:idOrSlug', problemController.getProblemById);
router.post('/', protect, problemController.createProblem);

module.exports = router;
