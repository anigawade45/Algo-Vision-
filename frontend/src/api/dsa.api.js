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

/**
 * Retrieve Stage 04 Problem Pattern data
 */
export const getProblemPattern = async (problemId) => {
  return await apiClient.get(`/problems/${problemId}/pattern`);
};

/**
 * Generate Stage 04 Problem Pattern via Gemini AI
 */
export const generateProblemPattern = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/pattern/generate`);
};

/**
 * Force regenerate Stage 04 Problem Pattern via Gemini AI
 */
export const regenerateProblemPattern = async (problemId) => {
  return await apiClient.post(`/problems/${problemId}/pattern/regenerate`);
};

/**
 * Retrieve Stage 05 Problem Algorithm data
 */
export const getProblemAlgorithm = async (problemId, approachId) => {
  const query = approachId ? `?approachId=${approachId}` : '';
  return await apiClient.get(`/problems/${problemId}/algorithm${query}`);
};

/**
 * Generate Stage 05 Problem Algorithm via Gemini AI
 */
export const generateProblemAlgorithm = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${problemId}/algorithm/generate`, { approachId });
};

/**
 * Force regenerate Stage 05 Problem Algorithm via Gemini AI
 */
export const regenerateProblemAlgorithm = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${problemId}/algorithm/regenerate`, { approachId });
};

/**
 * Retrieve Stage 06 Problem Pseudocode data for a specific approach
 */
export const getProblemPseudocode = async (problemId, approachId) => {
  return await apiClient.get(`/problems/${problemId}/pseudocode`, {
    params: { approachId },
  });
};

/**
 * Generate Stage 06 Problem Pseudocode via Gemini AI for a specific approach
 */
export const generateProblemPseudocode = async (problemId, approachId, approachName) => {
  return await apiClient.post(`/problems/${problemId}/pseudocode/generate`, {
    approachId,
    approachName,
  });
};

/**
 * Force regenerate Stage 06 Problem Pseudocode via Gemini AI for a specific approach
 */
export const regenerateProblemPseudocode = async (problemId, approachId, approachName) => {
  return await apiClient.post(`/problems/${problemId}/pseudocode/regenerate`, {
    approachId,
    approachName,
  });
};
