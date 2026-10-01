const mongoose = require('mongoose');
const env = require('../src/config/env');
const User = require('../src/models/User');

const clearDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongoUri);
    console.log('Connected.');

    const result = await User.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} user(s) from database.`);
  } catch (error) {
    console.error('❌ Failed to clear database:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

clearDatabase();
