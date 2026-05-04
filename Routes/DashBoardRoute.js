const express = require('express');
const router = express.Router();
const authMiddleware = require('../MiddleWare/UserMiddleWare.js');
const dashboardController = require('../Controller/DashboardController.js');

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

module.exports = router;