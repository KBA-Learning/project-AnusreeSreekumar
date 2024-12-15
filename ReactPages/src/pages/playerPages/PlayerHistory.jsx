import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PlayerHistory = ({ playerId }) => {
    const [history, setHistory] = useState([]);
    const { username } = useParams()

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/history/${username}`, {
                    credentials: 'include'
                });
                const fetchedData = await response.json();
                console.log("Fetched Data:", fetchedData);

                // Handle response data structure
                if (fetchedData && fetchedData.history) {
                    setHistory(fetchedData.history);
                } else {
                    setHistory([]); // Fallback for empty data
                }
            } catch (error) {
                console.error("Error fetching history data:", error);
                setHistory([]); // Handle fetch failure
            }
        };

        fetchHistoryData();
    }, [username]);

    return (
        <div className="history-container">
            <h2 className="text-2xl font-bold text-center text-blue-600 mt-12">Quiz History</h2>
            <table className="min-w-[1220px] border-collapse mx-10 my-10 shadow-md">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Quiz ID</th>
                        <th className="border px-4 py-2">Attempted At</th>
                        <th className="border px-4 py-2">Score</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length > 0 ? (
                        history.map((quiz, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2 text-center">{quiz.quizId}</td>
                                <td className="border px-4 py-2 text-center">{new Date(quiz.attemptedAt).toLocaleDateString()}</td>
                                <td className="border px-4 py-2 text-center">{quiz.score}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="border px-4 py-2 text-center">No quizzes attempted yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PlayerHistory;
