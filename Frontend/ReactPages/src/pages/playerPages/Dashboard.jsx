import React, { useState, useEffect } from 'react';
import QuizCard from '../../components/QuizCard';
import ScoreCard from '../../components/ScoreCard';
import "../../utils/style.css";

const QuizTopics = () => {
    const [quizSet, setQuizSet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalScore, setTotalScore] = useState('');
    const [latestScore, setLatestScore] = useState([]);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const resScores = await fetch('http://localhost:4000/scorecard', {
                    credentials: 'include',
                });
                const ScoreData = await resScores.json();
                // console.log('ScoreData: ', ScoreData);

                setTotalScore(ScoreData.TotalScore);
                setLatestScore(ScoreData.LatestScore);
                // console.log('scorevalue alone: ', ScoreData.Score);


                const resQuizset = await fetch('http://localhost:4000/displayquizset');
                const QuizsetData = await resQuizset.json();
                console.log('from backend: ', QuizsetData);
                setQuizSet(QuizsetData);
            } catch (error) {
                console.log('Error fetching courses:', error);
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
                    <p>No scores available</p>
                )}
            </div>

            <div className="quiz-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {quizSet.map((quiz) => (
                    <QuizCard key={quiz.dbquizId} quiz={quiz} isAdmin={false} />
                ))}
            </div>

        </div>

    );
};

export default QuizTopics;
