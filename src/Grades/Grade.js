const mongoose = require('mongoose');
const { Schema } = mongoose;

const gradeSchema = new mongoose.Schema({
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Score: Number,
    feedback: String
});
module.exports = mongoose.model('Grade', gradeSchema);