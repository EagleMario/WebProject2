const mongoose = require('mongoose');
const { Schema } = mongoose;
const classSchema = new mongoose.Schema({

  className: {
    type: String,
    required: true,
    unique: true
  },
  teachers: [{
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subject: String,
  }],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  maxStudents: {
    type: Number,
    required: true,
    default: 20
  },
  level: {
    type: Number,
    required: [true, 'Class must belong to a specific level'],
    enum: [1, 2, 3, 4]
  },
});

module.exports = mongoose.model('class', classSchema);