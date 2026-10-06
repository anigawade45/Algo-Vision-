const express = require('express');
const router = express.Router();
const aiMentorController = require('../controllers/aiMentor.controller');

// POST /api/ai-mentor/chat - Send message to AI Mentor
router.post('/chat', aiMentorController.handleMentorChat);

module.exports = router;
