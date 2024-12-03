import React, { useState, useEffect } from 'react';
import QuizCard from '../../components/QuizCard';

const AdminQuizTopics = () => {
    const [quizSet, setQuizSet] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch('http://localhost:3000/displayquizset');
                const data = await res.json();
                console.log(data);
                setQuizSet(data);
            } catch (error) {
                console.log('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    if (loading) {
        return <h1 className="text-center mt-10">Loading...</h1>;
    }

    return (
        <div className="quiz-container flex flex-wrap justify-center">
            {quizSet.map((quiz) => (
                <QuizCard key={quiz.dbquizId} quiz={quiz} isAdmin={true} />
            ))}
        </div>
    );
};

export default AdminQuizTopics;
