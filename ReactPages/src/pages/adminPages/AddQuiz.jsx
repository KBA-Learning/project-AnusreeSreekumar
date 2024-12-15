import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';

const AddQuiz = () => {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {

      try {

        const response = await fetch('http://localhost:4000/getcategories',{
          credentials: 'include'
        }); // Replace with correct endpoint
        const data = await response.json();
        console.log('Fetched data:', data);
        setCategories(data.categories || []); // Ensure categories is always an array
      }
      catch (error) {
        console.error('Error fetching quiz categories:', error);
        setCategories([]); // Fallback to empty array
      }
    };

    fetchCategories();
  }, []);

  // Handle file input change
  const handleFileChange = (e) => {
   
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsedData = JSON.parse(reader.result);
          console.log('Data in File', parsedData);

          // Assuming parsedData has questions, options, and answers
          if (Array.isArray(parsedData.questions) && parsedData.questions.length > 0) {
            setQuestions(parsedData.questions); // Set questions state if valid
          } else {
            setQuestions([]); // If no questions are found, set an empty array
          }
          setDifficulty(parsedData.difficulty || '');
          setIsFileUploaded(true);
        } catch (error) {
          console.log('Error parsing the JSON file:', error);
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file.');
    }
  };

  // Handle question change for the editable fields
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
    console.log(updatedQuestions);
    
  };

  // Handle the submit action
  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizDetails = {
      category: selectedCategory,
      questions: questions,
      difficulty: difficulty,
    };

    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/addquestionset/${selectedCategory}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quizDetails),
      });

      const result = await response.json();

      if (response.ok) {
        // Navigate to the quizsets page after successful submission
        navigate('/displayquizset');
      } else {
        console.error('Error adding quiz:', result.message);
      }
    } catch (error) {
      console.error('Failed to add quiz:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center">
      {/* <div className='bg-lime-100 shadow-md rounded-lg py-8 px-10 max-w-7xl sm:w-96'> */}
      <h2 className="form-title text-center mb-6 font-bold text-2xl text-purple-600 mt-8">Add Quiz</h2>
      <form onSubmit={handleSubmit}>

        {/* File Upload for JSON */}
        <div>
          <label htmlFor="jsonFile">Upload JSON File:</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="file-input mb-4 ml-4"
          />
        </div>

        {isFileUploaded && (
          <>
            {/* Category Selection */}
            <div>
              <label htmlFor="category">Select Category:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select mb-4 ml-4 w-64 h-10"
              >
                <option value="">-- Select a Category --</option>
                {Array.isArray(categories) && categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.dbTitle}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label htmlFor="difficulty">Difficulty Level:</label>
              <input
                type="text"
                id="difficulty"
                value={difficulty}
                readOnly // Automatically filled
                className="ml-4"
              />
            </div>

            {/* Questions */}
            <h3 className="questions-title text-center mr-10 font-semibold my-4">Questions</h3>
            {questions.map((question, index) => (
              <div key={index} className="question">
                <label>Question {index + 1}:</label>
                <input
                  type="text"
                  value={question.questionText || ''}
                  onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
                  className="question-input border ml-2 h-10 w-[550px] mb-4"
                />
                <div className="options">
                  <label>Options:</label>
                  {Array.isArray(question.options) && question.options.map((option, optionIndex) => (
                    <input
                      key={optionIndex}
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option || ''}
                      onChange={(e) =>
                        handleQuestionChange(index, "options", [
                          ...question.options.slice(0, optionIndex),
                          e.target.value,
                          ...question.options.slice(optionIndex + 1),
                        ])
                      }
                      className="option-input border w-auto p-2 h-8 mb-4 ml-4"
                    />
                  ))}
                </div>
                <label>Correct Answer</label>
                <input
                  type="text"
                  placeholder="Correct Answer:"
                  value={question.answer || ''}
                  onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                  className="answer-input border w-fit h-6 mb-4 ml-4"
                />
              </div>
            ))}

            <button type="submit" disabled={isLoading} className=" mt-6 submit-btn w-20 h-8 rounded-md bg-gray-400 hover:bg-gray-300">
              {isLoading ? 'Adding...' : 'Submit'}
            </button>

          </>
        )}

      </form>
      {/* </div> */}
    </div>
  );
};

export default AddQuiz;
