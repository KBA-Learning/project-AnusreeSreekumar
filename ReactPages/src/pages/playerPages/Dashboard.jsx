import React, { useState, useEffect } from 'react';
import QuizCard from '../../components/QuizCard';
import ScoreCard from '../../components/ScoreCard';
import "../../utils/style.css";

const QuizTopics = () => {
    const [quizSet, setQuizSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalScore, setTotalScore] = useState('');
    const [latestScore, setLatestScore] = useState([]);
    const [attempted, setAttempted] = useState({});

    useEffect(() => {

        const fetchData = async () => {
            try {
                const resScores = await fetch('http://localhost:4000/scorecard', {
                    credentials: 'include',
                });
                const ScoreData = await resScores.json();
                setTotalScore(ScoreData.TotalScore);
                setLatestScore(ScoreData.LatestScore);

                const resQuizset = await fetch('http://localhost:4000/displayquizset');
                const QuizsetData = await resQuizset.json();
                setQuizSet(QuizsetData);
                console.log('QuizSet: ', QuizsetData);


                const resAttempted = await fetch('http://localhost:4000/attemptedquizzes', {
                    credentials: 'include',
                });
                const attemptedData = await resAttempted.json();
                setAttempted(attemptedData);
                console.log('Attempted DAta: ', attemptedData);

            } catch (error) {
                console.log('Error fetching quizData:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <h1 className="text-center mt-10">Loading...</h1>;
    }

    return (
        <div className='grid grid-row-2'>
            <div className="player-dashboard">
                {latestScore ? (
                    <ScoreCard totalScore={totalScore} latestScore={latestScore.score} />
                ) : (
                    <div className="rounded-md shadow-lg flex flex-col items-center justify-center w-[1220px] h-40 my-12 mx-12 px-6 py-4 bg-blue-100">
                        <p className="text-center font-bold mb-8 text-lg text-gray-800">No scores available</p>
                    </div>
                )}
            </div>

            <div className="quiz-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {quizSet.map((quiz) => {
                    const attemptedQuiz = attempted.find(item => item.quizId === quiz.quizId);
                    const isAttempted = attemptedQuiz !== undefined;
                    const score = isAttempted ? attemptedQuiz.score : null;
                    return (
                        <QuizCard
                            key={quiz.dbquizId}
                            quiz={quiz}
                            isAttempted={isAttempted}
                            score={score}
                            isAdmin={false}
                        />
                    );
                })}
            </div>
        </div>
    );
};


export default QuizTopics;
