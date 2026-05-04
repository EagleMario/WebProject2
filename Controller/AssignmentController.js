const Assignment = require('../Model/Assignment');
const AssignmentSubmission = require('../Model/AssignmentSubmission');
const AppError = require('../Utils/appError.js');
const catchasync = require('../Utils/CatchAsync.js');
const Class = require('../Model/class');


exports.createAssignment = catchasync(async (req, res, next) => {
    const { title, description, classId, dueDate, maxMark, type } = req.body;

    if (!title || !description || !classId || !dueDate || !maxMark) {
        return next(new AppError('Please provide all required fields', 400));
    }
    const cls = await Class.findById(classId);
    if (!cls) return next(new AppError('Class not found', 404));

    const assignment = await Assignment.create({
        title,
        description,
        classId,
        teacherId: req.user._id,
        dueDate: new Date(dueDate),
        maxMark,
        type
    });

    res.status(201).json({
        status: 'success',
        data: { assignment }
    });
});
exports.getAssignmentsByClass = catchasync(async (req, res, next) => {
    const { classId } = req.params;
    const assignments = await Assignment.find({ classId }).populate('teacherId', 'name');

    res.status(200).json({
        status: 'success',
        results: assignments.length,
        data: { assignments }
    });
});


exports.submitAssignment = catchasync(async (req, res, next) => {
    const { assignmentId, submissionUrl } = req.body;

    if (!assignmentId || !submissionUrl) {
        return next(new AppError('Please provide assignmentId and submissionUrl', 400));
    }
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return next(new AppError('Assignment not found', 404));

    const existingSubmission = await AssignmentSubmission.findOne({
        assignmentId,
        studentId: req.user._id
    });

    if (existingSubmission) {
        return next(new AppError('You have already submitted this assignment', 400));
    }

    const submission = await AssignmentSubmission.create({
        assignmentId,
        studentId: req.user._id,
        submissionUrl
    });

    res.status(201).json({
        status: 'success',
        data: { submission }
    });
});


exports.getSubmissions = catchasync(async (req, res, next) => {
    const { assignmentId } = req.params;
    const submissions = await AssignmentSubmission.find({ assignmentId }).populate('studentId', 'name email');

    res.status(200).json({
        status: 'success',
        results: submissions.length,
        data: { submissions }
    });
});


exports.gradeSubmission = catchasync(async (req, res, next) => {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;

    const submission = await AssignmentSubmission.findByIdAndUpdate(submissionId, {
        grade,
        feedback,
        status: 'Graded'
    }, {
        new: true,
        runValidators: true
    });

    if (!submission) return next(new AppError('Submission not found', 404));

    res.status(200).json({
        status: 'success',
        data: { submission }
    });
});
