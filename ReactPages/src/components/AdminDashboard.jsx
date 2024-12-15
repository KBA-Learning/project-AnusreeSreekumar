import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {

  const [CategoryType, setCategoryType] = useState('');
  const [Title, setTitle] = useState('');
  const [Description, setDescription] = useState('');
  const [numOfQuestions, setnumOfQuestions] = useState('');

  const navigate = useNavigate();

  const addQuizCategory = async (e) => {
    try {
      e.preventDefault();
      const newCategory = {

        CategoryType,
        Title,
        Description,
        numOfQuestions
      }
      const res = await fetch('http://localhost:4000/addcategories', {

        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      if (res.status == 201) {
        navigate('/addQuiz');
      }
      else {
        console.log('Failed to add quiz category');
      }
    }
    catch (error) {
      console.log('Error adding quiz category');
    }
  };

  return (
    <>
      {/* <AdminDashboard /> */}
      <h1 className='text-center mt-8 font-semibold text-4xl text-green-800'>Admin Dashboard</h1>
      <div className="container mt-8 ml-8 w-screen py-2 flex flex-row gap-10">
        <div className="bg-purple-100 px-6 py-8 mb-4 shadow-md rounded-md border">

          <form onSubmit={addQuizCategory}>
            <h2 className="text-3xl text-purple-800 text-center font-semibold mb-6">
              Add Quiz Category
            </h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Category Type
              </label>
              <input
                type="text"
                id="CategoryType"
                name="CategoryType"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={CategoryType}
                onChange={(e) => setCategoryType(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                id="Title"
                name="Title"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={Title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <input
                type="text"
                id="Description"
                name="Description"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Number of Questions
              </label>
              <input
                type="text"
                id="numOfQuestions"
                name="numOfQuestions"
                className="border rounded w-full py-2 px-3 mb-2"
                required
                value={numOfQuestions}
                onChange={(e) => setnumOfQuestions(e.target.value)}
              />
            </div>
            <div>
              <button
                className="bg-purple-500 hover:bg-purple-600 my-10  text-white font-bold py-2 px-4 rounded-full w-auto focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="bg-purple-100 w-80 h-36 shadow-md rounded-md border">
          <h3 className='text-xl p-2 text-purple-800 text-center font-semibold mb-6'>Navigate to existing Quiz Topics</h3>
          <Link to='/displayquizset' className='bg-blue-400 ml-28 rounded-md text-white'>Quiz Topics</Link>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
