import { Router } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import moment from 'moment';

import { Player } from "../Models/playerSet.js";
import { authenticate } from "../Middleware/auth.js";
import { QuestionSet } from "../Models/questionSet.js";
import { QuizCatgry } from "../Models/quizCatgry.js";

dotenv.config();
const playerroute = Router();
// const SecretKey = process.env.secretKey

mongoose.connect('mongodb://localhost:27017/TriviaHub')

//User Signup 
playerroute.post('/signup_user', async (req, res) => {

    try {

        const data = req.body;
        const { Username,
            Email,
            Password
        } = data
        console.log("Req data:", data);

        const Role = "User"
        const newP = await bcrypt.hash(Password, 10);
        const existingUser = await Player.findOne({ dbEmail: Email })

        if (existingUser) {

            res.status(404).json({ message: "Player exists in DB" })
            console.log("User already registered");
        }
        else {

            const newPlayer = new Player({
                dbUsername: Username,
                dbEmail: Email,
                dbPassword: newP,
                dbRole: Role
            })
            await newPlayer.save();
            res.status(200).json({ message: "Player entry created" });
            console.log("User registred successfully");
        }
    }
    catch (error) {
        console.log(error);
    }

})

playerroute.get('/displayquizset', authenticate, async (req, res) => {

    const loginRole = req.userrole;
    try {

        if (loginRole == 'User') {

            const quizSet = await QuestionSet.find({}, 'dbquizId dbcategory dbdifficulty');
            const results = [];
            // console.log('Set is: ',quizSet);
            for (const cat of quizSet) {

                const quizCount = await QuizCatgry.findOne({ dbTitle: cat.dbcategory }, 'dbNumOfQuestions')

                results.push({
                    quizId: cat.dbquizId,
                    category: cat.dbcategory,
                    difficulty: cat.dbdifficulty,
                    questionCount: quizCount ? quizCount.dbNumOfQuestions : 0,
                })
            }
            res.status(200).json(results)
        }
    }
    catch (error) {
        console.log('Error fetching quiz categories:', error);
        res.status(500).json({ message: 'Failed to fetch quiz set' });
    }
})

// playerroute.get('/scorecard', authenticate, async (req, res) => {

//     const loginRole = req.userrole;
//     console.log("Role:", loginRole);

//     try {
//         if (loginRole == 'User') {

//             const playerId = req.username;
//             console.log("Username:", playerId);

//             const player = await Player.findOne({ dbUsername: playerId })
//             if (!player) {
//                 return res.status(404).json({ message: 'Player not found' });
//             }
//        

//                 const yesterday = new Date();
//                 yesterday.setDate(yesterday.getDate() - 1);
//                 const expiredScores = player.dbScores.filter(score => new Date(score.date) < yesterday);
//                 const activeScores = player.dbScores.filter(score => new Date(score.date) >= yesterday);
//                 player.dbHistory = player.dbHistory.concat(expiredScores);
//                 player.dbScores = activeScores;
//                 await player.save();

//                 const sortedScores = activeScores.sort((a, b) => new Date(b.date) - new Date(a.date));
//                 res.status(200).json({
//                     TotalScore: player.dbTotalScore,
//                     LatestScore: sortedScores.length > 0 ? sortedScores[0] : null,
//                     AllScores: player.dbScores,
//                 })
//                 console.log('Data send to frontend');

//             }          

//         }
//         console.log('Please login');
//         res.status(404).json({message : 'Please Login'})
//     }
//     catch (error) {
//         console.error('Error fetching dashboard data:', error);
//         res.status(500).json({ message: 'Failed to retrieve dashboard data' });
//     }
// });

// playerroute.get('/scorecard', authenticate, async (req, res) => {
//     try {
//         if (!player) {
//             return res.status(404).json({ message: 'Player not found' });
//         }
//         res.status(200).json({ message: 'Player found' });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

playerroute.get('/scorecard', authenticate, async (req, res) => {
    const loginRole = req.userrole;

    try {
        if (loginRole === 'User') {
            const playerId = req.username;

            const player = await Player.findOne({ dbUsername: playerId });

            if (!player) {
                return res.status(404).json({ message: 'Player not found' }); // Ensure return
            }

            const sortedScores = player.dbScores.sort((a, b) => new Date(b.date) - new Date(a.date));
            res.status(200).json({
                TotalScore: player.dbTotalScore,
                LatestScore: sortedScores.length > 0 ? sortedScores[0] : null,
                AllScores: player.dbScores,
            });

        } else {
            res.status(403).json({ message: 'Not authorized' }); // Ensure return
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Failed to retrieve dashboard data' });
        }
    }
});

playerroute.get('/takequiz/:Id', authenticate, async (req, res) => {

    const loginRole = req.userrole;
    try {

        if (loginRole == 'User') {
            const quizId = req.params.Id;
            console.log('Id in req: ', quizId);

            const existingquizSet = await QuestionSet.findOne({ dbquizId: quizId }, 'dbquestions')
            console.log('Existing QuizSet: ', existingquizSet);

            if (existingquizSet) {

                res.status(200).json({ existingquizSet })
            }
            else {
                res.status(404).json({ message: 'No QuizSet found' })
            }
        }
    }
    catch (error) {
        console.log('Error occured while fetching Quiz Set');
    }
})

