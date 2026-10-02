import apiClient from './apiClient';

/**
 * Fetch list of published DSA problems with optional query filters
 */
export const getProblems = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = query ? `/problems?${query}` : '/problems';
  return await apiClient.get(url);
};

/**
 * Fetch DSA problems created by the currently authenticated user
 */
export const getMyProblems = async () => {
  return await apiClient.get('/problems/mine');
}; 

/**
 * Fetch distinct DSA problem categories
 */
export const getProblemCategories = async () => {
  return await apiClient.get('/problems/categories');
};

/**
 * Fetch single DSA problem by ID or slug
 */
export const getProblemById = async (idOrSlug) => {
  return await apiClient.get(`/problems/${idOrSlug}`);
};

export const getProblem = getProblemById;

/**
 * Create / upload a new DSA problem via form
 */
export const createProblem = async (problemData) => {
  return await apiClient.post('/problems', problemData);
};

/**
 * Retrieve user's workspace state for a problem
 */
export const getProblemWorkspace = async (problemId) => {
  return await apiClient.get(`/problems/${problemId}/workspace`);
};

/**
 * Initialize workspace state for a problem
 */
export const createProblemWorkspace = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/workspace`);
};

/**
 * Update user's workspace state (currentStage / completedStages)
 */
export const updateProblemWorkspace = async (problemId, data) => {
  return await apiClient.patch(`/problems/${problemId}/workspace`, data);
};

/**
 * Retrieve Stage 02 Problem Understanding data
 */
export const getProblemUnderstanding = async (problemId) => {
  return await apiClient.get(`/problems/${problemId}/understanding`);
};

/**
 * Generate Stage 02 Problem Understanding via Gemini AI
 */
export const generateProblemUnderstanding = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/understanding/generate`);
};

/**
 * Force regenerate Stage 02 Problem Understanding via Gemini AI
 */
export const regenerateProblemUnderstanding = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/understanding/regenerate`);
};

/**
 * Retrieve Stage 03 Problem Analogy data
 */
export const getProblemAnalogy = async (problemId) => {
  return await apiClient.get(`/problems/${problemId}/analogy`);
};

/**
 * Generate Stage 03 Problem Analogy via Gemini AI
 */
export const generateProblemAnalogy = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/analogy/generate`);
};

/**
 * Force regenerate Stage 03 Problem Analogy via Gemini AI
 */
export const regenerateProblemAnalogy = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/analogy/regenerate`);
};


