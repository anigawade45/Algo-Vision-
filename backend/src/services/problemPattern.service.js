const Problem = require('../models/Problem');
const ProblemPattern = require('../models/ProblemPattern');
const geminiService = require('./gemini.service');
const { computeProblemHash } = require('../utils/problemHash');

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
    throw new AppError('You do not have permission to access pattern for this private problem', 403);
  }

  return problem;
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
    console.error('[Pattern Service] JSON parse failed on text:', rawText);
    throw new AppError('AI generated invalid JSON output', 502);
  }
};

/**
 * Validates and normalizes Gemini AI response against strict Stage 04 Pattern schema contract
 */
const validateAndNormalizePatternData = (rawData, problem) => {
  const parsed = parseJsonSafely(rawData);

  if (!parsed || typeof parsed !== 'object') {
    throw new AppError('AI response must be a structured JSON object', 502);
  }

  const {
    intro,
    structure,
    signals,
    abstraction,
    pattern,
    fingerprint,
    solutionFamilies,
    limitations,
    takeaway,
  } = parsed;

  if (!structure || typeof structure !== 'object') {
    throw new AppError('AI response missing structure section', 502);
  }

  if (!pattern || typeof pattern !== 'object' || !pattern.name) {
    throw new AppError('AI response missing valid pattern section', 502);
  }

  return {
    intro: {
      eyebrow: intro?.eyebrow || '04 · PATTERN',
      title: intro?.title || 'Recognize the structure behind the problem.',
      subtitle: intro?.subtitle || 'Before choosing an algorithm, identify the shape of the problem.',
    },
    structure: {
      title: structure?.title || 'Look at what the problem is asking.',
      subtitle: structure?.subtitle || 'Shift attention to structural relationships.',
      inputLabel: String(structure?.inputLabel || 'INPUT STRUCTURE').trim(),
      inputVisual: Array.isArray(structure?.inputVisual) ? structure.inputVisual.map(String) : [],
      targetLabel: String(structure?.targetLabel || 'TARGET CONDITION').trim(),
      targetValue: String(structure?.targetValue || 'REQUIRED OBJECTIVE').trim(),
      coreRelationship: Array.isArray(structure?.coreRelationship)
        ? structure.coreRelationship.map((r) => ({
            label: String(r?.label || '').trim(),
            sub: String(r?.sub || '').trim(),
          })).filter((r) => r.label)
        : [],
    },
    signals: {
      title: signals?.title || 'What stands out?',
      subtitle: signals?.subtitle || 'Identify key structural signals from the problem description.',
      observations: Array.isArray(signals?.observations)
        ? signals.observations.map((obs, idx) => ({
            id: obs?.id || `signal_${idx + 1}`,
            title: obs?.title || `SIGNAL ${String(idx + 1).padStart(2, '0')}`,
            label: String(obs?.label || '').trim(),
            detail: String(obs?.detail || '').trim(),
          })).filter((obs) => obs.label)
        : [],
    },
    abstraction: {
      title: abstraction?.title || 'Abstract the problem.',
      subtitle: abstraction?.subtitle || 'Specific values fade away; the structural relationship remains.',
      concrete: {
        items: Array.isArray(abstraction?.concrete?.items) ? abstraction.concrete.items.map(String) : [],
        target: String(abstraction?.concrete?.target || '').trim(),
      },
      abstractFormula: {
        varA: String(abstraction?.abstractFormula?.varA || 'INPUT').trim(),
        operator: String(abstraction?.abstractFormula?.operator || '➔').trim(),
        varB: String(abstraction?.abstractFormula?.varB || 'RELATION').trim(),
        equals: String(abstraction?.abstractFormula?.equals || '=').trim(),
        result: String(abstraction?.abstractFormula?.result || 'TARGET').trim(),
      },
      statement: String(abstraction?.statement || 'The structural relationship governs the solution.').trim(),
    },
    pattern: {
      name: String(pattern?.name || 'Structural Pattern').trim(),
      tagline: String(pattern?.tagline || 'Identify the core problem shape.').trim(),
      description: String(pattern?.description || '').trim(),
    },
    fingerprint: {
      title: fingerprint?.title || 'Pattern Fingerprint',
      steps: Array.isArray(fingerprint?.steps)
        ? fingerprint.steps.map((st) => ({
            stage: String(st?.stage || '').trim(),
            value: String(st?.value || '').trim(),
          })).filter((st) => st.stage && st.value)
        : [],
    },
    solutionFamilies: {
      title: solutionFamilies?.title || 'Solution Families',
      subtitle: solutionFamilies?.subtitle || 'What approaches should come to mind for this pattern?',
      question: solutionFamilies?.question || 'Which tools or solution families are commonly associated with this problem?',
      families: Array.isArray(solutionFamilies?.families)
        ? solutionFamilies.families.map((fam, idx) => ({
            id: fam?.id || `fam_${idx + 1}`,
            name: String(fam?.name || '').trim(),
            detail: String(fam?.detail || '').trim(),
          })).filter((fam) => fam.name)
        : [],
      note: solutionFamilies?.note || 'Pattern recognition tells us which families of approaches are relevant. Algorithm (Stage 05) will decide which approach to choose.',
    },
    limitations: {
      title: limitations?.title || 'What the Pattern Does NOT Tell Us',
      subtitle: limitations?.subtitle || 'Recognizing a pattern does not tell us the algorithm yet.',
      tellsUs: Array.isArray(limitations?.tellsUs) ? limitations.tellsUs.map(String) : [],
      doesNotTellUs: Array.isArray(limitations?.doesNotTellUs) ? limitations.doesNotTellUs.map(String) : [],
    },
    takeaway: {
      specificProblem: String(takeaway?.specificProblem || problem.title).trim(),
      generalPattern: String(takeaway?.generalPattern || pattern?.name || '').trim(),
      finalStatement: String(takeaway?.finalStatement || 'Focus on structural relationships before writing code.').trim(),
    },
  };
};