//Score calculation and DB update:
playerroute.patch('/updatequizscore', authenticate, async (req, res) => {

    const loginRole = req.userrole;
    console.log(loginRole);

    const loginUser = req.username
    console.log(loginUser);

    try {
        if (loginRole == 'User') {

            const { answerSet, quizId } = req.body;
            let totalScore = 0;
            let correctAnswers = 0;
            let incorrectAnswers = 0;

            const questionSet = await QuestionSet.findOne({ dbquizId: quizId });
            console.log("QuestionSet: ", questionSet);

            if (!questionSet) {
                return res.status(404).json({ message: 'Question set not found for this category' });
            }
            else {

                const correctAnswersList = questionSet.dbquestions.map(question => question.answer);
                console.log("Correct answer list: ", correctAnswersList);

                answerSet.forEach((answer, idx) => {
                    // console.log(`Index: ${idx}, Answer: ${answer}`);
                    if (answer == correctAnswersList[idx]) {
                        correctAnswers += 4;  // Correct answer, +4 points

                    } else {
                        incorrectAnswers -= 2;  // Incorrect answer, -2 points

                    }
                });
                totalScore = correctAnswers + incorrectAnswers;
                console.log("Total Score: ", totalScore,);

                // Update Player Schema
                const player = await Player.findOne({ dbUsername: loginUser })
                console.log("Player Dtls: ", player);

                if (!player) {
                    return res.status(404).json({ message: 'Player not found' });
                }
                else {

                    // Add to dbScores
                    player.dbScores.push({
                        quizId: quizId,
                        score: totalScore,
                    });
                    // Update dbTotalScore
                    player.dbTotalScore += totalScore;
                    player.updatedAt = Date.now();
                    await player.save();
                    console.log(`Updated details for ${loginUser}:`, player);
                }
                return res.status(200).json({ Scores: player.dbScores });
            }
        }
        else {
            console.log("Please login");
        }
    }
    catch (error) {
        console.log(error);
    }
})

playerroute.get('/fetchScores/:Id', authenticate, async (req, res) => {

    const loginRole = req.userrole
    console.log(loginRole);

    const loginUser = req.username
    console.log(loginUser);

    try {

        if (loginRole == 'User') {

            const quizId = req.params.Id;
            let latestscore = 0;

            const existingUser = await Player.findOne({ dbUsername: loginUser })
            console.log(existingUser);

            if (existingUser) {

                const scoreValues = existingUser.dbScores;
                console.log('score: ', scoreValues);

                scoreValues.forEach((score) => {
                    if (score.quizId == quizId) {
                        latestscore = score.score;
                    }
                })
                res.status(200).json({ Scores: latestscore })
                console.log('Score shared to front end');
            }
            else {
            }
        }
    }
    catch (error) {
        console.log('Error occurred while fetching score details');
    }
})

playerroute.get('/attemptedquizzes', authenticate, async (req, res) => {

    const loginRole = req.userrole;
    const loginUser = req.username

    try {
        if (loginRole == 'User') {

            const player = await Player.findOne({ dbUsername: loginUser });
            console.log(player);

            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }
            else {

                const attemptedQuizzes = player.dbScores;
                return res.status(200).json(attemptedQuizzes);
            }
        }
        else {
            console.log('Please login');
            res.status(404).json({ message: 'Not authorized User' })
        }

    } catch (error) {
        console.error('Error occurred while fetching details');
    }
});

playerroute.get('/leaderboard', authenticate, async (req, res) => {

    const loginRole = req.userrole;
    // const result = []
    // const 

    try {
        if (loginRole == 'User') {

            const boardData = await Player.find().sort({ dbTotalScore: -1 })
            console.log('boardData', boardData);

            if (boardData) {
                const simplifiedBoardData = boardData.map(player => ({
                    dbUsername: player.dbUsername,
                    dbTotalScore: player.dbTotalScore
                }));
                res.status(200).json({
                    boardData: simplifiedBoardData
                })
                console.log('Data retrieved');
            }
            else {
                res.status(404).json({ message: 'No records' })
                console.log('No Data to be retrieved');
            }
        }
    }
    catch (error) {
        console.log('Error occurred while fetching players data');
    }
})

playerroute.get('/history/:username', authenticate, async (req, res) => {

    const loginRole = req.userrole;

    try {

        if (loginRole == 'User') {

            const username = req.params.username;
            const player = await Player.findOne({ dbUsername: username })
            if (!player) {
                return res.status(404).json({ message: 'Player not found' });
            }
            else {

                const yesterday = moment().subtract(1, 'days').endOf('day').toDate();
                const history = player.dbScores.filter(score =>
                    moment(score.date).isBefore(yesterday)
                );
                console.log('historydata', history);

                const historyData = await Promise.all(history.map(async (score) => {

                    const quizCategory = await QuizCatgry.findById(score.quizId);

                    if (!quizCategory) {
                        return {
                            quizId: score.quizId,
                            attemptedAt: score.date,
                            score: score.score,
                            title: 'Unknown Quiz'
                        };
                    }

                    return {
                        quizId: quizCategory.dbTitle, // Use the dbTitle from QuizCatgry
                        attemptedAt: score.date,
                        score: score.score
                    };
                }));

                console.log('historyData with titles:', historyData);
                res.json({ history: historyData });
            }
        }
        else {
            console.log('Please login');
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching player history' });
    }
});

export { playerroute }