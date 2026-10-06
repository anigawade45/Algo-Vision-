const crypto = require('crypto');
const Problem = require('../models/Problem');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemAlgorithm = require('../models/ProblemAlgorithm');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const ProblemDryRun = require('../models/ProblemDryRun');
const ProblemPractice = require('../models/ProblemPractice');
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

  const normalizedSlug = String(problemIdOrSlug).trim().toLowerCase();
  let problem = await Problem.findOne({ problemId: normalizedSlug });

  if (!problem && problemIdOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    problem = await Problem.findById(problemIdOrSlug);
  }

  if (!problem) {
    throw new AppError(`Problem not found for identifier "${problemIdOrSlug}"`, 404);
  }

  const isOwner = userId && String(problem.createdBy) === String(userId);
  if (!problem.isPublished && !isOwner) {
    throw new AppError('You do not have permission to access practice quiz for this private problem', 403);
  }

  return problem;
};

/**
 * Computes SHA-256 hash for Pattern
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
 * Computes SHA-256 hash for Algorithm
 */
const computeAlgorithmHash = (algorithmDoc) => {
  if (!algorithmDoc) return '';
  return crypto.createHash('sha256').update(String(algorithmDoc.rawText || '').trim()).digest('hex');
};

/**
 * Computes SHA-256 hash for Pseudocode
 */
const computePseudocodeHash = (pseudocodeDoc) => {
  if (!pseudocodeDoc) return '';
  const payload = {
    approachId: pseudocodeDoc.approachId,
    approachName: pseudocodeDoc.approachName,
    lines: (pseudocodeDoc.lines || []).map((l) => ({
      line: l.line,
      text: l.text,
    })),
  };
  return crypto.createHash('sha256').update(canonicalStringify(payload)).digest('hex');
};

/**
 * Computes SHA-256 hash for Code
 */
const computeCodeHash = (codeText) => {
  return crypto.createHash('sha256').update(String(codeText || '').trim()).digest('hex');
};

/**
 * Validates requested approachId against problem and pattern options
 */
const validateApproach = async (problem, approachId, requestedApproachName) => {
  const patternDoc = await ProblemPattern.findOne({ problemId: problem._id });

  let rawApproachId = (approachId && typeof approachId === 'string' && approachId.trim()) || '';
  if (rawApproachId === 'null' || rawApproachId === 'undefined') {
    rawApproachId = '';
  }

  let normalizedApproachId = rawApproachId;

  if (!normalizedApproachId && patternDoc?.solutionFamilies?.families?.length > 0) {
    normalizedApproachId = patternDoc.solutionFamilies.families[0].id;
  }

  if (!normalizedApproachId && problem.defaultApproachId) {
    normalizedApproachId = problem.defaultApproachId;
  }

  if (!normalizedApproachId) {
    normalizedApproachId = 'default';
  }

  let approachName = requestedApproachName || normalizedApproachId;

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
 * Validates generated questions array: Ensures exactly 10 questions with 4 options and valid correctAnswer
 */
const validateAndNormalizeQuestions = (questionsRaw) => {
  if (!Array.isArray(questionsRaw) || !questionsRaw.length) {
    throw new AppError('Generated quiz contains no questions.', 422);
  }

  const normalized = questionsRaw.slice(0, 10).map((q, idx) => {
    const qNum = q.questionNumber || q.id || idx + 1;
    const qType = q.type || 'concept';
    const qText = q.question || 'Question text';

    let options = Array.isArray(q.options) ? q.options.map((opt) => typeof opt === 'object' ? opt.text || String(opt) : String(opt)) : [];
    
    // Ensure exactly 4 options
    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }
    options = options.slice(0, 4);

    let corrAns = typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
    if (typeof q.correctAnswer === 'string') {
      const upper = q.correctAnswer.trim().toUpperCase();
      if (upper === 'A') corrAns = 0;
      else if (upper === 'B') corrAns = 1;
      else if (upper === 'C') corrAns = 2;
      else if (upper === 'D') corrAns = 3;
      else corrAns = parseInt(upper, 10) || 0;
    }
    if (corrAns < 0 || corrAns > 3) corrAns = 0;

    return {
      id: idx + 1,
      questionNumber: idx + 1,
      type: qType,
      question: qText,
      options,
      correctAnswer: corrAns,
      explanation: q.explanation || 'Refer to algorithm logic and implementation details.',
    };
  });

  if (normalized.length < 10) {
    throw new AppError(`Generated quiz has only ${normalized.length} questions. Exactly 10 questions required.`, 422);
  }

  return normalized;
};

