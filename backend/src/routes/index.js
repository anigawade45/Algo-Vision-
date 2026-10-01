const express = require('express');
const authRoutes = require('./auth.routes');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

// Health Check API
router.get('/health', (req, res) => {
  return successResponse(res, 200, 'AlgoVision API is running');
});

// Auth Routes
router.use('/auth', authRoutes);

module.exports = router;
