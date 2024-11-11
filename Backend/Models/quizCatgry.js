import mongoose from "mongoose";

//Schema for Quiz Type
const quizSchema = new mongoose.Schema({
    dbCategoryType: {
        type: String,
        required: true
    },
    dbCategorySet: {
        type: String,
        required: true
    },
    dbTitle: {
        type: String,
        required: true,
        unique: true // Ensures the combination of dbCategoryType and dbCategorySet is unique
    },
    dbDescription: {
        type: String,
        required: false
    },
    dbNumOfQuestions: {
        type: Number,
        required: true
    },
    dbQuestions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QuestionSet'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const QuizCatgry = mongoose.model('QuizCategory',quizSchema)

QuizCatgry.schema.pre('save', function (next) {

    this.updatedAt = Date.now(); // Update 'updatedAt' field
});

export{QuizCatgry}