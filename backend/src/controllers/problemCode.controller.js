const codeService = require('../services/problemCode.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

exports.getCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { approachId } = req.query;
    const userId = req.user?._id;

    const result = await codeService.getCode(problemId, userId, approachId);
    
    if (!result.code) {
      return successResponse(res, 200, 'Code not yet generated', {
        generated: false,
        problemId: result.problem.problemId,
        approachId: result.approachId,
        approachName: result.approachName
      });
    }

    return successResponse(res, 200, 'Code retrieved successfully', {
      generated: true,
      stale: result.stale,
      data: result.code
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return errorResponse(res, statusCode, error.message);
  }
};

exports.generateCode = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { approachId, approachName } = req.body;
    const userId = req.user?._id;

    const codeDoc = await codeService.generateCode(problemId, userId, approachId, approachName);
    
    return successResponse(res, 200, 'Code generated successfully', {
      generated: true,
      data: codeDoc
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return errorResponse(res, statusCode, error.message);
  }
};

exports.executeCode = async (req, res) => {
  try {
    const { language, code, input } = req.body;
    if (!language || !code) {
      return errorResponse(res, 400, 'Language and code are required');
    }

    const executionResult = await codeService.executeCode(language, code, input);
    
    // Normalize piston output
    const isError = executionResult.run?.code !== 0 || executionResult.compile?.code !== 0;
    const output = executionResult.run?.stdout || '';
    const errorOutput = executionResult.run?.stderr || executionResult.compile?.stderr || '';

    let status = 'Execution Completed';
    if (executionResult.compile?.code !== 0 && executionResult.compile?.stderr) {
      status = 'Compilation Error';
    } else if (executionResult.run?.code !== 0) {
      status = 'Runtime Error';
    } else if (executionResult.run?.signal === 'SIGKILL') {
      status = 'Time Limit Exceeded';
    }

    return successResponse(res, 200, 'Code executed successfully', {
      status,
      output: output,
      error: errorOutput,
      isError: isError,
      executionTime: executionResult.run?.stdout ? 'N/A' : null
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return errorResponse(res, statusCode, error.message);
  }
};
