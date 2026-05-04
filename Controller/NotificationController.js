const Notification = require('../Model/Notifications.js');
const AppError=require('../Utils/appError.js');
const catchasync=require('../Utils/CatchAsync.js')

exports.PushNotification = catchasync (async(req, res) => {
    const{UserId,Title,message}=req.body;
    const notifications=new Notification({
        UserId,
        Title,
        Message
    });
    await notifications.save();
    const io=req.app.get('socketio');
    io.to(UserId).emit('New Notification',notifications);
    res.status(201).json({message:'You might have a new message',notifications});
});
exports.IsReadNotification = catchasync (async(req, res) => {
    const {UserId}=req.body;
    const notifications=await Notification.find({UserId});
    res.status(200).json(notifications);
 });
