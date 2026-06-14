import Notification from './Notifications.js';
import AppError from '../Core/Utils/appError.js';
import catchasync from '../Core/Utils/CatchAsync.js';
import { Timestamp } from 'mongodb';


export const broadCastEmergency = catchasync(async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return new AppError("Message is required", 400)
        }
        const io = req.app.get('socketio');

        if (!io) {
            return new AppError("Socket server not running", 500)
        }
        io.emit('emergency_alert', {
            message,
            Timestamp: new Date()
        });
        return res.status(200).json({ success: true, message: "Emergency alert sent" })
    }
    catch (error) {
        console.log(error);
        return new AppError("Internal server error", 500)
    }
})
export const PushNotification = catchasync(async (req, res) => {
    const { UserId, Title, message } = req.body;
    const notifications = new Notification({
        UserId,
        Title,
        Message
    });
    await notifications.save();
    const io = req.app.get('socketio');
    io.to(UserId).emit('New Notification', notifications);
    res.status(201).json({ message: 'You might have a new message', notifications });
});
export const IsReadNotification = catchasync(async (req, res) => {
    const { UserId } = req.body;
    const notifications = await Notification.find({ UserId });
    res.status(200).json(notifications);
});
