const mongoose = require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, select: false },
    role: {
        type: String,
        enum: ['student', 'teacher', 'Student', 'Manager', 'Teacher', 'admin'],
        default: 'student'
    },
    points: {
        type: Number,
        default: 0
    },
    lastLoginDate: {
        type: String,
        default: ""
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    teacherSubject: {
        type: String,
        required: function () {
            return this.role === 'teacher' || this.role === 'Teacher'
        }
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    level: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: function () {
            return this.role.toLowerCase() === 'student';
        }
    }

});
module.exports = mongoose.model('User', UserSchema);