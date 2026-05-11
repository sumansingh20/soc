import mongoose from 'mongoose';
import config from './index.js';
import logger from '../utils/logger.js';

export const connectMongoDB = async () => {
  try {
    if (!config.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }
    await mongoose.connect(config.MONGODB_URI, {
      // Ensure authentication succeeds and writes work in Docker.
      // Driver handles authSource from the URI.
      serverSelectionTimeoutMS: 10000,
    });

    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

export default mongoose;
