const express = require('express');
const problemAnalogyController = require('../controllers/problemAnalogy.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all stage 03 analogy endpoints
router.use(protect);

router.get('/', problemAnalogyController.getAnalogy);
router.post('/generate', problemAnalogyController.generateAnalogy);
router.post('/regenerate', problemAnalogyController.regenerateAnalogy);

module.exports = router;
