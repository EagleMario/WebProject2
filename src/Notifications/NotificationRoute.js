const express = require('express');
const Notification = require('./NotificationController.js');
const router = express.Router();

router.post('/send', Notification.PushNotification);
router.post('/isread', Notification.IsReadNotification);

module.exports = router;