const mongoose = require('mongoose');
const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/my_database_name';

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('✅ MongoDB Connected...');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;