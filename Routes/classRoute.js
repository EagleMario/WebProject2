const express = require('express');
const router = express.Router();
const classController = require('../Controller/classController.js');
const { protect, restrictTo } = require('../MiddleWare/UserMiddleWare.js');


router.post('/add', protect, restrictTo('Manager', 'admin'), classController.CreateClass);
router.post('/:classId/add-student', protect, restrictTo('Teacher'), classController.AddStudentsToClass);
router.get('/all', protect, classController.getAllClasses);
router.post('/add-teacher', protect, restrictTo('Manager', 'admin'), classController.addTeacherToClass);
router.post('/add-student', protect, restrictTo('Manager', 'admin'), classController.addStudentToClass);
router.delete('/:classId', protect, restrictTo('Manager', 'admin'), classController.deleteClass);
router.patch('/:classId', protect, restrictTo('Manager', 'admin'), classController.updateClass);

module.exports = router;