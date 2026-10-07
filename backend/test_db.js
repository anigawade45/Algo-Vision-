require('dotenv').config();
const mongoose = require('mongoose');
const env = require('./src/config/env');
const ProblemPseudocode = require('./src/models/ProblemPseudocode');
const Problem = require('./src/models/Problem');

async function test() {
  await mongoose.connect(env.mongoUri || process.env.MONGO_URI);
  
  const problem = await Problem.findOne({ problemId: 'unique-number-of-occurrences' });
  if (!problem) {
    console.log('Problem not found');
    process.exit(0);
  }

  const allPseudo = await ProblemPseudocode.find({ problemId: problem._id });
  console.log('All Pseudocode approaches for this problem:');
  allPseudo.forEach(p => {
    console.log(`- userId: ${p.userId}, approachId: "${p.approachId}"`);
  });

  mongoose.disconnect();
}

test().catch(console.error);
