require('dotenv').config();
const mongoose = require('mongoose');
const codeService = require('./src/services/problemCode.service');
const Problem = require('./src/models/Problem');
const ProblemPseudocode = require('./src/models/ProblemPseudocode');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  
  try {
    const problem = await Problem.findOne({ problemId: 'unique-number-of-occurrences' });
    const pseudo = await ProblemPseudocode.findOne({ problemId: problem._id, approachId: 'hashTable' });
    if (!pseudo) {
      console.log('No pseudocode found');
      process.exit(0);
    }
    
    console.log('Generating code for userId:', pseudo.userId);
    const result = await codeService.generateCode('unique-number-of-occurrences', pseudo.userId, 'hashTable', 'Hash Map & Hash Set');
    console.log('Success!', result.generationStatus);
  } catch (err) {
    console.error('Service error:', err);
  }
  
  mongoose.disconnect();
}
test();
