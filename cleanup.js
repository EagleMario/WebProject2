require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;
  const r1 = await db.collection('classes').deleteMany({});
  console.log('Deleted classes:', r1.deletedCount);
  const r2 = await db.collection('exams').deleteMany({});
  console.log('Deleted exams:', r2.deletedCount);
  const r3 = await db.collection('grades').deleteMany({});
  console.log('Deleted grades:', r3.deletedCount);
  const r4 = await db.collection('lectures').deleteMany({});
  console.log('Deleted lectures:', r4.deletedCount);
  const r5 = await db.collection('users').deleteMany({ role: { $ne: 'Manager' } });
  console.log('Deleted test users:', r5.deletedCount);
  process.exit(0);
}).catch(console.error);
