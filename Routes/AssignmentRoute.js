const express = require('express');
const assignmentController = require('../Controller/AssignmentController');
const { protect, restrictTo } = require('../MiddleWare/UserMiddleWare');

const router = express.Router();

router.use(protect);

router.post('/create', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.createAssignment);
router.get('/class/:classId', assignmentController.getAssignmentsByClass);

router.post('/submit', restrictTo('student', 'Student'), assignmentController.submitAssignment);

router.get('/submissions/:assignmentId', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.getSubmissions);
router.patch('/grade/:submissionId', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.gradeSubmission);

module.exports = router;
