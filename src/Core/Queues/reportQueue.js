const { Queue } = require('bullmq');
const redisConnection = require('../../../Config/redisClient');

// إنشاء الطابور
const reportQueue = new Queue('ReportCardsQueue', {
  connection: redisConnection,
});

module.exports = reportQueue;