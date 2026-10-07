require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const complexityService = require('./src/services/problemComplexity.service');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne();
  try {
    const res = await complexityService.generateComplexity('find-the-index-of-the-first-occurrence-in-a-string', user._id, 'fam_1', '');
    console.log("SUCCESS:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("ERROR:", err);
  }
  process.exit();
}
test();
