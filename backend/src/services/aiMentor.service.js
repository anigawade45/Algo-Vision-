const { GoogleGenAI } = require('@google/genai');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const DEFAULT_FALLBACK_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite'
];

/**
 * Builds candidate model fallback chain based on preferred model.
 */
function getModelFallbackChain(preferredModel) {
  const models = [];
  if (preferredModel && typeof preferredModel === 'string' && preferredModel.trim()) {
    models.push(preferredModel.trim());
  }
  for (const model of DEFAULT_FALLBACK_MODELS) {
    if (!models.includes(model)) {
      models.push(model);
    }
  }
  return models;
}

/**
 * Extracts HTTP status code or Gemini API error code safely from error object.
 */
function extractStatusCode(error) {
  if (!error) return 500;
  if (typeof error.status === 'number') return error.status;
  if (typeof error.code === 'number') return error.code;
  if (typeof error.statusCode === 'number') return error.statusCode;

  const msg = String(error.message || '');
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) return 429;
  if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('high demand') || msg.includes('No capacity available')) return 503;
  if (msg.includes('404') || msg.includes('NOT_FOUND')) return 404;
  if (msg.includes('401') || msg.includes('UNAUTHORIZED')) return 401;
  if (msg.includes('403') || msg.includes('FORBIDDEN')) return 403;
  if (msg.includes('400') || msg.includes('INVALID_ARGUMENT')) return 400;

  return 500;
}

/**
 * Checks if the error indicates daily/free-tier quota exhaustion.
 */
function isQuotaExhaustedError(error) {
  if (!error) return false;
  const status = extractStatusCode(error);
  const msg = (String(error.message || '') + ' ' + JSON.stringify(error)).toLowerCase();

  const containsQuotaKeyword =
    msg.includes('resource_exhausted') ||
    msg.includes('generate_content_free_tier_requests') ||
    msg.includes('quota exceeded') ||
    msg.includes('exceeded your current quota') ||
    msg.includes('quota metric') ||
    msg.includes('free_tier');

  return status === 429 || containsQuotaKeyword;
}

/**
 * Parses retry delay if provided in error object/message (in ms).
 */
function parseRetryDelayMs(error) {
  if (!error) return null;
  const msg = String(error.message || '');

  if (typeof error.retryDelay === 'number') return error.retryDelay;
  if (typeof error.retryDelay === 'string') {
    const match = error.retryDelay.match(/(\d+)s?/);
    if (match) return parseInt(match[1], 10) * 1000;
  }

  const secMatch = msg.match(/retry in (?:approximately )?(\d+) seconds/i);
  if (secMatch) return parseInt(secMatch[1], 10) * 1000;

  const minMatch = msg.match(/retry in (?:approximately )?(\d+) minutes/i);
  if (minMatch) return parseInt(minMatch[1], 10) * 60 * 1000;

  const hourMatch = msg.match(/retry in (?:approximately )?(\d+) hours/i);
  if (hourMatch) return parseInt(hourMatch[1], 10) * 60 * 60 * 1000;

  return null;
}

/**
 * Checks whether an error is transient/retryable (strictly 503 or transient network errors).
 */
function isRetryableError(error) {
  if (isQuotaExhaustedError(error)) {
    return false;
  }

  const status = extractStatusCode(error);

  if (status === 400 || status === 401 || status === 403 || status === 404 || status === 429) {
    return false;
  }

  if (status === 503) {
    return true;
  }

  const msg = String(error.message || '').toUpperCase();
  if (
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('FETCH FAILED') ||
    msg.includes('SOCKET HANG UP') ||
    msg.includes('TIMEOUT')
  ) {
    return true;
  }

  return false;
}

/**
 * Creates a normalized structured Error object with friendly user message.
 */
