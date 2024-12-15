import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QuizDetailsPage = () => {
    const [questionSet, setQuestionSet] = useState([]);
    const { quizId } = useParams();
    const navigate = useNavigate();

    // Fetch quiz data from the backend when the page loads
    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/displayquizset/${quizId}`);
                const data = await response.json();
                console.log('Retrieved data: ', data);
                setQuestionSet(data.existingquizSet.dbquestions || []);
            } catch (error) {
                console.log('Error fetching quiz data:', error);
            }
        };

        fetchQuizDetails();
    }, [quizId]);

    // Delete the entire quiz set
    const handleDeleteQuizSet = async () => {
        try {
            const response = await fetch(`http://localhost:4000/deleteQuestionset/${quizId}`, {
                method: 'DELETE',
                credentials:'include'
            });
            if (response.ok) {
                console.log('Quiz set deleted successfully');
                navigate('/displayquizset')
                // Redirect or perform any other necessary actions after deletion
            } else {
                console.log('Failed to delete quiz set');
            }
        } catch (error) {
            console.log('Error deleting quiz set:', error);
        }
    };

    return (
        <div className="bg-purple-200 rounded-md shadow-xl p-6 mx-auto w-full">
            <div className="bg-purple-100 rounded-md shadow-2xl p-6">
                <h2 className="font-bold text-2xl text-purple-900 mb-4">Quiz Details</h2>

                {/* Loop through all the questions and display each one */}
                <div className="mb-6">
                    {questionSet.map((questions) => (
                        <div
                            key={questions._id}  // Unique key for each question
                            className="bg-white rounded-md shadow-lg p-4 mb-6"
                        >
                            {/* Display Question Text */}
                            <p className="font-bold text-lg text-purple-900 mb-4">{questions.questionText}</p>

                            {/* Display Options */}
                            {questions.options.map((option, index) => (
                                <p key={index} className="text-blue-500 font-semibold my-2 mx-5">
                                    {option}
                                </p>
                            ))}

                            {/* Display Answer */}
                            <p className="text-black group-hover:text-white my-2 mx-5">{questions.answer}</p>
                        </div>
                    ))}
                </div>

                {/* Delete Button for the entire quiz set */}
                <button
                    onClick={handleDeleteQuizSet}
                    className="bg-red-500 text-white px-6 py-3 rounded w-full mt-4"
                >
                    Delete Entire Quiz Set
                </button>
            </div>
        </div>
    );
};

export default QuizDetailsPage;
