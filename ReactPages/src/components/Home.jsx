import React from "react";
import { Link } from "react-router-dom";
import "../utils/style.css";  // Correct import statement for your CSS

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-green-400 flex items-center justify-center relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-600 to-blue-600 opacity-30 animate-gradient-x"></div>

      {/* Main Content */}
      <div className="z-10 text-center p-10 bg-white rounded-lg shadow-xl transform transition-all hover:scale-105">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-4 animate-fadeIn">Welcome to Trivia Hub</h1>
        <p className="text-xl text-gray-700 mb-6">Your one-stop destination for challenging trivia questions.</p>
        <p className="text-lg text-gray-600 mb-8">Ready to test your knowledge across various subjects?</p>
        
        {/* Interactive Link with Hover Animation */}
        <Link
          to="/authenticate"
          className="px-10 py-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-full transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:translate-y-1"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
