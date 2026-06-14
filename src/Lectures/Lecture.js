const mongoose = require('mongoose');
const { Schema } = mongoose;

const LectureSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'class', // Match the model name registered in class.js
        required: true
    },
    pdfUrl: {
        type: String,
        default: ''
    },
    externalLink: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lecture', LectureSchema); 
