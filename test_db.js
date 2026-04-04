import mongoose from 'mongoose';
const MONGO_URI = 'mongodb://127.0.0.1:27017/aicruit';

async function check() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB:', err.message);
    process.exit(1);
  }
}
check();
