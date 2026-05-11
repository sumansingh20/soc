import mongoose from 'mongoose';
import config from './index.js';
import logger from '../utils/logger.js';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default mongoose;
