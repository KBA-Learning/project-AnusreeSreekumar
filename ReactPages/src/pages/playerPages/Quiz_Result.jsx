import React, { useState,useEffect } from 'react'
import { Link, useParams } from 'react-router-dom';
// import "../../utils/style.css";

const Quiz_Result = () => {

    const [finalScore, setFinalScore] = useState(0);
    const [message, setMessage] = useState('');
    const { quizId } = useParams();
    const [messageColor, setMessageColor] = useState('');

    useEffect(() => {

        const fetchScore = async () => {
            let msg;
            try {
                const response = await fetch(`http://localhost:4000/fetchScores/${quizId}`, {
                    credentials: 'include'
                });
                const scoreData = await response.json();
                setFinalScore(scoreData.Scores)
                console.log(scoreData.Scores);
                if(scoreData.Scores <= 10){
                    msg = 'Oops!! Better Luck next Time!!!';
                    setMessage(msg)
                    setMessageColor('text-red-400')
                }
                else{
                    msg = 'Congratulations!';
                    setMessage(msg)
                    setMessageColor('text-green-400')
                }
            }
            catch (error) {
                console.log('Error fetching score data:', error);
            }
        }
        fetchScore();
    }, [quizId]);

    return(
        <div className="text-center p-8 rounded-lg bg-slate-200 shadow-lg w-96 mx-auto mt-[150px]">
            <h1 className={`text-4xl font-bold ${messageColor} mb-4`}>{message}</h1>
            <h2 className="text-2xl font-medium text-gray-700">Your Score: {finalScore}</h2>
            <Link to="/player-dashboard" className="block mt-6 ml-[60px] w-48 bg-blue-400 text-white py-2 px-4 rounded hover:bg-blue-600">Go to Dashboard</Link>
        </div>
    );
};

export default Quiz_Result
