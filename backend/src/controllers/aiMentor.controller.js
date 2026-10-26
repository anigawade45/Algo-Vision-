const mongoose = require('mongoose');
const ALGOVISION_KNOWLEDGE_BASE = require('../config/algoVisionKnowledge');
const env = require('../config/env');
const MentorConversation = require('../models/MentorConversation');
const { generateContentWithRetry, classifyError } = require('../services/aiMentor.service');

function generateConversationTitle(message) {
  const cleaned = message.trim().replace(/[\r\n]+/g, ' ');
  if (cleaned.length <= 35) {
    return cleaned;
  }
  return cleaned.substring(0, 35) + '...';
}

/**
 * Controller to handle AI Mentor chat interactions with persistent user-specific conversations.
 */
exports.handleMentorChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const { message, conversationId, currentPath, pageContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required and cannot be empty.'
      });
    }

    // 1. Resolve or Create User-Scoped Conversation
    let conversation = null;

    if (conversationId) {
      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found.'
        });
      }

      conversation = await MentorConversation.findOne({
        _id: conversationId,
        userId: userId
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          error: 'Conversation not found.'
        });
      }
    } else {
      const title = generateConversationTitle(message);
      conversation = await MentorConversation.create({
        userId: userId,
        title: title,
        messages: []
      });
    }

    // 2. Persist User Message to DB
    conversation.messages.push({
      role: 'user',
      content: message.trim()
    });
    await conversation.save();

    // 3. Resolve API Key & Model Name
    const apiKey = env.aiMentorApiKey || env.geminiApiKey;

    if (!apiKey) {
      console.error('[AI Mentor] Configuration Error: AI_MENTOR_API_KEY or GEMINI_API_KEY missing in server environment variables.');
      return res.status(401).json({
        success: false,
        error: 'AI Mentor configuration issue. Please contact the administrator.',
        code: 'AI_CONFIGURATION_ERROR'
      });
    }

    const modelName = env.geminiModel || 'gemini-3.8-flash';

    // 4. Build System Prompt & Conversation History for Gemini
    const systemInstruction = `
You are "AI Mentor", an encouraging, world-class Computer Science Professor and Interactive Guide inside the AlgoVision learning application.

YOUR DOMAINS OF EXPERTISE:
1. Data Structures & Algorithms (DSA): Time/space complexity analysis (Big-O), arrays, linked lists, trees, graphs, sorting, searching, DP, greedy, etc.
2. Operating Systems (OS): Scheduling, synchronization (Mutex/Semaphores), Deadlocks (Banker's algorithm, RAG), Paging, Segmentation, Page Replacement, Disk Scheduling.
3. Computer Networks (CN): OSI & TCP/IP models, TCP 3-way handshake, HTTP/HTTPS, DNS, IP Subnetting, Socket programming.
4. System Design: Scalability, Load Balancers, SQL vs NoSQL, Caching (Redis), Message Queues (Kafka), CAP Theorem, Microservices.
5. AlgoVision Platform Navigation & Controls: Step-by-step visualizers, playback controls, Monaco Code Lab IDE (JS, C++, Java, Python), sync visualizer data feature ("⚡ Use Current Visualizer Input"), complexity tables.

ALGOVISION PLATFORM KNOWLEDGE BASE:
${JSON.stringify(ALGOVISION_KNOWLEDGE_BASE, null, 2)}

CURRENT USER CONTEXT AT THIS MOMENT:
- Active Route/Page: "${currentPath || '/dashboard'}"
- Visualizer/Page Details: ${JSON.stringify(pageContext || {})}

GUIDELINES FOR YOUR RESPONSES:
- If the user asks about how to use AlgoVision or where a feature is located on their current page, use the Knowledge Base and Active Route to provide clear step-by-step UI instructions.
- If the user asks a CS, DSA, OS, CN, or System Design question, provide a structured, crystal-clear explanation using Markdown formatting, diagrams, or code blocks where helpful.
- Keep tone friendly, supportive, academic yet accessible. Format code cleanly.
`;

    // Extract recent conversation window (last 20 messages) for Gemini payload
    const recentMessages = conversation.messages.slice(-20);
    const contents = recentMessages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    // 5. Call Gemini Service with Multi-Model Retry & Fallback
    const responseText = await generateContentWithRetry({
      apiKey,
      modelName,
      contents,
      systemInstruction
    });

    // 6. Persist Assistant Response to DB
    conversation.messages.push({
      role: 'assistant',
      content: responseText
    });
    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId: conversation._id.toString(),
      title: conversation.title,
      reply: responseText
    });

  } catch (err) {
    const errorDetails = classifyError(err);

    return res.status(errorDetails.httpStatus).json({
      success: false,
      error: errorDetails.userMessage,
      code: errorDetails.code
    });
  }
};

/**
 * Controller to fetch user-specific conversation history (latest 10-15 conversations).
 */
exports.getMentorHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 15, 50);
    const skip = parseInt(req.query.skip, 10) || 0;

    const conversations = await MentorConversation.find({ userId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id title createdAt updatedAt messages');

    const historyList = conversations.map(c => {
      const lastMsg = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
      return {
        _id: c._id.toString(),
        title: c.title || 'New Conversation',
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        messageCount: c.messages.length,
        preview: lastMsg ? lastMsg.content.substring(0, 60) : ''
      };
    });

    return res.status(200).json({
      success: true,
      data: historyList
    });
  } catch (error) {
    console.error('[AI Mentor] Error fetching history:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load conversation history.'
    });
  }
};

/**
 * Controller to fetch an individual user-specific conversation by ID.
 */
exports.getConversationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found.'
      });
    }

    const conversation = await MentorConversation.findOne({
      _id: conversationId,
      userId: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: conversation._id.toString(),
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
        messages: conversation.messages.map(m => ({
          _id: m._id ? m._id.toString() : undefined,
          role: m.role,
          content: m.content,
          createdAt: m.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('[AI Mentor] Error fetching conversation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to load conversation.'
    });
  }
};

/**
 * Controller to delete a user-specific conversation by ID.
 */
exports.deleteConversationById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found.'
      });
    }

    const conversation = await MentorConversation.findOneAndDelete({
      _id: conversationId,
      userId: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully.'
    });
  } catch (error) {
    console.error('[AI Mentor] Error deleting conversation:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete conversation.'
    });
  }
};
