const express = require('express');
const problemPatternController = require('../controllers/problemPattern.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all stage 04 pattern endpoints
router.use(protect);

router.get('/', problemPatternController.getPattern);
router.post('/generate', problemPatternController.generatePattern);
router.post('/regenerate', problemPatternController.regeneratePattern);

module.exports = router;
