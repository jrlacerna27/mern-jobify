// Populate the data to database
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import Job from './models/jobModel.js';

const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    await Job.deleteMany();
    const jsonProducts = JSON.parse(await readFile(new URL('./fake-data.json', import.meta.url)));
    await Job.create(jsonProducts);
    console.log('Success!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
