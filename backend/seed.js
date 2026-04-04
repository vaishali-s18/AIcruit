import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Job from './models/Job.js';
import { jobs } from '../src/data/jobs.js'; // Note: importing the mock data

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Job.deleteMany(); // Clear existing
    
    // Transform data to remove static ID so Mongo generates ObjectIds
    const jobsData = jobs.map(job => {
      const { id, ...rest } = job;
      return rest;
    });

    await Job.insertMany(jobsData);
    
    console.log('Jobs data imported to MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
