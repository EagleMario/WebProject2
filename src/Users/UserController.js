const User = require('./User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../Core/Utils/appError.js');
const catchasync = require('../Core/Utils/CatchAsync.js');
const reportQueue = require('../Core/Queues/reportQueue.js');
import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const CreateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};
exports.bulkImportStudents = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a CSV file!', 400));
  }

  const results = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        if (results.length === 0) {
          fs.unlinkSync(filePath); 
          return next(new AppError('The CSV file is empty!', 400));
        }

        const defaultPassword = 'DefaultStudent123'; 
        const hashedPassword = await bcrypt.hash(defaultPassword, 12);

        const studentsData = results.map((row) => {
          return {
            name: row.Name || row.name,
            email: row.Email || row.email,
            password: hashedPassword,
            role: 'student', 
            level: row.Level || row.level || '1',
            isApproved: true,
          }; 
        });

    
        const insertedStudents = await User.insertMany(studentsData, { ordered: false });

    
        fs.unlinkSync(filePath);

        res.status(201).json({
          status: 'success',
          message: 'Bulk import completed successfully.',
          count: insertedStudents.length,
          data: {
            students: insertedStudents,
          },
        });
      } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        
        if (err.name === 'BulkWriteError' || err.code === 11000) {
          return res.status(201).json({
            status: 'success',
            message: 'Bulk import completed, but some duplicate emails were skipped.',
            insertedCount: err.result?.nInserted || 0,
          });
        }
        
        return next(err);
      }
    });
});

exports.SignUp = catchasync(async (req, res, next) => {
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
exports.login = catchasync(async (req, res, next) => {
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
exports.getAllUsers = catchasync(async (req, res, next) => {
    const filter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(filter);

    res.status(200).json({
        status: 'Sucess',
        results: users.length,
        data: { users }
    });
});
exports.getPendingUsers = catchasync(async (req, res, next) => {
    const users = await User.find({ isApproved: false });
    res.status(200).json({ status: 'success', results: users.length, data: { users } });
});

exports.approveUser = catchasync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.status(200).json({ status: 'success', data: { user } });
});
exports.deleteUser = catchasync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    res.status(204).json({ status: 'success', data: null });
});
