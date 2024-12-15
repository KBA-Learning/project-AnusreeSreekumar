import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for React Router v6
import checkAuth from '../../utils/checkAuth'

function Authentication() {

    const [activeTab, setActiveTab] = useState('signup'); // State to track active form (sign-up or login)
    const [Username, setUsername] = useState('');
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const navigate = useNavigate();

    // Function to switch between tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab); // Switch between Sign Up and Login
    };

    // Handle Sign Up (for demonstration, you can replace it with actual sign-up logic)
    const handleSignUp = async (e) => {

        e.preventDefault()

        const playerDtls = {
            Username,
            Email,
            Password
        };
        try {
            const response = await fetch('http://localhost:4000/signup_user', {

                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(playerDtls)
            });
            const data = await response.json();

            if (response.status == 200) {

                // Reset input fields after successful signup
                setUsername('');
                setEmail('');
                setPassword('');

                setActiveTab('login');  // Navigate to login tab
                console.log(data)
            }
            else {
                console.log(data);
            }

        } catch (error) {
            console.log('Issue in SignUp', error);
        }

    };

    // Handle Login (for demonstration, you can replace it with actual login logic)
    const handleLogin = async (e) => {

        e.preventDefault()

        const loginDtls = {
            Email,
            Password
        };
        try {

            const response = await fetch('http://localhost:4000/login', {

                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginDtls)
            });
            const data = await response.json();
            console.log('Data from backend: ',data);
            
            if (response.ok) {
                setEmail('');
                setPassword('');
                const authCheck = await checkAuth();
                console.log('chkauth fn data: ',authCheck);
                
                try {
                    if(authCheck.role == 'User'){
                        navigate('/player-dashboard')
                    }
                    else if(authCheck.role == 'admin'){
                        navigate('/admin-dashboard')
                    }
                    
                } catch (err) {
                    console.error('Auth error:', err);
                }
            }
            else {
                console.log('Please check your credentials');
            }

        } catch (error) {
            console.log('Issue in Login', error);

        }
    };

    return (
        <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-emerald-300 via-cyan-100 to-sky-200">
            <div className="bg-lime-100 shadow-md rounded-lg py-8 px-10 w-80 sm:w-96">
                {/* Tab Headers (Sign Up / Login) */}
                <div className="flex justify-around mb-8">
                    <button
                        className={`text-lg font-medium ${activeTab === 'signup' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => handleTabChange('signup')}
                    >
                        Sign Up
                    </button>
                    <button
                        className={`text-lg font-medium ${activeTab === 'login' ? 'border-b-2 border-blue-500' : ''}`}
                        onClick={() => handleTabChange('login')}
                    >
                        Login
                    </button>
                </div>

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                    <form onSubmit={handleSignUp}>
                        <h3 className="text-center text-xl font-semibold mb-4">Create an Account</h3>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={Username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            className="w-56 bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 py-2 ml-8 text-center text-white font-semibold rounded-md hover:opacity-90"
                        >Sign Up
                        </button>
                    </form>
                )}

                {/* Login Form */}
                {activeTab === 'login' && (
                    <form onSubmit={handleLogin}>
                        <h3 className="text-center text-xl font-semibold mb-4">Login to Your Account</h3>
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={Email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={Password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="text-right mb-6">
                            <Link to="/forgot-password" className="text-sm text-blue-500 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            className="w-56 bg-gradient-to-r from-pink-400 via-red-500 to-yellow-500 py-2 ml-8 text-center text-white font-semibold rounded-md hover:opacity-90"
                        >
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Authentication;
