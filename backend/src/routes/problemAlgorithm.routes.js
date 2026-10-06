const express = require('express');
const problemAlgorithmController = require('../controllers/problemAlgorithm.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router({ mergeParams: true });

router.get('/', protect, problemAlgorithmController.getAlgorithm);
router.post('/generate', protect, problemAlgorithmController.generateAlgorithm);
router.post('/regenerate', protect, problemAlgorithmController.regenerateAlgorithm);

module.exports = router;