/**
 * Retrieve user's stored Stage 04 ProblemPattern (with stale check)
 */
const getPattern = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const patternDoc = await ProblemPattern.findOne({
    problemId: problem._id,
    userId,
  });

  if (patternDoc && patternDoc.sourceProblemHash && patternDoc.sourceProblemHash !== currentHash) {
    console.log(`[Pattern Service] Stale pattern detected for problem "${problem.problemId}". Requesting regeneration.`);
    return {
      problem,
      pattern: null,
      stale: true,
    };
  }

  return {
    problem,
    pattern: patternDoc || null,
    stale: false,
  };
};

/**
 * Generate (or return existing non-stale) Stage 04 ProblemPattern via Gemini AI
 */
const generatePattern = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  let existing = await ProblemPattern.findOne({
    problemId: problem._id,
    userId,
  });

  if (existing && existing.sourceProblemHash === currentHash) {
    return {
      problem,
      pattern: existing,
    };
  }

  const { rawText, model, promptVersion } = await geminiService.generateStage04PatternContent(problem);
  const normalizedData = validateAndNormalizePatternData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  let savedDoc = null;
  if (existing) {
    savedDoc = await ProblemPattern.findOneAndUpdate(
      { problemId: problem._id, userId },
      {
        ...normalizedData,
        sourceProblemVersion,
        sourceProblemHash: currentHash,
        generatedBy: 'gemini',
        model,
        promptVersion,
        generationStatus: 'generated',
        generatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
  } else {
    try {
      savedDoc = await ProblemPattern.create({
        problemId: problem._id,
        userId,
        ...normalizedData,
        sourceProblemVersion,
        sourceProblemHash: currentHash,
        generatedBy: 'gemini',
        model,
        promptVersion,
        generationStatus: 'generated',
        generatedAt: new Date(),
      });
    } catch (err) {
      if (err.code === 11000) {
        savedDoc = await ProblemPattern.findOneAndUpdate(
          { problemId: problem._id, userId },
          {
            ...normalizedData,
            sourceProblemVersion,
            sourceProblemHash: currentHash,
            generatedBy: 'gemini',
            model,
            promptVersion,
            generationStatus: 'generated',
            generatedAt: new Date(),
          },
          { new: true }
        );
      } else {
        throw err;
      }
    }
  }

  return {
    problem,
    pattern: savedDoc,
  };
};

/**
 * Force regenerate Stage 04 ProblemPattern via Gemini AI
 */
const regeneratePattern = async (problemIdOrSlug, userId) => {
  if (!userId) {
    throw new AppError('User authentication required', 401);
  }

  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const currentHash = computeProblemHash(problem);

  const { rawText, model, promptVersion } = await geminiService.generateStage04PatternContent(problem);
  const normalizedData = validateAndNormalizePatternData(rawText, problem);

  const sourceProblemVersion = {
    problemObjectId: String(problem._id),
    problemId: problem.problemId,
    title: problem.title,
    updatedAt: problem.updatedAt || new Date(),
  };

  const updatedDoc = await ProblemPattern.findOneAndUpdate(
    { problemId: problem._id, userId },
    {
      ...normalizedData,
      sourceProblemVersion,
      sourceProblemHash: currentHash,
      generatedBy: 'gemini',
      model,
      promptVersion,
      generationStatus: 'generated',
      generatedAt: new Date(),
    },
    { new: true, upsert: true, runValidators: true }
  );

  return {
    problem,
    pattern: updatedDoc,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  getPattern,
  generatePattern,
  regeneratePattern,
};
