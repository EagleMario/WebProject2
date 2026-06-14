const Exam=require('./exam.js');
const Class=require('../Classes/class.js');
const Grade=require('../Grades/Grade.js');
const AppError=require('../Core/Utils/appError.js');
const catchasync=require('../Core/Utils/CatchAsync.js');
const examService = require('./ExamServices.js');
const reportQueue = require('../Core/Queues/reportQueue.js');

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

exports.CreateExam=catchasync(async(req,res,next)=>{
  const targetclass=await Class.findById(req.body.classId);
  if(!targetclass){
    return next(new AppError('class not found',404));
  }
  // Check if teacher is assigned to this class
  const isTeacherInClass = targetclass.teachers && targetclass.teachers.some(
    t => t.teacher && t.teacher.toString() === req.user.id
  );
  if(!isTeacherInClass){
    return next(new AppError('you have no access to this class',403));
  }
  const newExam=await Exam.create({
    ...req.body,
    teacher:req.user.id
  });
  res.status(201).json({
    status:'success',
    data:{exam:newExam}
  });
});
exports.submitExam = async (req, res) => {
    try {
        const { studentId, examId, calculatedScore } = req.body;

        if (!studentId || !examId || calculatedScore === undefined) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing studentId, examId, or calculatedScore" 
            });
        }

       
        const result = await examService.submitExamService(studentId, examId, calculatedScore);

        res.status(200).json(result);

    } catch (error) {
        console.error("Error submitting exam:", error);
        

        res.status(500).json({ 
            success: false, 
            message: error.message || "فشل تسليم الامتحان، تم التراجع عن العملية (Rollback)." 
        });
    }
};
exports.GetAllExam=catchasync(async(req,res)=>{
    let filter={};
    if(req.user.role && req.user.role.toLowerCase()==='manager'){
      filter={Manager:req.user.id};
    }
    const exams=await Exam.find(filter).populate('teacher','name');
    res.status(200).json({
      status:'success',
      results:exams.length,
      data:{exams}
    });
});

exports.deleteExam=catchasync(async(req,res,next)=>{
    const exam=await Exam.findById(req.params.id);
    if(!exam){
      return next(new AppError('Exam not found',404));
    }
    if(req.user.role.toLowerCase()==='manager'&&exam.Manager&&exam.Manager.toString()!==req.user.id){
        return next(new AppError('you have not access',403));
    }
    await Exam.findByIdAndDelete(req.params.id);
    res.status(204).json({status:'success',data:null});
});

exports.GetAvailableExams = catchasync (async(req, res) => {
  // Find classes where student is enrolled (students is an array)
  const studentclasses=await Class.find({students: req.user.id});
  const classIds=studentclasses.map(c=>c._id);

  const allExam=await Exam.find({classId:{$in:classIds}}).populate('teacher','name');

  const exams=allExam.filter(exam=>{
    if(!exam.duration)return true;
    const examStartTime=new Date(exam.date).getTime();
    const expirationTime=examStartTime+(exam.duration*60000);
    return Date.now()<expirationTime;
  });

  const MyGrades=await Grade.find({studentId:req.user.id});
  const takenExamsIds=MyGrades.map(g=>g.exam.toString());

  const safeExams=exams.map(exam=>{
    const e=exam.toObject();
    if(e.questions)e.questions.forEach(q=>delete q.correctAnswer);
    return e;
  });
  const availableExam=safeExams.filter(e=>!takenExamsIds.includes(e._id.toString()));
  res.status(200).json({status:'success',data:{exams:availableExam}});
});

exports.SubmitExam = catchasync(async (req, res, next) => {
  const {examId, answers} = req.body;
  const exam = await Exam.findById(examId);

  if(!exam) return next(new AppError('Exam not found', 404));

  // Check student hasn't already taken this exam
  const existingGrade = await Grade.findOne({ studentId: req.user.id, exam: examId });
  if(existingGrade) return next(new AppError('You have already submitted this exam', 400));

  let score = 0;
  const pointsPerQuestion = exam.totalMarks / (exam.questions.length || 1);

  exam.questions.forEach((q, index) => {
    // Support answers keyed by question _id string OR by index string
    const answer = answers[q._id.toString()] || answers[String(index)];
    const correct = q.correctAnswer;
    if(answer !== undefined && correct !== undefined && answer.toString() === correct.toString()) {
      score += pointsPerQuestion;
    }
  });

  const grade = await Grade.create({
    studentId: req.user.id,
    exam: examId,
    Score: Math.round(score),
    feedback: score >= exam.totalMarks * 0.5 ? 'Pass' : 'Fail'
  });

  res.status(200).json({
    status: 'success',
    data: { grade, totalMarks: exam.totalMarks }
  });
});