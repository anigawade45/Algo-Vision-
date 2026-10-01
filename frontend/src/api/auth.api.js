import apiClient from './apiClient';

/**
 * Register a new user account (returns verification prompt notice, NO auto-login)
 */
export const registerUser = async ({ name, email, password }) => {
  return await apiClient.post('/auth/register', { name, email, password });
};

/**
 * Verify user email via token link
 */
export const verifyEmail = async (token) => {
  return await apiClient.get(`/auth/verify-email/${token}`);
};

/**
 * Resend email verification link
 */
export const resendVerification = async (email) => {
  return await apiClient.post('/auth/resend-verification', { email });
};

/**
 * Log in an existing user (requires verified account)
 */
export const loginUser = async ({ email, password }) => {
  return await apiClient.post('/auth/login', { email, password });
};

/**
 * Log out current session and clear cookie
 */
export const logoutUser = async () => {
  return await apiClient.post('/auth/logout');
};

/**
 * Fetch current authenticated user session
 */
export const getCurrentUser = async () => {
  return await apiClient.get('/auth/me');
};
