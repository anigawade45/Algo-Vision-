const crypto = require('crypto');
const Problem = require('../models/Problem');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const geminiService = require('./gemini.service');
const { computeProblemHash, canonicalStringify } = require('../utils/problemHash');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
  * Resolves Problem by slug or ObjectId and verifies user access rights
  */
const resolveProblemAndCheckAccess = async (problemIdOrSlug, userId) => {
  if (!problemIdOrSlug) {
    throw new AppError('Problem identifier is required', 400);
  }

  const idStr = String(problemIdOrSlug).trim();
  const normalizedSlug = idStr.toLowerCase();

  let problem = await Problem.findOne({ problemId: normalizedSlug });

  if (!problem && /^[0-9a-fA-F]{24}$/.test(idStr)) {
    problem = await Problem.findById(idStr);
  }

  if (!problem) {
    throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
  }

  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to access pseudocode for this private problem', 403);
  }

  return problem;
};

/**
 * Computes deterministic SHA-256 hash for Pattern selection and Approach metadata
 */
const computePatternHash = (patternDoc, approachId, approachName) => {
  const payload = {
    approachId: String(approachId || '').trim(),
    approachName: String(approachName || '').trim(),
    patternName: patternDoc?.pattern?.name || '',
    solutionFamilies: (patternDoc?.solutionFamilies?.families || []).map((f) => ({
      id: f.id,
      name: f.name,
    })),
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

/**
 * Validates requested approachId against problem and pattern options
 */
const validateApproach = async (problem, approachId, requestedApproachName, userId) => {
  // Try fetching pattern document for problem to see valid solution families
  const patternDoc = await ProblemPattern.findOne({ problemId: problem._id });

  let rawApproachId = (approachId && typeof approachId === 'string' && approachId.trim()) || '';
  if (rawApproachId === 'null' || rawApproachId === 'undefined') {
    rawApproachId = '';
  }

  let normalizedApproachId = rawApproachId;
  let resolvedApproachName = requestedApproachName || '';

  if (!normalizedApproachId && userId) {
    const existingPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId }).sort({ updatedAt: -1 });
    if (existingPseudo?.approachId) {
      normalizedApproachId = existingPseudo.approachId;
      resolvedApproachName = resolvedApproachName || existingPseudo.approachName;
    }
  }

  if (!normalizedApproachId && patternDoc?.solutionFamilies?.families?.length > 0) {
    normalizedApproachId = patternDoc.solutionFamilies.families[0].id;
  }

  if (!normalizedApproachId && problem.defaultApproachId) {
    normalizedApproachId = problem.defaultApproachId;
  }

  if (!normalizedApproachId) {
    normalizedApproachId = 'default';
  }

  let approachName = resolvedApproachName || normalizedApproachId;

  if (patternDoc?.solutionFamilies?.families?.length > 0) {
    const matchedFamily = patternDoc.solutionFamilies.families.find(
      (f) => String(f.id).toLowerCase() === normalizedApproachId.toLowerCase()
    );

    if (matchedFamily) {
      approachName = matchedFamily.name || approachName;
    }
  }

  return {
    approachId: normalizedApproachId,
    approachName,
    patternDoc,
  };
};

/**
 * Strips markdown fences and parses raw JSON string safely
 */
const parseJsonSafely = (rawText) => {
  if (typeof rawText !== 'string') return rawText;
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Pseudocode Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

/**
 * Validates and normalizes Gemini AI response against strict Stage 05 Pseudocode schema contract
 */
const validateAndNormalizePseudocodeData = (rawData, problem, approachId, approachName) => {
  const parsed = parseJsonSafely(rawData);

  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('AI response must be a structured JSON object', 502);
  }

  // Strict Approach Enforcement Validation
  if (parsed.approachId && String(parsed.approachId).toLowerCase() !== String(approachId).toLowerCase()) {
    console.warn(`[Pseudocode Service] Approach mismatch: requested "${approachId}", Gemini returned "${parsed.approachId}"`);
    // Reject response if Gemini attempted to switch the approach
    throw new AppError(`AI generated pseudocode for approach "${parsed.approachId}" instead of locked approach "${approachId}".`, 502);
  }

  const lines = Array.isArray(parsed.lines) ? parsed.lines : [];

  if (lines.length === 0) {
    throw new AppError('AI response missing valid pseudocode lines array', 502);
  }

  // Normalize lines to ensure stable sequential 1-based numbering
  const validLineTypes = [
    'start',
    'instruction',
    'loop',
    'condition',
    'return',
    'end',
    'comment',
    'initialization',
    'operation',
    'update',
    'call',
  ];

  const normalizedLines = lines.map((item, idx) => {
    const lineNum = idx + 1;
    const rawType = String(item?.type || 'instruction').toLowerCase();
    const type = validLineTypes.includes(rawType) ? rawType : 'instruction';
    const text = String(item?.text || '').trim();
    const explanation = String(item?.explanation || '').trim();
    const indent = Boolean(item?.indent || item?.indentLevel > 0);
    const indentLevel = typeof item?.indentLevel === 'number' ? Math.max(0, item.indentLevel) : (indent ? 1 : 0);

    if (!text) {
      throw new AppError(`Pseudocode line ${lineNum} is missing text content`, 502);
    }

    return {
      line: lineNum,
      type,
      text,
      explanation,
      indent,
      indentLevel,
    };
  });

  const walkthrough = Array.isArray(parsed.walkthrough)
    ? parsed.walkthrough.map((step, idx) => ({
        stepNo: String(step?.stepNo || String(idx + 1).padStart(2, '0')).trim(),
        action: String(step?.action || '').trim(),
        why: String(step?.why || '').trim(),
      }))
    : [];

  const decisions = Array.isArray(parsed.decisions)
    ? parsed.decisions.map((dec) => ({
        condition: String(dec?.condition || '').trim(),
        yes: String(dec?.yes || '').trim(),
        no: String(dec?.no || '').trim(),
      }))
    : [];

  return {
    approachId,
    approachName: parsed.approachName || approachName,
    approachContext: parsed.approachContext || `Pseudocode generated for the selected ${approachName} approach.`,
    intro: {
      eyebrow: parsed.intro?.eyebrow || '06 · PSEUDOCODE',
      title: parsed.intro?.title || 'Turn the chosen algorithm into clear, step-by-step logic.',
      subtitle: parsed.intro?.subtitle || 'Before writing code, describe exactly what the algorithm needs to do.',
    },
    lines: normalizedLines,
    walkthrough,
    decisions,
    takeaway: {
      statement: parsed.takeaway?.statement || 'Your algorithm is now expressed as language-independent steps.',
      subtitle: parsed.takeaway?.subtitle || 'The algorithm defines the approach. Pseudocode turns that approach into precise steps.',
    },
  };
};

