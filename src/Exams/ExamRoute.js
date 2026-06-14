import express from 'express';
const router = express.Router();
import * as ExamController from './ExamController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';

router.post('/submit', ExamController.submitExam);
router.post('/add', protect, restrictTo('Teacher'), ExamController.CreateExam);
router.get('/all', protect, ExamController.GetAllExam);
router.delete('/:id', protect, restrictTo('Teacher'), ExamController.deleteExam);

// Student Exam Routes
router.get('/available', protect, restrictTo('student', 'Student'), ExamController.GetAvailableExams);
router.post('/submit', protect, restrictTo('student', 'Student'), ExamController.SubmitExam);

export default router;