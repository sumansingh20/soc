import { createClient } from 'redis';
import config from './index.js';
import logger from '../utils/logger.js';

const redisClient = createClient({
  url: config.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => Math.min(retries * 50, 500),
  },
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Redis connected');
});

await redisClient.connect();

export default redisClient;
