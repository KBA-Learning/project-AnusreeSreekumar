import { Outlet, Navigate } from 'react-router-dom';
import checkAuth from '../utils/checkAuth';

const AuthLayout = () => {
    const userType = checkAuth(); // Assume this retrieves the authenticated user's role

    if (!userType) {
        return <Navigate to="/authenticate" replace />; // Redirect to login if not authenticated
    }

    if (userType.loginRole !== 'admin') {
        return <Navigate to="/not-found" replace />; // Redirect unauthorized users
    }

    return <Outlet />; // Render the nested route for admin
};

export default AuthLayout;
