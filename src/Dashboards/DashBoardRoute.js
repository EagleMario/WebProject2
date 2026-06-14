import express from 'express';
const router = express.Router();
import * as authMiddleware from '../Core/MiddleWare/UserMiddleWare.js';
import * as dashboardController from './DashboardController.js';

router.get('/top-teachers', dashboardController.getTopTeachers);

router.get('/students-gpa', dashboardController.getStudentsGPA);

router.get('/manager-stats',
    authMiddleware.protect,
    authMiddleware.restrictTo('Manager'),
    dashboardController.GetManagerDash
);
router.get('/teacher-stats',
    authMiddleware.protect,
    authMiddleware.restrictTo('Teacher'),
    dashboardController.GetTeacherDash
);
router.get('/student-stats',
    authMiddleware.protect,
    authMiddleware.restrictTo('student', 'Student'),
    dashboardController.GetStudentDash
);

export default router;