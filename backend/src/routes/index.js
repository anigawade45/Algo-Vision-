const express = require('express');
const authRoutes = require('./auth.routes');
const problemRoutes = require('./problem.routes');
const { successResponse } = require('../utils/apiResponse');

const router = express.Router();

// Health Check API
router.get('/health', (req, res) => {
  return successResponse(res, 200, 'AlgoVision API is running');
});

// Auth Routes
router.use('/auth', authRoutes);

// DSA Problems Routes
router.use('/problems', problemRoutes);

module.exports = router;
