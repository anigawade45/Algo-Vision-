const express = require('express');
const problemController = require('../controllers/problem.controller');
const problemWorkspaceRoutes = require('./problemWorkspace.routes');
const problemUnderstandingRoutes = require('./problemUnderstanding.routes');
const problemAnalogyRoutes = require('./problemAnalogy.routes');
const problemPatternRoutes = require('./problemPattern.routes');
const problemAlgorithmRoutes = require('./problemAlgorithm.routes');
const problemPseudocodeRoutes = require('./problemPseudocode.routes');
const problemCodeRoutes = require('./problemCode.routes');
const problemDryRunRoutes = require('./problemDryRun.routes');
const problemComplexityRoutes = require('./problemComplexity.routes');
const problemPracticeRoutes = require('./problemPractice.routes');
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

// Stage 05 Algorithm routes
router.use('/:problemId/algorithm', problemAlgorithmRoutes);

// Stage 06 Pseudocode routes
router.use('/:problemId/pseudocode', problemPseudocodeRoutes);

// Stage 07 Code routes
router.use('/:problemId/code', problemCodeRoutes);

// Stage 08 Dry Run routes
router.use('/:problemId/dry-run', problemDryRunRoutes);

// Stage 10 Complexity routes
router.use('/:problemId/complexity', problemComplexityRoutes);

// Stage 11 Practice / Quiz routes
router.use('/:problemId/practice', problemPracticeRoutes);

// Base problem routes
router.get('/', problemController.getProblems);
router.get('/categories', problemController.getCategories);
router.get('/mine', protect, problemController.getMyProblems);
router.get('/:idOrSlug', problemController.getProblemById);
router.post('/', protect, problemController.createProblem);

module.exports = router;
