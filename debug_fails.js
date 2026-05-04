require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');

function req(path, method, body, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname:'localhost', port:3500, path, method, headers:{'Content-Type':'application/json'} };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const r = http.request(opts, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve({status:res.statusCode, body:d.substring(0,600)})); });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function debugFails() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const teacher = await db.collection('users').findOne({role:'Teacher', isApproved:true});
  const cls = await db.collection('classes').findOne({});
  const student = await db.collection('users').findOne({role:'Student', isApproved:true});
  await mongoose.disconnect();
  
  // Login teacher
  let r = await req('/User/Login','POST',{email: teacher.email, password:'password123'});
  const teacherToken = JSON.parse(r.body).token;
  console.log('Teacher token obtained:', !!teacherToken);
  
  // Login student  
  r = await req('/User/Login','POST',{email: student.email, password:'password123'});
  const studentToken = JSON.parse(r.body).token;
  console.log('Student token obtained:', !!studentToken);
  
  const classId = cls._id.toString();
  
  // Exam creation
  r = await req('/Exam/add','POST',{
    subject:'Mathematics', classId,
    totalMarks:100,
    questions:[{questionText:'2+2?',options:['1','2','3','4'],correctAnswer:'4'}]
  }, teacherToken);
  console.log('\nExam create:', r.status, r.body);
  
  // Lectures query by student
  r = await req('/lectures/class/'+classId,'GET',null, studentToken);
  console.log('\nStudent lectures:', r.status, r.body);
  
  // Available exams for student
  r = await req('/Exam/available','GET',null, studentToken);
  console.log('\nStudent available exams:', r.status, r.body.substring(0,400));
}

debugFails().catch(console.error);
