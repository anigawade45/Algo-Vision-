const ALGOVISION_KNOWLEDGE_BASE = require('../config/algoVisionKnowledge');
const env = require('../config/env');
const { generateContentWithRetry, classifyError } = require('../services/aiMentor.service');

/**
 * Controller to handle AI Mentor chat interactions.
 * Uses configurable GEMINI_MODEL via server environment settings with automatic retry & error classification.
 */
exports.handleMentorChat = async (req, res) => {
  try {
    const { message, currentPath, pageContext, chatHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required and must be a string.'
      });
    }

    // Server-side API Key resolution
    const apiKey = env.aiMentorApiKey || env.geminiApiKey;

    if (!apiKey) {
      console.error('[AI Mentor] Configuration Error: AI_MENTOR_API_KEY or GEMINI_API_KEY missing in server environment variables.');
      return res.status(401).json({
        success: false,
        error: 'AI Mentor configuration issue. Please contact the administrator.',
        code: 'AI_CONFIGURATION_ERROR'
      });
    }

    // Configurable model name with standard default
    const modelName = env.geminiModel || 'gemini-3.8-flash';

    // Build comprehensive System Prompt
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

    // Construct conversation payload for model
    const contents = [];

    if (Array.isArray(chatHistory)) {
      chatHistory.forEach(item => {
        if (item.sender === 'user' || item.role === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text || item.message }] });
        } else if (item.sender === 'ai' || item.sender === 'model' || item.role === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.text || item.message }] });
        }
      });
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Call service with exponential backoff retries & timeout
    const responseText = await generateContentWithRetry({
      apiKey,
      modelName,
      contents,
      systemInstruction
    });

    return res.status(200).json({
      success: true,
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

