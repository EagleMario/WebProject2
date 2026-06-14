const lectures = require('./Lecture.js');
const Class = require('../Classes/class.js');
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
exports.addLectures = catchasync (async(req, res, next) => {

        const {title, content, description, classId, pdfUrl, externallink, contentUrl} = req.body;

        const targetClass = await Class.findById(classId);
        if(!targetClass){
            return next(new AppError('Class Not found', 404));
        }
        // Check if the requesting teacher is assigned to this class
        const isTeacherInClass = targetClass.teachers && targetClass.teachers.some(
            t => t.teacher && t.teacher.toString() === req.user.id
        );
        if(!isTeacherInClass){
            return next(new AppError('Access Denied: You are not assigned to this class', 403));
        }
        const lecture = new lectures({title, content: content || description, classId, pdfUrl: pdfUrl || contentUrl, externalLink: externallink});
        await lecture.save();
        console.log(`Lecture Created ${title} for class ${classId}`);
        res.status(201).json({status:'success', data:{lecture}});

});

exports.GetClassLectures = catchasync (async(req, res) => {
    const {classId}=req.params;
    const data = await lectures.find({classId}).sort({createdAt:-1});
    console.log(`Fetched ${data.length} Lectures for class ${classId}`);
    res.status(200).json({status:'success',data:{lectures:data}});
});
exports.joinLectures =catchasync(async(req, res, next) => {
    const {lectureId}=req.body;
    const lecture=await lectures.findById(lectureId);
        if(!lecture){
            return next(new AppError('Lecture not available',404));
        }
        res.status(200).json({message:'Lecture joined successfully',lecture});
});
exports.DeleteLectures = catchasync(async (req, res, next) => {
        const {lectureId}=req.body;
        const lecture=await lectures.findById(lectureId);
            if(!lecture){
            return next(new AppError('Lecture not found',404));
        }
        const targetclass=await Class.findById(lecture.classId);
        if(!targetclass||targetclass.manager.toString()!=req.user.id){
                return next(new AppError('Access denied',403));
            }
            await lectures.findByIdAndDelete(lectureId);
            res.status(200).json({message:'Lecture deleted',lecture});
});