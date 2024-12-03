import React from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import AdminDashboard from '../../components/AdminDashboard'

const AdminHome = () => {
    console.log('AdminHome loaded');
    return (

        <>
            <AdminNavbar />
            <AdminDashboard />
        </>
    )
}

export default AdminHome

