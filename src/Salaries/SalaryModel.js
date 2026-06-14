import mongoose from 'mongoose';
const { Schema } = mongoose;

const SalarySchema = new Schema({
    teacher: {
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
        default: 'Monthly Base Salary'
    },
    paidDate: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model('Salary', SalarySchema);
