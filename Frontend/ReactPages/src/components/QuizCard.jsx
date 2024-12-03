import React from 'react';
import { Link } from 'react-router-dom';

const QuizCard = ({ quiz, isAdmin }) => {
    return (
        <div
            key={quiz.dbquizId}
            className="bg-gradient-to-r from-teal-100 to-teal-200 hover:bg-gradient-to-br from-teal-300 to-teal-400 px-6 py-8 rounded-xl shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105 flex flex-col items-center justify-between gap-4"
        >
            <Link to={`/questions/${quiz.quizId}`} className="text-2xl font-semibold text-white mb-4 hover:underline">
                {quiz.category}
            </Link>

            <div className="text-yellow-500 text-lg font-medium mb-3">
                <p className="my-2">Difficulty: <span className="font-bold text-white">{quiz.difficulty}</span></p>
                <p className="my-2">Questions: <span className="font-bold text-white">{quiz.questionCount}</span></p>
            </div>

            <div className="mt-auto">
                {!isAdmin && (
                    <Link
                        to={`/takequiz/${quiz.quizId}`}
                        className="px-6 py-2 bg-teal-600 text-white font-semibold text-lg rounded-lg hover:bg-teal-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400">
                        Take this Quiz
                    </Link>
                )}
            </div>
        </div>

    );
};

export default QuizCard;
