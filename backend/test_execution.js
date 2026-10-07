require('dotenv').config();
const mongoose = require('mongoose');
const gemini = require('./src/services/gemini.service');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const res = await gemini.simulateCodeExecution('cpp', '#include <iostream>\nint main() { std::cout << "Hello" << std::endl; return 0; }', '');
    console.log(res);
  } catch (err) {
    console.error(err);
  }
  mongoose.disconnect();
}
test();
