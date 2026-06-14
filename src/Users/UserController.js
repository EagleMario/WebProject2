import User from './User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../Core/Utils/appError.js';
import catchasync from '../Core/Utils/CatchAsync.js';
import reportQueue from '../Core/Queues/reportQueue.js';
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CreateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};
export const bulkImportStudents = catchasync(async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('No file uploaded', 400));
    }
    const results = [];
    const filePath = req.file.path;

    await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', resolve)
            .on('error', reject);
    });

    if (results.length === 0) {
        fs.unlinkSync(filePath);
        return next(new AppError('The CSV file is empty!', 400));
    }

    const defaultPassword = 'MarioSchool';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    console.log("Parsed CSV rows:", results);

    const studentsData = results.map(student => {
        const getVal = (obj, keyName) => {
            const key = Object.keys(obj).find(k => k.toLowerCase().trim().replace(/^\ufeff/, '') === keyName.toLowerCase());
            return key ? obj[key]?.trim() : undefined;
        };

        const name = getVal(student, 'name');
        const email = getVal(student, 'email');
        const levelVal = getVal(student, 'level');

        return {
            name,
            email,
            password: hashedPassword,
            role: 'student',
            level: levelVal ? Number(levelVal) : undefined,
            isApproved: true
        };
    });

    console.log("Mapped studentsData for database:", studentsData);

    // Filter out users whose name, email, or level is missing/invalid
    const validStudentsData = studentsData.filter(s => s.name && s.email && [1, 2, 3, 4].includes(s.level));
    if (validStudentsData.length === 0) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return next(new AppError('No valid student records found. Check headers (name,email,level) and levels (1-4).', 400));
    }

    try {
        // Find existing emails in the database to prevent duplicate keys
        const emails = validStudentsData.map(s => s.email.toLowerCase());
        const existingUsers = await User.find({ email: { $in: emails } });
        const existingEmails = new Set(existingUsers.map(u => u.email.toLowerCase()));

        const newStudentsData = validStudentsData.filter(s => !existingEmails.has(s.email.toLowerCase()));

        if (newStudentsData.length === 0) {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.status(200).json({
                status: 'success',
                message: 'All students in the CSV file already exist in the database.',
                count: 0,
                data: { students: [] }
            });
        }

        const insertedStudents = await User.insertMany(newStudentsData);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(201).json({
            status: 'success',
            message: 'Bulk import completed successfully',
            count: insertedStudents.length,
            data: {
                students: insertedStudents
            }
        });
    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        return next(err);
    }
});
export const SignUp = catchasync(async (req, res, next) => {
    const HashedPassword = await bcrypt.hash(req.body.password, 12);

    if (req.body.role && (req.body.role.toLowerCase() === 'manager' || req.body.role.toLowerCase() === 'admin')) {
        return next(new AppError('Unauthorized role assignment. Manager accounts are pre-defined.', 403));
    }
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: HashedPassword,
        role: req.body.role,
        teacherSubject: req.body.teacherSubject,
        employeeId: req.body.employeeId,
        level: req.body.level,
        isApproved: false
    });
    const token = CreateToken(newUser._id);

    res.status(201).json({
        status: 'success',
        token,
        data: { User: newUser }
    });
});
export const login = catchasync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('please Enter the email and password :)', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('InCorrect email or password !', 401));
    }
    if (user.role !== 'Manager' && user.role !== 'admin' && !user.isApproved) {
        return next(new AppError('Your account is pending approval by the Manager.', 403));
    }
    const today = new Date().toISOString().split('T')[0];
    if (user.role.toLowerCase() == 'student' && user.lastLoginDate !== today) {
        user.points = (user.points || 0) + 1;
        user.lastLoginDate = today;
        await user.save();
    }
    const token = CreateToken(user._id);
    res.status(200).json({
        status: 'Success',
        token,
        role: user.role
    });
});
export const getAllUsers = catchasync(async (req, res, next) => {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter);

    res.status(200).json({
        status: 'Sucess',
        results: users.length,
        data: { users }
    });
});
export const getPendingUsers = catchasync(async (req, res, next) => {
    const users = await User.find({ isApproved: false });
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

export const approveUser = catchasync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
});
export const deleteUser = catchasync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(204).json({ status: 'success', data: null });
});
export const DectivateUsers = catchasync(async (req, res) => {
    try {
        const { userId } = req.params;

        const UpdateUser = await User.findByIdAndUpdate(userId, { $set: { isApproved: false } }, { new: true });
        if (!UpdateUser) {
            return next(new AppError('User not found', 404));
        }
        res.status(200).json({ status: 'success', data: { user: UpdateUser } });

        const io = req.app.get('socketio');
        io.to(userId).emit('user_deactivated', {
            message: 'Your account has been deactivated by the manager.'
        })
        console.log('Force fully Logged out', userId);
        res.status(200).json({ status: 'success', message: 'User deactivated successfully' });
    }
    catch (error) {
        console.log('Error Deactivating User', error);
        res.status(500).json({ status: 'error', message: 'Failed to deactivate user' });
    }
});
