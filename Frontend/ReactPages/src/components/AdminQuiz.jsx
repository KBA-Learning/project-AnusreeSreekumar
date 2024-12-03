import React, { useState, useEffect } from 'react';

function AdminQuiz({ quizId }) {
    const [quizData, setQuizData] = useState([]);

    useEffect(() => {
        fetchQuizData();
    }, []);

    const fetchQuizData = async () => {
        try {
            const response = await fetch(`http://localhost:3000/displayquizset/${quizId}`);
            const data = await response.json();
            setQuizData(data.existingquizSet.dbquestions || []);
        } catch (error) {
            console.error('Error fetching quiz data:', error);
        }
    };

    const handleDelete = async (questionId) => {
        try {
            await fetch(`http://localhost:3000/deleteQuestionset/${questionId}`, {
                method: 'DELETE',
            });
            setQuizData((prev) => prev.filter((q) => q.id !== questionId));
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };

    return (
        <div className="admin-quiz-container">
            <h2>Quiz Management</h2>
            {quizData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Options</th>
                            <th>Answer</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizData.map((question) => (
                            <tr key={question.id}>
                                <td>{question.questionText}</td>
                                <td>{question.options.join(', ')}</td>
                                <td>{question.answer}</td>
                                <td>
                                    <button onClick={() => handleDelete(question.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No questions available.</p>
            )}
        </div>
    );
}

export default AdminQuiz;
