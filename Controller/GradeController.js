const Grade = require('../Model/Grade.js');
const Exam = require('../Model/exam.js');
const AppError=require('../Utils/appError.js');
const catchasync=require('../Utils/CatchAsync.js');

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
