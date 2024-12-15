import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home'
import Authentication from './pages/playerPages/Authentication';
import Dashboard from './pages/playerPages/Dashboard'
import AddQuiz from './pages/adminPages/AddQuiz';
import DisplayQuizSet from './pages/adminPages/AdminQuizSet';
import QuizDetailsPage from './pages/adminPages/QuizDetailsPage';
import TakeQuiz from './pages/playerPages/TakeQuiz';
import AuthLayout from './layouts/AuthLayout';
import MainLayout from './layouts/MainLayout';
import AdminQuizTopics from './pages/adminPages/AdminQuizSet';
import Quiz_Result from './pages/playerPages/Quiz_Result'
import LeaderBoard from './pages/playerPages/LeaderBoard';
import PlayerHistory from './pages/playerPages/PlayerHistory'
import NotFound from './components/NotFound'
import AdminNavbar from './components/AdminNavbar';
import AdminDashboard from './components/AdminDashboard';

const App = () => {

  return (

    <Router>
      <Routes>
        {/* Default Route for Player (Homepage) */}
        <Route path='/' element={<Home />} />
        <Route path='/authenticate' element={<Authentication />} />

        {/* Protected Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/admin-dashboard' element={<AdminDashboard />} />
          {/* <Route path='/admin-navbar' element={<AdminNavbar />} /> */}
          <Route path='/addQuiz' element={<AddQuiz />} />
          <Route path='/quizsets' element={<AdminQuizTopics />} />
          <Route path='/questions/:quizId' element={<QuizDetailsPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path='/player-dashboard' element={<Dashboard />} />          
          <Route path='/displayquizset' element={<DisplayQuizSet />} />
          <Route path='/quizdetails/:quizId' element={<QuizDetailsPage />} />
          <Route path='/takequiz/:quizId' element={<TakeQuiz />} />
          <Route path='/fetchScores/:quizId' element={<Quiz_Result />} />
          <Route path='/leader-board' element={<LeaderBoard />} />
          <Route path='/history/:username' element={<PlayerHistory />} />
        </Route>
        <Route path='/not-found' element={<NotFound />} />
      </Routes>

    </Router >
  )
}

export default App
