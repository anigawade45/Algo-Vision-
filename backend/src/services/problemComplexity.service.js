const ProblemComplexity = require('../models/ProblemComplexity');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemAlgorithm = require('../models/ProblemAlgorithm');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const ProblemCode = require('../models/ProblemCode');
const geminiService = require('./gemini.service');
const { AppError } = require('./gemini.service');
const { resolveProblemAndCheckAccess } = require('./problemUnderstanding.service');

const crypto = require('crypto');
const { computeProblemHash, canonicalStringify } = require('../utils/problemHash');

const computePatternHash = (patternDoc, approachId, approachName) => {
  const payload = {
    approachId: String(approachId || '').trim(),
    approachName: String(approachName || '').trim(),
    patternName: patternDoc?.pattern?.name || '',
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

const computeAlgorithmHash = (algorithmDoc) => {
  const payload = {
    steps: algorithmDoc?.steps || []
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

const computePseudocodeHash = (pseudocodeDoc) => {
  const payload = {
    lines: pseudocodeDoc?.lines || []
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

const computeCodeHash = (codeDoc) => {
  const payload = {
    cpp: codeDoc?.cpp || '',
    java: codeDoc?.java || '',
    python: codeDoc?.python || ''
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
  
  const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) {
    cleaned = match[1].trim();
  } else {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  cleaned = cleaned.replace(/\\'/g, "'");
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Complexity Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

const getComplexity = async (problemIdOrSlug, userId, approachId, requestedApproachName) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName } = await validateApproach(problem, approachId, requestedApproachName, userId);

  const existing = await ProblemComplexity.findOne({
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
  });

  const isStale = existing && existing.generationStatus === 'failed';
  return { complexity: existing, stale: isStale, problem, approachId: validatedApproachId, approachName };
};

const generateComplexity = async (problemIdOrSlug, userId, approachId, requestedApproachName) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId: validatedApproachId, approachName, patternDoc } = await validateApproach(problem, approachId, requestedApproachName, userId);
  
  const query = { problemId: problem._id, userId, approachId: validatedApproachId };
  
  const algorithmDoc = await ProblemAlgorithm.findOne(query);
  const pseudocodeDoc = await ProblemPseudocode.findOne(query);
  const codeDoc = await ProblemCode.findOne(query);

  if (!algorithmDoc || !pseudocodeDoc) {
    throw new AppError('Algorithm and Pseudocode must be generated before complexity analysis', 400);
  }

  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, validatedApproachId, approachName);
  const currentAlgorithmHash = computeAlgorithmHash(algorithmDoc);
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);
  const currentCodeHash = codeDoc ? computeCodeHash(codeDoc) : null;

  const existing = await ProblemComplexity.findOne(query);

  if (
    existing &&
    existing.sourceProblemHash === currentProblemHash &&
    existing.sourcePatternHash === currentPatternHash &&
    existing.sourceAlgorithmHash === currentAlgorithmHash &&
    existing.sourcePseudocodeHash === currentPseudocodeHash &&
    existing.sourceCodeHash === currentCodeHash &&
    existing.generationStatus === 'generated'
  ) {
    return existing;
  }

  const { rawText, model, promptVersion } = await geminiService.generateStage10ComplexityContent(
    problem,
    validatedApproachId,
    approachName,
    patternDoc,
    algorithmDoc,
    pseudocodeDoc,
    codeDoc ? JSON.stringify({ cpp: codeDoc.cpp, java: codeDoc.java, python: codeDoc.python }, null, 2) : null
  );

  const parsed = parseJsonSafely(rawText);
  if (!parsed || typeof parsed !== 'object' || !parsed.time || !parsed.space) {
    throw new AppError('AI response must be a structured JSON object with time and space properties', 502);
  }

  if (!Array.isArray(parsed.time.steps) || parsed.time.steps.length !== 3 ||
      !Array.isArray(parsed.space.steps) || parsed.space.steps.length !== 3) {
    throw new AppError('Complexity analysis must contain exactly 3 steps for both time and space', 502);
  }

  const complexityData = {
    problemId: problem._id,
    userId,
    approachId: validatedApproachId,
    approachName,
    time: parsed.time,
    space: parsed.space,
    sourceProblemHash: currentProblemHash,
    sourcePatternHash: currentPatternHash,
    sourceAlgorithmHash: currentAlgorithmHash,
    sourcePseudocodeHash: currentPseudocodeHash,
    sourceCodeHash: currentCodeHash,
    generatedBy: 'gemini',
    model,
    promptVersion,
    generationStatus: 'generated',
    generatedAt: new Date(),
  };

  let savedDoc;
  try {
    savedDoc = await ProblemComplexity.create(complexityData);
  } catch (err) {
    if (err.code === 11000) {
      savedDoc = await ProblemComplexity.findOneAndUpdate(
        { problemId: problem._id, userId, approachId: validatedApproachId },
        complexityData,
        { new: true }
      );
    } else {
      throw err;
    }
  }

  return savedDoc;
};

module.exports = {
  getComplexity,
  generateComplexity,
};
