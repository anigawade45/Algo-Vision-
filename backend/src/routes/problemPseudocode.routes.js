const express = require('express');
const problemPseudocodeController = require('../controllers/problemPseudocode.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

// Protect all Stage 05 pseudocode endpoints
router.use(protect);

router.get('/', problemPseudocodeController.getPseudocode);
router.post('/generate', problemPseudocodeController.generatePseudocode);
router.post('/regenerate', problemPseudocodeController.regeneratePseudocode);

module.exports = router;
