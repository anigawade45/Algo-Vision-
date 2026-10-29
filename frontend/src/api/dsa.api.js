import apiClient from './apiClient';

/**
 * Safely encodes URL path parameters and guards against empty/missing identifiers
 */
const encodePathParam = (value) => {
  if (value == null || String(value).trim() === '') {
    throw new Error('Problem ID or slug is required.');
  }
  return encodeURIComponent(String(value).trim());
};

/**
 * Fetch list of published DSA problems with optional query filters
 */
export const getProblems = async (params = {}) => {
  return await apiClient.get('/problems', { params });
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
  return await apiClient.get(`/problems/${encodePathParam(idOrSlug)}`);
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
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/workspace`);
};

/**
 * Initialize workspace state for a problem
 */
export const createProblemWorkspace = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/workspace`);
};

/**
 * Update user's workspace state (currentStage / completedStages)
 */
export const updateProblemWorkspace = async (problemId, data) => {
  return await apiClient.patch(`/problems/${encodePathParam(problemId)}/workspace`, data);
};

/**
 * Retrieve Stage 02 Problem Understanding data
 */
export const getProblemUnderstanding = async (problemId) => {
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/understanding`);
};

/**
 * Generate Stage 02 Problem Understanding via Gemini AI
 */
export const generateProblemUnderstanding = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/understanding/generate`);
};

/**
 * Force regenerate Stage 02 Problem Understanding via Gemini AI
 */
export const regenerateProblemUnderstanding = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/understanding/regenerate`);
};

/**
 * Retrieve Stage 03 Problem Analogy data
 */
export const getProblemAnalogy = async (problemId) => {
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/analogy`);
};

/**
 * Generate Stage 03 Problem Analogy via Gemini AI
 */
export const generateProblemAnalogy = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/analogy/generate`);
};

/**
 * Force regenerate Stage 03 Problem Analogy via Gemini AI
 */
export const regenerateProblemAnalogy = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/analogy/regenerate`);
};

/**
 * Retrieve Stage 04 Problem Pattern data
 */
export const getProblemPattern = async (problemId) => {
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/pattern`);
};

/**
 * Generate Stage 04 Problem Pattern via Gemini AI
 */
export const generateProblemPattern = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/pattern/generate`);
};

/**
 * Force regenerate Stage 04 Problem Pattern via Gemini AI
 */
export const regenerateProblemPattern = async (problemId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/pattern/regenerate`);
};

/**
 * Retrieve Stage 05 Problem Algorithm data
 */
export const getProblemAlgorithm = async (problemId, approachId) => {
  const params = {};
  if (approachId) params.approachId = approachId;
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/algorithm`, { params });
};

/**
 * Generate Stage 05 Problem Algorithm via Gemini AI
 */
export const generateProblemAlgorithm = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/algorithm/generate`, { approachId });
};

/**
 * Force regenerate Stage 05 Problem Algorithm via Gemini AI
 */
export const regenerateProblemAlgorithm = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/algorithm/regenerate`, { approachId });
};

/**
 * Retrieve Stage 06 Problem Pseudocode data for a specific approach
 */
export const getProblemPseudocode = async (problemId, approachId) => {
  const params = {};
  if (approachId) params.approachId = approachId;
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/pseudocode`, { params });
};

/**
 * Generate Stage 06 Problem Pseudocode via Gemini AI for a specific approach
 */
export const generateProblemPseudocode = async (problemId, approachId, approachName) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/pseudocode/generate`, {
    approachId,
    approachName,
  });
};

/**
 * Force regenerate Stage 06 Problem Pseudocode via Gemini AI for a specific approach
 */
export const regenerateProblemPseudocode = async (problemId, approachId, approachName) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/pseudocode/regenerate`, {
    approachId,
    approachName,
  });
};

/**
 * Retrieve Stage 08 Dry Run execution trace data for a specific approach and testCase
 */
export const getProblemDryRun = async (problemId, approachId, testCaseId) => {
  const params = {};
  if (approachId) params.approachId = approachId;
  if (testCaseId !== undefined && testCaseId !== null) params.testCaseId = testCaseId;
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/dry-run`, { params });
};

/**
 * Generate Stage 08 Dry Run execution trace via Gemini AI for a specific approach and testCase
 */
export const generateProblemDryRun = async (problemId, { approachId, testCaseId }) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/dry-run/generate`, {
    approachId,
    testCaseId,
  });
};

/**
 * Force regenerate Stage 08 Dry Run execution trace via Gemini AI for a specific approach and testCase
 */
export const regenerateProblemDryRun = async (problemId, { approachId, testCaseId }) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/dry-run/regenerate`, {
    approachId,
    testCaseId,
  });
};

/**
 * Retrieve Stage 11 Practice Knowledge Check quiz data for a specific approach
 */
export const getProblemPractice = async (problemId, approachId) => {
  const params = {};
  if (approachId) params.approachId = approachId;
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/practice`, { params });
};

/**
 * Generate Stage 11 Practice Knowledge Check quiz via Gemini AI for a specific approach
 */
export const generateProblemPractice = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/practice/generate`, {
    approachId,
  });
};

/**
 * Force regenerate Stage 11 Practice Knowledge Check quiz via Gemini AI for a specific approach
 */
export const regenerateProblemPractice = async (problemId, approachId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/practice/regenerate`, {
    approachId,
  });
};

/**
 * Retrieve Stage 09 Visualization validated execution trace data for a specific approach and testCase
 */
export const getProblemVisualization = async (problemId, approachId, testCaseId) => {
  const params = {};
  if (approachId) params.approachId = approachId;
  if (testCaseId !== undefined && testCaseId !== null) params.testCaseId = testCaseId;
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/visualization`, { params });
};

/**
 * Generate Stage 09 Visualization execution trace via Gemini AI for a specific approach and testCase
 */
export const generateProblemVisualization = async (problemId, approachId, testCaseId) => {
  return await apiClient.post(`/problems/${encodePathParam(problemId)}/visualization/generate`, {
    approachId,
    testCaseId,
  });
};

/**
 * Retrieve or generate validated Stage 09 Generic Visualization Plan from Gemini AI
 */
export const getProblemVisualizationPlan = async (problemId, options = {}) => {
  return await apiClient.get(`/problems/${encodePathParam(problemId)}/visualization/plan`, {
    params: {
      bypassCache: options.bypassCache || false,
    },
  });
};



