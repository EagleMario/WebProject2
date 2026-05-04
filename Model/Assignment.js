const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Homework', 'Project', 'Quiz', 'Other'],
        default: 'Homework'
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    maxMark: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", AssignmentSchema);
