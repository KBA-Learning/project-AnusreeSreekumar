import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

const TakeQuiz = () => {

    const [questionSet, setQuestionSet] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState([]);
    // const [score, setScore] = useState(0);
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(60);
    const [quizCompleted, setQuizCompleted] = useState(false);

    // Fetch quiz data from the backend when the page loads
    useEffect(() => {
        const fetchQuizDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/takequiz/${quizId}`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const data = await response.json();
                console.log('Retrieved data: ', data);
                setQuestionSet(data.existingquizSet.dbquestions || []);
            } catch (error) {
                console.log('Error fetching quiz data:', error);
            }
        };
        fetchQuizDetails();
    }, [quizId]);

    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit(); // Automatically submit when time runs out
        } else {
            const timerId = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timerId); // Cleanup on component unmount or when time reaches 0
        }
    }, [timeLeft]);

    // Handle option selection
    const handleOptionChange = (questionIndex, selectedOption) => {
        const newSelectedOptions = [...selectedOptions];
        newSelectedOptions[questionIndex] = selectedOption;
        setSelectedOptions(newSelectedOptions);
    };

    // Handle next question
    const handleNext = () => {
        if (currentQuestionIndex < questionSet.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            setQuizCompleted(true); // Show submit after the last question
        }
    };

    // Handle previous question
    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    // Handle quiz submission
    const handleSubmit = async () => {

        const answerSet = selectedOptions;
        console.log('answerSet',answerSet);
        
        const calcScoreData = {
            answerSet,
            quizId
        }

        try {
            const response = await fetch('http://localhost:4000/updatequizscore', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(calcScoreData)
            })
            const result = await response.json();
            console.log('Score updated in the database: ', result);
            navigate(`/fetchScores/${quizId}`)
            setQuizCompleted(true); // Show result on completion
        }
        catch (error) {
            console.log('Error updating score in database:', error);
        }
    };

    if (questionSet.length === 0) return <div>Loading...</div>;
      const currentQuestion = questionSet[currentQuestionIndex];

    return (
        <div className="quiz-container w-96 h-auto bg-gray-200 mt-[150px] ml-[500px] drop-shadow-xl">
            <div className="question-card">
                {/* Timer Display */}
                <div className="timer mt-4 mb-4 text-2xl font-medium">
                    <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
                </div>

                <h2 className='mb-8 p-4 text-4xl font-medium'>{currentQuestion.questionText}</h2>
                <div className="options p-4">
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} className='space-x-4 ml-16 mb-4'>
                            <input
                                type="radio"
                                id={`option-${index}`}
                                name={`question-${currentQuestionIndex}`}
                                value={option}
                                checked={selectedOptions[currentQuestionIndex] === option}
                                onChange={() => handleOptionChange(currentQuestionIndex, option)}
                            />
                            <label htmlFor={`option-${index}`}>{option}</label>
                        </div>
                    ))}
                </div>
                <div className="navigation-buttons space-x-8 ml-16 pb-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className='w-24 h-auto bg-cyan-400 rounded-md hover:text-white'
                    >
                        Previous
                    </button>
                    {quizCompleted ? (
                        <button onClick={handleSubmit} className='w-20 h-auto bg-cyan-400 rounded-md hover:text-white'>
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={selectedOptions[currentQuestionIndex] == null}
                            className='w-20 h-auto bg-cyan-400 rounded-md hover:text-white'
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TakeQuiz
