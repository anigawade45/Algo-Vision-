const express = require('express');
const problemDryRunController = require('../controllers/problemDryRun.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all Stage 08 Dry Run endpoints
router.use(protect);

router.get('/', problemDryRunController.getDryRun);
router.post('/generate', problemDryRunController.generateDryRun);
router.post('/regenerate', problemDryRunController.regenerateDryRun);

module.exports = router;
