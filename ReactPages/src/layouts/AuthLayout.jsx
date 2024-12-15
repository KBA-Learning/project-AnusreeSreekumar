import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import checkAuth from '../utils/checkAuth'; // Adjust the path accordingly
import AdminNavbar from '../components/AdminNavbar';

const AuthLayout = () => {
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect to fetch userType when the component mounts
    useEffect(() => {
        const fetchUserType = async () => {
            const result = await checkAuth();
            setUserType(result);
            setLoading(false);
        };

        fetchUserType();
    }, []);  // Empty dependency array ensures it runs once

    if (loading) {
        return <div>Loading...</div>;
    }

    // Conditional rendering based on userType
    if (userType == null) {
        return <Navigate to="/not-found" replace />;  // Redirect if no userType (unauthenticated)
    }

    return (
    <div >
        <AdminNavbar />
        <Outlet /> 
    </div>
    
    ) // Render the child routes if authenticated
};

export default AuthLayout;