/**
 * Gets stored pseudocode for a specific problem, user, and approach
 */
const getPseudocode = async (problemIdOrSlug, userId, approachId) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(problem, approachId, null, userId);

  const existing = await ProblemPseudocode.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
  });

  if (!existing) {
    return { pseudocode: null, problem, approachId: validatedApproachId, approachName };
  }

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);

  const isProblemStale = existing.sourceProblemHash !== currentProblemHash;
  const isPatternStale = existing.sourcePatternHash !== currentPatternHash;
  const isStale = isProblemStale || isPatternStale;

  return {
    pseudocode: existing,
    stale: isStale,
    problem,
    approachId: validatedApproachId,
    approachName,
  };
};

/**
 * Generates pseudocode for a specific problem and selected approach via Gemini AI
 */
const generatePseudocode = async (problemIdOrSlug, userId, approachId, requestedApproachName) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(
    problem,
    approachId,
    requestedApproachName,
    userId
  );

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);

  // Check existing fresh pseudocode document
  const existing = await ProblemPseudocode.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
  });

  if (
    existing &&
    existing.sourceProblemHash === currentProblemHash &&
    existing.sourcePatternHash === currentPatternHash &&
    existing.generationStatus === 'generated'
  ) {
    return existing;
  }

  // Call Gemini API to generate Stage 05 Pseudocode
  const { rawText, model, promptVersion } = await geminiService.generateStage05PseudocodeContent(
    problem,
    validatedApproachId,
    approachName
  );

  const normalized = validateAndNormalizePseudocodeData(rawText, problem, validatedApproachId, approachName);

  const pseudocodeData = {
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
    approachName,
    approachContext: normalized.approachContext,
    intro: normalized.intro,
    lines: normalized.lines,
    walkthrough: normalized.walkthrough,
    decisions: normalized.decisions,
    takeaway: normalized.takeaway,
    sourceProblemHash: currentProblemHash,
    sourcePatternHash: currentPatternHash,
    generatedBy: 'gemini',
    model,
    promptVersion,
    generationStatus: 'generated',
    generatedAt: new Date(),
  };

  const updatedDoc = await ProblemPseudocode.findOneAndUpdate(
    {
      problemId: problem._id,
      userId,
      approachId: validatedApproachId,
    },
    pseudocodeData,
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updatedDoc;
};

/**
 * Forces regeneration of pseudocode for a specific problem and approach via Gemini AI
 */
const regeneratePseudocode = async (problemIdOrSlug, userId, approachId, requestedApproachName) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(
    problem,
    approachId,
    requestedApproachName,
    userId
  );

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);

  const { rawText, model, promptVersion } = await geminiService.generateStage05PseudocodeContent(
    problem,
    validatedApproachId,
    approachName
  );

  const normalized = validateAndNormalizePseudocodeData(rawText, problem, validatedApproachId, approachName);

  const pseudocodeData = {
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
    approachName,
    approachContext: normalized.approachContext,
    intro: normalized.intro,
    lines: normalized.lines,
    walkthrough: normalized.walkthrough,
    decisions: normalized.decisions,
    takeaway: normalized.takeaway,
    sourceProblemHash: currentProblemHash,
    sourcePatternHash: currentPatternHash,
    generatedBy: 'gemini',
    model,
    promptVersion,
    generationStatus: 'generated',
    generatedAt: new Date(),
  };

  const updatedDoc = await ProblemPseudocode.findOneAndUpdate(
    {
      problemId: problem._id,
      userId,
      approachId: validatedApproachId,
    },
    pseudocodeData,
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return updatedDoc;
};

module.exports = {
  AppError,
  getPseudocode,
  generatePseudocode,
  regeneratePseudocode,
};
