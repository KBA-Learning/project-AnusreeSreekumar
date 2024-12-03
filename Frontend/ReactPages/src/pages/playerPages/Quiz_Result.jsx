import React, { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
import "../../utils/style.css";

const Quiz_Result = () => {

    const [finalScore, setFinalScore] = useState(0);
    const [message, setMessage] = useState('Congratulations!');
    const { quizId } = useParams();

    useEffect(() => {

        const fetchScore = async () => {

            try {
                const response = await fetch(`http://localhost:4000/fetchScores/${quizId}`, {
                    credentials: 'include'
                });
                const scoreData = await response.json();
                setFinalScore(scoreData.Scores)
                console.log(scoreData.Scores);
                // if()
            }
            catch (error) {
                console.log('Error fetching score data:', error);
            }
        }
        fetchScore();
    }, [quizId]);

    return(
        <div className="result-container">
            <h1>{message}</h1>
            <h2>Your Score: {finalScore}</h2>
            <Link to="/player-dashboard">Go to Dashboard</Link>
        </div>
    );
};

export default Quiz_Result
