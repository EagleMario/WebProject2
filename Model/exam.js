const mongoose = require('mongoose');
const { Schema } = mongoose;
const ExamSchema = new mongoose.Schema({
    subject: String,
    totalMarks: Number,
    date: { type: Date, default: Date.now },
    duration: Number, // duration in minutes
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'class',
        required: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    questions: [{
        questionText: String,
        text: String,
        options: [String],
        correctAnswer: String
    }]
});
module.exports = mongoose.model('Exam', ExamSchema);