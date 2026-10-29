const crypto = require('crypto');
const Problem = require('../models/Problem');
const ProblemPattern = require('../models/ProblemPattern');
const ProblemPseudocode = require('../models/ProblemPseudocode');
const ProblemDryRun = require('../models/ProblemDryRun');
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
    throw new AppError('You do not have permission to access dry run for this private problem', 403);
  }

  return problem;
};

/**
 * Computes deterministic SHA-256 hash for Pattern selection
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
 * Computes deterministic SHA-256 hash for Stage 05 Pseudocode
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
 * Computes deterministic SHA-256 hash for Stage 07 Code
 */
const computeCodeHash = (codeText) => {
  return crypto.createHash('sha256').update(String(codeText || '').trim()).digest('hex');
};

/**
 * Validates requested approachId against problem and pattern options
 */
const validateApproach = async (problem, approachId, requestedApproachName, userId) => {
  const patternDoc = await ProblemPattern.findOne({ problemId: problem._id });

  let rawApproachId = (approachId && typeof approachId === 'string' && approachId.trim()) || '';
  if (rawApproachId === 'null' || rawApproachId === 'undefined') {
    rawApproachId = '';
  }

  let normalizedApproachId = rawApproachId;
  let resolvedApproachName = requestedApproachName || '';

  if (userId) {
    if (!normalizedApproachId) {
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
 * Resolves test case by numeric ID from problem testCases
 */
const resolveTestCase = (problem, testCaseId) => {
  const testCases = problem.testCases || [];
  if (!testCases.length) {
    return {
      testCaseId: 1,
      testCaseInput: problem.inputData || {},
      expectedOutput: problem.outputData || {},
      rawTestCase: { id: 1, inputRaw: JSON.stringify(problem.inputData), outputRaw: JSON.stringify(problem.outputData) },
    };
  }

  // If testCaseId was explicitly provided, validate it strictly rather than silently falling back
  if (testCaseId !== undefined && testCaseId !== null && String(testCaseId).trim() !== '') {
    const parsedId = Number(testCaseId);
    if (isNaN(parsedId) || parsedId <= 0 || !Number.isInteger(parsedId)) {
      throw new AppError(`Invalid test-case ID "${testCaseId}". ID must be a positive integer.`, 400);
    }

    const matched = testCases.find((tc, idx) => (tc.id !== undefined ? tc.id : idx + 1) === parsedId);
    if (!matched) {
      const availableIds = testCases.map((tc, idx) => (tc.id !== undefined ? tc.id : idx + 1));
      throw new AppError(
        `Test case with ID ${parsedId} not found for problem "${problem.title || problem.problemId}". Available IDs: ${availableIds.join(', ')}.`,
        404
      );
    }

    return {
      testCaseId: matched.id !== undefined ? matched.id : parsedId,
      testCaseInput: matched.inputStructured || matched.inputRaw,
      expectedOutput: matched.outputStructured || matched.outputRaw,
      rawTestCase: matched,
    };
  }

  // Default to the first test case when no ID query is specified
  const firstCase = testCases[0];
  const actualId = firstCase.id !== undefined ? firstCase.id : 1;

  return {
    testCaseId: actualId,
    testCaseInput: firstCase.inputStructured || firstCase.inputRaw,
    expectedOutput: firstCase.outputStructured || firstCase.outputRaw,
    rawTestCase: firstCase,
  };
};

/**
 * Validates step pseudocodeLine references against valid pseudocode line numbers
 */
const validatePseudocodeLineReferences = (steps, validLinesMap) => {
  if (!Array.isArray(steps) || !steps.length) {
    throw new AppError('Generated dry run trace contains no execution steps.', 422);
  }

  const validLineNumbers = new Set(validLinesMap.keys());

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const lineNum = Number(step.pseudocodeLine);

    if (!lineNum || isNaN(lineNum)) {
      throw new AppError(`Step ${i + 1} does not specify a valid numeric pseudocodeLine.`, 422);
    }

    if (!validLineNumbers.has(lineNum)) {
      console.warn(
        `[DryRun Validation Warning] Step ${i + 1} references line ${lineNum} which is not in pseudocode lines: [${Array.from(validLineNumbers).join(', ')}]`
      );
    }
  }
};

/**
 * Retrieves saved Dry Run for a problem, user, approach, and testCase
 */
const getDryRun = async (problemIdOrSlug, userId, approachIdQuery, testCaseIdQuery) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId, approachName, patternDoc } = await validateApproach(problem, approachIdQuery, null, userId);
  const testCaseInfo = resolveTestCase(problem, testCaseIdQuery);

  const existingDryRun = await ProblemDryRun.findOne({
    problemId: problem._id,
    userId,
    approachId,
    testCaseId: testCaseInfo.testCaseId,
  });

  if (!existingDryRun) {
    return {
      dryRun: null,
      stale: false,
      problem: {
        id: problem._id,
        problemId: problem.problemId,
        title: problem.title,
      },
      approachId,
      approachName,
      testCaseId: testCaseInfo.testCaseId,
    };
  }

  // Calculate current upstream hashes
  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, approachId, approachName);
  
  const pseudocodeDoc = await ProblemPseudocode.findOne({
    problemId: problem._id,
    userId,
    approachId,
  });
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);

  const isStale =
    existingDryRun.sourceProblemHash !== currentProblemHash ||
    (existingDryRun.sourcePatternHash && existingDryRun.sourcePatternHash !== currentPatternHash) ||
    (existingDryRun.sourcePseudocodeHash && existingDryRun.sourcePseudocodeHash !== currentPseudocodeHash);

  return {
    dryRun: existingDryRun,
    stale: isStale,
    problem: {
      id: problem._id,
      problemId: problem.problemId,
      title: problem.title,
    },
    approachId,
    approachName,
    testCaseId: testCaseInfo.testCaseId,
  };
};

