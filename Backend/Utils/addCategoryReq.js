import { QuizCatgry } from "../Models/quizCatgry.js";

const addCatgryData = async (req) => {

    let cnt, CategorySet;
    const {
        CategoryType,
        Title,
        Description,
        numOfQuestions
    } = req

    const existingCatgry = await QuizCatgry.findOne({ dbTitle: Title });

    if (existingCatgry) {

        const latest = existingCatgry.dbCategorySet;
        cnt = parseInt(latest.split('_')[1], 10);
        const updated_count = cnt + 1;
        CategorySet = Title + '_' + updated_count;
    }
    else {
        cnt = 1
        CategorySet = Title + '_' + cnt;
    }

    return {
        CategoryType,
        Title,
        CategorySet,
        Description,
        numOfQuestions
    }

}

export { addCatgryData }
