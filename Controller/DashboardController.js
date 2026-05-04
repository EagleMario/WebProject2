const User = require('../Model/User.js');
const Exam = require('../Model/exam.js');
const Class = require('../Model/class.js');
const Grade = require('../Model/Grade.js');
const AppError = require('../Utils/appError.js');
const catchasync = require('../Utils/CatchAsync.js');

exports.GetManagerDash = catchasync(async (req, res) => {
    const UserId = req.user.id;

    const [classes, teachers, students, exams] = await Promise.all([
        Class.find({}).populate('teachers.teacher', 'name email').populate('students', 'name email'),
        User.find({ role: { $in: ['teacher', 'Teacher'] } }),
        User.find({ role: { $in: ['student', 'Student'] } }),
        Exam.find({})
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            classes,
            teachers,
            students,
            exams
        }
    });
});
exports.GetTeacherDash = catchasync(async (req, res) => {

    const teacherExams = await Exam.find({ teacher: req.user.id });
    const examsId = teacherExams.map(e => e._id);

    const ExamCount = await Exam.countDocuments({ teacher: req.user.id });

    const RecentGrades = await Grade.find({ exam: { $in: examsId } })
        .limit(5)
        .sort('-_id')
        .populate('studentId', 'name')
        .populate('exam', 'subject')

    res.status(200).json({
        status: 'success',
        data: {
            totalExams: ExamCount,
            RecentGrades
        }
    });
});
exports.GetStudentDash = catchasync(async (req, res) => {

    const studentId = req.user.id;
    const studentLevel = req.user.level;

    const enrolledClasses = await Class.find({ students: studentId }).populate('teachers.teacher', 'name');

    const discoverClasses = await Class.find({ 
        level: studentLevel,
        students: { $ne: studentId }
    }).populate('teachers.teacher', 'name').limit(10);

    const recentGrades = await Grade.find({ studentId: studentId })
        .limit(5)
        .sort('-_id')
        .populate('exam', 'subject totalMarks date');

    res.status(200).json({
        status: 'success',
        data: {
            points: req.user.points || 0,
            enrolledClasses,
            discoverClasses,
            recentGrades
        }
    });
});
