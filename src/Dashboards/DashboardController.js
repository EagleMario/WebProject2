import User from '../Users/User.js';
import Exam from '../Exams/exam.js';
import Class from '../Classes/class.js';
import Grade from '../Grades/Grade.js';
import AppError from '../Core/Utils/appError.js';
import catchasync from '../Core/Utils/CatchAsync.js';
import * as dashboardService from './DashboardServices.js';

export const GetManagerDash = catchasync(async (req, res) => {
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
export const GetTeacherDash = catchasync(async (req, res) => {

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
export const getTopTeachers = async (req, res) => {
    try {
        // 2. بتنادي على الدالة بالاسم الجديد
        const topTeachersData = await dashboardService.getTopTeachersService();
        
        res.status(200).json({
            success: true,
            data: topTeachersData
        });
    } catch (error) {
        console.error("Error in getTopTeachers controller:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// هنضيف الدالة دي مع دالة getTopTeachers اللي عملناها قبل كدا
export const getStudentsGPA = async (req, res) => {
    try {
        const studentsGpaData = await dashboardService.calculateStudentsGpaService();
        
        res.status(200).json({
            success: true,
            data: studentsGpaData
        });
    } catch (error) {
        console.error("Error calculating students GPA:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
export const GetStudentDash = catchasync(async (req, res) => {

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
