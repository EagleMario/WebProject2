const ExamSchedule = require('../Model/ExamSchedule');
const AppError = require('../Utils/appError.js');
const catchasync = require('../Utils/CatchAsync.js');
const Exam = require('../Model/exam');
const Class = require('../Model/class');

exports.createSchedule = catchasync(async (req, res, next) => {
    const { ExamId, Date: scheduleDate, Time, Day, classID } = req.body;

    if (!ExamId || !scheduleDate || !Time || !Day || !classID) {
        return next(new AppError('Please provide all required fields (ExamId, Date, Time, Day, classID)', 400));
    }

    // Verify Exam exists
    const exam = await Exam.findById(ExamId);
    if (!exam) return next(new AppError('Exam not found', 404));

    // Verify Class exists
    const cls = await Class.findById(classID);
    if (!cls) return next(new AppError('Class not found', 404));

    const schedule = await ExamSchedule.create({
        ExamId,
        Date: new Date(scheduleDate),
        Time,
        Day,
        ManagerId: req.user._id.toString(),
        classID
    });

    res.status(201).json({
        status: 'success',
        data: {
            schedule
        }
    });
});

exports.getAllSchedules = catchasync(async (req, res, next) => {
    const schedules = await ExamSchedule.find();

    res.status(200).json({
        status: 'success',
        results: schedules.length,
        data: {
            schedules
        }
    });
});

exports.getScheduleById = catchasync(async (req, res, next) => {
    const schedule = await ExamSchedule.findById(req.params.id);

    if (!schedule) {
        return next(new AppError('No schedule found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            schedule
        }
    });
});

exports.updateSchedule = catchasync(async (req, res, next) => {
    const { id } = req.params;
    
    // Check if schedule exists and belongs to the manager (or if admin)
    const existingSchedule = await ExamSchedule.findById(id);
    if (!existingSchedule) {
        return next(new AppError('No schedule found with that ID', 404));
    }

    if (req.user.role.toLowerCase() === 'manager' && existingSchedule.ManagerId !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to update this schedule', 403));
    }

    const schedule = await ExamSchedule.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            schedule
        }
    });
});

exports.deleteSchedule = catchasync(async (req, res, next) => {
    const { id } = req.params;

    const existingSchedule = await ExamSchedule.findById(id);
    if (!existingSchedule) {
        return next(new AppError('No schedule found with that ID', 404));
    }

    if (req.user.role.toLowerCase() === 'manager' && existingSchedule.ManagerId !== req.user._id.toString()) {
        return next(new AppError('You do not have permission to delete this schedule', 403));
    }

    await ExamSchedule.findByIdAndDelete(id);

    res.status(204).json({
        status: 'success',
        data: null
    });
});
