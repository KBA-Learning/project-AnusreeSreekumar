import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    dbCategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'QuizCategory', 
        required: true 
    },
    quizTitle: { 
        type: String, 
        required: true, 
        unique: true // Enforces uniqueness for quiz titles
    },
    dbParticipants: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Player' 
        }
    ],
    dbScores: [{
        playerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Player' 
        },
        score: { 
            type: Number, 
            required: true 
        },
        date: { 
            type: Date, 
            default: Date.now 
        }
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

const Quiz = mongoose.model('QuizSet', quizSchema)

export {Quiz}