const mongoose = require('mongoose');
const env = require('../config/env');
const Problem = require('../models/Problem');

const clearProblems = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('Connected to MongoDB.');

    const result = await Problem.deleteMany({});
    console.log(`Deleted ${result.deletedCount} problems from database.`);

    process.exit(0);
  } catch (error) {
    console.error('Error clearing problems:', error);
    process.exit(1);
  }
};

clearProblems();
