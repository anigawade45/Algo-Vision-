import apiClient from '@/api/apiClient';

/**
 * Sends a chat message to the backend AI Mentor endpoint with persistent conversation context.
 */
export async function sendMentorMessage({ message, conversationId, currentPath, pageContext }) {
  try {
    const data = await apiClient.post('/ai-mentor/chat', {
      message,
      conversationId,
      currentPath,
      pageContext
    });
    return data;
  } catch (error) {
    console.error('aiMentorApi error:', error.message || error);
    throw error;
  }
}

/**
 * Fetches recent user-specific AI Mentor conversation history (latest 10-15).
 */
export async function fetchMentorHistory() {
  try {
    const data = await apiClient.get('/ai-mentor/history');
    return data;
  } catch (error) {
    console.error('fetchMentorHistory error:', error.message || error);
    throw error;
  }
}

/**
 * Fetches an individual AI Mentor conversation by ID.
 */
export async function fetchConversation(conversationId) {
  try {
    const data = await apiClient.get(`/ai-mentor/conversations/${conversationId}`);
    return data;
  } catch (error) {
    console.error('fetchConversation error:', error.message || error);
    throw error;
  }
}

/**
 * Deletes an individual AI Mentor conversation by ID.
 */
export async function deleteConversationApi(conversationId) {
  try {
    const data = await apiClient.delete(`/ai-mentor/conversations/${conversationId}`);
    return data;
  } catch (error) {
    console.error('deleteConversation error:', error.message || error);
    throw error;
  }
}
