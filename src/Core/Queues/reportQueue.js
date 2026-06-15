import { Queue } from 'bullmq';
import redisConnection from '../../../Config/redisClient.js';

// Only create the queue if Redis is available
const reportQueue = redisConnection
  ? new Queue('ReportCardsQueue', { connection: redisConnection })
  : null;

if (!reportQueue) console.warn('⚠️  reportQueue disabled — no Redis connection.');

export default reportQueue;