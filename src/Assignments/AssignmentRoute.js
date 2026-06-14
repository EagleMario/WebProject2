import express from 'express';
import * as assignmentController from './AssignmentController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';

const router = express.Router();

router.use(protect);

router.post('/create', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.createAssignment);
router.get('/class/:classId', assignmentController.getAssignmentsByClass);

router.post('/submit', restrictTo('student', 'Student'), assignmentController.submitAssignment);

router.get('/submissions/:assignmentId', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.getSubmissions);
router.patch('/grade/:submissionId', restrictTo('Teacher', 'teacher', 'admin'), assignmentController.gradeSubmission);

export default router;