function createStructuredError(error) {
  if (isQuotaExhaustedError(error)) {
    const err = new Error('AI Mentor is temporarily unavailable because the Gemini API quota has been reached. Please try again later.');
    err.code = 'AI_RATE_LIMITED';
    err.status = 429;
    return err;
  }

  const status = extractStatusCode(error);

  if (status === 503) {
    const err = new Error('AI Mentor is temporarily unavailable due to high server demand. Please try again in a few seconds.');
    err.code = 'AI_TEMPORARILY_UNAVAILABLE';
    err.status = 503;
    return err;
  }

  if (status === 401 || status === 403) {
    const err = new Error('AI Mentor configuration issue. Please contact the administrator.');
    err.code = 'AI_CONFIGURATION_ERROR';
    err.status = status;
    return err;
  }

  if (status === 404 || status === 400) {
    const err = new Error('AI Mentor request could not be processed due to invalid model configuration.');
    err.code = 'AI_MODEL_ERROR';
    err.status = 400;
    return err;
  }

  const err = new Error('Unable to process your AI Mentor request right now.');
  err.code = 'AI_MENTOR_ERROR';
  err.status = 500;
  return err;
}

/**
 * Classifies an error into friendly API response code & message.
 */
function classifyError(error) {
  if (error && error.code && error.status) {
    return {
      httpStatus: error.status,
      code: error.code,
      userMessage: error.message
    };
  }

  const structured = createStructuredError(error);
  return {
    httpStatus: structured.status,
    code: structured.code,
    userMessage: structured.message
  };
}

/**
 * Single model generation attempt with 1 quick retry for transient errors.
 */
async function generateSingleModelAttempt({ ai, modelName, contents, systemInstruction }) {
  const maxModelAttempts = 2;
  const attemptTimeoutMs = 15000;
  let lastError = null;

  for (let attempt = 1; attempt <= maxModelAttempts; attempt++) {
    try {
      console.log(`[AI Mentor] Requesting model: ${modelName} (Attempt ${attempt}/${maxModelAttempts})`);

      const generatePromise = ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: { systemInstruction }
      });

      generatePromise.catch(() => {});

      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
          reject(new Error(`ETIMEDOUT: Request to ${modelName} timed out after ${attemptTimeoutMs}ms`));
        }, attemptTimeoutMs);
      });

      let response;
      try {
        response = await Promise.race([generatePromise, timeoutPromise]);
      } finally {
        clearTimeout(timer);
      }

      const text = response?.text || '';
      return text;
    } catch (err) {
      lastError = err;
      const status = extractStatusCode(err);

      if (status === 401 || status === 403) {
        throw createStructuredError(err);
      }

      if (attempt < maxModelAttempts && isRetryableError(err)) {
        console.log(`[AI Mentor] Model ${modelName} encountered transient ${status}. Retrying model in 800ms...`);
        await sleep(800);
      }
    }
  }

  throw lastError;
}

/**
 * Main entry point: Executes Gemini content generation with multi-model dynamic fallback.
 * Tries models in priority order: preferred model -> gemini-3.8-flash -> gemini-3.7-flash -> gemini-3.6-flash -> gemini-3.5-flash -> gemini-3.5-flash-lite -> gemini-3.1-flash-lite
 */
async function generateContentWithRetry({ apiKey, modelName, contents, systemInstruction }) {
  const ai = new GoogleGenAI({ apiKey });
  const modelChain = getModelFallbackChain(modelName);

  let lastError = null;

  for (let i = 0; i < modelChain.length; i++) {
    const currentModel = modelChain[i];

    try {
      const responseText = await generateSingleModelAttempt({
        ai,
        modelName: currentModel,
        contents,
        systemInstruction
      });

      console.log(`[AI Mentor] Successfully generated response using model: ${currentModel}`);
      return responseText;

    } catch (err) {
      lastError = err;
      const status = extractStatusCode(err);

      if (status === 401 || status === 403) {
        throw createStructuredError(err);
      }

      console.warn(
        `[AI Mentor] Model ${currentModel} failed (Status: ${status}). ${
          i < modelChain.length - 1 ? `Falling back to next model (${modelChain[i + 1]})...` : 'No more fallback models available.'
        }`
      );
    }
  }

  throw createStructuredError(lastError);
}

module.exports = {
  generateContentWithRetry,
  classifyError,
  extractStatusCode,
  isRetryableError,
  isQuotaExhaustedError,
  createStructuredError,
  getModelFallbackChain
};


