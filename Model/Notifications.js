const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Title: {
        type: String,
        required: true
    },
    Message: {
        type: String,
        required: true
    },
    IsRead: {
        type: Boolean,
        default: false
    },
    CreatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Notification', NotificationSchema);