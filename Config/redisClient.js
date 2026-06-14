import Redis from 'ioredis';

const redisConnection = new Redis({
    port: 6379,
    maxRetriesPerRequest: null,
});

export default redisConnection;