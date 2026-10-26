const crypto = require('crypto');
const Problem = require('../models/Problem');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const ProblemCode = require('../models/ProblemCode');
const geminiService = require('./gemini.service');
const { computeProblemHash, canonicalStringify } = require('../utils/problemHash');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const resolveProblemAndCheckAccess = async (problemIdOrSlug, userId) => {
  if (!problemIdOrSlug) throw new AppError('Problem identifier is required', 400);
  const normalizedSlug = String(problemIdOrSlug).trim().toLowerCase();
  let problem = await Problem.findOne({ problemId: normalizedSlug });
  if (!problem && problemIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    problem = await Problem.findById(problemIdOrSlug);
  }
  if (!problem) throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
  
  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to access code for this private problem', 403);
  }
  return problem;
};

const computePatternHash = (patternDoc, approachId, approachName) => {
  const payload = {
    approachId: String(approachId || '').trim(),
    approachName: String(approachName || '').trim(),
    patternName: patternDoc?.pattern?.name || '',
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

const computePseudocodeHash = (pseudocodeDoc) => {
  const payload = {
    lines: pseudocodeDoc?.lines || []
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

const validateApproach = async (problem, approachId, requestedApproachName, userId) => {
  const patternDoc = await ProblemPattern.findOne({ problemId: problem._id });
  let normalizedApproachId = (approachId && typeof approachId === 'string' && approachId.trim()) || '';
  let resolvedApproachName = requestedApproachName || '';

  if (userId) {
    if (!normalizedApproachId || normalizedApproachId === 'null' || normalizedApproachId === 'undefined') {
      const existingPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId }).sort({ updatedAt: -1 });
      if (existingPseudo?.approachId) {
        normalizedApproachId = existingPseudo.approachId;
        resolvedApproachName = resolvedApproachName || existingPseudo.approachName;
      }
    } else {
      // If approachId was specified (e.g. 'fam_1') but user has no pseudocode for it,
      // check if user generated pseudocode under a different approach (e.g. 'fam_2')
      const exactPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId, approachId: normalizedApproachId });
      if (!exactPseudo) {
        const anyPseudo = await ProblemPseudocode.findOne({ problemId: problem._id, userId }).sort({ updatedAt: -1 });
        if (anyPseudo?.approachId) {
          normalizedApproachId = anyPseudo.approachId;
          resolvedApproachName = resolvedApproachName || anyPseudo.approachName;
        }
      }
    }
  }

  if (!normalizedApproachId || normalizedApproachId === 'null' || normalizedApproachId === 'undefined') {
    normalizedApproachId = patternDoc?.solutionFamilies?.families?.[0]?.id || problem.defaultApproachId || 'default';
  }

  let approachName = resolvedApproachName || normalizedApproachId;
  if (patternDoc?.solutionFamilies?.families?.length > 0) {
    const matchedFamily = patternDoc.solutionFamilies.families.find(
      (f) => String(f.id).toLowerCase() === normalizedApproachId.toLowerCase()
    );
    if (matchedFamily) approachName = matchedFamily.name || approachName;
  }
  return { approachId: normalizedApproachId, approachName, patternDoc };
};

const parseJsonSafely = (rawText) => {
  if (typeof rawText !== 'string') return rawText;
  let cleaned = rawText.trim();
  // Try to extract from markdown blocks first
  const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    cleaned = match[1].trim();
  } else {
    // Fallback to first { and last } if no markdown block
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  // Fix common invalid JSON escape sequences that LLMs generate (like \')
  cleaned = cleaned.replace(/\\'/g, "'");

  // Fix trailing commas
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Code Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

const getCode = async (problemIdOrSlug, userId, approachId) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(problem, approachId, null, userId);

  const existing = await ProblemCode.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
  });

  if (!existing) {
    return { code: null, problem, approachId: validatedApproachId, approachName };
  }

  const pseudocodeDoc = await ProblemPseudocode.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId
  });

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);

  const isStale = existing.sourceProblemHash !== currentProblemHash || 
                  existing.sourcePatternHash !== currentPatternHash || 
                  existing.sourcePseudocodeHash !== currentPseudocodeHash;

  return { code: existing, stale: isStale, problem, approachId: validatedApproachId, approachName };
};

const generateCode = async (problemIdOrSlug, userId, approachId, requestedApproachName) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(problem, approachId, requestedApproachName, userId);
  
  const query = {
    problemId: problem._id,
    userId,
    approachId: validatedApproachId
  };
  console.log('[DEBUG] Searching ProblemPseudocode with query:', query);

  const pseudocodeDoc = await ProblemPseudocode.findOne(query);

  if (!pseudocodeDoc) {
    console.log('[DEBUG] ProblemPseudocode NOT FOUND. Exists in DB?', await ProblemPseudocode.find({ problemId: problem._id }));
    throw new AppError('Pseudocode must be generated before code generation', 400);
  }

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);

  const existing = await ProblemCode.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
  });

  if (
    existing &&
    existing.sourceProblemHash === currentProblemHash &&
    existing.sourcePatternHash === currentPatternHash &&
    existing.sourcePseudocodeHash === currentPseudocodeHash &&
    existing.generationStatus === 'generated'
  ) {
    return existing;
  }

  const { rawText, model, promptVersion } = await geminiService.generateStage06CodeContent(
    problem,
    { id: validatedApproachId, name: approachName, patternName: patternDoc?.pattern?.name },
    pseudocodeDoc
  );

  const parsed = parseJsonSafely(rawText);
  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('AI response must be a structured JSON object', 502);
  }

  const codeData = {
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
    approachName,
    intro: parsed.intro || { eyebrow: '06 · CODE' },
    cpp: parsed.cpp || '',
    java: parsed.java || '',
    python: parsed.python || '',
    sourceProblemHash: currentProblemHash,
    sourcePatternHash: currentPatternHash,
    sourcePseudocodeHash: currentPseudocodeHash,
    generatedBy: 'gemini',
    model,
    promptVersion,
    generationStatus: 'generated',
    generatedAt: new Date(),
  };

  const updatedDoc = await ProblemCode.findOneAndUpdate(
    { problemId: problem._id, userId, approachId: validatedApproachId },
    codeData,
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );

  return updatedDoc;
};

const executeCode = async (language, code, input) => {
  try {
    const data = await geminiService.simulateCodeExecution(language, code, input);
    return data;
  } catch (err) {
    console.error('[Execution Service] Error:', err);
    throw new AppError('Failed to execute code: ' + err.message, 500);
  }
};

module.exports = {
  AppError,
  getCode,
  generateCode,
  executeCode,
};
