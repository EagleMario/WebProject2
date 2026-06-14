import express from 'express';
const router = express.Router();
import * as lecture from './LecturesController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';

router.post('/addLectures', protect, restrictTo('teacher'), lecture.addLectures);
router.get('/class/:classId', protect, lecture.GetClassLectures);
router.post('/joinLectures', protect, lecture.joinLectures);
router.post('/DeleteLectures', protect, restrictTo('teacher'), lecture.DeleteLectures);

export default router;