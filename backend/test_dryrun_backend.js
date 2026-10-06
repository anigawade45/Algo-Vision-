const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Problem = require('./src/models/Problem');
const ProblemPseudocode = require('./src/models/ProblemPseudocode');
const problemDryRunService = require('./src/services/problemDryRun.service');
const problemPseudocodeService = require('./src/services/problemPseudocode.service');

async function testDryRun() {
  try {
    console.log('Connecting to MongoDB...');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/algo-vision';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB successfully.');

    let problem = await Problem.findOne({ problemId: 'two-sum' });
    if (!problem) {
      console.log('Creating mock Two Sum problem for test...');
      problem = await Problem.create({
        problemId: 'two-sum',
        title: 'Two Sum',
        category: 'Arrays & Hashing',
        difficulty: 'Easy',
        objective: 'Find indices of two numbers that add up to target.',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
        inputData: { nums: [2, 7, 11, 15], target: 9 },
        outputData: [0, 1],
        testCases: [
          {
            id: 1,
            inputRaw: 'nums = [2,7,11,15], target = 9',
            outputRaw: '[0,1]',
            inputStructured: { nums: [2, 7, 11, 15], target: 9 },
            outputStructured: [0, 1],
          },
        ],
        isPublished: true,
      });
    }

    const testUserId = new mongoose.Types.ObjectId();
    const approachId = 'hashTable';
    const approachName = 'HashMap';

    console.log('Generating Stage 05 Pseudocode first...');
    const pseudocodeDoc = await problemPseudocodeService.generatePseudocode(
      problem.problemId,
      testUserId,
      approachId,
      approachName
    );
    console.log('Pseudocode generated successfully with', pseudocodeDoc.lines.length, 'lines.');

    console.log('Generating Stage 08 Dry Run Trace...');
    const result = await problemDryRunService.generateDryRun(
      problem.problemId,
      testUserId,
      approachId,
      1,
      true
    );

    console.log('Dry Run generated successfully!');
    console.log('Approach Name:', result.dryRun.approachName);
    console.log('Test Case ID:', result.dryRun.testCaseId);
    console.log('Step Count:', result.dryRun.steps.length);
    console.log('First Step Pseudocode Line:', result.dryRun.steps[0].pseudocodeLine);
    console.log('First Step Pseudocode Text:', result.dryRun.steps[0].pseudocodeText);
    console.log('Final Result:', JSON.stringify(result.dryRun.finalResult));

    console.log('Testing GET Dry Run...');
    const getResult = await problemDryRunService.getDryRun(
      problem.problemId,
      testUserId,
      approachId,
      1
    );
    console.log('GET Dry Run retrieved successfully! Stale status:', getResult.stale);

    await mongoose.disconnect();
    console.log('Test completed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

testDryRun();
