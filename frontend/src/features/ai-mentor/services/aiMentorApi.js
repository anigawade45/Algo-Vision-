const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Sends a chat message to the backend AI Mentor endpoint.
 */
export async function sendMentorMessage({ message, currentPath, pageContext, chatHistory }) {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-mentor/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        currentPath,
        pageContext,
        chatHistory
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const err = new Error(data.error || 'AI Mentor is temporarily unavailable. Please try again later.');
      err.code = data.code;
      err.status = response.status;
      throw err;
    }

    return data;
  } catch (error) {
    console.error('aiMentorApi error:', error.message || error);
    throw error;
  }
}