/**
 * Retrieves saved Stage 11 Practice quiz for a problem, user, and approach
 */
const getPractice = async (problemIdOrSlug, userId, approachIdQuery) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId, approachName, patternDoc } = await validateApproach(problem, approachIdQuery);

  const existingPractice = await ProblemPractice.findOne({
    problemId: problem._id,
    userId,
    approachId,
  });

  if (!existingPractice) {
    return {
      practice: null,
      stale: false,
      problem: {
        id: problem._id,
        problemId: problem.problemId,
        title: problem.title,
      },
      approachId,
      approachName,
    };
  }

  // Calculate current upstream hashes
  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, approachId, approachName);
  
  const algorithmDoc = await ProblemAlgorithm.findOne({ problemId: problem._id, userId, approachId });
  const currentAlgorithmHash = computeAlgorithmHash(algorithmDoc);

  const pseudocodeDoc = await ProblemPseudocode.findOne({ problemId: problem._id, userId, approachId });
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);

  const isStale =
    existingPractice.sourceProblemHash !== currentProblemHash ||
    (existingPractice.sourcePatternHash && existingPractice.sourcePatternHash !== currentPatternHash) ||
    (existingPractice.sourceAlgorithmHash && existingPractice.sourceAlgorithmHash !== currentAlgorithmHash) ||
    (existingPractice.sourcePseudocodeHash && existingPractice.sourcePseudocodeHash !== currentPseudocodeHash);

  return {
    practice: existingPractice,
    stale: isStale,
    problem: {
      id: problem._id,
      problemId: problem.problemId,
      title: problem.title,
    },
    approachId,
    approachName,
  };
};

/**
 * Generates or Regenerates Stage 11 Practice Knowledge Check Quiz via Gemini AI
 */
const generatePractice = async (problemIdOrSlug, userId, approachIdInput, forceRegenerate = false) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId, approachName, patternDoc } = await validateApproach(problem, approachIdInput);

  const algorithmDoc = await ProblemAlgorithm.findOne({ problemId: problem._id, userId, approachId });
  const pseudocodeDoc = await ProblemPseudocode.findOne({ problemId: problem._id, userId, approachId });
  const dryRunDoc = await ProblemDryRun.findOne({ problemId: problem._id, userId, approachId });
  const codeText = `// Solution implementation for ${approachName}\n// Problem: ${problem.title}`;

  // Calculate hashes
  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, approachId, approachName);
  const currentAlgorithmHash = computeAlgorithmHash(algorithmDoc);
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);
  const currentCodeHash = computeCodeHash(codeText);

  if (!forceRegenerate) {
    const existingPractice = await ProblemPractice.findOne({
      problemId: problem._id,
      userId,
      approachId,
    });

    if (
      existingPractice &&
      existingPractice.generationStatus === 'generated' &&
      existingPractice.questions &&
      existingPractice.questions.length === 10 &&
      existingPractice.sourceProblemHash === currentProblemHash &&
      existingPractice.sourcePatternHash === currentPatternHash &&
      existingPractice.sourcePseudocodeHash === currentPseudocodeHash
    ) {
      console.log(`[Practice Service] Returning existing valid Practice quiz for problem "${problem.title}" [Approach: ${approachId}]`);
      return {
        practice: existingPractice,
        stale: false,
      };
    }
  }

  // Call Gemini API
  const { rawText, model, promptVersion } = await geminiService.generateStage11PracticeContent(
    problem,
    approachId,
    approachName,
    patternDoc,
    algorithmDoc,
    pseudocodeDoc,
    codeText,
    dryRunDoc
  );

  let parsedResponse;
  try {
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedResponse = JSON.parse(cleanedText);
  } catch (err) {
    console.error('[Practice Service] Failed to parse JSON response from Gemini:', err.message);
    throw new AppError('Gemini model generated invalid JSON for Practice quiz.', 502);
  }

  const questionsRaw = parsedResponse.questions || parsedResponse.quiz || parsedResponse;
  const normalizedQuestions = validateAndNormalizeQuestions(questionsRaw);

  const practiceDocument = await ProblemPractice.findOneAndUpdate(
    {
      problemId: problem._id,
      userId,
      approachId,
    },
    {
      problemId: problem._id,
      userId,
      approachId,
      approachName,
      questions: normalizedQuestions,
      totalQuestions: 10,
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
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return {
    practice: practiceDocument,
    stale: false,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  validateApproach,
  getPractice,
  generatePractice,
};
