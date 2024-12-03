import React from 'react'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const response = await fetch('http://localhost:4000/logout',{
            method: 'GET',
            credentials: 'include',
        });
        if(response.status == 200){
          document.cookie = 'Authtoken=; Max-Age=0';
          navigate('/authenticate');
        }   
    };
  return (
    <button onClick={handleLogout} className='text-purple-700 hover:underline'>
        Logout</button>
  )
}

export default Logout