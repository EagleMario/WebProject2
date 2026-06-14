import mongoose from 'mongoose';
const { Schema } = mongoose;

const ExamScheduleSchema = new Schema({

    ExamId: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        required: true,
    },
    Time: {
        type: String,
        required: true,
    },
    Day: {
        type: String,
        required: true,
    },
    ManagerId: {
        type: String,
        required: true,
    },
    classID: {
        type: String,
        required: true,
    },

});

export default mongoose.model("ExamSchedule", ExamScheduleSchema);