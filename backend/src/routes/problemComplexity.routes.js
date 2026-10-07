const express = require('express');
const router = express.Router({ mergeParams: true });
const complexityController = require('../controllers/problemComplexity.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', complexityController.getComplexity);
router.post('/generate', complexityController.generateComplexity);

module.exports = router;
