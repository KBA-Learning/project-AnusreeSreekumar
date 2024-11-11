import mongoose from "mongoose";

const questionSetSchema = new mongoose.Schema({
    dbquizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuizCatgry',
        required: true,
        unique: true
    },
    dbcategory: {
        type: String,
        required: true
    },
    dbquestions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        answer: {
            type: String,
            required: true
        }
    }],
    dbdifficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QuestionSet = mongoose.model('QuestionSet', questionSetSchema);

export {QuestionSet}