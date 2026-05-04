const express = require('express');
const router = express.Router();
const ExamController = require('../Controller/ExamController.js');
const { protect, restrictTo } = require('../MiddleWare/UserMiddleWare.js');

router.post('/add', protect, restrictTo('Teacher'), ExamController.CreateExam);
router.get('/all', protect, ExamController.GetAllExam);
router.delete('/:id', protect, restrictTo('Teacher'), ExamController.deleteExam);

// Student Exam Routes
router.get('/available', protect, restrictTo('student', 'Student'), ExamController.GetAvailableExams);
router.post('/submit', protect, restrictTo('student', 'Student'), ExamController.SubmitExam);

module.exports = router;