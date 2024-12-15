import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  
  const navigate = useNavigate();
  const handleLogout = async () => {

    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'POST',
        credentials: 'include', // For cookies
      });
      if (response.ok) {
        console.log('Logged out successfully');
        navigate('/')
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }

  }

  return(
    <div>
      <button 
        onClick={handleLogout} 
        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Logout
      </button>
    </div>
  );
};

export default Logout