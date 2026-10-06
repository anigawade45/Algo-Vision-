const express = require('express');
const router = express.Router({ mergeParams: true });
const codeController = require('../controllers/problemCode.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all Stage 06 code endpoints
router.use(protect);

router.get('/', codeController.getCode);
router.post('/generate', codeController.generateCode);
// The execute route is at the problem level or global level, we can put it here
router.post('/execute', codeController.executeCode);

module.exports = router;
