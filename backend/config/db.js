const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Just connect to MongoDB using the URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
