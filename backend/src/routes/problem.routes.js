const express = require('express');
const problemController = require('../controllers/problem.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/', problemController.getProblems);
router.get('/mine', protect, problemController.getMyProblems);
router.get('/categories', problemController.getCategories);
router.get('/:idOrSlug', problemController.getProblemById);
router.post('/', protect, problemController.createProblem);

module.exports = router;
