const mongoose = require('mongoose');
const Assignment = require('./Assignment');
const { Schema } = mongoose;

const AssignmentSubmissionSchema = new Schema({

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    submissionUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Graded'],
        default: 'Pending'
    },
    grade: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model("AssignmentSubmission", AssignmentSubmissionSchema);