/**
 * Generates or Regenerates Stage 08 Dry Run Execution Trace via Gemini
 */
const generateDryRun = async (problemIdOrSlug, userId, approachIdInput, testCaseIdInput, forceRegenerate = false) => {
  const problem = await resolveProblemAndCheckAccess(problemIdOrSlug, userId);
  const { approachId, approachName, patternDoc } = await validateApproach(problem, approachIdInput, null, userId);
  const testCaseInfo = resolveTestCase(problem, testCaseIdInput);

  // Require Stage 05/06 Pseudocode before Dry Run can be generated!
  const pseudocodeDoc = await ProblemPseudocode.findOne({
    problemId: problem._id,
    userId,
    approachId,
  });

  if (!pseudocodeDoc || !pseudocodeDoc.lines || !pseudocodeDoc.lines.length) {
    throw new AppError(
      `Stage 05 Pseudocode for approach "${approachName}" (${approachId}) has not been generated yet. Please complete Pseudocode first.`,
      400
    );
  }

  const validLinesMap = new Map();
  pseudocodeDoc.lines.forEach((l) => {
    validLinesMap.set(l.line, l.text);
  });

  // Calculate hashes
  const currentProblemHash = computeProblemHash(problem);
  const currentPatternHash = computePatternHash(patternDoc, approachId, approachName);
  const currentPseudocodeHash = computePseudocodeHash(pseudocodeDoc);
  const codeText = `// Implementation for ${approachName}\n// Problem: ${problem.title}`;
  const currentCodeHash = computeCodeHash(codeText);

  if (!forceRegenerate) {
    const existingDryRun = await ProblemDryRun.findOne({
      problemId: problem._id,
      userId,
      approachId,
      testCaseId: testCaseInfo.testCaseId,
    });

    if (
      existingDryRun &&
      existingDryRun.generationStatus === 'generated' &&
      existingDryRun.sourceProblemHash === currentProblemHash &&
      existingDryRun.sourcePatternHash === currentPatternHash &&
      existingDryRun.sourcePseudocodeHash === currentPseudocodeHash
    ) {
      console.log(`[DryRun Service] Returning existing valid Dry Run for problem "${problem.title}" [Approach: ${approachId}, TestCase: ${testCaseInfo.testCaseId}]`);
      return {
        dryRun: existingDryRun,
        stale: false,
      };
    }
  }

  // Call Gemini API
  const { rawText, model, promptVersion } = await geminiService.generateStage08DryRunContent(
    problem,
    approachId,
    approachName,
    pseudocodeDoc,
    codeText,
    testCaseInfo.rawTestCase
  );

  let parsedTrace;
  try {
    const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    parsedTrace = JSON.parse(cleanedText);
  } catch (err) {
    console.error('[DryRun Service] Failed to parse JSON response from Gemini:', err.message);
    throw new AppError('Gemini model generated invalid JSON for Dry Run trace.', 502);
  }

  // Validate trace steps
  validatePseudocodeLineReferences(parsedTrace.steps, validLinesMap);

  // Clean steps to match schema structure
  const formattedSteps = (parsedTrace.steps || []).map((step, idx) => ({
    stepNo: step.stepNo || idx + 1,
    pseudocodeLine: Number(step.pseudocodeLine),
    pseudocodeText: step.pseudocodeText || validLinesMap.get(Number(step.pseudocodeLine)) || '',
    operation: step.operation || 'EXECUTE',
    title: step.title || `Step ${idx + 1}`,
    variables: Array.isArray(step.variables) ? step.variables : [],
    before: step.before || {},
    condition: {
      text: step.condition?.text || '',
      evaluation: step.condition?.evaluation || '',
      passes: typeof step.condition?.passes === 'boolean' ? step.condition.passes : true,
    },
    action: {
      description: step.action?.description || step.actionTaken || step.pseudocodeText || 'Executed step',
    },
    after: step.after || {},
    changes: Array.isArray(step.changes) ? step.changes : Array.isArray(step.changedVariables) ? step.changedVariables : [],
    currentResult: typeof step.currentResult !== 'undefined' ? step.currentResult : '',
    explanation: step.explanation || step.action?.description || 'Executed step',
  }));

  const inputVisualDefault = `${problem.title} execution on test case ${testCaseInfo.testCaseId}`;

  const dryRunDocument = await ProblemDryRun.findOneAndUpdate(
    {
      problemId: problem._id,
      userId,
      approachId,
      testCaseId: testCaseInfo.testCaseId,
    },
    {
      problemId: problem._id,
      userId,
      approachId,
      approachName,
      testCaseId: testCaseInfo.testCaseId,
      testCaseInput: testCaseInfo.testCaseInput,
      expectedOutput: testCaseInfo.expectedOutput,
      input: {
        title: parsedTrace.input?.title || problem.title,
        inputVisual: parsedTrace.input?.inputVisual || inputVisualDefault,
        items: parsedTrace.input?.items || [
          { label: 'Input', value: JSON.stringify(testCaseInfo.testCaseInput) },
          { label: 'Expected Output', value: JSON.stringify(testCaseInfo.expectedOutput) },
        ],
        expectedOutput: parsedTrace.input?.expectedOutput || JSON.stringify(testCaseInfo.expectedOutput),
      },
      initialState: {
        subtitle: parsedTrace.initialState?.subtitle || 'Initial state before execution',
        variables: parsedTrace.initialState?.variables || [],
      },
      steps: formattedSteps,
      finalResult: parsedTrace.finalResult || testCaseInfo.expectedOutput,
      executionSummary: parsedTrace.executionSummary || `Completed dry run for ${problem.title}`,
      sourceProblemHash: currentProblemHash,
      sourcePatternHash: currentPatternHash,
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
    dryRun: dryRunDocument,
    stale: false,
  };
};

module.exports = {
  AppError,
  resolveProblemAndCheckAccess,
  validateApproach,
  getDryRun,
  generateDryRun,
};
