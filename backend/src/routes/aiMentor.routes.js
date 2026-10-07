const express = require('express');
const router = express.Router();
const aiMentorController = require('../controllers/aiMentor.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all AI Mentor endpoints with project authentication middleware
router.use(protect);

// POST /api/ai-mentor/chat - Send message to AI Mentor with persistence
router.post('/chat', aiMentorController.handleMentorChat);

// GET /api/ai-mentor/history - Fetch recent user-specific conversation history
router.get('/history', aiMentorController.getMentorHistory);

// GET /api/ai-mentor/conversations/:conversationId - Fetch specific conversation by ID
router.get('/conversations/:conversationId', aiMentorController.getConversationById);

// DELETE /api/ai-mentor/conversations/:conversationId - Delete specific conversation by ID
router.delete('/conversations/:conversationId', aiMentorController.deleteConversationById);

module.exports = router;
