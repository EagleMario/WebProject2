import express from 'express';
import * as ExamSchedule from './ExamScheduleController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

// Routes
router.post('/create', restrictTo('Manager'), ExamSchedule.createSchedule);
router.get('/', ExamSchedule.getAllSchedules);
router.get('/:id', ExamSchedule.getScheduleById);
router.patch('/:id', restrictTo('Manager'), ExamSchedule.updateSchedule);
router.delete('/:id', restrictTo('Manager'), ExamSchedule.deleteSchedule);

export default router;