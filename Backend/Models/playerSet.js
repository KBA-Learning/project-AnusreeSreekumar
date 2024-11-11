import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    dbUsername: { type: String, required: true },
    dbEmail: { type: String, required: true, unique: true },
    dbPassword: { type: String, required: true },
    dbRole: { type: String, required: true },
    dbScores: [{ 
        quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
        score: { type: Number, required: true },
        date: { type: Date, default: Date.now }
    }],
    dbQuizHistory: [{
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'QuizCategory' },
        score: Number,
        date: { type: Date, default: Date.now }
    }],
    dbTotalScore: { type: Number, default: 0 }, //
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Player = mongoose.model('PlayerSet', playerSchema)

export {Player}