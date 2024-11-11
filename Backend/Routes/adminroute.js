import { Router } from "express";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

import { QuizCatgry } from "../Models/quizCatgry.js";
import { QuestionSet } from "../Models/questionSet.js";
import { authenticate } from "../Middleware/auth.js";
import { Player } from "../Models/playerSet.js";
import { quizEventEmitter } from "../quizEvents.js";

dotenv.config();
const adminroute = Router();
const SecretKey = process.env.secretKey

//User schema
const adminSchema = new mongoose.Schema({
    dbUsername: String,
    dbEmail: { type: String, unique: true },
    dbPassword: String,
    dbRole: String
})

const Admin = mongoose.model('admindetails', adminSchema)

mongoose.connect('mongodb://localhost:27017/TriviaHub')

adminroute.get('/', (req, res) => {

    res.send("Hello World")
});

//Admin Signup
adminroute.post('/signup_admin', async (req, res) => {

    try {

        const data = req.body;
        const { Username,
            Email,
            Password
        } = data
        // console.log("Req data:",data);

        const Role = "Admin"
        const newP = await bcrypt.hash(Password, 10);
        const existingUser = await Admin.findOne({ dbEmail: Email })

        if (existingUser) {

            res.status(404).json({ message: "Admin exists in DB" })
            console.log("Admin details already present");
        }
        else {

            const newAdmin = new Admin({
                dbUsername: Username,
                dbEmail: Email,
                dbPassword: newP,
                dbRole: Role
            })
            await newAdmin.save();
            res.status(200).json({ message: "Admin entry created" });
            console.log("Admin details added to DB");
        }
    }
    catch (error) {
        console.log(error);
    }

})

//Admin Login
adminroute.post('/login_admin', async (req, res) => {

    try {

        const { Email, Password } = req.body

        const result = await Admin.findOne({ dbEmail: Email })
        if (result) {

            const isvalid = await bcrypt.compare(Password, result.dbPassword)
            if (isvalid) {
                const token = jwt.sign(
                    { username: result.dbEmail, userrole: result.dbRole },
                    SecretKey,
                    { expiresIn: '1h' }
                )
                res.cookie('AuthToken', token, {
                    httpOnly: true
                })
                res.status(200).json({ message: "Success" })
                console.log("Login successfull");
            }
            else {
                res.status(404).json({ message: "Incorrect credentials" })
                console.log("Please check your credentials");
            }
        }
        else {
            res.status(404).json({ message: "New Admin User" })
            console.log("Please register as Admin");
        }
    }
    catch (error) {
        res.status(404).json(error)
        console.log(error);
    }
})

//Admin Dashboard - Add Quiz topic
adminroute.post('/addquiztopic', authenticate, async (req, res) => {

    const loginRole = req.UserRole;
    try {

        if (loginRole == 'Admin') {
            const {
                CategoryType,
                CategorySet,
                Description,
                numOfQuestions
            } = req.body

            const Title = CategoryType + '-' + CategorySet;
            console.log(Title);

            const existingCatgry = await QuizCatgry.findOne({ dbTitle: Title });

            if (existingCatgry) {
                res.status(404).json({ message: 'Existing Quiz category' });
                console.log("Quiz category present");
            }
            // Create a new quiz category document
            else {

                const newQuizCatgry = new QuizCatgry({
                    dbCategoryType: CategoryType,
                    dbCategorySet: CategorySet,
                    dbTitle: Title,
                    dbDescription: Description,
                    dbNumOfQuestions: numOfQuestions, // Store the number of questions if needed
                    dbQuestions: [] // Set dbquestions array to null initially
                    // createdAt will be set automatically   
                });
                const savedQuizCatgry = await newQuizCatgry.save()
                res.status(201).json({
                    message: 'Quiz category added successfully!',
                    quizCatgryId: savedQuizCatgry._id // Access the automatically generated _id
                });
                console.log(savedQuizCatgry);
            }
            const isCollectionEmpty = await QuizCatgry.countDocuments();
            console.log("Size of QuizCatg collection", isCollectionEmpty);
            if (isCollectionEmpty == 0) {
                await QuizCatgry.collection.drop();
                console.log("The QuizCatgry collection was empty and has been deleted.");
            } else {
                console.log("The QuizCatgry collection is not empty.");
            }
        }
        else {
            console.log("Admin access only");
        }
    }
    catch (error) {
        console.log(error);
    }
})

