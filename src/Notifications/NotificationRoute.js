import express from 'express';
import * as Notification from './NotificationController.js';
const router = express.Router();

router.post('/send', Notification.PushNotification);
router.post('/isread', Notification.IsReadNotification);

export default router;