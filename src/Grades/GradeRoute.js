import express from 'express';
const router = express.Router();
import * as GradeController from './GradeController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';

router.post('/add', protect, restrictTo('Teacher'), GradeController.addGrade);

router.get('/exam/:examId', protect, restrictTo('Teacher'), GradeController.getExamGrades);

export default router;
