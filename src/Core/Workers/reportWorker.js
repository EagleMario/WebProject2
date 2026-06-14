const { Worker } = require('bullmq');
const redisConnection = require('../../../Config/redisClient');

// ده اللي بيسحب الشغل من الطابور وينفذه
const reportWorker = new Worker(
  'ReportCardsQueue',
  async (job) => {
    console.log(`[Worker] Started processing job ${job.id}...`);
    console.log('Data received:', job.data);
    
    // --> هنا هتكتب اللوجيك التقيل بتاعك (زي تجميع الـ PDF أو سحب الداتا من الموديل) <--
    
    // محاكاة لعملية بتاخد وقت (مثلاً 5 ثواني)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log(`[Worker] Job ${job.id} completed successfully!`);
    return { success: true, message: 'PDF Generated' };
  },
  {
    connection: redisConnection,
    concurrency: 5, // يقدر يعالج 5 طلبات في نفس الوقت
  }
);

// التعامل مع الأخطاء
reportWorker.on('failed', (job, err) => {
  console.error(`[Worker] Job ${job.id} failed with error:`, err.message);
});

module.exports = reportWorker;