import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;

let redisConnection;

if (REDIS_URL) {
  redisConnection = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
  });
  redisConnection.on('connect', () => console.log('✅ Redis Connected...'));
  redisConnection.on('error', (err) => console.error('❌ Redis Error:', err.message));
} else {
  console.warn('⚠️  REDIS_URL not set — BullMQ queues/workers will be disabled.');
  redisConnection = null;
}

export default redisConnection;