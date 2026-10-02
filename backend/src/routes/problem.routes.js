const express = require('express');
const problemController = require('../controllers/problem.controller');
const problemWorkspaceRoutes = require('./problemWorkspace.routes');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Workspace routes
router.use('/:problemId/workspace', problemWorkspaceRoutes);

// Base problem routes
router.get('/', problemController.getProblems);
router.get('/categories', problemController.getCategories);
router.get('/mine', protect, problemController.getMyProblems);
router.get('/:idOrSlug', problemController.getProblemById);
router.post('/', protect, problemController.createProblem);

module.exports = router;
