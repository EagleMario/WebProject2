require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Routes
const userRoute = require('./src/Users/UserRoute.js');
const classRoute = require('./src/Classes/classRoute.js');
const ExamRoute = require('./src/Exams/ExamRoute.js');
const ExamScheduleRoute = require('./src/Exams/ExamScheduleRoute.js');
const GradeRoute = require('./src/Grades/GradeRoute.js');
const DashboardRoute = require('./src/Dashboards/DashBoardRoute.js');
const lecturesRoute = require('./src/Lectures/LecturesRoute.js');
const NotificationRoute = require('./src/Notifications/NotificationRoute.js');
const aiRoute = require('./src/Ai/AiRoute.js');
const assignmentRoute = require('./src/Assignments/AssignmentRoute.js');

// Import Error Controller
const globalErrorController = require('./src/Errors/errorController.js');
const AppError = require('./src/Core/Utils/appError.js');

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoute);
app.use('/api/classes', classRoute);
app.use('/api/exams', ExamRoute);
app.use('/api/exam-schedule', ExamScheduleRoute);
app.use('/api/grades', GradeRoute);
app.use('/api/dashboard', DashboardRoute);
app.use('/api/lectures', lecturesRoute);
app.use('/api/notifications', NotificationRoute);
app.use('/api/ai', aiRoute);
app.use('/api/assignments', assignmentRoute);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// 404 Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error Controller
app.use(globalErrorController);

module.exports = app;
