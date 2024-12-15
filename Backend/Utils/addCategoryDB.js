import { addCatgryData } from "./addCategoryReq.js";
import { QuizCatgry } from "../Models/quizCatgry.js";

const addCatgryDb = async (req) => {

    const { CategoryType, Title, CategorySet, Description, numOfQuestions } = addCatgryData(req);

    const newQuizCatgry = new QuizCatgry({
        dbCategoryType: CategoryType,
        dbCategorySet: CategorySet,
        dbTitle: Title,
        dbDescription: Description,
        dbNumOfQuestions: numOfQuestions,
        dbQuestions: []  // Initially empty
    });
    const savedQuizCatgry = await newQuizCatgry.save();
    return savedQuizCatgry, CategorySet;
}

export { addCatgryDb }