import mongoose from 'mongoose';
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

export default mongoose.model('Notification', NotificationSchema);