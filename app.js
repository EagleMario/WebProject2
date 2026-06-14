import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';

// Import Routes
import userRoute from './src/Users/UserRoute.js';
import classRoute from './src/Classes/classRoute.js';
import ExamRoute from './src/Exams/ExamRoute.js';
import ExamScheduleRoute from './src/Exams/ExamScheduleRoute.js';
import GradeRoute from './src/Grades/GradeRoute.js';
import DashboardRoute from './src/Dashboards/DashBoardRoute.js';
import lecturesRoute from './src/Lectures/LecturesRoute.js';
import NotificationRoute from './src/Notifications/NotificationRoute.js';
import aiRoute from './src/Ai/AiRoute.js';
import assignmentRoute from './src/Assignments/AssignmentRoute.js';

// Import Error Controller
import globalErrorController from './src/Errors/errorController.js';
import AppError from './src/Core/Utils/appError.js';

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

export default app;
