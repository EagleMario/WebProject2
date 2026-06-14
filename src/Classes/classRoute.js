import express from 'express';
const router = express.Router();
import * as classController from './classController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';


router.post('/add', protect, restrictTo('Manager', 'admin'), classController.CreateClass);
router.post('/:classId/add-student', protect, restrictTo('Teacher'), classController.AddStudentsToClass);
router.get('/all', protect, classController.getAllClasses);
router.post('/add-teacher', protect, restrictTo('Manager', 'admin'), classController.addTeacherToClass);
router.post('/add-student', protect, restrictTo('Manager', 'admin'), classController.addStudentToClass);
router.delete('/:classId', protect, restrictTo('Manager', 'admin'), classController.deleteClass);
router.patch('/:classId', protect, restrictTo('Manager', 'admin'), classController.updateClass);

export default router;