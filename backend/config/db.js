import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`\x1b[32m%s\x1b[0m`, `✓ MongoDB Connected: ${conn.connection.host}`);

    // Optional: listeners
    mongoose.connection.on('error', (err) => {
      console.error(`\x1b[31m%s\x1b[0m`, `✗ MongoDB Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn(`\x1b[33m%s\x1b[0m`, `! MongoDB Disconnected`);
    });

  } catch (error) {
    console.error(`\x1b[31m%s\x1b[0m`, `✗ MongoDB Connection Failed: ${error.message}`);
    
    // IMPORTANT: stop server in production
    process.exit(1);
  }
};

export default connectDB;