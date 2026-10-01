const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!env.mongoUri) {
    console.error('MONGO_URI is not configured.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.mongoUri);

    console.log(
      `MongoDB connected successfully: ${conn.connection.host}`
    );

    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;