const express = require('express');
const problemPracticeController = require('../controllers/problemPractice.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all Stage 11 Practice endpoints
router.use(protect);

router.get('/', problemPracticeController.getPractice);
router.post('/generate', problemPracticeController.generatePractice);
router.post('/regenerate', problemPracticeController.regeneratePractice);

module.exports = router;
