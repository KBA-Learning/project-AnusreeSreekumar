import React from 'react'
import { Link } from 'react-router-dom'
import Logout from './Logout'

const AdminNavbar = () => {
    // console.log('AdminNavbar loaded');
    
    return (

        <div className='bg-purple-100 text-purple-950 grid grid-cols-1 md:grid-cols-2 p-3 shadow-md'>
            <div className='flex justify-end md:mt-0 space-x-5 md:space-x-10'>
                <Link to="/admin-dashboard" className='ml-20'>Dashboard</Link>  
                <Logout />
            </div>
        </div>
    )
}

export default AdminNavbar
