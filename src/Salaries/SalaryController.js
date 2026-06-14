import Salary from './SalaryModel.js';
import User from '../Users/User.js';
import catchasync from '../Core/Utils/CatchAsync.js';
import AppError from '../Core/Utils/appError.js';

export const assignSalary = catchasync(async (req, res, next) => {
    const { teacherId, amount, term, dueDate, description } = req.body;

    if (!teacherId || !amount || !term || !dueDate) {
        return next(new AppError('Please provide teacherId, amount, term and dueDate', 400));
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || (teacher.role.toLowerCase() !== 'teacher')) {
        return next(new AppError('Teacher not found', 404));
    }

    const newSalary = await Salary.create({
        teacher: teacherId,
        amount,
        term,
        dueDate,
        description: description || 'Monthly Base Salary'
    });

    res.status(201).json({
        status: 'success',
        data: { salary: newSalary }
    });
});

export const getAllSalaries = catchasync(async (req, res, next) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.term) filter.term = req.query.term;
    if (req.query.teacherId) filter.teacher = req.query.teacherId;

    const salaries = await Salary.find(filter).populate('teacher', 'name email');

    res.status(200).json({
        status: 'success',
        results: salaries.length,
        data: { salaries }
    });
});

export const getMySalaries = catchasync(async (req, res, next) => {
    const teacherId = req.user.id;
    const salaries = await Salary.find({ teacher: teacherId });

    res.status(200).json({
        status: 'success',
        results: salaries.length,
        data: { salaries }
    });
});

export const updateSalaryStatus = catchasync(async (req, res, next) => {
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

    const salary = await Salary.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!salary) {
        return next(new AppError('Salary record not found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { salary }
    });
});

export const deleteSalary = catchasync(async (req, res, next) => {
    const salary = await Salary.findByIdAndDelete(req.params.id);
    if (!salary) {
        return next(new AppError('Salary record not found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
