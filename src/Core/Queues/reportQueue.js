import { Queue } from 'bullmq';
import redisConnection from '../../../Config/redisClient.js';

// إنشاء الطابور
const reportQueue = new Queue('ReportCardsQueue', {
  connection: redisConnection,
});

export default reportQueue;