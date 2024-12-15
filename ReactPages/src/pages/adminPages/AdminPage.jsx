import React from 'react';
import AdminQuiz from '../../components/AdminQuiz';

function AdminPage() {
    // const quizId = '123'; // Replace with dynamic quizId if needed

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <AdminQuiz quizId={quizId} />
        </div>
    );
}

export default AdminPage;
