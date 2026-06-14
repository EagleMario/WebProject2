import Fees from './FeesModel.js';
import User from '../Users/User.js';
import catchasync from '../Core/Utils/CatchAsync.js';
import AppError from '../Core/Utils/appError.js';

export const assignFee = catchasync(async (req, res, next) => {
    const { studentId, amount, term, dueDate, description } = req.body;

    if (!studentId || !amount || !term || !dueDate) {
        return next(new AppError('Please provide studentId, amount, term and dueDate', 400));
    }

    const student = await User.findById(studentId);
    if (!student || student.role.toLowerCase() !== 'student') {
        return next(new AppError('Student not found', 404));
    }

    const newFee = await Fees.create({
        student: studentId,
        amount,
        term,
        dueDate,
        description: description || 'Tuition Fee'
    });

    res.status(201).json({
        status: 'success',
        data: { fee: newFee }
    });
});

export const getAllFees = catchasync(async (req, res, next) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.term) filter.term = req.query.term;
    if (req.query.studentId) filter.student = req.query.studentId;

    const fees = await Fees.find(filter).populate('student', 'name email');

    res.status(200).json({
        status: 'success',
        results: fees.length,
        data: { fees }
    });
});

export const getMyFees = catchasync(async (req, res, next) => {
    const studentId = req.user.id;
    const fees = await Fees.find({ student: studentId });

    res.status(200).json({
        status: 'success',
        results: fees.length,
        data: { fees }
    });
});

export const updateFeeStatus = catchasync(async (req, res, next) => {
    const { status } = req.body;
    if (!status || !['Paid', 'Unpaid'].includes(status)) {
        return next(new AppError('Please provide a valid status (Paid or Unpaid)', 400));
    }

    const updateData = { status };
    if (status === 'Paid') {
        updateData.paidDate = new Date();
    } else {
        updateData.paidDate = null;
    }

    const fee = await Fees.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!fee) {
        return next(new AppError('Fee record not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { fee }
    });
});

export const deleteFee = catchasync(async (req, res, next) => {
    const fee = await Fees.findByIdAndDelete(req.params.id);
    if (!fee) {
        return next(new AppError('Fee record not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
