import mongoose from 'mongoose';
const { Schema } = mongoose;

const FeesSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    term: {
        type: String,
        enum: ['Term 1', 'Term 2', 'Term 3'],
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Unpaid'],
        default: 'Unpaid'
    },
    dueDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        default: 'Tuition Fee'
    },
    paidDate: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Fees', FeesSchema);
