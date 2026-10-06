const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const Problem = require('./src/models/Problem');
const problemPracticeService = require('./src/services/problemPractice.service');

async function testPractice() {
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
        isPublished: true,
      });
    }

    const testUserId = new mongoose.Types.ObjectId();
    const approachId = 'hashTable';

    console.log('Generating Stage 11 Practice Quiz via Gemini AI...');
    const result = await problemPracticeService.generatePractice(
      problem.problemId,
      testUserId,
      approachId,
      true
    );

    console.log('Practice Quiz generated successfully!');
    console.log('Approach Name:', result.practice.approachName);
    console.log('Total Questions:', result.practice.questions.length);
    
    result.practice.questions.forEach((q, idx) => {
      console.log(`\nQ${idx + 1} (${q.type}): ${q.question}`);
      console.log(`Options: ${JSON.stringify(q.options)}`);
      console.log(`Correct Answer Index: ${q.correctAnswer} (${q.options[q.correctAnswer]})`);
      console.log(`Explanation: ${q.explanation}`);
    });

    console.log('\nTesting GET Practice Quiz...');
    const getResult = await problemPracticeService.getPractice(
      problem.problemId,
      testUserId,
      approachId
    );
    console.log('GET Practice retrieved successfully! Stale status:', getResult.stale);

    await mongoose.disconnect();
    console.log('Test completed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

testPractice();