//Add questions
adminroute.post('/addquestionset/:categoryId', authenticate, async (req, res) => {

    const loginRole = req.UserRole;
    try {

        if (loginRole == 'Admin') {

            const { categoryId } = req.params;
            console.log(categoryId);

            const { category, questions } = req.body; // Destructure the input fields from the request body

            const existingCatgry = await QuizCatgry.findById(categoryId);
            // console.log(existingCatgry);
            const existingQuestion = await QuestionSet.findOne({ dbquizId: categoryId });
            // console.log(existingQuestion);


            if (!existingCatgry) {
                return res.status(404).json({ message: 'Quiz category not found' });
            }
            else {
                if (existingQuestion) {
                    res.status(404).json({ message: 'Duplicate Question set' });
                    console.log("Question set available");
                }
                else {
                    // Create a new question set document
                    const newQuestionSet = new QuestionSet({ //QuestionSet
                        dbquizId: categoryId,
                        dbcategory: category,
                        dbquestions: questions
                        // createdAt will be set automatically
                    });
                    // Save the new question set to the database
                    const savedQuestionSet = await newQuestionSet.save();
                    existingCatgry.dbQuestions.push(savedQuestionSet._id);
                    await existingCatgry.save();
                    res.status(201).json({
                        message: 'Question set added successfully!',
                        questionSetId: savedQuestionSet._id // Return the ID of the created question set
                    });
                }
            }
            const isCollectionEmpty = await QuestionSet.countDocuments();
            console.log("Size of QuizSet collection", isCollectionEmpty);
            if (isCollectionEmpty == 0) {
                await QuestionSet.collection.drop();
                console.log("The QuizSet collection was empty and has been deleted.");
            } else {
                console.log("The QuizSet collection is not empty.");
            }
        }
        else {
            console.log("Admin access only");
        }
    }
    catch (error) {
        console.log(error);
    }
})

//Score Updation

quizEventEmitter.on('quizCompleted', async (data, callback) => {

    console.log("Event received in admin:", data);
    const { playerId, categoryId, score } = data;

    console.log(`Updating score for Player ID: ${playerId} in Category ID: ${categoryId} with Score: ${score}`);

    try {

        const player = await Player.findOne({ dbUsername: playerId });
        console.log("Player", player);

        if (!player) {
            console.log('Player not found');
        }
        else {

            player.dbQuizHistory.push({
                categoryId: categoryId,
                score: score,
                date: new Date()
            });
            player.dbScores.push({
                quizId: categoryId,
                score: score,
                date: new Date()
            });
            player.dbTotalScore = (player.dbTotalScore || 0) + score;
            await player.save();
            console.log('Player score and history updated successfully in admin route!');
            callback(null, 'Admin update successful');
        }
    }
    catch (error) {
        console.error('Error updating player data in admin:', error);
        callback(error);
    }
})

//Delete QuestionSet
adminroute.delete('/deleteQuestionset/:ObjectId', authenticate, async (req, res) => {

    const loginRole = req.UserRole;
    try {
        if (loginRole == 'Admin') {
            const { ObjectId } = req.params;
            console.log("DB Objid: ", ObjectId);

            const existingQuestion = await QuestionSet.findOne({ _id: ObjectId })
            console.log("Existing Questions:",existingQuestion);
            // console.log(existingQuestion.dbquizId);
            const existingCatgry = await QuizCatgry.findOne({_id:existingQuestion.dbquizId})
            // console.log("Existing QuizCatg:",existingCatgry);
            console.log("Question exist:",existingCatgry.dbQuestions[0]);
            
            if (existingQuestion) {

                await QuestionSet.deleteOne({ _id: ObjectId })
                res.status(200).json({ message: "Questions Deleted" });
                console.log("Questions Deleted");
                // await QuizCatgry.findByIdAndDelete(existingCatgry.dbQuestions[0]);
                // console.log("Quiz category Deleted");
            }
            else {

                res.status(404).json({ message: "No Questionset Found" });
            }
        }
        else {
            console.log("Admin access only");

        }
    }
    catch (error) {
        console.log(error);
    }
})


export { adminroute }