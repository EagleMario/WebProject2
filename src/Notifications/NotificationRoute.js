import express from 'express';
import * as Notification from './NotificationController.js';
import { protect, restrictTo } from '../Core/MiddleWare/UserMiddleWare.js';
const router = express.Router();

router.post('/send', Notification.PushNotification);
router.post('/isread', Notification.IsReadNotification);
router.post('/emergency', protect, restrictTo('Manager'), Notification.broadCastEmergency);
export default router;