const Grade = require('./Grade.js');
const Exam = require('../Exams/exam.js');
const AppError=require('../Core/Utils/appError.js');
const catchasync=require('../Core/Utils/CatchAsync.js');
const reportQueue = require('../Core/Queues/reportQueue');

exports.generateBulkReports=catchasync(async(req,res,next)=>{
const{gradeId,exam}=req.body;

const job=await reportQueue.add('generate-report-job',
  {gradeId,exam},
  {
    attempts:3,
    backoff:{type:'exponential',delay:1000}
  }
);
res.staus(200).json({
  status:'success',
  message:'Report generation started in the background',
  jobId:job.id
});
});

exports.addGrade = catchasync (async(req, res) => {
  const NewGrade=await Grade.create({
    exam:req.body.exam,
    studentId:req.body.studentId,
    Score:req.body.Score,
    feedback:req.body.feedback
  });
  res.status(201).json({status:'success',data:{grade:NewGrade}});
});

exports.getExamGrades = catchasync (async(req, res) => {
  const exam=await Exam.findById(req.body.examId);
  if(!exam){
    return next(new AppError('Exam not found',404));
  }
  if(req.user.role.toLowerCase()==='teacher'&&exam.teacher.toString()!==req.user.id){
    return next(new AppError('you have no access',403));
  }
const grades=await Grade.find({exam:req.params.examId}).populate('studentId','name email');
res.status(200).json({
  status:'success',
  results:grades.length,
  data:{grades}
});
});