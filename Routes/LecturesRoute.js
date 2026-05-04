const express = require('express');
const router = express.Router();
const lecture = require('../Controller/LecturesController.js');
const { protect, restrictTo } = require('../MiddleWare/UserMiddleWare.js');

router.post('/addLectures', protect, restrictTo('teacher'), lecture.addLectures);
router.get('/class/:classId', protect, lecture.GetClassLectures);
router.post('/joinLectures', protect, lecture.joinLectures);
router.post('/DeleteLectures', protect, restrictTo('teacher'), lecture.DeleteLectures);

module.exports = router;