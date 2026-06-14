const Redis = require('ioredis');

const redisConnection=new Redis({


    port:6379,
    maxRetriesPerRequest: null,
});

module.exports=redisConnection;