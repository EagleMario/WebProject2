const express = require('express');
const router = express.Router();
const GradeController = require('./GradeController.js');
const { protect, restrictTo } = require('../Core/MiddleWare/UserMiddleWare.js');

router.post('/add', protect, restrictTo('Teacher'), GradeController.addGrade);

router.get('/exam/:examId', protect, restrictTo('Teacher'), GradeController.getExamGrades);

module.exports = router;
