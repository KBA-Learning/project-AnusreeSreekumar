import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'
import checkAuth from '../utils/checkAuth'
import user from '../assets/images/user.png'

const AdminNavbar = () => {

    const [playerName, setPlayerName] = useState('');

    useEffect(() => {
        const fetchPlayerName = async () => {
            const authData = await checkAuth();
            console.log('fetched using protRt: ',authData);
            
            const name = authData.name;
            setPlayerName(name);
        };

        fetchPlayerName();
    }, []);

    return (

        <div className='bg-gray-100 text-purple-950 px-8 py-4 flex justify-between md:grid-cols-2 p-3 shadow-md'>
            <img src={user} alt="User.img" className='w-12 h-12'/>
            <h2 className="font-bold text-2xl text-purple-700">Welcome {playerName}</h2>
            <div className='flex items-center justify-center md:justify-end 
             text-gray-700 font-medium 
             mt-2 md:mt-0 
             space-x-5 md:space-x-10 
             hover:underline'>
                <Link to="/player-dashboard" className='ml-20'>Dashboard</Link>
                {/* <Link to="/courses" className='ml-20'>Courses</Link> */}
                <Link to="/contact" className='ml-20'>Contact Us</Link>
                <Logout />
            </div>
        </div>
    )
}

export default AdminNavbar
