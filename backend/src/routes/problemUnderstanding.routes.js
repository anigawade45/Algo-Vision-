const express = require('express');
const problemUnderstandingController = require('../controllers/problemUnderstanding.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all stage 02 understanding endpoints
router.use(protect);

router.get('/', problemUnderstandingController.getUnderstanding);
router.post('/generate', problemUnderstandingController.generateUnderstanding);
router.post('/regenerate', problemUnderstandingController.regenerateUnderstanding);

module.exports = router;
